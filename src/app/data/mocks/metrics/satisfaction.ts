export const mockMetricSatisCountLast30Days = {
  success: true,
  data: {
    period: {
      start_date: '2025-12-29',
      end_date: '2026-01-27',
    },
    school_id: 1,
    total_count: 450,
    positive_count: 380,
    negative_count: 70,
    neutral_count: 0,
  },
  timestamp: '2026-01-28T10:30:00Z',
} as const;

export const mockMetricSatisListLast30Days = {
  success: true,
  data: {
    period: {
      start_date: '2025-12-29',
      end_date: '2026-01-27',
    },
    school_id: 1,
    batches: [
      {
        batch_id: 'batch-2026-01-27-522',
        date: '2026-01-27',
        generated_at: '2026-01-27T18:30:00+09:00',
        model_version: 'sent-v1.2.0-lightml',
        total_reviews: 15,
        average_rating: 4.2,
        positive_count: 12,
        negative_count: 3,
      },
    ],
  },
  pagination: {
    current_page: 1,
    total_pages: 2,
    total_items: 30,
    page_size: 20,
  },
  timestamp: '2026-01-28T10:30:00Z',
} as const;

export const mockMetricSatisPositiveCount = {
  success: true,
  data: {
    school_id: 1,
    sentiment_label: 'POSITIVE',
    count: 380,
    period: {
      start_date: '2026-01-01',
      end_date: '2026-01-27',
    },
  },
  timestamp: '2026-01-28T10:30:00Z',
} as const;

export const mockMetricSatisNegativeCount = {
  success: true,
  data: {
    school_id: 1,
    sentiment_label: 'NEGATIVE',
    count: 70,
    period: {
      start_date: '2026-01-01',
      end_date: '2026-01-27',
    },
  },
  timestamp: '2026-01-28T10:30:00Z',
} as const;

export const mockMetricSatisReviewList = {
  success: true,
  data: {
    reviews: [
      {
        review_id: 'R-20260225-0001',
        batch_id: 'batch-2026-02-25-622',
        school_id: 1,
        meal_type: 'LUNCH',
        date: '2026-02-25',
        rating_5: 4.3,
        sentiment_label: 'POSITIVE',
        sentiment_score: 0.752,
        sentiment_conf: 0.852,
        aspect_tags: ['맛/간', '밥', '국'],
        aspect_hints: {
          '맛/간': '그래도 다른 반찬과는 잘 어울렸어요',
          '밥': '그래도 다른 반찬과는 잘 어울렸어요',
          '국': '그래도 다른 반찬과는 잘 어울렸어요',
        },
        aspect_details: {
          '맛/간': {
            polarity: 'POSITIVE',
            hint: '그래도 다른 반찬과는 잘 어울렸어요',
          },
          '밥': {
            polarity: 'POSITIVE',
            hint: '그래도 다른 반찬과는 잘 어울렸어요',
          },
          '국': {
            polarity: 'POSITIVE',
            hint: '그래도 다른 반찬과는 잘 어울렸어요',
          },
        },
        evidence_phrases: ['그래도 다른 반찬과는 잘 어울렸어요'],
        issue_flags: [],
      },
      {
        review_id: 'R-20260224-0004',
        batch_id: 'batch-2026-02-24-601',
        school_id: 1,
        meal_type: 'DINNER',
        date: '2026-02-24',
        rating_5: 3.1,
        sentiment_label: 'NEGATIVE',
        sentiment_score: 0.231,
        sentiment_conf: 0.703,
        aspect_tags: ['맛/간'],
        aspect_hints: {
          '맛/간': '전체적으로 간이 약했어요',
        },
        aspect_details: {
          '맛/간': {
            polarity: 'NEGATIVE',
            hint: '전체적으로 간이 약했어요',
          },
        },
        evidence_phrases: ['전체적으로 간이 약했어요'],
        issue_flags: ['SEASONING_LIGHT'],
      },
    ],
  },
  pagination: {
    current_page: 1,
    total_pages: 10,
    total_items: 200,
    page_size: 20,
  },
  timestamp: '2026-01-28T10:30:00Z',
} as const;

export const satisfactionDefaults = {
  defaultPeriod: 'weekly',
  defaultMeal: '전체',
};

export const satisfactionConfig = {
  days: {
    weekly: 7,
    monthly: 30,
  },
};

