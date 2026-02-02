import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { useState, useMemo } from 'react';
import { KpiCard } from '../components/KpiCard';
import { StatsFilterPanel } from '../components/StatsFilterPanel';
//import { SummaryLeftovers } from '../components/SummaryLeftovers';
import { TrendingDown, TrendingUp } from 'lucide-react';

// 더 풍부한 데이터셋 (중식/석식/메뉴별 구분)
const weeklyData = [
  { date: '1월 6일', amount: 42.7, lunch: 38.5, dinner: 46.9, main: 18.2, side: 15.8, soup: 8.7 },
  { date: '1월 7일', amount: 39.8, lunch: 35.2, dinner: 44.4, main: 16.5, side: 14.3, soup: 9.0 },
  { date: '1월 8일', amount: 46.5, lunch: 42.1, dinner: 50.9, main: 19.8, side: 17.2, soup: 9.5 },
  { date: '1월 9일', amount: 51.2, lunch: 47.3, dinner: 55.1, main: 22.1, side: 19.5, soup: 9.6 },
  { date: '1월 10일', amount: 44.8, lunch: 40.5, dinner: 49.1, main: 19.2, side: 16.8, soup: 8.8 },
  { date: '1월 11일', amount: 40.5, lunch: 36.8, dinner: 44.2, main: 17.3, side: 14.9, soup: 8.3 },
  { date: '1월 12일', amount: 48.9, lunch: 44.6, dinner: 53.2, main: 21.0, side: 18.3, soup: 9.6 },
  { date: '1월 13일', amount: 43.6, lunch: 39.4, dinner: 47.8, main: 18.7, side: 16.1, soup: 8.8 },
  { date: '1월 14일', amount: 50.1, lunch: 45.7, dinner: 54.5, main: 21.4, side: 18.6, soup: 10.1 },
  { date: '1월 15일', amount: 47.3, lunch: 42.9, dinner: 51.7, main: 20.2, side: 17.4, soup: 9.7 },
  { date: '1월 16일', amount: 41.8, lunch: 37.9, dinner: 45.7, main: 17.9, side: 15.2, soup: 8.7 },
  { date: '1월 17일', amount: 45.9, lunch: 41.6, dinner: 50.2, main: 19.6, side: 17.0, soup: 9.3 },
  { date: '1월 18일', amount: 52.4, lunch: 47.8, dinner: 57.0, main: 22.6, side: 19.7, soup: 10.1 },
  { date: '1월 19일', amount: 44.2, lunch: 40.1, dinner: 48.3, main: 18.9, side: 16.4, soup: 8.9 },
  { date: '1월 20일', amount: 49.6, lunch: 45.0, dinner: 54.2, main: 21.1, side: 18.5, soup: 10.0 },
];

