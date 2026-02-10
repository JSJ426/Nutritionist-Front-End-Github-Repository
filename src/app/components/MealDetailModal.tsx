import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { allergyInfo } from '../utils/allergy';

// 상세 정보 생성 함수
const generateMealDetails = (menu: Array<{ name: string; allergy: number[] }>) => {
  const totalCalories = 600 + Math.floor(Math.random() * 300);
  return {
    totalCalories,
    nutrition: {
      carbs: Math.floor(totalCalories * 0.55 / 4),
      protein: Math.floor(totalCalories * 0.2 / 4),
      fat: Math.floor(totalCalories * 0.25 / 9),
      sodium: 800 + Math.floor(Math.random() * 600),
    },
    ingredients: menu.map(item => ({
      name: item.name,
      allergy: item.allergy,
      components: generateIngredients(item.name),
    })),
  };
};

const generateIngredients = (foodName: string): string[] => {
  const ingredientMap: { [key: string]: string[] } = {
    '흰쌀밥': ['쌀(국내산)', '물'],
    '현미밥': ['현미(국내산)', '찹쌀', '물'],
    '잡곡밥': ['쌀(국내산)', '보리', '검은콩', '수수', '물'],
    '육개장': ['쇠고기(호주산)', '고사리', '대파', '고춧가루', '간장', '마늘'],
    '김치찌개': ['돼지고기(국내산)', '김치', '두부', '대파', '고춧가루', '된장'],
    '된장찌개': ['두부', '애호박', '감자', '양파', '된장', '멸치다시다'],
    '순두부찌개': ['순두부', '돼지고기', '애호박', '양파', '고춧가루', '새우젓'],
    '미역국': ['미역', '참기름', '다진마늘', '국간장', '참치액'],
    '콘나물국': ['콩나물', '대파', '마늘', '멸치다시다', '국간장'],
    '불고기': ['쇠고기(호주산)', '양파', '대파', '간장', '설탕', '참기름', '마늘'],
    '제육볶음': ['돼지고기(국내산)', '양파', '대파', '고춧가루', '고추장', '간장', '마늘'],
    '돈까스': ['돼지고기(국내산)', '밀가루', '빵가루', '계란', '식용유'],
    '함박스테이크': ['돼지고기', '쇠고기', '양파', '빵가루', '계란', '소스'],
    '닭강정': ['닭고기(국내산)', '전분', '간장', '설탕', '고추', '마늘'],
    '닭갈비': ['닭고기(국내산)', '양파', '양배추', '고추장', '고춧가루', '간장'],
    '닭볶음탕': ['닭고기(국내산)', '감자', '당근', '양파', '고추장', '간장'],
    '고등어구이': ['고등어(국내산)', '소금'],
    '고등어조림': ['고등어(국내산)', '무', '양파', '고춧가루', '간장', '마늘'],
    '삼치구이': ['삼치(국내산)', '소금', '레몬'],
    '갈치구이': ['갈치(국내산)', '소금'],
    '가자미구이': ['가자미(국내산)', '소금', '후추'],
    '생선구이': ['생선(국내산)', '소금'],
    '배추김치': ['배추', '고춧가루', '마늘', '생강', '액젓', '파'],
    '깍두기': ['무', '고춧가루', '마늘', '액젓', '파'],
    '시금치나물': ['시금치', '참기름', '마늘', '간장', '깨소금'],
    '콘나물무침': ['콩나물', '참기름', '마늘', '파', '간장'],
    '상추쌈': ['상추', '쌈장'],
    '계란말이': ['계란', '당근', '대파', '소금', '식용유'],
    '과일': ['계절과일'],
    '요구르트': ['우유', '유산균', '설탕'],
    '우유': ['우유'],
    '단무지': ['무', '설탕', '식초', '치자'],
    '카레라이스': ['쌀', '카레가루', '감자', '당근', '양파', '돼지고기'],
    '비빔밥': ['쌀', '소고기', '시금치', '콩나물', '당근', '고사리', '계란', '고추장'],
    '치킨너겟': ['닭고기(수입산)', '밀가루', '전분', '식용유'],
    '치킨까스': ['닭고기(국내산)', '밀가루', '빵가루', '계란', '식용유'],
    '치킨가스': ['닭고기(국내산)', '밀가루', '빵가루', '계란', '식용유'],
  };

  return ingredientMap[foodName] || [`${foodName} 원재료`, '조미료', '식용유'];
};

interface MealDetailModalProps {
  day: string;
  week: string;
  mealType: 'lunch' | 'dinner';
  mealData: { menu: Array<{ name: string; allergy: number[] }> };
  detail?: {
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
    menuItems?: Record<
      string,
      {
        id: string;
        name: string;
        display?: string;
        allergens: number[];
        recipe?: string;
        ingredients?: string;
      } | null
    >;
    imageUrl?: string | null;
    isReviewed?: boolean;
  };
  onClose: () => void;
}

