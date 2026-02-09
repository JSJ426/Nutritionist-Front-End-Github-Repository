type TodayMealCardProps = {
  title: string;
  variant: 'lunch' | 'dinner';
  hasMeal: boolean;
  meal: {
    menu: string[];
    calories: number;
    nutrients: {
      protein: string;
      carbs: string;
      fat: string;
    };
    allergens: string[];
  };
  icon?: React.ReactNode;
};

const variantStyles = {
  lunch: {
    card: 'bg-orange-50 border-orange-200',
    title: 'text-orange-700 border-orange-200',
  },
  dinner: {
    card: 'bg-blue-50 border-blue-200',
    title: 'text-blue-700 border-blue-200',
  },
} as const;

export function TodayMealCard({ title, variant, hasMeal, meal, icon }: TodayMealCardProps) {
  const styles = variantStyles[variant];
  return (
    <div className={`border rounded-lg p-4 ${styles.card}`}>
      <h3 className={`text-base font-medium mb-3 pb-2 border-b ${styles.title}`}>
        <span className="inline-flex items-center gap-2">
          {icon}
          {title}
        </span>
      </h3>
      {hasMeal ? (
        <div className="space-y-2">
          <div>
            <div className="text-sm text-gray-800">{meal.menu.join(', ')}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">칼로리: {meal.calories} kcal</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">(영양성분)</div>
            <div className="text-xs text-gray-600">
              단백질 {meal.nutrients.protein}, 탄수화물 {meal.nutrients.carbs}, 지방 {meal.nutrients.fat}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">알레르기 유발 식품</div>
            <div className="text-sm text-red-600">{meal.allergens.join(', ')}</div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-800">등록된 식단이 없습니다.</div>
      )}
    </div>
  );
}
