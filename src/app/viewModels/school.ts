export type SchoolResponse = {
  status: string;
  message?: string;
  school_id: number;
  data: {
    dietitian_id: number;
    school_name: string;
    school_type: string;
    phone: string;
    email: string;
    student_count: number;
    target_unit_price: number;
    max_unit_price: number;
    operation_rules?: string;
    cook_workers: number;
    kitchen_equipment?: string;
    created_at: string;
    updated_at: string;
  };
};

export type SchoolSearchApiItem = {
  schoolId: number | null;
  schoolCode: string;
  regionCode: string;
  schoolName: string;
  address: string;
  schoolType: string | null;
  dietitianName: string | null;
  message: string | null;
  registered: boolean;
};

export type SchoolSearchItem = {
  school_name: string;
  region_code: string;
  school_code: string;
  address: string;
  school_id: number | null;
  dietitian_id: number | null;
  school_type: string | null;
  phone: string | null;
  email: string | null;
  student_count: number | null;
  target_unit_price: number | null;
  max_unit_price: number | null;
  operation_rules: string | null;
  cook_workers: number | null;
  kitchen_equipment: string | null;
  created_at: string | null;
  updated_at: string | null;
  dietitian_name?: string | null;
  message?: string | null;
  registered?: boolean;
};
