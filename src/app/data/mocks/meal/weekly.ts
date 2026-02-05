export const mockMealPlanWeeklyResponse = {
  status: 'success',
  message: '주간 식단표 조회 성공',
  data: {
    school_id: 1,
    week_start: '2026-05-04',
    week_end: '2026-05-10',
    menus: [
      {
        id: 38,
        date: '2026-05-04',
        meal_type: 'LUNCH',
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
      },
      {
        id: 39,
        date: '2026-05-04',
        meal_type: 'DINNER',
        raw_menus: ['현미밥', '콩나물국', '수육', '감자채볶음', '깍두기', '바나나'],
        allergen_summary: {
          unique_allergens: [5, 9, 10],
          by_menu: {
            '현미밥': [],
            '콩나물국': [5],
            '수육': [10],
            '감자채볶음': [],
            '깍두기': [9],
            '바나나': [],
          },
        },
      },
      {
        id: 40,
        date: '2026-05-05',
        meal_type: 'LUNCH',
        raw_menus: ['잡곡밥', '미역국', '닭갈비', '계란말이', '오이무침', '배추김치'],
        allergen_summary: {
          unique_allergens: [1, 5, 6, 9, 15],
          by_menu: {
            '잡곡밥': [],
            '미역국': [5],
            '닭갈비': [15],
            '계란말이': [1],
            '오이무침': [],
            '배추김치': [9],
          },
        },
      },
      {
        id: 41,
        date: '2026-05-06',
        meal_type: 'DINNER',
        raw_menus: ['비빔밥', '콩나물국', '어묵볶음', '미역초무침', '부추겉절이'],
        allergen_summary: {
          unique_allergens: [1, 5, 6, 9, 16],
          by_menu: {
            '비빔밥': [1, 5, 6, 16],
            '콩나물국': [5],
            '어묵볶음': [5],
            '미역초무침': [5],
            '부추겉절이': [9],
          },
        },
      },
      {
        id: 42,
        date: '2026-05-07',
        meal_type: 'LUNCH',
        raw_menus: ['흑미밥', '된장국', '고등어구이', '두부조림', '열무김치'],
        allergen_summary: {
          unique_allergens: [5, 7, 9],
          by_menu: {
            '흑미밥': [],
            '된장국': [5],
            '고등어구이': [7],
            '두부조림': [5],
            '열무김치': [9],
          },
        },
      },
      {
        id: 43,
        date: '2026-05-08',
        meal_type: 'DINNER',
        raw_menus: ['카레라이스', '양배추샐러드', '돈까스', '깍두기', '요구르트'],
        allergen_summary: {
          unique_allergens: [1, 2, 5, 6, 9, 10],
          by_menu: {
            '카레라이스': [5, 6],
            '양배추샐러드': [],
            '돈까스': [1, 5, 6, 10],
            '깍두기': [9],
            '요구르트': [2],
          },
        },
      },
    ],
  },
} as const;
