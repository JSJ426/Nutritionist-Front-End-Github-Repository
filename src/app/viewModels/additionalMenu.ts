import { formatDateYmd, formatNumberText } from './shared';

export type AdditionalMenuItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
};

export type AdditionalMenuDraft = {
  title: string;
  category: string;
  description: string;
};

export type AdditionalMenuNutritionDetails = {
  name?: string;
  nutrition_basis?: string;
  serving_size?: string;
  kcal?: number;
  carb?: number;
  prot?: number;
  fat?: number;
  calcium?: number;
  iron?: number;
  vitamin_a?: number;
  thiamin?: number;
  riboflavin?: number;
  vitamin_c?: number;
  ingredients_text?: string;
  allergens?: number[];
  recipe_text?: string;
  createdAt?: string;
};

export type AdditionalMenuRaw = AdditionalMenuItem & AdditionalMenuNutritionDetails;

export type AdditionalMenuListItemVM = {
  id: string;
  title: string;
  category: string;
  dateText: string;
  dateRaw: string;
  calories: number;
  caloriesText: string;
  allergensText: string;
};

export type AdditionalMenuListVM = {
  items: AdditionalMenuListItemVM[];
  categoryOptions: string[];
  sortOptions: Array<{ value: string; label: string }>;
};

export type AdditionalMenuReadVM = {
  id: string;
  titleText: string;
  categoryText: string;
  dateText: string;
  nutritionBasisText: string;
  servingSizeText: string;
  nutritionRows: Array<{ label: string; valueText: string }>;
  ingredientsText: string;
  allergens: number[];
  recipeText: string;
};

export type AdditionalMenuFormState = {
  name: string;
  category: string;
  nutritionBasis: string;
  servingSize: string;
  kcal: string;
  carb: string;
  prot: string;
  fat: string;
  calcium: string;
  iron: string;
  vitaminA: string;
  thiamin: string;
  riboflavin: string;
  vitaminC: string;
  ingredientsText: string;
  allergensText: string;
  recipeText: string;
};

export type AdditionalMenuEditVM = {
  id: string;
  form: AdditionalMenuFormState;
  createdAtText?: string;
};

export type AdditionalMenuApiItem = {
  menu_id: string;
  new_menu_id?: string;
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
  vitamin_a?: number;
  vitaminA?: number;
  thiamin: number;
  riboflavin: number;
  vitamin_c?: number;
  vitaminC?: number;
  ingredients_text: string;
  allergens: number[];
  recipe_text: string;
  created_at?: string;
  updated_at?: string;
};

export type AdditionalMenuListResponse = {
  status: string;
  message: string;
  data: {
    current_page?: number;
    page_size?: number;
    total_pages?: number;
    total_items?: number;
    items?: AdditionalMenuApiItem[];
    content?: AdditionalMenuApiItem[];
    totalPages?: number;
    totalElements?: number;
    number?: number;
    size?: number;
  };
};

export type AdditionalMenuDetailResponse = {
  status: string;
  message: string;
  data: {
    menu_id?: string;
    new_menu_id?: string;
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
    vitamin_a?: number;
    vitaminA?: number;
    thiamin: number;
    riboflavin: number;
    vitamin_c?: number;
    vitaminC?: number;
    ingredients_text: string;
    allergens: number[];
    recipe_text: string;
    created_at?: string;
    updated_at?: string;
  };
};

export type AdditionalMenuCreateResponse = {
  status: string;
  message: string;
  data: AdditionalMenuApiItem & {
    new_menu_id: string;
  };
};

export type AdditionalMenuUpdateResponse = {
  status: string;
  message: string;
  data: AdditionalMenuApiItem & {
    new_menu_id: string;
  };
};

export type AdditionalMenuDeleteResponse = {
  status: string;
  message: string;
  data: {
    new_food_id: string;
    deleted: boolean;
    delete_type: string;
    deleted_at: string;
  };
};

const stripMl = (value: string) => value.replace(/\s*ml\s*$/i, '').trim();

const appendMl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /ml$/i.test(trimmed) ? trimmed : `${trimmed}ml`;
};

export const additionalMenuCategoryOptions = [
  '전체',
  '밥류',
  '국 및 탕류',
  '스프류',
  '전·적 및 부침류',
  '나물·숙채류',
  '디저트류',
  '볶음류',
  '구이류',
  '생채·무침류',
  '튀김류',
  '조림류',
  '찜류',
  '면류',
  '찌개 및 전골류',
  '죽류',
  '장아찌·절임류',
  '김치류',
  '음료류',
  '만두류',
];

