/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * FAANG Mock Technical Interview Simulator
 * 45-minute timed simulation replicating live Google / Meta technical screens.
 * Features:
 * - 2 Progressive Challenges (1 Medium Warm-up + 1 Hard Deep Dive)
 * - Built-in Countdown Timer with Web Audio API warning chimes (10m, 5m, 1m, Time's Up)
 * - Real-time In-Memory AlaSQL Evaluation & Test Case Verification
 * - Automated FAANG Hiring Scorecard (Correctness, Time, SQL Style, Big-O Complexity)
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Brain,
  Code2,
  Database,
  ChevronRight,
  HelpCircle,
  ShieldCheck,
  Zap,
  Flame,
  Layers,
  ChevronDown,
  Volume2,
  VolumeX,
  FileCheck2,
  Terminal,
  Send
} from 'lucide-react';
import { SqlProblem, Dialect, TableSchema, ExecutionResult } from '../types';
import { SqlCodeEditor } from './SqlCodeEditor';
import { validateSafeSqlQuery, capQueryResults } from '../utils/sqlSanitizer';
import alasql from 'alasql';
import confetti from 'canvas-confetti';
import {
  ALL_LEETCODE_PROBLEMS,
  ALL_STRATASCRATCH_PROBLEMS,
  ALL_DATALEMUR_PROBLEMS,
  AUTHENTIC_PLATFORM_PROBLEMS
} from '../services/platformQuestionsData';

export interface MockInterviewPageProps {
  onBackToSandbox: () => void;
  onOpenDirectory?: () => void;
}

// ============================================================================
// COMPANY INTERVIEW TRACKS & PERSONAS
// ============================================================================
export interface CompanyTrack {
  id: 'all' | 'meta' | 'google' | 'amazon' | 'netflix' | 'stripe';
  name: string;
  badge: string;
  interviewer: {
    name: string;
    role: string;
    company: string;
    avatarInitials: string;
    avatarColor: string;
    bio: string;
  };
  accentColor: string;
  description: string;
}

export const FAANG_TRACKS: CompanyTrack[] = [
  {
    id: 'meta',
    name: 'Meta',
    badge: 'Product Analytics & Funnels',
    interviewer: {
      name: 'Sarah Chen',
      role: 'Staff Data Engineer',
      company: 'Meta',
      avatarInitials: 'SC',
      avatarColor: 'from-blue-600 to-indigo-700',
      bio: 'Focuses on multi-step conversion funnels, rolling 24h retention cohorts, and user engagement trees.',
    },
    accentColor: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
    description: 'Instagram & Threads user onboarding, rolling active retention, and messaging feed metrics.',
  },
  {
    id: 'google',
    name: 'Google',
    badge: 'BigQuery & Slot Performance',
    interviewer: {
      name: 'David Miller',
      role: 'Principal BigQuery Architect',
      company: 'Google Cloud',
      avatarInitials: 'DM',
      avatarColor: 'from-red-500 to-amber-600',
      bio: 'Evaluates partition pruning, micro-partition skew, slot hours conservation, and SARGable predicates.',
    },
    accentColor: 'from-red-500/20 to-amber-500/20 border-amber-500/30',
    description: 'Ad traffic quality grading, query slot skew analysis, and clustered search indexing.',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    badge: 'Warehouse & Fulfillment Logistics',
    interviewer: {
      name: 'Priya Patel',
      role: 'Principal BI & Infrastructure Engineer',
      company: 'Amazon',
      avatarInitials: 'PP',
      avatarColor: 'from-amber-500 to-orange-600',
      bio: 'Specializes in inventory turnover velocity, prime delivery fulfillment SLAs, and order rollups.',
    },
    accentColor: 'from-amber-500/20 to-orange-500/20 border-orange-500/30',
    description: 'E-commerce basket analysis, fulfillment latency tracking, and customer loyalty retention.',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    badge: 'Streaming Telemetry & Cohorts',
    interviewer: {
      name: 'Elena Rostova',
      role: 'Lead Analytics Engineer',
      company: 'Netflix',
      avatarInitials: 'ER',
      avatarColor: 'from-rose-600 to-pink-700',
      bio: 'Examines series release stickiness, binge-watching completion velocity, and streaming session gaps.',
    },
    accentColor: 'from-rose-500/20 to-pink-500/20 border-rose-500/30',
    description: 'Session gap analysis with Window LAG, Day-N series dropoff, and subscriber churn modeling.',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    badge: 'FinTech Ledgers & Reconciliation',
    interviewer: {
      name: 'Marcus Vance',
      role: 'Staff Financial Data Architect',
      company: 'Stripe',
      avatarInitials: 'MV',
      avatarColor: 'from-indigo-600 to-purple-700',
      bio: 'Demands double-entry ledger precision, currency conversion rounding, and merchant fee auditing.',
    },
    accentColor: 'from-indigo-500/20 to-purple-500/20 border-purple-500/30',
    description: 'Multi-currency dispute matching, merchant payout volume, and zero-loss ledger balancing.',
  },
  {
    id: 'all',
    name: 'FAANG+ Mixed',
    badge: 'Comprehensive Technical Screen',
    interviewer: {
      name: 'Alex Rivera',
      role: 'Distinguished Data Engineer',
      company: 'FAANG Advisory',
      avatarInitials: 'AR',
      avatarColor: 'from-cyan-600 to-teal-700',
      bio: 'Simulates a comprehensive technical screen pulling high-frequency challenges from top tier tech.',
    },
    accentColor: 'from-cyan-500/20 to-indigo-500/20 border-cyan-500/30',
    description: 'A dynamic combination of progressive Medium warm-up and Hard advanced pipeline challenges.',
  },
];

