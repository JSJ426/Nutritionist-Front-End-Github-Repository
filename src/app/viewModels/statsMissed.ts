
export type StatsMissedPeriod = 'weekly' | 'monthly' | 'custom';
export type StatsMissedMealType = 'all' | 'lunch' | 'dinner';

export type StatsMissedItem = {
  date: string;
  rate: number;
  lunch: number;
  dinner: number;
};

export type StatsMissedDisplayItem = StatsMissedItem & {
  displayRate: number;
};

export type StatsMissedKpiData = {
  today: number;
  todayChange: number;
  weekAvg: number;
  weekChange: number;
  monthAvg: number;
  monthChange: number;
};

type MetricSkipRateDaily = {
  date: string;
  skipped_count: number;
  total_students: number;
  skip_rate: number;
};

export type MetricSkipRateYesterdayResponse = {
  status: string;
  data: {
    date: string;
    school_id: number;
    meal_type: 'LUNCH' | 'DINNER';
    skipped_count: number;
    total_students: number;
    skip_rate: number;
  };
};

export type MetricSkipRatePeriodResponse = {
  status: string;
  message?: string;
  data: {
    period: {
      start_date: string;
      end_date: string;
    };
    school_id: number;
    meal_type: 'LUNCH' | 'DINNER';
    average_skip_rate: number;
    daily_data: MetricSkipRateDaily[];
  };
};

export type MetricSkipMealUpdateResponse = {
  status: string;
  message: string;
  data: {
    id: number;
    school_id: number;
    date: string;
    meal_type: 'LUNCH' | 'DINNER';
    skipped_count: number;
    total_students: number;
    skip_rate: number;
    created_at?: string;
    updated_at?: string;
  };
};

export const getMissedBaseData = (
  period: StatsMissedPeriod,
  data: {
    weekly: StatsMissedItem[];
    monthly: StatsMissedItem[];
    custom: StatsMissedItem[];
  }
): StatsMissedItem[] => {
  if (period === 'weekly') return data.weekly;
  if (period === 'monthly') return data.monthly;
  return data.custom;
};

export const getMissedFilteredData = (
  baseData: StatsMissedItem[],
  mealType: StatsMissedMealType
): StatsMissedDisplayItem[] => {
  return baseData.map((item) => ({
    ...item,
    displayRate: mealType === 'lunch' ? item.lunch : mealType === 'dinner' ? item.dinner : item.rate,
  }));
};

export const getMissedFilterLabels = (
  period: StatsMissedPeriod,
  mealType: StatsMissedMealType,
  labels: {
    period: Record<StatsMissedPeriod, string>;
    meal: Record<StatsMissedMealType, string>;
  }
): { periodLabel: string; mealLabel: string } => {
  return {
    periodLabel: labels.period[period],
    mealLabel: labels.meal[mealType],
  };
};

const buildMissedSeriesFromPeriod = (
  lunchResponse: MetricSkipRatePeriodResponse,
  dinnerResponse: MetricSkipRatePeriodResponse
): StatsMissedItem[] => {
  const byDate = new Map<string, { lunch?: number; dinner?: number }>();

  lunchResponse.data.daily_data.forEach((entry) => {
    byDate.set(entry.date, { ...(byDate.get(entry.date) ?? {}), lunch: entry.skip_rate });
  });

  dinnerResponse.data.daily_data.forEach((entry) => {
    byDate.set(entry.date, { ...(byDate.get(entry.date) ?? {}), dinner: entry.skip_rate });
  });

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => {
      const lunchRate = values.lunch ?? 0;
      const dinnerRate = values.dinner ?? 0;
      const rate =
        values.lunch != null && values.dinner != null
          ? (lunchRate + dinnerRate) / 2
          : values.lunch != null
            ? lunchRate
            : dinnerRate;

      return {
        date,
        rate,
        lunch: lunchRate,
        dinner: dinnerRate,
      };
    });
};

export const toMissedSeriesByPeriod = (inputs: {
  weeklyLunch: MetricSkipRatePeriodResponse;
  weeklyDinner: MetricSkipRatePeriodResponse;
  monthlyLunch: MetricSkipRatePeriodResponse;
  monthlyDinner: MetricSkipRatePeriodResponse;
}): { weekly: StatsMissedItem[]; monthly: StatsMissedItem[]; custom: StatsMissedItem[] } => {
  const weekly = buildMissedSeriesFromPeriod(inputs.weeklyLunch, inputs.weeklyDinner);
  const monthly = buildMissedSeriesFromPeriod(inputs.monthlyLunch, inputs.monthlyDinner);
  return {
    weekly,
    monthly,
    custom: monthly,
  };
};
