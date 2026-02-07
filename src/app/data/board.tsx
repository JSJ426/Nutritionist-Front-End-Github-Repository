import { http } from './http';
import { mockBoardDetailResponses } from './mocks/board/detail';
import type {
  BoardDetailResponse,
  BoardDeleteResponse,
  BoardListResponse,
  BoardWriteResponse,
  FileUploadApiResponse,
  FileUploadResponse,
} from '../viewModels/board';

// BoardList 대응
export const getBoardListResponse = async (
  page = 1,
  size = 20,
  keyword?: string,
  category?: string
): Promise<BoardListResponse> => {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('size', String(size));
  if (keyword) {
    params.set('keyword', keyword);
  }
  if (category) {
    params.set('category', category);
  }
  return http.get<BoardListResponse>(`/boards?${params.toString()}`);
};

// BoardDetail 대응
export const getBoardDetailResponse = async (
  postId?: number
): Promise<BoardDetailResponse> => {
  if (!Number.isFinite(postId)) {
    const responses = mockBoardDetailResponses as Record<number, BoardDetailResponse>;
    return responses[15];
  }
  return http.get<BoardDetailResponse>(`/boards/${postId}`);
};

export type BoardCreatePayload = {
  category: '공지' | '건의' | '신메뉴' | '기타의견';
  title: string;
  content: string;
  attachments?: Array<{
    fileName: string;
    s3Path: string;
    fileType: string;
  }>;
};

export type BoardUpdatePayload = {
  category?: BoardCreatePayload['category'];
  title?: string;
  content?: string;
  files?: File[];
  deleteFileIds?: number[];
};

const boardCategoryToApi = (category: BoardCreatePayload['category']) => {
  switch (category) {
    case '공지':
      return 'NOTICE';
    case '신메뉴':
      return 'NEW_MENU';
    case '건의':
      return 'SUGGESTION';
    default:
      return 'ETC';
  }
};

// BoardCreate 대응
export const createBoardPost = async (
  payload: BoardCreatePayload
): Promise<BoardWriteResponse> => {
  const body = {
    category: boardCategoryToApi(payload.category),
    title: payload.title,
    content: payload.content,
    attachments: payload.attachments ?? [],
  };
  return http.post<BoardWriteResponse>('/boards', body);
};

// BoardUpdate 대응
export const updateBoardPost = async (
  postId: number,
  payload: BoardUpdatePayload
): Promise<BoardWriteResponse> => {
  const form = new FormData();
  if (payload.category) {
    form.append('category', boardCategoryToApi(payload.category));
  }
  if (payload.title) {
    form.append('title', payload.title);
  }
  if (payload.content) {
    form.append('content', payload.content);
  }
  if (payload.deleteFileIds && payload.deleteFileIds.length > 0) {
    form.append('deleteFileIds', payload.deleteFileIds.join(','));
  }
  (payload.files ?? []).forEach((file) => {
    form.append('files', file);
  });
  return http.patch<BoardWriteResponse>(`/boards/${postId}`, form);
};

// BoardDelete 대응
export const deleteBoardPost = async (
  postId: number
): Promise<BoardDeleteResponse> =>
  http.delete<BoardDeleteResponse>(`/boards/${postId}`);

// FileUpload 대응
export const uploadBoardFiles = async (
  files: File[],
  relatedId: number
): Promise<FileUploadResponse[]> => {
  const form = new FormData();
  files.forEach((file) => form.append('files', file));
  form.append('relatedType', 'BOARD');
  form.append('relatedId', String(relatedId));
  const response = await http.post<FileUploadApiResponse>('/api/files', form);
  return response.data;
};

// FileUpdate 대응

// FileDelete 대응
