import { Undo } from 'lucide-react';
import { useState } from 'react';

export function MealHistoryPage() {
  const [tooltipVisible, setTooltipVisible] = useState<number | null>(null);
  const [selectedActionType, setSelectedActionType] = useState<string>('전체');
  const [appliedActionType, setAppliedActionType] = useState<string>('전체');
  
  const history = [
    { 
      date: '2026-01-09 14:30',
      action: '수정',
      mealDate: '2026-01-15',
      mealType: '중식',
      changes: '주메뉴: 돈까스 → 치킨까스',
      reason: '식자재 수급 문제'
    },
    { 
      date: '2026-01-08 10:15',
      action: '생성',
      mealDate: '2026-01-20',
      mealType: '석식',
      changes: '신규 식단 생성',
      reason: '영양 기준 조정'
    },
    { 
      date: '2026-01-07 16:45',
      action: '수정',
      mealDate: '2026-01-12',
      mealType: '중식',
      changes: '칼로리: 780 → 820 kcal',
      reason: '알레르기 대응'
    },
  ];

  const filteredHistory = appliedActionType === '전체' 
    ? history 
    : history.filter(item => item.action === appliedActionType);

  const handleSearch = () => {
    setAppliedActionType(selectedActionType);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">식단표 수정 히스토리</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">조회 기간</label>
            <input 
              type="date" 
              defaultValue="2026-01-01"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">~</label>
            <input 
              type="date" 
              defaultValue="2026-01-09"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">작업 유형</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
              value={selectedActionType}
              onChange={(e) => setSelectedActionType(e.target.value)}
            >
              <option>전체</option>
              <option>생성</option>
              <option>수정</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              className="px-6 py-2 bg-[#5dccb4] text-white rounded hover:bg-[#4dbba3]"
              onClick={handleSearch}
            >
              조회
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4">수정 일시</th>
                <th className="text-left py-3 px-4">작업</th>
                <th className="text-left py-3 px-4">식단 날짜</th>
                <th className="text-left py-3 px-4">변경 내용</th>
                <th className="text-left py-3 px-4">수정 사유</th>
                <th className="text-left py-3 pl-1 pr-4 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{item.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      item.action === '생성' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {item.action}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span>{item.mealDate}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        item.mealType === '중식' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.mealType}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{item.changes}</td>
                  <td className="py-3 px-4 text-sm">
                    {item.action === '생성' ? (
                      <span className="text-gray-400">-</span>
                    ) : (
                      item.reason
                    )}
                  </td>
                  <td className="py-3 pl-1 pr-4">
                    {item.action === '수정' && (
                      <div className="relative inline-block">
                        <button 
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                          onClick={() => {
                            console.log(`되돌리기: ${item.mealDate} ${item.mealType}`);
                          }}
                          onMouseEnter={() => setTooltipVisible(idx)}
                          onMouseLeave={() => setTooltipVisible(null)}
                          aria-label="이전 상태로 되돌리기"
                        >
                          <Undo className="w-4 h-4 text-gray-600" />
                        </button>
                        {tooltipVisible === idx && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                            이전 상태로 되돌리기
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}