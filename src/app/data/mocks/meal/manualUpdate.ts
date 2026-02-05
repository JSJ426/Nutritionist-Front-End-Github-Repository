export const mockMealPlanManualUpdateResponse = {
  status: 'success',
  message: '식단표 수동 수정이 완료되었습니다.',
  data: {
    menu_id: 38,
    meal_plan_id: 2,
    date: '2026-05-04',
    meal_type: 'LUNCH',
    reason: '식자재 수급 문제로 인한 변경',
    raw_menus: ['팥죽', '된장국', '떡돼지갈비찜', '함박스테이크구이', '김', '배추김치', '딸기우유'],
    allergen_summary: {
      unique_allergens: [1, 2, 5, 6, 9, 10, 16],
      by_menu: {
        '팥죽': [5],
        '된장국': [5],
        '떡돼지갈비찜': [5, 6, 10],
        '함박스테이크구이': [1, 2, 5, 6, 10, 16],
        '김': [],
        '배추김치': [9],
        '딸기우유': [2],
      },
    },
    updated_at: '2026-01-28T11:30:00Z',
  },
} as const;
