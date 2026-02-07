import { OperationRecordDayCell } from './OperationRecordDayCell';
import {
  emptyMealAvailability,
  formatDate,
  DailyRecord,
  MealAvailability,
} from '../utils/OperationRecordUtils';
import {
  getWeekCountInMonth,
  getWeekDatesForMonth,
  WEEKDAY_INDICES_MON_FRI,
} from '../utils/calendar';

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
  const monthIndex = currentMonth.getMonth();
  const weekCount = getWeekCountInMonth(year, monthIndex, { weekStartsOnMonday: true });

  return (
    <div className="space-y-2">
      {Array.from({ length: weekCount }).map((_, weekIndex) => {
        const weekDates = getWeekDatesForMonth({
          year,
          monthIndex,
          weekIndex,
          weekDayIndices: [...WEEKDAY_INDICES_MON_FRI],
          weekStartsOnMonday: true,
        });

        return (
          <div key={`week-${weekIndex}`} className="grid grid-cols-5 gap-2">
            {weekDates.map(({ date, inMonth }, dayIndex) => {
              const dateStr = inMonth ? formatDate(date) : `empty-${weekIndex}-${dayIndex}`;
              const labelMonth = String(date.getMonth() + 1).padStart(2, '0');
              const labelDay = String(date.getDate()).padStart(2, '0');
              const dateLabel = `${labelMonth}/${labelDay}`;
              const available = inMonth
                ? mealAvailability[dateStr] ?? emptyMealAvailability
                : emptyMealAvailability;
              const hasAnyMeal = available.lunch || available.dinner;
              const isActive = inMonth && hasAnyMeal;
              const isFuture = date > serverToday;
              const isSelected = isActive && selectedDate === dateStr && isModalOpen;
              const record = isActive ? records[dateStr] : undefined;
              const isDisabled = !isActive || isFuture;
              const dayNum = inMonth ? date.getDate() : null;

              return (
                <OperationRecordDayCell
                  key={dateStr}
                  dateStr={dateStr}
                  dayNum={dayNum}
                  dateLabel={dateLabel}
                  isDisabled={isDisabled}
                  isSelected={isSelected}
                  record={record}
                  available={available}
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
