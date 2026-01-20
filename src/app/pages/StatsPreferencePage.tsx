import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Star, AlertCircle } from 'lucide-react';

// 카테고리별 선호도 데이터 (2025-12 ~ 2026-01)
const categoryData = [
  { category: '고기류', count: 892, percentage: 35 },
  { category: '채소류', count: 510, percentage: 20 },
  { category: '면류', count: 408, percentage: 16 },
  { category: '해산물', count: 382, percentage: 15 },
  { category: '기타', count: 357, percentage: 14 },
];

// 카테고리 분포 데이터 (원형 그래프용)
const pieData = [
  { name: '고기류', value: 35, color: '#ff6b6b' },
  { name: '채소류', value: 20, color: '#51cf66' },
  { name: '면류', value: 16, color: '#ffd93d' },
  { name: '해산물', value: 15, color: '#4ecdc4' },
  { name: '기타', value: 14, color: '#a8dadc' },
];

// 인기 메뉴 Top 5 데이터 (선호도 + 만족도 통합)
const topMenus = [
  { rank: 1, menu: '불고기', category: '고기류', votes: 312, satisfaction: 4.7 },
  { rank: 2, menu: '제육볶음', category: '고기류', votes: 298, satisfaction: 4.4 },
  { rank: 3, menu: '닭강정', category: '고기류', votes: 282, satisfaction: 4.6 },
  { rank: 4, menu: '카레라이스', category: '기타', votes: 265, satisfaction: 4.6 },
  { rank: 5, menu: '돈까스', category: '고기류', votes: 248, satisfaction: 4.5 },
];

interface StatsPreferencePageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function StatsPreferencePage({ onNavigate }: StatsPreferencePageProps) {
  // 총 투표 수 계산
  const totalVotes = categoryData.reduce((sum, item) => sum + item.count, 0);

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

  // 카테고리별 색상 가져오기
  const getCategoryColor = (category: string) => {
    switch (category) {
      case '고기류':
        return 'bg-red-50 text-red-600 border-red-100';
      case '채소류':
        return 'bg-green-50 text-green-600 border-green-100';
      case '면류':
        return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case '해산물':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  // AI 요약 생성
  const generateAISummary = () => {
    const topCategory = categoryData[0];
    const topMenu = topMenus[0];
    const secondMenu = topMenus[1];
    const topMeatMenus = topMenus.filter(m => m.category === '고기류').length;
    const seafoodPct = categoryData.find(c => c.category === '해산물')?.percentage || 0;
    const vegPct = categoryData.find(c => c.category === '채소류')?.percentage || 0;
    const noodlePct = categoryData.find(c => c.category === '면류')?.percentage || 0;
    const avgSatisfaction = (topMenus.reduce((sum, m) => sum + m.satisfaction, 0) / topMenus.length).toFixed(1);
    
    return {
      topCategory,
      topMenu,
      secondMenu,
      topMeatMenus,
      seafoodPct,
      vegPct,
      noodlePct,
      avgSatisfaction
    };
  };

  const analysis = generateAISummary();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">선호도</h1>
      </div>

      {/* 자동 분석 요약 영역 */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-sm p-6 mb-6 border border-purple-100">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-3">자동 분석 요약</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-start gap-2">
                <span className="text-purple-600 font-medium">•</span>
                <span>
                  2025년 12월부터 2026년 1월까지 총 <span className="font-medium text-purple-600">
                    {totalVotes.toLocaleString()}표
                  </span>의 선호도 데이터가 수집되었습니다.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-purple-600 font-medium">•</span>
                <span>
                  학생들은 <span className="font-medium text-red-600">
                    "{analysis.topCategory.category}"
                  </span>에 가장 높은 선호도를 보이며 전체의 {analysis.topCategory.percentage}% ({analysis.topCategory.count.toLocaleString()}표)를 차지했습니다.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-purple-600 font-medium">•</span>
                <span>
                  인기 메뉴 1위는 <span className="font-medium text-green-600">
                    "{analysis.topMenu.menu}" ({analysis.topMenu.votes}표)
                  </span>이며, "{analysis.secondMenu.menu}" ({analysis.secondMenu.votes}표)가 그 뒤를 잇고 있습니다.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-purple-600 font-medium">•</span>
                <span>
                  특히 Top 5 메뉴 중 <span className={`font-medium ${analysis.topMeatMenus >= 3 ? 'text-amber-600' : 'text-green-600'}`}>
                    {analysis.topMeatMenus}개
                  </span>가 고기류로 구성되어 있어 학생들의 육류 선호도가 뚜렷하게 나타나며, 평균 만족도는 <span className="font-medium text-blue-600">
                    {analysis.avgSatisfaction}점
                  </span>으로 매우 높습니다.
                </span>
              </p>
              <div className="mt-4 pt-4 border-t border-purple-200">
                <p className="text-xs text-gray-600">
                  💡 <span className="font-medium">활용 제안:</span> 해산물({analysis.seafoodPct}%)과 채소류({analysis.vegPct}%)는 상대적으로 낮은 선호도를 보이고 있어 조리법 다양화 및 학생 기호를 반영한 레시피 개발이 필요합니다. 면류({analysis.noodlePct}%)는 안정적인 선호도를 유지하고 있어 정기적인 제공이 권장됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리별 선호도 & 카테고리 분포 영역 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* 1️⃣ 카테고리별 선호도 영역 (막대 그래프) */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium mb-6">카테고리별 선호도</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: '투표 수', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}표`, '투표 수']}
              />
              <Legend />
              <Bar 
                dataKey="count" 
                fill="#5dccb4"
                radius={[4, 4, 0, 0]}
                name="선호도 (투표 수)"
                label={{ position: 'top', fontSize: 12 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 2️⃣ 카테고리 분포 영역 (원형 그래프) */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium mb-6">카테고리 분포</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center text-sm text-gray-600">
            총 투표 수: {totalVotes.toLocaleString()}표
          </div>
        </div>
      </div>

      {/* 3️⃣ 인기 메뉴 Top 5 영역 (선호도 + 만족도 통합) */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-medium mb-6">인기 메뉴 Top 5</h2>
        
        <div className="space-y-4">
          {topMenus.map((item) => {
            const percentage = (item.votes / totalVotes) * 100;
            
            return (
              <div
                key={item.rank}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer hover:border-[#5dccb4]"
                onClick={() => handleMenuClick(item.menu)}
              >
                <div className="flex items-center gap-4">
                  {/* 순위 뱃지 */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg ${
                    item.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                    item.rank === 2 ? 'bg-gray-100 text-gray-700' :
                    item.rank === 3 ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {item.rank}
                  </div>

                  {/* 메뉴 정보 및 진행바 */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-medium text-gray-900 hover:text-[#5dccb4]">
                          {item.menu}
                        </span>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </div>
                      
                      {/* 만족도 (보조 지표) */}
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Star className="text-yellow-400 fill-yellow-400" size={16} />
                        <span className="text-sm font-medium">{item.satisfaction}</span>
                        <span className="text-xs text-gray-400">/ 5.0</span>
                      </div>
                    </div>

                    {/* 선호도 진행바 (메인 지표) */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#5dccb4] to-[#4dbba3] h-4 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex items-baseline gap-1 min-w-[120px]">
                        <span className="text-lg font-semibold text-gray-900">
                          {item.votes.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">표</span>
                        <span className="text-sm font-medium text-[#5dccb4] ml-1">
                          ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 안내 */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            💡 메뉴를 클릭하면 해당 메뉴의 상세 급식 내역을 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
