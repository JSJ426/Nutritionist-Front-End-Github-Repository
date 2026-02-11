import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { getFoodListResponse } from '../data/food';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Pagination } from '../components/Pagination';

import { toFoodListVMFromResponse } from '../viewModels/food';
import type { FoodListVM } from '../viewModels/food';

interface FoodListProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function FoodListPage({ onNavigate }: FoodListProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [foodListVm, setFoodListVm] = useState<FoodListVM | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialCategory = searchParams.get('category') || '전체';
  const initialSort = searchParams.get('sort') || 'name-asc';
  const initialPageRaw = searchParams.get('page');
  const initialPage = initialPageRaw ? Number(initialPageRaw) : 1;
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [categoryOptions, setCategoryOptions] = useState<string[]>(['전체']);
  const [sortBy, setSortBy] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1);
  const itemsPerPage = 20;
  const [totalPages, setTotalPages] = useState(1);
  const offsetIndex = (currentPage - 1) * itemsPerPage;

  const mapSortParams = (value: string) => {
    switch (value) {
      case 'name-asc':
        return { sort: 'name', order: 'asc' };
      case 'name-desc':
        return { sort: 'name', order: 'desc' };
      case 'calories-asc':
        return { sort: 'kcal', order: 'asc' };
      case 'calories-desc':
        return { sort: 'kcal', order: 'desc' };
      default:
        return { sort: 'name', order: 'asc' };
    }
  };

  const applySearchParams = (next: {
    category?: string;
    sort?: string;
    page?: number;
  }) => {
    const nextParams = new URLSearchParams();
    const nextCategory = next.category ?? categoryFilter;
    const nextSort = next.sort ?? sortBy;
    const nextPage = next.page ?? currentPage;

    if (nextCategory && nextCategory !== '전체') {
      nextParams.set('category', nextCategory);
    } else {
      nextParams.delete('category');
    }

    if (nextSort && nextSort !== 'name-asc') {
      nextParams.set('sort', nextSort);
    } else {
      nextParams.delete('sort');
    }

    if (nextPage > 1) {
      nextParams.set('page', String(nextPage));
    } else {
      nextParams.delete('page');
    }

    setSearchParams(nextParams);
  };

  const handleCategoryChange = (value: string) => {
    applySearchParams({ category: value, page: 1 });
  };

  const handleSortChange = (value: string) => {
    applySearchParams({ sort: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    applySearchParams({ page });
  };

  useEffect(() => {
    const nextCategory = searchParams.get('category') || '전체';
    const nextSort = searchParams.get('sort') || 'name-asc';
    const nextPageRaw = searchParams.get('page');
    const nextPage = nextPageRaw ? Number(nextPageRaw) : 1;
    const safePage = Number.isFinite(nextPage) && nextPage > 0 ? nextPage : 1;

    setCategoryFilter((prev) => (prev === nextCategory ? prev : nextCategory));
    setSortBy((prev) => (prev === nextSort ? prev : nextSort));
    setCurrentPage((prev) => (prev === safePage ? prev : safePage));
  }, [searchParams]);

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const { sort, order } = mapSortParams(sortBy);
        const category = categoryFilter === '전체' ? undefined : categoryFilter;
        const response = await getFoodListResponse(currentPage, itemsPerPage, category, sort, order);
        if (!isActive) return;
        const vm = toFoodListVMFromResponse(response);
        setFoodListVm(vm);
        setCategoryOptions((prev) => (prev.length <= 1 ? vm.categoryOptions : prev));
        setTotalPages(response.data.total_pages || 1);
      } catch (error) {
        console.error('Failed to load food list:', error);
        if (!isActive) return;
        setFoodListVm(null);
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
  }, [currentPage, itemsPerPage, categoryFilter, sortBy]);

  if (isLoading || !foodListVm) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
              메뉴 조회
            </h1>
            <div />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          데이터를 불러오는 중입니다.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
            메뉴 조회
          </h1>
          <div />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 text-lg">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="text-base text-gray-600 mb-1 block">식품대분류명</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-48 px-3 py-2 rounded border bg-gray-100 text-base text-gray-900 focus:outline-none focus:border-[#5dccb4]"
                >
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-base text-gray-600 mb-1 block">정렬</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-40 px-3 py-2 rounded border bg-gray-100 text-base text-gray-900 focus:outline-none focus:border-[#5dccb4]"
                >
                  <option value="name-asc">메뉴명 (오름차순)</option>
                  <option value="name-desc">메뉴명 (내림차순)</option>
                  <option value="calories-asc">열량 (오름차순)</option>
                  <option value="calories-desc">열량 (내림차순)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-20 text-center text-lg">번호</TableHead>
                  <TableHead className="w-44 text-center text-lg">식품대분류명</TableHead>
                  <TableHead className="text-lg">메뉴명</TableHead>
                  <TableHead className="w-32 text-center text-lg">열량(Kcal)</TableHead>
                  <TableHead className="text-center text-lg">알레르기정보</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foodListVm.items.length > 0 ? (
                  foodListVm.items.map((food, index) => (
                    <TableRow
                      key={food.menuId}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => onNavigate?.('food-info', { foodId: food.menuId })}
                    >
                      <TableCell className="text-center text-lg">
                        {offsetIndex + index + 1}
                      </TableCell>
                      <TableCell className="text-center text-lg">
                        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                          {food.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-lg">{food.name}</TableCell>
                      <TableCell className="text-center text-lg text-gray-600">{food.caloriesText}</TableCell>
                      <TableCell className="text-center text-lg text-gray-600">
                        {food.allergiesText}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-12">
                      표시할 메뉴가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
