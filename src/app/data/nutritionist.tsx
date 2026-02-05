import { mockDietitianProfileResponse } from './mocks/nutritionist/profile';
import type { NutritionistProfileResponse } from '../viewModels/nutritionist';

// 영양사 정보 가져오기
export const getNutritionistProfile = async (): Promise<NutritionistProfileResponse> =>
  mockDietitianProfileResponse;
