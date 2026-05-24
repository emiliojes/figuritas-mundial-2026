import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import {
  demoRegister,
  demoLogin,
  demoLogout,
  demoGetSession,
} from '../lib/demoStore';

const IS_DEMO = import.meta.env.VITE_FIREBASE_PROJECT_ID === 'placeholder' ||
  !import.meta.env.VITE_FIREBASE_PROJECT_ID;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (IS_DEMO) {
      const session = demoGetSession();
      setUser(session);
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        setUser({ ...firebaseUser, profile: snap.data() || {} });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function register(email, password, displayName) {
    if (IS_DEMO) {
      const u = demoRegister(email, password, displayName);
      setUser(u);
      return;
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await setDoc(doc(db, 'users', cred.user.uid), {
      displayName,
      email,
      stickers: {},
      createdAt: new Date().toISOString(),
    });
    return cred;
  }

  async function login(email, password) {
    if (IS_DEMO) {
      const u = demoLogin(email, password);
      setUser(u);
      return;
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    if (IS_DEMO) {
      const u = demoLogin('google@demo.com', 'demo');
      setUser(u);
      return;
    }
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const userRef = doc(db, 'users', cred.user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        displayName: cred.user.displayName,
        email: cred.user.email,
        stickers: {},
        createdAt: new Date().toISOString(),
      });
    }
    return cred;
  }

  function logout() {
    if (IS_DEMO) {
      demoLogout();
      setUser(null);
      return;
    }
    return signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginWithGoogle, logout, isDemo: IS_DEMO }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
