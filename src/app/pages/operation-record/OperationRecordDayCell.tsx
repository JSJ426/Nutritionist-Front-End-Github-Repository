import { DailyRecord } from './utils';

type OperationRecordDayCellProps = {
  dateStr: string;
  dayNum: number | null;
  isDisabled: boolean;
  isSelected: boolean;
  record?: DailyRecord;
  onClick: () => void;
};

export function OperationRecordDayCell({
  dateStr,
  dayNum,
  isDisabled,
  isSelected,
  record,
  onClick,
}: OperationRecordDayCellProps) {
  return (
    <button
      key={dateStr}
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
      aria-hidden={dayNum === null}
      className={`min-h-24 rounded-lg border text-left p-2 transition-colors ${
        isDisabled
          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
          : 'bg-white border-gray-200 hover:border-[#5dccb4]'
      } ${isSelected ? 'ring-2 ring-[#5dccb4] border-[#5dccb4]' : ''}`}
    >
      {dayNum !== null && (
        <>
          <div className="flex items-start justify-between">
            <span className="text-sm font-medium">{dayNum}</span>
            {record && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5dccb4]/10 text-[#2f9b88]">
                기록됨
              </span>
            )}
          </div>
          <div className="mt-2 space-y-2">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-2 space-y-1">
              <div className="text-[10px] font-semibold text-gray-500">중식</div>
              <div className="text-[11px] text-gray-700 leading-4">
                결식자 수 <span className="font-medium">{record ? record.lunchMissed : '-'}</span>
                {record ? '명' : ''}
              </div>
              <div className="text-[11px] text-gray-700 leading-4">
                잔반량 <span className="font-medium">{record ? record.lunchLeftoversKg : '-'}</span>
                {record ? 'kg' : ''}
              </div>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-2 space-y-1">
              <div className="text-[10px] font-semibold text-gray-500">석식</div>
              <div className="text-[11px] text-gray-700 leading-4">
                결식자 수 <span className="font-medium">{record ? record.dinnerMissed : '-'}</span>
                {record ? '명' : ''}
              </div>
              <div className="text-[11px] text-gray-700 leading-4">
                잔반량 <span className="font-medium">{record ? record.dinnerLeftoversKg : '-'}</span>
                {record ? 'kg' : ''}
              </div>
            </div>
          </div>
        </>
      )}
    </button>
  );
}
