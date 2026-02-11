import { useEffect, useState } from 'react';
import { Search, Edit } from 'lucide-react';

import { getBoardListResponse } from '../data/board';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Pagination } from '../components/Pagination';

import { toBoardListVMFromResponse } from '../viewModels/board';
import type { BoardListItemVM } from '../viewModels/board';

interface BoardListPageProps {
  initialParams?: any;
  onNavigate?: (page: string, params?: any) => void;
}

export function BoardListPage({ initialParams, onNavigate }: BoardListPageProps) {
  const [posts, setPosts] = useState<BoardListItemVM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [totalPages, setTotalPages] = useState(1);

  const mapCategoryToApi = (category: string) => {
    switch (category) {
      case '공지':
        return 'NOTICE';
      case '신메뉴':
        return 'NEW_MENU';
      case '건의':
        return 'SUGGESTION';
      case '기타의견':
        return 'ETC';
      default:
        return undefined;
    }
  };

  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery.trim());
    setCurrentPage(1);
  };

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const apiCategory = categoryFilter === '전체' ? undefined : mapCategoryToApi(categoryFilter);
        const response = await getBoardListResponse(
          currentPage,
          itemsPerPage,
          appliedSearchQuery,
          apiCategory
        );
        if (!isActive) return;
        setPosts(toBoardListVMFromResponse(response));
        setTotalPages(response.data.total_pages || 1);
      } catch (error) {
        console.error('Failed to load board list:', error);
        if (!isActive) return;
        setPosts([]);
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
  }, [appliedSearchQuery, categoryFilter, currentPage, itemsPerPage, initialParams?.refresh]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
          <h1 className="text-4xl font-medium border-b-2 border-gray-300 pb-2">
            게시판
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          데이터를 불러오는 중입니다.
        </div>
      </div>
    );
  }

  // 카테고리 뱃지 색상
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
        <h1 className="text-4xl font-medium border-b-2 border-gray-300 pb-2">
          게시판
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 text-lg">
        <div className="max-w-[1400px] mx-auto">
          {/* 검색 및 필터 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="제목 또는 작성자로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>
                <Search size={16} className="mr-2" />
                검색
              </Button>
              <div className="w-48">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="분류 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="전체">전체</SelectItem>
                    <SelectItem value="공지">공지</SelectItem>
                    <SelectItem value="건의">건의</SelectItem>
                    <SelectItem value="신메뉴">신메뉴</SelectItem>
                    <SelectItem value="기타의견">기타의견</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="brand"
                onClick={() => onNavigate?.('board-write')}
              >
                <Edit size={16} className="mr-2" />
                글쓰기
              </Button>
            </div>
          </div>

          {/* 게시물 목록 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-20 text-center text-xl">번호</TableHead>
                  <TableHead className="w-32 text-center text-xl">분류</TableHead>
                  <TableHead className="text-xl">제목</TableHead>
                  <TableHead className="w-32 text-center text-xl">작성자</TableHead>
                  <TableHead className="w-32 text-center text-xl">작성일</TableHead>
                  <TableHead className="w-24 text-center text-xl">조회수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <TableRow 
                      key={post.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => onNavigate?.('board-read', { postId: post.id })}
                    >
                      <TableCell className="text-center text-lg">{post.id}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`${post.categoryColorClass}`}>
                          {post.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-lg">
                        {post.category === '공지' && (
                          <span className="text-red-600 mr-2">[공지]</span>
                        )}
                        {post.title}
                      </TableCell>
                      <TableCell className="text-center text-light text-lg">{post.author}</TableCell>
                      <TableCell className="text-center text-light text-lg text-gray-600">{post.dateText}</TableCell>
                      <TableCell className="text-center text-light text-lg text-gray-600">{post.viewsText}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-12">
                      검색 결과가 없습니다.
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
