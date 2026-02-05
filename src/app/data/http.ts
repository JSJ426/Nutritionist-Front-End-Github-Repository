export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type HttpRequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? '';

const buildHeaders = (headers?: Record<string, string>) => {
  const base: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (authToken) {
    base.Authorization = `Bearer ${authToken}`;
  }
  return base;
};

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

const buildUrl = (url: string) => {
  if (isAbsoluteUrl(url) || !API_BASE_URL) {
    return url;
  }
  if (API_BASE_URL.endsWith('/') && url.startsWith('/')) {
    return `${API_BASE_URL}${url.slice(1)}`;
  }
  if (!API_BASE_URL.endsWith('/') && !url.startsWith('/')) {
    return `${API_BASE_URL}/${url}`;
  }
  return `${API_BASE_URL}${url}`;
};

export const httpRequest = async <T>(url: string, options: HttpRequestOptions = {}): Promise<T> => {
  const response = await fetch(buildUrl(url), {
    method: options.method ?? 'GET',
    headers: buildHeaders(options.headers),
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `HTTP ${response.status}`);
  }

  return (await response.json()) as T;
};

export const http = {
  get: <T>(url: string, options?: Omit<HttpRequestOptions, 'method' | 'body'>) =>
    httpRequest<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, body?: unknown, options?: Omit<HttpRequestOptions, 'method' | 'body'>) =>
    httpRequest<T>(url, { ...options, method: 'POST', body }),
  put: <T>(url: string, body?: unknown, options?: Omit<HttpRequestOptions, 'method' | 'body'>) =>
    httpRequest<T>(url, { ...options, method: 'PUT', body }),
  patch: <T>(url: string, body?: unknown, options?: Omit<HttpRequestOptions, 'method' | 'body'>) =>
    httpRequest<T>(url, { ...options, method: 'PATCH', body }),
  delete: <T>(url: string, options?: Omit<HttpRequestOptions, 'method' | 'body'>) =>
    httpRequest<T>(url, { ...options, method: 'DELETE' }),
};

// NOTE: When Axios is introduced, replace httpRequest/http with an axios instance
// and move authToken handling into request interceptors.
