'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  loggedIn: boolean | null;
  setLoggedIn: (value: boolean) => void;
  checkAuth: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);




  // API hívás, hogy van-e session
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/profile', { credentials: 'include' });
      const data = await res.json();
      setLoggedIn(data.loggedIn === true);
    } catch {
      setLoggedIn(false);
    } finally {
      setLoading(false); // ✔️ csak itt állítjuk át, ha kész
    }
  };

  useEffect(() => {
    checkAuth(); // induláskor
    const interval = setInterval(() => checkAuth(), 60_000); // percenként
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn,loading , setLoggedIn, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