export const additionalMenuSortOptions = [
  { value: 'date-asc', label: '등록일 (오름차순)' },
  { value: 'date-desc', label: '등록일 (내림차순)' },
  { value: 'title-asc', label: '메뉴명 (오름차순)' },
  { value: 'title-desc', label: '메뉴명 (내림차순)' },
  { value: 'calories-asc', label: '열량 (오름차순)' },
  { value: 'calories-desc', label: '열량 (내림차순)' },
];

export const toAdditionalMenuListVM = (items: AdditionalMenuRaw[]): AdditionalMenuListVM => {
  return {
    items: items.map((menu) => {
      const calories = (menu as AdditionalMenuNutritionDetails)?.kcal ?? (menu as any)?.calories ?? 0;
      const dateRaw = (menu as AdditionalMenuNutritionDetails)?.createdAt ?? menu.date;
      const allergensRaw =
        (menu as AdditionalMenuNutritionDetails)?.allergens ?? (menu as any)?.allergies ?? [];
      return {
        id: menu.id,
        title: menu.title,
        category: menu.category,
        dateText: formatDateYmd(dateRaw),
        dateRaw,
        calories,
        caloriesText: formatNumberText(calories),
        allergensText: Array.isArray(allergensRaw) && allergensRaw.length > 0
          ? allergensRaw.join(', ')
          : '-',
      };
    }),
    categoryOptions: additionalMenuCategoryOptions,
    sortOptions: additionalMenuSortOptions,
  };
};

export const toAdditionalMenuReadVM = (menu: AdditionalMenuRaw): AdditionalMenuReadVM => {
  const details = menu as AdditionalMenuNutritionDetails;
  return {
    id: menu.id,
    titleText: details.name ?? menu.title,
    categoryText: menu.category,
    dateText: formatDateYmd(details.createdAt ?? menu.date),
    nutritionBasisText: details.nutrition_basis ? appendMl(details.nutrition_basis) : '-',
    servingSizeText: details.serving_size ? appendMl(details.serving_size) : '-',
    nutritionRows: [
      { label: '열량', valueText: `${details.kcal ?? '-'} kcal` },
      { label: '탄수화물', valueText: `${details.carb ?? '-'} g` },
      { label: '단백질', valueText: `${details.prot ?? '-'} g` },
      { label: '지방', valueText: `${details.fat ?? '-'} g` },
      { label: '칼슘', valueText: `${details.calcium ?? '-'} mg` },
      { label: '철', valueText: `${details.iron ?? '-'} mg` },
      { label: '비타민 A', valueText: `${details.vitamin_a ?? '-'} μg` },
      { label: '티아민', valueText: `${details.thiamin ?? '-'} mg` },
      { label: '리보플라빈', valueText: `${details.riboflavin ?? '-'} mg` },
      { label: '비타민 C', valueText: `${details.vitamin_c ?? '-'} mg` },
    ],
    ingredientsText: details.ingredients_text ?? '-',
    allergens: Array.isArray(details.allergens) ? details.allergens : [],
    recipeText: details.recipe_text ?? menu.description ?? '-',
  };
};

export const getAdditionalMenuCreateForm = (): AdditionalMenuFormState => ({
  name: '',
  category: '밥류',
  nutritionBasis: '100',
  servingSize: '',
  kcal: '',
  carb: '',
  prot: '',
  fat: '',
  calcium: '',
  iron: '',
  vitaminA: '',
  thiamin: '',
  riboflavin: '',
  vitaminC: '',
  ingredientsText: '',
  allergensText: '',
  recipeText: '',
});

export const toAdditionalMenuEditVM = (menu: AdditionalMenuRaw): AdditionalMenuEditVM => {
  const details = menu as AdditionalMenuNutritionDetails;
  return {
    id: menu.id,
    createdAtText: menu.date ? formatDateYmd(menu.date) : '',
    form: {
      name: details.name ?? menu.title ?? '',
      category: menu.category ?? '밥류',
      nutritionBasis: stripMl(details.nutrition_basis ?? '100'),
      servingSize: stripMl(details.serving_size ?? ''),
      kcal: details.kcal?.toString?.() ?? '',
      carb: details.carb?.toString?.() ?? '',
      prot: details.prot?.toString?.() ?? '',
      fat: details.fat?.toString?.() ?? '',
      calcium: details.calcium?.toString?.() ?? '',
      iron: details.iron?.toString?.() ?? '',
      vitaminA: details.vitamin_a?.toString?.() ?? '',
      thiamin: details.thiamin?.toString?.() ?? '',
      riboflavin: details.riboflavin?.toString?.() ?? '',
      vitaminC: details.vitamin_c?.toString?.() ?? '',
      ingredientsText: details.ingredients_text ?? '',
      allergensText: Array.isArray(details.allergens) ? details.allergens.join(', ') : '',
      recipeText: details.recipe_text ?? menu.description ?? '',
    },
  };
};

