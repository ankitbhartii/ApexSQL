/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Database,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  Zap,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  Globe,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { activeFirebaseConfig } from '../firebase';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    loginAsGuest
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState('Data Analyst');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Vercel / Domain authorization diagnosis state
  const [domainError, setDomainError] = useState<{ domain: string; projectId: string } | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Sync mode state when prop changes
  React.useEffect(() => {
    setMode(authModalMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setDomainError(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const roles = [
    { id: 'Data Analyst', label: 'Data Analyst', icon: '📊' },
    { id: 'Software Engineer', label: 'Software Engineer', icon: '💻' },
    { id: 'Analytics Engineer', label: 'Analytics Engineer', icon: '⚡' },
    { id: 'Database Admin', label: 'DB Administrator', icon: '🗄️' },
  ];

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passStrength = calculatePasswordStrength(password);

  const handleCopyDomain = (domainToCopy: string) => {
    navigator.clipboard.writeText(domainToCopy);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    setDomainError(null);
    try {
      await loginWithGoogle();
      setSuccessMessage('Successfully signed in with Google!');
      setTimeout(() => {
        closeAuthModal();
      }, 500);
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      const errCode = err?.code || '';
      const errMsg = err?.message || '';

      if (
        errCode === 'auth/unauthorized-domain' ||
        errMsg.toLowerCase().includes('unauthorized-domain') ||
        errMsg.toLowerCase().includes('authorized domain')
      ) {
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your-app.vercel.app';
        setDomainError({
          domain: currentHost,
          projectId: activeFirebaseConfig.projectId
        });
        setErrorMessage(
          `Domain "${currentHost}" is not authorized in your Firebase project. Follow the quick steps below to authorize it.`
        );
      } else if (errCode === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in popup was closed before completing. Please try again.');
      } else if (errCode === 'auth/popup-blocked') {
        setErrorMessage('Popup blocked by browser. Please enable popups for this site to sign in.');
      } else {
        setErrorMessage(errMsg || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setDomainError(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!displayName.trim()) {
          setErrorMessage('Please enter your full name or handle.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('Password should be at least 6 characters.');
          setLoading(false);
          return;
        }
        await registerWithEmail(email.trim(), password, displayName.trim(), selectedRole);
        setSuccessMessage('Account created and cloud profile initialized!');
      } else {
        await loginWithEmail(email.trim(), password);
        setSuccessMessage('Welcome back! Loading your saved progress...');
      }

      setTimeout(() => {
        closeAuthModal();
      }, 600);
    } catch (err: any) {
      console.error(err);
      const errCode = err?.code || '';
      const errMsg = err?.message || '';

      if (
        errCode === 'auth/unauthorized-domain' ||
        errMsg.toLowerCase().includes('unauthorized-domain') ||
        errMsg.toLowerCase().includes('authorized domain')
      ) {
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your-app.vercel.app';
        setDomainError({
          domain: currentHost,
          projectId: activeFirebaseConfig.projectId
        });
        setErrorMessage(
          `Domain "${currentHost}" is not authorized in your Firebase project. Follow the quick steps below to authorize it.`
        );
      } else if (errCode === 'auth/operation-not-allowed') {
        setErrorMessage(
          'Email/Password provider is disabled in Firebase Console. Enable "Email/Password" under Authentication > Sign-in method, or use "Continue with Google" or Guest Mode.'
        );
      } else if (errCode === 'auth/email-already-in-use') {
        setErrorMessage('An account with this email already exists. Try signing in instead.');
      } else if (
        errCode === 'auth/user-not-found' ||
        errCode === 'auth/wrong-password' ||
        errCode === 'auth/invalid-credential'
      ) {
        setErrorMessage('Invalid email or password. Please verify and try again.');
      } else {
        setErrorMessage(errMsg || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = () => {
    loginAsGuest(displayName.trim() || 'Candidate Demo', selectedRole);
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeAuthModal}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-cyan-950/40 overflow-hidden z-10 flex flex-col my-auto"
      >
        {/* Animated Background Highlights */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Header Bar */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold text-lg">
              <Database className="w-5 h-5 text-cyan-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100 tracking-tight">
                  {mode === 'signup' ? 'Create Your SQL Account' : 'Welcome to Ultimate SQL'}
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Cloud Sync
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {mode === 'signup'
                  ? 'Store your solutions, stats, and track mastery in Firestore'
                  : 'Sign in to access your saved queries, notes & stats'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle (Sign In / Sign Up) */}
        <div className="px-6 pt-4 pb-1">
          <div className="grid grid-cols-2 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 relative">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
                setDomainError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all relative z-10 flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
                setDomainError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all relative z-10 flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Create Account
            </button>
            {/* Sliding Tab Highlight */}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-slate-900 border border-cyan-500/30 shadow-md ${
                mode === 'signin' ? 'left-1' : 'left-[calc(50%+2px)]'
              }`}
            />
          </div>
        </div>

        {/* Form Body */}
        <div className="px-6 py-4 flex-1 overflow-y-auto max-h-[75vh]">
          {/* Domain Authorization Diagnostic Card (Triggers on unauthorized-domain error on Vercel) */}
          <AnimatePresence>
            {domainError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex flex-col gap-3 shadow-lg shadow-amber-950/20"
              >
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Vercel Domain Authorization Required in Firebase</span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Firebase Authentication prevents OAuth on domains that aren't whitelisted. To fix this for your Vercel deployment:
                </p>

                {/* Domain & Copy Box */}
                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-950 border border-amber-500/30 font-mono text-[11px] text-amber-300">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <Globe className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="truncate">{domainError.domain}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyDomain(domainError.domain)}
                    className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] font-sans font-medium flex items-center gap-1 transition flex-shrink-0"
                  >
                    {copiedDomain ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedDomain ? 'Copied!' : 'Copy Domain'}
                  </button>
                </div>

                {/* 3-Step Guide */}
                <div className="space-y-1.5 text-[11px] text-slate-300 pt-1 border-t border-amber-500/20">
                  <p className="font-semibold text-amber-300">Quick 30-Second Fix:</p>
                  <ol className="list-decimal list-inside space-y-1 pl-0.5 text-slate-300">
                    <li>
                      Open{' '}
                      <a
                        href={`https://console.firebase.google.com/project/${domainError.projectId}/authentication/settings`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 underline font-medium hover:text-cyan-300 inline-flex items-center gap-0.5"
                      >
                        Firebase Auth Settings <ExternalLink className="w-3 h-3 inline" />
                      </a>
                    </li>
                    <li>Scroll down to the <strong>Authorized domains</strong> section</li>
                    <li>
                      Click <strong>Add domain</strong>, paste{' '}
                      <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded font-mono">
                        {domainError.domain}
                      </code>
                      , and click <strong>Save</strong>
                    </li>
                  </ol>
                </div>

                {/* Immediate Demo Bypass */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-amber-500/20">
                  <span className="text-slate-400 text-[10px]">Testing right now?</span>
                  <button
                    type="button"
                    onClick={handleGuestSignIn}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 text-xs font-medium transition flex items-center gap-1.5 border border-cyan-500/40"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-cyan-300" />
                    Continue as Guest / Demo
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Sign In Button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-100 rounded-xl border border-slate-700/90 font-medium text-xs shadow-sm hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition group disabled:opacity-50"
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
              <span>{mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono border border-emerald-500/20 ml-auto">
                Instant
              </span>
            </button>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-slate-800" />
            <span className="px-3 text-[11px] font-mono uppercase tracking-wider text-slate-500">
              or with email & database
            </span>
            <div className="flex-1 border-t border-slate-800" />
          </div>

          {/* Feedback Alerts (General error if not domainError) */}
          <AnimatePresence>
            {errorMessage && !domainError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p>{errorMessage}</p>
                </div>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5"
              >
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <p>{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Display Name (Only on Signup) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Full Name / Candidate Handle
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Chen"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>
              </div>
            )}

            {/* Role Selection (Only on Signup) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                  Target Interview Track
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`p-2 rounded-xl border text-left text-xs transition flex items-center gap-2 ${
                        selectedRole === r.id
                          ? 'border-cyan-500/80 bg-cyan-500/15 text-cyan-200 font-semibold'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-sm">{r.icon}</span>
                      <span className="truncate">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Work or Personal Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@company.com"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-300">Password</label>
                {mode === 'signin' && (
                  <span className="text-[10px] text-slate-500 hover:text-cyan-400 cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-9 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength indicator for signup */}
              {mode === 'signup' && password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          passStrength >= lvl
                            ? passStrength >= 4
                              ? 'bg-emerald-400'
                              : passStrength >= 2
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                            : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {passStrength >= 4
                      ? 'Strong password'
                      : passStrength >= 2
                      ? 'Moderate strength'
                      : 'Needs 6+ characters with mixed cases or symbols'}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Create Account & Sync Database' : 'Sign In to Workspace'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Guest / Demo Mode Quick Access */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Testing or exploring?</span>
            <button
              type="button"
              onClick={handleGuestSignIn}
              className="text-cyan-400 hover:text-cyan-300 font-medium text-[11px] flex items-center gap-1 hover:underline transition"
            >
              <Zap className="w-3 h-3" />
              Continue as Guest (Local Storage)
            </button>
          </div>

          {/* Cloud Features Info footer */}
          <div className="mt-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Enterprise Cloud Sync:</span> All solved questions, SQL draft code, candidate notes, and execution diff benchmarks are automatically synced to your isolated Firestore account.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
