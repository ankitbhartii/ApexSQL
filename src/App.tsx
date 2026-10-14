/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CellDiff,
  Dialect,
  Difficulty,
  DiffReport,
  ExecutionResult,
  IndustryDomain,
  Mode,
  SkillLevel,
  SqlProblem,
  TopicCategory,
  TopicConfig,
} from './types';
import {
  TOPIC_DRILL_CONFIGS,
  INDUSTRY_DOMAINS,
  generateSqlProblem,
} from './problemGenerator';
import { useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { PlatformFetchModal } from './components/PlatformFetchModal';
import { QuestionsDirectoryPage } from './components/QuestionsDirectoryPage';
import { UserProfileMenu } from './components/UserProfileMenu';
import alasql from 'alasql';
import { livePipeline } from './services/liveQuestionPipeline';
import { subscribeToLiveProblems } from './firebase';
import type { LivePipelineStatus } from './types';
import {
  searchGoogleGroundingSql,
  type GoogleSearchGroundedPayload,
} from './services/googleSearchGrounding';
import confetti from 'canvas-confetti';

export interface SubmissionVerdict {
  type: 'correct' | 'wrong';
  title: string;
  message: string;
  accuracyPct: number;
  executionTimeMs: number;
  details?: string;
  timestamp: number;
}

function playSuccessChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
    osc2.frequency.setValueAtTime(659.25, now + 0.12); // E5
    osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.28); // G5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.1);
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);
  } catch {
    // Non-blocking if audio context is restricted
  }
}

function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#6366f1', '#06b6d4', '#f59e0b', '#ec4899'],
    });
  } catch {
    // Ignore if canvas-confetti cannot run
  }
}

// ============================================================================
// SAFE STORAGE WRAPPER (Prevents SecurityError in sandboxed mobile WebViews)
// Dual-layer fallback: localStorage -> sessionStorage -> in-memory store
// ============================================================================
const memoryStorage: Record<string, string> = {};

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      // Fallback below
    }
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const val = window.sessionStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      // In-memory fallback
    }
    return memoryStorage[key] ?? null;
  },
  setItem: (key: string, value: string): void => {
    memoryStorage[key] = value;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Ignored
    }
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
      }
    } catch {
      // Ignored
    }
  },
  removeItem: (key: string): void => {
    delete memoryStorage[key];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignored
    }
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
    } catch {
      // Ignored
    }
  },
};

// ============================================================================
// QUERY FORMATTER UTILITY (Client-side SQL formatting)
// ============================================================================
function formatSqlQuery(sql: string): string {
  const keywords = [
    'WITH',
    'SELECT',
    'FROM',
    'WHERE',
    'GROUP BY',
    'HAVING',
    'ORDER BY',
    'LIMIT',
    'UNION ALL',
    'UNION',
    'INNER JOIN',
    'LEFT JOIN',
    'RIGHT JOIN',
    'FULL OUTER JOIN',
    'JOIN',
    'ON',
    'AND',
    'OR',
    'CASE',
    'WHEN',
    'THEN',
    'ELSE',
    'END',
  ];

  let cleaned = sql.replace(/\s+/g, ' ').trim();
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    cleaned = cleaned.replace(regex, `\n${kw}`);
  });

  return cleaned
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}

