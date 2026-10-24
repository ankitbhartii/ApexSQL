/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface ApexLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ApexLogo: React.FC<ApexLogoProps> = ({
  size = 'md',
  showText = true,
  showBadge = true,
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: { icon: 26, text: 'text-sm', badge: 'text-[9px]' },
    md: { icon: 34, text: 'text-base', badge: 'text-[10px]' },
    lg: { icon: 44, text: 'text-xl', badge: 'text-[11px]' },
    xl: { icon: 56, text: 'text-2xl', badge: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
    >
      {/* Animated Glowing Geometric Icon */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Ambient radial blur glow behind icon */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/40 via-indigo-600/30 to-purple-500/40 blur-md group-hover:blur-lg transition-all duration-300 opacity-80" />

        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-[0_2px_10px_rgba(34,211,238,0.35)] transition-transform duration-300 group-hover:rotate-1"
        >
          <defs>
            <linearGradient id="apexGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            <linearGradient id="apexGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>

            <linearGradient id="apexFacetLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </linearGradient>

            <filter id="apexGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Squircle container with Apple rounded curve */}
          <rect
            x="2"
            y="2"
            width="44"
            height="44"
            rx="12"
            fill="#080e1e"
            stroke="url(#apexGrad1)"
            strokeWidth="1.5"
            className="group-hover:stroke-cyan-300 transition-colors duration-300"
          />

          {/* Database Layer 1 (Bottom foundation cylinder) */}
          <path
            d="M12 31C12 28.5 17.37 26.5 24 26.5C30.63 26.5 36 28.5 36 31V34C36 36.5 30.63 38.5 24 38.5C17.37 38.5 12 36.5 12 34V31Z"
            fill="url(#apexGrad2)"
            opacity="0.35"
          />
          <ellipse
            cx="24"
            cy="31"
            rx="12"
            ry="4"
            stroke="url(#apexGrad2)"
            strokeWidth="1.5"
            fill="#0b1329"
          />

          {/* Database Layer 2 (Middle relational disk) */}
          <path
            d="M12 22C12 19.5 17.37 17.5 24 17.5C30.63 17.5 36 19.5 36 22V25C36 27.5 30.63 29.5 24 29.5C17.37 29.5 12 27.5 12 25V22Z"
            fill="url(#apexGrad1)"
            opacity="0.5"
          />
          <ellipse
            cx="24"
            cy="22"
            rx="12"
            ry="4"
            stroke="url(#apexGrad1)"
            strokeWidth="1.5"
            fill="#0d1733"
          />

          {/* Apex Geometric Peak: Rising Diamond Query Arrow */}
          <path
            d="M24 8L31 16L24 21L17 16L24 8Z"
            fill="url(#apexGrad2)"
            stroke="#ffffff"
            strokeWidth="1.2"
            filter="url(#apexGlowFilter)"
          />

          {/* Facet Top Sheen Highlight */}
          <path
            d="M24 8L31 16L24 17L17 16L24 8Z"
            fill="url(#apexFacetLight)"
          />

          {/* Central Apex Energy Core */}
          <circle
            cx="24"
            cy="15"
            r="1.8"
            fill="#ffffff"
            className="animate-ping"
            style={{ animationDuration: '3s' }}
          />
        </svg>
      </div>

      {/* Brand Typography & Badge */}
      {showText && (
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-baseline tracking-tight">
            <span className={`font-black text-white ${currentSize.text} tracking-tight`}>
              Apex
            </span>
            <span className={`font-black bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent ${currentSize.text} tracking-tight ml-0.5`}>
              SQL
            </span>
          </div>

          {showBadge && (
            <span className={`px-1.5 py-0.2 rounded-full font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 ${currentSize.badge} tracking-wider uppercase ml-0.5`}>
              v2.0
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};
