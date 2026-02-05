import { http } from './http';
import { mockAdditionalMenuCreateResponse } from './mocks/additionalMenu/create';
import { mockAdditionalMenuDeleteResponse } from './mocks/additionalMenu/delete';
import { mockAdditionalMenuDetailResponses } from './mocks/additionalMenu/detail';
import { mockAdditionalMenuListResponse } from './mocks/additionalMenu/list';
import { mockAdditionalMenuUpdateResponse } from './mocks/additionalMenu/update';
import type {
  AdditionalMenuCreateResponse,
  AdditionalMenuDeleteResponse,
  AdditionalMenuDetailResponse,
  AdditionalMenuListResponse,
  AdditionalMenuUpdateResponse,
} from '../viewModels/additionalMenu';

// GetNewFoodInfo 대응
export const getAdditionalMenuListResponse = async (
  page = 1,
  size = 20
): Promise<AdditionalMenuListResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  return http.get<AdditionalMenuListResponse>(`/newfoodinfo?${params.toString()}`);
};

// GetNewFoodInfoDetail 대응
export const getAdditionalMenuDetailResponse = async (
  menuId?: string
): Promise<AdditionalMenuDetailResponse> => {
  if (!menuId) {
    return mockAdditionalMenuDetailResponses;
  }
  return http.get<AdditionalMenuDetailResponse>(`/newfoodinfo/${menuId}`);
};

// PostNewFood 대응
export type AdditionalMenuCreatePayload = {
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
};

export const createAdditionalMenu = async (
  payload: AdditionalMenuCreatePayload
): Promise<AdditionalMenuCreateResponse> =>
  http.post<AdditionalMenuCreateResponse>('/newfoodinfo', payload);

// PatchNewFood 대응
export const updateAdditionalMenu = async (
  menuId: string,
  payload: AdditionalMenuCreatePayload
): Promise<AdditionalMenuUpdateResponse> =>
  http.patch<AdditionalMenuUpdateResponse>(`/newfoodinfo/${menuId}`, payload);

// DeleteNewFood 대응
export const deleteAdditionalMenu = async (
  menuId: string
): Promise<AdditionalMenuDeleteResponse> =>
  http.delete<AdditionalMenuDeleteResponse>(`/newfoodinfo/${menuId}`);
