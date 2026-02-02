import { useMemo, useState } from 'react';
import { Button } from '../components/ui/button';

type DailyRecord = {
  lunchMissed: number;
  lunchLeftoversKg: number;
  dinnerMissed: number;
  dinnerLeftoversKg: number;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatMonthLabel = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}.${month}`;
};

export function OperationRecordDailyPage() {
  const serverNow = useMemo(() => new Date(), []);
  const serverToday = useMemo(() => {
    const d = new Date(serverNow);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [serverNow]);

  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(serverToday.getFullYear(), serverToday.getMonth(), 1)
  );
  const [records, setRecords] = useState<Record<string, DailyRecord>>({
    '2025-12-18': {
      lunchMissed: 2,
      lunchLeftoversKg: 9.1,
      dinnerMissed: 1,
      dinnerLeftoversKg: 5.4,
    },
    '2025-12-22': {
      lunchMissed: 4,
      lunchLeftoversKg: 13.7,
      dinnerMissed: 2,
      dinnerLeftoversKg: 7.2,
    },
    '2025-12-29': {
      lunchMissed: 3,
      lunchLeftoversKg: 11.8,
      dinnerMissed: 2,
      dinnerLeftoversKg: 6.1,
    },
    '2026-01-03': {
      lunchMissed: 1,
      lunchLeftoversKg: 8.2,
      dinnerMissed: 1,
      dinnerLeftoversKg: 4.9,
    },
    '2026-01-08': {
      lunchMissed: 5,
      lunchLeftoversKg: 14.3,
      dinnerMissed: 2,
      dinnerLeftoversKg: 7.6,
    },
    '2026-01-12': {
      lunchMissed: 2,
      lunchLeftoversKg: 10.4,
      dinnerMissed: 1,
      dinnerLeftoversKg: 5.8,
    },
    '2026-01-17': {
      lunchMissed: 4,
      lunchLeftoversKg: 12.9,
      dinnerMissed: 3,
      dinnerLeftoversKg: 8.3,
    },
    '2026-01-22': {
      lunchMissed: 2,
      lunchLeftoversKg: 9.7,
      dinnerMissed: 2,
      dinnerLeftoversKg: 6.6,
    },
    '2026-01-28': {
      lunchMissed: 3,
      lunchLeftoversKg: 12.4,
      dinnerMissed: 1,
      dinnerLeftoversKg: 6.8,
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    lunchMissed: '',
    lunchLeftoversKg: '',
    dinnerMissed: '',
    dinnerLeftoversKg: '',
  });

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  const isNextDisabled = useMemo(() => {
    const serverYear = serverToday.getFullYear();
    const serverMonth = serverToday.getMonth();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return year > serverYear || (year === serverYear && month >= serverMonth);
  }, [currentMonth, serverToday]);

  const openModalForDate = (dateStr: string) => {
    const existing = records[dateStr];
    setSelectedDate(dateStr);
    setFormValues({
      lunchMissed: existing ? String(existing.lunchMissed) : '',
      lunchLeftoversKg: existing ? String(existing.lunchLeftoversKg) : '',
      dinnerMissed: existing ? String(existing.dinnerMissed) : '',
      dinnerLeftoversKg: existing ? String(existing.dinnerLeftoversKg) : '',
    });
    setIsModalOpen(true);
  };

  const toNumberOrZero = (value: string) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const handleSave = () => {
    if (!selectedDate) return;
    setRecords((prev) => ({
      ...prev,
      [selectedDate]: {
        lunchMissed: toNumberOrZero(formValues.lunchMissed),
        lunchLeftoversKg: toNumberOrZero(formValues.lunchLeftoversKg),
        dinnerMissed: toNumberOrZero(formValues.dinnerMissed),
        dinnerLeftoversKg: toNumberOrZero(formValues.dinnerLeftoversKg),
      },
    }));
    setIsModalOpen(false);
  };

  const hasRecord = selectedDate ? Boolean(records[selectedDate]) : false;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
            일간 운영 기록
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-[1200px] mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-medium text-gray-800">
                {formatMonthLabel(currentMonth)}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-8 px-3 text-sm"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
                    )
                  }
                >
                  이전 달
                </Button>
                <Button
                  variant="outline"
                  className="h-8 px-3 text-sm"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                    )
                  }
                  disabled={isNextDisabled}
                >
                  다음 달
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-sm text-gray-500 mb-2">
              {weekdays.map((day) => (
                <div key={day} className="text-center font-medium">
                  {day}
                </div>
              ))}
            </div>

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
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => !isDisabled && openModalForDate(dateStr)}
                    disabled={isDisabled}
                    tabIndex={isDisabled ? -1 : 0}
                    aria-hidden={!isActive}
                    className={`min-h-24 rounded-lg border text-left p-2 transition-colors ${
                      isDisabled
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
                        : 'bg-white border-gray-200 hover:border-[#5dccb4]'
                    } ${isSelected ? 'ring-2 ring-[#5dccb4] border-[#5dccb4]' : ''}`}
                  >
                    {isActive && (
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
                              결식자 수{' '}
                              <span className="font-medium">{record ? record.lunchMissed : '-'}</span>
                              {record ? '명' : ''}
                            </div>
                            <div className="text-[11px] text-gray-700 leading-4">
                              잔반량{' '}
                              <span className="font-medium">
                                {record ? record.lunchLeftoversKg : '-'}
                              </span>
                              {record ? 'kg' : ''}
                            </div>
                          </div>
                          <div className="rounded-md border border-gray-200 bg-gray-50 p-2 space-y-1">
                            <div className="text-[10px] font-semibold text-gray-500">석식</div>
                            <div className="text-[11px] text-gray-700 leading-4">
                              결식자 수{' '}
                              <span className="font-medium">
                                {record ? record.dinnerMissed : '-'}
                              </span>
                              {record ? '명' : ''}
                            </div>
                            <div className="text-[11px] text-gray-700 leading-4">
                              잔반량{' '}
                              <span className="font-medium">
                                {record ? record.dinnerLeftoversKg : '-'}
                              </span>
                              {record ? 'kg' : ''}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-[90%] max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-800">
                {hasRecord ? '운영 기록 수정' : '운영 기록 입력'}
              </h2>
              <span className="text-sm text-gray-500">{selectedDate}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">중식 결식자 수</label>
                <input
                  type="number"
                  min={0}
                  value={formValues.lunchMissed}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, lunchMissed: e.target.value }))}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">중식 잔반량 (kg)</label>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  value={formValues.lunchLeftoversKg}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, lunchLeftoversKg: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">석식 결식자 수</label>
                <input
                  type="number"
                  min={0}
                  value={formValues.dinnerMissed}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, dinnerMissed: e.target.value }))}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">석식 잔반량 (kg)</label>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  value={formValues.dinnerLeftoversKg}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, dinnerLeftoversKg: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                취소
              </Button>
              <Button
                className="bg-[#5dccb4] hover:bg-[#4dbba3] text-white"
                onClick={handleSave}
              >
                {hasRecord ? '수정' : '입력'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
