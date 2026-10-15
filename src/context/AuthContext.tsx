/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  syncUserProfile,
  saveUserProgressCloud,
  loadUserProgressCloud,
  saveUserQueryCloud,
  loadUserQueriesCloud
} from '../firebase';

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role?: string;
  totalSolved?: number;
  masteredCount?: number;
  streakDays?: number;
  xpPoints?: number;
  createdAt?: string;
}

export type SyncStatus = 'idle' | 'saving' | 'synced' | 'error' | 'offline';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfileData | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  syncStatus: SyncStatus;
  lastSyncedAt: Date | null;
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, displayName: string, role?: string) => Promise<void>;
  loginAsGuest: (displayName?: string, role?: string) => void;
  logout: () => Promise<void>;
  syncProgressToCloud: (progress: {
    solvedProblems: string[];
    masteredProblems: string[];
    reviewProblems: string[];
    notesMap?: Record<string, string>;
  }) => Promise<void>;
  syncQueryToCloud: (problemId: string, sqlCode: string, dialect: string, isSolved?: boolean) => Promise<void>;
  fetchCloudProgress: () => Promise<{
    solvedProblems: string[];
    masteredProblems: string[];
    reviewProblems: string[];
    notesMap?: Record<string, string>;
  } | null>;
  fetchCloudQueries: () => Promise<Record<string, string> | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await syncUserProfile(user);
          setUserProfile(
            profile || {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'SQL Candidate',
              photoURL: user.photoURL || undefined,
              role: 'Data Engineer / Analyst',
              streakDays: 1,
              xpPoints: 100,
            }
          );
          setSyncStatus('synced');
          setLastSyncedAt(new Date());
        } catch (err) {
          console.warn('Could not sync user profile to Firestore:', err);
          setSyncStatus('offline');
        }
      } else {
        setUserProfile(null);
        setSyncStatus('idle');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = useCallback((mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile(result.user);
        setIsAuthModalOpen(false);
        setSyncStatus('synced');
        setLastSyncedAt(new Date());
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithEmail = useCallback(async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        await syncUserProfile(result.user);
        setIsAuthModalOpen(false);
        setSyncStatus('synced');
        setLastSyncedAt(new Date());
      }
    } catch (err: any) {
      console.error('Email sign in failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerWithEmail = useCallback(async (email: string, pass: string, displayName: string, role = 'SQL Developer') => {
    setIsLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        await updateProfile(result.user, { displayName });
        await syncUserProfile(result.user, { role });
        setUserProfile({
          uid: result.user.uid,
          email: result.user.email || email,
          displayName,
          role,
          streakDays: 1,
          xpPoints: 100
        });
        setIsAuthModalOpen(false);
        setSyncStatus('synced');
        setLastSyncedAt(new Date());
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAsGuest = useCallback((displayName = 'Candidate Guest', role = 'Data Analyst') => {
    const guestUser = {
      uid: 'guest-' + Math.random().toString(36).substring(2, 9),
      email: 'guest@candidate.local',
      displayName,
      photoURL: '',
    } as unknown as User;

    setCurrentUser(guestUser);
    setUserProfile({
      uid: guestUser.uid,
      email: guestUser.email || '',
      displayName,
      role,
      streakDays: 1,
      xpPoints: 50
    });
    setSyncStatus('idle');
    setIsAuthModalOpen(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setSyncStatus('idle');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }, []);

  const syncProgressToCloud = useCallback(async (progress: {
    solvedProblems: string[];
    masteredProblems: string[];
    reviewProblems: string[];
    notesMap?: Record<string, string>;
  }) => {
    if (!currentUser) return;
    setSyncStatus('saving');
    try {
      await saveUserProgressCloud(currentUser.uid, progress);
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('Failed to sync progress to cloud:', err);
      setSyncStatus('error');
    }
  }, [currentUser]);

  const syncQueryToCloud = useCallback(async (problemId: string, sqlCode: string, dialect: string, isSolved = false) => {
    if (!currentUser) return;
    setSyncStatus('saving');
    try {
      await saveUserQueryCloud(currentUser.uid, problemId, sqlCode, dialect, isSolved);
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('Failed to save query to cloud:', err);
      setSyncStatus('error');
    }
  }, [currentUser]);

  const fetchCloudProgress = useCallback(async () => {
    if (!currentUser) return null;
    try {
      return await loadUserProgressCloud(currentUser.uid);
    } catch (err) {
      console.warn('Failed to fetch cloud progress:', err);
      return null;
    }
  }, [currentUser]);

  const fetchCloudQueries = useCallback(async () => {
    if (!currentUser) return null;
    try {
      return await loadUserQueriesCloud(currentUser.uid);
    } catch (err) {
      console.warn('Failed to fetch cloud queries:', err);
      return null;
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        syncStatus,
        lastSyncedAt,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        loginAsGuest,
        logout,
        syncProgressToCloud,
        syncQueryToCloud,
        fetchCloudProgress,
        fetchCloudQueries
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
