import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import {
  createLeftoverDaily,
  createSkipMealDaily,
  updateLeftoverDaily,
  updateSkipMealDaily,
} from '../../../data/metrics';

import { DailyRecord, OperationRecordFormValues, toNumberOrZero } from '../utils';

type UseOperationRecordDailyFormParams = {
  records: Record<string, DailyRecord>;
  selectedDate: string | null;
  schoolId?: string;
  setRecords: Dispatch<SetStateAction<Record<string, DailyRecord>>>;
  onClose: () => void;
};

const emptyFormValues: OperationRecordFormValues = {
  lunchMissed: '',
  lunchLeftoversKg: '',
  dinnerMissed: '',
  dinnerLeftoversKg: '',
};

export function useOperationRecordDailyForm({
  records,
  selectedDate,
  schoolId,
  setRecords,
  onClose,
}: UseOperationRecordDailyFormParams) {
  const [formValues, setFormValues] = useState<OperationRecordFormValues>(emptyFormValues);

  useEffect(() => {
    if (!selectedDate) {
      setFormValues(emptyFormValues);
      return;
    }
    const existing = records[selectedDate];
    setFormValues({
      lunchMissed: existing ? String(existing.lunchMissed) : '',
      lunchLeftoversKg: existing ? String(existing.lunchLeftoversKg) : '',
      dinnerMissed: existing ? String(existing.dinnerMissed) : '',
      dinnerLeftoversKg: existing ? String(existing.dinnerLeftoversKg) : '',
    });
  }, [records, selectedDate]);

  const hasRecord = useMemo(() => {
    if (!selectedDate) return false;
    return Boolean(records[selectedDate]);
  }, [records, selectedDate]);

  const handleSave = async () => {
    if (!selectedDate || !schoolId) return;
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
      onClose();
    } catch (error) {
      console.error('Failed to save daily records:', error);
      alert('일간 운영 기록 저장에 실패했습니다.');
    }
  };

  const updateFormValues = (patch: Partial<OperationRecordFormValues>) => {
    setFormValues((prev) => ({ ...prev, ...patch }));
  };

  return { formValues, updateFormValues, handleSave, hasRecord };
}
