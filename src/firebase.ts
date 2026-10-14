/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  getDocFromServer
} from 'firebase/firestore';
import defaultFirebaseConfig from '../firebase-applet-config.json';

// Support Vercel / custom environment variables with fallback to config file
export const activeFirebaseConfig = {
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || defaultFirebaseConfig.projectId,
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || defaultFirebaseConfig.appId,
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || defaultFirebaseConfig.apiKey,
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || defaultFirebaseConfig.authDomain,
  firestoreDatabaseId: (import.meta.env.VITE_FIREBASE_DATABASE_ID as string) || defaultFirebaseConfig.firestoreDatabaseId,
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || defaultFirebaseConfig.storageBucket,
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || defaultFirebaseConfig.messagingSenderId,
};

// Initialize Firebase App
export const app = initializeApp(activeFirebaseConfig);

// Initialize Cloud Firestore with dedicated databaseId if provided and not default
export const db = (activeFirebaseConfig.firestoreDatabaseId && activeFirebaseConfig.firestoreDatabaseId !== '(default)')
  ? getFirestore(app, activeFirebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Operation Types for error diagnosis
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test initial connection to Firestore
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline or starting up.");
    }
    return false;
  }
}
// Run non-blocking test connection
testConnection().catch(() => {});

// Cloud Sync Helpers
export interface UserProgressCloud {
  userId: string;
  solvedProblems: string[];
  masteredProblems: string[];
  reviewProblems: string[];
  notesMap?: Record<string, string>;
  updatedAt: string;
}

export async function syncUserProfile(user: User, additionalData?: { role?: string; xpPoints?: number }) {
  if (!user?.uid || user.uid.startsWith('guest-')) return;
  const userRef = doc(db, 'users', user.uid);
  const path = `users/${user.uid}`;
  try {
    const existing = await getDoc(userRef);
    const now = new Date().toISOString();
    if (!existing.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'SQL Candidate',
        photoURL: user.photoURL || '',
        totalSolved: 0,
        masteredCount: 0,
        streakDays: 1,
        xpPoints: additionalData?.xpPoints || 100,
        role: additionalData?.role || 'Data Professional',
        createdAt: now,
        updatedAt: now,
      });
    } else {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || existing.data().email || '',
        displayName: user.displayName || existing.data().displayName || 'SQL Candidate',
        photoURL: user.photoURL || existing.data().photoURL || '',
        updatedAt: now,
        ...(additionalData || {})
      }, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveUserProgressCloud(userId: string, data: Partial<UserProgressCloud>) {
  if (!userId || userId.startsWith('guest-')) return;
  const ref = doc(db, 'users', userId, 'progress', 'state');
  const path = `users/${userId}/progress/state`;
  try {
    await setDoc(ref, {
      userId,
      solvedProblems: data.solvedProblems || [],
      masteredProblems: data.masteredProblems || [],
      reviewProblems: data.reviewProblems || [],
      notesMap: data.notesMap || {},
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function loadUserProgressCloud(userId: string): Promise<UserProgressCloud | null> {
  if (!userId || userId.startsWith('guest-')) return null;
  const ref = doc(db, 'users', userId, 'progress', 'state');
  const path = `users/${userId}/progress/state`;
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as UserProgressCloud;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveUserQueryCloud(userId: string, problemId: string, sqlCode: string, dialect: string, isSolved = false) {
  if (!userId || userId.startsWith('guest-')) return;
  const safeId = `${problemId}_${dialect}`.replace(/[^a-zA-Z0-9_-]/g, '_');
  const ref = doc(db, 'users', userId, 'queries', safeId);
  const path = `users/${userId}/queries/${safeId}`;
  try {
    await setDoc(ref, {
      userId,
      problemId,
      sqlCode,
      dialect,
      isSolved,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function loadUserQueriesCloud(userId: string): Promise<Record<string, string>> {
  if (!userId || userId.startsWith('guest-')) return {};
  const colRef = collection(db, 'users', userId, 'queries');
  const path = `users/${userId}/queries`;
  try {
    const snap = await getDocs(colRef);
    const results: Record<string, string> = {};
    snap.forEach(docSnap => {
      const d = docSnap.data();
      if (d.problemId && d.sqlCode) {
        results[`${d.problemId}_${d.dialect || 'postgresql'}`] = d.sqlCode;
      }
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User
};
