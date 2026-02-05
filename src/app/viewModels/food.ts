import { formatDateYmd, formatNumberText } from './shared';

export type FoodItem = {
  id: number;
  menuId: string;
  name: string;
  category: string;
  calories: number;
  allergies: number[];
};

export type FoodListRaw = {
  items: FoodItem[];
  categories: string[];
};

export type FoodListItemVM = {
  id: number;
  menuId: string;
  name: string;
  category: string;
  calories: number;
  caloriesText: string;
  allergiesText: string;
};

export type FoodListVM = {
  items: FoodListItemVM[];
  categoryOptions: string[];
};

export type FoodInfoItem = {
  menu_id: string;
  name: string;
  category: string;
  nutrition_basis: string;
  serving_size: string;
  kcal: number;
  carb: number;
  prot: number;
  fat: number;
  calcium: number;
  iron: number;
  vitaminA: number;
  thiamin: number;
  riboflavin: number;
  vitaminC: number;
  ingredients_text: string;
  allergens: number[];
  recipe_text: string;
  created_at: string;
  updated_at: string;
};

export type FoodInfoVM = {
  id: string;
  name: string;
  category: string;
  createdDateText: string;
  nutritionBasisText: string;
  servingSizeText: string;
  nutritionRows: Array<{ label: string; valueText: string }>;
  ingredientsText: string;
  allergens: number[];
  recipeText: string;
};

export type FoodListResponse = {
  status: string;
  message: string;
  data: {
    current_page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
    items: Array<{
      menu_id: string;
      name: string;
      category: string;
      kcal: number;
      allergens: number[];
      created_at?: string;
      updated_at: string;
    }>;
  };
};

export type FoodInfoDetailResponse = {
  status: string;
  message: string;
  data: {
    menu_id: string;
    name: string;
    category: string;
    nutrition_basis: string;
    serving_size: string;
    kcal: number;
    carb: number;
    prot: number;
    fat: number;
    calcium: number;
    iron: number;
    vitamin_a: number;
    thiamin: number;
    riboflavin: number;
    vitamin_c: number;
    ingredients_text: string;
    allergens: number[];
    recipe_text: string;
    updated_at: string;
    created_at?: string;
  };
};

export type NewFoodInfoItem = {
  menu_id: string;
  name: string;
  category: string;
  nutrition_basis: string;
  serving_size: string;
  kcal: number;
  carb: number;
  prot: number;
  fat: number;
  calcium: number;
  iron: number;
  vitaminA?: number;
  vitamin_a?: number;
  thiamin: number;
  riboflavin: number;
  vitaminC?: number;
  vitamin_c?: number;
  ingredients_text: string;
  allergens: number[];
  recipe_text: string;
  created_at?: string;
  updated_at: string;
};

export type NewFoodListResponse = {
  status: string;
  message: string;
  data: {
    current_page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
    items: NewFoodInfoItem[];
  };
};

export type NewFoodDetailResponse = {
  status: string;
  message: string;
  data: {
    current_page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
    items: NewFoodInfoItem[];
  };
};

export type NewFoodCreateResponse = {
  status: string;
  message: string;
  data: {
    new_menu_id: string;
    name: string;
    category: string;
    nutrition_basis: string;
    serving_size: string;
    kcal: number;
    carb: number;
    prot: number;
    fat: number;
    calcium: number;
    iron: number;
    vitaminA?: number;
    vitamin_a?: number;
    thiamin: number;
    riboflavin: number;
    vitaminC?: number;
    vitamin_c?: number;
    ingredients_text: string;
    allergens: number[];
    recipe_text: string;
    created_at: string;
    updated_at: string;
  };
};

export type NewFoodPatchResponse = {
  status: string;
  message: string;
  data: {
    new_menu_id: string;
    name: string;
    category: string;
    nutrition_basis: string;
    serving_size: string;
    kcal: number;
    carb: number;
    prot: number;
    fat: number;
    calcium: number;
    iron: number;
    vitaminA?: number;
    vitamin_a?: number;
    thiamin: number;
    riboflavin: number;
    vitaminC?: number;
    vitamin_c?: number;
    ingredients_text: string;
    allergens: number[];
    recipe_text: string;
    updated_at: string;
  };
};

export type NewFoodDeleteResponse = {
  status: string;
  message: string;
  data: {
    new_food_id: string;
    deleted: boolean;
    delete_type: string;
    deleted_at: string;
  };
};

