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
  isOutOfMonth: boolean;
  onDetail: (
    week: string,
    day: string,
    mealType: 'lunch' | 'dinner',
    data: { menu: Array<{ name: string; allergy: number[] }>; detail?: MealDetailPayload }
  ) => void;
}

export function MealDayCard({ day, dateLabel, mealInfo, weekLabel, isOutOfMonth, onDetail }: MealDayCardProps) {
  const normalizeMenu = (menu: Array<{ name: string; allergy: number[] }>) => {
    const nonEmpty = menu.filter((item) => item.name.trim().length > 0);
    const emptyCount = Math.max(0, 7 - nonEmpty.length);
    const padded = [
      ...nonEmpty,
      ...Array.from({ length: emptyCount }, () => ({ name: '', allergy: [] })),
    ];

    return padded.slice(0, 7);
  };

  const normalizedLunchMenu = mealInfo?.lunch?.menu ? normalizeMenu(mealInfo.lunch.menu) : [];
  const normalizedDinnerMenu = mealInfo?.dinner?.menu ? normalizeMenu(mealInfo.dinner.menu) : [];
  const isLunchEmpty = normalizedLunchMenu.length > 0
    && normalizedLunchMenu.every((item) => item.name.trim().length === 0);
  const isDinnerEmpty = normalizedDinnerMenu.length > 0
    && normalizedDinnerMenu.every((item) => item.name.trim().length === 0);

  if (isOutOfMonth) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-100 text-gray-400 text-center py-2 font-medium">
          {day}요일 <span className="text-xs text-gray-400">({dateLabel})</span>
        </div>
        <div className="bg-gray-50 min-h-[280px]" />
      </div>
    );
  }

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
              {normalizedLunchMenu.map((item, idx) => (
                <div key={idx} className="flex items-start gap-1.5 min-h-[20px]">
                  {item.name ? (
                    <>
                      <span>{item.name}</span>
                      {item.allergy && item.allergy.length > 0 && (
                        <span className="text-xs text-gray-600 bg-[#FCE8E6] px-1 py-0.5 rounded flex-shrink-0">
                          {item.allergy.join(',')}
                        </span>
                      )}
                    </>
                  ) : null}
                </div>
              ))}
            </div>
            <button
              onClick={() => mealInfo.lunch && onDetail(weekLabel, day, 'lunch', mealInfo.lunch)}
              className="flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:text-[#5dccb4] hover:bg-[#5dccb4]/5 rounded transition-colors flex-shrink-0 disabled:text-gray-300"
              disabled={isLunchEmpty}
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
              {normalizedDinnerMenu.map((item, idx) => (
                <div key={idx} className="flex items-start gap-1.5 min-h-[20px]">
                  {item.name ? (
                    <>
                      <span>{item.name}</span>
                      {item.allergy && item.allergy.length > 0 && (
                        <span className="text-xs text-gray-600 bg-[#FCE8E6] px-1 py-0.5 rounded flex-shrink-0">
                          {item.allergy.join(',')}
                        </span>
                      )}
                    </>
                  ) : null}
                </div>
              ))}
            </div>
            <button
              onClick={() => mealInfo.dinner && onDetail(weekLabel, day, 'dinner', mealInfo.dinner)}
              className="flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:text-[#5dccb4] hover:bg-[#5dccb4]/5 rounded transition-colors flex-shrink-0 disabled:text-gray-300"
              disabled={isDinnerEmpty}
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
