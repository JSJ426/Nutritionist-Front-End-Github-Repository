import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import {
  createLeftoverDaily,
  createSkipMealDaily,
  updateLeftoverDaily,
  updateSkipMealDaily,
} from '../data/metrics';

import {
  DailyRecord,
  emptyMealAvailability,
  MealAvailability,
  OperationRecordFormValues,
  toNumberOrZero,
} from '../utils/OperationRecordUtils';

type UseOperationRecordDailyFormParams = {
  records: Record<string, DailyRecord>;
  selectedDate: string | null;
  schoolId?: string;
  setRecords: Dispatch<SetStateAction<Record<string, DailyRecord>>>;
  availableMeals?: MealAvailability;
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
  availableMeals = emptyMealAvailability,
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
    const canSaveLunch = availableMeals.lunch;
    const canSaveDinner = availableMeals.dinner;
    if (!canSaveLunch && !canSaveDinner) return;
    const lunchMissed = toNumberOrZero(formValues.lunchMissed);
    const lunchLeftoversKg = toNumberOrZero(formValues.lunchLeftoversKg);
    const dinnerMissed = toNumberOrZero(formValues.dinnerMissed);
    const dinnerLeftoversKg = toNumberOrZero(formValues.dinnerLeftoversKg);

    try {
      const saveHandlers: Promise<unknown>[] = [];
      if (hasRecord) {
        if (canSaveLunch) {
          saveHandlers.push(
            updateLeftoverDaily({
              date: selectedDate,
              meal_type: 'LUNCH',
              amount_kg: lunchLeftoversKg,
            })
          );
          saveHandlers.push(
            updateSkipMealDaily({
              date: selectedDate,
              meal_type: 'LUNCH',
              skipped_count: lunchMissed,
              total_students: 0,
            })
          );
        }
        if (canSaveDinner) {
          saveHandlers.push(
            updateLeftoverDaily({
              date: selectedDate,
              meal_type: 'DINNER',
              amount_kg: dinnerLeftoversKg,
            })
          );
          saveHandlers.push(
            updateSkipMealDaily({
              date: selectedDate,
              meal_type: 'DINNER',
              skipped_count: dinnerMissed,
              total_students: 0,
            })
          );
        }
      } else {
        if (canSaveLunch) {
          saveHandlers.push(
            createLeftoverDaily({
              school_id: schoolId,
              date: selectedDate,
              meal_type: 'LUNCH',
              amount_kg: lunchLeftoversKg,
            })
          );
          saveHandlers.push(
            createSkipMealDaily({
              school_id: schoolId,
              date: selectedDate,
              meal_type: 'LUNCH',
              skipped_count: lunchMissed,
              total_students: lunchMissed + 1,
            })
          );
        }
        if (canSaveDinner) {
          saveHandlers.push(
            createLeftoverDaily({
              school_id: schoolId,
              date: selectedDate,
              meal_type: 'DINNER',
              amount_kg: dinnerLeftoversKg,
            })
          );
          saveHandlers.push(
            createSkipMealDaily({
              school_id: schoolId,
              date: selectedDate,
              meal_type: 'DINNER',
              skipped_count: dinnerMissed,
              total_students: dinnerMissed + 1,
            })
          );
        }
      }
      await Promise.all(saveHandlers);

      setRecords((prev) => ({
        ...prev,
        [selectedDate]: {
          lunchMissed: canSaveLunch ? lunchMissed : prev[selectedDate]?.lunchMissed ?? 0,
          lunchLeftoversKg: canSaveLunch
            ? lunchLeftoversKg
            : prev[selectedDate]?.lunchLeftoversKg ?? 0,
          dinnerMissed: canSaveDinner ? dinnerMissed : prev[selectedDate]?.dinnerMissed ?? 0,
          dinnerLeftoversKg: canSaveDinner
            ? dinnerLeftoversKg
            : prev[selectedDate]?.dinnerLeftoversKg ?? 0,
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
