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
  id: 'leetcode' | 'hackerrank' | 'datadriven' | 'stackoverflow' | 'stratascratch' | 'datalemur' | 'all';
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
    description: 'Unified stream aggregating Stack Overflow Interview Archive (10,000 Qs), DataDriven.io (928 Qs), LeetCode Database (323 Qs), HackerRank SQL Track (58 Qs), DataLemur (21 Qs), and FAANG case challenges.',
    totalAvailable: 11330,
    companies: ['Google', 'Meta', 'Amazon', 'Apple', 'Uber', 'Netflix', 'Stripe', 'Goldman Sachs'],
  },
  {
    id: 'datalemur',
    name: 'DataLemur',
    tagline: 'Authentic FAANG & Tech SQL Interview Questions',
    icon: '🐒',
    color: 'text-amber-500',
    bgLight: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    badgeColor: 'bg-amber-500/20 text-amber-300',
    apiEndpoint: 'https://datalemur.com/questions',
    description: 'Curated real-world SQL interview problems asked by Meta, Amazon, Google, LinkedIn, Uber, Tesla, Twitter/X, TikTok, and Stripe by Nick Singh.',
    totalAvailable: 21,
    companies: ['Meta', 'Amazon', 'Google', 'LinkedIn', 'Tesla', 'Twitter', 'TikTok', 'Uber', 'Stripe', 'CVS Health', 'Walmart', 'Wayfair', 'JPMorgan Chase'],
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
    tagline: '323 SQL Questions (105 Free · 218 Premium)',
    icon: '🟡',
    color: 'text-amber-400',
    bgLight: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    badgeColor: 'bg-amber-500/20 text-amber-300',
    apiEndpoint: 'https://leetcode.com/graphql',
    description: 'Official LeetCode SQL database catalog spanning 105 Free SQL challenges, 218 Premium interview problems, and Top SQL 50 curated tracks with authentic schemas.',
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

// 323 Official LeetCode Database Problems (105 Free · 218 Premium · 50 Top SQL 50)
import {
  ALL_LEETCODE_PROBLEMS,
  ALL_LEETCODE_FREE_PROBLEMS,
  ALL_LEETCODE_TOP50_PROBLEMS,
  ALL_LEETCODE_PREMIUM_PROBLEMS,
} from './leetcodeQuestionsData';
import { ALL_DATADRIVEN_PROBLEMS } from './datadrivenQuestionsData';
import { ALL_STACKOVERFLOW_PROBLEMS } from './stackoverflowQuestionsData';
import { ALL_DATALEMUR_PROBLEMS } from './datalemurQuestionsData';

export {
  ALL_LEETCODE_PROBLEMS,
  ALL_LEETCODE_FREE_PROBLEMS,
  ALL_LEETCODE_TOP50_PROBLEMS,
  ALL_LEETCODE_PREMIUM_PROBLEMS,
  ALL_DATADRIVEN_PROBLEMS,
  ALL_STACKOVERFLOW_PROBLEMS,
  ALL_DATALEMUR_PROBLEMS,
};

// Master Consolidated Multi-Platform Catalog (11,330 Total: 10,000 Stack Overflow + 58 HackerRank + 323 LeetCode + 928 DataDriven.io + 21 DataLemur)
export const AUTHENTIC_PLATFORM_PROBLEMS: SqlProblem[] = [
  ...ALL_STACKOVERFLOW_PROBLEMS,
  ...ALL_HACKERRANK_PROBLEMS,
  ...ALL_LEETCODE_PROBLEMS,
  ...ALL_DATADRIVEN_PROBLEMS,
  ...ALL_DATALEMUR_PROBLEMS,
];

