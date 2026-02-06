//import { mockSchoolResponse } from './mocks/school/school';
import type {
  SchoolResponse,
  SchoolSearchApiItem,
  SchoolSearchItem,
  SchoolUpsertRequest,
  SchoolUpsertResponse,
} from '../viewModels/school';
import { http } from './http';

type SchoolResponseOrData = SchoolResponse | SchoolResponse['data'];

const normalizeSchoolResponse = (response: SchoolResponseOrData): SchoolResponse => {
  if ('data' in response) {
    return response;
  }
  return {
    status: 'success',
    message: undefined,
    school_id: response.school_id,
    data: response,
  };
};

// 학교 기본 정보 조회
export const getSchoolResponse = async (): Promise<SchoolResponse> => {
  const response = await http.get<SchoolResponseOrData>('/api/schools/my');
  return normalizeSchoolResponse(response);
};

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

// 학교 정보 등록/수정
export const patchSchoolMe = async (payload: SchoolUpsertRequest): Promise<SchoolUpsertResponse> =>
  http.patch<SchoolUpsertResponse>('/api/schools/my', payload);
