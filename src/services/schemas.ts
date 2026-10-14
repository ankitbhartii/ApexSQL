/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TableSchema } from '../types';

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
