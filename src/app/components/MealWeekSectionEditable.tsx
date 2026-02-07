import { MealDayCardEditable } from './MealDayCardEditable';

interface MenuItem {
  name: string;
  allergy: number[];
}

interface MealData {
  menu: MenuItem[];
  isAiReplacement: boolean;
  aiReason?: string;
}

interface DayMeals {
  lunch: MealData;
  dinner: MealData;
}

interface MealWeekSectionEditableProps {
  weekLabel: string;
  weekDays: string[];
  mealsByDay: Record<string, DayMeals>;
  dateLabels: Record<string, string>;
  dateIsoLabels: Record<string, string>;
  dateInMonth: Record<string, boolean>;
  onEdit: (day: string, mealType: 'lunch' | 'dinner', event: React.MouseEvent) => void;
  onDetail: (weekNum: number, day: string, mealType: 'lunch' | 'dinner') => void;
  onAiReplace: (day: string, mealType: 'lunch' | 'dinner', date: string) => void;
  weekNum: number;
  hasChanges?: boolean;
}

export function MealWeekSectionEditable({
  weekLabel,
  weekDays,
  mealsByDay,
  dateLabels,
  dateIsoLabels,
  dateInMonth,
  onEdit,
  onDetail,
  onAiReplace,
  weekNum,
  hasChanges,
}: MealWeekSectionEditableProps) {
  const isEmptyWeek = !weekDays.some((day) => {
    if (!dateInMonth[day]) return false;
    const dayMeals = mealsByDay[day];
    const lunchCount = dayMeals?.lunch?.menu?.length ?? 0;
    const dinnerCount = dayMeals?.dinner?.menu?.length ?? 0;
    return lunchCount > 0 || dinnerCount > 0;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
        {weekLabel}
      </h3>

      {isEmptyWeek ? null : (
      <div className="grid grid-cols-5 gap-4">
        {weekDays.map((day) => {
          const dayMeals = mealsByDay[day];
          const inMonth = dateInMonth[day];
          if (!inMonth) {
            return (
              <MealDayCardEditable
                key={day}
                day={day}
                dateLabel={dateLabels[day]}
                mealDate={dateIsoLabels[day]}
                weekNum={weekNum}
                meals={dayMeals}
                onEdit={onEdit}
                onDetail={onDetail}
                onAiReplace={onAiReplace}
                hasChanges={false}
                isOutOfMonth={true}
              />
            );
          }

          return dayMeals ? (
            <MealDayCardEditable
              key={day}
              day={day}
              dateLabel={dateLabels[day]}
              mealDate={dateIsoLabels[day]}
              weekNum={weekNum}
              meals={dayMeals}
              onEdit={onEdit}
              onDetail={onDetail}
              onAiReplace={onAiReplace}
              hasChanges={hasChanges}
              isOutOfMonth={false}
            />
          ) : (
            <div
              key={day}
              className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-5 flex flex-col items-center justify-center min-h-[400px]"
            >
              <p className="text-gray-400 text-sm mb-3">식단 없음</p>
              <button className="px-4 py-2 text-sm text-[#5dccb4] hover:bg-[#5dccb4]/10 rounded-lg transition-colors">
                + 식단 추가
              </button>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
