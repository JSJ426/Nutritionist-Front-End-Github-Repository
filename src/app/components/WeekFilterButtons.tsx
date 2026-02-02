interface WeekFilterButtonsProps {
  weeks: Array<{ week: string }>;
  selectedWeek: number | null;
  onSelect: (weekIndex: number | null) => void;
}

export function WeekFilterButtons({ weeks, selectedWeek, onSelect }: WeekFilterButtonsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded ${
            selectedWeek === null
              ? 'bg-[#5dccb4] text-white'
              : 'border border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => onSelect(null)}
        >
          전체
        </button>
        {weeks.map((weekData, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded ${
              selectedWeek === idx
                ? 'bg-[#5dccb4] text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onSelect(idx)}
          >
            {weekData.week}
          </button>
        ))}
      </div>
    </div>
  );
}
