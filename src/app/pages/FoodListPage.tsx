import { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Pagination } from '../components/Pagination';

type FoodItem = {
  id: number;
  name: string;
  category: string;
  calories: number;
  allergies: number[];
};

interface FoodListProps {
  onNavigate?: (page: string, params?: any) => void;
}

const mockFoods: FoodItem[] = [
  { id: 101, name: '김치볶음밥', category: '밥류', calories: 520, allergies: [1, 5] },
  { id: 100, name: '돼지김치찌개', category: '찌개 및 전골류', calories: 410, allergies: [6, 10] },
  { id: 99, name: '돈까스', category: '튀김류', calories: 680, allergies: [1, 6, 10] },
];

const categoryOptions = [
  '전체',
  '밥류',
  '국 및 탕류',
  '스프류',
  '전·적 및 부침류',
  '나물·숙채류',
  '디저트류',
  '볶음류',
  '구이류',
  '생채·무침류',
  '튀김류',
  '조림류',
  '찜류',
  '면류',
  '찌개 및 전골류',
  '죽류',
  '장아찌·절임류',
  '김치류',
  '음료류',
  '만두류',
];

export function FoodListPage({ onNavigate }: FoodListProps) {
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [sortBy, setSortBy] = useState('id-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredFoods = useMemo(() => {
    const baseFoods = categoryFilter === '전체'
      ? mockFoods
      : mockFoods.filter((food) => food.category === categoryFilter);

    const sortedFoods = [...baseFoods].sort((a, b) => {
      switch (sortBy) {
        case 'id-asc':
          return a.id - b.id;
        case 'id-desc':
          return b.id - a.id;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'category-asc':
          return a.category.localeCompare(b.category);
        case 'category-desc':
          return b.category.localeCompare(a.category);
        case 'calories-asc':
          return a.calories - b.calories;
        case 'calories-desc':
          return b.calories - a.calories;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sortedFoods;
  }, [categoryFilter, sortBy]);

  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFoods = filteredFoods.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, sortBy]);

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
                  {categoryOptions.map((option) => (
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
                  <option value="id-asc">번호 (오름차순)</option>
                  <option value="id-desc">번호 (내림차순)</option>
                  <option value="name-asc">메뉴명 (오름차순)</option>
                  <option value="name-desc">메뉴명 (내림차순)</option>
                  <option value="category-asc">식품대분류명 (오름차순)</option>
                  <option value="category-desc">식품대분류명 (내림차순)</option>
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
                  <TableHead className="w-20 text-center">번호</TableHead>
                  <TableHead className="w-44 text-center">식품대분류명</TableHead>
                  <TableHead>메뉴명</TableHead>
                  <TableHead className="w-32 text-center">열량</TableHead>
                  <TableHead className="text-center">알레르기정보</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentFoods.length > 0 ? (
                  currentFoods.map((food) => (
                    <TableRow
                      key={food.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => onNavigate?.('food-info', { foodId: food.id })}
                    >
                      <TableCell className="text-center text-sm">{food.id}</TableCell>
                      <TableCell className="text-center text-sm">
                        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                          {food.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{food.name}</TableCell>
                      <TableCell className="text-center text-sm text-gray-600">{food.calories}</TableCell>
                      <TableCell className="text-center text-sm text-gray-600">
                        {food.allergies.length > 0 ? food.allergies.join(', ') : '-'}
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
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
