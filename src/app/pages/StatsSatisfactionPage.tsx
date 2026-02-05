import { useEffect, useMemo, useState } from 'react';
import { MessageSquare, Smile, Frown, ThumbsUp } from 'lucide-react';

import { getSatisfactionMetrics } from '../data/metrics';

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
  toSatisfactionKpiMetrics,
} from '../viewModels';
import type { SatisfactionMetricsResponse } from '../viewModels/metrics';

interface StatsSatisfactionPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function StatsSatisfactionPage({ onNavigate }: StatsSatisfactionPageProps) {
  const [metrics, setMetrics] = useState<SatisfactionMetricsResponse | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      const response = await getSatisfactionMetrics();
      if (!isActive) return;
      setMetrics(response);
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
  const reviewList = metrics?.reviewList;
  const { defaultPeriod, defaultMeal } = defaults;
  const [period, setPeriod] = useState<StatsSatisfactionPeriod>(defaultPeriod as StatsSatisfactionPeriod);
  const [meal, setMeal] = useState<StatsSatisfactionMeal>(defaultMeal as StatsSatisfactionMeal);
  const [appliedPeriod, setAppliedPeriod] = useState<StatsSatisfactionPeriod>(defaultPeriod as StatsSatisfactionPeriod);
  const [appliedMeal, setAppliedMeal] = useState<StatsSatisfactionMeal>(defaultMeal as StatsSatisfactionMeal);

  useEffect(() => {
    if (!metrics || isInitialized) return;
    setPeriod(metrics.defaults.defaultPeriod as StatsSatisfactionPeriod);
    setMeal(metrics.defaults.defaultMeal as StatsSatisfactionMeal);
    setAppliedPeriod(metrics.defaults.defaultPeriod as StatsSatisfactionPeriod);
    setAppliedMeal(metrics.defaults.defaultMeal as StatsSatisfactionMeal);
    setIsInitialized(true);
  }, [metrics, isInitialized]);

  const feedbackData = useMemo(
    () => (reviewList ? toFeedbackFromReviewList(reviewList) : []),
    [reviewList]
  );
  const kpiMetrics = useMemo(
    () =>
      countLast30Days
        ? toSatisfactionKpiMetrics(countLast30Days)
        : {
            totalCount: 0,
            positiveCount: 0,
            negativeCount: 0,
            positiveRate: 0,
            negativeRate: 0,
          },
    [countLast30Days]
  );

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

  const handleSearch = () => {
    setAppliedPeriod(period);
    setAppliedMeal(meal);
  };

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
