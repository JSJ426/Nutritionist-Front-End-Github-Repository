export const mockBoardCreateResponse = {
  id: 101,
  schoolId: 1,
  category: 'NEW_MENU',
  title: '신메뉴 요청',
  content: '두쫀쿠 추가해주세요',
  authorId: 3,
  authorType: 'STUDENT',
  viewCount: 0,
  attachments: [
    {
      id: 9001,
      relatedType: 'BOARD',
      relatedId: 101,
      fileName: 'menu.png',
      s3Path: 'schools/1/boards/101/menu.png',
      fileType: 'image/png',
      createdAt: '2026-02-01T10:20:30',
    },
  ],
  createdAt: '2026-02-01T10:20:30',
  updatedAt: '2026-02-01T10:20:30',
} as const;
