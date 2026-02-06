import { formatDateYmd, formatFileSizeText, formatNumberText } from './shared';

export type BoardCategory = '공지' | '건의' | '신메뉴' | '기타의견';

export type BoardPost = {
  id: number;
  category: BoardCategory;
  title: string;
  author: string;
  date: string;
  views: number;
  content?: string;
  attachments?: Array<{ id: number; name: string; size: number }>;
};

export type BoardListItemVM = {
  id: number;
  category: BoardCategory;
  categoryColorClass: string;
  title: string;
  author: string;
  dateText: string;
  viewsText: string;
};

export type BoardReadAttachmentVM = {
  id: number;
  name: string;
  sizeText: string;
  url: string;
};

export type BoardReadVM = {
  id: number;
  category: BoardCategory;
  categoryColorClass: string;
  title: string;
  author: string;
  dateText: string;
  viewsText: string;
  contentText: string;
  attachments: BoardReadAttachmentVM[];
  canEdit: boolean;
  canDelete: boolean;
};

export type BoardEditVM = {
  id: number;
  title: string;
  content: string;
  category: BoardCategory;
  existingFiles: Array<{ id: number; name: string; size: number; sizeText: string }>;
  editorName: string;
  editedDateText: string;
};

type BoardApiCategory = 'NOTICE' | 'NEW_MENU' | 'SUGGESTION' | 'OTHER';
type BoardAuthorType = 'DIETITIAN' | 'STUDENT' | 'TEACHER' | 'STAFF';

export type BoardListResponse = {
  status: string;
  message: string;
  data: {
    current_page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
    items: Array<{
      id: number;
      schoolId: number;
      category: BoardApiCategory;
      title: string;
      authorId: number;
      authorName?: string;
      authorType: BoardAuthorType;
      viewCount: number;
      createdAt: string;
      updatedAt: string;
      hasAttachment: boolean;
    }>;
  };
};

export type BoardDetailResponse = {
  status: string;
  message: string;
  data: {
    id: number;
    schoolId: number;
    category: BoardApiCategory;
    title: string;
    content: string;
    authorId: number;
    authorType: BoardAuthorType;
    authorName: string;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    attachments: Array<{
      fileId: number;
      fileName: string;
      fileUrl: string;
      fileSize: number;
    }>;
    isMine: boolean;
    isEditable: boolean;
  };
};

