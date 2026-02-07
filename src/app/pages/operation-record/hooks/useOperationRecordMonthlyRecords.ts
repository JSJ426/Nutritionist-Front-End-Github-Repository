import { useEffect, useState } from 'react';

import { getLeftoverMonthly, getSkipMealMonthly } from '../../../data/metrics';

import { DailyRecord } from '../utils';

const buildMonthlyRecords = (inputs: {
  leftoverLunch: Awaited<ReturnType<typeof getLeftoverMonthly>>;
  leftoverDinner: Awaited<ReturnType<typeof getLeftoverMonthly>>;
  skipLunch: Awaited<ReturnType<typeof getSkipMealMonthly>>;
  skipDinner: Awaited<ReturnType<typeof getSkipMealMonthly>>;
}): Record<string, DailyRecord> => {
  const byDate = new Map<string, DailyRecord>();
  const ensure = (date: string) => {
    if (!byDate.has(date)) {
      byDate.set(date, {
        lunchMissed: 0,
        lunchLeftoversKg: 0,
        dinnerMissed: 0,
        dinnerLeftoversKg: 0,
      });
    }
    return byDate.get(date)!;
  };

  inputs.leftoverLunch.data.daily_data.forEach((entry) => {
    const record = ensure(entry.date);
    record.lunchLeftoversKg = entry.amount_kg;
  });

  inputs.leftoverDinner.data.daily_data.forEach((entry) => {
    const record = ensure(entry.date);
    record.dinnerLeftoversKg = entry.amount_kg;
  });

  inputs.skipLunch.data.daily_data.forEach((entry) => {
    const record = ensure(entry.date);
    record.lunchMissed = entry.skipped_count;
  });

  inputs.skipDinner.data.daily_data.forEach((entry) => {
    const record = ensure(entry.date);
    record.dinnerMissed = entry.skipped_count;
  });

  return Object.fromEntries(byDate.entries());
};

export function useOperationRecordMonthlyRecords(currentMonth: Date, schoolId?: string) {
  const [records, setRecords] = useState<Record<string, DailyRecord>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) return;
    let isActive = true;
    const load = async () => {
      setIsLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;

      try {
        const [leftoverLunch, leftoverDinner, skipLunch, skipDinner] = await Promise.all([
          getLeftoverMonthly(year, month, 'LUNCH'),
          getLeftoverMonthly(year, month, 'DINNER'),
          getSkipMealMonthly(year, month, 'LUNCH'),
          getSkipMealMonthly(year, month, 'DINNER'),
        ]);
        if (!isActive) return;
        setRecords(
          buildMonthlyRecords({
            leftoverLunch,
            leftoverDinner,
            skipLunch,
            skipDinner,
          })
        );
      } catch (error) {
        console.error('Failed to load monthly records:', error);
        if (!isActive) return;
        setRecords({});
      } finally {
        if (!isActive) return;
        setIsLoading(false);
      }
    };
    load();
    return () => {
      isActive = false;
    };
  }, [currentMonth, schoolId]);

  return { records, setRecords, isLoading };
}
