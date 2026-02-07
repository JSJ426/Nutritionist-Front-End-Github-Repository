import { useEffect, useState } from 'react';

import { fetchMealPlanMonthly } from '../data/mealplan';
import { emptyMealAvailability, MealAvailability } from '../utils/OperationRecordUtils';

type MealAvailabilityByDate = Record<string, MealAvailability>;

export function useOperationRecordMealAvailability(currentMonth: Date) {
  const [mealAvailability, setMealAvailability] = useState<MealAvailabilityByDate>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      setIsLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;

      try {
        const response = await fetchMealPlanMonthly(year, month);
        if (!isActive) return;
        const next: MealAvailabilityByDate = {};
        response.data.menus.forEach((menu) => {
          const entry = next[menu.date] ?? { ...emptyMealAvailability };
          if (menu.meal_type === 'LUNCH') {
            entry.lunch = true;
          }
          if (menu.meal_type === 'DINNER') {
            entry.dinner = true;
          }
          next[menu.date] = entry;
        });
        setMealAvailability(next);
      } catch (error) {
        console.error('Failed to load meal plan monthly:', error);
        if (!isActive) return;
        setMealAvailability({});
      } finally {
        if (!isActive) return;
        setIsLoading(false);
      }
    };

    load();
    return () => {
      isActive = false;
    };
  }, [currentMonth]);

  return { mealAvailability, isLoading };
}
