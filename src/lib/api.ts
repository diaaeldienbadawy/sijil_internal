// ============================================================================
// API Client — token in memory + sessionStorage, refresh on 401, retry once
// ============================================================================
import type { TokenResponse, User, TenderListResponse, TenderListParams, Tender, ApiError } from '@/types';

const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || '/api/v1';
// Dev:  next.config.js rewrites proxy /api/* → remote API (avoids CORS)
//       → use relative path so requests hit the Next.js dev server
// Prod: frontend on tenders.sijilacc.com, API on tenderapi.sijilacc.com
//       → must call API domain directly
const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const API_BASE_URL = isProd
  ? (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://tenderapi.sijilacc.com')
  : ''; // relative — goes through next.config.js rewrite proxy
const BASE_URL = `${API_BASE_URL}${API_VERSION}`;

// ---- token management ----
let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(t: string | null) {
  accessToken = t;
  if (typeof window !== 'undefined') { t ? sessionStorage.setItem('access_token', t) : sessionStorage.removeItem('access_token'); }
}
export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== 'undefined') { const s = sessionStorage.getItem('access_token'); if (s) { accessToken = s; return s; } }
  return null;
}
export function clearAccessToken() { accessToken = null; if (typeof window !== 'undefined') sessionStorage.removeItem('access_token'); }
export function isAuthenticated() { return !!getAccessToken(); }

// ---- errors ----
export class ApiException extends Error {
  status: number; data?: ApiError;
  constructor(msg: string, status: number, data?: ApiError) { super(msg); this.name = 'ApiException'; this.status = status; this.data = data; }
}
function parseErr(d: ApiError | undefined) {
  if (!d) return 'خطأ غير معروف';
  if (typeof d.detail === 'string') return d.detail;
  if (Array.isArray(d.detail)) return d.detail.map(x => x.msg).join(', ');
  return 'خطأ غير معروف';
}

// ---- base fetch ----
interface FetchOpts extends RequestInit { skipAuth?: boolean; retryOnUnauthorized?: boolean; }

async function baseFetch<T>(endpoint: string, opts: FetchOpts = {}): Promise<T> {
  const { skipAuth = false, retryOnUnauthorized = true, ...fetchOpts } = opts;
  const headers = new Headers(fetchOpts.headers);
  if (!skipAuth) { const t = getAccessToken(); if (t) headers.set('Authorization', `Bearer ${t}`); }
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const res = await fetch(url, { ...fetchOpts, headers, credentials: 'include' });

  if (res.status === 401 && retryOnUnauthorized && !skipAuth) {
    const newT = await refreshAccessToken();
    if (newT) {
      headers.set('Authorization', `Bearer ${newT}`);
      const retry = await fetch(url, { ...fetchOpts, headers, credentials: 'include' });
      if (!retry.ok) { const e = await retry.json().catch(() => undefined); throw new ApiException(parseErr(e), retry.status, e); }
      if (retry.status === 204) return undefined as T;
      return retry.json();
    }
    clearAccessToken();
    throw new ApiException('انتهت الجلسة', 401);
  }
  if (!res.ok) { const e = await res.json().catch(() => undefined); throw new ApiException(parseErr(e), res.status, e); }
  if (res.status === 204) return undefined as T;
  return res.json();
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const r = await fetch(`${BASE_URL}/auth/refresh`, { method: 'POST', credentials: 'include' });
      if (!r.ok) return null;
      const d: TokenResponse = await r.json();
      setAccessToken(d.access_token);
      return d.access_token;
    } catch { return null; }
    finally { refreshPromise = null; }
  })();
  return refreshPromise;
}

// ---- auth API ----
export async function login(username: string, password: string): Promise<TokenResponse> {
  const fd = new FormData(); fd.append('username', username); fd.append('password', password);
  const r = await fetch(`${BASE_URL}/auth/token`, { method: 'POST', body: fd, credentials: 'include' });
  if (!r.ok) { const e = await r.json().catch(() => undefined); throw new ApiException(parseErr(e), r.status, e); }
  const d: TokenResponse = await r.json(); setAccessToken(d.access_token); return d;
}
export async function logout() { try { await baseFetch('/auth/logout', { method: 'POST', retryOnUnauthorized: false }); } finally { clearAccessToken(); } }
export async function getCurrentUser() { return baseFetch<User>('/users/me'); }

// ---- tenders API ----
export async function getTenders(params: TenderListParams = {}): Promise<TenderListResponse> {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') sp.append(k, String(v)); });
  const qs = sp.toString();
  return baseFetch<TenderListResponse>(`/tenders${qs ? `?${qs}` : ''}`);
}

export async function getTenderById(id: string): Promise<Tender> {
  return baseFetch<Tender>(`/tenders/${id}`);
}

// ---- analytics: fetch ALL IDs matching current search/filters, then fetch details ----

// Step 1: Collect all tender IDs by paginating through the list endpoint
// Uses limit=100 for efficiency, caps at maxPages to avoid runaway
export async function getAllTenderIds(
  params: TenderListParams,
  maxTotal: number = 500,
  onProgress?: (fetched: number, total: number) => void
): Promise<{ ids: string[]; total: number }> {
  const allIds: string[] = [];
  let page = 1;
  const limit = 100;
  let total = 0;

  while (true) {
    const res = await getTenders({ ...params, page, limit });
    total = res.meta.total;
    if (onProgress) onProgress(allIds.length + res.items.length, total);
    allIds.push(...res.items.map(t => t.id));

    if (page >= res.meta.pages || allIds.length >= maxTotal) break;
    page++;
  }

  return { ids: allIds.slice(0, maxTotal), total };
}

// Step 2: Fetch details in parallel batches
export async function getTenderDetailsBatch(
  ids: string[],
  batchSize: number = 10,
  onProgress?: (fetched: number, total: number) => void
): Promise<Tender[]> {
  const results: Tender[] = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(id => getTenderById(id)));
    for (const r of batchResults) {
      if (r.status === 'fulfilled') results.push(r.value);
    }
    if (onProgress) onProgress(results.length, ids.length);
  }
  return results;
}
