import { http } from './http';
import { mockMealPlanAIReasonResponse } from './mocks/meal/aiReason';
import { mockMealPlanDetailResponse } from './mocks/meal/detail';
import { mockMealPlanGenerateResponse } from './mocks/meal/generate';
import { mockMealPlanHistoryResponse } from './mocks/meal/history';
import { mockMealPlanManualUpdateResponse } from './mocks/meal/manualUpdate';
import { mockMealPlanMonthlyResponse } from './mocks/meal/monthly';
import { mockMealPlanWeeklyResponse } from './mocks/meal/weekly';
import type {
  MealMonthlyResponse,
  MealPlanAIReasonResponse,
  MealPlanAIReplacePayload,
  MealPlanAIReplaceResponse,
  MealPlanDetailResponse,
  MealPlanGeneratePayload,
  MealPlanGenerateResponse,
  MealPlanHistoryResponse,
  MealPlanManualUpdateResponse,
  MealPlanWeeklyResponse,
} from '../viewModels/meal';

// GetMealPlanWeekly 대응
// export const getMealPlanWeeklyResponse = async (): Promise<MealPlanWeeklyResponse> =>
//   mockMealPlanWeeklyResponse;

// GetMealPlanMonthly 대응
// export const getMealPlanMonthlyResponse = async (): Promise<MealMonthlyResponse> =>
//   mockMealPlanMonthlyResponse;

// MealPlanDetail 대응
// export const getMealPlanDetailResponse = async (): Promise<MealPlanDetailResponse> =>
//   mockMealPlanDetailResponse;

// MealPlanGenerate 대응
export const generateMealPlan = async (
  payload: MealPlanGeneratePayload
): Promise<MealPlanGenerateResponse> =>
  http.post<MealPlanGenerateResponse>('/mealplan', payload);

// MealPlanAIReplace 대응
export const replaceMealPlanWithAI = async (
  payload: MealPlanAIReplacePayload
): Promise<MealPlanAIReplaceResponse> =>
  http.put<MealPlanAIReplaceResponse>('/mealplan/ai-replace', payload);

// MealPlanManualUpdate 대응
export const updateMealPlanManually = async (
  mealPlanId: number,
  menuId: number,
  payload: { reason: string; menus: string[] }
): Promise<MealPlanManualUpdateResponse> =>
  http.patch<MealPlanManualUpdateResponse>(`/mealplan/${mealPlanId}/menus/${menuId}`, payload);

// // MealPlanHistory 대응
// export const getMealPlanHistoryResponse = async (): Promise<MealPlanHistoryResponse> =>
//   mockMealPlanHistoryResponse;

// MealPlanAIReason 대응
// * 명세서 상에는 삭제 예정으로 나와있음
export const getMealPlanAIReasonResponse = async (): Promise<MealPlanAIReasonResponse> =>
  mockMealPlanAIReasonResponse;

export type MealPlanHistoryQuery = {
  startDate?: string;
  endDate?: string;
  actionType?: MealPlanHistoryResponse['data']['items'][number]['action_type'];
  page?: number;
  size?: number;
};

// MealPlanHistory 대응
export const fetchMealPlanHistories = async (
  query: MealPlanHistoryQuery = {}
): Promise<MealPlanHistoryResponse> => {
  const params = new URLSearchParams();
  if (query.startDate) {
    params.set('startDate', query.startDate);
  }
  if (query.endDate) {
    params.set('endDate', query.endDate);
  }
  if (query.actionType) {
    params.set('actionType', query.actionType);
  }
  if (typeof query.page === 'number') {
    params.set('page', String(query.page));
  }
  if (typeof query.size === 'number') {
    params.set('size', String(query.size));
  }

  const queryString = params.toString();
  const url = queryString ? `/mealplan/histories?${queryString}` : '/mealplan/histories';
  return http.get<MealPlanHistoryResponse>(url);
};

// GetMealPlanMonthly 대응
export const fetchMealPlanMonthly = async (
  year?: number,
  month?: number
): Promise<MealMonthlyResponse> => {
  const params = new URLSearchParams();
  if (typeof year === 'number') {
    params.set('year', String(year));
  }
  if (typeof month === 'number') {
    params.set('month', String(month));
  }
  //
  const query = params.toString();
  const url = query ? `/mealplan/monthly?${query}` : '/mealplan/monthly';
  return http.get<MealMonthlyResponse>(url);
};

// GetMealPlanWeekly 대응
export const fetchMealPlanWeekly = async (
  date?: string
): Promise<MealPlanWeeklyResponse> => {
  const params = new URLSearchParams();
  if (date) {
    params.set('date', date);
  }
  //
  const query = params.toString();
  const url = query ? `/mealplan/weekly?${query}` : '/mealplan/weekly';
  return http.get<MealPlanWeeklyResponse>(url);
};

// MealPlanDetail 대응
export const fetchMealPlanMenuDetail = async (
  date: string,
  mealType: 'LUNCH' | 'DINNER'
): Promise<MealPlanDetailResponse> => {
  const params = new URLSearchParams();
  if (date) {
    params.set('date', date);
  }
  //
  const query = params.toString();
  const url = query ? `/mealplan/menus/${date}/${mealType}` : '/mealplan/menus';
  return http.get<MealPlanDetailResponse>(url);
};
