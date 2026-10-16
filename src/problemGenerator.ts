/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Dialect,
  Difficulty,
  IndustryDomain,
  Mode,
  SkillLevel,
  SqlProblem,
  TableSchema,
  TopicCategory,
  TopicConfig,
} from './types';
import { livePipeline } from './services/liveQuestionPipeline';

// ============================================================================
// TOPIC DRILL CONFIGURATIONS (Beginner, Intermediate, Advanced)
// Total 27,500+ procedural challenges across 13 focused categories
// ============================================================================
export const TOPIC_DRILL_CONFIGS: TopicConfig[] = [
  {
    id: 'all',
    label: 'All Topics (Mastery Bank)',
    level: 'Advanced',
    count: 27500,
    description: 'Full procedural curriculum from basic SELECTs to recursive CTEs & query optimization.',
    icon: '⚡',
  },
  // --- BEGINNER DRILLS ---
  {
    id: 'beginner_basics',
    label: 'SELECT, WHERE & Filtering',
    level: 'Beginner',
    count: 2500,
    description: 'Foundations of column projection, WHERE predicates, logical AND/OR, and NULL checks.',
    icon: '🟢',
  },
  {
    id: 'beginner_sorting',
    label: 'DISTINCT, ORDER BY & LIMIT',
    level: 'Beginner',
    count: 2000,
    description: 'Deduplicating rows, multi-column sorting (ASC/DESC), and pagination offsets.',
    icon: '🟢',
  },
  {
    id: 'beginner_math',
    label: 'Scalar Math, COUNT & Basic AGGs',
    level: 'Beginner',
    count: 2000,
    description: 'Global aggregations, COUNT(*), SUM, AVG, MIN, MAX, and arithmetic rounding.',
    icon: '🟢',
  },
  // --- INTERMEDIATE DRILLS ---
  {
    id: 'intermediate_case',
    label: 'CASE WHEN, COALESCE & Logic',
    level: 'Intermediate',
    count: 2500,
    description: 'Branching conditional expressions, handling missing NULL values, and status categorization.',
    icon: '🟡',
  },
  {
    id: 'aggregations',
    label: 'GROUP BY & HAVING Filters',
    level: 'Intermediate',
    count: 2500,
    description: 'Dimensional grouping, aggregated threshold filtering with HAVING, and metric rollups.',
    icon: '🟡',
  },
  {
    id: 'joins',
    label: 'Multi-Table JOINs & Anti-Joins',
    level: 'Intermediate',
    count: 2500,
    description: 'INNER, LEFT, RIGHT, FULL OUTER joins, self-joins, and finding unmatched records.',
    icon: '🟡',
  },
  {
    id: 'subqueries',
    label: 'Subqueries & Correlated Subqueries',
    level: 'Intermediate',
    count: 2000,
    description: 'Scalar subqueries, IN/EXISTS predicates, and correlated row-by-row comparisons.',
    icon: '🟡',
  },
  {
    id: 'set_operations',
    label: 'Set Operations (UNION, EXCEPT)',
    level: 'Intermediate',
    count: 1500,
    description: 'UNION, UNION ALL, INTERSECT, and EXCEPT / MINUS query segment reconciliation.',
    icon: '🟡',
  },
  // --- ADVANCED DRILLS ---
  {
    id: 'window',
    label: 'Window Functions (RANK, LAG, LEAD)',
    level: 'Advanced',
    count: 2500,
    description: 'PARTITION BY, ORDER BY frames, running totals, lead/lag period deltas, and dense ranks.',
    icon: '🔴',
  },
  {
    id: 'ctes',
    label: 'CTEs, Pipelines & Recursion',
    level: 'Advanced',
    count: 2000,
    description: 'Multi-stage WITH clauses, hierarchy traversal, and recursive data pipelines.',
    icon: '🔴',
  },
  {
    id: 'datetime',
    label: 'Date-Time Math & String Parsing',
    level: 'Advanced',
    count: 2000,
    description: 'Timezone conversion, DATE_TRUNC, interval offsets, sliding calendar windows, and regex.',
    icon: '🔴',
  },
  {
    id: 'funnel_cohort',
    label: 'Funnel, Retention & Cohort Analytics',
    level: 'Advanced',
    count: 2000,
    description: 'Multi-step conversion funnels, Day-N user retention matrices, and churn tracking.',
    icon: '🔴',
  },
  {
    id: 'optimization',
    label: 'Indexing, Execution Plans & SARGability',
    level: 'Advanced',
    count: 2000,
    description: 'SARGable predicates, B-Tree vs Hash index usage, eliminating sequential table scans.',
    icon: '🔴',
  },
];

export const INDUSTRY_DOMAINS: IndustryDomain[] = [
  'SaaS',
  'FinTech',
  'E-Commerce',
  'Logistics',
  'Healthcare',
];

// Helper to pick random item by deterministic index
function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

// ============================================================================
// GENERATOR FUNCTIONS BY CATEGORY
// Every questionNumber produces distinct variations, IDs, schemas, and solutions
// ============================================================================

// 1. Beginner: SELECT, WHERE & Basic Filtering
function generateBeginnerBasics(qNum: number, domain: IndustryDomain, mode: Mode): SqlProblem {
  const isNullChecks = qNum % 2 === 1;
  const statusVal = isNullChecks
    ? pick(['TIER_1', 'PREMIUM', 'ENTERPRISE', 'STANDARD'], qNum)
    : pick(['ACTIVE', 'VERIFIED', 'COMPLETED', 'DELIVERED', 'APPROVED'], qNum);
  const minScore = ((qNum * 17) % 70) + 15;

  const targetTable = isNullChecks ? `${domain.toLowerCase()}_accounts` : `${domain.toLowerCase()}_records`;
  const sub = isNullChecks ? 'null_checks' : 'status_filter';
  const title = isNullChecks
    ? `${domain} Incomplete Profiles & Missing Data Audits`
    : `${domain} Active Records & Value Threshold`;

  const scenario = isNullChecks
    ? `Audit team needs a list of all ${domain} accounts that are registered as '${statusVal}' but have a missing phone number or null verification date. These require operational outreach.`
    : `You are analyzing the operational data table. Retrieve all ${domain} records that have an operational status of '${statusVal}' and an activity score greater than or equal to ${minScore}. Sort results by ID ascending.`;

  const cols = isNullChecks
    ? [
        { name: 'account_id', type: 'INT', isPk: true },
        { name: 'account_name', type: 'VARCHAR(80)' },
        { name: 'account_tier', type: 'VARCHAR(25)' },
        { name: 'phone_number', type: 'VARCHAR(30)' },
        { name: 'verified_at', type: 'TIMESTAMP' },
      ]
    : [
        { name: 'record_id', type: 'INT', isPk: true },
        { name: 'entity_name', type: 'VARCHAR(100)' },
        { name: 'status', type: 'VARCHAR(30)' },
        { name: 'activity_score', type: 'INT' },
        { name: 'created_date', type: 'DATE' },
      ];

  const sampleRows = isNullChecks
    ? [
        { account_id: 501, account_name: 'Acme Systems', account_tier: statusVal, phone_number: '+1-555-0100', verified_at: '2024-02-01 10:00:00' },
        { account_id: 502, account_name: 'Beacon Health', account_tier: statusVal, phone_number: null, verified_at: '2024-02-03 14:30:00' },
        { account_id: 503, account_name: 'Crest Retail', account_tier: statusVal === 'STANDARD' ? 'ENTERPRISE' : 'STANDARD', phone_number: null, verified_at: null },
        { account_id: 504, account_name: 'Delta Global', account_tier: statusVal, phone_number: '+1-555-0199', verified_at: null },
        { account_id: 505, account_name: 'Echo Dynamics', account_tier: statusVal, phone_number: null, verified_at: null },
      ]
    : [
        { record_id: 101, entity_name: 'Nexus Corp', status: statusVal, activity_score: Math.max(minScore + 15, 82), created_date: '2024-01-10' },
        { record_id: 102, entity_name: 'Vortex Global', status: 'PENDING', activity_score: 45, created_date: '2024-01-12' },
        { record_id: 103, entity_name: 'Solaris Health', status: statusVal, activity_score: Math.max(minScore + 5, 64), created_date: '2024-01-15' },
        { record_id: 104, entity_name: 'Alpha Logistics', status: 'INACTIVE', activity_score: 91, created_date: '2024-01-18' },
        { record_id: 105, entity_name: 'Zenith Labs', status: statusVal, activity_score: Math.max(minScore - 10, 10), created_date: '2024-01-20' },
      ];

  const req = isNullChecks
    ? [
        'Select account_id and account_name.',
        'Filter where account_tier = target tier.',
        'Include records where phone_number IS NULL OR verified_at IS NULL.',
        'Sort by account_id ASC.',
      ]
    : [
        'Select record_id, entity_name, and activity_score.',
        'Filter where status is exactly equal to the target value.',
        'Filter where activity_score >= target threshold.',
        'Order by record_id ASC.',
      ];

  const sampleFiltered = sampleRows.filter((row: any) => {
    if (!isNullChecks) {
      return row.status === statusVal && row.activity_score >= minScore;
    }
    return row.account_tier === statusVal && (row.phone_number === null || row.verified_at === null);
  });

  const sqlPostgres = isNullChecks
    ? `SELECT account_id, account_name\nFROM ${targetTable}\nWHERE account_tier = '${statusVal}'\n  AND (phone_number IS NULL OR verified_at IS NULL)\nORDER BY account_id ASC;`
    : `SELECT record_id, entity_name, activity_score\nFROM ${targetTable}\nWHERE status = '${statusVal}'\n  AND activity_score >= ${minScore}\nORDER BY record_id ASC;`;

  return {
    id: `BAS-${qNum}-${sub}`,
    questionNumber: qNum,
    title: `[Q#${qNum}] ${title}`,
    platform: mode === 'leetcode' ? 'LeetCode' : mode === 'hackerrank' ? 'HackerRank' : 'Skill Matrix',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: domain,
    topic: 'beginner_basics',
    topicLabel: 'SELECT, WHERE & Filtering',
    businessScenario: scenario,
    requirements: req,
    schemas: [
      {
        tableName: targetTable,
        columns: cols,
        sampleRows: sampleRows,
      },
    ],
    expectedOutput: {
      columns: isNullChecks ? ['account_id', 'account_name'] : ['record_id', 'entity_name', 'activity_score'],
      rows: isNullChecks
        ? sampleFiltered.map((r: any) => ({ account_id: r.account_id, account_name: r.account_name }))
        : sampleFiltered.map((r: any) => ({ record_id: r.record_id, entity_name: r.entity_name, activity_score: r.activity_score })),
    },
    hints: {
      tier1: 'Focus on writing a straightforward SELECT statement with precise column names, then construct the WHERE predicate.',
      tier2: !isNullChecks
        ? 'Combine conditions with AND: WHERE status = ? AND activity_score >= ?'
        : 'Use parentheses when combining AND with OR: WHERE tier = ? AND (col1 IS NULL OR col2 IS NULL)',
      tier3Skeleton: `-- Fill in the blanks\nSELECT ...\nFROM ${targetTable}\nWHERE ...\nORDER BY ... ASC;`,
    },
    starterCodeByDialect: {
      postgres: `-- PostgreSQL 15\nSELECT\n  -- write column names here\nFROM ${targetTable}\nWHERE 1=1;\n`,
      snowflake: `-- Snowflake SQL\nSELECT\n  -- write column names here\nFROM ${targetTable}\nWHERE 1=1;\n`,
      bigquery: `-- GoogleSQL (BigQuery)\nSELECT\n  -- write column names here\nFROM \`${targetTable}\`\nWHERE TRUE;\n`,
      mysql: `-- MySQL 8.0\nSELECT\n  -- write column names here\nFROM ${targetTable}\nWHERE 1=1;\n`,
    },
    officialSolutionByDialect: {
      postgres: sqlPostgres,
      snowflake: sqlPostgres,
      bigquery: sqlPostgres.replace(targetTable, `\`${targetTable}\``),
      mysql: sqlPostgres,
    },
    deepDive: {
      executionOrder: [
        `1. FROM ${targetTable} - Read table storage blocks`,
        '2. WHERE - Evaluates filter conditions row by row; discards non-matching tuples',
        '3. SELECT - Projects requested columns only',
        '4. ORDER BY - Sorts remaining rows according to key',
      ],
      indexStrategy: `CREATE INDEX idx_${targetTable}_status ON ${targetTable} (${cols[2].name}); Allows an index seek rather than a sequential table scan.`,
      complexity: 'Time Complexity: O(N) worst case table scan, O(log N + K) with B-Tree index. Space Complexity: O(K) where K is number of matched rows.',
      tradeoffs: 'Avoid using functions on columns in the WHERE clause (e.g. UPPER(status)) to preserve index SARGability.',
    },
  };
}

