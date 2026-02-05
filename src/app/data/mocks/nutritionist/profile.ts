export const mockDietitianProfileResponse = {
  status: 'success',
  message: '영양사 프로필 조회 성공',
  data: {
    dietitian_id: 10,
    username: 'nutrition10',
    name: '김영양',
    phone: '010-2345-6789',
    created_at: '2025-10-12T09:20:00Z',
    updated_at: '2026-02-01T16:45:00Z',
    school_id: 1,
  },
} as const;
