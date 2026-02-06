export type NutritionistProfileSchool = {
  school_name: string;
  region_code: string;
  school_code: string;
  address: string;
  school_id: number;
  dietitian_id: number;
  school_type: string;
  phone: string | null;
  email: string | null;
  student_count: number | null;
  target_unit_price: number | null;
  max_unit_price: number | null;
  operation_rules: string | null;
  cook_workers: number | null;
  kitchen_equipment: string | null;
  created_at: string;
  updated_at: string;
};

export type NutritionistProfileResponse = {
  username: string;
  name: string;
  phone: string | null;
  email?: string | null;
  dietitian_id: number;
  created_at: string;
  updated_at: string;
  school: NutritionistProfileSchool | null;
};

export type NutritionistUpdateRequest = {
  name: string;
  phone: string;
  email: string;
};

export type NutritionistPasswordChangeRequest = {
  current_password: string;
  new_password: string;
};
