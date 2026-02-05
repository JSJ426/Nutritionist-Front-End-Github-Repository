import { useEffect, useState } from 'react';

import { fetchMealPlanMonthly } from '../data/mealplan';

import { MealMonthlyCalendar } from '../components/MealMonthlyCalendar';

import { toMealMonthlyDataByMonth } from '../viewModels/meal';
import type { MealMonthlyData } from '../viewModels/meal';

export function MealMonthlyPage() {
  const now = new Date();
  const initialMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [mealDataByMonth, setMealDataByMonth] = useState<Record<string, MealMonthlyData>>({});
  const [currentMonth, setCurrentMonth] = useState(initialMonthKey);
  const [defaultMonth, setDefaultMonth] = useState(initialMonthKey);

  useEffect(() => {
    let isActive = true;

    const loadInitial = async () => {
      const response = await fetchMealPlanMonthly();
      if (!isActive) return;
      const dataByMonth = toMealMonthlyDataByMonth(response);
      const firstMonth = Object.keys(dataByMonth)[0] ?? '';
      const initialMonth = firstMonth || initialMonthKey;

      setMealDataByMonth(dataByMonth);
      setCurrentMonth(initialMonth);
      setDefaultMonth(initialMonth);
    };

    loadInitial();

    return () => {
      isActive = false;
    };
  }, []);

  const shiftMonthKey = (monthKey: string, delta: number) => {
    const [yearStr, monthStr] = monthKey.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    let nextMonth = month + delta;
    let nextYear = year;

    if (nextMonth < 1) {
      nextMonth = 12;
      nextYear -= 1;
    } else if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }

    const key = `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
    return { key, year: nextYear, month: nextMonth };
  };

  const moveToMonth = async (target: { key: string; year: number; month: number }) => {
    if (!target.key) return;
    if (mealDataByMonth[target.key]) {
      setCurrentMonth(target.key);
      return;
    }

    setCurrentMonth(target.key);
    const response = await fetchMealPlanMonthly(target.year, target.month);
    const dataByMonth = toMealMonthlyDataByMonth(response);
    const fetchedKey = Object.keys(dataByMonth)[0] ?? '';

    setMealDataByMonth((prev) => ({ ...prev, ...dataByMonth }));
    if (fetchedKey === target.key) return;
  };

  const handlePrevMonth = async () => {
    if (!currentMonth) return;
    await moveToMonth(shiftMonthKey(currentMonth, -1));
  };

  const handleNextMonth = async () => {
    if (!currentMonth) return;
    await moveToMonth(shiftMonthKey(currentMonth, 1));
  };

  const handleResetMonth = () => {
    if (defaultMonth) {
      setCurrentMonth(defaultMonth);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">식단표 (월간)</h1>
      </div>
      <MealMonthlyCalendar
        mealDataByMonth={mealDataByMonth}
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onResetMonth={handleResetMonth}
      />
    </div>
  );
}
