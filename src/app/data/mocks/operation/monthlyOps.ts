export const mockMonthlyOpsDocCreateResponse = {
  status: 'success',
  message: '월간 운영 자료 생성이 시작되었습니다.',
  data: {
    id: 101,
    school_id: 1,
    title: '2026년 1월 급식 운영 자료',
    year: 2026,
    month: 1,
    status: 'PROCESSING',
    created_at: '2026-01-28T10:30:00Z',
    files: [],
  },
} as const;

export const mockMonthlyOpsDocListResponse = {
  status: 'success',
  data: {
    reports: [
      {
        id: 101,
        school_id: 1,
        title: '2026년 1월 급식 운영 자료',
        year: 2026,
        month: 1,
        status: 'COMPLETED',
        created_at: '2026-01-28T10:30:00Z',
      },
      {
        id: 102,
        school_id: 1,
        title: '2026년 2월 급식 운영 자료',
        year: 2026,
        month: 2,
        status: 'PROCESSING',
        created_at: '2026-02-28T10:30:00Z',
      },
    ],
    pagination: {
      current_page: 1,
      total_pages: 5,
      total_items: 100,
      page_size: 20,
    },
  },
} as const;

export const mockMonthlyOpsDocDetailResponse = {
  status: 'success',
  data: {
    id: 101,
    school_id: 1,
    title: '2026년 1월 급식 운영 자료',
    year: 2026,
    month: 1,
    status: 'COMPLETED',
    created_at: '2026-01-28T10:30:00Z',
    files: [
      {
        id: 501,
        file_name: '2026년1월_급식운영자료.pdf',
        file_type: 'PDF',
        s3_path: 'schools/1/reports/2026/01/report_101.pdf',
        created_at: '2026-01-28T10:33:00Z',
      },
    ],
  },
} as const;
