/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  TrendingDown,
  Database,
  Layers,
  Copy,
  Check,
  Code2,
  Sparkles,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  GitCompare,
  FileCheck2
} from 'lucide-react';
import { SqlProblem, Dialect } from '../types';
import {
  QueryOptimizationAnalysis,
  analyzeOptimizationDeterministically,
  optimizeQueryWithAI
} from '../services/aiCopilotService';

interface QueryOptimizerPanelProps {
  sqlCode: string;
  problem: SqlProblem;
  dialect: Dialect;
}

export const QueryOptimizerPanel: React.FC<QueryOptimizerPanelProps> = ({
  sqlCode,
  problem,
  dialect
}) => {
  const [analysis, setAnalysis] = useState<QueryOptimizationAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'sargable' | 'indexes' | 'execution_plan'>('sargable');

  const handleRunOptimization = async () => {
    setIsAnalyzing(true);
    try {
      const result = await optimizeQueryWithAI(sqlCode, problem, dialect);
      setAnalysis(result);
    } catch {
      const fallback = analyzeOptimizationDeterministically(sqlCode, problem, dialect);
      setAnalysis(fallback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run on mount or when sqlCode changes if analysis is empty
  useEffect(() => {
    if (!analysis) {
      handleRunOptimization();
    }
  }, [sqlCode, problem.id, dialect]);

  const handleCopyDdl = (ddl: string, id: string) => {
    try {
      navigator.clipboard.writeText(ddl);
      setCopiedIndex(id);
      setTimeout(() => setCopiedIndex(null), 2500);
    } catch {
      // Fallback ignored
    }
  };

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 flex flex-col gap-4 shadow-xl">
      {/* Top Banner with CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white text-xs shadow-md">
              ⚡
            </span>
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">
              Query Optimizer & Index Advisor
            </h4>
            {analysis && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold font-mono flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                <span>{analysis.estimatedCostSavings}</span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            AST inspection of predicates, SARGable rewrites, CTE materialization, and DDL index advisories.
          </p>
        </div>

        <button
          onClick={handleRunOptimization}
          disabled={isAnalyzing}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50 shrink-0 active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing AST...' : 'Re-Analyze Query'}</span>
        </button>
      </div>

      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2.5">
          <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-amber-300">
            Running cost-based optimization and clause analysis...
          </span>
        </div>
      ) : analysis ? (
        <div className="space-y-4">
          {/* Executive Summary Card */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
            <span className="text-amber-400 font-bold mr-1">Architect Rationale:</span>
            <span>{analysis.summary}</span>
          </div>

          {/* Section Tabs */}
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveSection('sargable')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSection === 'sargable'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>SARGable Rewrites ({analysis.sargableInsights.length})</span>
            </button>

            <button
              onClick={() => setActiveSection('indexes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSection === 'indexes'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Index Advisor ({analysis.recommendedIndexes.length})</span>
            </button>

            <button
              onClick={() => setActiveSection('execution_plan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSection === 'execution_plan'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Execution Plan Diff</span>
            </button>
          </div>

          {/* SECTION 1: SARGABLE CLAUSE REWRITES */}
          {activeSection === 'sargable' && (
            <div className="space-y-3">
              {analysis.sargableInsights.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>All WHERE and JOIN predicates in your query are fully SARGable (Search-Argument-Able)!</span>
                </div>
              ) : (
                analysis.sargableInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                        <span>Non-SARGable Expression Detected</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Forces Full Table Scan
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/30">
                        <span className="text-[10px] text-rose-400 font-bold block mb-1">
                          Current Clause (Slow):
                        </span>
                        <code className="text-rose-200 text-[11px] whitespace-pre-wrap">{insight.originalClause}</code>
                      </div>

                      <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                        <span className="text-[10px] text-emerald-400 font-bold block mb-1">
                          Optimized SARGable Rewrite:
                        </span>
                        <code className="text-emerald-200 text-[11px] whitespace-pre-wrap">{insight.optimizedClause}</code>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      {insight.explanation}
                    </p>
                  </div>
                ))
              )}

              {/* CTE & Materialization tips */}
              {analysis.materializationTips.length > 0 && (
                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CTE & Subquery Materialization Advice</span>
                  </span>
                  {analysis.materializationTips.map((tip, idx) => (
                    <p key={idx} className="text-xs text-slate-300 leading-relaxed">
                      • {tip}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: PRODUCTION DDL INDEX ADVISOR */}
          {activeSection === 'indexes' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400">
                Tailored production index statements generated for your query’s WHERE, JOIN, and ORDER BY columns:
              </div>

              {analysis.recommendedIndexes.map((idxRec) => (
                <div
                  key={idxRec.indexName}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{idxRec.indexName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {idxRec.type}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyDdl(idxRec.ddl, idxRec.indexName)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIndex === idxRec.indexName ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy DDL</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/80 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre">
                    {idxRec.ddl}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    {idxRec.rationale}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* SECTION 3: EXECUTION PLAN DIFF */}
          {activeSection === 'execution_plan' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-2">
                <span className="font-bold text-rose-400 block text-xs">
                  ❌ Baseline Execution Plan (Unindexed):
                </span>
                <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                  {analysis.executionPlanComparison.before.map((step, idx) => (
                    <div key={idx} className="p-1.5 rounded bg-black/40">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
                <span className="font-bold text-emerald-400 block text-xs">
                  ✅ Optimized Plan (SARGable + Indexed):
                </span>
                <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                  {analysis.executionPlanComparison.after.map((step, idx) => (
                    <div key={idx} className="p-1.5 rounded bg-black/40 text-emerald-200">
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
