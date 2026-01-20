import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Star } from 'lucide-react';

const data = [
  { period: '1주차', value: 4.0 },
  { period: '2주차', value: 4.3 },
  { period: '3주차', value: 4.4 },
  { period: '4주차', value: 4.6 },
];

export function SatisfactionChart() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex-1">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-medium">만족도</h2>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          이번 달 평균 만족도:{' '}
          <Star
            size={14}
            className="inline text-yellow-400 fill-yellow-400"
          />{' '}
          4.2/5.0
        </p>
      </div>

      <div className="flex items-center justify-end gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#ff6b6b] rounded"></div>
          <span className="text-gray-600">평균</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 11 }}
            stroke="#999"
          />
          <YAxis
            domain={[0, 5]}
            ticks={[0, 1.5, 3.5, 5]}
            tick={{ fontSize: 11 }}
            stroke="#999"
          />
          <Bar
            dataKey="value"
            fill="#ff6b6b"
            radius={[4, 4, 0, 0]}
            label={{ position: 'top', fontSize: 10, fill: '#666' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
