export type NutritionistProfileResponse = {
  status: string;
  message?: string;
  data: {
    dietitian_id: number;
    username: string;
    name: string;
    phone: string;
    created_at: string;
    updated_at: string;
    school_id: number;
  };
};
