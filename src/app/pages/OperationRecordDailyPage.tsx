import { useEffect, useMemo, useState } from 'react';

import {
  createLeftoverDaily,
  createSkipMealDaily,
  getLeftoverMonthly,
  getSkipMealMonthly,
  updateLeftoverDaily,
  updateSkipMealDaily,
} from '../data/metrics';

import { Button } from '../components/ui/button';
import { useAuth } from '../auth/AuthContext';

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

export function OperationRecordDailyPage() {
  const { claims, isReady } = useAuth();
  const schoolId = claims?.schoolId;
  const serverNow = useMemo(() => new Date(), []);
  const serverToday = useMemo(() => {
    const d = new Date(serverNow);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [serverNow]);

  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(serverToday.getFullYear(), serverToday.getMonth(), 1)
  );
  const [records, setRecords] = useState<Record<string, DailyRecord>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    lunchMissed: '',
    lunchLeftoversKg: '',
    dinnerMissed: '',
    dinnerLeftoversKg: '',
  });

  if (!isReady || !schoolId) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">운영 기록</h1>
        </div>
        <div className="flex items-center justify-center text-gray-500 py-12">
          데이터를 불러오는 중입니다.
        </div>
      </div>
    );
  }

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

  const handleSave = async () => {
    if (!selectedDate) return;
    const lunchMissed = toNumberOrZero(formValues.lunchMissed);
    const lunchLeftoversKg = toNumberOrZero(formValues.lunchLeftoversKg);
    const dinnerMissed = toNumberOrZero(formValues.dinnerMissed);
    const dinnerLeftoversKg = toNumberOrZero(formValues.dinnerLeftoversKg);

    try {
      const saveHandlers = hasRecord
        ? [
            updateLeftoverDaily({
              date: selectedDate,
              meal_type: 'LUNCH',
              amount_kg: lunchLeftoversKg,
            }),
            updateSkipMealDaily({
              date: selectedDate,
              meal_type: 'LUNCH',
              skipped_count: lunchMissed,
              total_students: 0,
            }),
            updateLeftoverDaily({
              date: selectedDate,
              meal_type: 'DINNER',
              amount_kg: dinnerLeftoversKg,
            }),
            updateSkipMealDaily({
              date: selectedDate,
              meal_type: 'DINNER',
              skipped_count: dinnerMissed,
              total_students: 0,
            }),
          ]
        : [
            createLeftoverDaily({
              school_id: schoolId,
              date: selectedDate,
              meal_type: 'LUNCH',
              amount_kg: lunchLeftoversKg,
            }),
            createSkipMealDaily({
              school_id: schoolId,
              date: selectedDate,
              meal_type: 'LUNCH',
              skipped_count: lunchMissed,
              total_students: lunchMissed + 1,
            }),
            createLeftoverDaily({
              school_id: schoolId,
              date: selectedDate,
              meal_type: 'DINNER',
              amount_kg: dinnerLeftoversKg,
            }),
            createSkipMealDaily({
              school_id: schoolId,
              date: selectedDate,
              meal_type: 'DINNER',
              skipped_count: dinnerMissed,
              total_students: dinnerMissed + 1,
            }),
          ];
      await Promise.all(saveHandlers);

      setRecords((prev) => ({
        ...prev,
        [selectedDate]: {
          lunchMissed,
          lunchLeftoversKg,
          dinnerMissed,
          dinnerLeftoversKg,
        },
      }));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save daily records:', error);
      alert('일간 운영 기록 저장에 실패했습니다.');
    }
  };

  const hasRecord = selectedDate ? Boolean(records[selectedDate]) : false;

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
              일간 운영 기록
            </h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          데이터를 불러오는 중입니다.
        </div>
      </div>
    );
  }

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
