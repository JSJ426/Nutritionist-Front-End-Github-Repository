import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Star, AlertCircle, MessageSquare, ThumbsUp, ThumbsDown, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

// 주간 만족도 추이 데이터 (2025년 12월 ~ 2026년 1월)
const weeklyDataByMonth: { [key: string]: any[] } = {
  '2025-12': [
    { week: '1주차', score: 4.1 },
    { week: '2주차', score: 4.3 },
    { week: '3주차', score: 4.2 },
    { week: '4주차', score: 4.4 },
  ],
  '2026-01': [
    { week: '1주차', score: 4.0 },
    { week: '2주차', score: 4.2 },
    { week: '3주차', score: 4.3 },
    { week: '4주차', score: 4.5 },
  ]
};

// 메뉴별 만족도 데이터 (2025-12 ~ 2026-01)
const menuData = [
  { menu: '불고기', score: 4.7, count: 285 },
  { menu: '카레라이스', score: 4.6, count: 312 },
  { menu: '닭강정', score: 4.6, count: 268 },
  { menu: '돈까스', score: 4.5, count: 294 },
  { menu: '제육볶음', score: 4.4, count: 321 },
  { menu: '닭갈비', score: 4.3, count: 256 },
  { menu: '함박스테이크', score: 4.3, count: 198 },
  { menu: '닭볶음탕', score: 4.2, count: 215 },
  { menu: '간장치킨', score: 4.2, count: 187 },
  { menu: '탕수육', score: 4.1, count: 163 },
  { menu: '치킨너겟', score: 4.0, count: 245 },
  { menu: '삼겹살구이', score: 4.0, count: 176 },
  { menu: '고등어구이', score: 3.9, count: 298 },
  { menu: '갈치구이', score: 3.8, count: 189 },
  { menu: '삼치구이', score: 3.8, count: 176 },
  { menu: '고등어조림', score: 3.7, count: 223 },
  { menu: '가자미구이', score: 3.6, count: 154 },
  { menu: '오징어볶음', score: 3.5, count: 142 },
];

