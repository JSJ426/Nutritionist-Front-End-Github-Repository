import { CircleCheck } from 'lucide-react';

interface MealCardProps {
  vm: {
    title: string;
    headlineLines: string[];
    summaryText: string;
    imageUrl: string;
    weekDays: string[];
    rows: Array<{ label: string; cells: string[][] }>;
    todayIndex: number;
  };
}

export function MealCard({ vm }: MealCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <button className="p- hover:bg-gray-100 rounded-full">
        </button>
      </div>

      <div className="flex items-start gap-6">
        {/* Left side - Meal info and image */}
        <div className="flex-[1.2]">
          <div className="inline-flex items-center gap-2 bg-[#5dccb4] text-white px-4 py-1.5 rounded-full mb-4">
            <CircleCheck size={16} />
            <span className="text-sm">{vm.title}</span>
          </div>
          
          {vm.headlineLines.map((line, idx) => (
            <h3 key={line} className={idx === 0 ? 'text-2xl font-medium mb-1' : 'text-xl font-medium mb-1'}>
              {line}
            </h3>
          ))}
          <p className="text-gray-600 text-sm mb-1">{vm.summaryText}</p>
          
          {/* Meal image */}
          <div className="mt-3">
            <img src={vm.imageUrl} alt="오늘의 식단" className="w-full rounded-lg" />
          </div>
        </div>

        {/* Right side - Calendar */}
        <div className="flex-[3]">
          <div className="grid grid-cols-6 gap-2">
            {/* Header */}
            <div className="text-center"></div>
            {vm.weekDays.map((day, idx) => (
              <div 
                key={day}
                className={`text-center py-2 text-sm font-medium ${
                  idx === vm.todayIndex ? 'bg-[#5dccb4] text-white rounded-t-lg' : ''
                }`}
              >
                {day}
              </div>
            ))}

            {vm.rows.map((row, rowIdx) => (
              <div key={row.label} className="contents">
                <div className="text-center py-2 text-xs text-gray-500">{row.label}</div>
                {row.cells.map((mealList, idx) => (
                  <div
                    key={`${rowIdx}-${idx}`}
                    className={`text-center py-3 text-sm border border-gray-200 ${
                      idx === vm.todayIndex ? 'bg-[#5dccb4] text-white border-[#5dccb4]' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1 leading-tight">
                      {mealList.map((menu, i) => (
                        <div key={i} className="whitespace-nowrap">
                          {menu}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}


            {/* Third row - TODAY marker */}
            <div></div>
            <div></div>
            <div></div>
            <div className="text-center bg-[#5dccb4] text-white py-1 text-xs rounded-b-lg">
              TODAY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