const monthlyData = [
  { date: '12월 16일', amount: 45.2, lunch: 41.0, dinner: 49.4, main: 19.3, side: 16.8, soup: 9.1 },
  { date: '12월 17일', amount: 47.8, lunch: 43.5, dinner: 52.1, main: 20.5, side: 17.9, soup: 9.4 },
  { date: '12월 18일', amount: 42.1, lunch: 38.2, dinner: 46.0, main: 18.0, side: 15.6, soup: 8.5 },
  { date: '12월 19일', amount: 52.3, lunch: 48.1, dinner: 56.5, main: 22.4, side: 19.8, soup: 10.1 },
  { date: '12월 20일', amount: 48.6, lunch: 44.3, dinner: 52.9, main: 20.8, side: 18.2, soup: 9.6 },
  { date: '12월 23일', amount: 40.8, lunch: 37.0, dinner: 44.6, main: 17.5, side: 15.1, soup: 8.2 },
  { date: '12월 24일', amount: 44.5, lunch: 40.5, dinner: 48.5, main: 19.0, side: 16.5, soup: 9.0 },
  { date: '12월 26일', amount: 54.1, lunch: 49.8, dinner: 58.4, main: 23.2, side: 20.3, soup: 10.6 },
  { date: '12월 27일', amount: 49.8, lunch: 45.5, dinner: 54.1, main: 21.3, side: 18.7, soup: 9.8 },
  { date: '12월 30일', amount: 41.9, lunch: 38.0, dinner: 45.8, main: 17.9, side: 15.5, soup: 8.5 },
  { date: '12월 31일', amount: 46.2, lunch: 42.0, dinner: 50.4, main: 19.8, side: 17.2, soup: 9.2 },
  { date: '1월 2일', amount: 50.5, lunch: 46.3, dinner: 54.7, main: 21.6, side: 19.0, soup: 9.9 },
  { date: '1월 3일', amount: 41.5, lunch: 37.7, dinner: 45.3, main: 17.8, side: 15.4, soup: 8.3 },
  { date: '1월 6일', amount: 42.7, lunch: 38.5, dinner: 46.9, main: 18.2, side: 15.8, soup: 8.7 },
  { date: '1월 7일', amount: 39.8, lunch: 35.2, dinner: 44.4, main: 16.5, side: 14.3, soup: 9.0 },
  { date: '1월 8일', amount: 46.5, lunch: 42.1, dinner: 50.9, main: 19.8, side: 17.2, soup: 9.5 },
  { date: '1월 9일', amount: 51.2, lunch: 47.3, dinner: 55.1, main: 22.1, side: 19.5, soup: 9.6 },
  { date: '1월 10일', amount: 44.8, lunch: 40.5, dinner: 49.1, main: 19.2, side: 16.8, soup: 8.8 },
  { date: '1월 11일', amount: 40.5, lunch: 36.8, dinner: 44.2, main: 17.3, side: 14.9, soup: 8.3 },
  { date: '1월 12일', amount: 48.9, lunch: 44.6, dinner: 53.2, main: 21.0, side: 18.3, soup: 9.6 },
];

const customData = [
  { date: '1월 8일', amount: 46.5, lunch: 42.1, dinner: 50.9, main: 19.8, side: 17.2, soup: 9.5 },
  { date: '1월 9일', amount: 51.2, lunch: 47.3, dinner: 55.1, main: 22.1, side: 19.5, soup: 9.6 },
  { date: '1월 10일', amount: 44.8, lunch: 40.5, dinner: 49.1, main: 19.2, side: 16.8, soup: 8.8 },
  { date: '1월 11일', amount: 40.5, lunch: 36.8, dinner: 44.2, main: 17.3, side: 14.9, soup: 8.3 },
  { date: '1월 12일', amount: 48.9, lunch: 44.6, dinner: 53.2, main: 21.0, side: 18.3, soup: 9.6 },
];

