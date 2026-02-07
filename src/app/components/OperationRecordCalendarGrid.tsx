import { OperationRecordDayCell } from './OperationRecordDayCell';
import {
  emptyMealAvailability,
  formatDate,
  DailyRecord,
  MealAvailability,
} from '../utils/OperationRecordUtils';

type OperationRecordCalendarGridProps = {
  currentMonth: Date;
  records: Record<string, DailyRecord>;
  selectedDate: string | null;
  isModalOpen: boolean;
  serverToday: Date;
  mealAvailability: Record<string, MealAvailability>;
  onSelectDate: (dateStr: string) => void;
};

export function OperationRecordCalendarGrid({
  currentMonth,
  records,
  selectedDate,
  isModalOpen,
  serverToday,
  mealAvailability,
  onSelectDate,
}: OperationRecordCalendarGridProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const startDayOfWeek = (monthStart.getDay() + 6) % 7; // Monday = 0
  const firstMonday = new Date(year, month, 1 - startDayOfWeek);
  const endDayOfWeek = (monthEnd.getDay() + 6) % 7;
  const lastMonday = new Date(year, month, monthEnd.getDate() - endDayOfWeek);
  const weekCount =
    Math.floor((lastMonday.getTime() - firstMonday.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;

  return (
    <div className="space-y-2">
      {Array.from({ length: weekCount }).map((_, weekIndex) => {
        const weekMonday = new Date(firstMonday);
        weekMonday.setDate(firstMonday.getDate() + weekIndex * 7);

        return (
          <div key={`week-${weekIndex}`} className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((__, dayIndex) => {
              const date = new Date(weekMonday);
              date.setDate(weekMonday.getDate() + dayIndex);
              const inMonth = date.getMonth() === month;
              const dateStr = inMonth ? formatDate(date) : `empty-${weekIndex}-${dayIndex}`;
              const available = inMonth
                ? mealAvailability[dateStr] ?? emptyMealAvailability
                : emptyMealAvailability;
              const hasAnyMeal = available.lunch || available.dinner;
              const isActive = inMonth && hasAnyMeal;
              const isFuture = date > serverToday;
              const isSelected = isActive && selectedDate === dateStr && isModalOpen;
              const record = isActive ? records[dateStr] : undefined;
              const isDisabled = !isActive || isFuture;

              return (
                <OperationRecordDayCell
                  key={dateStr}
                  dateStr={dateStr}
                  dayNum={isActive ? date.getDate() : null}
                  isDisabled={isDisabled}
                  isSelected={isSelected}
                  record={record}
                  onClick={() => !isDisabled && onSelectDate(dateStr)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