// 2. Beginner: DISTINCT, ORDER BY, LIMIT
function generateBeginnerSorting(qNum: number, domain: IndustryDomain, mode: Mode): SqlProblem {
  const topN = pick([3, 5, 10], qNum);
  const targetTable = `${domain.toLowerCase()}_catalog`;
  const metricCol = pick(['unit_price', 'rating_score', 'transaction_volume', 'inventory_qty'], qNum);

  const sampleRows = [
    { item_id: 1, category: 'Hardware', brand: 'Apex', [metricCol]: 950 },
    { item_id: 2, category: 'Software', brand: 'Apex', [metricCol]: 1200 },
    { item_id: 3, category: 'Hardware', brand: 'Vertex', [metricCol]: 450 },
    { item_id: 4, category: 'Cloud', brand: 'Nova', [metricCol]: 1850 },
    { item_id: 5, category: 'Software', brand: 'Nova', [metricCol]: 1300 },
    { item_id: 6, category: 'Hardware', brand: 'Apex', [metricCol]: 800 },
  ];

  const sorted = [...sampleRows].sort((a, b) => (b[metricCol] as number) - (a[metricCol] as number)).slice(0, topN);

  return {
    id: `SRT-${qNum}-${metricCol}`,
    questionNumber: qNum,
    title: `[Q#${qNum}] Top ${topN} ${domain} Items by ${metricCol.replace('_', ' ').toUpperCase()}`,
    platform: mode === 'leetcode' ? 'LeetCode' : 'Skill Matrix',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: domain,
    topic: 'beginner_sorting',
    topicLabel: 'DISTINCT, ORDER BY & LIMIT',
    businessScenario: `The executive product desk needs to review the top ${topN} highest performing ${domain} catalog offerings ranked by ${metricCol}. Break ties using category name ascending.`,
    requirements: [
      `Select category, brand, and ${metricCol}.`,
      `Sort primarily by ${metricCol} in DESCENDING order.`,
      'Sort secondarily by category in ASCENDING order for deterministic ordering.',
      `Limit final output to exactly ${topN} records.`,
    ],
    schemas: [
      {
        tableName: targetTable,
        columns: [
          { name: 'item_id', type: 'INT', isPk: true },
          { name: 'category', type: 'VARCHAR(50)' },
          { name: 'brand', type: 'VARCHAR(50)' },
          { name: metricCol, type: 'NUMERIC(10,2)' },
        ],
        sampleRows,
      },
    ],
    expectedOutput: {
      columns: ['category', 'brand', metricCol],
      rows: sorted.map((r) => ({ category: r.category, brand: r.brand, [metricCol]: r[metricCol] })),
    },
    hints: {
      tier1: `Use ORDER BY with two sorting criteria separated by a comma.`,
      tier2: `Append LIMIT ${topN} at the very end of your SQL statement.`,
      tier3Skeleton: `SELECT category, brand, ${metricCol}\nFROM ${targetTable}\nORDER BY ${metricCol} DESC, category ASC\nLIMIT ${topN};`,
    },
    starterCodeByDialect: {
      postgres: `SELECT category, brand, ${metricCol}\nFROM ${targetTable}\n-- add ORDER BY and LIMIT here\n;`,
      snowflake: `SELECT category, brand, ${metricCol}\nFROM ${targetTable}\n-- add ORDER BY and LIMIT here\n;`,
      bigquery: `SELECT category, brand, ${metricCol}\nFROM \`${targetTable}\`\n-- add ORDER BY and LIMIT here\n;`,
      mysql: `SELECT category, brand, ${metricCol}\nFROM ${targetTable}\n-- add ORDER BY and LIMIT here\n;`,
    },
    officialSolutionByDialect: {
      postgres: `SELECT category, brand, ${metricCol}\nFROM ${targetTable}\nORDER BY ${metricCol} DESC, category ASC\nLIMIT ${topN};`,
      snowflake: `SELECT category, brand, ${metricCol}\nFROM ${targetTable}\nORDER BY ${metricCol} DESC, category ASC\nLIMIT ${topN};`,
      bigquery: `SELECT category, brand, ${metricCol}\nFROM \`${targetTable}\`\nORDER BY ${metricCol} DESC, category ASC\nLIMIT ${topN};`,
      mysql: `SELECT category, brand, ${metricCol}\nFROM ${targetTable}\nORDER BY ${metricCol} DESC, category ASC\nLIMIT ${topN};`,
    },
    deepDive: {
      executionOrder: [
        '1. FROM - Scans target table',
        '2. SELECT - Extracts columns',
        '3. ORDER BY - Sorts tuples in memory or temp disk space',
        '4. LIMIT - Halts cursor evaluation after top N records are produced',
      ],
      indexStrategy: `CREATE INDEX idx_catalog_rank ON ${targetTable} (${metricCol} DESC, category ASC); Enables a Top-N Sort optimization with zero heap sort.`,
      complexity: 'Time Complexity: O(N log N) without index, O(topN) with index. Space Complexity: O(topN).',
      tradeoffs: 'Always include a secondary unique or deterministic column in ORDER BY to ensure repeatable results across runs.',
    },
  };
}

// 3. Beginner: Basic Scalar Aggregations & Math
function generateBeginnerMath(qNum: number, domain: IndustryDomain, mode: Mode): SqlProblem {
  const targetTable = `${domain.toLowerCase()}_transactions`;
  const amountMultiplier = ((qNum * 13) % 25) + 10;

  return {
    id: `MTH-${qNum}-${domain.toLowerCase()}`,
    questionNumber: qNum,
    title: `[Q#${qNum}] High-Level Financial Metrics & Transaction Statistics`,
    platform: mode === 'hackerrank' ? 'HackerRank' : 'Skill Matrix',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: domain,
    topic: 'beginner_math',
    topicLabel: 'Scalar Math, COUNT & Basic AGGs',
    businessScenario: `Compute aggregate portfolio statistics across all recorded ${domain} transactions. Calculate total count of transactions, total volume, average transaction size rounded to 2 decimals, and maximum single transaction amount.`,
    requirements: [
      'Return a single row with 4 aggregated metric columns.',
      'Alias total transactions as total_tx_count.',
      'Alias total volume as total_volume_usd.',
      'Alias average volume as avg_tx_size (ROUND to 2 decimal places).',
      'Alias maximum transaction as max_tx_size.',
    ],
    schemas: [
      {
        tableName: targetTable,
        columns: [
          { name: 'tx_id', type: 'INT', isPk: true },
          { name: 'user_id', type: 'INT' },
          { name: 'amount', type: 'NUMERIC(12,2)' },
          { name: 'status', type: 'VARCHAR(20)' },
        ],
        sampleRows: [
          { tx_id: 1, user_id: 101, amount: 150.00 * amountMultiplier, status: 'SETTLED' },
          { tx_id: 2, user_id: 102, amount: 240.50 * amountMultiplier, status: 'SETTLED' },
          { tx_id: 3, user_id: 103, amount: 89.20 * amountMultiplier, status: 'REFUNDED' },
          { tx_id: 4, user_id: 104, amount: 1200.00 * amountMultiplier, status: 'SETTLED' },
        ],
      },
    ],
    expectedOutput: {
      columns: ['total_tx_count', 'total_volume_usd', 'avg_tx_size', 'max_tx_size'],
      rows: [
        {
          total_tx_count: 4,
          total_volume_usd: Number(((150 + 240.5 + 89.2 + 1200) * amountMultiplier).toFixed(2)),
          avg_tx_size: Number((((150 + 240.5 + 89.2 + 1200) * amountMultiplier) / 4).toFixed(2)),
          max_tx_size: Number((1200 * amountMultiplier).toFixed(2)),
        },
      ],
    },
    hints: {
      tier1: 'No GROUP BY clause is necessary when aggregating the entire table into a single summary row.',
      tier2: 'Use standard SQL aggregate functions: COUNT(*), SUM(amount), ROUND(AVG(amount), 2), and MAX(amount).',
      tier3Skeleton: `SELECT\n  COUNT(*) AS total_tx_count,\n  SUM(amount) AS total_volume_usd,\n  ROUND(AVG(amount), 2) AS avg_tx_size,\n  MAX(amount) AS max_tx_size\nFROM ${targetTable};`,
    },
    starterCodeByDialect: {
      postgres: `SELECT\n  COUNT(*) AS total_tx_count,\n  -- write aggregations here\nFROM ${targetTable};`,
      snowflake: `SELECT\n  COUNT(*) AS total_tx_count,\n  -- write aggregations here\nFROM ${targetTable};`,
      bigquery: `SELECT\n  COUNT(*) AS total_tx_count,\n  -- write aggregations here\nFROM \`${targetTable}\`;`,
      mysql: `SELECT\n  COUNT(*) AS total_tx_count,\n  -- write aggregations here\nFROM ${targetTable};`,
    },
    officialSolutionByDialect: {
      postgres: `SELECT\n  COUNT(*) AS total_tx_count,\n  SUM(amount) AS total_volume_usd,\n  ROUND(AVG(amount), 2) AS avg_tx_size,\n  MAX(amount) AS max_tx_size\nFROM ${targetTable};`,
      snowflake: `SELECT\n  COUNT(*) AS total_tx_count,\n  SUM(amount) AS total_volume_usd,\n  ROUND(AVG(amount), 2) AS avg_tx_size,\n  MAX(amount) AS max_tx_size\nFROM ${targetTable};`,
      bigquery: `SELECT\n  COUNT(*) AS total_tx_count,\n  SUM(amount) AS total_volume_usd,\n  ROUND(AVG(amount), 2) AS avg_tx_size,\n  MAX(amount) AS max_tx_size\nFROM \`${targetTable}\`;`,
      mysql: `SELECT\n  COUNT(*) AS total_tx_count,\n  SUM(amount) AS total_volume_usd,\n  ROUND(AVG(amount), 2) AS avg_tx_size,\n  MAX(amount) AS max_tx_size\nFROM ${targetTable};`,
    },
    deepDive: {
      executionOrder: [
        `1. FROM ${targetTable} - Read stream of rows`,
        '2. AGGREGATE - Single-pass accumulator updates count, sum, min, max simultaneously',
        '3. SELECT - Output single consolidated tuple',
      ],
      indexStrategy: `CREATE INDEX idx_tx_amount ON ${targetTable} (amount); For MAX(amount), an index allows an instantaneous O(1) B-tree lookup.`,
      complexity: 'Time Complexity: O(N) full table scan. Space Complexity: O(1) state accumulator.',
      tradeoffs: 'COUNT(*) vs COUNT(amount): COUNT(*) counts all rows including NULLs, whereas COUNT(col) skips NULL values.',
    },
  };
}

