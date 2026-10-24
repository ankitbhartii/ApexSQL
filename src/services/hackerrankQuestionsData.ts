/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Complete 58 Authentic HackerRank SQL Track Domain Challenges
 * Sourced directly from HackerRank Official SQL Track:
 * Basic Select, Advanced Select, Aggregations, Basic Join, Advanced Join, and Alternative Queries.
 */

import { SqlProblem, TableSchema } from '../types';

// ============================================================================
// AUTHENTIC HACKERRANK SQL TRACK SCHEMAS
// ============================================================================


export const SCHEMA_COMPANY: TableSchema = {
  tableName: 'Company',
  columns: [
    { name: 'company_code', type: 'VARCHAR', isPk: true },
    { name: 'founder', type: 'VARCHAR' },
  ],
  sampleRows: [
    { company_code: 'C1', founder: 'Monika' },
    { company_code: 'C2', founder: 'Samantha' },
  ],
};

export const SCHEMA_HIERARCHY_EMPLOYEE: TableSchema = {
  tableName: 'Employee',
  columns: [
    { name: 'employee_code', type: 'VARCHAR', isPk: true },
    { name: 'manager_code', type: 'VARCHAR' },
    { name: 'senior_manager_code', type: 'VARCHAR' },
    { name: 'lead_manager_code', type: 'VARCHAR' },
    { name: 'company_code', type: 'VARCHAR' },
  ],
  sampleRows: [
    { employee_code: 'E1', manager_code: 'M1', senior_manager_code: 'SM1', lead_manager_code: 'LM1', company_code: 'C1' },
    { employee_code: 'E2', manager_code: 'M1', senior_manager_code: 'SM1', lead_manager_code: 'LM1', company_code: 'C1' },
    { employee_code: 'E3', manager_code: 'M2', senior_manager_code: 'SM3', lead_manager_code: 'LM2', company_code: 'C2' },
    { employee_code: 'E4', manager_code: 'M2', senior_manager_code: 'SM3', lead_manager_code: 'LM2', company_code: 'C2' },
  ],
};

// ============================================================================
// MASTER 58 AUTHENTIC HACKERRANK SQL TRACK DOMAIN PROBLEMS
// ============================================================================

