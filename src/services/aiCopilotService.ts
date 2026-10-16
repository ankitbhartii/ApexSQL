/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SqlProblem, DiffReport, Dialect } from '../types';

export interface AIDebugAnalysis {
  errorType: 'compile_error' | 'wrong';
  conceptTitle: string;
  rootCause: string;
  clauseCulprit?: string;
  progressiveHints: string[];
  syntaxPattern: string;
  fixChecklist: string[];
  explanationConfidence?: number;
}

export interface SargableInsight {
  originalClause: string;
  optimizedClause: string;
  explanation: string;
  isSargable: boolean;
}

export interface RecommendedIndex {
  tableName: string;
  indexName: string;
  columns: string[];
  ddl: string;
  rationale: string;
  type: 'B-Tree' | 'Composite' | 'Covering';
}

export interface QueryOptimizationAnalysis {
  summary: string;
  estimatedCostSavings: string;
  sargableInsights: SargableInsight[];
  materializationTips: string[];
  recommendedIndexes: RecommendedIndex[];
  optimizedSql: string;
  executionPlanComparison: {
    before: string[];
    after: string[];
  };
}

// ============================================================================
// 1. DETERMINISTIC AST & HEURISTIC ENGINE (OFFLINE & INSTANT FALLBACK)
// ============================================================================