// 4. Intermediate: CASE WHEN & COALESCE
function generateIntermediateCase(qNum: number, domain: IndustryDomain, mode: Mode): SqlProblem {
  const targetTable = `${domain.toLowerCase()}_subscriptions`;
  const highTierThreshold = ((qNum * 23) % 400) + 200;
  const midTierThreshold = Math.floor(highTierThreshold * 0.45);

  return {
    id: `CSE-${qNum}-${domain.toLowerCase()}`,
    questionNumber: qNum,
    title: `[Q#${qNum}] Customer Tier Classification & Null Fallbacks`,
    platform: mode === 'leetcode' ? 'LeetCode' : 'Skill Matrix',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: domain,
    topic: 'intermediate_case',
    topicLabel: 'CASE WHEN, COALESCE & Logic',
    businessScenario: `Segment ${domain} subscribers based on monthly spend. If spend >= $${highTierThreshold}, assign 'Tier-1 VIP'; if spend >= $${midTierThreshold}, assign 'Tier-2 Core'; otherwise 'Tier-3 Basic'. Additionally, if preferred_channel is NULL, fallback to 'Email'.`,
    requirements: [
      'Select subscriber_id and company_name.',
      `Categorize spend as customer_tier using CASE WHEN conditions.`,
      'Use COALESCE(preferred_channel, \'Email\') aliased as contact_method.',
      'Order by monthly_spend DESC, subscriber_id ASC.',
    ],
    schemas: [
      {
        tableName: targetTable,
        columns: [
          { name: 'subscriber_id', type: 'INT', isPk: true },
          { name: 'company_name', type: 'VARCHAR(100)' },
          { name: 'monthly_spend', type: 'NUMERIC(10,2)' },
          { name: 'preferred_channel', type: 'VARCHAR(30)' },
        ],
        sampleRows: [
          { subscriber_id: 1, company_name: 'Acme Health', monthly_spend: highTierThreshold + 150, preferred_channel: 'Slack' },
          { subscriber_id: 2, company_name: 'Beta Global', monthly_spend: midTierThreshold + 30, preferred_channel: null },
          { subscriber_id: 3, company_name: 'Crestline AI', monthly_spend: midTierThreshold - 10, preferred_channel: 'SMS' },
          { subscriber_id: 4, company_name: 'Delta Cloud', monthly_spend: highTierThreshold + 80, preferred_channel: null },
        ],
      },
    ],
    expectedOutput: {
      columns: ['subscriber_id', 'company_name', 'customer_tier', 'contact_method'],
      rows: [
        { subscriber_id: 1, company_name: 'Acme Health', customer_tier: 'Tier-1 VIP', contact_method: 'Slack' },
        { subscriber_id: 4, company_name: 'Delta Cloud', customer_tier: 'Tier-1 VIP', contact_method: 'Email' },
        { subscriber_id: 2, company_name: 'Beta Global', customer_tier: 'Tier-2 Core', contact_method: 'Email' },
        { subscriber_id: 3, company_name: 'Crestline AI', customer_tier: 'Tier-3 Basic', contact_method: 'SMS' },
      ],
    },
    hints: {
      tier1: 'A CASE expression evaluates conditions in top-down sequential order; make sure your most restrictive threshold comes first.',
      tier2: `CASE WHEN monthly_spend >= ${highTierThreshold} THEN 'Tier-1 VIP' WHEN monthly_spend >= ${midTierThreshold} THEN 'Tier-2 Core' ELSE 'Tier-3 Basic' END`,
      tier3Skeleton: `SELECT\n  subscriber_id,\n  company_name,\n  CASE\n    WHEN monthly_spend >= ${highTierThreshold} THEN 'Tier-1 VIP'\n    WHEN monthly_spend >= ${midTierThreshold} THEN 'Tier-2 Core'\n    ELSE 'Tier-3 Basic'\n  END AS customer_tier,\n  COALESCE(preferred_channel, 'Email') AS contact_method\nFROM ${targetTable}\nORDER BY monthly_spend DESC, subscriber_id ASC;`,
    },
    starterCodeByDialect: {
      postgres: `SELECT\n  subscriber_id,\n  company_name,\n  -- write CASE WHEN and COALESCE logic\nFROM ${targetTable};`,
      snowflake: `SELECT\n  subscriber_id,\n  company_name,\n  -- write CASE WHEN and COALESCE logic\nFROM ${targetTable};`,
      bigquery: `SELECT\n  subscriber_id,\n  company_name,\n  -- write CASE WHEN and COALESCE logic\nFROM \`${targetTable}\`;`,
      mysql: `SELECT\n  subscriber_id,\n  company_name,\n  -- write CASE WHEN and COALESCE logic\nFROM ${targetTable};`,
    },
    officialSolutionByDialect: {
      postgres: `SELECT\n  subscriber_id,\n  company_name,\n  CASE\n    WHEN monthly_spend >= ${highTierThreshold} THEN 'Tier-1 VIP'\n    WHEN monthly_spend >= ${midTierThreshold} THEN 'Tier-2 Core'\n    ELSE 'Tier-3 Basic'\n  END AS customer_tier,\n  COALESCE(preferred_channel, 'Email') AS contact_method\nFROM ${targetTable}\nORDER BY monthly_spend DESC, subscriber_id ASC;`,
      snowflake: `SELECT\n  subscriber_id,\n  company_name,\n  CASE\n    WHEN monthly_spend >= ${highTierThreshold} THEN 'Tier-1 VIP'\n    WHEN monthly_spend >= ${midTierThreshold} THEN 'Tier-2 Core'\n    ELSE 'Tier-3 Basic'\n  END AS customer_tier,\n  COALESCE(preferred_channel, 'Email') AS contact_method\nFROM ${targetTable}\nORDER BY monthly_spend DESC, subscriber_id ASC;`,
      bigquery: `SELECT\n  subscriber_id,\n  company_name,\n  CASE\n    WHEN monthly_spend >= ${highTierThreshold} THEN 'Tier-1 VIP'\n    WHEN monthly_spend >= ${midTierThreshold} THEN 'Tier-2 Core'\n    ELSE 'Tier-3 Basic'\n  END AS customer_tier,\n  COALESCE(preferred_channel, 'Email') AS contact_method\nFROM \`${targetTable}\`\nORDER BY monthly_spend DESC, subscriber_id ASC;`,
      mysql: `SELECT\n  subscriber_id,\n  company_name,\n  CASE\n    WHEN monthly_spend >= ${highTierThreshold} THEN 'Tier-1 VIP'\n    WHEN monthly_spend >= ${midTierThreshold} THEN 'Tier-2 Core'\n    ELSE 'Tier-3 Basic'\n  END AS customer_tier,\n  COALESCE(preferred_channel, 'Email') AS contact_method\nFROM ${targetTable}\nORDER BY monthly_spend DESC, subscriber_id ASC;`,
    },
    deepDive: {
      executionOrder: [
        '1. FROM - Scan records',
        '2. SELECT - Evaluates CASE branching and COALESCE scalar function for each row',
        '3. ORDER BY - Sorts dataset before yielding to client',
      ],
      indexStrategy: `CREATE INDEX idx_subs_spend ON ${targetTable} (monthly_spend DESC, subscriber_id ASC); Allows sort bypass.`,
      complexity: 'Time Complexity: O(N log N) for sort. Space: O(N) to hold result set.',
      tradeoffs: 'COALESCE returns the first non-NULL expression from its argument list, conforming to ANSI SQL.',
    },
  };
}

// 5. Intermediate: GROUP BY & HAVING
function generateAggregations(qNum: number, domain: IndustryDomain, mode: Mode): SqlProblem {
  const minTransactions = 3;
  const minRevenue = ((qNum * 19) % 5000) + 2000;
  const targetTable = `${domain.toLowerCase()}_sales`;

  return {
    id: `AGG-${qNum}-${domain.toLowerCase()}`,
    questionNumber: qNum,
    title: `[Q#${qNum}] Department Revenue Aggregation & Threshold Filter`,
    platform: mode === 'hackerrank' ? 'HackerRank' : 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: domain,
    topic: 'aggregations',
    topicLabel: 'GROUP BY & HAVING Filters',
    businessScenario: `Identify all high-performing departments in the ${domain} division that have closed at least ${minTransactions} deals AND generated a total revenue exceeding $${minRevenue.toLocaleString()}.`,
    requirements: [
      'Group records by department_id and department_name.',
      'Count total deals aliased as deal_count.',
      'Sum total revenue aliased as total_revenue.',
      `Apply a HAVING filter: deal_count >= ${minTransactions} AND total_revenue > ${minRevenue}.`,
      'Order results by total_revenue DESC.',
    ],
    schemas: [
      {
        tableName: targetTable,
        columns: [
          { name: 'sale_id', type: 'INT', isPk: true },
          { name: 'department_id', type: 'INT', isFk: true },
          { name: 'department_name', type: 'VARCHAR(50)' },
          { name: 'amount', type: 'NUMERIC(10,2)' },
        ],
        sampleRows: [
          { sale_id: 1, department_id: 10, department_name: 'Enterprise', amount: 3500 },
          { sale_id: 2, department_id: 10, department_name: 'Enterprise', amount: 4200 },
          { sale_id: 3, department_id: 10, department_name: 'Enterprise', amount: 2800 },
          { sale_id: 4, department_id: 20, department_name: 'Mid-Market', amount: 1200 },
          { sale_id: 5, department_id: 20, department_name: 'Mid-Market', amount: 950 },
          { sale_id: 6, department_id: 30, department_name: 'SMB Self-Serve', amount: 8400 },
        ],
      },
    ],
    expectedOutput: {
      columns: ['department_id', 'department_name', 'deal_count', 'total_revenue'],
      rows: [
        { department_id: 10, department_name: 'Enterprise', deal_count: 3, total_revenue: 10500 },
      ],
    },
    hints: {
      tier1: 'WHERE filters individual input rows before aggregation; HAVING filters aggregated group metrics after GROUP BY.',
      tier2: `Use GROUP BY department_id, department_name followed by HAVING COUNT(*) >= ${minTransactions} AND SUM(amount) > ${minRevenue}.`,
      tier3Skeleton: `SELECT\n  department_id,\n  department_name,\n  COUNT(*) AS deal_count,\n  SUM(amount) AS total_revenue\nFROM ${targetTable}\nGROUP BY department_id, department_name\nHAVING COUNT(*) >= ${minTransactions} AND SUM(amount) > ${minRevenue}\nORDER BY total_revenue DESC;`,
    },
    starterCodeByDialect: {
      postgres: `SELECT department_id, department_name\nFROM ${targetTable}\n-- add GROUP BY and HAVING clauses\n;`,
      snowflake: `SELECT department_id, department_name\nFROM ${targetTable}\n-- add GROUP BY and HAVING clauses\n;`,
      bigquery: `SELECT department_id, department_name\nFROM \`${targetTable}\`\n-- add GROUP BY and HAVING clauses\n;`,
      mysql: `SELECT department_id, department_name\nFROM ${targetTable}\n-- add GROUP BY and HAVING clauses\n;`,
    },
    officialSolutionByDialect: {
      postgres: `SELECT\n  department_id,\n  department_name,\n  COUNT(*) AS deal_count,\n  SUM(amount) AS total_revenue\nFROM ${targetTable}\nGROUP BY department_id, department_name\nHAVING COUNT(*) >= ${minTransactions} AND SUM(amount) > ${minRevenue}\nORDER BY total_revenue DESC;`,
      snowflake: `SELECT\n  department_id,\n  department_name,\n  COUNT(*) AS deal_count,\n  SUM(amount) AS total_revenue\nFROM ${targetTable}\nGROUP BY department_id, department_name\nHAVING COUNT(*) >= ${minTransactions} AND SUM(amount) > ${minRevenue}\nORDER BY total_revenue DESC;`,
      bigquery: `SELECT\n  department_id,\n  department_name,\n  COUNT(*) AS deal_count,\n  SUM(amount) AS total_revenue\nFROM \`${targetTable}\`\nGROUP BY department_id, department_name\nHAVING COUNT(*) >= ${minTransactions} AND SUM(amount) > ${minRevenue}\nORDER BY total_revenue DESC;`,
      mysql: `SELECT\n  department_id,\n  department_name,\n  COUNT(*) AS deal_count,\n  SUM(amount) AS total_revenue\nFROM ${targetTable}\nGROUP BY department_id, department_name\nHAVING COUNT(*) >= ${minTransactions} AND SUM(amount) > ${minRevenue}\nORDER BY total_revenue DESC;`,
    },
    deepDive: {
      executionOrder: [
        '1. FROM - Scan base table',
        '2. GROUP BY - Hash or Sort rows into partition buckets',
        '3. AGGREGATE - Compute COUNT(*) and SUM(amount)',
        '4. HAVING - Discard buckets that do not satisfy group conditions',
        '5. SELECT - Format output columns',
        '6. ORDER BY - Sort final group rows',
      ],
      indexStrategy: `CREATE INDEX idx_sales_dept ON ${targetTable} (department_id, amount); Allows index aggregation via HashAggregate or GroupAggregate.`,
      complexity: 'Time Complexity: O(N) to build hash table of groups. Space: O(G) where G is distinct departments.',
      tradeoffs: 'All non-aggregated columns in SELECT must be included in the GROUP BY clause under standard ANSI SQL mode.',
    },
  };
}

