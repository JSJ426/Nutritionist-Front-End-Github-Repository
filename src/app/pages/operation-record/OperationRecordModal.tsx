import { Button } from '../../components/ui/button';

import { OperationRecordFormValues } from './utils';

type OperationRecordModalProps = {
  isOpen: boolean;
  selectedDate: string | null;
  hasRecord: boolean;
  formValues: OperationRecordFormValues;
  onChange: (patch: Partial<OperationRecordFormValues>) => void;
  onClose: () => void;
  onSave: () => void;
};

export function OperationRecordModal({
  isOpen,
  selectedDate,
  hasRecord,
  formValues,
  onChange,
  onClose,
  onSave,
}: OperationRecordModalProps) {
  if (!isOpen || !selectedDate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
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
              onChange={(e) => onChange({ lunchMissed: e.target.value })}
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
              onChange={(e) => onChange({ lunchLeftoversKg: e.target.value })}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">석식 결식자 수</label>
            <input
              type="number"
              min={0}
              value={formValues.dinnerMissed}
              onChange={(e) => onChange({ dinnerMissed: e.target.value })}
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
              onChange={(e) => onChange({ dinnerLeftoversKg: e.target.value })}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button className="bg-[#5dccb4] hover:bg-[#4dbba3] text-white" onClick={onSave}>
            {hasRecord ? '수정' : '입력'}
          </Button>
        </div>
      </div>
    </div>
  );
}
