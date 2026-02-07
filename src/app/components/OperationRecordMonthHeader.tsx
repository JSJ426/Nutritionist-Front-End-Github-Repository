import { Button } from './ui/button';

import { formatMonthLabel } from '../utils/OperationRecordUtils';

type OperationRecordMonthHeaderProps = {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
  nextDisabled: boolean;
};

export function OperationRecordMonthHeader({
  currentMonth,
  onPrev,
  onNext,
  nextDisabled,
}: OperationRecordMonthHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-lg font-medium text-gray-800">{formatMonthLabel(currentMonth)}</div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="h-8 px-3 text-sm" onClick={onPrev}>
          이전 달
        </Button>
        <Button
          variant="outline"
          className="h-8 px-3 text-sm"
          onClick={onNext}
          disabled={nextDisabled}
        >
          다음 달
        </Button>
      </div>
    </div>
  );
}
