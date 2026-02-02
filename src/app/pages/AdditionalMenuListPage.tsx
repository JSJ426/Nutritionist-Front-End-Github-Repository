import { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Pagination } from '../components/Pagination';
import { Plus } from 'lucide-react';
import { AdditionalMenuItem } from '../types/additionalMenu';

interface AdditionalMenuListPageProps {
  items: AdditionalMenuItem[];
  onNavigate?: (page: string, params?: any) => void;
}

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

const sortOptions = [
  { value: 'id-asc', label: '번호 (오름차순)' },
  { value: 'id-desc', label: '번호 (내림차순)' },
  { value: 'date-asc', label: '등록일 (오름차순)' },
  { value: 'date-desc', label: '등록일 (내림차순)' },
  { value: 'title-asc', label: '메뉴명 (오름차순)' },
  { value: 'title-desc', label: '메뉴명 (내림차순)' },
  { value: 'category-asc', label: '식품대분류명 (오름차순)' },
  { value: 'category-desc', label: '식품대분류명 (내림차순)' },
  { value: 'calories-asc', label: '열량 (오름차순)' },
  { value: 'calories-desc', label: '열량 (내림차순)' },
];

export function AdditionalMenuListPage({ items, onNavigate }: AdditionalMenuListPageProps) {
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [sortBy, setSortBy] = useState('id-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredItems = useMemo(() => {
    const baseItems = categoryFilter === '전체'
      ? items
      : items.filter((item) => item.category === categoryFilter);

    const sortedItems = [...baseItems].sort((a, b) => {
      const extraA = a as AdditionalMenuItem & { calories?: number; createdAt?: string };
      const extraB = b as AdditionalMenuItem & { calories?: number; createdAt?: string };
      const createdAtA = extraA.createdAt ?? a.date;
      const createdAtB = extraB.createdAt ?? b.date;
      const caloriesA = extraA.calories ?? Number.MAX_SAFE_INTEGER;
      const caloriesB = extraB.calories ?? Number.MAX_SAFE_INTEGER;

      switch (sortBy) {
        case 'id-asc':
          return a.id - b.id;
        case 'id-desc':
          return b.id - a.id;
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
          return a.id - b.id;
      }
    });

    return sortedItems;
  }, [categoryFilter, items, sortBy]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, sortBy]);

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
                  {sortOptions.map((option) => (
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
                {currentItems.length > 0 ? (
                  currentItems.map((item) => {
                    const extra = item as AdditionalMenuItem & {
                      calories?: number;
                      allergies?: number[];
                      createdAt?: string;
                    };

                    return (
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
                          {extra.calories ?? '-'}
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-600">
                          {extra.allergies && extra.allergies.length > 0 ? extra.allergies.join(', ') : '-'}
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-600">
                          {extra.createdAt ?? item.date}
                        </TableCell>
                      </TableRow>
                    );
                  })
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