const toAdditionalMenuRaw = (item: AdditionalMenuApiItem): AdditionalMenuRaw => ({
  id: item.menu_id || item.new_menu_id || '',
  title: item.name,
  category: item.category,
  description: item.recipe_text,
  date: item.created_at ?? item.updated_at ?? '',
  name: item.name,
  nutrition_basis: item.nutrition_basis,
  serving_size: item.serving_size,
  kcal: item.kcal,
  carb: item.carb,
  prot: item.prot,
  fat: item.fat,
  calcium: item.calcium,
  iron: item.iron,
  vitamin_a: item.vitamin_a ?? item.vitaminA,
  thiamin: item.thiamin,
  riboflavin: item.riboflavin,
  vitamin_c: item.vitamin_c ?? item.vitaminC,
  ingredients_text: item.ingredients_text,
  allergens: item.allergens,
  recipe_text: item.recipe_text,
  createdAt: item.created_at ?? item.updated_at,
});

const findAdditionalMenuItem = (
  raw: AdditionalMenuListResponse | AdditionalMenuDetailResponse,
  menuId?: string,
): AdditionalMenuApiItem | undefined => {
  const data = raw.data as AdditionalMenuDetailResponse['data'] & {
    items?: AdditionalMenuApiItem[];
    content?: AdditionalMenuApiItem[];
  };
  if (data.items || data.content) {
    const items = data.items ?? data.content ?? [];
    if (!menuId) return items[0];
    return items.find((item) => item.menu_id === menuId || item.new_menu_id === menuId) ?? items[0];
  }
  if (data?.name) {
    return {
      menu_id: data.menu_id ?? data.new_menu_id ?? '',
      new_menu_id: data.new_menu_id,
      name: data.name,
      category: data.category,
      nutrition_basis: data.nutrition_basis,
      serving_size: data.serving_size,
      kcal: data.kcal,
      carb: data.carb,
      prot: data.prot,
      fat: data.fat,
      calcium: data.calcium,
      iron: data.iron,
      vitamin_a: data.vitamin_a ?? data.vitaminA,
      thiamin: data.thiamin,
      riboflavin: data.riboflavin,
      vitamin_c: data.vitamin_c ?? data.vitaminC,
      ingredients_text: data.ingredients_text,
      allergens: data.allergens,
      recipe_text: data.recipe_text,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }
  return undefined;
};

export const toAdditionalMenuListVMFromResponse = (raw: AdditionalMenuListResponse) =>
  toAdditionalMenuListVM(
    (raw.data.items ?? raw.data.content ?? [])
      .map(toAdditionalMenuRaw)
      .filter((item) => item.id)
  );

export const toAdditionalMenuReadVMFromResponse = (
  raw: AdditionalMenuDetailResponse,
  menuId?: string,
): AdditionalMenuReadVM | null => {
  const item = findAdditionalMenuItem(raw, menuId);
  if (!item) return null;
  return toAdditionalMenuReadVM(toAdditionalMenuRaw(item));
};

export const toAdditionalMenuEditVMFromResponse = (
  raw: AdditionalMenuDetailResponse,
  menuId?: string,
): AdditionalMenuEditVM | null => {
  const item = findAdditionalMenuItem(raw, menuId);
  if (!item) return null;
  return toAdditionalMenuEditVM(toAdditionalMenuRaw(item));
};

export const parseAllergensText = (value: string): number[] => {
  if (!value.trim()) return [];
  return value
    .split(',')
    .map((n) => Number(n.trim()))
    .filter((n) => !Number.isNaN(n));
};

export const toAdditionalMenuRequestBody = (form: AdditionalMenuFormState) => {
  return {
    name: form.name.trim(),
    category: form.category,
    nutrition_basis: appendMl(form.nutritionBasis),
    serving_size: appendMl(form.servingSize),
    kcal: Number(form.kcal),
    carb: Number(form.carb),
    prot: Number(form.prot),
    fat: Number(form.fat),
    calcium: Number(form.calcium),
    iron: Number(form.iron),
    vitamin_a: Number(form.vitaminA),
    thiamin: Number(form.thiamin),
    riboflavin: Number(form.riboflavin),
    vitamin_c: Number(form.vitaminC),
    ingredients_text: form.ingredientsText.trim(),
    allergens: parseAllergensText(form.allergensText),
    recipe_text: form.recipeText.trim(),
  };
};

export const toAdditionalMenuDraft = (form: AdditionalMenuFormState): AdditionalMenuDraft => ({
  title: form.name.trim(),
  category: form.category,
  description: form.recipeText.trim(),
});