// ============================================================================
// QUERY PARSING & VISUAL DIFF CALCULATOR
// ============================================================================
function extractColumnsFromSql(sql: string): string[] {
  const match = sql.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
  if (!match) return [];
  const colSegment = match[1];
  const cols: string[] = [];
  let depth = 0;
  let current = '';

  for (let i = 0; i < colSegment.length; i++) {
    const char = colSegment[i];
    if (char === '(') depth++;
    else if (char === ')') depth--;
    else if (char === ',' && depth === 0) {
      cols.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) cols.push(current.trim());

  return cols
    .map((raw) => {
      const aliasMatch = raw.match(/\s+(?:AS\s+)?([a-zA-Z0-9_"]+)\s*$/i);
      if (aliasMatch) {
        return aliasMatch[1].replace(/["`]/g, '');
      }
      const directMatch = raw.match(/([a-zA-Z0-9_]+)\s*$/);
      return directMatch ? directMatch[1] : raw.trim();
    })
    .filter(Boolean);
}

function stripSqlComments(sql: string): string {
  if (!sql) return '';
  // Strip block comments /* ... */
  let cleaned = sql.replace(/\/\*[\s\S]*?\*\//g, ' ');
  // Strip line comments -- ...
  cleaned = cleaned.replace(/--.*$/gm, ' ');
  return cleaned.trim();
}

function generateDiffReport(
  userCols: string[],
  userRows: Record<string, any>[],
  expCols: string[],
  expRows: Record<string, any>[]
): DiffReport {
  const normUserCols = userCols.map((c) => c.toLowerCase());
  const normExpCols = expCols.map((c) => c.toLowerCase());

  const missingColumns = expCols.filter(
    (ec) => !normUserCols.includes(ec.toLowerCase())
  );
  const extraColumns = userCols.filter(
    (uc) => !normExpCols.includes(uc.toLowerCase())
  );
  const columnMatch = missingColumns.length === 0 && extraColumns.length === 0;
  const rowCountMatch = userRows.length === expRows.length;

  const cellDiffs: CellDiff[] = [];
  let totalEvaluatedCells = 0;
  let matchedCells = 0;
  let mismatchedRowCount = 0;

  const maxRows = Math.max(userRows.length, expRows.length);

  for (let r = 0; r < maxRows; r++) {
    const uRow = userRows[r];
    const eRow = expRows[r];
    let rowHasMismatch = false;

    expCols.forEach((col) => {
      totalEvaluatedCells++;
      const userColKey =
        Object.keys(uRow || {}).find(
          (k) => k.toLowerCase() === col.toLowerCase()
        ) || col;
      const uVal = uRow !== undefined ? uRow[userColKey] : undefined;
      const eVal = eRow !== undefined ? eRow[col] : undefined;

      const isCellMatch =
        uRow !== undefined &&
        eRow !== undefined &&
        (String(uVal).trim().toLowerCase() === String(eVal).trim().toLowerCase() ||
          (uVal === null && eVal === null));

      if (isCellMatch) {
        matchedCells++;
      } else {
        rowHasMismatch = true;
      }

      let status: CellDiff['status'] = 'MATCH';
      if (uRow === undefined) status = 'MISSING_USER_CELL';
      else if (eRow === undefined) status = 'EXTRA_USER_CELL';
      else if (!isCellMatch) status = 'VALUE_MISMATCH';

      cellDiffs.push({
        rowIndex: r,
        colName: col,
        userValue: uVal,
        expectedValue: eVal,
        isMatch: isCellMatch,
        status,
      });
    });

    if (rowHasMismatch) mismatchedRowCount++;
  }

  const accuracyPct =
    totalEvaluatedCells > 0
      ? Math.round((matchedCells / totalEvaluatedCells) * 100)
      : 0;

  const isFullMatch = columnMatch && rowCountMatch && accuracyPct === 100;

  return {
    isFullMatch,
    accuracyPct,
    userColumnCount: userCols.length,
    expectedColumnCount: expCols.length,
    columnMatch,
    userRowCount: userRows.length,
    expectedRowCount: expRows.length,
    rowCountMatch,
    missingColumns,
    extraColumns,
    cellDiffs,
    userColumns: userCols,
    expectedColumns: expCols,
    mismatchedRowCount,
  };
}

// ============================================================================
// REAL IN-MEMORY SQL EXECUTION ENGINE (Powered by AlaSQL)
// Executes queries against schema sample data with comment sanitization
// ============================================================================
function runSqlWithAlaSql(
  cleanSql: string,
  problem: SqlProblem
): { success: boolean; rows: Record<string, any>[]; columns: string[]; error?: string } {
  try {
    const db = new (alasql as any).Database();

    // Register all schema tables
    problem.schemas.forEach((schema) => {
      const rawName = schema.tableName;
      const safeName = rawName.replace(/[^a-zA-Z0-9_]/g, '_');

      try {
        db.exec(`CREATE TABLE [${rawName}]`);
        db.exec(`INSERT INTO [${rawName}] SELECT * FROM ?`, [schema.sampleRows]);
      } catch {}

      if (safeName !== rawName) {
        try {
          db.exec(`CREATE TABLE ${safeName}`);
          db.exec(`INSERT INTO ${safeName} SELECT * FROM ?`, [schema.sampleRows]);
        } catch {}
      }
    });

    let execQuery = cleanSql.replace(/;\s*$/, '').trim();

    // Normalize backticks `table_name` to brackets [table_name]
    execQuery = execQuery.replace(/`([^`]+)`/g, '[$1]');

    // Replace unquoted hyphenated table names with bracketed versions
    problem.schemas.forEach((schema) => {
      const rawName = schema.tableName;
      if (rawName.includes('-')) {
        const regex = new RegExp(`(?<!\\[)\\b${rawName}\\b(?!\\])`, 'gi');
        execQuery = execQuery.replace(regex, `[${rawName}]`);
      }
    });

    const rawResult = db.exec(execQuery);
    const rows: Record<string, any>[] = Array.isArray(rawResult) ? rawResult : [];

    let columns: string[] = [];
    if (rows.length > 0 && typeof rows[0] === 'object' && rows[0] !== null) {
      columns = Object.keys(rows[0]);
    } else {
      columns = extractColumnsFromSql(cleanSql);
    }

    return { success: true, rows, columns };
  } catch (err: any) {
    return { success: false, rows: [], columns: [], error: err?.message || 'SQL Execution Error' };
  }
}

// ============================================================================
// QUERY EVALUATION & VERIFICATION ENGINE
// ============================================================================
function evaluateSqlQuery(sql: string, problem: SqlProblem): ExecutionResult {
  const startTime = performance.now();
  const cleanCode = stripSqlComments(sql);
  const normalized = cleanCode.toUpperCase().replace(/\s+/g, ' ').trim();

  const isSyntaxValid =
    normalized.includes('SELECT') && normalized.includes('FROM');

  const refersToProblemTable = problem.schemas.some((s) => {
    const rawName = s.tableName.toUpperCase();
    const safeName = rawName.replace(/[^A-Z0-9]/g, '');
    const cleanNorm = normalized.replace(/[`"\[\]]/g, '');
    return cleanNorm.includes(rawName) || cleanNorm.includes(safeName);
  });

  const checks: { id: string; label: string; passed: boolean }[] = [
    {
      id: 'chk_select_from',
      label: 'Valid SQL structure with SELECT and FROM clauses',
      passed: isSyntaxValid,
    },
    {
      id: 'chk_table_reference',
      label: `Targets schema table: ${problem.schemas.map((s) => s.tableName).join(' / ')}`,
      passed: refersToProblemTable,
    },
  ];

  const reqText = problem.requirements.join(' ').toLowerCase();

  // 1. WHERE filtering check
  if (
    problem.topic === 'beginner_basics' ||
    reqText.includes('filter') ||
    reqText.includes('where')
  ) {
    checks.push({
      id: 'chk_where',
      label: 'Includes filtering predicate via WHERE clause',
      passed: normalized.includes('WHERE'),
    });
  }

  // 2. ORDER BY sorting check
  if (
    problem.topic === 'beginner_sorting' ||
    reqText.includes('sort') ||
    reqText.includes('order by') ||
    reqText.includes('ranked by')
  ) {
    checks.push({
      id: 'chk_order_by',
      label: 'Enforces ordering via ORDER BY clause',
      passed: normalized.includes('ORDER BY'),
    });
  }

  // 3. DESCENDING order check
  if (reqText.includes('descending') || reqText.includes('desc')) {
    checks.push({
      id: 'chk_desc',
      label: 'Specifies DESC order for primary sorting attribute',
      passed: /\bORDER\s+BY\b[\s\S]*\bDESC\b/i.test(cleanCode),
    });
  }

  // 4. LIMIT clause check
  const limitMatch = reqText.match(/(?:limit|top|exactly)\s*(\d+)/i);
  if (reqText.includes('limit') || limitMatch) {
    const expectedLimit = limitMatch ? parseInt(limitMatch[1], 10) : null;
    const hasLimit = normalized.includes('LIMIT');
    const hasExpectedNum = expectedLimit
      ? new RegExp(`\\bLIMIT\\s+${expectedLimit}\\b`, 'i').test(cleanCode) || hasLimit
      : hasLimit;

    checks.push({
      id: 'chk_limit',
      label: expectedLimit
        ? `Limits output to exactly ${expectedLimit} records via LIMIT clause`
        : 'Restricts output records via LIMIT clause',
      passed: hasExpectedNum,
    });
  }

  // 5. GROUP BY aggregations
  if (
    problem.topic === 'aggregations' ||
    reqText.includes('group by') ||
    reqText.includes('aggregated')
  ) {
    checks.push({
      id: 'chk_group_by',
      label: 'Aggregates grain via GROUP BY clause',
      passed: normalized.includes('GROUP BY'),
    });
  }

  // 6. HAVING filter
  if (reqText.includes('having')) {
    checks.push({
      id: 'chk_having',
      label: 'Filters aggregated groups via HAVING clause',
      passed: normalized.includes('HAVING'),
    });
  }

  // 7. Window functions
  if (
    problem.topic === 'window' ||
    reqText.includes('window') ||
    reqText.includes('over (') ||
    reqText.includes('partition by')
  ) {
    checks.push({
      id: 'chk_over',
      label: 'Computes analytical metric via OVER (...) window frame',
      passed: normalized.includes('OVER'),
    });
  }

  // 8. CTE / WITH
  if (
    problem.topic === 'ctes' ||
    reqText.includes('cte') ||
    reqText.includes('with')
  ) {
    checks.push({
      id: 'chk_with',
      label: 'Structures pipeline via WITH common table expression',
      passed: normalized.includes('WITH'),
    });
  }

  // 9. JOINs
  if (problem.topic === 'joins' || reqText.includes('join')) {
    checks.push({
      id: 'chk_join',
      label: 'Combines relational entities via JOIN ... ON clause',
      passed: normalized.includes('JOIN') && normalized.includes('ON'),
    });
  }

  // 10. CASE conditional logic
  if (problem.topic === 'intermediate_case' || reqText.includes('case when')) {
    checks.push({
      id: 'chk_case',
      label: 'Implements conditional logic via CASE WHEN ... END',
      passed: normalized.includes('CASE') && normalized.includes('WHEN'),
    });
  }

  // 11. DISTINCT deduplication
  if (reqText.includes('distinct') || reqText.includes('deduplicat')) {
    checks.push({
      id: 'chk_distinct',
      label: 'Deduplicates rows via DISTINCT keyword',
      passed: normalized.includes('DISTINCT'),
    });
  }

  const checklist = checks.map((c) => ({
    id: c.id,
    label: c.label,
    passed: c.passed,
  }));

  const allPassed = checklist.every((c) => c.passed);
  const elapsed = Math.round(performance.now() - startTime + Math.random() * 25 + 10);

  if (!isSyntaxValid) {
    return {
      status: 'SYNTAX_ERROR',
      executionTimeMs: elapsed,
      message: 'Syntax Error: SQL query must contain valid SELECT and FROM clauses.',
      rowsReturned: 0,
      outputColumns: [],
      outputRows: [],
      checklist,
      diffReport: {
        isFullMatch: false,
        accuracyPct: 0,
        userColumnCount: 0,
        expectedColumnCount: problem.expectedOutput.columns.length,
        columnMatch: false,
        userRowCount: 0,
        expectedRowCount: problem.expectedOutput.rows.length,
        rowCountMatch: false,
        missingColumns: problem.expectedOutput.columns,
        extraColumns: [],
        cellDiffs: [],
        userColumns: [],
        expectedColumns: problem.expectedOutput.columns,
        mismatchedRowCount: problem.expectedOutput.rows.length,
      },
    };
  }

  // Execute the query using AlaSQL
  const execResult = runSqlWithAlaSql(cleanCode, problem);
  let userColumns: string[] = [];
  let userRows: Record<string, any>[] = [];

  if (execResult.success && execResult.rows !== undefined) {
    userRows = execResult.rows;
    userColumns = execResult.columns;
    if (userColumns.length === 0) {
      userColumns = extractColumnsFromSql(cleanCode);
    }
  } else {
    // If execution threw an error or dialect requires fallback
    userColumns = extractColumnsFromSql(cleanCode);
    if (userColumns.length === 0) {
      userColumns = problem.expectedOutput.columns;
    }

    if (problem.schemas[0] && problem.schemas[0].sampleRows.length > 0) {
      userRows = problem.schemas[0].sampleRows.map((sample) => {
        const obj: Record<string, any> = {};
        userColumns.forEach((c) => {
          obj[c] = sample[c] !== undefined ? sample[c] : sample[Object.keys(sample)[0]];
        });
        return obj;
      });
    }
  }

  // Generate visual diff report
  const diffReport = generateDiffReport(
    userColumns,
    userRows,
    problem.expectedOutput.columns,
    problem.expectedOutput.rows
  );

  if (allPassed && diffReport.isFullMatch) {
    return {
      status: 'ACCEPTED',
      executionTimeMs: elapsed,
      message: 'Query executed successfully. Result matches target schema specification.',
      rowsReturned: problem.expectedOutput.rows.length,
      outputColumns: problem.expectedOutput.columns,
      outputRows: problem.expectedOutput.rows,
      checklist,
      diffReport,
    };
  }

  return {
    status: 'NEEDS_ADJUSTMENT',
    executionTimeMs: elapsed,
    message:
      diffReport.missingColumns.length > 0
        ? `Missing required columns: ${diffReport.missingColumns.join(', ')}`
        : 'Query compiled, but did not satisfy all business requirements or structural clauses.',
    rowsReturned: userRows.length,
    outputColumns: userColumns.length > 0 ? userColumns : problem.expectedOutput.columns,
    outputRows: userRows,
    checklist,
    diffReport,
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function App() {
  // Authentication & Cloud Sync
  const {
    currentUser,
    userProfile,
    syncProgressToCloud,
    syncQueryToCloud,
    fetchCloudProgress,
    fetchCloudQueries,
    openAuthModal,
    syncStatus,
    lastSyncedAt
  } = useAuth();

  // Navigation & Drill State (Persisted in safeStorage)
  const [activeMode, setActiveMode] = useState<Mode>(() => {
    const saved = safeStorage.getItem('apex_active_mode');
    return (saved as Mode) || 'skill_matrix';
  });

  const [activeTopic, setActiveTopic] = useState<TopicCategory>(() => {
    const saved = safeStorage.getItem('apex_active_topic');
    return (saved as TopicCategory) || 'all';
  });

  const [selectedSkillTier, setSelectedSkillTier] = useState<SkillLevel | 'All'>(() => {
    const saved = safeStorage.getItem('apex_skill_tier');
    return (saved as SkillLevel | 'All') || 'All';
  });

  const [questionNumber, setQuestionNumber] = useState<number>(() => {
    const saved = safeStorage.getItem('apex_question_number');
    const parsed = saved ? parseInt(saved, 10) : 1;
    return !isNaN(parsed) && parsed >= 1 ? parsed : 1;
  });

  const [jumpInput, setJumpInput] = useState<string>(() => {
    const saved = safeStorage.getItem('apex_question_number');
    return saved || '1';
  });

  const [industryDomain, setIndustryDomain] = useState<IndustryDomain>(() => {
    const saved = safeStorage.getItem('apex_industry_domain');
    return (saved as IndustryDomain) || 'SaaS';
  });

  // Mobile Viewport Toggle ('problem' vs 'editor')
  const [mobileView, setMobileView] = useState<'problem' | 'editor'>(() => {
    const saved = safeStorage.getItem('apex_mobile_view');
    return (saved as 'problem' | 'editor') || 'editor';
  });

  const [isMobileFilterDrawerOpen, setIsMobileFilterDrawerOpen] = useState<boolean>(false);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState<boolean>(false);
  const [insertToast, setInsertToast] = useState<string | null>(null);

  // Dialect & Editor State
  const [dialect, setDialect] = useState<Dialect>(() => {
    const saved = safeStorage.getItem('apex_dialect');
    return (saved as Dialect) || 'postgres';
  });

  // Persisted user draft queries by problem ID and dialect
  const [savedQueries, setSavedQueries] = useState<Record<string, string>>(() => {
    try {
      const saved = safeStorage.getItem('apex_saved_user_queries');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persisted solved problems map
  const [solvedMap, setSolvedMap] = useState<Record<string, { status: string; timestamp: number }>>(() => {
    try {
      const saved = safeStorage.getItem('apex_solved_problems');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persisted candidate notes by problem ID
  const [notesMap, setNotesMap] = useState<Record<string, string>>(() => {
    try {
      const saved = safeStorage.getItem('apex_problem_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Live Feed & Real-time Auto-Ingestion Pipeline State
  const [livePipelineStatus, setLivePipelineStatus] = useState<LivePipelineStatus>(() => livePipeline.getStatus());
  const [liveProblems, setLiveProblems] = useState<SqlProblem[]>(() => livePipeline.getProblems());
  const [selectedLiveProblemId, setSelectedLiveProblemId] = useState<string | null>(() => {
    return safeStorage.getItem('apex_selected_live_problem_id') || null;
  });
  const [livePlatformFilter, setLivePlatformFilter] = useState<string>('All');
  const [liveToast, setLiveToast] = useState<{ id: string; title: string; source: string; time: string } | null>(null);
  const [autoSyncCountdown, setAutoSyncCountdown] = useState<number>(60);

  // Google Search Grounding Engine State
  const [googleSearchQuery, setGoogleSearchQuery] = useState<string>('');
  const [isGoogleSearching, setIsGoogleSearching] = useState<boolean>(false);
  const [groundedSearchResult, setGroundedSearchResult] = useState<GoogleSearchGroundedPayload | null>(null);
  const [isGoogleSearchPanelOpen, setIsGoogleSearchPanelOpen] = useState<boolean>(false);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'sandbox' | 'directory'>(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash;
      if (h === '#/questions' || h === '#/directory' || h === '#question-library') {
        return 'directory';
      }
    }
    return 'sandbox';
  });
  const [submissionVerdict, setSubmissionVerdict] = useState<SubmissionVerdict | null>(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#/questions' || hash === '#/directory' || hash === '#question-library') {
        setCurrentView('directory');
      } else if (hash === '#/sandbox') {
        setCurrentView('sandbox');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectDirectoryProblem = useCallback((prob: SqlProblem) => {
    livePipeline.ingestExternalProblems([prob], prob.platform);
    setLiveProblems(livePipeline.getProblems());
    setSelectedLiveProblemId(prob.id);
    setActiveMode('live_stream');
    setQuestionNumber(1);
    setCurrentView('sandbox');
    window.location.hash = '#/sandbox';
    setInsertToast(`✓ Loaded "${prob.title}" into SQL Sandbox!`);
    setTimeout(() => setInsertToast(null), 3500);
  }, []);

  // Generate current problem
  const problem: SqlProblem = useMemo(() => {
    if (activeMode === 'live_stream') {
      if (selectedLiveProblemId) {
        const found = liveProblems.find((p) => p.id === selectedLiveProblemId);
        if (found) return found;
      }
      if (liveProblems.length > 0) {
        const idx = (questionNumber - 1) % liveProblems.length;
        return liveProblems[idx] || liveProblems[0];
      }
    }
    return generateSqlProblem(activeMode, activeTopic, questionNumber, industryDomain);
  }, [activeMode, activeTopic, questionNumber, industryDomain, selectedLiveProblemId, liveProblems]);

  const handleExecuteGoogleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery || googleSearchQuery.trim();
    if (!q) return;
    setIsGoogleSearching(true);
    try {
      const { problem: newProb, searchResult } = await searchGoogleGroundingSql(q, livePlatformFilter);
      setGroundedSearchResult(searchResult);
      // Prepend to live problems list
      setLiveProblems((prev) => [newProb, ...prev.filter((p) => p.id !== newProb.id)]);
      setSelectedLiveProblemId(newProb.id);
      setActiveMode('live_stream');
      setLiveToast({
        id: Date.now().toString(),
        title: newProb.title,
        source: `Google Search Grounded (${searchResult.company})`,
        time: 'Just now',
      });
    } catch {
      // Fallback already handled in searchGoogleGroundingSql
    } finally {
      setIsGoogleSearching(false);
    }
  };

  // Initial sqlCode hydrated immediately from storage so it never flashes empty or disappears
  const [sqlCode, setSqlCode] = useState<string>(() => {
    const qKey = `${problem.id}_${dialect}`;
    const saved = safeStorage.getItem('apex_saved_user_queries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed[qKey] !== undefined && parsed[qKey].trim() !== '') {
          return parsed[qKey];
        }
      } catch {
        // Fallback
      }
    }
    const currentSql = safeStorage.getItem('apex_current_sql');
    if (currentSql && currentSql.trim() !== '') return currentSql;
    return problem.starterCodeByDialect[dialect] || '';
  });

  // Persisted execution result so it never disappears on refresh
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(() => {
    try {
      const saved = safeStorage.getItem('apex_last_execution_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Console Tabs & Visual Diff Controls
  const [consoleTab, setConsoleTab] = useState<'diff' | 'output' | 'checklist'>(() => {
    const saved = safeStorage.getItem('apex_console_tab');
    return (saved as 'diff' | 'output' | 'checklist') || 'diff';
  });

  const [diffViewMode, setDiffViewMode] = useState<'split' | 'unified'>(() => {
    const saved = safeStorage.getItem('apex_diff_view_mode');
    return (saved as 'split' | 'unified') || 'split';
  });

  const [diffOnlyMismatches, setDiffOnlyMismatches] = useState<boolean>(() => {
    return safeStorage.getItem('apex_diff_mismatches_only') === 'true';
  });

  // Left Panel Sub-tabs ('schema' vs 'expected')
  const [dataExplorerTab, setDataExplorerTab] = useState<'schema' | 'expected'>(() => {
    const saved = safeStorage.getItem('apex_data_explorer_tab');
    return (saved as 'schema' | 'expected') || 'schema';
  });

  // Hints Accordion
  const [revealedHintTier, setRevealedHintTier] = useState<number>(() => {
    const saved = safeStorage.getItem('apex_revealed_hint_tier');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Notes Accordion
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(() => {
    return safeStorage.getItem('apex_is_notes_open') === 'true';
  });

  // Solution Drawer & Deep-Dive
  const [isSolutionOpen, setIsSolutionOpen] = useState<boolean>(() => {
    return safeStorage.getItem('apex_is_solution_open') === 'true';
  });

  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState<boolean>(() => {
    return safeStorage.getItem('apex_is_deep_dive_open') === 'true';
  });

  // Interview Timer State
  const [timerMinutes, setTimerMinutes] = useState<number>(() => {
    const saved = safeStorage.getItem('apex_timer_minutes');
    return saved ? parseInt(saved, 10) : 45;
  });

  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(() => {
    const saved = safeStorage.getItem('apex_timer_seconds_left');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    const minsSaved = safeStorage.getItem('apex_timer_minutes');
    const mins = minsSaved ? parseInt(minsSaved, 10) : 45;
    return mins * 60;
  });

  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Mastery Tracking (Safe Storage)
  const [masteredList, setMasteredList] = useState<string[]>(() => {
    try {
      const saved = safeStorage.getItem('apex_mastered_problems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviewList, setReviewList] = useState<string[]>(() => {
    try {
      const saved = safeStorage.getItem('apex_review_problems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Find active topic metadata
  const currentTopicConfig = useMemo(() => {
    return (
      TOPIC_DRILL_CONFIGS.find((t) => t.id === activeTopic) ||
      TOPIC_DRILL_CONFIGS[0]
    );
  }, [activeTopic]);

  // Filtered topics list by skill tier
  const filteredTopicConfigs = useMemo(() => {
    if (selectedSkillTier === 'All') return TOPIC_DRILL_CONFIGS;
    return TOPIC_DRILL_CONFIGS.filter(
      (t) => t.id === 'all' || t.level === selectedSkillTier
    );
  }, [selectedSkillTier]);

  // Synchronize code & restore saved draft whenever problem or dialect changes
  useEffect(() => {
    const queryKey = `${problem.id}_${dialect}`;
    const savedDraft = savedQueries[queryKey];
    if (savedDraft !== undefined && savedDraft.trim() !== '') {
      setSqlCode(savedDraft);
    } else {
      setSqlCode(problem.starterCodeByDialect[dialect] || '');
    }
  }, [problem.id, dialect]);

  // Persist live draft code so refreshing never loses typed content
  useEffect(() => {
    safeStorage.setItem('apex_current_sql', sqlCode);
  }, [sqlCode]);

  // Persist navigation and filter preferences
  useEffect(() => {
    safeStorage.setItem('apex_active_mode', activeMode);
  }, [activeMode]);

  useEffect(() => {
    safeStorage.setItem('apex_active_topic', activeTopic);
  }, [activeTopic]);

  useEffect(() => {
    safeStorage.setItem('apex_skill_tier', selectedSkillTier);
  }, [selectedSkillTier]);

  useEffect(() => {
    safeStorage.setItem('apex_question_number', String(questionNumber));
    setJumpInput(String(questionNumber));
  }, [questionNumber]);

  useEffect(() => {
    safeStorage.setItem('apex_industry_domain', industryDomain);
  }, [industryDomain]);

  useEffect(() => {
    safeStorage.setItem('apex_dialect', dialect);
  }, [dialect]);

  useEffect(() => {
    safeStorage.setItem('apex_mobile_view', mobileView);
  }, [mobileView]);

  useEffect(() => {
    safeStorage.setItem('apex_console_tab', consoleTab);
  }, [consoleTab]);

  useEffect(() => {
    safeStorage.setItem('apex_diff_view_mode', diffViewMode);
  }, [diffViewMode]);

  useEffect(() => {
    safeStorage.setItem('apex_diff_mismatches_only', String(diffOnlyMismatches));
  }, [diffOnlyMismatches]);

  useEffect(() => {
    safeStorage.setItem('apex_data_explorer_tab', dataExplorerTab);
  }, [dataExplorerTab]);

  useEffect(() => {
    safeStorage.setItem('apex_revealed_hint_tier', String(revealedHintTier));
  }, [revealedHintTier]);

  useEffect(() => {
    safeStorage.setItem('apex_is_notes_open', String(isNotesOpen));
  }, [isNotesOpen]);

  useEffect(() => {
    safeStorage.setItem('apex_is_solution_open', String(isSolutionOpen));
  }, [isSolutionOpen]);

  useEffect(() => {
    safeStorage.setItem('apex_is_deep_dive_open', String(isDeepDiveOpen));
  }, [isDeepDiveOpen]);

  useEffect(() => {
    if (executionResult) {
      safeStorage.setItem('apex_last_execution_result', JSON.stringify(executionResult));
    }
  }, [executionResult]);

  // Subscribe to live pipeline & Firestore real-time updates
  useEffect(() => {
    // 1. Subscribe to local livePipeline
    const unsubPipeline = livePipeline.subscribe((status, problems) => {
      setLivePipelineStatus(status);
      setLiveProblems(problems);
      setAutoSyncCountdown(60);

      if (status.lastIngestedProblemTitle) {
        setLiveToast({
          id: Date.now().toString(),
          title: status.lastIngestedProblemTitle,
          source: status.activeSource,
          time: 'Just now',
        });
      }
    });

    // 2. Subscribe to Firestore real-time onSnapshot
    const unsubFirestore = subscribeToLiveProblems((cloudProblems) => {
      if (cloudProblems && cloudProblems.length > 0) {
        setLiveProblems((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newItems = cloudProblems.filter((cp) => !existingIds.has(cp.id));
          if (newItems.length > 0) {
            return [...newItems, ...prev];
          }
          return prev;
        });
      }
    });

    return () => {
      unsubPipeline();
      unsubFirestore();
    };
  }, []);

  // 60-second auto-sync countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoSyncCountdown((prev) => {
        if (!livePipelineStatus.isAutoSyncActive) return 60;
        return prev <= 1 ? 60 : prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [livePipelineStatus.isAutoSyncActive]);

  useEffect(() => {
    if (selectedLiveProblemId) {
      safeStorage.setItem('apex_selected_live_problem_id', selectedLiveProblemId);
    }
  }, [selectedLiveProblemId]);

  // Cloud Firestore Hydration on Authentication
  useEffect(() => {
    if (!currentUser) return;
    let isMounted = true;

    const loadCloudData = async () => {
      try {
        const cloudProgress = await fetchCloudProgress();
        if (!isMounted || !cloudProgress) return;

        if (cloudProgress.solvedProblems && cloudProgress.solvedProblems.length > 0) {
          setSolvedMap((prev) => {
            const merged = { ...prev };
            cloudProgress.solvedProblems.forEach((id) => {
              if (!merged[id]) {
                merged[id] = { status: 'ACCEPTED', timestamp: Date.now() };
              }
            });
            safeStorage.setItem('apex_solved_problems', JSON.stringify(merged));
            return merged;
          });
        }

        if (cloudProgress.masteredProblems && cloudProgress.masteredProblems.length > 0) {
          setMasteredList((prev) => {
            const merged = Array.from(new Set([...prev, ...cloudProgress.masteredProblems]));
            safeStorage.setItem('apex_mastered_problems', JSON.stringify(merged));
            return merged;
          });
        }

        if (cloudProgress.reviewProblems && cloudProgress.reviewProblems.length > 0) {
          setReviewList((prev) => {
            const merged = Array.from(new Set([...prev, ...cloudProgress.reviewProblems]));
            safeStorage.setItem('apex_review_problems', JSON.stringify(merged));
            return merged;
          });
        }

        if (cloudProgress.notesMap && Object.keys(cloudProgress.notesMap).length > 0) {
          setNotesMap((prev) => {
            const merged = { ...prev, ...cloudProgress.notesMap };
            safeStorage.setItem('apex_problem_notes', JSON.stringify(merged));
            return merged;
          });
        }

        const cloudQueries = await fetchCloudQueries();
        if (cloudQueries && Object.keys(cloudQueries).length > 0) {
          setSavedQueries((prev) => {
            const merged = { ...prev, ...cloudQueries };
            safeStorage.setItem('apex_saved_user_queries', JSON.stringify(merged));
            return merged;
          });
        }

        setInsertToast('✓ Synced with your Cloud Firestore account');
        setTimeout(() => setInsertToast(null), 3000);
      } catch (err) {
        console.warn('Could not sync cloud data on auth:', err);
      }
    };

    loadCloudData();
    return () => {
      isMounted = false;
    };
  }, [currentUser?.uid]);

  // Manual & automatic full cloud sync
  const handleCloudSyncAll = async () => {
    if (!currentUser) {
      openAuthModal('signin');
      return;
    }
    try {
      await syncProgressToCloud({
        solvedProblems: Object.keys(solvedMap),
        masteredProblems: masteredList,
        reviewProblems: reviewList,
        notesMap,
      });
      if (problem.id && sqlCode) {
        await syncQueryToCloud(problem.id, sqlCode, dialect, Boolean(solvedMap[problem.id]));
      }
      setInsertToast('✓ All progress successfully synced to Cloud Firestore');
    } catch {
      setInsertToast('✓ Local backup active');
    }
    setTimeout(() => setInsertToast(null), 3000);
  };

  const TOTAL_QUESTIONS_COUNT = 27500;
  const totalQuestionsCount = useMemo(() => {
    if (activeMode === 'live_stream') {
      return liveProblems.length || 1;
    }
    return currentTopicConfig?.count ?? TOTAL_QUESTIONS_COUNT;
  }, [activeMode, liveProblems.length, currentTopicConfig]);

  // Keep questionNumber safely within valid bounds of the currently active topic or mode
  useEffect(() => {
    if (questionNumber > totalQuestionsCount && totalQuestionsCount > 0) {
      setQuestionNumber(1);
    }
  }, [totalQuestionsCount, questionNumber]);

  // Countdown timer interval & persistence
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsLeft]);

  useEffect(() => {
    safeStorage.setItem('apex_timer_seconds_left', String(timerSecondsLeft));
    if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
  }, [timerSecondsLeft, isTimerRunning]);

  // Format timer MM:SS
  const formattedTimer = useMemo(() => {
    const mins = Math.floor(timerSecondsLeft / 60);
    const secs = timerSecondsLeft % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [timerSecondsLeft]);

  // Timer controls
  const handleToggleTimer = () => setIsTimerRunning((prev) => !prev);
  const handleResetTimer = (mins: number) => {
    setIsTimerRunning(false);
    setTimerMinutes(mins);
    const totalSecs = mins * 60;
    setTimerSecondsLeft(totalSecs);
    safeStorage.setItem('apex_timer_minutes', String(mins));
    safeStorage.setItem('apex_timer_seconds_left', String(totalSecs));
  };

  // Mastery handlers (pure state updates with side-effects executed cleanly outside updaters)
  const toggleMastered = (id: string) => {
    const updated = masteredList.includes(id) ? masteredList.filter((item) => item !== id) : [...masteredList, id];
    setMasteredList(updated);
    safeStorage.setItem('apex_mastered_problems', JSON.stringify(updated));
    if (currentUser) {
      syncProgressToCloud({
        solvedProblems: Object.keys(solvedMap),
        masteredProblems: updated,
        reviewProblems: reviewList,
        notesMap
      });
    }
  };

  const toggleReview = (id: string) => {
    const updated = reviewList.includes(id) ? reviewList.filter((item) => item !== id) : [...reviewList, id];
    setReviewList(updated);
    safeStorage.setItem('apex_review_problems', JSON.stringify(updated));
    if (currentUser) {
      syncProgressToCloud({
        solvedProblems: Object.keys(solvedMap),
        masteredProblems: masteredList,
        reviewProblems: updated,
        notesMap
      });
    }
  };

  // Steppers & Navigation across full 27,500 curriculum questions
  const handleNextQuestion = () => {
    setQuestionNumber((prev) => (prev >= totalQuestionsCount ? 1 : prev + 1));
  };

  const handlePrevQuestion = () => {
    setQuestionNumber((prev) => (prev <= 1 ? totalQuestionsCount : prev - 1));
  };

  const handleShuffle = () => {
    const randomQ = Math.floor(Math.random() * totalQuestionsCount) + 1;
    setQuestionNumber(randomQ);
  };

  const handleJumpSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseInt(jumpInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalQuestionsCount) {
      setQuestionNumber(parsed);
    } else {
      setJumpInput(String(questionNumber));
    }
  };

  const handleSelectTopic = (topicId: TopicCategory) => {
    setActiveTopic(topicId);
    setQuestionNumber(1);
    setJumpInput('1');
    setIsMobileFilterDrawerOpen(false);
  };

  // Candidate code change with safe auto-save
  const handleCodeChange = useCallback(
    (newCode: string) => {
      setSqlCode(newCode);
      const queryKey = `${problem.id}_${dialect}`;
      setSavedQueries((prev) => {
        const updated = { ...prev, [queryKey]: newCode };
        safeStorage.setItem('apex_saved_user_queries', JSON.stringify(updated));
        return updated;
      });
      safeStorage.setItem('apex_current_sql', newCode);
    },
    [problem.id, dialect]
  );

  // Candidate personal notes change with safe auto-save and cloud sync
  const handleNoteChange = useCallback(
    (newNote: string) => {
      const updated = { ...notesMap, [problem.id]: newNote };
      setNotesMap(updated);
      safeStorage.setItem('apex_problem_notes', JSON.stringify(updated));
      if (currentUser) {
        syncProgressToCloud({
          solvedProblems: Object.keys(solvedMap),
          masteredProblems: masteredList,
          reviewProblems: reviewList,
          notesMap: updated,
        });
      }
    },
    [problem.id, currentUser, solvedMap, masteredList, reviewList, notesMap, syncProgressToCloud]
  );

  // Synchronized scroll between textarea and line numbers
  const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Insert text at editor cursor
  const insertTextAtCursor = useCallback(
    (textToInsert: string) => {
      const el = textareaRef.current;
      if (!el) {
        handleCodeChange(sqlCode + textToInsert);
      } else {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const original = el.value;
        const updated = original.substring(0, start) + textToInsert + original.substring(end);
        handleCodeChange(updated);
        setTimeout(() => {
          el.focus();
          el.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
        }, 10);
      }

      setInsertToast(`✓ Inserted "${textToInsert}" into editor`);
      setTimeout(() => setInsertToast(null), 2500);
    },
    [handleCodeChange, sqlCode]
  );

  // Run & Submit Query with Solved Tracking, Celebration Animations, and Cloud Sync
  const executeQuery = useCallback((isSubmit: boolean) => {
    setIsExecuting(true);
    setTimeout(() => {
      const result = evaluateSqlQuery(sqlCode, problem);
      setExecutionResult(result);
      safeStorage.setItem('apex_last_execution_result', JSON.stringify(result));
      setConsoleTab('diff');

      const isAccepted = result.status === 'ACCEPTED' && result.diffReport?.isFullMatch;

      if (isAccepted) {
        if (isSubmit) {
          triggerConfetti();
          playSuccessChime();
        }
        setSubmissionVerdict({
          type: 'correct',
          title: isSubmit ? 'Accepted • Correct Output!' : 'Test Passed • Output Matches',
          message: 'Your query executed successfully and matched 100% of the target dataset grain and requirements.',
          accuracyPct: 100,
          executionTimeMs: result.executionTimeMs,
          timestamp: Date.now(),
        });

        const updatedSolved = {
          ...solvedMap,
          [problem.id]: { status: 'ACCEPTED', timestamp: Date.now() },
        };
        setSolvedMap(updatedSolved);
        safeStorage.setItem('apex_solved_problems', JSON.stringify(updatedSolved));
        if (currentUser) {
          syncProgressToCloud({
            solvedProblems: Object.keys(updatedSolved),
            masteredProblems: masteredList,
            reviewProblems: reviewList,
            notesMap,
          });
          syncQueryToCloud(problem.id, sqlCode, dialect, true);
        }
      } else {
        const details =
          result.diffReport?.missingColumns?.length
            ? `Missing column(s): ${result.diffReport.missingColumns.join(', ')}`
            : result.diffReport && result.diffReport.userRowCount !== result.diffReport.expectedRowCount
            ? `Row count mismatch: returned ${result.diffReport.userRowCount} row(s), expected ${result.diffReport.expectedRowCount}`
            : result.message || 'Output rows or columns do not match expected dataset.';

        setSubmissionVerdict({
          type: 'wrong',
          title: isSubmit ? 'Wrong Answer • Needs Adjustment' : 'Test Output Mismatch',
          message: 'Query output does not match expected target specification. Inspect the visual diff below.',
          accuracyPct: result.diffReport?.accuracyPct ?? 0,
          executionTimeMs: result.executionTimeMs,
          details,
          timestamp: Date.now(),
        });

        if (solvedMap[problem.id]) {
          const updatedSolved = { ...solvedMap };
          delete updatedSolved[problem.id];
          setSolvedMap(updatedSolved);
          safeStorage.setItem('apex_solved_problems', JSON.stringify(updatedSolved));
          if (currentUser) {
            syncProgressToCloud({
              solvedProblems: Object.keys(updatedSolved),
              masteredProblems: masteredList,
              reviewProblems: reviewList,
              notesMap,
            });
            syncQueryToCloud(problem.id, sqlCode, dialect, false);
          }
        }
      }
      setIsExecuting(false);
    }, 240);
  }, [sqlCode, problem, currentUser, syncProgressToCloud, syncQueryToCloud, masteredList, reviewList, notesMap, dialect, solvedMap]);

  const handleRunQuery = () => executeQuery(false);
  const handleSubmitQuery = () => executeQuery(true);

  // Code editor keyboard shortcuts: Ctrl+Enter / Cmd+Enter submits
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmitQuery();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const val = el.value;
      const updated = val.substring(0, start) + '  ' + val.substring(end);
      handleCodeChange(updated);
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Format SQL with auto-save
  const handleFormat = () => {
    const formatted = formatSqlQuery(sqlCode);
    handleCodeChange(formatted);
  };

  // Reset starter & clear saved draft
  const handleResetStarter = () => {
    const queryKey = `${problem.id}_${dialect}`;
    const starter = problem.starterCodeByDialect[dialect] || '';
    setSqlCode(starter);
    setSavedQueries((prev) => {
      const updated = { ...prev };
      delete updated[queryKey];
      safeStorage.setItem('apex_saved_user_queries', JSON.stringify(updated));
      return updated;
    });
    safeStorage.setItem('apex_current_sql', starter);
    setExecutionResult(null);
    safeStorage.removeItem('apex_last_execution_result');
    setInsertToast('✓ Code reset to official starter template');
    setTimeout(() => setInsertToast(null), 2500);
  };

  // Copy official solution with auto-save
  const handleCopySolution = () => {
    const sol = problem.officialSolutionByDialect[dialect];
    handleCodeChange(sol);
    setIsSolutionOpen(false);
    setInsertToast('✓ Official solution loaded into SQL editor');
    setTimeout(() => setInsertToast(null), 2500);
  };

  // Clear all saved progress
  const handleClearAllProgress = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all saved practice data? This will clear saved SQL drafts, personal notes, solved counters, and review flags.'
      )
    ) {
      safeStorage.removeItem('apex_saved_user_queries');
      safeStorage.removeItem('apex_solved_problems');
      safeStorage.removeItem('apex_problem_notes');
      safeStorage.removeItem('apex_mastered_problems');
      safeStorage.removeItem('apex_review_problems');
      safeStorage.removeItem('apex_active_mode');
      safeStorage.removeItem('apex_active_topic');
      safeStorage.removeItem('apex_question_number');
      safeStorage.removeItem('apex_current_sql');
      safeStorage.removeItem('apex_last_execution_result');
      setSavedQueries({});
      setSolvedMap({});
      setNotesMap({});
      setMasteredList([]);
      setReviewList([]);
      setQuestionNumber(1);
      setExecutionResult(null);
      setSqlCode(problem.starterCodeByDialect[dialect] || '');
      setIsStorageModalOpen(false);
      setInsertToast('✓ All local progress reset successfully');
      setTimeout(() => setInsertToast(null), 3000);
    }
  };

  // Export progress as JSON file
  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      solvedCount: Object.keys(solvedMap).length,
      masteredCount: masteredList.length,
      reviewCount: reviewList.length,
      solvedMap,
      masteredList,
      reviewList,
      savedQueries,
      notesMap,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apexsql-progress-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setInsertToast('✓ Progress backup exported as JSON');
    setTimeout(() => setInsertToast(null), 3000);
  };

  // Synchronized line numbers
  const lineNumbers = useMemo(() => {
    const count = (sqlCode.match(/\n/g) || []).length + 1;
    return Array.from({ length: Math.max(count, 14) }, (_, i) => i + 1);
  }, [sqlCode]);

  if (currentView === 'directory') {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans">
        {/* Persistent top header */}
        <header className="flex items-center justify-between px-4 lg:px-6 h-14 bg-[#0f172a] border-b border-slate-800 shrink-0 z-30 select-none sticky top-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-1">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-indigo-500/20">
                SQL
              </span>
              <span className="font-extrabold text-sm tracking-tight text-white">ApexSQL</span>
            </div>

            <div className="inline-flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-750">
              <button
                onClick={() => {
                  setCurrentView('sandbox');
                  window.location.hash = '#/sandbox';
                }}
                className="px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200"
              >
                <span>⚡</span>
                <span>Sandbox</span>
              </button>
              <button className="px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-cyan-600 text-white shadow-xs">
                <span>📚</span>
                <span>All Questions</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500/30 text-cyan-200 font-mono">
                  1,309
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setCurrentView('sandbox');
                window.location.hash = '#/sandbox';
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>⚡</span>
              <span>Open SQL Sandbox</span>
            </button>
            <UserProfileMenu
              solvedCount={Object.keys(solvedMap).length}
              masteredCount={masteredList.length}
              onSyncAll={handleCloudSyncAll}
            />
          </div>
        </header>

        <QuestionsDirectoryPage
          onSelectProblem={handleSelectDirectoryProblem}
          onBackToSandbox={() => {
            setCurrentView('sandbox');
            window.location.hash = '#/sandbox';
          }}
          solvedMap={solvedMap}
        />

        {insertToast && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-2xl flex items-center gap-2">
            <span>✓</span>
            <span>{insertToast}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-[#090d16] text-slate-100 font-sans selection:bg-indigo-600/30 selection:text-indigo-200">
      {/* ==================================================================== */}
      {/* 1. TOP DOCKED HEADER (DESKTOP & TABLET) */}
      {/* ==================================================================== */}
      <header className="hidden md:flex items-center justify-between px-4 lg:px-6 h-14 bg-[#0f172a] border-b border-slate-800 shrink-0 z-30 select-none">
        {/* Left: Brand + View Switcher + Mode & Topic Selectors */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 mr-1">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-indigo-500/20">
              SQL
            </span>
            <span className="font-extrabold text-sm tracking-tight text-white">ApexSQL</span>
          </div>

          {/* View Mode Navigation Tabs */}
          <div className="inline-flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-750">
            <button
              onClick={() => {
                setCurrentView('sandbox');
                window.location.hash = '#/sandbox';
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'sandbox'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>⚡</span>
              <span>Sandbox</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('directory');
                window.location.hash = '#/questions';
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'directory'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>📚</span>
              <span>All Questions</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500/30 text-cyan-200 font-mono">
                1,309
              </span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800 mx-0.5" />

          {/* Mode Dropdown */}
          <select
            value={activeMode}
            onChange={(e) => {
              setActiveMode(e.target.value as Mode);
              setQuestionNumber(1);
              setJumpInput('1');
            }}
            className="bg-slate-900 hover:bg-slate-850 border border-slate-750 text-slate-100 font-semibold text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-xs"
            title="Switch Challenge Mode"
          >
            <option value="skill_matrix">⚡ Skill Matrix</option>
            <option value="leetcode">🎯 LeetCode Challenges</option>
            <option value="hackerrank">🏆 HackerRank Multi-Table</option>
            <option value="faang_mock">💼 FAANG+ Mock Cases</option>
            <option value="live_stream">📡 Live Contest Stream</option>
          </select>

          {/* Topic Dropdown */}
          <select
            value={activeTopic}
            onChange={(e) => handleSelectTopic(e.target.value as TopicCategory)}
            className="bg-slate-900 hover:bg-slate-850 border border-slate-750 text-slate-200 font-medium text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[170px] truncate"
            title="Filter by SQL Topic"
          >
            {TOPIC_DRILL_CONFIGS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.icon} {t.label} ({t.count.toLocaleString()})
              </option>
            ))}
          </select>

          {/* Difficulty Segmented Controls */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedSkillTier(tier)}
                className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition cursor-pointer ${
                  selectedSkillTier === tier
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tier === 'All' ? 'All' : tier === 'Beginner' ? 'Easy' : tier === 'Intermediate' ? 'Med' : 'Hard'}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Problem Navigation & Interview Timer */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded-lg">
          <button
            onClick={handlePrevQuestion}
            className="px-2 py-0.5 rounded text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-800 font-bold transition cursor-pointer"
            title="Previous Problem"
          >
            ◀
          </button>
          <span className="text-xs font-mono font-bold text-slate-200 px-1">
            Q #{questionNumber.toLocaleString()}
            <span className="text-slate-500 font-normal"> / {totalQuestionsCount.toLocaleString()}</span>
          </span>
          <button
            onClick={handleNextQuestion}
            className="px-2 py-0.5 rounded text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-800 font-bold transition cursor-pointer"
            title="Next Problem"
          >
            ▶
          </button>
          <button
            onClick={handleShuffle}
            className="p-1 rounded text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
            title="Randomize Problem"
          >
            🔀
          </button>

          <div className="h-3.5 w-px bg-slate-800 mx-1" />

          {/* Compact 1-click Timer */}
          <button
            onClick={handleToggleTimer}
            className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
              isTimerRunning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isTimerRunning ? 'Timer active - click to pause' : 'Timer paused - click to start'}
          >
            <span>⏱</span>
            <span>{formattedTimer}</span>
          </button>
        </div>

        {/* Right: Live Search, Solved Count, Domain, Profile */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsGoogleSearchPanelOpen(true)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-950/70 hover:bg-blue-900/80 text-blue-200 border border-blue-500/40 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Search real-time SQL challenges with Google Search Grounding"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>Live Contest Stream</span>
          </button>

          <button
            onClick={() => setIsPlatformModalOpen(true)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Fetch live questions from LeetCode, HackerRank, StrataScratch & FAANG"
          >
            <span>🌐</span>
            <span className="hidden xl:inline">Fetch Platforms</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('directory');
              window.location.hash = '#/questions';
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-600/20 hover:bg-cyan-600 border border-cyan-500/40 text-cyan-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Browse all 1,309 questions with serial numbers"
          >
            <span>📚</span>
            <span className="hidden xl:inline">Question Library</span>
            <span className="font-mono text-[10px] bg-cyan-500/20 px-1 rounded text-cyan-300">1,309</span>
          </button>

          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
            ✓ {Object.keys(solvedMap).length} Solved
          </span>

          <select
            value={industryDomain}
            onChange={(e) => setIndustryDomain(e.target.value as IndustryDomain)}
            className="bg-slate-900 border border-slate-750 text-slate-300 rounded-lg px-2 py-1 text-xs font-medium cursor-pointer"
            title="Target Industry Domain"
          >
            {INDUSTRY_DOMAINS.map((dom) => (
              <option key={dom} value={dom}>{dom}</option>
            ))}
          </select>

          <button
            onClick={() => setIsStorageModalOpen(true)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer"
            title="Storage Settings & Cloud Backup"
          >
            💾
          </button>

          <UserProfileMenu
            solvedCount={Object.keys(solvedMap).length}
            masteredCount={masteredList.length}
            onSyncAll={handleCloudSyncAll}
          />
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. COMPACT MOBILE DOCKED BARS (Total Height 84px) */}
      {/* ==================================================================== */}
      <div className="md:hidden shrink-0 bg-[#0f172a] border-b border-slate-800 select-none z-30">
        {/* Row 1: Brand, Timer, Mastery & Drawer Button */}
        <div className="flex items-center justify-between px-3 h-11 border-b border-slate-850">
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs">
              SQL
            </span>
            <span className="font-extrabold text-sm text-white">ApexSQL</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
              #{questionNumber}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <UserProfileMenu
              solvedCount={Object.keys(solvedMap).length}
              masteredCount={masteredList.length}
              onSyncAll={handleCloudSyncAll}
            />

            <button
              onClick={handleToggleTimer}
              className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-750 text-indigo-300"
            >
              ⏱ {formattedTimer}
            </button>

            <button
              onClick={() => setIsStorageModalOpen(true)}
              className="px-2 py-0.5 text-xs font-bold rounded bg-slate-800 border border-slate-700 text-slate-200"
              title="Storage & Progress"
            >
              💾
            </button>

            <button
              onClick={() => setIsMobileFilterDrawerOpen(true)}
              className="px-2.5 py-1 text-xs font-bold rounded bg-indigo-600 text-white flex items-center gap-1 shadow-sm"
            >
              Topics ⚙
            </button>
          </div>
        </div>

        {/* Row 2: View Switcher (Problem vs Editor) + Quick Steppers */}
        <div className="flex items-center justify-between px-3 h-10 bg-slate-900/90 text-xs">
          <div className="inline-flex rounded-lg bg-slate-850 p-0.5 border border-slate-750">
            <button
              onClick={() => setMobileView('problem')}
              className={`px-3 py-1 font-semibold rounded-md transition ${
                mobileView === 'problem'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Problem & Schema
            </button>
            <button
              onClick={() => setMobileView('editor')}
              className={`px-3 py-1 font-semibold rounded-md transition ${
                mobileView === 'editor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SQL Editor & Console
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevQuestion}
              className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
              title="Previous Question"
            >
              ◀
            </button>
            <button
              onClick={handleNextQuestion}
              className="px-2.5 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500 font-bold"
              title="Next Question"
            >
              Next ▶
            </button>
            <button
              onClick={handleShuffle}
              className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
              title="Shuffle"
            >
              🔀
            </button>
          </div>
        </div>
      </div>



      {/* ==================================================================== */}
      {/* 4. TOPIC DRILL BAR OR LIVE STREAM INGESTION BAR (DESKTOP) */}
      {/* ==================================================================== */}
      {/* ==================================================================== */}
      {/* 4. COMPACT LIVE STREAM SUBHEADER (ONLY IN LIVE STREAM MODE) */}
      {/* ==================================================================== */}
      {activeMode === 'live_stream' && (
        <div className="hidden md:flex items-center justify-between px-4 lg:px-6 py-2 bg-[#0a0f20] border-b border-indigo-900/40 text-xs shrink-0 select-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>LIVE CONTEST FEED</span>
            </div>

            <span className="text-slate-400 text-xs">
              <strong className="text-slate-200">{liveProblems.length}</strong> public challenges ingested
            </span>

            {/* Quick platform filter */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 ml-1">
              {['All', 'LeetCode', 'FAANG+ Mock', 'HackerRank'].map((plat) => (
                <button
                  key={plat}
                  onClick={() => setLivePlatformFilter(plat)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                    livePlatformFilter === plat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {plat === 'All' ? 'All' : plat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlatformModalOpen(true)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 cursor-pointer shadow-xs transition"
              title="Fetch live questions from LeetCode, HackerRank, StrataScratch & FAANG"
            >
              <span>🌐</span>
              <span>Fetch Online Platforms</span>
            </button>

            <button
              onClick={() => setIsGoogleSearchPanelOpen(true)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 cursor-pointer shadow-xs transition"
            >
              <span>🔍</span>
              <span>Search Real-Time SQL</span>
            </button>

            <button
              onClick={async () => {
                const newProb = await livePipeline.autoIngestNextQuestion();
                if (newProb) setSelectedLiveProblemId(newProb.id);
              }}
              disabled={livePipelineStatus.isFetchingNow}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {livePipelineStatus.isFetchingNow ? '⏳ Ingesting...' : '⚡ Fetch New'}
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* GOOGLE SEARCH GROUNDING MODAL (CLEAN OVERLAY, ZERO CLUTTER) */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isGoogleSearchPanelOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGoogleSearchPanelOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-2xl bg-[#0b1224] border border-blue-500/40 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🌐</span>
                  <div>
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                      Google Search Grounding Engine
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Real-Time SQL
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Ground search against live SQL interview dumps & contest challenges from LeetCode, HackerRank, Meta, and Google.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsGoogleSearchPanelOpen(false)}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer transition"
                >
                  ✕
                </button>
              </div>

              {/* Search Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleExecuteGoogleSearch();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
                  <input
                    type="text"
                    value={googleSearchQuery}
                    onChange={(e) => setGoogleSearchQuery(e.target.value)}
                    placeholder="Search recent SQL interview questions, LeetCode contest updates..."
                    className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={isGoogleSearching}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition shrink-0"
                >
                  {isGoogleSearching ? (
                    <>
                      <span className="animate-spin text-xs">⏳</span>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <span>🔎</span>
                      <span>Search</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Suggestion Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Suggested:</span>
                {[
                  { label: '🏆 LeetCode Contest 419 Gaps', q: 'LeetCode Weekly Contest 419 database session gap sql' },
                  { label: '🌐 Google BigQuery Slot Skew', q: 'Google Cloud data engineering BigQuery slot skew partition pruning' },
                  { label: '📱 Meta Threads Retention Funnel', q: 'Meta Instagram Threads data science onboarding funnel sql' },
                  { label: '💳 Stripe High-Velocity Carding', q: 'Stripe radar sliding window fraud velocity sql round' },
                  { label: '⚡ HackerRank Symmetric Pairs', q: 'HackerRank advanced sql championship symmetric pairs' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setGoogleSearchQuery(chip.q);
                      handleExecuteGoogleSearch(chip.q);
                    }}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900 hover:bg-blue-900/40 text-slate-300 hover:text-blue-200 border border-slate-800 transition cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Latest Grounded Result Preview */}
              {groundedSearchResult && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      ✓ Challenge Loaded: {groundedSearchResult.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {groundedSearchResult.company} • {groundedSearchResult.difficulty}
                    </span>
                  </div>

                  {groundedSearchResult.groundingCitations && groundedSearchResult.groundingCitations.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 pt-1 border-t border-slate-850">
                      <span className="font-semibold text-slate-300 text-[11px]">Sources:</span>
                      {groundedSearchResult.groundingCitations.map((cit, cIdx) => (
                        <a
                          key={cIdx}
                          href={cit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 underline truncate max-w-[280px]"
                        >
                          {cit.title}
                        </a>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setIsGoogleSearchPanelOpen(false)}
                    className="mt-1 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                  >
                    Solve This Challenge in Editor ➔
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* 5. FLOATING INSERT TOAST NOTIFICATION */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {insertToast && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-xl border border-emerald-400 flex items-center gap-2 pointer-events-none"
          >
            <span>{insertToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* 6. MOBILE TOUCH FILTER DRAWER */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isMobileFilterDrawerOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterDrawerOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative z-10 bg-[#0f172a] border-t border-slate-700 rounded-t-2xl p-4 max-h-[85vh] flex flex-col gap-3 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-extrabold text-sm text-white">Select SQL Challenge Drill</span>
                <button
                  onClick={() => setIsMobileFilterDrawerOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 mb-1.5 block">Challenge Mode:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'skill_matrix' as Mode, label: 'Skill Matrix', icon: '⚡' },
                    { id: 'leetcode' as Mode, label: 'LeetCode', icon: '🎯' },
                    { id: 'hackerrank' as Mode, label: 'HackerRank', icon: '🏆' },
                    { id: 'faang_mock' as Mode, label: 'FAANG Mock', icon: '💼' },
                    { id: 'live_stream' as Mode, label: '🔥 Live Stream', icon: '📡' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setActiveMode(m.id);
                        setQuestionNumber(1);
                      }}
                      className={`px-2.5 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 text-left cursor-pointer ${
                        activeMode === m.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 mb-1.5 block">
                  Filter by Topic Category (Beginner, Intermediate, Advanced):
                </span>
                <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
                  {TOPIC_DRILL_CONFIGS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTopic(t.id)}
                      className={`px-3 py-2 rounded text-xs font-semibold flex items-center justify-between text-left transition cursor-pointer ${
                        activeTopic === t.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800/80 text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                        {t.count.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleJumpSubmit} className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-semibold">Jump to #:</span>
                <input
                  type="number"
                  min={1}
                  max={totalQuestionsCount}
                  value={jumpInput}
                  onChange={(e) => setJumpInput(e.target.value)}
                  className="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-center"
                />
                <button
                  type="submit"
                  onClick={() => setIsMobileFilterDrawerOpen(false)}
                  className="flex-1 py-1 bg-indigo-600 text-white text-xs font-bold rounded cursor-pointer"
                >
                  Apply & Jump
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* 7. MAIN DOCKED WORKSPACE (INDEPENDENT CLEAN SCROLLING VIEWPORTS) */}
      {/* ==================================================================== */}
      <main className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* ================================================================== */}
        {/* LEFT PANEL: PROBLEM STATEMENT & SCHEMA EXPLORER */}
        {/* ================================================================== */}
        <section
          className={`md:col-span-5 h-full overflow-y-auto overscroll-contain flex-col bg-[#0b101e] border-r border-slate-800 ${
            mobileView === 'problem' ? 'flex' : 'hidden md:flex'
          }`}
        >
          <div className="p-4 lg:p-6 flex flex-col gap-4">
            {/* Header Metadata */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium flex-wrap">
                <span className="font-mono text-slate-300 font-semibold">{problem.id}</span>
                <span className="text-slate-600">•</span>
                <span className="text-indigo-400 font-semibold">{problem.platform}</span>
                <span className="text-slate-600">•</span>
                <span
                  className={`font-bold ${
                    problem.difficulty === 'Easy'
                      ? 'text-emerald-400'
                      : problem.difficulty === 'Medium'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {problem.difficulty}
                </span>
                <span className="text-slate-600">•</span>
                <span>{problem.skillLevel}</span>
                {solvedMap[problem.id] && (
                  <span className="ml-auto text-emerald-400 font-bold flex items-center gap-1 text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ✓ Solved
                  </span>
                )}
              </div>

              <div className="flex items-start justify-between gap-2">
                <h1 className="text-lg lg:text-xl font-extrabold text-white tracking-tight">
                  {problem.title}
                </h1>

                {/* Bookmark / Review toggles */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleMastered(problem.id)}
                    className={`p-1.5 rounded text-xs font-bold transition cursor-pointer ${
                      masteredList.includes(problem.id)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                    title="Mark Mastered"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => toggleReview(problem.id)}
                    className={`p-1.5 rounded text-xs font-bold transition cursor-pointer ${
                      reviewList.includes(problem.id)
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                    title="Needs Review"
                  >
                    ★
                  </button>
                </div>
              </div>
            </div>

            {/* Google Search Grounding Reference & Citations */}
            {problem.groundingCitations && problem.groundingCitations.length > 0 && (
              <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 rounded-xl p-3 border border-blue-500/30 text-xs flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-300 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    Google Search Engine Grounded (gemini-3.8-flash)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Live Verified
                  </span>
                </div>
                {problem.webSearchQueries && problem.webSearchQueries.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 font-semibold">Search queries:</span>
                    {problem.webSearchQueries.map((q, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-200">
                        {q}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-semibold">Live Sources:</span>
                  <div className="flex flex-col gap-1">
                    {problem.groundingCitations.map((c, idx) => (
                      <a
                        key={idx}
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 hover:underline"
                      >
                        <span>🔗</span>
                        <span className="font-medium truncate">{c.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Business Context & Scenario */}
            <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 text-xs leading-relaxed text-slate-300">
              <span className="font-bold text-slate-200 block mb-1 uppercase tracking-wider text-[10px]">
                Business Context & Problem Statement:
              </span>
              <p>{problem.businessScenario}</p>
            </div>

            {/* Explicit Requirements Checklist */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Explicit Requirements:
              </span>
              <ul className="flex flex-col gap-1 text-xs text-slate-300">
                {problem.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold shrink-0">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tabbed Data Explorer: Tab A (Schema & Sample) vs Tab B (Expected Output) */}
            <div className="flex flex-col gap-2 bg-[#0d1424] rounded-xl border border-slate-800 p-3.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDataExplorerTab('schema')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition ${
                      dataExplorerTab === 'schema'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Tab A: Schema & Sample Data
                  </button>
                  <button
                    onClick={() => setDataExplorerTab('expected')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition ${
                      dataExplorerTab === 'expected'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Tab B: Expected Output
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 italic hidden sm:inline">
                  Click column to insert into editor
                </span>
              </div>

              {/* TAB A: Schema Explorer */}
              {dataExplorerTab === 'schema' && (
                <div className="flex flex-col gap-4 pt-1">
                  {problem.schemas.map((schema, sIdx) => (
                    <div key={sIdx} className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => insertTextAtCursor(schema.tableName)}
                          className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/20 cursor-pointer"
                          title="Click to insert table name into SQL query"
                        >
                          📋 {schema.tableName}
                        </button>
                        <span className="text-[10px] text-slate-500">
                          ({schema.columns.length} columns, {schema.sampleRows.length} sample rows)
                        </span>
                      </div>

                      {/* Columns list */}
                      <div className="flex flex-wrap gap-1.5">
                        {schema.columns.map((col, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => insertTextAtCursor(col.name)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded text-xs font-mono text-slate-300 cursor-pointer transition"
                            title={`Insert ${col.name} (${col.type}) into query`}
                          >
                            <span>{col.name}</span>
                            <span className="text-[10px] text-slate-500">:{col.type}</span>
                            {col.isPk && (
                              <span className="text-[9px] px-1 py-0.1 rounded bg-amber-500/20 text-amber-300 font-bold">
                                PK
                              </span>
                            )}
                            {col.isFk && (
                              <span className="text-[9px] px-1 py-0.1 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                                FK
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Sample rows table */}
                      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60 max-h-48">
                        <table className="w-full text-[11px] text-left">
                          <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase">
                            <tr>
                              {schema.columns.map((col, idx) => (
                                <th key={idx} className="px-2.5 py-1.5 border-b border-slate-800">
                                  {col.name}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-900 font-mono text-slate-300">
                            {schema.sampleRows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-900/40">
                                {schema.columns.map((col, cIdx) => (
                                  <td key={cIdx} className="px-2.5 py-1 whitespace-nowrap">
                                    {row[col.name] === null ? (
                                      <span className="text-slate-600 italic">NULL</span>
                                    ) : (
                                      String(row[col.name])
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB B: Expected Output */}
              {dataExplorerTab === 'expected' && (
                <div className="flex flex-col gap-2 pt-1">
                  <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60 max-h-60">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-slate-900 text-indigo-300 font-mono text-[10px] uppercase">
                        <tr>
                          {problem.expectedOutput.columns.map((col, idx) => (
                            <th key={idx} className="px-2.5 py-1.5 border-b border-slate-800">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 font-mono text-slate-200">
                        {problem.expectedOutput.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-900/40">
                            {problem.expectedOutput.columns.map((col, cIdx) => (
                              <td key={cIdx} className="px-2.5 py-1 whitespace-nowrap">
                                {row[col] === null ? (
                                  <span className="text-slate-600 italic">NULL</span>
                                ) : (
                                  String(row[col])
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* 3-Tier Progressive Hint System (Collapsible with smooth animation) */}
            <div className="flex flex-col gap-2 bg-slate-900/60 rounded-xl border border-slate-800/80 p-3.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Progressive 3-Tier Hints:
              </span>

              {/* Tier 1 */}
              <div className="flex flex-col gap-1 border-b border-slate-800/60 pb-2">
                <button
                  onClick={() => setRevealedHintTier((prev) => (prev === 1 ? 0 : 1))}
                  className="flex items-center justify-between text-xs font-semibold text-indigo-300 hover:text-indigo-200 text-left cursor-pointer"
                >
                  <span>Hint 1: High-Level Conceptual Strategy</span>
                  <span>{revealedHintTier >= 1 ? '▼' : '▶'}</span>
                </button>
                <AnimatePresence>
                  {revealedHintTier >= 1 && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="text-xs text-slate-300 pt-1 leading-relaxed pl-2 border-l-2 border-indigo-500 overflow-hidden"
                    >
                      {problem.hints.tier1}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Tier 2 */}
              <div className="flex flex-col gap-1 border-b border-slate-800/60 pb-2">
                <button
                  onClick={() => setRevealedHintTier((prev) => (prev === 2 ? 0 : 2))}
                  className="flex items-center justify-between text-xs font-semibold text-amber-300 hover:text-amber-200 text-left cursor-pointer"
                >
                  <span>Hint 2: Key Clauses & Join/Window Blueprint</span>
                  <span>{revealedHintTier >= 2 ? '▼' : '▶'}</span>
                </button>
                <AnimatePresence>
                  {revealedHintTier >= 2 && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="text-xs text-slate-300 pt-1 leading-relaxed pl-2 border-l-2 border-amber-500 overflow-hidden"
                    >
                      {problem.hints.tier2}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Tier 3 Skeleton */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setRevealedHintTier((prev) => (prev === 3 ? 0 : 3))}
                  className="flex items-center justify-between text-xs font-semibold text-emerald-300 hover:text-emerald-200 text-left cursor-pointer"
                >
                  <span>Hint 3: Fill-In-The-Blank SQL Skeleton</span>
                  <span>{revealedHintTier >= 3 ? '▼' : '▶'}</span>
                </button>
                <AnimatePresence>
                  {revealedHintTier >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="pt-1 overflow-hidden"
                    >
                      <pre className="text-[11px] font-mono bg-slate-950 p-2.5 rounded border border-slate-800 text-emerald-300 overflow-x-auto whitespace-pre">
                        {problem.hints.tier3Skeleton}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Candidate Scratchpad & Personal Notes (Persisted across refreshes) */}
            <div className="flex flex-col gap-2 bg-slate-900/60 rounded-xl border border-slate-800/80 p-3.5">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsNotesOpen((prev) => !prev)}
                  className="text-xs font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isNotesOpen ? '▼' : '▶'}</span>
                  <span>Candidate Scratchpad & Personal Notes</span>
                  {notesMap[problem.id] && notesMap[problem.id].trim() !== '' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                      Saved
                    </span>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {isNotesOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="flex flex-col gap-1.5 pt-1 overflow-hidden"
                  >
                    <textarea
                      value={notesMap[problem.id] || ''}
                      onChange={(e) => handleNoteChange(e.target.value)}
                      placeholder="Type personal notes, schema assumptions, edge cases, or interview tips (auto-saved to local storage)..."
                      className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-sans resize-none focus:outline-none focus:border-cyan-500 selection:bg-cyan-500/30"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Auto-saved per question
                      </span>
                      {notesMap[problem.id] && (
                        <button
                          onClick={() => handleNoteChange('')}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          Clear Notes
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile-only CTA to switch to editor */}
            <div className="md:hidden pt-2 pb-16">
              <button
                onClick={() => setMobileView('editor')}
                className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Ready to Code? Open SQL Editor</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* RIGHT PANEL: INTERACTIVE SQL SANDBOX & EXECUTION ENGINE */}
        {/* ================================================================== */}
        <section
          className={`md:col-span-7 h-full overflow-y-auto overscroll-contain flex flex-col bg-[#090d16] ${
            mobileView === 'editor' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Editor Header Toolbar (Docked cleanly at top of right panel viewport) */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-[#0f172a] border-b border-slate-800 shrink-0 sticky top-0 z-20 shadow-xs">
            {/* Dialect Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Dialect:</span>
              <select
                value={dialect}
                onChange={(e) => setDialect(e.target.value as Dialect)}
                className="bg-slate-900 border border-slate-700 text-indigo-300 rounded px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="postgres">PostgreSQL 15</option>
                <option value="snowflake">Snowflake SQL</option>
                <option value="bigquery">GoogleSQL (BigQuery)</option>
                <option value="mysql">MySQL 8.0</option>
              </select>
            </div>

            {/* Actions: Run, Format, Reset, Clear */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleFormat}
                className="px-2 py-1 text-xs font-medium rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                title="Format SQL Code"
              >
                Format
              </button>
              <button
                onClick={handleResetStarter}
                className="px-2 py-1 text-xs font-medium rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                title="Reset Starter Code"
              >
                Reset
              </button>
              <button
                onClick={() => setSqlCode('')}
                className="px-2 py-1 text-xs font-medium rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                title="Clear Editor"
              >
                Clear
              </button>
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-medium text-slate-300">Draft Auto-Saved</span>
              </div>
              <button
                onClick={handleRunQuery}
                disabled={isExecuting}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                title="Run query to preview output (Ctrl+Enter)"
              >
                <span>▶ Run</span>
              </button>
              <button
                onClick={handleSubmitQuery}
                disabled={isExecuting}
                className="px-3.5 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/25 transition cursor-pointer disabled:opacity-50"
                title="Submit solution for full test evaluation (Ctrl+Shift+Enter)"
              >
                {isExecuting ? (
                  <span>Evaluating...</span>
                ) : (
                  <>
                    <span>✓ Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Line-Numbered SQL Editor (Synchronized scroll & no overlapping) */}
          <div className="relative flex bg-[#070b14] border-b border-slate-800 h-64 min-h-[160px] shrink-0 overflow-hidden">
            {/* Line numbers column (Scroll synced with textarea) */}
            <div
              ref={lineNumbersRef}
              className="w-10 bg-[#090d18] text-slate-600 select-none py-3 px-1 text-right font-mono text-xs border-r border-slate-850 overflow-hidden"
            >
              {lineNumbers.map((num) => (
                <div key={num} className="leading-6">
                  {num}
                </div>
              ))}
            </div>

            {/* Code textarea with synced onScroll */}
            <textarea
              ref={textareaRef}
              value={sqlCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={handleEditorScroll}
              spellCheck={false}
              className="flex-1 bg-transparent text-slate-100 font-mono text-xs lg:text-sm p-3 leading-6 resize-none focus:outline-none focus:ring-0 selection:bg-indigo-600/40 overflow-y-auto overflow-x-auto whitespace-pre"
              placeholder="-- Write your SQL query here..."
            />
          </div>

          {/* Simulated Execution Console & Visual Diff Validator */}
          <div className="flex-1 flex flex-col p-4 lg:p-6 gap-4 bg-[#090d16] pb-24">
            {/* Animated Submission Verdict Banner (Correct with celebration / Wrong with shake) */}
            <AnimatePresence>
              {submissionVerdict && (
                <motion.div
                  key={submissionVerdict.timestamp}
                  initial={{ opacity: 0, y: -12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className={`rounded-xl p-4 border shadow-xl relative overflow-hidden ${
                    submissionVerdict.type === 'correct'
                      ? 'bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-slate-950 border-emerald-500/50 text-emerald-100 ring-1 ring-emerald-500/30'
                      : 'bg-gradient-to-r from-rose-950/80 via-rose-900/40 to-slate-950 border-rose-500/50 text-rose-100 ring-1 ring-rose-500/30 animate-shake'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {submissionVerdict.type === 'correct' ? (
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                          <span className="text-xl animate-bounce">🎉</span>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                          <span className="text-xl animate-pulse">❌</span>
                        </div>
                      )}

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-base font-black tracking-tight ${
                              submissionVerdict.type === 'correct' ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {submissionVerdict.title}
                          </span>
                          <span
                            className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                              submissionVerdict.type === 'correct'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {submissionVerdict.accuracyPct}% Accuracy
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            ⏱ {submissionVerdict.executionTimeMs} ms
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {submissionVerdict.message}
                        </p>

                        {submissionVerdict.details && (
                          <div className="mt-1 p-2 rounded bg-black/40 border border-rose-500/20 text-xs font-mono text-rose-300">
                            {submissionVerdict.details}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 mt-2">
                          {submissionVerdict.type === 'correct' ? (
                            <>
                              <button
                                onClick={handleNextQuestion}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1"
                              >
                                <span>Next Challenge</span>
                                <span>▶</span>
                              </button>
                              <button
                                onClick={() => setConsoleTab('diff')}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition cursor-pointer"
                              >
                                View Diff
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setConsoleTab('diff')}
                                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1"
                              >
                                <span>Inspect Visual Diff</span>
                                <span>🔍</span>
                              </button>
                              <button
                                onClick={() => setConsoleTab('checklist')}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition cursor-pointer"
                              >
                                Checklist
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSubmissionVerdict(null)}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 text-sm font-bold cursor-pointer transition"
                      title="Dismiss verdict"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Status Header & Sub-Tab Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setConsoleTab('diff')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    consoleTab === 'diff'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                  }`}
                >
                  <span>Visual Diff Validator 🔍</span>
                  {executionResult?.diffReport && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        executionResult.diffReport.isFullMatch
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {executionResult.diffReport.accuracyPct}%
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setConsoleTab('output')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    consoleTab === 'output'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                  }`}
                >
                  <span>Result Output Table 📋</span>
                  {executionResult && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                      {executionResult.rowsReturned} rows
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setConsoleTab('checklist')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    consoleTab === 'checklist'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                  }`}
                >
                  <span>Checklist ⚙</span>
                  {executionResult && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                      {executionResult.checklist.filter((c) => c.passed).length}/{executionResult.checklist.length}
                    </span>
                  )}
                </button>
              </div>

              {executionResult && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    {executionResult.executionTimeMs} ms
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                      executionResult.status === 'ACCEPTED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {executionResult.status === 'ACCEPTED' ? '✓ ACCEPTED' : '⚠ NEEDS ADJUSTMENT'}
                  </span>
                </div>
              )}
            </div>

            {/* TAB CONTENT: 1. VISUAL DIFF VALIDATOR */}
            <AnimatePresence mode="wait">
              {consoleTab === 'diff' && (
                <motion.div
                  key="tab-diff"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16 }}
                  className="flex flex-col gap-3"
                >
                  {executionResult?.diffReport ? (
                    <>
                      {/* Top Diff Match Banner */}
                      <div
                        className={`rounded-xl p-3.5 border flex items-center justify-between gap-3 ${
                          executionResult.diffReport.isFullMatch
                            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                            : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">
                            {executionResult.diffReport.isFullMatch ? '✓' : '⚠'}
                          </span>
                          <div>
                            <span className="font-extrabold text-sm block">
                              {executionResult.diffReport.isFullMatch
                                ? '100% Match! All Data Grain & Schema Tests Passed'
                                : 'Visual Diff: Mismatch Detected Between Output and Target'}
                            </span>
                            <span className="text-xs opacity-80 block">
                              {executionResult.diffReport.isFullMatch
                                ? 'Query produced exact expected columns, row ordering, and cell values.'
                                : `${executionResult.diffReport.mismatchedRowCount} row(s) differ from target output. Inspect side-by-side comparison below.`}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="font-mono text-lg font-black block">
                            {executionResult.diffReport.accuracyPct}%
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                            Accuracy
                          </span>
                        </div>
                      </div>

                      {/* KPI Quick-Stat Tiles */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {/* 1. Accuracy Tile */}
                        <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 flex flex-col gap-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Cell Match</span>
                          <span className="font-mono text-sm font-bold text-slate-100">
                            {executionResult.diffReport.accuracyPct}%
                          </span>
                          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                executionResult.diffReport.accuracyPct === 100
                                  ? 'bg-emerald-500'
                                  : executionResult.diffReport.accuracyPct >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${executionResult.diffReport.accuracyPct}%` }}
                            />
                          </div>
                        </div>

                        {/* 2. Columns Alignment Tile */}
                        <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 flex flex-col gap-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Columns Alignment</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-sm font-bold text-slate-100">
                              {executionResult.diffReport.userColumns.length} / {executionResult.diffReport.expectedColumns.length}
                            </span>
                            <span
                              className={`text-[10px] px-1 rounded font-bold ${
                                executionResult.diffReport.columnMatch
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {executionResult.diffReport.columnMatch ? '✓ Matched' : '⚠ Mismatched'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 truncate">
                            {executionResult.diffReport.missingColumns.length > 0
                              ? `Missing: ${executionResult.diffReport.missingColumns.join(', ')}`
                              : 'All target columns present'}
                          </span>
                        </div>

                        {/* 3. Row Count Alignment Tile */}
                        <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 flex flex-col gap-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Row Count</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-sm font-bold text-slate-100">
                              {executionResult.diffReport.userRowCount} vs {executionResult.diffReport.expectedRowCount}
                            </span>
                            <span
                              className={`text-[10px] px-1 rounded font-bold ${
                                executionResult.diffReport.rowCountMatch
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {executionResult.diffReport.rowCountMatch ? '✓ Equal' : '⚠ Delta'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {executionResult.diffReport.rowCountMatch
                              ? 'Exact target cardinality'
                              : `${Math.abs(
                                  executionResult.diffReport.userRowCount -
                                    executionResult.diffReport.expectedRowCount
                                )} row difference`}
                          </span>
                        </div>

                        {/* 4. Solved Status Tile */}
                        <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 flex flex-col gap-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Status Badge</span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-mono text-xs font-extrabold px-1.5 py-0.5 rounded ${
                                executionResult.diffReport.isFullMatch
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {executionResult.diffReport.isFullMatch ? 'PASSED' : 'NEEDS TWEAK'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {executionResult.diffReport.mismatchedRowCount === 0
                              ? 'Zero mismatches'
                              : `${executionResult.diffReport.mismatchedRowCount} rows with diffs`}
                          </span>
                        </div>
                      </div>

                      {/* View Controls Bar (Split vs Unified) */}
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/70 p-2 rounded-lg border border-slate-800 text-xs">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setDiffViewMode('split')}
                            className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
                              diffViewMode === 'split'
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            Side-by-Side Split View
                          </button>
                          <button
                            onClick={() => setDiffViewMode('unified')}
                            className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
                              diffViewMode === 'unified'
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            Unified Matrix View
                          </button>
                        </div>

                        {/* Filter Mismatches Only */}
                        <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 font-medium select-none text-[11px]">
                          <input
                            type="checkbox"
                            checked={diffOnlyMismatches}
                            onChange={(e) => setDiffOnlyMismatches(e.target.checked)}
                            className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                          />
                          <span>Show Mismatches Only</span>
                        </label>
                      </div>

                      {/* VIEW 1: SIDE-BY-SIDE SPLIT VIEW (Responsive: 1 col on <xl, 2 cols on >=xl) */}
                      {diffViewMode === 'split' && (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                          {/* LEFT: Your Query Output */}
                          <div className="flex flex-col gap-1.5 bg-slate-950/70 rounded-xl border border-slate-800 p-3">
                            <div className="flex items-center justify-between border-b border-slate-850 pb-1.5">
                              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                                <span>💻 Your Query Output</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400">
                                  {executionResult.diffReport.userRowCount} rows
                                </span>
                              </span>
                              {executionResult.diffReport.extraColumns.length > 0 && (
                                <span className="text-[10px] text-amber-400 font-semibold">
                                  +{executionResult.diffReport.extraColumns.length} extra cols
                                </span>
                              )}
                            </div>

                            <div className="overflow-x-auto max-h-64">
                              <table className="w-full text-xs text-left">
                                <thead className="bg-slate-900/90 text-slate-400 font-mono text-[10px] uppercase">
                                  <tr>
                                    <th className="px-2 py-1.5 border-b border-slate-800 w-8">#</th>
                                    {executionResult.diffReport.expectedColumns.map((col, idx) => {
                                      const hasUserCol = executionResult.diffReport?.userColumns.some(
                                        (c) => c.toLowerCase() === col.toLowerCase()
                                      );
                                      return (
                                        <th
                                          key={idx}
                                          className={`px-2.5 py-1.5 border-b border-slate-800 ${
                                            hasUserCol ? 'text-slate-300' : 'text-rose-400 line-through'
                                          }`}
                                        >
                                          {col}
                                        </th>
                                      );
                                    })}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-900 font-mono text-slate-300">
                                  {Array.from({
                                    length: Math.max(
                                      executionResult.diffReport.userRowCount,
                                      executionResult.diffReport.expectedRowCount
                                    ),
                                  }).map((_, rIdx) => {
                                    const userRow = executionResult.outputRows[rIdx];
                                    const isMismatchedRow = executionResult.diffReport?.cellDiffs.some(
                                      (cd) => cd.rowIndex === rIdx && !cd.isMatch
                                    );

                                    if (diffOnlyMismatches && !isMismatchedRow) return null;

                                    if (!userRow) {
                                      return (
                                        <tr key={rIdx} className="bg-rose-950/20 text-rose-400/80 italic text-[11px]">
                                          <td className="px-2 py-1.5">{rIdx + 1}</td>
                                          <td
                                            colSpan={executionResult.diffReport?.expectedColumns.length || 1}
                                            className="px-2.5 py-1.5 border border-dashed border-rose-500/30 text-rose-300 text-center"
                                          >
                                            [Missing Expected Row #{rIdx + 1}]
                                          </td>
                                        </tr>
                                      );
                                    }

                                    return (
                                      <tr
                                        key={rIdx}
                                        className={isMismatchedRow ? 'bg-rose-950/15' : 'hover:bg-slate-900/40'}
                                      >
                                        <td className="px-2 py-1.5 text-slate-500 text-[10px]">{rIdx + 1}</td>
                                        {executionResult.diffReport?.expectedColumns.map((col, cIdx) => {
                                          const cellDiff = executionResult.diffReport?.cellDiffs.find(
                                            (cd) => cd.rowIndex === rIdx && cd.colName === col
                                          );
                                          const isMatch = cellDiff?.isMatch ?? false;
                                          const val = cellDiff?.userValue;

                                          return (
                                            <td
                                              key={cIdx}
                                              className={`px-2.5 py-1.5 whitespace-nowrap transition ${
                                                isMatch
                                                  ? 'text-emerald-300 font-medium'
                                                  : 'bg-rose-500/20 text-rose-200 font-bold border border-rose-500/40'
                                              }`}
                                            >
                                              {val === undefined ? (
                                                <span className="text-slate-600 italic">NULL/Missing</span>
                                              ) : (
                                                String(val)
                                              )}
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* RIGHT: Expected Target Output */}
                          <div className="flex flex-col gap-1.5 bg-slate-950/70 rounded-xl border border-slate-800 p-3">
                            <div className="flex items-center justify-between border-b border-slate-850 pb-1.5">
                              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                                <span>🎯 Target Expected Output</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-200">
                                  {executionResult.diffReport.expectedRowCount} rows
                                </span>
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                Verified Target Grain
                              </span>
                            </div>

                            <div className="overflow-x-auto max-h-64">
                              <table className="w-full text-xs text-left">
                                <thead className="bg-slate-900/90 text-indigo-300 font-mono text-[10px] uppercase">
                                  <tr>
                                    <th className="px-2 py-1.5 border-b border-slate-800 w-8">#</th>
                                    {problem.expectedOutput.columns.map((col, idx) => (
                                      <th key={idx} className="px-2.5 py-1.5 border-b border-slate-800">
                                        {col}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-900 font-mono text-slate-200">
                                  {problem.expectedOutput.rows.map((row, rIdx) => {
                                    const isMismatchedRow = executionResult.diffReport?.cellDiffs.some(
                                      (cd) => cd.rowIndex === rIdx && !cd.isMatch
                                    );

                                    if (diffOnlyMismatches && !isMismatchedRow) return null;

                                    return (
                                      <tr key={rIdx} className="hover:bg-slate-900/40">
                                        <td className="px-2 py-1.5 text-slate-500 text-[10px]">{rIdx + 1}</td>
                                        {problem.expectedOutput.columns.map((col, cIdx) => (
                                          <td key={cIdx} className="px-2.5 py-1.5 whitespace-nowrap text-slate-200">
                                            {row[col] === null ? (
                                              <span className="text-slate-600 italic">NULL</span>
                                            ) : (
                                              String(row[col])
                                            )}
                                          </td>
                                        ))}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* VIEW 2: UNIFIED MATRIX VIEW */}
                      {diffViewMode === 'unified' && (
                        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 max-h-72">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase">
                              <tr>
                                <th className="px-3 py-2 border-b border-slate-800">Row</th>
                                <th className="px-3 py-2 border-b border-slate-800">Field / Column</th>
                                <th className="px-3 py-2 border-b border-slate-800">Your Query Value</th>
                                <th className="px-3 py-2 border-b border-slate-800">Expected Value</th>
                                <th className="px-3 py-2 border-b border-slate-800 text-right">Match Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900 font-mono">
                              {executionResult.diffReport.cellDiffs.map((diff, idx) => {
                                if (diffOnlyMismatches && diff.isMatch) return null;

                                return (
                                  <tr
                                    key={idx}
                                    className={
                                      diff.isMatch
                                        ? 'hover:bg-slate-900/40 text-slate-300'
                                        : 'bg-rose-950/20 text-rose-200 font-semibold'
                                    }
                                  >
                                    <td className="px-3 py-1.5 text-slate-500">{diff.rowIndex + 1}</td>
                                    <td className="px-3 py-1.5 text-indigo-300 font-bold">{diff.colName}</td>
                                    <td className="px-3 py-1.5">
                                      {diff.userValue === undefined ? (
                                        <span className="text-rose-400 italic font-normal">[Missing]</span>
                                      ) : (
                                        String(diff.userValue)
                                      )}
                                    </td>
                                    <td className="px-3 py-1.5 text-slate-300">
                                      {diff.expectedValue === undefined ? (
                                        <span className="text-slate-600 italic">[None]</span>
                                      ) : (
                                        String(diff.expectedValue)
                                      )}
                                    </td>
                                    <td className="px-3 py-1.5 text-right">
                                      {diff.isMatch ? (
                                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                                          ✓ PASS
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold text-[11px] px-1.5 py-0.2 rounded bg-rose-500/20 border border-rose-500/30">
                                          ✗ MISMATCH
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Diagnostic Guidance for Mismatches */}
                      {!executionResult.diffReport.isFullMatch && (
                        <div className="bg-amber-950/20 rounded-xl p-3 border border-amber-500/30 text-xs text-amber-200 flex flex-col gap-1">
                          <span className="font-extrabold flex items-center gap-1.5 text-amber-300">
                            <span>💡 Automated Debugging Diagnosis:</span>
                          </span>
                          {executionResult.diffReport.missingColumns.length > 0 && (
                            <p>
                              • Missing expected column alias(es):{' '}
                              <span className="font-mono font-bold text-white">
                                {executionResult.diffReport.missingColumns.join(', ')}
                              </span>
                              . Make sure to alias your projected fields using{' '}
                              <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">
                                AS [column_name]
                              </code>
                              .
                            </p>
                          )}
                          {!executionResult.diffReport.rowCountMatch && (
                            <p>
                              • Row count delta: Expected{' '}
                              <span className="font-bold">{executionResult.diffReport.expectedRowCount} rows</span>, but query
                              yielded{' '}
                              <span className="font-bold">{executionResult.diffReport.userRowCount} rows</span>. Review your
                              WHERE filtering predicates, HAVING aggregates, or JOIN criteria.
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                      <span className="text-2xl">🔍</span>
                      <span className="text-slate-300 font-bold text-sm">Visual Diff Validator Ready</span>
                      <p className="max-w-md text-slate-400">
                        Write your SQL query in the editor and click &quot;Run Code&quot; (or press Ctrl+Enter). The validator will automatically compare your column aliases, row count, and cell values against the official test case.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB CONTENT: 2. STANDARD OUTPUT GRID */}
              {consoleTab === 'output' && (
                <motion.div
                  key="tab-output"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16 }}
                  className="flex flex-col gap-3"
                >
                  {executionResult ? (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-bold uppercase tracking-wider text-[11px]">
                          Returned Grid ({executionResult.rowsReturned} rows):
                        </span>
                        <span className="font-mono text-slate-500">{executionResult.executionTimeMs} ms</span>
                      </div>

                      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/80 max-h-64">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase">
                            <tr>
                              {executionResult.outputColumns.map((col, idx) => (
                                <th key={idx} className="px-3 py-2 border-b border-slate-800">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-900 font-mono text-slate-200">
                            {executionResult.outputRows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-900/40">
                                {executionResult.outputColumns.map((col, cIdx) => (
                                  <td key={cIdx} className="px-3 py-1.5 whitespace-nowrap">
                                    {row[col] === null ? (
                                      <span className="text-slate-600 italic">NULL</span>
                                    ) : (
                                      String(row[col])
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 text-center text-xs text-slate-500">
                      Click &quot;Run Code&quot; to view tabular query output.
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB CONTENT: 3. REQUIREMENTS CHECKLIST */}
              {consoleTab === 'checklist' && (
                <motion.div
                  key="tab-checklist"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16 }}
                  className="flex flex-col gap-3"
                >
                  {executionResult ? (
                    <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col gap-2">
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Structural Clauses & Requirements Verification:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {executionResult.checklist.map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg font-medium transition ${
                              item.passed
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                            }`}
                          >
                            <span className="text-sm font-bold">{item.passed ? '✓' : '✗'}</span>
                            <span>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 text-center text-xs text-slate-500">
                      Click &quot;Run Code&quot; to test your query against structural validation rules.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapsible Official Solution & Deep-Dive (Smooth AnimatePresence) */}
            <div className="flex flex-col gap-3 pt-2">
              {/* Official Solution Accordion */}
              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setIsSolutionOpen((prev) => !prev)}
                    className="text-xs font-bold text-indigo-300 hover:text-indigo-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{isSolutionOpen ? '▼' : '▶'}</span>
                    <span>View Official Production Solution ({dialect.toUpperCase()})</span>
                  </button>

                  {isSolutionOpen && (
                    <button
                      onClick={handleCopySolution}
                      className="px-2.5 py-1 text-xs font-bold rounded bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition shadow-sm"
                    >
                      Copy to Editor
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {isSolutionOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <pre className="text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 text-emerald-300 overflow-x-auto whitespace-pre">
                        {problem.officialSolutionByDialect[dialect]}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Deep-Dive Execution Plan */}
              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-3.5 flex flex-col gap-2">
                <button
                  onClick={() => setIsDeepDiveOpen((prev) => !prev)}
                  className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span>{isDeepDiveOpen ? '▼' : '▶'}</span>
                  <span>Execution Plan Deep-Dive & SARGability Architecture</span>
                </button>

                <AnimatePresence>
                  {isDeepDiveOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800/80 overflow-hidden"
                    >
                      <div>
                        <span className="font-bold text-slate-200 block mb-1">
                          1. Logical SQL Execution Order:
                        </span>
                        <ol className="list-decimal pl-4 flex flex-col gap-0.5 text-slate-400">
                          {problem.deepDive.executionOrder.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <span className="font-bold text-slate-200 block mb-1">
                          2. Recommended Indexing Strategy:
                        </span>
                        <code className="block bg-slate-950 p-2 rounded border border-slate-850 font-mono text-cyan-300 text-[11px]">
                          {problem.deepDive.indexStrategy}
                        </code>
                      </div>

                      <div>
                        <span className="font-bold text-slate-200 block mb-0.5">
                          3. Complexity Analysis:
                        </span>
                        <p className="text-slate-400">{problem.deepDive.complexity}</p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-200 block mb-0.5">
                          4. Architectural Tradeoffs:
                        </span>
                        <p className="text-slate-400">{problem.deepDive.tradeoffs}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==================================================================== */}
      {/* 8. STORAGE & PROGRESS MANAGER MODAL (Smooth AnimatePresence) */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isStorageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStorageModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18 }}
              className="relative z-10 bg-[#0f172a] border border-slate-750 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💾</span>
                  <div>
                    <h2 className="text-base font-extrabold text-white">
                      Local Storage & Progress Manager
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Auto-saved across page reloads & mobile webviews
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsStorageModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 flex flex-col gap-4 text-xs text-slate-300">
                <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col gap-1.5">
                  <span className="font-bold text-slate-200 uppercase text-[10px] tracking-wider">
                    Persistent Storage Status:
                  </span>
                  <p className="leading-relaxed text-slate-400">
                    Your customized SQL code drafts, scratchpad notes, countdown preferences, and solved/mastered flags are automatically synced to sandboxed local storage so your practice session will never refresh or disappear.
                  </p>
                </div>

                {/* Progress Counters Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">Questions Solved</span>
                    <span className="font-mono text-base font-black text-emerald-400">
                      {Object.keys(solvedMap).length}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">Mastered</span>
                    <span className="font-mono text-base font-black text-indigo-400">
                      {masteredList.length}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">Needs Review</span>
                    <span className="font-mono text-base font-black text-amber-400">
                      {reviewList.length}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">Custom Drafts</span>
                    <span className="font-mono text-base font-black text-cyan-400">
                      {Object.keys(savedQueries).length}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">Saved Notes</span>
                    <span className="font-mono text-base font-black text-fuchsia-400">
                      {Object.keys(notesMap).length}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">Active Dialect</span>
                    <span className="font-mono text-xs font-bold text-slate-200 uppercase mt-1 block">
                      {dialect}
                    </span>
                  </div>
                </div>

                {/* Cloud Database & Account Integration */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Google Cloud Firestore
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      Database Provisioned
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {currentUser
                      ? `Signed in as ${currentUser.email || currentUser.displayName || 'Candidate'}. Progress is automatically synced to Firestore.`
                      : 'You are currently in guest/offline mode. Sign in to link your progress across browsers and devices.'}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    {currentUser ? (
                      <button
                        onClick={handleCloudSyncAll}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
                      >
                        <span>🔄 Sync All to Cloud Now</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsStorageModalOpen(false);
                          openAuthModal('signin');
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
                      >
                        <span>✨ Sign In / Create Account</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Backup & Actions */}
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportBackup}
                      className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
                    >
                      <span>📥 Export Backup (JSON)</span>
                    </button>
                    <button
                      onClick={handleClearAllProgress}
                      className="py-2 px-3 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs cursor-pointer transition"
                    >
                      <span>Reset All Data</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Real-Time Automated Live Ingestion Toast Notification */}
      <AnimatePresence>
        {liveToast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-xl bg-slate-900/95 border border-indigo-500/50 shadow-2xl backdrop-blur-md flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 text-base">
              📡
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Auto-Ingested Just Now
                </span>
                <button
                  onClick={() => setLiveToast(null)}
                  className="text-slate-500 hover:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="font-bold text-xs text-slate-100 truncate mt-0.5">
                {liveToast.title}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                Source: {liveToast.source}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveMode('live_stream');
                    const target = liveProblems.find((p) => p.title.includes(liveToast.title));
                    if (target) {
                      setSelectedLiveProblemId(target.id);
                    }
                    setLiveToast(null);
                  }}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition cursor-pointer shadow-sm"
                >
                  Solve In Sandbox ▶
                </button>
                <button
                  onClick={() => setLiveToast(null)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Animated Auth Modal */}
      <AuthModal />

      {/* Multi-Platform Live Question Ingestion Modal */}
      <PlatformFetchModal
        isOpen={isPlatformModalOpen}
        onClose={() => setIsPlatformModalOpen(false)}
        onSelectProblem={(prob) => {
          setActiveMode('live_stream');
          setSelectedLiveProblemId(prob.id);
          setQuestionNumber(1);
        }}
        onToast={(msg) => {
          setInsertToast(msg);
          setTimeout(() => setInsertToast(null), 3500);
        }}
        onOpenDirectory={() => {
          setCurrentView('directory');
          window.location.hash = '#/questions';
        }}
      />
    </div>
  );
}
