export type DailyRecord = {
  lunchMissed: number;
  lunchLeftoversKg: number;
  dinnerMissed: number;
  dinnerLeftoversKg: number;
};

export type OperationRecordFormValues = {
  lunchMissed: string;
  lunchLeftoversKg: string;
  dinnerMissed: string;
  dinnerLeftoversKg: string;
};

export type MealAvailability = {
  lunch: boolean;
  dinner: boolean;
};

export const emptyMealAvailability: MealAvailability = {
  lunch: false,
  dinner: false,
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatMonthLabel = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}.${month}`;
};

export const toNumberOrZero = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};
