import { CircleCheck, CircleDot } from 'lucide-react';
import mealBottomImage from 'figma:asset/fd7365955dd9ab94453ff223adf92fe98a6eb6b8.png';

const weekDays = ['월', '화', '수', '목', '금'];
const meals = [
  ['잡곡밥', '미역국', '삼겹살', '콩자반', '파김치/과일'],
  ['현미밥', '된장국', '고등어조림', '맛살오이냉채', '배추김치/과일'],
  ['흰쌀밥', '육개장', '불고기', '가지나물', '깍두기/과일'],
  ['카레라이스', '김치', '오징어무침', '미나리무생채', '배추김치/과일쥬스'],
  ['비빔밥', '계란국', '해물파전', '베이컨그린빈볶음', '깍두기/과일']
];
const mealsRow2 = [
  ['흑미밥', '만두국', '가자미조림', '두부계란구이', '배추김치/과일쥬스'],
  ['흰쌀밥', '순두부찌개', '해물동그랑땡', '무말랭이', '배추김치/과일'],
  ['흰쌀밥', '닭곰탕', '소세지/케찹', '오징어젓무침', '깍두기/과일'],
  ['야채볶음밥', '짬뽕국', '탕수육', '모듬튀김', '배추김치/과일쥬스'],
  ['현미밥', '등뼈해장국', '마파두부', '고로케튀김', '깍두기/과일']
];

export function MealCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <button className="p- hover:bg-gray-100 rounded-full">
        </button>
      </div>

      <div className="flex items-start gap-6">
        {/* Left side - Meal info and image */}
        <div className="flex-[1.2]">
          <div className="inline-flex items-center gap-2 bg-[#5dccb4] text-white px-4 py-1.5 rounded-full mb-4">
            <CircleCheck size={16} />
            <span className="text-sm">오늘의 중식</span>
          </div>
          
          <h3 className="text-2xl font-medium mb-1">흰쌀밥 · 육개장 · 불고기</h3>
          <h3 className="text-xl font-medium mb-1">가지나물 · 깍두기/과일 </h3>
          <p className="text-gray-600 text-sm mb-1">알레르기 3종 | 1인 분량 780kcal</p>
          
          {/* Meal image */}
          <div className="mt-3">
            <img src={mealBottomImage} alt="오늘의 식단" className="w-full rounded-lg" />
          </div>
        </div>

        {/* Right side - Calendar */}
        <div className="flex-[3]">
          <div className="grid grid-cols-6 gap-2">
            {/* Header */}
            <div className="text-center"></div>
            {weekDays.map((day, idx) => (
              <div 
                key={day}
                className={`text-center py-2 text-sm font-medium ${
                  idx === 2 ? 'bg-[#5dccb4] text-white rounded-t-lg' : ''
                }`}
              >
                {day}
              </div>
            ))}

            {/* First row */}
            <div className="text-center py-2 text-xs text-gray-500">중식</div>
            {meals.map((mealList, idx) => (
              <div
                key={`meal1-${idx}`}
                className={`text-center py-3 text-sm border border-gray-200 ${
                  idx === 2 ? "bg-[#5dccb4] text-white border-[#5dccb4]" : "bg-gray-50"
                }`}
              >
                <div className="flex flex-col items-center gap-1 leading-tight">
                  {mealList.map((menu, i) => (
                    <div key={i} className="whitespace-nowrap">
                      {menu}
                    </div>
                  ))}
                </div>
              </div>
            ))}


           {/* Second row */}
            <div className="text-center py-2 text-xs text-gray-500">석식</div>
            {mealsRow2.map((mealList, idx) => (
              <div
                key={`meal2-${idx}`}
                className={`text-center py-3 text-sm border border-gray-200 ${
                  idx === 2 ? "bg-[#5dccb4] text-white border-[#5dccb4]" : "bg-gray-50"
                }`}
              >
                <div className="flex flex-col items-center gap-1 leading-tight">
                  {mealList.map((menu, i) => (
                    <div key={i} className="whitespace-nowrap">
                      {menu}
                    </div>
                  ))}
                </div>
              </div>
            ))}


            {/* Third row - TODAY marker */}
            <div></div>
            <div></div>
            <div></div>
            <div className="text-center bg-[#5dccb4] text-white py-1 text-xs rounded-b-lg">
              TODAY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}