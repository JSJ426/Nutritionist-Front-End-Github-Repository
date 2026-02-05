import { http } from './http';
import { getStoredAuthClaims } from './auth';
import { mockBoardCreateResponse } from './mocks/board/create';
import { mockBoardDeleteResponse } from './mocks/board/delete';
import { mockBoardDetailResponses } from './mocks/board/detail';
import { mockBoardListResponse } from './mocks/board/list';
import { mockBoardUpdateResponse } from './mocks/board/update';
import type {
  BoardDetailResponse,
  BoardDeleteResponse,
  BoardListResponse,
  BoardWriteResponse,
} from '../viewModels/board';

// BoardList 대응
export const getBoardListResponse = async (
  page = 1,
  size = 20,
  keyword?: string
): Promise<BoardListResponse> => {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('size', String(size));
  if (keyword) {
    params.set('keyword', keyword);
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
  authorId?: number;
  authorName?: string;
  authorType?: 'DIETITIAN' | 'STUDENT' | 'TEACHER' | 'STAFF';
  attachments?: Array<{
    id?: number;
    name?: string;
    size?: number;
  }>;
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
      return 'OTHER';
  }
};

// BoardCreate 대응
export const createBoardPost = async (
  payload: BoardCreatePayload
): Promise<BoardWriteResponse> => {
  const claims = getStoredAuthClaims();
  const authorId = payload.authorId ?? claims?.id;
  const body = {
    category: boardCategoryToApi(payload.category),
    title: payload.title,
    content: payload.content,
    ...(authorId ? { authorId } : {}),
    authorName: payload.authorName ?? '',
    authorType: payload.authorType ?? 'DIETITIAN',
    attachments: payload.attachments ?? [],
  };
  return http.post<BoardWriteResponse>('/boards', body);
};

// BoardUpdate 대응
export const updateBoardPost = async (
  postId: number,
  payload: BoardCreatePayload
): Promise<BoardWriteResponse> => {
  const body = {
    category: boardCategoryToApi(payload.category),
    title: payload.title,
    content: payload.content,
  };
  return http.patch<BoardWriteResponse>(`/boards/${postId}`, body);
};

// BoardDelete 대응
export const deleteBoardPost = async (
  postId: number
): Promise<BoardDeleteResponse> =>
  http.delete<BoardDeleteResponse>(`/boards/${postId}`);

// FileUpload 대응

// FileUpdate 대응

// FileDelete 대응