export function StatsLeftoversPage() {
  // Draft 상태 (사용자가 선택 중인 값)
  const [draftPeriod, setDraftPeriod] = useState('weekly');
  const [draftMealType, setDraftMealType] = useState('all');
  const [draftMenuType, setDraftMenuType] = useState('all');
  const [draftStartDate, setDraftStartDate] = useState('2026-01-08');
  const [draftEndDate, setDraftEndDate] = useState('2026-01-12');
  
  // Applied 상태 (조회 버튼 클릭 후 실제 적용된 값)
  const [period, setPeriod] = useState('weekly');
  const [mealType, setMealType] = useState('all');
  const [menuType, setMenuType] = useState('all');
  const [startDate, setStartDate] = useState('2026-01-08');
  const [endDate, setEndDate] = useState('2026-01-12');
  
  const targetAmount = 45.0; // 관리 목표 기준선 (kg)

  // 조회 버튼 클릭 핸들러
  const handleSearch = () => {
    setPeriod(draftPeriod);
    setMealType(draftMealType);
    setMenuType(draftMenuType);
    setStartDate(draftStartDate);
    setEndDate(draftEndDate);
  };

  // 필터에 따른 데이터 선택
  const baseData = useMemo(() => {
    if (period === 'weekly') return weeklyData;
    if (period === 'monthly') return monthlyData;
    return customData;
  }, [period]);

  // 식사 구분 및 메뉴 유형에 따른 데이터 변환
  const filteredData = useMemo(() => {
    return baseData.map(item => {
      let displayAmount = item.amount;
      
      // 식사 구분만 적용된 경우
      if (mealType === 'lunch' && menuType === 'all') {
        displayAmount = item.lunch;
      } else if (mealType === 'dinner' && menuType === 'all') {
        displayAmount = item.dinner;
      }
      // 메뉴 유형만 적용된 경우
      else if (mealType === 'all' && menuType !== 'all') {
        if (menuType === 'main') displayAmount = item.main;
        else if (menuType === 'side') displayAmount = item.side;
        else if (menuType === 'soup') displayAmount = item.soup;
      }
      // 식사 구분과 메뉴 유형 모두 적용된 경우
      else if (mealType !== 'all' && menuType !== 'all') {
        // 식사별 메뉴 유형의 비율을 계산 (전체 대비 중식/석식의 비율 적용)
        const mealRatio = mealType === 'lunch' ? (item.lunch / item.amount) : (item.dinner / item.amount);
        if (menuType === 'main') displayAmount = item.main * mealRatio;
        else if (menuType === 'side') displayAmount = item.side * mealRatio;
        else if (menuType === 'soup') displayAmount = item.soup * mealRatio;
      }
      
      return {
        ...item,
        displayAmount
      };
    });
  }, [baseData, mealType, menuType]);

  // KPI 계산
  const kpiData = useMemo(() => {
    const amounts = filteredData.map(d => d.displayAmount);
    const todayAmount = amounts[amounts.length - 1];
    const yesterdayAmount = amounts[amounts.length - 2] || todayAmount;
    const weekAvg = amounts.slice(-7).reduce((a, b) => a + b, 0) / Math.min(7, amounts.length);
    const prevWeekAvg = amounts.slice(-14, -7).reduce((a, b) => a + b, 0) / Math.min(7, amounts.slice(-14, -7).length) || weekAvg;
    const monthAvg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const prevMonthAvg = 53.3; // 전월 평균 (고정값)

    return {
      today: todayAmount,
      todayChange: todayAmount - yesterdayAmount,
      weekAvg,
      weekChange: weekAvg - prevWeekAvg,
      monthAvg,
      monthChange: monthAvg - prevMonthAvg,
    };
  }, [filteredData]);

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
        menuType={draftMenuType}
        onMenuTypeChange={setDraftMenuType}
        showMenuType
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
          title="어제 잔반량"
          value={kpiData.today.toFixed(1)}
          unit="kg"
          sub={`전일 대비 ${kpiData.todayChange > 0 ? '+' : ''}${kpiData.todayChange.toFixed(1)}kg`}
          color={kpiData.todayChange > 0 ? 'red' : 'green'}
        />
        <KpiCard
          icon={kpiData.weekChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          title="주간 평균"
          value={kpiData.weekAvg.toFixed(1)}
          unit="kg"
          sub={`전주 대비 ${kpiData.weekChange > 0 ? '+' : ''}${kpiData.weekChange.toFixed(1)}kg`}
          color={kpiData.weekChange > 0 ? 'red' : 'green'}
        />
        <KpiCard
          icon={kpiData.monthChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          title="월간 평균"
          value={kpiData.monthAvg.toFixed(1)}
          unit="kg"
          sub={`전월 대비 ${kpiData.monthChange > 0 ? '+' : ''}${kpiData.monthChange.toFixed(1)}kg`}
          color={kpiData.monthChange > 0 ? 'red' : 'green'}
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-medium">일일 잔반량 추이</h2>
            <p className="text-sm text-gray-500 mt-1">
              기준선 (목표): {targetAmount}kg | 현재 선택: {
                period === 'weekly' ? '주간' : period === 'monthly' ? '월간' : '사용자 지정'
              } / {
                mealType === 'all' ? '전체' : mealType === 'lunch' ? '중식' : '석식'
              } / {
                menuType === 'all' ? '전체 메뉴' : menuType === 'main' ? '주메뉴' : menuType === 'side' ? '반찬' : '국·찌개'
              }
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
