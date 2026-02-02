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
  onEdit: (day: string, mealType: 'lunch' | 'dinner', event: React.MouseEvent) => void;
  onDetail: (weekNum: number, day: string, mealType: 'lunch' | 'dinner') => void;
  weekNum: number;
  hasChanges?: boolean;
}

export function MealWeekSectionEditable({
  weekLabel,
  weekDays,
  mealsByDay,
  dateLabels,
  onEdit,
  onDetail,
  weekNum,
  hasChanges,
}: MealWeekSectionEditableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
        {weekLabel}
      </h3>

      <div className="grid grid-cols-5 gap-4">
        {weekDays.map((day) => {
          const dayMeals = mealsByDay[day];
          return dayMeals ? (
            <MealDayCardEditable
              key={day}
              day={day}
              dateLabel={dateLabels[day]}
              weekNum={weekNum}
              meals={dayMeals}
              onEdit={onEdit}
              onDetail={onDetail}
              hasChanges={hasChanges}
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
    </div>
  );
}
