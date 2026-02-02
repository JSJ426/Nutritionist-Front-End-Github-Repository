import { MessageSquare } from 'lucide-react';
import { KpiCard } from '../components/KpiCard';
import { FeedbackItem } from '../components/FeedbackItem';
import { StatsFilterPanel } from '../components/StatsFilterPanel';
import { useMemo, useState } from 'react';

// Generate feedback data from current date (2026-01-13) to last week (2026-01-06)
const generateFeedbackData = () => {
  const feedbackList = [];
  let id = 1;

  const menus = [
    '불고기', '제육볶음', '카레라이스', '돈까스', '닭갈비', '생선구이',
    '고등어구이', '김치찌개', '된장찌개', '순두부찌개', '비빔밥', '잡채',
    '함박스테이크', '탕수육', '치킨너겟', '삼겹살구이', '갈비찜', '떡볶이'
  ];

  const comments = [
    '정말 맛있었어요!',
    '오늘 반찬이 다 맛있었습니다.',
    '양념이 딱 좋아요.',
    '바삭하고 좋습니다!',
    '메뉴가 너무 좋아요.',
    '매콤하니 맛있어요.',
    '신선하고 맛있었어요!',
    '양도 적당하고 맛있었습니다.',
    '오늘 급식 최고예요!',
    '국물이 진하고 맛있어요.',
    '너무 짜요.',
    '양이 너무 적어요.',
    '너무 싱거워요.',
    '식어서 나왔어요.',
    '양념이 부족해요.',
    '너무 매워요.',
    '야채가 너무 많아요.',
    '밥이 딱딱해요.',
    '냄새가 좀 나요.',
    '너무 기름져요.'
  ];

  for (let day = 13; day >= 6; day--) {
    const date = `2026-01-${day.toString().padStart(2, '0')}`;
    const feedbackPerDay = 10 + Math.floor(Math.random() * 3);

    for (let i = 0; i < feedbackPerDay; i++) {
      feedbackList.push({
        id: id++,
        date,
        meal: Math.random() > 0.5 ? '중식' : '석식',
        menu: menus[Math.floor(Math.random() * menus.length)],
        comment: comments[Math.floor(Math.random() * comments.length)],
      });
    }
  }

  return feedbackList.sort((a, b) => b.date.localeCompare(a.date));
};

const feedbackData = generateFeedbackData();

interface StatsSatisfactionPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

const parseDate = (value: string) => new Date(`${value}T00:00:00`);

export function StatsSatisfactionPage({ onNavigate }: StatsSatisfactionPageProps) {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [meal, setMeal] = useState<'전체' | '중식' | '석식'>('중식');
  const [appliedPeriod, setAppliedPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [appliedMeal, setAppliedMeal] = useState<'전체' | '중식' | '석식'>('중식');

  const handleSearch = () => {
    setAppliedPeriod(period);
    setAppliedMeal(meal);
  };

  const latestDate = useMemo(() => {
    if (feedbackData.length === 0) {
      return new Date();
    }
    return feedbackData.reduce((max, item) => {
      const dateValue = parseDate(item.date);
      return dateValue > max ? dateValue : max;
    }, parseDate(feedbackData[0].date));
  }, []);

  const { filteredFeedback, periodLabel } = useMemo(() => {
    const days = appliedPeriod === 'weekly' ? 7 : 30;
    const startDate = new Date(latestDate);
    startDate.setDate(startDate.getDate() - (days - 1));

    return {
      filteredFeedback: feedbackData.filter(item => {
        const dateValue = parseDate(item.date);
        const matchMeal = appliedMeal === '전체' ? true : item.meal === appliedMeal;
        return dateValue >= startDate && matchMeal;
      }),
      periodLabel: appliedPeriod === 'weekly' ? '최근 7일' : '최근 30일',
    };
  }, [appliedMeal, appliedPeriod, latestDate]);

  const recentFeedback = filteredFeedback.slice(0, 8);

  const yesterdaySatisfaction = 4.4;
  const weeklyAverage = 4.3;
  const monthlyAverage = 4.2;

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
        periodOptions={[
          { value: 'weekly', label: '주간 (최근 7일)' },
          { value: 'monthly', label: '월간 (최근 30일)' },
        ]}
        mealOptions={[
          { value: '전체', label: '전체' },
          { value: '중식', label: '중식' },
          { value: '석식', label: '석식' },
        ]}
      />

      {/* Section 2: KPI Card들 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* 평균 만족도 */}
            <KpiCard
              icon="⭐"
              title="이번 주 평균 만족도"
              value="4.5"
              unit="/ 5.0"
              sub="전주 대비 +0.2"
              color="yellow"
            />

            {/* 긍정 피드백 */}
            <KpiCard
              icon="👍"
              title="긍정 피드백"
              value="47"
              unit="건"
              sub="52%"
              color="green"
            />
        
            {/* 부정 피드백 */}
            <KpiCard
              icon="👎"
              title="부정 피드백"
              value="21"
              unit="건"
              sub="23%"
              color="red"
            />
        
            {/* 평가 수 */}
            <KpiCard
              title="만족도 평가 수"
              value="4,102"
              unit="건"
            />
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
