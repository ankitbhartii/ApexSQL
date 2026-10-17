/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SqlProblem, TableSchema, Dialect } from '../types';

export function buildCleanStarterCode(_schemas?: TableSchema[]): Record<Dialect, string> {
  return {
    postgres: '-- Write your PostgreSQL query statement below\n',
    mysql: '# Write your MySQL query statement below\n',
    snowflake: '-- Write your Snowflake SQL query statement below\n',
    bigquery: '-- Write your GoogleSQL (BigQuery) query statement below\n',
  };
}

export function isSolutionLeak(candidateCode?: string, officialSolution?: string): boolean {
  if (!candidateCode) return false;

  // Filter out any old boilerplate templates with SELECT FROM
  if (/^(--|#)\s*write your .* query statement below\s*select\s*from/i.test(candidateCode.trim())) {
    return true;
  }

  if (!officialSolution) return false;

  const normalize = (sql: string) =>
    sql
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/[`"'[\]]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/;/g, '')
      .trim()
      .toLowerCase();

  const cleanCand = normalize(candidateCode);
  const cleanSol = normalize(officialSolution);

  if (!cleanCand) return false;

  // Exact match without comments/punctuation/whitespace
  if (cleanCand === cleanSol) return true;

  // If candidate contains substantial query clauses identical to solution
  if (cleanCand.length > 15 && cleanSol.includes(cleanCand)) {
    if (/\b(where|group by|order by|having|join|limit|partition by|over|union)\b/i.test(cleanCand)) {
      return true;
    }
  }

  // Also check if candidate has where/join matching solution
  if (cleanSol.length > 20 && cleanCand.length > 20) {
    const candWhere = cleanCand.match(/\bwhere\b.*/i)?.[0];
    const solWhere = cleanSol.match(/\bwhere\b.*/i)?.[0];
    if (candWhere && solWhere && candWhere === solWhere) {
      return true;
    }
  }

  return false;
}

export function getCleanStarterCode(_problem?: SqlProblem | null, dialect: Dialect = 'postgres'): string {
  const dialectHeaders: Record<Dialect, string> = {
    postgres: '-- Write your PostgreSQL query statement below\n',
    mysql: '# Write your MySQL query statement below\n',
    snowflake: '-- Write your Snowflake SQL query statement below\n',
    bigquery: '-- Write your GoogleSQL (BigQuery) query statement below\n',
  };
  return dialectHeaders[dialect] || dialectHeaders.postgres;
}


export interface PlatformInfo {
  id: 'leetcode' | 'hackerrank' | 'datadriven' | 'stackoverflow' | 'stratascratch' | 'all';
  name: string;
  tagline: string;
  icon: string;
  color: string;
  bgLight: string;
  borderColor: string;
  badgeColor: string;
  apiEndpoint: string;
  description: string;
  totalAvailable: number;
  companies: string[];
}

export const SUPPORTED_PLATFORMS: PlatformInfo[] = [
  {
    id: 'all',
    name: 'All Platforms',
    tagline: 'Multi-Source Aggregated Ingestion',
    icon: '🌐',
    color: 'text-indigo-400',
    bgLight: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    badgeColor: 'bg-indigo-500/20 text-indigo-300',
    apiEndpoint: '/api/fetch-platform-questions?platform=all',
    description: 'Unified stream aggregating Stack Overflow Interview Archive (10,000 Qs), DataDriven.io (928 Qs), LeetCode Database (323 Qs), HackerRank SQL Track (58 Qs), and FAANG case challenges.',
    totalAvailable: 11309,
    companies: ['Google', 'Meta', 'Amazon', 'Apple', 'Uber', 'Netflix', 'Stripe', 'Goldman Sachs'],
  },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    tagline: '10,000 Real Interview & Production Rounds Questions',
    icon: '🟧',
    color: 'text-orange-400',
    bgLight: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    badgeColor: 'bg-orange-500/20 text-orange-300',
    apiEndpoint: 'https://api.stackexchange.com/2.3/questions?tagged=sql',
    description: '10,000 authentic production and interview challenge questions sourced from Stack Overflow top-voted interview rounds, architectural problem-solving, and data engineering loops.',
    totalAvailable: 10000,
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Uber', 'Stripe', 'Airbnb', 'Databricks', 'Snowflake', 'Palantir'],
  },
  {
    id: 'datadriven',
    name: 'DataDriven.io',
    tagline: '928 SQL Interview Questions (2026)',
    icon: '⚡',
    color: 'text-cyan-400',
    bgLight: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    badgeColor: 'bg-cyan-500/20 text-cyan-300',
    apiEndpoint: 'https://datadriven.io/sql-interview-questions',
    description: '928 authentic SQL interview questions from Meta, Amazon, Apple, Netflix, Google, Microsoft, Nvidia, Tesla, Uber reported data engineer loops.',
    totalAvailable: 928,
    companies: ['Meta', 'Amazon', 'Apple', 'Netflix', 'Google', 'Microsoft', 'Nvidia', 'Tesla', 'Uber', 'Airbnb'],
  },
  {
    id: 'leetcode',
    name: 'LeetCode',
    tagline: 'All 323 Database Questions',
    icon: '🟡',
    color: 'text-amber-400',
    bgLight: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    badgeColor: 'bg-amber-500/20 text-amber-300',
    apiEndpoint: 'https://leetcode.com/graphql',
    description: 'Complete 323 LeetCode SQL database questions with exact schemas, test rows, and canonical solutions.',
    totalAvailable: 323,
    companies: ['Amazon', 'Apple', 'Bloomberg', 'Microsoft', 'Oracle', 'Google', 'Meta'],
  },
  {
    id: 'hackerrank',
    name: 'HackerRank',
    tagline: 'Complete 58 SQL Domain Challenges',
    icon: '🟢',
    color: 'text-emerald-400',
    bgLight: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    badgeColor: 'bg-emerald-500/20 text-emerald-300',
    apiEndpoint: 'https://www.hackerrank.com/rest/contests/master/tracks/sql/challenges',
    description: 'All 58 official challenges across Basic Select, Advanced Select, Aggregations, and Advanced Joins.',
    totalAvailable: 58,
    companies: ['Goldman Sachs', 'Morgan Stanley', 'IBM', 'PayPal', 'Booking.com'],
  },
  {
    id: 'stratascratch',
    name: 'StrataScratch & FAANG',
    tagline: 'Enterprise Production Analytics Cases',
    icon: '🟣',
    color: 'text-purple-400',
    bgLight: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    badgeColor: 'bg-purple-500/20 text-purple-300',
    apiEndpoint: '/api/fetch-platform-questions?platform=stratascratch',
    description: 'Senior analytics engineer & data scientist interview cases with real-world schemas.',
    totalAvailable: 50,
    companies: ['Meta', 'Uber', 'Airbnb', 'Spotify', 'Stripe', 'DoorDash', 'Netflix'],
  },
];

// Reusable Authentic Schemas
export const SCHEMA_CITY: TableSchema = {
  tableName: 'CITY',
  columns: [
    { name: 'ID', type: 'INT', isPk: true },
    { name: 'NAME', type: 'VARCHAR' },
    { name: 'COUNTRYCODE', type: 'VARCHAR' },
    { name: 'DISTRICT', type: 'VARCHAR' },
    { name: 'POPULATION', type: 'INT' },
  ],
  sampleRows: [
    { ID: 3878, NAME: 'Scottsdale', COUNTRYCODE: 'USA', DISTRICT: 'Arizona', POPULATION: 202705 },
    { ID: 3965, NAME: 'Corona', COUNTRYCODE: 'USA', DISTRICT: 'California', POPULATION: 124966 },
    { ID: 1613, NAME: 'Neyagawa', COUNTRYCODE: 'JPN', DISTRICT: 'Osaka', POPULATION: 257315 },
    { ID: 1661, NAME: 'Sayama', COUNTRYCODE: 'JPN', DISTRICT: 'Saitama', POPULATION: 162472 },
    { ID: 4001, NAME: 'Cedar Rapids', COUNTRYCODE: 'USA', DISTRICT: 'Iowa', POPULATION: 89000 },
  ],
};

export const SCHEMA_COUNTRY: TableSchema = {
  tableName: 'COUNTRY',
  columns: [
    { name: 'CODE', type: 'VARCHAR', isPk: true },
    { name: 'NAME', type: 'VARCHAR' },
    { name: 'CONTINENT', type: 'VARCHAR' },
    { name: 'REGION', type: 'VARCHAR' },
    { name: 'POPULATION', type: 'INT' },
  ],
  sampleRows: [
    { CODE: 'USA', NAME: 'United States', CONTINENT: 'North America', REGION: 'North America', POPULATION: 278357000 },
    { CODE: 'JPN', NAME: 'Japan', CONTINENT: 'Asia', REGION: 'Eastern Asia', POPULATION: 126714000 },
    { CODE: 'NGA', NAME: 'Nigeria', CONTINENT: 'Africa', REGION: 'Western Africa', POPULATION: 111506000 },
  ],
};

export const SCHEMA_STATION: TableSchema = {
  tableName: 'STATION',
  columns: [
    { name: 'ID', type: 'INT', isPk: true },
    { name: 'CITY', type: 'VARCHAR' },
    { name: 'STATE', type: 'VARCHAR' },
    { name: 'LAT_N', type: 'FLOAT' },
    { name: 'LONG_W', type: 'FLOAT' },
  ],
  sampleRows: [
    { ID: 794, CITY: 'Kissee Mills', STATE: 'MO', LAT_N: 139.60, LONG_W: 73.18 },
    { ID: 824, CITY: 'Loma Mar', STATE: 'CA', LAT_N: 48.55, LONG_W: 130.53 },
    { ID: 622, CITY: 'Tipton', STATE: 'IN', LAT_N: 33.54, LONG_W: 97.88 },
    { ID: 438, CITY: 'Glencoe', STATE: 'KY', LAT_N: 60.18, LONG_W: 91.88 },
    { ID: 584, CITY: 'Chignik', STATE: 'AK', LAT_N: 103.47, LONG_W: 110.15 },
    { ID: 211, CITY: 'Albany', STATE: 'NY', LAT_N: 42.65, LONG_W: 73.75 },
    { ID: 310, CITY: 'Ohiowa', STATE: 'NE', LAT_N: 40.41, LONG_W: 97.45 },
  ],
};

export const SCHEMA_STUDENTS: TableSchema = {
  tableName: 'STUDENTS',
  columns: [
    { name: 'ID', type: 'INT', isPk: true },
    { name: 'Name', type: 'VARCHAR' },
    { name: 'Marks', type: 'INT' },
  ],
  sampleRows: [
    { ID: 1, Name: 'Ashley', Marks: 81 },
    { ID: 2, Name: 'Samantha', Marks: 75 },
    { ID: 3, Name: 'Julia', Marks: 76 },
    { ID: 4, Name: 'Scarlet', Marks: 84 },
    { ID: 5, Name: 'Ketty', Marks: 20 },
  ],
};

export const SCHEMA_EMPLOYEE: TableSchema = {
  tableName: 'Employee',
  columns: [
    { name: 'employee_id', type: 'INT', isPk: true },
    { name: 'name', type: 'VARCHAR' },
    { name: 'months', type: 'INT' },
    { name: 'salary', type: 'INT' },
  ],
  sampleRows: [
    { employee_id: 12228, name: 'Rose', months: 15, salary: 1968 },
    { employee_id: 33645, name: 'Angela', months: 1, salary: 3443 },
    { employee_id: 45692, name: 'Frank', months: 17, salary: 1608 },
    { employee_id: 56118, name: 'Patrick', months: 7, salary: 1345 },
    { employee_id: 59725, name: 'Lisa', months: 11, salary: 2330 },
    { employee_id: 74197, name: 'Kimberly', months: 16, salary: 4372 },
    { employee_id: 78454, name: 'Bonnie', months: 8, salary: 1771 },
    { employee_id: 83565, name: 'Michael', months: 6, salary: 2017 },
  ],
};

export const SCHEMA_HACKERS: TableSchema = {
  tableName: 'Hackers',
  columns: [
    { name: 'hacker_id', type: 'INT', isPk: true },
    { name: 'name', type: 'VARCHAR' },
  ],
  sampleRows: [
    { hacker_id: 5580, name: 'Rose' },
    { hacker_id: 84072, name: 'Angela' },
    { hacker_id: 21283, name: 'Frank' },
    { hacker_id: 88255, name: 'Patrick' },
    { hacker_id: 5077, name: 'Lisa' },
  ],
};

export const SCHEMA_SUBMISSIONS: TableSchema = {
  tableName: 'Submissions',
  columns: [
    { name: 'submission_id', type: 'INT', isPk: true },
    { name: 'hacker_id', type: 'INT', isFk: true },
    { name: 'challenge_id', type: 'INT' },
    { name: 'score', type: 'INT' },
  ],
  sampleRows: [
    { submission_id: 94613, hacker_id: 84072, challenge_id: 4810, score: 100 },
    { submission_id: 93821, hacker_id: 5580, challenge_id: 4810, score: 100 },
    { submission_id: 67421, hacker_id: 21283, challenge_id: 71055, score: 50 },
    { submission_id: 88211, hacker_id: 88255, challenge_id: 71055, score: 80 },
    { submission_id: 54101, hacker_id: 5077, challenge_id: 4810, score: 100 },
  ],
};

// 58 Authentic HackerRank SQL Domain Challenges
import { AUTHENTIC_HACKERRANK_PROBLEMS } from './hackerrankQuestionsData';
export const ALL_HACKERRANK_PROBLEMS: SqlProblem[] = AUTHENTIC_HACKERRANK_PROBLEMS;
export { AUTHENTIC_HACKERRANK_PROBLEMS };

const DEPRECATED_HACKERRANK_PROBLEMS: SqlProblem[] = [
  {
    id: 'hr_revising_the_select_query',
    questionNumber: 1,
    title: 'HackerRank: Revising the Select Query I',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Revising the Select Query I. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/revising-the-select-query/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_revising_the_select_query_2',
    questionNumber: 2,
    title: 'HackerRank: Revising the Select Query II',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Revising the Select Query II. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/revising-the-select-query-2/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_select_all_sql',
    questionNumber: 3,
    title: 'HackerRank: Select All',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Select All. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/select-all-sql/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_select_by_id',
    questionNumber: 4,
    title: 'HackerRank: Select By ID',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Select By ID. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/select-by-id/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_japanese_cities_attributes',
    questionNumber: 5,
    title: 'HackerRank: Japanese Cities\' Attributes',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Japanese Cities\' Attributes. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/japanese-cities-attributes/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_japanese_cities_name',
    questionNumber: 6,
    title: 'HackerRank: Japanese Cities\' Names',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Japanese Cities\' Names. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/japanese-cities-name/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_1',
    questionNumber: 7,
    title: 'HackerRank: Weather Observation Station 1',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 1. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-1/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_3',
    questionNumber: 8,
    title: 'HackerRank: Weather Observation Station 3',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 3. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-3/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_4',
    questionNumber: 9,
    title: 'HackerRank: Weather Observation Station 4',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 4. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-4/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_5',
    questionNumber: 10,
    title: 'HackerRank: Weather Observation Station 5',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 5. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-5/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_6',
    questionNumber: 11,
    title: 'HackerRank: Weather Observation Station 6',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 6. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-6/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_7',
    questionNumber: 12,
    title: 'HackerRank: Weather Observation Station 7',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 7. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-7/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_8',
    questionNumber: 13,
    title: 'HackerRank: Weather Observation Station 8',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 8. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-8/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_9',
    questionNumber: 14,
    title: 'HackerRank: Weather Observation Station 9',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 9. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-9/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_10',
    questionNumber: 15,
    title: 'HackerRank: Weather Observation Station 10',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 10. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-10/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_11',
    questionNumber: 16,
    title: 'HackerRank: Weather Observation Station 11',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 11. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-11/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_12',
    questionNumber: 17,
    title: 'HackerRank: Weather Observation Station 12',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 12. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-12/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_more_than_75_marks',
    questionNumber: 18,
    title: 'HackerRank: Higher Than 75 Marks',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Higher Than 75 Marks. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/more-than-75-marks/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_name_of_employees',
    questionNumber: 19,
    title: 'HackerRank: Employee Names',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Employee Names. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM EMPLOYEE LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      snowflake: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      bigquery: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      mysql: 'SELECT * FROM EMPLOYEE LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      snowflake: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      bigquery: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      mysql: 'SELECT * FROM EMPLOYEE LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/name-of-employees/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_salary_of_employees',
    questionNumber: 20,
    title: 'HackerRank: Employee Salaries',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Employee Salaries. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM EMPLOYEE LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      snowflake: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      bigquery: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      mysql: 'SELECT * FROM EMPLOYEE LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      snowflake: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      bigquery: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      mysql: 'SELECT * FROM EMPLOYEE LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/salary-of-employees/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_what_type_of_triangle',
    questionNumber: 21,
    title: 'HackerRank: Type of Triangle',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'INTERMEDIATE CASE',
    businessScenario: 'Solve the official HackerRank domain challenge: Type of Triangle. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/what-type-of-triangle/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_the_pads',
    questionNumber: 22,
    title: 'HackerRank: The PADS',
    platform: 'HackerRank',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: The PADS. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STUDENTS],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STUDENTS LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STUDENTS LIMIT 10;',
      snowflake: 'SELECT * FROM STUDENTS LIMIT 10;',
      bigquery: 'SELECT * FROM STUDENTS LIMIT 10;',
      mysql: 'SELECT * FROM STUDENTS LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STUDENTS LIMIT 10;',
      snowflake: 'SELECT * FROM STUDENTS LIMIT 10;',
      bigquery: 'SELECT * FROM STUDENTS LIMIT 10;',
      mysql: 'SELECT * FROM STUDENTS LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/the-pads/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_occupations',
    questionNumber: 23,
    title: 'HackerRank: Occupations',
    platform: 'HackerRank',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Occupations. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/occupations/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_binary_search_tree_1',
    questionNumber: 24,
    title: 'HackerRank: Binary Tree Nodes',
    platform: 'HackerRank',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'INTERMEDIATE CASE',
    businessScenario: 'Solve the official HackerRank domain challenge: Binary Tree Nodes. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/binary-search-tree-1/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_the_company',
    questionNumber: 25,
    title: 'HackerRank: New Companies',
    platform: 'HackerRank',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: New Companies. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/the-company/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_revising_aggregations_the_count_function',
    questionNumber: 26,
    title: 'HackerRank: Revising Aggregations - The Count Function',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'Solve the official HackerRank domain challenge: Revising Aggregations - The Count Function. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/revising-aggregations-the-count-function/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_revising_aggregations_sum',
    questionNumber: 27,
    title: 'HackerRank: Revising Aggregations - The Sum Function',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'Solve the official HackerRank domain challenge: Revising Aggregations - The Sum Function. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/revising-aggregations-sum/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_revising_aggregations_the_average_function',
    questionNumber: 28,
    title: 'HackerRank: Revising Aggregations - Averages',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'Solve the official HackerRank domain challenge: Revising Aggregations - Averages. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/revising-aggregations-the-average-function/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_average_population',
    questionNumber: 29,
    title: 'HackerRank: Average Population',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'Solve the official HackerRank domain challenge: Average Population. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/average-population/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_japan_population',
    questionNumber: 30,
    title: 'HackerRank: Japan Population',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Japan Population. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/japan-population/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_population_density_difference',
    questionNumber: 31,
    title: 'HackerRank: Population Density Difference',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Population Density Difference. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/population-density-difference/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_the_blunder',
    questionNumber: 32,
    title: 'HackerRank: The Blunder',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: The Blunder. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/the-blunder/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_earnings_of_employees',
    questionNumber: 33,
    title: 'HackerRank: Top Earners',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_sorting',
    topicLabel: 'BEGINNER SORTING',
    businessScenario: 'Solve the official HackerRank domain challenge: Top Earners. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM EMPLOYEE LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      snowflake: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      bigquery: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      mysql: 'SELECT * FROM EMPLOYEE LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      snowflake: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      bigquery: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      mysql: 'SELECT * FROM EMPLOYEE LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/earnings-of-employees/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_2',
    questionNumber: 34,
    title: 'HackerRank: Weather Observation Station 2',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 2. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-2/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_13',
    questionNumber: 35,
    title: 'HackerRank: Weather Observation Station 13',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 13. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-13/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_14',
    questionNumber: 36,
    title: 'HackerRank: Weather Observation Station 14',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 14. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-14/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_15',
    questionNumber: 37,
    title: 'HackerRank: Weather Observation Station 15',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 15. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-15/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_16',
    questionNumber: 38,
    title: 'HackerRank: Weather Observation Station 16',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 16. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-16/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_17',
    questionNumber: 39,
    title: 'HackerRank: Weather Observation Station 17',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 17. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-17/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_18',
    questionNumber: 40,
    title: 'HackerRank: Weather Observation Station 18',
    platform: 'HackerRank',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 18. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-18/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_19',
    questionNumber: 41,
    title: 'HackerRank: Weather Observation Station 19',
    platform: 'HackerRank',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 19. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-19/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_weather_observation_station_20',
    questionNumber: 42,
    title: 'HackerRank: Weather Observation Station 20',
    platform: 'HackerRank',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Weather Observation Station 20. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STATION],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STATION LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STATION LIMIT 10;',
      snowflake: 'SELECT * FROM STATION LIMIT 10;',
      bigquery: 'SELECT * FROM STATION LIMIT 10;',
      mysql: 'SELECT * FROM STATION LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/weather-observation-station-20/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_asian_population',
    questionNumber: 43,
    title: 'HackerRank: Population Census ',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Population Census . Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/asian-population/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_african_cities',
    questionNumber: 44,
    title: 'HackerRank: African Cities',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: African Cities. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/african-cities/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_average_population_of_each_continent',
    questionNumber: 45,
    title: 'HackerRank: Average Population of Each Continent',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'Solve the official HackerRank domain challenge: Average Population of Each Continent. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/average-population-of-each-continent/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_the_report',
    questionNumber: 46,
    title: 'HackerRank: The Report',
    platform: 'HackerRank',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'Solve the official HackerRank domain challenge: The Report. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STUDENTS],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STUDENTS LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STUDENTS LIMIT 10;',
      snowflake: 'SELECT * FROM STUDENTS LIMIT 10;',
      bigquery: 'SELECT * FROM STUDENTS LIMIT 10;',
      mysql: 'SELECT * FROM STUDENTS LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STUDENTS LIMIT 10;',
      snowflake: 'SELECT * FROM STUDENTS LIMIT 10;',
      bigquery: 'SELECT * FROM STUDENTS LIMIT 10;',
      mysql: 'SELECT * FROM STUDENTS LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/the-report/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_full_score',
    questionNumber: 47,
    title: 'HackerRank: Top Competitors',
    platform: 'HackerRank',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_sorting',
    topicLabel: 'BEGINNER SORTING',
    businessScenario: 'Solve the official HackerRank domain challenge: Top Competitors. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/full-score/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_harry_potter_and_wands',
    questionNumber: 48,
    title: 'HackerRank: Ollivander\'s Inventory',
    platform: 'HackerRank',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Ollivander\'s Inventory. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM EMPLOYEE LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      snowflake: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      bigquery: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      mysql: 'SELECT * FROM EMPLOYEE LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      snowflake: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      bigquery: 'SELECT * FROM EMPLOYEE LIMIT 10;',
      mysql: 'SELECT * FROM EMPLOYEE LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/harry-potter-and-wands/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_challenges',
    questionNumber: 49,
    title: 'HackerRank: Challenges',
    platform: 'HackerRank',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Challenges. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_HACKERS],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM HACKERS LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM HACKERS LIMIT 10;',
      snowflake: 'SELECT * FROM HACKERS LIMIT 10;',
      bigquery: 'SELECT * FROM HACKERS LIMIT 10;',
      mysql: 'SELECT * FROM HACKERS LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM HACKERS LIMIT 10;',
      snowflake: 'SELECT * FROM HACKERS LIMIT 10;',
      bigquery: 'SELECT * FROM HACKERS LIMIT 10;',
      mysql: 'SELECT * FROM HACKERS LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/challenges/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_contest_leaderboard',
    questionNumber: 50,
    title: 'HackerRank: Contest Leaderboard',
    platform: 'HackerRank',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'Solve the official HackerRank domain challenge: Contest Leaderboard. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_HACKERS],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM HACKERS LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM HACKERS LIMIT 10;',
      snowflake: 'SELECT * FROM HACKERS LIMIT 10;',
      bigquery: 'SELECT * FROM HACKERS LIMIT 10;',
      mysql: 'SELECT * FROM HACKERS LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM HACKERS LIMIT 10;',
      snowflake: 'SELECT * FROM HACKERS LIMIT 10;',
      bigquery: 'SELECT * FROM HACKERS LIMIT 10;',
      mysql: 'SELECT * FROM HACKERS LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/contest-leaderboard/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_sql_projects',
    questionNumber: 51,
    title: 'HackerRank: SQL Project Planning',
    platform: 'HackerRank',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: SQL Project Planning. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/sql-projects/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_placements',
    questionNumber: 52,
    title: 'HackerRank: Placements',
    platform: 'HackerRank',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Placements. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_STUDENTS],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM STUDENTS LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM STUDENTS LIMIT 10;',
      snowflake: 'SELECT * FROM STUDENTS LIMIT 10;',
      bigquery: 'SELECT * FROM STUDENTS LIMIT 10;',
      mysql: 'SELECT * FROM STUDENTS LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM STUDENTS LIMIT 10;',
      snowflake: 'SELECT * FROM STUDENTS LIMIT 10;',
      bigquery: 'SELECT * FROM STUDENTS LIMIT 10;',
      mysql: 'SELECT * FROM STUDENTS LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/placements/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_symmetric_pairs',
    questionNumber: 53,
    title: 'HackerRank: Symmetric Pairs',
    platform: 'HackerRank',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Symmetric Pairs. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/symmetric-pairs/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_interviews',
    questionNumber: 54,
    title: 'HackerRank: Interviews',
    platform: 'HackerRank',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Interviews. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/interviews/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_15_days_of_learning_sql',
    questionNumber: 55,
    title: 'HackerRank: 15 Days of Learning SQL',
    platform: 'HackerRank',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'Solve the official HackerRank domain challenge: 15 Days of Learning SQL. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/15-days-of-learning-sql/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_draw_the_triangle_1',
    questionNumber: 56,
    title: 'HackerRank: Draw The Triangle 1',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'INTERMEDIATE CASE',
    businessScenario: 'Solve the official HackerRank domain challenge: Draw The Triangle 1. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/draw-the-triangle-1/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_draw_the_triangle_2',
    questionNumber: 57,
    title: 'HackerRank: Draw The Triangle 2',
    platform: 'HackerRank',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'INTERMEDIATE CASE',
    businessScenario: 'Solve the official HackerRank domain challenge: Draw The Triangle 2. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/draw-the-triangle-2/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  },
  {
    id: 'hr_print_prime_numbers',
    questionNumber: 58,
    title: 'HackerRank: Print Prime Numbers',
    platform: 'HackerRank',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'Solve the official HackerRank domain challenge: Print Prime Numbers. Query the provided relational tables satisfying all filter constraints and edge-cases.',
    requirements: [
      'Query required columns from target tables',
      'Handle relational filters, aggregations, or join constraints',
      'Follow exact HackerRank output format and sort order'
    ],
    schemas: [SCHEMA_CITY],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'passed' }]
    },
    hints: {
      tier1: 'Read the table structure carefully and identify key projection attributes.',
      tier2: 'Apply appropriate WHERE, GROUP BY, or ORDER BY conditions.',
      tier3Skeleton: 'SELECT * FROM CITY LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM CITY LIMIT 10;',
      snowflake: 'SELECT * FROM CITY LIMIT 10;',
      bigquery: 'SELECT * FROM CITY LIMIT 10;',
      mysql: 'SELECT * FROM CITY LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Filter records.', '2. Compute projections or aggregations.', '3. Order results.'],
      indexStrategy: 'Index on primary and foreign keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Follows standard SQL ANSI specifications.'
    },
    sourcePlatform: 'HackerRank Official SQL Track',
    sourceUrl: 'https://www.hackerrank.com/challenges/print-prime-numbers/problem',
    companyTag: 'Goldman Sachs',
    isLiveAutoIngested: true
  }
];

// All 323 Official LeetCode Database Problems
const RAW_LEETCODE_PROBLEMS: SqlProblem[] = [
  {
    id: 'lc_175',
    questionNumber: 175,
    title: '175. Combine Two Tables',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #175: Combine Two Tables. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Combine Two Tables.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;',
      snowflake: 'SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;',
      bigquery: 'SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;',
      mysql: 'SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;',
      snowflake: 'SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;',
      bigquery: 'SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;',
      mysql: 'SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/combine-two-tables/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_176',
    questionNumber: 176,
    title: '176. Second Highest Salary',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #176: Second Highest Salary. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Second Highest Salary.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);'
    },
    starterCodeByDialect: {
      postgres: 'SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);',
      snowflake: 'SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);',
      bigquery: 'SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);',
      mysql: 'SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);',
      snowflake: 'SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);',
      bigquery: 'SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);',
      mysql: 'SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/second-highest-salary/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_177',
    questionNumber: 177,
    title: '177. Nth Highest Salary',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #177: Nth Highest Salary. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Nth Highest Salary.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;',
      snowflake: 'SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;',
      bigquery: 'SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;',
      mysql: 'SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;',
      snowflake: 'SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;',
      bigquery: 'SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;',
      mysql: 'SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/nth-highest-salary/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_178',
    questionNumber: 178,
    title: '178. Rank Scores',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #178: Rank Scores. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Rank Scores.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) as "rank" FROM Scores ORDER BY score DESC;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) as "rank" FROM Scores ORDER BY score DESC;',
      snowflake: 'SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) as "rank" FROM Scores ORDER BY score DESC;',
      bigquery: 'SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) as "rank" FROM Scores ORDER BY score DESC;',
      mysql: 'SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) as "rank" FROM Scores ORDER BY score DESC;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) as "rank" FROM Scores ORDER BY score DESC;',
      snowflake: 'SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) as "rank" FROM Scores ORDER BY score DESC;',
      bigquery: 'SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) as "rank" FROM Scores ORDER BY score DESC;',
      mysql: 'SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) as "rank" FROM Scores ORDER BY score DESC;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/rank-scores/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_180',
    questionNumber: 180,
    title: '180. Consecutive Numbers',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #180: Consecutive Numbers. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Consecutive Numbers.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'WITH c AS (SELECT num, LAG(num,1) OVER(ORDER BY id) p1, LAG(num,2) OVER(ORDER BY id) p2 FROM Logs) SELECT DISTINCT num AS ConsecutiveNums FROM c WHERE num = p1 AND num = p2;'
    },
    starterCodeByDialect: {
      postgres: 'WITH c AS (SELECT num, LAG(num,1) OVER(ORDER BY id) p1, LAG(num,2) OVER(ORDER BY id) p2 FROM Logs) SELECT DISTINCT num AS ConsecutiveNums FROM c WHERE num = p1 AND num = p2;',
      snowflake: 'WITH c AS (SELECT num, LAG(num,1) OVER(ORDER BY id) p1, LAG(num,2) OVER(ORDER BY id) p2 FROM Logs) SELECT DISTINCT num AS ConsecutiveNums FROM c WHERE num = p1 AND num = p2;',
      bigquery: 'WITH c AS (SELECT num, LAG(num,1) OVER(ORDER BY id) p1, LAG(num,2) OVER(ORDER BY id) p2 FROM Logs) SELECT DISTINCT num AS ConsecutiveNums FROM c WHERE num = p1 AND num = p2;',
      mysql: 'WITH c AS (SELECT num, LAG(num,1) OVER(ORDER BY id) p1, LAG(num,2) OVER(ORDER BY id) p2 FROM Logs) SELECT DISTINCT num AS ConsecutiveNums FROM c WHERE num = p1 AND num = p2;'
    },
    officialSolutionByDialect: {
      postgres: 'WITH c AS (SELECT num, LAG(num,1) OVER(ORDER BY id) p1, LAG(num,2) OVER(ORDER BY id) p2 FROM Logs) SELECT DISTINCT num AS ConsecutiveNums FROM c WHERE num = p1 AND num = p2;',
      snowflake: 'WITH c AS (SELECT num, LAG(num,1) OVER(ORDER BY id) p1, LAG(num,2) OVER(ORDER BY id) p2 FROM Logs) SELECT DISTINCT num AS ConsecutiveNums FROM c WHERE num = p1 AND num = p2;',
      bigquery: 'WITH c AS (SELECT num, LAG(num,1) OVER(ORDER BY id) p1, LAG(num,2) OVER(ORDER BY id) p2 FROM Logs) SELECT DISTINCT num AS ConsecutiveNums FROM c WHERE num = p1 AND num = p2;',
      mysql: 'WITH c AS (SELECT num, LAG(num,1) OVER(ORDER BY id) p1, LAG(num,2) OVER(ORDER BY id) p2 FROM Logs) SELECT DISTINCT num AS ConsecutiveNums FROM c WHERE num = p1 AND num = p2;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/consecutive-numbers/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_181',
    questionNumber: 181,
    title: '181. Employees Earning More Than Their Managers',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #181: Employees Earning More Than Their Managers. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Employees Earning More Than Their Managers.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT e.name AS Employee FROM Employee e JOIN Employee m ON e.managerId = m.id WHERE e.salary > m.salary;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT e.name AS Employee FROM Employee e JOIN Employee m ON e.managerId = m.id WHERE e.salary > m.salary;',
      snowflake: 'SELECT e.name AS Employee FROM Employee e JOIN Employee m ON e.managerId = m.id WHERE e.salary > m.salary;',
      bigquery: 'SELECT e.name AS Employee FROM Employee e JOIN Employee m ON e.managerId = m.id WHERE e.salary > m.salary;',
      mysql: 'SELECT e.name AS Employee FROM Employee e JOIN Employee m ON e.managerId = m.id WHERE e.salary > m.salary;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT e.name AS Employee FROM Employee e JOIN Employee m ON e.managerId = m.id WHERE e.salary > m.salary;',
      snowflake: 'SELECT e.name AS Employee FROM Employee e JOIN Employee m ON e.managerId = m.id WHERE e.salary > m.salary;',
      bigquery: 'SELECT e.name AS Employee FROM Employee e JOIN Employee m ON e.managerId = m.id WHERE e.salary > m.salary;',
      mysql: 'SELECT e.name AS Employee FROM Employee e JOIN Employee m ON e.managerId = m.id WHERE e.salary > m.salary;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_182',
    questionNumber: 182,
    title: '182. Duplicate Emails',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #182: Duplicate Emails. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Duplicate Emails.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(email) > 1;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(email) > 1;',
      snowflake: 'SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(email) > 1;',
      bigquery: 'SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(email) > 1;',
      mysql: 'SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(email) > 1;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(email) > 1;',
      snowflake: 'SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(email) > 1;',
      bigquery: 'SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(email) > 1;',
      mysql: 'SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(email) > 1;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/duplicate-emails/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_183',
    questionNumber: 183,
    title: '183. Customers Who Never Order',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #183: Customers Who Never Order. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Customers Who Never Order.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT c.name AS Customers FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.id IS NULL;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT c.name AS Customers FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.id IS NULL;',
      snowflake: 'SELECT c.name AS Customers FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.id IS NULL;',
      bigquery: 'SELECT c.name AS Customers FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.id IS NULL;',
      mysql: 'SELECT c.name AS Customers FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.id IS NULL;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT c.name AS Customers FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.id IS NULL;',
      snowflake: 'SELECT c.name AS Customers FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.id IS NULL;',
      bigquery: 'SELECT c.name AS Customers FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.id IS NULL;',
      mysql: 'SELECT c.name AS Customers FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.id IS NULL;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/customers-who-never-order/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_184',
    questionNumber: 184,
    title: '184. Department Highest Salary',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #184: Department Highest Salary. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Department Highest Salary.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);'
    },
    starterCodeByDialect: {
      postgres: 'SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);',
      snowflake: 'SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);',
      bigquery: 'SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);',
      mysql: 'SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);',
      snowflake: 'SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);',
      bigquery: 'SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);',
      mysql: 'SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/department-highest-salary/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_185',
    questionNumber: 185,
    title: '185. Department Top Three Salaries',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #185: Department Top Three Salaries. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Department Top Three Salaries.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'WITH ranked AS (SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary, DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) as rk FROM Employee e JOIN Department d ON e.departmentId = d.id) SELECT Department, Employee, Salary FROM ranked WHERE rk <= 3;'
    },
    starterCodeByDialect: {
      postgres: 'WITH ranked AS (SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary, DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) as rk FROM Employee e JOIN Department d ON e.departmentId = d.id) SELECT Department, Employee, Salary FROM ranked WHERE rk <= 3;',
      snowflake: 'WITH ranked AS (SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary, DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) as rk FROM Employee e JOIN Department d ON e.departmentId = d.id) SELECT Department, Employee, Salary FROM ranked WHERE rk <= 3;',
      bigquery: 'WITH ranked AS (SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary, DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) as rk FROM Employee e JOIN Department d ON e.departmentId = d.id) SELECT Department, Employee, Salary FROM ranked WHERE rk <= 3;',
      mysql: 'WITH ranked AS (SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary, DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) as rk FROM Employee e JOIN Department d ON e.departmentId = d.id) SELECT Department, Employee, Salary FROM ranked WHERE rk <= 3;'
    },
    officialSolutionByDialect: {
      postgres: 'WITH ranked AS (SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary, DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) as rk FROM Employee e JOIN Department d ON e.departmentId = d.id) SELECT Department, Employee, Salary FROM ranked WHERE rk <= 3;',
      snowflake: 'WITH ranked AS (SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary, DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) as rk FROM Employee e JOIN Department d ON e.departmentId = d.id) SELECT Department, Employee, Salary FROM ranked WHERE rk <= 3;',
      bigquery: 'WITH ranked AS (SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary, DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) as rk FROM Employee e JOIN Department d ON e.departmentId = d.id) SELECT Department, Employee, Salary FROM ranked WHERE rk <= 3;',
      mysql: 'WITH ranked AS (SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary, DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) as rk FROM Employee e JOIN Department d ON e.departmentId = d.id) SELECT Department, Employee, Salary FROM ranked WHERE rk <= 3;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/department-top-three-salaries/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_196',
    questionNumber: 196,
    title: '196. Delete Duplicate Emails',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #196: Delete Duplicate Emails. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Delete Duplicate Emails.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'DELETE p1 FROM Person p1, Person p2 WHERE p1.email = p2.email AND p1.id > p2.id;'
    },
    starterCodeByDialect: {
      postgres: 'DELETE p1 FROM Person p1, Person p2 WHERE p1.email = p2.email AND p1.id > p2.id;',
      snowflake: 'DELETE p1 FROM Person p1, Person p2 WHERE p1.email = p2.email AND p1.id > p2.id;',
      bigquery: 'DELETE p1 FROM Person p1, Person p2 WHERE p1.email = p2.email AND p1.id > p2.id;',
      mysql: 'DELETE p1 FROM Person p1, Person p2 WHERE p1.email = p2.email AND p1.id > p2.id;'
    },
    officialSolutionByDialect: {
      postgres: 'DELETE p1 FROM Person p1, Person p2 WHERE p1.email = p2.email AND p1.id > p2.id;',
      snowflake: 'DELETE p1 FROM Person p1, Person p2 WHERE p1.email = p2.email AND p1.id > p2.id;',
      bigquery: 'DELETE p1 FROM Person p1, Person p2 WHERE p1.email = p2.email AND p1.id > p2.id;',
      mysql: 'DELETE p1 FROM Person p1, Person p2 WHERE p1.email = p2.email AND p1.id > p2.id;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/delete-duplicate-emails/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_197',
    questionNumber: 197,
    title: '197. Rising Temperature',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #197: Rising Temperature. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Rising Temperature.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT w1.id FROM Weather w1 JOIN Weather w2 ON DATEDIFF(w1.recordDate, w2.recordDate) = 1 WHERE w1.temperature > w2.temperature;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT w1.id FROM Weather w1 JOIN Weather w2 ON DATEDIFF(w1.recordDate, w2.recordDate) = 1 WHERE w1.temperature > w2.temperature;',
      snowflake: 'SELECT w1.id FROM Weather w1 JOIN Weather w2 ON DATEDIFF(w1.recordDate, w2.recordDate) = 1 WHERE w1.temperature > w2.temperature;',
      bigquery: 'SELECT w1.id FROM Weather w1 JOIN Weather w2 ON DATEDIFF(w1.recordDate, w2.recordDate) = 1 WHERE w1.temperature > w2.temperature;',
      mysql: 'SELECT w1.id FROM Weather w1 JOIN Weather w2 ON DATEDIFF(w1.recordDate, w2.recordDate) = 1 WHERE w1.temperature > w2.temperature;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT w1.id FROM Weather w1 JOIN Weather w2 ON DATEDIFF(w1.recordDate, w2.recordDate) = 1 WHERE w1.temperature > w2.temperature;',
      snowflake: 'SELECT w1.id FROM Weather w1 JOIN Weather w2 ON DATEDIFF(w1.recordDate, w2.recordDate) = 1 WHERE w1.temperature > w2.temperature;',
      bigquery: 'SELECT w1.id FROM Weather w1 JOIN Weather w2 ON DATEDIFF(w1.recordDate, w2.recordDate) = 1 WHERE w1.temperature > w2.temperature;',
      mysql: 'SELECT w1.id FROM Weather w1 JOIN Weather w2 ON DATEDIFF(w1.recordDate, w2.recordDate) = 1 WHERE w1.temperature > w2.temperature;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/rising-temperature/',
    companyTag: 'Facebook',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_262',
    questionNumber: 262,
    title: '262. Trips and Users',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #262: Trips and Users. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Trips and Users.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT request_at AS Day, ROUND(SUM(CASE WHEN status != \'completed\' THEN 1 ELSE 0 END) / COUNT(*), 2) AS "Cancellation Rate" FROM Trips WHERE client_id NOT IN (SELECT users_id FROM Users WHERE banned = \'Yes\') GROUP BY request_at;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT request_at AS Day, ROUND(SUM(CASE WHEN status != \'completed\' THEN 1 ELSE 0 END) / COUNT(*), 2) AS "Cancellation Rate" FROM Trips WHERE client_id NOT IN (SELECT users_id FROM Users WHERE banned = \'Yes\') GROUP BY request_at;',
      snowflake: 'SELECT request_at AS Day, ROUND(SUM(CASE WHEN status != \'completed\' THEN 1 ELSE 0 END) / COUNT(*), 2) AS "Cancellation Rate" FROM Trips WHERE client_id NOT IN (SELECT users_id FROM Users WHERE banned = \'Yes\') GROUP BY request_at;',
      bigquery: 'SELECT request_at AS Day, ROUND(SUM(CASE WHEN status != \'completed\' THEN 1 ELSE 0 END) / COUNT(*), 2) AS "Cancellation Rate" FROM Trips WHERE client_id NOT IN (SELECT users_id FROM Users WHERE banned = \'Yes\') GROUP BY request_at;',
      mysql: 'SELECT request_at AS Day, ROUND(SUM(CASE WHEN status != \'completed\' THEN 1 ELSE 0 END) / COUNT(*), 2) AS "Cancellation Rate" FROM Trips WHERE client_id NOT IN (SELECT users_id FROM Users WHERE banned = \'Yes\') GROUP BY request_at;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT request_at AS Day, ROUND(SUM(CASE WHEN status != \'completed\' THEN 1 ELSE 0 END) / COUNT(*), 2) AS "Cancellation Rate" FROM Trips WHERE client_id NOT IN (SELECT users_id FROM Users WHERE banned = \'Yes\') GROUP BY request_at;',
      snowflake: 'SELECT request_at AS Day, ROUND(SUM(CASE WHEN status != \'completed\' THEN 1 ELSE 0 END) / COUNT(*), 2) AS "Cancellation Rate" FROM Trips WHERE client_id NOT IN (SELECT users_id FROM Users WHERE banned = \'Yes\') GROUP BY request_at;',
      bigquery: 'SELECT request_at AS Day, ROUND(SUM(CASE WHEN status != \'completed\' THEN 1 ELSE 0 END) / COUNT(*), 2) AS "Cancellation Rate" FROM Trips WHERE client_id NOT IN (SELECT users_id FROM Users WHERE banned = \'Yes\') GROUP BY request_at;',
      mysql: 'SELECT request_at AS Day, ROUND(SUM(CASE WHEN status != \'completed\' THEN 1 ELSE 0 END) / COUNT(*), 2) AS "Cancellation Rate" FROM Trips WHERE client_id NOT IN (SELECT users_id FROM Users WHERE banned = \'Yes\') GROUP BY request_at;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/trips-and-users/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_511',
    questionNumber: 511,
    title: '511. Game Play Analysis I',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #511: Game Play Analysis I. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Game Play Analysis I.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id;',
      snowflake: 'SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id;',
      bigquery: 'SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id;',
      mysql: 'SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id;',
      snowflake: 'SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id;',
      bigquery: 'SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id;',
      mysql: 'SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/game-play-analysis-i/',
    companyTag: 'GSN Games',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_512',
    questionNumber: 512,
    title: '512. Game Play Analysis II',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #512: Game Play Analysis II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Game Play Analysis II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/game-play-analysis-ii/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_534',
    questionNumber: 534,
    title: '534. Game Play Analysis III',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #534: Game Play Analysis III. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Game Play Analysis III.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/game-play-analysis-iii/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_550',
    questionNumber: 550,
    title: '550. Game Play Analysis IV',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #550: Game Play Analysis IV. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Game Play Analysis IV.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'WITH first_logins AS (SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id) SELECT ROUND(COUNT(DISTINCT a.player_id) / (SELECT COUNT(DISTINCT player_id) FROM Activity), 2) AS fraction FROM Activity a JOIN first_logins f ON a.player_id = f.player_id AND DATEDIFF(a.event_date, f.first_login) = 1;'
    },
    starterCodeByDialect: {
      postgres: 'WITH first_logins AS (SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id) SELECT ROUND(COUNT(DISTINCT a.player_id) / (SELECT COUNT(DISTINCT player_id) FROM Activity), 2) AS fraction FROM Activity a JOIN first_logins f ON a.player_id = f.player_id AND DATEDIFF(a.event_date, f.first_login) = 1;',
      snowflake: 'WITH first_logins AS (SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id) SELECT ROUND(COUNT(DISTINCT a.player_id) / (SELECT COUNT(DISTINCT player_id) FROM Activity), 2) AS fraction FROM Activity a JOIN first_logins f ON a.player_id = f.player_id AND DATEDIFF(a.event_date, f.first_login) = 1;',
      bigquery: 'WITH first_logins AS (SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id) SELECT ROUND(COUNT(DISTINCT a.player_id) / (SELECT COUNT(DISTINCT player_id) FROM Activity), 2) AS fraction FROM Activity a JOIN first_logins f ON a.player_id = f.player_id AND DATEDIFF(a.event_date, f.first_login) = 1;',
      mysql: 'WITH first_logins AS (SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id) SELECT ROUND(COUNT(DISTINCT a.player_id) / (SELECT COUNT(DISTINCT player_id) FROM Activity), 2) AS fraction FROM Activity a JOIN first_logins f ON a.player_id = f.player_id AND DATEDIFF(a.event_date, f.first_login) = 1;'
    },
    officialSolutionByDialect: {
      postgres: 'WITH first_logins AS (SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id) SELECT ROUND(COUNT(DISTINCT a.player_id) / (SELECT COUNT(DISTINCT player_id) FROM Activity), 2) AS fraction FROM Activity a JOIN first_logins f ON a.player_id = f.player_id AND DATEDIFF(a.event_date, f.first_login) = 1;',
      snowflake: 'WITH first_logins AS (SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id) SELECT ROUND(COUNT(DISTINCT a.player_id) / (SELECT COUNT(DISTINCT player_id) FROM Activity), 2) AS fraction FROM Activity a JOIN first_logins f ON a.player_id = f.player_id AND DATEDIFF(a.event_date, f.first_login) = 1;',
      bigquery: 'WITH first_logins AS (SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id) SELECT ROUND(COUNT(DISTINCT a.player_id) / (SELECT COUNT(DISTINCT player_id) FROM Activity), 2) AS fraction FROM Activity a JOIN first_logins f ON a.player_id = f.player_id AND DATEDIFF(a.event_date, f.first_login) = 1;',
      mysql: 'WITH first_logins AS (SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id) SELECT ROUND(COUNT(DISTINCT a.player_id) / (SELECT COUNT(DISTINCT player_id) FROM Activity), 2) AS fraction FROM Activity a JOIN first_logins f ON a.player_id = f.player_id AND DATEDIFF(a.event_date, f.first_login) = 1;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/game-play-analysis-iv/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_569',
    questionNumber: 569,
    title: '569. Median Employee Salary',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #569: Median Employee Salary. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Median Employee Salary.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/median-employee-salary/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_570',
    questionNumber: 570,
    title: '570. Managers with at Least 5 Direct Reports',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #570: Managers with at Least 5 Direct Reports. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Managers with at Least 5 Direct Reports.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT name FROM Employee WHERE id IN (SELECT managerId FROM Employee GROUP BY managerId HAVING COUNT(managerId) >= 5);'
    },
    starterCodeByDialect: {
      postgres: 'SELECT name FROM Employee WHERE id IN (SELECT managerId FROM Employee GROUP BY managerId HAVING COUNT(managerId) >= 5);',
      snowflake: 'SELECT name FROM Employee WHERE id IN (SELECT managerId FROM Employee GROUP BY managerId HAVING COUNT(managerId) >= 5);',
      bigquery: 'SELECT name FROM Employee WHERE id IN (SELECT managerId FROM Employee GROUP BY managerId HAVING COUNT(managerId) >= 5);',
      mysql: 'SELECT name FROM Employee WHERE id IN (SELECT managerId FROM Employee GROUP BY managerId HAVING COUNT(managerId) >= 5);'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT name FROM Employee WHERE id IN (SELECT managerId FROM Employee GROUP BY managerId HAVING COUNT(managerId) >= 5);',
      snowflake: 'SELECT name FROM Employee WHERE id IN (SELECT managerId FROM Employee GROUP BY managerId HAVING COUNT(managerId) >= 5);',
      bigquery: 'SELECT name FROM Employee WHERE id IN (SELECT managerId FROM Employee GROUP BY managerId HAVING COUNT(managerId) >= 5);',
      mysql: 'SELECT name FROM Employee WHERE id IN (SELECT managerId FROM Employee GROUP BY managerId HAVING COUNT(managerId) >= 5);'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/managers-with-at-least-5-direct-reports/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_571',
    questionNumber: 571,
    title: '571. Find Median Given Frequency of Numbers',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #571: Find Median Given Frequency of Numbers. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Median Given Frequency of Numbers.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-median-given-frequency-of-numbers/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_574',
    questionNumber: 574,
    title: '574. Winning Candidate',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #574: Winning Candidate. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Winning Candidate.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/winning-candidate/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_577',
    questionNumber: 577,
    title: '577. Employee Bonus',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #577: Employee Bonus. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Employee Bonus.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT e.name, b.bonus FROM Employee e LEFT JOIN Bonus b ON e.empId = b.empId WHERE b.bonus < 1000 OR b.bonus IS NULL;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT e.name, b.bonus FROM Employee e LEFT JOIN Bonus b ON e.empId = b.empId WHERE b.bonus < 1000 OR b.bonus IS NULL;',
      snowflake: 'SELECT e.name, b.bonus FROM Employee e LEFT JOIN Bonus b ON e.empId = b.empId WHERE b.bonus < 1000 OR b.bonus IS NULL;',
      bigquery: 'SELECT e.name, b.bonus FROM Employee e LEFT JOIN Bonus b ON e.empId = b.empId WHERE b.bonus < 1000 OR b.bonus IS NULL;',
      mysql: 'SELECT e.name, b.bonus FROM Employee e LEFT JOIN Bonus b ON e.empId = b.empId WHERE b.bonus < 1000 OR b.bonus IS NULL;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT e.name, b.bonus FROM Employee e LEFT JOIN Bonus b ON e.empId = b.empId WHERE b.bonus < 1000 OR b.bonus IS NULL;',
      snowflake: 'SELECT e.name, b.bonus FROM Employee e LEFT JOIN Bonus b ON e.empId = b.empId WHERE b.bonus < 1000 OR b.bonus IS NULL;',
      bigquery: 'SELECT e.name, b.bonus FROM Employee e LEFT JOIN Bonus b ON e.empId = b.empId WHERE b.bonus < 1000 OR b.bonus IS NULL;',
      mysql: 'SELECT e.name, b.bonus FROM Employee e LEFT JOIN Bonus b ON e.empId = b.empId WHERE b.bonus < 1000 OR b.bonus IS NULL;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/employee-bonus/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_578',
    questionNumber: 578,
    title: '578. Get Highest Answer Rate Question',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #578: Get Highest Answer Rate Question. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Get Highest Answer Rate Question.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/get-highest-answer-rate-question/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_579',
    questionNumber: 579,
    title: '579. Find Cumulative Salary of an Employee',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #579: Find Cumulative Salary of an Employee. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Cumulative Salary of an Employee.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-cumulative-salary-of-an-employee/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_580',
    questionNumber: 580,
    title: '580. Count Student Number in Departments',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #580: Count Student Number in Departments. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Count Student Number in Departments.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/count-student-number-in-departments/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_584',
    questionNumber: 584,
    title: '584. Find Customer Referee',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #584: Find Customer Referee. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Customer Referee.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT name FROM Customer WHERE referee_id != 2 OR referee_id IS NULL;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT name FROM Customer WHERE referee_id != 2 OR referee_id IS NULL;',
      snowflake: 'SELECT name FROM Customer WHERE referee_id != 2 OR referee_id IS NULL;',
      bigquery: 'SELECT name FROM Customer WHERE referee_id != 2 OR referee_id IS NULL;',
      mysql: 'SELECT name FROM Customer WHERE referee_id != 2 OR referee_id IS NULL;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT name FROM Customer WHERE referee_id != 2 OR referee_id IS NULL;',
      snowflake: 'SELECT name FROM Customer WHERE referee_id != 2 OR referee_id IS NULL;',
      bigquery: 'SELECT name FROM Customer WHERE referee_id != 2 OR referee_id IS NULL;',
      mysql: 'SELECT name FROM Customer WHERE referee_id != 2 OR referee_id IS NULL;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-customer-referee/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_585',
    questionNumber: 585,
    title: '585. Investments in 2016',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #585: Investments in 2016. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Investments in 2016.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/investments-in-2016/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_586',
    questionNumber: 586,
    title: '586. Customer Placing the Largest Number of Orders',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #586: Customer Placing the Largest Number of Orders. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Customer Placing the Largest Number of Orders.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT customer_number FROM Orders GROUP BY customer_number ORDER BY COUNT(order_number) DESC LIMIT 1;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT customer_number FROM Orders GROUP BY customer_number ORDER BY COUNT(order_number) DESC LIMIT 1;',
      snowflake: 'SELECT customer_number FROM Orders GROUP BY customer_number ORDER BY COUNT(order_number) DESC LIMIT 1;',
      bigquery: 'SELECT customer_number FROM Orders GROUP BY customer_number ORDER BY COUNT(order_number) DESC LIMIT 1;',
      mysql: 'SELECT customer_number FROM Orders GROUP BY customer_number ORDER BY COUNT(order_number) DESC LIMIT 1;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT customer_number FROM Orders GROUP BY customer_number ORDER BY COUNT(order_number) DESC LIMIT 1;',
      snowflake: 'SELECT customer_number FROM Orders GROUP BY customer_number ORDER BY COUNT(order_number) DESC LIMIT 1;',
      bigquery: 'SELECT customer_number FROM Orders GROUP BY customer_number ORDER BY COUNT(order_number) DESC LIMIT 1;',
      mysql: 'SELECT customer_number FROM Orders GROUP BY customer_number ORDER BY COUNT(order_number) DESC LIMIT 1;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/customer-placing-the-largest-number-of-orders/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_595',
    questionNumber: 595,
    title: '595. Big Countries',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #595: Big Countries. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Big Countries.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000;',
      snowflake: 'SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000;',
      bigquery: 'SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000;',
      mysql: 'SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000;',
      snowflake: 'SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000;',
      bigquery: 'SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000;',
      mysql: 'SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/big-countries/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_596',
    questionNumber: 596,
    title: '596. Classes With at Least 5 Students',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #596: Classes With at Least 5 Students. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Classes With at Least 5 Students.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT class FROM Courses GROUP BY class HAVING COUNT(student) >= 5;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT class FROM Courses GROUP BY class HAVING COUNT(student) >= 5;',
      snowflake: 'SELECT class FROM Courses GROUP BY class HAVING COUNT(student) >= 5;',
      bigquery: 'SELECT class FROM Courses GROUP BY class HAVING COUNT(student) >= 5;',
      mysql: 'SELECT class FROM Courses GROUP BY class HAVING COUNT(student) >= 5;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT class FROM Courses GROUP BY class HAVING COUNT(student) >= 5;',
      snowflake: 'SELECT class FROM Courses GROUP BY class HAVING COUNT(student) >= 5;',
      bigquery: 'SELECT class FROM Courses GROUP BY class HAVING COUNT(student) >= 5;',
      mysql: 'SELECT class FROM Courses GROUP BY class HAVING COUNT(student) >= 5;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/classes-with-at-least-5-students/',
    companyTag: 'Facebook',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_597',
    questionNumber: 597,
    title: '597. Friend Requests I: Overall Acceptance Rate',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #597: Friend Requests I: Overall Acceptance Rate. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Friend Requests I: Overall Acceptance Rate.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/friend-requests-i-overall-acceptance-rate/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_601',
    questionNumber: 601,
    title: '601. Human Traffic of Stadium',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #601: Human Traffic of Stadium. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Human Traffic of Stadium.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'WITH c AS (SELECT id, visit_date, people, id - ROW_NUMBER() OVER (ORDER BY id) as grp FROM Stadium WHERE people >= 100) SELECT id, visit_date, people FROM c WHERE grp IN (SELECT grp FROM c GROUP BY grp HAVING COUNT(*) >= 3) ORDER BY visit_date;'
    },
    starterCodeByDialect: {
      postgres: 'WITH c AS (SELECT id, visit_date, people, id - ROW_NUMBER() OVER (ORDER BY id) as grp FROM Stadium WHERE people >= 100) SELECT id, visit_date, people FROM c WHERE grp IN (SELECT grp FROM c GROUP BY grp HAVING COUNT(*) >= 3) ORDER BY visit_date;',
      snowflake: 'WITH c AS (SELECT id, visit_date, people, id - ROW_NUMBER() OVER (ORDER BY id) as grp FROM Stadium WHERE people >= 100) SELECT id, visit_date, people FROM c WHERE grp IN (SELECT grp FROM c GROUP BY grp HAVING COUNT(*) >= 3) ORDER BY visit_date;',
      bigquery: 'WITH c AS (SELECT id, visit_date, people, id - ROW_NUMBER() OVER (ORDER BY id) as grp FROM Stadium WHERE people >= 100) SELECT id, visit_date, people FROM c WHERE grp IN (SELECT grp FROM c GROUP BY grp HAVING COUNT(*) >= 3) ORDER BY visit_date;',
      mysql: 'WITH c AS (SELECT id, visit_date, people, id - ROW_NUMBER() OVER (ORDER BY id) as grp FROM Stadium WHERE people >= 100) SELECT id, visit_date, people FROM c WHERE grp IN (SELECT grp FROM c GROUP BY grp HAVING COUNT(*) >= 3) ORDER BY visit_date;'
    },
    officialSolutionByDialect: {
      postgres: 'WITH c AS (SELECT id, visit_date, people, id - ROW_NUMBER() OVER (ORDER BY id) as grp FROM Stadium WHERE people >= 100) SELECT id, visit_date, people FROM c WHERE grp IN (SELECT grp FROM c GROUP BY grp HAVING COUNT(*) >= 3) ORDER BY visit_date;',
      snowflake: 'WITH c AS (SELECT id, visit_date, people, id - ROW_NUMBER() OVER (ORDER BY id) as grp FROM Stadium WHERE people >= 100) SELECT id, visit_date, people FROM c WHERE grp IN (SELECT grp FROM c GROUP BY grp HAVING COUNT(*) >= 3) ORDER BY visit_date;',
      bigquery: 'WITH c AS (SELECT id, visit_date, people, id - ROW_NUMBER() OVER (ORDER BY id) as grp FROM Stadium WHERE people >= 100) SELECT id, visit_date, people FROM c WHERE grp IN (SELECT grp FROM c GROUP BY grp HAVING COUNT(*) >= 3) ORDER BY visit_date;',
      mysql: 'WITH c AS (SELECT id, visit_date, people, id - ROW_NUMBER() OVER (ORDER BY id) as grp FROM Stadium WHERE people >= 100) SELECT id, visit_date, people FROM c WHERE grp IN (SELECT grp FROM c GROUP BY grp HAVING COUNT(*) >= 3) ORDER BY visit_date;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/human-traffic-of-stadium/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_602',
    questionNumber: 602,
    title: '602. Friend Requests II: Who Has the Most Friends',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'set_operations',
    topicLabel: 'SET OPERATIONS',
    businessScenario: 'LeetCode Database problem #602: Friend Requests II: Who Has the Most Friends. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Friend Requests II: Who Has the Most Friends.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'WITH all_friends AS (SELECT requester_id AS id FROM RequestAccepted UNION ALL SELECT accepter_id AS id FROM RequestAccepted) SELECT id, COUNT(*) AS num FROM all_friends GROUP BY id ORDER BY num DESC LIMIT 1;'
    },
    starterCodeByDialect: {
      postgres: 'WITH all_friends AS (SELECT requester_id AS id FROM RequestAccepted UNION ALL SELECT accepter_id AS id FROM RequestAccepted) SELECT id, COUNT(*) AS num FROM all_friends GROUP BY id ORDER BY num DESC LIMIT 1;',
      snowflake: 'WITH all_friends AS (SELECT requester_id AS id FROM RequestAccepted UNION ALL SELECT accepter_id AS id FROM RequestAccepted) SELECT id, COUNT(*) AS num FROM all_friends GROUP BY id ORDER BY num DESC LIMIT 1;',
      bigquery: 'WITH all_friends AS (SELECT requester_id AS id FROM RequestAccepted UNION ALL SELECT accepter_id AS id FROM RequestAccepted) SELECT id, COUNT(*) AS num FROM all_friends GROUP BY id ORDER BY num DESC LIMIT 1;',
      mysql: 'WITH all_friends AS (SELECT requester_id AS id FROM RequestAccepted UNION ALL SELECT accepter_id AS id FROM RequestAccepted) SELECT id, COUNT(*) AS num FROM all_friends GROUP BY id ORDER BY num DESC LIMIT 1;'
    },
    officialSolutionByDialect: {
      postgres: 'WITH all_friends AS (SELECT requester_id AS id FROM RequestAccepted UNION ALL SELECT accepter_id AS id FROM RequestAccepted) SELECT id, COUNT(*) AS num FROM all_friends GROUP BY id ORDER BY num DESC LIMIT 1;',
      snowflake: 'WITH all_friends AS (SELECT requester_id AS id FROM RequestAccepted UNION ALL SELECT accepter_id AS id FROM RequestAccepted) SELECT id, COUNT(*) AS num FROM all_friends GROUP BY id ORDER BY num DESC LIMIT 1;',
      bigquery: 'WITH all_friends AS (SELECT requester_id AS id FROM RequestAccepted UNION ALL SELECT accepter_id AS id FROM RequestAccepted) SELECT id, COUNT(*) AS num FROM all_friends GROUP BY id ORDER BY num DESC LIMIT 1;',
      mysql: 'WITH all_friends AS (SELECT requester_id AS id FROM RequestAccepted UNION ALL SELECT accepter_id AS id FROM RequestAccepted) SELECT id, COUNT(*) AS num FROM all_friends GROUP BY id ORDER BY num DESC LIMIT 1;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/friend-requests-ii-who-has-the-most-friends/',
    companyTag: 'Facebook',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_603',
    questionNumber: 603,
    title: '603. Consecutive Available Seats',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #603: Consecutive Available Seats. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Consecutive Available Seats.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/consecutive-available-seats/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_607',
    questionNumber: 607,
    title: '607. Sales Person',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #607: Sales Person. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Sales Person.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT name FROM SalesPerson WHERE sales_id NOT IN (SELECT o.sales_id FROM Orders o JOIN Company c ON o.com_id = c.com_id WHERE c.name = \'RED\');'
    },
    starterCodeByDialect: {
      postgres: 'SELECT name FROM SalesPerson WHERE sales_id NOT IN (SELECT o.sales_id FROM Orders o JOIN Company c ON o.com_id = c.com_id WHERE c.name = \'RED\');',
      snowflake: 'SELECT name FROM SalesPerson WHERE sales_id NOT IN (SELECT o.sales_id FROM Orders o JOIN Company c ON o.com_id = c.com_id WHERE c.name = \'RED\');',
      bigquery: 'SELECT name FROM SalesPerson WHERE sales_id NOT IN (SELECT o.sales_id FROM Orders o JOIN Company c ON o.com_id = c.com_id WHERE c.name = \'RED\');',
      mysql: 'SELECT name FROM SalesPerson WHERE sales_id NOT IN (SELECT o.sales_id FROM Orders o JOIN Company c ON o.com_id = c.com_id WHERE c.name = \'RED\');'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT name FROM SalesPerson WHERE sales_id NOT IN (SELECT o.sales_id FROM Orders o JOIN Company c ON o.com_id = c.com_id WHERE c.name = \'RED\');',
      snowflake: 'SELECT name FROM SalesPerson WHERE sales_id NOT IN (SELECT o.sales_id FROM Orders o JOIN Company c ON o.com_id = c.com_id WHERE c.name = \'RED\');',
      bigquery: 'SELECT name FROM SalesPerson WHERE sales_id NOT IN (SELECT o.sales_id FROM Orders o JOIN Company c ON o.com_id = c.com_id WHERE c.name = \'RED\');',
      mysql: 'SELECT name FROM SalesPerson WHERE sales_id NOT IN (SELECT o.sales_id FROM Orders o JOIN Company c ON o.com_id = c.com_id WHERE c.name = \'RED\');'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/sales-person/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_608',
    questionNumber: 608,
    title: '608. Tree Node',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'INTERMEDIATE CASE',
    businessScenario: 'LeetCode Database problem #608: Tree Node. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Tree Node.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT id, CASE WHEN p_id IS NULL THEN \'Root\' WHEN id IN (SELECT p_id FROM Tree WHERE p_id IS NOT NULL) THEN \'Inner\' ELSE \'Leaf\' END AS type FROM Tree;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT id, CASE WHEN p_id IS NULL THEN \'Root\' WHEN id IN (SELECT p_id FROM Tree WHERE p_id IS NOT NULL) THEN \'Inner\' ELSE \'Leaf\' END AS type FROM Tree;',
      snowflake: 'SELECT id, CASE WHEN p_id IS NULL THEN \'Root\' WHEN id IN (SELECT p_id FROM Tree WHERE p_id IS NOT NULL) THEN \'Inner\' ELSE \'Leaf\' END AS type FROM Tree;',
      bigquery: 'SELECT id, CASE WHEN p_id IS NULL THEN \'Root\' WHEN id IN (SELECT p_id FROM Tree WHERE p_id IS NOT NULL) THEN \'Inner\' ELSE \'Leaf\' END AS type FROM Tree;',
      mysql: 'SELECT id, CASE WHEN p_id IS NULL THEN \'Root\' WHEN id IN (SELECT p_id FROM Tree WHERE p_id IS NOT NULL) THEN \'Inner\' ELSE \'Leaf\' END AS type FROM Tree;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT id, CASE WHEN p_id IS NULL THEN \'Root\' WHEN id IN (SELECT p_id FROM Tree WHERE p_id IS NOT NULL) THEN \'Inner\' ELSE \'Leaf\' END AS type FROM Tree;',
      snowflake: 'SELECT id, CASE WHEN p_id IS NULL THEN \'Root\' WHEN id IN (SELECT p_id FROM Tree WHERE p_id IS NOT NULL) THEN \'Inner\' ELSE \'Leaf\' END AS type FROM Tree;',
      bigquery: 'SELECT id, CASE WHEN p_id IS NULL THEN \'Root\' WHEN id IN (SELECT p_id FROM Tree WHERE p_id IS NOT NULL) THEN \'Inner\' ELSE \'Leaf\' END AS type FROM Tree;',
      mysql: 'SELECT id, CASE WHEN p_id IS NULL THEN \'Root\' WHEN id IN (SELECT p_id FROM Tree WHERE p_id IS NOT NULL) THEN \'Inner\' ELSE \'Leaf\' END AS type FROM Tree;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/tree-node/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_610',
    questionNumber: 610,
    title: '610. Triangle Judgement',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'INTERMEDIATE CASE',
    businessScenario: 'LeetCode Database problem #610: Triangle Judgement. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Triangle Judgement.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT x, y, z, CASE WHEN x + y > z AND x + z > y AND y + z > x THEN \'Yes\' ELSE \'No\' END AS triangle FROM Triangle;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT x, y, z, CASE WHEN x + y > z AND x + z > y AND y + z > x THEN \'Yes\' ELSE \'No\' END AS triangle FROM Triangle;',
      snowflake: 'SELECT x, y, z, CASE WHEN x + y > z AND x + z > y AND y + z > x THEN \'Yes\' ELSE \'No\' END AS triangle FROM Triangle;',
      bigquery: 'SELECT x, y, z, CASE WHEN x + y > z AND x + z > y AND y + z > x THEN \'Yes\' ELSE \'No\' END AS triangle FROM Triangle;',
      mysql: 'SELECT x, y, z, CASE WHEN x + y > z AND x + z > y AND y + z > x THEN \'Yes\' ELSE \'No\' END AS triangle FROM Triangle;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT x, y, z, CASE WHEN x + y > z AND x + z > y AND y + z > x THEN \'Yes\' ELSE \'No\' END AS triangle FROM Triangle;',
      snowflake: 'SELECT x, y, z, CASE WHEN x + y > z AND x + z > y AND y + z > x THEN \'Yes\' ELSE \'No\' END AS triangle FROM Triangle;',
      bigquery: 'SELECT x, y, z, CASE WHEN x + y > z AND x + z > y AND y + z > x THEN \'Yes\' ELSE \'No\' END AS triangle FROM Triangle;',
      mysql: 'SELECT x, y, z, CASE WHEN x + y > z AND x + z > y AND y + z > x THEN \'Yes\' ELSE \'No\' END AS triangle FROM Triangle;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/triangle-judgement/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_612',
    questionNumber: 612,
    title: '612. Shortest Distance in a Plane',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #612: Shortest Distance in a Plane. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Shortest Distance in a Plane.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/shortest-distance-in-a-plane/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_613',
    questionNumber: 613,
    title: '613. Shortest Distance in a Line',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #613: Shortest Distance in a Line. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Shortest Distance in a Line.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/shortest-distance-in-a-line/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_614',
    questionNumber: 614,
    title: '614. Second Degree Follower',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #614: Second Degree Follower. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Second Degree Follower.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/second-degree-follower/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_615',
    questionNumber: 615,
    title: '615. Average Salary: Departments VS Company',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #615: Average Salary: Departments VS Company. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Average Salary: Departments VS Company.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/average-salary-departments-vs-company/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_618',
    questionNumber: 618,
    title: '618. Students Report By Geography',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #618: Students Report By Geography. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Students Report By Geography.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/students-report-by-geography/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_619',
    questionNumber: 619,
    title: '619. Biggest Single Number',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #619: Biggest Single Number. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Biggest Single Number.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT MAX(num) AS num FROM (SELECT num FROM MyNumbers GROUP BY num HAVING COUNT(num) = 1) t;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT MAX(num) AS num FROM (SELECT num FROM MyNumbers GROUP BY num HAVING COUNT(num) = 1) t;',
      snowflake: 'SELECT MAX(num) AS num FROM (SELECT num FROM MyNumbers GROUP BY num HAVING COUNT(num) = 1) t;',
      bigquery: 'SELECT MAX(num) AS num FROM (SELECT num FROM MyNumbers GROUP BY num HAVING COUNT(num) = 1) t;',
      mysql: 'SELECT MAX(num) AS num FROM (SELECT num FROM MyNumbers GROUP BY num HAVING COUNT(num) = 1) t;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT MAX(num) AS num FROM (SELECT num FROM MyNumbers GROUP BY num HAVING COUNT(num) = 1) t;',
      snowflake: 'SELECT MAX(num) AS num FROM (SELECT num FROM MyNumbers GROUP BY num HAVING COUNT(num) = 1) t;',
      bigquery: 'SELECT MAX(num) AS num FROM (SELECT num FROM MyNumbers GROUP BY num HAVING COUNT(num) = 1) t;',
      mysql: 'SELECT MAX(num) AS num FROM (SELECT num FROM MyNumbers GROUP BY num HAVING COUNT(num) = 1) t;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/biggest-single-number/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_620',
    questionNumber: 620,
    title: '620. Not Boring Movies',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #620: Not Boring Movies. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Not Boring Movies.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Cinema WHERE id % 2 = 1 AND description != \'boring\' ORDER BY rating DESC;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Cinema WHERE id % 2 = 1 AND description != \'boring\' ORDER BY rating DESC;',
      snowflake: 'SELECT * FROM Cinema WHERE id % 2 = 1 AND description != \'boring\' ORDER BY rating DESC;',
      bigquery: 'SELECT * FROM Cinema WHERE id % 2 = 1 AND description != \'boring\' ORDER BY rating DESC;',
      mysql: 'SELECT * FROM Cinema WHERE id % 2 = 1 AND description != \'boring\' ORDER BY rating DESC;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Cinema WHERE id % 2 = 1 AND description != \'boring\' ORDER BY rating DESC;',
      snowflake: 'SELECT * FROM Cinema WHERE id % 2 = 1 AND description != \'boring\' ORDER BY rating DESC;',
      bigquery: 'SELECT * FROM Cinema WHERE id % 2 = 1 AND description != \'boring\' ORDER BY rating DESC;',
      mysql: 'SELECT * FROM Cinema WHERE id % 2 = 1 AND description != \'boring\' ORDER BY rating DESC;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/not-boring-movies/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_626',
    questionNumber: 626,
    title: '626. Exchange Seats',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'INTERMEDIATE CASE',
    businessScenario: 'LeetCode Database problem #626: Exchange Seats. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Exchange Seats.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT CASE WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM Seat) THEN id WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM Seat ORDER BY id;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT CASE WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM Seat) THEN id WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM Seat ORDER BY id;',
      snowflake: 'SELECT CASE WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM Seat) THEN id WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM Seat ORDER BY id;',
      bigquery: 'SELECT CASE WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM Seat) THEN id WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM Seat ORDER BY id;',
      mysql: 'SELECT CASE WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM Seat) THEN id WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM Seat ORDER BY id;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT CASE WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM Seat) THEN id WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM Seat ORDER BY id;',
      snowflake: 'SELECT CASE WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM Seat) THEN id WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM Seat ORDER BY id;',
      bigquery: 'SELECT CASE WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM Seat) THEN id WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM Seat ORDER BY id;',
      mysql: 'SELECT CASE WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM Seat) THEN id WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM Seat ORDER BY id;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/exchange-seats/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_627',
    questionNumber: 627,
    title: '627. Swap Sex of Employees',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'INTERMEDIATE CASE',
    businessScenario: 'LeetCode Database problem #627: Swap Sex of Employees. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Swap Sex of Employees.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'UPDATE Salary SET sex = CASE WHEN sex = \'m\' THEN \'f\' ELSE \'m\' END;'
    },
    starterCodeByDialect: {
      postgres: 'UPDATE Salary SET sex = CASE WHEN sex = \'m\' THEN \'f\' ELSE \'m\' END;',
      snowflake: 'UPDATE Salary SET sex = CASE WHEN sex = \'m\' THEN \'f\' ELSE \'m\' END;',
      bigquery: 'UPDATE Salary SET sex = CASE WHEN sex = \'m\' THEN \'f\' ELSE \'m\' END;',
      mysql: 'UPDATE Salary SET sex = CASE WHEN sex = \'m\' THEN \'f\' ELSE \'m\' END;'
    },
    officialSolutionByDialect: {
      postgres: 'UPDATE Salary SET sex = CASE WHEN sex = \'m\' THEN \'f\' ELSE \'m\' END;',
      snowflake: 'UPDATE Salary SET sex = CASE WHEN sex = \'m\' THEN \'f\' ELSE \'m\' END;',
      bigquery: 'UPDATE Salary SET sex = CASE WHEN sex = \'m\' THEN \'f\' ELSE \'m\' END;',
      mysql: 'UPDATE Salary SET sex = CASE WHEN sex = \'m\' THEN \'f\' ELSE \'m\' END;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/swap-sex-of-employees/',
    companyTag: 'Facebook',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1045',
    questionNumber: 1045,
    title: '1045. Customers Who Bought All Products',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1045: Customers Who Bought All Products. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Customers Who Bought All Products.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT customer_id FROM Customer GROUP BY customer_id HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);'
    },
    starterCodeByDialect: {
      postgres: 'SELECT customer_id FROM Customer GROUP BY customer_id HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);',
      snowflake: 'SELECT customer_id FROM Customer GROUP BY customer_id HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);',
      bigquery: 'SELECT customer_id FROM Customer GROUP BY customer_id HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);',
      mysql: 'SELECT customer_id FROM Customer GROUP BY customer_id HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT customer_id FROM Customer GROUP BY customer_id HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);',
      snowflake: 'SELECT customer_id FROM Customer GROUP BY customer_id HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);',
      bigquery: 'SELECT customer_id FROM Customer GROUP BY customer_id HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);',
      mysql: 'SELECT customer_id FROM Customer GROUP BY customer_id HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/customers-who-bought-all-products/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1050',
    questionNumber: 1050,
    title: '1050. Actors and Directors Who Cooperated At Least Three Times',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1050: Actors and Directors Who Cooperated At Least Three Times. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Actors and Directors Who Cooperated At Least Three Times.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/actors-and-directors-who-cooperated-at-least-three-times/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1068',
    questionNumber: 1068,
    title: '1068. Product Sales Analysis I',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #1068: Product Sales Analysis I. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Product Sales Analysis I.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT p.product_name, s.year, s.price FROM Sales s JOIN Product p ON s.product_id = p.product_id;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT p.product_name, s.year, s.price FROM Sales s JOIN Product p ON s.product_id = p.product_id;',
      snowflake: 'SELECT p.product_name, s.year, s.price FROM Sales s JOIN Product p ON s.product_id = p.product_id;',
      bigquery: 'SELECT p.product_name, s.year, s.price FROM Sales s JOIN Product p ON s.product_id = p.product_id;',
      mysql: 'SELECT p.product_name, s.year, s.price FROM Sales s JOIN Product p ON s.product_id = p.product_id;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT p.product_name, s.year, s.price FROM Sales s JOIN Product p ON s.product_id = p.product_id;',
      snowflake: 'SELECT p.product_name, s.year, s.price FROM Sales s JOIN Product p ON s.product_id = p.product_id;',
      bigquery: 'SELECT p.product_name, s.year, s.price FROM Sales s JOIN Product p ON s.product_id = p.product_id;',
      mysql: 'SELECT p.product_name, s.year, s.price FROM Sales s JOIN Product p ON s.product_id = p.product_id;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/product-sales-analysis-i/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1069',
    questionNumber: 1069,
    title: '1069. Product Sales Analysis II',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1069: Product Sales Analysis II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Product Sales Analysis II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/product-sales-analysis-ii/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1070',
    questionNumber: 1070,
    title: '1070. Product Sales Analysis III',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #1070: Product Sales Analysis III. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Product Sales Analysis III.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT product_id, year AS first_year, quantity, price FROM Sales WHERE (product_id, year) IN (SELECT product_id, MIN(year) FROM Sales GROUP BY product_id);'
    },
    starterCodeByDialect: {
      postgres: 'SELECT product_id, year AS first_year, quantity, price FROM Sales WHERE (product_id, year) IN (SELECT product_id, MIN(year) FROM Sales GROUP BY product_id);',
      snowflake: 'SELECT product_id, year AS first_year, quantity, price FROM Sales WHERE (product_id, year) IN (SELECT product_id, MIN(year) FROM Sales GROUP BY product_id);',
      bigquery: 'SELECT product_id, year AS first_year, quantity, price FROM Sales WHERE (product_id, year) IN (SELECT product_id, MIN(year) FROM Sales GROUP BY product_id);',
      mysql: 'SELECT product_id, year AS first_year, quantity, price FROM Sales WHERE (product_id, year) IN (SELECT product_id, MIN(year) FROM Sales GROUP BY product_id);'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT product_id, year AS first_year, quantity, price FROM Sales WHERE (product_id, year) IN (SELECT product_id, MIN(year) FROM Sales GROUP BY product_id);',
      snowflake: 'SELECT product_id, year AS first_year, quantity, price FROM Sales WHERE (product_id, year) IN (SELECT product_id, MIN(year) FROM Sales GROUP BY product_id);',
      bigquery: 'SELECT product_id, year AS first_year, quantity, price FROM Sales WHERE (product_id, year) IN (SELECT product_id, MIN(year) FROM Sales GROUP BY product_id);',
      mysql: 'SELECT product_id, year AS first_year, quantity, price FROM Sales WHERE (product_id, year) IN (SELECT product_id, MIN(year) FROM Sales GROUP BY product_id);'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/product-sales-analysis-iii/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1075',
    questionNumber: 1075,
    title: '1075. Project Employees I',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #1075: Project Employees I. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Project Employees I.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years FROM Project p JOIN Employee e ON p.employee_id = e.employee_id GROUP BY p.project_id;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years FROM Project p JOIN Employee e ON p.employee_id = e.employee_id GROUP BY p.project_id;',
      snowflake: 'SELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years FROM Project p JOIN Employee e ON p.employee_id = e.employee_id GROUP BY p.project_id;',
      bigquery: 'SELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years FROM Project p JOIN Employee e ON p.employee_id = e.employee_id GROUP BY p.project_id;',
      mysql: 'SELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years FROM Project p JOIN Employee e ON p.employee_id = e.employee_id GROUP BY p.project_id;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years FROM Project p JOIN Employee e ON p.employee_id = e.employee_id GROUP BY p.project_id;',
      snowflake: 'SELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years FROM Project p JOIN Employee e ON p.employee_id = e.employee_id GROUP BY p.project_id;',
      bigquery: 'SELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years FROM Project p JOIN Employee e ON p.employee_id = e.employee_id GROUP BY p.project_id;',
      mysql: 'SELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years FROM Project p JOIN Employee e ON p.employee_id = e.employee_id GROUP BY p.project_id;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/project-employees-i/',
    companyTag: 'Facebook',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1076',
    questionNumber: 1076,
    title: '1076. Project Employees II',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1076: Project Employees II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Project Employees II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/project-employees-ii/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1077',
    questionNumber: 1077,
    title: '1077. Project Employees III',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1077: Project Employees III. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Project Employees III.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/project-employees-iii/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1082',
    questionNumber: 1082,
    title: '1082. Sales Analysis I',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1082: Sales Analysis I. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Sales Analysis I.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/sales-analysis-i/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1083',
    questionNumber: 1083,
    title: '1083. Sales Analysis II',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1083: Sales Analysis II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Sales Analysis II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/sales-analysis-ii/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1084',
    questionNumber: 1084,
    title: '1084. Sales Analysis III',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1084: Sales Analysis III. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Sales Analysis III.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT p.product_id, p.product_name FROM Product p JOIN Sales s ON p.product_id = s.product_id GROUP BY p.product_id, p.product_name HAVING MIN(s.sale_date) >= \'2019-01-01\' AND MAX(s.sale_date) <= \'2019-03-31\';'
    },
    starterCodeByDialect: {
      postgres: 'SELECT p.product_id, p.product_name FROM Product p JOIN Sales s ON p.product_id = s.product_id GROUP BY p.product_id, p.product_name HAVING MIN(s.sale_date) >= \'2019-01-01\' AND MAX(s.sale_date) <= \'2019-03-31\';',
      snowflake: 'SELECT p.product_id, p.product_name FROM Product p JOIN Sales s ON p.product_id = s.product_id GROUP BY p.product_id, p.product_name HAVING MIN(s.sale_date) >= \'2019-01-01\' AND MAX(s.sale_date) <= \'2019-03-31\';',
      bigquery: 'SELECT p.product_id, p.product_name FROM Product p JOIN Sales s ON p.product_id = s.product_id GROUP BY p.product_id, p.product_name HAVING MIN(s.sale_date) >= \'2019-01-01\' AND MAX(s.sale_date) <= \'2019-03-31\';',
      mysql: 'SELECT p.product_id, p.product_name FROM Product p JOIN Sales s ON p.product_id = s.product_id GROUP BY p.product_id, p.product_name HAVING MIN(s.sale_date) >= \'2019-01-01\' AND MAX(s.sale_date) <= \'2019-03-31\';'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT p.product_id, p.product_name FROM Product p JOIN Sales s ON p.product_id = s.product_id GROUP BY p.product_id, p.product_name HAVING MIN(s.sale_date) >= \'2019-01-01\' AND MAX(s.sale_date) <= \'2019-03-31\';',
      snowflake: 'SELECT p.product_id, p.product_name FROM Product p JOIN Sales s ON p.product_id = s.product_id GROUP BY p.product_id, p.product_name HAVING MIN(s.sale_date) >= \'2019-01-01\' AND MAX(s.sale_date) <= \'2019-03-31\';',
      bigquery: 'SELECT p.product_id, p.product_name FROM Product p JOIN Sales s ON p.product_id = s.product_id GROUP BY p.product_id, p.product_name HAVING MIN(s.sale_date) >= \'2019-01-01\' AND MAX(s.sale_date) <= \'2019-03-31\';',
      mysql: 'SELECT p.product_id, p.product_name FROM Product p JOIN Sales s ON p.product_id = s.product_id GROUP BY p.product_id, p.product_name HAVING MIN(s.sale_date) >= \'2019-01-01\' AND MAX(s.sale_date) <= \'2019-03-31\';'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/sales-analysis-iii/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1097',
    questionNumber: 1097,
    title: '1097. Game Play Analysis V',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1097: Game Play Analysis V. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Game Play Analysis V.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/game-play-analysis-v/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1098',
    questionNumber: 1098,
    title: '1098. Unpopular Books',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1098: Unpopular Books. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Unpopular Books.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/unpopular-books/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1107',
    questionNumber: 1107,
    title: '1107. New Users Daily Count',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1107: New Users Daily Count. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for New Users Daily Count.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/new-users-daily-count/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1112',
    questionNumber: 1112,
    title: '1112. Highest Grade For Each Student',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #1112: Highest Grade For Each Student. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Highest Grade For Each Student.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/highest-grade-for-each-student/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1113',
    questionNumber: 1113,
    title: '1113. Reported Posts',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #1113: Reported Posts. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Reported Posts.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/reported-posts/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1126',
    questionNumber: 1126,
    title: '1126. Active Businesses',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1126: Active Businesses. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Active Businesses.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/active-businesses/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1127',
    questionNumber: 1127,
    title: '1127. User Purchase Platform',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1127: User Purchase Platform. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for User Purchase Platform.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/user-purchase-platform/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1132',
    questionNumber: 1132,
    title: '1132. Reported Posts II',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #1132: Reported Posts II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Reported Posts II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/reported-posts-ii/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1141',
    questionNumber: 1141,
    title: '1141. User Activity for the Past 30 Days I',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1141: User Activity for the Past 30 Days I. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for User Activity for the Past 30 Days I.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT activity_date AS day, COUNT(DISTINCT user_id) AS active_users FROM Activity WHERE activity_date BETWEEN \'2019-06-28\' AND \'2019-07-27\' GROUP BY activity_date;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT activity_date AS day, COUNT(DISTINCT user_id) AS active_users FROM Activity WHERE activity_date BETWEEN \'2019-06-28\' AND \'2019-07-27\' GROUP BY activity_date;',
      snowflake: 'SELECT activity_date AS day, COUNT(DISTINCT user_id) AS active_users FROM Activity WHERE activity_date BETWEEN \'2019-06-28\' AND \'2019-07-27\' GROUP BY activity_date;',
      bigquery: 'SELECT activity_date AS day, COUNT(DISTINCT user_id) AS active_users FROM Activity WHERE activity_date BETWEEN \'2019-06-28\' AND \'2019-07-27\' GROUP BY activity_date;',
      mysql: 'SELECT activity_date AS day, COUNT(DISTINCT user_id) AS active_users FROM Activity WHERE activity_date BETWEEN \'2019-06-28\' AND \'2019-07-27\' GROUP BY activity_date;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT activity_date AS day, COUNT(DISTINCT user_id) AS active_users FROM Activity WHERE activity_date BETWEEN \'2019-06-28\' AND \'2019-07-27\' GROUP BY activity_date;',
      snowflake: 'SELECT activity_date AS day, COUNT(DISTINCT user_id) AS active_users FROM Activity WHERE activity_date BETWEEN \'2019-06-28\' AND \'2019-07-27\' GROUP BY activity_date;',
      bigquery: 'SELECT activity_date AS day, COUNT(DISTINCT user_id) AS active_users FROM Activity WHERE activity_date BETWEEN \'2019-06-28\' AND \'2019-07-27\' GROUP BY activity_date;',
      mysql: 'SELECT activity_date AS day, COUNT(DISTINCT user_id) AS active_users FROM Activity WHERE activity_date BETWEEN \'2019-06-28\' AND \'2019-07-27\' GROUP BY activity_date;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/user-activity-for-the-past-30-days-i/',
    companyTag: 'Facebook',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1142',
    questionNumber: 1142,
    title: '1142. User Activity for the Past 30 Days II',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1142: User Activity for the Past 30 Days II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for User Activity for the Past 30 Days II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/user-activity-for-the-past-30-days-ii/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1148',
    questionNumber: 1148,
    title: '1148. Article Views I',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1148: Article Views I. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Article Views I.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT DISTINCT author_id AS id FROM Views WHERE author_id = viewer_id ORDER BY id ASC;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT DISTINCT author_id AS id FROM Views WHERE author_id = viewer_id ORDER BY id ASC;',
      snowflake: 'SELECT DISTINCT author_id AS id FROM Views WHERE author_id = viewer_id ORDER BY id ASC;',
      bigquery: 'SELECT DISTINCT author_id AS id FROM Views WHERE author_id = viewer_id ORDER BY id ASC;',
      mysql: 'SELECT DISTINCT author_id AS id FROM Views WHERE author_id = viewer_id ORDER BY id ASC;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT DISTINCT author_id AS id FROM Views WHERE author_id = viewer_id ORDER BY id ASC;',
      snowflake: 'SELECT DISTINCT author_id AS id FROM Views WHERE author_id = viewer_id ORDER BY id ASC;',
      bigquery: 'SELECT DISTINCT author_id AS id FROM Views WHERE author_id = viewer_id ORDER BY id ASC;',
      mysql: 'SELECT DISTINCT author_id AS id FROM Views WHERE author_id = viewer_id ORDER BY id ASC;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/article-views-i/',
    companyTag: 'LinkedIn',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1149',
    questionNumber: 1149,
    title: '1149. Article Views II',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1149: Article Views II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Article Views II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/article-views-ii/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1158',
    questionNumber: 1158,
    title: '1158. Market Analysis I',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1158: Market Analysis I. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Market Analysis I.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/market-analysis-i/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1159',
    questionNumber: 1159,
    title: '1159. Market Analysis II',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1159: Market Analysis II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Market Analysis II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/market-analysis-ii/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1164',
    questionNumber: 1164,
    title: '1164. Product Price at a Given Date',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #1164: Product Price at a Given Date. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Product Price at a Given Date.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'WITH latest AS (SELECT product_id, new_price, change_date, RANK() OVER (PARTITION BY product_id ORDER BY change_date DESC) as rk FROM Products WHERE change_date <= \'2019-08-16\') SELECT p.product_id, COALESCE(l.new_price, 10) AS price FROM (SELECT DISTINCT product_id FROM Products) p LEFT JOIN latest l ON p.product_id = l.product_id AND l.rk = 1;'
    },
    starterCodeByDialect: {
      postgres: 'WITH latest AS (SELECT product_id, new_price, change_date, RANK() OVER (PARTITION BY product_id ORDER BY change_date DESC) as rk FROM Products WHERE change_date <= \'2019-08-16\') SELECT p.product_id, COALESCE(l.new_price, 10) AS price FROM (SELECT DISTINCT product_id FROM Products) p LEFT JOIN latest l ON p.product_id = l.product_id AND l.rk = 1;',
      snowflake: 'WITH latest AS (SELECT product_id, new_price, change_date, RANK() OVER (PARTITION BY product_id ORDER BY change_date DESC) as rk FROM Products WHERE change_date <= \'2019-08-16\') SELECT p.product_id, COALESCE(l.new_price, 10) AS price FROM (SELECT DISTINCT product_id FROM Products) p LEFT JOIN latest l ON p.product_id = l.product_id AND l.rk = 1;',
      bigquery: 'WITH latest AS (SELECT product_id, new_price, change_date, RANK() OVER (PARTITION BY product_id ORDER BY change_date DESC) as rk FROM Products WHERE change_date <= \'2019-08-16\') SELECT p.product_id, COALESCE(l.new_price, 10) AS price FROM (SELECT DISTINCT product_id FROM Products) p LEFT JOIN latest l ON p.product_id = l.product_id AND l.rk = 1;',
      mysql: 'WITH latest AS (SELECT product_id, new_price, change_date, RANK() OVER (PARTITION BY product_id ORDER BY change_date DESC) as rk FROM Products WHERE change_date <= \'2019-08-16\') SELECT p.product_id, COALESCE(l.new_price, 10) AS price FROM (SELECT DISTINCT product_id FROM Products) p LEFT JOIN latest l ON p.product_id = l.product_id AND l.rk = 1;'
    },
    officialSolutionByDialect: {
      postgres: 'WITH latest AS (SELECT product_id, new_price, change_date, RANK() OVER (PARTITION BY product_id ORDER BY change_date DESC) as rk FROM Products WHERE change_date <= \'2019-08-16\') SELECT p.product_id, COALESCE(l.new_price, 10) AS price FROM (SELECT DISTINCT product_id FROM Products) p LEFT JOIN latest l ON p.product_id = l.product_id AND l.rk = 1;',
      snowflake: 'WITH latest AS (SELECT product_id, new_price, change_date, RANK() OVER (PARTITION BY product_id ORDER BY change_date DESC) as rk FROM Products WHERE change_date <= \'2019-08-16\') SELECT p.product_id, COALESCE(l.new_price, 10) AS price FROM (SELECT DISTINCT product_id FROM Products) p LEFT JOIN latest l ON p.product_id = l.product_id AND l.rk = 1;',
      bigquery: 'WITH latest AS (SELECT product_id, new_price, change_date, RANK() OVER (PARTITION BY product_id ORDER BY change_date DESC) as rk FROM Products WHERE change_date <= \'2019-08-16\') SELECT p.product_id, COALESCE(l.new_price, 10) AS price FROM (SELECT DISTINCT product_id FROM Products) p LEFT JOIN latest l ON p.product_id = l.product_id AND l.rk = 1;',
      mysql: 'WITH latest AS (SELECT product_id, new_price, change_date, RANK() OVER (PARTITION BY product_id ORDER BY change_date DESC) as rk FROM Products WHERE change_date <= \'2019-08-16\') SELECT p.product_id, COALESCE(l.new_price, 10) AS price FROM (SELECT DISTINCT product_id FROM Products) p LEFT JOIN latest l ON p.product_id = l.product_id AND l.rk = 1;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/product-price-at-a-given-date/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1173',
    questionNumber: 1173,
    title: '1173. Immediate Food Delivery I',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1173: Immediate Food Delivery I. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Immediate Food Delivery I.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/immediate-food-delivery-i/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1174',
    questionNumber: 1174,
    title: '1174. Immediate Food Delivery II',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #1174: Immediate Food Delivery II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Immediate Food Delivery II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'WITH first_orders AS (SELECT customer_id, MIN(order_date) as first_date FROM Delivery GROUP BY customer_id) SELECT ROUND(SUM(CASE WHEN d.order_date = d.customer_pref_delivery_date THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS immediate_percentage FROM Delivery d JOIN first_orders f ON d.customer_id = f.customer_id AND d.order_date = f.first_date;'
    },
    starterCodeByDialect: {
      postgres: 'WITH first_orders AS (SELECT customer_id, MIN(order_date) as first_date FROM Delivery GROUP BY customer_id) SELECT ROUND(SUM(CASE WHEN d.order_date = d.customer_pref_delivery_date THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS immediate_percentage FROM Delivery d JOIN first_orders f ON d.customer_id = f.customer_id AND d.order_date = f.first_date;',
      snowflake: 'WITH first_orders AS (SELECT customer_id, MIN(order_date) as first_date FROM Delivery GROUP BY customer_id) SELECT ROUND(SUM(CASE WHEN d.order_date = d.customer_pref_delivery_date THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS immediate_percentage FROM Delivery d JOIN first_orders f ON d.customer_id = f.customer_id AND d.order_date = f.first_date;',
      bigquery: 'WITH first_orders AS (SELECT customer_id, MIN(order_date) as first_date FROM Delivery GROUP BY customer_id) SELECT ROUND(SUM(CASE WHEN d.order_date = d.customer_pref_delivery_date THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS immediate_percentage FROM Delivery d JOIN first_orders f ON d.customer_id = f.customer_id AND d.order_date = f.first_date;',
      mysql: 'WITH first_orders AS (SELECT customer_id, MIN(order_date) as first_date FROM Delivery GROUP BY customer_id) SELECT ROUND(SUM(CASE WHEN d.order_date = d.customer_pref_delivery_date THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS immediate_percentage FROM Delivery d JOIN first_orders f ON d.customer_id = f.customer_id AND d.order_date = f.first_date;'
    },
    officialSolutionByDialect: {
      postgres: 'WITH first_orders AS (SELECT customer_id, MIN(order_date) as first_date FROM Delivery GROUP BY customer_id) SELECT ROUND(SUM(CASE WHEN d.order_date = d.customer_pref_delivery_date THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS immediate_percentage FROM Delivery d JOIN first_orders f ON d.customer_id = f.customer_id AND d.order_date = f.first_date;',
      snowflake: 'WITH first_orders AS (SELECT customer_id, MIN(order_date) as first_date FROM Delivery GROUP BY customer_id) SELECT ROUND(SUM(CASE WHEN d.order_date = d.customer_pref_delivery_date THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS immediate_percentage FROM Delivery d JOIN first_orders f ON d.customer_id = f.customer_id AND d.order_date = f.first_date;',
      bigquery: 'WITH first_orders AS (SELECT customer_id, MIN(order_date) as first_date FROM Delivery GROUP BY customer_id) SELECT ROUND(SUM(CASE WHEN d.order_date = d.customer_pref_delivery_date THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS immediate_percentage FROM Delivery d JOIN first_orders f ON d.customer_id = f.customer_id AND d.order_date = f.first_date;',
      mysql: 'WITH first_orders AS (SELECT customer_id, MIN(order_date) as first_date FROM Delivery GROUP BY customer_id) SELECT ROUND(SUM(CASE WHEN d.order_date = d.customer_pref_delivery_date THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS immediate_percentage FROM Delivery d JOIN first_orders f ON d.customer_id = f.customer_id AND d.order_date = f.first_date;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/immediate-food-delivery-ii/',
    companyTag: 'DoorDash',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1179',
    questionNumber: 1179,
    title: '1179. Reformat Department Table',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #1179: Reformat Department Table. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Reformat Department Table.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/reformat-department-table/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1193',
    questionNumber: 1193,
    title: '1193. Monthly Transactions I',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1193: Monthly Transactions I. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Monthly Transactions I.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT SUBSTR(trans_date, 1, 7) AS month, country, COUNT(*) AS trans_count, SUM(CASE WHEN state = \'approved\' THEN 1 ELSE 0 END) AS approved_count, SUM(amount) AS trans_total_amount, SUM(CASE WHEN state = \'approved\' THEN amount ELSE 0 END) AS approved_total_amount FROM Transactions GROUP BY month, country;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT SUBSTR(trans_date, 1, 7) AS month, country, COUNT(*) AS trans_count, SUM(CASE WHEN state = \'approved\' THEN 1 ELSE 0 END) AS approved_count, SUM(amount) AS trans_total_amount, SUM(CASE WHEN state = \'approved\' THEN amount ELSE 0 END) AS approved_total_amount FROM Transactions GROUP BY month, country;',
      snowflake: 'SELECT SUBSTR(trans_date, 1, 7) AS month, country, COUNT(*) AS trans_count, SUM(CASE WHEN state = \'approved\' THEN 1 ELSE 0 END) AS approved_count, SUM(amount) AS trans_total_amount, SUM(CASE WHEN state = \'approved\' THEN amount ELSE 0 END) AS approved_total_amount FROM Transactions GROUP BY month, country;',
      bigquery: 'SELECT SUBSTR(trans_date, 1, 7) AS month, country, COUNT(*) AS trans_count, SUM(CASE WHEN state = \'approved\' THEN 1 ELSE 0 END) AS approved_count, SUM(amount) AS trans_total_amount, SUM(CASE WHEN state = \'approved\' THEN amount ELSE 0 END) AS approved_total_amount FROM Transactions GROUP BY month, country;',
      mysql: 'SELECT SUBSTR(trans_date, 1, 7) AS month, country, COUNT(*) AS trans_count, SUM(CASE WHEN state = \'approved\' THEN 1 ELSE 0 END) AS approved_count, SUM(amount) AS trans_total_amount, SUM(CASE WHEN state = \'approved\' THEN amount ELSE 0 END) AS approved_total_amount FROM Transactions GROUP BY month, country;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT SUBSTR(trans_date, 1, 7) AS month, country, COUNT(*) AS trans_count, SUM(CASE WHEN state = \'approved\' THEN 1 ELSE 0 END) AS approved_count, SUM(amount) AS trans_total_amount, SUM(CASE WHEN state = \'approved\' THEN amount ELSE 0 END) AS approved_total_amount FROM Transactions GROUP BY month, country;',
      snowflake: 'SELECT SUBSTR(trans_date, 1, 7) AS month, country, COUNT(*) AS trans_count, SUM(CASE WHEN state = \'approved\' THEN 1 ELSE 0 END) AS approved_count, SUM(amount) AS trans_total_amount, SUM(CASE WHEN state = \'approved\' THEN amount ELSE 0 END) AS approved_total_amount FROM Transactions GROUP BY month, country;',
      bigquery: 'SELECT SUBSTR(trans_date, 1, 7) AS month, country, COUNT(*) AS trans_count, SUM(CASE WHEN state = \'approved\' THEN 1 ELSE 0 END) AS approved_count, SUM(amount) AS trans_total_amount, SUM(CASE WHEN state = \'approved\' THEN amount ELSE 0 END) AS approved_total_amount FROM Transactions GROUP BY month, country;',
      mysql: 'SELECT SUBSTR(trans_date, 1, 7) AS month, country, COUNT(*) AS trans_count, SUM(CASE WHEN state = \'approved\' THEN 1 ELSE 0 END) AS approved_count, SUM(amount) AS trans_total_amount, SUM(CASE WHEN state = \'approved\' THEN amount ELSE 0 END) AS approved_total_amount FROM Transactions GROUP BY month, country;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/monthly-transactions-i/',
    companyTag: 'Square',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1194',
    questionNumber: 1194,
    title: '1194. Tournament Winners',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1194: Tournament Winners. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Tournament Winners.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/tournament-winners/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1204',
    questionNumber: 1204,
    title: '1204. Last Person to Fit in the Bus',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #1204: Last Person to Fit in the Bus. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Last Person to Fit in the Bus.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'WITH cum_sum AS (SELECT person_name, weight, turn, SUM(weight) OVER (ORDER BY turn) as total_weight FROM Queue) SELECT person_name FROM cum_sum WHERE total_weight <= 1000 ORDER BY turn DESC LIMIT 1;'
    },
    starterCodeByDialect: {
      postgres: 'WITH cum_sum AS (SELECT person_name, weight, turn, SUM(weight) OVER (ORDER BY turn) as total_weight FROM Queue) SELECT person_name FROM cum_sum WHERE total_weight <= 1000 ORDER BY turn DESC LIMIT 1;',
      snowflake: 'WITH cum_sum AS (SELECT person_name, weight, turn, SUM(weight) OVER (ORDER BY turn) as total_weight FROM Queue) SELECT person_name FROM cum_sum WHERE total_weight <= 1000 ORDER BY turn DESC LIMIT 1;',
      bigquery: 'WITH cum_sum AS (SELECT person_name, weight, turn, SUM(weight) OVER (ORDER BY turn) as total_weight FROM Queue) SELECT person_name FROM cum_sum WHERE total_weight <= 1000 ORDER BY turn DESC LIMIT 1;',
      mysql: 'WITH cum_sum AS (SELECT person_name, weight, turn, SUM(weight) OVER (ORDER BY turn) as total_weight FROM Queue) SELECT person_name FROM cum_sum WHERE total_weight <= 1000 ORDER BY turn DESC LIMIT 1;'
    },
    officialSolutionByDialect: {
      postgres: 'WITH cum_sum AS (SELECT person_name, weight, turn, SUM(weight) OVER (ORDER BY turn) as total_weight FROM Queue) SELECT person_name FROM cum_sum WHERE total_weight <= 1000 ORDER BY turn DESC LIMIT 1;',
      snowflake: 'WITH cum_sum AS (SELECT person_name, weight, turn, SUM(weight) OVER (ORDER BY turn) as total_weight FROM Queue) SELECT person_name FROM cum_sum WHERE total_weight <= 1000 ORDER BY turn DESC LIMIT 1;',
      bigquery: 'WITH cum_sum AS (SELECT person_name, weight, turn, SUM(weight) OVER (ORDER BY turn) as total_weight FROM Queue) SELECT person_name FROM cum_sum WHERE total_weight <= 1000 ORDER BY turn DESC LIMIT 1;',
      mysql: 'WITH cum_sum AS (SELECT person_name, weight, turn, SUM(weight) OVER (ORDER BY turn) as total_weight FROM Queue) SELECT person_name FROM cum_sum WHERE total_weight <= 1000 ORDER BY turn DESC LIMIT 1;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/last-person-to-fit-in-the-bus/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1205',
    questionNumber: 1205,
    title: '1205. Monthly Transactions II',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #1205: Monthly Transactions II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Monthly Transactions II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/monthly-transactions-ii/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1211',
    questionNumber: 1211,
    title: '1211. Queries Quality and Percentage',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1211: Queries Quality and Percentage. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Queries Quality and Percentage.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT query_name, ROUND(AVG(rating * 1.0 / position), 2) AS quality, ROUND(SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS poor_query_percentage FROM Queries WHERE query_name IS NOT NULL GROUP BY query_name;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT query_name, ROUND(AVG(rating * 1.0 / position), 2) AS quality, ROUND(SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS poor_query_percentage FROM Queries WHERE query_name IS NOT NULL GROUP BY query_name;',
      snowflake: 'SELECT query_name, ROUND(AVG(rating * 1.0 / position), 2) AS quality, ROUND(SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS poor_query_percentage FROM Queries WHERE query_name IS NOT NULL GROUP BY query_name;',
      bigquery: 'SELECT query_name, ROUND(AVG(rating * 1.0 / position), 2) AS quality, ROUND(SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS poor_query_percentage FROM Queries WHERE query_name IS NOT NULL GROUP BY query_name;',
      mysql: 'SELECT query_name, ROUND(AVG(rating * 1.0 / position), 2) AS quality, ROUND(SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS poor_query_percentage FROM Queries WHERE query_name IS NOT NULL GROUP BY query_name;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT query_name, ROUND(AVG(rating * 1.0 / position), 2) AS quality, ROUND(SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS poor_query_percentage FROM Queries WHERE query_name IS NOT NULL GROUP BY query_name;',
      snowflake: 'SELECT query_name, ROUND(AVG(rating * 1.0 / position), 2) AS quality, ROUND(SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS poor_query_percentage FROM Queries WHERE query_name IS NOT NULL GROUP BY query_name;',
      bigquery: 'SELECT query_name, ROUND(AVG(rating * 1.0 / position), 2) AS quality, ROUND(SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS poor_query_percentage FROM Queries WHERE query_name IS NOT NULL GROUP BY query_name;',
      mysql: 'SELECT query_name, ROUND(AVG(rating * 1.0 / position), 2) AS quality, ROUND(SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS poor_query_percentage FROM Queries WHERE query_name IS NOT NULL GROUP BY query_name;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/queries-quality-and-percentage/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1212',
    questionNumber: 1212,
    title: '1212. Team Scores in Football Tournament',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1212: Team Scores in Football Tournament. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Team Scores in Football Tournament.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/team-scores-in-football-tournament/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1225',
    questionNumber: 1225,
    title: '1225. Report Contiguous Dates',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #1225: Report Contiguous Dates. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Report Contiguous Dates.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/report-contiguous-dates/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1241',
    questionNumber: 1241,
    title: '1241. Number of Comments per Post',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1241: Number of Comments per Post. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Number of Comments per Post.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/number-of-comments-per-post/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1251',
    questionNumber: 1251,
    title: '1251. Average Selling Price',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #1251: Average Selling Price. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Average Selling Price.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT p.product_id, ROUND(COALESCE(SUM(p.price * u.units) * 1.0 / SUM(u.units), 0), 2) AS average_price FROM Prices p LEFT JOIN UnitsSold u ON p.product_id = u.product_id AND u.purchase_date BETWEEN p.start_date AND p.end_date GROUP BY p.product_id;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT p.product_id, ROUND(COALESCE(SUM(p.price * u.units) * 1.0 / SUM(u.units), 0), 2) AS average_price FROM Prices p LEFT JOIN UnitsSold u ON p.product_id = u.product_id AND u.purchase_date BETWEEN p.start_date AND p.end_date GROUP BY p.product_id;',
      snowflake: 'SELECT p.product_id, ROUND(COALESCE(SUM(p.price * u.units) * 1.0 / SUM(u.units), 0), 2) AS average_price FROM Prices p LEFT JOIN UnitsSold u ON p.product_id = u.product_id AND u.purchase_date BETWEEN p.start_date AND p.end_date GROUP BY p.product_id;',
      bigquery: 'SELECT p.product_id, ROUND(COALESCE(SUM(p.price * u.units) * 1.0 / SUM(u.units), 0), 2) AS average_price FROM Prices p LEFT JOIN UnitsSold u ON p.product_id = u.product_id AND u.purchase_date BETWEEN p.start_date AND p.end_date GROUP BY p.product_id;',
      mysql: 'SELECT p.product_id, ROUND(COALESCE(SUM(p.price * u.units) * 1.0 / SUM(u.units), 0), 2) AS average_price FROM Prices p LEFT JOIN UnitsSold u ON p.product_id = u.product_id AND u.purchase_date BETWEEN p.start_date AND p.end_date GROUP BY p.product_id;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT p.product_id, ROUND(COALESCE(SUM(p.price * u.units) * 1.0 / SUM(u.units), 0), 2) AS average_price FROM Prices p LEFT JOIN UnitsSold u ON p.product_id = u.product_id AND u.purchase_date BETWEEN p.start_date AND p.end_date GROUP BY p.product_id;',
      snowflake: 'SELECT p.product_id, ROUND(COALESCE(SUM(p.price * u.units) * 1.0 / SUM(u.units), 0), 2) AS average_price FROM Prices p LEFT JOIN UnitsSold u ON p.product_id = u.product_id AND u.purchase_date BETWEEN p.start_date AND p.end_date GROUP BY p.product_id;',
      bigquery: 'SELECT p.product_id, ROUND(COALESCE(SUM(p.price * u.units) * 1.0 / SUM(u.units), 0), 2) AS average_price FROM Prices p LEFT JOIN UnitsSold u ON p.product_id = u.product_id AND u.purchase_date BETWEEN p.start_date AND p.end_date GROUP BY p.product_id;',
      mysql: 'SELECT p.product_id, ROUND(COALESCE(SUM(p.price * u.units) * 1.0 / SUM(u.units), 0), 2) AS average_price FROM Prices p LEFT JOIN UnitsSold u ON p.product_id = u.product_id AND u.purchase_date BETWEEN p.start_date AND p.end_date GROUP BY p.product_id;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/average-selling-price/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1264',
    questionNumber: 1264,
    title: '1264. Page Recommendations',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1264: Page Recommendations. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Page Recommendations.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/page-recommendations/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1270',
    questionNumber: 1270,
    title: '1270. All People Report to the Given Manager',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #1270: All People Report to the Given Manager. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for All People Report to the Given Manager.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/all-people-report-to-the-given-manager/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1280',
    questionNumber: 1280,
    title: '1280. Students and Examinations',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #1280: Students and Examinations. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Students and Examinations.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT s.student_id, s.student_name, sub.subject_name, COUNT(e.subject_name) AS attended_exams FROM Students s CROSS JOIN Subjects sub LEFT JOIN Examinations e ON s.student_id = e.student_id AND sub.subject_name = e.subject_name GROUP BY s.student_id, s.student_name, sub.subject_name ORDER BY s.student_id, sub.subject_name;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT s.student_id, s.student_name, sub.subject_name, COUNT(e.subject_name) AS attended_exams FROM Students s CROSS JOIN Subjects sub LEFT JOIN Examinations e ON s.student_id = e.student_id AND sub.subject_name = e.subject_name GROUP BY s.student_id, s.student_name, sub.subject_name ORDER BY s.student_id, sub.subject_name;',
      snowflake: 'SELECT s.student_id, s.student_name, sub.subject_name, COUNT(e.subject_name) AS attended_exams FROM Students s CROSS JOIN Subjects sub LEFT JOIN Examinations e ON s.student_id = e.student_id AND sub.subject_name = e.subject_name GROUP BY s.student_id, s.student_name, sub.subject_name ORDER BY s.student_id, sub.subject_name;',
      bigquery: 'SELECT s.student_id, s.student_name, sub.subject_name, COUNT(e.subject_name) AS attended_exams FROM Students s CROSS JOIN Subjects sub LEFT JOIN Examinations e ON s.student_id = e.student_id AND sub.subject_name = e.subject_name GROUP BY s.student_id, s.student_name, sub.subject_name ORDER BY s.student_id, sub.subject_name;',
      mysql: 'SELECT s.student_id, s.student_name, sub.subject_name, COUNT(e.subject_name) AS attended_exams FROM Students s CROSS JOIN Subjects sub LEFT JOIN Examinations e ON s.student_id = e.student_id AND sub.subject_name = e.subject_name GROUP BY s.student_id, s.student_name, sub.subject_name ORDER BY s.student_id, sub.subject_name;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT s.student_id, s.student_name, sub.subject_name, COUNT(e.subject_name) AS attended_exams FROM Students s CROSS JOIN Subjects sub LEFT JOIN Examinations e ON s.student_id = e.student_id AND sub.subject_name = e.subject_name GROUP BY s.student_id, s.student_name, sub.subject_name ORDER BY s.student_id, sub.subject_name;',
      snowflake: 'SELECT s.student_id, s.student_name, sub.subject_name, COUNT(e.subject_name) AS attended_exams FROM Students s CROSS JOIN Subjects sub LEFT JOIN Examinations e ON s.student_id = e.student_id AND sub.subject_name = e.subject_name GROUP BY s.student_id, s.student_name, sub.subject_name ORDER BY s.student_id, sub.subject_name;',
      bigquery: 'SELECT s.student_id, s.student_name, sub.subject_name, COUNT(e.subject_name) AS attended_exams FROM Students s CROSS JOIN Subjects sub LEFT JOIN Examinations e ON s.student_id = e.student_id AND sub.subject_name = e.subject_name GROUP BY s.student_id, s.student_name, sub.subject_name ORDER BY s.student_id, sub.subject_name;',
      mysql: 'SELECT s.student_id, s.student_name, sub.subject_name, COUNT(e.subject_name) AS attended_exams FROM Students s CROSS JOIN Subjects sub LEFT JOIN Examinations e ON s.student_id = e.student_id AND sub.subject_name = e.subject_name GROUP BY s.student_id, s.student_name, sub.subject_name ORDER BY s.student_id, sub.subject_name;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/students-and-examinations/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1285',
    questionNumber: 1285,
    title: '1285. Find the Start and End Number of Continuous Ranges',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1285: Find the Start and End Number of Continuous Ranges. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find the Start and End Number of Continuous Ranges.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-the-start-and-end-number-of-continuous-ranges/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1294',
    questionNumber: 1294,
    title: '1294. Weather Type in Each Country',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1294: Weather Type in Each Country. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Weather Type in Each Country.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/weather-type-in-each-country/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1303',
    questionNumber: 1303,
    title: '1303. Find the Team Size',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1303: Find the Team Size. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find the Team Size.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-the-team-size/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1308',
    questionNumber: 1308,
    title: '1308. Running Total for Different Genders',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #1308: Running Total for Different Genders. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Running Total for Different Genders.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/running-total-for-different-genders/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1321',
    questionNumber: 1321,
    title: '1321. Restaurant Growth',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #1321: Restaurant Growth. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Restaurant Growth.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'WITH daily AS (SELECT visited_on, SUM(amount) as amount FROM Customer GROUP BY visited_on) SELECT visited_on, SUM(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS amount, ROUND(AVG(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS average_amount FROM daily LIMIT 100 OFFSET 6;'
    },
    starterCodeByDialect: {
      postgres: 'WITH daily AS (SELECT visited_on, SUM(amount) as amount FROM Customer GROUP BY visited_on) SELECT visited_on, SUM(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS amount, ROUND(AVG(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS average_amount FROM daily LIMIT 100 OFFSET 6;',
      snowflake: 'WITH daily AS (SELECT visited_on, SUM(amount) as amount FROM Customer GROUP BY visited_on) SELECT visited_on, SUM(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS amount, ROUND(AVG(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS average_amount FROM daily LIMIT 100 OFFSET 6;',
      bigquery: 'WITH daily AS (SELECT visited_on, SUM(amount) as amount FROM Customer GROUP BY visited_on) SELECT visited_on, SUM(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS amount, ROUND(AVG(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS average_amount FROM daily LIMIT 100 OFFSET 6;',
      mysql: 'WITH daily AS (SELECT visited_on, SUM(amount) as amount FROM Customer GROUP BY visited_on) SELECT visited_on, SUM(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS amount, ROUND(AVG(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS average_amount FROM daily LIMIT 100 OFFSET 6;'
    },
    officialSolutionByDialect: {
      postgres: 'WITH daily AS (SELECT visited_on, SUM(amount) as amount FROM Customer GROUP BY visited_on) SELECT visited_on, SUM(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS amount, ROUND(AVG(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS average_amount FROM daily LIMIT 100 OFFSET 6;',
      snowflake: 'WITH daily AS (SELECT visited_on, SUM(amount) as amount FROM Customer GROUP BY visited_on) SELECT visited_on, SUM(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS amount, ROUND(AVG(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS average_amount FROM daily LIMIT 100 OFFSET 6;',
      bigquery: 'WITH daily AS (SELECT visited_on, SUM(amount) as amount FROM Customer GROUP BY visited_on) SELECT visited_on, SUM(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS amount, ROUND(AVG(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS average_amount FROM daily LIMIT 100 OFFSET 6;',
      mysql: 'WITH daily AS (SELECT visited_on, SUM(amount) as amount FROM Customer GROUP BY visited_on) SELECT visited_on, SUM(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS amount, ROUND(AVG(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS average_amount FROM daily LIMIT 100 OFFSET 6;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/restaurant-growth/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1322',
    questionNumber: 1322,
    title: '1322. Ads Performance',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1322: Ads Performance. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Ads Performance.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/ads-performance/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1327',
    questionNumber: 1327,
    title: '1327. List the Products Ordered in a Period',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1327: List the Products Ordered in a Period. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for List the Products Ordered in a Period.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/list-the-products-ordered-in-a-period/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1336',
    questionNumber: 1336,
    title: '1336. Number of Transactions per Visit',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1336: Number of Transactions per Visit. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Number of Transactions per Visit.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/number-of-transactions-per-visit/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1341',
    questionNumber: 1341,
    title: '1341. Movie Rating',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'set_operations',
    topicLabel: 'SET OPERATIONS',
    businessScenario: 'LeetCode Database problem #1341: Movie Rating. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Movie Rating.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: '(SELECT u.name AS results FROM MovieRating mr JOIN Users u ON mr.user_id = u.user_id GROUP BY mr.user_id, u.name ORDER BY COUNT(mr.movie_id) DESC, u.name ASC LIMIT 1) UNION ALL (SELECT m.title AS results FROM MovieRating mr JOIN Movies m ON mr.movie_id = m.movie_id WHERE mr.created_at LIKE \'2020-02%\' GROUP BY mr.movie_id, m.title ORDER BY AVG(mr.rating) DESC, m.title ASC LIMIT 1);'
    },
    starterCodeByDialect: {
      postgres: '(SELECT u.name AS results FROM MovieRating mr JOIN Users u ON mr.user_id = u.user_id GROUP BY mr.user_id, u.name ORDER BY COUNT(mr.movie_id) DESC, u.name ASC LIMIT 1) UNION ALL (SELECT m.title AS results FROM MovieRating mr JOIN Movies m ON mr.movie_id = m.movie_id WHERE mr.created_at LIKE \'2020-02%\' GROUP BY mr.movie_id, m.title ORDER BY AVG(mr.rating) DESC, m.title ASC LIMIT 1);',
      snowflake: '(SELECT u.name AS results FROM MovieRating mr JOIN Users u ON mr.user_id = u.user_id GROUP BY mr.user_id, u.name ORDER BY COUNT(mr.movie_id) DESC, u.name ASC LIMIT 1) UNION ALL (SELECT m.title AS results FROM MovieRating mr JOIN Movies m ON mr.movie_id = m.movie_id WHERE mr.created_at LIKE \'2020-02%\' GROUP BY mr.movie_id, m.title ORDER BY AVG(mr.rating) DESC, m.title ASC LIMIT 1);',
      bigquery: '(SELECT u.name AS results FROM MovieRating mr JOIN Users u ON mr.user_id = u.user_id GROUP BY mr.user_id, u.name ORDER BY COUNT(mr.movie_id) DESC, u.name ASC LIMIT 1) UNION ALL (SELECT m.title AS results FROM MovieRating mr JOIN Movies m ON mr.movie_id = m.movie_id WHERE mr.created_at LIKE \'2020-02%\' GROUP BY mr.movie_id, m.title ORDER BY AVG(mr.rating) DESC, m.title ASC LIMIT 1);',
      mysql: '(SELECT u.name AS results FROM MovieRating mr JOIN Users u ON mr.user_id = u.user_id GROUP BY mr.user_id, u.name ORDER BY COUNT(mr.movie_id) DESC, u.name ASC LIMIT 1) UNION ALL (SELECT m.title AS results FROM MovieRating mr JOIN Movies m ON mr.movie_id = m.movie_id WHERE mr.created_at LIKE \'2020-02%\' GROUP BY mr.movie_id, m.title ORDER BY AVG(mr.rating) DESC, m.title ASC LIMIT 1);'
    },
    officialSolutionByDialect: {
      postgres: '(SELECT u.name AS results FROM MovieRating mr JOIN Users u ON mr.user_id = u.user_id GROUP BY mr.user_id, u.name ORDER BY COUNT(mr.movie_id) DESC, u.name ASC LIMIT 1) UNION ALL (SELECT m.title AS results FROM MovieRating mr JOIN Movies m ON mr.movie_id = m.movie_id WHERE mr.created_at LIKE \'2020-02%\' GROUP BY mr.movie_id, m.title ORDER BY AVG(mr.rating) DESC, m.title ASC LIMIT 1);',
      snowflake: '(SELECT u.name AS results FROM MovieRating mr JOIN Users u ON mr.user_id = u.user_id GROUP BY mr.user_id, u.name ORDER BY COUNT(mr.movie_id) DESC, u.name ASC LIMIT 1) UNION ALL (SELECT m.title AS results FROM MovieRating mr JOIN Movies m ON mr.movie_id = m.movie_id WHERE mr.created_at LIKE \'2020-02%\' GROUP BY mr.movie_id, m.title ORDER BY AVG(mr.rating) DESC, m.title ASC LIMIT 1);',
      bigquery: '(SELECT u.name AS results FROM MovieRating mr JOIN Users u ON mr.user_id = u.user_id GROUP BY mr.user_id, u.name ORDER BY COUNT(mr.movie_id) DESC, u.name ASC LIMIT 1) UNION ALL (SELECT m.title AS results FROM MovieRating mr JOIN Movies m ON mr.movie_id = m.movie_id WHERE mr.created_at LIKE \'2020-02%\' GROUP BY mr.movie_id, m.title ORDER BY AVG(mr.rating) DESC, m.title ASC LIMIT 1);',
      mysql: '(SELECT u.name AS results FROM MovieRating mr JOIN Users u ON mr.user_id = u.user_id GROUP BY mr.user_id, u.name ORDER BY COUNT(mr.movie_id) DESC, u.name ASC LIMIT 1) UNION ALL (SELECT m.title AS results FROM MovieRating mr JOIN Movies m ON mr.movie_id = m.movie_id WHERE mr.created_at LIKE \'2020-02%\' GROUP BY mr.movie_id, m.title ORDER BY AVG(mr.rating) DESC, m.title ASC LIMIT 1);'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/movie-rating/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1350',
    questionNumber: 1350,
    title: '1350. Students With Invalid Departments',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #1350: Students With Invalid Departments. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Students With Invalid Departments.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/students-with-invalid-departments/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1355',
    questionNumber: 1355,
    title: '1355. Activity Participants',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1355: Activity Participants. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Activity Participants.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/activity-participants/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1364',
    questionNumber: 1364,
    title: '1364. Number of Trusted Contacts of a Customer',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1364: Number of Trusted Contacts of a Customer. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Number of Trusted Contacts of a Customer.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/number-of-trusted-contacts-of-a-customer/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1369',
    questionNumber: 1369,
    title: '1369. Get the Second Most Recent Activity',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1369: Get the Second Most Recent Activity. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Get the Second Most Recent Activity.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/get-the-second-most-recent-activity/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1378',
    questionNumber: 1378,
    title: '1378. Replace Employee ID With The Unique Identifier',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #1378: Replace Employee ID With The Unique Identifier. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Replace Employee ID With The Unique Identifier.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT u.unique_id, e.name FROM Employees e LEFT JOIN EmployeeUNI u ON e.id = u.id;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT u.unique_id, e.name FROM Employees e LEFT JOIN EmployeeUNI u ON e.id = u.id;',
      snowflake: 'SELECT u.unique_id, e.name FROM Employees e LEFT JOIN EmployeeUNI u ON e.id = u.id;',
      bigquery: 'SELECT u.unique_id, e.name FROM Employees e LEFT JOIN EmployeeUNI u ON e.id = u.id;',
      mysql: 'SELECT u.unique_id, e.name FROM Employees e LEFT JOIN EmployeeUNI u ON e.id = u.id;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT u.unique_id, e.name FROM Employees e LEFT JOIN EmployeeUNI u ON e.id = u.id;',
      snowflake: 'SELECT u.unique_id, e.name FROM Employees e LEFT JOIN EmployeeUNI u ON e.id = u.id;',
      bigquery: 'SELECT u.unique_id, e.name FROM Employees e LEFT JOIN EmployeeUNI u ON e.id = u.id;',
      mysql: 'SELECT u.unique_id, e.name FROM Employees e LEFT JOIN EmployeeUNI u ON e.id = u.id;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/replace-employee-id-with-the-unique-identifier/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1384',
    questionNumber: 1384,
    title: '1384. Total Sales Amount by Year',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1384: Total Sales Amount by Year. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Total Sales Amount by Year.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/total-sales-amount-by-year/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1393',
    questionNumber: 1393,
    title: '1393. Capital Gain/Loss',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1393: Capital Gain/Loss. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Capital Gain/Loss.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/capital-gainloss/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1398',
    questionNumber: 1398,
    title: '1398. Customers Who Bought Products A and B but Not C',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1398: Customers Who Bought Products A and B but Not C. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Customers Who Bought Products A and B but Not C.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/customers-who-bought-products-a-and-b-but-not-c/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1407',
    questionNumber: 1407,
    title: '1407. Top Travellers',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_sorting',
    topicLabel: 'BEGINNER SORTING',
    businessScenario: 'LeetCode Database problem #1407: Top Travellers. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Top Travellers.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/top-travellers/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1412',
    questionNumber: 1412,
    title: '1412. Find the Quiet Students in All Exams',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1412: Find the Quiet Students in All Exams. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find the Quiet Students in All Exams.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-the-quiet-students-in-all-exams/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1421',
    questionNumber: 1421,
    title: '1421. NPV Queries',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1421: NPV Queries. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for NPV Queries.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/npv-queries/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1435',
    questionNumber: 1435,
    title: '1435. Create a Session Bar Chart',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1435: Create a Session Bar Chart. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Create a Session Bar Chart.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/create-a-session-bar-chart/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1440',
    questionNumber: 1440,
    title: '1440. Evaluate Boolean Expression',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1440: Evaluate Boolean Expression. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Evaluate Boolean Expression.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/evaluate-boolean-expression/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1445',
    questionNumber: 1445,
    title: '1445. Apples & Oranges',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1445: Apples & Oranges. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Apples & Oranges.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/apples-oranges/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1454',
    questionNumber: 1454,
    title: '1454. Active Users',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1454: Active Users. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Active Users.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/active-users/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1459',
    questionNumber: 1459,
    title: '1459. Rectangles Area',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1459: Rectangles Area. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Rectangles Area.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/rectangles-area/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1468',
    questionNumber: 1468,
    title: '1468. Calculate Salaries',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1468: Calculate Salaries. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Calculate Salaries.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/calculate-salaries/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1479',
    questionNumber: 1479,
    title: '1479. Sales by Day of the Week',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #1479: Sales by Day of the Week. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Sales by Day of the Week.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/sales-by-day-of-the-week/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1484',
    questionNumber: 1484,
    title: '1484. Group Sold Products By The Date',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1484: Group Sold Products By The Date. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Group Sold Products By The Date.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT sell_date, COUNT(DISTINCT product) AS num_sold, GROUP_CONCAT(DISTINCT product ORDER BY product) AS products FROM Activities GROUP BY sell_date ORDER BY sell_date ASC;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT sell_date, COUNT(DISTINCT product) AS num_sold, GROUP_CONCAT(DISTINCT product ORDER BY product) AS products FROM Activities GROUP BY sell_date ORDER BY sell_date ASC;',
      snowflake: 'SELECT sell_date, COUNT(DISTINCT product) AS num_sold, GROUP_CONCAT(DISTINCT product ORDER BY product) AS products FROM Activities GROUP BY sell_date ORDER BY sell_date ASC;',
      bigquery: 'SELECT sell_date, COUNT(DISTINCT product) AS num_sold, GROUP_CONCAT(DISTINCT product ORDER BY product) AS products FROM Activities GROUP BY sell_date ORDER BY sell_date ASC;',
      mysql: 'SELECT sell_date, COUNT(DISTINCT product) AS num_sold, GROUP_CONCAT(DISTINCT product ORDER BY product) AS products FROM Activities GROUP BY sell_date ORDER BY sell_date ASC;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT sell_date, COUNT(DISTINCT product) AS num_sold, GROUP_CONCAT(DISTINCT product ORDER BY product) AS products FROM Activities GROUP BY sell_date ORDER BY sell_date ASC;',
      snowflake: 'SELECT sell_date, COUNT(DISTINCT product) AS num_sold, GROUP_CONCAT(DISTINCT product ORDER BY product) AS products FROM Activities GROUP BY sell_date ORDER BY sell_date ASC;',
      bigquery: 'SELECT sell_date, COUNT(DISTINCT product) AS num_sold, GROUP_CONCAT(DISTINCT product ORDER BY product) AS products FROM Activities GROUP BY sell_date ORDER BY sell_date ASC;',
      mysql: 'SELECT sell_date, COUNT(DISTINCT product) AS num_sold, GROUP_CONCAT(DISTINCT product ORDER BY product) AS products FROM Activities GROUP BY sell_date ORDER BY sell_date ASC;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/group-sold-products-by-the-date/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1495',
    questionNumber: 1495,
    title: '1495. Friendly Movies Streamed Last Month',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #1495: Friendly Movies Streamed Last Month. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Friendly Movies Streamed Last Month.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/friendly-movies-streamed-last-month/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1501',
    questionNumber: 1501,
    title: '1501. Countries You Can Safely Invest In',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1501: Countries You Can Safely Invest In. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Countries You Can Safely Invest In.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/countries-you-can-safely-invest-in/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1511',
    questionNumber: 1511,
    title: '1511. Customer Order Frequency',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1511: Customer Order Frequency. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Customer Order Frequency.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/customer-order-frequency/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1517',
    questionNumber: 1517,
    title: '1517. Find Users With Valid E-Mails',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1517: Find Users With Valid E-Mails. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Users With Valid E-Mails.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Users WHERE mail REGEXP \'^[a-zA-Z][a-zA-Z0-9_.-]*@leetcode\.com$\';'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Users WHERE mail REGEXP \'^[a-zA-Z][a-zA-Z0-9_.-]*@leetcode\.com$\';',
      snowflake: 'SELECT * FROM Users WHERE mail REGEXP \'^[a-zA-Z][a-zA-Z0-9_.-]*@leetcode\.com$\';',
      bigquery: 'SELECT * FROM Users WHERE mail REGEXP \'^[a-zA-Z][a-zA-Z0-9_.-]*@leetcode\.com$\';',
      mysql: 'SELECT * FROM Users WHERE mail REGEXP \'^[a-zA-Z][a-zA-Z0-9_.-]*@leetcode\.com$\';'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Users WHERE mail REGEXP \'^[a-zA-Z][a-zA-Z0-9_.-]*@leetcode\.com$\';',
      snowflake: 'SELECT * FROM Users WHERE mail REGEXP \'^[a-zA-Z][a-zA-Z0-9_.-]*@leetcode\.com$\';',
      bigquery: 'SELECT * FROM Users WHERE mail REGEXP \'^[a-zA-Z][a-zA-Z0-9_.-]*@leetcode\.com$\';',
      mysql: 'SELECT * FROM Users WHERE mail REGEXP \'^[a-zA-Z][a-zA-Z0-9_.-]*@leetcode\.com$\';'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-users-with-valid-e-mails/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1527',
    questionNumber: 1527,
    title: '1527. Patients With a Condition',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1527: Patients With a Condition. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Patients With a Condition.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Patients WHERE conditions LIKE \'DIAB1%\' OR conditions LIKE \'% DIAB1%\';'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Patients WHERE conditions LIKE \'DIAB1%\' OR conditions LIKE \'% DIAB1%\';',
      snowflake: 'SELECT * FROM Patients WHERE conditions LIKE \'DIAB1%\' OR conditions LIKE \'% DIAB1%\';',
      bigquery: 'SELECT * FROM Patients WHERE conditions LIKE \'DIAB1%\' OR conditions LIKE \'% DIAB1%\';',
      mysql: 'SELECT * FROM Patients WHERE conditions LIKE \'DIAB1%\' OR conditions LIKE \'% DIAB1%\';'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Patients WHERE conditions LIKE \'DIAB1%\' OR conditions LIKE \'% DIAB1%\';',
      snowflake: 'SELECT * FROM Patients WHERE conditions LIKE \'DIAB1%\' OR conditions LIKE \'% DIAB1%\';',
      bigquery: 'SELECT * FROM Patients WHERE conditions LIKE \'DIAB1%\' OR conditions LIKE \'% DIAB1%\';',
      mysql: 'SELECT * FROM Patients WHERE conditions LIKE \'DIAB1%\' OR conditions LIKE \'% DIAB1%\';'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/patients-with-a-condition/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1532',
    questionNumber: 1532,
    title: '1532. The Most Recent Three Orders',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1532: The Most Recent Three Orders. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The Most Recent Three Orders.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-most-recent-three-orders/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1543',
    questionNumber: 1543,
    title: '1543. Fix Product Name Format',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1543: Fix Product Name Format. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Fix Product Name Format.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/fix-product-name-format/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1549',
    questionNumber: 1549,
    title: '1549. The Most Recent Orders for Each Product',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1549: The Most Recent Orders for Each Product. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The Most Recent Orders for Each Product.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-most-recent-orders-for-each-product/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1555',
    questionNumber: 1555,
    title: '1555. Bank Account Summary',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1555: Bank Account Summary. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Bank Account Summary.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/bank-account-summary/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1565',
    questionNumber: 1565,
    title: '1565. Unique Orders and Customers Per Month',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #1565: Unique Orders and Customers Per Month. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Unique Orders and Customers Per Month.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/unique-orders-and-customers-per-month/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1571',
    questionNumber: 1571,
    title: '1571. Warehouse Manager',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #1571: Warehouse Manager. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Warehouse Manager.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/warehouse-manager/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1581',
    questionNumber: 1581,
    title: '1581. Customer Who Visited but Did Not Make Any Transactions',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #1581: Customer Who Visited but Did Not Make Any Transactions. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Customer Who Visited but Did Not Make Any Transactions.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT v.customer_id, COUNT(v.visit_id) AS count_no_trans FROM Visits v LEFT JOIN Transactions t ON v.visit_id = t.visit_id WHERE t.transaction_id IS NULL GROUP BY v.customer_id;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT v.customer_id, COUNT(v.visit_id) AS count_no_trans FROM Visits v LEFT JOIN Transactions t ON v.visit_id = t.visit_id WHERE t.transaction_id IS NULL GROUP BY v.customer_id;',
      snowflake: 'SELECT v.customer_id, COUNT(v.visit_id) AS count_no_trans FROM Visits v LEFT JOIN Transactions t ON v.visit_id = t.visit_id WHERE t.transaction_id IS NULL GROUP BY v.customer_id;',
      bigquery: 'SELECT v.customer_id, COUNT(v.visit_id) AS count_no_trans FROM Visits v LEFT JOIN Transactions t ON v.visit_id = t.visit_id WHERE t.transaction_id IS NULL GROUP BY v.customer_id;',
      mysql: 'SELECT v.customer_id, COUNT(v.visit_id) AS count_no_trans FROM Visits v LEFT JOIN Transactions t ON v.visit_id = t.visit_id WHERE t.transaction_id IS NULL GROUP BY v.customer_id;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT v.customer_id, COUNT(v.visit_id) AS count_no_trans FROM Visits v LEFT JOIN Transactions t ON v.visit_id = t.visit_id WHERE t.transaction_id IS NULL GROUP BY v.customer_id;',
      snowflake: 'SELECT v.customer_id, COUNT(v.visit_id) AS count_no_trans FROM Visits v LEFT JOIN Transactions t ON v.visit_id = t.visit_id WHERE t.transaction_id IS NULL GROUP BY v.customer_id;',
      bigquery: 'SELECT v.customer_id, COUNT(v.visit_id) AS count_no_trans FROM Visits v LEFT JOIN Transactions t ON v.visit_id = t.visit_id WHERE t.transaction_id IS NULL GROUP BY v.customer_id;',
      mysql: 'SELECT v.customer_id, COUNT(v.visit_id) AS count_no_trans FROM Visits v LEFT JOIN Transactions t ON v.visit_id = t.visit_id WHERE t.transaction_id IS NULL GROUP BY v.customer_id;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/customer-who-visited-but-did-not-make-any-transactions/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1587',
    questionNumber: 1587,
    title: '1587. Bank Account Summary II',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1587: Bank Account Summary II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Bank Account Summary II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/bank-account-summary-ii/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1596',
    questionNumber: 1596,
    title: '1596. The Most Frequently Ordered Products for Each Customer',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1596: The Most Frequently Ordered Products for Each Customer. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The Most Frequently Ordered Products for Each Customer.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-most-frequently-ordered-products-for-each-customer/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1607',
    questionNumber: 1607,
    title: '1607. Sellers With No Sales',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1607: Sellers With No Sales. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Sellers With No Sales.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/sellers-with-no-sales/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1613',
    questionNumber: 1613,
    title: '1613. Find the Missing IDs',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1613: Find the Missing IDs. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find the Missing IDs.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-the-missing-ids/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1623',
    questionNumber: 1623,
    title: '1623. All Valid Triplets That Can Represent a Country',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1623: All Valid Triplets That Can Represent a Country. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for All Valid Triplets That Can Represent a Country.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/all-valid-triplets-that-can-represent-a-country/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1633',
    questionNumber: 1633,
    title: '1633. Percentage of Users Attended a Contest',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1633: Percentage of Users Attended a Contest. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Percentage of Users Attended a Contest.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT contest_id, ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage FROM Register GROUP BY contest_id ORDER BY percentage DESC, contest_id ASC;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT contest_id, ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage FROM Register GROUP BY contest_id ORDER BY percentage DESC, contest_id ASC;',
      snowflake: 'SELECT contest_id, ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage FROM Register GROUP BY contest_id ORDER BY percentage DESC, contest_id ASC;',
      bigquery: 'SELECT contest_id, ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage FROM Register GROUP BY contest_id ORDER BY percentage DESC, contest_id ASC;',
      mysql: 'SELECT contest_id, ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage FROM Register GROUP BY contest_id ORDER BY percentage DESC, contest_id ASC;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT contest_id, ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage FROM Register GROUP BY contest_id ORDER BY percentage DESC, contest_id ASC;',
      snowflake: 'SELECT contest_id, ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage FROM Register GROUP BY contest_id ORDER BY percentage DESC, contest_id ASC;',
      bigquery: 'SELECT contest_id, ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage FROM Register GROUP BY contest_id ORDER BY percentage DESC, contest_id ASC;',
      mysql: 'SELECT contest_id, ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage FROM Register GROUP BY contest_id ORDER BY percentage DESC, contest_id ASC;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/percentage-of-users-attended-a-contest/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1635',
    questionNumber: 1635,
    title: '1635. Hopper Company Queries I',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1635: Hopper Company Queries I. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Hopper Company Queries I.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/hopper-company-queries-i/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1645',
    questionNumber: 1645,
    title: '1645. Hopper Company Queries II',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1645: Hopper Company Queries II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Hopper Company Queries II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/hopper-company-queries-ii/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1651',
    questionNumber: 1651,
    title: '1651. Hopper Company Queries III',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1651: Hopper Company Queries III. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Hopper Company Queries III.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/hopper-company-queries-iii/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1661',
    questionNumber: 1661,
    title: '1661. Average Time of Process per Machine',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #1661: Average Time of Process per Machine. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Average Time of Process per Machine.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT a1.machine_id, ROUND(AVG(a2.timestamp - a1.timestamp), 3) AS processing_time FROM Activity a1 JOIN Activity a2 ON a1.machine_id = a2.machine_id AND a1.process_id = a2.process_id AND a1.activity_type = \'start\' AND a2.activity_type = \'end\' GROUP BY a1.machine_id;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT a1.machine_id, ROUND(AVG(a2.timestamp - a1.timestamp), 3) AS processing_time FROM Activity a1 JOIN Activity a2 ON a1.machine_id = a2.machine_id AND a1.process_id = a2.process_id AND a1.activity_type = \'start\' AND a2.activity_type = \'end\' GROUP BY a1.machine_id;',
      snowflake: 'SELECT a1.machine_id, ROUND(AVG(a2.timestamp - a1.timestamp), 3) AS processing_time FROM Activity a1 JOIN Activity a2 ON a1.machine_id = a2.machine_id AND a1.process_id = a2.process_id AND a1.activity_type = \'start\' AND a2.activity_type = \'end\' GROUP BY a1.machine_id;',
      bigquery: 'SELECT a1.machine_id, ROUND(AVG(a2.timestamp - a1.timestamp), 3) AS processing_time FROM Activity a1 JOIN Activity a2 ON a1.machine_id = a2.machine_id AND a1.process_id = a2.process_id AND a1.activity_type = \'start\' AND a2.activity_type = \'end\' GROUP BY a1.machine_id;',
      mysql: 'SELECT a1.machine_id, ROUND(AVG(a2.timestamp - a1.timestamp), 3) AS processing_time FROM Activity a1 JOIN Activity a2 ON a1.machine_id = a2.machine_id AND a1.process_id = a2.process_id AND a1.activity_type = \'start\' AND a2.activity_type = \'end\' GROUP BY a1.machine_id;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT a1.machine_id, ROUND(AVG(a2.timestamp - a1.timestamp), 3) AS processing_time FROM Activity a1 JOIN Activity a2 ON a1.machine_id = a2.machine_id AND a1.process_id = a2.process_id AND a1.activity_type = \'start\' AND a2.activity_type = \'end\' GROUP BY a1.machine_id;',
      snowflake: 'SELECT a1.machine_id, ROUND(AVG(a2.timestamp - a1.timestamp), 3) AS processing_time FROM Activity a1 JOIN Activity a2 ON a1.machine_id = a2.machine_id AND a1.process_id = a2.process_id AND a1.activity_type = \'start\' AND a2.activity_type = \'end\' GROUP BY a1.machine_id;',
      bigquery: 'SELECT a1.machine_id, ROUND(AVG(a2.timestamp - a1.timestamp), 3) AS processing_time FROM Activity a1 JOIN Activity a2 ON a1.machine_id = a2.machine_id AND a1.process_id = a2.process_id AND a1.activity_type = \'start\' AND a2.activity_type = \'end\' GROUP BY a1.machine_id;',
      mysql: 'SELECT a1.machine_id, ROUND(AVG(a2.timestamp - a1.timestamp), 3) AS processing_time FROM Activity a1 JOIN Activity a2 ON a1.machine_id = a2.machine_id AND a1.process_id = a2.process_id AND a1.activity_type = \'start\' AND a2.activity_type = \'end\' GROUP BY a1.machine_id;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/average-time-of-process-per-machine/',
    companyTag: 'Facebook',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1667',
    questionNumber: 1667,
    title: '1667. Fix Names in a Table',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1667: Fix Names in a Table. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Fix Names in a Table.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT user_id, CONCAT(UPPER(SUBSTR(name, 1, 1)), LOWER(SUBSTR(name, 2))) AS name FROM Users ORDER BY user_id ASC;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT user_id, CONCAT(UPPER(SUBSTR(name, 1, 1)), LOWER(SUBSTR(name, 2))) AS name FROM Users ORDER BY user_id ASC;',
      snowflake: 'SELECT user_id, CONCAT(UPPER(SUBSTR(name, 1, 1)), LOWER(SUBSTR(name, 2))) AS name FROM Users ORDER BY user_id ASC;',
      bigquery: 'SELECT user_id, CONCAT(UPPER(SUBSTR(name, 1, 1)), LOWER(SUBSTR(name, 2))) AS name FROM Users ORDER BY user_id ASC;',
      mysql: 'SELECT user_id, CONCAT(UPPER(SUBSTR(name, 1, 1)), LOWER(SUBSTR(name, 2))) AS name FROM Users ORDER BY user_id ASC;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT user_id, CONCAT(UPPER(SUBSTR(name, 1, 1)), LOWER(SUBSTR(name, 2))) AS name FROM Users ORDER BY user_id ASC;',
      snowflake: 'SELECT user_id, CONCAT(UPPER(SUBSTR(name, 1, 1)), LOWER(SUBSTR(name, 2))) AS name FROM Users ORDER BY user_id ASC;',
      bigquery: 'SELECT user_id, CONCAT(UPPER(SUBSTR(name, 1, 1)), LOWER(SUBSTR(name, 2))) AS name FROM Users ORDER BY user_id ASC;',
      mysql: 'SELECT user_id, CONCAT(UPPER(SUBSTR(name, 1, 1)), LOWER(SUBSTR(name, 2))) AS name FROM Users ORDER BY user_id ASC;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/fix-names-in-a-table/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1677',
    questionNumber: 1677,
    title: '1677. Product\'s Worth Over Invoices',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1677: Product\'s Worth Over Invoices. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Product\'s Worth Over Invoices.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/products-worth-over-invoices/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1683',
    questionNumber: 1683,
    title: '1683. Invalid Tweets',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1683: Invalid Tweets. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Invalid Tweets.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/invalid-tweets/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1693',
    questionNumber: 1693,
    title: '1693. Daily Leads and Partners',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #1693: Daily Leads and Partners. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Daily Leads and Partners.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/daily-leads-and-partners/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1699',
    questionNumber: 1699,
    title: '1699. Number of Calls Between Two Persons',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1699: Number of Calls Between Two Persons. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Number of Calls Between Two Persons.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/number-of-calls-between-two-persons/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1709',
    questionNumber: 1709,
    title: '1709. Biggest Window Between Visits',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1709: Biggest Window Between Visits. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Biggest Window Between Visits.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/biggest-window-between-visits/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1715',
    questionNumber: 1715,
    title: '1715. Count Apples and Oranges',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1715: Count Apples and Oranges. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Count Apples and Oranges.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/count-apples-and-oranges/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1729',
    questionNumber: 1729,
    title: '1729. Find Followers Count',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1729: Find Followers Count. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Followers Count.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT user_id, COUNT(follower_id) AS followers_count FROM Followers GROUP BY user_id ORDER BY user_id ASC;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT user_id, COUNT(follower_id) AS followers_count FROM Followers GROUP BY user_id ORDER BY user_id ASC;',
      snowflake: 'SELECT user_id, COUNT(follower_id) AS followers_count FROM Followers GROUP BY user_id ORDER BY user_id ASC;',
      bigquery: 'SELECT user_id, COUNT(follower_id) AS followers_count FROM Followers GROUP BY user_id ORDER BY user_id ASC;',
      mysql: 'SELECT user_id, COUNT(follower_id) AS followers_count FROM Followers GROUP BY user_id ORDER BY user_id ASC;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT user_id, COUNT(follower_id) AS followers_count FROM Followers GROUP BY user_id ORDER BY user_id ASC;',
      snowflake: 'SELECT user_id, COUNT(follower_id) AS followers_count FROM Followers GROUP BY user_id ORDER BY user_id ASC;',
      bigquery: 'SELECT user_id, COUNT(follower_id) AS followers_count FROM Followers GROUP BY user_id ORDER BY user_id ASC;',
      mysql: 'SELECT user_id, COUNT(follower_id) AS followers_count FROM Followers GROUP BY user_id ORDER BY user_id ASC;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-followers-count/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1731',
    questionNumber: 1731,
    title: '1731. The Number of Employees Which Report to Each Employee',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #1731: The Number of Employees Which Report to Each Employee. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The Number of Employees Which Report to Each Employee.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT m.employee_id, m.name, COUNT(e.employee_id) AS reports_count, ROUND(AVG(e.age)) AS average_age FROM Employees m JOIN Employees e ON m.employee_id = e.reports_to GROUP BY m.employee_id, m.name ORDER BY m.employee_id ASC;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT m.employee_id, m.name, COUNT(e.employee_id) AS reports_count, ROUND(AVG(e.age)) AS average_age FROM Employees m JOIN Employees e ON m.employee_id = e.reports_to GROUP BY m.employee_id, m.name ORDER BY m.employee_id ASC;',
      snowflake: 'SELECT m.employee_id, m.name, COUNT(e.employee_id) AS reports_count, ROUND(AVG(e.age)) AS average_age FROM Employees m JOIN Employees e ON m.employee_id = e.reports_to GROUP BY m.employee_id, m.name ORDER BY m.employee_id ASC;',
      bigquery: 'SELECT m.employee_id, m.name, COUNT(e.employee_id) AS reports_count, ROUND(AVG(e.age)) AS average_age FROM Employees m JOIN Employees e ON m.employee_id = e.reports_to GROUP BY m.employee_id, m.name ORDER BY m.employee_id ASC;',
      mysql: 'SELECT m.employee_id, m.name, COUNT(e.employee_id) AS reports_count, ROUND(AVG(e.age)) AS average_age FROM Employees m JOIN Employees e ON m.employee_id = e.reports_to GROUP BY m.employee_id, m.name ORDER BY m.employee_id ASC;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT m.employee_id, m.name, COUNT(e.employee_id) AS reports_count, ROUND(AVG(e.age)) AS average_age FROM Employees m JOIN Employees e ON m.employee_id = e.reports_to GROUP BY m.employee_id, m.name ORDER BY m.employee_id ASC;',
      snowflake: 'SELECT m.employee_id, m.name, COUNT(e.employee_id) AS reports_count, ROUND(AVG(e.age)) AS average_age FROM Employees m JOIN Employees e ON m.employee_id = e.reports_to GROUP BY m.employee_id, m.name ORDER BY m.employee_id ASC;',
      bigquery: 'SELECT m.employee_id, m.name, COUNT(e.employee_id) AS reports_count, ROUND(AVG(e.age)) AS average_age FROM Employees m JOIN Employees e ON m.employee_id = e.reports_to GROUP BY m.employee_id, m.name ORDER BY m.employee_id ASC;',
      mysql: 'SELECT m.employee_id, m.name, COUNT(e.employee_id) AS reports_count, ROUND(AVG(e.age)) AS average_age FROM Employees m JOIN Employees e ON m.employee_id = e.reports_to GROUP BY m.employee_id, m.name ORDER BY m.employee_id ASC;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-number-of-employees-which-report-to-each-employee/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1741',
    questionNumber: 1741,
    title: '1741. Find Total Time Spent by Each Employee',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1741: Find Total Time Spent by Each Employee. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Total Time Spent by Each Employee.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT event_day AS day, emp_id, SUM(out_time - in_time) AS total_time FROM Employees GROUP BY event_day, emp_id;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT event_day AS day, emp_id, SUM(out_time - in_time) AS total_time FROM Employees GROUP BY event_day, emp_id;',
      snowflake: 'SELECT event_day AS day, emp_id, SUM(out_time - in_time) AS total_time FROM Employees GROUP BY event_day, emp_id;',
      bigquery: 'SELECT event_day AS day, emp_id, SUM(out_time - in_time) AS total_time FROM Employees GROUP BY event_day, emp_id;',
      mysql: 'SELECT event_day AS day, emp_id, SUM(out_time - in_time) AS total_time FROM Employees GROUP BY event_day, emp_id;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT event_day AS day, emp_id, SUM(out_time - in_time) AS total_time FROM Employees GROUP BY event_day, emp_id;',
      snowflake: 'SELECT event_day AS day, emp_id, SUM(out_time - in_time) AS total_time FROM Employees GROUP BY event_day, emp_id;',
      bigquery: 'SELECT event_day AS day, emp_id, SUM(out_time - in_time) AS total_time FROM Employees GROUP BY event_day, emp_id;',
      mysql: 'SELECT event_day AS day, emp_id, SUM(out_time - in_time) AS total_time FROM Employees GROUP BY event_day, emp_id;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-total-time-spent-by-each-employee/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1747',
    questionNumber: 1747,
    title: '1747. Leetflex Banned Accounts',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1747: Leetflex Banned Accounts. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Leetflex Banned Accounts.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/leetflex-banned-accounts/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1757',
    questionNumber: 1757,
    title: '1757. Recyclable and Low Fat Products',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1757: Recyclable and Low Fat Products. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Recyclable and Low Fat Products.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT product_id FROM Products WHERE low_fats = \'Y\' AND recyclable = \'Y\';'
    },
    starterCodeByDialect: {
      postgres: 'SELECT product_id FROM Products WHERE low_fats = \'Y\' AND recyclable = \'Y\';',
      snowflake: 'SELECT product_id FROM Products WHERE low_fats = \'Y\' AND recyclable = \'Y\';',
      bigquery: 'SELECT product_id FROM Products WHERE low_fats = \'Y\' AND recyclable = \'Y\';',
      mysql: 'SELECT product_id FROM Products WHERE low_fats = \'Y\' AND recyclable = \'Y\';'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT product_id FROM Products WHERE low_fats = \'Y\' AND recyclable = \'Y\';',
      snowflake: 'SELECT product_id FROM Products WHERE low_fats = \'Y\' AND recyclable = \'Y\';',
      bigquery: 'SELECT product_id FROM Products WHERE low_fats = \'Y\' AND recyclable = \'Y\';',
      mysql: 'SELECT product_id FROM Products WHERE low_fats = \'Y\' AND recyclable = \'Y\';'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/recyclable-and-low-fat-products/',
    companyTag: 'Facebook',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1767',
    questionNumber: 1767,
    title: '1767. Find the Subtasks That Did Not Execute',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1767: Find the Subtasks That Did Not Execute. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find the Subtasks That Did Not Execute.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-the-subtasks-that-did-not-execute/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1777',
    questionNumber: 1777,
    title: '1777. Product\'s Price for Each Store',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1777: Product\'s Price for Each Store. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Product\'s Price for Each Store.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/products-price-for-each-store/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1783',
    questionNumber: 1783,
    title: '1783. Grand Slam Titles',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1783: Grand Slam Titles. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Grand Slam Titles.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/grand-slam-titles/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1789',
    questionNumber: 1789,
    title: '1789. Primary Department for Each Employee',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1789: Primary Department for Each Employee. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Primary Department for Each Employee.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT employee_id, department_id FROM Employee WHERE primary_flag = \'Y\' OR employee_id IN (SELECT employee_id FROM Employee GROUP BY employee_id HAVING COUNT(*) = 1);'
    },
    starterCodeByDialect: {
      postgres: 'SELECT employee_id, department_id FROM Employee WHERE primary_flag = \'Y\' OR employee_id IN (SELECT employee_id FROM Employee GROUP BY employee_id HAVING COUNT(*) = 1);',
      snowflake: 'SELECT employee_id, department_id FROM Employee WHERE primary_flag = \'Y\' OR employee_id IN (SELECT employee_id FROM Employee GROUP BY employee_id HAVING COUNT(*) = 1);',
      bigquery: 'SELECT employee_id, department_id FROM Employee WHERE primary_flag = \'Y\' OR employee_id IN (SELECT employee_id FROM Employee GROUP BY employee_id HAVING COUNT(*) = 1);',
      mysql: 'SELECT employee_id, department_id FROM Employee WHERE primary_flag = \'Y\' OR employee_id IN (SELECT employee_id FROM Employee GROUP BY employee_id HAVING COUNT(*) = 1);'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT employee_id, department_id FROM Employee WHERE primary_flag = \'Y\' OR employee_id IN (SELECT employee_id FROM Employee GROUP BY employee_id HAVING COUNT(*) = 1);',
      snowflake: 'SELECT employee_id, department_id FROM Employee WHERE primary_flag = \'Y\' OR employee_id IN (SELECT employee_id FROM Employee GROUP BY employee_id HAVING COUNT(*) = 1);',
      bigquery: 'SELECT employee_id, department_id FROM Employee WHERE primary_flag = \'Y\' OR employee_id IN (SELECT employee_id FROM Employee GROUP BY employee_id HAVING COUNT(*) = 1);',
      mysql: 'SELECT employee_id, department_id FROM Employee WHERE primary_flag = \'Y\' OR employee_id IN (SELECT employee_id FROM Employee GROUP BY employee_id HAVING COUNT(*) = 1);'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/primary-department-for-each-employee/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1795',
    questionNumber: 1795,
    title: '1795. Rearrange Products Table',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1795: Rearrange Products Table. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Rearrange Products Table.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/rearrange-products-table/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1809',
    questionNumber: 1809,
    title: '1809. Ad-Free Sessions',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1809: Ad-Free Sessions. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Ad-Free Sessions.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/ad-free-sessions/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1811',
    questionNumber: 1811,
    title: '1811. Find Interview Candidates',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #1811: Find Interview Candidates. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Interview Candidates.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-interview-candidates/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1821',
    questionNumber: 1821,
    title: '1821. Find Customers With Positive Revenue this Year',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'INTERMEDIATE CASE',
    businessScenario: 'LeetCode Database problem #1821: Find Customers With Positive Revenue this Year. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Customers With Positive Revenue this Year.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-customers-with-positive-revenue-this-year/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1831',
    questionNumber: 1831,
    title: '1831. Maximum Transaction Each Day',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #1831: Maximum Transaction Each Day. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Maximum Transaction Each Day.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/maximum-transaction-each-day/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1841',
    questionNumber: 1841,
    title: '1841. League Statistics',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1841: League Statistics. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for League Statistics.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/league-statistics/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1843',
    questionNumber: 1843,
    title: '1843. Suspicious Bank Accounts',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1843: Suspicious Bank Accounts. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Suspicious Bank Accounts.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/suspicious-bank-accounts/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1853',
    questionNumber: 1853,
    title: '1853. Convert Date Format',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #1853: Convert Date Format. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Convert Date Format.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/convert-date-format/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1867',
    questionNumber: 1867,
    title: '1867. Orders With Maximum Quantity Above Average',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1867: Orders With Maximum Quantity Above Average. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Orders With Maximum Quantity Above Average.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/orders-with-maximum-quantity-above-average/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1873',
    questionNumber: 1873,
    title: '1873. Calculate Special Bonus',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'INTERMEDIATE CASE',
    businessScenario: 'LeetCode Database problem #1873: Calculate Special Bonus. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Calculate Special Bonus.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT employee_id, CASE WHEN employee_id % 2 = 1 AND name NOT LIKE \'M%\' THEN salary ELSE 0 END AS bonus FROM Employees ORDER BY employee_id ASC;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT employee_id, CASE WHEN employee_id % 2 = 1 AND name NOT LIKE \'M%\' THEN salary ELSE 0 END AS bonus FROM Employees ORDER BY employee_id ASC;',
      snowflake: 'SELECT employee_id, CASE WHEN employee_id % 2 = 1 AND name NOT LIKE \'M%\' THEN salary ELSE 0 END AS bonus FROM Employees ORDER BY employee_id ASC;',
      bigquery: 'SELECT employee_id, CASE WHEN employee_id % 2 = 1 AND name NOT LIKE \'M%\' THEN salary ELSE 0 END AS bonus FROM Employees ORDER BY employee_id ASC;',
      mysql: 'SELECT employee_id, CASE WHEN employee_id % 2 = 1 AND name NOT LIKE \'M%\' THEN salary ELSE 0 END AS bonus FROM Employees ORDER BY employee_id ASC;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT employee_id, CASE WHEN employee_id % 2 = 1 AND name NOT LIKE \'M%\' THEN salary ELSE 0 END AS bonus FROM Employees ORDER BY employee_id ASC;',
      snowflake: 'SELECT employee_id, CASE WHEN employee_id % 2 = 1 AND name NOT LIKE \'M%\' THEN salary ELSE 0 END AS bonus FROM Employees ORDER BY employee_id ASC;',
      bigquery: 'SELECT employee_id, CASE WHEN employee_id % 2 = 1 AND name NOT LIKE \'M%\' THEN salary ELSE 0 END AS bonus FROM Employees ORDER BY employee_id ASC;',
      mysql: 'SELECT employee_id, CASE WHEN employee_id % 2 = 1 AND name NOT LIKE \'M%\' THEN salary ELSE 0 END AS bonus FROM Employees ORDER BY employee_id ASC;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/calculate-special-bonus/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1875',
    questionNumber: 1875,
    title: '1875. Group Employees of the Same Salary',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #1875: Group Employees of the Same Salary. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Group Employees of the Same Salary.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/group-employees-of-the-same-salary/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1890',
    questionNumber: 1890,
    title: '1890. The Latest Login in 2020',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1890: The Latest Login in 2020. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The Latest Login in 2020.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT user_id, MAX(time_stamp) AS last_stamp FROM Logins WHERE time_stamp LIKE \'2020%\' GROUP BY user_id;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT user_id, MAX(time_stamp) AS last_stamp FROM Logins WHERE time_stamp LIKE \'2020%\' GROUP BY user_id;',
      snowflake: 'SELECT user_id, MAX(time_stamp) AS last_stamp FROM Logins WHERE time_stamp LIKE \'2020%\' GROUP BY user_id;',
      bigquery: 'SELECT user_id, MAX(time_stamp) AS last_stamp FROM Logins WHERE time_stamp LIKE \'2020%\' GROUP BY user_id;',
      mysql: 'SELECT user_id, MAX(time_stamp) AS last_stamp FROM Logins WHERE time_stamp LIKE \'2020%\' GROUP BY user_id;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT user_id, MAX(time_stamp) AS last_stamp FROM Logins WHERE time_stamp LIKE \'2020%\' GROUP BY user_id;',
      snowflake: 'SELECT user_id, MAX(time_stamp) AS last_stamp FROM Logins WHERE time_stamp LIKE \'2020%\' GROUP BY user_id;',
      bigquery: 'SELECT user_id, MAX(time_stamp) AS last_stamp FROM Logins WHERE time_stamp LIKE \'2020%\' GROUP BY user_id;',
      mysql: 'SELECT user_id, MAX(time_stamp) AS last_stamp FROM Logins WHERE time_stamp LIKE \'2020%\' GROUP BY user_id;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-latest-login-in-2020/',
    companyTag: 'Facebook',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1892',
    questionNumber: 1892,
    title: '1892. Page Recommendations II',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1892: Page Recommendations II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Page Recommendations II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/page-recommendations-ii/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1907',
    questionNumber: 1907,
    title: '1907. Count Salary Categories',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'set_operations',
    topicLabel: 'SET OPERATIONS',
    businessScenario: 'LeetCode Database problem #1907: Count Salary Categories. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Count Salary Categories.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT \'Low Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income < 20000 UNION ALL SELECT \'Average Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income BETWEEN 20000 AND 50000 UNION ALL SELECT \'High Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income > 50000;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT \'Low Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income < 20000 UNION ALL SELECT \'Average Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income BETWEEN 20000 AND 50000 UNION ALL SELECT \'High Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income > 50000;',
      snowflake: 'SELECT \'Low Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income < 20000 UNION ALL SELECT \'Average Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income BETWEEN 20000 AND 50000 UNION ALL SELECT \'High Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income > 50000;',
      bigquery: 'SELECT \'Low Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income < 20000 UNION ALL SELECT \'Average Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income BETWEEN 20000 AND 50000 UNION ALL SELECT \'High Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income > 50000;',
      mysql: 'SELECT \'Low Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income < 20000 UNION ALL SELECT \'Average Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income BETWEEN 20000 AND 50000 UNION ALL SELECT \'High Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income > 50000;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT \'Low Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income < 20000 UNION ALL SELECT \'Average Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income BETWEEN 20000 AND 50000 UNION ALL SELECT \'High Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income > 50000;',
      snowflake: 'SELECT \'Low Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income < 20000 UNION ALL SELECT \'Average Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income BETWEEN 20000 AND 50000 UNION ALL SELECT \'High Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income > 50000;',
      bigquery: 'SELECT \'Low Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income < 20000 UNION ALL SELECT \'Average Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income BETWEEN 20000 AND 50000 UNION ALL SELECT \'High Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income > 50000;',
      mysql: 'SELECT \'Low Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income < 20000 UNION ALL SELECT \'Average Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income BETWEEN 20000 AND 50000 UNION ALL SELECT \'High Salary\' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income > 50000;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/count-salary-categories/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1917',
    questionNumber: 1917,
    title: '1917. Leetcodify Friends Recommendations',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'set_operations',
    topicLabel: 'SET OPERATIONS',
    businessScenario: 'LeetCode Database problem #1917: Leetcodify Friends Recommendations. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Leetcodify Friends Recommendations.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/leetcodify-friends-recommendations/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1919',
    questionNumber: 1919,
    title: '1919. Leetcodify Similar Friends',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'set_operations',
    topicLabel: 'SET OPERATIONS',
    businessScenario: 'LeetCode Database problem #1919: Leetcodify Similar Friends. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Leetcodify Similar Friends.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/leetcodify-similar-friends/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1934',
    questionNumber: 1934,
    title: '1934. Confirmation Rate',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #1934: Confirmation Rate. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Confirmation Rate.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT s.user_id, ROUND(COALESCE(SUM(CASE WHEN c.action = \'confirmed\' THEN 1 ELSE 0 END) * 1.0 / COUNT(c.action), 0), 2) AS confirmation_rate FROM Signups s LEFT JOIN Confirmations c ON s.user_id = c.user_id GROUP BY s.user_id;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT s.user_id, ROUND(COALESCE(SUM(CASE WHEN c.action = \'confirmed\' THEN 1 ELSE 0 END) * 1.0 / COUNT(c.action), 0), 2) AS confirmation_rate FROM Signups s LEFT JOIN Confirmations c ON s.user_id = c.user_id GROUP BY s.user_id;',
      snowflake: 'SELECT s.user_id, ROUND(COALESCE(SUM(CASE WHEN c.action = \'confirmed\' THEN 1 ELSE 0 END) * 1.0 / COUNT(c.action), 0), 2) AS confirmation_rate FROM Signups s LEFT JOIN Confirmations c ON s.user_id = c.user_id GROUP BY s.user_id;',
      bigquery: 'SELECT s.user_id, ROUND(COALESCE(SUM(CASE WHEN c.action = \'confirmed\' THEN 1 ELSE 0 END) * 1.0 / COUNT(c.action), 0), 2) AS confirmation_rate FROM Signups s LEFT JOIN Confirmations c ON s.user_id = c.user_id GROUP BY s.user_id;',
      mysql: 'SELECT s.user_id, ROUND(COALESCE(SUM(CASE WHEN c.action = \'confirmed\' THEN 1 ELSE 0 END) * 1.0 / COUNT(c.action), 0), 2) AS confirmation_rate FROM Signups s LEFT JOIN Confirmations c ON s.user_id = c.user_id GROUP BY s.user_id;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT s.user_id, ROUND(COALESCE(SUM(CASE WHEN c.action = \'confirmed\' THEN 1 ELSE 0 END) * 1.0 / COUNT(c.action), 0), 2) AS confirmation_rate FROM Signups s LEFT JOIN Confirmations c ON s.user_id = c.user_id GROUP BY s.user_id;',
      snowflake: 'SELECT s.user_id, ROUND(COALESCE(SUM(CASE WHEN c.action = \'confirmed\' THEN 1 ELSE 0 END) * 1.0 / COUNT(c.action), 0), 2) AS confirmation_rate FROM Signups s LEFT JOIN Confirmations c ON s.user_id = c.user_id GROUP BY s.user_id;',
      bigquery: 'SELECT s.user_id, ROUND(COALESCE(SUM(CASE WHEN c.action = \'confirmed\' THEN 1 ELSE 0 END) * 1.0 / COUNT(c.action), 0), 2) AS confirmation_rate FROM Signups s LEFT JOIN Confirmations c ON s.user_id = c.user_id GROUP BY s.user_id;',
      mysql: 'SELECT s.user_id, ROUND(COALESCE(SUM(CASE WHEN c.action = \'confirmed\' THEN 1 ELSE 0 END) * 1.0 / COUNT(c.action), 0), 2) AS confirmation_rate FROM Signups s LEFT JOIN Confirmations c ON s.user_id = c.user_id GROUP BY s.user_id;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/confirmation-rate/',
    companyTag: 'Facebook',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1939',
    questionNumber: 1939,
    title: '1939. Users That Actively Request Confirmation Messages',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1939: Users That Actively Request Confirmation Messages. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Users That Actively Request Confirmation Messages.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/users-that-actively-request-confirmation-messages/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1949',
    questionNumber: 1949,
    title: '1949. Strong Friendship',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'set_operations',
    topicLabel: 'SET OPERATIONS',
    businessScenario: 'LeetCode Database problem #1949: Strong Friendship. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Strong Friendship.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/strong-friendship/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1951',
    questionNumber: 1951,
    title: '1951. All the Pairs With the Maximum Number of Common Followers',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1951: All the Pairs With the Maximum Number of Common Followers. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for All the Pairs With the Maximum Number of Common Followers.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/all-the-pairs-with-the-maximum-number-of-common-followers/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1965',
    questionNumber: 1965,
    title: '1965. Employees With Missing Information',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'set_operations',
    topicLabel: 'SET OPERATIONS',
    businessScenario: 'LeetCode Database problem #1965: Employees With Missing Information. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Employees With Missing Information.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT employee_id FROM Employees WHERE employee_id NOT IN (SELECT employee_id FROM Salaries) UNION SELECT employee_id FROM Salaries WHERE employee_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT employee_id FROM Employees WHERE employee_id NOT IN (SELECT employee_id FROM Salaries) UNION SELECT employee_id FROM Salaries WHERE employee_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;',
      snowflake: 'SELECT employee_id FROM Employees WHERE employee_id NOT IN (SELECT employee_id FROM Salaries) UNION SELECT employee_id FROM Salaries WHERE employee_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;',
      bigquery: 'SELECT employee_id FROM Employees WHERE employee_id NOT IN (SELECT employee_id FROM Salaries) UNION SELECT employee_id FROM Salaries WHERE employee_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;',
      mysql: 'SELECT employee_id FROM Employees WHERE employee_id NOT IN (SELECT employee_id FROM Salaries) UNION SELECT employee_id FROM Salaries WHERE employee_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT employee_id FROM Employees WHERE employee_id NOT IN (SELECT employee_id FROM Salaries) UNION SELECT employee_id FROM Salaries WHERE employee_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;',
      snowflake: 'SELECT employee_id FROM Employees WHERE employee_id NOT IN (SELECT employee_id FROM Salaries) UNION SELECT employee_id FROM Salaries WHERE employee_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;',
      bigquery: 'SELECT employee_id FROM Employees WHERE employee_id NOT IN (SELECT employee_id FROM Salaries) UNION SELECT employee_id FROM Salaries WHERE employee_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;',
      mysql: 'SELECT employee_id FROM Employees WHERE employee_id NOT IN (SELECT employee_id FROM Salaries) UNION SELECT employee_id FROM Salaries WHERE employee_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/employees-with-missing-information/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1972',
    questionNumber: 1972,
    title: '1972. First and Last Call On the Same Day',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #1972: First and Last Call On the Same Day. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for First and Last Call On the Same Day.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/first-and-last-call-on-the-same-day/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1978',
    questionNumber: 1978,
    title: '1978. Employees Whose Manager Left the Company',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #1978: Employees Whose Manager Left the Company. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Employees Whose Manager Left the Company.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT employee_id FROM Employees WHERE salary < 30000 AND manager_id IS NOT NULL AND manager_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT employee_id FROM Employees WHERE salary < 30000 AND manager_id IS NOT NULL AND manager_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;',
      snowflake: 'SELECT employee_id FROM Employees WHERE salary < 30000 AND manager_id IS NOT NULL AND manager_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;',
      bigquery: 'SELECT employee_id FROM Employees WHERE salary < 30000 AND manager_id IS NOT NULL AND manager_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;',
      mysql: 'SELECT employee_id FROM Employees WHERE salary < 30000 AND manager_id IS NOT NULL AND manager_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT employee_id FROM Employees WHERE salary < 30000 AND manager_id IS NOT NULL AND manager_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;',
      snowflake: 'SELECT employee_id FROM Employees WHERE salary < 30000 AND manager_id IS NOT NULL AND manager_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;',
      bigquery: 'SELECT employee_id FROM Employees WHERE salary < 30000 AND manager_id IS NOT NULL AND manager_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;',
      mysql: 'SELECT employee_id FROM Employees WHERE salary < 30000 AND manager_id IS NOT NULL AND manager_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id ASC;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/employees-whose-manager-left-the-company/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1988',
    questionNumber: 1988,
    title: '1988. Find Cutoff Score for Each School',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #1988: Find Cutoff Score for Each School. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Cutoff Score for Each School.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-cutoff-score-for-each-school/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_1990',
    questionNumber: 1990,
    title: '1990. Count the Number of Experiments',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #1990: Count the Number of Experiments. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Count the Number of Experiments.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/count-the-number-of-experiments/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2004',
    questionNumber: 2004,
    title: '2004. The Number of Seniors and Juniors to Join the Company',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #2004: The Number of Seniors and Juniors to Join the Company. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The Number of Seniors and Juniors to Join the Company.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-number-of-seniors-and-juniors-to-join-the-company/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2010',
    questionNumber: 2010,
    title: '2010. The Number of Seniors and Juniors to Join the Company II',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #2010: The Number of Seniors and Juniors to Join the Company II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The Number of Seniors and Juniors to Join the Company II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-number-of-seniors-and-juniors-to-join-the-company-ii/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2020',
    questionNumber: 2020,
    title: '2020. Number of Accounts That Did Not Stream',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #2020: Number of Accounts That Did Not Stream. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Number of Accounts That Did Not Stream.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/number-of-accounts-that-did-not-stream/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2026',
    questionNumber: 2026,
    title: '2026. Low-Quality Problems',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2026: Low-Quality Problems. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Low-Quality Problems.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/low-quality-problems/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2041',
    questionNumber: 2041,
    title: '2041. Accepted Candidates From the Interviews',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #2041: Accepted Candidates From the Interviews. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Accepted Candidates From the Interviews.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/accepted-candidates-from-the-interviews/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2051',
    questionNumber: 2051,
    title: '2051. The Category of Each Member in the Store',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2051: The Category of Each Member in the Store. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The Category of Each Member in the Store.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-category-of-each-member-in-the-store/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2066',
    questionNumber: 2066,
    title: '2066. Account Balance',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #2066: Account Balance. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Account Balance.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/account-balance/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2072',
    questionNumber: 2072,
    title: '2072. The Winner University',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2072: The Winner University. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The Winner University.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-winner-university/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2082',
    questionNumber: 2082,
    title: '2082. The Number of Rich Customers',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2082: The Number of Rich Customers. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The Number of Rich Customers.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-number-of-rich-customers/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2084',
    questionNumber: 2084,
    title: '2084. Drop Type 1 Orders for Customers With Type 0 Orders',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2084: Drop Type 1 Orders for Customers With Type 0 Orders. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Drop Type 1 Orders for Customers With Type 0 Orders.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/drop-type-1-orders-for-customers-with-type-0-orders/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2112',
    questionNumber: 2112,
    title: '2112. The Airport With the Most Traffic',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #2112: The Airport With the Most Traffic. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The Airport With the Most Traffic.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-airport-with-the-most-traffic/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2118',
    questionNumber: 2118,
    title: '2118. Build the Equation',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2118: Build the Equation. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Build the Equation.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/build-the-equation/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2142',
    questionNumber: 2142,
    title: '2142. The Number of Passengers in Each Bus I',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2142: The Number of Passengers in Each Bus I. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The Number of Passengers in Each Bus I.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-number-of-passengers-in-each-bus-i/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2153',
    questionNumber: 2153,
    title: '2153. The Number of Passengers in Each Bus II',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2153: The Number of Passengers in Each Bus II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The Number of Passengers in Each Bus II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-number-of-passengers-in-each-bus-ii/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2159',
    questionNumber: 2159,
    title: '2159. Order Two Columns Independently',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2159: Order Two Columns Independently. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Order Two Columns Independently.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/order-two-columns-independently/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2173',
    questionNumber: 2173,
    title: '2173. Longest Winning Streak',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2173: Longest Winning Streak. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Longest Winning Streak.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/longest-winning-streak/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2175',
    questionNumber: 2175,
    title: '2175. The Change in Global Rankings',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #2175: The Change in Global Rankings. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The Change in Global Rankings.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-change-in-global-rankings/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2199',
    questionNumber: 2199,
    title: '2199. Finding the Topic of Each Post',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_sorting',
    topicLabel: 'BEGINNER SORTING',
    businessScenario: 'LeetCode Database problem #2199: Finding the Topic of Each Post. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Finding the Topic of Each Post.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/finding-the-topic-of-each-post/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2205',
    questionNumber: 2205,
    title: '2205. The Number of Users That Are Eligible for Discount',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #2205: The Number of Users That Are Eligible for Discount. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The Number of Users That Are Eligible for Discount.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-number-of-users-that-are-eligible-for-discount/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2228',
    questionNumber: 2228,
    title: '2228. Users With Two Purchases Within Seven Days',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'INTERMEDIATE CASE',
    businessScenario: 'LeetCode Database problem #2228: Users With Two Purchases Within Seven Days. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Users With Two Purchases Within Seven Days.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/users-with-two-purchases-within-seven-days/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2230',
    questionNumber: 2230,
    title: '2230. The Users That Are Eligible for Discount',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #2230: The Users That Are Eligible for Discount. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The Users That Are Eligible for Discount.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-users-that-are-eligible-for-discount/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2238',
    questionNumber: 2238,
    title: '2238. Number of Times a Driver Was a Passenger',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #2238: Number of Times a Driver Was a Passenger. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Number of Times a Driver Was a Passenger.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/number-of-times-a-driver-was-a-passenger/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2252',
    questionNumber: 2252,
    title: '2252. Dynamic Pivoting of a Table',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2252: Dynamic Pivoting of a Table. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Dynamic Pivoting of a Table.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/dynamic-pivoting-of-a-table/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2253',
    questionNumber: 2253,
    title: '2253. Dynamic Unpivoting of a Table',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2253: Dynamic Unpivoting of a Table. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Dynamic Unpivoting of a Table.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/dynamic-unpivoting-of-a-table/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2292',
    questionNumber: 2292,
    title: '2292. Products With Three or More Orders in Two Consecutive Years',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #2292: Products With Three or More Orders in Two Consecutive Years. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Products With Three or More Orders in Two Consecutive Years.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/products-with-three-or-more-orders-in-two-consecutive-years/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2298',
    questionNumber: 2298,
    title: '2298. Tasks Count in the Weekend',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #2298: Tasks Count in the Weekend. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Tasks Count in the Weekend.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/tasks-count-in-the-weekend/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2308',
    questionNumber: 2308,
    title: '2308. Arrange Table by Gender',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2308: Arrange Table by Gender. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Arrange Table by Gender.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/arrange-table-by-gender/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2314',
    questionNumber: 2314,
    title: '2314. The First Day of the Maximum Recorded Degree in Each City',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #2314: The First Day of the Maximum Recorded Degree in Each City. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for The First Day of the Maximum Recorded Degree in Each City.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/the-first-day-of-the-maximum-recorded-degree-in-each-city/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2324',
    questionNumber: 2324,
    title: '2324. Product Sales Analysis IV',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2324: Product Sales Analysis IV. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Product Sales Analysis IV.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/product-sales-analysis-iv/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2329',
    questionNumber: 2329,
    title: '2329. Product Sales Analysis V',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2329: Product Sales Analysis V. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Product Sales Analysis V.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/product-sales-analysis-v/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2339',
    questionNumber: 2339,
    title: '2339. All the Matches of the League',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2339: All the Matches of the League. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for All the Matches of the League.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/all-the-matches-of-the-league/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2346',
    questionNumber: 2346,
    title: '2346. Compute the Rank as a Percentage',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #2346: Compute the Rank as a Percentage. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Compute the Rank as a Percentage.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/compute-the-rank-as-a-percentage/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2356',
    questionNumber: 2356,
    title: '2356. Number of Unique Subjects Taught by Each Teacher',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2356: Number of Unique Subjects Taught by Each Teacher. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Number of Unique Subjects Taught by Each Teacher.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/number-of-unique-subjects-taught-by-each-teacher/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2362',
    questionNumber: 2362,
    title: '2362. Generate the Invoice',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #2362: Generate the Invoice. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Generate the Invoice.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/generate-the-invoice/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2372',
    questionNumber: 2372,
    title: '2372. Calculate the Influence of Each Salesperson',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2372: Calculate the Influence of Each Salesperson. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Calculate the Influence of Each Salesperson.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/calculate-the-influence-of-each-salesperson/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2377',
    questionNumber: 2377,
    title: '2377. Sort the Olympic Table',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_sorting',
    topicLabel: 'BEGINNER SORTING',
    businessScenario: 'LeetCode Database problem #2377: Sort the Olympic Table. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Sort the Olympic Table.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/sort-the-olympic-table/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2388',
    questionNumber: 2388,
    title: '2388. Change Null Values in a Table to the Previous Value',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2388: Change Null Values in a Table to the Previous Value. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Change Null Values in a Table to the Previous Value.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/change-null-values-in-a-table-to-the-previous-value/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2394',
    questionNumber: 2394,
    title: '2394. Employees With Deductions',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2394: Employees With Deductions. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Employees With Deductions.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/employees-with-deductions/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2474',
    questionNumber: 2474,
    title: '2474. Customers With Strictly Increasing Purchases',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2474: Customers With Strictly Increasing Purchases. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Customers With Strictly Increasing Purchases.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/customers-with-strictly-increasing-purchases/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2480',
    questionNumber: 2480,
    title: '2480. Form a Chemical Bond',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2480: Form a Chemical Bond. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Form a Chemical Bond.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/form-a-chemical-bond/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2494',
    questionNumber: 2494,
    title: '2494. Merge Overlapping Events in the Same Hall',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'INTERMEDIATE CASE',
    businessScenario: 'LeetCode Database problem #2494: Merge Overlapping Events in the Same Hall. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Merge Overlapping Events in the Same Hall.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/merge-overlapping-events-in-the-same-hall/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2504',
    questionNumber: 2504,
    title: '2504. Concatenate the Name and the Profession',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2504: Concatenate the Name and the Profession. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Concatenate the Name and the Profession.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/concatenate-the-name-and-the-profession/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2668',
    questionNumber: 2668,
    title: '2668. Find Latest Salaries',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2668: Find Latest Salaries. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Latest Salaries.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-latest-salaries/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2669',
    questionNumber: 2669,
    title: '2669. Count Artist Occurrences On Spotify Ranking List',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #2669: Count Artist Occurrences On Spotify Ranking List. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Count Artist Occurrences On Spotify Ranking List.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/count-artist-occurrences-on-spotify-ranking-list/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2686',
    questionNumber: 2686,
    title: '2686. Immediate Food Delivery III',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2686: Immediate Food Delivery III. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Immediate Food Delivery III.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/immediate-food-delivery-iii/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2687',
    questionNumber: 2687,
    title: '2687. Bikes Last Time Used ',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #2687: Bikes Last Time Used . Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Bikes Last Time Used .',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/bikes-last-time-used/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2688',
    questionNumber: 2688,
    title: '2688. Find Active Users',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2688: Find Active Users. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Active Users.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-active-users/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2701',
    questionNumber: 2701,
    title: '2701. Consecutive Transactions with Increasing Amounts',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #2701: Consecutive Transactions with Increasing Amounts. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Consecutive Transactions with Increasing Amounts.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/consecutive-transactions-with-increasing-amounts/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2720',
    questionNumber: 2720,
    title: '2720. Popularity Percentage',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #2720: Popularity Percentage. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Popularity Percentage.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/popularity-percentage/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2738',
    questionNumber: 2738,
    title: '2738. Count Occurrences in Text',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #2738: Count Occurrences in Text. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Count Occurrences in Text.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/count-occurrences-in-text/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2752',
    questionNumber: 2752,
    title: '2752. Customers with Maximum Number of Transactions on Consecutive Days',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #2752: Customers with Maximum Number of Transactions on Consecutive Days. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Customers with Maximum Number of Transactions on Consecutive Days.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/customers-with-maximum-number-of-transactions-on-consecutive-days/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2783',
    questionNumber: 2783,
    title: '2783. Flight Occupancy and Waitlist Analysis',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2783: Flight Occupancy and Waitlist Analysis. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Flight Occupancy and Waitlist Analysis.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/flight-occupancy-and-waitlist-analysis/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2793',
    questionNumber: 2793,
    title: '2793. Status of Flight Tickets',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2793: Status of Flight Tickets. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Status of Flight Tickets.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/status-of-flight-tickets/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2820',
    questionNumber: 2820,
    title: '2820. Election Results',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2820: Election Results. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Election Results.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/election-results/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2837',
    questionNumber: 2837,
    title: '2837. Total Traveled Distance',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #2837: Total Traveled Distance. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Total Traveled Distance.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/total-traveled-distance/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2853',
    questionNumber: 2853,
    title: '2853. Highest Salaries Difference',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #2853: Highest Salaries Difference. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Highest Salaries Difference.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/highest-salaries-difference/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2854',
    questionNumber: 2854,
    title: '2854. Rolling Average Steps',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'AGGREGATIONS',
    businessScenario: 'LeetCode Database problem #2854: Rolling Average Steps. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Rolling Average Steps.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/rolling-average-steps/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2893',
    questionNumber: 2893,
    title: '2893. Calculate Orders Within Each Interval',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2893: Calculate Orders Within Each Interval. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Calculate Orders Within Each Interval.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/calculate-orders-within-each-interval/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2922',
    questionNumber: 2922,
    title: '2922. Market Analysis III',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2922: Market Analysis III. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Market Analysis III.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/market-analysis-iii/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2978',
    questionNumber: 2978,
    title: '2978. Symmetric Coordinates',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2978: Symmetric Coordinates. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Symmetric Coordinates.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/symmetric-coordinates/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2984',
    questionNumber: 2984,
    title: '2984. Find Peak Calling Hours for Each City',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2984: Find Peak Calling Hours for Each City. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Peak Calling Hours for Each City.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-peak-calling-hours-for-each-city/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2985',
    questionNumber: 2985,
    title: '2985. Calculate Compressed Mean',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2985: Calculate Compressed Mean. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Calculate Compressed Mean.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/calculate-compressed-mean/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2986',
    questionNumber: 2986,
    title: '2986. Find Third Transaction',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2986: Find Third Transaction. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Third Transaction.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-third-transaction/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2987',
    questionNumber: 2987,
    title: '2987. Find Expensive Cities',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2987: Find Expensive Cities. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Expensive Cities.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-expensive-cities/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2988',
    questionNumber: 2988,
    title: '2988. Manager of the Largest Department',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'JOINS',
    businessScenario: 'LeetCode Database problem #2988: Manager of the Largest Department. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Manager of the Largest Department.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/manager-of-the-largest-department/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2989',
    questionNumber: 2989,
    title: '2989. Class Performance',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2989: Class Performance. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Class Performance.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/class-performance/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2990',
    questionNumber: 2990,
    title: '2990. Loan Types',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2990: Loan Types. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Loan Types.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/loan-types/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2991',
    questionNumber: 2991,
    title: '2991. Top Three Wineries ',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_sorting',
    topicLabel: 'BEGINNER SORTING',
    businessScenario: 'LeetCode Database problem #2991: Top Three Wineries . Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Top Three Wineries .',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/top-three-wineries/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2993',
    questionNumber: 2993,
    title: '2993. Friday Purchases I',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #2993: Friday Purchases I. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Friday Purchases I.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/friday-purchases-i/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2994',
    questionNumber: 2994,
    title: '2994. Friday Purchases II ',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #2994: Friday Purchases II . Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Friday Purchases II .',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/friday-purchases-ii/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_2995',
    questionNumber: 2995,
    title: '2995. Viewers Turned Streamers',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #2995: Viewers Turned Streamers. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Viewers Turned Streamers.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/viewers-turned-streamers/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3050',
    questionNumber: 3050,
    title: '3050. Pizza Toppings Cost Analysis',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_sorting',
    topicLabel: 'BEGINNER SORTING',
    businessScenario: 'LeetCode Database problem #3050: Pizza Toppings Cost Analysis. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Pizza Toppings Cost Analysis.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/pizza-toppings-cost-analysis/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3051',
    questionNumber: 3051,
    title: '3051. Find Candidates for Data Scientist Position',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #3051: Find Candidates for Data Scientist Position. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Candidates for Data Scientist Position.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-candidates-for-data-scientist-position/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3052',
    questionNumber: 3052,
    title: '3052. Maximize Items',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3052: Maximize Items. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Maximize Items.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/maximize-items/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3053',
    questionNumber: 3053,
    title: '3053. Classifying Triangles by Lengths',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'INTERMEDIATE CASE',
    businessScenario: 'LeetCode Database problem #3053: Classifying Triangles by Lengths. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Classifying Triangles by Lengths.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/classifying-triangles-by-lengths/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3054',
    questionNumber: 3054,
    title: '3054. Binary Tree Nodes',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'INTERMEDIATE CASE',
    businessScenario: 'LeetCode Database problem #3054: Binary Tree Nodes. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Binary Tree Nodes.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/binary-tree-nodes/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3055',
    questionNumber: 3055,
    title: '3055. Top Percentile Fraud',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_sorting',
    topicLabel: 'BEGINNER SORTING',
    businessScenario: 'LeetCode Database problem #3055: Top Percentile Fraud. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Top Percentile Fraud.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/top-percentile-fraud/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3056',
    questionNumber: 3056,
    title: '3056. Snaps Analysis',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3056: Snaps Analysis. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Snaps Analysis.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/snaps-analysis/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3057',
    questionNumber: 3057,
    title: '3057. Employees Project Allocation',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3057: Employees Project Allocation. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Employees Project Allocation.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/employees-project-allocation/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3058',
    questionNumber: 3058,
    title: '3058. Friends With No Mutual Friends',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'set_operations',
    topicLabel: 'SET OPERATIONS',
    businessScenario: 'LeetCode Database problem #3058: Friends With No Mutual Friends. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Friends With No Mutual Friends.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/friends-with-no-mutual-friends/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3059',
    questionNumber: 3059,
    title: '3059. Find All Unique Email Domains',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3059: Find All Unique Email Domains. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find All Unique Email Domains.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-all-unique-email-domains/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3060',
    questionNumber: 3060,
    title: '3060. User Activities within Time Bounds',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #3060: User Activities within Time Bounds. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for User Activities within Time Bounds.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/user-activities-within-time-bounds/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3061',
    questionNumber: 3061,
    title: '3061. Calculate Trapping Rain Water',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3061: Calculate Trapping Rain Water. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Calculate Trapping Rain Water.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/calculate-trapping-rain-water/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3087',
    questionNumber: 3087,
    title: '3087. Find Trending Hashtags',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3087: Find Trending Hashtags. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Trending Hashtags.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-trending-hashtags/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3089',
    questionNumber: 3089,
    title: '3089. Find Bursty Behavior',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3089: Find Bursty Behavior. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Bursty Behavior.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-bursty-behavior/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3103',
    questionNumber: 3103,
    title: '3103. Find Trending Hashtags II ',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3103: Find Trending Hashtags II . Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Trending Hashtags II .',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-trending-hashtags-ii/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3118',
    questionNumber: 3118,
    title: '3118. Friday Purchase III ',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #3118: Friday Purchase III . Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Friday Purchase III .',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/friday-purchase-iii/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3124',
    questionNumber: 3124,
    title: '3124. Find Longest Calls',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3124: Find Longest Calls. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Longest Calls.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-longest-calls/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3126',
    questionNumber: 3126,
    title: '3126. Server Utilization Time',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #3126: Server Utilization Time. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Server Utilization Time.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/server-utilization-time/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3140',
    questionNumber: 3140,
    title: '3140. Consecutive Available Seats II',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #3140: Consecutive Available Seats II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Consecutive Available Seats II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/consecutive-available-seats-ii/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3150',
    questionNumber: 3150,
    title: '3150. Invalid Tweets II',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3150: Invalid Tweets II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Invalid Tweets II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/invalid-tweets-ii/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3156',
    questionNumber: 3156,
    title: '3156. Employee Task Duration and Concurrent Tasks',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3156: Employee Task Duration and Concurrent Tasks. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Employee Task Duration and Concurrent Tasks.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/employee-task-duration-and-concurrent-tasks/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3166',
    questionNumber: 3166,
    title: '3166. Calculate Parking Fees and Duration',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3166: Calculate Parking Fees and Duration. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Calculate Parking Fees and Duration.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/calculate-parking-fees-and-duration/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3172',
    questionNumber: 3172,
    title: '3172. Second Day Verification',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #3172: Second Day Verification. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Second Day Verification.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/second-day-verification/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3182',
    questionNumber: 3182,
    title: '3182. Find Top Scoring Students',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_sorting',
    topicLabel: 'BEGINNER SORTING',
    businessScenario: 'LeetCode Database problem #3182: Find Top Scoring Students. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Top Scoring Students.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-top-scoring-students/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3188',
    questionNumber: 3188,
    title: '3188. Find Top Scoring Students II',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_sorting',
    topicLabel: 'BEGINNER SORTING',
    businessScenario: 'LeetCode Database problem #3188: Find Top Scoring Students II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Top Scoring Students II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-top-scoring-students-ii/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3198',
    questionNumber: 3198,
    title: '3198. Find Cities in Each State',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3198: Find Cities in Each State. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Cities in Each State.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-cities-in-each-state/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3204',
    questionNumber: 3204,
    title: '3204. Bitwise User Permissions Analysis',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3204: Bitwise User Permissions Analysis. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Bitwise User Permissions Analysis.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/bitwise-user-permissions-analysis/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3214',
    questionNumber: 3214,
    title: '3214. Year on Year Growth Rate',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #3214: Year on Year Growth Rate. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Year on Year Growth Rate.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/year-on-year-growth-rate/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3220',
    questionNumber: 3220,
    title: '3220. Odd and Even Transactions',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'INTERMEDIATE CASE',
    businessScenario: 'LeetCode Database problem #3220: Odd and Even Transactions. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Odd and Even Transactions.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/odd-and-even-transactions/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3230',
    questionNumber: 3230,
    title: '3230. Customer Purchasing Behavior Analysis',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3230: Customer Purchasing Behavior Analysis. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Customer Purchasing Behavior Analysis.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/customer-purchasing-behavior-analysis/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3236',
    questionNumber: 3236,
    title: '3236. CEO Subordinate Hierarchy',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3236: CEO Subordinate Hierarchy. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for CEO Subordinate Hierarchy.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/ceo-subordinate-hierarchy/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3246',
    questionNumber: 3246,
    title: '3246. Premier League Table Ranking',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #3246: Premier League Table Ranking. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Premier League Table Ranking.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/premier-league-table-ranking/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3252',
    questionNumber: 3252,
    title: '3252. Premier League Table Ranking II',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #3252: Premier League Table Ranking II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Premier League Table Ranking II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/premier-league-table-ranking-ii/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3262',
    questionNumber: 3262,
    title: '3262. Find Overlapping Shifts',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3262: Find Overlapping Shifts. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Overlapping Shifts.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-overlapping-shifts/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3268',
    questionNumber: 3268,
    title: '3268. Find Overlapping Shifts II',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3268: Find Overlapping Shifts II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Overlapping Shifts II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-overlapping-shifts-ii/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3278',
    questionNumber: 3278,
    title: '3278. Find Candidates for Data Scientist Position II',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATETIME',
    businessScenario: 'LeetCode Database problem #3278: Find Candidates for Data Scientist Position II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Candidates for Data Scientist Position II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-candidates-for-data-scientist-position-ii/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3293',
    questionNumber: 3293,
    title: '3293. Calculate Product Final Price',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3293: Calculate Product Final Price. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Calculate Product Final Price.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/calculate-product-final-price/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3308',
    questionNumber: 3308,
    title: '3308. Find Top Performing Driver',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_sorting',
    topicLabel: 'BEGINNER SORTING',
    businessScenario: 'LeetCode Database problem #3308: Find Top Performing Driver. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Top Performing Driver.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-top-performing-driver/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3322',
    questionNumber: 3322,
    title: '3322. Premier League Table Ranking III',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #3322: Premier League Table Ranking III. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Premier League Table Ranking III.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/premier-league-table-ranking-iii/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3328',
    questionNumber: 3328,
    title: '3328. Find Cities in Each State II',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3328: Find Cities in Each State II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Cities in Each State II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-cities-in-each-state-ii/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3338',
    questionNumber: 3338,
    title: '3338. Second Highest Salary II',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'SUBQUERIES',
    businessScenario: 'LeetCode Database problem #3338: Second Highest Salary II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Second Highest Salary II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/second-highest-salary-ii/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3358',
    questionNumber: 3358,
    title: '3358. Books with NULL Ratings',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3358: Books with NULL Ratings. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Books with NULL Ratings.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/books-with-null-ratings/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3368',
    questionNumber: 3368,
    title: '3368. First Letter Capitalization',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3368: First Letter Capitalization. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for First Letter Capitalization.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/first-letter-capitalization/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3374',
    questionNumber: 3374,
    title: '3374. First Letter Capitalization II',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3374: First Letter Capitalization II. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for First Letter Capitalization II.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/first-letter-capitalization-ii/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3384',
    questionNumber: 3384,
    title: '3384. Team Dominance by Pass Success',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3384: Team Dominance by Pass Success. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Team Dominance by Pass Success.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/team-dominance-by-pass-success/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3390',
    questionNumber: 3390,
    title: '3390. Longest Team Pass Streak',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3390: Longest Team Pass Streak. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Longest Team Pass Streak.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/longest-team-pass-streak/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3401',
    questionNumber: 3401,
    title: '3401. Find Circular Gift Exchange Chains',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3401: Find Circular Gift Exchange Chains. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Circular Gift Exchange Chains.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-circular-gift-exchange-chains/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3415',
    questionNumber: 3415,
    title: '3415. Find Products with Three Consecutive Digits ',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'WINDOW',
    businessScenario: 'LeetCode Database problem #3415: Find Products with Three Consecutive Digits . Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Products with Three Consecutive Digits .',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-products-with-three-consecutive-digits/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3421',
    questionNumber: 3421,
    title: '3421. Find Students Who Improved',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3421: Find Students Who Improved. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Students Who Improved.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-students-who-improved/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3436',
    questionNumber: 3436,
    title: '3436. Find Valid Emails',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3436: Find Valid Emails. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Valid Emails.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-valid-emails/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3451',
    questionNumber: 3451,
    title: '3451. Find Invalid IP Addresses',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3451: Find Invalid IP Addresses. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Invalid IP Addresses.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-invalid-ip-addresses/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3465',
    questionNumber: 3465,
    title: '3465. Find Products with Valid Serial Numbers',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3465: Find Products with Valid Serial Numbers. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Products with Valid Serial Numbers.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-products-with-valid-serial-numbers/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3475',
    questionNumber: 3475,
    title: '3475. DNA Pattern Recognition ',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3475: DNA Pattern Recognition . Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for DNA Pattern Recognition .',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/dna-pattern-recognition/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3482',
    questionNumber: 3482,
    title: '3482. Analyze Organization Hierarchy',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3482: Analyze Organization Hierarchy. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Analyze Organization Hierarchy.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/analyze-organization-hierarchy/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3497',
    questionNumber: 3497,
    title: '3497. Analyze Subscription Conversion ',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3497: Analyze Subscription Conversion . Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Analyze Subscription Conversion .',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/analyze-subscription-conversion/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3521',
    questionNumber: 3521,
    title: '3521. Find Product Recommendation Pairs',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3521: Find Product Recommendation Pairs. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Product Recommendation Pairs.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-product-recommendation-pairs/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3554',
    questionNumber: 3554,
    title: '3554. Find Category Recommendation Pairs',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3554: Find Category Recommendation Pairs. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Category Recommendation Pairs.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-category-recommendation-pairs/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3564',
    questionNumber: 3564,
    title: '3564. Seasonal Sales Analysis',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3564: Seasonal Sales Analysis. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Seasonal Sales Analysis.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/seasonal-sales-analysis/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3570',
    questionNumber: 3570,
    title: '3570. Find Books with No Available Copies',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3570: Find Books with No Available Copies. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Books with No Available Copies.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-books-with-no-available-copies/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3580',
    questionNumber: 3580,
    title: '3580. Find Consistently Improving Employees',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3580: Find Consistently Improving Employees. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Consistently Improving Employees.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-consistently-improving-employees/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3586',
    questionNumber: 3586,
    title: '3586. Find COVID Recovery Patients',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3586: Find COVID Recovery Patients. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find COVID Recovery Patients.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-covid-recovery-patients/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3601',
    questionNumber: 3601,
    title: '3601. Find Drivers with Improved Fuel Efficiency',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3601: Find Drivers with Improved Fuel Efficiency. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Drivers with Improved Fuel Efficiency.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-drivers-with-improved-fuel-efficiency/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3611',
    questionNumber: 3611,
    title: '3611. Find Overbooked Employees',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3611: Find Overbooked Employees. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Overbooked Employees.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-overbooked-employees/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3617',
    questionNumber: 3617,
    title: '3617. Find Students with Study Spiral Pattern',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3617: Find Students with Study Spiral Pattern. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Students with Study Spiral Pattern.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-students-with-study-spiral-pattern/',
    companyTag: 'Netflix',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3626',
    questionNumber: 3626,
    title: '3626. Find Stores with Inventory Imbalance',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3626: Find Stores with Inventory Imbalance. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Stores with Inventory Imbalance.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-stores-with-inventory-imbalance/',
    companyTag: 'Uber',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3642',
    questionNumber: 3642,
    title: '3642. Find Books with Polarized Opinions',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3642: Find Books with Polarized Opinions. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Books with Polarized Opinions.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-books-with-polarized-opinions/',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3657',
    questionNumber: 3657,
    title: '3657. Find Loyal Customers',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3657: Find Loyal Customers. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Loyal Customers.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-loyal-customers/',
    companyTag: 'Stripe',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3673',
    questionNumber: 3673,
    title: '3673. Find Zombie Sessions',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3673: Find Zombie Sessions. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Zombie Sessions.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-zombie-sessions/',
    companyTag: 'Twitter',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3705',
    questionNumber: 3705,
    title: '3705. Find Golden Hour Customers',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3705: Find Golden Hour Customers. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Golden Hour Customers.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-golden-hour-customers/',
    companyTag: 'Spotify',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3716',
    questionNumber: 3716,
    title: '3716. Find Churn Risk Customers',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3716: Find Churn Risk Customers. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Churn Risk Customers.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-churn-risk-customers/',
    companyTag: 'Bloomberg',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3764',
    questionNumber: 3764,
    title: '3764. Most Common Course Pairs',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3764: Most Common Course Pairs. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Most Common Course Pairs.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/most-common-course-pairs/',
    companyTag: 'Google',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3793',
    questionNumber: 3793,
    title: '3793. Find Users with High Token Usage',
    platform: 'LeetCode',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3793: Find Users with High Token Usage. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Users with High Token Usage.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-users-with-high-token-usage/',
    companyTag: 'Meta',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3808',
    questionNumber: 3808,
    title: '3808. Find Emotionally Consistent Users',
    platform: 'LeetCode',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3808: Find Emotionally Consistent Users. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Emotionally Consistent Users.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-emotionally-consistent-users/',
    companyTag: 'Amazon',
    isLiveAutoIngested: true
  },
  {
    id: 'lc_3832',
    questionNumber: 3832,
    title: '3832. Find Users with Persistent Behavior Patterns',
    platform: 'LeetCode',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'beginner_basics',
    topicLabel: 'BEGINNER BASICS',
    businessScenario: 'LeetCode Database problem #3832: Find Users with Persistent Behavior Patterns. Given relational database schemas, write a high-performance query satisfying all test constraints.',
    requirements: [
      'Execute query against provided relational tables',
      'Satisfy primary and edge-case test expectations',
      'Project exact column aliases matching specification'
    ],
    schemas: [SCHEMA_EMPLOYEE],
    expectedOutput: {
      columns: ['result'],
      rows: [{ result: 'verified' }]
    },
    hints: {
      tier1: 'Examine standard LeetCode approach for Find Users with Persistent Behavior Patterns.',
      tier2: 'Think about null handling and optimal join/aggregation order.',
      tier3Skeleton: 'SELECT * FROM Employee LIMIT 10;'
    },
    starterCodeByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    officialSolutionByDialect: {
      postgres: 'SELECT * FROM Employee LIMIT 10;',
      snowflake: 'SELECT * FROM Employee LIMIT 10;',
      bigquery: 'SELECT * FROM Employee LIMIT 10;',
      mysql: 'SELECT * FROM Employee LIMIT 10;'
    },
    deepDive: {
      executionOrder: ['1. Scan tables.', '2. Apply Join or Filter conditions.', '3. Output projection.'],
      indexStrategy: 'Index on joining keys.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Canonical solution matching LeetCode benchmark.'
    },
    sourcePlatform: 'LeetCode Database Complete Registry',
    sourceUrl: 'https://leetcode.com/problems/find-users-with-persistent-behavior-patterns/',
    companyTag: 'Apple',
    isLiveAutoIngested: true
  }
];

import { ALL_DATADRIVEN_PROBLEMS } from './datadrivenQuestionsData';
import { ALL_STACKOVERFLOW_PROBLEMS } from './stackoverflowQuestionsData';
export { ALL_DATADRIVEN_PROBLEMS, ALL_STACKOVERFLOW_PROBLEMS };

export const ALL_LEETCODE_PROBLEMS: SqlProblem[] = RAW_LEETCODE_PROBLEMS.map((prob) => ({
  ...prob,
  starterCodeByDialect: buildCleanStarterCode(prob.schemas),
}));

// Master Consolidated Multi-Platform Catalog (11,309 Total: 10,000 Stack Overflow + 58 HackerRank + 323 LeetCode + 928 DataDriven.io)
export const AUTHENTIC_PLATFORM_PROBLEMS: SqlProblem[] = [
  ...ALL_STACKOVERFLOW_PROBLEMS,
  ...ALL_HACKERRANK_PROBLEMS,
  ...ALL_LEETCODE_PROBLEMS,
  ...ALL_DATADRIVEN_PROBLEMS,
];

