import { useState } from 'react';
import { Pagination } from '../components/Pagination';

export function MealHistoryPage() {
  const [selectedActionType, setSelectedActionType] = useState<string>('전체');
  const [appliedActionType, setAppliedActionType] = useState<string>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const history = [
    { 
      date: '2026-01-09 14:30',
      action: '수정 (AI대체)',
      mealDate: '2026-01-15',
      mealType: '중식',
      menuBefore: ['돈까스', '미소국', '깍두기'],
      menuAfter: ['치킨까스', '미소국', '깍두기'],
      changes: '주메뉴: 돈까스 → 치킨까스 (식자재 수급 문제)',
    },
    { 
      date: '2026-01-08 10:15',
      action: '생성',
      mealDate: '2026-01-20',
      mealType: '석식',
      menuBefore: [],
      menuAfter: ['불고기덮밥', '계란국', '단무지'],
      changes: '신규 식단 생성',
    },
    { 
      date: '2026-01-07 16:45',
      action: '수정',
      mealDate: '2026-01-12',
      mealType: '중식',
      menuBefore: ['현미밥', '된장국', '생선구이'],
      menuAfter: ['현미밥', '된장국', '생선구이'],
      changes: '칼로리: 780 → 820 kcal (알레르기 대응)',
    },
  ];

  const filteredHistory = appliedActionType === '전체' 
    ? history 
    : history.filter(item => item.action === appliedActionType);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = () => {
    setAppliedActionType(selectedActionType);
    setCurrentPage(1);
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
              <option>수정 (AI대체)</option>
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
                <th className="text-left py-3 px-4">식단 날짜</th>
                <th className="text-center py-3 px-2">작업</th>
                <th className="text-left py-3 px-2">메뉴 (변경 전)</th>
                <th className="text-left py-3 px-2">메뉴 (변경 후)</th>
                <th className="text-left py-3 px-2">변경 내용</th>
              </tr>
            </thead>
            <tbody>
              {currentHistory.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{item.date}</td>
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
                  <td className="py-3 px-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-sm ${
                      item.action === '생성' ? 'bg-green-100 text-green-700' :
                      item.action === '수정 (AI대체)' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {item.action}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600 align-middle">
                    {item.menuBefore.length > 0 ? (
                      <ul className="space-y-1">
                        {item.menuBefore.map((menu) => (
                          <li key={menu} className="whitespace-normal">
                            {menu}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600 align-middle">
                    {item.menuAfter.length > 0 ? (
                      <ul className="space-y-1">
                        {item.menuAfter.map((menu) => (
                          <li key={menu} className="whitespace-normal">
                            {menu}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600 align-middle">
                    {item.changes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
