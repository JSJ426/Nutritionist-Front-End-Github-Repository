import { allergyInfo } from '../utils/allergy';

export type MealType = 'lunch' | 'dinner';

export type MealDetailPayload = {
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
  menuItems?: Record<string, MealPlanMenuItem | null>;
  imageUrl?: string | null;
  isReviewed?: boolean;
  menuId?: number;
  mealPlanId?: number;
  date?: string;
  mealType?: 'LUNCH' | 'DINNER';
};

export type MenuItem = {
  name: string;
  allergy: number[];
};

export type MealMonthlyBaseMeal = {
  menu: MenuItem[];
  detail?: MealDetailPayload;
  isAiReplacement?: boolean;
  aiReason?: string;
};

export type MealMonthlyBaseDay = {
  date: string;
  meals: {
    lunch?: MealMonthlyBaseMeal;
    dinner?: MealMonthlyBaseMeal;
  };
};

export type MealMonthlyBase = {
  month: string;
  target: string;
  days: MealMonthlyBaseDay[];
};

export type MealData = {
  menu: MenuItem[];
  detail?: MealDetailPayload;
};

export type DayMeals = {
  lunch?: MealData;
  dinner?: MealData;
};

export type WeekData = {
  week: string;
  meals: Record<string, DayMeals>;
};

export type MealMonthlyData = {
  month: string;
  target: string;
  weeks: WeekData[];
};

type MealPlanMenuItem = {
  id: string;
  name: string;
  display?: string;
  allergens: number[];
  recipe?: string;
  ingredients?: string;
};

export type MealPlanWeeklyResponse = {
  status: string;
  message: string;
  data: {
    school_id: number;
    week_start: string;
    week_end: string;
    menus: Array<{
      id: number;
      date: string;
      meal_type: 'LUNCH' | 'DINNER';
      raw_menus: string[];
      allergen_summary: {
        unique_allergens: number[];
        by_menu: Record<string, number[]>;
      };
    }>;
  };
};

export type MealMonthlyResponse = {
  status: string;
  message: string;
  data: {
    mealPlanId?: number;
    meal_plan_id?: number;
    year: number;
    month: number;
    school_id: number;
    created_at: string;
    updated_at: string;
    menus: Array<{
      menu_id?: number;
      id?: number;
      date: string;
      meal_type: 'LUNCH' | 'DINNER';
      nutrition: {
        kcal: number;
        carb: number;
        prot: number;
        fat: number;
      };
      cost: number;
      ai_comment: string | null;
      menu_items: Record<string, MealPlanMenuItem | null>;
      allergen_summary: {
        unique: number[];
        has_allergen_5: boolean;
      };
    }>;
  };
};

export type MealPlanDetailResponse = {
  status: string;
  message: string;
  data: {
    menu_id: number;
    meal_plan_id: number;
    school_id: number;
    date: string;
    meal_type: 'LUNCH' | 'DINNER';
    image_url?: string | null;
    is_reviewed?: boolean;
    nutrition: {
      kcal: number;
      carb: number;
      prot: number;
      fat: number;
    };
    cost: number;
    ai_comment: string | null;
    menu_items: Record<string, MealPlanMenuItem | null>;
    allergen_summary: {
      unique_allergens: number[];
      by_menu: Record<string, number[]>;
    };
    created_at: string;
    updated_at: string;
  };
};

export type MealPlanGenerateResponse = {
  status: string;
  message: string;
  data: Array<{
    id: number;
    date: string;
    meal_type: 'LUNCH' | 'DINNER';
    kcal: number;
    carb: number;
    prot: number;
    fat: number;
    cost: number;
    ai_comment: string | null;
    menu_items: Record<
      string,
      { menu_id: number; name: string; display?: string; allergens: number[] }
    >;
    allergen_summary: {
      unique_allergens: number[];
      by_menu: Record<string, number[]>;
    };
  }>;
};

export type MealPlanGeneratePayload = {
  year: number | string;
  month: number | string;
  options: {
    num_generations: number;
  };
};

export type MealPlanAIReplacePayload = {
  date: string;
  mealType: 'LUNCH' | 'DINNER';
};

export type MealPlanAIReplaceResponse = {
  status: string;
  message: string;
  data: {
    meal_plan_id: number;
    menu_id: number;
    date: string;
    meal_type: 'LUNCH' | 'DINNER';
    replaced: boolean;
    ai_comment: string | null;
    updated_at: string;
  };
};

