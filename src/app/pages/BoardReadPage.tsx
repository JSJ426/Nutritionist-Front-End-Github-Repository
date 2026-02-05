import { useEffect, useState } from 'react';
import { ArrowLeft, Download, Edit, Paperclip, Trash2 } from 'lucide-react';

import { deleteBoardPost, getBoardDetailResponse } from '../data/board';

import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

import { toBoardReadVMFromResponse } from '../viewModels/board';
import type { BoardReadVM } from '../viewModels/board';

interface BoardReadPageProps {
  initialParams?: any;
  onNavigate?: (page: string, params?: any) => void;
}

export function BoardReadPage({ initialParams, onNavigate }: BoardReadPageProps) {
  const postId = initialParams?.postId || 15;
  const [post, setPost] = useState<BoardReadVM | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      const rawPost = await getBoardDetailResponse(postId);
      if (!isActive) return;
      setPost(toBoardReadVMFromResponse(rawPost));
      setIsLoading(false);
    };
    load();
    return () => {
      isActive = false;
    };
  }, [postId]);

  const handleEdit = () => {
    if (!post) return;
    onNavigate?.('board-edit', { postId: post.id });
  };

  const handleDelete = async () => {
    if (!post) return;
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        const result = await deleteBoardPost(post.id);
        alert(result.message);
        onNavigate?.('board-list', { refresh: true, deletedId: post.id });
      } catch (error) {
        console.error('Failed to delete board post:', error);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  if (isLoading || !post) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
            게시판
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
                <Badge variant="outline" className={`${post.categoryColorClass} text-sm px-3 py-1`}>
                  {post.category}
                </Badge>
                <h2 className="text-2xl font-medium flex-1">{post.title}</h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>작성자: {post.author}</span>
                <span className="text-gray-300">|</span>
                <span>작성일: {post.dateText}</span>
                <span className="text-gray-300">|</span>
                <span>조회수: {post.viewsText}</span>
              </div>
            </div>

          {/* 내용 영역 */}
          <div className="p-6">
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {post.contentText}
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
                      <p className="text-xs text-gray-500">{file.sizeText}</p>
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
          {post.canEdit && (
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit size={16} />
                수정
              </Button>
              {post.canDelete && (
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  삭제
                </Button>
              )}
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