export function analyzeErrorDeterministically(
  sqlCode: string,
  problem: SqlProblem,
  errorType: 'compile_error' | 'wrong',
  errorMessage?: string,
  diffReport?: DiffReport
): AIDebugAnalysis {
  const cleanSql = sqlCode.trim();
  const upper = cleanSql.toUpperCase();
  const lower = cleanSql.toLowerCase();

  // 1. Case: Aggregate function used inside WHERE clause
  const aggInWhereRegex = /WHERE\s+[^;]*?\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i;
  if (aggInWhereRegex.test(sqlCode)) {
    const match = sqlCode.match(aggInWhereRegex);
    return {
      errorType,
      conceptTitle: 'WHERE vs. HAVING Filtering Phase Discrepancy',
      rootCause:
        'You applied an aggregate function inside the WHERE clause. In the relational query lifecycle, the WHERE clause evaluates individual rows before any aggregation takes place, while HAVING filters aggregated metric buckets after GROUP BY.',
      clauseCulprit: match ? match[0] : 'WHERE COUNT(...)',
      progressiveHints: [
        'Notice where your aggregate expression (e.g. COUNT, SUM, AVG) is positioned in the query pipeline.',
        'Remember that WHERE filters input base rows. Which clause is designed to filter groups after GROUP BY?',
        'Move the aggregate threshold comparison to a HAVING clause placed immediately after your GROUP BY clause.',
      ],
      syntaxPattern:
        'SELECT category, COUNT(*)\nFROM table_name\nWHERE status = \'ACTIVE\'   -- Row-level predicate\nGROUP BY category\nHAVING COUNT(*) > 5;     -- Aggregate-level predicate',
      fixChecklist: [
        'Keep non-aggregated column filters in the WHERE clause.',
        'Ensure GROUP BY is specified before attempting aggregate filtering.',
        'Relocate aggregate metric predicates (e.g., COUNT(*) > X) into HAVING.',
      ],
      explanationConfidence: 96,
    };
  }

  // 2. Case: Missing GROUP BY when mixing scalar columns with aggregates
  const hasAggInSelect = /\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(sqlCode);
  const hasGroupBy = /\bGROUP\s+BY\b/i.test(sqlCode);
  const selectClauseMatch = cleanSql.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
  const hasMultipleSelectCols = selectClauseMatch && selectClauseMatch[1].includes(',');

  if (hasAggInSelect && !hasGroupBy && hasMultipleSelectCols) {
    return {
      errorType,
      conceptTitle: 'Aggregated Projection Without Dimensional GROUP BY',
      rootCause:
        'Your SELECT statement projects both individual row-level dimensions and scalar aggregate functions without a GROUP BY clause, causing AlaSQL / relational engines to collapse rows into an ambiguous single-record grain.',
      clauseCulprit: selectClauseMatch ? selectClauseMatch[0] : 'SELECT ... FROM',
      progressiveHints: [
        'Check your SELECT projection: you are requesting individual entity columns alongside an aggregate summary metric.',
        'How should the database group the individual entities together to calculate the aggregate value for each?',
        'Add a GROUP BY clause listing every non-aggregated column present in your SELECT list.',
      ],
      syntaxPattern:
        'SELECT dimension_col, COUNT(*)\nFROM dataset\nGROUP BY dimension_col; -- Must group by every non-aggregated projection',
      fixChecklist: [
        'Inspect all columns listed between SELECT and FROM.',
        'Identify which columns are not wrapped in an aggregate function (COUNT, SUM, AVG, etc.).',
        'Append GROUP BY with those non-aggregated dimensions.',
      ],
      explanationConfidence: 94,
    };
  }

  // 3. Case: INNER JOIN excluding unmatched records (Needs LEFT JOIN)
  if (
    upper.includes('JOIN') &&
    !upper.includes('LEFT JOIN') &&
    !upper.includes('FULL') &&
    (problem.businessScenario.toLowerCase().includes('all') ||
      problem.requirements.some((r) => r.toLowerCase().includes('null') || r.toLowerCase().includes('zero') || r.toLowerCase().includes('even if no')))
  ) {
    return {
      errorType,
      conceptTitle: 'Preserving Unmatched Records: INNER JOIN vs. LEFT JOIN',
      rootCause:
        'Your query uses an INNER JOIN, which discards records from the primary table that lack matching records in the joined table. The requirement asks to preserve all primary entities even when secondary records are absent or NULL.',
      clauseCulprit: 'INNER JOIN / JOIN',
      progressiveHints: [
        'Look closely at how many rows your query returned versus how many were expected.',
        'Consider whether entities without matching transactions or relationships should still appear in the final output.',
        'Switch to a LEFT JOIN and use COALESCE or IFNULL to supply default zero/null values for unmatched rows.',
      ],
      syntaxPattern:
        'SELECT p.id, COALESCE(COUNT(s.id), 0) AS count\nFROM primary_table p\nLEFT JOIN secondary_table s ON p.id = s.primary_id\nGROUP BY p.id;',
      fixChecklist: [
        'Change INNER JOIN to LEFT OUTER JOIN on the master table.',
        'Check if unmatched columns produce NULL and need COALESCE(col, 0) or COALESCE(col, \'None\').',
      ],
      explanationConfidence: 92,
    };
  }

  // 4. Case: Window Function missing PARTITION BY or ORDER BY
  if (upper.includes('OVER') && (upper.includes('RANK') || upper.includes('ROW_NUMBER') || upper.includes('DENSE_RANK') || upper.includes('LAG') || upper.includes('LEAD'))) {
    const overClause = cleanSql.match(/OVER\s*\(([^)]*)\)/i);
    if (!overClause || !overClause[1].toUpperCase().includes('ORDER BY')) {
      return {
        errorType,
        conceptTitle: 'Ranking Frame Without Explicit Ordering',
        rootCause:
          'A ranking or offset window function (e.g. DENSE_RANK, ROW_NUMBER, LAG, LEAD) was invoked without an explicit ORDER BY clause inside the OVER (...) frame, leading to non-deterministic or constant tier outputs.',
        clauseCulprit: overClause ? overClause[0] : 'OVER ()',
        progressiveHints: [
          'Review your window specification inside OVER (...).',
          'Ranking functions need to know which metric determines position (highest to lowest, or lowest to highest).',
          'Add ORDER BY <metric_column> DESC or ASC inside the parentheses of your OVER clause.',
        ],
        syntaxPattern:
          'SELECT emp_id, department,\n       DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank\nFROM employees;',
        fixChecklist: [
          'Verify if ranking should restart per department/category (add PARTITION BY).',
          'Specify ORDER BY inside OVER (...) with the appropriate sort direction (DESC/ASC).',
        ],
        explanationConfidence: 95,
      };
    }
  }

  // 5. Case: Column Name / Alias Discrepancy
  if (diffReport && diffReport.missingColumns && diffReport.missingColumns.length > 0) {
    const missing = diffReport.missingColumns.join(', ');
    const extra = diffReport.extraColumns?.join(', ') || 'none';
    return {
      errorType,
      conceptTitle: 'Schema Projection & Output Column Alias Mismatch',
      rootCause: `Your query executed, but the resulting dataset column headers do not match the expected specification. Missing expected columns: [${missing}]. Your output provided: [${extra}].`,
      clauseCulprit: selectClauseMatch ? selectClauseMatch[1] : 'SELECT ...',
      progressiveHints: [
        `Double-check the exact output column names specified in the problem requirements.`,
        `SQL test validators perform strict column header matching. Are you using the expected AS <alias> names?`,
        `Rename your projected columns to match the target schema: [${missing}].`,
      ],
      syntaxPattern:
        'SELECT original_col AS target_column_name,\n       calculated_val AS expected_metric_alias\nFROM dataset;',
      fixChecklist: [
        `Ensure aliases match case and spelling: ${missing}.`,
        'Check for typos or pluralization differences in column names.',
        'Remove any extraneous temporary debug columns from your final SELECT list.',
      ],
      explanationConfidence: 98,
    };
  }

  // 6. Case: Row Count Discrepancy (e.g., Duplicates or Missing Filter)
  if (diffReport && diffReport.userRowCount !== diffReport.expectedRowCount) {
    const isMore = diffReport.userRowCount > diffReport.expectedRowCount;
    return {
      errorType,
      conceptTitle: isMore ? 'Row Multiplicity & Potential Duplicate Grain' : 'Over-Filtering or Restrictive Predicate',
      rootCause: isMore
        ? `Your query returned ${diffReport.userRowCount} rows, but ${diffReport.expectedRowCount} rows were expected. This frequently occurs when a multi-table join produces a Cartesian fan-out, or when duplicate entities require DISTINCT or GROUP BY.`
        : `Your query returned ${diffReport.userRowCount} rows, whereas ${diffReport.expectedRowCount} rows were expected. One or more WHERE/HAVING filters may be overly restrictive or excluding valid edge-case records.`,
      clauseCulprit: isMore ? 'FROM ... JOIN ... or SELECT DISTINCT' : 'WHERE ... predicates',
      progressiveHints: [
        `Compare the grain of your output (${diffReport.userRowCount} rows) with the expected grain (${diffReport.expectedRowCount} rows).`,
        isMore
          ? 'Check whether your JOIN condition has a 1-to-many relationship multiplying rows, or if distinct values should be deduplicated.'
          : 'Check if your NULL handling or date threshold logic accidentally excluded legitimate edge cases.',
        isMore
          ? 'Consider adding DISTINCT or grouping at the primary entity key grain.'
          : 'Re-read the WHERE filter boundaries: check for <= vs <, or NULL checks.',
      ],
      syntaxPattern: isMore
        ? 'SELECT DISTINCT entity_id, entity_name FROM ...'
        : 'SELECT * FROM t WHERE status = \'A\' OR status IS NULL',
      fixChecklist: [
        isMore ? 'Inspect join conditions for missing composite keys.' : 'Inspect WHERE boundaries and inequality operators.',
        isMore ? 'Confirm if deduplication (DISTINCT) is required.' : 'Test without one filter at a time to locate the drop-off.',
      ],
      explanationConfidence: 90,
    };
  }

  // 7. General Syntax / Compile Error
  if (errorType === 'compile_error' || errorMessage) {
    return {
      errorType: 'compile_error',
      conceptTitle: 'SQL Parser Syntax / Grammar Exception',
      rootCause:
        errorMessage ||
        'The AlaSQL parser encountered an unexpected token or malformed clause structure. Common causes include unclosed quotation marks, missing commas between SELECT items, reserved keyword conflicts, or misspelled SQL operators.',
      clauseCulprit: 'SQL Syntax Near Exception Point',
      progressiveHints: [
        'Carefully examine commas between columns in your SELECT and GROUP BY lists.',
        'Check that all string literals use consistent single quotes (\'value\') rather than double quotes or backticks.',
        'Verify matching parentheses in subqueries, CTEs, and CASE WHEN ... END statements.',
      ],
      syntaxPattern:
        'SELECT col1, col2, CASE WHEN condition THEN \'A\' ELSE \'B\' END AS tag\nFROM my_table\nWHERE col1 IS NOT NULL;',
      fixChecklist: [
        'Ensure every CASE statement terminates with END.',
        'Confirm every CTE (WITH clause) is separated with commas and concludes with a valid main SELECT.',
        'Check for trailing commas before FROM or WHERE.',
      ],
      explanationConfidence: 88,
    };
  }

  // 8. General Wrong Answer Fallback
  return {
    errorType: 'wrong',
    conceptTitle: 'Result Grain & Metric Computation Discrepancy',
    rootCause:
      'The generated dataset did not match the expected business result. This typically indicates an issue in the calculation formula, sorting order (ASC vs. DESC), or boundary conditions in filtering.',
    progressiveHints: [
      'Look at the expected output table tab to see how the target values differ from your output.',
      'Check your ORDER BY clause to ensure sorting order and tie-breakers match the problem requirements.',
      'Verify arithmetic rounding: does the question require ROUND(val, 2) or integer division handling?',
    ],
    syntaxPattern:
      'SELECT col1, ROUND(metric, 2) AS metric\nFROM table_name\nORDER BY metric DESC, col1 ASC;',
    fixChecklist: [
      'Compare your output values column-by-column against the Expected Output tab.',
      'Review ORDER BY direction and pagination limits (LIMIT / TOP).',
      'Check for arithmetic precision and rounding requirements.',
    ],
    explanationConfidence: 85,
  };
}

