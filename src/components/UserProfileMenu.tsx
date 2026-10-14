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
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserProfileMenuProps {
  solvedCount: number;
  masteredCount: number;
  onSyncAll: () => Promise<void>;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  solvedCount,
  masteredCount,
  onSyncAll
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
      <div className="flex items-center gap-2">
        <button
          onClick={() => openAuthModal('signin')}
          className="relative group flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-cyan-900/30 border border-cyan-400/40 transition active:scale-95 cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-cyan-200" />
          <span>Sign In / Sign Up</span>
          <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/30 text-cyan-200">
            Cloud
          </span>
        </button>
      </div>
    );
  }

  const displayName = userProfile?.displayName || currentUser.displayName || currentUser.email?.split('@')[0] || 'Candidate';
  const email = currentUser.email || 'Cloud User';
  const photo = currentUser.photoURL;

  const isGuest = currentUser.uid.startsWith('guest-');

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 hover:border-cyan-500/50 transition cursor-pointer text-left"
        aria-label="User Profile Menu"
      >
        {photo ? (
          <img
            src={photo}
            alt={displayName}
            className="w-6 h-6 rounded-full border border-cyan-400/60 object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="hidden md:flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">
              {displayName}
            </span>
            {/* Live Database status beacon */}
            <span
              className={`w-1.5 h-1.5 rounded-full ${
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
          <span className="text-[10px] text-cyan-400 font-mono leading-none">
            {isGuest ? 'Guest User' : (userProfile?.role || 'SQL Dev')}
          </span>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 py-3 px-3 z-50 text-slate-200"
          >
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
