/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ApexLogo } from './ApexLogo';
import { UserProfileMenu } from './UserProfileMenu';
import { useAuth } from '../context/AuthContext';

export type AppView = 'landing' | 'sandbox' | 'directory' | 'roadmaps' | 'studio' | 'profile' | 'mock-interview' | 'auth';

interface GlobalNavbarProps {
  onLogout?: () => void;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  solvedCount: number;
  masteredCount: number;
  onSyncAll: () => Promise<void>;
  onOpenLiveContest?: () => void;
  onOpenPlatforms?: () => void;
}

export const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  currentView,
  onNavigate,
  solvedCount,
  masteredCount,
  onSyncAll,
  onOpenLiveContest,
  onOpenPlatforms,
  onLogout
}) => {
  const { currentUser } = useAuth();
  const isLanding = currentView === 'landing';

  // Navigation tabs shown inside the application once redirected over to next page
  const appTabs: { id: AppView; label: string; icon: string; count?: string }[] = [
    { id: 'sandbox', label: 'Sandbox', icon: '⚡' },
    { id: 'directory', label: 'Questions', icon: '📚', count: '11,162' },
    { id: 'mock-interview', label: 'FAANG Mock', icon: '⏱️', count: '45m' },
    { id: 'roadmaps', label: 'Roadmaps', icon: '🗺️' },
    { id: 'studio', label: 'DB Studio', icon: '🗄️' },
    { id: 'profile', label: 'Profile', icon: '📊' },
  ];

  return (
    <header className="sticky top-0 z-40 h-14 apple-glass border-b border-white/10 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 select-none">
      {/* Left: Brand */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">
        <ApexLogo
          size="md"
          showBadge={true}
          onClick={() => onNavigate('landing')}
        />

        {/* Apple Segmented Pill Navigation - ONLY visible once user gets redirected over to the next page! */}
        {!isLanding && (
          <nav className="relative flex items-center p-1 apple-pill-bar shrink-0 overflow-x-auto max-w-[calc(100vw-180px)] sm:max-w-none">
            {appTabs.map((tab) => {
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigate(tab.id)}
                  className={`relative z-10 h-7.5 px-2.5 sm:px-3 rounded-full text-xs font-bold transition-colors duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count && (
                    <span
                      className={`hidden xl:inline-block px-1.5 py-0.2 rounded-full text-[10px] font-mono tabular-nums transition-colors ${
                        isActive ? 'bg-cyan-400/30 text-cyan-200 font-bold' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeGlobalNavPill"
                      className="absolute inset-0 rounded-full apple-pill-active -z-10"
                      transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Right: Solved Badge & User Profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* On landing page: if logged in, offer 1-click jump to Sandbox */}
        {isLanding && currentUser && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate('sandbox')}
            className="apple-btn-primary h-8.5 px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm select-none"
          >
            <span>Open Sandbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        )}

        {/* Solved Pill - only visible inside app */}
        {!isLanding && (
          <span className="h-8 text-xs font-semibold text-emerald-300 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 px-2.5 rounded-full whitespace-nowrap shrink-0 shadow-xs">
            <span className="text-emerald-400">✓</span> {solvedCount} <span className="hidden sm:inline">Solved</span>
          </span>
        )}

        {/* Live Contest Button - only visible inside app on ultra-wide */}
        {!isLanding && onOpenLiveContest && (
          <button
            onClick={onOpenLiveContest}
            className="hidden 2xl:flex items-center gap-1.5 px-2.5 h-8 rounded-full text-xs font-semibold bg-blue-950/60 hover:bg-blue-900/80 text-blue-200 border border-blue-500/30 transition cursor-pointer shadow-xs whitespace-nowrap active:scale-95"
            title="Search real-time SQL challenges with Google Search Grounding"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span>Live Contest</span>
          </button>
        )}

        {/* User Profile Popover (Sign In / Sign Up buttons or User avatar) */}
        <UserProfileMenu
          solvedCount={solvedCount}
          masteredCount={masteredCount}
          onSyncAll={onSyncAll}
          onOpenProfile={() => onNavigate('profile')}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
};
