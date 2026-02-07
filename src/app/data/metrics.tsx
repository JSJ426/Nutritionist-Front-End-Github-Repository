import {
  leftoversDefaults,
  leftoversLabels,
  mockMetricLeftoverRateYesterdayDinner,
  mockMetricLeftoverRateYesterdayLunch,
  mockMetricLeftoverRateLast30DaysDinner,
  mockMetricLeftoverRateLast30DaysLunch,
  mockMetricLeftoverRegisterResponse,
  mockMetricLeftoverUpdateResponse,
} from './mocks/metrics/leftovers';
import {
  missedDefaults,
  missedLabels,
  mockMetricSkipRateYesterdayDinner,
  mockMetricSkipRateYesterdayLunch,
  mockMetricSkipRateLast30DaysDinner,
  mockMetricSkipRateLast30DaysLunch,
  mockMetricSkipMealRegisterResponse,
  mockMetricSkipMealUpdateResponse,
} from './mocks/metrics/missed';
import {
  satisfactionConfig,
  satisfactionDefaults,
  satisfactionLabels,
  satisfactionMealOptions,
  satisfactionPeriodOptions,
} from './mocks/metrics/satisfaction';
import type {
  LeftoversMetricsResponse,
  MissedMetricsResponse,
  SatisfactionMetricsResponse,
} from '../viewModels/metrics';
import type { MetricLeftoverRatePeriodResponse, MetricLeftoverUpdateResponse } from '../viewModels/statsLeftovers';
import type { MetricSkipMealUpdateResponse, MetricSkipRatePeriodResponse } from '../viewModels/statsMissed';
import type {
  MetricSatisListLast30DaysResponse,
  MetricSatisNegativeCountResponse,
  MetricSatisPositiveCountResponse,
  MetricSatisReviewListResponse,
} from '../viewModels/statsSatisfaction';
import { http } from './http';

export const getLeftoversMetrics = async (schoolId: number): Promise<LeftoversMetricsResponse> => {
  const buildUrl = (period: 'last-7days' | 'last-30days', mealType: 'LUNCH' | 'DINNER') =>
    `/metrics/leftover-rate/${period}?school_id=${schoolId}&meal_type=${mealType}`;
  const buildYesterdayUrl = (mealType: 'LUNCH' | 'DINNER') =>
    `/metrics/leftover-rate/yesterday?school_id=${schoolId}&meal_type=${mealType}`;

  const [yesterdayLunch, yesterdayDinner, weeklyLunch, weeklyDinner, monthlyLunch, monthlyDinner] = await Promise.all([
    http.get<LeftoversMetricsResponse['yesterdayLunch']>(buildYesterdayUrl('LUNCH')),
    http.get<LeftoversMetricsResponse['yesterdayDinner']>(buildYesterdayUrl('DINNER')),
    http.get<LeftoversMetricsResponse['weeklyLunch']>(buildUrl('last-7days', 'LUNCH')),
    http.get<LeftoversMetricsResponse['weeklyDinner']>(buildUrl('last-7days', 'DINNER')),
    http.get<LeftoversMetricsResponse['monthlyLunch']>(buildUrl('last-30days', 'LUNCH')),
    http.get<LeftoversMetricsResponse['monthlyDinner']>(buildUrl('last-30days', 'DINNER')),
  ]);

  return {
    defaults: leftoversDefaults,
    labels: leftoversLabels,
    yesterdayLunch,
    yesterdayDinner,
    weeklyLunch,
    weeklyDinner,
    monthlyLunch,
    monthlyDinner,
    registerResponse: mockMetricLeftoverRegisterResponse,
    updateResponse: mockMetricLeftoverUpdateResponse,
  };
};

export const getMissedMetrics = async (schoolId: number): Promise<MissedMetricsResponse> => {
  const buildUrl = (period: 'last-7days' | 'last-30days', mealType: 'LUNCH' | 'DINNER') =>
    `/metrics/skip-meal-rate/${period}?school_id=${schoolId}&meal_type=${mealType}`;
  const buildYesterdayUrl = (mealType: 'LUNCH' | 'DINNER') =>
    `/metrics/skip-meal-rate/yesterday?school_id=${schoolId}&meal_type=${mealType}`;

  const [yesterdayLunch, yesterdayDinner, weeklyLunch, weeklyDinner, monthlyLunch, monthlyDinner] = await Promise.all([
    http.get<MissedMetricsResponse['yesterdayLunch']>(buildYesterdayUrl('LUNCH')),
    http.get<MissedMetricsResponse['yesterdayDinner']>(buildYesterdayUrl('DINNER')),
    http.get<MissedMetricsResponse['weeklyLunch']>(buildUrl('last-7days', 'LUNCH')),
    http.get<MissedMetricsResponse['weeklyDinner']>(buildUrl('last-7days', 'DINNER')),
    http.get<MissedMetricsResponse['monthlyLunch']>(buildUrl('last-30days', 'LUNCH')),
    http.get<MissedMetricsResponse['monthlyDinner']>(buildUrl('last-30days', 'DINNER')),
  ]);

  return {
    defaults: missedDefaults,
    labels: missedLabels,
    yesterdayLunch,
    yesterdayDinner,
    weeklyLunch,
    weeklyDinner,
    monthlyLunch,
    monthlyDinner,
    registerResponse: mockMetricSkipMealRegisterResponse,
    updateResponse: mockMetricSkipMealUpdateResponse,
  };
};