export function MealDetailModal({ day, week, mealType, mealData, detail, onClose }: MealDetailModalProps) {
  const details = generateMealDetails(mealData.menu);
  const totalCalories = detail?.nutrition.kcal ?? details.totalCalories;
  const carbValue = detail?.nutrition.carb ?? details.nutrition.carbs;
  const protValue = detail?.nutrition.prot ?? details.nutrition.protein;
  const fatValue = detail?.nutrition.fat ?? details.nutrition.fat;
  const fallbackAllergies = detail?.menuItems
    ? Array.from(
        new Set(
          Object.values(detail.menuItems)
            .filter((item): item is NonNullable<typeof item> => Boolean(item))
            .flatMap((item) => item.allergens ?? [])
        )
      ).sort((a, b) => a - b)
    : Array.from(new Set(mealData.menu.flatMap((item) => item.allergy))).sort((a, b) => a - b);
  const allAllergies = detail?.allergenSummary.uniqueAllergens
    ? detail.allergenSummary.uniqueAllergens
    : fallbackAllergies;
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const recipeByMenu = detail?.recipeByMenu ?? {};
  const formattedCost = detail?.cost != null ? detail.cost.toLocaleString('ko-KR') : '-';
  const menuOrder = ['rice', 'soup', 'main1', 'main2', 'side', 'kimchi', 'dessert'];
  const detailMenuItems = detail?.menuItems
    ? menuOrder
        .map((key) => detail.menuItems?.[key])
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
    : [];
  const ingredientsList =
    detailMenuItems.length > 0
      ? detailMenuItems.map((item) => ({
          name: item.name,
          allergy: item.allergens ?? [],
          components: item.ingredients ?? '',
          recipe: item.recipe ?? '',
        }))
      : details.ingredients.map((item) => ({
          name: item.name,
          allergy: item.allergy,
          components: item.components,
          recipe: recipeByMenu[item.name] ?? '',
        }));

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-medium text-gray-800 mb-2">식단 상세 정보</h2>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>{week} · {day}요일</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${mealType === 'lunch' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                  {mealType === 'lunch' ? '중식' : '석식'}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center flex-shrink-0">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 칼로리 및 영양 정보 */}
          <div className="bg-gradient-to-r from-[#5dccb4]/10 to-[#5dccb4]/5 rounded-lg p-5 border border-[#5dccb4]/20">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#5dccb4] rounded-full"></div>
              칼로리 및 영양 성분
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">총 열량</p>
              <p className="text-2xl font-medium text-[#5dccb4]">{totalCalories} <span className="text-sm text-gray-600">kcal</span></p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">탄수화물</p>
              <p className="text-2xl font-medium text-gray-800">{carbValue} <span className="text-sm text-gray-600">g</span></p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">단백질</p>
              <p className="text-2xl font-medium text-gray-800">{protValue} <span className="text-sm text-gray-600">g</span></p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">지방</p>
              <p className="text-2xl font-medium text-gray-800">{fatValue} <span className="text-sm text-gray-600">g</span></p>
            </div>
          </div>
        </div>

        {/* 단가 */}
        <div className="mt-3 bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
            단가
          </h3>
          <p className="text-lg font-medium text-gray-800">
            {formattedCost} <span className="text-sm text-gray-600">원</span>
          </p>
        </div>

        {/* 알레르기 정보 */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-red-500 rounded-full"></div>
            알레르기 유발 식품 정보
          </h3>
          {allAllergies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {allAllergies.map((allergyNum) => (
                <div key={allergyNum} className="inline-flex items-center gap-2 px-3 py-2 bg-[#FCE8E6] text-red-700 rounded-lg border border-red-200">
                  <span className="font-medium text-sm">{allergyNum}</span>
                  <span className="text-xs">{allergyInfo[allergyNum]?.label || '알 수 없음'}</span>
                </div>
              ))}
            </div>
          ) : (<p className="text-sm text-gray-500">알레르기 유발 식품이 없습니다.</p>)}
        </div>

        {/* 메뉴 상세 정보 */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-green-500 rounded-full"></div>
            메뉴 상세 정보
          </h3>
          <div className="space-y-2">
            {ingredientsList.map((ingredient) => {
              const isOpen = openMenu === ingredient.name;
              return (
                <div key={ingredient.name} className="border border-gray-200 rounded-lg bg-gray-50">
                  <button
                    onClick={() => setOpenMenu(isOpen ? null : ingredient.name)}
                    className="w-full flex items-start justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <div className="text-left">
                      <div className="font-medium text-gray-800">{ingredient.name}</div>
                      {ingredient.allergy.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {ingredient.allergy.map((allergyNum) => (
                            <span key={allergyNum} className="inline-block px-2 py-0.5 bg-[#FCE8E6] text-red-700 text-xs rounded font-medium">
                              {allergyNum}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 mt-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-sm text-gray-700 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">식자재 성분</p>
                        <p className="text-sm text-gray-700">
                          {Array.isArray(ingredient.components)
                            ? ingredient.components.join(', ')
                            : ingredient.components || '등록된 식자재 정보가 없습니다.'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">레시피</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {ingredient.recipe ? ingredient.recipe : '등록된 레시피가 없습니다.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* {detail?.aiComment && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-blue-700 mb-1">AI 코멘트</p>
            <p className="text-sm text-blue-800 whitespace-pre-wrap">{detail.aiComment}</p>
          </div>
        )} */}

          {/* 알레르기 정보 안내 */}
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>알레르기 표시 번호:</strong> 1.난류(가금류) 2.우류 3.메밀 4.땅콩 5.대두 6.밀 7.고등어 8.게 9.새우 10.돼지고기 11.복숭아 12.토마토 13.아황산류 14.호두 15.닭고기 16.쇠고기 17.오징어 18.조개류(굴,전복,홍합포함) 19.잣
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
