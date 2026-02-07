import { useMemo } from 'react';

export function useOperationRecordCalendarLayout(currentMonth: Date) {
  return useMemo(() => {
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    const startDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();
    const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    return { daysInMonth, startDay, totalCells, weekdays };
  }, [currentMonth]);
}
