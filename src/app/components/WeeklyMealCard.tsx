import type { MenuItem } from '../viewModels/meal';

type WeeklyMealCardProps = {
  day: string;
  date: number;
  currentMonth: number;
  isToday: boolean;
  lunchMenu: MenuItem[];
  dinnerMenu: MenuItem[];
};

export function WeeklyMealCard({
  day,
  date,
  currentMonth,
  isToday,
  lunchMenu,
  dinnerMenu,
}: WeeklyMealCardProps) {
  const normalizeMenu = (menu: MenuItem[]) => {
    const nonEmpty = menu.filter((item) => item.name.trim().length > 0);
    const emptyCount = Math.max(0, 7 - nonEmpty.length);
    const padded = [
      ...nonEmpty,
      ...Array.from({ length: emptyCount }, () => ({ name: '', allergy: [] })),
    ];

    return padded.slice(0, 7);
  };

  const normalizedLunchMenu = normalizeMenu(lunchMenu);
  const normalizedDinnerMenu = normalizeMenu(dinnerMenu);
  const isLunchEmpty =
    normalizedLunchMenu.length > 0 &&
    normalizedLunchMenu.every((item) => item.name.trim().length === 0);
  const isDinnerEmpty =
    normalizedDinnerMenu.length > 0 &&
    normalizedDinnerMenu.every((item) => item.name.trim().length === 0);

  return (
    <div
      className={`flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${
        isToday ? 'border-[#5dccb4] shadow-2xl' : 'border-gray-200'
      }`}
      style={{
        width: isToday ? '216px' : '200px',
        transform: isToday ? 'scale(1.08)' : 'scale(1)',
      }}
    >
      {/* Day Header */}
      <div className={`text-white text-center py-2 font-medium ${isToday ? 'bg-[#5dccb4]' : 'bg-[#5dccb4]'}`}>
        {day}요일 <span className="text-sm">({currentMonth}월 {date}일)</span>
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
            {isLunchEmpty ? (
              <div className="text-base text-gray-400 min-h-[140px] flex items-center">
                식단 없음
              </div>
            ) : (
              normalizedLunchMenu.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-start gap-1.5 min-h-[20px]">
                  {item.name ? (
                    <>
                      <span className="text-sm">{item.name}</span>
                      {item.allergy.length > 0 && (
                        <span className="text-xs text-gray-600 bg-[#FCE8E6] px-1 py-0.5 rounded flex-shrink-0">
                          {item.allergy.join(',')}
                        </span>
                      )}
                    </>
                  ) : null}
                </div>
              ))
            )}
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
            {isDinnerEmpty ? (
              <div className="text-base text-gray-400 min-h-[140px] flex items-center">
                식단 없음
              </div>
            ) : (
              normalizedDinnerMenu.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-start gap-1.5 min-h-[20px]">
                  {item.name ? (
                    <>
                      <span className="text-sm">{item.name}</span>
                      {item.allergy.length > 0 && (
                        <span className="text-xs text-gray-600 bg-[#FCE8E6] px-1 py-0.5 rounded flex-shrink-0">
                          {item.allergy.join(',')}
                        </span>
                      )}
                    </>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

