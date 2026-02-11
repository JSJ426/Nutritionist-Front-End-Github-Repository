import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

import { getFoodDetailResponse } from '../data/food';

import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

import { toFoodInfoVMFromResponse } from '../viewModels/food';
import type { FoodInfoVM } from '../viewModels/food';

interface FoodInfoProps {
  initialParams?: any;
  onNavigate?: (page: string, params?: any) => void;
}

const parseMenuId = (value: unknown): string | undefined => {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return String(value);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length > 0) return trimmed;
  }
  return undefined;
};

export function FoodInfoPage({ initialParams, onNavigate }: FoodInfoProps) {
  const menuId = parseMenuId(initialParams?.foodId);
  const [food, setFood] = useState<FoodInfoVM | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      if (!menuId) {
        if (!isActive) return;
        setFood(null);
        setErrorMessage('잘못된 메뉴 접근입니다.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);
      try {
        const rawResponse = await getFoodDetailResponse(menuId);
        if (!isActive) return;
        setFood(toFoodInfoVMFromResponse(rawResponse));
      } catch (error) {
        if (!isActive) return;
        console.error('Failed to load food detail:', error);
        setFood(null);
        setErrorMessage('메뉴 정보를 불러오지 못했습니다.');
      } finally {
        if (!isActive) return;
        setIsLoading(false);
      }
    };
    load();
    return () => {
      isActive = false;
    };
  }, [menuId]);

  const allergens: number[] = Array.isArray(food?.allergens) ? food.allergens : [];

  if (isLoading) {
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
        <div className="flex-1 flex items-center justify-center text-gray-500">
          데이터를 불러오는 중입니다.
        </div>
      </div>
    );
  }

  if (errorMessage || !food) {
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
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-500">
          <div>{errorMessage ?? '메뉴 정보를 찾을 수 없습니다.'}</div>
          <Button
            variant="outline"
            onClick={() => onNavigate?.('food-list')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            목록으로 이동
          </Button>
        </div>
      </div>
    );
  }

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

      <div className="flex-1 overflow-y-auto px-6 py-6 text-lg">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-start gap-3 mb-3">
                <h2 className="text-3xl font-medium flex-1">{food.name}</h2>
              </div>
              <div className="flex items-center gap-4 text-base text-gray-600">
                <span className="flex items-center gap-2">
                  메뉴 카테고리:
                  <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                    {food.category}
                  </Badge>
                </span>
                <span className="text-gray-300">|</span>
                <span>작성일: {food.createdDateText}</span>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-base text-gray-500 mb-1">영양 성분 기준</p>
                  <p className="text-base font-medium text-gray-800">{food.nutritionBasisText}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-base text-gray-500 mb-1">1회 제공량</p>
                  <p className="text-base font-medium text-gray-800">{food.servingSizeText}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">영양 성분</h3>
                <div className="grid grid-cols-2 gap-3 text-base text-gray-700">
                  {food.nutritionRows.map((row) => (
                    <div key={row.label}>{row.label}: {row.valueText}</div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">원재료 정보</h3>
                <p className="text-base text-gray-700 whitespace-pre-wrap">
                  {food.ingredientsText}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">알레르기 정보</h3>
                {allergens.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {allergens.map((num) => (
                      <span
                        key={num}
                        className="px-2 py-1 rounded bg-red-50 text-red-700 text-base border border-red-100"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-base text-gray-500">알레르기 정보가 없습니다.</p>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">조리법</h3>
                <p className="text-base text-gray-700 whitespace-pre-wrap">
                  {food.recipeText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
