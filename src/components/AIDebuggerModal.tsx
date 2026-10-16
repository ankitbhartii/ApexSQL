/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Code2,
  ChevronRight,
  X,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import { AIDebugAnalysis } from '../services/aiCopilotService';

interface AIDebuggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AIDebugAnalysis | null;
  isLoading?: boolean;
}

export const AIDebuggerModal: React.FC<AIDebuggerModalProps> = ({
  isOpen,
  onClose,
  analysis,
  isLoading = false,
}) => {
  const [unlockedHintsCount, setUnlockedHintsCount] = useState<number>(1);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-gradient-to-b from-[#0e1628] to-[#090d16] border border-indigo-500/40 shadow-2xl shadow-indigo-950/80 overflow-hidden z-10 text-slate-100"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#0d1527]/90 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white tracking-tight">
                    AI SQL Copilot & Diagnostic Tutor
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold font-mono">
                    SPOILER-FREE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Concept breakdown and progressive hints without giving away the final query.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition flex items-center justify-center cursor-pointer border border-slate-750"
              title="Close Tutor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                <span className="text-xs font-semibold text-indigo-300">
                  AI Copilot inspecting AST clauses and execution discrepancies...
                </span>
              </div>
            ) : analysis ? (
              <>
                {/* Diagnostic Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-slate-900/60 to-purple-950/40 border border-rose-500/30 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-rose-300 uppercase tracking-wide">
                        {analysis.conceptTitle}
                      </span>
                      {analysis.explanationConfidence && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {analysis.explanationConfidence}% match confidence
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-200 mt-1.5 leading-relaxed font-sans">
                      {analysis.rootCause}
                    </p>
                    {analysis.clauseCulprit && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950/80 border border-rose-500/20 font-mono text-[11px] text-rose-200">
                        <span className="text-slate-500 text-[10px]">Clause Culprit:</span>
                        <span className="font-semibold">{analysis.clauseCulprit}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progressive Spoiler-Free Hint Ladder */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span>Progressive Clues (Unlock as needed)</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Clue {Math.min(unlockedHintsCount, analysis.progressiveHints.length)} of {analysis.progressiveHints.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {analysis.progressiveHints.slice(0, unlockedHintsCount).map((hint, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {hint}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {unlockedHintsCount < analysis.progressiveHints.length && (
                    <button
                      onClick={() => setUnlockedHintsCount((prev) => prev + 1)}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white transition text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Reveal Next Clue ({unlockedHintsCount + 1} of {analysis.progressiveHints.length})</span>
                    </button>
                  )}
                </div>

                {/* Syntax Blueprint / Pattern */}
                {analysis.syntaxPattern && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Relational Pattern Blueprint</span>
                    </span>
                    <div className="relative rounded-xl bg-black/70 border border-slate-800 p-3 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                      {analysis.syntaxPattern}
                    </div>
                  </div>
                )}

                {/* Fix Checklist */}
                {analysis.fixChecklist && analysis.fixChecklist.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Self-Check Verification Checklist</span>
                    </span>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                      {analysis.fixChecklist.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No error diagnostic available for current execution.
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-5 py-3 border-t border-slate-800 bg-[#0d1527]/90 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ApexSQL Educational Sandbox Guard</span>
            </span>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/25 cursor-pointer active:scale-95"
            >
              <span>Back to Editor & Apply Fix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
