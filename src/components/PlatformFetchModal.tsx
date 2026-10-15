/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SqlProblem } from '../types';
import {
  fetchPlatformQuestions,
  ingestPlatformProblemsIntoStream,
  SUPPORTED_PLATFORMS,
  PlatformInfo,
} from '../services/platformFetcher';

interface PlatformFetchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProblem: (problem: SqlProblem) => void;
  onToast: (msg: string) => void;
  onOpenDirectory?: () => void;
}

export const PlatformFetchModal: React.FC<PlatformFetchModalProps> = ({
  isOpen,
  onClose,
  onSelectProblem,
  onToast,
  onOpenDirectory,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'leetcode' | 'hackerrank' | 'datadriven' | 'stratascratch'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [fetchLimit, setFetchLimit] = useState<number | 'all'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [fetchedProblems, setFetchedProblems] = useState<SqlProblem[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleFetch = async () => {
    setIsLoading(true);
    setStatusNotice(`Querying ${selectedPlatform.toUpperCase()} live endpoint...`);

    try {
      const result = await fetchPlatformQuestions({
        platform: selectedPlatform,
        limit: fetchLimit,
        difficulty: selectedDifficulty,
      });

      setFetchedProblems(result.problems);
      setStatusNotice(result.sourceNotice);
      setHasSearched(true);
    } catch {
      setStatusNotice('Error fetching from platform. Using verified offline repository.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportAll = () => {
    if (fetchedProblems.length === 0) return;
    const added = ingestPlatformProblemsIntoStream(fetchedProblems, selectedPlatform.toUpperCase());
    onToast(`✓ Successfully imported ${added} questions into active practice feed!`);
    onClose();
  };

  const handleSolveImmediately = (problem: SqlProblem) => {
    ingestPlatformProblemsIntoStream([problem], problem.platform);
    onSelectProblem(problem);
    onToast(`✓ Loaded "${problem.title}" into SQL Editor!`);
    onClose();
  };

  if (!isOpen) return null;

  const currentPlatformMeta = SUPPORTED_PLATFORMS.find((p) => p.id === selectedPlatform) || SUPPORTED_PLATFORMS[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white text-xl shadow-md">
                🌐
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Multi-Platform SQL Question Fetcher
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Endpoints
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Direct ingestion from LeetCode GraphQL, HackerRank REST API, and FAANG case repositories
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {/* Platform Selection Cards */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-2 block">
                1. Select Target Platform:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {SUPPORTED_PLATFORMS.map((plat) => {
                  const isSelected = selectedPlatform === plat.id;
                  return (
                    <button
                      key={plat.id}
                      onClick={() => {
                        setSelectedPlatform(plat.id);
                        setFetchedProblems([]);
                        setHasSearched(false);
                      }}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? `${plat.bgLight} ${plat.borderColor} ring-1 ring-indigo-500/50 shadow-md`
                          : 'bg-slate-850/60 border-slate-750 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xl">{plat.icon}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${plat.badgeColor}`}>
                          {plat.totalAvailable}+ Qs
                        </span>
                      </div>
                      <div>
                        <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {plat.name}
                        </span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">
                          {plat.tagline}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Platform Details & Filter Strip */}
            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Difficulty Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-semibold">Difficulty:</span>
                  <div className="inline-flex bg-slate-900 rounded-lg p-0.5 border border-slate-750">
                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                          selectedDifficulty === diff
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Limit */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-semibold">Fetch Count:</span>
                  <div className="inline-flex bg-slate-900 rounded-lg p-0.5 border border-slate-750">
                    {([5, 10, 25, 'all'] as const).map((num) => (
                      <button
                        key={String(num)}
                        onClick={() => setFetchLimit(num)}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                          fetchLimit === num
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {num === 'all' ? '⚡ All Available' : `${num} Qs`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleFetch}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting & Fetching...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Fetch from {currentPlatformMeta.name}</span>
                  </>
                )}
              </button>
            </div>

            {/* Status Notice Banner */}
            {statusNotice && (
              <div className="px-3.5 py-2 rounded-lg bg-blue-950/40 border border-blue-800/40 text-blue-300 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
                <span className="font-mono text-[11px] truncate">{statusNotice}</span>
              </div>
            )}

            {/* Questions Result List */}
            {hasSearched && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Fetched Questions ({fetchedProblems.length})
                  </h3>
                  {fetchedProblems.length > 0 && (
                    <button
                      onClick={handleImportAll}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>📥</span>
                      <span>Import All into Practice Feed</span>
                    </button>
                  )}
                </div>

                {fetchedProblems.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 bg-slate-950/30 rounded-xl border border-slate-800">
                    No questions found for the selected filter combination. Try selecting "All" difficulties.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
                    {fetchedProblems.map((prob) => {
                      const platformColor =
                        prob.platform === 'LeetCode'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : prob.platform === 'HackerRank'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/30';

                      const diffColor =
                        prob.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : prob.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

                      return (
                        <div
                          key={prob.id}
                          className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${platformColor}`}>
                                {prob.platform}
                              </span>
                              {prob.companyTag && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                                  {prob.companyTag}
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${diffColor}`}>
                                {prob.difficulty}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {prob.topicLabel}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-white truncate">
                              {prob.title}
                            </h4>

                            <p className="text-xs text-slate-400 line-clamp-1">
                              {prob.businessScenario}
                            </p>

                            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                              <span>Tables:</span>
                              {prob.schemas.map((s) => (
                                <span key={s.tableName} className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-800">
                                  {s.tableName} ({s.columns.length} cols)
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleSolveImmediately(prob)}
                              className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                            >
                              <span>🚀</span>
                              <span>Practice Now</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              Fetched challenges are pre-validated with real AlaSQL tables and instant expected output verification.
            </div>

            <div className="flex items-center gap-2">
              {onOpenDirectory && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenDirectory();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <span>📚</span>
                  <span>Browse Question Library (1,309) →</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
              {fetchedProblems.length > 0 && (
                <button
                  onClick={handleImportAll}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <span>📥</span>
                  <span>Import All ({fetchedProblems.length})</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