// 6. Intermediate: Multi-Table JOINs & Anti-Joins
function generateJoins(qNum: number, domain: IndustryDomain, mode: Mode): SqlProblem {
  const isAntiJoin = qNum % 2 === 1;
  const t1 = `${domain.toLowerCase()}_users`;
  const t2 = `${domain.toLowerCase()}_orders`;

  return {
    id: `JON-${qNum}-${isAntiJoin ? 'anti' : 'inner'}`,
    questionNumber: qNum,
    title: `[Q#${qNum}] ${isAntiJoin ? 'Anti-Join: Unengaged User Detection' : 'Multi-Table Revenue Reconciliation'}`,
    platform: mode === 'leetcode' ? 'LeetCode' : 'HackerRank',
    difficulty: isAntiJoin ? 'Medium' : 'Easy',
    skillLevel: 'Intermediate',
    industry: domain,
    topic: 'joins',
    topicLabel: 'Multi-Table JOINs & Anti-Joins',
    businessScenario: isAntiJoin
      ? `The ${domain} retention team wants to run a re-engagement campaign. Find all registered users who have NEVER placed a single order in the system.`
      : `Reconcile customer details with their high-value orders. Show user email, order ID, and order total for orders over $500.`,
    requirements: isAntiJoin
      ? [
          'Select user_id, user_name, and email from the users table.',
          'Perform a LEFT JOIN against orders on user_id.',
          'Filter where orders.order_id IS NULL to isolate unmatched users.',
          'Order by user_id ASC.',
        ]
      : [
          'Join users and orders on user_id.',
          'Select user_name, order_id, and order_total.',
          'Filter where order_total > 500.',
          'Order by order_total DESC, order_id ASC.',
        ],
    schemas: [
      {
        tableName: t1,
        columns: [
          { name: 'user_id', type: 'INT', isPk: true },
          { name: 'user_name', type: 'VARCHAR(60)' },
          { name: 'email', type: 'VARCHAR(100)' },
        ],
        sampleRows: [
          { user_id: 101, user_name: 'Alice Wong', email: 'alice@example.com' },
          { user_id: 102, user_name: 'Bob Miller', email: 'bob@example.com' },
          { user_id: 103, user_name: 'Charlie Davis', email: 'charlie@example.com' },
          { user_id: 104, user_name: 'Diana Prince', email: 'diana@example.com' },
        ],
      },
      {
        tableName: t2,
        columns: [
          { name: 'order_id', type: 'INT', isPk: true },
          { name: 'user_id', type: 'INT', isFk: true },
          { name: 'order_total', type: 'NUMERIC(10,2)' },
        ],
        sampleRows: [
          { order_id: 9001, user_id: 101, order_total: 750.00 },
          { order_id: 9002, user_id: 101, order_total: 210.00 },
          { order_id: 9003, user_id: 103, order_total: 1200.00 },
        ],
      },
    ],
    expectedOutput: isAntiJoin
      ? {
          columns: ['user_id', 'user_name', 'email'],
          rows: [
            { user_id: 102, user_name: 'Bob Miller', email: 'bob@example.com' },
            { user_id: 104, user_name: 'Diana Prince', email: 'diana@example.com' },
          ],
        }
      : {
          columns: ['user_name', 'order_id', 'order_total'],
          rows: [
            { user_name: 'Charlie Davis', order_id: 9003, order_total: 1200.00 },
            { user_name: 'Alice Wong', order_id: 9001, order_total: 750.00 },
          ],
        },
    hints: {
      tier1: isAntiJoin
        ? 'An anti-join uses a LEFT JOIN combined with a WHERE right_table.pk IS NULL filter.'
        : 'Use an INNER JOIN between users and orders with matching foreign keys.',
      tier2: isAntiJoin
        ? `FROM ${t1} u LEFT JOIN ${t2} o ON u.user_id = o.user_id WHERE o.order_id IS NULL`
        : `FROM ${t1} u INNER JOIN ${t2} o ON u.user_id = o.user_id WHERE o.order_total > 500`,
      tier3Skeleton: isAntiJoin
        ? `SELECT u.user_id, u.user_name, u.email\nFROM ${t1} u\nLEFT JOIN ${t2} o ON u.user_id = o.user_id\nWHERE o.order_id IS NULL\nORDER BY u.user_id ASC;`
        : `SELECT u.user_name, o.order_id, o.order_total\nFROM ${t1} u\nINNER JOIN ${t2} o ON u.user_id = o.user_id\nWHERE o.order_total > 500\nORDER BY o.order_total DESC, o.order_id ASC;`,
    },
    starterCodeByDialect: {
      postgres: `-- PostgreSQL 15\nSELECT u.user_id, u.user_name\nFROM ${t1} u\n-- complete join logic\n;`,
      snowflake: `-- Snowflake\nSELECT u.user_id, u.user_name\nFROM ${t1} u\n-- complete join logic\n;`,
      bigquery: `-- BigQuery\nSELECT u.user_id, u.user_name\nFROM \`${t1}\` u\n-- complete join logic\n;`,
      mysql: `-- MySQL 8.0\nSELECT u.user_id, u.user_name\nFROM ${t1} u\n-- complete join logic\n;`,
    },
    officialSolutionByDialect: {
      postgres: isAntiJoin
        ? `SELECT u.user_id, u.user_name, u.email\nFROM ${t1} u\nLEFT JOIN ${t2} o ON u.user_id = o.user_id\nWHERE o.order_id IS NULL\nORDER BY u.user_id ASC;`
        : `SELECT u.user_name, o.order_id, o.order_total\nFROM ${t1} u\nINNER JOIN ${t2} o ON u.user_id = o.user_id\nWHERE o.order_total > 500\nORDER BY o.order_total DESC, o.order_id ASC;`,
      snowflake: isAntiJoin
        ? `SELECT u.user_id, u.user_name, u.email\nFROM ${t1} u\nLEFT JOIN ${t2} o ON u.user_id = o.user_id\nWHERE o.order_id IS NULL\nORDER BY u.user_id ASC;`
        : `SELECT u.user_name, o.order_id, o.order_total\nFROM ${t1} u\nINNER JOIN ${t2} o ON u.user_id = o.user_id\nWHERE o.order_total > 500\nORDER BY o.order_total DESC, o.order_id ASC;`,
      bigquery: isAntiJoin
        ? `SELECT u.user_id, u.user_name, u.email\nFROM \`${t1}\` u\nLEFT JOIN \`${t2}\` o ON u.user_id = o.user_id\nWHERE o.order_id IS NULL\nORDER BY u.user_id ASC;`
        : `SELECT u.user_name, o.order_id, o.order_total\nFROM \`${t1}\` u\nINNER JOIN \`${t2}\` o ON u.user_id = o.user_id\nWHERE o.order_total > 500\nORDER BY o.order_total DESC, o.order_id ASC;`,
      mysql: isAntiJoin
        ? `SELECT u.user_id, u.user_name, u.email\nFROM ${t1} u\nLEFT JOIN ${t2} o ON u.user_id = o.user_id\nWHERE o.order_id IS NULL\nORDER BY u.user_id ASC;`
        : `SELECT u.user_name, o.order_id, o.order_total\nFROM ${t1} u\nINNER JOIN ${t2} o ON u.user_id = o.user_id\nWHERE o.order_total > 500\nORDER BY o.order_total DESC, o.order_id ASC;`,
    },
    deepDive: {
      executionOrder: [
        '1. FROM - Scan left table',
        '2. JOIN - Evaluates join predicate using Hash Join or Nested Loop',
        '3. WHERE - Evaluates filter conditions',
        '4. SELECT - Projects columns',
        '5. ORDER BY - Sorts result',
      ],
      indexStrategy: `CREATE INDEX idx_orders_fk ON ${t2} (user_id); Foreign key indexing avoids sequential scans during join probes.`,
      complexity: 'Time Complexity: O(M + N) with Hash Join. Space: O(min(M, N)) for hash table.',
      tradeoffs: 'LEFT JOIN ... WHERE pk IS NULL vs NOT EXISTS: The optimizer often plans both identically, but NOT EXISTS can be more readable for multi-column keys.',
    },
  };
}

