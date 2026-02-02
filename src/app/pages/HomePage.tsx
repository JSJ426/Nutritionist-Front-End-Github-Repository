import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KpiCard } from '../components/KpiCard';
import { KpiMiniCard } from '../components/KpiMiniCard';

export function HomePage() {
  // 현재 날짜 정보
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDate = today.getDate();
  const currentDay = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];
  
  // 오늘의 식단 데이터
  const todayMeals = {
    lunch: {
      menu: ['백미밥', '된장찌개', '제육볶음', '시금치나물', '배추김치'],
      calories: 850,
      nutrients: {
        protein: '32g',
        carbs: '98g',
        fat: '28g',
      },
      allergens: ['돼지고기', '대두', '밀'],
    },
    dinner: {
      menu: ['흑미밥', '미역국', '닭갈비', '감자조림', '깍두기'],
      calories: 780,
      nutrients: {
        protein: '28g',
        carbs: '92g',
        fat: '22g',
      },
      allergens: ['닭고기', '대두'],
    },
  };

  // 이 주의 식단표 데이터 (날짜 정보 포함)
  const weeklyMeals = [
    { 
      day: '월',
      date: 27, // 1월 27일
      lunch: {
        menu: [
          { name: '백미밥', allergy: [] },
          { name: '된장찌개', allergy: [5, 9] },
          { name: '제육볶음', allergy: [5, 6, 10] },
          { name: '시금치나물', allergy: [5] },
          { name: '배추김치', allergy: [9] },
        ]
      },
      dinner: {
        menu: [
          { name: '흑미밥', allergy: [] },
          { name: '미역국', allergy: [5] },
          { name: '닭갈비', allergy: [5, 6, 15] },
          { name: '감자조림', allergy: [5, 6] },
          { name: '깍두기', allergy: [9] },
        ]
      }
    },
    { 
      day: '화',
      date: 28, // 1월 28일
      lunch: {
        menu: [
          { name: '잡곡밥', allergy: [] },
          { name: '김치찌개', allergy: [5, 9, 10] },
          { name: '생선구이', allergy: [] },
          { name: '콩나물무침', allergy: [5] },
          { name: '배추김치', allergy: [9] },
        ]
      },
      dinner: {
        menu: [
          { name: '흰쌀밥', allergy: [] },
          { name: '콩나물국', allergy: [5] },
          { name: '불고기', allergy: [5, 6, 16] },
          { name: '계란찜', allergy: [1] },
          { name: '깍두기', allergy: [9] },
        ]
      }
    },
    { 
      day: '수',
      date: 29, // 1월 29일 (오늘)
      lunch: {
        menu: [
          { name: '현미밥', allergy: [] },
          { name: '육개장', allergy: [5, 6, 16] },
          { name: '감자전', allergy: [1, 5, 6] },
          { name: '애호박볶음', allergy: [5] },
          { name: '배추김치', allergy: [9] },
        ]
      },
      dinner: {
        menu: [
          { name: '백미밥', allergy: [] },
          { name: '순두부찌개', allergy: [5, 9] },
          { name: '돈까스', allergy: [1, 5, 6, 10] },
          { name: '샐러드', allergy: [1] },
          { name: '깍두기', allergy: [9] },
        ]
      }
    },
    { 
      day: '목',
      date: 30, // 1월 30일
      lunch: {
        menu: [
          { name: '잡곡밥', allergy: [] },
          { name: '떡국', allergy: [1, 5, 6, 16] },
          { name: '삼겹살구이', allergy: [10] },
          { name: '무생채', allergy: [] },
          { name: '배추김치', allergy: [9] },
        ]
      },
      dinner: {
        menu: [
          { name: '흰쌀밥', allergy: [] },
          { name: '된장찌개', allergy: [5, 9] },
          { name: '오징어볶음', allergy: [5, 6, 17] },
          { name: '고구마맛탕', allergy: [] },
          { name: '깍두기', allergy: [9] },
        ]
      }
    },
    { 
      day: '금',
      date: 31, // 1월 31일
      lunch: {
        menu: [
          { name: '비빔밥', allergy: [1, 5, 6, 16] },
          { name: '어묵국', allergy: [1, 5, 6] },
          { name: '튀김만두', allergy: [1, 5, 6, 10] },
          { name: '배추김치', allergy: [9] },
        ]
      },
      dinner: {
        menu: [
          { name: '백미밥', allergy: [] },
          { name: '김치찌개', allergy: [5, 9, 10] },
          { name: '함박스테이크', allergy: [1, 5, 6, 10, 16] },
          { name: '브로콜리숙채', allergy: [5] },
          { name: '깍두기', allergy: [9] },
        ]
      }
    },
  ];

  // 최근 15일 잔반량 데이터 (kg)
  const foodWasteData = Array.from({ length: 15 }, (_, i) => ({
    date: `${1}/${15 + i}`,
    중식: Math.floor(Math.random() * 30 + 20),
    석식: Math.floor(Math.random() * 25 + 15),
  }));

  // 최근 15일 결식률 데이터 (%)
  const absenteeData = Array.from({ length: 15 }, (_, i) => ({
    date: `${1}/${15 + i}`,
    중식: Math.floor(Math.random() * 15 + 5),
    석식: Math.floor(Math.random() * 20 + 10),
  }));

  // 최근 15일 만족도 데이터 (점수)
  const satisfactionData = Array.from({ length: 15 }, (_, i) => ({
    date: `${1}/${15 + i}`,
    중식: (Math.random() * 2 + 3).toFixed(1),
    석식: (Math.random() * 2 + 3).toFixed(1),
  }));

  // 직전일 데이터 (마지막 데이터)
  const lastDayWaste = foodWasteData[foodWasteData.length - 1];
  const lastDayAbsentee = absenteeData[absenteeData.length - 1];
  const lastDaySatisfaction = satisfactionData[satisfactionData.length - 1];

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
                  <div className="text-sm text-gray-800">{todayMeals.lunch.menu.join(', ')}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">칼로리: {todayMeals.lunch.calories} kcal</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">
                    (영양성분)
                  </div>
                  <div className="text-xs text-gray-600">
                    단백질 {todayMeals.lunch.nutrients.protein}, 탄수화물 {todayMeals.lunch.nutrients.carbs}, 지방 {todayMeals.lunch.nutrients.fat}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">알레르기 유발 식품</div>
                  <div className="text-sm text-red-600">{todayMeals.lunch.allergens.join(', ')}</div>
                </div>
              </div>
            </div>

            {/* 석식 카드 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-base font-medium mb-3 text-blue-700 pb-2 border-b border-blue-200">석식</h3>
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-gray-800">{todayMeals.dinner.menu.join(', ')}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">칼로리: {todayMeals.dinner.calories} kcal</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">
                    (영양성분)
                  </div>
                  <div className="text-xs text-gray-600">
                    단백질 {todayMeals.dinner.nutrients.protein}, 탄수화물 {todayMeals.dinner.nutrients.carbs}, 지방 {todayMeals.dinner.nutrients.fat}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">알레르기 유발 식품</div>
                  <div className="text-sm text-red-600">{todayMeals.dinner.allergens.join(', ')}</div>
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
                          {dayMeal.lunch.menu.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-start gap-1.5">
                              <span className="text-xs">{item.name}</span>
                              {item.allergy.length > 0 && (
                                <span className="text-xs text-gray-600 bg-[#FCE8E6] px-1 py-0.5 rounded flex-shrink-0">
                                  {item.allergy.join(',')}
                                </span>
                              )}
                            </div>
                          ))}
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
                          {dayMeal.dinner.menu.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-start gap-1.5">
                              <span className="text-xs">{item.name}</span>
                              {item.allergy.length > 0 && (
                                <span className="text-xs text-gray-600 bg-[#FCE8E6] px-1 py-0.5 rounded flex-shrink-0">
                                  {item.allergy.join(',')}
                                </span>
                              )}
                            </div>
                          ))}
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
              value="9.2"
              unit="%"
              diff="+1.4%"
              trend="up"
            />
            <KpiMiniCard
              title="주간 평균"
              value="8.3"
              unit="%"
              diff="0.0%"
              trend="same"
            />
            <KpiMiniCard
              title="월간 평균"
              value="8.3"
              unit="%"
              diff="-1.5%"
              trend="down"
            />
          </div>

          {/* 결식률 그래프 */}
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
        </div>

        {/* 잔반량 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-medium mb-4 pb-2 border-b-2 border-[#5dccb4]">잔반량</h2>
          
          {/* 잔반량 KPI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <KpiMiniCard
              title="어제 잔반량"
              value="48.9"
              unit="kg"
              diff="+8.4kg"
              trend="up"
            />
            <KpiMiniCard
              title="주간 평균"
              value="44.9"
              unit="kg"
              diff="0.0kg"
              trend="same"
            />
            <KpiMiniCard
              title="월간 평균"
              value="44.9"
              unit="kg"
              diff="-8.4kg"
              trend="down"
            />
          </div>

          {/* 잔반량 그래프 */}
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
        </div>

        {/* 만족도 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-medium mb-6 pb-2 border-b-2 border-[#5dccb4]">
            만족도
          </h2>
        
          {/* 상단 KPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* 평균 만족도 */}
            <KpiCard
              icon="⭐"
              title="이번 주 평균 만족도"
              value="4.5"
              unit="/ 5.0"
              sub="전주 대비 +0.2"
              color="yellow"
            />
        
            {/* 평가 수 */}
            <KpiCard
              title="만족도 평가 수"
              value="4,102"
              unit="건"
            />
          </div>
        
          {/* 하단 KPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>
        
        {/* 만족도 */}
        {/* <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-medium mb-4 pb-2 border-b-2 border-[#5dccb4]">만족도</h2> */}
          
          {/* 직전일 만족도 */}
          {/* <div className="mb-4 p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600 mb-2">직전일 ({lastDaySatisfaction.date})</div>
            <div className="flex justify-between">
              <div>
                <span className="text-sm">중식:</span>
                <span className="text-lg font-medium ml-2">{lastDaySatisfaction.중식}점</span>
              </div>
              <div>
                <span className="text-sm">석식:</span>
                <span className="text-lg font-medium ml-2">{lastDaySatisfaction.석식}점</span>
              </div>
            </div>
          </div> */}

          {/* 만족도 그래프 */}
          {/* <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} label={{ value: '점', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="중식" stroke="#5dccb4" strokeWidth={2} />
                <Line type="monotone" dataKey="석식" stroke="#ff7c7c" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
}
