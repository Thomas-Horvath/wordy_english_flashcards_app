'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AUTH_STORAGE_KEY = 'wordy:last-known-auth';

type AuthContextType = {
  // `null` azt jelenti, hogy még nem tudjuk biztosan az auth állapotot.
  loggedIn: boolean | null;
  setLoggedIn: (value: boolean) => void;
  checkAuth: () => Promise<void>;
  loading: boolean;
  // Hálózati vagy egyéb auth-ellenőrzési hibát külön tárolunk,
  // hogy ezt ne keverjük össze a tényleges kijelentkezett állapottal.
  authError: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Ez a legutóbbi ismert auth állapot.
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  // Az első auth ellenőrzés idejére globális töltést mutatunk.
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Az auth ellenőrzést központilag itt végezzük.
  // Fontos különbség:
  // - ha a szerver válaszol, akkor a választ tekintjük igaznak
  // - ha hálózati hiba történik, NEM jelentkeztetjük ki a felhasználót
  //   automatikusan, hanem megtartjuk az utolsó ismert állapotot
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/profile', { credentials: 'include' });
      if (!res.ok) {
        throw new Error(`Auth check failed with status ${res.status}`);
      }

      const data = await res.json();
      setLoggedIn(data.loggedIn === true);
      window.localStorage.setItem(AUTH_STORAGE_KEY, String(data.loggedIn === true));
      setAuthError(null);
    } catch {
      // Itt tipikusan hálózati vagy átmeneti szerverhiba történik.
      // Ilyenkor szándékosan nem írjuk felül a `loggedIn` állapotot,
      // különben egy rövid netkimaradás is kijelentkeztetettnek látszana.
      setAuthError("Az auth ellenőrzése most nem sikerült. A legutóbbi ismert állapot marad érvényben.");
    } finally {
      // Az első ellenőrzés után feloldjuk a globális loadingot akkor is,
      // ha hiba történt. Így az alkalmazás használható marad offline helyzetben is.
      setLoading(false);
    }
  };

  useEffect(() => {
    // Teljes oldalfrissítés után a React state elvész.
    // Ezért induláskor visszatöltjük az utolsó ismert auth állapotot a localStorage-ból,
    // így egy rövid hálózati hiba nem dobja ki azonnal a felhasználót.
    const cachedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (cachedAuth === 'true') {
      setLoggedIn(true);
    } else if (cachedAuth === 'false') {
      setLoggedIn(false);
    }

    // Első betöltéskor megpróbáljuk meghatározni a session állapotát.
    checkAuth();

    // Percenként újraellenőrizzük a sessiont, hogy lejárat esetén
    // a kliens állapota szinkronban maradjon a szerverrel.
    const interval = setInterval(() => checkAuth(), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // A legutóbbi ismert auth állapotot folyamatosan eltároljuk,
    // hogy reload esetén legyen mihez visszanyúlni átmeneti hálózati hiba alatt.
    if (loggedIn === null) return;
    window.localStorage.setItem(AUTH_STORAGE_KEY, String(loggedIn));
  }, [loggedIn]);

  return (
    <AuthContext.Provider value={{ loggedIn, loading, setLoggedIn, checkAuth, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  // A custom hook garantálja, hogy a contextet csak provider alatt használjuk.
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
