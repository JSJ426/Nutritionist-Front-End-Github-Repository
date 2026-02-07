import { http } from './http';
//import { mockGetFoodInfoDetailResponse } from './mocks/food/detail';
//import { mockGetFoodInfoResponse } from './mocks/food/list';
import type { FoodInfoDetailResponse, FoodListResponse } from '../viewModels/food';

// GetFoodInfo 대응
export const getFoodListResponse = async (
  page = 1,
  size = 20,
  category?: string,
  sort?: string,
  order?: string
): Promise<FoodListResponse> => {
  const params = new URLSearchParams();
  if (typeof page === 'number') {
    params.set('page', String(page));
  }
  if (typeof size === 'number') {
    params.set('size', String(size));
  }
  if (category) {
    params.set('category', category);
  }
  if (sort) {
    params.set('sort', sort);
  }
  if (order) {
    params.set('order', order);
  }
  return http.get<FoodListResponse>(`/foodinfo?${params.toString()}`);
};

// GetFoodInfoDetail 대응
export const getFoodDetailResponse = async (
  menuId?: string
): Promise<FoodInfoDetailResponse> => {
  return http.get<FoodInfoDetailResponse>(`/foodinfo/${menuId}`);
};
