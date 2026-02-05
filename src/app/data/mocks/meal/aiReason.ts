export const mockMealPlanAIReasonResponse = {
  status: 'success',
  message: 'AI 대체 이유 조회 성공',
  data: {
    meal_plan_id: 2,
    history_id: 3,
    date: '2026-05-04',
    meal_type: 'LUNCH',
    action_type: 'AI_AUTO_REPLACE',
    reason: 'AI가 8개의 후보 중 영양 균형과 선호도를 고려하여 최적의 메뉴를 선택했습니다.',
    created_at: '2026-01-28T10:52:21+09:00',
  },
} as const;
