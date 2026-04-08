'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { login as apiLogin, logout as apiLogout, getCurrentUser, isAuthenticated, clearAccessToken } from '@/lib/api';
import type { User } from '@/types';

interface AuthCtx { user: User | null; isLoading: boolean; isLoggedIn: boolean; login: (u: string, p: string) => Promise<void>; logout: () => Promise<void>; checkAuth: () => Promise<void>; }
const AuthContext = createContext<AuthCtx | undefined>(undefined);
const PUBLIC = ['/login'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useMemo(() => !!user, [user]);

  const checkAuth = useCallback(async () => {
    if (!isAuthenticated()) { setUser(null); setIsLoading(false); return; }
    try { setUser(await getCurrentUser()); } catch { clearAccessToken(); setUser(null); } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;
    const pub = PUBLIC.some(r => pathname === r);
    if (!isLoggedIn && !pub) router.replace('/login');
    else if (isLoggedIn && pathname === '/login') router.replace('/tenders');
  }, [isLoading, isLoggedIn, pathname, router]);

  const login = useCallback(async (u: string, p: string) => { await apiLogin(u, p); setUser(await getCurrentUser()); router.push('/tenders'); }, [router]);
  const logout = useCallback(async () => { try { await apiLogout(); } finally { setUser(null); router.push('/login'); } }, [router]);

  const val = useMemo(() => ({ user, isLoading, isLoggedIn, login, logout, checkAuth }), [user, isLoading, isLoggedIn, login, logout, checkAuth]);
  return <AuthContext.Provider value={val}>{children}</AuthContext.Provider>;
}

export function useAuth() { const c = useContext(AuthContext); if (!c) throw new Error('useAuth must be inside AuthProvider'); return c; }
