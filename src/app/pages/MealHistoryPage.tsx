import { useEffect, useState } from 'react';

import { fetchMealPlanHistories } from '../data/mealplan';
import { Pagination } from '../components/Pagination';

import { toMealHistoryVM } from '../viewModels/meal';
import type { MealHistoryItemVM } from '../viewModels/meal';

export function MealHistoryPage() {
  const [selectedActionType, setSelectedActionType] = useState<string>('전체');
  const [appliedActionType, setAppliedActionType] = useState<string>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [history, setHistory] = useState<MealHistoryItemVM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const today = new Date();
  const defaultEndDate = toDateString(today);
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - 30);
  const defaultStartDate = toDateString(defaultStart);

  const [selectedStartDate, setSelectedStartDate] = useState(defaultStartDate);
  const [selectedEndDate, setSelectedEndDate] = useState(defaultEndDate);
  const [appliedStartDate, setAppliedStartDate] = useState(defaultStartDate);
  const [appliedEndDate, setAppliedEndDate] = useState(defaultEndDate);
  const [totalPages, setTotalPages] = useState(1);

  const actionTypeToApi = (value: string) => {
    if (value === '수정') return 'MANUAL_UPDATE';
    if (value === '수정 (AI대체)') return 'AI_AUTO_REPLACE';
    return undefined;
  };

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetchMealPlanHistories({
          startDate: appliedStartDate || undefined,
          endDate: appliedEndDate || undefined,
          actionType: actionTypeToApi(appliedActionType),
          page: currentPage - 1,
          size: itemsPerPage,
        });
        if (!isActive) return;
        setHistory(toMealHistoryVM(response));
        setTotalPages(response.data.total_pages || 1);
      } catch (error) {
        console.error('Failed to load meal plan histories:', error);
        if (!isActive) return;
        setHistory([]);
        setTotalPages(1);
      } finally {
        if (!isActive) return;
        setIsLoading(false);
      }
    };
    load();
    return () => {
      isActive = false;
    };
  }, [appliedActionType, appliedStartDate, appliedEndDate, currentPage, itemsPerPage]);

  const handleSearch = () => {
    setAppliedActionType(selectedActionType);
    setAppliedStartDate(selectedStartDate);
    setAppliedEndDate(selectedEndDate);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">식단표 수정 히스토리</h1>
        </div>
        <div className="flex items-center justify-center text-gray-500 py-12">
          데이터를 불러오는 중입니다.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">식단표 수정 히스토리</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-[2]">
            <label className="block text-sm font-medium mb-2">조회 기간</label>
            <div className="flex items-center gap-3">
              <input 
                type="date" 
                value={selectedStartDate}
                onChange={(e) => setSelectedStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
              />
              <span className="text-gray-500">~</span>
              <input 
                type="date" 
                value={selectedEndDate}
                onChange={(e) => setSelectedEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">작업 유형</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
              value={selectedActionType}
              onChange={(e) => setSelectedActionType(e.target.value)}
            >
              <option>전체</option>
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
              {history.length === 0 ? (
                <tr>
                  <td className="py-8 text-center text-gray-400" colSpan={6}>
                    해당 기간에 대한 식단표 수정 이력이 없습니다.
                  </td>
                </tr>
              ) : (
                history.map((item, idx) => (
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
                        item.action === '수정 (AI대체)'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
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
                ))
              )}
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
