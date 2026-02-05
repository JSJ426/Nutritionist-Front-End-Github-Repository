//import { mockSchoolResponse } from './mocks/school/school';
import type { SchoolResponse, SchoolSearchApiItem, SchoolSearchItem } from '../viewModels/school';
import { http } from './http';

// 학교 기본 정보 조회
export const getSchoolResponse = async (): Promise<SchoolResponse> =>
  http.get<SchoolResponse>('/api/schools/my');

// 학교 정보 가져오기
const mapSchoolSearchItem = (item: SchoolSearchApiItem): SchoolSearchItem => ({
  school_name: item.schoolName ?? '',
  region_code: item.regionCode ?? '',
  school_code: item.schoolCode ?? '',
  address: item.address ?? '',
  school_id: item.schoolId ?? null,
  dietitian_id: null,
  school_type: item.schoolType ?? null,
  phone: null,
  email: null,
  student_count: null,
  target_unit_price: null,
  max_unit_price: null,
  operation_rules: null,
  cook_workers: null,
  kitchen_equipment: null,
  created_at: null,
  updated_at: null,
  dietitian_name: item.dietitianName ?? null,
  message: item.message ?? null,
  registered: item.registered,
});

export const searchSchools = async (keyword: string): Promise<SchoolSearchItem[]> => {
  const response = await http.get<SchoolSearchApiItem[]>(
    `/api/schools/search?keyword=${encodeURIComponent(keyword)}`
  );
  return response.map(mapSchoolSearchItem);
};
