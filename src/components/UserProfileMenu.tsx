/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  LogOut,
  Database,
  CloudCheck,
  CloudOff,
  RefreshCw,
  Sparkles,
  Award,
  Flame,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserProfileMenuProps {
  solvedCount: number;
  masteredCount: number;
  onSyncAll: () => Promise<void>;
  onOpenProfile?: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  solvedCount,
  masteredCount,
  onSyncAll,
  onOpenProfile
}) => {
  const {
    currentUser,
    userProfile,
    openAuthModal,
    logout,
    syncStatus,
    lastSyncedAt
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await onSyncAll();
    } finally {
      setTimeout(() => setIsSyncing(false), 600);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center gap-1.5 shrink-0" ref={menuRef}>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => openAuthModal('signin')}
          className="h-8.5 px-3 rounded-full text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-400/40 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm"
          title="Sign in to sync your SQL progress"
        >
          <LogIn className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sign In</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => openAuthModal('signup')}
          className="relative group overflow-hidden h-8.5 px-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 shadow-sm border border-indigo-400/30 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap hidden sm:inline-flex"
          title="Create a free candidate cloud profile"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          <span>Sign Up</span>
        </motion.button>
      </div>
    );
  }

  const displayName = userProfile?.displayName || currentUser.displayName || currentUser.email?.split('@')[0] || 'Candidate';
  const email = currentUser.email || 'Cloud User';
  const photo = currentUser.photoURL;

  const isGuest = currentUser.uid.startsWith('guest-');

  return (
    <div className="relative shrink-0" ref={menuRef}>
      {/* Trigger Button - Apple Music Frosted Pill */}
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-8.5 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 rounded-full bg-slate-900/85 hover:bg-slate-800/90 border border-white/10 hover:border-cyan-400/50 transition-all cursor-pointer text-left shrink-0 shadow-sm select-none"
        aria-label="User Profile Menu"
      >
        {photo ? (
          <img
            src={photo}
            alt={displayName}
            className="w-5.5 h-5.5 rounded-full border border-cyan-400/70 object-cover shrink-0"
          />
        ) : (
          <div className="w-5.5 h-5.5 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shadow-xs shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex items-center gap-1 text-left min-w-0">
          <span className="text-xs font-semibold text-slate-200 max-w-[55px] sm:max-w-[70px] md:max-w-[85px] xl:max-w-[110px] truncate">
            {displayName}
          </span>
          {/* Live Database status beacon */}
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              isGuest
                ? 'bg-amber-400'
                : syncStatus === 'synced'
                ? 'bg-emerald-400 animate-pulse'
                : syncStatus === 'saving'
                ? 'bg-amber-400 animate-spin'
                : 'bg-slate-400'
            }`}
            title={isGuest ? 'Guest Mode (SafeStorage)' : syncStatus === 'synced' ? 'Database Connected & Synced' : syncStatus}
          />
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Dropdown Menu - Glassmorphic, anchored safely to viewport */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96, transition: { duration: 0.16, ease: [0.32, 0.72, 0, 1] } }}
            transition={{ type: 'spring', duration: 0.28, bounce: 0.08 }}
            style={{ transformOrigin: 'top right' }}
            className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] apple-glass border border-white/12 rounded-2xl shadow-2xl py-3 px-3 z-50 text-slate-200">
            {/* User Profile Card */}
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 mb-2.5">
              <div className="flex items-center gap-3">
                {photo ? (
                  <img
                    src={photo}
                    alt={displayName}
                    className="w-10 h-10 rounded-full border border-cyan-400 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-cyan-500/20">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="overflow-hidden">
                  <div className="font-bold text-xs text-slate-100 truncate flex items-center gap-1.5">
                    {displayName}
                    <span className={`px-1.5 py-0.2 text-[9px] rounded font-normal ${
                      isGuest ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {isGuest ? 'Guest' : 'Verified'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{email}</div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-slate-700/60 text-center">
                <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-700/40">
                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
                    <CheckCircle className="w-3 h-3 text-emerald-400" /> Solved
                  </div>
                  <div className="text-xs font-bold text-emerald-300 font-mono mt-0.5">
                    {solvedCount}
                  </div>
                </div>
                <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-700/40">
                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
                    <Award className="w-3 h-3 text-amber-400" /> Mastered
                  </div>
                  <div className="text-xs font-bold text-amber-300 font-mono mt-0.5">
                    {masteredCount}
                  </div>
                </div>
                <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-700/40">
                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
                    <Flame className="w-3 h-3 text-rose-400" /> Streak
                  </div>
                  <div className="text-xs font-bold text-rose-300 font-mono mt-0.5">
                    {userProfile?.streakDays || 1}d
                  </div>
                </div>
              </div>
            </div>

            {/* Cloud Sync Status info */}
            <div className="px-2 py-1.5 flex items-center justify-between text-xs text-slate-400 mb-2 bg-slate-800/40 rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px]">{isGuest ? 'Storage Engine:' : 'Firestore Cloud DB:'}</span>
              </div>
              <span className={`text-[10px] font-mono font-medium flex items-center gap-1 ${
                isGuest ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isGuest ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
                {isGuest ? 'Local SafeStorage' : 'Connected'}
              </span>
            </div>

            {isGuest && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  openAuthModal('signin');
                }}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 rounded-xl transition border border-cyan-500/40 mb-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Link Cloud Account</span>
              </button>
            )}

            {/* Profile & Skill Analytics Dashboard Action */}
            <button
              onClick={() => {
                setIsOpen(false);
                if (onOpenProfile) {
                  onOpenProfile();
                } else {
                  window.location.hash = '#/profile';
                }
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-xl transition border border-indigo-400/40 mb-1.5 cursor-pointer shadow-md shadow-indigo-500/20 active:scale-98"
            >
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-cyan-200" />
                <span>Profile & Skill Analytics</span>
              </div>
              <span className="text-[10px] text-cyan-100 font-mono">View →</span>
            </button>

            {/* Sync Now Action */}
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-xl transition border border-slate-700/50 mb-1.5 cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <RefreshCw
                  className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`}
                />
                <span>{isSyncing ? 'Syncing to Firestore...' : 'Sync All Progress Now'}</span>
              </div>
              {lastSyncedAt && !isSyncing && (
                <span className="text-[10px] text-slate-500 font-mono">
                  {lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </button>

            {/* Logout Action */}
            <button
              onClick={async () => {
                setIsOpen(false);
                await logout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Account</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
