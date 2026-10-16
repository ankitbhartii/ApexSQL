/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Dialect = 'postgres' | 'snowflake' | 'bigquery' | 'mysql';

export type Mode = 'skill_matrix' | 'leetcode' | 'hackerrank' | 'faang_mock' | 'live_stream';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type IndustryDomain = 'SaaS' | 'FinTech' | 'E-Commerce' | 'Logistics' | 'Healthcare';

export type TopicCategory =
  | 'all'
  // Beginner Topics
  | 'beginner_basics'
  | 'beginner_sorting'
  | 'beginner_math'
  // Intermediate Topics
  | 'intermediate_case'
  | 'aggregations'
  | 'joins'
  | 'subqueries'
  | 'set_operations'
  // Advanced Topics
  | 'window'
  | 'ctes'
  | 'datetime'
  | 'funnel_cohort'
  | 'optimization'
  | 'advanced_analytics';

export interface ColumnDef {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  description?: string;
}

export interface TableSchema {
  tableName: string;
  columns: ColumnDef[];
  sampleRows: Record<string, any>[];
}

export interface VerificationCheck {
  id: string;
  label: string;
  passed: boolean;
}

export interface CellDiff {
  rowIndex: number;
  colName: string;
  userValue: any;
  expectedValue: any;
  isMatch: boolean;
  status: 'MATCH' | 'VALUE_MISMATCH' | 'MISSING_USER_CELL' | 'EXTRA_USER_CELL';
}

export interface DiffReport {
  isFullMatch: boolean;
  accuracyPct: number;
  expectedColumns: string[];
  userColumns: string[];
  missingColumns: string[];
  extraColumns: string[];
  expectedRowCount: number;
  userRowCount: number;
  rowCountMatch: boolean;
  columnMatch: boolean;
  cellDiffs: CellDiff[];
  mismatchedRowCount: number;
  userColumnCount?: number;
  expectedColumnCount?: number;
}

export interface ExecutionResult {
  status: 'ACCEPTED' | 'NEEDS_ADJUSTMENT' | 'SYNTAX_ERROR';
  executionTimeMs: number;
  message: string;
  rowsReturned: number;
  outputColumns: string[];
  outputRows: Record<string, any>[];
  checklist: VerificationCheck[];
  diffReport?: DiffReport;
}

export interface SqlProblem {
  id: string;
  questionNumber: number;
  title: string;
  platform: 'LeetCode' | 'HackerRank' | 'DataDriven' | 'FAANG+ Mock' | 'Skill Matrix' | 'Live Contest / Interview';
  difficulty: Difficulty;
  skillLevel: SkillLevel;
  industry: IndustryDomain;
  topic: TopicCategory;
  topicLabel: string;
  businessScenario: string;
  requirements: string[];
  schemas: TableSchema[];
  expectedOutput: {
    columns: string[];
    rows: Record<string, any>[];
  };
  hints: {
    tier1: string;
    tier2: string;
    tier3Skeleton: string;
  };
  starterCodeByDialect: Record<Dialect, string>;
  officialSolutionByDialect: Record<Dialect, string>;
  deepDive?: {
    executionOrder: string[];
    indexStrategy: string;
    complexity: string;
    tradeoffs: string;
  };
  // Live Feed & Real-time Auto-Ingestion Metadata
  sourcePlatform?: string;
  sourceUrl?: string;
  contestRound?: string;
  ingestedAt?: string;
  isLiveAutoIngested?: boolean;
  companyTag?: string;
  // Google Search Grounding Metadata
  webSearchQueries?: string[];
  groundingCitations?: { title: string; url: string; snippet?: string }[];
  searchSource?: string;
}

export interface TopicConfig {
  id: TopicCategory;
  label: string;
  level: SkillLevel;
  count: number;
  description: string;
  icon: string;
}

export interface LivePipelineStatus {
  isAutoSyncActive: boolean;
  isFetchingNow: boolean;
  lastSyncTimestamp: number;
  totalIngestedCount: number;
  lastIngestedProblemTitle: string | null;
  activeSource: string;
  statusMessage: string;
}
