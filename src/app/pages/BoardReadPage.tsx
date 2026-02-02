import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Download, Edit, Paperclip, Trash2 } from 'lucide-react';

type PostCategory = '공지' | '건의' | '신메뉴' | '기타의견';

interface Post {
  id: number;
  category: PostCategory;
  title: string;
  author: string;
  date: string;
  views: number;
  content: string;
  attachments?: Array<{ id: number; name: string; size: number }>;
}

interface BoardReadPageProps {
  initialParams?: any;
  onNavigate?: (page: string, params?: any) => void;
}

// 샘플 데이터 (실제로는 postId로 조회)
const mockPostData: Record<number, Post> = {
  15: {
    id: 15,
    category: '공지',
    title: '2026년 1월 급식 일정 안내',
    author: '관리자',
    date: '2026-01-10',
    views: 245,
    attachments: [
      { id: 1, name: '2026-01-급식일정.pdf', size: 245760 },
      { id: 2, name: '운영안내서.hwp', size: 1048576 },
    ],
    content: `안녕하세요. 급식 관리팀입니다.

2026년 1월 급식 운영 일정을 안내드립니다.

■ 운영 기간
- 2026년 1월 2일(목) ~ 1월 31일(금)
- 평일(월~금) 중식, 석식 제공

■ 주요 변경사항
1. 알레르기 정보 표시 강화
   - 각 음식별 알레르기 유발 성분 상세 표시
   - 배경색으로 구분하여 가독성 향상

2. 채식 메뉴 확대
   - 주 2회 채식 메뉴 제공
   - 채식 선택권 강화

3. 설문조사 실시
   - 매주 금요일 만족도 조사
   - 다음 주 메뉴 개선에 반영

■ 문의사항
- 이메일: ktaivle@kt.com
- 전화: 02-1234-5678

감사합니다.`,
  },
  13: {
    id: 13,
    category: '건의',
    title: '채식 메뉴 확대 건의드립니다',
    author: '김학생',
    date: '2026-01-07',
    views: 87,
    content: `안녕하세요.

최근 채식을 실천하는 학생들이 늘어나고 있는데, 현재 급식에서는 채식 메뉴가 부족한 것 같습니다.

건의사항:
1. 주 2~3회 채식 메뉴 제공
2. 채식 선택 옵션 마련
3. 식물성 단백질 메뉴 다양화

건강과 환경을 생각하는 급식이 되었으면 좋겠습니다.

감사합니다.`,
  },
  12: {
    id: 12,
    category: '기타의견',
    title: '알레르기 정보 상세 표시 요청',
    author: '박학부모',
    date: '2026-01-05',
    views: 156,
    content: `안녕하세요. 학부모입니다.

자녀가 식품 알레르기가 있어서 급식 메뉴를 확인할 때 항상 주의를 기울이고 있습니다.

현재 알레르기 정보가 표시되고 있지만, 좀 더 상세하고 명확하게 표시되면 좋겠습니다.

요청사항:
- 각 음식별로 알레르기 유발 성분 표시
- 색상으로 구분하여 쉽게 확인 가능하도록
- 대체 메뉴 안내

학생들의 안전을 위해 개선해 주시면 감사하겠습니다.`,
  },
};

export function BoardReadPage({ initialParams, onNavigate }: BoardReadPageProps) {
  const postId = initialParams?.postId || 15;
  const [post] = useState<Post>(mockPostData[postId] || mockPostData[15]);
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // 카테고리 뱃지 색상
  const getCategoryColor = (category: PostCategory) => {
    switch (category) {
      case '공지':
        return 'bg-red-100 text-red-800 border-red-200';
      case '건의':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '신메뉴':
        return 'bg-green-100 text-green-800 border-green-200';
      case '기타의견':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleEdit = () => {
    onNavigate?.('board-edit', { postId: post.id });
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      alert('게시물이 삭제되었습니다.');
      onNavigate?.('board-list');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
            게시판
          </h1>
          <Button
            variant="outline"
            onClick={() => onNavigate?.('board-list')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            목록으로
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-[1200px] mx-auto">
          {/* 게시물 정보 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            {/* 제목 영역 */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-start gap-3 mb-3">
                <Badge variant="outline" className={`${getCategoryColor(post.category)} text-sm px-3 py-1`}>
                  {post.category}
                </Badge>
                <h2 className="text-2xl font-medium flex-1">{post.title}</h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>작성자: {post.author}</span>
                <span className="text-gray-300">|</span>
                <span>작성일: {post.date}</span>
                <span className="text-gray-300">|</span>
                <span>조회수: {post.views}</span>
              </div>
            </div>

          {/* 내용 영역 */}
          <div className="p-6">
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {post.content}
              </p>
            </div>
          </div>
        </div>

        {/* 첨부파일 영역 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200 p-4 flex items-center gap-2">
            <Paperclip size={16} className="text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700">첨부파일</h3>
          </div>
          <div className="p-4">
            {post.attachments && post.attachments.length > 0 ? (
              <div className="space-y-2">
                {post.attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert('다운로드 기능은 준비 중입니다.')}
                      className="inline-flex items-center px-3 py-1.5 text-xs border rounded hover:bg-gray-50"
                    >
                      <Download size={14} className="mr-1" />
                      다운로드
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">첨부파일이 없습니다.</p>
            )}
          </div>
        </div>

          {/* 버튼 영역 (관리자만) */}
          {post.author === '관리자' && (
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit size={16} />
                수정
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 size={16} />
                삭제
              </Button>
            </div>
          )}

          {/* 이전글/다음글 영역 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
            <div className="border-b border-gray-200 p-4 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-20">이전글</span>
                <span className="flex-1 text-sm">식단표 업데이트 안내</span>
              </div>
            </div>
            <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-20">다음글</span>
                <span className="flex-1 text-sm">채식 메뉴 확대 건의드립니다</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
