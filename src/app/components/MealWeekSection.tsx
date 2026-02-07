import { MealDayCard } from './MealDayCard';

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

interface MealWeekSectionProps {
  weekLabel: string;
  weekDays: string[];
  mealsByDay: Record<string, { lunch?: { menu: Array<{ name: string; allergy: number[] }>; detail?: MealDetailPayload }; dinner?: { menu: Array<{ name: string; allergy: number[] }>; detail?: MealDetailPayload } }>;
  dateLabels: Record<string, string>;
  dateInMonth: Record<string, boolean>;
  onDetail: (
    week: string,
    day: string,
    mealType: 'lunch' | 'dinner',
    data: { menu: Array<{ name: string; allergy: number[] }>; detail?: MealDetailPayload }
  ) => void;
}

export function MealWeekSection({ weekLabel, weekDays, mealsByDay, dateLabels, dateInMonth, onDetail }: MealWeekSectionProps) {
  const isEmptyWeek = !weekDays.some((day) => {
    if (!dateInMonth[day]) return false;
    const dayMeals = mealsByDay[day];
    return Boolean(dayMeals?.lunch || dayMeals?.dinner);
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
        {weekLabel}
      </h3>

      {isEmptyWeek ? null : (
      <div className="grid grid-cols-5 gap-4">
        {weekDays.map((day) => (
          <MealDayCard
            key={day}
            day={day}
            dateLabel={dateLabels[day]}
            mealInfo={dateInMonth[day] ? mealsByDay[day] : undefined}
            weekLabel={weekLabel}
            onDetail={onDetail}
            isOutOfMonth={!dateInMonth[day]}
          />
        ))}
      </div>
      )}
    </div>
  );
}