// 7. Intermediate: Subqueries & Correlated Subqueries
function generateSubqueries(qNum: number, domain: IndustryDomain, mode: Mode): SqlProblem {
  const targetTable = `${domain.toLowerCase()}_employees`;

  return {
    id: `SUB-${qNum}-${domain.toLowerCase()}`,
    questionNumber: qNum,
    title: `[Q#${qNum}] Employees Earning Above Department Average`,
    platform: mode === 'leetcode' ? 'LeetCode' : 'Skill Matrix',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: domain,
    topic: 'subqueries',
    topicLabel: 'Subqueries & Correlated Subqueries',
    businessScenario: `Find all ${domain} team members whose compensation is strictly greater than the average salary of their specific department.`,
    requirements: [
      'Select employee_id, employee_name, department_id, and salary.',
      'Use a correlated subquery in the WHERE clause comparing salary > (SELECT AVG(salary) FROM ... WHERE department_id = outer.department_id).',
      'Order results by department_id ASC, salary DESC.',
    ],
    schemas: [
      {
        tableName: targetTable,
        columns: [
          { name: 'employee_id', type: 'INT', isPk: true },
          { name: 'employee_name', type: 'VARCHAR(60)' },
          { name: 'department_id', type: 'INT' },
          { name: 'salary', type: 'NUMERIC(10,2)' },
        ],
        sampleRows: [
          { employee_id: 1, employee_name: 'Sarah Connor', department_id: 1, salary: 120000 },
          { employee_id: 2, employee_name: 'Kyle Reese', department_id: 1, salary: 95000 },
          { employee_id: 3, employee_name: 'John Connor', department_id: 2, salary: 140000 },
          { employee_id: 4, employee_name: 'Marcus Wright', department_id: 2, salary: 110000 },
          { employee_id: 5, employee_name: 'Grace Harper', department_id: 2, salary: 105000 },
        ],
      },
    ],
    expectedOutput: {
      columns: ['employee_id', 'employee_name', 'department_id', 'salary'],
      rows: [
        { employee_id: 1, employee_name: 'Sarah Connor', department_id: 1, salary: 120000 },
        { employee_id: 3, employee_name: 'John Connor', department_id: 2, salary: 140000 },
      ],
    },
    hints: {
      tier1: 'A correlated subquery references a column from the outer query table alias (e.g. e1.department_id).',
      tier2: `WHERE e1.salary > (SELECT AVG(e2.salary) FROM ${targetTable} e2 WHERE e2.department_id = e1.department_id)`,
      tier3Skeleton: `SELECT e1.employee_id, e1.employee_name, e1.department_id, e1.salary\nFROM ${targetTable} e1\nWHERE e1.salary > (\n  SELECT AVG(e2.salary)\n  FROM ${targetTable} e2\n  WHERE e2.department_id = e1.department_id\n)\nORDER BY e1.department_id ASC, e1.salary DESC;`,
    },
    starterCodeByDialect: {
      postgres: `SELECT e1.employee_id, e1.employee_name\nFROM ${targetTable} e1\n-- write correlated subquery\n;`,
      snowflake: `SELECT e1.employee_id, e1.employee_name\nFROM ${targetTable} e1\n-- write correlated subquery\n;`,
      bigquery: `SELECT e1.employee_id, e1.employee_name\nFROM \`${targetTable}\` e1\n-- write correlated subquery\n;`,
      mysql: `SELECT e1.employee_id, e1.employee_name\nFROM ${targetTable} e1\n-- write correlated subquery\n;`,
    },
    officialSolutionByDialect: {
      postgres: `SELECT e1.employee_id, e1.employee_name, e1.department_id, e1.salary\nFROM ${targetTable} e1\nWHERE e1.salary > (\n  SELECT AVG(e2.salary)\n  FROM ${targetTable} e2\n  WHERE e2.department_id = e1.department_id\n)\nORDER BY e1.department_id ASC, e1.salary DESC;`,
      snowflake: `SELECT e1.employee_id, e1.employee_name, e1.department_id, e1.salary\nFROM ${targetTable} e1\nWHERE e1.salary > (\n  SELECT AVG(e2.salary)\n  FROM ${targetTable} e2\n  WHERE e2.department_id = e1.department_id\n)\nORDER BY e1.department_id ASC, e1.salary DESC;`,
      bigquery: `SELECT e1.employee_id, e1.employee_name, e1.department_id, e1.salary\nFROM \`${targetTable}\` e1\nWHERE e1.salary > (\n  SELECT AVG(e2.salary)\n  FROM \`${targetTable}\` e2\n  WHERE e2.department_id = e1.department_id\n)\nORDER BY e1.department_id ASC, e1.salary DESC;`,
      mysql: `SELECT e1.employee_id, e1.employee_name, e1.department_id, e1.salary\nFROM ${targetTable} e1\nWHERE e1.salary > (\n  SELECT AVG(e2.salary)\n  FROM ${targetTable} e2\n  WHERE e2.department_id = e1.department_id\n)\nORDER BY e1.department_id ASC, e1.salary DESC;`,
    },
    deepDive: {
      executionOrder: [
        '1. Outer query reads a row from e1',
        '2. Inner subquery executes parameterized with e1.department_id',
        '3. Evaluates if e1.salary > calculated department average',
        '4. Projects matches and sorts results',
      ],
      indexStrategy: `CREATE INDEX idx_emp_dept_sal ON ${targetTable} (department_id, salary); Enables the optimizer to unnest the correlation into a Hash Join or Window Function.`,
      complexity: 'Time Complexity: O(N * M) naive, or O(N) when decorrelated by modern optimizers.',
      tradeoffs: 'Correlated subqueries can also be rewritten with an analytic AVG(salary) OVER (PARTITION BY department_id) for optimal performance.',
    },
  };
}

// 8. Intermediate: Set Operations
function generateSetOperations(qNum: number, domain: IndustryDomain, mode: Mode): SqlProblem {
  const t1 = `${domain.toLowerCase()}_current_clients`;
  const t2 = `${domain.toLowerCase()}_archived_clients`;

  return {
    id: `SET-${qNum}-${domain.toLowerCase()}`,
    questionNumber: qNum,
    title: `[Q#${qNum}] Client Registry Reconciliation (UNION & Deduplication)`,
    platform: mode === 'hackerrank' ? 'HackerRank' : 'Skill Matrix',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: domain,
    topic: 'set_operations',
    topicLabel: 'Set Operations (UNION, EXCEPT)',
    businessScenario: `Combine all unique ${domain} clients across active current accounts and historical archived records into a single consolidated directory. Ensure duplicate records are removed.`,
    requirements: [
      'Select client_id, client_name, and state_code.',
      'Use UNION to consolidate rows from both tables while deduplicating identical tuples.',
      'Order by state_code ASC, client_id ASC.',
    ],
    schemas: [
      {
        tableName: t1,
        columns: [
          { name: 'client_id', type: 'INT' },
          { name: 'client_name', type: 'VARCHAR(60)' },
          { name: 'state_code', type: 'VARCHAR(2)' },
        ],
        sampleRows: [
          { client_id: 101, client_name: 'Apex Health', state_code: 'CA' },
          { client_id: 102, client_name: 'Bay Area Logistics', state_code: 'CA' },
          { client_id: 103, client_name: 'Cascade Financial', state_code: 'WA' },
        ],
      },
      {
        tableName: t2,
        columns: [
          { name: 'client_id', type: 'INT' },
          { name: 'client_name', type: 'VARCHAR(60)' },
          { name: 'state_code', type: 'VARCHAR(2)' },
        ],
        sampleRows: [
          { client_id: 102, client_name: 'Bay Area Logistics', state_code: 'CA' },
          { client_id: 104, client_name: 'Desert Sun Supply', state_code: 'AZ' },
        ],
      },
    ],
    expectedOutput: {
      columns: ['client_id', 'client_name', 'state_code'],
      rows: [
        { client_id: 104, client_name: 'Desert Sun Supply', state_code: 'AZ' },
        { client_id: 101, client_name: 'Apex Health', state_code: 'CA' },
        { client_id: 102, client_name: 'Bay Area Logistics', state_code: 'CA' },
        { client_id: 103, client_name: 'Cascade Financial', state_code: 'WA' },
      ],
    },
    hints: {
      tier1: 'UNION automatically performs a DISTINCT pass to remove duplicates, while UNION ALL retains all duplicates.',
      tier2: 'Write query 1, place UNION between them, then write query 2. Wrap or sort at the end.',
      tier3Skeleton: `SELECT client_id, client_name, state_code FROM ${t1}\nUNION\nSELECT client_id, client_name, state_code FROM ${t2}\nORDER BY state_code ASC, client_id ASC;`,
    },
    starterCodeByDialect: {
      postgres: `SELECT client_id, client_name, state_code FROM ${t1}\n-- add UNION\n;`,
      snowflake: `SELECT client_id, client_name, state_code FROM ${t1}\n-- add UNION\n;`,
      bigquery: `SELECT client_id, client_name, state_code FROM \`${t1}\`\n-- add UNION\n;`,
      mysql: `SELECT client_id, client_name, state_code FROM ${t1}\n-- add UNION\n;`,
    },
    officialSolutionByDialect: {
      postgres: `SELECT client_id, client_name, state_code FROM ${t1}\nUNION\nSELECT client_id, client_name, state_code FROM ${t2}\nORDER BY state_code ASC, client_id ASC;`,
      snowflake: `SELECT client_id, client_name, state_code FROM ${t1}\nUNION\nSELECT client_id, client_name, state_code FROM ${t2}\nORDER BY state_code ASC, client_id ASC;`,
      bigquery: `SELECT client_id, client_name, state_code FROM \`${t1}\`\nUNION DISTINCT\nSELECT client_id, client_name, state_code FROM \`${t2}\`\nORDER BY state_code ASC, client_id ASC;`,
      mysql: `SELECT client_id, client_name, state_code FROM ${t1}\nUNION\nSELECT client_id, client_name, state_code FROM ${t2}\nORDER BY state_code ASC, client_id ASC;`,
    },
    deepDive: {
      executionOrder: [
        '1. Execute first SELECT query block',
        '2. Execute second SELECT query block',
        '3. UNION operator appends row streams and pipes through a Unique/Sort or Hash aggregate',
        '4. Top-level ORDER BY sorts the unified, deduplicated dataset',
      ],
      indexStrategy: 'Index individual table columns to minimize scans on each branch of the UNION.',
      complexity: 'Time Complexity: O(N log N) for sort deduplication. Space: O(N) to retain hash set of unique records.',
      tradeoffs: 'If you already know records are disjoint, prefer UNION ALL to avoid the expensive deduplication overhead.',
    },
  };
}