// Total 45 minutes in seconds
const INTERVIEW_DURATION_SECONDS = 45 * 60;

// Leak-free Web Audio Synthesizer for alerts
function playInterviewChime(tone: 'start' | 'warn_10m' | 'warn_5m' | 'warn_1m' | 'time_up' | 'accepted') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext })?.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (tone === 'start') {
      // Confident major chord chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (tone === 'warn_10m') {
      // 2-tone gentle notice
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(739.99, now + 0.12); // F#5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (tone === 'warn_5m') {
      // Urgent notification
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.15); // C5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (tone === 'warn_1m') {
      // High urgency warning pulse
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(440, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (tone === 'time_up') {
      // Deep conclusion gong
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(329.63, now); // E4
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.4); // A3
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    } else if (tone === 'accepted') {
      // Success victory flourish
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.22);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    }

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 1500);
  } catch {}
}

export const MockInterviewPage: React.FC<MockInterviewPageProps> = ({
  onBackToSandbox,
  onOpenDirectory
}) => {
  // Simulator Phases: 'setup' -> 'in_progress' -> 'scorecard'
  const [phase, setPhase] = useState<'setup' | 'in_progress' | 'scorecard'>('setup');
  const [selectedTrackId, setSelectedTrackId] = useState<CompanyTrack['id']>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active Questions for this interview session: [Q1: Medium, Q2: Hard]
  const [questions, setQuestions] = useState<[SqlProblem, SqlProblem] | null>(null);
  const [activeQIndex, setActiveQIndex] = useState<0 | 1>(0);

  // Candidate SQL Code drafts per question
  const [candidateCodes, setCandidateCodes] = useState<Record<number, string>>({
    0: '-- Question 1: Write your SQL solution below\nSELECT ',
    1: '-- Question 2: Write your SQL solution below\nSELECT '
  });

  // Dialect per question
  const [dialects, setDialects] = useState<Record<number, Dialect>>({
    0: 'postgres',
    1: 'postgres'
  });

  // Execution verification status
  const [qResults, setQResults] = useState<Record<number, ExecutionResult | null>>({
    0: null,
    1: null
  });

  const [qSubmissions, setQSubmissions] = useState<Record<number, { isAccepted: boolean; attempts: number; elapsedSeconds: number }>>({
    0: { isAccepted: false, attempts: 0, elapsedSeconds: 0 },
    1: { isAccepted: false, attempts: 0, elapsedSeconds: 0 }
  });

  // Hints revealed per question (0, 1, or 2)
  const [revealedHints, setRevealedHints] = useState<Record<number, number>>({
    0: 0,
    1: 0
  });

  // Timer: 45:00 countdown in seconds
  const [secondsRemaining, setSecondsRemaining] = useState<number>(INTERVIEW_DURATION_SECONDS);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [timeWarnings, setTimeWarnings] = useState<{ tenMin: boolean; fiveMin: boolean; oneMin: boolean }>({
    tenMin: false,
    fiveMin: false,
    oneMin: false
  });

  // Scratchpad notes per question
  const [candidateNotes, setCandidateNotes] = useState<Record<number, string>>({
    0: '',
    1: ''
  });
  const [activeRightTab, setActiveRightTab] = useState<'editor' | 'scratchpad' | 'schema'>('editor');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Pool of authentic problems categorized by company & difficulty
  const authenticPool = useMemo(() => {
    return [...ALL_LEETCODE_PROBLEMS, ...ALL_STRATASCRATCH_PROBLEMS, ...ALL_DATALEMUR_PROBLEMS];
  }, []);

  const activeTrack = useMemo(() => {
    return FAANG_TRACKS.find((t) => t.id === selectedTrackId) || FAANG_TRACKS[5];
  }, [selectedTrackId]);

  // Pick 2 progressive questions: 1 Medium + 1 Hard
  const generateInterviewPair = (trackId: CompanyTrack['id']): [SqlProblem, SqlProblem] => {
    let mediumCandidates = authenticPool.filter((p) => p.difficulty === 'Medium');
    let hardCandidates = authenticPool.filter((p) => p.difficulty === 'Hard');

    // Filter by company if specific track chosen
    if (trackId !== 'all') {
      const matchCompany = trackId.toLowerCase();
      const trackMediums = mediumCandidates.filter((p) => {
        const comp = (p.companyTag || p.platform || '').toLowerCase();
        return comp.includes(matchCompany);
      });
      const trackHards = hardCandidates.filter((p) => {
        const comp = (p.companyTag || p.platform || '').toLowerCase();
        return comp.includes(matchCompany);
      });

      if (trackMediums.length > 0) mediumCandidates = trackMediums;
      if (trackHards.length > 0) hardCandidates = trackHards;
    }

    // Deterministic random selection
    const q1 = mediumCandidates[Math.floor(Math.random() * mediumCandidates.length)] || authenticPool[2];
    const q2 = hardCandidates[Math.floor(Math.random() * hardCandidates.length)] || authenticPool[8];

    return [q1, q2];
  };

  // Launch interview simulation
  const handleStartInterview = () => {
    const pair = generateInterviewPair(selectedTrackId);
    setQuestions(pair);
    setActiveQIndex(0);
    setCandidateCodes({
      0: pair[0].starterCodeByDialect?.postgres || `-- Warm-up: ${pair[0].title}\nSELECT `,
      1: pair[1].starterCodeByDialect?.postgres || `-- Deep Dive: ${pair[1].title}\nSELECT `
    });
    setQResults({ 0: null, 1: null });
    setQSubmissions({
      0: { isAccepted: false, attempts: 0, elapsedSeconds: 0 },
      1: { isAccepted: false, attempts: 0, elapsedSeconds: 0 }
    });
    setRevealedHints({ 0: 0, 1: 0 });
    setSecondsRemaining(INTERVIEW_DURATION_SECONDS);
    setIsTimerPaused(false);
    setTimeWarnings({ tenMin: false, fiveMin: false, oneMin: false });
    setPhase('in_progress');

    if (soundEnabled) {
      playInterviewChime('start');
    }
  };

  // 45-Minute Timer Countdown Effect
  useEffect(() => {
    if (phase !== 'in_progress' || isTimerPaused) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time expired! Play gong & finalize
          if (soundEnabled) playInterviewChime('time_up');
          handleEndInterview();
          return 0;
        }

        // 10-Minute Warning
        if (prev === 10 * 60 && !timeWarnings.tenMin) {
          setTimeWarnings((w) => ({ ...w, tenMin: true }));
          if (soundEnabled) playInterviewChime('warn_10m');
        }

        // 5-Minute Warning
        if (prev === 5 * 60 && !timeWarnings.fiveMin) {
          setTimeWarnings((w) => ({ ...w, fiveMin: true }));
          if (soundEnabled) playInterviewChime('warn_5m');
        }

        // 1-Minute Final Warning
        if (prev === 60 && !timeWarnings.oneMin) {
          setTimeWarnings((w) => ({ ...w, oneMin: true }));
          if (soundEnabled) playInterviewChime('warn_1m');
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isTimerPaused, soundEnabled, timeWarnings]);

  // Current active question
  const currentQ = questions ? questions[activeQIndex] : null;

  // Execute and evaluate candidate code in AlaSQL
  const evaluateQueryExecution = (isFinalSubmit: boolean = false) => {
    if (!currentQ) return;
    setIsEvaluating(true);
    const sql = candidateCodes[activeQIndex] || '';
    const startTime = performance.now();

    // 1. Sandbox check
    const validation = validateSafeSqlQuery(sql, { allowDml: false, maxLen: 10000 });
    if (!validation.isSafe) {
      const errRes: ExecutionResult = {
        status: 'SYNTAX_ERROR',
        message: validation.reason || 'Query failed security sandbox check.',
        executionTimeMs: Math.round(performance.now() - startTime),
        rowsReturned: 0,
        outputColumns: [],
        outputRows: [],
        checklist: [{ id: 'chk_sec', label: 'Sandbox Security Check', passed: false }]
      };
      setQResults((prev) => ({ ...prev, [activeQIndex]: errRes }));
      setIsEvaluating(false);
      return;
    }

    try {
      const db = new (alasql as any).Database();

      // Register tables with bracketed escaping
      currentQ.schemas.forEach((schema) => {
        const rawName = schema.tableName;
        const safeName = rawName.replace(/[^a-zA-Z0-9_]/g, '_');
        try {
          db.exec(`CREATE TABLE [${rawName}]`);
          db.exec(`INSERT INTO [${rawName}] SELECT * FROM ?`, [schema.sampleRows]);
        } catch {}
        if (safeName !== rawName) {
          try {
            db.exec(`CREATE TABLE [${safeName}]`);
            db.exec(`INSERT INTO [${safeName}] SELECT * FROM ?`, [schema.sampleRows]);
          } catch {}
        }
      });

      let execQuery = validation.sanitizedSql.replace(/;\s*$/, '').trim();
      execQuery = execQuery.replace(/`([^`]+)`/g, '[$1]');

      const rawResult = db.exec(execQuery);
      const rawRows: Record<string, any>[] = Array.isArray(rawResult) ? rawResult : [];
      const capped = capQueryResults(rawRows);
      const rows = capped.rows;
      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
      const elapsedMs = Math.round(performance.now() - startTime);

      // Check accuracy against expected output
      const expectedRows = currentQ.expectedOutput?.rows || [];
      const expectedCols = currentQ.expectedOutput?.columns || [];
      const isColsMatch = expectedCols.length === 0 || expectedCols.every((col) => 
        columns.some((c) => c.toLowerCase() === col.toLowerCase())
      );
      const isRowsCountMatch = rows.length === expectedRows.length;

      // Deep cell equality test
      let matchedCount = 0;
      rows.forEach((r, idx) => {
        const exp = expectedRows[idx];
        if (!exp) return;
        const allColsMatch = Object.keys(exp).every((k) => {
          const userVal = r[k] ?? r[k.toLowerCase()] ?? r[k.toUpperCase()];
          return String(userVal).trim().toLowerCase() === String(exp[k]).trim().toLowerCase();
        });
        if (allColsMatch) matchedCount++;
      });

      const accuracyPct = expectedRows.length > 0 
        ? Math.round((matchedCount / expectedRows.length) * 100) 
        : (rows.length > 0 ? 100 : 0);

      const isAccepted = (accuracyPct === 100 && isColsMatch) || (rows.length > 0 && expectedRows.length === 0);

      const execResult: ExecutionResult = {
        status: isAccepted ? 'ACCEPTED' : (accuracyPct > 0 ? 'NEEDS_ADJUSTMENT' : 'SYNTAX_ERROR'),
        message: isAccepted
          ? '✓ Output matches target specification exactly.'
          : `Output matched ${accuracyPct}% of expected target rows.`,
        executionTimeMs: elapsedMs,
        rowsReturned: rows.length,
        outputColumns: columns,
        outputRows: rows,
        checklist: [
          { id: 'c1', label: 'Valid SQL Syntax', passed: true },
          { id: 'c2', label: 'Target Schema Columns Matched', passed: isColsMatch },
          { id: 'c3', label: 'Rows Value & Aggregation Verification', passed: isAccepted }
        ]
      };

      setQResults((prev) => ({ ...prev, [activeQIndex]: execResult }));

      if (isFinalSubmit) {
        const currentElapsed = INTERVIEW_DURATION_SECONDS - secondsRemaining;
        setQSubmissions((prev) => ({
          ...prev,
          [activeQIndex]: {
            isAccepted,
            attempts: prev[activeQIndex].attempts + 1,
            elapsedSeconds: currentElapsed
          }
        }));

        if (isAccepted) {
          if (soundEnabled) playInterviewChime('accepted');
          try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          } catch {}
        }
      }
    } catch (err: any) {
      const errRes: ExecutionResult = {
        status: 'SYNTAX_ERROR',
        message: err?.message || 'SQL Execution Error',
        executionTimeMs: Math.round(performance.now() - startTime),
        rowsReturned: 0,
        outputColumns: [],
        outputRows: [],
        checklist: [{ id: 'c_err', label: 'Execution Error', passed: false }]
      };
      setQResults((prev) => ({ ...prev, [activeQIndex]: errRes }));
    } finally {
      setTimeout(() => setIsEvaluating(false), 200);
    }
  };

  // End interview and generate final scorecard
  const handleEndInterview = () => {
    setIsTimerPaused(true);
    setPhase('scorecard');
    if (soundEnabled) playInterviewChime('time_up');
  };

  // Automated FAANG Scorecard Computation
  const scorecard = useMemo(() => {
    if (!questions) return null;

    const q1Accepted = qSubmissions[0].isAccepted;
    const q2Accepted = qSubmissions[1].isAccepted;

    // 1. Correctness (40%)
    const q1CorrectScore = q1Accepted ? 20 : (qResults[0]?.status === 'NEEDS_ADJUSTMENT' ? 10 : 0);
    const q2CorrectScore = q2Accepted ? 20 : (qResults[1]?.status === 'NEEDS_ADJUSTMENT' ? 10 : 0);
    const correctnessTotal = q1CorrectScore + q2CorrectScore; // max 40

    // 2. Time Efficiency (25%)
    const totalSecondsUsed = INTERVIEW_DURATION_SECONDS - secondsRemaining;
    const minutesUsed = Math.round(totalSecondsUsed / 60);
    let timeScore = 10;
    if (q1Accepted && q2Accepted) {
      if (minutesUsed <= 25) timeScore = 25; // Exceptional
      else if (minutesUsed <= 35) timeScore = 22; // Strong FAANG pace
      else if (minutesUsed <= 42) timeScore = 18; // Standard pace
      else timeScore = 15;
    } else if (q1Accepted || q2Accepted) {
      timeScore = Math.min(16, Math.max(8, 20 - Math.round(minutesUsed / 3)));
    }

    // 3. SQL Style & Cleanliness (20%)
    const code1 = candidateCodes[0] || '';
    const code2 = candidateCodes[1] || '';
    const combinedCode = `${code1}\n${code2}`;

    let styleScore = 12;
    // Check UPPERCASE keyword usage
    const hasUpperKeywords = /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LEFT JOIN)\b/.test(combinedCode);
    if (hasUpperKeywords) styleScore += 3;
    // Check CTE usage vs deep nesting
    const usesCte = /\bWITH\s+[a-zA-Z0-9_]+\s+AS\s*\(/i.test(combinedCode);
    if (usesCte) styleScore += 3;
    // Penalty for SELECT * in final queries
    const hasSelectStar = /SELECT\s+\*\s+FROM/i.test(combinedCode);
    if (hasSelectStar) styleScore -= 2;
    // Penalty for hints requested (-2 per hint)
    const totalHints = revealedHints[0] + revealedHints[1];
    styleScore = Math.max(4, styleScore - totalHints * 2);
    styleScore = Math.min(20, Math.max(5, styleScore));

    // 4. Big-O Complexity Grade (15%)
    let complexityScore = 8;
    if (q2Accepted) {
      // If solved hard problem with window function or CTE
      if (/\b(OVER|PARTITION|ROW_NUMBER|RANK|DENSE_RANK|LAG|LEAD)\b/i.test(code2)) {
        complexityScore = 15; // O(N log N) optimal window frame
      } else {
        complexityScore = 12;
      }
    } else if (q1Accepted) {
      complexityScore = 10;
    }

    const overallScore = Math.min(100, Math.round(correctnessTotal + timeScore + styleScore + complexityScore));

    // Determine FAANG Hiring Decision
    let verdict: 'STRONG HIRE' | 'HIRE' | 'LEAN HIRE' | 'NO HIRE' = 'NO HIRE';
    let verdictTagline = '';
    let verdictColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';

    if (overallScore >= 88 && q1Accepted && q2Accepted) {
      verdict = 'STRONG HIRE';
      verdictTagline = 'Exceptional performance. Solved both challenges rapidly with clean CTE architecture.';
      verdictColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    } else if (overallScore >= 74 && (q1Accepted && q2Accepted || (q1Accepted && qResults[1]?.status === 'NEEDS_ADJUSTMENT'))) {
      verdict = 'HIRE';
      verdictTagline = 'Meets the technical bar. Demonstrated solid relational reasoning within the time limit.';
      verdictColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    } else if (overallScore >= 58 && (q1Accepted || q2Accepted)) {
      verdict = 'LEAN HIRE';
      verdictTagline = 'Borderline candidate. Strong foundation on warm-up, but struggled on deep-dive aggregation.';
      verdictColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    } else {
      verdict = 'NO HIRE';
      verdictTagline = 'Below the technical bar. Syntax errors or did not reach target specification within 45 mins.';
      verdictColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }

    return {
      overallScore,
      verdict,
      verdictTagline,
      verdictColor,
      correctnessTotal,
      timeScore,
      styleScore,
      complexityScore,
      minutesUsed,
      totalHints,
      q1Accepted,
      q2Accepted,
      complexityEstimate: usesCte ? 'O(N log N) Hash Sort' : 'O(N) Streaming Scan'
    };
  }, [questions, qSubmissions, qResults, secondsRemaining, candidateCodes, revealedHints]);

  // Format MM:SS for countdown timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Timer urgency styling
  const timerUrgencyClass = useMemo(() => {
    if (secondsRemaining <= 180) return 'text-rose-400 border-rose-500/40 bg-rose-950/40 animate-pulse';
    if (secondsRemaining <= 600) return 'text-amber-300 border-amber-500/40 bg-amber-950/30';
    return 'text-emerald-300 border-emerald-500/30 bg-emerald-950/20';
  }, [secondsRemaining]);

  // ============================================================================
  // RENDER 1: SETUP & COMPANY TRACK SELECTOR
  // ============================================================================
  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Top Return Banner */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToSandbox}
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer border border-white/10"
            >
              <span>←</span>
              <span>Back to SQL Workspace</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-full border transition cursor-pointer ${
                  soundEnabled ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-500'
                }`}
                title={soundEnabled ? 'Audio Chimes Enabled' : 'Audio Chimes Muted'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <span className="text-xs font-mono text-slate-400 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                FAANG Standard • 45m Limit
              </span>
            </div>
          </div>

          {/* Hero Header */}
          <div className="text-center space-y-3 pt-2">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Real-Time Technical Screen Simulator</span>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              FAANG SQL Mock Interview
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
              Step into a high-pressure 45-minute live technical screen. Solve a progressive 2-problem sequence (Warm-up Medium + Deep Dive Hard) scored on Correctness, Time Efficiency, SQL Style, and Big-O Complexity.
            </p>
          </div>

          {/* Target Company Track Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span>Select Company Screen Track</span>
              </h2>
              <span className="text-xs text-slate-400">Pulls authentic industry problems</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FAANG_TRACKS.map((track) => {
                const isSelected = selectedTrackId === track.id;
                return (
                  <motion.div
                    key={track.id}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => setSelectedTrackId(track.id)}
                    className={`relative rounded-2xl p-5 border transition-all cursor-pointer backdrop-blur-xl flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900/95 border-cyan-400/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/40'
                        : 'bg-slate-900/50 hover:bg-slate-800/60 border-white/8 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-bold text-white">{track.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                          {track.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                        {track.description}
                      </p>
                    </div>

                    {/* Interviewer Persona Card */}
                    <div className="pt-3 border-t border-white/5 flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${track.interviewer.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0`}>
                        {track.interviewer.avatarInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">{track.interviewer.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{track.interviewer.role}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Interview Structure & Rubric Breakdown */}
          <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span>Technical Screen Format & Evaluation Pillars</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">1</span>
                  <span>Warm-up (Medium)</span>
                </div>
                <p className="text-xs text-slate-400">15-18 mins. Window ranking, grouping filters, and conditional expressions.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px]">2</span>
                  <span>Deep Dive (Hard)</span>
                </div>
                <p className="text-xs text-slate-400">20-25 mins. Multi-stage CTE pipelines, session gaps, or recursive trees.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">3</span>
                  <span>Timer (45:00)</span>
                </div>
                <p className="text-xs text-slate-400">Countdown timer with acoustic warning alerts at 10m, 5m, and 1m.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">4</span>
                  <span>Hiring Rubric</span>
                </div>
                <p className="text-xs text-slate-400">Graded against the real FAANG bar: Strong Hire, Hire, Lean Hire, or No Hire.</p>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Simulating with interviewer <strong className="text-slate-200">{activeTrack.interviewer.name}</strong> ({activeTrack.interviewer.company})</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartInterview}
              className="apple-btn-primary w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/25 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start 45-Minute Screen</span>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER 2: SCORECARD & DEBRIEF REPORT
  // ============================================================================
  if (phase === 'scorecard' && scorecard) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Simulation Complete</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Technical Interview Debrief
              </h1>
            </div>
            <button
              onClick={onBackToSandbox}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold border border-white/10 transition cursor-pointer"
            >
              Exit to Sandbox
            </button>
          </div>

          {/* Verdict Banner Card */}
          <div className={`p-6 sm:p-8 rounded-3xl border ${scorecard.verdictColor} backdrop-blur-xl relative overflow-hidden`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Interviewer Committee Decision
                </span>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                    {scorecard.verdict}
                  </h2>
                  <span className="text-xl font-bold px-3 py-1 rounded-full bg-white/10 text-white font-mono">
                    {scorecard.overallScore}/100
                  </span>
                </div>
                <p className="text-sm text-slate-200 max-w-xl leading-relaxed">
                  {scorecard.verdictTagline}
                </p>
              </div>

              {/* Big-O Badge */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-right shrink-0">
                <p className="text-[10px] uppercase font-bold text-slate-400">Complexity Profile</p>
                <p className="text-sm font-mono font-bold text-cyan-300 mt-0.5">{scorecard.complexityEstimate}</p>
                <p className="text-[10px] text-slate-400 mt-1">Time Elapsed: {scorecard.minutesUsed}m / 45m</p>
              </div>
            </div>
          </div>

          {/* 4 Pillar Breakdown Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Correctness (40%)</span>
                <span className="text-cyan-400 font-mono">{scorecard.correctnessTotal}/40</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full transition-all" style={{ width: `${(scorecard.correctnessTotal / 40) * 100}%` }} />
              </div>
              <p className="text-[11px] text-slate-400">
                Q1: {scorecard.q1Accepted ? '✓ Accepted' : '✗ Failed'} • Q2: {scorecard.q2Accepted ? '✓ Accepted' : '✗ Failed'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Time Pace (25%)</span>
                <span className="text-indigo-400 font-mono">{scorecard.timeScore}/25</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full transition-all" style={{ width: `${(scorecard.timeScore / 25) * 100}%` }} />
              </div>
              <p className="text-[11px] text-slate-400">{scorecard.minutesUsed} of 45 minutes used</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>SQL Style (20%)</span>
                <span className="text-emerald-400 font-mono">{scorecard.styleScore}/20</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full transition-all" style={{ width: `${(scorecard.styleScore / 20) * 100}%` }} />
              </div>
              <p className="text-[11px] text-slate-400">CTEs, UPPERCASE keywords, formatting</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Big-O Grade (15%)</span>
                <span className="text-amber-400 font-mono">{scorecard.complexityScore}/15</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full transition-all" style={{ width: `${(scorecard.complexityScore / 15) * 100}%` }} />
              </div>
              <p className="text-[11px] text-slate-400">Scan efficiency & memory partition</p>
            </div>
          </div>

          {/* Question Breakdown Summary */}
          {questions && (
            <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Challenge Outcomes
              </h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">Question 1 • Medium Warm-up</span>
                    <h4 className="text-sm font-bold text-white truncate">{questions[0].title}</h4>
                    <p className="text-xs text-slate-400">{questions[0].topicLabel || questions[0].topic}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      scorecard.q1Accepted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {scorecard.q1Accepted ? 'Passed' : 'Incomplete'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase">Question 2 • Hard Deep Dive</span>
                    <h4 className="text-sm font-bold text-white truncate">{questions[1].title}</h4>
                    <p className="text-xs text-slate-400">{questions[1].topicLabel || questions[1].topic}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      scorecard.q2Accepted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {scorecard.q2Accepted ? 'Passed' : 'Incomplete'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handleStartInterview}
              className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Simulation (New Pair)</span>
            </button>

            {onOpenDirectory && (
              <button
                onClick={onOpenDirectory}
                className="px-5 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 transition cursor-pointer"
              >
                Explore All 11,162 Catalog Questions
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER 3: ACTIVE 45-MINUTE LIVE INTERVIEW SCREEN
  // ============================================================================
  if (!currentQ || !questions) return null;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans flex flex-col">
      {/* Top Interviewer & Clock Control Bar */}
      <div className="h-14 border-b border-white/10 bg-[#090d18]/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 select-none">
        {/* Left: Persona info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${activeTrack.interviewer.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs`}>
            {activeTrack.interviewer.avatarInitials}
          </div>
          <div className="min-w-0 hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate">{activeTrack.interviewer.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 truncate">{activeTrack.interviewer.role} • {activeTrack.interviewer.company}</p>
          </div>

          <div className="h-4 w-px bg-white/10 hidden md:block" />

          {/* Question Selector Tabs */}
          <div className="flex items-center gap-1.5 apple-pill-bar p-0.5 rounded-full">
            <button
              onClick={() => setActiveQIndex(0)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeQIndex === 0 ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Q1 (Warm-up)</span>
              {qSubmissions[0].isAccepted && <span className="text-emerald-400 text-xs">✓</span>}
            </button>
            <button
              onClick={() => setActiveQIndex(1)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeQIndex === 1 ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Q2 (Deep Dive)</span>
              {qSubmissions[1].isAccepted && <span className="text-emerald-400 text-xs">✓</span>}
            </button>
          </div>
        </div>

        {/* Center: Live 45m Countdown Clock */}
        <div className="flex items-center gap-2">
          <div className={`px-3.5 py-1 rounded-full border text-xs sm:text-sm font-mono font-bold flex items-center gap-2 transition-all ${timerUrgencyClass}`}>
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>
        </div>

        {/* Right: Sound toggle & End Interview button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={handleEndInterview}
            className="px-3.5 py-1.5 rounded-full bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-bold transition shadow-md shadow-rose-600/20 cursor-pointer"
          >
            Finish & Submit
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Interview Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Panel: Problem Statement, Scenarios, Schema & Hints (5 Cols) */}
        <div className="lg:col-span-5 border-r border-white/8 bg-[#080c16] flex flex-col overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          <div className="p-5 space-y-4">
            {/* Header Badge */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                  {activeQIndex === 0 ? 'WARM-UP CHALLENGE' : 'SYSTEM DEEP DIVE'}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  currentQ.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {currentQ.difficulty}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-semibold">{currentQ.platform}</span>
            </div>

            {/* Title & Scenario */}
            <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
              {currentQ.title}
            </h2>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/6 text-xs text-slate-300 leading-relaxed space-y-2">
              <p className="font-semibold text-slate-200">Business Context:</p>
              <p className="text-slate-300">{currentQ.businessScenario}</p>
            </div>

            {/* Requirements list */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Target Requirements:
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentQ.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Schema Tables */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Available Schema & Sample Rows:</span>
              </h3>
              <div className="space-y-2.5">
                {currentQ.schemas.map((schema, sIdx) => (
                  <div key={sIdx} className="rounded-xl border border-white/6 bg-slate-900/50 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-300">{schema.tableName}</span>
                      <span className="text-[10px] text-slate-500">{schema.sampleRows.length} sample rows</span>
                    </div>
                    {/* Columns pill list */}
                    <div className="flex flex-wrap gap-1.5">
                      {schema.columns.map((col, cIdx) => (
                        <span key={cIdx} className="px-2 py-0.5 rounded-md bg-white/4 border border-white/8 text-[11px] font-mono text-slate-300">
                          {col.name} <span className="text-slate-500 text-[10px]">({col.type})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progressive Interviewer Hints (Candidate can request) */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/8 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Interviewer Hint</span>
                </div>
                <span className="text-[10px] text-slate-400">Requesting hints slightly trims independence score</span>
              </div>

              {revealedHints[activeQIndex] === 0 ? (
                <button
                  onClick={() => setRevealedHints((h) => ({ ...h, [activeQIndex]: 1 }))}
                  className="w-full py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
                >
                  Request Hint 1 from {activeTrack.interviewer.name}
                </button>
              ) : revealedHints[activeQIndex] === 1 ? (
                <div className="space-y-2">
                  <p className="text-xs text-amber-200 bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/20 leading-relaxed">
                    💡 <strong>Hint 1:</strong> {currentQ.hints.tier1}
                  </p>
                  <button
                    onClick={() => setRevealedHints((h) => ({ ...h, [activeQIndex]: 2 }))}
                    className="w-full py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
                  >
                    Request Deeper Hint 2 (Approach Skeleton)
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-amber-200 bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/20 leading-relaxed">
                    💡 <strong>Hint 1:</strong> {currentQ.hints.tier1}
                  </p>
                  <p className="text-xs text-cyan-200 bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-500/20 leading-relaxed">
                    💡 <strong>Hint 2:</strong> {currentQ.hints.tier2}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: SQL Code Editor, Live AlaSQL Engine Execution, Output Verification (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-[#070b14] overflow-hidden">
          {/* Dialect bar & View Switcher */}
          <div className="h-10 border-b border-white/8 bg-slate-900/60 px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Dialect:</span>
              <select
                value={dialects[activeQIndex]}
                onChange={(e) => setDialects((prev) => ({ ...prev, [activeQIndex]: e.target.value as Dialect }))}
                className="bg-slate-800 text-slate-200 rounded px-2 py-0.5 border border-white/10 text-xs focus:outline-hidden cursor-pointer"
              >
                <option value="postgres">PostgreSQL</option>
                <option value="snowflake">Snowflake</option>
                <option value="bigquery">GoogleSQL (BigQuery)</option>
                <option value="mysql">MySQL</option>
              </select>
            </div>

            {/* Run & Submit Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => evaluateQueryExecution(false)}
                disabled={isEvaluating}
                className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-white/10 transition cursor-pointer flex items-center gap-1.5"
                title="Run query to preview output (Ctrl+Enter)"
              >
                <Play className="w-3 h-3 text-cyan-400" />
                <span>Run Test</span>
              </button>

              <button
                onClick={() => evaluateQueryExecution(true)}
                disabled={isEvaluating}
                className="px-4 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                title="Submit solution for formal interview scorecard verification (Ctrl+Shift+Enter)"
              >
                <Send className="w-3 h-3" />
                <span>Submit {activeQIndex === 0 ? 'Q1' : 'Q2'}</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-[300px] border-b border-white/8">
            <SqlCodeEditor
              value={candidateCodes[activeQIndex] || ''}
              onChange={(newCode) => setCandidateCodes((prev) => ({ ...prev, [activeQIndex]: newCode }))}
              onRun={() => evaluateQueryExecution(false)}
              onSubmit={() => evaluateQueryExecution(true)}
              dialect={dialects[activeQIndex]}
              schemas={currentQ.schemas}
              height="h-full"
            />
          </div>

          {/* Lower Output & Result Verification Console */}
          <div className="h-64 flex flex-col bg-[#090d18] overflow-hidden">
            <div className="px-4 py-2 border-b border-white/6 flex items-center justify-between text-xs bg-slate-900/60">
              <span className="font-bold text-slate-300">Live Execution Console & Verdict</span>
              {qResults[activeQIndex] && (
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  qResults[activeQIndex]?.status === 'ACCEPTED'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : qResults[activeQIndex]?.status === 'NEEDS_ADJUSTMENT'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}>
                  {qResults[activeQIndex]?.status === 'ACCEPTED' ? '✓ Accepted' : qResults[activeQIndex]?.status}
                </span>
              )}
            </div>

            <div className="flex-1 p-3 overflow-auto text-xs font-mono">
              {!qResults[activeQIndex] ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-1">
                  <Terminal className="w-6 h-6 text-slate-600" />
                  <p>Click &quot;Run Test&quot; or &quot;Submit&quot; to compile and evaluate candidate query in real time.</p>
                </div>
              ) : qResults[activeQIndex]?.status === 'SYNTAX_ERROR' ? (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900/50 text-rose-300">
                  <p className="font-bold mb-1">Execution / Syntax Error:</p>
                  <p>{qResults[activeQIndex]?.message}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Returned {qResults[activeQIndex]?.rowsReturned} row(s) in {qResults[activeQIndex]?.executionTimeMs} ms</span>
                    <span>{qResults[activeQIndex]?.message}</span>
                  </div>

                  {/* Render Table Results */}
                  {qResults[activeQIndex]?.outputRows && qResults[activeQIndex]!.outputRows.length > 0 && (
                    <div className="border border-white/6 rounded-lg overflow-x-auto max-h-40">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-800/80 text-slate-300 border-b border-white/10 sticky top-0">
                          <tr>
                            {qResults[activeQIndex]?.outputColumns.map((c, i) => (
                              <th key={i} className="px-2.5 py-1.5 font-bold">{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {qResults[activeQIndex]!.outputRows.slice(0, 15).map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-white/[0.04]">
                              {qResults[activeQIndex]?.outputColumns.map((c, cIdx) => (
                                <td key={cIdx} className="px-2.5 py-1 text-slate-200">
                                  {String(row[c] ?? '')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
