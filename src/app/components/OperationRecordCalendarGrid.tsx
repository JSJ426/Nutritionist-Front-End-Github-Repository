import { useOperationRecordCalendarLayout } from '../hooks/useOperationRecordCalendarLayout';
import { OperationRecordDayCell } from './OperationRecordDayCell';
import { formatDate, DailyRecord } from '../utils/OperationRecordUtils';

type OperationRecordCalendarGridProps = {
  currentMonth: Date;
  records: Record<string, DailyRecord>;
  selectedDate: string | null;
  isModalOpen: boolean;
  serverToday: Date;
  onSelectDate: (dateStr: string) => void;
};

export function OperationRecordCalendarGrid({
  currentMonth,
  records,
  selectedDate,
  isModalOpen,
  serverToday,
  onSelectDate,
}: OperationRecordCalendarGridProps) {
  const { daysInMonth, startDay, totalCells } = useOperationRecordCalendarLayout(currentMonth);

  return (
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: totalCells }).map((_, idx) => {
        const dayNum = idx - startDay + 1;
        const isEmpty = dayNum < 1 || dayNum > daysInMonth;
        const isActive = !isEmpty;
        const date = isActive
          ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum)
          : null;
        const dateStr = date ? formatDate(date) : `empty-${idx}`;
        const isFuture = date ? date > serverToday : false;
        const isSelected = isActive && selectedDate === dateStr && isModalOpen;
        const record = isActive ? records[dateStr] : undefined;
        const isDisabled = !isActive || isFuture;

        return (
          <OperationRecordDayCell
            key={dateStr}
            dateStr={dateStr}
            dayNum={isActive ? dayNum : null}
            isDisabled={isDisabled}
            isSelected={isSelected}
            record={record}
            onClick={() => !isDisabled && onSelectDate(dateStr)}
          />
        );
      })}
    </div>
  );
}
