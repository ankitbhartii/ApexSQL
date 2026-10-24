/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Database,
  ShieldCheck,
  Award,
  Globe,
  Terminal,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApexLogo } from './ApexLogo';
import confetti from 'canvas-confetti';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
  onBack: () => void;
  onAuthSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'signin',
  onBack,
  onAuthSuccess
}) => {
  const {
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    loginAsGuest
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState('Data Analyst');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const roles = [
    { id: 'Data Analyst', label: 'Data Analyst', icon: '📊' },
    { id: 'Data Engineer', label: 'Data Engineer', icon: '🛠️' },
    { id: 'Software Engineer', label: 'SWE / Backend', icon: '💻' },
    { id: 'Database Admin', label: 'DB Admin', icon: '🗄️' },
  ];

  // Dynamic Password Strength Meter
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passStrength = calculatePasswordStrength(password);
  const strengthLabels = ['Too Weak', 'Fair', 'Good', 'Strong', 'Bulletproof'];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-cyan-400', 'bg-emerald-400', 'bg-emerald-400'];

  const triggerSuccessConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22d3ee', '#6366f1', '#10b981', '#ffffff']
    });
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      triggerSuccessConfetti();
      setSuccessMessage('Successfully authenticated with Google!');
      setTimeout(() => onAuthSuccess(), 450);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'signup') {
        if (!email.trim() || !password) {
          setErrorMessage('Please fill in email and password.');
          setLoading(false);
          return;
        }
        await registerWithEmail(email, password, displayName, selectedRole);
        triggerSuccessConfetti();
        setSuccessMessage('Account created! Welcome to ApexSQL.');
      } else {
        await loginWithEmail(email, password);
        triggerSuccessConfetti();
        setSuccessMessage('Signed in successfully!');
      }
      setTimeout(() => onAuthSuccess(), 450);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = () => {
    loginAsGuest(displayName.trim() || 'Candidate Demo', selectedRole);
    triggerSuccessConfetti();
    setTimeout(() => onAuthSuccess(), 350);
  };

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden relative flex flex-col justify-between">
      {/* ==================================================================== */}
      {/* 1. AMBIENT GLOW & GRID PATTERN BACKGROUND                           */}
      {/* ==================================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/20 to-transparent rounded-full blur-[140px] animate-pulse-subtle" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-gradient-to-bl from-purple-600/20 via-cyan-500/15 to-transparent rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[650px] h-[400px] bg-indigo-500/15 rounded-full blur-[160px]" />

        {/* Ambient Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* Top Navigation Strip */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex items-center justify-between">
        <ApexLogo size="md" showBadge={true} onClick={onBack} />

        <button
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-full apple-glass text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </header>

      {/* ==================================================================== */}
      {/* 2. MAIN SPLIT SCREEN                                                 */}
      {/* ==================================================================== */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Live Proof of Engineering (Hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-8 pr-4">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE SQL INTERVIEW PLAYGROUND</span>
            </div>

            <h1 className="apple-display-title text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight">
              One account for{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                11,162 FAANG
              </span>{' '}
              challenges.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Sync your solutions, benchmark query execution time in real time, and build your candidate readiness profile.
            </p>
          </div>

          {/* Live Simulated SQL Terminal Widget */}
          <div className="apple-card border border-white/12 rounded-2xl overflow-hidden shadow-2xl bg-black/60 backdrop-blur-2xl">
            <div className="px-4 py-2.5 bg-slate-950/80 border-b border-white/8 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-slate-400 ml-1">query_eval.sql</span>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                WASM Active
              </span>
            </div>

            <div className="p-4 font-mono text-xs text-slate-300 space-y-1.5 leading-relaxed selection:bg-cyan-500/30">
              <div className="text-cyan-400">
                <span className="text-purple-400">WITH</span> candidate_metrics <span className="text-purple-400">AS</span> (
              </div>
              <div className="pl-4 text-slate-300">
                <span className="text-indigo-300">SELECT</span> user_id, <span className="text-amber-300">DENSE_RANK()</span> <span className="text-purple-400">OVER</span> (
              </div>
              <div className="pl-8 text-slate-400">
                <span className="text-purple-400">PARTITION BY</span> domain <span className="text-purple-400">ORDER BY</span> speed_ms <span className="text-indigo-300">ASC</span>
              </div>
              <div className="pl-4 text-slate-300">
                ) <span className="text-purple-400">AS</span> percentile_rank
              </div>
              <div className="text-cyan-400">
                <span className="text-indigo-300">SELECT</span> * <span className="text-purple-400">FROM</span> candidate_metrics <span className="text-purple-400">WHERE</span> percentile_rank &lt;= 3;
              </div>

              <div className="mt-3 pt-3 border-t border-white/8 flex items-center justify-between text-[11px] text-emerald-300">
                <span>✓ Output Validated: 54/54 Test Cases Passed</span>
                <span className="text-cyan-400 font-bold">1.4ms Execution</span>
              </div>
            </div>
          </div>

          {/* Proof Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { title: 'LeetCode & HackerRank', desc: 'Authentic datasets' },
              { title: '4 Dialect Compilers', desc: 'Postgres to BigQuery' },
              { title: 'Instant Cloud Sync', desc: 'Never lose progress' },
            ].map((b, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                <div className="text-xs font-bold text-white">{b.title}</div>
                <div className="text-[10px] text-slate-400">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: The Animated Auth Form Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.1 }}
            className="apple-card apple-glass border border-white/14 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-2xl"
          >
            {/* Ambient inner card corner glow */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-bl from-cyan-500/30 to-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Segmented Pill Mode Switcher */}
            <div className="relative p-1 apple-pill-bar flex items-center mb-6 w-full">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className={`relative z-10 flex-1 py-2 text-xs font-bold transition-colors duration-150 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                  mode === 'signin' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sign In</span>
                {mode === 'signin' && (
                  <motion.div
                    layoutId="authCardTabPill"
                    className="absolute inset-0 rounded-full apple-pill-active -z-10"
                    transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className={`relative z-10 flex-1 py-2 text-xs font-bold transition-colors duration-150 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                  mode === 'signup' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Create Account</span>
                {mode === 'signup' && (
                  <motion.div
                    layoutId="authCardTabPill"
                    className="absolute inset-0 rounded-full apple-pill-active -z-10"
                    transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
                  />
                )}
              </button>
            </div>

            {/* Error / Success Banners */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="leading-snug">{errorMessage}</span>
                </motion.div>
              )}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="leading-snug">{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google Social Login */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-11 px-4 rounded-xl apple-card border border-white/12 hover:border-cyan-400/40 flex items-center justify-center gap-2.5 text-xs font-bold text-white transition-all cursor-pointer shadow-sm select-none"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </motion.button>

              {/* Instant Guest Mode */}
              <button
                type="button"
                onClick={handleGuestSignIn}
                className="w-full text-center text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer transition-colors py-1"
              >
                ⚡ Or try Instant Guest Access (No password needed)
              </button>
            </div>

            {/* Radiant Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative z-10 px-3 bg-[#0c1222] text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Or with Email
              </span>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name / Candidate Handle
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Alex Chen"
                      className="w-full h-10 bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-3 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@company.com"
                    className="w-full h-10 bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-3 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-10 bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-10 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter (Shown on signup) */}
                {mode === 'signup' && password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1.5 h-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            passStrength >= step
                              ? strengthColors[passStrength]
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-[10px] text-right text-slate-400 font-mono">
                      Strength: <strong className="text-white">{strengthLabels[passStrength]}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Role Selection on Signup */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Data Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((r) => {
                      const isSelected = selectedRole === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setSelectedRole(r.id)}
                          className={`p-2 rounded-xl text-left text-xs transition border flex items-center gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-xs'
                              : 'bg-slate-950/60 border-white/8 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span>{r.icon}</span>
                          <span className="truncate">{r.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-2 apple-btn-primary rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-spin text-sm">↻</span>
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 py-4 text-center text-xs text-slate-500">
        <span>ApexSQL 2.0 • 256-bit AES Firestore Cloud Sync</span>
      </footer>
    </div>
  );
};
