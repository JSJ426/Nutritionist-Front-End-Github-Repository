import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { AuthClaims } from '../data/auth';
import {
  clearAuthToken,
  fetchSchoolInfo,
  getStoredAuthToken,
  restoreAuthToken,
  storeAuthToken,
} from '../data/auth';
import type { SchoolResponse } from '../viewModels/school';

type AuthContextValue = {
  token: string | null;
  claims: AuthClaims | null;
  schoolName: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  loginWithToken: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [claims, setClaims] = useState<AuthClaims | null>(null);
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const restoredClaims = restoreAuthToken();
    const storedToken = getStoredAuthToken();
    setClaims(restoredClaims);
    setToken(storedToken);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!token) {
      setSchoolName(null);
      return;
    }

    let isActive = true;
    void fetchSchoolInfo<SchoolResponse | SchoolResponse['data']>()
      .then((profile) => {
        if (!isActive) return;
        if ('data' in profile) {
          setSchoolName(profile.data?.school_name ?? null);
          return;
        }
        setSchoolName(profile?.school_name ?? null);
      })
      .catch((error) => {
        if (!isActive) return;
        setSchoolName(null);
        console.warn('[auth] fetchSchoolInfo failed', error);
      });

    return () => {
      isActive = false;
    };
  }, [token]);

  const loginWithToken = (nextToken: string) => {
    const nextClaims = storeAuthToken(nextToken);
    setToken(nextToken);
    setClaims(nextClaims);
    console.info('[auth] login token', nextToken);
    console.info('[auth] login claims', nextClaims);
  };

  const logout = () => {
    clearAuthToken();
    setToken(null);
    setClaims(null);
    setSchoolName(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      claims,
      schoolName,
      isAuthenticated: Boolean(token),
      isReady,
      loginWithToken,
      logout,
    }),
    [token, claims, schoolName, isReady]
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
