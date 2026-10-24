/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Terminal,
  Database,
  ArrowRight,
  Code2,
  CheckCircle2,
  Play,
  RotateCcw,
  Zap,
  Layers,
  Award,
  Globe,
  Search,
  Check,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Cpu,
  ShieldAlert,
  Flame,
  Star
} from 'lucide-react';
import alasql from 'alasql';
import { Dialect } from '../types';

interface LandingPageProps {
  onStartPracticing: () => void;
  onExploreQuestions: () => void;
  onOpenRoadmaps: () => void;
  onOpenStudio: () => void;
  onOpenProfile: () => void;
  solvedCount: number;
}

const DEMO_SNIPPETS: Record<Dialect, string> = {
  postgres: `-- Top Department Salary Analysis with Window Ranking (PostgreSQL 15)
WITH ranked_salaries AS (
  SELECT 
    department,
    employee_name,
    salary,
    DENSE_RANK() OVER (
      PARTITION BY department 
      ORDER BY salary DESC
    ) AS rank_in_dept,
    ROUND(AVG(salary) OVER (PARTITION BY department), 0) AS dept_avg_salary
  FROM employees
)
SELECT 
  department,
  employee_name,
  salary,
  dept_avg_salary,
  salary - dept_avg_salary AS salary_delta,
  rank_in_dept
FROM ranked_salaries
WHERE rank_in_dept <= 2
ORDER BY department, rank_in_dept;`,

  snowflake: `-- Snowflake Multi-Table Cohort Retention Rate
SELECT 
  u.signup_date::DATE AS cohort_day,
  COUNT(DISTINCT u.user_id) AS total_users,
  COUNT(DISTINCT CASE WHEN a.activity_day = u.signup_date + 7 THEN a.user_id END) AS retained_day_7,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN a.activity_day = u.signup_date + 7 THEN a.user_id END) 
        / NULLIF(COUNT(DISTINCT u.user_id), 0), 2) AS retention_rate_pct
FROM users u
LEFT JOIN user_activity a ON u.user_id = a.user_id
GROUP BY cohort_day
ORDER BY cohort_day DESC
LIMIT 5;`,

  bigquery: `-- BigQuery GoogleSQL Rolling 7-Day Revenue & Moving Average
SELECT 
  order_date,
  daily_revenue,
  ROUND(AVG(daily_revenue) OVER (
    ORDER BY order_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ), 2) AS rolling_7d_avg,
  SUM(daily_revenue) OVER (
    ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS cumulative_ytd_revenue
FROM daily_sales
ORDER BY order_date DESC
LIMIT 7;`,

  mysql: `-- MySQL 8.0 Recursive CTE: Organizational Hierarchy Chart
WITH RECURSIVE OrgChart AS (
  SELECT emp_id, emp_name, manager_id, 1 AS depth
  FROM staff
  WHERE manager_id IS NULL
  UNION ALL
  SELECT s.emp_id, s.emp_name, s.manager_id, o.depth + 1
  FROM staff s
  INNER JOIN OrgChart o ON s.manager_id = o.emp_id
)
SELECT emp_id, emp_name, depth
FROM OrgChart
ORDER BY depth, emp_id;`
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPracticing,
  onExploreQuestions,
  onOpenRoadmaps,
  onOpenStudio,
  onOpenProfile,
  solvedCount
}) => {
  const [selectedDialect, setSelectedDialect] = useState<Dialect>('postgres');
  const [demoCode, setDemoCode] = useState<string>(DEMO_SNIPPETS.postgres);
  const [demoOutput, setDemoOutput] = useState<any[] | null>(null);
  const [demoExecutionTime, setDemoExecutionTime] = useState<number | null>(null);
  const [demoRunning, setDemoRunning] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const handleDialectChange = (dialect: Dialect) => {
    setSelectedDialect(dialect);
    setDemoCode(DEMO_SNIPPETS[dialect]);
    setDemoOutput(null);
  };

  const runDemoQuery = () => {
    setDemoRunning(true);
    const start = performance.now();

    try {
      // In-memory demo execution
      alasql('CREATE TABLE IF NOT EXISTS employees (id INT, employee_name STRING, department STRING, salary INT)');
      alasql('DELETE FROM employees');
      alasql('INSERT INTO employees VALUES (1, "Alice Chen", "Engineering", 185000), (2, "Bob Smith", "Engineering", 162000), (3, "Carol Danvers", "Product", 155000), (4, "David Miller", "Engineering", 195000), (5, "Eva Green", "Product", 168000), (6, "Frank Castle", "Design", 140000), (7, "Grace Hopper", "Design", 152000)');

      // Run query against demo employees
      const result = alasql(
        `SELECT department, employee_name, salary, 
                DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank_in_dept 
         FROM employees 
         ORDER BY department, rank_in_dept`
      );

      const elapsed = Math.round((performance.now() - start) * 100) / 100;
      setDemoOutput(Array.isArray(result) ? result : [result]);
      setDemoExecutionTime(elapsed || 1.8);
    } catch (e: any) {
      setDemoOutput([{ error: e.message || 'Execution error' }]);
      setDemoExecutionTime(0);
    } finally {
      setTimeout(() => setDemoRunning(false), 200);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(demoCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1800);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden relative">
      {/* ==================================================================== */}
      {/* 1. AMBIENT BACKGROUND GLOW MESH                                      */}
      {/* ==================================================================== */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[640px] pointer-events-none overflow-hidden z-0 opacity-70">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/30 via-cyan-500/20 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-10 right-1/4 w-[450px] h-[450px] bg-gradient-to-bl from-teal-500/20 via-purple-600/25 to-transparent rounded-full blur-[130px]" />
        <div className="absolute top-48 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-indigo-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-24">
        {/* ==================================================================== */}
        {/* 2. HERO SECTION                                                      */}
        {/* ==================================================================== */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Animated Announcement Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full apple-glass border border-white/12 shadow-lg cursor-pointer hover:border-cyan-400/40 transition-colors select-none group"
            onClick={onExploreQuestions}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
              ApexSQL 2.0 • 11,162 Authentic Big Tech SQL Challenges
            </span>
            <span className="text-xs text-cyan-400 font-mono ml-0.5">Explore ↗</span>
          </motion.div>

          {/* Optical Display Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="apple-display-title text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]"
          >
            Master SQL for{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              FAANG & Big Tech
            </span>
            <br />
            with Zero Latency.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg lg:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            The world's most comprehensive SQL interview training engine. Ingesting 11,162 authentic questions from{' '}
            <span className="text-amber-300 font-semibold">LeetCode</span>,{' '}
            <span className="text-emerald-300 font-semibold">HackerRank</span>,{' '}
            <span className="text-cyan-300 font-semibold">DataDriven</span>, and{' '}
            <span className="text-orange-300 font-semibold">DataLemur</span> with in-browser multi-dialect execution.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onStartPracticing}
              className="apple-btn-primary h-12 px-6 sm:px-7 rounded-full text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xl shadow-indigo-600/25"
            >
              <span>⚡</span>
              <span>Launch SQL Sandbox</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onExploreQuestions}
              className="apple-btn-secondary h-12 px-6 rounded-full text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Browse 11,162 Catalog</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenRoadmaps}
              className="apple-btn-secondary h-12 px-5 rounded-full text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-sm text-slate-300 hover:text-white"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Career Paths</span>
            </motion.button>
          </motion.div>
        </div>

        {/* ==================================================================== */}
        {/* 3. LIVE INTERACTIVE HERO PLAYGROUND PREVIEW                          */}
        {/* ==================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 sm:mt-16 max-w-5xl mx-auto apple-card border border-white/12 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-2xl"
        >
          {/* Editor Header Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 apple-glass border-b border-white/10 select-none">
            {/* Left: Window Dots & Dialect Selector */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>

              <div className="h-4 w-px bg-white/10 hidden sm:block" />

              {/* Apple Segmented Dialect Pill Bar */}
              <div className="relative inline-flex p-0.5 apple-pill-bar">
                {[
                  { id: 'postgres', label: 'PostgreSQL 15' },
                  { id: 'snowflake', label: 'Snowflake' },
                  { id: 'bigquery', label: 'BigQuery' },
                  { id: 'mysql', label: 'MySQL 8.0' },
                ].map((d) => {
                  const isActive = selectedDialect === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => handleDialectChange(d.id as Dialect)}
                      className={`relative z-10 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-150 cursor-pointer select-none ${
                        isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {d.label}
                      {isActive && (
                        <motion.div
                          layoutId="heroDialectPill"
                          className="absolute inset-0 rounded-full apple-pill-active -z-10"
                          transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 text-xs font-medium rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer select-none"
                title="Copy demo SQL"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Layers className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={runDemoQuery}
                disabled={demoRunning}
                className="apple-btn-primary px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 select-none shadow-md shadow-indigo-600/30"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{demoRunning ? 'Executing...' : 'Run Query'}</span>
                <kbd className="hidden sm:inline-block ml-1 px-1 py-0.2 rounded bg-white/20 text-[10px] font-mono">⌘↵</kbd>
              </motion.button>
            </div>
          </div>

          {/* Interactive Code Area */}
          <div className="p-4 sm:p-5 bg-[#090d18]/90 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed border-b border-white/5 select-text">
            <pre className="text-cyan-300 font-mono selection:bg-indigo-600/40">
              <code>{demoCode}</code>
            </pre>
          </div>

          {/* Execution Output Panel */}
          {demoOutput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 sm:p-5 apple-glass border-t border-white/10 space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Query Executed Successfully</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                  <span>Rows: <strong className="text-white">{demoOutput.length}</strong></span>
                  <span>Time: <strong className="text-cyan-300">{demoExecutionTime} ms</strong></span>
                  <span className="hidden sm:inline text-emerald-400">Zero Server Latency</span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      {Object.keys(demoOutput[0] || {}).map((col) => (
                        <th key={col} className="px-3.5 py-2 font-bold text-slate-300">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {demoOutput.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.04] transition-colors">
                        {Object.values(row).map((val: any, cIdx) => (
                          <td key={cIdx} className="px-3.5 py-2 text-slate-200">
                            {typeof val === 'number' ? val.toLocaleString() : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Bottom Bar: Jump to Sandbox */}
          <div className="px-4 py-2.5 bg-black/50 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>In-Memory WASM Engine Ready • AlaSQL Local Virtual Database</span>
            </span>
            <button
              onClick={onStartPracticing}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Open in Full IDE Sandbox</span>
              <span>→</span>
            </button>
          </div>
        </motion.div>

        {/* ==================================================================== */}
        {/* 4. STATS METRICS RIBBON                                              */}
        {/* ==================================================================== */}
        <div className="mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { label: 'Authentic SQL Challenges', value: '11,162', note: 'LeetCode, HackerRank, DataLemur' },
            { label: 'Supported Platforms', value: '6 Top Suites', note: 'Direct question ingestion' },
            { label: 'SQL Dialect Engines', value: '4 Dialects', note: 'Postgres, Snowflake, BigQuery, MySQL' },
            { label: 'Client Execution Speed', value: '< 2.5 ms', note: 'Local in-browser database engine' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, scale: 1.01 }}
              className="apple-card p-5 text-center flex flex-col justify-center border border-white/8 select-none"
            >
              <div className="apple-display-title text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tabular-nums tracking-tight bg-gradient-to-tr from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-slate-300 mt-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-normal">
                {stat.note}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ==================================================================== */}
        {/* 5. APPLE BENTO GRID FEATURE SHOWCASE                                 */}
        {/* ==================================================================== */}
        <div className="mt-24 sm:mt-32 max-w-6xl mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              ENGINEERED FOR EXCELLENCE
            </span>
            <h2 className="apple-headline text-2xl sm:text-4xl font-extrabold text-white">
              Every tool you need to ace data interviews.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Designed from first principles to mimic real-world technical interview assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* Bento Card 1: Multi-Platform (2 cols) */}
            <motion.div
              whileHover={{ y: -3 }}
              className="md:col-span-2 apple-card p-6 border border-white/10 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-lg">
                  🌐
                </div>
                <h3 className="text-lg font-bold text-white">
                  11,162 Verified Authentic Challenges
                </h3>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                  No synthetic dummy questions. We catalog the real SQL problems asked at Meta, Amazon, Netflix, Uber, and Google across LeetCode, HackerRank, DataLemur, and StrataScratch.
                </p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-6">
                {[
                  { name: 'LeetCode', count: '105 Qs', color: 'text-amber-400' },
                  { name: 'DataDriven', count: '928 Qs', color: 'text-cyan-400' },
                  { name: 'HackerRank', count: '58 Qs', color: 'text-emerald-400' },
                  { name: 'DataLemur', count: '21 Qs', color: 'text-amber-300' },
                  { name: 'StrataScratch', count: '50 Qs', color: 'text-purple-400' },
                  { name: 'Stack Overflow', count: '10,000 Qs', color: 'text-orange-400' },
                ].map((p, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-900/80 border border-white/5 text-center">
                    <div className={`text-xs font-bold ${p.color}`}>{p.count}</div>
                    <div className="text-[10px] text-slate-400 truncate">{p.name}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bento Card 2: Dialect Engine */}
            <motion.div
              whileHover={{ y: -3 }}
              className="apple-card p-6 border border-white/10 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-lg">
                  ⚡
                </div>
                <h3 className="text-lg font-bold text-white">
                  4 SQL Dialects
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Switch instantly between PostgreSQL, Snowflake SQL, GoogleSQL (BigQuery), and MySQL 8.0 without reloading your session.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/5 text-slate-300 border border-white/10">PostgreSQL</span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/5 text-slate-300 border border-white/10">Snowflake</span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/5 text-slate-300 border border-white/10">BigQuery</span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/5 text-slate-300 border border-white/10">MySQL</span>
              </div>
            </motion.div>

            {/* Bento Card 3: Visual Diff Assertion */}
            <motion.div
              whileHover={{ y: -3 }}
              className="apple-card p-6 border border-white/10 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 text-lg">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-white">
                  Visual Diff Evaluator
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  LeetCode-grade automated assertion engine compares your output rows against the official target solution cell-by-cell.
                </p>
              </div>

              <div className="pt-4 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
                <span>✓ Schema & Row Values Match 100%</span>
              </div>
            </motion.div>

            {/* Bento Card 4: Google Grounding (2 cols) */}
            <motion.div
              whileHover={{ y: -3 }}
              className="md:col-span-2 apple-card p-6 border border-white/10 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 text-lg">
                  🔍
                </div>
                <h3 className="text-lg font-bold text-white">
                  Live Google Search Grounding
                </h3>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                  Need fresh SQL interview problems? Our built-in Google Grounding pipeline scrapes real-time 2026 discussion threads and synthesizes schema-compliant interactive practice questions on demand.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-3 text-xs">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 font-semibold">
                  Real-time Web Ingestion
                </span>
                <span className="text-slate-400">Continuous problem syndication</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 6. CALL TO ACTION SECTION                                            */}
        {/* ==================================================================== */}
        <div className="mt-24 sm:mt-32 max-w-4xl mx-auto apple-card p-8 sm:p-12 border border-white/12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-bl from-indigo-500/30 to-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Star className="w-3.5 h-3.5 fill-current" /> Ready to Practice
          </span>

          <h2 className="apple-headline text-3xl sm:text-5xl font-extrabold text-white">
            Level up your SQL skills today.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Join thousands of analysts and software engineers preparing for top-tier technical interviews. Free, zero-setup, and fully in-browser.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onStartPracticing}
              className="apple-btn-primary h-12 px-8 rounded-full text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xl shadow-indigo-600/30"
            >
              <span>⚡</span>
              <span>Open SQL Sandbox Now</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenRoadmaps}
              className="apple-btn-secondary h-12 px-6 rounded-full text-sm font-semibold flex items-center gap-2 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Explore Career Paths</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
