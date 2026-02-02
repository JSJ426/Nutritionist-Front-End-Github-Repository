import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft } from 'lucide-react';

type FoodInfoItem = {
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

interface FoodInfoProps {
  initialParams?: any;
  onNavigate?: (page: string, params?: any) => void;
}

const mockFoods: FoodInfoItem[] = [
  {
    menu_id: 'FOOD-1',
    name: '후라이',
    category: '밥류',
    nutrition_basis: '100ml',
    serving_size: '310ml',
    kcal: 118,
    carb: 25.78,
    prot: 2.1,
    fat: 0.16,
    calcium: 0.42,
    iron: 0.0,
    vitaminA: 0.08,
    thiamin: 0.01,
    riboflavin: 0.0,
    vitaminC: 0.0,
    ingredients_text: '면발(밀) 외 ...',
    allergens: [1],
    recipe_text: '1. ...\n2. ...\n3. ...',
    created_at: '2026-01-28T10:30:00Z',
    updated_at: '2026-01-22T11:32:31.856979',
  },
  {
    menu_id: 'FOOD-2',
    name: '돼지김치찌개',
    category: '찌개 및 전골류',
    nutrition_basis: '100g',
    serving_size: '250g',
    kcal: 142,
    carb: 8.4,
    prot: 7.1,
    fat: 9.2,
    calcium: 0.55,
    iron: 0.12,
    vitaminA: 0.05,
    thiamin: 0.02,
    riboflavin: 0.01,
    vitaminC: 0.0,
    ingredients_text: '돼지고기, 김치, 두부 외 ...',
    allergens: [5, 9],
    recipe_text: '1. ...\n2. ...\n3. ...',
    created_at: '2026-01-23T09:20:00Z',
    updated_at: '2026-01-23T09:20:00Z',
  },
];

export function FoodInfoPage({ initialParams, onNavigate }: FoodInfoProps) {
  const foodId = initialParams?.foodId as string | undefined;
  const food = mockFoods.find((item) => item.menu_id === foodId) || mockFoods[0];
  const allergens: number[] = Array.isArray(food?.allergens) ? food.allergens : [];

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
            메뉴 조회
          </h1>
          <Button
            variant="outline"
            onClick={() => onNavigate?.('food-list')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            목록으로
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-start gap-3 mb-3">
                <h2 className="text-2xl font-medium flex-1">{food.name}</h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  메뉴 카테고리:
                  <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                    {food.category}
                  </Badge>
                </span>
                <span className="text-gray-300">|</span>
                <span>작성일: {formatDate(food.created_at)}</span>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">영양 성분 기준</p>
                  <p className="text-sm font-medium text-gray-800">{food.nutrition_basis ?? '-'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">1회 제공량</p>
                  <p className="text-sm font-medium text-gray-800">{food.serving_size ?? '-'}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">영양 성분</h3>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>열량: {food.kcal ?? '-'} kcal</div>
                  <div>탄수화물: {food.carb ?? '-'} g</div>
                  <div>단백질: {food.prot ?? '-'} g</div>
                  <div>지방: {food.fat ?? '-'} g</div>
                  <div>칼슘: {food.calcium ?? '-'} mg</div>
                  <div>철: {food.iron ?? '-'} mg</div>
                  <div>비타민 A: {food.vitaminA ?? '-'} μg</div>
                  <div>티아민: {food.thiamin ?? '-'} mg</div>
                  <div>리보플라빈: {food.riboflavin ?? '-'} mg</div>
                  <div>비타민 C: {food.vitaminC ?? '-'} mg</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">원재료 정보</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {food.ingredients_text ?? '-'}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">알레르기 정보</h3>
                {allergens.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {allergens.map((num) => (
                      <span
                        key={num}
                        className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs border border-red-100"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">알레르기 정보가 없습니다.</p>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">조리법</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {food.recipe_text ?? '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
