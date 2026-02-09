
export type StatsLeftoversPeriod = 'weekly' | 'monthly' | 'custom';
export type StatsLeftoversMealType = 'all' | 'lunch' | 'dinner';
export type StatsLeftoversMenuType = 'all' | 'main' | 'side' | 'soup';

export type StatsLeftoversItem = {
  date: string;
  amount: number;
  lunch: number;
  dinner: number;
  main: number;
  side: number;
  soup: number;
};

export type StatsLeftoversDisplayItem = StatsLeftoversItem & {
  displayAmount: number;
};

export type StatsLeftoversKpiData = {
  today: number;
  todayChange: number;
  weekAvg: number;
  weekChange: number;
  monthAvg: number;
  monthChange: number;
};

type MetricLeftoverDaily = {
  date: string;
  amount_kg: number;
};

export type MetricLeftoverRateYesterdayResponse = {
  status: string;
  data: {
    date: string;
    school_id: number;
    meal_type: 'LUNCH' | 'DINNER';
    amount_kg: number;
  };
};

export type MetricLeftoverRatePeriodResponse = {
  status: string;
  message?: string;
  data: {
    period: {
      start_date: string;
      end_date: string;
    };
    school_id: number;
    meal_type: 'LUNCH' | 'DINNER';
    average_amount_kg: number;
    daily_data: MetricLeftoverDaily[];
  };
};

export type MetricLeftoverUpdateResponse = {
  status: string;
  message: string;
  data: {
    id: number;
    school_id: number;
    date: string;
    meal_type: 'LUNCH' | 'DINNER';
    amount_kg: number;
    created_at?: string;
    updated_at?: string;
  };
};

export const getLeftoversBaseData = (
  period: StatsLeftoversPeriod,
  data: {
    weekly: StatsLeftoversItem[];
    monthly: StatsLeftoversItem[];
    custom: StatsLeftoversItem[];
  }
): StatsLeftoversItem[] => {
  if (period === 'weekly') return data.weekly;
  if (period === 'monthly') return data.monthly;
  return data.custom;
};

export const getLeftoversFilteredData = (
  baseData: StatsLeftoversItem[],
  mealType: StatsLeftoversMealType,
  menuType: StatsLeftoversMenuType
): StatsLeftoversDisplayItem[] => {
  return baseData.map((item) => {
    let displayAmount = item.amount;

    if (mealType === 'lunch' && menuType === 'all') {
      displayAmount = item.lunch;
    } else if (mealType === 'dinner' && menuType === 'all') {
      displayAmount = item.dinner;
    } else if (mealType === 'all' && menuType !== 'all') {
      if (menuType === 'main') displayAmount = item.main;
      else if (menuType === 'side') displayAmount = item.side;
      else if (menuType === 'soup') displayAmount = item.soup;
    } else if (mealType !== 'all' && menuType !== 'all') {
      const mealRatio = mealType === 'lunch' ? item.lunch / item.amount : item.dinner / item.amount;
      if (menuType === 'main') displayAmount = item.main * mealRatio;
      else if (menuType === 'side') displayAmount = item.side * mealRatio;
      else if (menuType === 'soup') displayAmount = item.soup * mealRatio;
    }

    return {
      ...item,
      displayAmount,
    };
  });
};

export const getLeftoversFilterLabels = (
  period: StatsLeftoversPeriod,
  mealType: StatsLeftoversMealType,
  menuType: StatsLeftoversMenuType,
  labels: {
    period: Record<StatsLeftoversPeriod, string>;
    meal: Record<StatsLeftoversMealType, string>;
    menu: Record<StatsLeftoversMenuType, string>;
  }
): { periodLabel: string; mealLabel: string; menuLabel: string } => {
  return {
    periodLabel: labels.period[period],
    mealLabel: labels.meal[mealType],
    menuLabel: labels.menu[menuType],
  };
};

const buildMenuSplit = (amount: number) => ({
  main: amount * 0.45,
  side: amount * 0.35,
  soup: amount * 0.2,
});

const buildLeftoversSeriesFromPeriod = (
  lunchResponse: MetricLeftoverRatePeriodResponse,
  dinnerResponse: MetricLeftoverRatePeriodResponse
): StatsLeftoversItem[] => {
  const byDate = new Map<string, { lunch?: number; dinner?: number }>();

  lunchResponse.data.daily_data.forEach((entry) => {
    byDate.set(entry.date, { ...(byDate.get(entry.date) ?? {}), lunch: entry.amount_kg });
  });

  dinnerResponse.data.daily_data.forEach((entry) => {
    byDate.set(entry.date, { ...(byDate.get(entry.date) ?? {}), dinner: entry.amount_kg });
  });

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => {
      const lunchAmount = values.lunch ?? 0;
      const dinnerAmount = values.dinner ?? 0;
      const amount = lunchAmount + dinnerAmount;
      const split = buildMenuSplit(amount);

      return {
        date,
        amount,
        lunch: lunchAmount,
        dinner: dinnerAmount,
        main: split.main,
        side: split.side,
        soup: split.soup,
      };
    });
};

export const toLeftoversSeriesByPeriod = (inputs: {
  weeklyLunch: MetricLeftoverRatePeriodResponse;
  weeklyDinner: MetricLeftoverRatePeriodResponse;
  monthlyLunch: MetricLeftoverRatePeriodResponse;
  monthlyDinner: MetricLeftoverRatePeriodResponse;
}): { weekly: StatsLeftoversItem[]; monthly: StatsLeftoversItem[]; custom: StatsLeftoversItem[] } => {
  const weekly = buildLeftoversSeriesFromPeriod(inputs.weeklyLunch, inputs.weeklyDinner);
  const monthly = buildLeftoversSeriesFromPeriod(inputs.monthlyLunch, inputs.monthlyDinner);
  return {
    weekly,
    monthly,
    custom: monthly,
  };
};
