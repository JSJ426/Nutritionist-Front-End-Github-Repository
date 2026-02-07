import { useEffect, useMemo, useState } from 'react';
import { MessageSquare, Smile, Frown, ThumbsUp } from 'lucide-react';

import {
  getSatisfactionMetrics,
  getSatisfactionNegativeCount,
  getSatisfactionPositiveCount,
  getSatisfactionReviewList,
} from '../data/metrics';

import { KpiCard } from '../components/KpiCard';
import { FeedbackItem } from '../components/FeedbackItem';
import { StatsFilterPanel } from '../components/StatsFilterPanel';

import {
  StatsSatisfactionMeal,
  StatsSatisfactionPeriod,
  getLatestFeedbackDate,
  getRecentFeedback,
  getSatisfactionFilteredFeedback,
  toFeedbackFromReviewList,
} from '../viewModels';
import type { SatisfactionMetricsResponse } from '../viewModels/metrics';
import type { MetricSatisReviewListResponse } from '../viewModels/statsSatisfaction';

interface StatsSatisfactionPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function StatsSatisfactionPage({ onNavigate }: StatsSatisfactionPageProps) {
  const [metrics, setMetrics] = useState<SatisfactionMetricsResponse | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [filteredReviewList, setFilteredReviewList] = useState<MetricSatisReviewListResponse | null>(null);
  const [filteredPositiveCount, setFilteredPositiveCount] =
    useState<SatisfactionMetricsResponse['positiveCount'] | null>(null);
  const [filteredNegativeCount, setFilteredNegativeCount] =
    useState<SatisfactionMetricsResponse['negativeCount'] | null>(null);

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      const response = await getSatisfactionMetrics();
      if (!isActive) return;
      setMetrics(response);
      console.log('[satisfaction][init] countLast30Days.period', response.countLast30Days?.data?.period);
      console.log('[satisfaction][init] reviewList.total_items', response.reviewList?.data?.pagination?.total_items);
    };
    load();
    return () => {
      isActive = false;
    };
  }, []);

  const fallbackDefaults = {
    defaultPeriod: 'weekly',
    defaultMeal: '전체',
  };
  const fallbackLabels = {
    period: {
      weekly: '',
      monthly: '',
    },
  };
  const defaults = metrics?.defaults ?? fallbackDefaults;
  const labels = metrics?.labels ?? fallbackLabels;
  const config = metrics?.config;
  const periodOptions = metrics?.periodOptions ?? [];
  const mealOptions = metrics?.mealOptions ?? [];
  const countLast30Days = metrics?.countLast30Days;
  const reviewList = filteredReviewList ?? metrics?.reviewList;
  const { defaultPeriod, defaultMeal } = defaults;
  const [period, setPeriod] = useState<StatsSatisfactionPeriod>(defaultPeriod as StatsSatisfactionPeriod);
  const [meal, setMeal] = useState<StatsSatisfactionMeal>(defaultMeal as StatsSatisfactionMeal);
  const [appliedPeriod, setAppliedPeriod] = useState<StatsSatisfactionPeriod>(defaultPeriod as StatsSatisfactionPeriod);
  const [appliedMeal, setAppliedMeal] = useState<StatsSatisfactionMeal>(defaultMeal as StatsSatisfactionMeal);

  const feedbackData = useMemo(
    () => (reviewList ? toFeedbackFromReviewList(reviewList) : []),
    [reviewList]
  );
  const kpiMetrics = useMemo(() => {
    if (!countLast30Days) {
      return {
        totalCount: 0,
        positiveCount: 0,
        negativeCount: 0,
        positiveRate: 0,
        negativeRate: 0,
      };
    }
    const totalCount =
      filteredReviewList?.data?.pagination?.total_items ??
      countLast30Days.data.total_count ??
      0;
    const positiveCount =
      filteredPositiveCount?.data?.count ?? countLast30Days.data.positive_count ?? 0;
    const negativeCount =
      filteredNegativeCount?.data?.count ?? countLast30Days.data.negative_count ?? 0;
    const safeTotal = Number(totalCount) || 0;
    return {
      totalCount: safeTotal,
      positiveCount,
      negativeCount,
      positiveRate: safeTotal > 0 ? (positiveCount / safeTotal) * 100 : 0,
      negativeRate: safeTotal > 0 ? (negativeCount / safeTotal) * 100 : 0,
    };
  }, [countLast30Days, filteredNegativeCount, filteredPositiveCount, filteredReviewList]);

  const satisfactionKpis = useMemo(
    () => [
      {
        title: '전체 리뷰 수',
        value: kpiMetrics.totalCount,
        unit: '건',
        sub: '최근 30일 기준',
        icon: <MessageSquare className="w-4 h-4" />,
      },
      {
        title: '긍정 비율',
        value: kpiMetrics.positiveRate.toFixed(1),
        unit: '%',
        sub: `긍정 ${kpiMetrics.positiveCount}건`,
        color: 'green',
        icon: <Smile className="w-4 h-4" />,
      },
      {
        title: '부정 비율',
        value: kpiMetrics.negativeRate.toFixed(1),
        unit: '%',
        sub: `부정 ${kpiMetrics.negativeCount}건`,
        color: 'red',
        icon: <Frown className="w-4 h-4" />,
      }
    ],
    [kpiMetrics]
  );

  const resolvePeriodRange = (
    baseEndDate: Date,
    rangePeriod: StatsSatisfactionPeriod,
    configDays?: { weekly: number; monthly: number }
  ) => {
    if (!configDays) {
      return { start: baseEndDate, end: baseEndDate };
    }
    const days = rangePeriod === 'weekly' ? configDays.weekly : configDays.monthly;
    const end = new Date(baseEndDate);
    const start = new Date(baseEndDate);
    start.setDate(start.getDate() - (days - 1));
    return { start, end };
  };

  const formatYmd = (value: Date) => {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const resolveBaseEndDate = () => {
    const endDateStr = countLast30Days?.data?.period?.end_date;
    if (!endDateStr) return new Date();
    const parsed = new Date(`${endDateStr}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const runSearch = async (nextPeriod: StatsSatisfactionPeriod, nextMeal: StatsSatisfactionMeal) => {
    setAppliedPeriod(nextPeriod);
    setAppliedMeal(nextMeal);

    if (!config || !countLast30Days) {
      return;
    }

    const baseEndDate = resolveBaseEndDate();
    const { start, end } = resolvePeriodRange(baseEndDate, nextPeriod, config.days);
    const startDate = formatYmd(start);
    const endDate = formatYmd(end);

    const [reviewResponse, positiveResponse, negativeResponse] = await Promise.all([
      getSatisfactionReviewList({
        start_date: startDate,
        end_date: endDate,
        page: 1,
        size: 20,
      }),
      getSatisfactionPositiveCount(startDate, endDate),
      getSatisfactionNegativeCount(startDate, endDate),
    ]);

    console.log('[satisfaction][search] range', { startDate, endDate });
    console.log('[satisfaction][search] review.total_items', reviewResponse?.data?.pagination?.total_items);
    console.log('[satisfaction][search] review.items.length', reviewResponse?.data?.reviews?.length);
    console.log('[satisfaction][search] positive.count', positiveResponse?.data?.count);
    console.log('[satisfaction][search] negative.count', negativeResponse?.data?.count);
    console.log('[satisfaction][search] positive.period', positiveResponse?.data?.period);
    console.log('[satisfaction][search] negative.period', negativeResponse?.data?.period);

    setFilteredReviewList(reviewResponse);
    setFilteredPositiveCount(positiveResponse);
    setFilteredNegativeCount(negativeResponse);
  };

  const handleSearch = () => runSearch(period, meal);

  useEffect(() => {
    if (!metrics || isInitialized) return;
    const nextPeriod = metrics.defaults.defaultPeriod as StatsSatisfactionPeriod;
    const nextMeal = metrics.defaults.defaultMeal as StatsSatisfactionMeal;
    setPeriod(nextPeriod);
    setMeal(nextMeal);
    runSearch(nextPeriod, nextMeal);
    setIsInitialized(true);
  }, [metrics, isInitialized]);

  const latestDate = useMemo(() => {
    return getLatestFeedbackDate(feedbackData);
  }, [feedbackData]);

  const { filteredFeedback, periodLabel } = useMemo(() => {
    if (!config) {
      return { filteredFeedback: [], periodLabel: '' };
    }
    return getSatisfactionFilteredFeedback(
      feedbackData,
      appliedPeriod,
      appliedMeal,
      latestDate,
      config.days,
      labels
    );
  }, [appliedMeal, appliedPeriod, config, feedbackData, labels, latestDate]);

  const recentFeedback = useMemo(
    () => getRecentFeedback(filteredFeedback, config?.recentLimit ?? 0),
    [config?.recentLimit, filteredFeedback]
  );

  if (!metrics) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">만족도</h1>
        </div>
        <div className="flex items-center justify-center text-gray-500 py-12">
          데이터를 불러오는 중입니다.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">만족도</h1>
      </div>

      {/* Section 1: 조회 조건 */}
      <StatsFilterPanel
        period={period}
        onPeriodChange={(value) => setPeriod(value as 'weekly' | 'monthly')}
        mealType={meal}
        onMealTypeChange={(value) => setMeal(value as '전체' | '중식' | '석식')}
        onSearch={handleSearch}
        periodOptions={periodOptions}
        mealOptions={mealOptions}
      />

      {/* Section 2: KPI Card들 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {satisfactionKpis.map((kpi) => (
          <KpiCard
            key={kpi.title}
            icon={kpi.icon}
            title={kpi.title}
            value={kpi.value}
            unit={kpi.unit}
            sub={kpi.sub}
            color={kpi.color}
          />
        ))}
      </div>

      {/* Section 3: 최근 피드백 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="text-[#5dccb4]" size={22} />
          <div>
            <h2 className="text-xl font-medium">최근 피드백</h2>
            <p className="text-sm text-gray-500">{periodLabel} · {appliedMeal}</p>
          </div>
        </div>

        <div className="space-y-4">
          {recentFeedback.map((item) => (
            <FeedbackItem key={item.id} item={item} />
          ))}
        </div>

        {recentFeedback.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            해당 조건의 피드백이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
