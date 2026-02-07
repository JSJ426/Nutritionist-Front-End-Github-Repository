import { useMemo, useState } from 'react';

import { useAuth } from '../auth/AuthContext';

import { OperationRecordCalendarGrid } from '../components/OperationRecordCalendarGrid';
import { OperationRecordModal } from '../components/OperationRecordModal';
import { OperationRecordMonthHeader } from '../components/OperationRecordMonthHeader';
import { OperationRecordWeekdays } from '../components/OperationRecordWeekdays';
import { useOperationRecordCalendarLayout } from '../hooks/useOperationRecordCalendarLayout';
import { useOperationRecordDailyForm } from '../hooks/useOperationRecordDailyForm';
import { useOperationRecordMealAvailability } from '../hooks/useOperationRecordMealAvailability';
import { useOperationRecordMonthlyRecords } from '../hooks/useOperationRecordMonthlyRecords';
import { emptyMealAvailability } from '../utils/OperationRecordUtils';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { records, setRecords, isLoading } = useOperationRecordMonthlyRecords(
    currentMonth,
    schoolId
  );
  const { mealAvailability, isLoading: isMealPlanLoading } =
    useOperationRecordMealAvailability(currentMonth);
  const selectedAvailability = selectedDate
    ? mealAvailability[selectedDate] ?? emptyMealAvailability
    : emptyMealAvailability;
  const { weekdays } = useOperationRecordCalendarLayout(currentMonth);
  const { formValues, updateFormValues, handleSave, hasRecord } = useOperationRecordDailyForm({
    records,
    selectedDate,
    schoolId,
    setRecords,
    availableMeals: selectedAvailability,
    onClose: () => setIsModalOpen(false),
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

  const isNextDisabled = useMemo(() => {
    const serverYear = serverToday.getFullYear();
    const serverMonth = serverToday.getMonth();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return year > serverYear || (year === serverYear && month >= serverMonth);
  }, [currentMonth, serverToday]);

  const openModalForDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  if (isLoading || isMealPlanLoading) {
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
            <OperationRecordMonthHeader
              currentMonth={currentMonth}
              onPrev={() =>
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
                )
              }
              onNext={() =>
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                )
              }
              nextDisabled={isNextDisabled}
            />

            <OperationRecordWeekdays labels={weekdays} />

            <OperationRecordCalendarGrid
              currentMonth={currentMonth}
              records={records}
              selectedDate={selectedDate}
              isModalOpen={isModalOpen}
              serverToday={serverToday}
              mealAvailability={mealAvailability}
              onSelectDate={openModalForDate}
            />
          </div>

        </div>
      </div>

      <OperationRecordModal
        isOpen={isModalOpen}
        selectedDate={selectedDate}
        hasRecord={hasRecord}
        formValues={formValues}
        availableMeals={selectedAvailability}
        onChange={updateFormValues}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