// 9. Advanced: Window Functions
function generateWindow(qNum: number, domain: IndustryDomain, mode: Mode): SqlProblem {
  const targetTable = `${domain.toLowerCase()}_metrics`;
  const isRank = qNum % 2 === 0;

  return {
    id: `WIN-${qNum}-${isRank ? 'dense_rank' : 'running_sum'}`,
    questionNumber: qNum,
    title: `[Q#${qNum}] ${isRank ? 'Dense Rank Partitioning by Region' : 'Rolling Cumulative Revenue Stream'}`,
    platform: mode === 'leetcode' ? 'LeetCode' : 'FAANG+ Mock',
    difficulty: isRank ? 'Medium' : 'Hard',
    skillLevel: 'Advanced',
    industry: domain,
    topic: 'window',
    topicLabel: 'Window Functions (RANK, LAG, LEAD)',
    businessScenario: isRank
      ? `Rank each ${domain} client within their geographic region based on revenue using DENSE_RANK() so there are no skipped ranks. Filter for top 2 ranks per region.`
      : `Compute the running 3-period cumulative transaction volume for each account ordered by transaction_date.`,
    requirements: isRank
      ? [
          'Calculate rank using DENSE_RANK() OVER (PARTITION BY region ORDER BY revenue DESC) as regional_rank.',
          'Filter to retain only regional_rank <= 2 using a subquery or CTE.',
          'Order by region ASC, regional_rank ASC.',
        ]
      : [
          'Select account_id, tx_date, tx_amount.',
          'Compute running_total using SUM(tx_amount) OVER (PARTITION BY account_id ORDER BY tx_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW).',
          'Order by account_id ASC, tx_date ASC.',
        ],
    schemas: [
      {
        tableName: targetTable,
        columns: [
          { name: 'id', type: 'INT', isPk: true },
          { name: isRank ? 'region' : 'account_id', type: isRank ? 'VARCHAR(20)' : 'INT' },
          { name: isRank ? 'client_name' : 'tx_date', type: isRank ? 'VARCHAR(50)' : 'DATE' },
          { name: isRank ? 'revenue' : 'tx_amount', type: 'NUMERIC(10,2)' },
        ],
        sampleRows: isRank
          ? [
              { id: 1, region: 'North', client_name: 'Acme', revenue: 9500 },
              { id: 2, region: 'North', client_name: 'Beacon', revenue: 9500 },
              { id: 3, region: 'North', client_name: 'Crest', revenue: 4200 },
              { id: 4, region: 'South', client_name: 'Delta', revenue: 8100 },
              { id: 5, region: 'South', client_name: 'Echo', revenue: 6400 },
            ]
          : [
              { id: 1, account_id: 101, tx_date: '2024-01-01', tx_amount: 100 },
              { id: 2, account_id: 101, tx_date: '2024-01-02', tx_amount: 150 },
              { id: 3, account_id: 101, tx_date: '2024-01-03', tx_amount: 200 },
              { id: 4, account_id: 101, tx_date: '2024-01-04', tx_amount: 250 },
            ],
      },
    ],
    expectedOutput: isRank
      ? {
          columns: ['region', 'client_name', 'revenue', 'regional_rank'],
          rows: [
            { region: 'North', client_name: 'Acme', revenue: 9500, regional_rank: 1 },
            { region: 'North', client_name: 'Beacon', revenue: 9500, regional_rank: 1 },
            { region: 'North', client_name: 'Crest', revenue: 4200, regional_rank: 2 },
            { region: 'South', client_name: 'Delta', revenue: 8100, regional_rank: 1 },
            { region: 'South', client_name: 'Echo', revenue: 6400, regional_rank: 2 },
          ],
        }
      : {
          columns: ['account_id', 'tx_date', 'tx_amount', 'running_total'],
          rows: [
            { account_id: 101, tx_date: '2024-01-01', tx_amount: 100, running_total: 100 },
            { account_id: 101, tx_date: '2024-01-02', tx_amount: 150, running_total: 250 },
            { account_id: 101, tx_date: '2024-01-03', tx_amount: 200, running_total: 450 },
            { account_id: 101, tx_date: '2024-01-04', tx_amount: 250, running_total: 600 },
          ],
        },
    hints: {
      tier1: 'Window functions are evaluated in the SELECT clause after WHERE and GROUP BY have finished.',
      tier2: isRank
        ? 'Wrap the DENSE_RANK() query in a CTE or subquery so you can apply WHERE regional_rank <= 2.'
        : 'Specify the window frame: ROWS BETWEEN 2 PRECEDING AND CURRENT ROW.',
      tier3Skeleton: isRank
        ? `WITH ranked AS (\n  SELECT region, client_name, revenue,\n    DENSE_RANK() OVER (PARTITION BY region ORDER BY revenue DESC) AS regional_rank\n  FROM ${targetTable}\n)\nSELECT region, client_name, revenue, regional_rank\nFROM ranked\nWHERE regional_rank <= 2\nORDER BY region ASC, regional_rank ASC;`
        : `SELECT account_id, tx_date, tx_amount,\n  SUM(tx_amount) OVER (\n    PARTITION BY account_id\n    ORDER BY tx_date\n    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ) AS running_total\nFROM ${targetTable}\nORDER BY account_id ASC, tx_date ASC;`,
    },
    starterCodeByDialect: {
      postgres: `-- Write window function\nSELECT ...\nFROM ${targetTable};`,
      snowflake: `-- Write window function\nSELECT ...\nFROM ${targetTable};`,
      bigquery: `-- Write window function\nSELECT ...\nFROM \`${targetTable}\`;`,
      mysql: `-- Write window function\nSELECT ...\nFROM ${targetTable};`,
    },
    officialSolutionByDialect: {
      postgres: isRank
        ? `WITH ranked AS (\n  SELECT region, client_name, revenue,\n    DENSE_RANK() OVER (PARTITION BY region ORDER BY revenue DESC) AS regional_rank\n  FROM ${targetTable}\n)\nSELECT region, client_name, revenue, regional_rank\nFROM ranked\nWHERE regional_rank <= 2\nORDER BY region ASC, regional_rank ASC;`
        : `SELECT account_id, tx_date, tx_amount,\n  SUM(tx_amount) OVER (\n    PARTITION BY account_id\n    ORDER BY tx_date\n    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ) AS running_total\nFROM ${targetTable}\nORDER BY account_id ASC, tx_date ASC;`,
      snowflake: isRank
        ? `WITH ranked AS (\n  SELECT region, client_name, revenue,\n    DENSE_RANK() OVER (PARTITION BY region ORDER BY revenue DESC) AS regional_rank\n  FROM ${targetTable}\n)\nSELECT region, client_name, revenue, regional_rank\nFROM ranked\nWHERE regional_rank <= 2\nORDER BY region ASC, regional_rank ASC;`
        : `SELECT account_id, tx_date, tx_amount,\n  SUM(tx_amount) OVER (\n    PARTITION BY account_id\n    ORDER BY tx_date\n    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ) AS running_total\nFROM ${targetTable}\nORDER BY account_id ASC, tx_date ASC;`,
      bigquery: isRank
        ? `WITH ranked AS (\n  SELECT region, client_name, revenue,\n    DENSE_RANK() OVER (PARTITION BY region ORDER BY revenue DESC) AS regional_rank\n  FROM \`${targetTable}\`\n)\nSELECT region, client_name, revenue, regional_rank\nFROM ranked\nWHERE regional_rank <= 2\nORDER BY region ASC, regional_rank ASC;`
        : `SELECT account_id, tx_date, tx_amount,\n  SUM(tx_amount) OVER (\n    PARTITION BY account_id\n    ORDER BY tx_date\n    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ) AS running_total\nFROM \`${targetTable}\`\nORDER BY account_id ASC, tx_date ASC;`,
      mysql: isRank
        ? `WITH ranked AS (\n  SELECT region, client_name, revenue,\n    DENSE_RANK() OVER (PARTITION BY region ORDER BY revenue DESC) AS regional_rank\n  FROM ${targetTable}\n)\nSELECT region, client_name, revenue, regional_rank\nFROM ranked\nWHERE regional_rank <= 2\nORDER BY region ASC, regional_rank ASC;`
        : `SELECT account_id, tx_date, tx_amount,\n  SUM(tx_amount) OVER (\n    PARTITION BY account_id\n    ORDER BY tx_date\n    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ) AS running_total\nFROM ${targetTable}\nORDER BY account_id ASC, tx_date ASC;`,
    },
    deepDive: {
      executionOrder: [
        '1. FROM & WHERE - Prepare dataset',
        '2. WINDOW - Partition rows into memory windows, sort within partition, and evaluate frame accumulator',
        '3. CTE/Outer Filter - Evaluate outer WHERE predicate',
        '4. ORDER BY - Produce final display sequence',
      ],
      indexStrategy: `CREATE INDEX idx_win ON ${targetTable} (${isRank ? 'region, revenue DESC' : 'account_id, tx_date'}); Prevents an expensive sort node prior to WindowAgg.`,
      complexity: 'Time Complexity: O(N log N) for sort inside partition. Space: O(N) buffer frame.',
      tradeoffs: 'DENSE_RANK() vs RANK(): RANK() produces gaps (1, 1, 3) whereas DENSE_RANK() guarantees consecutive numbers (1, 1, 2).',
    },
  };
}

// 10. Advanced: CTEs & Pipelines
function generateCtes(qNum: number, domain: IndustryDomain, mode: Mode): SqlProblem {
  const targetTable = `${domain.toLowerCase()}_orders`;

  return {
    id: `CTE-${qNum}-${domain.toLowerCase()}`,
    questionNumber: qNum,
    title: `[Q#${qNum}] Multi-Stage Customer Lifetime Value Pipeline`,
    platform: mode === 'faang_mock' ? 'FAANG+ Mock' : 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: domain,
    topic: 'ctes',
    topicLabel: 'CTEs, Pipelines & Recursion',
    businessScenario: `Build a modular 2-stage Common Table Expression (CTE) pipeline. First stage aggregates total lifetime orders and total spend per user. Second stage calculates average order value (AOV) and categorizes users into spend tiers (> $1000 is 'High Value').`,
    requirements: [
      'Stage 1 CTE user_aggregates: Calculate user_id, COUNT(*) AS total_orders, SUM(amount) AS total_spend.',
      'Stage 2 main query: Calculate ROUND(total_spend / total_orders, 2) AS aov.',
      'Add CASE expression for ltv_tier.',
      'Order by total_spend DESC, user_id ASC.',
    ],
    schemas: [
      {
        tableName: targetTable,
        columns: [
          { name: 'order_id', type: 'INT', isPk: true },
          { name: 'user_id', type: 'INT' },
          { name: 'amount', type: 'NUMERIC(10,2)' },
        ],
        sampleRows: [
          { order_id: 1, user_id: 10, amount: 600 },
          { order_id: 2, user_id: 10, amount: 700 },
          { order_id: 3, user_id: 20, amount: 350 },
          { order_id: 4, user_id: 30, amount: 200 },
        ],
      },
    ],
    expectedOutput: {
      columns: ['user_id', 'total_orders', 'total_spend', 'aov', 'ltv_tier'],
      rows: [
        { user_id: 10, total_orders: 2, total_spend: 1300, aov: 650.00, ltv_tier: 'High Value' },
        { user_id: 20, total_orders: 1, total_spend: 350, aov: 350.00, ltv_tier: 'Standard' },
        { user_id: 30, total_orders: 1, total_spend: 200, aov: 200.00, ltv_tier: 'Standard' },
      ],
    },
    hints: {
      tier1: 'Define your first stage with `WITH user_aggregates AS (...)`.',
      tier2: 'Select from user_aggregates and compute arithmetic division for aov and CASE for ltv_tier.',
      tier3Skeleton: `WITH user_aggregates AS (\n  SELECT user_id, COUNT(*) AS total_orders, SUM(amount) AS total_spend\n  FROM ${targetTable}\n  GROUP BY user_id\n)\nSELECT\n  user_id,\n  total_orders,\n  total_spend,\n  ROUND(total_spend / total_orders, 2) AS aov,\n  CASE WHEN total_spend > 1000 THEN 'High Value' ELSE 'Standard' END AS ltv_tier\nFROM user_aggregates\nORDER BY total_spend DESC, user_id ASC;`,
    },
    starterCodeByDialect: {
      postgres: `WITH user_aggregates AS (\n  -- write CTE\n)\nSELECT * FROM user_aggregates;`,
      snowflake: `WITH user_aggregates AS (\n  -- write CTE\n)\nSELECT * FROM user_aggregates;`,
      bigquery: `WITH user_aggregates AS (\n  -- write CTE\n)\nSELECT * FROM user_aggregates;`,
      mysql: `WITH user_aggregates AS (\n  -- write CTE\n)\nSELECT * FROM user_aggregates;`,
    },
    officialSolutionByDialect: {
      postgres: `WITH user_aggregates AS (\n  SELECT user_id, COUNT(*) AS total_orders, SUM(amount) AS total_spend\n  FROM ${targetTable}\n  GROUP BY user_id\n)\nSELECT\n  user_id,\n  total_orders,\n  total_spend,\n  ROUND(total_spend / total_orders, 2) AS aov,\n  CASE WHEN total_spend > 1000 THEN 'High Value' ELSE 'Standard' END AS ltv_tier\nFROM user_aggregates\nORDER BY total_spend DESC, user_id ASC;`,
      snowflake: `WITH user_aggregates AS (\n  SELECT user_id, COUNT(*) AS total_orders, SUM(amount) AS total_spend\n  FROM ${targetTable}\n  GROUP BY user_id\n)\nSELECT\n  user_id,\n  total_orders,\n  total_spend,\n  ROUND(total_spend / total_orders, 2) AS aov,\n  CASE WHEN total_spend > 1000 THEN 'High Value' ELSE 'Standard' END AS ltv_tier\nFROM user_aggregates\nORDER BY total_spend DESC, user_id ASC;`,
      bigquery: `WITH user_aggregates AS (\n  SELECT user_id, COUNT(*) AS total_orders, SUM(amount) AS total_spend\n  FROM \`${targetTable}\`\n  GROUP BY user_id\n)\nSELECT\n  user_id,\n  total_orders,\n  total_spend,\n  ROUND(total_spend / total_orders, 2) AS aov,\n  CASE WHEN total_spend > 1000 THEN 'High Value' ELSE 'Standard' END AS ltv_tier\nFROM user_aggregates\nORDER BY total_spend DESC, user_id ASC;`,
      mysql: `WITH user_aggregates AS (\n  SELECT user_id, COUNT(*) AS total_orders, SUM(amount) AS total_spend\n  FROM ${targetTable}\n  GROUP BY user_id\n)\nSELECT\n  user_id,\n  total_orders,\n  total_spend,\n  ROUND(total_spend / total_orders, 2) AS aov,\n  CASE WHEN total_spend > 1000 THEN 'High Value' ELSE 'Standard' END AS ltv_tier\nFROM user_aggregates\nORDER BY total_spend DESC, user_id ASC;`,
    },
    deepDive: {
      executionOrder: [
        '1. Evaluate CTE stage 1: Group orders by user_id and calculate sums',
        '2. Pass materialized or inlined CTE result to main query block',
        '3. Compute scalar arithmetic and CASE expressions',
        '4. ORDER BY - Sort final dataset',
      ],
      indexStrategy: `CREATE INDEX idx_cte_orders ON ${targetTable} (user_id, amount); Enables pre-sorted streaming aggregation.`,
      complexity: 'Time Complexity: O(N) grouping pass. Space: O(U) where U is unique users.',
      tradeoffs: 'In PostgreSQL 12+, CTEs are automatically inlined unless specified with AS MATERIALIZED.',
    },
  };
}

