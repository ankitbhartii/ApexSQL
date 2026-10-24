/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SQL Sanitizer & Sandbox Security Enforcement
 * Hardens in-memory AlaSQL execution against AST manipulation,
 * filesystem/network escapes, prototype pollution, and resource exhaustion DoS.
 */

import alasql from 'alasql';

// ============================================================================
// 1. GLOBAL ALASQL SANDBOX HARDENING
// ============================================================================
// Enforce execution bounds to prevent infinite loop / recursive CTE freezes
try {
  if (alasql && alasql.options) {
    // Hard cap loop iterations in joins/loops
    (alasql.options as any).loopbreak = 1000;
    // Hard cap recursive CTE iterations
    (alasql.options as any).maxCteIterations = 500;
    // Suppress internal stack logging to prevent information disclosure
    alasql.options.errorlog = false;
    // Disable any prototype modifiers
    alasql.options.modifier = undefined;
  }
} catch (e) {
  console.warn('[SQL Sandbox] Failed to set alasql safety options:', e);
}

// Prohibited command patterns (dangerous execution, filesystem escapes, plugins)
const PROHIBITED_KEYWORDS = [
  // AlaSQL filesystem / administrative statement escapes
  /\bSOURCE\b/i,
  /\bATTACH\b/i,
  /\bDETACH\b/i,
  /\bRESTORE\b/i,
  /\bBACKUP\b/i,
  /\bSAVE\b/i,
  /\bVALUE\s+OF\b/i,
  /\bMETRICS\b/i,
  /\bIMPORT\b/i,
  /\bEXPORT\b/i,
  /\bREQUIRE\b/i,
  // File loaders
  /\bFROM\s+(?:CSV|TSV|JSON|XLSX|TAB)\s*\(/i,
  /\bINTO\s+(?:CSV|TSV|JSON|XLSX|TAB)\s*\(/i,
  // Code execution & shell escapes
  /\bEXEC\s+/i,
  /\bEXECUTE\s+/i,
  /\bCALL\s+/i,
  /\bXP_[a-zA-Z0-9_]+/i,
  /\bSP_[a-zA-Z0-9_]+/i,
  /\bEVAL\s*\(/i,
  /\bFUNCTION\s*\(/i,
  // JavaScript & Prototype Pollution vectors
  /__proto__/i,
  /constructor\s*\[/i,
  /prototype/i,
  /\bprocess\./i,
  /\bwindow\./i,
  /\bdocument\./i,
  /\bglobal\./i,
];

// Destructive statements prohibited during practice problem evaluation
const DESTRUCTIVE_KEYWORDS = [
  /\bDROP\s+(?:TABLE|DATABASE|VIEW|INDEX)/i,
  /\bALTER\s+(?:TABLE|DATABASE|VIEW)/i,
  /\bTRUNCATE\s+(?:TABLE)?/i,
  /\bGRANT\s+/i,
  /\bREVOKE\s+/i,
  /\bSHUTDOWN\b/i,
];

export interface SqlValidationResult {
  isSafe: boolean;
  reason?: string;
  sanitizedSql: string;
}

/**
 * Removes comments and normalizes whitespace
 */
export function stripSqlComments(sql: string): string {
  if (!sql) return '';
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, ' ') // Strip multi-line comments
    .replace(/--.*$/gm, ' ')           // Strip single-line comments
    .replace(/#.*$/gm, ' ')            // Strip hash comments
    .trim();
}

/**
 * Validates a SQL query against prohibited commands, destructive statements,
 * and sandbox escape attempts.
 */
export function validateSafeSqlQuery(
  rawSql: string,
  options: { allowDml?: boolean; maxLen?: number } = {}
): SqlValidationResult {
  const { allowDml = false, maxLen = 10000 } = options;

  if (!rawSql || typeof rawSql !== 'string') {
    return { isSafe: false, reason: 'Query cannot be empty.', sanitizedSql: '' };
  }

  if (rawSql.length > maxLen) {
    return {
      isSafe: false,
      reason: `Query exceeds maximum permitted length of ${maxLen} characters.`,
      sanitizedSql: '',
    };
  }

  const clean = stripSqlComments(rawSql);

  if (!clean) {
    return { isSafe: false, reason: 'Query cannot be empty.', sanitizedSql: '' };
  }

  // Check prohibited sandbox escape keywords
  for (const pattern of PROHIBITED_KEYWORDS) {
    if (pattern.test(clean)) {
      return {
        isSafe: false,
        reason: 'Security Violation: Query contains prohibited administrative, system, or file-access commands.',
        sanitizedSql: clean,
      };
    }
  }

  // Check destructive keywords if DML is disallowed (default for practice drills)
  if (!allowDml) {
    for (const pattern of DESTRUCTIVE_KEYWORDS) {
      if (pattern.test(clean)) {
        return {
          isSafe: false,
          reason: 'Security Violation: Data Definition (DDL) and destructive commands are restricted in practice mode.',
          sanitizedSql: clean,
        };
      }
    }

    // Practice queries must be standard queries: starting with SELECT or WITH
    const startsWithAllowed = /^\s*(?:SELECT|WITH|EXPLAIN)\b/i.test(clean);
    if (!startsWithAllowed) {
      return {
        isSafe: false,
        reason: 'Query must be a valid read query beginning with SELECT or WITH.',
        sanitizedSql: clean,
      };
    }
  }

  return {
    isSafe: true,
    sanitizedSql: clean,
  };
}

/**
 * Bounds the number of returned rows to prevent memory exhaustion DoS
 */
export const MAX_SAFE_RESULT_ROWS = 1000;

export function capQueryResults<T>(rows: T[], maxRows: number = MAX_SAFE_RESULT_ROWS): {
  rows: T[];
  isTruncated: boolean;
  totalCount: number;
} {
  if (!Array.isArray(rows)) {
    return { rows: [], isTruncated: false, totalCount: 0 };
  }

  if (rows.length > maxRows) {
    return {
      rows: rows.slice(0, maxRows),
      isTruncated: true,
      totalCount: rows.length,
    };
  }

  return {
    rows,
    isTruncated: false,
    totalCount: rows.length,
  };
}
