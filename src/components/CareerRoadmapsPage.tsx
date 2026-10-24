/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Award,
  CheckCircle,
  Circle,
  ArrowRight,
  Flame,
  Zap,
  BookOpen,
  Briefcase,
  Star,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { SqlProblem } from '../types';
import {
  AUTHENTIC_PLATFORM_PROBLEMS,
  ALL_LEETCODE_TOP50_PROBLEMS,
} from '../services/platformQuestionsData';

interface CareerRoadmapsPageProps {
  onSelectProblem: (problem: SqlProblem) => void;
  onBackToSandbox: () => void;
  solvedMap: Record<string, any>;
}

type TrackId = 'data_analyst' | 'data_engineer' | 'backend_dev' | 'leetcode_top50';

interface Milestone {
  id: string;
  stepNumber: number;
  title: string;
  concept: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  company: string;
  problemId?: string;
  problem?: SqlProblem;
}

export const CareerRoadmapsPage: React.FC<CareerRoadmapsPageProps> = ({
  onSelectProblem,
  onBackToSandbox,
  solvedMap
}) => {
  const [activeTrack, setActiveTrack] = useState<TrackId>('data_analyst');

  // Build Track Milestones mapped to real problems in database
  const tracks = useMemo(() => {
    // Helper to find a problem by title keyword or platform
    const findProb = (keyword: string, platform?: string): SqlProblem | undefined => {
      const lower = keyword.toLowerCase();
      return AUTHENTIC_PLATFORM_PROBLEMS.find((p) => {
        const matchesPlat = platform ? p.platform.toLowerCase().includes(platform.toLowerCase()) : true;
        return matchesPlat && (p.title.toLowerCase().includes(lower) || p.topic.toLowerCase().includes(lower));
      });
    };

    // 1. Data Analyst Track
    const dataAnalystMilestones: Milestone[] = [
      {
        id: 'da-1',
        stepNumber: 1,
        title: 'Basic Filtering & Relational Operators',
        concept: 'WHERE, AND, OR, NOT, IN, BETWEEN',
        difficulty: 'Easy',
        company: 'Amazon',
        problem: findProb('Recyclable', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[0]
      },
      {
        id: 'da-2',
        stepNumber: 2,
        title: 'Handling Null Values & Conditional Coalescing',
        concept: 'IS NULL, COALESCE(), IFNULL()',
        difficulty: 'Easy',
        company: 'Google',
        problem: findProb('Referee', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[1]
      },
      {
        id: 'da-3',
        stepNumber: 3,
        title: 'Single-Table Group Aggregations',
        concept: 'GROUP BY, COUNT(), SUM(), AVG(), HAVING',
        difficulty: 'Easy',
        company: 'Meta',
        problem: findProb('Classes More Than 5', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[2]
      },
      {
        id: 'da-4',
        stepNumber: 4,
        title: 'Multi-Table Inner & Left Joins',
        concept: 'INNER JOIN, LEFT JOIN, ON vs WHERE',
        difficulty: 'Easy',
        company: 'Apple',
        problem: findProb('Customer Who Never Order', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[3]
      },
      {
        id: 'da-5',
        stepNumber: 5,
        title: 'Conditional Branching & Dynamic Bucketing',
        concept: 'CASE WHEN THEN ELSE END',
        difficulty: 'Medium',
        company: 'Netflix',
        problem: findProb('Triangle Judgement', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[4]
      },
      {
        id: 'da-6',
        stepNumber: 6,
        title: 'Window Ranking: Row Number & Dense Rank',
        concept: 'ROW_NUMBER(), DENSE_RANK() OVER (PARTITION BY ...)',
        difficulty: 'Medium',
        company: 'Uber',
        problem: findProb('Second Highest Salary', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[5]
      },
      {
        id: 'da-7',
        stepNumber: 7,
        title: 'Lead & Lag: Month-over-Month Delta Tracking',
        concept: 'LAG(), LEAD() for sequential deltas',
        difficulty: 'Medium',
        company: 'Stripe',
        problem: findProb('Consecutive Numbers', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[6]
      },
      {
        id: 'da-8',
        stepNumber: 8,
        title: 'Rolling Aggregations & Moving Averages',
        concept: 'SUM() OVER (ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)',
        difficulty: 'Medium',
        company: 'Meta',
        problem: findProb('Restaurant Growth', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[7]
      },
      {
        id: 'da-9',
        stepNumber: 9,
        title: 'User Retention Cohort Analysis',
        concept: 'Cohort Signup Date vs Activity Day 7 / 30',
        difficulty: 'Hard',
        company: 'Airbnb',
        problem: findProb('Game Play Analysis IV', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[8]
      },
      {
        id: 'da-10',
        stepNumber: 10,
        title: 'Top K per Group & Executive Reporting',
        concept: 'CTEs + QUALIFY / DENSE_RANK() <= N',
        difficulty: 'Hard',
        company: 'Google',
        problem: findProb('Department Top Three Salaries', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[9]
      }
    ];

    // 2. Data Engineer Track
    const dataEngineerMilestones: Milestone[] = [
      {
        id: 'de-1',
        stepNumber: 1,
        title: 'Data Deduplication & Idempotent Ingestion',
        concept: 'ROW_NUMBER() OVER (PARTITION BY pk ORDER BY updated_at DESC) = 1',
        difficulty: 'Easy',
        company: 'Snowflake',
        problem: findProb('Delete Duplicate Emails', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[10]
      },
      {
        id: 'de-2',
        stepNumber: 2,
        title: 'Common Table Expressions (CTEs) & Readability',
        concept: 'WITH cte AS (...) SELECT ...',
        difficulty: 'Medium',
        company: 'Databricks',
        problem: findProb('Managers with at Least 5 Direct Reports', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[11]
      },
      {
        id: 'de-3',
        stepNumber: 3,
        title: 'Multi-Way Joins & Large Fact Table Normalization',
        concept: 'Star Schema & Snowflake Join Optimization',
        difficulty: 'Medium',
        company: 'Amazon AWS',
        problem: findProb('Product Sales Analysis III', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[12]
      },
      {
        id: 'de-4',
        stepNumber: 4,
        title: 'Recursive CTEs: Graph & Tree Traversal',
        concept: 'WITH RECURSIVE Anchor UNION ALL Recursive Member',
        difficulty: 'Hard',
        company: 'Uber',
        problem: findProb('Human Traffic of Stadium', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[13]
      },
      {
        id: 'de-5',
        stepNumber: 5,
        title: 'Gaps & Islands Problem: Continuous Sessionization',
        concept: 'Island Grouping by Date Difference',
        difficulty: 'Hard',
        company: 'Netflix',
        problem: findProb('Trips and Users', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[14]
      }
    ];

    // 3. Backend Specialist Track
    const backendMilestones: Milestone[] = [
      {
        id: 'be-1',
        stepNumber: 1,
        title: 'Subquery Unnesting & Correlated Subqueries',
        concept: 'WHERE EXISTS (...) vs IN (...)',
        difficulty: 'Easy',
        company: 'Microsoft',
        problem: findProb('Rising Temperature', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[15]
      },
      {
        id: 'be-2',
        stepNumber: 2,
        title: 'Index Optimization & SARGable Predicates',
        concept: 'Avoiding function wraps on indexed columns',
        difficulty: 'Medium',
        company: 'Salesforce',
        problem: findProb('Employees Earning More Than Their Managers', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[16]
      },
      {
        id: 'be-3',
        stepNumber: 3,
        title: 'Set Operations: UNION ALL vs UNION',
        concept: 'Preserving duplicates vs sorting cost',
        difficulty: 'Medium',
        company: 'Oracle',
        problem: findProb('Friend Requests II', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[17]
      },
      {
        id: 'be-4',
        stepNumber: 4,
        title: 'Complex Business Logic in Pure SQL',
        concept: 'Nested CASE and Aggregation pivots',
        difficulty: 'Hard',
        company: 'Stripe',
        problem: findProb('Department Highest Salary', 'LeetCode') || AUTHENTIC_PLATFORM_PROBLEMS[18]
      }
    ];

    // 4. LeetCode Top 50 Track
    const leetcodeTop50Milestones: Milestone[] = ALL_LEETCODE_TOP50_PROBLEMS.slice(0, 15).map((p, i) => ({
      id: `lc-top50-${p.id}`,
      stepNumber: i + 1,
      title: p.title,
      concept: p.topic.replace(/_/g, ' ').toUpperCase(),
      difficulty: (p.difficulty === 'Easy' || p.difficulty === 'Hard') ? p.difficulty : 'Medium',
      company: p.companyTag || 'FAANG',
      problem: p
    }));

    return {
      data_analyst: {
        title: 'FAANG Data Analyst Career Path',
        tagline: 'Master aggregations, window functions, user retention, and business cohorts.',
        icon: '📊',
        color: 'from-cyan-500 to-blue-600',
        badge: 'Top Pick for Analysts',
        milestones: dataAnalystMilestones
      },
      data_engineer: {
        title: 'Senior Data Engineer & Warehouse Path',
        tagline: 'ETL pipelines, deduplication, recursive CTEs, and warehouse modeling.',
        icon: '🛠️',
        color: 'from-indigo-500 to-purple-600',
        badge: 'Advanced Architecture',
        milestones: dataEngineerMilestones
      },
      backend_dev: {
        title: 'Backend Software Engineer Path',
        tagline: 'Subqueries, index optimization, query execution plans, and data integrity.',
        icon: '💻',
        color: 'from-emerald-500 to-teal-600',
        badge: 'High Performance',
        milestones: backendMilestones
      },
      leetcode_top50: {
        title: 'LeetCode Top SQL 50 Speedrun',
        tagline: 'The official curated 50 essential questions asked in technical interviews.',
        icon: '⭐',
        color: 'from-amber-500 to-orange-600',
        badge: 'Official Interview Plan',
        milestones: leetcodeTop50Milestones
      }
    };
  }, []);

  const currentTrackData = tracks[activeTrack];

  // Calculate track progress
  const completedCount = useMemo(() => {
    return currentTrackData.milestones.filter(
      (m) => m.problem && solvedMap[m.problem.id]
    ).length;
  }, [currentTrackData, solvedMap]);

  const progressPercent = Math.round(
    (completedCount / Math.max(currentTrackData.milestones.length, 1)) * 100
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-indigo-600/30 selection:text-indigo-200">
      {/* Top Banner */}
      <div className="border-b border-white/8 bg-[#090d18]/90 backdrop-blur-xl sticky top-14 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSandbox}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/10"
            >
              <span>←</span>
              <span>Back to Sandbox</span>
            </button>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>🗺️ SQL Career Learning Roadmaps</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  4 Curated Tracks
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">
              Track Progress: <strong className="text-emerald-400 font-bold">{completedCount} / {currentTrackData.milestones.length}</strong> ({progressPercent}%)
            </span>
            <div className="w-24 sm:w-32 h-2 rounded-full bg-slate-800 overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Track Selector Tabs */}
        <div className="relative p-1.5 apple-pill-bar flex flex-wrap items-center justify-between gap-1 w-full max-w-full">
          {[
            { id: 'data_analyst', label: 'Data Analyst Path', icon: '📊' },
            { id: 'data_engineer', label: 'Data Engineer Path', icon: '🛠️' },
            { id: 'backend_dev', label: 'Backend Specialist', icon: '💻' },
            { id: 'leetcode_top50', label: 'Top SQL 50 Speedrun', icon: '⭐' },
          ].map((t) => {
            const isActive = activeTrack === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTrack(t.id as TrackId)}
                className={`relative z-10 flex-1 min-w-[140px] py-2 px-3 rounded-full text-xs font-bold transition-colors duration-150 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeRoadmapTrackPill"
                    className="absolute inset-0 rounded-full apple-pill-active -z-10"
                    transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Track Header Card */}
        <motion.div
          key={activeTrack}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="apple-card p-6 border border-white/12 relative overflow-hidden space-y-3"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {currentTrackData.badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{currentTrackData.icon}</span>
                <span>{currentTrackData.title}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                {currentTrackData.tagline}
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Milestones</div>
              <div className="text-2xl font-black text-white font-mono">
                {completedCount} <span className="text-sm font-normal text-slate-500">/ {currentTrackData.milestones.length}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Milestone Timeline */}
        <div className="space-y-4 relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-white/10 hidden sm:block -z-0" />

          {currentTrackData.milestones.map((milestone, idx) => {
            const isSolved = milestone.problem && !!solvedMap[milestone.problem.id];
            const diffColor =
              milestone.difficulty === 'Easy'
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : milestone.difficulty === 'Medium'
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/30';

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.2 }}
                whileHover={{ x: 2 }}
                className="relative z-10 apple-card p-4 sm:p-5 border border-white/8 hover:border-white/16 transition-all rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left: Step Circle + Details */}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold font-mono text-sm shrink-0 border ${
                      isSolved
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                        : 'bg-slate-900 border-white/10 text-slate-400'
                    }`}
                  >
                    {isSolved ? '✓' : `#${milestone.stepNumber}`}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {milestone.title}
                      </span>
                      <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold border ${diffColor}`}>
                        {milestone.difficulty}
                      </span>
                      <span className="px-2 py-0.2 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {milestone.company}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      <span>Concept: </span>
                      <strong className="text-cyan-300">{milestone.concept}</strong>
                    </div>
                  </div>
                </div>

                {/* Right: Action */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {milestone.problem ? (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onSelectProblem(milestone.problem!)}
                      className="apple-btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md select-none"
                    >
                      <span>⚡</span>
                      <span>Launch Challenge</span>
                    </motion.button>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">Coming soon</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
