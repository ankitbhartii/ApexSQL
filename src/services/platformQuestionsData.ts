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
    description: 'Unified stream aggregating Stack Overflow Interview Archive (10,000 Qs), DataDriven.io (928 Qs), LeetCode Database (105 Qs), HackerRank SQL Track (58 Qs), DataLemur (21 Qs), and StrataScratch & FAANG Case Studies (50 Qs).',
    totalAvailable: 11162,
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
    tagline: '105 Authentic SQL Interview Problems',
    icon: '🟡',
    color: 'text-amber-400',
    bgLight: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    badgeColor: 'bg-amber-500/20 text-amber-300',
    apiEndpoint: 'https://leetcode.com/graphql',
    description: 'All 105 authentic official LeetCode SQL database problems with exact table schemas, test inputs, clear problem instructions, and verified solutions.',
    totalAvailable: 105,
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

// 105 Authentic Official LeetCode Database Problems (with real schemas, test inputs, and instructions)
import {
  ALL_LEETCODE_PROBLEMS,
  ALL_LEETCODE_FREE_PROBLEMS,
  ALL_LEETCODE_TOP50_PROBLEMS,
} from './leetcodeQuestionsData';
import { ALL_DATADRIVEN_PROBLEMS } from './datadrivenQuestionsData';
import { ALL_STACKOVERFLOW_PROBLEMS } from './stackoverflowQuestionsData';
import { ALL_DATALEMUR_PROBLEMS } from './datalemurQuestionsData';
import { ALL_STRATASCRATCH_PROBLEMS } from './stratascratchQuestionsData';

export {
  ALL_LEETCODE_PROBLEMS,
  ALL_LEETCODE_FREE_PROBLEMS,
  ALL_LEETCODE_TOP50_PROBLEMS,
  ALL_DATADRIVEN_PROBLEMS,
  ALL_STACKOVERFLOW_PROBLEMS,
  ALL_DATALEMUR_PROBLEMS,
  ALL_STRATASCRATCH_PROBLEMS,
};

// Master Consolidated Multi-Platform Catalog (11,162 Total: 10,000 Stack Overflow + 58 HackerRank + 105 LeetCode + 928 DataDriven.io + 21 DataLemur + 50 StrataScratch)
export const AUTHENTIC_PLATFORM_PROBLEMS: SqlProblem[] = [
  ...ALL_STACKOVERFLOW_PROBLEMS,
  ...ALL_HACKERRANK_PROBLEMS,
  ...ALL_LEETCODE_PROBLEMS,
  ...ALL_DATADRIVEN_PROBLEMS,
  ...ALL_DATALEMUR_PROBLEMS,
  ...ALL_STRATASCRATCH_PROBLEMS,
];
