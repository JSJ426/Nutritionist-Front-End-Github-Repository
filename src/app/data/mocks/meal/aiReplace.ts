export const mockMealPlanAIReplaceResponse = {
  status: 'success',
  message: 'AI replaced successfully',
  data: {
    meal_plan_id: 2,
    menu_id: 38,
    date: '2026-05-04',
    meal_type: 'LUNCH',
    replaced: true,
    ai_comment: '식자재 수급 문제로 인한 변경',
    updated_at: '2026-01-28T11:20:00Z',
  },
} as const;
