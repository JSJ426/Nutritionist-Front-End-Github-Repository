import { useState } from 'react';
import { MealDetailModal } from './MealDetailModal';
import { WeekFilterButtons } from './WeekFilterButtons';
import { MealWeekSection } from './MealWeekSection';
import {
  getWeekDatesForMonth,
  WEEKDAY_INDICES_MON_FRI,
  WEEKDAY_LABELS_MON_FRI,
} from '../utils/calendar';

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

type MealData = {
  menu: Array<{ name: string; allergy: number[] }>;
  detail?: MealDetailPayload;
};

type DayMeals = {
  lunch?: MealData;
  dinner?: MealData;
};

type WeekData = {
  week: string;
  meals: Record<string, DayMeals>;
};

type MealMonthlyData = {
  month: string;
  target: string;
  weeks: WeekData[];
};

interface MealMonthlyCalendarProps {
  mealDataByMonth: Record<string, MealMonthlyData>;
  currentMonth: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onResetMonth: () => void;
}

export function MealMonthlyCalendar({
  mealDataByMonth,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onResetMonth,
}: MealMonthlyCalendarProps) {
  const weekDays = WEEKDAY_LABELS_MON_FRI;
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [detailMeal, setDetailMeal] = useState<{
    week: string;
    day: string;
    mealType: 'lunch' | 'dinner';
    data: { menu: Array<{ name: string; allergy: number[] }>; detail?: MealDetailPayload };
  } | null>(null);

  const handleDetailMeal = (
    week: string,
    day: string,
    mealType: 'lunch' | 'dinner',
    data: { menu: Array<{ name: string; allergy: number[] }>; detail?: MealDetailPayload }
  ) => {
    setDetailMeal({ week, day, mealType, data });
  };

  const activeMonth = currentMonth || (Object.keys(mealDataByMonth)[0] ?? '');
  const mealData = activeMonth ? mealDataByMonth[activeMonth] : undefined;

  // Filter weeks based on selected week
  const displayWeeks = mealData
    ? selectedWeek !== null
      ? mealData.weeks.filter((_, idx) => idx === selectedWeek)
      : mealData.weeks
    : [];

  const isValidMonthKey = /^\d{4}-\d{2}$/.test(activeMonth);
  const monthKey = isValidMonthKey ? activeMonth : '';
  const [yearStr, monthStr] = monthKey.split('-');
  const today = new Date();
  const year = yearStr ? Number(yearStr) : today.getFullYear();
  const month = monthStr ? Number(monthStr) : today.getMonth() + 1;

  const getWeekDateMeta = (weekIndex: number) => {
    const weekDates = getWeekDatesForMonth({
      year,
      monthIndex: month - 1,
      weekIndex,
      weekDayIndices: [...WEEKDAY_INDICES_MON_FRI],
      weekStartsOnMonday: true,
    });

    return weekDays.reduce<Record<string, { label: string; inMonth: boolean }>>((acc, day, idx) => {
      const { date, inMonth } = weekDates[idx];
      const labelMonth = String(date.getMonth() + 1).padStart(2, '0');
      const labelDay = String(date.getDate()).padStart(2, '0');
      acc[day] = { label: `${labelMonth}-${labelDay}`, inMonth };
      return acc;
    }, {});
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium">{year}년 {Number(month)}월</h2>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50" onClick={onPrevMonth}>
              이전 달
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50" onClick={onNextMonth}>
              다음 달
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50" onClick={onResetMonth}>
              원래 달로 돌아가기
            </button>
          </div>
        </div>
      </div>

      {mealData ? (
        <WeekFilterButtons
          weeks={mealData.weeks}
          selectedWeek={selectedWeek}
          onSelect={setSelectedWeek}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <p className="text-gray-600">해당 월의 식단 데이터가 없습니다.</p>
        </div>
      )}

      {/* Week by Week Layout */}
      <div className="space-y-6">
        {displayWeeks.map((weekData, weekIdx) => {
          const actualWeekIndex = selectedWeek === null ? weekIdx : selectedWeek;
          const dateMeta = getWeekDateMeta(actualWeekIndex);
          return (
            <MealWeekSection
              key={weekData.week}
              weekLabel={weekData.week}
              weekDays={weekDays}
              mealsByDay={weekData.meals}
              dateLabels={Object.fromEntries(
                Object.entries(dateMeta).map(([day, meta]) => [day, meta.label])
              )}
              dateInMonth={Object.fromEntries(
                Object.entries(dateMeta).map(([day, meta]) => [day, meta.inMonth])
              )}
              onDetail={handleDetailMeal}
            />
          );
        })}
      </div>

      {/* Detail Meal Modal */}
      {detailMeal && (
        <MealDetailModal
          day={detailMeal.day}
          week={detailMeal.week}
          mealType={detailMeal.mealType}
          mealData={detailMeal.data}
          detail={detailMeal.data.detail}
          onClose={() => setDetailMeal(null)}
        />
      )}
    </div>
  );
}
