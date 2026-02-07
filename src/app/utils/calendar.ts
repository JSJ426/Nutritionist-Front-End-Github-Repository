export const WEEKDAY_LABELS_MON_FRI = ['월', '화', '수', '목', '금'] as const;
export const WEEKDAY_INDICES_MON_FRI = [0, 1, 2, 3, 4] as const;

type WeekStartOption = {
  weekStartsOnMonday?: boolean;
};

const toWeekdayIndex = (date: Date, weekStartsOnMonday: boolean) => {
  const day = date.getDay();
  return weekStartsOnMonday ? (day + 6) % 7 : day;
};

const getWeekStartDate = (date: Date, weekStartsOnMonday: boolean) => {
  const weekdayIndex = toWeekdayIndex(date, weekStartsOnMonday);
  const start = new Date(date);
  start.setDate(date.getDate() - weekdayIndex);
  start.setHours(0, 0, 0, 0);
  return start;
};

export const getWeekCountInMonth = (
  year: number,
  monthIndex: number,
  { weekStartsOnMonday = true }: WeekStartOption = {}
) => {
  const monthStart = new Date(year, monthIndex, 1);
  const monthEnd = new Date(year, monthIndex + 1, 0);
  const firstWeekStart = getWeekStartDate(monthStart, weekStartsOnMonday);
  const lastWeekStart = getWeekStartDate(monthEnd, weekStartsOnMonday);
  const diffWeeks =
    Math.floor((lastWeekStart.getTime() - firstWeekStart.getTime()) / (1000 * 60 * 60 * 24 * 7));
  return diffWeeks + 1;
};

export type WeekDateMeta = {
  date: Date;
  inMonth: boolean;
};

export const getWeekDatesForMonth = (params: {
  year: number;
  monthIndex: number;
  weekIndex: number;
  weekDayIndices: number[];
  weekStartsOnMonday?: boolean;
}): WeekDateMeta[] => {
  const {
    year,
    monthIndex,
    weekIndex,
    weekDayIndices,
    weekStartsOnMonday = true,
  } = params;
  const monthStart = new Date(year, monthIndex, 1);
  const firstWeekStart = getWeekStartDate(monthStart, weekStartsOnMonday);
  const weekStart = new Date(firstWeekStart);
  weekStart.setDate(firstWeekStart.getDate() + weekIndex * 7);

  return weekDayIndices.map((weekdayOffset) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + weekdayOffset);
    const inMonth = date.getFullYear() === year && date.getMonth() === monthIndex;
    return { date, inMonth };
  });
};
