import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { fetchMealPlanMonthly } from '../data/mealplan';

import { MealMonthlyCalendar } from '../components/MealMonthlyCalendar';

import { toMealMonthlyDataByMonth } from '../viewModels/meal';
import type { MealMonthlyData } from '../viewModels/meal';

export function MealMonthlyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const now = new Date();
  const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const initialMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const maxSelectableMonthKey = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}`;
  const [mealDataByMonth, setMealDataByMonth] = useState<Record<string, MealMonthlyData>>({});
  const queryMonth = searchParams.get('month');
  const monthPattern = /^\d{4}-\d{2}$/;
  const clampMonthKey = (monthKey: string) =>
    monthKey > maxSelectableMonthKey ? maxSelectableMonthKey : monthKey;
  const initialCurrentMonth =
    queryMonth && monthPattern.test(queryMonth) ? clampMonthKey(queryMonth) : initialMonthKey;
  const [currentMonth, setCurrentMonth] = useState(initialCurrentMonth);
  const [defaultMonth, setDefaultMonth] = useState(initialMonthKey);

  const setMonthInQuery = (monthKey: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('month', monthKey);
    setSearchParams(nextParams);
  };

  useEffect(() => {
    const nextMonth = searchParams.get('month');
    if (!nextMonth || !monthPattern.test(nextMonth)) return;
    const clampedMonth = clampMonthKey(nextMonth);
    if (clampedMonth !== nextMonth) {
      setMonthInQuery(clampedMonth);
    }
    setCurrentMonth((prev) => (prev === clampedMonth ? prev : clampedMonth));
  }, [searchParams]);

  useEffect(() => {
    let isActive = true;

    const loadInitial = async () => {
      const response = await fetchMealPlanMonthly(now.getFullYear(), now.getMonth() + 1);
      if (!isActive) return;
      const dataByMonth = toMealMonthlyDataByMonth(response);

      setMealDataByMonth(dataByMonth);
      setCurrentMonth(initialCurrentMonth);
      setDefaultMonth(initialMonthKey);
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
    if (target.key > maxSelectableMonthKey) return;
    setMonthInQuery(target.key);

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
      setMonthInQuery(defaultMonth);
    }
  };

  return (
    <div className="p-6 text-lg">
      <div className="mb-6">
        <h1 className="text-4xl font-medium border-b-2 border-gray-300 pb-2">식단표 (월간)</h1>
      </div>
      <MealMonthlyCalendar
        mealDataByMonth={mealDataByMonth}
        currentMonth={currentMonth}
        canGoNextMonth={currentMonth < maxSelectableMonthKey}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onResetMonth={handleResetMonth}
      />
    </div>
  );
}
