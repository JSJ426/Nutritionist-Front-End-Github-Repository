export const mockAdditionalMenuDeleteResponse = {
  status: 'success',
  message: '신메뉴가 삭제되었습니다.',
  data: {
    new_food_id: 'NEWFOOD-1',
    deleted: true,
    delete_type: 'SOFT',
    deleted_at: '2026-01-28T10:30:00Z',
  },
} as const;
