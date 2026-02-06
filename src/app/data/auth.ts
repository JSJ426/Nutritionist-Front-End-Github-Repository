import { http, httpRequest, setAuthToken } from './http';

export type DietitianSignupSchoolInfo = {
  school_name: string;
  region_code: string;
  school_code: string;
  address: string;
  school_id: number;
  school_type: string;
  phone?: string;
  email?: string;
  student_count?: number;
  target_unit_price?: number;
  max_unit_price?: number;
  operation_rules?: string;
  cook_workers?: number;
  kitchen_equipment?: string;
};

export type DietitianSignupRequest = {
  username: string;
  pw: string;
  name: string;
  email: string;
  phone: string;
  school_info: DietitianSignupSchoolInfo;
};

export type DietitianSignupResponse = {
  username: string;
  name: string;
  phone: string;
  dietitian_id: number;
  created_at: string;
  updated_at: string;
  school: {
    school_name: string;
    region_code: string;
    school_code: string;
    address: string;
    school_id: number;
    dietitian_id: number;
    school_type: string;
    phone: string | null;
    email: string | null;
    student_count: number | null;
    target_unit_price: number | null;
    max_unit_price: number | null;
    operation_rules: string | null;
    cook_workers: number | null;
    kitchen_equipment: string | null;
    created_at: string;
    updated_at: string;
  };
};

export const signupDietitian = async (
  payload: DietitianSignupRequest
): Promise<DietitianSignupResponse> =>
  http.post<DietitianSignupResponse>('/api/auth/signup/dietitian', payload);

export type DietitianLoginRequest = {
  username: string;
  pw: string;
};

export type DietitianLoginResponse = {
  accessToken: string;
};

export type DietitianFindIdRequest = {
  name: string;
  email: string;
};

export type DietitianFindIdResponse = {
  username: string;
};

export type DietitianFindPasswordRequest = {
  username: string;
  name: string;
  email: string;
};

export type DietitianFindPasswordResponse = {
  message: string;
};

export type AuthClaims = {
  sub: string;
  id: number;
  schoolId: number;
  role: string;
  iat?: number;
  exp?: number;
};

const AUTH_TOKEN_KEY = 'aivle_auth_token';

const decodeJwtPayload = (token: string): AuthClaims | null => {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = atob(padded);
    return JSON.parse(decoded) as AuthClaims;
  } catch {
    return null;
  }
};

export const getStoredAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
export const getStoredAuthClaims = () => {
  const token = getStoredAuthToken();
  return token ? decodeJwtPayload(token) : null;
};

export const storeAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  setAuthToken(token);
  return decodeJwtPayload(token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  setAuthToken(null);
};

export const restoreAuthToken = () => {
  const token = getStoredAuthToken();
  if (token) {
    setAuthToken(token);
  }
  return token ? decodeJwtPayload(token) : null;
};

export const loginDietitian = async (
  payload: DietitianLoginRequest
): Promise<DietitianLoginResponse> =>
  http.post<DietitianLoginResponse>('/api/auth/login/dietitian', payload);

export const findDietitianId = async (
  payload: DietitianFindIdRequest
): Promise<DietitianFindIdResponse> =>
  http.post<DietitianFindIdResponse>('/api/auth/dietitian/find-id', payload);

export const findDietitianPassword = async (
  payload: DietitianFindPasswordRequest
): Promise<DietitianFindPasswordResponse> =>
  http.post<DietitianFindPasswordResponse>('/api/auth/dietitian/find-pw', payload);

export const fetchSchoolInfo = async <T = unknown>() => http.get<T>('/api/schools/my');

export type DietitianWithdrawalRequest = {
  pw: string;
};

export const withdrawDietitian = async (payload: DietitianWithdrawalRequest): Promise<string> =>
  httpRequest<string>('/api/auth/withdraw/dietitian', {
    method: 'DELETE',
    body: payload,
    responseType: 'text',
  });
