import type { MenuItem } from '../viewModels/meal';
import { WeeklyMealCard } from './WeeklyMealCard';

type WeeklyMealDay = {
  day: string;
  date: number;
  lunch: { menu: MenuItem[] };
  dinner: { menu: MenuItem[] };
};

type WeeklyMealSectionProps = {
  currentMonth: number;
  currentDate: number;
  weeklyMeals: WeeklyMealDay[];
};

export function WeeklyMealSection({ currentMonth, currentDate, weeklyMeals }: WeeklyMealSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6" style={{ width: '67.5%' }}>
      <h2 className="text-2xl font-medium mb-4 pb-2 border-b-2 border-[#5dccb4]">
        이 주의 식단표
      </h2>

      {/* 스크롤 컨테이너 */}
      <div className="overflow-x-auto">
        <div
          className="
            flex
            flex-nowrap
            gap-4
            justify-center   // 가로 중앙
            items-center     // 세로 중앙
            min-h-[640px]    // Tailwind 방식 권장
            px-4
          "
        >
          {weeklyMeals.map((dayMeal, idx) => {
            const isToday = dayMeal.date === currentDate;
            return (
              <WeeklyMealCard
                key={idx}
                day={dayMeal.day}
                date={dayMeal.date}
                currentMonth={currentMonth}
                isToday={isToday}
                lunchMenu={dayMeal.lunch.menu}
                dinnerMenu={dayMeal.dinner.menu}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
