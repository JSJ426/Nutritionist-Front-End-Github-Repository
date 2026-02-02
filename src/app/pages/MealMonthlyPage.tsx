import { MealMonthlyCalendar } from '../components/MealMonthlyCalendar';

type MealType = 'lunch' | 'dinner';

type MealDetailPayload = {
  nutrition: {
    kcal: number;
    carb: number;
    prot: number;
    fat: number;
  };
  cost: number;
  aiComment: string;
  allergenSummary: {
    uniqueAllergens: number[];
    byMenu: Record<string, number[]>;
  };
  recipeByMenu?: Record<string, string>;
};

type MenuItem = {
  name: string;
  allergy: number[];
};

type MealData = {
  menu: MenuItem[];
  detail?: MealDetailPayload;
};

type DayMeals = {
  lunch?: MealData;
  dinner?: MealData;
};

type WeekData = {
  week: string;
  meals: Record<string, DayMeals>;
};

type MealMonthlyData = {
  month: string;
  target: string;
  weeks: WeekData[];
};

const mockResponse = {
  status: 'success',
  message: '일간 식단표 상세 조회 성공',
  data: {
    menu_id: 1234,
    meal_plan_id: 2,
    school_id: 1,
    date: '2026-05-04',
    meal_type: 'LUNCH',
    nutrition: {
      kcal: 742,
      carb: 86,
      prot: 45,
      fat: 23,
    },
    cost: 10980,
    ai_comment: '식자재 수급 문제로 인한 변경',
    menu_items: {
      rice: {
        id: 'FOOD-501',
        name: '팥죽',
        display: '팥죽(5)',
        allergens: [5],
      },
      soup: {
        id: 'FOOD-610',
        name: '된장국',
        display: '된장국(5)',
        allergens: [5],
      },
      main1: {
        id: 'FOOD-820',
        name: '떡돼지갈비찜',
        display: '떡돼지갈비찜(5,6,10)',
        allergens: [5, 6, 10],
      },
      main2: {
        id: 'FOOD-901',
        name: '함박스테이크구이',
        display: '함박스테이크구이(1,2,5,6,10,16)',
        allergens: [1, 2, 5, 6, 10, 16],
      },
      side: {
        id: 'FOOD-330',
        name: '김',
        display: '김',
        allergens: [],
      },
      kimchi: {
        id: 'FOOD-140',
        name: '배추김치',
        display: '배추김치(9)',
        allergens: [9],
      },
      dessert: {
        id: 'FOOD-712',
        name: '딸기우유',
        display: '딸기우유(2)',
        allergens: [2],
      },
    },
    allergen_summary: {
      unique_allergens: [1, 2, 5, 6, 9, 10, 16],
      by_menu: {
        팥죽: [5],
        된장국: [5],
        떡돼지갈비찜: [5, 6, 10],
        함박스테이크구이: [1, 2, 5, 6, 10, 16],
        배추김치: [9],
        딸기우유: [2],
      },
    },
    created_at: '2026-01-28T10:30:00Z',
    updated_at: '2026-01-28T10:40:00Z',
  },
};

const getWeekIndex = (date: Date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0
  const firstMonday = new Date(date.getFullYear(), date.getMonth(), 1 - dayOfWeek);
  const diffDays = Math.floor((date.getTime() - firstMonday.getTime()) / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
};

const getDayLabel = (date: Date) => {
  return ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
};

const buildMonthlyDataFromResponse = (): MealMonthlyData => {
  const { data } = mockResponse;
  const dateObj = new Date(`${data.date}T00:00:00`);
  const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
  const weekIndex = getWeekIndex(dateObj);
  const weekCount = Math.max(weekIndex + 1, 4);
  const weeks: WeekData[] = Array.from({ length: weekCount }, (_, idx) => ({
    week: `${idx + 1}주차`,
    meals: {},
  }));

  const mealType: MealType = data.meal_type === 'DINNER' ? 'dinner' : 'lunch';
  const dayLabel = getDayLabel(dateObj);

  const menuItems: MenuItem[] = Object.values(data.menu_items).map((item) => ({
    name: item.display || item.name,
    allergy: item.allergens || [],
  }));

  const recipeByMenu = Object.values(data.menu_items).reduce<Record<string, string>>(
    (acc, item) => {
      acc[item.display || item.name] = `${item.name} 레시피 예시:\n1. 재료를 준비합니다.\n2. 조리합니다.\n3. 마무리합니다.`;
      return acc;
    },
    {}
  );

  const detail: MealDetailPayload = {
    nutrition: data.nutrition,
    cost: data.cost,
    aiComment: data.ai_comment,
    allergenSummary: {
      uniqueAllergens: data.allergen_summary.unique_allergens,
      byMenu: data.allergen_summary.by_menu,
    },
    recipeByMenu,
  };

  weeks[weekIndex].meals[dayLabel] = {
    ...weeks[weekIndex].meals[dayLabel],
    [mealType]: {
      menu: menuItems,
      detail,
    },
  };

  return {
    month: monthKey,
    target: '고등학교',
    weeks,
  };
};

export function MealMonthlyPage() {
  const monthlyData = buildMonthlyDataFromResponse();
  const mealDataByMonth = {
    [monthlyData.month]: monthlyData,
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">식단표 (월간)</h1>
      </div>
      <MealMonthlyCalendar mealDataByMonth={mealDataByMonth} />
    </div>
  );
}