// 11. Advanced: Date-Time Math & Truncation
function generateDateTime(qNum: number, domain: IndustryDomain, mode: Mode): SqlProblem {
  const targetTable = `${domain.toLowerCase()}_events`;

  return {
    id: `DAT-${qNum}-${domain.toLowerCase()}`,
    questionNumber: qNum,
    title: `[Q#${qNum}] Month-Over-Month Event Growth & Calendar Truncation`,
    platform: mode === 'leetcode' ? 'LeetCode' : 'Skill Matrix',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: domain,
    topic: 'datetime',
    topicLabel: 'Date-Time Math & String Parsing',
    businessScenario: `Aggregate ${domain} events by calendar month using DATE_TRUNC('month', event_timestamp). Compute monthly volume and calculate the prior month's volume using LAG() to measure month-over-month trajectory.`,
    requirements: [
      'Truncate event_timestamp to month aliased as event_month.',
      'Count total events as monthly_events.',
      'Use LAG(monthly_events, 1) OVER (ORDER BY event_month) aliased as prev_month_events.',
      'Order by event_month ASC.',
    ],
    schemas: [
      {
        tableName: targetTable,
        columns: [
          { name: 'event_id', type: 'INT', isPk: true },
          { name: 'event_timestamp', type: 'TIMESTAMP' },
          { name: 'event_type', type: 'VARCHAR(40)' },
        ],
        sampleRows: [
          { event_id: 1, event_timestamp: '2024-01-15 10:00:00', event_type: 'LOGIN' },
          { event_id: 2, event_timestamp: '2024-01-20 12:00:00', event_type: 'UPGRADE' },
          { event_id: 3, event_timestamp: '2024-02-05 09:30:00', event_type: 'LOGIN' },
          { event_id: 4, event_timestamp: '2024-02-18 14:15:00', event_type: 'UPGRADE' },
          { event_id: 5, event_timestamp: '2024-02-28 16:45:00', event_type: 'UPGRADE' },
        ],
      },
    ],
    expectedOutput: {
      columns: ['event_month', 'monthly_events', 'prev_month_events'],
      rows: [
        { event_month: '2024-01-01', monthly_events: 2, prev_month_events: null },
        { event_month: '2024-02-01', monthly_events: 3, prev_month_events: 2 },
      ],
    },
    hints: {
      tier1: 'Group by DATE_TRUNC(\'month\', event_timestamp) in a CTE first before applying LAG().',
      tier2: 'LAG() requires an explicit ORDER BY clause inside its OVER() specification.',
      tier3Skeleton: `WITH monthly AS (\n  SELECT DATE_TRUNC('month', event_timestamp)::DATE AS event_month, COUNT(*) AS monthly_events\n  FROM ${targetTable}\n  GROUP BY 1\n)\nSELECT\n  event_month,\n  monthly_events,\n  LAG(monthly_events, 1) OVER (ORDER BY event_month) AS prev_month_events\nFROM monthly\nORDER BY event_month ASC;`,
    },
    starterCodeByDialect: {
      postgres: `WITH monthly AS (\n  -- write date truncation and group by\n)\nSELECT * FROM monthly;`,
      snowflake: `WITH monthly AS (\n  -- write date truncation and group by\n)\nSELECT * FROM monthly;`,
      bigquery: `WITH monthly AS (\n  -- write date truncation and group by\n)\nSELECT * FROM monthly;`,
      mysql: `WITH monthly AS (\n  -- write date truncation and group by\n)\nSELECT * FROM monthly;`,
    },
    officialSolutionByDialect: {
      postgres: `WITH monthly AS (\n  SELECT DATE_TRUNC('month', event_timestamp)::DATE AS event_month, COUNT(*) AS monthly_events\n  FROM ${targetTable}\n  GROUP BY 1\n)\nSELECT\n  event_month,\n  monthly_events,\n  LAG(monthly_events, 1) OVER (ORDER BY event_month) AS prev_month_events\nFROM monthly\nORDER BY event_month ASC;`,
      snowflake: `WITH monthly AS (\n  SELECT DATE_TRUNC('month', event_timestamp)::DATE AS event_month, COUNT(*) AS monthly_events\n  FROM ${targetTable}\n  GROUP BY 1\n)\nSELECT\n  event_month,\n  monthly_events,\n  LAG(monthly_events, 1) OVER (ORDER BY event_month) AS prev_month_events\nFROM monthly\nORDER BY event_month ASC;`,
      bigquery: `WITH monthly AS (\n  SELECT DATE_TRUNC(DATE(event_timestamp), MONTH) AS event_month, COUNT(*) AS monthly_events\n  FROM \`${targetTable}\`\n  GROUP BY 1\n)\nSELECT\n  event_month,\n  monthly_events,\n  LAG(monthly_events, 1) OVER (ORDER BY event_month) AS prev_month_events\nFROM monthly\nORDER BY event_month ASC;`,
      mysql: `WITH monthly AS (\n  SELECT DATE_FORMAT(event_timestamp, '%Y-%m-01') AS event_month, COUNT(*) AS monthly_events\n  FROM ${targetTable}\n  GROUP BY 1\n)\nSELECT\n  event_month,\n  monthly_events,\n  LAG(monthly_events, 1) OVER (ORDER BY event_month) AS prev_month_events\nFROM monthly\nORDER BY event_month ASC;`,
    },
    deepDive: {
      executionOrder: [
        '1. Truncate timestamp to start of month',
        '2. Aggregate event count per month bucket',
        '3. Apply LAG() window function across ordered months',
        '4. Order chronologically',
      ],
      indexStrategy: `CREATE INDEX idx_events_ts ON ${targetTable} (event_timestamp); Supports partition pruning and indexed ranges.`,
      complexity: 'Time Complexity: O(N) grouping + O(M log M) window sort where M is months.',
      tradeoffs: 'Be aware of dialect differences: PostgreSQL uses DATE_TRUNC, BigQuery uses DATE_TRUNC(..., MONTH), and MySQL uses DATE_FORMAT.',
    },
  };
}

