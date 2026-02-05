export const mockMetricLeftoverRegisterResponse = {
  status: 'success',
  message: '잔반량이 등록되었습니다.',
  data: {
    id: 1235,
    school_id: 1,
    date: '2026-01-28',
    meal_type: 'LUNCH',
    amount_kg: 12.5,
    created_at: '2026-01-28T10:30:00Z',
  },
} as const;

export const mockMetricLeftoverUpdateResponse = {
  status: 'success',
  message: '잔반량이 수정되었습니다.',
  data: {
    id: 1235,
    school_id: 1,
    date: '2026-01-28',
    meal_type: 'LUNCH',
    amount_kg: 15.3,
    updated_at: '2026-01-28T11:30:00Z',
  },
} as const;

export const mockMetricLeftoverRateYesterdayLunch = {
  status: 'success',
  data: {
    date: '2026-01-27',
    school_id: 1,
    meal_type: 'LUNCH',
    amount_kg: 13.2,
  },
} as const;

export const mockMetricLeftoverRateYesterdayDinner = {
  status: 'success',
  data: {
    date: '2026-01-27',
    school_id: 1,
    meal_type: 'DINNER',
    amount_kg: 8.4,
  },
} as const;

export const mockMetricLeftoverRateLast7DaysLunch = {
  status: 'success',
  data: {
    period: {
      start_date: '2026-01-21',
      end_date: '2026-01-27',
    },
    school_id: 1,
    meal_type: 'LUNCH',
    average_amount_kg: 12.8,
    daily_data: [
      { date: '2026-01-21', amount_kg: 12.5 },
      { date: '2026-01-22', amount_kg: 13.1 },
      { date: '2026-01-23', amount_kg: 11.9 },
      { date: '2026-01-24', amount_kg: 14.0 },
      { date: '2026-01-25', amount_kg: 12.2 },
      { date: '2026-01-26', amount_kg: 13.6 },
      { date: '2026-01-27', amount_kg: 13.2 },
    ],
  },
} as const;

export const mockMetricLeftoverRateLast7DaysDinner = {
  status: 'success',
  data: {
    period: {
      start_date: '2026-01-21',
      end_date: '2026-01-27',
    },
    school_id: 1,
    meal_type: 'DINNER',
    average_amount_kg: 8.6,
    daily_data: [
      { date: '2026-01-21', amount_kg: 8.1 },
      { date: '2026-01-22', amount_kg: 8.4 },
      { date: '2026-01-23', amount_kg: 7.9 },
      { date: '2026-01-24', amount_kg: 9.2 },
      { date: '2026-01-25', amount_kg: 8.0 },
      { date: '2026-01-26', amount_kg: 9.0 },
      { date: '2026-01-27', amount_kg: 8.4 },
    ],
  },
} as const;

export const mockMetricLeftoverRateLast30DaysLunch = {
  status: 'success',
  data: {
    period: {
      start_date: '2025-12-29',
      end_date: '2026-01-27',
    },
    school_id: 1,
    meal_type: 'LUNCH',
    average_amount_kg: 12.5,
    daily_data: [
      { date: '2025-12-29', amount_kg: 11.8 },
      { date: '2026-01-05', amount_kg: 12.2 },
      { date: '2026-01-12', amount_kg: 12.9 },
      { date: '2026-01-19', amount_kg: 12.1 },
      { date: '2026-01-26', amount_kg: 13.0 },
    ],
  },
} as const;

export const mockMetricLeftoverRateLast30DaysDinner = {
  status: 'success',
  data: {
    period: {
      start_date: '2025-12-29',
      end_date: '2026-01-27',
    },
    school_id: 1,
    meal_type: 'DINNER',
    average_amount_kg: 8.3,
    daily_data: [
      { date: '2025-12-29', amount_kg: 7.6 },
      { date: '2026-01-05', amount_kg: 8.0 },
      { date: '2026-01-12', amount_kg: 8.5 },
      { date: '2026-01-19', amount_kg: 7.8 },
      { date: '2026-01-26', amount_kg: 8.9 },
    ],
  },
} as const;

export const leftoversDefaults = {
  defaultPeriod: 'weekly',
  defaultMealType: 'all',
  defaultMenuType: 'all',
  defaultStartDate: '2026-01-01',
  defaultEndDate: '2026-01-27',
  targetAmount: 14,
  prevMonthAvg: 12.5,
};

export const leftoversLabels = {
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
  menu: {
    all: '전체',
    main: '주식',
    side: '부식',
    soup: '국',
  },
};
