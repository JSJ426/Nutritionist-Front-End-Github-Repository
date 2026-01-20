import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CircleDot } from 'lucide-react';

const data = [
  { date: '월', thisWeek: 85.2, lastWeek: 84.1 },
  { date: '화', thisWeek: 86.5, lastWeek: 85.3 },
  { date: '수', thisWeek: 87.8, lastWeek: 83.7 },
  { date: '목', thisWeek: 84.3, lastWeek: 86.2 },
  { date: '금', thisWeek: 88.1, lastWeek: 87.5 },
];

export function MealStatusChart() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex-1">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-medium">급식 현황</h2>
        <button className="p-1 hover:bg-gray-100 rounded-full">
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">이번 주 평균 급식 참여율</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-medium">86.4</span>
          <span className="text-sm">%</span>
          <span className="text-green-500 text-sm ml-2">+1.3%</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <span className="text-gray-600">이번주</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span className="text-gray-600">지난주</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11 }}
            stroke="#999"
          />
          <YAxis 
            domain={[80, 90]}
            ticks={[80, 85, 90]}
            tick={{ fontSize: 11 }}
            stroke="#999"
          />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="thisWeek" 
            stroke="#ff6b6b" 
            strokeWidth={2}
            dot={{ fill: '#ff6b6b', r: 3 }}
            label={{ position: 'top', fontSize: 10 }}
          />
          <Line 
            type="monotone" 
            dataKey="lastWeek" 
            stroke="#999" 
            strokeWidth={2}
            dot={{ fill: '#999', r: 3 }}
            label={{ position: 'bottom', fontSize: 10 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}