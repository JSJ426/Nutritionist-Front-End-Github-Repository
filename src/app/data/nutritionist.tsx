import type { NutritionistProfileResponse, NutritionistUpdateRequest } from '../viewModels/nutritionist';
import { http } from './http';

// 영양사 정보 가져오기
export const getNutritionistProfile = async (): Promise<NutritionistProfileResponse> =>
  http.get<NutritionistProfileResponse>('/api/dietitian/me');

// 영양사 정보 수정
export const patchNutritionistMe = async (
  payload: NutritionistUpdateRequest
): Promise<NutritionistProfileResponse> => http.patch<NutritionistProfileResponse>('/api/dietitian/me', payload);