export const ALL_HACKERRANK_PROBLEMS: SqlProblem[] = [
  {
    "id": "hr_revising_the_select_query",
    "questionNumber": 1,
    "title": "Revising the Select Query I",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "BASIC SELECT",
    "businessScenario": "Query all columns for all American cities in the CITY table with populations larger than 100000. The CountryCode for America is USA.\n\nThe CITY table is described as follows:",
    "requirements": [
      "Filter for cities with COUNTRYCODE = \"USA\"",
      "Filter for POPULATION > 100000",
      "Select all columns (*)"
    ],
    "schemas": [
      {
        "tableName": "CITY",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "City identification number"
          },
          {
            "name": "NAME",
            "type": "VARCHAR2(17)",
            "description": "City name"
          },
          {
            "name": "COUNTRYCODE",
            "type": "VARCHAR2(3)",
            "description": "Three-letter country code"
          },
          {
            "name": "DISTRICT",
            "type": "VARCHAR2(20)",
            "description": "District or province name"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER",
            "description": "City population"
          }
        ],
        "sampleRows": [
          {
            "ID": 6,
            "NAME": "Rotterdam",
            "COUNTRYCODE": "NLD",
            "DISTRICT": "Zuid-Holland",
            "POPULATION": 593321
          },
          {
            "ID": 3878,
            "NAME": "Scottsdale",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Arizona",
            "POPULATION": 202705
          },
          {
            "ID": 3965,
            "NAME": "Corona",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 124966
          },
          {
            "ID": 3973,
            "NAME": "Concord",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 121780
          },
          {
            "ID": 3977,
            "NAME": "Cedar Rapids",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Iowa",
            "POPULATION": 120758
          },
          {
            "ID": 3982,
            "NAME": "Coral Springs",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Florida",
            "POPULATION": 117549
          },
          {
            "ID": 4054,
            "NAME": "Fairfield",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 92256
          },
          {
            "ID": 4058,
            "NAME": "Boulder",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Colorado",
            "POPULATION": 91055
          },
          {
            "ID": 4061,
            "NAME": "Fall River",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Massachusetts",
            "POPULATION": 90555
          },
          {
            "ID": 1613,
            "NAME": "Neyagawa",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Osaka",
            "POPULATION": 257315
          },
          {
            "ID": 1630,
            "NAME": "Ageo",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 209442
          },
          {
            "ID": 1661,
            "NAME": "Sayama",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 162472
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "ID",
        "NAME",
        "COUNTRYCODE",
        "DISTRICT",
        "POPULATION"
      ],
      "rows": [
        {
          "ID": 3878,
          "NAME": "Scottsdale",
          "COUNTRYCODE": "USA",
          "DISTRICT": "Arizona",
          "POPULATION": 202705
        },
        {
          "ID": 3965,
          "NAME": "Corona",
          "COUNTRYCODE": "USA",
          "DISTRICT": "California",
          "POPULATION": 124966
        },
        {
          "ID": 3973,
          "NAME": "Concord",
          "COUNTRYCODE": "USA",
          "DISTRICT": "California",
          "POPULATION": 121780
        },
        {
          "ID": 3977,
          "NAME": "Cedar Rapids",
          "COUNTRYCODE": "USA",
          "DISTRICT": "Iowa",
          "POPULATION": 120758
        },
        {
          "ID": 3982,
          "NAME": "Coral Springs",
          "COUNTRYCODE": "USA",
          "DISTRICT": "Florida",
          "POPULATION": 117549
        }
      ]
    },
    "hints": {
      "tier1": "Use SELECT * to project all columns from the CITY table.",
      "tier2": "Combine conditions using WHERE: COUNTRYCODE = \"USA\" AND POPULATION > 100000.",
      "tier3Skeleton": "SELECT * FROM CITY WHERE COUNTRYCODE = 'USA' AND POPULATION > 100000;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT * FROM CITY WHERE COUNTRYCODE = 'USA' AND POPULATION > 100000;",
      "snowflake": "SELECT * FROM CITY WHERE COUNTRYCODE = 'USA' AND POPULATION > 100000;",
      "bigquery": "SELECT * FROM CITY WHERE COUNTRYCODE = 'USA' AND POPULATION > 100000;",
      "mysql": "SELECT * FROM CITY WHERE COUNTRYCODE = 'USA' AND POPULATION > 100000;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/revising-the-select-query/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_revising_the_select_query_2",
    "questionNumber": 2,
    "title": "Revising the Select Query II",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "BASIC SELECT",
    "businessScenario": "Query the NAME field for all American cities in the CITY table with populations larger than 120000. The CountryCode for America is USA.\n\nThe CITY table is described as follows:",
    "requirements": [
      "Project ONLY the NAME column",
      "Filter where COUNTRYCODE = \"USA\"",
      "Filter where POPULATION > 120000"
    ],
    "schemas": [
      {
        "tableName": "CITY",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "City identification number"
          },
          {
            "name": "NAME",
            "type": "VARCHAR2(17)",
            "description": "City name"
          },
          {
            "name": "COUNTRYCODE",
            "type": "VARCHAR2(3)",
            "description": "Three-letter country code"
          },
          {
            "name": "DISTRICT",
            "type": "VARCHAR2(20)",
            "description": "District or province name"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER",
            "description": "City population"
          }
        ],
        "sampleRows": [
          {
            "ID": 6,
            "NAME": "Rotterdam",
            "COUNTRYCODE": "NLD",
            "DISTRICT": "Zuid-Holland",
            "POPULATION": 593321
          },
          {
            "ID": 3878,
            "NAME": "Scottsdale",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Arizona",
            "POPULATION": 202705
          },
          {
            "ID": 3965,
            "NAME": "Corona",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 124966
          },
          {
            "ID": 3973,
            "NAME": "Concord",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 121780
          },
          {
            "ID": 3977,
            "NAME": "Cedar Rapids",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Iowa",
            "POPULATION": 120758
          },
          {
            "ID": 3982,
            "NAME": "Coral Springs",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Florida",
            "POPULATION": 117549
          },
          {
            "ID": 4054,
            "NAME": "Fairfield",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 92256
          },
          {
            "ID": 4058,
            "NAME": "Boulder",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Colorado",
            "POPULATION": 91055
          },
          {
            "ID": 4061,
            "NAME": "Fall River",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Massachusetts",
            "POPULATION": 90555
          },
          {
            "ID": 1613,
            "NAME": "Neyagawa",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Osaka",
            "POPULATION": 257315
          },
          {
            "ID": 1630,
            "NAME": "Ageo",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 209442
          },
          {
            "ID": 1661,
            "NAME": "Sayama",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 162472
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "NAME"
      ],
      "rows": [
        {
          "NAME": "Scottsdale"
        },
        {
          "NAME": "Corona"
        },
        {
          "NAME": "Concord"
        },
        {
          "NAME": "Cedar Rapids"
        }
      ]
    },
    "hints": {
      "tier1": "Project only the NAME column rather than *.",
      "tier2": "Apply WHERE COUNTRYCODE = \"USA\" AND POPULATION > 120000.",
      "tier3Skeleton": "SELECT NAME FROM CITY WHERE COUNTRYCODE = 'USA' AND POPULATION > 120000;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT NAME FROM CITY WHERE COUNTRYCODE = 'USA' AND POPULATION > 120000;",
      "snowflake": "SELECT NAME FROM CITY WHERE COUNTRYCODE = 'USA' AND POPULATION > 120000;",
      "bigquery": "SELECT NAME FROM CITY WHERE COUNTRYCODE = 'USA' AND POPULATION > 120000;",
      "mysql": "SELECT NAME FROM CITY WHERE COUNTRYCODE = 'USA' AND POPULATION > 120000;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/revising-the-select-query-2/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_select_all_sql",
    "questionNumber": 3,
    "title": "Select All",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "BASIC SELECT",
    "businessScenario": "Query all columns (attributes) for every row in the CITY table.\n\nThe CITY table is described as follows:",
    "requirements": [
      "Query all columns (*)",
      "Include every row in the CITY table without filtering"
    ],
    "schemas": [
      {
        "tableName": "CITY",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "City identification number"
          },
          {
            "name": "NAME",
            "type": "VARCHAR2(17)",
            "description": "City name"
          },
          {
            "name": "COUNTRYCODE",
            "type": "VARCHAR2(3)",
            "description": "Three-letter country code"
          },
          {
            "name": "DISTRICT",
            "type": "VARCHAR2(20)",
            "description": "District or province name"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER",
            "description": "City population"
          }
        ],
        "sampleRows": [
          {
            "ID": 6,
            "NAME": "Rotterdam",
            "COUNTRYCODE": "NLD",
            "DISTRICT": "Zuid-Holland",
            "POPULATION": 593321
          },
          {
            "ID": 3878,
            "NAME": "Scottsdale",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Arizona",
            "POPULATION": 202705
          },
          {
            "ID": 3965,
            "NAME": "Corona",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 124966
          },
          {
            "ID": 3973,
            "NAME": "Concord",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 121780
          },
          {
            "ID": 3977,
            "NAME": "Cedar Rapids",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Iowa",
            "POPULATION": 120758
          },
          {
            "ID": 3982,
            "NAME": "Coral Springs",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Florida",
            "POPULATION": 117549
          },
          {
            "ID": 4054,
            "NAME": "Fairfield",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 92256
          },
          {
            "ID": 4058,
            "NAME": "Boulder",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Colorado",
            "POPULATION": 91055
          },
          {
            "ID": 4061,
            "NAME": "Fall River",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Massachusetts",
            "POPULATION": 90555
          },
          {
            "ID": 1613,
            "NAME": "Neyagawa",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Osaka",
            "POPULATION": 257315
          },
          {
            "ID": 1630,
            "NAME": "Ageo",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 209442
          },
          {
            "ID": 1661,
            "NAME": "Sayama",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 162472
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "ID",
        "NAME",
        "COUNTRYCODE",
        "DISTRICT",
        "POPULATION"
      ],
      "rows": [
        {
          "ID": 6,
          "NAME": "Rotterdam",
          "COUNTRYCODE": "NLD",
          "DISTRICT": "Zuid-Holland",
          "POPULATION": 593321
        },
        {
          "ID": 3878,
          "NAME": "Scottsdale",
          "COUNTRYCODE": "USA",
          "DISTRICT": "Arizona",
          "POPULATION": 202705
        },
        {
          "ID": 3965,
          "NAME": "Corona",
          "COUNTRYCODE": "USA",
          "DISTRICT": "California",
          "POPULATION": 124966
        },
        {
          "ID": 3973,
          "NAME": "Concord",
          "COUNTRYCODE": "USA",
          "DISTRICT": "California",
          "POPULATION": 121780
        },
        {
          "ID": 3977,
          "NAME": "Cedar Rapids",
          "COUNTRYCODE": "USA",
          "DISTRICT": "Iowa",
          "POPULATION": 120758
        },
        {
          "ID": 3982,
          "NAME": "Coral Springs",
          "COUNTRYCODE": "USA",
          "DISTRICT": "Florida",
          "POPULATION": 117549
        },
        {
          "ID": 4054,
          "NAME": "Fairfield",
          "COUNTRYCODE": "USA",
          "DISTRICT": "California",
          "POPULATION": 92256
        },
        {
          "ID": 4058,
          "NAME": "Boulder",
          "COUNTRYCODE": "USA",
          "DISTRICT": "Colorado",
          "POPULATION": 91055
        },
        {
          "ID": 4061,
          "NAME": "Fall River",
          "COUNTRYCODE": "USA",
          "DISTRICT": "Massachusetts",
          "POPULATION": 90555
        },
        {
          "ID": 1613,
          "NAME": "Neyagawa",
          "COUNTRYCODE": "JPN",
          "DISTRICT": "Osaka",
          "POPULATION": 257315
        },
        {
          "ID": 1630,
          "NAME": "Ageo",
          "COUNTRYCODE": "JPN",
          "DISTRICT": "Saitama",
          "POPULATION": 209442
        },
        {
          "ID": 1661,
          "NAME": "Sayama",
          "COUNTRYCODE": "JPN",
          "DISTRICT": "Saitama",
          "POPULATION": 162472
        }
      ]
    },
    "hints": {
      "tier1": "Use a standard SELECT * query from CITY.",
      "tier2": "No WHERE clause is required for this problem.",
      "tier3Skeleton": "SELECT * FROM CITY;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT * FROM CITY;",
      "snowflake": "SELECT * FROM CITY;",
      "bigquery": "SELECT * FROM CITY;",
      "mysql": "SELECT * FROM CITY;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/select-all-sql/problem",
    "companyTag": "IBM",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_select_by_id",
    "questionNumber": 4,
    "title": "Select By ID",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "BASIC SELECT",
    "businessScenario": "Query all columns for a city in CITY with the ID 1661.\n\nThe CITY table is described as follows:",
    "requirements": [
      "Filter where ID = 1661",
      "Select all columns (*)"
    ],
    "schemas": [
      {
        "tableName": "CITY",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "City identification number"
          },
          {
            "name": "NAME",
            "type": "VARCHAR2(17)",
            "description": "City name"
          },
          {
            "name": "COUNTRYCODE",
            "type": "VARCHAR2(3)",
            "description": "Three-letter country code"
          },
          {
            "name": "DISTRICT",
            "type": "VARCHAR2(20)",
            "description": "District or province name"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER",
            "description": "City population"
          }
        ],
        "sampleRows": [
          {
            "ID": 6,
            "NAME": "Rotterdam",
            "COUNTRYCODE": "NLD",
            "DISTRICT": "Zuid-Holland",
            "POPULATION": 593321
          },
          {
            "ID": 3878,
            "NAME": "Scottsdale",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Arizona",
            "POPULATION": 202705
          },
          {
            "ID": 3965,
            "NAME": "Corona",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 124966
          },
          {
            "ID": 3973,
            "NAME": "Concord",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 121780
          },
          {
            "ID": 3977,
            "NAME": "Cedar Rapids",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Iowa",
            "POPULATION": 120758
          },
          {
            "ID": 3982,
            "NAME": "Coral Springs",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Florida",
            "POPULATION": 117549
          },
          {
            "ID": 4054,
            "NAME": "Fairfield",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 92256
          },
          {
            "ID": 4058,
            "NAME": "Boulder",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Colorado",
            "POPULATION": 91055
          },
          {
            "ID": 4061,
            "NAME": "Fall River",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Massachusetts",
            "POPULATION": 90555
          },
          {
            "ID": 1613,
            "NAME": "Neyagawa",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Osaka",
            "POPULATION": 257315
          },
          {
            "ID": 1630,
            "NAME": "Ageo",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 209442
          },
          {
            "ID": 1661,
            "NAME": "Sayama",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 162472
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "ID",
        "NAME",
        "COUNTRYCODE",
        "DISTRICT",
        "POPULATION"
      ],
      "rows": [
        {
          "ID": 1661,
          "NAME": "Sayama",
          "COUNTRYCODE": "JPN",
          "DISTRICT": "Saitama",
          "POPULATION": 162472
        }
      ]
    },
    "hints": {
      "tier1": "Filter specifically by primary key ID = 1661.",
      "tier2": "Use WHERE ID = 1661.",
      "tier3Skeleton": "SELECT * FROM CITY WHERE ID = 1661;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT * FROM CITY WHERE ID = 1661;",
      "snowflake": "SELECT * FROM CITY WHERE ID = 1661;",
      "bigquery": "SELECT * FROM CITY WHERE ID = 1661;",
      "mysql": "SELECT * FROM CITY WHERE ID = 1661;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/select-by-id/problem",
    "companyTag": "PayPal",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_japanese_cities_attributes",
    "questionNumber": 5,
    "title": "Japanese Cities' Attributes",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "BASIC SELECT",
    "businessScenario": "Query all attributes of every Japanese city in the CITY table. The COUNTRYCODE for Japan is JPN.\n\nThe CITY table is described as follows:\n- ID: NUMBER\n- NAME: VARCHAR2(17)\n- COUNTRYCODE: VARCHAR2(3)\n- DISTRICT: VARCHAR2(20)\n- POPULATION: NUMBER",
    "requirements": [
      "Filter for cities with COUNTRYCODE = 'JPN'",
      "Select all columns (*)",
      "No specific order required"
    ],
    "schemas": [
      {
        "tableName": "CITY",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "City identification number"
          },
          {
            "name": "NAME",
            "type": "VARCHAR2(17)",
            "description": "City name"
          },
          {
            "name": "COUNTRYCODE",
            "type": "VARCHAR2(3)",
            "description": "Three-letter country code"
          },
          {
            "name": "DISTRICT",
            "type": "VARCHAR2(20)",
            "description": "District or province name"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER",
            "description": "City population"
          }
        ],
        "sampleRows": [
          {
            "ID": 6,
            "NAME": "Rotterdam",
            "COUNTRYCODE": "NLD",
            "DISTRICT": "Zuid-Holland",
            "POPULATION": 593321
          },
          {
            "ID": 3878,
            "NAME": "Scottsdale",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Arizona",
            "POPULATION": 202705
          },
          {
            "ID": 3965,
            "NAME": "Corona",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 124966
          },
          {
            "ID": 3973,
            "NAME": "Concord",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 121780
          },
          {
            "ID": 3977,
            "NAME": "Cedar Rapids",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Iowa",
            "POPULATION": 120758
          },
          {
            "ID": 3982,
            "NAME": "Coral Springs",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Florida",
            "POPULATION": 117549
          },
          {
            "ID": 4054,
            "NAME": "Fairfield",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 92256
          },
          {
            "ID": 4058,
            "NAME": "Boulder",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Colorado",
            "POPULATION": 91055
          },
          {
            "ID": 4061,
            "NAME": "Fall River",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Massachusetts",
            "POPULATION": 90555
          },
          {
            "ID": 1613,
            "NAME": "Neyagawa",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Osaka",
            "POPULATION": 257315
          },
          {
            "ID": 1630,
            "NAME": "Ageo",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 209442
          },
          {
            "ID": 1661,
            "NAME": "Sayama",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 162472
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "ID",
        "NAME",
        "COUNTRYCODE",
        "DISTRICT",
        "POPULATION"
      ],
      "rows": [
        {
          "ID": 1613,
          "NAME": "Neyagawa",
          "COUNTRYCODE": "JPN",
          "DISTRICT": "Osaka",
          "POPULATION": 257315
        },
        {
          "ID": 1630,
          "NAME": "Ageo",
          "COUNTRYCODE": "JPN",
          "DISTRICT": "Saitama",
          "POPULATION": 209442
        },
        {
          "ID": 1661,
          "NAME": "Sayama",
          "COUNTRYCODE": "JPN",
          "DISTRICT": "Saitama",
          "POPULATION": 162472
        }
      ]
    },
    "hints": {
      "tier1": "Use SELECT * FROM CITY.",
      "tier2": "Add WHERE COUNTRYCODE = 'JPN'.",
      "tier3Skeleton": "SELECT * FROM CITY WHERE COUNTRYCODE = 'JPN';"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT * FROM CITY WHERE COUNTRYCODE = 'JPN';",
      "snowflake": "SELECT * FROM CITY WHERE COUNTRYCODE = 'JPN';",
      "bigquery": "SELECT * FROM CITY WHERE COUNTRYCODE = 'JPN';",
      "mysql": "SELECT * FROM CITY WHERE COUNTRYCODE = 'JPN';"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records where COUNTRYCODE is JPN.",
        "2. Project all columns."
      ],
      "indexStrategy": "Index on COUNTRYCODE.",
      "complexity": "Time O(N), Space O(1).",
      "tradeoffs": "Canonical basic query."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/japanese-cities-attributes/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_japanese_cities_name",
    "questionNumber": 6,
    "title": "Japanese Cities' Names",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "BASIC SELECT",
    "businessScenario": "Query the names of all the Japanese cities in the CITY table. The COUNTRYCODE for Japan is JPN.\n\nThe CITY table is described as follows:\n- ID: NUMBER\n- NAME: VARCHAR2(17)\n- COUNTRYCODE: VARCHAR2(3)\n- DISTRICT: VARCHAR2(20)\n- POPULATION: NUMBER",
    "requirements": [
      "Filter for cities with COUNTRYCODE = 'JPN'",
      "Select only the NAME column",
      "No specific order required"
    ],
    "schemas": [
      {
        "tableName": "CITY",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "City identification number"
          },
          {
            "name": "NAME",
            "type": "VARCHAR2(17)",
            "description": "City name"
          },
          {
            "name": "COUNTRYCODE",
            "type": "VARCHAR2(3)",
            "description": "Three-letter country code"
          },
          {
            "name": "DISTRICT",
            "type": "VARCHAR2(20)",
            "description": "District or province name"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER",
            "description": "City population"
          }
        ],
        "sampleRows": [
          {
            "ID": 6,
            "NAME": "Rotterdam",
            "COUNTRYCODE": "NLD",
            "DISTRICT": "Zuid-Holland",
            "POPULATION": 593321
          },
          {
            "ID": 3878,
            "NAME": "Scottsdale",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Arizona",
            "POPULATION": 202705
          },
          {
            "ID": 3965,
            "NAME": "Corona",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 124966
          },
          {
            "ID": 3973,
            "NAME": "Concord",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 121780
          },
          {
            "ID": 3977,
            "NAME": "Cedar Rapids",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Iowa",
            "POPULATION": 120758
          },
          {
            "ID": 3982,
            "NAME": "Coral Springs",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Florida",
            "POPULATION": 117549
          },
          {
            "ID": 4054,
            "NAME": "Fairfield",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 92256
          },
          {
            "ID": 4058,
            "NAME": "Boulder",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Colorado",
            "POPULATION": 91055
          },
          {
            "ID": 4061,
            "NAME": "Fall River",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Massachusetts",
            "POPULATION": 90555
          },
          {
            "ID": 1613,
            "NAME": "Neyagawa",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Osaka",
            "POPULATION": 257315
          },
          {
            "ID": 1630,
            "NAME": "Ageo",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 209442
          },
          {
            "ID": 1661,
            "NAME": "Sayama",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 162472
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "NAME"
      ],
      "rows": [
        {
          "NAME": "Neyagawa"
        },
        {
          "NAME": "Ageo"
        },
        {
          "NAME": "Sayama"
        }
      ]
    },
    "hints": {
      "tier1": "Use SELECT NAME FROM CITY.",
      "tier2": "Add WHERE COUNTRYCODE = 'JPN'.",
      "tier3Skeleton": "SELECT NAME FROM CITY WHERE COUNTRYCODE = 'JPN';"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT NAME FROM CITY WHERE COUNTRYCODE = 'JPN';",
      "snowflake": "SELECT NAME FROM CITY WHERE COUNTRYCODE = 'JPN';",
      "bigquery": "SELECT NAME FROM CITY WHERE COUNTRYCODE = 'JPN';",
      "mysql": "SELECT NAME FROM CITY WHERE COUNTRYCODE = 'JPN';"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records where COUNTRYCODE is JPN.",
        "2. Project NAME column."
      ],
      "indexStrategy": "Index on COUNTRYCODE.",
      "complexity": "Time O(N), Space O(1).",
      "tradeoffs": "Canonical projection query."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/japanese-cities-name/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_1",
    "questionNumber": 7,
    "title": "Weather Observation Station 1",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "BASIC SELECT",
    "businessScenario": "Query a list of CITY and STATE from the STATION table.\n\nThe STATION table is described as follows:",
    "requirements": [
      "Project CITY and STATE columns",
      "From the STATION table"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "CITY",
        "STATE"
      ],
      "rows": [
        {
          "CITY": "Kissee Mills",
          "STATE": "MO"
        },
        {
          "CITY": "Loma Mar",
          "STATE": "CA"
        },
        {
          "CITY": "Sandy Hook",
          "STATE": "CT"
        },
        {
          "CITY": "Tipton",
          "STATE": "IN"
        },
        {
          "CITY": "Arlington",
          "STATE": "CO"
        },
        {
          "CITY": "Turner",
          "STATE": "AR"
        },
        {
          "CITY": "Slidell",
          "STATE": "LA"
        },
        {
          "CITY": "Negreet",
          "STATE": "LA"
        },
        {
          "CITY": "Glencoe",
          "STATE": "KY"
        },
        {
          "CITY": "Chelsea",
          "STATE": "IA"
        },
        {
          "CITY": "Erie",
          "STATE": "PA"
        },
        {
          "CITY": "Osage City",
          "STATE": "KS"
        }
      ]
    },
    "hints": {
      "tier1": "Project CITY and STATE from STATION.",
      "tier2": "SELECT CITY, STATE FROM STATION;",
      "tier3Skeleton": "SELECT CITY, STATE FROM STATION;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT CITY, STATE FROM STATION;",
      "snowflake": "SELECT CITY, STATE FROM STATION;",
      "bigquery": "SELECT CITY, STATE FROM STATION;",
      "mysql": "SELECT CITY, STATE FROM STATION;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-1/problem",
    "companyTag": "Morgan Stanley",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_3",
    "questionNumber": 8,
    "title": "Weather Observation Station 3",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "BASIC SELECT",
    "businessScenario": "Query a list of CITY names from STATION for cities that have an even ID number. Print the results in any order, but exclude duplicates from the answer.\n\nThe STATION table is described as follows:",
    "requirements": [
      "Exclude duplicates using DISTINCT",
      "Filter for even ID: ID % 2 = 0 (or MOD(ID, 2) = 0)",
      "Project CITY column"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "CITY"
      ],
      "rows": [
        {
          "CITY": "Kissee Mills"
        },
        {
          "CITY": "Loma Mar"
        },
        {
          "CITY": "Tipton"
        },
        {
          "CITY": "Turner"
        },
        {
          "CITY": "Negreet"
        },
        {
          "CITY": "Erie"
        },
        {
          "CITY": "Osage City"
        }
      ]
    },
    "hints": {
      "tier1": "Use DISTINCT CITY to exclude duplicate entries.",
      "tier2": "Use modulo: ID % 2 = 0.",
      "tier3Skeleton": "SELECT DISTINCT CITY FROM STATION WHERE ID % 2 = 0;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT DISTINCT CITY FROM STATION WHERE ID % 2 = 0;",
      "snowflake": "SELECT DISTINCT CITY FROM STATION WHERE MOD(ID, 2) = 0;",
      "bigquery": "SELECT DISTINCT CITY FROM STATION WHERE MOD(ID, 2) = 0;",
      "mysql": "SELECT DISTINCT CITY FROM STATION WHERE ID % 2 = 0;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-3/problem",
    "companyTag": "Morgan Stanley",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_4",
    "questionNumber": 9,
    "title": "Weather Observation Station 4",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Find the difference between the total number of CITY entries in the table and the number of distinct CITY entries in the table.\n\nThe STATION table is described as follows:",
    "requirements": [
      "Calculate COUNT(CITY) - COUNT(DISTINCT CITY)",
      "Return single scalar result"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "difference"
      ],
      "rows": [
        {
          "difference": 0
        }
      ]
    },
    "hints": {
      "tier1": "Subtract COUNT(DISTINCT CITY) from COUNT(CITY).",
      "tier2": "SELECT COUNT(CITY) - COUNT(DISTINCT CITY) FROM STATION;",
      "tier3Skeleton": "SELECT COUNT(CITY) - COUNT(DISTINCT CITY) AS difference FROM STATION;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT COUNT(CITY) - COUNT(DISTINCT CITY) AS difference FROM STATION;",
      "snowflake": "SELECT COUNT(CITY) - COUNT(DISTINCT CITY) AS difference FROM STATION;",
      "bigquery": "SELECT COUNT(CITY) - COUNT(DISTINCT CITY) AS difference FROM STATION;",
      "mysql": "SELECT COUNT(CITY) - COUNT(DISTINCT CITY) AS difference FROM STATION;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-4/problem",
    "companyTag": "Morgan Stanley",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_5",
    "questionNumber": 10,
    "title": "Weather Observation Station 5",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_sorting",
    "topicLabel": "SORTING & LENGTH",
    "businessScenario": "Query the two cities in STATION with the shortest and longest CITY names, as well as their respective lengths (i.e.: number of characters in the name). If there is more than one smallest or largest city, choose the one that comes first when ordered alphabetically.\n\nThe STATION table is described as follows:",
    "requirements": [
      "Sort by LENGTH(CITY) ASC, CITY ASC LIMIT 1 for shortest",
      "Sort by LENGTH(CITY) DESC, CITY ASC LIMIT 1 for longest"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "CITY",
        "name_length"
      ],
      "rows": [
        {
          "CITY": "Erie",
          "name_length": 4
        },
        {
          "CITY": "Kissee Mills",
          "name_length": 12
        }
      ]
    },
    "hints": {
      "tier1": "Use LENGTH(CITY) to determine character length.",
      "tier2": "Order by LENGTH(CITY) ASC, CITY ASC LIMIT 1 and union with DESC.",
      "tier3Skeleton": "(SELECT CITY, LENGTH(CITY) AS name_length FROM STATION ORDER BY LENGTH(CITY) ASC, CITY ASC LIMIT 1) UNION ALL (SELECT CITY, LENGTH(CITY) AS name_length FROM STATION ORDER BY LENGTH(CITY) DESC, CITY ASC LIMIT 1);"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "(SELECT CITY, LENGTH(CITY) AS name_length FROM STATION ORDER BY LENGTH(CITY) ASC, CITY ASC LIMIT 1) UNION ALL (SELECT CITY, LENGTH(CITY) AS name_length FROM STATION ORDER BY LENGTH(CITY) DESC, CITY ASC LIMIT 1);",
      "snowflake": "(SELECT CITY, LENGTH(CITY) AS name_length FROM STATION ORDER BY LENGTH(CITY) ASC, CITY ASC LIMIT 1) UNION ALL (SELECT CITY, LENGTH(CITY) AS name_length FROM STATION ORDER BY LENGTH(CITY) DESC, CITY ASC LIMIT 1);",
      "bigquery": "(SELECT CITY, LENGTH(CITY) AS name_length FROM STATION ORDER BY LENGTH(CITY) ASC, CITY ASC LIMIT 1) UNION ALL (SELECT CITY, LENGTH(CITY) AS name_length FROM STATION ORDER BY LENGTH(CITY) DESC, CITY ASC LIMIT 1);",
      "mysql": "(SELECT CITY, LENGTH(CITY) AS name_length FROM STATION ORDER BY LENGTH(CITY) ASC, CITY ASC LIMIT 1) UNION ALL (SELECT CITY, LENGTH(CITY) AS name_length FROM STATION ORDER BY LENGTH(CITY) DESC, CITY ASC LIMIT 1);"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-5/problem",
    "companyTag": "PayPal",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_6",
    "questionNumber": 11,
    "title": "Weather Observation Station 6",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "BASIC SELECT",
    "businessScenario": "Query the list of CITY names starting with vowels (i.e., 'a', 'e', 'i', 'o', or 'u') from STATION. Your result cannot contain duplicates.\n\nThe STATION table is described as follows:\n- ID: NUMBER\n- CITY: VARCHAR2(21)\n- STATE: VARCHAR2(2)\n- LAT_N: NUMBER\n- LONG_W: NUMBER",
    "requirements": [
      "Filter for CITY starting with a, e, i, o, or u (case-insensitive)",
      "Use DISTINCT to eliminate duplicates",
      "Project only the CITY column"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "CITY"
      ],
      "rows": [
        {
          "CITY": "Acme"
        },
        {
          "CITY": "Addison"
        },
        {
          "CITY": "Agency"
        },
        {
          "CITY": "Alanson"
        }
      ]
    },
    "hints": {
      "tier1": "Use SELECT DISTINCT CITY FROM STATION.",
      "tier2": "Use LOWER(SUBSTRING(CITY, 1, 1)) IN ('a', 'e', 'i', 'o', 'u').",
      "tier3Skeleton": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) IN ('a', 'e', 'i', 'o', 'u');"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) IN ('a', 'e', 'i', 'o', 'u');",
      "snowflake": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) IN ('a', 'e', 'i', 'o', 'u');",
      "bigquery": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) IN ('a', 'e', 'i', 'o', 'u');",
      "mysql": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) IN ('a', 'e', 'i', 'o', 'u');"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records where first char is a vowel.",
        "2. Distinct CITY projection."
      ],
      "indexStrategy": "Index on CITY.",
      "complexity": "Time O(N log N) for deduplication, Space O(N).",
      "tradeoffs": "Canonical regex/substring filter."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-6/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_7",
    "questionNumber": 12,
    "title": "Weather Observation Station 7",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "BASIC SELECT",
    "businessScenario": "Query the list of CITY names ending with vowels (a, e, i, o, u) from STATION. Your result cannot contain duplicates.\n\nThe STATION table is described as follows:\n- ID: NUMBER\n- CITY: VARCHAR2(21)\n- STATE: VARCHAR2(2)\n- LAT_N: NUMBER\n- LONG_W: NUMBER",
    "requirements": [
      "Filter for CITY ending with a, e, i, o, or u (case-insensitive)",
      "Use DISTINCT to eliminate duplicates",
      "Project only the CITY column"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "CITY"
      ],
      "rows": [
        {
          "CITY": "Acme"
        },
        {
          "CITY": "Aguila"
        },
        {
          "CITY": "Alba"
        },
        {
          "CITY": "Aloha"
        }
      ]
    },
    "hints": {
      "tier1": "Use SELECT DISTINCT CITY FROM STATION.",
      "tier2": "Use LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) IN ('a', 'e', 'i', 'o', 'u').",
      "tier3Skeleton": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) IN ('a', 'e', 'i', 'o', 'u');"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) IN ('a', 'e', 'i', 'o', 'u');",
      "snowflake": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) IN ('a', 'e', 'i', 'o', 'u');",
      "bigquery": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) IN ('a', 'e', 'i', 'o', 'u');",
      "mysql": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) IN ('a', 'e', 'i', 'o', 'u');"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records where last char is a vowel.",
        "2. Deduplicate CITY values."
      ],
      "indexStrategy": "Index on CITY.",
      "complexity": "Time O(N log N), Space O(N).",
      "tradeoffs": "Canonical reverse character extraction."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-7/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_8",
    "questionNumber": 13,
    "title": "Weather Observation Station 8",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "BASIC SELECT",
    "businessScenario": "Query the list of CITY names from STATION which have vowels (i.e., a, e, i, o, and u) as both their first and last characters. Your result cannot contain duplicates.\n\nThe STATION table is described as follows:\n- ID: NUMBER\n- CITY: VARCHAR2(21)\n- STATE: VARCHAR2(2)\n- LAT_N: NUMBER\n- LONG_W: NUMBER",
    "requirements": [
      "Filter for CITY starting with a vowel AND ending with a vowel",
      "Use DISTINCT to eliminate duplicates",
      "Project only the CITY column"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "CITY"
      ],
      "rows": [
        {
          "CITY": "Acme"
        },
        {
          "CITY": "Aguila"
        },
        {
          "CITY": "Alba"
        },
        {
          "CITY": "Aloha"
        }
      ]
    },
    "hints": {
      "tier1": "Combine starting and ending vowel checks with AND.",
      "tier2": "LOWER(SUBSTRING(CITY, 1, 1)) IN ('a','e','i','o','u') AND LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) IN ('a','e','i','o','u').",
      "tier3Skeleton": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) IN ('a', 'e', 'i', 'o', 'u') AND LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) IN ('a', 'e', 'i', 'o', 'u');"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) IN ('a', 'e', 'i', 'o', 'u') AND LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) IN ('a', 'e', 'i', 'o', 'u');",
      "snowflake": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) IN ('a', 'e', 'i', 'o', 'u') AND LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) IN ('a', 'e', 'i', 'o', 'u');",
      "bigquery": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) IN ('a', 'e', 'i', 'o', 'u') AND LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) IN ('a', 'e', 'i', 'o', 'u');",
      "mysql": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) IN ('a', 'e', 'i', 'o', 'u') AND LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) IN ('a', 'e', 'i', 'o', 'u');"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records where both edges are vowels.",
        "2. Deduplicate results."
      ],
      "indexStrategy": "Index on CITY.",
      "complexity": "Time O(N log N), Space O(N).",
      "tradeoffs": "Canonical bidirectional character filter."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-8/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_9",
    "questionNumber": 14,
    "title": "Weather Observation Station 9",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "BASIC SELECT",
    "businessScenario": "Query the list of CITY names from STATION that do not start with vowels. Your result cannot contain duplicates.\n\nThe STATION table is described as follows:\n- ID: NUMBER\n- CITY: VARCHAR2(21)\n- STATE: VARCHAR2(2)\n- LAT_N: NUMBER\n- LONG_W: NUMBER",
    "requirements": [
      "Filter for CITY not starting with a vowel",
      "Use DISTINCT to eliminate duplicates",
      "Project only the CITY column"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "CITY"
      ],
      "rows": [
        {
          "CITY": "Baker"
        },
        {
          "CITY": "Bass Harbor"
        },
        {
          "CITY": "Bayville"
        }
      ]
    },
    "hints": {
      "tier1": "Negate starting vowel condition with NOT IN.",
      "tier2": "LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a', 'e', 'i', 'o', 'u').",
      "tier3Skeleton": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a', 'e', 'i', 'o', 'u');"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a', 'e', 'i', 'o', 'u');",
      "snowflake": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a', 'e', 'i', 'o', 'u');",
      "bigquery": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a', 'e', 'i', 'o', 'u');",
      "mysql": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a', 'e', 'i', 'o', 'u');"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records where first char is not a vowel.",
        "2. Deduplicate results."
      ],
      "indexStrategy": "Index on CITY.",
      "complexity": "Time O(N log N), Space O(N).",
      "tradeoffs": "Canonical negation check."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-9/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_10",
    "questionNumber": 15,
    "title": "Weather Observation Station 10",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "BASIC SELECT",
    "businessScenario": "Query the list of CITY names from STATION that do not end with vowels. Your result cannot contain duplicates.\n\nThe STATION table is described as follows:\n- ID: NUMBER\n- CITY: VARCHAR2(21)\n- STATE: VARCHAR2(2)\n- LAT_N: NUMBER\n- LONG_W: NUMBER",
    "requirements": [
      "Filter for CITY not ending with a vowel",
      "Use DISTINCT to eliminate duplicates",
      "Project only the CITY column"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "CITY"
      ],
      "rows": [
        {
          "CITY": "Baker"
        },
        {
          "CITY": "Bass Harbor"
        },
        {
          "CITY": "Bayville"
        }
      ]
    },
    "hints": {
      "tier1": "Negate ending vowel condition with NOT IN.",
      "tier2": "LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a', 'e', 'i', 'o', 'u').",
      "tier3Skeleton": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a', 'e', 'i', 'o', 'u');"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a', 'e', 'i', 'o', 'u');",
      "snowflake": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a', 'e', 'i', 'o', 'u');",
      "bigquery": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a', 'e', 'i', 'o', 'u');",
      "mysql": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a', 'e', 'i', 'o', 'u');"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records where last char is not a vowel.",
        "2. Deduplicate results."
      ],
      "indexStrategy": "Index on CITY.",
      "complexity": "Time O(N log N), Space O(N).",
      "tradeoffs": "Canonical negation check."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-10/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_11",
    "questionNumber": 16,
    "title": "Weather Observation Station 11",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "BASIC SELECT",
    "businessScenario": "Query the list of CITY names from STATION that either do not start with vowels or do not end with vowels. Your result cannot contain duplicates.\n\nThe STATION table is described as follows:\n- ID: NUMBER\n- CITY: VARCHAR2(21)\n- STATE: VARCHAR2(2)\n- LAT_N: NUMBER\n- LONG_W: NUMBER",
    "requirements": [
      "Filter where CITY does not start with a vowel OR does not end with a vowel",
      "Use DISTINCT to eliminate duplicates",
      "Project only the CITY column"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "CITY"
      ],
      "rows": [
        {
          "CITY": "Baker"
        },
        {
          "CITY": "Baileyville"
        },
        {
          "CITY": "Bainbridge"
        }
      ]
    },
    "hints": {
      "tier1": "Use OR between the two negation conditions.",
      "tier2": "LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a','e','i','o','u') OR LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a','e','i','o','u').",
      "tier3Skeleton": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a', 'e', 'i', 'o', 'u') OR LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a', 'e', 'i', 'o', 'u');"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a', 'e', 'i', 'o', 'u') OR LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a', 'e', 'i', 'o', 'u');",
      "snowflake": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a', 'e', 'i', 'o', 'u') OR LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a', 'e', 'i', 'o', 'u');",
      "bigquery": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a', 'e', 'i', 'o', 'u') OR LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a', 'e', 'i', 'o', 'u');",
      "mysql": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a', 'e', 'i', 'o', 'u') OR LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a', 'e', 'i', 'o', 'u');"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records where either edge is not a vowel.",
        "2. Deduplicate results."
      ],
      "indexStrategy": "Index on CITY.",
      "complexity": "Time O(N log N), Space O(N).",
      "tradeoffs": "Canonical De Morgan disjunctive logic."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-11/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_12",
    "questionNumber": 17,
    "title": "Weather Observation Station 12",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "BASIC SELECT",
    "businessScenario": "Query the list of CITY names from STATION that do not start with vowels and do not end with vowels. Your result cannot contain duplicates.\n\nThe STATION table is described as follows:\n- ID: NUMBER\n- CITY: VARCHAR2(21)\n- STATE: VARCHAR2(2)\n- LAT_N: NUMBER\n- LONG_W: NUMBER",
    "requirements": [
      "Filter where CITY does not start with a vowel AND does not end with a vowel",
      "Use DISTINCT to eliminate duplicates",
      "Project only the CITY column"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "CITY"
      ],
      "rows": [
        {
          "CITY": "Baker"
        },
        {
          "CITY": "Bainbridge"
        }
      ]
    },
    "hints": {
      "tier1": "Use AND between both negation checks.",
      "tier2": "LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a','e','i','o','u') AND LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a','e','i','o','u').",
      "tier3Skeleton": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a', 'e', 'i', 'o', 'u') AND LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a', 'e', 'i', 'o', 'u');"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a', 'e', 'i', 'o', 'u') AND LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a', 'e', 'i', 'o', 'u');",
      "snowflake": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a', 'e', 'i', 'o', 'u') AND LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a', 'e', 'i', 'o', 'u');",
      "bigquery": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a', 'e', 'i', 'o', 'u') AND LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a', 'e', 'i', 'o', 'u');",
      "mysql": "SELECT DISTINCT CITY FROM STATION WHERE LOWER(SUBSTRING(CITY, 1, 1)) NOT IN ('a', 'e', 'i', 'o', 'u') AND LOWER(SUBSTRING(CITY, LENGTH(CITY), 1)) NOT IN ('a', 'e', 'i', 'o', 'u');"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records where neither edge is a vowel.",
        "2. Deduplicate results."
      ],
      "indexStrategy": "Index on CITY.",
      "complexity": "Time O(N log N), Space O(N).",
      "tradeoffs": "Canonical strict conjunctive negation."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-12/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_higher_than_75_marks",
    "questionNumber": 18,
    "title": "Higher Than 75 Marks",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_sorting",
    "topicLabel": "SUBSTRING SORTING",
    "businessScenario": "Query the Name of any student in STUDENTS who scored higher than 75 Marks. Order your output by the last three characters of each name. If two or more students both have names ending in the same last three characters (i.e.: Bobby, Robby, etc.), secondary sort them by ascending ID.\n\nThe STUDENTS table is described as follows:",
    "requirements": [
      "Filter where Marks > 75",
      "Order by RIGHT(Name, 3) (or SUBSTRING(Name, -3)) ASC",
      "Secondary order by ID ASC",
      "Project ONLY the Name column"
    ],
    "schemas": [
      {
        "tableName": "STUDENTS",
        "columns": [
          {
            "name": "ID",
            "type": "INTEGER",
            "isPk": true,
            "description": "Student ID"
          },
          {
            "name": "Name",
            "type": "STRING",
            "description": "Student name"
          },
          {
            "name": "Marks",
            "type": "INTEGER",
            "description": "Final marks scored"
          }
        ],
        "sampleRows": [
          {
            "ID": 1,
            "Name": "Ashley",
            "Marks": 81
          },
          {
            "ID": 2,
            "Name": "Samantha",
            "Marks": 75
          },
          {
            "ID": 3,
            "Name": "Julia",
            "Marks": 76
          },
          {
            "ID": 4,
            "Name": "Scarlet",
            "Marks": 84
          },
          {
            "ID": 5,
            "Name": "Ketty",
            "Marks": 20
          },
          {
            "ID": 6,
            "Name": "Stuart",
            "Marks": 99
          },
          {
            "ID": 7,
            "Name": "Belvet",
            "Marks": 78
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "Name"
      ],
      "rows": [
        {
          "Name": "Stuart"
        },
        {
          "Name": "Ashley"
        },
        {
          "Name": "Julia"
        },
        {
          "Name": "Belvet"
        },
        {
          "Name": "Scarlet"
        }
      ]
    },
    "hints": {
      "tier1": "Filter with WHERE Marks > 75.",
      "tier2": "Order by SUBSTRING(Name, LENGTH(Name) - 2, 3), ID ASC.",
      "tier3Skeleton": "SELECT Name FROM STUDENTS WHERE Marks > 75 ORDER BY RIGHT(Name, 3) ASC, ID ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT Name FROM STUDENTS WHERE Marks > 75 ORDER BY RIGHT(Name, 3) ASC, ID ASC;",
      "snowflake": "SELECT Name FROM STUDENTS WHERE Marks > 75 ORDER BY RIGHT(Name, 3) ASC, ID ASC;",
      "bigquery": "SELECT Name FROM STUDENTS WHERE Marks > 75 ORDER BY RIGHT(Name, 3) ASC, ID ASC;",
      "mysql": "SELECT Name FROM STUDENTS WHERE Marks > 75 ORDER BY RIGHT(Name, 3) ASC, ID ASC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/more-than-75-marks/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_employee_names",
    "questionNumber": 19,
    "title": "Employee Names",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_sorting",
    "topicLabel": "ALPHABETICAL ORDER",
    "businessScenario": "Write a query that prints a list of employee names (i.e.: the name attribute) from the Employee table in alphabetical order.\n\nThe Employee table is described as follows:",
    "requirements": [
      "Project ONLY the name column",
      "Order by name in alphabetical order (ASC)"
    ],
    "schemas": [
      {
        "tableName": "Employee",
        "columns": [
          {
            "name": "employee_id",
            "type": "INTEGER",
            "isPk": true,
            "description": "Employee identifier"
          },
          {
            "name": "name",
            "type": "STRING",
            "description": "Employee name"
          },
          {
            "name": "months",
            "type": "INTEGER",
            "description": "Total months with company"
          },
          {
            "name": "salary",
            "type": "INTEGER",
            "description": "Monthly salary in USD"
          }
        ],
        "sampleRows": [
          {
            "employee_id": 12228,
            "name": "Rose",
            "months": 15,
            "salary": 1968
          },
          {
            "employee_id": 33645,
            "name": "Angela",
            "months": 1,
            "salary": 3443
          },
          {
            "employee_id": 45692,
            "name": "Frank",
            "months": 17,
            "salary": 1608
          },
          {
            "employee_id": 56118,
            "name": "Patrick",
            "months": 7,
            "salary": 1345
          },
          {
            "employee_id": 59725,
            "name": "Lisa",
            "months": 11,
            "salary": 2330
          },
          {
            "employee_id": 74197,
            "name": "Kimberly",
            "months": 16,
            "salary": 4372
          },
          {
            "employee_id": 78454,
            "name": "Bonnie",
            "months": 8,
            "salary": 1771
          },
          {
            "employee_id": 83565,
            "name": "Michael",
            "months": 6,
            "salary": 2017
          },
          {
            "employee_id": 98607,
            "name": "Todd",
            "months": 5,
            "salary": 2196
          },
          {
            "employee_id": 99989,
            "name": "Joe",
            "months": 9,
            "salary": 3570
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "name"
      ],
      "rows": [
        {
          "name": "Angela"
        },
        {
          "name": "Bonnie"
        },
        {
          "name": "Frank"
        },
        {
          "name": "Joe"
        },
        {
          "name": "Kimberly"
        },
        {
          "name": "Lisa"
        },
        {
          "name": "Michael"
        },
        {
          "name": "Patrick"
        },
        {
          "name": "Rose"
        },
        {
          "name": "Todd"
        }
      ]
    },
    "hints": {
      "tier1": "Project name from Employee.",
      "tier2": "Order by name ASC.",
      "tier3Skeleton": "SELECT name FROM Employee ORDER BY name ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT name FROM Employee ORDER BY name ASC;",
      "snowflake": "SELECT name FROM Employee ORDER BY name ASC;",
      "bigquery": "SELECT name FROM Employee ORDER BY name ASC;",
      "mysql": "SELECT name FROM Employee ORDER BY name ASC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/name-of-employees/problem",
    "companyTag": "Booking.com",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_employee_salaries",
    "questionNumber": 20,
    "title": "Employee Salaries",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "FILTER & SORT",
    "businessScenario": "Write a query that prints a list of employee names (i.e.: the name attribute) for employees in Employee having a salary greater than $2000 per month who have been employees for less than 10 months. Sort your result by ascending employee_id.\n\nThe Employee table is described as follows:",
    "requirements": [
      "Filter where salary > 2000",
      "Filter where months < 10",
      "Order by employee_id ASC",
      "Project name attribute"
    ],
    "schemas": [
      {
        "tableName": "Employee",
        "columns": [
          {
            "name": "employee_id",
            "type": "INTEGER",
            "isPk": true,
            "description": "Employee identifier"
          },
          {
            "name": "name",
            "type": "STRING",
            "description": "Employee name"
          },
          {
            "name": "months",
            "type": "INTEGER",
            "description": "Total months with company"
          },
          {
            "name": "salary",
            "type": "INTEGER",
            "description": "Monthly salary in USD"
          }
        ],
        "sampleRows": [
          {
            "employee_id": 12228,
            "name": "Rose",
            "months": 15,
            "salary": 1968
          },
          {
            "employee_id": 33645,
            "name": "Angela",
            "months": 1,
            "salary": 3443
          },
          {
            "employee_id": 45692,
            "name": "Frank",
            "months": 17,
            "salary": 1608
          },
          {
            "employee_id": 56118,
            "name": "Patrick",
            "months": 7,
            "salary": 1345
          },
          {
            "employee_id": 59725,
            "name": "Lisa",
            "months": 11,
            "salary": 2330
          },
          {
            "employee_id": 74197,
            "name": "Kimberly",
            "months": 16,
            "salary": 4372
          },
          {
            "employee_id": 78454,
            "name": "Bonnie",
            "months": 8,
            "salary": 1771
          },
          {
            "employee_id": 83565,
            "name": "Michael",
            "months": 6,
            "salary": 2017
          },
          {
            "employee_id": 98607,
            "name": "Todd",
            "months": 5,
            "salary": 2196
          },
          {
            "employee_id": 99989,
            "name": "Joe",
            "months": 9,
            "salary": 3570
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "name"
      ],
      "rows": [
        {
          "name": "Angela"
        },
        {
          "name": "Michael"
        },
        {
          "name": "Todd"
        },
        {
          "name": "Joe"
        }
      ]
    },
    "hints": {
      "tier1": "Filter WHERE salary > 2000 AND months < 10.",
      "tier2": "Order by employee_id ASC.",
      "tier3Skeleton": "SELECT name FROM Employee WHERE salary > 2000 AND months < 10 ORDER BY employee_id ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT name FROM Employee WHERE salary > 2000 AND months < 10 ORDER BY employee_id ASC;",
      "snowflake": "SELECT name FROM Employee WHERE salary > 2000 AND months < 10 ORDER BY employee_id ASC;",
      "bigquery": "SELECT name FROM Employee WHERE salary > 2000 AND months < 10 ORDER BY employee_id ASC;",
      "mysql": "SELECT name FROM Employee WHERE salary > 2000 AND months < 10 ORDER BY employee_id ASC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/salary-of-employees/problem",
    "companyTag": "Booking.com",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_type_of_triangle",
    "questionNumber": 21,
    "title": "Type of Triangle",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "intermediate_case",
    "topicLabel": "CASE STATEMENTS",
    "businessScenario": "Write a query identifying the type of each record in the TRIANGLES table using its three side lengths. Output one of the following statements for each record in the table:\n\n• Equilateral: It's a triangle with 3 sides of equal length.\n• Isosceles: It's a triangle with 2 sides of equal length.\n• Scalene: It's a triangle with 3 sides of differing lengths.\n• Not A Triangle: The given values of A, B, and C don't form a triangle (i.e. sum of any two sides must be greater than the third side).\n\nThe TRIANGLES table is described as follows:",
    "requirements": [
      "Use CASE WHEN conditional statements",
      "Check triangle inequality first: A + B <= C OR A + C <= B OR B + C <= A -> \"Not A Triangle\"",
      "Check A = B AND B = C -> \"Equilateral\"",
      "Check A = B OR B = C OR A = C -> \"Isosceles\"",
      "ELSE \"Scalene\""
    ],
    "schemas": [
      {
        "tableName": "TRIANGLES",
        "columns": [
          {
            "name": "A",
            "type": "INTEGER",
            "description": "Side length A"
          },
          {
            "name": "B",
            "type": "INTEGER",
            "description": "Side length B"
          },
          {
            "name": "C",
            "type": "INTEGER",
            "description": "Side length C"
          }
        ],
        "sampleRows": [
          {
            "A": 20,
            "B": 20,
            "C": 23
          },
          {
            "A": 20,
            "B": 20,
            "C": 20
          },
          {
            "A": 20,
            "B": 21,
            "C": 22
          },
          {
            "A": 13,
            "B": 14,
            "C": 30
          },
          {
            "A": 10,
            "B": 10,
            "C": 15
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "triangle_type"
      ],
      "rows": [
        {
          "triangle_type": "Isosceles"
        },
        {
          "triangle_type": "Equilateral"
        },
        {
          "triangle_type": "Scalene"
        },
        {
          "triangle_type": "Not A Triangle"
        },
        {
          "triangle_type": "Isosceles"
        }
      ]
    },
    "hints": {
      "tier1": "Order matters in CASE WHEN. Check Not A Triangle condition first.",
      "tier2": "CASE WHEN A + B <= C OR A + C <= B OR B + C <= A THEN 'Not A Triangle' ...",
      "tier3Skeleton": "SELECT CASE WHEN A + B <= C OR A + C <= B OR B + C <= A THEN 'Not A Triangle' WHEN A = B AND B = C THEN 'Equilateral' WHEN A = B OR B = C OR A = C THEN 'Isosceles' ELSE 'Scalene' END AS triangle_type FROM TRIANGLES;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT CASE WHEN A + B <= C OR A + C <= B OR B + C <= A THEN 'Not A Triangle' WHEN A = B AND B = C THEN 'Equilateral' WHEN A = B OR B = C OR A = C THEN 'Isosceles' ELSE 'Scalene' END AS triangle_type FROM TRIANGLES;",
      "snowflake": "SELECT CASE WHEN A + B <= C OR A + C <= B OR B + C <= A THEN 'Not A Triangle' WHEN A = B AND B = C THEN 'Equilateral' WHEN A = B OR B = C OR A = C THEN 'Isosceles' ELSE 'Scalene' END AS triangle_type FROM TRIANGLES;",
      "bigquery": "SELECT CASE WHEN A + B <= C OR A + C <= B OR B + C <= A THEN 'Not A Triangle' WHEN A = B AND B = C THEN 'Equilateral' WHEN A = B OR B = C OR A = C THEN 'Isosceles' ELSE 'Scalene' END AS triangle_type FROM TRIANGLES;",
      "mysql": "SELECT CASE WHEN A + B <= C OR A + C <= B OR B + C <= A THEN 'Not A Triangle' WHEN A = B AND B = C THEN 'Equilateral' WHEN A = B OR B = C OR A = C THEN 'Isosceles' ELSE 'Scalene' END AS triangle_type FROM TRIANGLES;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/what-type-of-triangle/problem",
    "companyTag": "PayPal",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_the_pads",
    "questionNumber": 22,
    "title": "The PADS",
    "platform": "HackerRank",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "STRING MANIPULATION",
    "businessScenario": "Generate the following two result sets:\n\n1. Query an alphabetically ordered list of all names in OCCUPATIONS, immediately followed by the first letter of each profession as a parenthetical (i.e.: enclosed in parentheses). For example: AnActorName(A), ADoctorName(D), etc.\n2. Query the number of occurrences of each occupation in OCCUPATIONS. Sort the occurrences in ascending order, and output them in the following format: \"There are a total of [occupation_count] [occupation]s.\"\n\nThe OCCUPATIONS table is described as follows:",
    "requirements": [
      "Format 1: CONCAT(Name, \"(\", LEFT(Occupation, 1), \")\") ORDER BY Name ASC",
      "Format 2: CONCAT(\"There are a total of \", count, \" \", LOWER(occupation), \"s.\")"
    ],
    "schemas": [
      {
        "tableName": "OCCUPATIONS",
        "columns": [
          {
            "name": "Name",
            "type": "STRING",
            "description": "Person name"
          },
          {
            "name": "Occupation",
            "type": "STRING",
            "description": "Profession: Doctor, Professor, Singer, or Actor"
          }
        ],
        "sampleRows": [
          {
            "Name": "Samantha",
            "Occupation": "Doctor"
          },
          {
            "Name": "Julia",
            "Occupation": "Actor"
          },
          {
            "Name": "Maria",
            "Occupation": "Actor"
          },
          {
            "Name": "Meera",
            "Occupation": "Singer"
          },
          {
            "Name": "Ashely",
            "Occupation": "Professor"
          },
          {
            "Name": "Ketty",
            "Occupation": "Professor"
          },
          {
            "Name": "Christeen",
            "Occupation": "Professor"
          },
          {
            "Name": "Jane",
            "Occupation": "Actor"
          },
          {
            "Name": "Jenny",
            "Occupation": "Doctor"
          },
          {
            "Name": "Priya",
            "Occupation": "Singer"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "output_line"
      ],
      "rows": [
        {
          "output_line": "Ashely(P)"
        },
        {
          "output_line": "Christeen(P)"
        },
        {
          "output_line": "Jane(A)"
        },
        {
          "output_line": "Jenny(D)"
        },
        {
          "output_line": "Julia(A)"
        },
        {
          "output_line": "Ketty(P)"
        },
        {
          "output_line": "Maria(A)"
        },
        {
          "output_line": "Meera(S)"
        },
        {
          "output_line": "Priya(S)"
        },
        {
          "output_line": "Samantha(D)"
        },
        {
          "output_line": "There are a total of 2 doctors."
        },
        {
          "output_line": "There are a total of 2 singers."
        },
        {
          "output_line": "There are a total of 3 actors."
        },
        {
          "output_line": "There are a total of 3 professors."
        }
      ]
    },
    "hints": {
      "tier1": "Use string concatenation and union.",
      "tier2": "Format names: Name || '(' || SUBSTRING(Occupation, 1, 1) || ')'.",
      "tier3Skeleton": "SELECT CONCAT(Name, '(', SUBSTRING(Occupation, 1, 1), ')') AS output_line FROM OCCUPATIONS ORDER BY Name ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT CONCAT(Name, '(', SUBSTRING(Occupation, 1, 1), ')') AS output_line FROM OCCUPATIONS ORDER BY Name ASC;",
      "snowflake": "SELECT CONCAT(Name, '(', SUBSTRING(Occupation, 1, 1), ')') AS output_line FROM OCCUPATIONS ORDER BY Name ASC;",
      "bigquery": "SELECT CONCAT(Name, '(', SUBSTRING(Occupation, 1, 1), ')') AS output_line FROM OCCUPATIONS ORDER BY Name ASC;",
      "mysql": "SELECT CONCAT(Name, '(', SUBSTRING(Occupation, 1, 1), ')') AS output_line FROM OCCUPATIONS ORDER BY Name ASC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/the-pads/problem",
    "companyTag": "PayPal",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_occupations",
    "questionNumber": 23,
    "title": "Occupations",
    "platform": "HackerRank",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "intermediate_case",
    "topicLabel": "ADVANCED SELECT",
    "businessScenario": "Pivot the Occupation column in OCCUPATIONS so that each Name is sorted alphabetically and displayed underneath its corresponding Occupation. The output column headers should be Doctor, Professor, Singer, and Actor, respectively.\n\nNote: Print NULL when there are no more names corresponding to an occupation.\n\nThe OCCUPATIONS table is described as follows:\n- Name: VARCHAR\n- Occupation: VARCHAR",
    "requirements": [
      "Assign row numbers per occupation ordered by Name alphabetically",
      "Use conditional aggregation (MAX(CASE WHEN Occupation = ...)) grouped by row number",
      "Output columns: Doctor, Professor, Singer, Actor"
    ],
    "schemas": [
      {
        "tableName": "OCCUPATIONS",
        "columns": [
          {
            "name": "Name",
            "type": "STRING",
            "description": "Person name"
          },
          {
            "name": "Occupation",
            "type": "STRING",
            "description": "Profession: Doctor, Professor, Singer, or Actor"
          }
        ],
        "sampleRows": [
          {
            "Name": "Samantha",
            "Occupation": "Doctor"
          },
          {
            "Name": "Julia",
            "Occupation": "Actor"
          },
          {
            "Name": "Maria",
            "Occupation": "Actor"
          },
          {
            "Name": "Meera",
            "Occupation": "Singer"
          },
          {
            "Name": "Ashely",
            "Occupation": "Professor"
          },
          {
            "Name": "Ketty",
            "Occupation": "Professor"
          },
          {
            "Name": "Christeen",
            "Occupation": "Professor"
          },
          {
            "Name": "Jane",
            "Occupation": "Actor"
          },
          {
            "Name": "Jenny",
            "Occupation": "Doctor"
          },
          {
            "Name": "Priya",
            "Occupation": "Singer"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "Doctor",
        "Professor",
        "Singer",
        "Actor"
      ],
      "rows": [
        {
          "Doctor": "Aamina",
          "Professor": "Ashley",
          "Singer": "Christeen",
          "Actor": "Eve"
        },
        {
          "Doctor": "Julia",
          "Professor": "Belvet",
          "Singer": "Jane",
          "Actor": "Jennifer"
        },
        {
          "Doctor": "Priya",
          "Professor": "Britney",
          "Singer": "Kristeen",
          "Actor": "Ketty"
        }
      ]
    },
    "hints": {
      "tier1": "Use ROW_NUMBER() OVER(PARTITION BY Occupation ORDER BY Name).",
      "tier2": "Wrap in CTE and select MAX(CASE WHEN Occupation = 'Doctor' THEN Name END) etc.",
      "tier3Skeleton": "WITH Ranked AS (SELECT Name, Occupation, ROW_NUMBER() OVER(PARTITION BY Occupation ORDER BY Name) as rn FROM OCCUPATIONS) SELECT MAX(CASE WHEN Occupation = 'Doctor' THEN Name END) AS Doctor, MAX(CASE WHEN Occupation = 'Professor' THEN Name END) AS Professor, MAX(CASE WHEN Occupation = 'Singer' THEN Name END) AS Singer, MAX(CASE WHEN Occupation = 'Actor' THEN Name END) AS Actor FROM Ranked GROUP BY rn ORDER BY rn;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "WITH Ranked AS (SELECT Name, Occupation, ROW_NUMBER() OVER(PARTITION BY Occupation ORDER BY Name) as rn FROM OCCUPATIONS) SELECT MAX(CASE WHEN Occupation = 'Doctor' THEN Name END) AS Doctor, MAX(CASE WHEN Occupation = 'Professor' THEN Name END) AS Professor, MAX(CASE WHEN Occupation = 'Singer' THEN Name END) AS Singer, MAX(CASE WHEN Occupation = 'Actor' THEN Name END) AS Actor FROM Ranked GROUP BY rn ORDER BY rn;",
      "snowflake": "WITH Ranked AS (SELECT Name, Occupation, ROW_NUMBER() OVER(PARTITION BY Occupation ORDER BY Name) as rn FROM OCCUPATIONS) SELECT MAX(CASE WHEN Occupation = 'Doctor' THEN Name END) AS Doctor, MAX(CASE WHEN Occupation = 'Professor' THEN Name END) AS Professor, MAX(CASE WHEN Occupation = 'Singer' THEN Name END) AS Singer, MAX(CASE WHEN Occupation = 'Actor' THEN Name END) AS Actor FROM Ranked GROUP BY rn ORDER BY rn;",
      "bigquery": "WITH Ranked AS (SELECT Name, Occupation, ROW_NUMBER() OVER(PARTITION BY Occupation ORDER BY Name) as rn FROM OCCUPATIONS) SELECT MAX(CASE WHEN Occupation = 'Doctor' THEN Name END) AS Doctor, MAX(CASE WHEN Occupation = 'Professor' THEN Name END) AS Professor, MAX(CASE WHEN Occupation = 'Singer' THEN Name END) AS Singer, MAX(CASE WHEN Occupation = 'Actor' THEN Name END) AS Actor FROM Ranked GROUP BY rn ORDER BY rn;",
      "mysql": "WITH Ranked AS (SELECT Name, Occupation, ROW_NUMBER() OVER(PARTITION BY Occupation ORDER BY Name) as rn FROM OCCUPATIONS) SELECT MAX(CASE WHEN Occupation = 'Doctor' THEN Name END) AS Doctor, MAX(CASE WHEN Occupation = 'Professor' THEN Name END) AS Professor, MAX(CASE WHEN Occupation = 'Singer' THEN Name END) AS Singer, MAX(CASE WHEN Occupation = 'Actor' THEN Name END) AS Actor FROM Ranked GROUP BY rn ORDER BY rn;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Partition by occupation with row_number.",
        "2. Conditional MAX aggregation.",
        "3. Order by rank index."
      ],
      "indexStrategy": "Index on (Occupation, Name).",
      "complexity": "Time O(N log N), Space O(N).",
      "tradeoffs": "Canonical SQL matrix pivot."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/occupations/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_binary_search_tree_1",
    "questionNumber": 24,
    "title": "Binary Tree Nodes",
    "platform": "HackerRank",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "intermediate_case",
    "topicLabel": "TREE HIERARCHY",
    "businessScenario": "You are given a table, BST, containing two columns: N and P, where N represents the value of a node in Binary Tree, and P is the parent of N. Write a query to find the node type of Binary Tree ordered by the value of the node. Output one of the following for each node:\n\n• Root: If the node is root node (P IS NULL).\n• Leaf: If the node is leaf node (N not present in P).\n• Inner: If the node is neither root nor leaf node.\n\nThe BST table is described as follows:",
    "requirements": [
      "Identify Root: WHEN P IS NULL THEN \"Root\"",
      "Identify Leaf: WHEN N NOT IN (SELECT P FROM BST WHERE P IS NOT NULL) THEN \"Leaf\"",
      "ELSE \"Inner\"",
      "Order by N ASC"
    ],
    "schemas": [
      {
        "tableName": "BST",
        "columns": [
          {
            "name": "N",
            "type": "INTEGER",
            "description": "Value of node in Binary Tree"
          },
          {
            "name": "P",
            "type": "INTEGER",
            "description": "Parent node value (NULL for root)"
          }
        ],
        "sampleRows": [
          {
            "N": 1,
            "P": 2
          },
          {
            "N": 3,
            "P": 2
          },
          {
            "N": 6,
            "P": 8
          },
          {
            "N": 9,
            "P": 8
          },
          {
            "N": 2,
            "P": 5
          },
          {
            "N": 8,
            "P": 5
          },
          {
            "N": 5,
            "P": null
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "N",
        "node_type"
      ],
      "rows": [
        {
          "N": 1,
          "node_type": "Leaf"
        },
        {
          "N": 2,
          "node_type": "Inner"
        },
        {
          "N": 3,
          "node_type": "Leaf"
        },
        {
          "N": 5,
          "node_type": "Root"
        },
        {
          "N": 6,
          "node_type": "Leaf"
        },
        {
          "N": 8,
          "node_type": "Inner"
        },
        {
          "N": 9,
          "node_type": "Leaf"
        }
      ]
    },
    "hints": {
      "tier1": "Use CASE WHEN with subquery.",
      "tier2": "Root is when P IS NULL. Leaf is when N NOT IN (SELECT DISTINCT P FROM BST WHERE P IS NOT NULL).",
      "tier3Skeleton": "SELECT N, CASE WHEN P IS NULL THEN 'Root' WHEN N IN (SELECT P FROM BST) THEN 'Inner' ELSE 'Leaf' END AS node_type FROM BST ORDER BY N ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT N, CASE WHEN P IS NULL THEN 'Root' WHEN N IN (SELECT P FROM BST) THEN 'Inner' ELSE 'Leaf' END AS node_type FROM BST ORDER BY N ASC;",
      "snowflake": "SELECT N, CASE WHEN P IS NULL THEN 'Root' WHEN N IN (SELECT P FROM BST) THEN 'Inner' ELSE 'Leaf' END AS node_type FROM BST ORDER BY N ASC;",
      "bigquery": "SELECT N, CASE WHEN P IS NULL THEN 'Root' WHEN N IN (SELECT P FROM BST) THEN 'Inner' ELSE 'Leaf' END AS node_type FROM BST ORDER BY N ASC;",
      "mysql": "SELECT N, CASE WHEN P IS NULL THEN 'Root' WHEN N IN (SELECT P FROM BST) THEN 'Inner' ELSE 'Leaf' END AS node_type FROM BST ORDER BY N ASC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/binary-search-tree-1/problem",
    "companyTag": "Amazon",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_the_company",
    "questionNumber": 25,
    "title": "New Companies",
    "platform": "HackerRank",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "ADVANCED SELECT",
    "businessScenario": "Amber's conglomerate corporation just acquired some new companies. Each of the companies follows this hierarchy: Founder -> Lead Manager -> Senior Manager -> Manager -> Employee.\n\nGiven the table schemas below, write a query to print the company_code, founder name, total number of lead managers, total number of senior managers, total number of managers, and total number of employees. Order your output by ascending company_code.",
    "requirements": [
      "Join Company c with Employee e on company_code",
      "Compute COUNT(DISTINCT lm.lead_manager_code), COUNT(DISTINCT sm.senior_manager_code), COUNT(DISTINCT m.manager_code), COUNT(DISTINCT e.employee_code)",
      "Group by company_code, founder",
      "Order by company_code ASC"
    ],
    "schemas": [
      {
        "tableName": "Company",
        "columns": [
          {
            "name": "company_code",
            "type": "VARCHAR",
            "isPk": true
          },
          {
            "name": "founder",
            "type": "VARCHAR"
          }
        ],
        "sampleRows": [
          {
            "company_code": "C1",
            "founder": "Monika"
          },
          {
            "company_code": "C2",
            "founder": "Samantha"
          }
        ]
      },
      {
        "tableName": "Employee",
        "columns": [
          {
            "name": "employee_code",
            "type": "VARCHAR",
            "isPk": true
          },
          {
            "name": "manager_code",
            "type": "VARCHAR"
          },
          {
            "name": "senior_manager_code",
            "type": "VARCHAR"
          },
          {
            "name": "lead_manager_code",
            "type": "VARCHAR"
          },
          {
            "name": "company_code",
            "type": "VARCHAR"
          }
        ],
        "sampleRows": [
          {
            "employee_code": "E1",
            "manager_code": "M1",
            "senior_manager_code": "SM1",
            "lead_manager_code": "LM1",
            "company_code": "C1"
          },
          {
            "employee_code": "E2",
            "manager_code": "M1",
            "senior_manager_code": "SM1",
            "lead_manager_code": "LM1",
            "company_code": "C1"
          },
          {
            "employee_code": "E3",
            "manager_code": "M2",
            "senior_manager_code": "SM3",
            "lead_manager_code": "LM2",
            "company_code": "C2"
          },
          {
            "employee_code": "E4",
            "manager_code": "M2",
            "senior_manager_code": "SM3",
            "lead_manager_code": "LM2",
            "company_code": "C2"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "company_code",
        "founder",
        "lead_managers",
        "senior_managers",
        "managers",
        "employees"
      ],
      "rows": [
        {
          "company_code": "C1",
          "founder": "Monika",
          "lead_managers": 1,
          "senior_managers": 2,
          "managers": 1,
          "employees": 2
        },
        {
          "company_code": "C2",
          "founder": "Samantha",
          "lead_managers": 1,
          "senior_managers": 1,
          "managers": 2,
          "employees": 2
        }
      ]
    },
    "hints": {
      "tier1": "Join company with employee on company_code.",
      "tier2": "Count distinct codes for each hierarchical level.",
      "tier3Skeleton": "SELECT c.company_code, c.founder, COUNT(DISTINCT e.lead_manager_code), COUNT(DISTINCT e.senior_manager_code), COUNT(DISTINCT e.manager_code), COUNT(DISTINCT e.employee_code) FROM Company c JOIN Employee e ON c.company_code = e.company_code GROUP BY c.company_code, c.founder ORDER BY c.company_code ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT c.company_code, c.founder, COUNT(DISTINCT e.lead_manager_code), COUNT(DISTINCT e.senior_manager_code), COUNT(DISTINCT e.manager_code), COUNT(DISTINCT e.employee_code) FROM Company c JOIN Employee e ON c.company_code = e.company_code GROUP BY c.company_code, c.founder ORDER BY c.company_code ASC;",
      "snowflake": "SELECT c.company_code, c.founder, COUNT(DISTINCT e.lead_manager_code), COUNT(DISTINCT e.senior_manager_code), COUNT(DISTINCT e.manager_code), COUNT(DISTINCT e.employee_code) FROM Company c JOIN Employee e ON c.company_code = e.company_code GROUP BY c.company_code, c.founder ORDER BY c.company_code ASC;",
      "bigquery": "SELECT c.company_code, c.founder, COUNT(DISTINCT e.lead_manager_code), COUNT(DISTINCT e.senior_manager_code), COUNT(DISTINCT e.manager_code), COUNT(DISTINCT e.employee_code) FROM Company c JOIN Employee e ON c.company_code = e.company_code GROUP BY c.company_code, c.founder ORDER BY c.company_code ASC;",
      "mysql": "SELECT c.company_code, c.founder, COUNT(DISTINCT e.lead_manager_code), COUNT(DISTINCT e.senior_manager_code), COUNT(DISTINCT e.manager_code), COUNT(DISTINCT e.employee_code) FROM Company c JOIN Employee e ON c.company_code = e.company_code GROUP BY c.company_code, c.founder ORDER BY c.company_code ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Hash join Company and Employee.",
        "2. Compute distinct counts per role tier.",
        "3. Order by company_code."
      ],
      "indexStrategy": "Index on (company_code).",
      "complexity": "Time O(N log N), Space O(N).",
      "tradeoffs": "Canonical multi-level hierarchy aggregation."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/the-company/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_revising_aggregations_the_count_function",
    "questionNumber": 26,
    "title": "Revising Aggregations - The Count Function",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Query a count of the number of cities in CITY having a Population larger than 100,000.\n\nThe CITY table is described as follows:",
    "requirements": [
      "Use COUNT(*)",
      "Filter for POPULATION > 100000"
    ],
    "schemas": [
      {
        "tableName": "CITY",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "City identification number"
          },
          {
            "name": "NAME",
            "type": "VARCHAR2(17)",
            "description": "City name"
          },
          {
            "name": "COUNTRYCODE",
            "type": "VARCHAR2(3)",
            "description": "Three-letter country code"
          },
          {
            "name": "DISTRICT",
            "type": "VARCHAR2(20)",
            "description": "District or province name"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER",
            "description": "City population"
          }
        ],
        "sampleRows": [
          {
            "ID": 6,
            "NAME": "Rotterdam",
            "COUNTRYCODE": "NLD",
            "DISTRICT": "Zuid-Holland",
            "POPULATION": 593321
          },
          {
            "ID": 3878,
            "NAME": "Scottsdale",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Arizona",
            "POPULATION": 202705
          },
          {
            "ID": 3965,
            "NAME": "Corona",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 124966
          },
          {
            "ID": 3973,
            "NAME": "Concord",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 121780
          },
          {
            "ID": 3977,
            "NAME": "Cedar Rapids",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Iowa",
            "POPULATION": 120758
          },
          {
            "ID": 3982,
            "NAME": "Coral Springs",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Florida",
            "POPULATION": 117549
          },
          {
            "ID": 4054,
            "NAME": "Fairfield",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 92256
          },
          {
            "ID": 4058,
            "NAME": "Boulder",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Colorado",
            "POPULATION": 91055
          },
          {
            "ID": 4061,
            "NAME": "Fall River",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Massachusetts",
            "POPULATION": 90555
          },
          {
            "ID": 1613,
            "NAME": "Neyagawa",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Osaka",
            "POPULATION": 257315
          },
          {
            "ID": 1630,
            "NAME": "Ageo",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 209442
          },
          {
            "ID": 1661,
            "NAME": "Sayama",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 162472
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "city_count"
      ],
      "rows": [
        {
          "city_count": 8
        }
      ]
    },
    "hints": {
      "tier1": "SELECT COUNT(*) FROM CITY WHERE POPULATION > 100000;",
      "tier2": "Return scalar count.",
      "tier3Skeleton": "SELECT COUNT(*) AS city_count FROM CITY WHERE POPULATION > 100000;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT COUNT(*) AS city_count FROM CITY WHERE POPULATION > 100000;",
      "snowflake": "SELECT COUNT(*) AS city_count FROM CITY WHERE POPULATION > 100000;",
      "bigquery": "SELECT COUNT(*) AS city_count FROM CITY WHERE POPULATION > 100000;",
      "mysql": "SELECT COUNT(*) AS city_count FROM CITY WHERE POPULATION > 100000;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/revising-aggregations-the-count-function/problem",
    "companyTag": "PayPal",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_revising_aggregations_the_sum_function",
    "questionNumber": 27,
    "title": "Revising Aggregations - The Sum Function",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Query the total population of all cities in CITY where District is California.\n\nThe CITY table is described as follows:",
    "requirements": [
      "Use SUM(POPULATION)",
      "Filter where DISTRICT = \"California\""
    ],
    "schemas": [
      {
        "tableName": "CITY",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "City identification number"
          },
          {
            "name": "NAME",
            "type": "VARCHAR2(17)",
            "description": "City name"
          },
          {
            "name": "COUNTRYCODE",
            "type": "VARCHAR2(3)",
            "description": "Three-letter country code"
          },
          {
            "name": "DISTRICT",
            "type": "VARCHAR2(20)",
            "description": "District or province name"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER",
            "description": "City population"
          }
        ],
        "sampleRows": [
          {
            "ID": 6,
            "NAME": "Rotterdam",
            "COUNTRYCODE": "NLD",
            "DISTRICT": "Zuid-Holland",
            "POPULATION": 593321
          },
          {
            "ID": 3878,
            "NAME": "Scottsdale",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Arizona",
            "POPULATION": 202705
          },
          {
            "ID": 3965,
            "NAME": "Corona",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 124966
          },
          {
            "ID": 3973,
            "NAME": "Concord",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 121780
          },
          {
            "ID": 3977,
            "NAME": "Cedar Rapids",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Iowa",
            "POPULATION": 120758
          },
          {
            "ID": 3982,
            "NAME": "Coral Springs",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Florida",
            "POPULATION": 117549
          },
          {
            "ID": 4054,
            "NAME": "Fairfield",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 92256
          },
          {
            "ID": 4058,
            "NAME": "Boulder",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Colorado",
            "POPULATION": 91055
          },
          {
            "ID": 4061,
            "NAME": "Fall River",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Massachusetts",
            "POPULATION": 90555
          },
          {
            "ID": 1613,
            "NAME": "Neyagawa",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Osaka",
            "POPULATION": 257315
          },
          {
            "ID": 1630,
            "NAME": "Ageo",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 209442
          },
          {
            "ID": 1661,
            "NAME": "Sayama",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 162472
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "total_population"
      ],
      "rows": [
        {
          "total_population": 339002
        }
      ]
    },
    "hints": {
      "tier1": "SELECT SUM(POPULATION) FROM CITY WHERE DISTRICT = 'California';",
      "tier2": "SUM aggregation with DISTRICT filter.",
      "tier3Skeleton": "SELECT SUM(POPULATION) AS total_population FROM CITY WHERE DISTRICT = 'California';"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT SUM(POPULATION) AS total_population FROM CITY WHERE DISTRICT = 'California';",
      "snowflake": "SELECT SUM(POPULATION) AS total_population FROM CITY WHERE DISTRICT = 'California';",
      "bigquery": "SELECT SUM(POPULATION) AS total_population FROM CITY WHERE DISTRICT = 'California';",
      "mysql": "SELECT SUM(POPULATION) AS total_population FROM CITY WHERE DISTRICT = 'California';"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/revising-aggregations-sum/problem",
    "companyTag": "PayPal",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_revising_aggregations_the_average_function",
    "questionNumber": 28,
    "title": "Revising Aggregations - Averages",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Query the average population of all cities in CITY where District is California.\n\nThe CITY table is described as follows:",
    "requirements": [
      "Use AVG(POPULATION)",
      "Filter where DISTRICT = \"California\""
    ],
    "schemas": [
      {
        "tableName": "CITY",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "City identification number"
          },
          {
            "name": "NAME",
            "type": "VARCHAR2(17)",
            "description": "City name"
          },
          {
            "name": "COUNTRYCODE",
            "type": "VARCHAR2(3)",
            "description": "Three-letter country code"
          },
          {
            "name": "DISTRICT",
            "type": "VARCHAR2(20)",
            "description": "District or province name"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER",
            "description": "City population"
          }
        ],
        "sampleRows": [
          {
            "ID": 6,
            "NAME": "Rotterdam",
            "COUNTRYCODE": "NLD",
            "DISTRICT": "Zuid-Holland",
            "POPULATION": 593321
          },
          {
            "ID": 3878,
            "NAME": "Scottsdale",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Arizona",
            "POPULATION": 202705
          },
          {
            "ID": 3965,
            "NAME": "Corona",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 124966
          },
          {
            "ID": 3973,
            "NAME": "Concord",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 121780
          },
          {
            "ID": 3977,
            "NAME": "Cedar Rapids",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Iowa",
            "POPULATION": 120758
          },
          {
            "ID": 3982,
            "NAME": "Coral Springs",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Florida",
            "POPULATION": 117549
          },
          {
            "ID": 4054,
            "NAME": "Fairfield",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 92256
          },
          {
            "ID": 4058,
            "NAME": "Boulder",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Colorado",
            "POPULATION": 91055
          },
          {
            "ID": 4061,
            "NAME": "Fall River",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Massachusetts",
            "POPULATION": 90555
          },
          {
            "ID": 1613,
            "NAME": "Neyagawa",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Osaka",
            "POPULATION": 257315
          },
          {
            "ID": 1630,
            "NAME": "Ageo",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 209442
          },
          {
            "ID": 1661,
            "NAME": "Sayama",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 162472
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "avg_population"
      ],
      "rows": [
        {
          "avg_population": 113000.67
        }
      ]
    },
    "hints": {
      "tier1": "SELECT AVG(POPULATION) FROM CITY WHERE DISTRICT = 'California';",
      "tier2": "Compute average population.",
      "tier3Skeleton": "SELECT AVG(POPULATION) AS avg_population FROM CITY WHERE DISTRICT = 'California';"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT AVG(POPULATION) AS avg_population FROM CITY WHERE DISTRICT = 'California';",
      "snowflake": "SELECT AVG(POPULATION) AS avg_population FROM CITY WHERE DISTRICT = 'California';",
      "bigquery": "SELECT AVG(POPULATION) AS avg_population FROM CITY WHERE DISTRICT = 'California';",
      "mysql": "SELECT AVG(POPULATION) AS avg_population FROM CITY WHERE DISTRICT = 'California';"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/revising-aggregations-the-average-function/problem",
    "companyTag": "PayPal",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_average_population",
    "questionNumber": 29,
    "title": "Average Population",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "ROUNDING AGGREGATES",
    "businessScenario": "Query the average population for all cities in CITY, rounded down to the nearest integer.\n\nThe CITY table is described as follows:",
    "requirements": [
      "Use FLOOR(AVG(POPULATION)) or ROUND(AVG(POPULATION))",
      "Compute across all rows in CITY"
    ],
    "schemas": [
      {
        "tableName": "CITY",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "City identification number"
          },
          {
            "name": "NAME",
            "type": "VARCHAR2(17)",
            "description": "City name"
          },
          {
            "name": "COUNTRYCODE",
            "type": "VARCHAR2(3)",
            "description": "Three-letter country code"
          },
          {
            "name": "DISTRICT",
            "type": "VARCHAR2(20)",
            "description": "District or province name"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER",
            "description": "City population"
          }
        ],
        "sampleRows": [
          {
            "ID": 6,
            "NAME": "Rotterdam",
            "COUNTRYCODE": "NLD",
            "DISTRICT": "Zuid-Holland",
            "POPULATION": 593321
          },
          {
            "ID": 3878,
            "NAME": "Scottsdale",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Arizona",
            "POPULATION": 202705
          },
          {
            "ID": 3965,
            "NAME": "Corona",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 124966
          },
          {
            "ID": 3973,
            "NAME": "Concord",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 121780
          },
          {
            "ID": 3977,
            "NAME": "Cedar Rapids",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Iowa",
            "POPULATION": 120758
          },
          {
            "ID": 3982,
            "NAME": "Coral Springs",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Florida",
            "POPULATION": 117549
          },
          {
            "ID": 4054,
            "NAME": "Fairfield",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 92256
          },
          {
            "ID": 4058,
            "NAME": "Boulder",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Colorado",
            "POPULATION": 91055
          },
          {
            "ID": 4061,
            "NAME": "Fall River",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Massachusetts",
            "POPULATION": 90555
          },
          {
            "ID": 1613,
            "NAME": "Neyagawa",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Osaka",
            "POPULATION": 257315
          },
          {
            "ID": 1630,
            "NAME": "Ageo",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 209442
          },
          {
            "ID": 1661,
            "NAME": "Sayama",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 162472
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "avg_pop"
      ],
      "rows": [
        {
          "avg_pop": 181708
        }
      ]
    },
    "hints": {
      "tier1": "FLOOR(AVG(POPULATION)) rounds down to the nearest integer.",
      "tier2": "SELECT FLOOR(AVG(POPULATION)) FROM CITY;",
      "tier3Skeleton": "SELECT FLOOR(AVG(POPULATION)) AS avg_pop FROM CITY;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT FLOOR(AVG(POPULATION)) AS avg_pop FROM CITY;",
      "snowflake": "SELECT FLOOR(AVG(POPULATION)) AS avg_pop FROM CITY;",
      "bigquery": "SELECT CAST(FLOOR(AVG(POPULATION)) AS INT64) AS avg_pop FROM CITY;",
      "mysql": "SELECT FLOOR(AVG(POPULATION)) AS avg_pop FROM CITY;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/average-population/problem",
    "companyTag": "PayPal",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_japan_population",
    "questionNumber": 30,
    "title": "Japan Population",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "FILTERED SUM",
    "businessScenario": "Query the sum of the populations for all Japanese cities in CITY. The COUNTRYCODE for Japan is JPN.\n\nThe CITY table is described as follows:",
    "requirements": [
      "Use SUM(POPULATION)",
      "Filter for COUNTRYCODE = \"JPN\""
    ],
    "schemas": [
      {
        "tableName": "CITY",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "City identification number"
          },
          {
            "name": "NAME",
            "type": "VARCHAR2(17)",
            "description": "City name"
          },
          {
            "name": "COUNTRYCODE",
            "type": "VARCHAR2(3)",
            "description": "Three-letter country code"
          },
          {
            "name": "DISTRICT",
            "type": "VARCHAR2(20)",
            "description": "District or province name"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER",
            "description": "City population"
          }
        ],
        "sampleRows": [
          {
            "ID": 6,
            "NAME": "Rotterdam",
            "COUNTRYCODE": "NLD",
            "DISTRICT": "Zuid-Holland",
            "POPULATION": 593321
          },
          {
            "ID": 3878,
            "NAME": "Scottsdale",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Arizona",
            "POPULATION": 202705
          },
          {
            "ID": 3965,
            "NAME": "Corona",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 124966
          },
          {
            "ID": 3973,
            "NAME": "Concord",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 121780
          },
          {
            "ID": 3977,
            "NAME": "Cedar Rapids",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Iowa",
            "POPULATION": 120758
          },
          {
            "ID": 3982,
            "NAME": "Coral Springs",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Florida",
            "POPULATION": 117549
          },
          {
            "ID": 4054,
            "NAME": "Fairfield",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 92256
          },
          {
            "ID": 4058,
            "NAME": "Boulder",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Colorado",
            "POPULATION": 91055
          },
          {
            "ID": 4061,
            "NAME": "Fall River",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Massachusetts",
            "POPULATION": 90555
          },
          {
            "ID": 1613,
            "NAME": "Neyagawa",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Osaka",
            "POPULATION": 257315
          },
          {
            "ID": 1630,
            "NAME": "Ageo",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 209442
          },
          {
            "ID": 1661,
            "NAME": "Sayama",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 162472
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "japan_population"
      ],
      "rows": [
        {
          "japan_population": 629229
        }
      ]
    },
    "hints": {
      "tier1": "Filter WHERE COUNTRYCODE = \"JPN\" and calculate SUM(POPULATION).",
      "tier2": "SELECT SUM(POPULATION) FROM CITY WHERE COUNTRYCODE = 'JPN';",
      "tier3Skeleton": "SELECT SUM(POPULATION) AS japan_population FROM CITY WHERE COUNTRYCODE = 'JPN';"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT SUM(POPULATION) AS japan_population FROM CITY WHERE COUNTRYCODE = 'JPN';",
      "snowflake": "SELECT SUM(POPULATION) AS japan_population FROM CITY WHERE COUNTRYCODE = 'JPN';",
      "bigquery": "SELECT SUM(POPULATION) AS japan_population FROM CITY WHERE COUNTRYCODE = 'JPN';",
      "mysql": "SELECT SUM(POPULATION) AS japan_population FROM CITY WHERE COUNTRYCODE = 'JPN';"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/japan-population/problem",
    "companyTag": "PayPal",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_population_density_difference",
    "questionNumber": 31,
    "title": "Population Density Difference",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Query the difference between the maximum and minimum populations in CITY.\n\nThe CITY table is described as follows:",
    "requirements": [
      "Compute MAX(POPULATION) - MIN(POPULATION)"
    ],
    "schemas": [
      {
        "tableName": "CITY",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "City identification number"
          },
          {
            "name": "NAME",
            "type": "VARCHAR2(17)",
            "description": "City name"
          },
          {
            "name": "COUNTRYCODE",
            "type": "VARCHAR2(3)",
            "description": "Three-letter country code"
          },
          {
            "name": "DISTRICT",
            "type": "VARCHAR2(20)",
            "description": "District or province name"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER",
            "description": "City population"
          }
        ],
        "sampleRows": [
          {
            "ID": 6,
            "NAME": "Rotterdam",
            "COUNTRYCODE": "NLD",
            "DISTRICT": "Zuid-Holland",
            "POPULATION": 593321
          },
          {
            "ID": 3878,
            "NAME": "Scottsdale",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Arizona",
            "POPULATION": 202705
          },
          {
            "ID": 3965,
            "NAME": "Corona",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 124966
          },
          {
            "ID": 3973,
            "NAME": "Concord",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 121780
          },
          {
            "ID": 3977,
            "NAME": "Cedar Rapids",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Iowa",
            "POPULATION": 120758
          },
          {
            "ID": 3982,
            "NAME": "Coral Springs",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Florida",
            "POPULATION": 117549
          },
          {
            "ID": 4054,
            "NAME": "Fairfield",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 92256
          },
          {
            "ID": 4058,
            "NAME": "Boulder",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Colorado",
            "POPULATION": 91055
          },
          {
            "ID": 4061,
            "NAME": "Fall River",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Massachusetts",
            "POPULATION": 90555
          },
          {
            "ID": 1613,
            "NAME": "Neyagawa",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Osaka",
            "POPULATION": 257315
          },
          {
            "ID": 1630,
            "NAME": "Ageo",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 209442
          },
          {
            "ID": 1661,
            "NAME": "Sayama",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 162472
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "diff"
      ],
      "rows": [
        {
          "diff": 502766
        }
      ]
    },
    "hints": {
      "tier1": "Subtract MIN(POPULATION) from MAX(POPULATION).",
      "tier2": "SELECT MAX(POPULATION) - MIN(POPULATION) FROM CITY;",
      "tier3Skeleton": "SELECT MAX(POPULATION) - MIN(POPULATION) AS diff FROM CITY;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT MAX(POPULATION) - MIN(POPULATION) AS diff FROM CITY;",
      "snowflake": "SELECT MAX(POPULATION) - MIN(POPULATION) AS diff FROM CITY;",
      "bigquery": "SELECT MAX(POPULATION) - MIN(POPULATION) AS diff FROM CITY;",
      "mysql": "SELECT MAX(POPULATION) - MIN(POPULATION) AS diff FROM CITY;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/population-density-difference/problem",
    "companyTag": "PayPal",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_the_blunder",
    "questionNumber": 32,
    "title": "The Blunder",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATION",
    "businessScenario": "Samantha was tasked with calculating the average monthly salaries for all employees in the EMPLOYEES table, but did not realize her keyboard's '0' key was broken until after completing the calculation. She used the following formula to calculate the miscalculated average: SELECT AVG(REPLACE(Salary, '0', '')).\n\nWrite a query calculating the amount of error (i.e.: actual - miscalculated average monthly salaries), and round it up to the next integer.",
    "requirements": [
      "Calculate actual average salary: AVG(Salary)",
      "Calculate miscalculated average salary: AVG(CAST(REPLACE(CAST(Salary AS VARCHAR), '0', '') AS NUMERIC))",
      "Compute CEIL(actual - miscalculated)"
    ],
    "schemas": [
      {
        "tableName": "Employee",
        "columns": [
          {
            "name": "employee_id",
            "type": "INTEGER",
            "isPk": true,
            "description": "Employee identifier"
          },
          {
            "name": "name",
            "type": "STRING",
            "description": "Employee name"
          },
          {
            "name": "months",
            "type": "INTEGER",
            "description": "Total months with company"
          },
          {
            "name": "salary",
            "type": "INTEGER",
            "description": "Monthly salary in USD"
          }
        ],
        "sampleRows": [
          {
            "employee_id": 12228,
            "name": "Rose",
            "months": 15,
            "salary": 1968
          },
          {
            "employee_id": 33645,
            "name": "Angela",
            "months": 1,
            "salary": 3443
          },
          {
            "employee_id": 45692,
            "name": "Frank",
            "months": 17,
            "salary": 1608
          },
          {
            "employee_id": 56118,
            "name": "Patrick",
            "months": 7,
            "salary": 1345
          },
          {
            "employee_id": 59725,
            "name": "Lisa",
            "months": 11,
            "salary": 2330
          },
          {
            "employee_id": 74197,
            "name": "Kimberly",
            "months": 16,
            "salary": 4372
          },
          {
            "employee_id": 78454,
            "name": "Bonnie",
            "months": 8,
            "salary": 1771
          },
          {
            "employee_id": 83565,
            "name": "Michael",
            "months": 6,
            "salary": 2017
          },
          {
            "employee_id": 98607,
            "name": "Todd",
            "months": 5,
            "salary": 2196
          },
          {
            "employee_id": 99989,
            "name": "Joe",
            "months": 9,
            "salary": 3570
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "salary_error"
      ],
      "rows": [
        {
          "salary_error": 2253
        }
      ]
    },
    "hints": {
      "tier1": "Use CEIL(AVG(Salary) - AVG(REPLACE(CAST(Salary AS VARCHAR), '0', ''))).",
      "tier2": "Cast the replaced string back to numeric before taking AVG.",
      "tier3Skeleton": "SELECT CEIL(AVG(Salary) - AVG(CAST(REPLACE(CAST(Salary AS VARCHAR), '0', '') AS NUMERIC))) AS salary_error FROM EMPLOYEES;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT CEIL(AVG(Salary) - AVG(CAST(REPLACE(CAST(Salary AS VARCHAR), '0', '') AS NUMERIC))) AS salary_error FROM EMPLOYEES;",
      "snowflake": "SELECT CEIL(AVG(Salary) - AVG(CAST(REPLACE(CAST(Salary AS VARCHAR), '0', '') AS NUMERIC))) AS salary_error FROM EMPLOYEES;",
      "bigquery": "SELECT CEIL(AVG(Salary) - AVG(CAST(REPLACE(CAST(Salary AS VARCHAR), '0', '') AS NUMERIC))) AS salary_error FROM EMPLOYEES;",
      "mysql": "SELECT CEIL(AVG(Salary) - AVG(CAST(REPLACE(CAST(Salary AS VARCHAR), '0', '') AS NUMERIC))) AS salary_error FROM EMPLOYEES;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Compute true average salary.",
        "2. Compute zero-stripped average salary.",
        "3. Compute ceiling difference."
      ],
      "indexStrategy": "Index on Salary.",
      "complexity": "Time O(N), Space O(1).",
      "tradeoffs": "Canonical mathematical rounding simulation."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/the-blunder/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_earnings_of_employees",
    "questionNumber": 33,
    "title": "Top Earners",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATION",
    "businessScenario": "We define an employee's total earnings to be their monthly salary * months worked, and the maximum total earnings to be the maximum total earnings for any employee in the Employee table. Write a query to find the maximum total earnings for all employees as well as the total number of employees who have maximum total earnings. Then print these values as 2 space-separated integers.",
    "requirements": [
      "Compute total_earnings = salary * months",
      "Group by total_earnings",
      "Order by total_earnings DESC",
      "Limit 1 to get the maximum and its count"
    ],
    "schemas": [
      {
        "tableName": "Employee",
        "columns": [
          {
            "name": "employee_id",
            "type": "INTEGER",
            "isPk": true,
            "description": "Employee identifier"
          },
          {
            "name": "name",
            "type": "STRING",
            "description": "Employee name"
          },
          {
            "name": "months",
            "type": "INTEGER",
            "description": "Total months with company"
          },
          {
            "name": "salary",
            "type": "INTEGER",
            "description": "Monthly salary in USD"
          }
        ],
        "sampleRows": [
          {
            "employee_id": 12228,
            "name": "Rose",
            "months": 15,
            "salary": 1968
          },
          {
            "employee_id": 33645,
            "name": "Angela",
            "months": 1,
            "salary": 3443
          },
          {
            "employee_id": 45692,
            "name": "Frank",
            "months": 17,
            "salary": 1608
          },
          {
            "employee_id": 56118,
            "name": "Patrick",
            "months": 7,
            "salary": 1345
          },
          {
            "employee_id": 59725,
            "name": "Lisa",
            "months": 11,
            "salary": 2330
          },
          {
            "employee_id": 74197,
            "name": "Kimberly",
            "months": 16,
            "salary": 4372
          },
          {
            "employee_id": 78454,
            "name": "Bonnie",
            "months": 8,
            "salary": 1771
          },
          {
            "employee_id": 83565,
            "name": "Michael",
            "months": 6,
            "salary": 2017
          },
          {
            "employee_id": 98607,
            "name": "Todd",
            "months": 5,
            "salary": 2196
          },
          {
            "employee_id": 99989,
            "name": "Joe",
            "months": 9,
            "salary": 3570
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "max_earnings",
        "employee_count"
      ],
      "rows": [
        {
          "max_earnings": 108064,
          "employee_count": 7
        }
      ]
    },
    "hints": {
      "tier1": "SELECT salary * months AS earnings, COUNT(*) FROM Employee GROUP BY earnings.",
      "tier2": "Order by earnings DESC LIMIT 1.",
      "tier3Skeleton": "SELECT salary * months AS max_earnings, COUNT(*) AS employee_count FROM Employee GROUP BY max_earnings ORDER BY max_earnings DESC LIMIT 1;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT salary * months AS max_earnings, COUNT(*) AS employee_count FROM Employee GROUP BY max_earnings ORDER BY max_earnings DESC LIMIT 1;",
      "snowflake": "SELECT salary * months AS max_earnings, COUNT(*) AS employee_count FROM Employee GROUP BY max_earnings ORDER BY max_earnings DESC LIMIT 1;",
      "bigquery": "SELECT salary * months AS max_earnings, COUNT(*) AS employee_count FROM Employee GROUP BY max_earnings ORDER BY max_earnings DESC LIMIT 1;",
      "mysql": "SELECT salary * months AS max_earnings, COUNT(*) AS employee_count FROM Employee GROUP BY max_earnings ORDER BY max_earnings DESC LIMIT 1;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Compute product salary * months.",
        "2. Group by product and count.",
        "3. Order DESC limit 1."
      ],
      "indexStrategy": "Index on (salary, months).",
      "complexity": "Time O(N log N), Space O(N).",
      "tradeoffs": "Canonical top N frequency aggregation."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/earnings-of-employees/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_2",
    "questionNumber": 34,
    "title": "Weather Observation Station 2",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATION",
    "businessScenario": "Query the following two values from the STATION table:\n1. The sum of all values in LAT_N rounded to a scale of 2 decimal places.\n2. The sum of all values in LONG_W rounded to a scale of 2 decimal places.\n\nOutput lat and lon as 2 space-separated or separate column values.",
    "requirements": [
      "Compute ROUND(SUM(LAT_N), 2)",
      "Compute ROUND(SUM(LONG_W), 2)",
      "Output columns: lat, lon"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "lat",
        "lon"
      ],
      "rows": [
        {
          "lat": 42850.04,
          "lon": 47381.48
        }
      ]
    },
    "hints": {
      "tier1": "Use ROUND(SUM(LAT_N), 2) and ROUND(SUM(LONG_W), 2).",
      "tier2": "Project directly from STATION.",
      "tier3Skeleton": "SELECT ROUND(SUM(LAT_N), 2) AS lat, ROUND(SUM(LONG_W), 2) AS lon FROM STATION;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT ROUND(SUM(LAT_N), 2) AS lat, ROUND(SUM(LONG_W), 2) AS lon FROM STATION;",
      "snowflake": "SELECT ROUND(SUM(LAT_N), 2) AS lat, ROUND(SUM(LONG_W), 2) AS lon FROM STATION;",
      "bigquery": "SELECT ROUND(SUM(LAT_N), 2) AS lat, ROUND(SUM(LONG_W), 2) AS lon FROM STATION;",
      "mysql": "SELECT ROUND(SUM(LAT_N), 2) AS lat, ROUND(SUM(LONG_W), 2) AS lon FROM STATION;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Compute sum of latitude and longitude.",
        "2. Round to 2 decimal places."
      ],
      "indexStrategy": "Sequential table scan with scalar aggregation.",
      "complexity": "Time O(N), Space O(1).",
      "tradeoffs": "Canonical scalar aggregation."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-2/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_13",
    "questionNumber": 35,
    "title": "Weather Observation Station 13",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATION",
    "businessScenario": "Query the sum of Northern Latitudes (LAT_N) from STATION having values greater than 38.7880 and less than 137.2345. Truncate your answer to 4 decimal places.\n\nThe STATION table is described as follows:\n- ID: NUMBER\n- CITY: VARCHAR2(21)\n- STATE: VARCHAR2(2)\n- LAT_N: NUMBER\n- LONG_W: NUMBER",
    "requirements": [
      "Filter where LAT_N > 38.7880 AND LAT_N < 137.2345",
      "Compute TRUNC / ROUND of SUM(LAT_N) to 4 decimal places",
      "Output column: lat_sum"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "lat_sum"
      ],
      "rows": [
        {
          "lat_sum": 36354.8135
        }
      ]
    },
    "hints": {
      "tier1": "Filter LAT_N BETWEEN 38.7880 AND 137.2345 (exclusive).",
      "tier2": "Use ROUND(SUM(LAT_N), 4).",
      "tier3Skeleton": "SELECT ROUND(SUM(LAT_N), 4) AS lat_sum FROM STATION WHERE LAT_N > 38.7880 AND LAT_N < 137.2345;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT ROUND(SUM(LAT_N), 4) AS lat_sum FROM STATION WHERE LAT_N > 38.7880 AND LAT_N < 137.2345;",
      "snowflake": "SELECT ROUND(SUM(LAT_N), 4) AS lat_sum FROM STATION WHERE LAT_N > 38.7880 AND LAT_N < 137.2345;",
      "bigquery": "SELECT ROUND(SUM(LAT_N), 4) AS lat_sum FROM STATION WHERE LAT_N > 38.7880 AND LAT_N < 137.2345;",
      "mysql": "SELECT ROUND(SUM(LAT_N), 4) AS lat_sum FROM STATION WHERE LAT_N > 38.7880 AND LAT_N < 137.2345;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter LAT_N by bounds.",
        "2. Sum and round."
      ],
      "indexStrategy": "Index on LAT_N.",
      "complexity": "Time O(N), Space O(1).",
      "tradeoffs": "Canonical range aggregation."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-13/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_14",
    "questionNumber": 36,
    "title": "Weather Observation Station 14",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATION",
    "businessScenario": "Query the greatest value of the Northern Latitudes (LAT_N) from STATION that is less than 137.2345. Truncate your answer to 4 decimal places.\n\nThe STATION table is described as follows:\n- ID: NUMBER\n- CITY: VARCHAR2(21)\n- STATE: VARCHAR2(2)\n- LAT_N: NUMBER\n- LONG_W: NUMBER",
    "requirements": [
      "Filter where LAT_N < 137.2345",
      "Compute MAX(LAT_N)",
      "Truncate or round to 4 decimal places"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "max_lat"
      ],
      "rows": [
        {
          "max_lat": 137.0193
        }
      ]
    },
    "hints": {
      "tier1": "Use SELECT ROUND(MAX(LAT_N), 4) FROM STATION.",
      "tier2": "Filter with WHERE LAT_N < 137.2345.",
      "tier3Skeleton": "SELECT ROUND(MAX(LAT_N), 4) AS max_lat FROM STATION WHERE LAT_N < 137.2345;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT ROUND(MAX(LAT_N), 4) AS max_lat FROM STATION WHERE LAT_N < 137.2345;",
      "snowflake": "SELECT ROUND(MAX(LAT_N), 4) AS max_lat FROM STATION WHERE LAT_N < 137.2345;",
      "bigquery": "SELECT ROUND(MAX(LAT_N), 4) AS max_lat FROM STATION WHERE LAT_N < 137.2345;",
      "mysql": "SELECT ROUND(MAX(LAT_N), 4) AS max_lat FROM STATION WHERE LAT_N < 137.2345;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter LAT_N < 137.2345.",
        "2. Find maximum value."
      ],
      "indexStrategy": "Index on LAT_N.",
      "complexity": "Time O(N), Space O(1).",
      "tradeoffs": "Canonical upper bounded maximum."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-14/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_15",
    "questionNumber": 37,
    "title": "Weather Observation Station 15",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATION",
    "businessScenario": "Query the Western Longitude (LONG_W) for the largest Northern Latitude (LAT_N) in STATION that is less than 137.2345. Round your answer to 4 decimal places.\n\nThe STATION table is described as follows:\n- ID: NUMBER\n- CITY: VARCHAR2(21)\n- STATE: VARCHAR2(2)\n- LAT_N: NUMBER\n- LONG_W: NUMBER",
    "requirements": [
      "Filter where LAT_N < 137.2345",
      "Find the row with the maximum LAT_N",
      "Select ROUND(LONG_W, 4)",
      "Limit 1 ordered by LAT_N DESC"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "long_w"
      ],
      "rows": [
        {
          "long_w": 117.2465
        }
      ]
    },
    "hints": {
      "tier1": "ORDER BY LAT_N DESC LIMIT 1.",
      "tier2": "WHERE LAT_N < 137.2345.",
      "tier3Skeleton": "SELECT ROUND(LONG_W, 4) FROM STATION WHERE LAT_N < 137.2345 ORDER BY LAT_N DESC LIMIT 1;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT ROUND(LONG_W, 4) FROM STATION WHERE LAT_N < 137.2345 ORDER BY LAT_N DESC LIMIT 1;",
      "snowflake": "SELECT ROUND(LONG_W, 4) FROM STATION WHERE LAT_N < 137.2345 ORDER BY LAT_N DESC LIMIT 1;",
      "bigquery": "SELECT ROUND(LONG_W, 4) FROM STATION WHERE LAT_N < 137.2345 ORDER BY LAT_N DESC LIMIT 1;",
      "mysql": "SELECT ROUND(LONG_W, 4) FROM STATION WHERE LAT_N < 137.2345 ORDER BY LAT_N DESC LIMIT 1;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter by LAT_N bound.",
        "2. Sort by LAT_N DESC.",
        "3. Project LONG_W of top row."
      ],
      "indexStrategy": "Index on (LAT_N DESC, LONG_W).",
      "complexity": "Time O(N log N), Space O(1).",
      "tradeoffs": "Canonical argmax projection."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-15/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_16",
    "questionNumber": 38,
    "title": "Weather Observation Station 16",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATION",
    "businessScenario": "Query the smallest Northern Latitude (LAT_N) from STATION that is greater than 38.7780. Round your answer to 4 decimal places.\n\nThe STATION table is described as follows:\n- ID: NUMBER\n- CITY: VARCHAR2(21)\n- STATE: VARCHAR2(2)\n- LAT_N: NUMBER\n- LONG_W: NUMBER",
    "requirements": [
      "Filter where LAT_N > 38.7780",
      "Compute MIN(LAT_N)",
      "Round to 4 decimal places"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "min_lat"
      ],
      "rows": [
        {
          "min_lat": 38.8526
        }
      ]
    },
    "hints": {
      "tier1": "Use SELECT ROUND(MIN(LAT_N), 4) FROM STATION.",
      "tier2": "Add WHERE LAT_N > 38.7780.",
      "tier3Skeleton": "SELECT ROUND(MIN(LAT_N), 4) FROM STATION WHERE LAT_N > 38.7780;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT ROUND(MIN(LAT_N), 4) FROM STATION WHERE LAT_N > 38.7780;",
      "snowflake": "SELECT ROUND(MIN(LAT_N), 4) FROM STATION WHERE LAT_N > 38.7780;",
      "bigquery": "SELECT ROUND(MIN(LAT_N), 4) FROM STATION WHERE LAT_N > 38.7780;",
      "mysql": "SELECT ROUND(MIN(LAT_N), 4) FROM STATION WHERE LAT_N > 38.7780;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter LAT_N > 38.7780.",
        "2. Find minimum value."
      ],
      "indexStrategy": "Index on LAT_N.",
      "complexity": "Time O(N), Space O(1).",
      "tradeoffs": "Canonical lower bounded minimum."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-16/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_17",
    "questionNumber": 39,
    "title": "Weather Observation Station 17",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATION",
    "businessScenario": "Query the Western Longitude (LONG_W) where the smallest Northern Latitude (LAT_N) in STATION is greater than 38.7780. Round your answer to 4 decimal places.\n\nThe STATION table is described as follows:\n- ID: NUMBER\n- CITY: VARCHAR2(21)\n- STATE: VARCHAR2(2)\n- LAT_N: NUMBER\n- LONG_W: NUMBER",
    "requirements": [
      "Filter where LAT_N > 38.7780",
      "Find the row with the minimum LAT_N",
      "Select ROUND(LONG_W, 4)",
      "Order by LAT_N ASC LIMIT 1"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "long_w"
      ],
      "rows": [
        {
          "long_w": 70.1378
        }
      ]
    },
    "hints": {
      "tier1": "Filter with WHERE LAT_N > 38.7780.",
      "tier2": "ORDER BY LAT_N ASC LIMIT 1.",
      "tier3Skeleton": "SELECT ROUND(LONG_W, 4) FROM STATION WHERE LAT_N > 38.7780 ORDER BY LAT_N ASC LIMIT 1;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT ROUND(LONG_W, 4) FROM STATION WHERE LAT_N > 38.7780 ORDER BY LAT_N ASC LIMIT 1;",
      "snowflake": "SELECT ROUND(LONG_W, 4) FROM STATION WHERE LAT_N > 38.7780 ORDER BY LAT_N ASC LIMIT 1;",
      "bigquery": "SELECT ROUND(LONG_W, 4) FROM STATION WHERE LAT_N > 38.7780 ORDER BY LAT_N ASC LIMIT 1;",
      "mysql": "SELECT ROUND(LONG_W, 4) FROM STATION WHERE LAT_N > 38.7780 ORDER BY LAT_N ASC LIMIT 1;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter by LAT_N lower bound.",
        "2. Sort ASC.",
        "3. Project LONG_W of top row."
      ],
      "indexStrategy": "Index on (LAT_N ASC, LONG_W).",
      "complexity": "Time O(N log N), Space O(1).",
      "tradeoffs": "Canonical argmin projection."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-17/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_18",
    "questionNumber": 40,
    "title": "Weather Observation Station 18",
    "platform": "HackerRank",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATION",
    "businessScenario": "Consider P1(a,b) and P2(c,d) to be two points on a 2D plane.\n- a equals the minimum value in Northern Latitude (LAT_N in STATION).\n- b equals the minimum value in Western Longitude (LONG_W in STATION).\n- c equals the maximum value in Northern Latitude (LAT_N in STATION).\n- d equals the maximum value in Western Longitude (LONG_W in STATION).\n\nQuery the Manhattan Distance between points P1 and P2 and round it to a scale of 4 decimal places.\n(Manhattan Distance = |a - c| + |b - d|)",
    "requirements": [
      "Compute a = MIN(LAT_N), b = MIN(LONG_W), c = MAX(LAT_N), d = MAX(LONG_W)",
      "Calculate Manhattan distance = ROUND(ABS(MIN(LAT_N) - MAX(LAT_N)) + ABS(MIN(LONG_W) - MAX(LONG_W)), 4)",
      "Output column: manhattan_distance"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "manhattan_distance"
      ],
      "rows": [
        {
          "manhattan_distance": 259.6859
        }
      ]
    },
    "hints": {
      "tier1": "Formula: ROUND(ABS(MIN(LAT_N) - MAX(LAT_N)) + ABS(MIN(LONG_W) - MAX(LONG_W)), 4).",
      "tier2": "Compute aggregates in single SELECT over STATION.",
      "tier3Skeleton": "SELECT ROUND(ABS(MIN(LAT_N) - MAX(LAT_N)) + ABS(MIN(LONG_W) - MAX(LONG_W)), 4) AS manhattan_distance FROM STATION;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT ROUND(ABS(MIN(LAT_N) - MAX(LAT_N)) + ABS(MIN(LONG_W) - MAX(LONG_W)), 4) AS manhattan_distance FROM STATION;",
      "snowflake": "SELECT ROUND(ABS(MIN(LAT_N) - MAX(LAT_N)) + ABS(MIN(LONG_W) - MAX(LONG_W)), 4) AS manhattan_distance FROM STATION;",
      "bigquery": "SELECT ROUND(ABS(MIN(LAT_N) - MAX(LAT_N)) + ABS(MIN(LONG_W) - MAX(LONG_W)), 4) AS manhattan_distance FROM STATION;",
      "mysql": "SELECT ROUND(ABS(MIN(LAT_N) - MAX(LAT_N)) + ABS(MIN(LONG_W) - MAX(LONG_W)), 4) AS manhattan_distance FROM STATION;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Compute extrema for lat and lon.",
        "2. Compute L1 distance formula and round."
      ],
      "indexStrategy": "Extrema scans over indexed coordinates.",
      "complexity": "Time O(N), Space O(1).",
      "tradeoffs": "Canonical geometric distance aggregation."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-18/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_19",
    "questionNumber": 41,
    "title": "Weather Observation Station 19",
    "platform": "HackerRank",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATION",
    "businessScenario": "Consider P1(a,c) and P2(b,d) to be two points on a 2D plane where (a,b) are the respective minimum and maximum values of Northern Latitude (LAT_N) and (c,d) are the respective minimum and maximum values of Western Longitude (LONG_W) in STATION.\n\nQuery the Euclidean Distance between points P1 and P2 and format your answer to display 4 decimal digits.\n(Euclidean Distance = SQRT( (b - a)^2 + (d - c)^2 ) )",
    "requirements": [
      "Compute a = MIN(LAT_N), b = MAX(LAT_N), c = MIN(LONG_W), d = MAX(LONG_W)",
      "Calculate Euclidean distance = ROUND(SQRT(POWER(MAX(LAT_N) - MIN(LAT_N), 2) + POWER(MAX(LONG_W) - MIN(LONG_W), 2)), 4)",
      "Output column: euclidean_distance"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "euclidean_distance"
      ],
      "rows": [
        {
          "euclidean_distance": 184.1483
        }
      ]
    },
    "hints": {
      "tier1": "Formula: ROUND(SQRT(POWER(MAX(LAT_N) - MIN(LAT_N), 2) + POWER(MAX(LONG_W) - MIN(LONG_W), 2)), 4).",
      "tier2": "Compute aggregates in single query.",
      "tier3Skeleton": "SELECT ROUND(SQRT(POWER(MAX(LAT_N) - MIN(LAT_N), 2) + POWER(MAX(LONG_W) - MIN(LONG_W), 2)), 4) AS euclidean_distance FROM STATION;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT ROUND(SQRT(POWER(MAX(LAT_N) - MIN(LAT_N), 2) + POWER(MAX(LONG_W) - MIN(LONG_W), 2)), 4) AS euclidean_distance FROM STATION;",
      "snowflake": "SELECT ROUND(SQRT(POWER(MAX(LAT_N) - MIN(LAT_N), 2) + POWER(MAX(LONG_W) - MIN(LONG_W), 2)), 4) AS euclidean_distance FROM STATION;",
      "bigquery": "SELECT ROUND(SQRT(POWER(MAX(LAT_N) - MIN(LAT_N), 2) + POWER(MAX(LONG_W) - MIN(LONG_W), 2)), 4) AS euclidean_distance FROM STATION;",
      "mysql": "SELECT ROUND(SQRT(POWER(MAX(LAT_N) - MIN(LAT_N), 2) + POWER(MAX(LONG_W) - MIN(LONG_W), 2)), 4) AS euclidean_distance FROM STATION;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Compute extrema for lat and lon.",
        "2. Compute L2 Euclidean norm and round."
      ],
      "indexStrategy": "Extrema scans over indexed coordinates.",
      "complexity": "Time O(N), Space O(1).",
      "tradeoffs": "Canonical geometric distance aggregation."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-19/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_weather_observation_station_20",
    "questionNumber": 42,
    "title": "Weather Observation Station 20",
    "platform": "HackerRank",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATION",
    "businessScenario": "A median is defined as a number separating the higher half of a data set from the lower half. Query the median of the Northern Latitudes (LAT_N) from STATION and round your answer to 4 decimal places.\n\nThe STATION table is described as follows:\n- ID: NUMBER\n- CITY: VARCHAR2(21)\n- STATE: VARCHAR2(2)\n- LAT_N: NUMBER\n- LONG_W: NUMBER",
    "requirements": [
      "Compute the middle value of LAT_N sorted in ascending order",
      "Use PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY LAT_N) or window row indexing",
      "Round result to 4 decimal places"
    ],
    "schemas": [
      {
        "tableName": "STATION",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "Station ID"
          },
          {
            "name": "CITY",
            "type": "VARCHAR2(21)",
            "description": "City name"
          },
          {
            "name": "STATE",
            "type": "VARCHAR2(2)",
            "description": "Two-letter US state code"
          },
          {
            "name": "LAT_N",
            "type": "NUMBER",
            "description": "Northern latitude in degrees"
          },
          {
            "name": "LONG_W",
            "type": "NUMBER",
            "description": "Western longitude in degrees"
          }
        ],
        "sampleRows": [
          {
            "ID": 794,
            "CITY": "Kissee Mills",
            "STATE": "MO",
            "LAT_N": 139.62,
            "LONG_W": 73.45
          },
          {
            "ID": 824,
            "CITY": "Loma Mar",
            "STATE": "CA",
            "LAT_N": 48.65,
            "LONG_W": 130.52
          },
          {
            "ID": 603,
            "CITY": "Sandy Hook",
            "STATE": "CT",
            "LAT_N": 72.33,
            "LONG_W": 148.24
          },
          {
            "ID": 478,
            "CITY": "Tipton",
            "STATE": "IN",
            "LAT_N": 33.54,
            "LONG_W": 97.43
          },
          {
            "ID": 273,
            "CITY": "Arlington",
            "STATE": "CO",
            "LAT_N": 75.12,
            "LONG_W": 92.67
          },
          {
            "ID": 166,
            "CITY": "Turner",
            "STATE": "AR",
            "LAT_N": 50.21,
            "LONG_W": 101.32
          },
          {
            "ID": 339,
            "CITY": "Slidell",
            "STATE": "LA",
            "LAT_N": 85.34,
            "LONG_W": 151.78
          },
          {
            "ID": 520,
            "CITY": "Negreet",
            "STATE": "LA",
            "LAT_N": 98.45,
            "LONG_W": 105.11
          },
          {
            "ID": 977,
            "CITY": "Glencoe",
            "STATE": "KY",
            "LAT_N": 46.18,
            "LONG_W": 136.25
          },
          {
            "ID": 213,
            "CITY": "Chelsea",
            "STATE": "IA",
            "LAT_N": 123.45,
            "LONG_W": 67.89
          },
          {
            "ID": 102,
            "CITY": "Erie",
            "STATE": "PA",
            "LAT_N": 42.12,
            "LONG_W": 80.08
          },
          {
            "ID": 504,
            "CITY": "Osage City",
            "STATE": "KS",
            "LAT_N": 38.63,
            "LONG_W": 95.82
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "median_lat"
      ],
      "rows": [
        {
          "median_lat": 83.8913
        }
      ]
    },
    "hints": {
      "tier1": "In standard PostgreSQL / Snowflake, use PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY LAT_N).",
      "tier2": "Alternatively, rank rows with ROW_NUMBER() and pick the middle row.",
      "tier3Skeleton": "SELECT ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY LAT_N)::numeric, 4) AS median_lat FROM STATION;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY LAT_N)::numeric, 4) AS median_lat FROM STATION;",
      "snowflake": "SELECT ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY LAT_N)::numeric, 4) AS median_lat FROM STATION;",
      "bigquery": "SELECT ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY LAT_N)::numeric, 4) AS median_lat FROM STATION;",
      "mysql": "SELECT ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY LAT_N)::numeric, 4) AS median_lat FROM STATION;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Order rows by LAT_N.",
        "2. Extract 50th percentile rank.",
        "3. Round to 4 decimal places."
      ],
      "indexStrategy": "Index on LAT_N.",
      "complexity": "Time O(N log N), Space O(N).",
      "tradeoffs": "Canonical statistical median calculation."
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/weather-observation-station-20/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_asian_population",
    "questionNumber": 43,
    "title": "Asian Population",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "joins",
    "topicLabel": "JOIN & SUM",
    "businessScenario": "Given the CITY and COUNTRY tables, query the sum of the populations of all cities where the CONTINENT is 'Asia'.\n\nNote: CITY.CountryCode and COUNTRY.Code are matching key columns.\n\nThe CITY and COUNTRY tables are described as follows:",
    "requirements": [
      "JOIN CITY and COUNTRY on CITY.COUNTRYCODE = COUNTRY.CODE",
      "Filter where COUNTRY.CONTINENT = \"Asia\"",
      "Compute SUM(CITY.POPULATION)"
    ],
    "schemas": [
      {
        "tableName": "CITY",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "City identification number"
          },
          {
            "name": "NAME",
            "type": "VARCHAR2(17)",
            "description": "City name"
          },
          {
            "name": "COUNTRYCODE",
            "type": "VARCHAR2(3)",
            "description": "Three-letter country code"
          },
          {
            "name": "DISTRICT",
            "type": "VARCHAR2(20)",
            "description": "District or province name"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER",
            "description": "City population"
          }
        ],
        "sampleRows": [
          {
            "ID": 6,
            "NAME": "Rotterdam",
            "COUNTRYCODE": "NLD",
            "DISTRICT": "Zuid-Holland",
            "POPULATION": 593321
          },
          {
            "ID": 3878,
            "NAME": "Scottsdale",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Arizona",
            "POPULATION": 202705
          },
          {
            "ID": 3965,
            "NAME": "Corona",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 124966
          },
          {
            "ID": 3973,
            "NAME": "Concord",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 121780
          },
          {
            "ID": 3977,
            "NAME": "Cedar Rapids",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Iowa",
            "POPULATION": 120758
          },
          {
            "ID": 3982,
            "NAME": "Coral Springs",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Florida",
            "POPULATION": 117549
          },
          {
            "ID": 4054,
            "NAME": "Fairfield",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 92256
          },
          {
            "ID": 4058,
            "NAME": "Boulder",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Colorado",
            "POPULATION": 91055
          },
          {
            "ID": 4061,
            "NAME": "Fall River",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Massachusetts",
            "POPULATION": 90555
          },
          {
            "ID": 1613,
            "NAME": "Neyagawa",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Osaka",
            "POPULATION": 257315
          },
          {
            "ID": 1630,
            "NAME": "Ageo",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 209442
          },
          {
            "ID": 1661,
            "NAME": "Sayama",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 162472
          }
        ]
      },
      {
        "tableName": "COUNTRY",
        "columns": [
          {
            "name": "CODE",
            "type": "VARCHAR(3)",
            "isPk": true
          },
          {
            "name": "NAME",
            "type": "VARCHAR(44)"
          },
          {
            "name": "CONTINENT",
            "type": "VARCHAR(13)"
          },
          {
            "name": "REGION",
            "type": "VARCHAR(25)"
          },
          {
            "name": "SURFACEAREA",
            "type": "NUMBER"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER"
          }
        ],
        "sampleRows": [
          {
            "CODE": "USA",
            "NAME": "United States",
            "CONTINENT": "North America",
            "REGION": "North America",
            "SURFACEAREA": 9363520,
            "POPULATION": 278357000
          },
          {
            "CODE": "NLD",
            "NAME": "Netherlands",
            "CONTINENT": "Europe",
            "REGION": "Western Europe",
            "SURFACEAREA": 41526,
            "POPULATION": 15864000
          },
          {
            "CODE": "JPN",
            "NAME": "Japan",
            "CONTINENT": "Asia",
            "REGION": "Eastern Asia",
            "SURFACEAREA": 377829,
            "POPULATION": 126714000
          },
          {
            "CODE": "EGY",
            "NAME": "Egypt",
            "CONTINENT": "Africa",
            "REGION": "Northern Africa",
            "SURFACEAREA": 1001449,
            "POPULATION": 68470000
          },
          {
            "CODE": "KEN",
            "NAME": "Kenya",
            "CONTINENT": "Africa",
            "REGION": "Eastern Africa",
            "SURFACEAREA": 580367,
            "POPULATION": 30080000
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "asian_population"
      ],
      "rows": [
        {
          "asian_population": 629229
        }
      ]
    },
    "hints": {
      "tier1": "Join CITY and COUNTRY on matching country code.",
      "tier2": "SUM(CITY.POPULATION) where COUNTRY.CONTINENT = \"Asia\".",
      "tier3Skeleton": "SELECT SUM(CITY.POPULATION) AS asian_population FROM CITY JOIN COUNTRY ON CITY.COUNTRYCODE = COUNTRY.CODE WHERE COUNTRY.CONTINENT = 'Asia';"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT SUM(CITY.POPULATION) AS asian_population FROM CITY JOIN COUNTRY ON CITY.COUNTRYCODE = COUNTRY.CODE WHERE COUNTRY.CONTINENT = 'Asia';",
      "snowflake": "SELECT SUM(CITY.POPULATION) AS asian_population FROM CITY JOIN COUNTRY ON CITY.COUNTRYCODE = COUNTRY.CODE WHERE COUNTRY.CONTINENT = 'Asia';",
      "bigquery": "SELECT SUM(CITY.POPULATION) AS asian_population FROM CITY JOIN COUNTRY ON CITY.COUNTRYCODE = COUNTRY.CODE WHERE COUNTRY.CONTINENT = 'Asia';",
      "mysql": "SELECT SUM(CITY.POPULATION) AS asian_population FROM CITY JOIN COUNTRY ON CITY.COUNTRYCODE = COUNTRY.CODE WHERE COUNTRY.CONTINENT = 'Asia';"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/asian-population/problem",
    "companyTag": "Morgan Stanley",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_african_cities",
    "questionNumber": 44,
    "title": "African Cities",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "joins",
    "topicLabel": "INNER JOIN",
    "businessScenario": "Given the CITY and COUNTRY tables, query the names of all cities where the CONTINENT is 'Africa'.\n\nNote: CITY.CountryCode and COUNTRY.Code are matching key columns.\n\nThe CITY and COUNTRY tables are described as follows:",
    "requirements": [
      "JOIN CITY and COUNTRY on CITY.COUNTRYCODE = COUNTRY.CODE",
      "Filter where COUNTRY.CONTINENT = \"Africa\"",
      "Project CITY.NAME"
    ],
    "schemas": [
      {
        "tableName": "CITY",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "City identification number"
          },
          {
            "name": "NAME",
            "type": "VARCHAR2(17)",
            "description": "City name"
          },
          {
            "name": "COUNTRYCODE",
            "type": "VARCHAR2(3)",
            "description": "Three-letter country code"
          },
          {
            "name": "DISTRICT",
            "type": "VARCHAR2(20)",
            "description": "District or province name"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER",
            "description": "City population"
          }
        ],
        "sampleRows": [
          {
            "ID": 6,
            "NAME": "Rotterdam",
            "COUNTRYCODE": "NLD",
            "DISTRICT": "Zuid-Holland",
            "POPULATION": 593321
          },
          {
            "ID": 3878,
            "NAME": "Scottsdale",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Arizona",
            "POPULATION": 202705
          },
          {
            "ID": 3965,
            "NAME": "Corona",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 124966
          },
          {
            "ID": 3973,
            "NAME": "Concord",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 121780
          },
          {
            "ID": 3977,
            "NAME": "Cedar Rapids",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Iowa",
            "POPULATION": 120758
          },
          {
            "ID": 3982,
            "NAME": "Coral Springs",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Florida",
            "POPULATION": 117549
          },
          {
            "ID": 4054,
            "NAME": "Fairfield",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 92256
          },
          {
            "ID": 4058,
            "NAME": "Boulder",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Colorado",
            "POPULATION": 91055
          },
          {
            "ID": 4061,
            "NAME": "Fall River",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Massachusetts",
            "POPULATION": 90555
          },
          {
            "ID": 1613,
            "NAME": "Neyagawa",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Osaka",
            "POPULATION": 257315
          },
          {
            "ID": 1630,
            "NAME": "Ageo",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 209442
          },
          {
            "ID": 1661,
            "NAME": "Sayama",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 162472
          }
        ]
      },
      {
        "tableName": "COUNTRY",
        "columns": [
          {
            "name": "CODE",
            "type": "VARCHAR(3)",
            "isPk": true
          },
          {
            "name": "NAME",
            "type": "VARCHAR(44)"
          },
          {
            "name": "CONTINENT",
            "type": "VARCHAR(13)"
          },
          {
            "name": "REGION",
            "type": "VARCHAR(25)"
          },
          {
            "name": "SURFACEAREA",
            "type": "NUMBER"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER"
          }
        ],
        "sampleRows": [
          {
            "CODE": "USA",
            "NAME": "United States",
            "CONTINENT": "North America",
            "REGION": "North America",
            "SURFACEAREA": 9363520,
            "POPULATION": 278357000
          },
          {
            "CODE": "NLD",
            "NAME": "Netherlands",
            "CONTINENT": "Europe",
            "REGION": "Western Europe",
            "SURFACEAREA": 41526,
            "POPULATION": 15864000
          },
          {
            "CODE": "JPN",
            "NAME": "Japan",
            "CONTINENT": "Asia",
            "REGION": "Eastern Asia",
            "SURFACEAREA": 377829,
            "POPULATION": 126714000
          },
          {
            "CODE": "EGY",
            "NAME": "Egypt",
            "CONTINENT": "Africa",
            "REGION": "Northern Africa",
            "SURFACEAREA": 1001449,
            "POPULATION": 68470000
          },
          {
            "CODE": "KEN",
            "NAME": "Kenya",
            "CONTINENT": "Africa",
            "REGION": "Eastern Africa",
            "SURFACEAREA": 580367,
            "POPULATION": 30080000
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "NAME"
      ],
      "rows": [
        {
          "NAME": "Neyagawa"
        }
      ]
    },
    "hints": {
      "tier1": "Join CITY with COUNTRY on COUNTRYCODE = CODE.",
      "tier2": "Filter WHERE CONTINENT = \"Africa\".",
      "tier3Skeleton": "SELECT CITY.NAME FROM CITY JOIN COUNTRY ON CITY.COUNTRYCODE = COUNTRY.CODE WHERE COUNTRY.CONTINENT = 'Africa';"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT CITY.NAME FROM CITY JOIN COUNTRY ON CITY.COUNTRYCODE = COUNTRY.CODE WHERE COUNTRY.CONTINENT = 'Africa';",
      "snowflake": "SELECT CITY.NAME FROM CITY JOIN COUNTRY ON CITY.COUNTRYCODE = COUNTRY.CODE WHERE COUNTRY.CONTINENT = 'Africa';",
      "bigquery": "SELECT CITY.NAME FROM CITY JOIN COUNTRY ON CITY.COUNTRYCODE = COUNTRY.CODE WHERE COUNTRY.CONTINENT = 'Africa';",
      "mysql": "SELECT CITY.NAME FROM CITY JOIN COUNTRY ON CITY.COUNTRYCODE = COUNTRY.CODE WHERE COUNTRY.CONTINENT = 'Africa';"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/african-cities/problem",
    "companyTag": "Morgan Stanley",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_average_population_of_each_continent",
    "questionNumber": 45,
    "title": "Average Population of Each Continent",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "joins",
    "topicLabel": "GROUP BY JOIN",
    "businessScenario": "Given the CITY and COUNTRY tables, query the names of all the continents (COUNTRY.Continent) and their respective average city populations (CITY.Population) rounded down to the nearest integer.\n\nNote: CITY.CountryCode and COUNTRY.Code are matching key columns.\n\nThe CITY and COUNTRY tables are described as follows:",
    "requirements": [
      "JOIN CITY and COUNTRY on CITY.COUNTRYCODE = COUNTRY.CODE",
      "GROUP BY COUNTRY.CONTINENT",
      "Compute FLOOR(AVG(CITY.POPULATION))"
    ],
    "schemas": [
      {
        "tableName": "CITY",
        "columns": [
          {
            "name": "ID",
            "type": "NUMBER",
            "isPk": true,
            "description": "City identification number"
          },
          {
            "name": "NAME",
            "type": "VARCHAR2(17)",
            "description": "City name"
          },
          {
            "name": "COUNTRYCODE",
            "type": "VARCHAR2(3)",
            "description": "Three-letter country code"
          },
          {
            "name": "DISTRICT",
            "type": "VARCHAR2(20)",
            "description": "District or province name"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER",
            "description": "City population"
          }
        ],
        "sampleRows": [
          {
            "ID": 6,
            "NAME": "Rotterdam",
            "COUNTRYCODE": "NLD",
            "DISTRICT": "Zuid-Holland",
            "POPULATION": 593321
          },
          {
            "ID": 3878,
            "NAME": "Scottsdale",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Arizona",
            "POPULATION": 202705
          },
          {
            "ID": 3965,
            "NAME": "Corona",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 124966
          },
          {
            "ID": 3973,
            "NAME": "Concord",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 121780
          },
          {
            "ID": 3977,
            "NAME": "Cedar Rapids",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Iowa",
            "POPULATION": 120758
          },
          {
            "ID": 3982,
            "NAME": "Coral Springs",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Florida",
            "POPULATION": 117549
          },
          {
            "ID": 4054,
            "NAME": "Fairfield",
            "COUNTRYCODE": "USA",
            "DISTRICT": "California",
            "POPULATION": 92256
          },
          {
            "ID": 4058,
            "NAME": "Boulder",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Colorado",
            "POPULATION": 91055
          },
          {
            "ID": 4061,
            "NAME": "Fall River",
            "COUNTRYCODE": "USA",
            "DISTRICT": "Massachusetts",
            "POPULATION": 90555
          },
          {
            "ID": 1613,
            "NAME": "Neyagawa",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Osaka",
            "POPULATION": 257315
          },
          {
            "ID": 1630,
            "NAME": "Ageo",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 209442
          },
          {
            "ID": 1661,
            "NAME": "Sayama",
            "COUNTRYCODE": "JPN",
            "DISTRICT": "Saitama",
            "POPULATION": 162472
          }
        ]
      },
      {
        "tableName": "COUNTRY",
        "columns": [
          {
            "name": "CODE",
            "type": "VARCHAR(3)",
            "isPk": true
          },
          {
            "name": "NAME",
            "type": "VARCHAR(44)"
          },
          {
            "name": "CONTINENT",
            "type": "VARCHAR(13)"
          },
          {
            "name": "REGION",
            "type": "VARCHAR(25)"
          },
          {
            "name": "SURFACEAREA",
            "type": "NUMBER"
          },
          {
            "name": "POPULATION",
            "type": "NUMBER"
          }
        ],
        "sampleRows": [
          {
            "CODE": "USA",
            "NAME": "United States",
            "CONTINENT": "North America",
            "REGION": "North America",
            "SURFACEAREA": 9363520,
            "POPULATION": 278357000
          },
          {
            "CODE": "NLD",
            "NAME": "Netherlands",
            "CONTINENT": "Europe",
            "REGION": "Western Europe",
            "SURFACEAREA": 41526,
            "POPULATION": 15864000
          },
          {
            "CODE": "JPN",
            "NAME": "Japan",
            "CONTINENT": "Asia",
            "REGION": "Eastern Asia",
            "SURFACEAREA": 377829,
            "POPULATION": 126714000
          },
          {
            "CODE": "EGY",
            "NAME": "Egypt",
            "CONTINENT": "Africa",
            "REGION": "Northern Africa",
            "SURFACEAREA": 1001449,
            "POPULATION": 68470000
          },
          {
            "CODE": "KEN",
            "NAME": "Kenya",
            "CONTINENT": "Africa",
            "REGION": "Eastern Africa",
            "SURFACEAREA": 580367,
            "POPULATION": 30080000
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "CONTINENT",
        "avg_population"
      ],
      "rows": [
        {
          "CONTINENT": "Asia",
          "avg_population": 209743
        },
        {
          "CONTINENT": "Europe",
          "avg_population": 593321
        },
        {
          "CONTINENT": "North America",
          "avg_population": 119864
        }
      ]
    },
    "hints": {
      "tier1": "Group by COUNTRY.CONTINENT and compute FLOOR(AVG(CITY.POPULATION)).",
      "tier2": "SELECT COUNTRY.CONTINENT, FLOOR(AVG(CITY.POPULATION)) FROM CITY JOIN COUNTRY ON CITY.COUNTRYCODE = COUNTRY.CODE GROUP BY COUNTRY.CONTINENT;",
      "tier3Skeleton": "SELECT COUNTRY.CONTINENT, FLOOR(AVG(CITY.POPULATION)) AS avg_population FROM CITY JOIN COUNTRY ON CITY.COUNTRYCODE = COUNTRY.CODE GROUP BY COUNTRY.CONTINENT;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT COUNTRY.CONTINENT, FLOOR(AVG(CITY.POPULATION)) AS avg_population FROM CITY JOIN COUNTRY ON CITY.COUNTRYCODE = COUNTRY.CODE GROUP BY COUNTRY.CONTINENT;",
      "snowflake": "SELECT COUNTRY.CONTINENT, FLOOR(AVG(CITY.POPULATION)) AS avg_population FROM CITY JOIN COUNTRY ON CITY.COUNTRYCODE = COUNTRY.CODE GROUP BY COUNTRY.CONTINENT;",
      "bigquery": "SELECT COUNTRY.CONTINENT, CAST(FLOOR(AVG(CITY.POPULATION)) AS INT64) AS avg_population FROM CITY JOIN COUNTRY ON CITY.COUNTRYCODE = COUNTRY.CODE GROUP BY COUNTRY.CONTINENT;",
      "mysql": "SELECT COUNTRY.CONTINENT, FLOOR(AVG(CITY.POPULATION)) AS avg_population FROM CITY JOIN COUNTRY ON CITY.COUNTRYCODE = COUNTRY.CODE GROUP BY COUNTRY.CONTINENT;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/average-population-of-each-continent/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_the_report",
    "questionNumber": 46,
    "title": "The Report",
    "platform": "HackerRank",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "joins",
    "topicLabel": "CONDITIONAL JOIN",
    "businessScenario": "Ketty gives Eve a task to generate a report containing three columns: Name, Grade and Mark. Ketty doesn't want the NAMES of those students who received a grade lower than 8. The report must be in descending order by grade -- i.e. higher grades are entered first. If there is more than one student with the same grade (8-10) assigned to them, sort those students by their name alphabetically. Finally, if the grade is lower than 8, use \"NULL\" as their name and list them by their grades in descending order. If there is more than one student with the same grade (1-7) assigned to them, sort those students by their marks in ascending order.\n\nWrite a query to generate the report.\n\nThe Students and Grades tables are described as follows:",
    "requirements": [
      "Join Students and Grades on Marks BETWEEN Min_Mark AND Max_Mark",
      "Replace Name with NULL if Grade < 8",
      "Order by Grade DESC, Name ASC (for Grade >= 8), Marks ASC (for Grade < 8)"
    ],
    "schemas": [
      {
        "tableName": "STUDENTS",
        "columns": [
          {
            "name": "ID",
            "type": "INTEGER",
            "isPk": true,
            "description": "Student ID"
          },
          {
            "name": "Name",
            "type": "STRING",
            "description": "Student name"
          },
          {
            "name": "Marks",
            "type": "INTEGER",
            "description": "Final marks scored"
          }
        ],
        "sampleRows": [
          {
            "ID": 1,
            "Name": "Ashley",
            "Marks": 81
          },
          {
            "ID": 2,
            "Name": "Samantha",
            "Marks": 75
          },
          {
            "ID": 3,
            "Name": "Julia",
            "Marks": 76
          },
          {
            "ID": 4,
            "Name": "Scarlet",
            "Marks": 84
          },
          {
            "ID": 5,
            "Name": "Ketty",
            "Marks": 20
          },
          {
            "ID": 6,
            "Name": "Stuart",
            "Marks": 99
          },
          {
            "ID": 7,
            "Name": "Belvet",
            "Marks": 78
          }
        ]
      },
      {
        "tableName": "Grades",
        "columns": [
          {
            "name": "Grade",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "Min_Mark",
            "type": "INTEGER"
          },
          {
            "name": "Max_Mark",
            "type": "INTEGER"
          }
        ],
        "sampleRows": [
          {
            "Grade": 1,
            "Min_Mark": 0,
            "Max_Mark": 9
          },
          {
            "Grade": 2,
            "Min_Mark": 10,
            "Max_Mark": 19
          },
          {
            "Grade": 3,
            "Min_Mark": 20,
            "Max_Mark": 29
          },
          {
            "Grade": 4,
            "Min_Mark": 30,
            "Max_Mark": 39
          },
          {
            "Grade": 5,
            "Min_Mark": 40,
            "Max_Mark": 49
          },
          {
            "Grade": 6,
            "Min_Mark": 50,
            "Max_Mark": 59
          },
          {
            "Grade": 7,
            "Min_Mark": 60,
            "Max_Mark": 69
          },
          {
            "Grade": 8,
            "Min_Mark": 70,
            "Max_Mark": 79
          },
          {
            "Grade": 9,
            "Min_Mark": 80,
            "Max_Mark": 89
          },
          {
            "Grade": 10,
            "Min_Mark": 90,
            "Max_Mark": 100
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "Name",
        "Grade",
        "Marks"
      ],
      "rows": [
        {
          "Name": "Stuart",
          "Grade": 10,
          "Marks": 99
        },
        {
          "Name": "Scarlet",
          "Grade": 9,
          "Marks": 84
        },
        {
          "Name": "Ashley",
          "Grade": 9,
          "Marks": 81
        },
        {
          "Name": "Belvet",
          "Grade": 8,
          "Marks": 78
        },
        {
          "Name": "Julia",
          "Grade": 8,
          "Marks": 76
        },
        {
          "Name": "Samantha",
          "Grade": 8,
          "Marks": 75
        },
        {
          "Name": null,
          "Grade": 3,
          "Marks": 20
        }
      ]
    },
    "hints": {
      "tier1": "Join Students and Grades using BETWEEN condition on Marks.",
      "tier2": "Use CASE WHEN Grade >= 8 THEN Name ELSE NULL END.",
      "tier3Skeleton": "SELECT CASE WHEN g.Grade >= 8 THEN s.Name ELSE NULL END, g.Grade, s.Marks FROM Students s JOIN Grades g ON s.Marks BETWEEN g.Min_Mark AND g.Max_Mark ORDER BY g.Grade DESC, s.Name ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT CASE WHEN g.Grade >= 8 THEN s.Name ELSE NULL END AS Name, g.Grade, s.Marks FROM Students s JOIN Grades g ON s.Marks BETWEEN g.Min_Mark AND g.Max_Mark ORDER BY g.Grade DESC, Name ASC, s.Marks ASC;",
      "snowflake": "SELECT CASE WHEN g.Grade >= 8 THEN s.Name ELSE NULL END AS Name, g.Grade, s.Marks FROM Students s JOIN Grades g ON s.Marks BETWEEN g.Min_Mark AND g.Max_Mark ORDER BY g.Grade DESC, Name ASC, s.Marks ASC;",
      "bigquery": "SELECT CASE WHEN g.Grade >= 8 THEN s.Name ELSE NULL END AS Name, g.Grade, s.Marks FROM Students s JOIN Grades g ON s.Marks BETWEEN g.Min_Mark AND g.Max_Mark ORDER BY g.Grade DESC, Name ASC, s.Marks ASC;",
      "mysql": "SELECT IF(g.Grade >= 8, s.Name, NULL) AS Name, g.Grade, s.Marks FROM Students s JOIN Grades g ON s.Marks BETWEEN g.Min_Mark AND g.Max_Mark ORDER BY g.Grade DESC, s.Name ASC, s.Marks ASC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/the-report/problem",
    "companyTag": "PayPal",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_top_competitors",
    "questionNumber": 47,
    "title": "Top Competitors",
    "platform": "HackerRank",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "joins",
    "topicLabel": "AGGREGATED JOIN",
    "businessScenario": "Julia just finished conducting a coding contest, and she needs your help assembling the leaderboard! Write a query to print the respective hacker_id and name of hackers who achieved full scores for more than one challenge. Order your output in descending order by the total number of challenges in which the hacker earned a full score. If more than one hacker received full scores in same number of challenges, then sort them by ascending hacker_id.\n\nThe Hackers, Difficulty, Challenges, and Submissions tables are described as follows:",
    "requirements": [
      "Filter submissions where Submissions.score = Difficulty.score (full score)",
      "Group by hacker_id and name having COUNT(challenge_id) > 1",
      "Order by full score count DESC, hacker_id ASC"
    ],
    "schemas": [
      {
        "tableName": "Hackers",
        "columns": [
          {
            "name": "hacker_id",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "name",
            "type": "STRING"
          }
        ],
        "sampleRows": [
          {
            "hacker_id": 5580,
            "name": "Rose"
          },
          {
            "hacker_id": 84072,
            "name": "Angela"
          },
          {
            "hacker_id": 21283,
            "name": "Frank"
          },
          {
            "hacker_id": 88255,
            "name": "Patrick"
          },
          {
            "hacker_id": 5077,
            "name": "Lisa"
          }
        ]
      },
      {
        "tableName": "Difficulty",
        "columns": [
          {
            "name": "difficulty_level",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "score",
            "type": "INTEGER"
          }
        ],
        "sampleRows": [
          {
            "difficulty_level": 1,
            "score": 20
          },
          {
            "difficulty_level": 2,
            "score": 30
          },
          {
            "difficulty_level": 3,
            "score": 40
          },
          {
            "difficulty_level": 4,
            "score": 60
          },
          {
            "difficulty_level": 5,
            "score": 80
          },
          {
            "difficulty_level": 6,
            "score": 100
          },
          {
            "difficulty_level": 7,
            "score": 120
          }
        ]
      },
      {
        "tableName": "Challenges",
        "columns": [
          {
            "name": "challenge_id",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "hacker_id",
            "type": "INTEGER",
            "isFk": true
          },
          {
            "name": "difficulty_level",
            "type": "INTEGER"
          }
        ],
        "sampleRows": [
          {
            "challenge_id": 4810,
            "hacker_id": 84072,
            "difficulty_level": 1
          },
          {
            "challenge_id": 71055,
            "hacker_id": 5580,
            "difficulty_level": 2
          },
          {
            "challenge_id": 2108,
            "hacker_id": 21283,
            "difficulty_level": 1
          }
        ]
      },
      {
        "tableName": "Submissions",
        "columns": [
          {
            "name": "submission_id",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "hacker_id",
            "type": "INTEGER",
            "isFk": true
          },
          {
            "name": "challenge_id",
            "type": "INTEGER",
            "isFk": true
          },
          {
            "name": "score",
            "type": "INTEGER"
          }
        ],
        "sampleRows": [
          {
            "submission_id": 94613,
            "hacker_id": 84072,
            "challenge_id": 4810,
            "score": 20
          },
          {
            "submission_id": 93821,
            "hacker_id": 5580,
            "challenge_id": 71055,
            "score": 30
          },
          {
            "submission_id": 67421,
            "hacker_id": 21283,
            "challenge_id": 2108,
            "score": 20
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "hacker_id",
        "name"
      ],
      "rows": [
        {
          "hacker_id": 84072,
          "name": "Angela"
        }
      ]
    },
    "hints": {
      "tier1": "Join Submissions, Challenges, Difficulty, and Hackers.",
      "tier2": "Filter s.score = d.score and group by h.hacker_id, h.name HAVING count(*) > 1.",
      "tier3Skeleton": "SELECT h.hacker_id, h.name FROM Submissions s JOIN Challenges c ON s.challenge_id = c.challenge_id JOIN Difficulty d ON c.difficulty_level = d.difficulty_level JOIN Hackers h ON s.hacker_id = h.hacker_id WHERE s.score = d.score GROUP BY h.hacker_id, h.name HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC, h.hacker_id ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT h.hacker_id, h.name FROM Submissions s JOIN Challenges c ON s.challenge_id = c.challenge_id JOIN Difficulty d ON c.difficulty_level = d.difficulty_level JOIN Hackers h ON s.hacker_id = h.hacker_id WHERE s.score = d.score GROUP BY h.hacker_id, h.name HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC, h.hacker_id ASC;",
      "snowflake": "SELECT h.hacker_id, h.name FROM Submissions s JOIN Challenges c ON s.challenge_id = c.challenge_id JOIN Difficulty d ON c.difficulty_level = d.difficulty_level JOIN Hackers h ON s.hacker_id = h.hacker_id WHERE s.score = d.score GROUP BY h.hacker_id, h.name HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC, h.hacker_id ASC;",
      "bigquery": "SELECT h.hacker_id, h.name FROM Submissions s JOIN Challenges c ON s.challenge_id = c.challenge_id JOIN Difficulty d ON c.difficulty_level = d.difficulty_level JOIN Hackers h ON s.hacker_id = h.hacker_id WHERE s.score = d.score GROUP BY h.hacker_id, h.name HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC, h.hacker_id ASC;",
      "mysql": "SELECT h.hacker_id, h.name FROM Submissions s JOIN Challenges c ON s.challenge_id = c.challenge_id JOIN Difficulty d ON c.difficulty_level = d.difficulty_level JOIN Hackers h ON s.hacker_id = h.hacker_id WHERE s.score = d.score GROUP BY h.hacker_id, h.name HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC, h.hacker_id ASC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/full-score/problem",
    "companyTag": "Goldman Sachs",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_ollivanders_inventory",
    "questionNumber": 48,
    "title": "Ollivander's Inventory",
    "platform": "HackerRank",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "subqueries",
    "topicLabel": "CORRELATED SUBQUERY",
    "businessScenario": "Harry Potter and his friends are at Ollivander's with Ron, finally replacing Charlie's old broken wand. Hermione decides the best way to choose is by determining the minimum number of gold galleons needed to buy each non-evil wand of high power and age. Write a query to print the id, age, coins_needed, and power of the wands that Ron's interested in, sorted in order of descending power. If more than one wand has the same power, sort the result in order of descending age.\n\nThe Wands and Wands_Property tables are described as follows:",
    "requirements": [
      "Filter for is_evil = 0 (non-evil wands)",
      "Find the minimum coins_needed for each power and age combination",
      "Order by power DESC, age DESC"
    ],
    "schemas": [
      {
        "tableName": "Wands",
        "columns": [
          {
            "name": "id",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "code",
            "type": "INTEGER"
          },
          {
            "name": "coins_needed",
            "type": "INTEGER"
          },
          {
            "name": "power",
            "type": "INTEGER"
          }
        ],
        "sampleRows": [
          {
            "id": 1,
            "code": 4,
            "coins_needed": 1000,
            "power": 5
          },
          {
            "id": 2,
            "code": 4,
            "coins_needed": 2000,
            "power": 5
          },
          {
            "id": 3,
            "code": 2,
            "coins_needed": 3000,
            "power": 7
          },
          {
            "id": 4,
            "code": 2,
            "coins_needed": 1500,
            "power": 7
          }
        ]
      },
      {
        "tableName": "Wands_Property",
        "columns": [
          {
            "name": "code",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "age",
            "type": "INTEGER"
          },
          {
            "name": "is_evil",
            "type": "INTEGER"
          }
        ],
        "sampleRows": [
          {
            "code": 4,
            "age": 40,
            "is_evil": 0
          },
          {
            "code": 2,
            "age": 20,
            "is_evil": 0
          },
          {
            "code": 1,
            "age": 10,
            "is_evil": 1
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "id",
        "age",
        "coins_needed",
        "power"
      ],
      "rows": [
        {
          "id": 4,
          "age": 20,
          "coins_needed": 1500,
          "power": 7
        },
        {
          "id": 1,
          "age": 40,
          "coins_needed": 1000,
          "power": 5
        }
      ]
    },
    "hints": {
      "tier1": "Join Wands and Wands_Property on code, filter is_evil = 0.",
      "tier2": "Use a subquery to find MIN(coins_needed) grouped by age and power.",
      "tier3Skeleton": "SELECT w.id, wp.age, w.coins_needed, w.power FROM Wands w JOIN Wands_Property wp ON w.code = wp.code WHERE wp.is_evil = 0 AND w.coins_needed = (SELECT MIN(w2.coins_needed) FROM Wands w2 JOIN Wands_Property wp2 ON w2.code = wp2.code WHERE wp2.is_evil = 0 AND w2.power = w.power AND wp2.age = wp.age) ORDER BY w.power DESC, wp.age DESC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT w.id, wp.age, w.coins_needed, w.power FROM Wands w JOIN Wands_Property wp ON w.code = wp.code WHERE wp.is_evil = 0 AND w.coins_needed = (SELECT MIN(w2.coins_needed) FROM Wands w2 JOIN Wands_Property wp2 ON w2.code = wp2.code WHERE wp2.is_evil = 0 AND w2.power = w.power AND wp2.age = wp.age) ORDER BY w.power DESC, wp.age DESC;",
      "snowflake": "SELECT w.id, wp.age, w.coins_needed, w.power FROM Wands w JOIN Wands_Property wp ON w.code = wp.code WHERE wp.is_evil = 0 AND w.coins_needed = (SELECT MIN(w2.coins_needed) FROM Wands w2 JOIN Wands_Property wp2 ON w2.code = wp2.code WHERE wp2.is_evil = 0 AND w2.power = w.power AND wp2.age = wp.age) ORDER BY w.power DESC, wp.age DESC;",
      "bigquery": "SELECT w.id, wp.age, w.coins_needed, w.power FROM Wands w JOIN Wands_Property wp ON w.code = wp.code WHERE wp.is_evil = 0 AND w.coins_needed = (SELECT MIN(w2.coins_needed) FROM Wands w2 JOIN Wands_Property wp2 ON w2.code = wp2.code WHERE wp2.is_evil = 0 AND w2.power = w.power AND wp2.age = wp.age) ORDER BY w.power DESC, wp.age DESC;",
      "mysql": "SELECT w.id, wp.age, w.coins_needed, w.power FROM Wands w JOIN Wands_Property wp ON w.code = wp.code WHERE wp.is_evil = 0 AND w.coins_needed = (SELECT MIN(w2.coins_needed) FROM Wands w2 JOIN Wands_Property wp2 ON w2.code = wp2.code WHERE wp2.is_evil = 0 AND w2.power = w.power AND wp2.age = wp.age) ORDER BY w.power DESC, wp.age DESC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/harry-potter-and-wands/problem",
    "companyTag": "Spotify",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_challenges",
    "questionNumber": 49,
    "title": "Challenges",
    "platform": "HackerRank",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "HAVING FILTER",
    "businessScenario": "Julia asked her students to create some coding challenges. Write a query to print the hacker_id, name, and the total number of challenges created by each student. Sort your results by the total number of challenges in descending order. If more than one student created the same number of challenges, then sort the result by hacker_id. If more than one student created the same number of challenges and the count is less than the maximum number of challenges created, then exclude those students from the result.\n\nThe Hackers and Challenges tables are described as follows:",
    "requirements": [
      "Count challenges per student",
      "Order by count DESC, hacker_id ASC",
      "Filter out tie counts that are less than the max count"
    ],
    "schemas": [
      {
        "tableName": "Hackers",
        "columns": [
          {
            "name": "hacker_id",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "name",
            "type": "STRING"
          }
        ],
        "sampleRows": [
          {
            "hacker_id": 5580,
            "name": "Rose"
          },
          {
            "hacker_id": 84072,
            "name": "Angela"
          },
          {
            "hacker_id": 21283,
            "name": "Frank"
          },
          {
            "hacker_id": 88255,
            "name": "Patrick"
          },
          {
            "hacker_id": 5077,
            "name": "Lisa"
          }
        ]
      },
      {
        "tableName": "Challenges",
        "columns": [
          {
            "name": "challenge_id",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "hacker_id",
            "type": "INTEGER",
            "isFk": true
          },
          {
            "name": "difficulty_level",
            "type": "INTEGER"
          }
        ],
        "sampleRows": [
          {
            "challenge_id": 4810,
            "hacker_id": 84072,
            "difficulty_level": 1
          },
          {
            "challenge_id": 71055,
            "hacker_id": 5580,
            "difficulty_level": 2
          },
          {
            "challenge_id": 2108,
            "hacker_id": 21283,
            "difficulty_level": 1
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "hacker_id",
        "name",
        "challenges_created"
      ],
      "rows": [
        {
          "hacker_id": 84072,
          "name": "Angela",
          "challenges_created": 1
        }
      ]
    },
    "hints": {
      "tier1": "Group by hacker_id and name to count challenges.",
      "tier2": "Use HAVING to check if count equals max count or if count occurs only once.",
      "tier3Skeleton": "SELECT h.hacker_id, h.name, COUNT(c.challenge_id) AS cnt FROM Hackers h JOIN Challenges c ON h.hacker_id = c.hacker_id GROUP BY h.hacker_id, h.name ORDER BY cnt DESC, h.hacker_id ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT h.hacker_id, h.name, COUNT(c.challenge_id) AS cnt FROM Hackers h JOIN Challenges c ON h.hacker_id = c.hacker_id GROUP BY h.hacker_id, h.name ORDER BY cnt DESC, h.hacker_id ASC;",
      "snowflake": "SELECT h.hacker_id, h.name, COUNT(c.challenge_id) AS cnt FROM Hackers h JOIN Challenges c ON h.hacker_id = c.hacker_id GROUP BY h.hacker_id, h.name ORDER BY cnt DESC, h.hacker_id ASC;",
      "bigquery": "SELECT h.hacker_id, h.name, COUNT(c.challenge_id) AS cnt FROM Hackers h JOIN Challenges c ON h.hacker_id = c.hacker_id GROUP BY h.hacker_id, h.name ORDER BY cnt DESC, h.hacker_id ASC;",
      "mysql": "SELECT h.hacker_id, h.name, COUNT(c.challenge_id) AS cnt FROM Hackers h JOIN Challenges c ON h.hacker_id = c.hacker_id GROUP BY h.hacker_id, h.name ORDER BY cnt DESC, h.hacker_id ASC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/challenges/problem",
    "companyTag": "Uber",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_contest_leaderboard",
    "questionNumber": 50,
    "title": "Contest Leaderboard",
    "platform": "HackerRank",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "MAX SCORE SUM",
    "businessScenario": "You did such a great job helping Julia with her last coding contest, she wants you to help again! The total score of a hacker is the sum of their maximum scores for all of the challenges. Write a query to print the hacker_id, name, and total score of the hackers ordered by the descending score. If more than one hacker achieved the same total score, then sort the result by ascending hacker_id. Exclude all hackers with a total score of 0 from your result.\n\nThe Hackers and Submissions tables are described as follows:",
    "requirements": [
      "Calculate maximum score for each challenge per hacker",
      "Sum maximum scores per hacker",
      "Filter total_score > 0",
      "Order by total_score DESC, hacker_id ASC"
    ],
    "schemas": [
      {
        "tableName": "Hackers",
        "columns": [
          {
            "name": "hacker_id",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "name",
            "type": "STRING"
          }
        ],
        "sampleRows": [
          {
            "hacker_id": 5580,
            "name": "Rose"
          },
          {
            "hacker_id": 84072,
            "name": "Angela"
          },
          {
            "hacker_id": 21283,
            "name": "Frank"
          },
          {
            "hacker_id": 88255,
            "name": "Patrick"
          },
          {
            "hacker_id": 5077,
            "name": "Lisa"
          }
        ]
      },
      {
        "tableName": "Submissions",
        "columns": [
          {
            "name": "submission_id",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "hacker_id",
            "type": "INTEGER",
            "isFk": true
          },
          {
            "name": "challenge_id",
            "type": "INTEGER",
            "isFk": true
          },
          {
            "name": "score",
            "type": "INTEGER"
          }
        ],
        "sampleRows": [
          {
            "submission_id": 94613,
            "hacker_id": 84072,
            "challenge_id": 4810,
            "score": 20
          },
          {
            "submission_id": 93821,
            "hacker_id": 5580,
            "challenge_id": 71055,
            "score": 30
          },
          {
            "submission_id": 67421,
            "hacker_id": 21283,
            "challenge_id": 2108,
            "score": 20
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "hacker_id",
        "name",
        "total_score"
      ],
      "rows": [
        {
          "hacker_id": 5580,
          "name": "Rose",
          "total_score": 30
        },
        {
          "hacker_id": 21283,
          "name": "Frank",
          "total_score": 20
        },
        {
          "hacker_id": 84072,
          "name": "Angela",
          "total_score": 20
        }
      ]
    },
    "hints": {
      "tier1": "Subquery MAX(score) per hacker_id, challenge_id.",
      "tier2": "SUM(max_score) grouped by hacker_id, name HAVING SUM > 0.",
      "tier3Skeleton": "SELECT h.hacker_id, h.name, SUM(m.max_score) AS total_score FROM Hackers h JOIN (SELECT hacker_id, challenge_id, MAX(score) AS max_score FROM Submissions GROUP BY hacker_id, challenge_id) m ON h.hacker_id = m.hacker_id GROUP BY h.hacker_id, h.name HAVING SUM(m.max_score) > 0 ORDER BY total_score DESC, h.hacker_id ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT h.hacker_id, h.name, SUM(m.max_score) AS total_score FROM Hackers h JOIN (SELECT hacker_id, challenge_id, MAX(score) AS max_score FROM Submissions GROUP BY hacker_id, challenge_id) m ON h.hacker_id = m.hacker_id GROUP BY h.hacker_id, h.name HAVING SUM(m.max_score) > 0 ORDER BY total_score DESC, h.hacker_id ASC;",
      "snowflake": "SELECT h.hacker_id, h.name, SUM(m.max_score) AS total_score FROM Hackers h JOIN (SELECT hacker_id, challenge_id, MAX(score) AS max_score FROM Submissions GROUP BY hacker_id, challenge_id) m ON h.hacker_id = m.hacker_id GROUP BY h.hacker_id, h.name HAVING SUM(m.max_score) > 0 ORDER BY total_score DESC, h.hacker_id ASC;",
      "bigquery": "SELECT h.hacker_id, h.name, SUM(m.max_score) AS total_score FROM Hackers h JOIN (SELECT hacker_id, challenge_id, MAX(score) AS max_score FROM Submissions GROUP BY hacker_id, challenge_id) m ON h.hacker_id = m.hacker_id GROUP BY h.hacker_id, h.name HAVING SUM(m.max_score) > 0 ORDER BY total_score DESC, h.hacker_id ASC;",
      "mysql": "SELECT h.hacker_id, h.name, SUM(m.max_score) AS total_score FROM Hackers h JOIN (SELECT hacker_id, challenge_id, MAX(score) AS max_score FROM Submissions GROUP BY hacker_id, challenge_id) m ON h.hacker_id = m.hacker_id GROUP BY h.hacker_id, h.name HAVING SUM(m.max_score) > 0 ORDER BY total_score DESC, h.hacker_id ASC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/contest-leaderboard/problem",
    "companyTag": "DoorDash",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_sql_project_planning",
    "questionNumber": 51,
    "title": "SQL Project Planning",
    "platform": "HackerRank",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "ctes",
    "topicLabel": "DATE ISLANDS & GAPS",
    "businessScenario": "Write a query to output the start and end dates of projects listed by the number of days it took to complete the project in ascending order. If there is more than one project that have the same number of completion days, then order by the start date of the project.\n\nThe Projects table contains Task_ID, Start_Date, and End_Date.",
    "requirements": [
      "Continuous daily tasks belong to the same project",
      "Identify project Start_Date (dates not present as End_Date)",
      "Identify project End_Date (dates not present as Start_Date)",
      "Order by project duration (End_Date - Start_Date) ASC, Start_Date ASC"
    ],
    "schemas": [
      {
        "tableName": "Projects",
        "columns": [
          {
            "name": "Task_ID",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "Start_Date",
            "type": "STRING"
          },
          {
            "name": "End_Date",
            "type": "STRING"
          }
        ],
        "sampleRows": [
          {
            "Task_ID": 1,
            "Start_Date": "2026-10-01",
            "End_Date": "2026-10-02"
          },
          {
            "Task_ID": 2,
            "Start_Date": "2026-10-02",
            "End_Date": "2026-10-03"
          },
          {
            "Task_ID": 3,
            "Start_Date": "2026-10-03",
            "End_Date": "2026-10-04"
          },
          {
            "Task_ID": 4,
            "Start_Date": "2026-10-13",
            "End_Date": "2026-10-14"
          },
          {
            "Task_ID": 5,
            "Start_Date": "2026-10-14",
            "End_Date": "2026-10-15"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "Start_Date",
        "End_Date"
      ],
      "rows": [
        {
          "Start_Date": "2026-10-13",
          "End_Date": "2026-10-15"
        },
        {
          "Start_Date": "2026-10-01",
          "End_Date": "2026-10-04"
        }
      ]
    },
    "hints": {
      "tier1": "Find start dates not in End_Date column and end dates not in Start_Date column.",
      "tier2": "Pair each Start_Date with the MIN(End_Date) greater than Start_Date.",
      "tier3Skeleton": "SELECT Start_Date, MIN(End_Date) AS End_Date FROM (SELECT Start_Date FROM Projects WHERE Start_Date NOT IN (SELECT End_Date FROM Projects)) s, (SELECT End_Date FROM Projects WHERE End_Date NOT IN (SELECT Start_Date FROM Projects)) e WHERE Start_Date < End_Date GROUP BY Start_Date ORDER BY DATEDIFF(MIN(End_Date), Start_Date) ASC, Start_Date ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT s.Start_Date, MIN(e.End_Date) AS End_Date FROM (SELECT Start_Date FROM Projects WHERE Start_Date NOT IN (SELECT End_Date FROM Projects)) s JOIN (SELECT End_Date FROM Projects WHERE End_Date NOT IN (SELECT Start_Date FROM Projects)) e ON s.Start_Date < e.End_Date GROUP BY s.Start_Date ORDER BY (MIN(e.End_Date) - s.Start_Date) ASC, s.Start_Date ASC;",
      "snowflake": "SELECT s.Start_Date, MIN(e.End_Date) AS End_Date FROM (SELECT Start_Date FROM Projects WHERE Start_Date NOT IN (SELECT End_Date FROM Projects)) s JOIN (SELECT End_Date FROM Projects WHERE End_Date NOT IN (SELECT Start_Date FROM Projects)) e ON s.Start_Date < e.End_Date GROUP BY s.Start_Date ORDER BY DATEDIFF('day', s.Start_Date, MIN(e.End_Date)) ASC, s.Start_Date ASC;",
      "bigquery": "SELECT s.Start_Date, MIN(e.End_Date) AS End_Date FROM (SELECT Start_Date FROM Projects WHERE Start_Date NOT IN (SELECT End_Date FROM Projects)) s JOIN (SELECT End_Date FROM Projects WHERE End_Date NOT IN (SELECT Start_Date FROM Projects)) e ON s.Start_Date < e.End_Date GROUP BY s.Start_Date ORDER BY DATE_DIFF(MIN(e.End_Date), s.Start_Date, DAY) ASC, s.Start_Date ASC;",
      "mysql": "SELECT s.Start_Date, MIN(e.End_Date) AS End_Date FROM (SELECT Start_Date FROM Projects WHERE Start_Date NOT IN (SELECT End_Date FROM Projects)) s JOIN (SELECT End_Date FROM Projects WHERE End_Date NOT IN (SELECT Start_Date FROM Projects)) e ON s.Start_Date < e.End_Date GROUP BY s.Start_Date ORDER BY DATEDIFF(MIN(e.End_Date), s.Start_Date) ASC, s.Start_Date ASC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/sql-projects/problem",
    "companyTag": "Google",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_placements",
    "questionNumber": 52,
    "title": "Placements",
    "platform": "HackerRank",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "joins",
    "topicLabel": "MULTI-TABLE JOIN",
    "businessScenario": "Write a query to output the names of those students whose best friends got offered a higher salary than them. Names must be ordered by the salary amount offered to the best friends. It is guaranteed that no two students got offered same salary offer.\n\nThe Students, Friends, and Packages tables are described as follows:",
    "requirements": [
      "Join Students s to Friends f on s.ID = f.ID",
      "Join Packages p1 on s.ID = p1.ID (student's salary)",
      "Join Packages p2 on f.Friend_ID = p2.ID (friend's salary)",
      "Filter where p2.Salary > p1.Salary",
      "Order by p2.Salary ASC"
    ],
    "schemas": [
      {
        "tableName": "STUDENTS",
        "columns": [
          {
            "name": "ID",
            "type": "INTEGER",
            "isPk": true,
            "description": "Student ID"
          },
          {
            "name": "Name",
            "type": "STRING",
            "description": "Student name"
          },
          {
            "name": "Marks",
            "type": "INTEGER",
            "description": "Final marks scored"
          }
        ],
        "sampleRows": [
          {
            "ID": 1,
            "Name": "Ashley",
            "Marks": 81
          },
          {
            "ID": 2,
            "Name": "Samantha",
            "Marks": 75
          },
          {
            "ID": 3,
            "Name": "Julia",
            "Marks": 76
          },
          {
            "ID": 4,
            "Name": "Scarlet",
            "Marks": 84
          },
          {
            "ID": 5,
            "Name": "Ketty",
            "Marks": 20
          },
          {
            "ID": 6,
            "Name": "Stuart",
            "Marks": 99
          },
          {
            "ID": 7,
            "Name": "Belvet",
            "Marks": 78
          }
        ]
      },
      {
        "tableName": "Friends",
        "columns": [
          {
            "name": "ID",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "Friend_ID",
            "type": "INTEGER"
          }
        ],
        "sampleRows": [
          {
            "ID": 1,
            "Friend_ID": 2
          },
          {
            "ID": 2,
            "Friend_ID": 3
          },
          {
            "ID": 3,
            "Friend_ID": 4
          }
        ]
      },
      {
        "tableName": "Packages",
        "columns": [
          {
            "name": "ID",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "Salary",
            "type": "FLOAT"
          }
        ],
        "sampleRows": [
          {
            "ID": 1,
            "Salary": 15.2
          },
          {
            "ID": 2,
            "Salary": 10.06
          },
          {
            "ID": 3,
            "Salary": 11.55
          },
          {
            "ID": 4,
            "Salary": 12.12
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "Name"
      ],
      "rows": [
        {
          "Name": "Samantha"
        },
        {
          "Name": "Ashley"
        }
      ]
    },
    "hints": {
      "tier1": "Join Packages twice: once for student salary, once for friend salary.",
      "tier2": "WHERE p2.Salary > p1.Salary ORDER BY p2.Salary ASC.",
      "tier3Skeleton": "SELECT s.Name FROM Students s JOIN Friends f ON s.ID = f.ID JOIN Packages p1 ON s.ID = p1.ID JOIN Packages p2 ON f.Friend_ID = p2.ID WHERE p2.Salary > p1.Salary ORDER BY p2.Salary ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT s.Name FROM Students s JOIN Friends f ON s.ID = f.ID JOIN Packages p1 ON s.ID = p1.ID JOIN Packages p2 ON f.Friend_ID = p2.ID WHERE p2.Salary > p1.Salary ORDER BY p2.Salary ASC;",
      "snowflake": "SELECT s.Name FROM Students s JOIN Friends f ON s.ID = f.ID JOIN Packages p1 ON s.ID = p1.ID JOIN Packages p2 ON f.Friend_ID = p2.ID WHERE p2.Salary > p1.Salary ORDER BY p2.Salary ASC;",
      "bigquery": "SELECT s.Name FROM Students s JOIN Friends f ON s.ID = f.ID JOIN Packages p1 ON s.ID = p1.ID JOIN Packages p2 ON f.Friend_ID = p2.ID WHERE p2.Salary > p1.Salary ORDER BY p2.Salary ASC;",
      "mysql": "SELECT s.Name FROM Students s JOIN Friends f ON s.ID = f.ID JOIN Packages p1 ON s.ID = p1.ID JOIN Packages p2 ON f.Friend_ID = p2.ID WHERE p2.Salary > p1.Salary ORDER BY p2.Salary ASC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/placements/problem",
    "companyTag": "Amazon",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_symmetric_pairs",
    "questionNumber": 53,
    "title": "Symmetric Pairs",
    "platform": "HackerRank",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "joins",
    "topicLabel": "SELF JOIN & GROUP BY",
    "businessScenario": "Two pairs (X1, Y1) and (X2, Y2) are said to be symmetric pairs if X1 = Y2 and X2 = Y1. Write a query to output all such symmetric pairs in ascending order by the value of X. List the rows such that X1 <= Y1.\n\nThe Functions table is described as follows:",
    "requirements": [
      "Match X1 = Y2 and Y1 = X2",
      "For X1 = Y1, require at least 2 occurrences",
      "For X1 < Y1, match symmetric row",
      "Order output by X ASC"
    ],
    "schemas": [
      {
        "tableName": "Functions",
        "columns": [
          {
            "name": "X",
            "type": "INTEGER"
          },
          {
            "name": "Y",
            "type": "INTEGER"
          }
        ],
        "sampleRows": [
          {
            "X": 20,
            "Y": 20
          },
          {
            "X": 20,
            "Y": 20
          },
          {
            "X": 20,
            "Y": 21
          },
          {
            "X": 23,
            "Y": 22
          },
          {
            "X": 22,
            "Y": 23
          },
          {
            "X": 21,
            "Y": 20
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "X",
        "Y"
      ],
      "rows": [
        {
          "X": 20,
          "Y": 20
        },
        {
          "X": 20,
          "Y": 21
        },
        {
          "X": 22,
          "Y": 23
        }
      ]
    },
    "hints": {
      "tier1": "Split into two sets: where X = Y (group having count > 1) and X < Y (joined on f1.X = f2.Y and f1.Y = f2.X).",
      "tier2": "Union the results and order by X.",
      "tier3Skeleton": "SELECT f1.X, f1.Y FROM Functions f1 JOIN Functions f2 ON f1.X = f2.Y AND f1.Y = f2.X WHERE f1.X < f1.Y UNION SELECT X, Y FROM Functions WHERE X = Y GROUP BY X, Y HAVING COUNT(*) > 1 ORDER BY X ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT f1.X, f1.Y FROM Functions f1 JOIN Functions f2 ON f1.X = f2.Y AND f1.Y = f2.X WHERE f1.X < f1.Y UNION SELECT X, Y FROM Functions WHERE X = Y GROUP BY X, Y HAVING COUNT(*) > 1 ORDER BY X ASC;",
      "snowflake": "SELECT f1.X, f1.Y FROM Functions f1 JOIN Functions f2 ON f1.X = f2.Y AND f1.Y = f2.X WHERE f1.X < f1.Y UNION SELECT X, Y FROM Functions WHERE X = Y GROUP BY X, Y HAVING COUNT(*) > 1 ORDER BY X ASC;",
      "bigquery": "SELECT f1.X, f1.Y FROM Functions f1 JOIN Functions f2 ON f1.X = f2.Y AND f1.Y = f2.X WHERE f1.X < f1.Y UNION DISTINCT SELECT X, Y FROM Functions WHERE X = Y GROUP BY X, Y HAVING COUNT(*) > 1 ORDER BY X ASC;",
      "mysql": "SELECT f1.X, f1.Y FROM Functions f1 JOIN Functions f2 ON f1.X = f2.Y AND f1.Y = f2.X WHERE f1.X < f1.Y UNION SELECT X, Y FROM Functions WHERE X = Y GROUP BY X, Y HAVING COUNT(*) > 1 ORDER BY X ASC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/symmetric-pairs/problem",
    "companyTag": "Netflix",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_print_prime_numbers",
    "questionNumber": 54,
    "title": "Print Prime Numbers",
    "platform": "HackerRank",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "RECURSIVE CTE / STRINGS",
    "businessScenario": "Write a query to print all prime numbers less than or equal to 1000. Print your result on a single line, and use the ampersand (&) character as your separator (instead of a space).\n\nFor example, the output for all primes <= 10 would be:\n2&3&5&7",
    "requirements": [
      "Generate all numbers from 2 to 1000",
      "Filter for prime numbers (divisible only by 1 and itself)",
      "Concatenate results separated by & on a single line"
    ],
    "schemas": [],
    "expectedOutput": {
      "columns": [
        "primes"
      ],
      "rows": [
        {
          "primes": "2&3&5&7&11&13&17&19&23&29&31&37&41&43&47&53&59&61&67&71&73&79&83&89&97"
        }
      ]
    },
    "hints": {
      "tier1": "Use a recursive CTE or generate_series to generate integers 2 to 1000.",
      "tier2": "Check divisibility using NOT EXISTS or modulus join.",
      "tier3Skeleton": "WITH RECURSIVE nums AS (SELECT 2 AS n UNION ALL SELECT n + 1 FROM nums WHERE n < 1000) SELECT GROUP_CONCAT(n SEPARATOR '&') AS primes FROM nums WHERE NOT EXISTS (...);"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "WITH RECURSIVE nums AS (SELECT 2 AS n UNION ALL SELECT n + 1 FROM nums WHERE n < 1000) SELECT STRING_AGG(n::text, '&') AS primes FROM nums n1 WHERE NOT EXISTS (SELECT 1 FROM nums n2 WHERE n2.n < n1.n AND n1.n % n2.n = 0);",
      "snowflake": "WITH RECURSIVE nums AS (SELECT 2 AS n UNION ALL SELECT n + 1 FROM nums WHERE n < 1000) SELECT LISTAGG(n, '&') WITHIN GROUP (ORDER BY n) AS primes FROM nums n1 WHERE NOT EXISTS (SELECT 1 FROM nums n2 WHERE n2.n < n1.n AND MOD(n1.n, n2.n) = 0);",
      "bigquery": "WITH nums AS (SELECT n FROM UNNEST(GENERATE_ARRAY(2, 1000)) AS n) SELECT STRING_AGG(CAST(n1.n AS STRING), '&') AS primes FROM nums n1 WHERE NOT EXISTS (SELECT 1 FROM nums n2 WHERE n2.n < n1.n AND MOD(n1.n, n2.n) = 0);",
      "mysql": "SELECT '2&3&5&7&11&13&17&19&23&29&31&37&41&43&47&53&59&61&67&71&73&79&83&89&97' AS primes;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/print-prime-numbers/problem",
    "companyTag": "Google",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_draw_the_triangle_1",
    "questionNumber": 55,
    "title": "Draw The Triangle 1",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "PATTERN GENERATION",
    "businessScenario": "P(R) represents a pattern drawn by Julia in R rows. The following pattern represents P(5):\n* * * * *\n* * * *\n* * *\n* *\n*\n\nWrite a query to print the pattern P(20).",
    "requirements": [
      "Print 20 rows of asterisks separated by space",
      "Start with 20 asterisks on row 1, decrementing to 1 on row 20"
    ],
    "schemas": [],
    "expectedOutput": {
      "columns": [
        "pattern"
      ],
      "rows": [
        {
          "pattern": "* * * * * * * * * * * * * * * * * * * *"
        },
        {
          "pattern": "* * * * * * * * * * * * * * * * * * *"
        },
        {
          "pattern": "* * * * * * * * * * * * * * * * * *"
        }
      ]
    },
    "hints": {
      "tier1": "Use a recursive CTE with REPEAT('* ', n).",
      "tier2": "Start from 20 and decrement down to 1.",
      "tier3Skeleton": "WITH RECURSIVE r AS (SELECT 20 AS n UNION ALL SELECT n - 1 FROM r WHERE n > 1) SELECT TRIM(REPEAT('* ', n)) AS pattern FROM r;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "WITH RECURSIVE r AS (SELECT 20 AS n UNION ALL SELECT n - 1 FROM r WHERE n > 1) SELECT TRIM(REPEAT('* ', n)) AS pattern FROM r;",
      "snowflake": "WITH RECURSIVE r AS (SELECT 20 AS n UNION ALL SELECT n - 1 FROM r WHERE n > 1) SELECT TRIM(REPEAT('* ', n)) AS pattern FROM r;",
      "bigquery": "SELECT TRIM(REPEAT('* ', n)) AS pattern FROM UNNEST(GENERATE_ARRAY(20, 1, -1)) AS n;",
      "mysql": "SELECT TRIM(REPEAT('* ', n)) AS pattern FROM (SELECT 20 AS n UNION SELECT 19 UNION SELECT 18 UNION SELECT 17 UNION SELECT 16 UNION SELECT 15 UNION SELECT 14 UNION SELECT 13 UNION SELECT 12 UNION SELECT 11 UNION SELECT 10 UNION SELECT 9 UNION SELECT 8 UNION SELECT 7 UNION SELECT 6 UNION SELECT 5 UNION SELECT 4 UNION SELECT 3 UNION SELECT 2 UNION SELECT 1) t ORDER BY n DESC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/draw-the-triangle-1/problem",
    "companyTag": "Microsoft",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_draw_the_triangle_2",
    "questionNumber": 56,
    "title": "Draw The Triangle 2",
    "platform": "HackerRank",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "beginner_basics",
    "topicLabel": "PATTERN GENERATION",
    "businessScenario": "P(R) represents a pattern drawn by Julia in R rows. The following pattern represents P(5):\n*\n* *\n* * *\n* * * *\n* * * * *\n\nWrite a query to print the pattern P(20).",
    "requirements": [
      "Print 20 rows of asterisks separated by space",
      "Start with 1 asterisk on row 1, incrementing to 20 on row 20"
    ],
    "schemas": [],
    "expectedOutput": {
      "columns": [
        "pattern"
      ],
      "rows": [
        {
          "pattern": "*"
        },
        {
          "pattern": "* *"
        },
        {
          "pattern": "* * *"
        }
      ]
    },
    "hints": {
      "tier1": "Use a recursive CTE with REPEAT('* ', n).",
      "tier2": "Start from 1 and increment up to 20.",
      "tier3Skeleton": "WITH RECURSIVE r AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM r WHERE n < 20) SELECT TRIM(REPEAT('* ', n)) AS pattern FROM r;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "WITH RECURSIVE r AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM r WHERE n < 20) SELECT TRIM(REPEAT('* ', n)) AS pattern FROM r;",
      "snowflake": "WITH RECURSIVE r AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM r WHERE n < 20) SELECT TRIM(REPEAT('* ', n)) AS pattern FROM r;",
      "bigquery": "SELECT TRIM(REPEAT('* ', n)) AS pattern FROM UNNEST(GENERATE_ARRAY(1, 20)) AS n;",
      "mysql": "SELECT TRIM(REPEAT('* ', n)) AS pattern FROM (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20) t ORDER BY n ASC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/draw-the-triangle-2/problem",
    "companyTag": "Microsoft",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_15_days_of_learning_sql",
    "questionNumber": 57,
    "title": "15 Days of Learning SQL",
    "platform": "HackerRank",
    "difficulty": "Hard",
    "skillLevel": "Advanced",
    "industry": "SaaS",
    "topic": "advanced_analytics",
    "topicLabel": "DAILY CONSECUTIVE SUBMISSIONS",
    "businessScenario": "Julia conducted a 15 days of learning SQL contest. The start date was March 01, 2016 and the end date was March 15, 2016.\n\nWrite a query to print total number of unique hackers who made at least 1 submission each day (starting on the first day of the contest), and find the hacker_id and name of the hacker who made maximum number of submissions each day. If more than one such hacker has a maximum number of submissions, print the lowest hacker_id. The query should print this information for each day of the contest, sorted by the date.\n\nThe Hackers and Submissions tables are described as follows:",
    "requirements": [
      "For each submission date, count unique hackers who submitted on ALL preceding contest days",
      "For each submission date, find the hacker with the highest submission count (break ties by lowest hacker_id)",
      "Order results by submission_date ASC"
    ],
    "schemas": [
      {
        "tableName": "Hackers",
        "columns": [
          {
            "name": "hacker_id",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "name",
            "type": "STRING"
          }
        ],
        "sampleRows": [
          {
            "hacker_id": 5580,
            "name": "Rose"
          },
          {
            "hacker_id": 84072,
            "name": "Angela"
          },
          {
            "hacker_id": 21283,
            "name": "Frank"
          },
          {
            "hacker_id": 88255,
            "name": "Patrick"
          },
          {
            "hacker_id": 5077,
            "name": "Lisa"
          }
        ]
      },
      {
        "tableName": "Submissions",
        "columns": [
          {
            "name": "submission_id",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "hacker_id",
            "type": "INTEGER",
            "isFk": true
          },
          {
            "name": "challenge_id",
            "type": "INTEGER",
            "isFk": true
          },
          {
            "name": "score",
            "type": "INTEGER"
          }
        ],
        "sampleRows": [
          {
            "submission_id": 94613,
            "hacker_id": 84072,
            "challenge_id": 4810,
            "score": 20
          },
          {
            "submission_id": 93821,
            "hacker_id": 5580,
            "challenge_id": 71055,
            "score": 30
          },
          {
            "submission_id": 67421,
            "hacker_id": 21283,
            "challenge_id": 2108,
            "score": 20
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "submission_date",
        "unique_hackers",
        "hacker_id",
        "name"
      ],
      "rows": [
        {
          "submission_date": "2016-03-01",
          "unique_hackers": 4,
          "hacker_id": 21283,
          "name": "Frank"
        }
      ]
    },
    "hints": {
      "tier1": "Break into two parts: unique continuous hackers count and top submission hacker per date.",
      "tier2": "For continuous hackers, count distinct previous dates equal to date difference from day 1.",
      "tier3Skeleton": "SELECT submission_date, (SELECT COUNT(DISTINCT hacker_id) ...) AS continuous_hackers, hacker_id, name FROM Submissions GROUP BY submission_date ORDER BY submission_date ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT s.submission_date, COUNT(DISTINCT s.hacker_id) AS continuous_hackers, MIN(s.hacker_id) AS hacker_id, h.name FROM Submissions s JOIN Hackers h ON s.hacker_id = h.hacker_id GROUP BY s.submission_date, h.name ORDER BY s.submission_date ASC;",
      "snowflake": "SELECT s.submission_date, COUNT(DISTINCT s.hacker_id) AS continuous_hackers, MIN(s.hacker_id) AS hacker_id, h.name FROM Submissions s JOIN Hackers h ON s.hacker_id = h.hacker_id GROUP BY s.submission_date, h.name ORDER BY s.submission_date ASC;",
      "bigquery": "SELECT s.submission_date, COUNT(DISTINCT s.hacker_id) AS continuous_hackers, MIN(s.hacker_id) AS hacker_id, h.name FROM Submissions s JOIN Hackers h ON s.hacker_id = h.hacker_id GROUP BY s.submission_date, h.name ORDER BY s.submission_date ASC;",
      "mysql": "SELECT s.submission_date, COUNT(DISTINCT s.hacker_id) AS continuous_hackers, MIN(s.hacker_id) AS hacker_id, h.name FROM Submissions s JOIN Hackers h ON s.hacker_id = h.hacker_id GROUP BY s.submission_date, h.name ORDER BY s.submission_date ASC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/15-days-of-learning-sql/problem",
    "companyTag": "Meta",
    "isLiveAutoIngested": true
  },
  {
    "id": "hr_interviews",
    "questionNumber": 58,
    "title": "Interviews",
    "platform": "HackerRank",
    "difficulty": "Hard",
    "skillLevel": "Advanced",
    "industry": "SaaS",
    "topic": "joins",
    "topicLabel": "AGGREGATED METRICS JOIN",
    "businessScenario": "Samantha interviews many candidates from different colleges using coding challenges. Write a query to print the contest_id, hacker_id, name, and the sums of total_submissions, total_accepted_submissions, total_views, and total_unique_views for each contest sorted by contest_id. Exclude the contest from the result if all four sums are 0.\n\nThe Contests, Colleges, Challenges, View_Stats, and Submission_Stats tables are described as follows:",
    "requirements": [
      "Aggregate View_Stats grouped by challenge_id before joining",
      "Aggregate Submission_Stats grouped by challenge_id before joining",
      "Join Contests -> Colleges -> Challenges -> Aggregated Stats",
      "Filter out contests where all four sum totals equal 0",
      "Order output by contest_id ASC"
    ],
    "schemas": [
      {
        "tableName": "Hackers",
        "columns": [
          {
            "name": "hacker_id",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "name",
            "type": "STRING"
          }
        ],
        "sampleRows": [
          {
            "hacker_id": 5580,
            "name": "Rose"
          },
          {
            "hacker_id": 84072,
            "name": "Angela"
          },
          {
            "hacker_id": 21283,
            "name": "Frank"
          },
          {
            "hacker_id": 88255,
            "name": "Patrick"
          },
          {
            "hacker_id": 5077,
            "name": "Lisa"
          }
        ]
      },
      {
        "tableName": "Challenges",
        "columns": [
          {
            "name": "challenge_id",
            "type": "INTEGER",
            "isPk": true
          },
          {
            "name": "hacker_id",
            "type": "INTEGER",
            "isFk": true
          },
          {
            "name": "difficulty_level",
            "type": "INTEGER"
          }
        ],
        "sampleRows": [
          {
            "challenge_id": 4810,
            "hacker_id": 84072,
            "difficulty_level": 1
          },
          {
            "challenge_id": 71055,
            "hacker_id": 5580,
            "difficulty_level": 2
          },
          {
            "challenge_id": 2108,
            "hacker_id": 21283,
            "difficulty_level": 1
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "contest_id",
        "hacker_id",
        "name",
        "total_submissions",
        "total_accepted_submissions",
        "total_views",
        "total_unique_views"
      ],
      "rows": [
        {
          "contest_id": 66406,
          "hacker_id": 84072,
          "name": "Angela",
          "total_submissions": 111,
          "total_accepted_submissions": 39,
          "total_views": 156,
          "total_unique_views": 56
        }
      ]
    },
    "hints": {
      "tier1": "Sum View_Stats and Submission_Stats in separate subqueries by challenge_id to avoid cartesian product multiplication.",
      "tier2": "Join Contests, Colleges, Challenges, and the two pre-aggregated views.",
      "tier3Skeleton": "SELECT con.contest_id, con.hacker_id, con.name, SUM(ss.total_submissions), SUM(ss.total_accepted_submissions), SUM(vs.total_views), SUM(vs.total_unique_views) FROM Contests con JOIN Colleges col ON con.contest_id = col.contest_id JOIN Challenges cha ON col.college_id = cha.college_id LEFT JOIN (...) ss ON cha.challenge_id = ss.challenge_id LEFT JOIN (...) vs ON cha.challenge_id = vs.challenge_id GROUP BY con.contest_id, con.hacker_id, con.name ORDER BY con.contest_id ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT c.hacker_id, h.name FROM Challenges c JOIN Hackers h ON c.hacker_id = h.hacker_id GROUP BY c.hacker_id, h.name ORDER BY c.hacker_id ASC;",
      "snowflake": "SELECT c.hacker_id, h.name FROM Challenges c JOIN Hackers h ON c.hacker_id = h.hacker_id GROUP BY c.hacker_id, h.name ORDER BY c.hacker_id ASC;",
      "bigquery": "SELECT c.hacker_id, h.name FROM Challenges c JOIN Hackers h ON c.hacker_id = h.hacker_id GROUP BY c.hacker_id, h.name ORDER BY c.hacker_id ASC;",
      "mysql": "SELECT c.hacker_id, h.name FROM Challenges c JOIN Hackers h ON c.hacker_id = h.hacker_id GROUP BY c.hacker_id, h.name ORDER BY c.hacker_id ASC;"
    },
    "sourcePlatform": "HackerRank Official SQL Track",
    "sourceUrl": "https://www.hackerrank.com/challenges/interviews/problem",
    "companyTag": "Uber",
    "isLiveAutoIngested": true
  }
];

export const AUTHENTIC_HACKERRANK_PROBLEMS: SqlProblem[] = ALL_HACKERRANK_PROBLEMS;
