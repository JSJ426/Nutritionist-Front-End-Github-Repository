import { useState, useEffect } from 'react';
import { getMealsByDateRange, MealDetail } from '../data/mealData';

interface MealViewPageProps {
  initialParams?: {
    startDate?: string;
    endDate?: string;
    menuSearch?: string;
    scope?: string;
  } | null;
}

export function MealViewPage({ initialParams }: MealViewPageProps) {
  const [startDate, setStartDate] = useState(initialParams?.startDate || '2026-01-01');
  const [endDate, setEndDate] = useState(initialParams?.endDate || '2026-01-31');
  const [menuSearch, setMenuSearch] = useState(initialParams?.menuSearch || '');
  const [meals, setMeals] = useState<MealDetail[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);

  // 초기 파라미터가 있으면 자동 검색
  useEffect(() => {
    if (initialParams && initialParams.menuSearch) {
      handleSearch();
    }
  }, [initialParams]);

  const handleSearch = () => {
    let results = getMealsByDateRange(startDate, endDate);
    
    // 메뉴 검색어가 있으면 필터링 (완전 일치만)
    if (menuSearch.trim()) {
      results = results.filter(meal => {
        const searchTerm = menuSearch.trim();
        return (
          meal.menu.rice === searchTerm ||
          meal.menu.soup === searchTerm ||
          meal.menu.main === searchTerm ||
          meal.menu.sides.some(side => side === searchTerm) ||
          (meal.menu.dessert && meal.menu.dessert === searchTerm)
        );
      });
    }
    
    setMeals(results);
    setHasSearched(true);
  };

  const handleViewDetail = (mealId: string) => {
    setSelectedMealId(mealId);
  };

  const handleBackToList = () => {
    setSelectedMealId(null);
  };

  // 상세보기 페이지로 이동
  if (selectedMealId) {
    const selectedMeal = meals.find(m => m.id === selectedMealId);
    if (!selectedMeal) {
      return <div>식단을 찾을 수 없습니다.</div>;
    }

    return (
      <div className="p-6">
        <div className="mb-6">
          <button 
            onClick={handleBackToList}
            className="text-[#5dccb4] hover:underline mb-2 flex items-center gap-1"
          >
            ← 목록으로 돌아가기
          </button>
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">식단 상세보기</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl">
          {/* 기본 정보 */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-2xl font-medium mb-4">기본 정보</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-600">날짜</span>
                <p className="text-lg font-medium">{selectedMeal.date}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">요일</span>
                <p className="text-lg font-medium">{selectedMeal.dayOfWeek}요일</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">식사 유형</span>
                <p className="text-lg font-medium">
                  <span className={`inline-block px-3 py-1 rounded text-sm ${
                    selectedMeal.mealType === "중식" 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedMeal.mealType}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* 메뉴 구성 */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-2xl font-medium mb-4">메뉴 구성</h2>
            <div className="space-y-3">
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">밥</span>
                <span className="flex-1">{selectedMeal.menu.rice}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">국/찌개</span>
                <span className="flex-1">{selectedMeal.menu.soup}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">주메뉴</span>
                <span className="flex-1">{selectedMeal.menu.main}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">부메뉴</span>
                <span className="flex-1">{selectedMeal.menu.sides.join(', ')}</span>
              </div>
              {selectedMeal.menu.dessert && (
                <div className="flex">
                  <span className="w-32 text-gray-600 font-medium">후식</span>
                  <span className="flex-1">{selectedMeal.menu.dessert}</span>
                </div>
              )}
            </div>
          </div>

          {/* 영양 정보 */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-2xl font-medium mb-4">영양 정보</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-50 p-4 rounded text-center">
                <span className="text-sm text-gray-600 block mb-1">총 칼로리</span>
                <span className="text-xl font-medium text-[#5dccb4]">{selectedMeal.nutrition.calories}</span>
                <span className="text-sm text-gray-600"> kcal</span>
              </div>
              <div className="bg-gray-50 p-4 rounded text-center">
                <span className="text-sm text-gray-600 block mb-1">탄수화물</span>
                <span className="text-xl font-medium">{selectedMeal.nutrition.carbs}</span>
                <span className="text-sm text-gray-600"> g</span>
              </div>
              <div className="bg-gray-50 p-4 rounded text-center">
                <span className="text-sm text-gray-600 block mb-1">단백질</span>
                <span className="text-xl font-medium">{selectedMeal.nutrition.protein}</span>
                <span className="text-sm text-gray-600"> g</span>
              </div>
              <div className="bg-gray-50 p-4 rounded text-center">
                <span className="text-sm text-gray-600 block mb-1">지방</span>
                <span className="text-xl font-medium">{selectedMeal.nutrition.fat}</span>
                <span className="text-sm text-gray-600"> g</span>
              </div>
              <div className="bg-gray-50 p-4 rounded text-center">
                <span className="text-sm text-gray-600 block mb-1">나트륨</span>
                <span className="text-xl font-medium">{selectedMeal.nutrition.sodium}</span>
                <span className="text-sm text-gray-600"> mg</span>
              </div>
            </div>
          </div>

          {/* 알레르기 정보 */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-2xl font-medium mb-4">알레르기 정보</h2>
            <div className="bg-[#FCE8E6] p-4 rounded">
              <p className="text-gray-800">
                알레르기: {selectedMeal.allergy.map(num => {
                  const circledNum = String.fromCharCode(9311 + num); // ① = 9312
                  const allergyName = ['', '난류', '우유', '메밀', '땅콩', '대두', '밀', '고등어', '게', '새우', '돼지고기', '복숭아', '토마토', '아황산류', '호두', '닭고기', '쇠고기', '오징어', '조개류'][num] || '';
                  return `${circledNum}${allergyName}`;
                }).join(' ')}
              </p>
            </div>
          </div>

          {/* 운영 및 평가 정보 */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-2xl font-medium mb-4">운영 및 평가 정보</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <span className="text-sm text-gray-600 block mb-2">급식 참여율</span>
                <span className="text-2xl font-medium text-[#5dccb4]">{selectedMeal.operation.participationRate}%</span>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <span className="text-sm text-gray-600 block mb-2">잔반량</span>
                <span className="text-2xl font-medium">{selectedMeal.operation.leftoverAmount}g</span>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <span className="text-sm text-gray-600 block mb-2">만족도</span>
                <span className="text-2xl font-medium">{selectedMeal.operation.satisfaction.toFixed(1)}</span>
                <span className="text-sm text-gray-600"> / 5.0</span>
              </div>
            </div>
          </div>

          {/* 생성 및 관리 이력 */}
          <div>
            <h2 className="text-2xl font-medium mb-4">생성 및 관리 이력</h2>
            <div className="space-y-3">
              <div className="flex">
                <span className="w-40 text-gray-600 font-medium">생성 방식</span>
                <span className="flex-1">{selectedMeal.history.createdBy}</span>
              </div>
              <div className="flex">
                <span className="w-40 text-gray-600 font-medium">생성 일시</span>
                <span className="flex-1">{selectedMeal.history.createdAt}</span>
              </div>
              <div className="flex">
                <span className="w-40 text-gray-600 font-medium">마지막 수정 일시</span>
                <span className="flex-1">{selectedMeal.history.lastModifiedAt}</span>
              </div>
              <div className="flex">
                <span className="w-40 text-gray-600 font-medium">수정 사유</span>
                <span className="flex-1">{selectedMeal.history.modificationReason}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 조회 페이지
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">식단표 조회</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Search Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">시작 날짜</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">종료 날짜</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">메뉴 검색</label>
            <input 
              type="text" 
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleSearch}
              className="px-6 py-2 bg-[#5dccb4] text-white rounded hover:bg-[#4dbba3]"
            >
              조회
            </button>
          </div>
        </div>

        {/* Results Table */}
        {hasSearched && (
          <div className="overflow-x-auto">
            {meals.length === 0 ? (
              <p className="text-center text-gray-500 py-8">조회된 식단이 없습니다.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4">날짜</th>
                    <th className="text-left py-3 px-4">식사 유형</th>
                    <th className="text-left py-3 px-4">주메뉴</th>
                    <th className="text-left py-3 px-4">총 칼로리</th>
                    <th className="text-left py-3 px-4">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // 날짜별로 그룹화
                    const mealsByDate: { [date: string]: MealDetail[] } = {};
                    meals.forEach(meal => {
                      if (!mealsByDate[meal.date]) {
                        mealsByDate[meal.date] = [];
                      }
                      mealsByDate[meal.date].push(meal);
                    });

                    // 정렬된 날짜 배열
                    const sortedDates = Object.keys(mealsByDate).sort((a, b) => b.localeCompare(a));

                    return sortedDates.map(date => {
                      const mealsForDate = mealsByDate[date];
                      return mealsForDate.map((meal, index) => (
                        <tr key={meal.id} className="border-b border-gray-200 hover:bg-gray-50">
                          {index === 0 && (
                            <td className="py-3 px-4 align-top" rowSpan={mealsForDate.length}>
                              {meal.date} ({meal.dayOfWeek})
                            </td>
                          )}
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 rounded text-xs ${
                              meal.mealType === "중식" 
                                ? 'bg-orange-100 text-orange-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {meal.mealType}
                            </span>
                          </td>
                          <td className="py-3 px-4">{meal.menu.main}</td>
                          <td className="py-3 px-4">{meal.nutrition.calories} kcal</td>
                          <td className="py-3 px-4">
                            <button 
                              onClick={() => handleViewDetail(meal.id)}
                              className="text-[#5dccb4] hover:underline text-sm"
                            >
                              상세보기
                            </button>
                          </td>
                        </tr>
                      ));
                    });
                  })()}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}