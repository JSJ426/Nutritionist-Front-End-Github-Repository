import { MealCard } from '../components/MealCard';
import { MealStatusChart } from '../components/MealStatusChart';
import { SatisfactionChart } from '../components/SatisfactionChart';

export function HomePage() {
  return (
    <div className="p-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">HOME</h1>
      </div>

      {/* Meal Card */}
      <MealCard />

      {/* Charts Row */}
      <div className="flex gap-6">
        <MealStatusChart />
        <SatisfactionChart />
      </div>
    </div>
  );
}
