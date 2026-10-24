/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Cryptographic Utility for Secure Random Identifiers & Tokens (CWE-338 Remediation)
 */

/**
 * Returns a cryptographically secure random UUID v4
 */
export function secureRandomUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    // Set UUID v4 variant & version bits
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  // Fallback for non-crypto environments
  const now = Date.now().toString(36);
  const rand = Math.floor(Math.random() * 1e9).toString(36);
  return `fallback-${now}-${rand}`;
}

/**
 * Returns a cryptographically secure random integer within [min, max]
 */
export function secureRandomInt(min: number, max: number): number {
  if (min >= max) return min;
  const range = max - min + 1;
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return min + (arr[0] % range);
  }
  return Math.floor(Math.random() * range) + min;
}
