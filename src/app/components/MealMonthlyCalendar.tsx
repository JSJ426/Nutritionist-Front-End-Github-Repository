import { useState } from 'react';
import { MealDetailModal } from './MealDetailModal';
import { WeekFilterButtons } from './WeekFilterButtons';
import { MealWeekSection } from './MealWeekSection';

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
}

export function MealMonthlyCalendar({ mealDataByMonth }: MealMonthlyCalendarProps) {
  const weekDays = ['월', '화', '수', '목', '금'];
  const defaultMonth = Object.keys(mealDataByMonth)[0] ?? "2026-01";
  const [currentMonth, setCurrentMonth] = useState(defaultMonth);
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

  const handlePrevMonth = () => {
    const currentYear = parseInt(currentMonth.split('-')[0]);
    const currentMonthNum = parseInt(currentMonth.split('-')[1]);
    let newMonthNum = currentMonthNum - 1;
    let newYear = currentYear;

    if (newMonthNum < 1) {
      newMonthNum = 12;
      newYear -= 1;
    }

    const newMonth = `${newYear}-${newMonthNum.toString().padStart(2, '0')}`;
    
    // Only change month if data exists
    if (mealDataByMonth[newMonth]) {
      setCurrentMonth(newMonth);
    }
  };

  const handleNextMonth = () => {
    const currentYear = parseInt(currentMonth.split('-')[0]);
    const currentMonthNum = parseInt(currentMonth.split('-')[1]);
    let newMonthNum = currentMonthNum + 1;
    let newYear = currentYear;

    if (newMonthNum > 12) {
      newMonthNum = 1;
      newYear += 1;
    }

    const newMonth = `${newYear}-${newMonthNum.toString().padStart(2, '0')}`;
    
    // Only change month if data exists
    if (mealDataByMonth[newMonth]) {
      setCurrentMonth(newMonth);
    }
  };

  const handleResetMonth = () => {
    setCurrentMonth(defaultMonth);
  };

  const mealData = mealDataByMonth[currentMonth];

  // If no data for current month, return error message
  if (!mealData) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600">해당 월의 식단 데이터가 없습니다.</p>
      </div>
    );
  }

  // Filter weeks based on selected week
  const displayWeeks = selectedWeek !== null 
    ? mealData.weeks.filter((_, idx) => idx === selectedWeek)
    : mealData.weeks;

  const [yearStr, monthStr] = mealData.month.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);

  const getWeekDateLabels = (weekIndex: number) => {
    const firstDay = new Date(year, month - 1, 1);
    const dayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0
    const firstMonday = new Date(year, month - 1, 1 - dayOfWeek);
    const weekMonday = new Date(firstMonday);
    weekMonday.setDate(firstMonday.getDate() + weekIndex * 7);

    return weekDays.reduce<Record<string, string>>((acc, day, idx) => {
      const date = new Date(weekMonday);
      date.setDate(weekMonday.getDate() + idx);
      const labelMonth = String(date.getMonth() + 1).padStart(2, '0');
      const labelDay = String(date.getDate()).padStart(2, '0');
      acc[day] = `${labelMonth}-${labelDay}`;
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
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50" onClick={handlePrevMonth}>
              이전 달
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50" onClick={handleNextMonth}>
              다음 달
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50" onClick={handleResetMonth}>
              원래 달로 돌아가기
            </button>
          </div>
        </div>
      </div>

      <WeekFilterButtons
        weeks={mealData.weeks}
        selectedWeek={selectedWeek}
        onSelect={setSelectedWeek}
      />

      {/* Week by Week Layout */}
      <div className="space-y-6">
        {displayWeeks.map((weekData, weekIdx) => {
          const actualWeekIndex = selectedWeek === null ? weekIdx : selectedWeek;
          return (
            <MealWeekSection
              key={weekData.week}
              weekLabel={weekData.week}
              weekDays={weekDays}
              mealsByDay={weekData.meals}
              dateLabels={getWeekDateLabels(actualWeekIndex)}
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
