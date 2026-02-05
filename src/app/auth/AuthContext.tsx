import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { AuthClaims } from '../data/auth';
import {
  clearAuthToken,
  fetchMyProfile,
  getStoredAuthToken,
  restoreAuthToken,
  storeAuthToken,
} from '../data/auth';

type AuthContextValue = {
  token: string | null;
  claims: AuthClaims | null;
  isAuthenticated: boolean;
  isReady: boolean;
  loginWithToken: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [claims, setClaims] = useState<AuthClaims | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const restoredClaims = restoreAuthToken();
    const storedToken = getStoredAuthToken();
    setClaims(restoredClaims);
    setToken(storedToken);
    setIsReady(true);
  }, []);

  const loginWithToken = (nextToken: string) => {
    const nextClaims = storeAuthToken(nextToken);
    setToken(nextToken);
    setClaims(nextClaims);
    console.info('[auth] login token', nextToken);
    console.info('[auth] login claims', nextClaims);
    void fetchMyProfile()
      .then((profile) => {
        console.info('[auth] /api/schools/my', profile);
      })
      .catch((error) => {
        console.warn('[auth] /api/schools/my failed', error);
      });
  };

  const logout = () => {
    clearAuthToken();
    setToken(null);
    setClaims(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      claims,
      isAuthenticated: Boolean(token),
      isReady,
      loginWithToken,
      logout,
    }),
    [token, claims, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
