export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type HttpRequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  responseType?: 'json' | 'text';
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

type HttpError = {
  status: number;
  code?: string;
  message: string;
};

const parseErrorPayload = (text: string, status: number) => {
  if (!text) return { message: `HTTP ${status}` };
  try {
    const parsed = JSON.parse(text) as { message?: string; code?: string };
    if (parsed?.message || parsed?.code) {
      return { message: parsed.message ?? `HTTP ${status}`, code: parsed.code };
    }
  } catch {
    // ignore JSON parse errors and fall back to raw text
  }
  return { message: text };
};

export const httpRequest = async <T>(url: string, options: HttpRequestOptions = {}): Promise<T> => {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = buildHeaders(options.headers);
  if (isFormData) {
    delete headers['Content-Type'];
  }

  const responseType = options.responseType ?? 'json';
  const response = await fetch(buildUrl(url), {
    method: options.method ?? 'GET',
    headers,
    body: options.body
      ? isFormData
        ? options.body
        : JSON.stringify(options.body)
      : undefined,
    signal: options.signal,
  });

  const text = await response.text();

  if (!response.ok) {
    const { message, code } = parseErrorPayload(text, response.status);
    const error: HttpError = { status: response.status, message, code };
    throw error;
  }

  if (!text) {
    return {} as T;
  }

  if (responseType === 'text') {
    return text as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    const error: HttpError = { status: 200, message: `Invalid JSON response: ${text.slice(0, 200)}` };
    throw error;
  }
};

export const httpDownload = async (
  url: string,
  options: Omit<HttpRequestOptions, 'method' | 'body'> = {}
): Promise<Blob> => {
  const response = await fetch(buildUrl(url), {
    method: 'GET',
    headers: buildHeaders(options.headers),
    signal: options.signal,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }

  return response.blob();
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
