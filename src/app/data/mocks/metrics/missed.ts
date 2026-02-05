export const mockMetricSkipMealRegisterResponse = {
  status: 'success',
  message: '결식 인원 수가 등록되었습니다.',
  data: {
    id: 1234,
    school_id: 1,
    date: '2026-01-28',
    meal_type: 'LUNCH',
    skipped_count: 15,
    total_students: 200,
    skip_rate: 7.5,
    created_at: '2026-01-28T10:30:00Z',
  },
} as const;

export const mockMetricSkipMealUpdateResponse = {
  status: 'success',
  message: '결식 인원 수가 수정되었습니다.',
  data: {
    id: 1234,
    school_id: 1,
    date: '2026-01-28',
    meal_type: 'LUNCH',
    skipped_count: 18,
    total_students: 200,
    skip_rate: 9.0,
    updated_at: '2026-01-28T11:30:00Z',
  },
} as const;

export const mockMetricSkipRateYesterdayLunch = {
  status: 'success',
  data: {
    date: '2026-01-27',
    school_id: 1,
    meal_type: 'LUNCH',
    skipped_count: 17,
    total_students: 200,
    skip_rate: 8.5,
  },
} as const;

export const mockMetricSkipRateYesterdayDinner = {
  status: 'success',
  data: {
    date: '2026-01-27',
    school_id: 1,
    meal_type: 'DINNER',
    skipped_count: 10,
    total_students: 180,
    skip_rate: 5.6,
  },
} as const;

export const mockMetricSkipRateLast7DaysLunch = {
  status: 'success',
  data: {
    period: {
      start_date: '2026-01-21',
      end_date: '2026-01-27',
    },
    school_id: 1,
    meal_type: 'LUNCH',
    average_skip_rate: 7.8,
    daily_data: [
      { date: '2026-01-21', skipped_count: 15, total_students: 200, skip_rate: 7.5 },
      { date: '2026-01-22', skipped_count: 16, total_students: 200, skip_rate: 8.0 },
      { date: '2026-01-23', skipped_count: 14, total_students: 200, skip_rate: 7.0 },
      { date: '2026-01-24', skipped_count: 17, total_students: 200, skip_rate: 8.5 },
      { date: '2026-01-25', skipped_count: 13, total_students: 200, skip_rate: 6.5 },
      { date: '2026-01-26', skipped_count: 18, total_students: 200, skip_rate: 9.0 },
      { date: '2026-01-27', skipped_count: 17, total_students: 200, skip_rate: 8.5 },
    ],
  },
} as const;

export const mockMetricSkipRateLast7DaysDinner = {
  status: 'success',
  data: {
    period: {
      start_date: '2026-01-21',
      end_date: '2026-01-27',
    },
    school_id: 1,
    meal_type: 'DINNER',
    average_skip_rate: 6.2,
    daily_data: [
      { date: '2026-01-21', skipped_count: 9, total_students: 180, skip_rate: 5.0 },
      { date: '2026-01-22', skipped_count: 11, total_students: 180, skip_rate: 6.1 },
      { date: '2026-01-23', skipped_count: 10, total_students: 180, skip_rate: 5.6 },
      { date: '2026-01-24', skipped_count: 12, total_students: 180, skip_rate: 6.7 },
      { date: '2026-01-25', skipped_count: 8, total_students: 180, skip_rate: 4.4 },
      { date: '2026-01-26', skipped_count: 13, total_students: 180, skip_rate: 7.2 },
      { date: '2026-01-27', skipped_count: 10, total_students: 180, skip_rate: 5.6 },
    ],
  },
} as const;

export const mockMetricSkipRateLast30DaysLunch = {
  status: 'success',
  data: {
    period: {
      start_date: '2025-12-29',
      end_date: '2026-01-27',
    },
    school_id: 1,
    meal_type: 'LUNCH',
    average_skip_rate: 7.5,
    daily_data: [
      { date: '2025-12-29', skipped_count: 14, total_students: 200, skip_rate: 7.0 },
      { date: '2026-01-05', skipped_count: 15, total_students: 200, skip_rate: 7.5 },
      { date: '2026-01-12', skipped_count: 16, total_students: 200, skip_rate: 8.0 },
      { date: '2026-01-19', skipped_count: 13, total_students: 200, skip_rate: 6.5 },
      { date: '2026-01-26', skipped_count: 18, total_students: 200, skip_rate: 9.0 },
    ],
  },
} as const;

export const mockMetricSkipRateLast30DaysDinner = {
  status: 'success',
  data: {
    period: {
      start_date: '2025-12-29',
      end_date: '2026-01-27',
    },
    school_id: 1,
    meal_type: 'DINNER',
    average_skip_rate: 6.0,
    daily_data: [
      { date: '2025-12-29', skipped_count: 9, total_students: 180, skip_rate: 5.0 },
      { date: '2026-01-05', skipped_count: 11, total_students: 180, skip_rate: 6.1 },
      { date: '2026-01-12', skipped_count: 10, total_students: 180, skip_rate: 5.6 },
      { date: '2026-01-19', skipped_count: 8, total_students: 180, skip_rate: 4.4 },
      { date: '2026-01-26', skipped_count: 13, total_students: 180, skip_rate: 7.2 },
    ],
  },
} as const;

export const missedDefaults = {
  defaultPeriod: 'weekly',
  defaultMealType: 'all',
  defaultStartDate: '2026-01-01',
  defaultEndDate: '2026-01-27',
  targetRate: 8.0,
  prevMonthAvg: 7.5,
};

export const missedLabels = {
  period: {
    weekly: '최근 7일',
    monthly: '최근 30일',
    custom: '기간 지정',
  },
  meal: {
    all: '전체',
    lunch: '중식',
    dinner: '석식',
  },
};
