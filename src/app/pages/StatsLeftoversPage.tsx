import { useEffect, useMemo, useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

import { getLeftoversMetrics } from '../data/metrics';

import { KpiCard } from '../components/KpiCard';
import { StatsFilterPanel } from '../components/StatsFilterPanel';
//import { SummaryLeftovers } from '../components/SummaryLeftovers';

import {
  StatsLeftoversMealType,
  StatsLeftoversMenuType,
  StatsLeftoversPeriod,
  getLeftoversBaseData,
  getLeftoversFilterLabels,
  getLeftoversFilteredData,
  getLeftoversKpiData,
  toLeftoversSeriesByPeriod,
} from '../viewModels';
import type { LeftoversMetricsResponse } from '../viewModels/metrics';
import { useAuth } from '../auth/AuthContext';

export function StatsLeftoversPage() {
  const { claims, isReady } = useAuth();
  const schoolId = claims?.schoolId;
  const [metrics, setMetrics] = useState<LeftoversMetricsResponse | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isReady || !schoolId) {
      return;
    }
    let isActive = true;
    const load = async () => {
      const response = await getLeftoversMetrics(schoolId);
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
          <h1 className="text-2xl font-semibold">잔반량</h1>
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
    defaultMenuType: 'all',
    defaultStartDate: '',
    defaultEndDate: '',
    targetAmount: 0,
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
    menu: {
      all: '',
      main: '',
      side: '',
      soup: '',
    },
  };
  const defaults = metrics?.defaults ?? fallbackDefaults;
  const labels = metrics?.labels ?? fallbackLabels;

  const {
    defaultPeriod,
    defaultMealType,
    defaultMenuType,
    defaultStartDate,
    defaultEndDate,
    targetAmount,
    prevMonthAvg,
  } = defaults;

  // Draft 상태 (사용자가 선택 중인 값)
  const [draftPeriod, setDraftPeriod] = useState<StatsLeftoversPeriod>(defaultPeriod as StatsLeftoversPeriod);
  const [draftMealType, setDraftMealType] = useState<StatsLeftoversMealType>(defaultMealType as StatsLeftoversMealType);
  const [draftMenuType, setDraftMenuType] = useState<StatsLeftoversMenuType>(defaultMenuType as StatsLeftoversMenuType);
  const [draftStartDate, setDraftStartDate] = useState(defaultStartDate);
  const [draftEndDate, setDraftEndDate] = useState(defaultEndDate);
  const [isCustomEnabled, setIsCustomEnabled] = useState(false);
  
  // Applied 상태 (조회 버튼 클릭 후 실제 적용된 값)
  const [period, setPeriod] = useState<StatsLeftoversPeriod>(defaultPeriod as StatsLeftoversPeriod);
  const [mealType, setMealType] = useState<StatsLeftoversMealType>(defaultMealType as StatsLeftoversMealType);
  const [menuType, setMenuType] = useState<StatsLeftoversMenuType>(defaultMenuType as StatsLeftoversMenuType);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const fallbackPeriodForToggleOff = (defaultPeriod === 'custom' ? 'weekly' : defaultPeriod) as StatsLeftoversPeriod;

  useEffect(() => {
    if (!metrics || isInitialized) return;
    const safeDefaultPeriod =
      metrics.defaults.defaultPeriod === 'custom' ? 'weekly' : metrics.defaults.defaultPeriod;
    setDraftPeriod(safeDefaultPeriod as StatsLeftoversPeriod);
    setDraftMealType(metrics.defaults.defaultMealType as StatsLeftoversMealType);
    setDraftMenuType(metrics.defaults.defaultMenuType as StatsLeftoversMenuType);
    setDraftStartDate(metrics.defaults.defaultStartDate);
    setDraftEndDate(metrics.defaults.defaultEndDate);
    setPeriod(safeDefaultPeriod as StatsLeftoversPeriod);
    setMealType(metrics.defaults.defaultMealType as StatsLeftoversMealType);
    setMenuType(metrics.defaults.defaultMenuType as StatsLeftoversMenuType);
    setStartDate(metrics.defaults.defaultStartDate);
    setEndDate(metrics.defaults.defaultEndDate);
    setIsCustomEnabled(false);
    setIsInitialized(true);
  }, [metrics, isInitialized]);

  useEffect(() => {
    if (isCustomEnabled) {
      setDraftPeriod('custom');
      return;
    }
    if (draftPeriod === 'custom') {
      setDraftPeriod(fallbackPeriodForToggleOff);
    }
  }, [isCustomEnabled, draftPeriod, fallbackPeriodForToggleOff]);

  // 조회 버튼 클릭 핸들러
  const handleSearch = () => {
    setPeriod(draftPeriod);
    setMealType(draftMealType);
    setMenuType(draftMenuType);
    setStartDate(draftStartDate);
    setEndDate(draftEndDate);
  };

  const leftoversSeries = useMemo(
    () => {
      if (!metrics) {
        return { weekly: [], monthly: [], custom: [] };
      }
      const { weeklyLunch, weeklyDinner, monthlyLunch, monthlyDinner } = metrics;
      return toLeftoversSeriesByPeriod({
        weeklyLunch,
        weeklyDinner,
        monthlyLunch,
        monthlyDinner,
      });
    },
    [metrics]
  );

  // 필터에 따른 데이터 선택
  const baseData = useMemo(() => {
    return getLeftoversBaseData(period, {
      weekly: leftoversSeries.weekly,
      monthly: leftoversSeries.monthly,
      custom: leftoversSeries.custom,
    });
  }, [period, leftoversSeries]);

  // 식사 구분 및 메뉴 유형에 따른 데이터 변환
  const filteredData = useMemo(() => {
    return getLeftoversFilteredData(baseData, mealType, menuType);
  }, [baseData, mealType, menuType]);

  // KPI 계산
  const kpiData = useMemo(() => {
    return getLeftoversKpiData(filteredData, prevMonthAvg);
  }, [filteredData, prevMonthAvg]);

  const { periodLabel, mealLabel, menuLabel } = useMemo(() => {
    return getLeftoversFilterLabels(period, mealType, menuType, labels);
  }, [period, mealType, menuType, labels]);

  // // 자동 해석 분석
  // const analysis = useMemo(() => {
  //   const amounts = filteredData.map(d => d.displayAmount);
  //   const maxAmount = Math.max(...amounts);
  //   const maxIndex = amounts.indexOf(maxAmount);
  //   const maxDate = filteredData[maxIndex].date;
  //   const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  //   const exceedCount = amounts.filter(a => a > targetAmount).length;
    
  //   // 변동폭 계산
  //   const variations = amounts.slice(1).map((amount, i) => Math.abs(amount - amounts[i]));
  //   const maxVariation = Math.max(...variations);
  //   const maxVariationIndex = variations.indexOf(maxVariation);
  //   const variationDate = filteredData[maxVariationIndex + 1].date;

  //   const trend = kpiData.weekChange < 0 ? '감소' : '증가';
  //   const trendColor = kpiData.weekChange < 0 ? 'text-green-600' : 'text-red-600';

  //   return {
  //     trend,
  //     trendColor,
  //     maxDate,
  //     maxAmount: maxAmount.toFixed(1),
  //     variationDate,
  //     maxVariation: maxVariation.toFixed(1),
  //     exceedCount,
  //     avgAmount: avgAmount.toFixed(1),
  //   };
  // }, [filteredData, kpiData, targetAmount]);

  if (!metrics) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">잔반량</h1>
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
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">잔반량</h1>
      </div>

      {/* 자동 분석 요약 영역 */}
      {/* <SummaryLeftovers analysis={analysis} targetAmount={targetAmount} /> */}

      {/* 조회 조건 필터 영역 */}
      <StatsFilterPanel
        period={draftPeriod}
        onPeriodChange={setDraftPeriod}
        mealType={draftMealType}
        onMealTypeChange={setDraftMealType}
        onSearch={handleSearch}
      />
      {/* <StatsFilterPanel
        period={draftPeriod}
        onPeriodChange={setDraftPeriod}
        mealType={draftMealType}
        onMealTypeChange={setDraftMealType}
        menuType={draftMenuType}
        onMenuTypeChange={setDraftMenuType}
        showMenuType
        showCustomDates
        startDate={draftStartDate}
        endDate={draftEndDate}
        onStartDateChange={setDraftStartDate}
        onEndDateChange={setDraftEndDate}
        onSearch={handleSearch}
      /> */}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <KpiCard
          icon={kpiData.todayChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          title="어제 잔반량"
          value={kpiData.today.toFixed(1)}
          unit="kg"
          diff={`${kpiData.todayChange > 0 ? '+' : ''}${kpiData.todayChange.toFixed(1)}kg`}
          trend={kpiData.todayChange > 0 ? 'up' : kpiData.todayChange < 0 ? 'down' : 'same'}
          showDiff
          showDiffLabel
          diffPrefix="전일"
          subMode="diff"
          color={kpiData.todayChange > 0 ? 'red' : 'green'}
        />
        <KpiCard
          icon={kpiData.weekChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          title="7일 평균"
          value={kpiData.weekAvg.toFixed(1)}
          unit="kg"
          diff={`${kpiData.weekChange > 0 ? '+' : ''}${kpiData.weekChange.toFixed(1)}kg`}
          trend={kpiData.weekChange > 0 ? 'up' : kpiData.weekChange < 0 ? 'down' : 'same'}
          showDiff
          showDiffLabel
          diffPrefix="전주"
          subMode="diff"
          color={kpiData.weekChange > 0 ? 'red' : 'green'}
        />
        <KpiCard
          icon={kpiData.monthChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          title="30일 평균"
          value={kpiData.monthAvg.toFixed(1)}
          unit="kg"
          diff={`${kpiData.monthChange > 0 ? '+' : ''}${kpiData.monthChange.toFixed(1)}kg`}
          trend={kpiData.monthChange > 0 ? 'up' : kpiData.monthChange < 0 ? 'down' : 'same'}
          showDiff
          showDiffLabel
          diffPrefix="전월"
          subMode="diff"
          color={kpiData.monthChange > 0 ? 'red' : 'green'}
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-medium">일일 잔반량 추이</h2>
            <p className="text-sm text-gray-500 mt-1">
              기준선 (목표): {targetAmount}kg | 현재 선택: {periodLabel} / {mealLabel} / {menuLabel}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#ff9f43] rounded"></div>
              <span className="text-gray-600">잔반량</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-8 h-0.5 border-t-2 border-dashed border-blue-500"></div>
              <span className="text-gray-600">관리 목표</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis 
              tick={{ fontSize: 12 }} 
              label={{ value: '잔반량 (kg)', angle: -90, position: 'insideLeft' }}
              domain={[0, 70]}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)}kg`, '잔반량']}
              labelStyle={{ color: '#333' }}
            />
            <Legend />
            {/* 기준선 표시 */}
            <ReferenceLine 
              y={targetAmount} 
              stroke="#3b82f6" 
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ value: `목표: ${targetAmount}kg`, position: 'right', fill: '#3b82f6', fontSize: 12 }}
            />
            <Bar 
              dataKey="displayAmount" 
              fill="#ff9f43"
              radius={[4, 4, 0, 0]}
              name="잔반량"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