const parseMenuNumericId = (menuId: string) => {
  const match = menuId.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

export const toFoodListVM = (raw: FoodListRaw): FoodListVM => {
  return {
    items: raw.items.map((food) => ({
      id: food.id,
      menuId: food.menuId,
      name: food.name,
      category: food.category,
      calories: food.calories,
      caloriesText: formatNumberText(food.calories),
      allergiesText: food.allergies.length > 0 ? food.allergies.join(', ') : '-',
    })),
    categoryOptions: raw.categories,
  };
};

export const toFoodListVMFromResponse = (raw: FoodListResponse): FoodListVM => {
  const categories = Array.from(
    new Set(raw.data.items.map((item) => item.category))
  ).sort((a, b) => a.localeCompare(b));

  return {
    items: raw.data.items.map((item) => ({
      id: parseMenuNumericId(item.menu_id),
      menuId: item.menu_id,
      name: item.name,
      category: item.category,
      calories: item.kcal,
      caloriesText: formatNumberText(item.kcal),
      allergiesText: item.allergens.length > 0 ? item.allergens.join(', ') : '-',
    })),
    categoryOptions: ['전체', ...categories],
  };
};

export const toFoodInfoVM = (food: FoodInfoItem): FoodInfoVM => {
  return {
    id: food.menu_id,
    name: food.name,
    category: food.category,
    createdDateText: formatDateYmd(food.created_at),
    nutritionBasisText: food.nutrition_basis ?? '-',
    servingSizeText: food.serving_size ?? '-',
    nutritionRows: [
      { label: '열량', valueText: `${food.kcal ?? '-'} kcal` },
      { label: '탄수화물', valueText: `${food.carb ?? '-'} g` },
      { label: '단백질', valueText: `${food.prot ?? '-'} g` },
      { label: '지방', valueText: `${food.fat ?? '-'} g` },
      { label: '칼슘', valueText: `${food.calcium ?? '-'} mg` },
      { label: '철', valueText: `${food.iron ?? '-'} mg` },
      { label: '비타민 A', valueText: `${food.vitaminA ?? '-'} μg` },
      { label: '티아민', valueText: `${food.thiamin ?? '-'} mg` },
      { label: '리보플라빈', valueText: `${food.riboflavin ?? '-'} mg` },
      { label: '비타민 C', valueText: `${food.vitaminC ?? '-'} mg` },
    ],
    ingredientsText: food.ingredients_text ?? '-',
    allergens: Array.isArray(food.allergens) ? food.allergens : [],
    recipeText: food.recipe_text ?? '-',
  };
};

export const toFoodInfoVMFromResponse = (raw: FoodInfoDetailResponse): FoodInfoVM => {
  const item: FoodInfoItem = {
    menu_id: raw.data.menu_id,
    name: raw.data.name,
    category: raw.data.category,
    nutrition_basis: raw.data.nutrition_basis,
    serving_size: raw.data.serving_size,
    kcal: raw.data.kcal,
    carb: raw.data.carb,
    prot: raw.data.prot,
    fat: raw.data.fat,
    calcium: raw.data.calcium,
    iron: raw.data.iron,
    vitaminA: raw.data.vitamin_a,
    thiamin: raw.data.thiamin,
    riboflavin: raw.data.riboflavin,
    vitaminC: raw.data.vitamin_c,
    ingredients_text: raw.data.ingredients_text,
    allergens: raw.data.allergens,
    recipe_text: raw.data.recipe_text,
    created_at: raw.data.created_at ?? raw.data.updated_at,
    updated_at: raw.data.updated_at,
  };
  return toFoodInfoVM(item);
};

const normalizeNewFoodItem = (item: NewFoodInfoItem): FoodInfoItem => ({
  menu_id: item.menu_id,
  name: item.name,
  category: item.category,
  nutrition_basis: item.nutrition_basis,
  serving_size: item.serving_size,
  kcal: item.kcal,
  carb: item.carb,
  prot: item.prot,
  fat: item.fat,
  calcium: item.calcium,
  iron: item.iron,
  vitaminA: item.vitaminA ?? item.vitamin_a ?? 0,
  thiamin: item.thiamin,
  riboflavin: item.riboflavin,
  vitaminC: item.vitaminC ?? item.vitamin_c ?? 0,
  ingredients_text: item.ingredients_text,
  allergens: item.allergens,
  recipe_text: item.recipe_text,
  created_at: item.created_at ?? '',
  updated_at: item.updated_at,
});

export const toNewFoodInfoVMFromResponse = (raw: NewFoodDetailResponse): FoodInfoVM => {
  const item = raw.data.items[0];
  return toFoodInfoVM(normalizeNewFoodItem(item));
};
