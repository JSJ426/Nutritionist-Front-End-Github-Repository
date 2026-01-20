import { useState } from 'react';
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
import { Search, Edit } from 'lucide-react';

// 게시물 타입 정의
type PostCategory = '공지' | '건의' | '요청' | '불편사항' | '기타의견';

interface Post {
  id: number;
  category: PostCategory;
  title: string;
  author: string;
  date: string;
  views: number;
}

interface BoardListPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

// 샘플 데이터
const mockPosts: Post[] = [
  { id: 15, category: '공지', title: '2026년 1월 급식 일정 안내', author: '관리자', date: '2026-01-10', views: 245 },
  { id: 14, category: '공지', title: '식단표 업데이트 안내', author: '관리자', date: '2026-01-08', views: 198 },
  { id: 13, category: '건의', title: '채식 메뉴 확대 건의드립니다', author: '김학생', date: '2026-01-07', views: 87 },
  { id: 12, category: '요청', title: '알레르기 정보 상세 표시 요청', author: '박학부모', date: '2026-01-05', views: 156 },
  { id: 11, category: '불편사항', title: '급식 시간 대기 줄이 너무 깁니다', author: '이학생', date: '2026-01-04', views: 203 },
  { id: 10, category: '기타의견', title: '급식 만족도 조사 참여 후기', author: '최학생', date: '2026-01-03', views: 92 },
  { id: 9, category: '건의', title: '간식 시간 운영 건의', author: '정학생', date: '2026-01-02', views: 134 },
  { id: 8, category: '요청', title: '메뉴 다양화 요청드립니다', author: '강학부모', date: '2025-12-28', views: 178 },
  { id: 7, category: '공지', title: '연말 급식 운영 일정 공지', author: '관리자', date: '2025-12-27', views: 312 },
  { id: 6, category: '불편사항', title: '식당 온도가 낮습니다', author: '조학생', date: '2025-12-26', views: 145 },
];

export function BoardListPage({ onNavigate }: BoardListPageProps) {
  const [posts] = useState<Post[]>(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('전체');

  // 필터링된 게시물
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === '전체' || post.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // 카테고리 뱃지 색상
  const getCategoryColor = (category: PostCategory) => {
    switch (category) {
      case '공지':
        return 'bg-red-100 text-red-800 border-red-200';
      case '건의':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '요청':
        return 'bg-green-100 text-green-800 border-green-200';
      case '불편사항':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case '기타의견':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
          게시판
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
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
              <div className="w-48">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="분류 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="전체">전체</SelectItem>
                    <SelectItem value="공지">공지</SelectItem>
                    <SelectItem value="건의">건의</SelectItem>
                    <SelectItem value="요청">요청</SelectItem>
                    <SelectItem value="불편사항">불편사항</SelectItem>
                    <SelectItem value="기타의견">기타의견</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => onNavigate?.('board-write')}
                className="bg-[#5dccb4] hover:bg-[#4db9a3] text-white"
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
                  <TableHead className="w-20 text-center">번호</TableHead>
                  <TableHead className="w-32 text-center">분류</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead className="w-32 text-center">작성자</TableHead>
                  <TableHead className="w-32 text-center">작성일</TableHead>
                  <TableHead className="w-24 text-center">조회수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <TableRow 
                      key={post.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => onNavigate?.('board-read', { postId: post.id })}
                    >
                      <TableCell className="text-center text-sm">{post.id}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`${getCategoryColor(post.category)}`}>
                          {post.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {post.category === '공지' && (
                          <span className="text-red-600 mr-2">[공지]</span>
                        )}
                        {post.title}
                      </TableCell>
                      <TableCell className="text-center text-sm">{post.author}</TableCell>
                      <TableCell className="text-center text-sm text-gray-600">{post.date}</TableCell>
                      <TableCell className="text-center text-sm text-gray-600">{post.views}</TableCell>
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

          {/* 페이지네이션 영역 (향후 추가 가능) */}
          <div className="mt-6 flex justify-center">
            <div className="text-sm text-gray-500">
              총 {filteredPosts.length}개의 게시물
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
