import { useEffect, useState } from 'react';
import { MessageSquare, ThumbsUp, Star, ThumbsDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { fetchMealPlanMenuDetail, fetchMealPlanWeekly } from '../data/mealplan';
import { getLeftoversMetrics, getMissedMetrics, getSatisfactionMetrics } from '../data/metrics';

import { KpiCard } from '../components/KpiCard';
import { KpiMiniCard } from '../components/KpiMiniCard';

import { getSeriesKpiData } from '../viewModels';
import { toLeftoversSeriesByPeriod } from '../viewModels/statsLeftovers';
import { toMissedSeriesByPeriod } from '../viewModels/statsMissed';
import { toHomeMealFromDetailResponse, toHomeMealsFromWeeklyResponse } from '../viewModels/meal';
import { toSatisfactionKpiMetrics } from '../viewModels/statsSatisfaction';
import type { MealPlanDetailResponse, MealPlanWeeklyResponse } from '../viewModels/meal';
import type {
  LeftoversMetricsResponse,
  MissedMetricsResponse,
  SatisfactionMetricsResponse,
} from '../viewModels/metrics';
import { useAuth } from '../auth/AuthContext';

export function HomePage() {
  const { claims, isReady } = useAuth();
  const schoolId = claims?.schoolId;
  const [mealPlanWeeklyResponse, setMealPlanWeeklyResponse] = useState<MealPlanWeeklyResponse | null>(null);
  const [todayLunchDetail, setTodayLunchDetail] = useState<MealPlanDetailResponse | null>(null);
  const [todayDinnerDetail, setTodayDinnerDetail] = useState<MealPlanDetailResponse | null>(null);
  const [leftoversMetrics, setLeftoversMetrics] = useState<LeftoversMetricsResponse | null>(null);
  const [missedMetrics, setMissedMetrics] = useState<MissedMetricsResponse | null>(null);
  const [satisfactionMetricsSource, setSatisfactionMetricsSource] = useState<SatisfactionMetricsResponse | null>(null);

  useEffect(() => {
    if (!isReady || !schoolId) {
      return;
    }
    let isActive = true;
    const load = async () => {
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      const today = new Date();
      const todayYmd = formatDate(today);
      const daysSinceMonday = (today.getDay() + 6) % 7;
      const monday = new Date(today);
      monday.setDate(today.getDate() - daysSinceMonday);
      const mondayYmd = formatDate(monday);

      const safeFetchMenuDetail = async (date: string, mealType: 'LUNCH' | 'DINNER') => {
        try {
          return await fetchMealPlanMenuDetail(date, mealType);
        } catch (error) {
          console.error(`Failed to load meal detail (${mealType}) for ${date}:`, error);
          return null;
        }
      };
      const safeFetchWeekly = async (date?: string) => {
        try {
          return await fetchMealPlanWeekly(date);
        } catch (error) {
          console.error(`Failed to load weekly meal plan for ${date ?? 'current week'}:`, error);
          return null;
        }
      };

      const [
        weeklyResponse,
        lunchDetail,
        dinnerDetail,
        leftoversResponse,
        missedResponse,
        satisfactionResponse,
      ] = await Promise.all([
        safeFetchWeekly(mondayYmd),
        safeFetchMenuDetail(todayYmd, 'LUNCH'),
        safeFetchMenuDetail(todayYmd, 'DINNER'),
        getLeftoversMetrics(schoolId),
        getMissedMetrics(schoolId),
        getSatisfactionMetrics(),
      ]);
      if (!isActive) return;
      setMealPlanWeeklyResponse(weeklyResponse);
      setTodayLunchDetail(lunchDetail);
      setTodayDinnerDetail(dinnerDetail);
      setLeftoversMetrics(leftoversResponse);
      setMissedMetrics(missedResponse);
      setSatisfactionMetricsSource(satisfactionResponse);
    };
    load();
    return () => {
      isActive = false;
    };
  }, [isReady, schoolId]);

  if (!isReady || !schoolId || !leftoversMetrics || !missedMetrics || !satisfactionMetricsSource) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">HOME</h1>
        </div>
        <div className="flex items-center justify-center text-gray-500 py-12">
          데이터를 불러오는 중입니다.
        </div>
      </div>
    );
  }

  // 현재 날짜 정보 (오늘의 식단 응답 기준)
  const resolveTodayDate = () => {
    const fallback = new Date();
    const lunchDate = todayLunchDetail?.data?.date;
    const dinnerDate = todayDinnerDetail?.data?.date;
    const dateStr = lunchDate || dinnerDate;
    if (!dateStr) return fallback;
    const parsed = new Date(`${dateStr}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? fallback : parsed;
  };

  //const displayDate = new Date('2026-03-03T00:00:00');
  const displayDate = resolveTodayDate();
  const currentMonth = displayDate.getMonth() + 1;
  const currentDate = displayDate.getDate();

  const leftoversSeries = toLeftoversSeriesByPeriod({
    weeklyLunch: leftoversMetrics.weeklyLunch,
    weeklyDinner: leftoversMetrics.weeklyDinner,
    monthlyLunch: leftoversMetrics.monthlyLunch,
    monthlyDinner: leftoversMetrics.monthlyDinner,
  });

  const missedSeries = toMissedSeriesByPeriod({
    weeklyLunch: missedMetrics.weeklyLunch,
    weeklyDinner: missedMetrics.weeklyDinner,
    monthlyLunch: missedMetrics.monthlyLunch,
    monthlyDinner: missedMetrics.monthlyDinner,
  });

  const leftoversWeeklyData = leftoversSeries.weekly;
  const missedWeeklyData = missedSeries.weekly;

  const dayLabel = (date: Date) => ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  const buildEmptyWeeklyMeals = (baseDate: Date) => {
    const monday = new Date(baseDate);
    const daysSinceMonday = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - daysSinceMonday);
    return Array.from({ length: 5 }, (_, idx) => {
      const dateObj = new Date(monday);
      dateObj.setDate(monday.getDate() + idx);
      return {
        day: dayLabel(dateObj),
        date: dateObj.getDate(),
        lunch: { menu: [] },
        dinner: { menu: [] },
      };
    });
  };
  const emptyTodayMeals = {
    lunch: toHomeMealFromDetailResponse(null),
    dinner: toHomeMealFromDetailResponse(null),
  };
  const { todayMeals: weeklyTodayMeals, weeklyMeals } = mealPlanWeeklyResponse
    ? toHomeMealsFromWeeklyResponse(mealPlanWeeklyResponse)
    : { todayMeals: emptyTodayMeals, weeklyMeals: buildEmptyWeeklyMeals(displayDate) };
  const todayMeals = {
    lunch: todayLunchDetail ? toHomeMealFromDetailResponse(todayLunchDetail) : weeklyTodayMeals.lunch,
    dinner: todayDinnerDetail ? toHomeMealFromDetailResponse(todayDinnerDetail) : weeklyTodayMeals.dinner,
  };
  const hasTodayLunch = todayMeals.lunch.menu.length > 0;
  const hasTodayDinner = todayMeals.dinner.menu.length > 0;
  
  const foodWasteData = leftoversWeeklyData.map((item) => ({
    date: item.date,
    중식: item.lunch,
    석식: item.dinner,
  }));

  const absenteeData = missedWeeklyData.map((item) => ({
    date: item.date,
    중식: item.lunch,
    석식: item.dinner,
  }));

  const wasteSeries = leftoversWeeklyData.map((item) => item.amount);
  const absenteeSeries = missedWeeklyData.map((item) => item.rate);
  const wasteKpi = getSeriesKpiData(wasteSeries, leftoversMetrics.defaults.prevMonthAvg);
  const absenteeKpi = getSeriesKpiData(absenteeSeries, missedMetrics.defaults.prevMonthAvg);
  const satisfactionMetrics = toSatisfactionKpiMetrics(satisfactionMetricsSource.countLast30Days);
  const satisfactionBatches = satisfactionMetricsSource.listLast30Days?.data?.batches ?? [];
  const isWasteEmpty = leftoversWeeklyData.length === 0;
  const isMissedEmpty = missedWeeklyData.length === 0;
  const isSatisfactionEmpty = satisfactionBatches.length === 0;
  const parseDate = (value: string) => new Date(`${value}T00:00:00`);
  const getStatsInRange = (startDate: Date, endDate: Date) => {
    const stats = satisfactionBatches.reduce(
      (acc, item) => {
        const dateValue = parseDate(item.date);
        if (dateValue < startDate || dateValue > endDate) return acc;
        acc.totalReviews += item.total_reviews;
        acc.weightedRating += item.average_rating * item.total_reviews;
        acc.positiveCount += item.positive_count;
        acc.negativeCount += item.negative_count;
        return acc;
      },
      {
        totalReviews: 0,
        weightedRating: 0,
        positiveCount: 0,
        negativeCount: 0,
      }
    );
    return {
      totalReviews: stats.totalReviews,
      averageRating: stats.totalReviews > 0 ? stats.weightedRating / stats.totalReviews : 0,
      positiveCount: stats.positiveCount,
      negativeCount: stats.negativeCount,
    };
  };
  const endDateValue =
    satisfactionMetricsSource.listLast30Days?.data?.period?.end_date ??
    satisfactionMetricsSource.countLast30Days?.data?.period?.end_date;
  const latestDate = endDateValue ? parseDate(endDateValue) : new Date();
  const weeklyStartDate = new Date(latestDate);
  weeklyStartDate.setDate(weeklyStartDate.getDate() - 6);
  const prevWeekEndDate = new Date(weeklyStartDate);
  prevWeekEndDate.setDate(prevWeekEndDate.getDate() - 1);
  const prevWeekStartDate = new Date(prevWeekEndDate);
  prevWeekStartDate.setDate(prevWeekStartDate.getDate() - 6);

  const weeklyStats = getStatsInRange(weeklyStartDate, latestDate);
  const prevWeekStats = getStatsInRange(prevWeekStartDate, prevWeekEndDate);
  const weeklyAvgRating = weeklyStats.averageRating;
  const weeklyAvgDiff = weeklyAvgRating - prevWeekStats.averageRating;
  const weeklyPositiveRate =
    weeklyStats.totalReviews > 0 ? (weeklyStats.positiveCount / weeklyStats.totalReviews) * 100 : 0;
  const weeklyNegativeRate =
    weeklyStats.totalReviews > 0 ? (weeklyStats.negativeCount / weeklyStats.totalReviews) * 100 : 0;
  const formatNumber = (value: number) => new Intl.NumberFormat('ko-KR').format(value);

  const satisfactionKpis = [
    {
      title: '이번 주 평균 만족도',
      value: weeklyAvgRating.toFixed(1),
      unit: '/ 5.0',
      sub: `전주 대비 ${weeklyAvgDiff >= 0 ? '+' : ''}${weeklyAvgDiff.toFixed(1)}`,
      color: 'yellow' as const,
      icon: <Star className="w-4 h-4" />,
    },
    {
      title: '만족도 평가 수',
      value: formatNumber(weeklyStats.totalReviews),
      unit: '건',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      title: '긍정 피드백',
      value: formatNumber(weeklyStats.positiveCount),
      unit: '건',
      sub: `${weeklyPositiveRate.toFixed(0)}%`,
      color: 'green' as const,
      icon: <ThumbsUp className="w-4 h-4" />,
    },
    {
      title: '부정 피드백',
      value: formatNumber(weeklyStats.negativeCount),
      unit: '건',
      sub: `${weeklyNegativeRate.toFixed(0)}%`,
      color: 'red' as const,
      icon: <ThumbsDown className="w-4 h-4" />,
    },
  ];

  const formatKpiValue = (value: number) => value.toFixed(1);
  const formatKpiDiff = (value: number, unit: string) =>
    `${value > 0 ? '+' : ''}${value.toFixed(1)}${unit}`;
  const getTrend = (value: number) => (value > 0 ? 'up' : value < 0 ? 'down' : 'same');

  return (
    <div className="p-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">HOME</h1>
      </div>

      {/* 상단 카드 섹션 */}
      <div className="flex gap-6 mb-6">
        {/* 오늘의 중식/석식 - 25% */}
        <div className="bg-white rounded-lg shadow-md p-6" style={{ width: '25%' }}>
          <h2 className="text-xl font-medium mb-4 pb-2 border-b-2 border-[#5dccb4]">
            오늘의 식단 <span className="text-base text-gray-600">({currentMonth}월 {currentDate}일)</span>
          </h2>
          
          <div className="space-y-4">
            {/* 중식 카드 */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-base font-medium mb-3 text-orange-700 pb-2 border-b border-orange-200">중식</h3>
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-gray-800">
                    {hasTodayLunch ? todayMeals.lunch.menu.join(', ') : '등록된 식단이 없습니다.'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">
                    칼로리: {hasTodayLunch ? `${todayMeals.lunch.calories} kcal` : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">
                    (영양성분)
                  </div>
                  <div className="text-xs text-gray-600">
                    단백질 {hasTodayLunch ? todayMeals.lunch.nutrients.protein : '-'}, 탄수화물 {hasTodayLunch ? todayMeals.lunch.nutrients.carbs : '-'}, 지방 {hasTodayLunch ? todayMeals.lunch.nutrients.fat : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">알레르기 유발 식품</div>
                  <div className="text-sm text-red-600">
                    {hasTodayLunch ? todayMeals.lunch.allergens.join(', ') : '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* 석식 카드 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-base font-medium mb-3 text-blue-700 pb-2 border-b border-blue-200">석식</h3>
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-gray-800">
                    {hasTodayDinner ? todayMeals.dinner.menu.join(', ') : '등록된 식단이 없습니다.'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">
                    칼로리: {hasTodayDinner ? `${todayMeals.dinner.calories} kcal` : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">
                    (영양성분)
                  </div>
                  <div className="text-xs text-gray-600">
                    단백질 {hasTodayDinner ? todayMeals.dinner.nutrients.protein : '-'}, 탄수화물 {hasTodayDinner ? todayMeals.dinner.nutrients.carbs : '-'}, 지방 {hasTodayDinner ? todayMeals.dinner.nutrients.fat : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">알레르기 유발 식품</div>
                  <div className="text-sm text-red-600">
                    {hasTodayDinner ? todayMeals.dinner.allergens.join(', ') : '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 이 주의 식단표 - 75% */}
        <div className="bg-white rounded-lg shadow-md p-6" style={{ width: '75%' }}>
        <h2 className="text-xl font-medium mb-4 pb-2 border-b-2 border-[#5dccb4]">
          이 주의 식단표
        </h2>
      
        {/* 스크롤 컨테이너 */}
        <div className="overflow-x-auto">
          <div
            className="
              flex
              flex-nowrap
              gap-3
              justify-center   // 가로 중앙
              items-center     // 세로 중앙
              min-h-[400px]    // Tailwind 방식 권장
            "
          >
            {weeklyMeals.map((dayMeal, idx) => {
              const isToday = dayMeal.date === currentDate;
              return (
                <div
                  key={idx}
                  className={`flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${
                    isToday ? 'border-[#5dccb4] shadow-2xl' : 'border-gray-200'
                  }`}
                  style={{
                    width: isToday ? '176px' : '184px',
                    transform: isToday ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                    {/* Day Header */}
                    <div className={`text-white text-center py-2 font-medium ${
                      isToday ? 'bg-[#5dccb4]' : 'bg-[#5dccb4]'
                    }`}>
                      {dayMeal.day}요일 <span className="text-sm">({currentMonth}월 {dayMeal.date}일)</span>
                    </div>
                    
                    {/* Meal Content */}
                    <div className={`p-3 flex flex-col ${isToday ? 'bg-[#5dccb4]/5' : ''}`}>
                      {/* 중식 */}
                      <div className="pb-3 border-b border-gray-200 flex flex-col">
                        <div className="h-6 mb-2 flex items-center justify-between flex-shrink-0">
                          <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                            중식
                          </span>
                        </div>
                        <div className="text-sm text-gray-800 leading-relaxed space-y-1 flex-1">
                          {dayMeal.lunch.menu.length === 0 ? (
                            <div className="text-xs text-gray-400">식단 없음</div>
                          ) : (
                            dayMeal.lunch.menu.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-start gap-1.5">
                                <span className="text-xs">{item.name}</span>
                                {item.allergy.length > 0 && (
                                  <span className="text-xs text-gray-600 bg-[#FCE8E6] px-1 py-0.5 rounded flex-shrink-0">
                                    {item.allergy.join(',')}
                                  </span>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* 석식 */}
                      <div className="pt-3 flex flex-col">
                        <div className="h-6 mb-2 flex items-center justify-between flex-shrink-0">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            석식
                          </span>
                        </div>
                        <div className="text-sm text-gray-800 leading-relaxed space-y-1 flex-1">
                          {dayMeal.dinner.menu.length === 0 ? (
                            <div className="text-xs text-gray-400">식단 없음</div>
                          ) : (
                            dayMeal.dinner.menu.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-start gap-1.5">
                                <span className="text-xs">{item.name}</span>
                                {item.allergy.length > 0 && (
                                  <span className="text-xs text-gray-600 bg-[#FCE8E6] px-1 py-0.5 rounded flex-shrink-0">
                                    {item.allergy.join(',')}
                                  </span>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 카드 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 결식률 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-medium mb-4 pb-2 border-b-2 border-[#5dccb4]">결식률</h2>
          
          {/* 결식률 KPI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <KpiMiniCard
              title="어제 결식률"
              value={formatKpiValue(absenteeKpi.today)}
              unit="%"
              diff={formatKpiDiff(absenteeKpi.todayChange, '%')}
              trend={getTrend(absenteeKpi.todayChange)}
              isEmpty={isMissedEmpty}
            />
            <KpiMiniCard
              title="주간 평균"
              value={formatKpiValue(absenteeKpi.weekAvg)}
              unit="%"
              diff={formatKpiDiff(absenteeKpi.weekChange, '%')}
              trend={getTrend(absenteeKpi.weekChange)}
              isEmpty={isMissedEmpty}
            />
            <KpiMiniCard
              title="월간 평균"
              value={formatKpiValue(absenteeKpi.monthAvg)}
              unit="%"
              diff={formatKpiDiff(absenteeKpi.monthChange, '%')}
              trend={getTrend(absenteeKpi.monthChange)}
              isEmpty={isMissedEmpty}
            />
          </div>

          {/* 결식률 그래프 */}
          {isMissedEmpty ? (
            <div className="h-64 flex items-center justify-center text-sm text-gray-500 bg-gray-50 border border-dashed rounded-lg">
              데이터가 없습니다.
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={absenteeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="중식" stroke="#5dccb4" strokeWidth={2} />
                  <Line type="monotone" dataKey="석식" stroke="#ff7c7c" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 잔반량 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-medium mb-4 pb-2 border-b-2 border-[#5dccb4]">잔반량</h2>
          
          {/* 잔반량 KPI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <KpiMiniCard
              title="어제 잔반량"
              value={formatKpiValue(wasteKpi.today)}
              unit="kg"
              diff={formatKpiDiff(wasteKpi.todayChange, 'kg')}
              trend={getTrend(wasteKpi.todayChange)}
              isEmpty={isWasteEmpty}
            />
            <KpiMiniCard
              title="주간 평균"
              value={formatKpiValue(wasteKpi.weekAvg)}
              unit="kg"
              diff={formatKpiDiff(wasteKpi.weekChange, 'kg')}
              trend={getTrend(wasteKpi.weekChange)}
              isEmpty={isWasteEmpty}
            />
            <KpiMiniCard
              title="월간 평균"
              value={formatKpiValue(wasteKpi.monthAvg)}
              unit="kg"
              diff={formatKpiDiff(wasteKpi.monthChange, 'kg')}
              trend={getTrend(wasteKpi.monthChange)}
              isEmpty={isWasteEmpty}
            />
          </div>

          {/* 잔반량 그래프 */}
          {isWasteEmpty ? (
            <div className="h-64 flex items-center justify-center text-sm text-gray-500 bg-gray-50 border border-dashed rounded-lg">
              데이터가 없습니다.
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={foodWasteData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: 'kg', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="중식" stroke="#5dccb4" strokeWidth={2} />
                  <Line type="monotone" dataKey="석식" stroke="#ff7c7c" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 만족도 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-medium mb-6 pb-2 border-b-2 border-[#5dccb4]">
            만족도
          </h2>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {satisfactionKpis.map((kpi) => (
              <KpiCard
                key={kpi.title}
                icon={kpi.icon}
                title={kpi.title}
                value={kpi.value}
                unit={kpi.unit}
                sub={kpi.sub}
                color={kpi.color}
                isEmpty={isSatisfactionEmpty}
              />
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
