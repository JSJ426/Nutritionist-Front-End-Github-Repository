import { MealMonthlyCalendar } from '../components/MealMonthlyCalendar';

export function MealMonthlyPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">식단표 (월간)</h1>
      </div>
      <MealMonthlyCalendar />
    </div>
  );
}