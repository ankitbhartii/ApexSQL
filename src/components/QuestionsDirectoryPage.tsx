/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { SqlProblem } from '../types';
import {
  AUTHENTIC_PLATFORM_PROBLEMS,
  ALL_STACKOVERFLOW_PROBLEMS,
  ALL_DATADRIVEN_PROBLEMS,
  ALL_LEETCODE_PROBLEMS,
  ALL_HACKERRANK_PROBLEMS,
  ALL_DATALEMUR_PROBLEMS,
  SUPPORTED_PLATFORMS,
} from '../services/platformQuestionsData';

interface QuestionsDirectoryPageProps {
  onSelectProblem: (problem: SqlProblem) => void;
  onBackToSandbox: () => void;
  solvedMap: Record<string, any>;
}

type PlatformFilter = 'all' | 'stackoverflow' | 'datadriven' | 'leetcode' | 'hackerrank' | 'datalemur' | 'stratascratch';

export const QuestionsDirectoryPage: React.FC<QuestionsDirectoryPageProps> = ({
  onSelectProblem,
  onBackToSandbox,
  solvedMap,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'solved' | 'unsolved'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Base list depending on selected platform tab
  const baseQuestions = useMemo(() => {
    switch (selectedPlatform) {
      case 'stackoverflow':
        return ALL_STACKOVERFLOW_PROBLEMS;
      case 'datadriven':
        return ALL_DATADRIVEN_PROBLEMS;
      case 'leetcode':
        return ALL_LEETCODE_PROBLEMS;
      case 'hackerrank':
        return ALL_HACKERRANK_PROBLEMS;
      case 'datalemur':
        return ALL_DATALEMUR_PROBLEMS;
      case 'stratascratch':
        return AUTHENTIC_PLATFORM_PROBLEMS.filter((p) => p.platform === 'FAANG+ Mock');
      case 'all':
      default:
        return AUTHENTIC_PLATFORM_PROBLEMS;
    }
  }, [selectedPlatform]);

  // Extract unique companies & topics for dropdown filters
  const allCompanies = useMemo(() => {
    const set = new Set<string>();
    baseQuestions.forEach((q) => {
      if (q.companyTag) set.add(q.companyTag);
    });
    return Array.from(set).sort();
  }, [baseQuestions]);

  const allTopics = useMemo(() => {
    const set = new Set<string>();
    baseQuestions.forEach((q) => {
      if (q.topic) set.add(q.topic);
    });
    return Array.from(set).sort();
  }, [baseQuestions]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    const qLower = searchQuery.toLowerCase().trim();

    return baseQuestions.filter((q, idx) => {
      // Platform serial number
      const serialNum = (idx + 1).toString();

      // Search matching: serial number, title, id, company, topic, scenario
      if (qLower) {
        const matchesSerial = serialNum === qLower || `#${serialNum}` === qLower;
        const matchesTitle = q.title.toLowerCase().includes(qLower);
        const matchesCompany = q.companyTag?.toLowerCase().includes(qLower);
        const matchesTopic = q.topic.toLowerCase().includes(qLower);
        const matchesScenario = q.businessScenario.toLowerCase().includes(qLower);
        const matchesId = q.id.toLowerCase().includes(qLower);

        if (!matchesSerial && !matchesTitle && !matchesCompany && !matchesTopic && !matchesScenario && !matchesId) {
          return false;
        }
      }

      // Difficulty
      if (difficultyFilter !== 'All' && q.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) {
        return false;
      }

      // Topic
      if (selectedTopic !== 'all' && q.topic !== selectedTopic) {
        return false;
      }

      // Company
      if (selectedCompany !== 'all' && q.companyTag !== selectedCompany) {
        return false;
      }

      // Solved status
      const isSolved = !!solvedMap[q.id];
      if (statusFilter === 'solved' && !isSolved) return false;
      if (statusFilter === 'unsolved' && isSolved) return false;

      return true;
    });
  }, [baseQuestions, searchQuery, difficultyFilter, selectedTopic, selectedCompany, statusFilter, solvedMap]);

  // Pagination calculation
  const totalItems = filteredQuestions.length;
  const effectivePageSize = pageSize === -1 ? totalItems || 1 : pageSize;
  const totalPages = Math.ceil(totalItems / effectivePageSize) || 1;
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedQuestions = useMemo(() => {
    if (pageSize === -1) return filteredQuestions;
    const start = (safePage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, safePage, pageSize]);

  // Difficulty counts for active base list
  const diffCounts = useMemo(() => {
    let easy = 0;
    let med = 0;
    let hard = 0;
    let solved = 0;
    baseQuestions.forEach((q) => {
      if (q.difficulty === 'Easy') easy++;
      else if (q.difficulty === 'Medium') med++;
      else if (q.difficulty === 'Hard') hard++;
      if (solvedMap[q.id]) solved++;
    });
    return { easy, med, hard, solved, total: baseQuestions.length };
  }, [baseQuestions, solvedMap]);

  const handlePlatformChange = (p: PlatformFilter) => {
    setSelectedPlatform(p);
    setCurrentPage(1);
    setSelectedCompany('all');
    setSelectedTopic('all');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Breadcrumb & Action Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-3 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSandbox}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>←</span>
              <span>Back to SQL Sandbox</span>
            </button>
            <div className="h-4 w-px bg-slate-750 hidden sm:block" />
            <div>
              <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>📚 Complete SQL Question Directory</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {totalItems.toLocaleString()} Questions
                </span>
              </h1>
            </div>
          </div>

          {/* Quick Stats Pill Strip */}
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">
              ✓ {diffCounts.solved} Solved
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 font-semibold hidden md:inline">
              🟢 {diffCounts.easy} Easy
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold hidden md:inline">
              🟡 {diffCounts.med} Medium
            </span>
            <span className="px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 font-semibold hidden md:inline">
              🔴 {diffCounts.hard} Hard
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col space-y-5">
        {/* Platform Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
          <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePlatformChange('all')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
              selectedPlatform === 'all'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">🌐</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                11,330 Qs
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">All Platforms</div>
              <div className="text-[10px] text-slate-400">Master Aggregated Catalog</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePlatformChange('stackoverflow')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
              selectedPlatform === 'stackoverflow'
                ? 'bg-orange-600/20 border-orange-500 text-white shadow-lg ring-1 ring-orange-500'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">🟧</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                10,000 Qs
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Stack Overflow</div>
              <div className="text-[10px] text-slate-400">Interview & Production Rounds</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePlatformChange('datadriven')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
              selectedPlatform === 'datadriven'
                ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-lg ring-1 ring-cyan-500'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">⚡</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                928 Qs
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">DataDriven.io</div>
              <div className="text-[10px] text-slate-400">Data Engineering (2026)</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePlatformChange('leetcode')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
              selectedPlatform === 'leetcode'
                ? 'bg-amber-600/20 border-amber-500 text-white shadow-lg ring-1 ring-amber-500'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">🟡</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                323 Qs
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">LeetCode</div>
              <div className="text-[10px] text-slate-400">Database Complete 323</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePlatformChange('hackerrank')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
              selectedPlatform === 'hackerrank'
                ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">🟢</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                58 Qs
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">HackerRank</div>
              <div className="text-[10px] text-slate-400">SQL Domain Track</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePlatformChange('datalemur')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
              selectedPlatform === 'datalemur'
                ? 'bg-amber-600/20 border-amber-500 text-white shadow-lg ring-1 ring-amber-500'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">🐒</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                21 Qs
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">DataLemur</div>
              <div className="text-[10px] text-slate-400">FAANG & Tech Interviews</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePlatformChange('stratascratch')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
              selectedPlatform === 'stratascratch'
                ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg ring-1 ring-purple-500'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">🟣</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                50 Qs
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">StrataScratch & FAANG</div>
              <div className="text-[10px] text-slate-400">Production Business Cases</div>
            </div>
          </motion.button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by serial # (e.g. 1, #25), title, company (Meta, Amazon), or topic..."
                className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Difficulty Filter */}
            <div className="inline-flex bg-slate-950 rounded-xl p-1 border border-slate-800 shrink-0">
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    setDifficultyFilter(diff);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    difficultyFilter === diff
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Solved Status Filter */}
            <div className="inline-flex bg-slate-950 rounded-xl p-1 border border-slate-800 shrink-0">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  statusFilter === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Status
              </button>
              <button
                onClick={() => {
                  setStatusFilter('solved');
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  statusFilter === 'solved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ✓ Solved
              </button>
              <button
                onClick={() => {
                  setStatusFilter('unsolved');
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  statusFilter === 'unsolved' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Unsolved
              </button>
            </div>
          </div>

          {/* Secondary Dropdown Filter Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-slate-850">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-semibold">Filter by:</span>

              {/* Company Select */}
              <select
                value={selectedCompany}
                onChange={(e) => {
                  setSelectedCompany(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-950 border border-slate-750 text-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer"
              >
                <option value="all">🏢 All Companies ({allCompanies.length})</option>
                {allCompanies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Topic Select */}
              <select
                value={selectedTopic}
                onChange={(e) => {
                  setSelectedTopic(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-950 border border-slate-750 text-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer"
              >
                <option value="all">🏷️ All Topics ({allTopics.length})</option>
                {allTopics.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>

              {(searchQuery || difficultyFilter !== 'All' || selectedCompany !== 'all' || selectedTopic !== 'all' || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setDifficultyFilter('All');
                    setSelectedCompany('all');
                    setSelectedTopic('all');
                    setStatusFilter('all');
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition cursor-pointer"
                >
                  Reset Filters ✕
                </button>
              )}
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Per page:</span>
              {[25, 50, 100, -1].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                    pageSize === size
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {size === -1 ? 'All' : size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info & Pagination Toolbar (Top) */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing{' '}
            <span className="font-bold text-white">
              {totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-bold text-white">
              {pageSize === -1 ? totalItems : Math.min(safePage * pageSize, totalItems)}
            </span>{' '}
            of <span className="font-bold text-cyan-400">{totalItems.toLocaleString()}</span> questions
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={safePage === 1}
                className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-mono"
                title="First Page"
              >
                ««
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={safePage === 1}
                className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ‹ Prev
              </button>
              <span className="px-3 py-1 font-mono text-slate-300 font-semibold">
                Page {safePage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={safePage === totalPages}
                className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Next ›
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={safePage === totalPages}
                className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-mono"
                title="Last Page"
              >
                »»
              </button>
            </div>
          )}
        </div>

        {/* Question Cards / Table List */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-850 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 w-16 text-center"># Serial</th>
                  <th className="px-4 py-3">Question Title & Scenario</th>
                  <th className="px-4 py-3 w-32">Platform</th>
                  <th className="px-4 py-3 w-28">Company</th>
                  <th className="px-4 py-3 w-24">Difficulty</th>
                  <th className="px-4 py-3 w-32">Topic</th>
                  <th className="px-4 py-3 w-36 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 font-sans">
                {paginatedQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      <div className="text-3xl mb-2">🔍</div>
                      <div className="text-sm font-bold text-white mb-1">No matching questions found</div>
                      <div className="text-xs text-slate-500">
                        Try adjusting your search keywords, platform tabs, or filters.
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedQuestions.map((q, localIdx) => {
                    const globalSerial = (safePage - 1) * (pageSize === -1 ? 0 : pageSize) + localIdx + 1;
                    const isSolved = !!solvedMap[q.id];

                    let platformBadge: { text: string; bg: string; icon: string } = {
                      text: q.platform,
                      bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
                      icon: '🌐',
                    };
                    if (q.platform === 'DataDriven') {
                      platformBadge = {
                        text: 'DataDriven',
                        bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
                        icon: '⚡',
                      };
                    } else if (q.platform === 'LeetCode') {
                      platformBadge = {
                        text: 'LeetCode',
                        bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                        icon: '🟡',
                      };
                    } else if (q.platform === 'HackerRank') {
                      platformBadge = {
                        text: 'HackerRank',
                        bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                        icon: '🟢',
                      };
                    } else if (q.platform === 'DataLemur') {
                      platformBadge = {
                        text: 'DataLemur',
                        bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                        icon: '🐒',
                      };
                    } else if (q.platform === 'Stack Overflow') {
                      platformBadge = {
                        text: 'Stack Overflow',
                        bg: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
                        icon: '🟧',
                      };
                    } else if (q.platform === 'FAANG+ Mock') {
                      platformBadge = {
                        text: 'FAANG Mock',
                        bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
                        icon: '🟣',
                      };
                    }

                    const diffBadge =
                      q.difficulty === 'Easy'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : q.difficulty === 'Medium'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30';

                    return (
                      <tr
                        key={q.id}
                        className="hover:bg-slate-850/50 transition duration-150 group"
                      >
                        {/* 1. Serial Number */}
                        <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-400 group-hover:text-cyan-400 transition">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-950/70 border border-slate-800 text-[11px]">
                            #{globalSerial}
                          </span>
                        </td>

                        {/* 2. Title & Business Scenario */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                              {q.title}
                            </span>
                            {isSolved && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                ✓ Solved
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {q.businessScenario}
                          </p>
                          {q.sourceUrl && (
                            <a
                              href={q.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-slate-500 hover:text-indigo-400 transition inline-flex items-center gap-1 mt-0.5"
                              title="Open original platform question"
                            >
                              <span>↗ Source:</span>
                              <span className="underline truncate max-w-xs">{q.sourceUrl}</span>
                            </a>
                          )}
                        </td>

                        {/* 3. Platform */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${platformBadge.bg}`}
                          >
                            <span>{platformBadge.icon}</span>
                            <span>{platformBadge.text}</span>
                          </span>
                        </td>

                        {/* 4. Company */}
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-200 border border-slate-700">
                            {q.companyTag || 'FAANG'}
                          </span>
                        </td>

                        {/* 5. Difficulty */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${diffBadge}`}
                          >
                            {q.difficulty}
                          </span>
                        </td>

                        {/* 6. Topic */}
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-950 text-slate-400 border border-slate-800">
                            {q.topic.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </td>

                        {/* 7. Action Button */}
                        <td className="px-4 py-3.5 text-center">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onSelectProblem(q)}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 hover:shadow-cyan-500/20 border border-indigo-400/30 transition-all cursor-pointer mx-auto w-full active:scale-95"
                          >
                            <span>⚡</span>
                            <span>Solve Challenge</span>
                          </motion.button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-950/80 border-t border-slate-850 text-xs text-slate-400">
              <div>
                Page <span className="font-bold text-white">{safePage}</span> of{' '}
                <span className="font-bold text-white">{totalPages}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={safePage === 1}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-mono"
                >
                  « First
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={safePage === 1}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  ‹ Prev
                </button>

                {/* Numbered Jump Buttons */}
                {(() => {
                  const start = Math.max(1, Math.min(safePage - 2, Math.max(1, totalPages - 4)));
                  const end = Math.min(totalPages, start + 4);
                  const pages: number[] = [];
                  for (let i = start; i <= end; i++) pages.push(i);
                  return pages.map((pNum) => (
                    <button
                      key={`page-${pNum}`}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-7 h-7 rounded text-xs font-mono font-bold transition cursor-pointer ${
                        safePage === pNum
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {pNum}
                    </button>
                  ));
                })()}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={safePage === totalPages}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next ›
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={safePage === totalPages}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-mono"
                >
                  Last »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
