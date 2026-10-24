/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DataLemur Authentic SQL Interview Challenges Catalog
 * Sourced directly from DataLemur (https://datalemur.com/questions)
 * Curated by Nick Singh (author of Ace the Data Science Interview)
 * Featuring real interview rounds from Meta, Amazon, Google, LinkedIn, Tesla, Twitter, TikTok, Uber, Stripe, etc.
 */

import { SqlProblem, TableSchema } from '../types';

// ============================================================================
// AUTHENTIC DATALEMUR RELATIONAL SCHEMAS
// ============================================================================

export const SCHEMA_CANDIDATES: TableSchema = {
  tableName: 'candidates',
  columns: [
    { name: 'candidate_id', type: 'INT', isPk: true, description: 'Unique candidate identifier' },
    { name: 'skill', type: 'VARCHAR', description: 'Technical skill name (e.g. Python, Tableau, PostgreSQL)' },
  ],
  sampleRows: [
    { candidate_id: 123, skill: 'Python' },
    { candidate_id: 123, skill: 'Tableau' },
    { candidate_id: 123, skill: 'PostgreSQL' },
    { candidate_id: 234, skill: 'R' },
    { candidate_id: 234, skill: 'PowerBI' },
    { candidate_id: 234, skill: 'SQL Server' },
    { candidate_id: 345, skill: 'Python' },
    { candidate_id: 345, skill: 'Tableau' },
  ],
};

export const SCHEMA_PAGES: TableSchema = {
  tableName: 'pages',
  columns: [
    { name: 'page_id', type: 'INT', isPk: true, description: 'Facebook page identifier' },
    { name: 'page_name', type: 'VARCHAR', description: 'Display name of page' },
  ],
  sampleRows: [
    { page_id: 20001, page_name: 'SQL Daily' },
    { page_id: 20002, page_name: 'Tech Prep Club' },
    { page_id: 20003, page_name: 'Data Science Hub' },
    { page_id: 20004, page_name: 'LeetCode Community' },
  ],
};

export const SCHEMA_PAGE_LIKES: TableSchema = {
  tableName: 'page_likes',
  columns: [
    { name: 'user_id', type: 'INT', description: 'User who liked page' },
    { name: 'page_id', type: 'INT', isFk: true, description: 'Page liked' },
    { name: 'liked_date', type: 'DATETIME', description: 'Timestamp when like was placed' },
  ],
  sampleRows: [
    { user_id: 111, page_id: 20001, liked_date: '2026-04-08 00:00:00' },
    { user_id: 121, page_id: 20002, liked_date: '2026-05-01 00:00:00' },
    { user_id: 156, page_id: 20001, liked_date: '2026-06-23 00:00:00' },
  ],
};

export const SCHEMA_PARTS_ASSEMBLY: TableSchema = {
  tableName: 'parts_assembly',
  columns: [
    { name: 'part', type: 'VARCHAR', description: 'Assembly part name' },
    { name: 'finish_date', type: 'DATETIME', description: 'Date finished, or NULL if in-progress' },
    { name: 'assembly_step', type: 'INT', description: 'Sequence number of step' },
  ],
  sampleRows: [
    { part: 'battery', finish_date: '2026-01-22 00:00:00', assembly_step: 1 },
    { part: 'battery', finish_date: '2026-02-22 00:00:00', assembly_step: 2 },
    { part: 'battery', finish_date: '2026-03-22 00:00:00', assembly_step: 3 },
    { part: 'bumper', finish_date: '2026-01-22 00:00:00', assembly_step: 1 },
    { part: 'bumper', finish_date: null, assembly_step: 2 },
    { part: 'chassis', finish_date: '2026-01-22 00:00:00', assembly_step: 1 },
    { part: 'chassis', finish_date: null, assembly_step: 2 },
  ],
};

export const SCHEMA_TWEETS: TableSchema = {
  tableName: 'tweets',
  columns: [
    { name: 'tweet_id', type: 'INT', isPk: true, description: 'Unique tweet ID' },
    { name: 'user_id', type: 'INT', description: 'Twitter user ID' },
    { name: 'msg', type: 'VARCHAR', description: 'Tweet content' },
    { name: 'tweet_date', type: 'DATETIME', description: 'Timestamp when tweet was posted' },
  ],
  sampleRows: [
    { tweet_id: 214252, user_id: 111, msg: 'Good morning tech twitter', tweet_date: '2022-03-22 12:00:00' },
    { tweet_id: 739252, user_id: 111, msg: 'Learning SQL window functions', tweet_date: '2022-04-06 19:00:00' },
    { tweet_id: 846402, user_id: 111, msg: 'Building data pipelines', tweet_date: '2022-05-20 10:00:00' },
    { tweet_id: 241425, user_id: 254, msg: 'Just solved a tricky CTE', tweet_date: '2022-03-01 00:00:00' },
    { tweet_id: 136463, user_id: 148, msg: 'Hiring data engineers', tweet_date: '2022-05-07 09:30:00' },
  ],
};

export const SCHEMA_VIEWERSHIP: TableSchema = {
  tableName: 'viewership',
  columns: [
    { name: 'user_id', type: 'INT', description: 'User reader ID' },
    { name: 'device_type', type: 'VARCHAR', description: 'laptop, tablet, or phone' },
    { name: 'view_time', type: 'DATETIME', description: 'Article view timestamp' },
  ],
  sampleRows: [
    { user_id: 123, device_type: 'laptop', view_time: '2026-02-12 10:00:00' },
    { user_id: 125, device_type: 'tablet', view_time: '2026-02-12 11:30:00' },
    { user_id: 128, device_type: 'phone', view_time: '2026-02-12 14:15:00' },
    { user_id: 129, device_type: 'laptop', view_time: '2026-02-13 09:00:00' },
    { user_id: 139, device_type: 'phone', view_time: '2026-02-13 18:45:00' },
  ],
};

export const SCHEMA_TRADES: TableSchema = {
  tableName: 'trades',
  columns: [
    { name: 'order_id', type: 'INT', isPk: true, description: 'Order ID' },
    { name: 'user_id', type: 'INT', isFk: true, description: 'Trader user ID' },
    { name: 'price', type: 'DECIMAL', description: 'Execution price per share' },
    { name: 'quantity', type: 'INT', description: 'Number of shares traded' },
    { name: 'status', type: 'VARCHAR', description: 'Completed or Cancelled' },
    { name: 'timestamp', type: 'DATETIME', description: 'Trade execution time' },
  ],
  sampleRows: [
    { order_id: 100101, user_id: 111, price: 9.80, quantity: 10, status: 'Completed', timestamp: '2026-08-17 12:00:00' },
    { order_id: 100102, user_id: 111, price: 10.00, quantity: 10, status: 'Completed', timestamp: '2026-08-17 12:05:00' },
    { order_id: 100256, user_id: 148, price: 5.10, quantity: 35, status: 'Completed', timestamp: '2026-08-18 10:00:00' },
    { order_id: 100512, user_id: 178, price: 32.50, quantity: 5, status: 'Cancelled', timestamp: '2026-08-19 14:00:00' },
    { order_id: 100640, user_id: 156, price: 120.00, quantity: 2, status: 'Completed', timestamp: '2026-08-19 15:30:00' },
  ],
};

export const SCHEMA_USERS_CITY: TableSchema = {
  tableName: 'users',
  columns: [
    { name: 'user_id', type: 'INT', isPk: true, description: 'Trader user ID' },
    { name: 'city', type: 'VARCHAR', description: 'Home metro city' },
    { name: 'email', type: 'VARCHAR', description: 'Account email' },
    { name: 'signup_date', type: 'DATETIME', description: 'Account registration timestamp' },
  ],
  sampleRows: [
    { user_id: 111, city: 'San Francisco', email: 'user111@gmail.com', signup_date: '2025-03-21 00:00:00' },
    { user_id: 148, city: 'Boston', email: 'user148@gmail.com', signup_date: '2025-05-18 00:00:00' },
    { user_id: 156, city: 'San Francisco', email: 'user156@gmail.com', signup_date: '2025-08-03 00:00:00' },
    { user_id: 178, city: 'Denver', email: 'user178@gmail.com', signup_date: '2025-09-09 00:00:00' },
  ],
};

export const SCHEMA_REVIEWS: TableSchema = {
  tableName: 'reviews',
  columns: [
    { name: 'review_id', type: 'INT', isPk: true, description: 'Review ID' },
    { name: 'user_id', type: 'INT', description: 'Reviewer user ID' },
    { name: 'submit_date', type: 'DATETIME', description: 'Date of review submission' },
    { name: 'product_id', type: 'INT', description: 'Product identifier' },
    { name: 'stars', type: 'INT', description: 'Rating 1 to 5' },
  ],
  sampleRows: [
    { review_id: 6171, user_id: 123, submit_date: '2026-06-08 00:00:00', product_id: 50001, stars: 4 },
    { review_id: 7802, user_id: 265, submit_date: '2026-06-10 00:00:00', product_id: 69852, stars: 4 },
    { review_id: 5293, user_id: 362, submit_date: '2026-06-18 00:00:00', product_id: 50001, stars: 3 },
    { review_id: 6352, user_id: 192, submit_date: '2026-07-10 00:00:00', product_id: 69852, stars: 5 },
    { review_id: 4552, user_id: 130, submit_date: '2026-07-20 00:00:00', product_id: 69852, stars: 3 },
  ],
};

export const SCHEMA_JOB_LISTINGS: TableSchema = {
  tableName: 'job_listings',
  columns: [
    { name: 'job_id', type: 'INT', isPk: true, description: 'Job listing identifier' },
    { name: 'company_id', type: 'INT', description: 'Company posting the role' },
    { name: 'title', type: 'VARCHAR', description: 'Job title' },
    { name: 'description', type: 'VARCHAR', description: 'Job posting description text' },
  ],
  sampleRows: [
    { job_id: 248, company_id: 827, title: 'Data Scientist', description: 'Build LLMs and predictive systems.' },
    { job_id: 149, company_id: 845, title: 'Software Engineer', description: 'Scale distributed backend systems.' },
    { job_id: 945, company_id: 845, title: 'Software Engineer', description: 'Scale distributed backend systems.' },
    { job_id: 164, company_id: 345, title: 'Data Engineer', description: 'Construct real-time streaming pipelines.' },
    { job_id: 172, company_id: 244, title: 'Data Analyst', description: 'Create executive dashboards.' },
  ],
};

export const SCHEMA_MESSAGES: TableSchema = {
  tableName: 'messages',
  columns: [
    { name: 'message_id', type: 'INT', isPk: true, description: 'Message identifier' },
    { name: 'sender_id', type: 'INT', description: 'User ID of sender' },
    { name: 'receiver_id', type: 'INT', description: 'User ID of recipient' },
    { name: 'content', type: 'VARCHAR', description: 'Message body' },
    { name: 'sent_date', type: 'DATETIME', description: 'Timestamp message was sent' },
  ],
  sampleRows: [
    { message_id: 901, sender_id: 3601, receiver_id: 4500, content: 'Hey can we review the PR?', sent_date: '2022-08-03 16:43:00' },
    { message_id: 902, sender_id: 4500, receiver_id: 3601, content: 'Sure, looking at it now', sent_date: '2022-08-03 16:45:00' },
    { message_id: 943, sender_id: 3601, receiver_id: 8752, content: 'Updated unit tests', sent_date: '2022-08-08 09:12:00' },
    { message_id: 955, sender_id: 3601, receiver_id: 2511, content: 'Deploying to prod', sent_date: '2022-08-11 11:20:00' },
    { message_id: 980, sender_id: 2511, receiver_id: 3601, content: 'Acknowledged', sent_date: '2022-08-15 14:00:00' },
  ],
};

export const SCHEMA_PHARMACY_SALES: TableSchema = {
  tableName: 'pharmacy_sales',
  columns: [
    { name: 'product_id', type: 'INT', isPk: true, description: 'Pharmaceutical product ID' },
    { name: 'units_sold', type: 'INT', description: 'Total units sold' },
    { name: 'total_sales', type: 'DECIMAL', description: 'Total gross sales in USD' },
    { name: 'cogs', type: 'DECIMAL', description: 'Cost of goods sold in USD' },
    { name: 'manufacturer', type: 'VARCHAR', description: 'Drug manufacturer company' },
    { name: 'drug', type: 'VARCHAR', description: 'Drug trade name' },
  ],
  sampleRows: [
    { product_id: 9, units_sold: 37410, total_sales: 249714.87, cogs: 57009.22, manufacturer: 'AbbVie', drug: 'Humira' },
    { product_id: 34, units_sold: 94698, total_sales: 600904.32, cogs: 232104.55, manufacturer: 'Roche', drug: 'Avastin' },
    { product_id: 28, units_sold: 50400, total_sales: 120500.00, cogs: 145000.00, manufacturer: 'Biogen', drug: 'Aduhelm' },
    { product_id: 61, units_sold: 77397, total_sales: 1074026.05, cogs: 468533.40, manufacturer: 'Merck', drug: 'Keytruda' },
    { product_id: 74, units_sold: 21000, total_sales: 85000.00, cogs: 99000.00, manufacturer: 'Biogen', drug: 'Tysabri' },
  ],
};

export const SCHEMA_EMAILS: TableSchema = {
  tableName: 'emails',
  columns: [
    { name: 'email_id', type: 'INT', isPk: true, description: 'Email record ID' },
    { name: 'user_id', type: 'INT', description: 'TikTok user account ID' },
    { name: 'signup_date', type: 'DATETIME', description: 'Registration timestamp' },
  ],
  sampleRows: [
    { email_id: 125, user_id: 7771, signup_date: '2026-06-14 00:00:00' },
    { email_id: 236, user_id: 6950, signup_date: '2026-07-01 00:00:00' },
    { email_id: 433, user_id: 1052, signup_date: '2026-07-09 00:00:00' },
  ],
};

export const SCHEMA_TEXTS: TableSchema = {
  tableName: 'texts',
  columns: [
    { name: 'text_id', type: 'INT', isPk: true, description: 'SMS confirmation ID' },
    { name: 'email_id', type: 'INT', isFk: true, description: 'Target email record' },
    { name: 'signup_action', type: 'VARCHAR', description: 'Confirmed or Not Confirmed' },
    { name: 'action_date', type: 'DATETIME', description: 'Timestamp when user took action' },
  ],
  sampleRows: [
    { text_id: 6878, email_id: 125, signup_action: 'Confirmed', action_date: '2026-06-15 00:00:00' },
    { text_id: 6997, email_id: 236, signup_action: 'Not Confirmed', action_date: '2026-07-01 00:00:00' },
    { text_id: 7044, email_id: 433, signup_action: 'Confirmed', action_date: '2026-07-09 00:00:00' },
  ],
};

export const SCHEMA_APP_EVENTS: TableSchema = {
  tableName: 'events',
  columns: [
    { name: 'app_id', type: 'INT', description: 'Application ID' },
    { name: 'event_type', type: 'VARCHAR', description: 'impression or click' },
    { name: 'timestamp', type: 'DATETIME', description: 'Event timestamp' },
  ],
  sampleRows: [
    { app_id: 123, event_type: 'impression', timestamp: '2022-07-18 00:00:00' },
    { app_id: 123, event_type: 'impression', timestamp: '2022-07-18 01:00:00' },
    { app_id: 123, event_type: 'click', timestamp: '2022-07-18 01:05:00' },
    { app_id: 234, event_type: 'impression', timestamp: '2022-08-01 00:00:00' },
    { app_id: 234, event_type: 'click', timestamp: '2022-08-01 00:10:00' },
  ],
};

export const SCHEMA_USER_TRANSACTIONS: TableSchema = {
  tableName: 'transactions',
  columns: [
    { name: 'user_id', type: 'INT', description: 'Uber rider user ID' },
    { name: 'spend', type: 'DECIMAL', description: 'Ride transaction cost' },
    { name: 'transaction_date', type: 'DATETIME', description: 'Trip completion timestamp' },
  ],
  sampleRows: [
    { user_id: 111, spend: 100.50, transaction_date: '2026-01-08 12:00:00' },
    { user_id: 111, spend: 55.00, transaction_date: '2026-01-10 12:00:00' },
    { user_id: 111, spend: 89.60, transaction_date: '2026-01-15 12:00:00' },
    { user_id: 121, spend: 20.00, transaction_date: '2026-01-01 00:00:00' },
    { user_id: 121, spend: 40.00, transaction_date: '2026-01-03 00:00:00' },
    { user_id: 121, spend: 35.00, transaction_date: '2026-01-07 00:00:00' },
  ],
};

export const SCHEMA_ACTIVITIES: TableSchema = {
  tableName: 'activities',
  columns: [
    { name: 'activity_id', type: 'INT', isPk: true, description: 'Snap activity record ID' },
    { name: 'user_id', type: 'INT', description: 'Snapchat user ID' },
    { name: 'activity_type', type: 'VARCHAR', description: 'send, open, or chat' },
    { name: 'time_spent', type: 'FLOAT', description: 'Duration spent in minutes' },
    { name: 'activity_date', type: 'DATETIME', description: 'Timestamp of activity' },
  ],
  sampleRows: [
    { activity_id: 7274, user_id: 123, activity_type: 'open', time_spent: 4.50, activity_date: '2026-06-22 12:00:00' },
    { activity_id: 2425, user_id: 123, activity_type: 'send', time_spent: 3.50, activity_date: '2026-06-22 12:00:00' },
    { activity_id: 1413, user_id: 456, activity_type: 'send', time_spent: 5.67, activity_date: '2026-06-23 12:00:00' },
    { activity_id: 1414, user_id: 456, activity_type: 'open', time_spent: 3.00, activity_date: '2026-06-23 12:00:00' },
  ],
};

export const SCHEMA_AGE_BREAKDOWN: TableSchema = {
  tableName: 'age_breakdown',
  columns: [
    { name: 'user_id', type: 'INT', isPk: true, description: 'Snapchat user ID' },
    { name: 'age_bucket', type: 'VARCHAR', description: 'Cohort range: 21-25, 26-30, 31-35' },
  ],
  sampleRows: [
    { user_id: 123, age_bucket: '31-35' },
    { user_id: 456, age_bucket: '26-30' },
    { user_id: 789, age_bucket: '21-25' },
  ],
};

export const SCHEMA_PRODUCT_SPEND: TableSchema = {
  tableName: 'product_spend',
  columns: [
    { name: 'category_id', type: 'INT', description: 'Product category code' },
    { name: 'product_id', type: 'INT', description: 'Product item identifier' },
    { name: 'user_id', type: 'INT', description: 'Purchaser customer ID' },
    { name: 'spend', type: 'DECIMAL', description: 'Order gross spend in USD' },
    { name: 'transaction_date', type: 'DATETIME', description: 'Order checkout timestamp' },
  ],
  sampleRows: [
    { category_id: 1, product_id: 50001, user_id: 101, spend: 110.00, transaction_date: '2022-04-12 00:00:00' },
    { category_id: 1, product_id: 50001, user_id: 102, spend: 200.00, transaction_date: '2022-04-15 00:00:00' },
    { category_id: 1, product_id: 50002, user_id: 103, spend: 150.00, transaction_date: '2022-05-18 00:00:00' },
    { category_id: 2, product_id: 60001, user_id: 104, spend: 450.00, transaction_date: '2022-06-01 00:00:00' },
    { category_id: 2, product_id: 60002, user_id: 105, spend: 320.00, transaction_date: '2022-06-03 00:00:00' },
  ],
};

export const SCHEMA_CUSTOMER_CONTRACTS: TableSchema = {
  tableName: 'customer_contracts',
  columns: [
    { name: 'customer_id', type: 'INT', description: 'Enterprise enterprise ID' },
    { name: 'product_id', type: 'INT', isFk: true, description: 'Cloud product subscribed' },
    { name: 'amount', type: 'INT', description: 'Contract licensing amount' },
  ],
  sampleRows: [
    { customer_id: 1, product_id: 1, amount: 1000 },
    { customer_id: 1, product_id: 2, amount: 2000 },
    { customer_id: 1, product_id: 3, amount: 1500 },
    { customer_id: 2, product_id: 1, amount: 3000 },
    { customer_id: 3, product_id: 2, amount: 1200 },
  ],
};

export const SCHEMA_PRODUCTS: TableSchema = {
  tableName: 'products',
  columns: [
    { name: 'product_id', type: 'INT', isPk: true, description: 'Cloud service product ID' },
    { name: 'product_category', type: 'VARCHAR', description: 'Category: Compute, Storage, Analytics' },
    { name: 'product_name', type: 'VARCHAR', description: 'Product marketing name' },
  ],
  sampleRows: [
    { product_id: 1, product_category: 'Analytics', product_name: 'Azure Synapse' },
    { product_id: 2, product_category: 'Compute', product_name: 'Azure Virtual Machines' },
    { product_id: 3, product_category: 'Storage', product_name: 'Azure Blob Storage' },
  ],
};

export const SCHEMA_MEASUREMENTS: TableSchema = {
  tableName: 'measurements',
  columns: [
    { name: 'measurement_id', type: 'INT', isPk: true, description: 'Telemetry sensor event ID' },
    { name: 'measurement_value', type: 'DECIMAL', description: 'Sensor reading' },
    { name: 'measurement_time', type: 'DATETIME', description: 'Recording timestamp' },
  ],
  sampleRows: [
    { measurement_id: 131233, measurement_value: 1109.51, measurement_time: '2026-07-10 09:00:00' },
    { measurement_id: 135211, measurement_value: 1662.74, measurement_time: '2026-07-10 11:00:00' },
    { measurement_id: 523542, measurement_value: 1246.20, measurement_time: '2026-07-10 13:15:00' },
    { measurement_id: 143562, measurement_value: 1124.50, measurement_time: '2026-07-11 15:00:00' },
    { measurement_id: 346125, measurement_value: 1234.14, measurement_time: '2026-07-11 18:45:00' },
  ],
};

export const SCHEMA_PAYMENTS: TableSchema = {
  tableName: 'payments',
  columns: [
    { name: 'transaction_id', type: 'INT', isPk: true, description: 'Unique Stripe transaction ID' },
    { name: 'merchant_id', type: 'INT', description: 'Stripe merchant account' },
    { name: 'credit_card_id', type: 'INT', description: 'Card unique token' },
    { name: 'amount', type: 'DECIMAL', description: 'Charged amount in USD' },
    { name: 'transaction_timestamp', type: 'DATETIME', description: 'Payment attempt timestamp' },
  ],
  sampleRows: [
    { transaction_id: 1, merchant_id: 101, credit_card_id: 1, amount: 21.00, transaction_timestamp: '2026-09-25 12:00:00' },
    { transaction_id: 2, merchant_id: 101, credit_card_id: 1, amount: 21.00, transaction_timestamp: '2026-09-25 12:08:00' },
    { transaction_id: 3, merchant_id: 101, credit_card_id: 1, amount: 21.00, transaction_timestamp: '2026-09-25 12:28:00' },
    { transaction_id: 4, merchant_id: 102, credit_card_id: 2, amount: 50.00, transaction_timestamp: '2026-09-26 14:00:00' },
  ],
};

// Clean LeetCode comment line template generator
const DL_STARTER: Record<string, string> = {
  postgres: '-- Write your PostgreSQL query statement below\n',
  snowflake: '-- Write your Snowflake SQL query statement below\n',
  bigquery: '-- Write your GoogleSQL (BigQuery) query statement below\n',
  mysql: '# Write your MySQL query statement below\n',
};

// ============================================================================
// 65 AUTHENTIC DATALEMUR SQL INTERVIEW QUESTIONS (EASY, MEDIUM, HARD)
// ============================================================================

export const RAW_DATALEMUR_PROBLEMS: SqlProblem[] = [
  // --------------------------------------------------------------------------
  // EASY TIER (1-25)
  // --------------------------------------------------------------------------
  {
    id: 'dl_data_science_skills',
    questionNumber: 1,
    title: 'Data Science Skills',
    platform: 'DataLemur',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'HAVING & AGGREGATIONS',
    businessScenario: 'Given a table of candidates and their technical skills, you are tasked with finding all candidate IDs who possess ALL THREE of the following required skills: Python, Tableau, and PostgreSQL. Sort the candidate IDs in ascending order.',
    requirements: [
      'Filter candidates possessing Python, Tableau, and PostgreSQL',
      'Group by candidate_id with HAVING COUNT(DISTINCT skill) = 3',
      'Order output candidate_id in ascending order',
    ],
    schemas: [SCHEMA_CANDIDATES],
    expectedOutput: {
      columns: ['candidate_id'],
      rows: [
        { candidate_id: 123 },
      ],
    },
    hints: {
      tier1: 'Filter for rows where skill IN (\'Python\', \'Tableau\', \'PostgreSQL\').',
      tier2: 'Use GROUP BY candidate_id and HAVING COUNT(skill) = 3.',
      tier3Skeleton: 'SELECT candidate_id FROM candidates WHERE skill IN (\'Python\', \'Tableau\', \'PostgreSQL\') GROUP BY candidate_id HAVING COUNT(skill) = 3 ORDER BY candidate_id ASC;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `SELECT candidate_id FROM candidates WHERE skill IN ('Python', 'Tableau', 'PostgreSQL') GROUP BY candidate_id HAVING COUNT(DISTINCT skill) = 3 ORDER BY candidate_id ASC;`,
      snowflake: `SELECT candidate_id FROM candidates WHERE skill IN ('Python', 'Tableau', 'PostgreSQL') GROUP BY candidate_id HAVING COUNT(DISTINCT skill) = 3 ORDER BY candidate_id ASC;`,
      bigquery: `SELECT candidate_id FROM candidates WHERE skill IN ('Python', 'Tableau', 'PostgreSQL') GROUP BY candidate_id HAVING COUNT(DISTINCT skill) = 3 ORDER BY candidate_id ASC;`,
      mysql: `SELECT candidate_id FROM candidates WHERE skill IN ('Python', 'Tableau', 'PostgreSQL') GROUP BY candidate_id HAVING COUNT(DISTINCT skill) = 3 ORDER BY candidate_id ASC;`,
    },
    deepDive: {
      executionOrder: ['1. Filter rows by IN clause.', '2. Group by candidate_id.', '3. Enforce count = 3 with HAVING.'],
      indexStrategy: 'Composite index on (candidate_id, skill).',
      complexity: 'Time O(N), Space O(K) where K is number of candidates.',
      tradeoffs: 'Canonical solution matching Nick Singh / DataLemur benchmark.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/sql-page-with-no-likes',
    companyTag: 'LinkedIn',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_page_with_no_likes',
    questionNumber: 2,
    title: 'Page With No Likes',
    platform: 'DataLemur',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'joins',
    topicLabel: 'LEFT JOIN / ANTI-JOIN',
    businessScenario: 'Assume you are given two tables: pages containing Facebook page details and page_likes recording user likes. Write a SQL query to return the page_ids of all Facebook pages that have zero likes. Output the results ordered by page_id in ascending order.',
    requirements: [
      'Perform a LEFT JOIN between pages and page_likes',
      'Filter where page_likes.page_id IS NULL (or use NOT IN)',
      'Order results by page_id ASC',
    ],
    schemas: [SCHEMA_PAGES, SCHEMA_PAGE_LIKES],
    expectedOutput: {
      columns: ['page_id'],
      rows: [
        { page_id: 20003 },
        { page_id: 20004 },
      ],
    },
    hints: {
      tier1: 'LEFT JOIN pages on page_likes on page_id and check for NULL.',
      tier2: 'Alternatively, use WHERE page_id NOT IN (SELECT page_id FROM page_likes).',
      tier3Skeleton: 'SELECT p.page_id FROM pages p LEFT JOIN page_likes pl ON p.page_id = pl.page_id WHERE pl.page_id IS NULL ORDER BY p.page_id ASC;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `SELECT p.page_id FROM pages p LEFT JOIN page_likes pl ON p.page_id = pl.page_id WHERE pl.page_id IS NULL ORDER BY p.page_id ASC;`,
      snowflake: `SELECT p.page_id FROM pages p LEFT JOIN page_likes pl ON p.page_id = pl.page_id WHERE pl.page_id IS NULL ORDER BY p.page_id ASC;`,
      bigquery: `SELECT p.page_id FROM pages p LEFT JOIN page_likes pl ON p.page_id = pl.page_id WHERE pl.page_id IS NULL ORDER BY p.page_id ASC;`,
      mysql: `SELECT p.page_id FROM pages p LEFT JOIN page_likes pl ON p.page_id = pl.page_id WHERE pl.page_id IS NULL ORDER BY p.page_id ASC;`,
    },
    deepDive: {
      executionOrder: ['1. Scan pages and build hash table.', '2. Probe page_likes.', '3. Output unmatched outer rows.'],
      indexStrategy: 'Index on page_likes(page_id).',
      complexity: 'Time O(N + M), Space O(1).',
      tradeoffs: 'LEFT JOIN anti-join handles potential NULL semantics cleanly unlike un-guarded NOT IN.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/sql-page-with-no-likes',
    companyTag: 'Meta',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_unfinished_parts',
    questionNumber: 3,
    title: 'Unfinished Parts',
    platform: 'DataLemur',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'Logistics',
    topic: 'beginner_basics',
    topicLabel: 'NULL FILTERING',
    businessScenario: 'Tesla\'s factory assembly system records automotive parts and their manufacturing steps. An unfinished part is defined as any part that has an assembly step where finish_date IS NULL. Write a query to return all distinct unfinished parts and their steps.',
    requirements: [
      'Filter where finish_date IS NULL',
      'Select part and assembly_step columns',
      'Order by part ASC, assembly_step ASC',
    ],
    schemas: [SCHEMA_PARTS_ASSEMBLY],
    expectedOutput: {
      columns: ['part', 'assembly_step'],
      rows: [
        { part: 'bumper', assembly_step: 2 },
        { part: 'chassis', assembly_step: 2 },
      ],
    },
    hints: {
      tier1: 'In SQL, null checks require the IS NULL keyword, not = NULL.',
      tier2: 'SELECT part, assembly_step FROM parts_assembly WHERE finish_date IS NULL.',
      tier3Skeleton: 'SELECT part, assembly_step FROM parts_assembly WHERE finish_date IS NULL;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `SELECT part, assembly_step FROM parts_assembly WHERE finish_date IS NULL ORDER BY part ASC, assembly_step ASC;`,
      snowflake: `SELECT part, assembly_step FROM parts_assembly WHERE finish_date IS NULL ORDER BY part ASC, assembly_step ASC;`,
      bigquery: `SELECT part, assembly_step FROM parts_assembly WHERE finish_date IS NULL ORDER BY part ASC, assembly_step ASC;`,
      mysql: `SELECT part, assembly_step FROM parts_assembly WHERE finish_date IS NULL ORDER BY part ASC, assembly_step ASC;`,
    },
    deepDive: {
      executionOrder: ['1. Scan parts_assembly.', '2. Filter predicate finish_date IS NULL.', '3. Output projection.'],
      indexStrategy: 'Partial index on parts_assembly(part, assembly_step) WHERE finish_date IS NULL.',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Direct index scan on nullable column.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/tesla-unfinished-parts',
    companyTag: 'Tesla',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_histogram_of_tweets',
    questionNumber: 4,
    title: 'Histogram of Tweets',
    platform: 'DataLemur',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'DOUBLE AGGREGATION & CTE',
    businessScenario: 'Assume you are given a table of Twitter tweets. Write a query to obtain a histogram of tweets posted per user in 2022. Output the tweet bucket (the number of tweets a user posted) as tweet_bucket and the count of users in each bucket as users_num.',
    requirements: [
      'Filter tweets posted in calendar year 2022',
      'Count tweets per user_id in an inner query or CTE',
      'Group by the tweet count to compute number of users per bucket',
    ],
    schemas: [SCHEMA_TWEETS],
    expectedOutput: {
      columns: ['tweet_bucket', 'users_num'],
      rows: [
        { tweet_bucket: 1, users_num: 2 },
        { tweet_bucket: 3, users_num: 1 },
      ],
    },
    hints: {
      tier1: 'First aggregate tweet count per user: SELECT user_id, COUNT(tweet_id) AS tweet_count FROM tweets WHERE ... GROUP BY user_id.',
      tier2: 'Wrap that in a CTE and do: SELECT tweet_count AS tweet_bucket, COUNT(user_id) AS users_num ... GROUP BY tweet_count.',
      tier3Skeleton: 'WITH user_tweets AS (SELECT user_id, COUNT(tweet_id) as tweet_count FROM tweets WHERE tweet_date >= \'2022-01-01\' AND tweet_date <= \'2022-12-31\' GROUP BY user_id) SELECT tweet_count AS tweet_bucket, COUNT(user_id) AS users_num FROM user_tweets GROUP BY tweet_count ORDER BY tweet_bucket ASC;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `WITH user_tweets AS (
  SELECT user_id, COUNT(tweet_id) AS tweet_count
  FROM tweets
  WHERE tweet_date >= '2022-01-01' AND tweet_date <= '2022-12-31 23:59:59'
  GROUP BY user_id
)
SELECT tweet_count AS tweet_bucket, COUNT(user_id) AS users_num
FROM user_tweets
GROUP BY tweet_count
ORDER BY tweet_bucket ASC;`,
      snowflake: `WITH user_tweets AS (
  SELECT user_id, COUNT(tweet_id) AS tweet_count
  FROM tweets
  WHERE tweet_date >= '2022-01-01' AND tweet_date <= '2022-12-31 23:59:59'
  GROUP BY user_id
)
SELECT tweet_count AS tweet_bucket, COUNT(user_id) AS users_num
FROM user_tweets
GROUP BY tweet_count
ORDER BY tweet_bucket ASC;`,
      bigquery: `WITH user_tweets AS (
  SELECT user_id, COUNT(tweet_id) AS tweet_count
  FROM tweets
  WHERE tweet_date >= '2022-01-01' AND tweet_date <= '2022-12-31 23:59:59'
  GROUP BY user_id
)
SELECT tweet_count AS tweet_bucket, COUNT(user_id) AS users_num
FROM user_tweets
GROUP BY tweet_count
ORDER BY tweet_bucket ASC;`,
      mysql: `WITH user_tweets AS (
  SELECT user_id, COUNT(tweet_id) AS tweet_count
  FROM tweets
  WHERE tweet_date >= '2022-01-01' AND tweet_date <= '2022-12-31 23:59:59'
  GROUP BY user_id
)
SELECT tweet_count AS tweet_bucket, COUNT(user_id) AS users_num
FROM user_tweets
GROUP BY tweet_count
ORDER BY tweet_bucket ASC;`,
    },
    deepDive: {
      executionOrder: ['1. Filter tweets by 2022 range.', '2. Hash group by user_id.', '3. Outer group by count bucket.'],
      indexStrategy: 'Index on (tweet_date, user_id).',
      complexity: 'Time O(N), Space O(U) where U is unique users.',
      tradeoffs: 'CTE double aggregation prevents inaccurate nested grouping.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/sql-histogram-tweets',
    companyTag: 'Twitter',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_laptop_vs_mobile_viewership',
    questionNumber: 5,
    title: 'Laptop vs. Mobile Viewership',
    platform: 'DataLemur',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'CONDITIONAL AGGREGATION',
    businessScenario: 'Assume you\'re given the table on user viewership categorised by device type where the devices are laptop, tablet, and phone. Write a query to calculate the total viewership for laptops and mobile devices where mobile is defined as the sum of tablet and phone viewership. Output laptop_views and mobile_views.',
    requirements: [
      'Count laptop viewership as laptop_views',
      'Sum tablet and phone viewership together as mobile_views',
      'Use CASE WHEN conditional aggregation in a single row output',
    ],
    schemas: [SCHEMA_VIEWERSHIP],
    expectedOutput: {
      columns: ['laptop_views', 'mobile_views'],
      rows: [
        { laptop_views: 2, mobile_views: 3 },
      ],
    },
    hints: {
      tier1: 'SUM(CASE WHEN device_type = \'laptop\' THEN 1 ELSE 0 END) AS laptop_views.',
      tier2: 'SUM(CASE WHEN device_type IN (\'tablet\', \'phone\') THEN 1 ELSE 0 END) AS mobile_views.',
      tier3Skeleton: 'SELECT SUM(CASE WHEN device_type = \'laptop\' THEN 1 ELSE 0 END) AS laptop_views, SUM(CASE WHEN device_type IN (\'tablet\', \'phone\') THEN 1 ELSE 0 END) AS mobile_views FROM viewership;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `SELECT 
  SUM(CASE WHEN device_type = 'laptop' THEN 1 ELSE 0 END) AS laptop_views,
  SUM(CASE WHEN device_type IN ('tablet', 'phone') THEN 1 ELSE 0 END) AS mobile_views
FROM viewership;`,
      snowflake: `SELECT 
  SUM(CASE WHEN device_type = 'laptop' THEN 1 ELSE 0 END) AS laptop_views,
  SUM(CASE WHEN device_type IN ('tablet', 'phone') THEN 1 ELSE 0 END) AS mobile_views
FROM viewership;`,
      bigquery: `SELECT 
  SUM(CASE WHEN device_type = 'laptop' THEN 1 ELSE 0 END) AS laptop_views,
  SUM(CASE WHEN device_type IN ('tablet', 'phone') THEN 1 ELSE 0 END) AS mobile_views
FROM viewership;`,
      mysql: `SELECT 
  SUM(CASE WHEN device_type = 'laptop' THEN 1 ELSE 0 END) AS laptop_views,
  SUM(CASE WHEN device_type IN ('tablet', 'phone') THEN 1 ELSE 0 END) AS mobile_views
FROM viewership;`,
    },
    deepDive: {
      executionOrder: ['1. Single scan through viewership table.', '2. Accumulate conditional sums.', '3. Output single summary row.'],
      indexStrategy: 'Index on viewership(device_type).',
      complexity: 'Time O(N), Space O(1).',
      tradeoffs: 'Single pass conditional aggregation is 2x faster than UNION ALL or subqueries.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/laptop-mobile-viewership',
    companyTag: 'New York Times',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_cities_with_completed_trades',
    questionNumber: 6,
    title: 'Cities With Completed Trades',
    platform: 'DataLemur',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'FinTech',
    topic: 'joins',
    topicLabel: 'JOIN & ORDER BY LIMIT',
    businessScenario: 'You are an analyst on Robinhood\'s trading desk. Write a query to identify the top 3 cities with the highest number of completed trade orders. Output the city and the number of completed trades as total_orders. Order results by total_orders in descending order.',
    requirements: [
      'Join trades with users table on user_id',
      'Filter trades where status = "Completed"',
      'Group by city and compute COUNT(order_id) AS total_orders',
      'Sort by total_orders DESC and limit to top 3',
    ],
    schemas: [SCHEMA_TRADES, SCHEMA_USERS_CITY],
    expectedOutput: {
      columns: ['city', 'total_orders'],
      rows: [
        { city: 'San Francisco', total_orders: 3 },
        { city: 'Boston', total_orders: 1 },
      ],
    },
    hints: {
      tier1: 'JOIN trades t ON u.user_id = t.user_id WHERE t.status = \'Completed\'.',
      tier2: 'GROUP BY u.city ORDER BY total_orders DESC LIMIT 3.',
      tier3Skeleton: 'SELECT u.city, COUNT(t.order_id) AS total_orders FROM trades t JOIN users u ON t.user_id = u.user_id WHERE t.status = \'Completed\' GROUP BY u.city ORDER BY total_orders DESC LIMIT 3;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `SELECT u.city, COUNT(t.order_id) AS total_orders
FROM trades t
JOIN users u ON t.user_id = u.user_id
WHERE t.status = 'Completed'
GROUP BY u.city
ORDER BY total_orders DESC
LIMIT 3;`,
      snowflake: `SELECT u.city, COUNT(t.order_id) AS total_orders
FROM trades t
JOIN users u ON t.user_id = u.user_id
WHERE t.status = 'Completed'
GROUP BY u.city
ORDER BY total_orders DESC
LIMIT 3;`,
      bigquery: `SELECT u.city, COUNT(t.order_id) AS total_orders
FROM trades t
JOIN users u ON t.user_id = u.user_id
WHERE t.status = 'Completed'
GROUP BY u.city
ORDER BY total_orders DESC
LIMIT 3;`,
      mysql: `SELECT u.city, COUNT(t.order_id) AS total_orders
FROM trades t
JOIN users u ON t.user_id = u.user_id
WHERE t.status = 'Completed'
GROUP BY u.city
ORDER BY total_orders DESC
LIMIT 3;`,
    },
    deepDive: {
      executionOrder: ['1. Filter completed trades.', '2. Join with users.', '3. Group by city.', '4. Order and take top 3.'],
      indexStrategy: 'Index on trades(status, user_id).',
      complexity: 'Time O(N log K), Space O(K) where K is unique cities.',
      tradeoffs: 'Inner join eliminates orders without registered users.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/completed-trades',
    companyTag: 'Robinhood',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_average_review_ratings',
    questionNumber: 7,
    title: 'Average Review Ratings',
    platform: 'DataLemur',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'E-Commerce',
    topic: 'datetime',
    topicLabel: 'DATE EXTRACTION & ROUND',
    businessScenario: 'Given the reviews table from Amazon marketplace, write a query to retrieve the average star rating for each product, broken down by month. The output should include the month as mth, product_id, and the average stars rounded to 2 decimal places as avg_stars. Order by month ascending, then product_id ascending.',
    requirements: [
      'Extract month number from submit_date as mth',
      'Compute ROUND(AVG(stars), 2) AS avg_stars',
      'Group by mth, product_id and order by mth ASC, product_id ASC',
    ],
    schemas: [SCHEMA_REVIEWS],
    expectedOutput: {
      columns: ['mth', 'product_id', 'avg_stars'],
      rows: [
        { mth: 6, product_id: 50001, avg_stars: 3.50 },
        { mth: 6, product_id: 69852, avg_stars: 4.00 },
        { mth: 7, product_id: 69852, avg_stars: 4.00 },
      ],
    },
    hints: {
      tier1: 'In PostgreSQL / standard SQL use EXTRACT(MONTH FROM submit_date).',
      tier2: 'Use ROUND(AVG(stars * 1.0), 2) to ensure decimal precision.',
      tier3Skeleton: 'SELECT EXTRACT(MONTH FROM submit_date) AS mth, product_id, ROUND(AVG(stars), 2) AS avg_stars FROM reviews GROUP BY EXTRACT(MONTH FROM submit_date), product_id ORDER BY mth ASC, product_id ASC;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `SELECT 
  EXTRACT(MONTH FROM submit_date) AS mth,
  product_id,
  ROUND(AVG(stars), 2) AS avg_stars
FROM reviews
GROUP BY EXTRACT(MONTH FROM submit_date), product_id
ORDER BY mth ASC, product_id ASC;`,
      snowflake: `SELECT 
  EXTRACT(MONTH FROM submit_date) AS mth,
  product_id,
  ROUND(AVG(stars), 2) AS avg_stars
FROM reviews
GROUP BY EXTRACT(MONTH FROM submit_date), product_id
ORDER BY mth ASC, product_id ASC;`,
      bigquery: `SELECT 
  EXTRACT(MONTH FROM submit_date) AS mth,
  product_id,
  ROUND(AVG(stars), 2) AS avg_stars
FROM reviews
GROUP BY EXTRACT(MONTH FROM submit_date), product_id
ORDER BY mth ASC, product_id ASC;`,
      mysql: `SELECT 
  MONTH(submit_date) AS mth,
  product_id,
  ROUND(AVG(stars), 2) AS avg_stars
FROM reviews
GROUP BY MONTH(submit_date), product_id
ORDER BY mth ASC, product_id ASC;`,
    },
    deepDive: {
      executionOrder: ['1. Extract month component from timestamp.', '2. Group by month and product.', '3. Compute average and round.'],
      indexStrategy: 'Index on (submit_date, product_id, stars).',
      complexity: 'Time O(N log N) for sorting groups, Space O(U).',
      tradeoffs: 'Grouping by extracted month aggregates across different years if multi-year present.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/sql-avg-review-ratings',
    companyTag: 'Amazon',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_duplicate_job_listings',
    questionNumber: 8,
    title: 'Duplicate Job Listings',
    platform: 'DataLemur',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'DUPLICATE DETECTION',
    businessScenario: 'Assume you\'re given a table containing job postings from LinkedIn. Write a query to retrieve the number of companies that have posted duplicate job listings. Duplicate listings are defined as jobs sharing the same title and description posted by the same company_id.',
    requirements: [
      'Identify duplicates using GROUP BY company_id, title, description HAVING COUNT(job_id) > 1',
      'Count distinct company_ids that have at least one duplicate set',
      'Output column as duplicate_companies',
    ],
    schemas: [SCHEMA_JOB_LISTINGS],
    expectedOutput: {
      columns: ['duplicate_companies'],
      rows: [
        { duplicate_companies: 1 },
      ],
    },
    hints: {
      tier1: 'Use a subquery to find companies with duplicate job postings.',
      tier2: 'In the subquery: SELECT company_id FROM job_listings GROUP BY company_id, title, description HAVING COUNT(job_id) > 1.',
      tier3Skeleton: 'WITH dupes AS (SELECT company_id FROM job_listings GROUP BY company_id, title, description HAVING COUNT(job_id) > 1) SELECT COUNT(DISTINCT company_id) AS duplicate_companies FROM dupes;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `WITH duplicate_postings AS (
  SELECT company_id
  FROM job_listings
  GROUP BY company_id, title, description
  HAVING COUNT(job_id) > 1
)
SELECT COUNT(DISTINCT company_id) AS duplicate_companies
FROM duplicate_postings;`,
      snowflake: `WITH duplicate_postings AS (
  SELECT company_id
  FROM job_listings
  GROUP BY company_id, title, description
  HAVING COUNT(job_id) > 1
)
SELECT COUNT(DISTINCT company_id) AS duplicate_companies
FROM duplicate_postings;`,
      bigquery: `WITH duplicate_postings AS (
  SELECT company_id
  FROM job_listings
  GROUP BY company_id, title, description
  HAVING COUNT(job_id) > 1
)
SELECT COUNT(DISTINCT company_id) AS duplicate_companies
FROM duplicate_postings;`,
      mysql: `WITH duplicate_postings AS (
  SELECT company_id
  FROM job_listings
  GROUP BY company_id, title, description
  HAVING COUNT(job_id) > 1
)
SELECT COUNT(DISTINCT company_id) AS duplicate_companies
FROM duplicate_postings;`,
    },
    deepDive: {
      executionOrder: ['1. Group by composite tuple (company_id, title, description).', '2. Filter counts > 1.', '3. Distinct count of companies.'],
      indexStrategy: 'Composite index on (company_id, title, description).',
      complexity: 'Time O(N), Space O(K).',
      tradeoffs: 'CTE handles multiple duplicated jobs per company by applying DISTINCT.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/duplicate-job-listings',
    companyTag: 'LinkedIn',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_teams_power_users',
    questionNumber: 9,
    title: 'Teams Power Users',
    platform: 'DataLemur',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'aggregations',
    topicLabel: 'HAVING & DATES',
    businessScenario: 'Write a query to identify the top 2 power users who sent the highest number of messages on Microsoft Teams in August 2022. Output the sender_id and the total number of messages sent as message_count. Sort the results in descending order of the message count.',
    requirements: [
      'Filter for messages sent between August 1, 2022 and August 31, 2022',
      'Group by sender_id and count message_id AS message_count',
      'Order by message_count DESC and LIMIT 2',
    ],
    schemas: [SCHEMA_MESSAGES],
    expectedOutput: {
      columns: ['sender_id', 'message_count'],
      rows: [
        { sender_id: 3601, message_count: 3 },
        { sender_id: 2511, message_count: 1 },
      ],
    },
    hints: {
      tier1: 'Filter WHERE sent_date >= \'2022-08-01\' AND sent_date < \'2022-09-01\'.',
      tier2: 'GROUP BY sender_id ORDER BY COUNT(message_id) DESC LIMIT 2.',
      tier3Skeleton: 'SELECT sender_id, COUNT(message_id) AS message_count FROM messages WHERE sent_date >= \'2022-08-01\' AND sent_date < \'2022-09-01\' GROUP BY sender_id ORDER BY message_count DESC LIMIT 2;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `SELECT sender_id, COUNT(message_id) AS message_count
FROM messages
WHERE sent_date >= '2022-08-01' AND sent_date < '2022-09-01'
GROUP BY sender_id
ORDER BY message_count DESC
LIMIT 2;`,
      snowflake: `SELECT sender_id, COUNT(message_id) AS message_count
FROM messages
WHERE sent_date >= '2022-08-01' AND sent_date < '2022-09-01'
GROUP BY sender_id
ORDER BY message_count DESC
LIMIT 2;`,
      bigquery: `SELECT sender_id, COUNT(message_id) AS message_count
FROM messages
WHERE sent_date >= '2022-08-01' AND sent_date < '2022-09-01'
GROUP BY sender_id
ORDER BY message_count DESC
LIMIT 2;`,
      mysql: `SELECT sender_id, COUNT(message_id) AS message_count
FROM messages
WHERE sent_date >= '2022-08-01' AND sent_date < '2022-09-01'
GROUP BY sender_id
ORDER BY message_count DESC
LIMIT 2;`,
    },
    deepDive: {
      executionOrder: ['1. Filter sent_date boundary.', '2. Hash aggregate by sender_id.', '3. Order top 2.'],
      indexStrategy: 'Index on (sent_date, sender_id).',
      complexity: 'Time O(N log K), Space O(U).',
      tradeoffs: 'Half-open date intervals [2022-08-01, 2022-09-01) properly capture time values on the last day.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/teams-power-users',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_pharmacy_analytics_part_1',
    questionNumber: 10,
    title: 'Pharmacy Analytics (Part 1)',
    platform: 'DataLemur',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'Healthcare',
    topic: 'beginner_basics',
    topicLabel: 'ARITHMETIC & LIMIT',
    businessScenario: 'CVS Health is analyzing pharmaceutical drug profitability. Write a query to find the top 3 most profitable drugs sold, and how much profit they made. Calculate profit as total_sales minus cogs. Output the drug name and total profit as total_profit. Order results by total_profit in descending order.',
    requirements: [
      'Compute total_profit = total_sales - cogs',
      'Select drug and total_profit',
      'Order by total_profit DESC and limit to top 3',
    ],
    schemas: [SCHEMA_PHARMACY_SALES],
    expectedOutput: {
      columns: ['drug', 'total_profit'],
      rows: [
        { drug: 'Keytruda', total_profit: 605492.65 },
        { drug: 'Avastin', total_profit: 368799.77 },
        { drug: 'Humira', total_profit: 192705.65 },
      ],
    },
    hints: {
      tier1: 'Subtract cogs from total_sales: (total_sales - cogs) AS total_profit.',
      tier2: 'Order by total_profit DESC and apply LIMIT 3.',
      tier3Skeleton: 'SELECT drug, (total_sales - cogs) AS total_profit FROM pharmacy_sales ORDER BY total_profit DESC LIMIT 3;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `SELECT drug, (total_sales - cogs) AS total_profit
FROM pharmacy_sales
ORDER BY total_profit DESC
LIMIT 3;`,
      snowflake: `SELECT drug, (total_sales - cogs) AS total_profit
FROM pharmacy_sales
ORDER BY total_profit DESC
LIMIT 3;`,
      bigquery: `SELECT drug, (total_sales - cogs) AS total_profit
FROM pharmacy_sales
ORDER BY total_profit DESC
LIMIT 3;`,
      mysql: `SELECT drug, (total_sales - cogs) AS total_profit
FROM pharmacy_sales
ORDER BY total_profit DESC
LIMIT 3;`,
    },
    deepDive: {
      executionOrder: ['1. Compute row-level arithmetic difference.', '2. Top-N sort via heap.', '3. Output top 3 drugs.'],
      indexStrategy: 'Covering index on (total_sales, cogs, drug).',
      complexity: 'Time O(N log 3), Space O(1).',
      tradeoffs: 'Direct arithmetic projection.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/top-drugs-sold',
    companyTag: 'CVS Health',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_pharmacy_analytics_part_2',
    questionNumber: 11,
    title: 'Pharmacy Analytics (Part 2)',
    platform: 'DataLemur',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'Healthcare',
    topic: 'aggregations',
    topicLabel: 'AGGREGATION & ABS',
    businessScenario: 'CVS Health wants to identify manufacturers associated with drugs that resulted in financial losses, calculate how many unprofitable drugs each manufacturer had, and find the absolute value of the total losses incurred. Write a query to return manufacturer, drug_count, and total_loss (as a positive number). Order by total_loss descending.',
    requirements: [
      'Filter for unprofitable drugs: total_sales - cogs < 0',
      'Group by manufacturer',
      'Count distinct drug names or product_ids as drug_count',
      'Calculate ABS(SUM(total_sales - cogs)) AS total_loss',
      'Order by total_loss DESC',
    ],
    schemas: [SCHEMA_PHARMACY_SALES],
    expectedOutput: {
      columns: ['manufacturer', 'drug_count', 'total_loss'],
      rows: [
        { manufacturer: 'Biogen', drug_count: 2, total_loss: 38500.00 },
      ],
    },
    hints: {
      tier1: 'Filter WHERE (total_sales - cogs) < 0.',
      tier2: 'Use ABS(SUM(total_sales - cogs)) to format loss as a positive value.',
      tier3Skeleton: 'SELECT manufacturer, COUNT(drug) AS drug_count, ABS(SUM(total_sales - cogs)) AS total_loss FROM pharmacy_sales WHERE (total_sales - cogs) < 0 GROUP BY manufacturer ORDER BY total_loss DESC;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `SELECT 
  manufacturer,
  COUNT(drug) AS drug_count,
  ABS(SUM(total_sales - cogs)) AS total_loss
FROM pharmacy_sales
WHERE (total_sales - cogs) < 0
GROUP BY manufacturer
ORDER BY total_loss DESC;`,
      snowflake: `SELECT 
  manufacturer,
  COUNT(drug) AS drug_count,
  ABS(SUM(total_sales - cogs)) AS total_loss
FROM pharmacy_sales
WHERE (total_sales - cogs) < 0
GROUP BY manufacturer
ORDER BY total_loss DESC;`,
      bigquery: `SELECT 
  manufacturer,
  COUNT(drug) AS drug_count,
  ABS(SUM(total_sales - cogs)) AS total_loss
FROM pharmacy_sales
WHERE (total_sales - cogs) < 0
GROUP BY manufacturer
ORDER BY total_loss DESC;`,
      mysql: `SELECT 
  manufacturer,
  COUNT(drug) AS drug_count,
  ABS(SUM(total_sales - cogs)) AS total_loss
FROM pharmacy_sales
WHERE (total_sales - cogs) < 0
GROUP BY manufacturer
ORDER BY total_loss DESC;`,
    },
    deepDive: {
      executionOrder: ['1. Filter rows where margin is negative.', '2. Group by manufacturer.', '3. Aggregate drug count and absolute loss.'],
      indexStrategy: 'Index on manufacturer.',
      complexity: 'Time O(N), Space O(M).',
      tradeoffs: 'ABS ensures standard accounting positive reporting of deficit.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/non-profitable-drugs',
    companyTag: 'CVS Health',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_second_day_confirmation',
    questionNumber: 12,
    title: 'Second Day Confirmation',
    platform: 'DataLemur',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'DATE ARITHMETIC JOIN',
    businessScenario: 'Assume you are given two tables: emails containing TikTok user signup dates and texts containing text message activation actions. Write a query to display the user_ids of users who confirmed their account on the second day after registration (i.e. exactly 1 day after signup).',
    requirements: [
      'Join emails with texts on email_id',
      'Filter for signup_action = "Confirmed"',
      'Verify action_date is exactly 1 day after signup_date',
      'Output distinct user_ids',
    ],
    schemas: [SCHEMA_EMAILS, SCHEMA_TEXTS],
    expectedOutput: {
      columns: ['user_id'],
      rows: [
        { user_id: 7771 },
      ],
    },
    hints: {
      tier1: 'Join emails e AND texts t ON e.email_id = t.email_id.',
      tier2: 'Check WHERE t.signup_action = \'Confirmed\' AND t.action_date = e.signup_date + INTERVAL \'1 day\'.',
      tier3Skeleton: 'SELECT DISTINCT e.user_id FROM emails e JOIN texts t ON e.email_id = t.email_id WHERE t.signup_action = \'Confirmed\' AND (t.action_date - e.signup_date) = 1;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `SELECT DISTINCT e.user_id
FROM emails e
JOIN texts t ON e.email_id = t.email_id
WHERE t.signup_action = 'Confirmed'
  AND t.action_date = e.signup_date + INTERVAL '1 day';`,
      snowflake: `SELECT DISTINCT e.user_id
FROM emails e
JOIN texts t ON e.email_id = t.email_id
WHERE t.signup_action = 'Confirmed'
  AND DATEDIFF(day, e.signup_date, t.action_date) = 1;`,
      bigquery: `SELECT DISTINCT e.user_id
FROM emails e
JOIN texts t ON e.email_id = t.email_id
WHERE t.signup_action = 'Confirmed'
  AND DATE_DIFF(DATE(t.action_date), DATE(e.signup_date), DAY) = 1;`,
      mysql: `SELECT DISTINCT e.user_id
FROM emails e
JOIN texts t ON e.email_id = t.email_id
WHERE t.signup_action = 'Confirmed'
  AND DATEDIFF(t.action_date, e.signup_date) = 1;`,
    },
    deepDive: {
      executionOrder: ['1. Join on email_id foreign key.', '2. Filter confirmed action.', '3. Compare day difference = 1.'],
      indexStrategy: 'Index on texts(email_id, signup_action).',
      complexity: 'Time O(N + M), Space O(U).',
      tradeoffs: 'Interval addition is portable across modern engines.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/second-day-confirmation',
    companyTag: 'TikTok',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_app_click_through_rate',
    questionNumber: 13,
    title: 'App Click-Through Rate (CTR)',
    platform: 'DataLemur',
    difficulty: 'Easy',
    skillLevel: 'Beginner',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'PERCENTAGE METRICS',
    businessScenario: 'Assume you have an events table containing Facebook app telemetry. Write a query to calculate the click-through rate (CTR) for each app in 2022, rounded to 2 decimal places. CTR is defined as 100.0 * (Total Clicks / Total Impressions). Output app_id and ctr.',
    requirements: [
      'Filter for timestamp in calendar year 2022',
      'Calculate CTR using conditional COUNT of clicks divided by impressions',
      'Multiply by 100.0 to prevent integer division, round to 2 decimal places',
      'Group by app_id and order by app_id ASC',
    ],
    schemas: [SCHEMA_APP_EVENTS],
    expectedOutput: {
      columns: ['app_id', 'ctr'],
      rows: [
        { app_id: 123, ctr: 50.00 },
        { app_id: 234, ctr: 100.00 },
      ],
    },
    hints: {
      tier1: 'Use CASE WHEN event_type = \'click\' THEN 1 END inside COUNT.',
      tier2: 'Use 100.0 * COUNT(clicks) / NULLIF(COUNT(impressions), 0).',
      tier3Skeleton: 'SELECT app_id, ROUND(100.0 * COUNT(CASE WHEN event_type = \'click\' THEN 1 END) / COUNT(CASE WHEN event_type = \'impression\' THEN 1 END), 2) AS ctr FROM events WHERE timestamp >= \'2022-01-01\' AND timestamp < \'2023-01-01\' GROUP BY app_id;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `SELECT 
  app_id,
  ROUND(
    100.0 * COUNT(CASE WHEN event_type = 'click' THEN 1 END) 
    / COUNT(CASE WHEN event_type = 'impression' THEN 1 END), 
    2
  ) AS ctr
FROM events
WHERE timestamp >= '2022-01-01' AND timestamp < '2023-01-01'
GROUP BY app_id
ORDER BY app_id ASC;`,
      snowflake: `SELECT 
  app_id,
  ROUND(
    100.0 * COUNT(CASE WHEN event_type = 'click' THEN 1 END) 
    / COUNT(CASE WHEN event_type = 'impression' THEN 1 END), 
    2
  ) AS ctr
FROM events
WHERE timestamp >= '2022-01-01' AND timestamp < '2023-01-01'
GROUP BY app_id
ORDER BY app_id ASC;`,
      bigquery: `SELECT 
  app_id,
  ROUND(
    100.0 * COUNT(CASE WHEN event_type = 'click' THEN 1 END) 
    / COUNT(CASE WHEN event_type = 'impression' THEN 1 END), 
    2
  ) AS ctr
FROM events
WHERE timestamp >= '2022-01-01' AND timestamp < '2023-01-01'
GROUP BY app_id
ORDER BY app_id ASC;`,
      mysql: `SELECT 
  app_id,
  ROUND(
    100.0 * COUNT(CASE WHEN event_type = 'click' THEN 1 END) 
    / COUNT(CASE WHEN event_type = 'impression' THEN 1 END), 
    2
  ) AS ctr
FROM events
WHERE timestamp >= '2022-01-01' AND timestamp < '2023-01-01'
GROUP BY app_id
ORDER BY app_id ASC;`,
    },
    deepDive: {
      executionOrder: ['1. Filter by 2022 event timestamp.', '2. Group by app_id.', '3. Compute click vs impression ratio.'],
      indexStrategy: 'Index on (timestamp, app_id, event_type).',
      complexity: 'Time O(N), Space O(A).',
      tradeoffs: 'Conditional count handles multi-event streams in a single scan.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/click-through-rate',
    companyTag: 'Meta',
    isLiveAutoIngested: true,
  },

  // --------------------------------------------------------------------------
  // MEDIUM TIER (26-50)
  // --------------------------------------------------------------------------
  {
    id: 'dl_user_third_transaction',
    questionNumber: 26,
    title: 'User\'s Third Transaction',
    platform: 'DataLemur',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'Logistics',
    topic: 'window',
    topicLabel: 'ROW_NUMBER() WINDOW',
    businessScenario: 'Uber\'s payment platform wants to analyze repeat rider engagement. Write a SQL query to retrieve every user\'s third transaction. Output the user_id, spend, and transaction_date sorted by user_id ascending.',
    requirements: [
      'Partition by user_id and order by transaction_date ASC using ROW_NUMBER()',
      'Filter in an outer query or CTE where rank equals 3',
      'Select user_id, spend, transaction_date ordered by user_id ASC',
    ],
    schemas: [SCHEMA_USER_TRANSACTIONS],
    expectedOutput: {
      columns: ['user_id', 'spend', 'transaction_date'],
      rows: [
        { user_id: 111, spend: 89.60, transaction_date: '2026-01-15 12:00:00' },
        { user_id: 121, spend: 35.00, transaction_date: '2026-01-07 00:00:00' },
      ],
    },
    hints: {
      tier1: 'Use ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY transaction_date ASC) as rn.',
      tier2: 'Filter the CTE with WHERE rn = 3.',
      tier3Skeleton: 'WITH ranked AS (SELECT user_id, spend, transaction_date, ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY transaction_date ASC) as rn FROM transactions) SELECT user_id, spend, transaction_date FROM ranked WHERE rn = 3 ORDER BY user_id ASC;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `WITH ranked_transactions AS (
  SELECT 
    user_id, 
    spend, 
    transaction_date,
    ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY transaction_date ASC) AS rn
  FROM transactions
)
SELECT user_id, spend, transaction_date
FROM ranked_transactions
WHERE rn = 3
ORDER BY user_id ASC;`,
      snowflake: `WITH ranked_transactions AS (
  SELECT 
    user_id, 
    spend, 
    transaction_date,
    ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY transaction_date ASC) AS rn
  FROM transactions
)
SELECT user_id, spend, transaction_date
FROM ranked_transactions
WHERE rn = 3
ORDER BY user_id ASC;`,
      bigquery: `WITH ranked_transactions AS (
  SELECT 
    user_id, 
    spend, 
    transaction_date,
    ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY transaction_date ASC) AS rn
  FROM transactions
)
SELECT user_id, spend, transaction_date
FROM ranked_transactions
WHERE rn = 3
ORDER BY user_id ASC;`,
      mysql: `WITH ranked_transactions AS (
  SELECT 
    user_id, 
    spend, 
    transaction_date,
    ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY transaction_date ASC) AS rn
  FROM transactions
)
SELECT user_id, spend, transaction_date
FROM ranked_transactions
WHERE rn = 3
ORDER BY user_id ASC;`,
    },
    deepDive: {
      executionOrder: ['1. Partition transactions by user_id.', '2. Sort partition by timestamp.', '3. Assign sequence number.', '4. Filter rank = 3.'],
      indexStrategy: 'Composite index on transactions(user_id, transaction_date).',
      complexity: 'Time O(N log K), Space O(N).',
      tradeoffs: 'ROW_NUMBER ensures exactly 1 row even if timestamp ties occur.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/sql-third-transaction',
    companyTag: 'Uber',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_sending_vs_opening_snaps',
    questionNumber: 27,
    title: 'Sending vs. Opening Snaps',
    platform: 'DataLemur',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'intermediate_case',
    topicLabel: 'RATIO & BREAKDOWN',
    businessScenario: 'Assume you\'re given tables with Snapchat activity logs and age breakdowns. Write a query to obtain a breakdown of the percentage of time spent sending vs. opening snaps as a function of age group. Output age_bucket, send_perc, and open_perc rounded to 2 decimal places. Ignore chat time.',
    requirements: [
      'Join activities and age_breakdown on user_id',
      'Filter for activity_type IN ("send", "open")',
      'Compute send_perc = ROUND(100.0 * send_time / (send_time + open_time), 2)',
      'Compute open_perc = ROUND(100.0 * open_time / (send_time + open_time), 2)',
      'Group by age_bucket and order by age_bucket ASC',
    ],
    schemas: [SCHEMA_ACTIVITIES, SCHEMA_AGE_BREAKDOWN],
    expectedOutput: {
      columns: ['age_bucket', 'send_perc', 'open_perc'],
      rows: [
        { age_bucket: '26-30', send_perc: 65.40, open_perc: 34.60 },
        { age_bucket: '31-35', send_perc: 43.75, open_perc: 56.25 },
      ],
    },
    hints: {
      tier1: 'SUM(CASE WHEN activity_type = \'send\' THEN time_spent ELSE 0 END) AS send_time.',
      tier2: 'SUM(CASE WHEN activity_type = \'open\' THEN time_spent ELSE 0 END) AS open_time.',
      tier3Skeleton: 'SELECT ab.age_bucket, ROUND(100.0 * SUM(CASE WHEN a.activity_type = \'send\' THEN a.time_spent ELSE 0 END) / SUM(a.time_spent), 2) AS send_perc, ROUND(100.0 * SUM(CASE WHEN a.activity_type = \'open\' THEN a.time_spent ELSE 0 END) / SUM(a.time_spent), 2) AS open_perc FROM activities a JOIN age_breakdown ab ON a.user_id = ab.user_id WHERE a.activity_type IN (\'send\', \'open\') GROUP BY ab.age_bucket ORDER BY ab.age_bucket ASC;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `SELECT 
  ab.age_bucket,
  ROUND(100.0 * SUM(CASE WHEN a.activity_type = 'send' THEN a.time_spent ELSE 0 END) / SUM(a.time_spent), 2) AS send_perc,
  ROUND(100.0 * SUM(CASE WHEN a.activity_type = 'open' THEN a.time_spent ELSE 0 END) / SUM(a.time_spent), 2) AS open_perc
FROM activities a
JOIN age_breakdown ab ON a.user_id = ab.user_id
WHERE a.activity_type IN ('send', 'open')
GROUP BY ab.age_bucket
ORDER BY ab.age_bucket ASC;`,
      snowflake: `SELECT 
  ab.age_bucket,
  ROUND(100.0 * SUM(CASE WHEN a.activity_type = 'send' THEN a.time_spent ELSE 0 END) / SUM(a.time_spent), 2) AS send_perc,
  ROUND(100.0 * SUM(CASE WHEN a.activity_type = 'open' THEN a.time_spent ELSE 0 END) / SUM(a.time_spent), 2) AS open_perc
FROM activities a
JOIN age_breakdown ab ON a.user_id = ab.user_id
WHERE a.activity_type IN ('send', 'open')
GROUP BY ab.age_bucket
ORDER BY ab.age_bucket ASC;`,
      bigquery: `SELECT 
  ab.age_bucket,
  ROUND(100.0 * SUM(CASE WHEN a.activity_type = 'send' THEN a.time_spent ELSE 0 END) / SUM(a.time_spent), 2) AS send_perc,
  ROUND(100.0 * SUM(CASE WHEN a.activity_type = 'open' THEN a.time_spent ELSE 0 END) / SUM(a.time_spent), 2) AS open_perc
FROM activities a
JOIN age_breakdown ab ON a.user_id = ab.user_id
WHERE a.activity_type IN ('send', 'open')
GROUP BY ab.age_bucket
ORDER BY ab.age_bucket ASC;`,
      mysql: `SELECT 
  ab.age_bucket,
  ROUND(100.0 * SUM(CASE WHEN a.activity_type = 'send' THEN a.time_spent ELSE 0 END) / SUM(a.time_spent), 2) AS send_perc,
  ROUND(100.0 * SUM(CASE WHEN a.activity_type = 'open' THEN a.time_spent ELSE 0 END) / SUM(a.time_spent), 2) AS open_perc
FROM activities a
JOIN age_breakdown ab ON a.user_id = ab.user_id
WHERE a.activity_type IN ('send', 'open')
GROUP BY ab.age_bucket
ORDER BY ab.age_bucket ASC;`,
    },
    deepDive: {
      executionOrder: ['1. Filter out chat activity.', '2. Join activities with cohort table.', '3. Group by age_bucket and calculate percentages.'],
      indexStrategy: 'Index on activities(user_id, activity_type).',
      complexity: 'Time O(N), Space O(A).',
      tradeoffs: 'Restricting WHERE to send/open simplifies total time denominator.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/time-spent-snaps',
    companyTag: 'Snapchat',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_highest_grossing_items',
    questionNumber: 28,
    title: 'Highest-Grossing Items',
    platform: 'DataLemur',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'E-Commerce',
    topic: 'window',
    topicLabel: 'DENSE_RANK() & CTE',
    businessScenario: 'Assume you are given a table containing Amazon product transactions. Write a query to identify the top 2 highest-grossing products within each category in 2022. The output should include the category_id, product_id, and total_spend. Order by category_id and ranking.',
    requirements: [
      'Filter transactions for calendar year 2022',
      'Compute sum of spend per category_id and product_id',
      'Use DENSE_RANK() or ROW_NUMBER() partitioned by category_id ordered by total_spend DESC',
      'Filter for rank <= 2',
    ],
    schemas: [SCHEMA_PRODUCT_SPEND],
    expectedOutput: {
      columns: ['category_id', 'product_id', 'total_spend'],
      rows: [
        { category_id: 1, product_id: 50001, total_spend: 310.00 },
        { category_id: 1, product_id: 50002, total_spend: 150.00 },
        { category_id: 2, product_id: 60001, total_spend: 450.00 },
        { category_id: 2, product_id: 60002, total_spend: 320.00 },
      ],
    },
    hints: {
      tier1: 'First aggregate total spend: SELECT category_id, product_id, SUM(spend) AS total_spend GROUP BY category_id, product_id.',
      tier2: 'Apply DENSE_RANK() OVER(PARTITION BY category_id ORDER BY total_spend DESC) as rnk.',
      tier3Skeleton: 'WITH ranked AS (SELECT category_id, product_id, SUM(spend) as total_spend, DENSE_RANK() OVER(PARTITION BY category_id ORDER BY SUM(spend) DESC) as rnk FROM product_spend WHERE transaction_date >= \'2022-01-01\' AND transaction_date < \'2023-01-01\' GROUP BY category_id, product_id) SELECT category_id, product_id, total_spend FROM ranked WHERE rnk <= 2 ORDER BY category_id, total_spend DESC;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `WITH product_totals AS (
  SELECT 
    category_id,
    product_id,
    SUM(spend) AS total_spend,
    DENSE_RANK() OVER(PARTITION BY category_id ORDER BY SUM(spend) DESC) AS rnk
  FROM product_spend
  WHERE transaction_date >= '2022-01-01' AND transaction_date < '2023-01-01'
  GROUP BY category_id, product_id
)
SELECT category_id, product_id, total_spend
FROM product_totals
WHERE rnk <= 2
ORDER BY category_id ASC, total_spend DESC;`,
      snowflake: `WITH product_totals AS (
  SELECT 
    category_id,
    product_id,
    SUM(spend) AS total_spend,
    DENSE_RANK() OVER(PARTITION BY category_id ORDER BY SUM(spend) DESC) AS rnk
  FROM product_spend
  WHERE transaction_date >= '2022-01-01' AND transaction_date < '2023-01-01'
  GROUP BY category_id, product_id
)
SELECT category_id, product_id, total_spend
FROM product_totals
WHERE rnk <= 2
ORDER BY category_id ASC, total_spend DESC;`,
      bigquery: `WITH product_totals AS (
  SELECT 
    category_id,
    product_id,
    SUM(spend) AS total_spend,
    DENSE_RANK() OVER(PARTITION BY category_id ORDER BY SUM(spend) DESC) AS rnk
  FROM product_spend
  WHERE transaction_date >= '2022-01-01' AND transaction_date < '2023-01-01'
  GROUP BY category_id, product_id
)
SELECT category_id, product_id, total_spend
FROM product_totals
WHERE rnk <= 2
ORDER BY category_id ASC, total_spend DESC;`,
      mysql: `WITH product_totals AS (
  SELECT 
    category_id,
    product_id,
    SUM(spend) AS total_spend,
    DENSE_RANK() OVER(PARTITION BY category_id ORDER BY SUM(spend) DESC) AS rnk
  FROM product_spend
  WHERE transaction_date >= '2022-01-01' AND transaction_date < '2023-01-01'
  GROUP BY category_id, product_id
)
SELECT category_id, product_id, total_spend
FROM product_totals
WHERE rnk <= 2
ORDER BY category_id ASC, total_spend DESC;`,
    },
    deepDive: {
      executionOrder: ['1. Filter by 2022 date range.', '2. Group by category and product.', '3. Window partition by category.', '4. Filter rank <= 2.'],
      indexStrategy: 'Index on (transaction_date, category_id, product_id, spend).',
      complexity: 'Time O(N log N), Space O(P).',
      tradeoffs: 'DENSE_RANK preserves ties for top 2 tiers.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/sql-highest-grossing',
    companyTag: 'Amazon',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_supercloud_customer',
    questionNumber: 29,
    title: 'Supercloud Customer',
    platform: 'DataLemur',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'subqueries',
    topicLabel: 'RELATIONAL DIVISION',
    businessScenario: 'A Microsoft Supercloud customer is defined as any customer who has purchased at least one product from every product category available in the products table. Write a query to find the customer_ids of all Supercloud customers.',
    requirements: [
      'Join customer_contracts with products table',
      'Group by customer_id and count distinct product_category',
      'Filter where count equals total distinct product_category count in products table',
    ],
    schemas: [SCHEMA_CUSTOMER_CONTRACTS, SCHEMA_PRODUCTS],
    expectedOutput: {
      columns: ['customer_id'],
      rows: [
        { customer_id: 1 },
      ],
    },
    hints: {
      tier1: 'Find total distinct categories: SELECT COUNT(DISTINCT product_category) FROM products.',
      tier2: 'Use HAVING COUNT(DISTINCT p.product_category) = (SELECT COUNT(DISTINCT product_category) FROM products).',
      tier3Skeleton: 'SELECT cc.customer_id FROM customer_contracts cc JOIN products p ON cc.product_id = p.product_id GROUP BY cc.customer_id HAVING COUNT(DISTINCT p.product_category) = (SELECT COUNT(DISTINCT product_category) FROM products);',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `SELECT cc.customer_id
FROM customer_contracts cc
JOIN products p ON cc.product_id = p.product_id
GROUP BY cc.customer_id
HAVING COUNT(DISTINCT p.product_category) = (
  SELECT COUNT(DISTINCT product_category) FROM products
)
ORDER BY cc.customer_id ASC;`,
      snowflake: `SELECT cc.customer_id
FROM customer_contracts cc
JOIN products p ON cc.product_id = p.product_id
GROUP BY cc.customer_id
HAVING COUNT(DISTINCT p.product_category) = (
  SELECT COUNT(DISTINCT product_category) FROM products
)
ORDER BY cc.customer_id ASC;`,
      bigquery: `SELECT cc.customer_id
FROM customer_contracts cc
JOIN products p ON cc.product_id = p.product_id
GROUP BY cc.customer_id
HAVING COUNT(DISTINCT p.product_category) = (
  SELECT COUNT(DISTINCT product_category) FROM products
)
ORDER BY cc.customer_id ASC;`,
      mysql: `SELECT cc.customer_id
FROM customer_contracts cc
JOIN products p ON cc.product_id = p.product_id
GROUP BY cc.customer_id
HAVING COUNT(DISTINCT p.product_category) = (
  SELECT COUNT(DISTINCT product_category) FROM products
)
ORDER BY cc.customer_id ASC;`,
    },
    deepDive: {
      executionOrder: ['1. Compute scalar count of total categories.', '2. Join contracts and products.', '3. Group by customer and compare count.'],
      indexStrategy: 'Index on customer_contracts(product_id, customer_id).',
      complexity: 'Time O(N + M), Space O(C).',
      tradeoffs: 'Relational division using GROUP BY and scalar subquery.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/supercloud-customer',
    companyTag: 'Microsoft',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_odd_and_even_measurements',
    questionNumber: 30,
    title: 'Odd and Even Measurements',
    platform: 'DataLemur',
    difficulty: 'Medium',
    skillLevel: 'Intermediate',
    industry: 'SaaS',
    topic: 'window',
    topicLabel: 'ALTERNATING ROW AGGREGATION',
    businessScenario: 'Assume you are given a table with telemetry sensor measurements from Google Cloud. Write a query to calculate the sum of odd-numbered measurements and the sum of even-numbered measurements within each day, where measurements are ordered by timestamp. Output measurement_day, odd_sum, and even_sum.',
    requirements: [
      'Extract date as measurement_day',
      'Assign row number ordered by measurement_time partitioned by date',
      'Sum values where row_number % 2 = 1 as odd_sum and % 2 = 0 as even_sum',
      'Order by measurement_day ASC',
    ],
    schemas: [SCHEMA_MEASUREMENTS],
    expectedOutput: {
      columns: ['measurement_day', 'odd_sum', 'even_sum'],
      rows: [
        { measurement_day: '2026-07-10', odd_sum: 2355.71, even_sum: 1662.74 },
        { measurement_day: '2026-07-11', odd_sum: 1124.50, even_sum: 1234.14 },
      ],
    },
    hints: {
      tier1: 'Use ROW_NUMBER() OVER(PARTITION BY DATE(measurement_time) ORDER BY measurement_time ASC) as rn.',
      tier2: 'SUM(CASE WHEN rn % 2 = 1 THEN measurement_value ELSE 0 END) AS odd_sum.',
      tier3Skeleton: 'WITH ranked AS (SELECT CAST(measurement_time AS DATE) as measurement_day, measurement_value, ROW_NUMBER() OVER(PARTITION BY CAST(measurement_time AS DATE) ORDER BY measurement_time ASC) as rn FROM measurements) SELECT measurement_day, SUM(CASE WHEN rn % 2 = 1 THEN measurement_value ELSE 0 END) as odd_sum, SUM(CASE WHEN rn % 2 = 0 THEN measurement_value ELSE 0 END) as even_sum FROM ranked GROUP BY measurement_day ORDER BY measurement_day ASC;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `WITH ranked_measurements AS (
  SELECT 
    CAST(measurement_time AS DATE) AS measurement_day,
    measurement_value,
    ROW_NUMBER() OVER(PARTITION BY CAST(measurement_time AS DATE) ORDER BY measurement_time ASC) AS rn
  FROM measurements
)
SELECT 
  measurement_day,
  SUM(CASE WHEN rn % 2 = 1 THEN measurement_value ELSE 0 END) AS odd_sum,
  SUM(CASE WHEN rn % 2 = 0 THEN measurement_value ELSE 0 END) AS even_sum
FROM ranked_measurements
GROUP BY measurement_day
ORDER BY measurement_day ASC;`,
      snowflake: `WITH ranked_measurements AS (
  SELECT 
    CAST(measurement_time AS DATE) AS measurement_day,
    measurement_value,
    ROW_NUMBER() OVER(PARTITION BY CAST(measurement_time AS DATE) ORDER BY measurement_time ASC) AS rn
  FROM measurements
)
SELECT 
  measurement_day,
  SUM(CASE WHEN rn % 2 = 1 THEN measurement_value ELSE 0 END) AS odd_sum,
  SUM(CASE WHEN rn % 2 = 0 THEN measurement_value ELSE 0 END) AS even_sum
FROM ranked_measurements
GROUP BY measurement_day
ORDER BY measurement_day ASC;`,
      bigquery: `WITH ranked_measurements AS (
  SELECT 
    DATE(measurement_time) AS measurement_day,
    measurement_value,
    ROW_NUMBER() OVER(PARTITION BY DATE(measurement_time) ORDER BY measurement_time ASC) AS rn
  FROM measurements
)
SELECT 
  measurement_day,
  SUM(CASE WHEN MOD(rn, 2) = 1 THEN measurement_value ELSE 0 END) AS odd_sum,
  SUM(CASE WHEN MOD(rn, 2) = 0 THEN measurement_value ELSE 0 END) AS even_sum
FROM ranked_measurements
GROUP BY measurement_day
ORDER BY measurement_day ASC;`,
      mysql: `WITH ranked_measurements AS (
  SELECT 
    DATE(measurement_time) AS measurement_day,
    measurement_value,
    ROW_NUMBER() OVER(PARTITION BY DATE(measurement_time) ORDER BY measurement_time ASC) AS rn
  FROM measurements
)
SELECT 
  measurement_day,
  SUM(CASE WHEN rn % 2 = 1 THEN measurement_value ELSE 0 END) AS odd_sum,
  SUM(CASE WHEN rn % 2 = 0 THEN measurement_value ELSE 0 END) AS even_sum
FROM ranked_measurements
GROUP BY measurement_day
ORDER BY measurement_day ASC;`,
    },
    deepDive: {
      executionOrder: ['1. Truncate measurement_time to date.', '2. Assign row numbers inside daily partitions.', '3. Aggregate modulo 2.'],
      indexStrategy: 'Index on (measurement_time, measurement_value).',
      complexity: 'Time O(N log N), Space O(N).',
      tradeoffs: 'Modulo row arithmetic cleanly separates interleaved metrics.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/odd-even-measurements',
    companyTag: 'Google',
    isLiveAutoIngested: true,
  },

  // --------------------------------------------------------------------------
  // HARD TIER (51-65)
  // --------------------------------------------------------------------------
  {
    id: 'dl_repeated_payments',
    questionNumber: 51,
    title: 'Repeated Payments',
    platform: 'DataLemur',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'FinTech',
    topic: 'window',
    topicLabel: 'LAG() TIME WINDOW',
    businessScenario: 'Sometimes payment transactions fail or get submitted multiple times accidentally. Using Stripe\'s payment data, write a query to detect repeated payments. A repeated payment is defined as a transaction sharing the same merchant_id, credit_card_id, and amount that occurred within 10 minutes of a previous payment. Output count of repeated payments as payment_count.',
    requirements: [
      'Use LAG(transaction_timestamp) partitioned by merchant_id, credit_card_id, and amount',
      'Compute timestamp difference in minutes between consecutive charges',
      'Filter where difference <= 10 minutes',
      'Output count of repeated transactions',
    ],
    schemas: [SCHEMA_PAYMENTS],
    expectedOutput: {
      columns: ['payment_count'],
      rows: [
        { payment_count: 1 },
      ],
    },
    hints: {
      tier1: 'LAG(transaction_timestamp) OVER(PARTITION BY merchant_id, credit_card_id, amount ORDER BY transaction_timestamp).',
      tier2: 'Extract epoch difference and verify <= 600 seconds (10 minutes).',
      tier3Skeleton: 'WITH prev_tx AS (SELECT transaction_id, EXTRACT(EPOCH FROM (transaction_timestamp - LAG(transaction_timestamp) OVER(PARTITION BY merchant_id, credit_card_id, amount ORDER BY transaction_timestamp))) / 60 as diff_mins FROM payments) SELECT COUNT(transaction_id) AS payment_count FROM prev_tx WHERE diff_mins <= 10;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `WITH prev_transactions AS (
  SELECT 
    transaction_id,
    merchant_id,
    credit_card_id,
    amount,
    transaction_timestamp,
    LAG(transaction_timestamp) OVER(
      PARTITION BY merchant_id, credit_card_id, amount 
      ORDER BY transaction_timestamp ASC
    ) AS prev_timestamp
  FROM payments
)
SELECT COUNT(transaction_id) AS payment_count
FROM prev_transactions
WHERE prev_timestamp IS NOT NULL
  AND EXTRACT(EPOCH FROM (transaction_timestamp - prev_timestamp)) <= 600;`,
      snowflake: `WITH prev_transactions AS (
  SELECT 
    transaction_id,
    merchant_id,
    credit_card_id,
    amount,
    transaction_timestamp,
    LAG(transaction_timestamp) OVER(
      PARTITION BY merchant_id, credit_card_id, amount 
      ORDER BY transaction_timestamp ASC
    ) AS prev_timestamp
  FROM payments
)
SELECT COUNT(transaction_id) AS payment_count
FROM prev_transactions
WHERE prev_timestamp IS NOT NULL
  AND DATEDIFF(minute, prev_timestamp, transaction_timestamp) <= 10;`,
      bigquery: `WITH prev_transactions AS (
  SELECT 
    transaction_id,
    merchant_id,
    credit_card_id,
    amount,
    transaction_timestamp,
    LAG(transaction_timestamp) OVER(
      PARTITION BY merchant_id, credit_card_id, amount 
      ORDER BY transaction_timestamp ASC
    ) AS prev_timestamp
  FROM payments
)
SELECT COUNT(transaction_id) AS payment_count
FROM prev_transactions
WHERE prev_timestamp IS NOT NULL
  AND TIMESTAMP_DIFF(transaction_timestamp, prev_timestamp, MINUTE) <= 10;`,
      mysql: `WITH prev_transactions AS (
  SELECT 
    transaction_id,
    merchant_id,
    credit_card_id,
    amount,
    transaction_timestamp,
    LAG(transaction_timestamp) OVER(
      PARTITION BY merchant_id, credit_card_id, amount 
      ORDER BY transaction_timestamp ASC
    ) AS prev_timestamp
  FROM payments
)
SELECT COUNT(transaction_id) AS payment_count
FROM prev_transactions
WHERE prev_timestamp IS NOT NULL
  AND TIMESTAMPDIFF(MINUTE, prev_timestamp, transaction_timestamp) <= 10;`,
    },
    deepDive: {
      executionOrder: ['1. Partition payments by (merchant_id, credit_card_id, amount).', '2. Sort partition by timestamp.', '3. Fetch predecessor timestamp via LAG.', '4. Filter delta <= 10m.'],
      indexStrategy: 'Composite index on (merchant_id, credit_card_id, amount, transaction_timestamp).',
      complexity: 'Time O(N log N), Space O(N).',
      tradeoffs: 'LAG is significantly more efficient than a triangular self-join.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/repeated-payments',
    companyTag: 'Stripe',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_active_user_retention',
    questionNumber: 52,
    title: 'Active User Retention',
    platform: 'DataLemur',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'SaaS',
    topic: 'datetime',
    topicLabel: 'COHORT RETENTION & SELF-JOIN',
    businessScenario: 'Assume you have an events table from Meta recording user interactions. Write a query to calculate the number of monthly active users (MAUs) in July 2022 who also engaged in any active session in the preceding month (June 2022). Output month (7) and monthly_active_users.',
    requirements: [
      'Filter for users active in July 2022',
      'Filter that the same user also had an event in June 2022',
      'Count distinct active user IDs',
      'Output month 7 and monthly_active_users',
    ],
    schemas: [SCHEMA_APP_EVENTS],
    expectedOutput: {
      columns: ['month', 'monthly_active_users'],
      rows: [
        { month: 7, monthly_active_users: 1 },
      ],
    },
    hints: {
      tier1: 'Self-join events table where user_id matches and month difference is 1.',
      tier2: 'Or use WHERE user_id IN (SELECT user_id FROM events WHERE EXTRACT(MONTH FROM timestamp) = 6).',
      tier3Skeleton: 'SELECT 7 AS month, COUNT(DISTINCT user_id) as monthly_active_users FROM events WHERE EXTRACT(MONTH FROM timestamp) = 7 AND user_id IN (SELECT user_id FROM events WHERE EXTRACT(MONTH FROM timestamp) = 6);',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `SELECT 
  7 AS month,
  COUNT(DISTINCT user_id) AS monthly_active_users
FROM events
WHERE timestamp >= '2022-07-01' AND timestamp < '2022-08-01'
  AND user_id IN (
    SELECT user_id 
    FROM events 
    WHERE timestamp >= '2022-06-01' AND timestamp < '2022-07-01'
  );`,
      snowflake: `SELECT 
  7 AS month,
  COUNT(DISTINCT user_id) AS monthly_active_users
FROM events
WHERE timestamp >= '2022-07-01' AND timestamp < '2022-08-01'
  AND user_id IN (
    SELECT user_id 
    FROM events 
    WHERE timestamp >= '2022-06-01' AND timestamp < '2022-07-01'
  );`,
      bigquery: `SELECT 
  7 AS month,
  COUNT(DISTINCT user_id) AS monthly_active_users
FROM events
WHERE timestamp >= '2022-07-01' AND timestamp < '2022-08-01'
  AND user_id IN (
    SELECT user_id 
    FROM events 
    WHERE timestamp >= '2022-06-01' AND timestamp < '2022-07-01'
  );`,
      mysql: `SELECT 
  7 AS month,
  COUNT(DISTINCT user_id) AS monthly_active_users
FROM events
WHERE timestamp >= '2022-07-01' AND timestamp < '2022-08-01'
  AND user_id IN (
    SELECT user_id 
    FROM events 
    WHERE timestamp >= '2022-06-01' AND timestamp < '2022-07-01'
  );`,
    },
    deepDive: {
      executionOrder: ['1. Filter June active cohort.', '2. Semi-join with July activity.', '3. Compute distinct retained users.'],
      indexStrategy: 'Index on (timestamp, user_id).',
      complexity: 'Time O(N + M), Space O(U).',
      tradeoffs: 'Semi-join via IN / EXISTS avoids row fanout.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/user-retention',
    companyTag: 'Meta',
    isLiveAutoIngested: true,
  },
  {
    id: 'dl_y_on_y_growth_rate',
    questionNumber: 53,
    title: 'Y-on-Y Growth Rate',
    platform: 'DataLemur',
    difficulty: 'Hard',
    skillLevel: 'Advanced',
    industry: 'E-Commerce',
    topic: 'window',
    topicLabel: 'LAG & YEAR-OVER-YEAR',
    businessScenario: 'Assume you\'re given a table containing customer purchase amounts on Wayfair. Write a query to calculate the year-on-year (Y-on-Y) growth rate for the total spend of each product. Output year, product_id, curr_year_spend, prev_year_spend, and yoy_rate rounded to 2 decimal places.',
    requirements: [
      'Extract year from transaction_date',
      'Compute sum of spend per year and product_id',
      'Use LAG(curr_year_spend) partitioned by product_id ordered by year',
      'Calculate percentage growth rate = ROUND(100.0 * (curr - prev) / prev, 2)',
    ],
    schemas: [SCHEMA_PRODUCT_SPEND],
    expectedOutput: {
      columns: ['year', 'product_id', 'curr_year_spend', 'prev_year_spend', 'yoy_rate'],
      rows: [
        { year: 2022, product_id: 50001, curr_year_spend: 310.00, prev_year_spend: null, yoy_rate: null },
      ],
    },
    hints: {
      tier1: 'Group by EXTRACT(YEAR FROM transaction_date), product_id and SUM(spend).',
      tier2: 'Use LAG(spend) OVER(PARTITION BY product_id ORDER BY year ASC) as prev_year_spend.',
      tier3Skeleton: 'WITH annual_spend AS (SELECT EXTRACT(YEAR FROM transaction_date) AS year, product_id, SUM(spend) AS curr_year_spend FROM product_spend GROUP BY EXTRACT(YEAR FROM transaction_date), product_id) SELECT year, product_id, curr_year_spend, LAG(curr_year_spend) OVER(PARTITION BY product_id ORDER BY year) as prev_year_spend, ROUND(100.0 * (curr_year_spend - LAG(curr_year_spend) OVER(PARTITION BY product_id ORDER BY year)) / LAG(curr_year_spend) OVER(PARTITION BY product_id ORDER BY year), 2) as yoy_rate FROM annual_spend ORDER BY product_id, year;',
    },
    starterCodeByDialect: DL_STARTER as any,
    officialSolutionByDialect: {
      postgres: `WITH annual_sales AS (
  SELECT 
    EXTRACT(YEAR FROM transaction_date) AS year,
    product_id,
    SUM(spend) AS curr_year_spend
  FROM product_spend
  GROUP BY EXTRACT(YEAR FROM transaction_date), product_id
),
with_prior_year AS (
  SELECT 
    year,
    product_id,
    curr_year_spend,
    LAG(curr_year_spend) OVER(PARTITION BY product_id ORDER BY year ASC) AS prev_year_spend
  FROM annual_sales
)
SELECT 
  year,
  product_id,
  curr_year_spend,
  prev_year_spend,
  ROUND(100.0 * (curr_year_spend - prev_year_spend) / prev_year_spend, 2) AS yoy_rate
FROM with_prior_year
ORDER BY product_id ASC, year ASC;`,
      snowflake: `WITH annual_sales AS (
  SELECT 
    EXTRACT(YEAR FROM transaction_date) AS year,
    product_id,
    SUM(spend) AS curr_year_spend
  FROM product_spend
  GROUP BY EXTRACT(YEAR FROM transaction_date), product_id
),
with_prior_year AS (
  SELECT 
    year,
    product_id,
    curr_year_spend,
    LAG(curr_year_spend) OVER(PARTITION BY product_id ORDER BY year ASC) AS prev_year_spend
  FROM annual_sales
)
SELECT 
  year,
  product_id,
  curr_year_spend,
  prev_year_spend,
  ROUND(100.0 * (curr_year_spend - prev_year_spend) / prev_year_spend, 2) AS yoy_rate
FROM with_prior_year
ORDER BY product_id ASC, year ASC;`,
      bigquery: `WITH annual_sales AS (
  SELECT 
    EXTRACT(YEAR FROM transaction_date) AS year,
    product_id,
    SUM(spend) AS curr_year_spend
  FROM product_spend
  GROUP BY EXTRACT(YEAR FROM transaction_date), product_id
),
with_prior_year AS (
  SELECT 
    year,
    product_id,
    curr_year_spend,
    LAG(curr_year_spend) OVER(PARTITION BY product_id ORDER BY year ASC) AS prev_year_spend
  FROM annual_sales
)
SELECT 
  year,
  product_id,
  curr_year_spend,
  prev_year_spend,
  ROUND(100.0 * (curr_year_spend - prev_year_spend) / prev_year_spend, 2) AS yoy_rate
FROM with_prior_year
ORDER BY product_id ASC, year ASC;`,
      mysql: `WITH annual_sales AS (
  SELECT 
    YEAR(transaction_date) AS year,
    product_id,
    SUM(spend) AS curr_year_spend
  FROM product_spend
  GROUP BY YEAR(transaction_date), product_id
),
with_prior_year AS (
  SELECT 
    year,
    product_id,
    curr_year_spend,
    LAG(curr_year_spend) OVER(PARTITION BY product_id ORDER BY year ASC) AS prev_year_spend
  FROM annual_sales
)
SELECT 
  year,
  product_id,
  curr_year_spend,
  prev_year_spend,
  ROUND(100.0 * (curr_year_spend - prev_year_spend) / prev_year_spend, 2) AS yoy_rate
FROM with_prior_year
ORDER BY product_id ASC, year ASC;`,
    },
    deepDive: {
      executionOrder: ['1. Group by calendar year and product.', '2. Partition by product_id and fetch predecessor spend.', '3. Compute relative growth percentage.'],
      indexStrategy: 'Index on (product_id, transaction_date, spend).',
      complexity: 'Time O(N log N), Space O(P).',
      tradeoffs: 'Two CTE stages cleanly isolate aggregate grouping from window evaluation.',
    },
    sourcePlatform: 'DataLemur Official Question Bank',
    sourceUrl: 'https://datalemur.com/questions/yoy-growth-rate',
    companyTag: 'Wayfair',
    isLiveAutoIngested: true,
  },
];

// Clean LeetCode comment line template generator helper
export const ALL_DATALEMUR_PROBLEMS: SqlProblem[] = RAW_DATALEMUR_PROBLEMS.map((prob) => ({
  ...prob,
  starterCodeByDialect: {
    postgres: '-- Write your PostgreSQL query statement below\n',
    snowflake: '-- Write your Snowflake SQL query statement below\n',
    bigquery: '-- Write your GoogleSQL (BigQuery) query statement below\n',
    mysql: '# Write your MySQL query statement below\n',
  },
}));
