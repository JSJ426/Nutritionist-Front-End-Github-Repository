import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

import { getAdditionalMenuListResponse } from '../data/additionalMenu';

import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Pagination } from '../components/Pagination';

import { toAdditionalMenuListVMFromResponse } from '../viewModels/additionalMenu';
import type { AdditionalMenuListItemVM, AdditionalMenuListVM } from '../viewModels/additionalMenu';

interface AdditionalMenuListPageProps {
  initialParams?: any;
  onNavigate?: (page: string, params?: any) => void;
}

export function AdditionalMenuListPage({ initialParams, onNavigate }: AdditionalMenuListPageProps) {
  const [baseVm, setBaseVm] = useState<AdditionalMenuListVM | null>(null);
  const [items, setItems] = useState<AdditionalMenuListItemVM[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [sortBy, setSortBy] = useState('id-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      const response = await getAdditionalMenuListResponse(currentPage, itemsPerPage);
      if (!isActive) return;
      const vm = toAdditionalMenuListVMFromResponse(response);
      setBaseVm(vm);
      setItems(vm.items);
      setTotalPages(response.data.totalPages ?? response.data.total_pages ?? 1);
    };

    load();

    return () => {
      isActive = false;
    };
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    const deletedId = initialParams?.deletedId as string | undefined;
    if (deletedId) {
      setItems((prev) => prev.filter((item) => item.id !== deletedId));
    }
  }, [initialParams]);

  const filteredItems = useMemo(() => {
    const baseItems = categoryFilter === '전체'
      ? items
      : items.filter((item) => item.category === categoryFilter);

    const sortedItems = [...baseItems].sort((a, b) => {
      const createdAtA = a.dateRaw;
      const createdAtB = b.dateRaw;
      const caloriesA = a.calories ?? Number.MAX_SAFE_INTEGER;
      const caloriesB = b.calories ?? Number.MAX_SAFE_INTEGER;
      const numericIdA = a.id ? Number(a.id.replace(/\D+/g, '')) : Number.NaN;
      const numericIdB = b.id ? Number(b.id.replace(/\D+/g, '')) : Number.NaN;

      switch (sortBy) {
        case 'id-asc':
          if (!Number.isNaN(numericIdA) && !Number.isNaN(numericIdB)) {
            return numericIdA - numericIdB;
          }
          return (a.id || '').localeCompare(b.id || '');
        case 'id-desc':
          if (!Number.isNaN(numericIdA) && !Number.isNaN(numericIdB)) {
            return numericIdB - numericIdA;
          }
          return (b.id || '').localeCompare(a.id || '');
        case 'date-asc':
          return createdAtA.localeCompare(createdAtB);
        case 'date-desc':
          return createdAtB.localeCompare(createdAtA);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'category-asc':
          return a.category.localeCompare(b.category);
        case 'category-desc':
          return b.category.localeCompare(a.category);
        case 'calories-asc':
          return caloriesA - caloriesB;
        case 'calories-desc':
          return caloriesB - caloriesA;
        default:
          if (!Number.isNaN(numericIdA) && !Number.isNaN(numericIdB)) {
            return numericIdA - numericIdB;
          }
          return (a.id || '').localeCompare(b.id || '');
      }
    });

    return sortedItems;
  }, [categoryFilter, items, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, sortBy]);

  if (!baseVm) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
            신메뉴
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          데이터를 불러오는 중입니다.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
            신메뉴
          </h1>
          <Button
            onClick={() => onNavigate?.('additional-menu-write')}
            className="bg-[#5dccb4] hover:bg-[#4db9a3] text-white"
          >
            <Plus size={16} className="mr-2" />
            메뉴 생성
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">식품대분류명</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-48 px-3 py-2 rounded border bg-gray-100 text-sm text-gray-900 focus:outline-none focus:border-[#5dccb4]"
                >
                  {baseVm.categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">정렬</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-40 px-3 py-2 rounded border bg-gray-100 text-sm text-gray-900 focus:outline-none focus:border-[#5dccb4]"
                >
                  {baseVm.sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-20 text-center">번호</TableHead>
                  <TableHead className="w-44 text-center">식품대분류명</TableHead>
                  <TableHead>메뉴명</TableHead>
                  <TableHead className="w-32 text-center">열량</TableHead>
                  <TableHead className="text-center">알레르기정보</TableHead>
                  <TableHead className="w-32 text-center">등록일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => onNavigate?.('additional-menu-read', { menuId: item.id })}
                    >
                      <TableCell className="text-center text-sm">{item.id}</TableCell>
                      <TableCell className="text-center text-sm">
                        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="text-center text-sm text-gray-600">
                        {item.caloriesText}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-600">
                        {item.allergensText}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-600">
                        {item.dateText}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-12">
                      등록된 신메뉴가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
