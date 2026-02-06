import type {
  NutritionistPasswordChangeRequest,
  NutritionistProfileResponse,
  NutritionistUpdateRequest,
} from '../viewModels/nutritionist';
import { http } from './http';

// 영양사 정보 가져오기
export const getNutritionistProfile = async (): Promise<NutritionistProfileResponse> =>
  http.get<NutritionistProfileResponse>('/api/dietitian/me');

// 영양사 정보 수정
export const patchNutritionistMe = async (
  payload: NutritionistUpdateRequest
): Promise<NutritionistProfileResponse> => http.patch<NutritionistProfileResponse>('/api/dietitian/me', payload);

// 영양사 비밀번호 변경
export const putNutritionistPassword = async (
  payload: NutritionistPasswordChangeRequest
): Promise<void> => {
  await http.put<void>('/api/dietitian/me/password', payload);
};
