import { useEffect, useMemo, useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

import { getMissedMetrics } from '../data/metrics';

import { KpiCard } from '../components/KpiCard';
import { StatsFilterPanel } from '../components/StatsFilterPanel';
// import { SummaryMissed } from '../components/SummaryMissed';

import {
  StatsMissedMealType,
  StatsMissedPeriod,
  getMissedBaseData,
  getMissedFilterLabels,
  getMissedFilteredData,
  getMissedKpiData,
  toMissedSeriesByPeriod,
} from '../viewModels';
import type { MissedMetricsResponse } from '../viewModels/metrics';
import { useAuth } from '../auth/AuthContext';

export function StatsMissedPage() {
  const { claims, isReady } = useAuth();
  const schoolId = claims?.schoolId;
  const [metrics, setMetrics] = useState<MissedMetricsResponse | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isReady || !schoolId) {
      return;
    }
    let isActive = true;
    const load = async () => {
      const response = await getMissedMetrics(schoolId);
      if (!isActive) return;
      setMetrics(response);
    };
    load();
    return () => {
      isActive = false;
    };
  }, [isReady, schoolId]);

  if (!isReady || !schoolId) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">결식률</h1>
        </div>
        <div className="flex items-center justify-center text-gray-500 py-12">
          데이터를 불러오는 중입니다.
        </div>
      </div>
    );
  }

  const fallbackDefaults = {
    defaultPeriod: 'weekly',
    defaultMealType: 'all',
    defaultStartDate: '',
    defaultEndDate: '',
    targetRate: 0,
    prevMonthAvg: 0,
  };
  const fallbackLabels = {
    period: {
      weekly: '',
      monthly: '',
      custom: '',
    },
    meal: {
      all: '',
      lunch: '',
      dinner: '',
    },
  };
  const defaults = metrics?.defaults ?? fallbackDefaults;
  const labels = metrics?.labels ?? fallbackLabels;

  const { defaultPeriod, defaultMealType, defaultStartDate, defaultEndDate, targetRate, prevMonthAvg } = defaults;
  const missedSeries = useMemo(
    () => {
      if (!metrics) {
        return { weekly: [], monthly: [], custom: [] };
      }
      const { weeklyLunch, weeklyDinner, monthlyLunch, monthlyDinner } = metrics;
      return toMissedSeriesByPeriod({
        weeklyLunch,
        weeklyDinner,
        monthlyLunch,
        monthlyDinner,
      });
    },
    [metrics]
  );

  // Draft 상태 (사용자가 선택 중인 값)
  const [draftPeriod, setDraftPeriod] = useState<StatsMissedPeriod>(defaultPeriod as StatsMissedPeriod);
  const [draftMealType, setDraftMealType] = useState<StatsMissedMealType>(defaultMealType as StatsMissedMealType);
  const [draftStartDate, setDraftStartDate] = useState(defaultStartDate);
  const [draftEndDate, setDraftEndDate] = useState(defaultEndDate);
  
  // Applied 상태 (조회 버튼 클릭 후 실제 적용된 값)
  const [period, setPeriod] = useState<StatsMissedPeriod>(defaultPeriod as StatsMissedPeriod);
  const [mealType, setMealType] = useState<StatsMissedMealType>(defaultMealType as StatsMissedMealType);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  useEffect(() => {
    if (!metrics || isInitialized) return;
    setDraftPeriod(metrics.defaults.defaultPeriod as StatsMissedPeriod);
    setDraftMealType(metrics.defaults.defaultMealType as StatsMissedMealType);
    setDraftStartDate(metrics.defaults.defaultStartDate);
    setDraftEndDate(metrics.defaults.defaultEndDate);
    setPeriod(metrics.defaults.defaultPeriod as StatsMissedPeriod);
    setMealType(metrics.defaults.defaultMealType as StatsMissedMealType);
    setStartDate(metrics.defaults.defaultStartDate);
    setEndDate(metrics.defaults.defaultEndDate);
    setIsInitialized(true);
  }, [metrics, isInitialized]);

  // 조회 버튼 클릭 핸들러
  const handleSearch = () => {
    setPeriod(draftPeriod);
    setMealType(draftMealType);
    setStartDate(draftStartDate);
    setEndDate(draftEndDate);
  };

  // 필터에 따른 데이터 선택
  const baseData = useMemo(() => {
    return getMissedBaseData(period, {
      weekly: missedSeries.weekly,
      monthly: missedSeries.monthly,
      custom: missedSeries.custom,
    });
  }, [period, missedSeries]);

  // 식사 구분에 따른 데이터 변환
  const filteredData = useMemo(() => {
    return getMissedFilteredData(baseData, mealType);
  }, [baseData, mealType]);

  // KPI 계산
  const kpiData = useMemo(() => {
    return getMissedKpiData(filteredData, prevMonthAvg);
  }, [filteredData, prevMonthAvg]);

  const { periodLabel, mealLabel } = useMemo(() => {
    return getMissedFilterLabels(period, mealType, labels);
  }, [period, mealType, labels]);

  // // 자동 해석 분석
  // const analysis = useMemo(() => {
  //   const rates = filteredData.map(d => d.displayRate);
  //   const maxRate = Math.max(...rates);
  //   const maxIndex = rates.indexOf(maxRate);
  //   const maxDate = filteredData[maxIndex].date;
  //   const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
  //   const exceedCount = rates.filter(r => r > targetRate).length;
    
  //   // 변동폭 계산
  //   const variations = rates.slice(1).map((rate, i) => Math.abs(rate - rates[i]));
  //   const maxVariation = Math.max(...variations);
  //   const maxVariationIndex = variations.indexOf(maxVariation);
  //   const variationDate = filteredData[maxVariationIndex + 1].date;

  //   const trend = kpiData.weekChange < 0 ? '감소' : '증가';
  //   const trendColor = kpiData.weekChange < 0 ? 'text-green-600' : 'text-red-600';

  //   return {
  //     trend,
  //     trendColor,
  //     maxDate,
  //     maxRate: maxRate.toFixed(1),
  //     variationDate,
  //     maxVariation: maxVariation.toFixed(1),
  //     exceedCount,
  //     avgRate: avgRate.toFixed(1),
  //   };
  // }, [filteredData, kpiData, targetRate]);

  if (!metrics) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">결식률</h1>
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
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">결식률</h1>
      </div>

      {/* 자동 분석 요약 영역 */}
      {/* <SummaryMissed analysis={analysis} targetRate={targetRate} /> */}

      {/* 조회 조건 필터 영역 */}
      <StatsFilterPanel
        period={draftPeriod}
        onPeriodChange={setDraftPeriod}
        mealType={draftMealType}
        onMealTypeChange={setDraftMealType}
        showCustomDates
        startDate={draftStartDate}
        endDate={draftEndDate}
        onStartDateChange={setDraftStartDate}
        onEndDateChange={setDraftEndDate}
        onSearch={handleSearch}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <KpiCard
          icon={kpiData.todayChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          title="어제 결식률"
          value={kpiData.today.toFixed(1)}
          unit="%"
          sub={`전일 대비 ${kpiData.todayChange > 0 ? '+' : ''}${kpiData.todayChange.toFixed(1)}%`}
          color={kpiData.todayChange > 0 ? 'red' : 'green'}
        />
        <KpiCard
          icon={kpiData.weekChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          title="주간 평균"
          value={kpiData.weekAvg.toFixed(1)}
          unit="%"
          sub={`전주 대비 ${kpiData.weekChange > 0 ? '+' : ''}${kpiData.weekChange.toFixed(1)}%`}
          color={kpiData.weekChange > 0 ? 'red' : 'green'}
        />
        <KpiCard
          icon={kpiData.monthChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          title="월간 평균"
          value={kpiData.monthAvg.toFixed(1)}
          unit="%"
          sub={`전월 대비 ${kpiData.monthChange > 0 ? '+' : ''}${kpiData.monthChange.toFixed(1)}%`}
          color={kpiData.monthChange > 0 ? 'red' : 'green'}
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-medium">일일 결식률 추이</h2>
            <p className="text-sm text-gray-500 mt-1">
              기준선 (목표): {targetRate}% | 현재 선택: {periodLabel} / {mealLabel}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#ff6b6b] rounded-full"></div>
              <span className="text-gray-600">결식률</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-8 h-0.5 border-t-2 border-dashed border-amber-500"></div>
              <span className="text-gray-600">관리 목표</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis 
              tick={{ fontSize: 12 }} 
              label={{ value: '결식률 (%)', angle: -90, position: 'insideLeft' }}
              domain={[0, 12]}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)}%`, '결식률']}
              labelStyle={{ color: '#333' }}
            />
            <Legend />
            {/* 기준선 표시 */}
            <ReferenceLine 
              y={targetRate} 
              stroke="#f59e0b" 
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ value: `목표: ${targetRate}%`, position: 'right', fill: '#f59e0b', fontSize: 12 }}
            />
            <Line 
              type="monotone" 
              dataKey="displayRate" 
              stroke="#ff6b6b" 
              strokeWidth={2}
              dot={{ fill: '#ff6b6b', r: 4 }}
              name="결식률"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