export type MealPlanManualUpdateResponse = {
  status: string;
  message: string;
  data: {
    menu_id: number;
    meal_plan_id: number;
    date: string;
    meal_type: 'LUNCH' | 'DINNER';
    reason: string;
    raw_menus: string[];
    allergen_summary: {
      unique_allergens: number[];
      by_menu: Record<string, number[]>;
    };
    updated_at: string;
  };
};

export type MealPlanHistoryResponse = {
  status: string;
  message: string;
  data: {
    current_page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    items: Array<{
      id: number;
      meal_plan_id: number;
      menu_id: number;
      meal_date: string;
      meal_type: 'LUNCH' | 'DINNER';
      action_type: 'AI_AUTO_REPLACE' | 'MANUAL_UPDATE' | 'GENERATE';
      old_menus: string[];
      new_menus: string[];
      reason: string;
      menu_created_at?: string;
      created_at?: string;
    }>;
  };
};

export type MealPlanAIReasonResponse = {
  status: string;
  message: string;
  data: {
    meal_plan_id: number;
    history_id: number;
    date: string;
    meal_type: 'LUNCH' | 'DINNER';
    action_type: 'AI_AUTO_REPLACE';
    reason: string;
    created_at: string;
  };
};

export const getWeekIndex = (date: Date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0
  const firstMonday = new Date(date.getFullYear(), date.getMonth(), 1 - dayOfWeek);
  const diffDays = Math.floor((date.getTime() - firstMonday.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, Math.floor(diffDays / 7));
};

const getDayLabel = (date: Date) => {
  return ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
};

const formatMacro = (value: number) => `${value}g`;

const buildAllergenSummaryFromMenu = (menu: MenuItem[]) => {
  const uniqueSet = new Set<number>();
  const byMenu: Record<string, number[]> = {};
  menu.forEach((item) => {
    const allergies = Array.isArray(item.allergy) ? item.allergy : [];
    allergies.forEach((num) => uniqueSet.add(num));
    byMenu[item.name] = allergies;
  });
  return {
    uniqueAllergens: Array.from(uniqueSet).sort((a, b) => a - b),
    byMenu,
  };
};

const buildAllergenTextList = (menu: MenuItem[]) => {
  const { uniqueAllergens } = buildAllergenSummaryFromMenu(menu);
  return uniqueAllergens.map((num) => allergyInfo[num]?.label || '알 수 없음');
};

const buildMenuItemsFromMenuItems = (
  menuItems: Record<string, MealPlanMenuItem | null>
): MenuItem[] =>
  Object.values(menuItems)
    .filter((item): item is MealPlanMenuItem => Boolean(item))
    .map((item) => ({
      name: item.name,
      allergy: item.allergens || [],
    }));

const buildMenuItemsFromWeekly = (
  rawMenus: string[],
  allergenByMenu: Record<string, number[]>
): MenuItem[] =>
  rawMenus.map((name) => ({
    name,
    allergy: allergenByMenu[name] ?? [],
  }));

const buildRecipeByMenu = (menuItems: MenuItem[]) =>
  menuItems.reduce<Record<string, string>>((acc, item) => {
    acc[item.name] = `${item.name} 레시피 예시:\n1. 재료를 준비합니다.\n2. 조리합니다.\n3. 마무리합니다.`;
    return acc;
  }, {});

const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;

export const buildMealMonthlyDataFromResponse = (raw: MealMonthlyResponse): MealMonthlyData => {
  const { data } = raw;
  const mealPlanId = data.mealPlanId ?? data.meal_plan_id;
  const monthKey = `${data.year}-${String(data.month).padStart(2, '0')}`;
  const sortedMenus = [...data.menus].sort((a, b) => a.date.localeCompare(b.date));
  const weekIndices = sortedMenus.map((menu) => getWeekIndex(new Date(`${menu.date}T00:00:00`)));
  const weekCount = Math.max((weekIndices.length ? Math.max(...weekIndices) + 1 : 1), 4);
  const weeks: WeekData[] = Array.from({ length: weekCount }, (_, idx) => ({
    week: `${idx + 1}주차`,
    meals: {},
  }));

  sortedMenus.forEach((menu) => {
    const dateObj = new Date(`${menu.date}T00:00:00`);
    const weekIndex = getWeekIndex(dateObj);
    const mealType: MealType = menu.meal_type === 'DINNER' ? 'dinner' : 'lunch';
    const dayLabel = getDayLabel(dateObj);

    const menuItems = buildMenuItemsFromMenuItems(menu.menu_items);
    const computedSummary = buildAllergenSummaryFromMenu(menuItems);

    const detail: MealDetailPayload = {
      nutrition: menu.nutrition,
      cost: menu.cost,
      aiComment: menu.ai_comment ?? '',
      allergenSummary: {
        uniqueAllergens: menu.allergen_summary.unique.length
          ? menu.allergen_summary.unique
          : computedSummary.uniqueAllergens,
        byMenu: computedSummary.byMenu,
      },
      recipeByMenu: buildRecipeByMenu(menuItems),
      menuItems: menu.menu_items,
      menuId: menu.menu_id ?? menu.id,
      mealPlanId,
      date: menu.date,
      mealType: menu.meal_type,
    };

    weeks[weekIndex].meals[dayLabel] = {
      ...weeks[weekIndex].meals[dayLabel],
      [mealType]: {
        menu: menuItems,
        detail,
      },
    };
  });

  return {
    month: monthKey,
    target: '고등학교',
    weeks,
  };
};

export const toMealMonthlyDataByMonth = (raw: MealMonthlyResponse): Record<string, MealMonthlyData> => {
  const monthlyData = buildMealMonthlyDataFromResponse(raw);
  return {
    [monthlyData.month]: monthlyData,
  };
};

type HomeMealsDefaults = {
  todayDate?: Date;
  defaultDetail: MealDetailPayload;
  defaultAllergenText?: string[];
};

export const toHomeMealsFromMonthlyBase = (base: MealMonthlyBase, defaults: HomeMealsDefaults) => {
  const isoToday = toIsoDate(defaults.todayDate ?? new Date());
  const sortedDays = [...base.days].sort((a, b) => a.date.localeCompare(b.date));
  const todayEntry = sortedDays.find((day) => day.date === isoToday) || sortedDays[0];
  const todayMealsSource = todayEntry?.meals ?? {};

  const toTodayMeal = (meal?: MealMonthlyBaseMeal) => {
    const menu = meal?.menu ?? [];
    const detail = meal?.detail ?? defaults.defaultDetail;
    return {
      menu: menu.map((item) => item.name),
      calories: detail.nutrition.kcal,
      nutrients: {
        protein: formatMacro(detail.nutrition.prot),
        carbs: formatMacro(detail.nutrition.carb),
        fat: formatMacro(detail.nutrition.fat),
      },
      allergens:
        menu.length > 0
          ? buildAllergenTextList(menu)
          : defaults.defaultAllergenText ?? [],
    };
  };

  const todayMeals = {
    lunch: toTodayMeal(todayMealsSource.lunch),
    dinner: toTodayMeal(todayMealsSource.dinner),
  };

  const targetDate = new Date(`${todayEntry?.date ?? isoToday}T00:00:00`);
  const targetWeekIndex = getWeekIndex(targetDate);
  const weeklyDays = sortedDays.filter((day) => {
    const dateObj = new Date(`${day.date}T00:00:00`);
    const dayIndex = dateObj.getDay();
    const isWeekday = dayIndex >= 1 && dayIndex <= 5;
    return isWeekday && getWeekIndex(dateObj) === targetWeekIndex;
  });

  const weeklyMeals = weeklyDays.map((day) => {
    const dateObj = new Date(`${day.date}T00:00:00`);
    return {
      day: getDayLabel(dateObj),
      date: dateObj.getDate(),
      lunch: {
        menu: day.meals.lunch?.menu ?? [],
      },
      dinner: {
        menu: day.meals.dinner?.menu ?? [],
      },
    };
  });

  return { todayMeals, weeklyMeals };
};

const defaultHomeMealsDefaults: HomeMealsDefaults = {
  defaultDetail: {
    nutrition: {
      kcal: 720,
      carb: 90,
      prot: 35,
      fat: 24,
    },
    cost: 0,
    aiComment: '',
    allergenSummary: {
      uniqueAllergens: [],
      byMenu: {},
    },
  },
};

export const toHomeMealsFromWeeklyResponse = (
  raw: MealPlanWeeklyResponse,
  defaults: Partial<HomeMealsDefaults> = {}
) => {
  const resolvedDefaults: HomeMealsDefaults = {
    ...defaultHomeMealsDefaults,
    ...defaults,
    defaultDetail: defaults.defaultDetail ?? defaultHomeMealsDefaults.defaultDetail,
  };
  const isoToday = toIsoDate(resolvedDefaults.todayDate ?? new Date(`${raw.data.week_start}T00:00:00`));
  const mealsByDate = new Map<string, DayMeals>();

  raw.data.menus.forEach((menu) => {
    const mealType: MealType = menu.meal_type === 'DINNER' ? 'dinner' : 'lunch';
    const menuItems = buildMenuItemsFromWeekly(menu.raw_menus, menu.allergen_summary.by_menu);
    const current = mealsByDate.get(menu.date) ?? {};
    current[mealType] = { menu: menuItems };
    mealsByDate.set(menu.date, current);
  });

  const sortedDates = Array.from(mealsByDate.keys()).sort((a, b) => a.localeCompare(b));
  const fallbackEntry = resolvedDefaults.todayDate
    ? undefined
    : sortedDates[0]
    ? mealsByDate.get(sortedDates[0])
    : undefined;
  const todayEntry = mealsByDate.get(isoToday) ?? fallbackEntry;

  const toTodayMeal = (meal?: MealData) => {
    const menu = meal?.menu ?? [];
    const detail = meal?.detail ?? resolvedDefaults.defaultDetail;
    return {
      menu: menu.map((item) => item.name),
      calories: detail.nutrition.kcal,
      nutrients: {
        protein: formatMacro(detail.nutrition.prot),
        carbs: formatMacro(detail.nutrition.carb),
        fat: formatMacro(detail.nutrition.fat),
      },
      allergens: menu.length > 0 ? buildAllergenTextList(menu) : resolvedDefaults.defaultAllergenText ?? [],
    };
  };

  const todayMeals = {
    lunch: toTodayMeal(todayEntry?.lunch),
    dinner: toTodayMeal(todayEntry?.dinner),
  };

  const weekStartDate = new Date(`${raw.data.week_start}T00:00:00`);
  const weeklyMeals = Array.from({ length: 5 }, (_, idx) => {
    const dateObj = new Date(weekStartDate);
    dateObj.setDate(weekStartDate.getDate() + idx);
    const isoDate = toIsoDate(dateObj);
    const dayMeals = mealsByDate.get(isoDate);

    return {
      day: getDayLabel(dateObj),
      date: dateObj.getDate(),
      lunch: { menu: dayMeals?.lunch?.menu ?? [] },
      dinner: { menu: dayMeals?.dinner?.menu ?? [] },
    };
  });

  return { todayMeals, weeklyMeals };
};

export const toHomeMealFromDetailResponse = (
  raw: MealPlanDetailResponse | null | undefined,
  defaults: HomeMealsDefaults = defaultHomeMealsDefaults
) => {
  if (!raw) {
    return {
      menu: [],
      calories: defaults.defaultDetail.nutrition.kcal,
      nutrients: {
        protein: formatMacro(defaults.defaultDetail.nutrition.prot),
        carbs: formatMacro(defaults.defaultDetail.nutrition.carb),
        fat: formatMacro(defaults.defaultDetail.nutrition.fat),
      },
      allergens: defaults.defaultAllergenText ?? [],
    };
  }

  const menuItems = buildMenuItemsFromMenuItems(raw.data.menu_items);
  const detail = raw.data.nutrition ?? defaults.defaultDetail.nutrition;

  return {
    menu: menuItems.map((item) => item.name),
    calories: detail.kcal,
    nutrients: {
      protein: formatMacro(detail.prot),
      carbs: formatMacro(detail.carb),
      fat: formatMacro(detail.fat),
    },
    allergens: menuItems.length > 0 ? buildAllergenTextList(menuItems) : defaults.defaultAllergenText ?? [],
  };
};

export const toMealMonthlyResponseFromMonthlyBase = (
  base: MealMonthlyBase,
  targetDate: string,
  defaults: {
    status: string;
    message: string;
    menuId: number;
    mealPlanId: number;
    schoolId: number;
    createdAt: string;
    updatedAt: string;
    defaultNutrition: MealDetailPayload['nutrition'];
    defaultCost: number;
    defaultAiComment: string;
  }
): MealMonthlyResponse => {
  const sortedDays = [...base.days].sort((a, b) => a.date.localeCompare(b.date));
  const targetDay = sortedDays.find((day) => day.date === targetDate) || sortedDays[0];
  const mealSource = targetDay?.meals.lunch || targetDay?.meals.dinner;
  const mealType = targetDay?.meals.lunch ? 'LUNCH' : 'DINNER';
  const menu = mealSource?.menu ?? [];
  const detail = mealSource?.detail;
  const allergenSummary = detail?.allergenSummary ?? buildAllergenSummaryFromMenu(menu);

  const menuItems = menu.reduce<Record<string, MealPlanMenuItem | null>>((acc, item, idx) => {
    const allergyText = item.allergy.length > 0 ? `(${item.allergy.join(',')})` : '';
    acc[`item${idx + 1}`] = {
      id: `FOOD-${targetDay?.date.replace(/-/g, '')}-${mealType}-${idx + 1}`,
      name: item.name,
      display: `${item.name}${allergyText}`,
      allergens: item.allergy,
    };
    return acc;
  }, {});

  const dateObj = new Date(`${targetDay?.date ?? targetDate}T00:00:00`);
  const monthKey = dateObj.getMonth() + 1;

  return {
    status: defaults.status,
    message: defaults.message,
    data: {
      mealPlanId: defaults.mealPlanId,
      year: dateObj.getFullYear(),
      month: monthKey,
      school_id: defaults.schoolId,
      created_at: defaults.createdAt,
      updated_at: defaults.updatedAt,
      menus: [
        {
          menu_id: defaults.menuId,
          date: targetDay?.date ?? targetDate,
          meal_type: mealType,
          nutrition: detail?.nutrition ?? defaults.defaultNutrition,
          cost: detail?.cost ?? defaults.defaultCost,
          ai_comment: detail?.aiComment ?? defaults.defaultAiComment,
          menu_items: menuItems,
          allergen_summary: {
            unique: allergenSummary.uniqueAllergens,
            has_allergen_5: allergenSummary.uniqueAllergens.includes(5),
          },
        },
      ],
    },
  };
};

export const toMealWeeklyEditableFromMonthlyBase = (base: MealMonthlyBase): MealEditableWeek[] => {
  const sortedDays = [...base.days].sort((a, b) => a.date.localeCompare(b.date));
  const weeksMap = new Map<number, MealEditableWeek>();

  sortedDays.forEach((day) => {
    const dateObj = new Date(`${day.date}T00:00:00`);
    const weekdayIndex = dateObj.getDay();
    const isWeekday = weekdayIndex >= 1 && weekdayIndex <= 5;
    if (!isWeekday) {
      return;
    }

    const weekIndex = getWeekIndex(dateObj);
    if (!weeksMap.has(weekIndex)) {
      weeksMap.set(weekIndex, {
        week: `${weekIndex + 1}주차`,
        meals: {},
      });
    }

    const week = weeksMap.get(weekIndex)!;
    const dayLabel = getDayLabel(dateObj);
    const defaultMeal: MealEditableData = {
      menu: [],
      isAiReplacement: false,
    };

    const toEditable = (meal?: MealMonthlyBaseMeal): MealEditableData => ({
      menu: meal?.menu ?? [],
      isAiReplacement: meal?.isAiReplacement ?? false,
      aiReason: meal?.aiReason,
    });

    week.meals[dayLabel] = {
      lunch: day.meals.lunch ? toEditable(day.meals.lunch) : defaultMeal,
      dinner: day.meals.dinner ? toEditable(day.meals.dinner) : defaultMeal,
    };
  });

  return Array.from(weeksMap.values()).sort((a, b) => {
    const aIndex = parseInt(a.week, 10);
    const bIndex = parseInt(b.week, 10);
    return aIndex - bIndex;
  });
};

export type MealEditableMenuItem = {
  name: string;
  allergy: number[];
};

export type MealEditableData = {
  menu: MealEditableMenuItem[];
  isAiReplacement: boolean;
  aiReason?: string;
  menuId?: number;
  mealPlanId?: number;
};

export type MealEditableDayMeals = {
  lunch: MealEditableData;
  dinner: MealEditableData;
};

export type MealEditableWeek = {
  week: string;
  meals: Record<string, MealEditableDayMeals>;
};

export type MealWeeklyEditableVM = {
  weeks: MealEditableWeek[];
};

export const toMealWeeklyEditableVM = (weeks: MealEditableWeek[]): MealWeeklyEditableVM => ({
  weeks,
});

export const toMealWeeklyEditableFromWeeklyResponse = (
  raw: MealPlanWeeklyResponse
): MealEditableWeek[] => {
  const weekStartDate = new Date(`${raw.data.week_start}T00:00:00`);
  const weekLabel = `${getWeekIndex(weekStartDate) + 1}주차`;
  const weekDays = ['월', '화', '수', '목', '금'];

  const mealsByDay: Record<string, MealEditableDayMeals> = {};
  weekDays.forEach((day) => {
    mealsByDay[day] = {
      lunch: { menu: [], isAiReplacement: false },
      dinner: { menu: [], isAiReplacement: false },
    };
  });

  raw.data.menus.forEach((menu) => {
    const dateObj = new Date(`${menu.date}T00:00:00`);
    const dayLabel = getDayLabel(dateObj);
    if (!mealsByDay[dayLabel]) {
      return;
    }
    const mealType: MealType = menu.meal_type === 'DINNER' ? 'dinner' : 'lunch';
    const menuItems = buildMenuItemsFromWeekly(menu.raw_menus, menu.allergen_summary.by_menu);
    mealsByDay[dayLabel][mealType] = {
      menu: menuItems,
      isAiReplacement: false,
    };
  });

  return [
    {
      week: weekLabel,
      meals: mealsByDay,
    },
  ];
};

export const toMealWeeklyEditableVMFromWeeklyResponse = (
  raw: MealPlanWeeklyResponse
): MealWeeklyEditableVM => ({
  weeks: toMealWeeklyEditableFromWeeklyResponse(raw),
});

export const toMealWeeklyEditableVMFromMonthlyData = (
  monthly: MealMonthlyData,
  _targetDate: string
): MealWeeklyEditableVM => {
  if (!monthly.weeks.length) {
    return { weeks: [] };
  }

  const weekDays = ['월', '화', '수', '목', '금'];

  return {
    weeks: monthly.weeks.map((week, index) => {
      const meals: Record<string, MealEditableDayMeals> = {};
      weekDays.forEach((day) => {
        const dayMeals = week.meals[day];
        const lunchComment = dayMeals?.lunch?.detail?.aiComment;
        const dinnerComment = dayMeals?.dinner?.detail?.aiComment;
        meals[day] = {
          lunch: {
            menu: dayMeals?.lunch?.menu ?? [],
            isAiReplacement: Boolean(lunchComment),
            aiReason: lunchComment || undefined,
            menuId: dayMeals?.lunch?.detail?.menuId,
            mealPlanId: dayMeals?.lunch?.detail?.mealPlanId,
          },
          dinner: {
            menu: dayMeals?.dinner?.menu ?? [],
            isAiReplacement: Boolean(dinnerComment),
            aiReason: dinnerComment || undefined,
            menuId: dayMeals?.dinner?.detail?.menuId,
            mealPlanId: dayMeals?.dinner?.detail?.mealPlanId,
          },
        };
      });

      return {
        week: week.week || `${index + 1}주차`,
        meals,
      };
    }),
  };
};

export type MealHistoryItemVM = {
  date: string;
  mealDate: string;
  mealType: string;
  action: string;
  menuBefore: string[];
  menuAfter: string[];
  changes: string;
};

const actionTypeLabelMap: Record<MealPlanHistoryResponse['data']['items'][number]['action_type'], string> =
  {
    GENERATE: '생성',
    MANUAL_UPDATE: '수정',
    AI_AUTO_REPLACE: '수정 (AI대체)',
  };

export const toMealHistoryVM = (raw: MealPlanHistoryResponse): MealHistoryItemVM[] =>
  raw.data.items.map((item) => ({
    date: item.created_at ?? item.meal_date,
    mealDate: item.meal_date,
    mealType: item.meal_type === 'DINNER' ? '석식' : '중식',
    action: actionTypeLabelMap[item.action_type] ?? '수정',
    menuBefore: item.old_menus,
    menuAfter: item.new_menus,
    changes: item.reason,
  }));

export type MealCardVM = {
  title: string;
  headlineLines: string[];
  summaryText: string;
  imageUrl: string;
  weekDays: string[];
  rows: Array<{ label: string; cells: string[][] }>; // label: 중식/석식
  todayIndex: number;
};

export const toMealCardVM = (raw: MealCardVM): MealCardVM => raw;
