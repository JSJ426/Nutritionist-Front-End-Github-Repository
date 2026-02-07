import type {
  MetricLeftoverRatePeriodResponse,
  MetricLeftoverRateYesterdayResponse,
} from './statsLeftovers';
import type {
  MetricSkipRatePeriodResponse,
  MetricSkipRateYesterdayResponse,
} from './statsMissed';
import type {
  MetricSatisCountLast30DaysResponse,
  MetricSatisNegativeCountResponse,
  MetricSatisPositiveCountResponse,
  MetricSatisReviewListResponse,
} from './statsSatisfaction';

export type LeftoversMetricsDefaults = {
  defaultPeriod: string;
  defaultMealType: string;
  defaultMenuType: string;
  defaultStartDate: string;
  defaultEndDate: string;
  targetAmount: number;
  prevMonthAvg: number;
};

export type LeftoversMetricsLabels = {
  period: Record<string, string>;
  meal: Record<string, string>;
  menu: Record<string, string>;
};

export type LeftoversMetricsResponse = {
  defaults: LeftoversMetricsDefaults;
  labels: LeftoversMetricsLabels;
  yesterdayLunch: MetricLeftoverRateYesterdayResponse;
  yesterdayDinner: MetricLeftoverRateYesterdayResponse;
  weeklyLunch: MetricLeftoverRatePeriodResponse;
  weeklyDinner: MetricLeftoverRatePeriodResponse;
  monthlyLunch: MetricLeftoverRatePeriodResponse;
  monthlyDinner: MetricLeftoverRatePeriodResponse;
  registerResponse: {
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
  updateResponse: {
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
};

export type MissedMetricsDefaults = {
  defaultPeriod: string;
  defaultMealType: string;
  defaultStartDate: string;
  defaultEndDate: string;
  targetRate: number;
  prevMonthAvg: number;
};

export type MissedMetricsLabels = {
  period: Record<string, string>;
  meal: Record<string, string>;
};

export type MissedMetricsResponse = {
  defaults: MissedMetricsDefaults;
  labels: MissedMetricsLabels;
  yesterdayLunch: MetricSkipRateYesterdayResponse;
  yesterdayDinner: MetricSkipRateYesterdayResponse;
  weeklyLunch: MetricSkipRatePeriodResponse;
  weeklyDinner: MetricSkipRatePeriodResponse;
  monthlyLunch: MetricSkipRatePeriodResponse;
  monthlyDinner: MetricSkipRatePeriodResponse;
  registerResponse: {
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
  updateResponse: {
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
};

export type SatisfactionDefaults = {
  defaultPeriod: string;
  defaultMeal: string;
};

export type SatisfactionConfig = {
  days: {
    weekly: number;
    monthly: number;
  };
};

export type SatisfactionLabels = {
  period: Record<string, string>;
};

export type SatisfactionOption = {
  value: string;
  label: string;
};

export type SatisfactionMetricsResponse = {
  defaults: SatisfactionDefaults;
  config: SatisfactionConfig;
  labels?: SatisfactionLabels;
  periodOptions?: SatisfactionOption[];
  mealOptions?: SatisfactionOption[];
  countLast30Days: MetricSatisCountLast30DaysResponse;
  listLast30Days: {
    success: boolean;
    data: {
      period: {
        start_date: string;
        end_date: string;
      };
      school_id: number;
      batches: Array<{
        batch_id: string;
        date: string;
        generated_at: string;
        model_version: string;
        total_reviews: number;
        average_rating: number;
        positive_count: number;
        negative_count: number;
      }>;
    };
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      page_size: number;
    };
  };
  positiveCount: {
    status: string;
    message: string;
    data: MetricSatisPositiveCountResponse['data'];
  };
  negativeCount: {
    status: string;
    message: string;
    data: MetricSatisNegativeCountResponse['data'];
  };
  reviewList: MetricSatisReviewListResponse;
};