// ============================================================================
// 2. QUERY OPTIMIZER & INDEX ADVISOR HEURISTIC ENGINE
// ============================================================================

export function analyzeOptimizationDeterministically(
  sqlCode: string,
  problem: SqlProblem,
  dialect: Dialect = 'postgres'
): QueryOptimizationAnalysis {
  const cleanSql = sqlCode.trim();
  const upper = cleanSql.toUpperCase();
  const sargableInsights: SargableInsight[] = [];
  const materializationTips: string[] = [];
  const recommendedIndexes: RecommendedIndex[] = [];

  // 1. Check for Non-SARGable function on datetime columns (e.g. YEAR(date), DATE(ts), EXTRACT)
  const yearFuncMatch = cleanSql.match(/(?:YEAR|MONTH|DAY|DATE)\s*\(\s*([a-zA-Z0-9_]+)\s*\)\s*(=|!=|>|<|>=|<=)\s*([0-9]+|'[^']*')/i);
  if (yearFuncMatch) {
    const colName = yearFuncMatch[1];
    const operator = yearFuncMatch[2];
    const val = yearFuncMatch[3];
    sargableInsights.push({
      originalClause: yearFuncMatch[0],
      optimizedClause: `${colName} >= '${val}-01-01' AND ${colName} < '${Number(val) + 1}-01-01'`,
      explanation: `Wrapping column '${colName}' in a date function prevents the query engine from utilizing a B-Tree index on '${colName}'. Rewriting as an explicit range predicate makes the clause SARGable and enables Index Range Scans.`,
      isSargable: false,
    });
  }

  // 2. Check for Leading Wildcard in LIKE (Non-SARGable)
  const leadingWildcardMatch = cleanSql.match(/([a-zA-Z0-9_]+)\s+LIKE\s+(['"]%[^'"]*['"])/i);
  if (leadingWildcardMatch) {
    const colName = leadingWildcardMatch[1];
    sargableInsights.push({
      originalClause: leadingWildcardMatch[0],
      optimizedClause: `${colName} LIKE 'prefix%' /* or Trigram / Full-Text Index */`,
      explanation: `Leading wildcard pattern matching prevents standard B-Tree index traversal, forcing an O(N) sequential table scan. Where possible, anchor the prefix or utilize a Trigram (GIN) index.`,
      isSargable: false,
    });
  }

  // 3. Check for SELECT * Over-fetching
  if (upper.includes('SELECT *') || upper.includes('SELECT  *')) {
    sargableInsights.push({
      originalClause: 'SELECT *',
      optimizedClause: `SELECT ${problem.expectedOutput.columns.join(', ')}`,
      explanation:
        'Projecting all columns with SELECT * disables Index-Only Scans (covering indexes) and increases memory/network payload. Project only the required target columns.',
      isSargable: false,
    });
  }

  // 4. Check for Subquery vs JOIN / CTE Materialization
  if (upper.includes('IN (SELECT') || upper.includes('IN(SELECT')) {
    materializationTips.push(
      'Correlated IN subqueries can trigger row-by-row nested loop scans. Convert to an EXISTS clause or an INNER/LEFT JOIN with DISTINCT to allow Hash Semi-Join execution.'
    );
  }

  if (upper.includes('WITH ') || upper.includes('WITH\n')) {
    materializationTips.push(
      dialect === 'postgres'
        ? 'In PostgreSQL 12+, CTEs are inlined by default. If a CTE is expensive and referenced multiple times, declare WITH cte_name AS MATERIALIZED (...) to prevent duplicate execution.'
        : 'In Snowflake & BigQuery, CTEs are automatically inlined and pruned by the cost-based optimizer.'
    );
  } else {
    materializationTips.push(
      'Modularize multi-stage logic into CTEs (WITH clause) to help the optimizer calculate distinct cardinality estimates for each sub-pipeline.'
    );
  }

  // 5. Generate Target DDL Indexes based on Problem Schemas & Clauses
  problem.schemas.forEach((schema) => {
    const tbl = schema.tableName;
    const cols = schema.columns.map((c) => c.name);

    // Identify probable filter columns mentioned in WHERE
    const filterCols = cols.filter((col) => {
      const regex = new RegExp(`\\b${col}\\b`, 'i');
      return regex.test(cleanSql) && (upper.includes('WHERE') || upper.includes('AND') || upper.includes('OR'));
    });

    // Identify join foreign keys
    const fkCols = schema.columns.filter((c) => c.isFk || c.name.endsWith('_id')).map((c) => c.name);

    if (filterCols.length > 0 || fkCols.length > 0) {
      const targetCol = filterCols[0] || fkCols[0];
      const indexName = `idx_${tbl}_${targetCol}`;
      recommendedIndexes.push({
        tableName: tbl,
        indexName,
        columns: [targetCol],
        ddl: `CREATE INDEX ${indexName} ON ${tbl}(${targetCol});`,
        rationale: `Accelerates row filtering and nested join lookups on '${tbl}.${targetCol}', eliminating sequential scans.`,
        type: 'B-Tree',
      });
    }

    // Composite index recommendation if multiple filter/sort columns exist
    if (filterCols.length >= 2) {
      const compCols = filterCols.slice(0, 2);
      const compName = `idx_${tbl}_${compCols.join('_')}`;
      recommendedIndexes.push({
        tableName: tbl,
        indexName: compName,
        columns: compCols,
        ddl: `CREATE INDEX ${compName} ON ${tbl}(${compCols.join(', ')});`,
        rationale: `Composite index satisfying both equality and range predicates on (${compCols.join(', ')}), enabling an Index-Only Scan.`,
        type: 'Composite',
      });
    }
  });

  // Default index if none generated
  if (recommendedIndexes.length === 0 && problem.schemas[0]) {
    const defaultTbl = problem.schemas[0].tableName;
    const firstCol = problem.schemas[0].columns[0]?.name || 'id';
    recommendedIndexes.push({
      tableName: defaultTbl,
      indexName: `idx_${defaultTbl}_${firstCol}`,
      columns: [firstCol],
      ddl: `CREATE INDEX idx_${defaultTbl}_${firstCol} ON ${defaultTbl}(${firstCol});`,
      rationale: `Primary lookup B-Tree index on ${defaultTbl}.${firstCol}.`,
      type: 'B-Tree',
    });
  }

  // Cost savings estimate
  const estimatedCostSavings = sargableInsights.length > 0
    ? '-55% to -80% Estimated I/O Scan Cost'
    : '-30% to -45% Estimated Execution Cost';

  // Execution Plan Comparison
  const planBefore = [
    '1. Seq Scan on base tables (Filter applied post-scan)',
    '2. High memory buffer allocation for intermediate rows',
    '3. Sort / HashAggregate across full unindexed record set',
  ];

  const planAfter = [
    '1. Index Range Scan / Index-Only Scan (SARGable predicates pushed down)',
    '2. Reduced I/O footprint: Prunes 80%+ irrelevant rows at storage layer',
    '3. Pipelined Hash Join utilizing index-ordered streams',
  ];

  return {
    summary:
      sargableInsights.length > 0
        ? `Detected ${sargableInsights.length} non-SARGable clause(s) that force sequential table scans. Applying predicate rewrites and targeted B-Tree indexes reduces scan cost by ${estimatedCostSavings}.`
        : 'Query structure demonstrates solid relational form. Adding targeted composite indexes on foreign keys and filter columns will optimize execution to O(log N) index lookups.',
    estimatedCostSavings,
    sargableInsights,
    materializationTips,
    recommendedIndexes,
    optimizedSql: problem.officialSolutionByDialect?.[dialect] || problem.starterCodeByDialect?.[dialect] || cleanSql,
    executionPlanComparison: {
      before: planBefore,
      after: planAfter,
    },
  };
}

// ============================================================================
// 3. HYBRID ASYNC CALLERS (SERVER PROXY + INSTANT FALLBACK)
// ============================================================================

export async function explainErrorWithAI(
  sqlCode: string,
  problem: SqlProblem,
  errorType: 'compile_error' | 'wrong',
  errorMessage?: string,
  diffReport?: DiffReport
): Promise<AIDebugAnalysis> {
  try {
    const response = await fetch('/api/ai-explain-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sqlCode,
        problemId: problem.id,
        problemTitle: problem.title,
        requirements: problem.requirements,
        errorType,
        errorMessage,
        diffReport: diffReport
          ? {
              missingColumns: diffReport.missingColumns,
              extraColumns: diffReport.extraColumns,
              userRowCount: diffReport.userRowCount,
              expectedRowCount: diffReport.expectedRowCount,
              accuracyPct: diffReport.accuracyPct,
            }
          : undefined,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.analysis) {
        return data.analysis;
      }
    }
  } catch {
    // Graceful fallback to deterministic engine
  }

  return analyzeErrorDeterministically(sqlCode, problem, errorType, errorMessage, diffReport);
}

export async function optimizeQueryWithAI(
  sqlCode: string,
  problem: SqlProblem,
  dialect: Dialect = 'postgres'
): Promise<QueryOptimizationAnalysis> {
  try {
    const response = await fetch('/api/ai-optimize-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sqlCode,
        problemId: problem.id,
        schemas: problem.schemas,
        dialect,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.analysis) {
        return data.analysis;
      }
    }
  } catch {
    // Graceful fallback to deterministic engine
  }

  return analyzeOptimizationDeterministically(sqlCode, problem, dialect);
}