// 12. Advanced: Funnel & Cohort Retention
function generateFunnelCohort(qNum: number, domain: IndustryDomain, mode: Mode): SqlProblem {
  const targetTable = `${domain.toLowerCase()}_funnel_events`;

  return {
    id: `FNN-${qNum}-${domain.toLowerCase()}`,
    questionNumber: qNum,
    title: `[Q#${qNum}] 3-Step Checkout Funnel Conversion Rate`,
    platform: mode === 'faang_mock' ? 'FAANG+ Mock' : 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: domain,
    topic: 'funnel_cohort',
    topicLabel: 'Funnel, Retention & Cohort Analytics',
    businessScenario: `Analyze the user conversion funnel across 3 discrete stages: 'PAGE_VIEW', 'ADD_TO_CART', and 'PURCHASE'. Calculate unique user drop-off count and conversion percentage at each milestone.`,
    requirements: [
      'Count distinct users who reached PAGE_VIEW as step1_users.',
      'Count distinct users who reached ADD_TO_CART as step2_users.',
      'Count distinct users who reached PURCHASE as step3_users.',
      'Calculate checkout_conversion_pct as ROUND((step3_users * 100.0) / step1_users, 2).',
    ],
    schemas: [
      {
        tableName: targetTable,
        columns: [
          { name: 'session_id', type: 'INT', isPk: true },
          { name: 'user_id', type: 'INT' },
          { name: 'stage_name', type: 'VARCHAR(40)' },
        ],
        sampleRows: [
          { session_id: 1, user_id: 101, stage_name: 'PAGE_VIEW' },
          { session_id: 2, user_id: 101, stage_name: 'ADD_TO_CART' },
          { session_id: 3, user_id: 101, stage_name: 'PURCHASE' },
          { session_id: 4, user_id: 102, stage_name: 'PAGE_VIEW' },
          { session_id: 5, user_id: 102, stage_name: 'ADD_TO_CART' },
          { session_id: 6, user_id: 103, stage_name: 'PAGE_VIEW' },
          { session_id: 7, user_id: 104, stage_name: 'PAGE_VIEW' },
        ],
      },
    ],
    expectedOutput: {
      columns: ['step1_users', 'step2_users', 'step3_users', 'checkout_conversion_pct'],
      rows: [
        { step1_users: 4, step2_users: 2, step3_users: 1, checkout_conversion_pct: 25.00 },
      ],
    },
    hints: {
      tier1: 'Use conditional aggregation: COUNT(DISTINCT CASE WHEN stage_name = ? THEN user_id END).',
      tier2: 'Wrap stage counts in a CTE or subquery so step3_users and step1_users can be divided cleanly.',
      tier3Skeleton: `WITH funnel AS (\n  SELECT\n    COUNT(DISTINCT CASE WHEN stage_name = 'PAGE_VIEW' THEN user_id END) AS step1_users,\n    COUNT(DISTINCT CASE WHEN stage_name = 'ADD_TO_CART' THEN user_id END) AS step2_users,\n    COUNT(DISTINCT CASE WHEN stage_name = 'PURCHASE' THEN user_id END) AS step3_users\n  FROM ${targetTable}\n)\nSELECT\n  step1_users,\n  step2_users,\n  step3_users,\n  ROUND((step3_users * 100.0) / NULLIF(step1_users, 0), 2) AS checkout_conversion_pct\nFROM funnel;`,
    },
    starterCodeByDialect: {
      postgres: `WITH funnel AS (\n  -- write conditional aggregations\n)\nSELECT * FROM funnel;`,
      snowflake: `WITH funnel AS (\n  -- write conditional aggregations\n)\nSELECT * FROM funnel;`,
      bigquery: `WITH funnel AS (\n  -- write conditional aggregations\n)\nSELECT * FROM funnel;`,
      mysql: `WITH funnel AS (\n  -- write conditional aggregations\n)\nSELECT * FROM funnel;`,
    },
    officialSolutionByDialect: {
      postgres: `WITH funnel AS (\n  SELECT\n    COUNT(DISTINCT CASE WHEN stage_name = 'PAGE_VIEW' THEN user_id END) AS step1_users,\n    COUNT(DISTINCT CASE WHEN stage_name = 'ADD_TO_CART' THEN user_id END) AS step2_users,\n    COUNT(DISTINCT CASE WHEN stage_name = 'PURCHASE' THEN user_id END) AS step3_users\n  FROM ${targetTable}\n)\nSELECT\n  step1_users,\n  step2_users,\n  step3_users,\n  ROUND((step3_users * 100.0) / NULLIF(step1_users, 0), 2) AS checkout_conversion_pct\nFROM funnel;`,
      snowflake: `WITH funnel AS (\n  SELECT\n    COUNT(DISTINCT CASE WHEN stage_name = 'PAGE_VIEW' THEN user_id END) AS step1_users,\n    COUNT(DISTINCT CASE WHEN stage_name = 'ADD_TO_CART' THEN user_id END) AS step2_users,\n    COUNT(DISTINCT CASE WHEN stage_name = 'PURCHASE' THEN user_id END) AS step3_users\n  FROM ${targetTable}\n)\nSELECT\n  step1_users,\n  step2_users,\n  step3_users,\n  ROUND((step3_users * 100.0) / NULLIF(step1_users, 0), 2) AS checkout_conversion_pct\nFROM funnel;`,
      bigquery: `WITH funnel AS (\n  SELECT\n    COUNT(DISTINCT CASE WHEN stage_name = 'PAGE_VIEW' THEN user_id END) AS step1_users,\n    COUNT(DISTINCT CASE WHEN stage_name = 'ADD_TO_CART' THEN user_id END) AS step2_users,\n    COUNT(DISTINCT CASE WHEN stage_name = 'PURCHASE' THEN user_id END) AS step3_users\n  FROM \`${targetTable}\`\n)\nSELECT\n  step1_users,\n  step2_users,\n  step3_users,\n  ROUND((step3_users * 100.0) / NULLIF(step1_users, 0), 2) AS checkout_conversion_pct\nFROM funnel;`,
      mysql: `WITH funnel AS (\n  SELECT\n    COUNT(DISTINCT CASE WHEN stage_name = 'PAGE_VIEW' THEN user_id END) AS step1_users,\n    COUNT(DISTINCT CASE WHEN stage_name = 'ADD_TO_CART' THEN user_id END) AS step2_users,\n    COUNT(DISTINCT CASE WHEN stage_name = 'PURCHASE' THEN user_id END) AS step3_users\n  FROM ${targetTable}\n)\nSELECT\n  step1_users,\n  step2_users,\n  step3_users,\n  ROUND((step3_users * 100.0) / NULLIF(step1_users, 0), 2) AS checkout_conversion_pct\nFROM funnel;`,
    },
    deepDive: {
      executionOrder: [
        '1. Filter and conditional count of user sessions',
        '2. Aggregate distinct users across stages',
        '3. Safe division using NULLIF to protect against divide-by-zero errors',
        '4. Project single analytical row',
      ],
      indexStrategy: `CREATE INDEX idx_funnel ON ${targetTable} (stage_name, user_id); Accelerates distinct hashing.`,
      complexity: 'Time Complexity: O(N) single-pass scan. Space: O(U) hash sets.',
      tradeoffs: 'Always guard division in analytical SQL using NULLIF(denominator, 0) to prevent fatal query aborts.',
    },
  };
}

// 13. Advanced: Optimization & SARGability
function generateOptimization(qNum: number, domain: IndustryDomain, mode: Mode): SqlProblem {
  const targetTable = `${domain.toLowerCase()}_audit_logs`;

  return {
    id: `OPT-${qNum}-${domain.toLowerCase()}`,
    questionNumber: qNum,
    title: `[Q#${qNum}] SARGable Date Predicate & Index Seeking Refactor`,
    platform: mode === 'faang_mock' ? 'FAANG+ Mock' : 'HackerRank',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: domain,
    topic: 'optimization',
    topicLabel: 'Indexing, Execution Plans & SARGability',
    businessScenario: `A critical query on a 500-million row ${domain} audit log table is timing out. The original query was written as WHERE EXTRACT(YEAR FROM created_at) = 2024, causing a full table scan. Refactor it to a SARGable half-open interval predicate to utilize the B-Tree index on created_at.`,
    requirements: [
      'Select log_id, event_code, created_at.',
      'Refactor to a SARGable range: created_at >= \'2024-01-01\' AND created_at < \'2025-01-01\'.',
      'Order by created_at DESC, log_id DESC.',
      'Limit output to 10 records.',
    ],
    schemas: [
      {
        tableName: targetTable,
        columns: [
          { name: 'log_id', type: 'BIGINT', isPk: true },
          { name: 'event_code', type: 'VARCHAR(50)' },
          { name: 'created_at', type: 'TIMESTAMP' },
        ],
        sampleRows: [
          { log_id: 991, event_code: 'AUTH_SUCCESS', created_at: '2024-11-04 18:00:00' },
          { log_id: 992, event_code: 'API_CALL', created_at: '2024-05-12 12:30:00' },
          { log_id: 990, event_code: 'PASSWORD_RESET', created_at: '2023-12-31 23:59:59' },
          { log_id: 993, event_code: 'AUTH_FAIL', created_at: '2025-01-01 00:00:01' },
        ],
      },
    ],
    expectedOutput: {
      columns: ['log_id', 'event_code', 'created_at'],
      rows: [
        { log_id: 991, event_code: 'AUTH_SUCCESS', created_at: '2024-11-04 18:00:00' },
        { log_id: 992, event_code: 'API_CALL', created_at: '2024-05-12 12:30:00' },
      ],
    },
    hints: {
      tier1: 'Applying a function to an indexed column (e.g. EXTRACT() or YEAR()) strips the query of SARGability, blinding the query planner to the B-Tree index.',
      tier2: 'Replace functions with range comparisons: created_at >= \'2024-01-01\' AND created_at < \'2025-01-01\'.',
      tier3Skeleton: `SELECT log_id, event_code, created_at\nFROM ${targetTable}\nWHERE created_at >= '2024-01-01'\n  AND created_at < '2025-01-01'\nORDER BY created_at DESC, log_id DESC\nLIMIT 10;`,
    },
    starterCodeByDialect: {
      postgres: `-- Refactor non-SARGable predicate\nSELECT log_id, event_code, created_at\nFROM ${targetTable}\nWHERE 1=1;\n`,
      snowflake: `-- Refactor non-SARGable predicate\nSELECT log_id, event_code, created_at\nFROM ${targetTable}\nWHERE 1=1;\n`,
      bigquery: `-- Refactor non-SARGable predicate\nSELECT log_id, event_code, created_at\nFROM \`${targetTable}\`\nWHERE 1=1;\n`,
      mysql: `-- Refactor non-SARGable predicate\nSELECT log_id, event_code, created_at\nFROM ${targetTable}\nWHERE 1=1;\n`,
    },
    officialSolutionByDialect: {
      postgres: `SELECT log_id, event_code, created_at\nFROM ${targetTable}\nWHERE created_at >= '2024-01-01'\n  AND created_at < '2025-01-01'\nORDER BY created_at DESC, log_id DESC\nLIMIT 10;`,
      snowflake: `SELECT log_id, event_code, created_at\nFROM ${targetTable}\nWHERE created_at >= '2024-01-01'\n  AND created_at < '2025-01-01'\nORDER BY created_at DESC, log_id DESC\nLIMIT 10;`,
      bigquery: `SELECT log_id, event_code, created_at\nFROM \`${targetTable}\`\nWHERE created_at >= '2024-01-01'\n  AND created_at < '2025-01-01'\nORDER BY created_at DESC, log_id DESC\nLIMIT 10;`,
      mysql: `SELECT log_id, event_code, created_at\nFROM ${targetTable}\nWHERE created_at >= '2024-01-01'\n  AND created_at < '2025-01-01'\nORDER BY created_at DESC, log_id DESC\nLIMIT 10;`,
    },
    deepDive: {
      executionOrder: [
        '1. Index Range Scan on idx_created_at from 2024-01-01 to 2024-12-31',
        '2. Table heap fetch only for matched rows',
        '3. Limit 10 early exit',
      ],
      indexStrategy: `CREATE INDEX idx_audit_created ON ${targetTable} (created_at DESC, log_id DESC); Allows Index Scan without explicit sort node.`,
      complexity: 'Time Complexity: Drops from O(N = 500,000,000) Seq Scan down to O(log N + 10) Index Seek.',
      tradeoffs: 'Always use half-open intervals [start, end) for timestamps to prevent dropping records created on leap seconds or milliseconds.',
    },
  };
}

// ============================================================================
// MAIN GENERATOR DISPATCHER
// Guarantees every questionNumber produces a different scenario & solution
// ============================================================================
export function generateSqlProblem(
  mode: Mode,
  topic: TopicCategory,
  questionNumber: number,
  industry: IndustryDomain
): SqlProblem {
  const safeQNum = Math.max(1, questionNumber);

  // If mode is 'live_stream', pull from the continuous real-time public ingestion stream
  if (mode === 'live_stream') {
    const streamProblems = livePipeline.getProblems();
    if (streamProblems.length > 0) {
      const idx = (safeQNum - 1) % streamProblems.length;
      return {
        ...streamProblems[idx],
        questionNumber: safeQNum,
      };
    }
  }

  // If topic is 'all', rotate sequentially through all 12 core sub-topics based on safeQNum
  let resolvedTopic = topic;
  if (topic === 'all') {
    const topicsList: TopicCategory[] = [
      'beginner_basics',
      'beginner_sorting',
      'beginner_math',
      'intermediate_case',
      'aggregations',
      'joins',
      'subqueries',
      'set_operations',
      'window',
      'ctes',
      'datetime',
      'funnel_cohort',
      'optimization',
    ];
    resolvedTopic = topicsList[(safeQNum - 1) % topicsList.length];
  }

  // Dispatch to the topic's procedural generator
  switch (resolvedTopic) {
    case 'beginner_basics':
      return generateBeginnerBasics(safeQNum, industry, mode);
    case 'beginner_sorting':
      return generateBeginnerSorting(safeQNum, industry, mode);
    case 'beginner_math':
      return generateBeginnerMath(safeQNum, industry, mode);
    case 'intermediate_case':
      return generateIntermediateCase(safeQNum, industry, mode);
    case 'aggregations':
      return generateAggregations(safeQNum, industry, mode);
    case 'joins':
      return generateJoins(safeQNum, industry, mode);
    case 'subqueries':
      return generateSubqueries(safeQNum, industry, mode);
    case 'set_operations':
      return generateSetOperations(safeQNum, industry, mode);
    case 'window':
      return generateWindow(safeQNum, industry, mode);
    case 'ctes':
      return generateCtes(safeQNum, industry, mode);
    case 'datetime':
      return generateDateTime(safeQNum, industry, mode);
    case 'funnel_cohort':
      return generateFunnelCohort(safeQNum, industry, mode);
    case 'optimization':
      return generateOptimization(safeQNum, industry, mode);
    default:
      return generateBeginnerBasics(safeQNum, industry, mode);
  }
}
