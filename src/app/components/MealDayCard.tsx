import { Info } from 'lucide-react';

type MealDetailPayload = {
  nutrition: {
    kcal: number;
    carb: number;
    prot: number;
    fat: number;
  };
  cost: number;
  aiComment: string;
  allergenSummary: {
    uniqueAllergens: number[];
    byMenu: Record<string, number[]>;
  };
};

interface MealDayCardProps {
  day: string;
  dateLabel: string;
  mealInfo: {
    lunch?: { menu: Array<{ name: string; allergy: number[] }>; detail?: MealDetailPayload };
    dinner?: { menu: Array<{ name: string; allergy: number[] }>; detail?: MealDetailPayload };
  } | undefined;
  weekLabel: string;
  onDetail: (
    week: string,
    day: string,
    mealType: 'lunch' | 'dinner',
    data: { menu: Array<{ name: string; allergy: number[] }>; detail?: MealDetailPayload }
  ) => void;
}

export function MealDayCard({ day, dateLabel, mealInfo, weekLabel, onDetail }: MealDayCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Day Header */}
      <div className="bg-[#5dccb4] text-white text-center py-2 font-medium">
        {day}요일 <span className="text-xs text-white/80">({dateLabel})</span>
      </div>

      {/* Meal Content */}
      {mealInfo ? (
        <div className="p-4 flex flex-col">
          {/* 중식 */}
          <div className="pb-4 border-b border-gray-200 flex flex-col">
            <div className="h-6 mb-2 flex items-center justify-between flex-shrink-0">
              <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                중식
              </span>
            </div>
            <div className="text-sm text-gray-800 leading-relaxed space-y-1 flex-1 mb-2">
              {mealInfo.lunch?.menu.map((item, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span>{item.name}</span>
                  {item.allergy && item.allergy.length > 0 && (
                    <span className="text-xs text-gray-600 bg-[#FCE8E6] px-1 py-0.5 rounded flex-shrink-0">
                      {item.allergy.join(',')}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => mealInfo.lunch && onDetail(weekLabel, day, 'lunch', mealInfo.lunch)}
              className="flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:text-[#5dccb4] hover:bg-[#5dccb4]/5 rounded transition-colors flex-shrink-0"
            >
              <Info className="w-3.5 h-3.5" />
              <span>상세보기</span>
            </button>
          </div>

          {/* 석식 */}
          <div className="pt-4 flex flex-col">
            <div className="h-6 mb-2 flex items-center justify-between flex-shrink-0">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                석식
              </span>
            </div>
            <div className="text-sm text-gray-800 leading-relaxed space-y-1 flex-1 mb-2">
              {mealInfo.dinner?.menu.map((item, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span>{item.name}</span>
                  {item.allergy && item.allergy.length > 0 && (
                    <span className="text-xs text-gray-600 bg-[#FCE8E6] px-1 py-0.5 rounded flex-shrink-0">
                      {item.allergy.join(',')}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => mealInfo.dinner && onDetail(weekLabel, day, 'dinner', mealInfo.dinner)}
              className="flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:text-[#5dccb4] hover:bg-[#5dccb4]/5 rounded transition-colors flex-shrink-0"
            >
              <Info className="w-3.5 h-3.5" />
              <span>상세보기</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-400 text-sm">
          식단 없음
        </div>
      )}
    </div>
  );
}
