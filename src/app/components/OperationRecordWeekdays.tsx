type OperationRecordWeekdaysProps = {
  labels: string[];
};

export function OperationRecordWeekdays({ labels }: OperationRecordWeekdaysProps) {
  return (
    <div className="grid grid-cols-5 gap-2 text-sm text-gray-500 mb-2">
      {labels.map((day) => (
        <div key={day} className="text-center font-medium">
          {day}
        </div>
      ))}
    </div>
  );
}
