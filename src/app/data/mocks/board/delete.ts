export const mockBoardDeleteResponse = {
  status: 'success',
  message: '게시글이 삭제되었습니다.',
  data: {
    board_id: 101,
    deleted: true,
    delete_type: 'HARD',
    deleted_at: '2026-02-01T14:50:30',
  },
} as const;
