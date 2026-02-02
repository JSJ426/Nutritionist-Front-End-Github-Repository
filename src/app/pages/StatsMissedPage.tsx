import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { useState, useMemo } from 'react';
import { KpiCard } from '../components/KpiCard';
import { StatsFilterPanel } from '../components/StatsFilterPanel';
// import { SummaryMissed } from '../components/SummaryMissed';
import { TrendingDown, TrendingUp } from 'lucide-react';

// 더 풍부한 데이터셋
const weeklyData = [
  { date: '1월 6일', rate: 7.2, lunch: 6.8, dinner: 7.6 },
  { date: '1월 7일', rate: 7.5, lunch: 7.1, dinner: 7.9 },
  { date: '1월 8일', rate: 8.7, lunch: 8.3, dinner: 9.1 },
  { date: '1월 9일', rate: 9.1, lunch: 8.8, dinner: 9.4 },
  { date: '1월 10일', rate: 8.4, lunch: 8.0, dinner: 8.8 },
  { date: '1월 11일', rate: 7.8, lunch: 7.4, dinner: 8.2 },
  { date: '1월 12일', rate: 9.2, lunch: 8.9, dinner: 9.5 },
  { date: '1월 13일', rate: 8.1, lunch: 7.7, dinner: 8.5 },
  { date: '1월 14일', rate: 9.0, lunch: 8.6, dinner: 9.4 },
  { date: '1월 15일', rate: 8.6, lunch: 8.2, dinner: 9.0 },
  { date: '1월 16일', rate: 7.9, lunch: 7.5, dinner: 8.3 },
  { date: '1월 17일', rate: 8.4, lunch: 8.0, dinner: 8.8 },
  { date: '1월 18일', rate: 9.3, lunch: 8.9, dinner: 9.7 },
  { date: '1월 19일', rate: 8.2, lunch: 7.8, dinner: 8.6 },
  { date: '1월 20일', rate: 8.8, lunch: 8.4, dinner: 9.2 },
];

const monthlyData = [
  { date: '12월 16일', rate: 8.1, lunch: 7.7, dinner: 8.5 },
  { date: '12월 17일', rate: 8.5, lunch: 8.2, dinner: 8.8 },
  { date: '12월 18일', rate: 7.9, lunch: 7.5, dinner: 8.3 },
  { date: '12월 19일', rate: 9.2, lunch: 8.9, dinner: 9.5 },
  { date: '12월 20일', rate: 8.7, lunch: 8.4, dinner: 9.0 },
  { date: '12월 23일', rate: 7.5, lunch: 7.1, dinner: 7.9 },
  { date: '12월 24일', rate: 8.3, lunch: 7.9, dinner: 8.7 },
  { date: '12월 26일', rate: 9.5, lunch: 9.2, dinner: 9.8 },
  { date: '12월 27일', rate: 8.9, lunch: 8.5, dinner: 9.3 },
  { date: '12월 30일', rate: 7.8, lunch: 7.4, dinner: 8.2 },
  { date: '12월 31일', rate: 8.6, lunch: 8.2, dinner: 9.0 },
  { date: '1월 2일', rate: 9.2, lunch: 8.9, dinner: 9.5 },
  { date: '1월 3일', rate: 7.8, lunch: 7.4, dinner: 8.2 },
  { date: '1월 6일', rate: 7.2, lunch: 6.8, dinner: 7.6 },
  { date: '1월 7일', rate: 7.5, lunch: 7.1, dinner: 7.9 },
  { date: '1월 8일', rate: 8.7, lunch: 8.3, dinner: 9.1 },
  { date: '1월 9일', rate: 9.1, lunch: 8.8, dinner: 9.4 },
  { date: '1월 10일', rate: 8.4, lunch: 8.0, dinner: 8.8 },
  { date: '1월 11일', rate: 7.8, lunch: 7.4, dinner: 8.2 },
  { date: '1월 12일', rate: 9.2, lunch: 8.9, dinner: 9.5 },
];

const customData = [
  { date: '1월 8일', rate: 8.7, lunch: 8.3, dinner: 9.1 },
  { date: '1월 9일', rate: 9.1, lunch: 8.8, dinner: 9.4 },
  { date: '1월 10일', rate: 8.4, lunch: 8.0, dinner: 8.8 },
  { date: '1월 11일', rate: 7.8, lunch: 7.4, dinner: 8.2 },
  { date: '1월 12일', rate: 9.2, lunch: 8.9, dinner: 9.5 },
];

export function StatsMissedPage() {
  // Draft 상태 (사용자가 선택 중인 값)
  const [draftPeriod, setDraftPeriod] = useState('weekly');
  const [draftMealType, setDraftMealType] = useState('all');
  const [draftStartDate, setDraftStartDate] = useState('2026-01-08');
  const [draftEndDate, setDraftEndDate] = useState('2026-01-12');
  
  // Applied 상태 (조회 버튼 클릭 후 실제 적용된 값)
  const [period, setPeriod] = useState('weekly');
  const [mealType, setMealType] = useState('all');
  const [startDate, setStartDate] = useState('2026-01-08');
  const [endDate, setEndDate] = useState('2026-01-12');
  
  const targetRate = 8.0; // 관리 목표 기준선

  // 조회 버튼 클릭 핸들러
  const handleSearch = () => {
    setPeriod(draftPeriod);
    setMealType(draftMealType);
    setStartDate(draftStartDate);
    setEndDate(draftEndDate);
  };

  // 필터에 따른 데이터 선택
  const baseData = useMemo(() => {
    if (period === 'weekly') return weeklyData;
    if (period === 'monthly') return monthlyData;
    return customData;
  }, [period]);

  // 식사 구분에 따른 데이터 변환
  const filteredData = useMemo(() => {
    return baseData.map(item => ({
      ...item,
      displayRate: mealType === 'lunch' ? item.lunch : mealType === 'dinner' ? item.dinner : item.rate
    }));
  }, [baseData, mealType]);

  // KPI 계산
  const kpiData = useMemo(() => {
    const rates = filteredData.map(d => d.displayRate);
    const todayRate = rates[rates.length - 1];
    const yesterdayRate = rates[rates.length - 2] || todayRate;
    const weekAvg = rates.slice(-7).reduce((a, b) => a + b, 0) / Math.min(7, rates.length);
    const prevWeekAvg = rates.slice(-14, -7).reduce((a, b) => a + b, 0) / Math.min(7, rates.slice(-14, -7).length) || weekAvg;
    const monthAvg = rates.reduce((a, b) => a + b, 0) / rates.length;
    const prevMonthAvg = 9.8; // 전월 평균 (고정값)

    return {
      today: todayRate,
      todayChange: todayRate - yesterdayRate,
      weekAvg,
      weekChange: weekAvg - prevWeekAvg,
      monthAvg,
      monthChange: monthAvg - prevMonthAvg,
    };
  }, [filteredData]);

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
              기준선 (목표): {targetRate}% | 현재 선택: {
                period === 'weekly' ? '주간' : period === 'monthly' ? '월간' : '사용자 지정'
              } / {
                mealType === 'all' ? '전체' : mealType === 'lunch' ? '중식' : '석식'
              }
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
