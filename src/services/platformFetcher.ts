/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SqlProblem } from '../types';
import { livePipeline } from './liveQuestionPipeline';
import {
  AUTHENTIC_PLATFORM_PROBLEMS,
  SUPPORTED_PLATFORMS,
  PlatformInfo,
} from './platformQuestionsData';

export interface FetchPlatformOptions {
  platform: 'leetcode' | 'hackerrank' | 'datadriven' | 'stratascratch' | 'all';
  limit?: number | 'all';
  difficulty?: 'All' | 'Easy' | 'Medium' | 'Hard';
}

export interface FetchPlatformResult {
  success: boolean;
  platform: string;
  count: number;
  sourceNotice: string;
  problems: SqlProblem[];
  isFallback?: boolean;
}

/**
 * Fetches real SQL questions from platforms (LeetCode, HackerRank, DataDriven, StrataScratch)
 * via the full-stack server endpoint or client-side verified catalog fallback.
 */
export async function fetchPlatformQuestions(
  options: FetchPlatformOptions
): Promise<FetchPlatformResult> {
  const { platform = 'all', limit = 'all', difficulty = 'All' } = options;

  try {
    const response = await fetch('/api/fetch-platform-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ platform, limit, difficulty }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.success && Array.isArray(data.problems)) {
        return {
          success: true,
          platform: data.platform || platform,
          count: data.count || data.problems.length,
          sourceNotice: data.sourceNotice || 'Fetched from live platform API endpoint',
          problems: data.problems,
          isFallback: false,
        };
      }
    }
  } catch (err) {
    console.warn('[PlatformFetcher] Network call to /api/fetch-platform-questions fell back to verified catalog:', err);
  }

  // Client-side deterministic fallback
  let filtered = AUTHENTIC_PLATFORM_PROBLEMS;
  if (platform !== 'all') {
    if (platform === 'leetcode') {
      filtered = filtered.filter((p) => p.platform === 'LeetCode');
    } else if (platform === 'hackerrank') {
      filtered = filtered.filter((p) => p.platform === 'HackerRank');
    } else if (platform === 'datadriven') {
      filtered = filtered.filter((p) => p.platform === 'DataDriven');
    } else if (platform === 'stratascratch') {
      filtered = filtered.filter((p) => p.platform === 'FAANG+ Mock');
    }
  }

  if (difficulty !== 'All') {
    filtered = filtered.filter((p) => p.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  const isAll = limit === 'all' || limit === 0 || limit === '0';
  const sliced = isAll ? filtered : filtered.slice(0, Math.max(Number(limit) || 5, 1));

  return {
    success: true,
    platform,
    count: sliced.length,
    sourceNotice: 'Loaded from local verified authentic problem catalog',
    problems: sliced,
    isFallback: true,
  };
}

/**
 * Ingests fetched platform problems directly into the active practice stream
 */
export function ingestPlatformProblemsIntoStream(
  problems: SqlProblem[],
  sourceLabel = 'Online Platform'
): number {
  return livePipeline.ingestExternalProblems(problems, sourceLabel);
}

export { SUPPORTED_PLATFORMS };
export type { PlatformInfo };
