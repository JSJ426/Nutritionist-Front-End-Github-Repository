import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { ArrowLeft, Paperclip, Upload, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface AttachmentItem {
  id: number;
  name: string;
  size: number;
}

interface BoardEditPageProps {
  initialParams?: any;
  onNavigate?: (page: string, params?: any) => void;
}

// 샘플 데이터
const mockPostData: Record<number, any> = {
  15: {
    id: 15,
    category: '공지',
    title: '2026년 1월 급식 일정 안내',
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
};

export function BoardEditPage({ initialParams, onNavigate }: BoardEditPageProps) {
  const postId = initialParams?.postId || 15;
  const originalPost = mockPostData[postId] || mockPostData[15];

  const [title, setTitle] = useState(originalPost.title);
  const [content, setContent] = useState(originalPost.content);
  const [category] = useState('공지'); // 공지로 고정
  const [existingFiles, setExistingFiles] = useState<AttachmentItem[]>(originalPost.attachments ?? []);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const nextFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...nextFiles]);
    event.target.value = '';
  };

  const handleRemoveExisting = (id: number) => {
    setExistingFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleRemoveNew = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    // 실제로는 API 호출 (첨부 파일 포함)
    alert('게시물이 수정되었습니다.');
    onNavigate?.('board-read', { postId });
  };

  const handleCancel = () => {
    if (confirm('수정을 취소하시겠습니까? 변경한 내용은 저장되지 않습니다.')) {
      onNavigate?.('board-read', { postId });
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
            게시물 수정
          </h1>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            돌아가기
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              {/* 분류 */}
              <div>
                <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                  분류
                </Label>
                <Select value={category} disabled>
                  <SelectTrigger id="category" className="bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="공지">공지</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  게시물 수정 시 분류는 '공지'로 고정됩니다.
                </p>
              </div>

              {/* 제목 */}
              <div>
                <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                  제목 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* 내용 */}
              <div>
                <Label htmlFor="content" className="text-sm font-medium mb-2 block">
                  내용 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="내용을 입력하세요"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[400px] resize-none"
                />
              </div>

              {/* 첨부파일 */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  첨부파일
                </Label>
                <div className="border border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Paperclip size={16} />
                      <span>파일을 선택하여 첨부하세요.</span>
                    </div>
                    <label className="inline-flex items-center px-3 py-2 text-sm border rounded hover:bg-gray-50 cursor-pointer">
                      <Upload size={16} className="mr-2" />
                      파일 선택
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {(existingFiles.length > 0 || uploadedFiles.length > 0) && (
                    <div className="mt-4 space-y-2">
                      {existingFiles.map((file) => (
                        <div
                          key={`existing-${file.id}`}
                          className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveExisting(file.id)}
                            className="p-1 rounded hover:bg-gray-200"
                          >
                            <X size={16} className="text-gray-500" />
                          </button>
                        </div>
                      ))}
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={`new-${file.name}-${index}`}
                          className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveNew(index)}
                            className="p-1 rounded hover:bg-gray-200"
                          >
                            <X size={16} className="text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 수정 정보 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>수정자:</strong> 관리자 (현재 로그인된 사용자)
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  <strong>수정일:</strong> {new Date().toLocaleDateString('ko-KR')}
                </p>
              </div>

              {/* 버튼 영역 */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  취소
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-[#5dccb4] hover:bg-[#4db9a3] text-white"
                >
                  수정 완료
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