export type BoardWriteResponse = {
  id: number;
  schoolId: number;
  category: BoardApiCategory;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  authorType: BoardAuthorType;
  viewCount: number;
  attachments: Array<{
    id: number;
    relatedType: string;
    relatedId: number;
    fileName: string;
    s3Path: string;
    fileType: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type FileUploadResponse = {
  id: number;
  related_type: string;
  related_id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  s3_path: string;
  created_at: string;
};

export type FileUploadApiResponse = {
  status: string;
  message: string;
  data: FileUploadResponse[];
};

export type BoardDeleteResponse = {
  status: string;
  message: string;
  data: {
    board_id: number;
    deleted: boolean;
    delete_type: string;
    deleted_at: string;
  };
};

const apiCategoryToBoardCategory = (category: BoardApiCategory): BoardCategory => {
  switch (category) {
    case 'NOTICE':
      return '공지';
    case 'NEW_MENU':
      return '신메뉴';
    case 'SUGGESTION':
      return '건의';
    default:
      return '기타의견';
  }
};

const apiAuthorTypeLabel = (type: BoardAuthorType) => {
  switch (type) {
    case 'DIETITIAN':
      return '영양사';
    case 'TEACHER':
      return '교직원';
    case 'STAFF':
      return '관리자';
    default:
      return '학생';
  }
};

export const getBoardCategoryColorClass = (category: BoardCategory) => {
  switch (category) {
    case '공지':
      return 'bg-red-100 text-red-800 border-red-200';
    case '건의':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case '신메뉴':
      return 'bg-green-100 text-green-800 border-green-200';
    case '기타의견':
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const toBoardListVM = (posts: BoardPost[]): BoardListItemVM[] => {
  return posts.map((post) => ({
    id: post.id,
    category: post.category,
    categoryColorClass: getBoardCategoryColorClass(post.category),
    title: post.title,
    author: post.author,
    dateText: formatDateYmd(post.date),
    viewsText: formatNumberText(post.views),
  }));
};

export const toBoardListVMFromResponse = (raw: BoardListResponse): BoardListItemVM[] => {
  return raw.data.items.map((item) => {
    const category = apiCategoryToBoardCategory(item.category);
    const author = item.authorName || apiAuthorTypeLabel(item.authorType);
    return {
      id: item.id,
      category,
      categoryColorClass: getBoardCategoryColorClass(category),
      title: item.title,
      author,
      dateText: formatDateYmd(item.createdAt),
      viewsText: formatNumberText(item.viewCount),
    };
  });
};

export const toBoardReadVM = (post: BoardPost): BoardReadVM => {
  return {
    id: post.id,
    category: post.category,
    categoryColorClass: getBoardCategoryColorClass(post.category),
    title: post.title,
    author: post.author,
    dateText: formatDateYmd(post.date),
    viewsText: formatNumberText(post.views),
    contentText: post.content ?? '',
    attachments: (post.attachments ?? []).map((file) => ({
      id: file.id,
      name: file.name,
      sizeText: formatFileSizeText(file.size),
      url: '',
    })),
    canEdit: post.author === '관리자',
    canDelete: post.author === '관리자',
  };
};

export const toBoardReadVMFromResponse = (raw: BoardDetailResponse): BoardReadVM => {
  const category = apiCategoryToBoardCategory(raw.data.category);
  return {
    id: raw.data.id,
    category,
    categoryColorClass: getBoardCategoryColorClass(category),
    title: raw.data.title,
    author: raw.data.authorName || apiAuthorTypeLabel(raw.data.authorType),
    dateText: formatDateYmd(raw.data.createdAt),
    viewsText: formatNumberText(raw.data.viewCount),
    contentText: raw.data.content,
    attachments: raw.data.attachments.map((file) => ({
      id: file.fileId,
      name: file.fileName,
      sizeText: formatFileSizeText(file.fileSize),
      url: file.fileUrl,
    })),
    canEdit: raw.data.isEditable,
    canDelete: raw.data.isMine,
  };
};

export const toBoardEditVM = (post: BoardPost, editorName: string): BoardEditVM => {
  return {
    id: post.id,
    title: post.title,
    content: post.content ?? '',
    category: post.category,
    existingFiles: (post.attachments ?? []).map((file) => ({
      id: file.id,
      name: file.name,
      size: file.size,
      sizeText: formatFileSizeText(file.size),
    })),
    editorName,
    editedDateText: new Date().toLocaleDateString('ko-KR'),
  };
};

export const toBoardEditVMFromResponse = (
  raw: BoardDetailResponse | BoardWriteResponse,
  editorName: string
): BoardEditVM => {
  const isDetail = 'data' in raw;
  const category = apiCategoryToBoardCategory(isDetail ? raw.data.category : raw.category);
  const attachments = isDetail ? raw.data.attachments : raw.attachments;

  return {
    id: isDetail ? raw.data.id : raw.id,
    title: isDetail ? raw.data.title : raw.title,
    content: isDetail ? raw.data.content : raw.content,
    category,
    existingFiles: attachments.map((file) => ({
      id: 'fileId' in file ? file.fileId : file.id,
      name: file.fileName,
      size: 'fileSize' in file ? file.fileSize : 0,
      sizeText: formatFileSizeText('fileSize' in file ? file.fileSize : 0),
    })),
    editorName,
    editedDateText: new Date().toLocaleDateString('ko-KR'),
  };
};