// Generate feedback data from current date (2026-01-13) to last week (2026-01-06)
const generateFeedbackData = () => {
  const feedbackList = [];
  let id = 1;
  
  const menus = [
    '불고기', '제육볶음', '카레라이스', '돈까스', '닭갈비', '생선구이', 
    '고등어구이', '김치찌개', '된장찌개', '순두부찌개', '비빔밥', '잡채',
    '함박스테이크', '탕수육', '치킨너겟', '삼겹살구이', '갈비찜', '떡볶이'
  ];
  
  const positiveComments = [
    '정말 맛있었어요!',
    '오늘 반찬이 다 맛있었습니다.',
    '양념이 딱 좋아요.',
    '바삭하고 좋습니다!',
    '메뉴가 너무 좋아요.',
    '매콤하니 맛있어요.',
    '신선하고 맛있었어요!',
    '양도 적당하고 맛있었습니다.',
    '오늘 급식 최고예요!',
    '국물이 진하고 맛있어요.'
  ];
  
  const negativeComments = [
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
  
  const neutralComments = [
    '보통입니다.',
    '그저 그래요.',
    '먹을만 해요.',
    '평범한 맛이에요.',
    '나쁘지 않아요.',
    '무난합니다.',
    '괜찮은 편이에요.',
    '그럭저럭 먹었어요.',
    '특별하진 않아요.',
    '평균적인 맛이에요.'
  ];
  
  const positiveKeywords = ['맛있음', '양호', '바삭', '신선', '적당', '좋음', '훌륭'];
  const negativeKeywords = ['짠맛', '싱거움', '개선필요', '야채많음', '딱딱', '매움', '기름짐'];
  const neutralKeywords = ['보통', '평범', '무난', '그저그럼'];
  
  // Generate data from Jan 13 to Jan 6 (8 days)
  for (let day = 13; day >= 6; day--) {
    const date = `2026-01-${day.toString().padStart(2, '0')}`;
    
    // Generate 10-12 feedback per day
    const feedbackPerDay = 10 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < feedbackPerDay; i++) {
      const randomNum = Math.random();
      let sentiment: 'positive' | 'negative' | 'neutral';
      let comment: string;
      let keywords: string[];
      
      if (randomNum < 0.5) {
        // 50% positive
        sentiment = 'positive';
        comment = positiveComments[Math.floor(Math.random() * positiveComments.length)];
        keywords = [
          positiveKeywords[Math.floor(Math.random() * positiveKeywords.length)],
          positiveKeywords[Math.floor(Math.random() * positiveKeywords.length)]
        ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
      } else if (randomNum < 0.75) {
        // 25% negative
        sentiment = 'negative';
        comment = negativeComments[Math.floor(Math.random() * negativeComments.length)];
        keywords = [
          negativeKeywords[Math.floor(Math.random() * negativeKeywords.length)],
          negativeKeywords[Math.floor(Math.random() * negativeKeywords.length)]
        ].filter((v, i, a) => a.indexOf(v) === i);
      } else {
        // 25% neutral
        sentiment = 'neutral';
        comment = neutralComments[Math.floor(Math.random() * neutralComments.length)];
        keywords = [neutralKeywords[Math.floor(Math.random() * neutralKeywords.length)]];
      }
      
      feedbackList.push({
        id: id++,
        date,
        meal: Math.random() > 0.5 ? '중식' : '석식',
        menu: menus[Math.floor(Math.random() * menus.length)],
        sentiment,
        comment,
        keywords
      });
    }
  }
  
  // Sort by date descending (newest first)
  return feedbackList.sort((a, b) => b.date.localeCompare(a.date));
};

const feedbackData = generateFeedbackData();

interface StatsSatisfactionPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function StatsSatisfactionPage({ onNavigate }: StatsSatisfactionPageProps) {
  const [currentMonth, setCurrentMonth] = useState('2026-01');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 전체 평균 만족도 계산
  const totalAverage = 4.2;
  
  // 이번 주 만족도 (1월 4주차 기준)
  const thisWeekScore = 4.5;
  const lastWeekScore = 4.3;
  const weekDiff = thisWeekScore - lastWeekScore;
  
  // 총 평가 수 계산
  const totalEvaluations = menuData.reduce((sum, item) => sum + item.count, 0);

  // 메뉴 클릭 핸들러
  const handleMenuClick = (menuName: string) => {
    if (onNavigate) {
      onNavigate('meal-view', {
        startDate: '2025-12-01',
        endDate: '2026-01-31',
        menuSearch: menuName,
        scope: 'MAIN'
      });
    }
  };

  // 이전 달로 이동
  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    let newMonth = month - 1;
    let newYear = year;
    
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    
    const newMonthStr = `${newYear}-${String(newMonth).padStart(2, '0')}`;
    if (weeklyDataByMonth[newMonthStr]) {
      setCurrentMonth(newMonthStr);
    }
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    let newMonth = month + 1;
    let newYear = year;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    
    const newMonthStr = `${newYear}-${String(newMonth).padStart(2, '0')}`;
    if (weeklyDataByMonth[newMonthStr]) {
      setCurrentMonth(newMonthStr);
    }
  };

  // 만족도 순으로 정렬 (동일 점수일 경우 평가 수 많은 순) - 상위 10개만
  const sortedMenuData = [...menuData].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.count - a.count;
  }).slice(0, 10);

  // 현재 월의 주간 데이터
  const weeklyData = weeklyDataByMonth[currentMonth] || [];

  // 월 표시 형식
  const [year, month] = currentMonth.split('-');
  const monthDisplay = `${year}년 ${parseInt(month)}월`;

  // AI 요약 생성
  const generateAISummary = () => {
    const topMenu = sortedMenuData[0];
    const bottomMenu = sortedMenuData[sortedMenuData.length - 1];
    const avgScore = totalAverage;
    const trend = weekDiff > 0 ? '상승' : weekDiff < 0 ? '하락' : '유지';
    const trendColor = weekDiff > 0 ? 'text-green-600' : weekDiff < 0 ? 'text-red-600' : 'text-gray-600';
    const highSatisfactionCount = sortedMenuData.filter(m => m.score >= 4.5).length;
    
    return {
      trend,
      trendColor,
      avgScore,
      topMenu,
      bottomMenu,
      highSatisfactionCount
    };
  };

  const analysis = generateAISummary();

  // Feedback filtering and pagination
  const filteredFeedback = feedbackData.filter(item => {
    const matchSentiment = selectedFilter === 'all' || item.sentiment === selectedFilter;
    const matchDate = !selectedDate || item.date === selectedDate;
    return matchSentiment && matchDate;
  });

  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFeedback = filteredFeedback.slice(startIndex, endIndex);

  // Calculate page numbers to display (max 10 pages)
  const getPageNumbers = () => {
    const maxPagesToShow = 10;
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const pageNumbers = getPageNumbers();

  // Calculate feedback statistics
  const totalCount = filteredFeedback.length;
  const positiveCount = filteredFeedback.filter(f => f.sentiment === 'positive').length;
  const negativeCount = filteredFeedback.filter(f => f.sentiment === 'negative').length;
  const positivePercentage = totalCount > 0 ? Math.round((positiveCount / totalCount) * 100) : 0;
  const negativePercentage = totalCount > 0 ? Math.round((negativeCount / totalCount) * 100) : 0;

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setCurrentPage(1);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="text-green-500" size={18} />;
      case 'negative':
        return <ThumbsDown className="text-red-500" size={18} />;
      default:
        return <AlertCircle className="text-yellow-500" size={18} />;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-700';
      case 'negative':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getSentimentText = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '긍정';
      case 'negative':
        return '부정';
      default:
        return '중립';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">만족도</h1>
      </div>

      {/* 자동 분석 요약 영역 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 mb-6 border border-blue-100">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-3">자동 분석 요약</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">•</span>
                <span>
                  {monthDisplay} 급식 만족도는 평균 <span className="font-medium text-blue-600">
                    {analysis.avgScore.toFixed(1)}점
                  </span>으로 전반적으로 양호한 수준입니다.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">•</span>
                <span>
                  주간 추이를 보면 이번 주는 {thisWeekScore}점으로 <span className={`font-medium ${analysis.trendColor}`}>
                    전주 대비 {analysis.trend}
                  </span>했습니다. (전주: {lastWeekScore}점)
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">•</span>
                <span>
                  학생들이 가장 선호하는 메뉴는 <span className="font-medium text-green-600">
                    "{analysis.topMenu.menu}" ({analysis.topMenu.score}점)
                  </span>이며, 고기류 메뉴들이 상위권을 차지하고 있습니다.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">•</span>
                <span>
                  전체 Top 10 메뉴 중 <span className={`font-medium ${analysis.highSatisfactionCount >= 3 ? 'text-green-600' : 'text-amber-600'}`}>
                    {analysis.highSatisfactionCount}개
                  </span>가 4.5점 이상의 높은 만족도를 기록했습니다.
                </span>
              </p>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-gray-600">
                  💡 <span className="font-medium">활용 제안:</span> 만족도가 낮은 메뉴("{analysis.bottomMenu.menu}", {analysis.bottomMenu.score}점)는 조리법 개선이나 양념 변화를 고려해볼 수 있으며, 학생 선호도를 반영한 지속적인 모니터링과 식단 개선이 권장됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 요약 지표 영역 (상단 카드) */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-2">전체 평균 만족도</p>
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400 fill-yellow-400" size={24} />
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-medium">{totalAverage.toFixed(1)}</span>
              <span className="text-lg text-gray-500">/ 5.0</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-2">이번 주 평균 만족도</p>
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400 fill-yellow-400" size={24} />
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-medium">{thisWeekScore.toFixed(1)}</span>
              <span className="text-lg text-gray-500">/ 5.0</span>
            </div>
          </div>
          <p className={`text-sm mt-1 ${weekDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            전주 대비 {weekDiff >= 0 ? '+' : ''}{weekDiff.toFixed(1)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-2">만족도 평가 수</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-medium">{totalEvaluations.toLocaleString()}</span>
            <span className="text-lg">건</span>
          </div>
        </div>
      </div>

      {/* 주간 만족도 추이 영역 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-medium mb-6">주간 만족도 추이</h2>
        <div className="flex justify-between items-center mb-4">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-gray-700 font-medium">{monthDisplay}</span>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={handleNextMonth}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 12 }} 
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              domain={[0, 5]} 
              tick={{ fontSize: 12 }}
              label={{ value: '만족도 (점)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="score" 
              fill="#5dccb4"
              radius={[4, 4, 0, 0]}
              name="평균 만족도"
              label={{ position: 'top', fontSize: 12 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 피드백 통계 카드 */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="text-[#5dccb4]" size={24} />
            <p className="text-sm text-gray-600">총 피드백 수</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-medium">{totalCount}</span>
            <span className="text-lg">건</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <ThumbsUp className="text-green-500" size={24} />
            <p className="text-sm text-gray-600">긍정 피드백</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-medium text-green-600">{positiveCount}</span>
            <span className="text-lg text-gray-500">건 ({positivePercentage}%)</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <ThumbsDown className="text-red-500" size={24} />
            <p className="text-sm text-gray-600">부정 피드백</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-medium text-red-600">{negativeCount}</span>
            <span className="text-lg text-gray-500">건 ({negativePercentage}%)</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-[#5dccb4]" size={24} />
            <p className="text-sm text-gray-600">긍정률 추이</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-medium text-green-600">+5%</span>
            <span className="text-sm text-gray-500">전주 대비</span>
          </div>
        </div>
      </div>

      {/* 최근 피드백 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-medium">최근 피드백</h2>
            <div className="flex gap-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="px-3 py-2 border rounded focus:outline-none focus:border-[#5dccb4] text-sm"
              />
              <select
                value={selectedFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-3 py-2 border rounded focus:outline-none focus:border-[#5dccb4] text-sm"
              >
                <option value="all">전체</option>
                <option value="positive">긍정</option>
                <option value="negative">부정</option>
                <option value="neutral">중립</option>
              </select>
            </div>
          </div>
          
          {/* Pagination */}
          {filteredFeedback.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              
              {pageNumbers.map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === page
                      ? 'bg-[#5dccb4] text-white border-[#5dccb4]'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4 min-h-[600px]">
          {currentFeedback.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getSentimentIcon(item.sentiment)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.menu}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getSentimentBadge(item.sentiment)}`}>
                        {getSentimentText(item.sentiment)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {item.date} · {item.meal}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-2">{item.comment}</p>
              <div className="flex gap-2">
                {item.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredFeedback.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            해당 조건의 피드백이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}