export const getSatisfactionMetrics = async (): Promise<SatisfactionMetricsResponse> => {
  const countLast30Days = await http.get<SatisfactionMetricsResponse['countLast30Days']>(
    '/metrics/satisfaction/count/last-30days'
  );

  const normalizeDateParam = (value: string, edge: 'start' | 'end') => {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}$/.test(trimmed)) {
      if (edge === 'start') {
        return `${trimmed}-01`;
      }
      const [year, month] = trimmed.split('-').map(Number);
      const lastDay = new Date(year, month, 0).getDate();
      return `${trimmed}-${String(lastDay).padStart(2, '0')}`;
    }
    return trimmed;
  };

  const periodStart = normalizeDateParam(countLast30Days.data.period.start_date, 'start');
  const periodEnd = normalizeDateParam(countLast30Days.data.period.end_date, 'end');

  const listParams = new URLSearchParams({
    page: '1',
    size: '20',
  });

  const [listLast30DaysRaw, positiveCount, negativeCount] = await Promise.all([
    http.get<MetricSatisListLast30DaysResponse>(
      `/metrics/satisfaction/last-30days?${listParams.toString()}`
    ),
    http.get<MetricSatisPositiveCountResponse>(
      `/metrics/satisfaction/positive/count?start_date=${periodStart}&end_date=${periodEnd}`
    ),
    http.get<MetricSatisNegativeCountResponse>(
      `/metrics/satisfaction/negative/count?start_date=${periodStart}&end_date=${periodEnd}`
    ),
  ]);

  const listLast30Days: SatisfactionMetricsResponse['listLast30Days'] = {
    success: listLast30DaysRaw.status === 'success',
    data: {
      period: listLast30DaysRaw.data.period,
      school_id: listLast30DaysRaw.data.school_id,
      batches: listLast30DaysRaw.data.batches,
    },
    pagination: listLast30DaysRaw.data.pagination,
  };

  return {
    defaults: satisfactionDefaults,
    config: satisfactionConfig,
    labels: satisfactionLabels,
    periodOptions: satisfactionPeriodOptions,
    mealOptions: satisfactionMealOptions,
    countLast30Days,
    listLast30Days,
    positiveCount,
    negativeCount,
    reviewList: await http.get<SatisfactionMetricsResponse['reviewList']>(
      '/metrics/satisfaction/reviews?page=1&size=20'
    ),
  };
};

type SatisfactionReviewQuery = {
  batch_id?: string;
  start_date?: string;
  end_date?: string;
  sentiment?: string;
  page?: number;
  size?: number;
};

export const getSatisfactionReviewList = async (
  params: SatisfactionReviewQuery
): Promise<MetricSatisReviewListResponse> => {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    size: String(params.size ?? 20),
  });
  if (params.batch_id) query.set('batch_id', params.batch_id);
  if (params.start_date) query.set('start_date', params.start_date);
  if (params.end_date) query.set('end_date', params.end_date);
  if (params.sentiment) query.set('sentiment', params.sentiment);
  return http.get<MetricSatisReviewListResponse>(`/metrics/satisfaction/reviews?${query.toString()}`);
};

export const getSatisfactionPositiveCount = async (startDate: string, endDate: string) =>
  http.get<MetricSatisPositiveCountResponse>(
    `/metrics/satisfaction/positive/count?start_date=${startDate}&end_date=${endDate}`
  );

export const getSatisfactionNegativeCount = async (startDate: string, endDate: string) =>
  http.get<MetricSatisNegativeCountResponse>(
    `/metrics/satisfaction/negative/count?start_date=${startDate}&end_date=${endDate}`
  );

export const getLeftoverMonthly = async (year: number, month: number, mealType?: 'LUNCH' | 'DINNER') => {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
  });
  if (mealType) params.set('meal_type', mealType);
  return http.get<MetricLeftoverRatePeriodResponse>(`/metrics/leftover/monthly?${params.toString()}`);
};

export const getSkipMealMonthly = async (year: number, month: number, mealType?: 'LUNCH' | 'DINNER') => {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
  });
  if (mealType) params.set('meal_type', mealType);
  return http.get<MetricSkipRatePeriodResponse>(`/metrics/skip-meal/monthly?${params.toString()}`);
};


export type MetricLeftoverRegisterPayload = {
  school_id: number;
  date: string;
  meal_type: 'LUNCH' | 'DINNER';
  amount_kg: number;
};

export type MetricLeftoverRegisterResponse = LeftoversMetricsResponse['registerResponse'];

export const createLeftoverDaily = async (
  payload: MetricLeftoverRegisterPayload
): Promise<MetricLeftoverRegisterResponse> => {
  return http.post<MetricLeftoverRegisterResponse>('/metrics/leftover/daily', payload);
};


export type MetricLeftoverUpdatePayload = {
  date: string;
  meal_type: 'LUNCH' | 'DINNER';
  amount_kg: number;
};

export const updateLeftoverDaily = async (
  payload: MetricLeftoverUpdatePayload
): Promise<MetricLeftoverUpdateResponse> => {
  return http.put<MetricLeftoverUpdateResponse>('/metrics/leftover/daily', payload);
};


export type MetricSkipMealRegisterPayload = {
  school_id: number;
  date: string;
  meal_type: 'LUNCH' | 'DINNER';
  skipped_count: number;
  total_students: number;
};

export type MetricSkipMealRegisterResponse = MissedMetricsResponse['registerResponse'];

export const createSkipMealDaily = async (
  payload: MetricSkipMealRegisterPayload
): Promise<MetricSkipMealRegisterResponse> => {
  return http.post<MetricSkipMealRegisterResponse>('/metrics/skip-meal/daily', payload);
};

export type MetricSkipMealUpdatePayload = {
  date: string;
  meal_type: 'LUNCH' | 'DINNER';
  skipped_count: number;
  total_students: number;
};

export const updateSkipMealDaily = async (
  payload: MetricSkipMealUpdatePayload
): Promise<MetricSkipMealUpdateResponse> => {
  return http.put<MetricSkipMealUpdateResponse>('/metrics/skip-meal/daily', payload);
};
