export type StatsKpiData = {
  today: number;
  todayChange: number;
  weekAvg: number;
  weekChange: number;
  monthAvg: number;
  monthChange: number;
};

export const getSeriesKpiData = (series: number[], prevMonthAvg: number): StatsKpiData => {
  if (!series.length) {
    return {
      today: 0,
      todayChange: 0,
      weekAvg: 0,
      weekChange: 0,
      monthAvg: 0,
      monthChange: 0,
    };
  }
  const lastIndex = series.length - 1;
  const today = series[lastIndex];
  const yesterday = series[lastIndex - 1] ?? today;
  const weekSlice = series.slice(-7);
  const weekAvg = weekSlice.reduce((a, b) => a + b, 0) / Math.min(7, weekSlice.length);
  const prevWeekSlice = series.slice(-14, -7);
  const prevWeekAvg =
    prevWeekSlice.reduce((a, b) => a + b, 0) / Math.min(7, prevWeekSlice.length) || weekAvg;
  const monthAvg = series.reduce((a, b) => a + b, 0) / series.length;

  return {
    today,
    todayChange: today - yesterday,
    weekAvg,
    weekChange: weekAvg - prevWeekAvg,
    monthAvg,
    monthChange: monthAvg - prevMonthAvg,
  };
};
