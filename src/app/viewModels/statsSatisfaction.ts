export type StatsSatisfactionPeriod = 'weekly' | 'monthly';
export type StatsSatisfactionMeal = '전체' | '중식' | '석식';

export type FeedbackItem = {
  id: string | number;
  date: string;
  meal: '중식' | '석식';
  menu: string;
  comment: string;
};

export type MetricSatisCountLast30DaysResponse = {
  status: string;
  message: string;
  data: {
    period: {
      start_date: string;
      end_date: string;
    };
    school_id: number;
    total_count: number;
    positive_count: number;
    negative_count: number;
    neutral_count: number;
  };
};

export type MetricSatisListLast30DaysResponse = {
  status: string;
  message: string;
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
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      page_size: number;
    };
  };
};

export type MetricSatisPositiveCountResponse = {
  status: string;
  message: string;
  data: {
    school_id: number;
    sentiment_label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    count: number;
    period: {
      start_date: string;
      end_date: string;
    };
  };
};

export type MetricSatisNegativeCountResponse = {
  status: string;
  message: string;
  data: {
    school_id: number;
    sentiment_label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    count: number;
    period: {
      start_date: string;
      end_date: string;
    };
  };
};

export type MetricSatisReviewListResponse = {
  status: string;
  message: string;
  data: {
    reviews: Array<{
      review_id: string;
      batch_id: string;
      school_id: number;
      meal_type: 'LUNCH' | 'DINNER';
      date: string;
      rating_5: number;
      sentiment_label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
      sentiment_score: number;
      sentiment_conf: number | null;
      aspect_tags: string[];
      aspect_hints: Record<string, string> | null;
      aspect_details: Record<string, { polarity: string; hint: string }> | null;
      evidence_phrases: Array<string | null>;
      issue_flags: string[];
    }>;
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      page_size: number;
    };
  };
};

export type SatisfactionKpiMetrics = {
  totalCount: number;
  positiveCount: number;
  negativeCount: number;
  positiveRate: number;
  negativeRate: number;
};

const parseDate = (value: string) => new Date(`${value}T00:00:00`);

export const getLatestFeedbackDate = (feedbackData: FeedbackItem[]): Date => {
  if (feedbackData.length === 0) {
    return new Date();
  }
  return feedbackData.reduce((max, item) => {
    const dateValue = parseDate(item.date);
    return dateValue > max ? dateValue : max;
  }, parseDate(feedbackData[0].date));
};

export const getSatisfactionFilteredFeedback = (
  feedbackData: FeedbackItem[],
  appliedPeriod: StatsSatisfactionPeriod,
  appliedMeal: StatsSatisfactionMeal,
  latestDate: Date,
  daysConfig: { weekly: number; monthly: number },
  labels: { period: Record<StatsSatisfactionPeriod, string> }
): { filteredFeedback: FeedbackItem[]; periodLabel: string } => {
  const days = appliedPeriod === 'weekly' ? daysConfig.weekly : daysConfig.monthly;
  const startDate = new Date(latestDate);
  startDate.setDate(startDate.getDate() - (days - 1));

  return {
    filteredFeedback: feedbackData.filter((item) => {
      const dateValue = parseDate(item.date);
      const matchMeal = appliedMeal === '전체' ? true : item.meal === appliedMeal;
      return dateValue >= startDate && matchMeal;
    }),
    periodLabel: labels.period[appliedPeriod],
  };
};

export const getRecentFeedback = (feedback: FeedbackItem[], limit: number): FeedbackItem[] => {
  return feedback.slice(0, limit);
};

export const toFeedbackFromReviewList = (raw: MetricSatisReviewListResponse): FeedbackItem[] =>
  raw.data.reviews.map((review, index) => {
    const firstTag = review.aspect_tags[0];
    const hint =
      review.aspect_hints && firstTag ? review.aspect_hints[firstTag] : undefined;
    const phrase = review.evidence_phrases[0] ?? undefined;

    return {
      id: review.review_id || index,
      date: review.date,
      meal: review.meal_type === 'DINNER' ? '석식' : '중식',
      menu: review.aspect_tags.length > 0 ? review.aspect_tags.join(', ') : '기타',
      comment: phrase || hint || '피드백이 등록되었습니다.',
    };
  });

export const toSatisfactionKpiMetrics = (
  raw: MetricSatisCountLast30DaysResponse
): SatisfactionKpiMetrics => {
  const total = raw.data.total_count || 0;
  const positive = raw.data.positive_count || 0;
  const negative = raw.data.negative_count || 0;
  return {
    totalCount: total,
    positiveCount: positive,
    negativeCount: negative,
    positiveRate: total > 0 ? (positive / total) * 100 : 0,
    negativeRate: total > 0 ? (negative / total) * 100 : 0,
  };
};
