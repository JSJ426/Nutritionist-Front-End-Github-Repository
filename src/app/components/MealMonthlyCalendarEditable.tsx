import { useState } from 'react';
import { AlertCircle, Save, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { MealDetailModal } from './MealDetailModal';
import { MealEditModal } from './MealEditModal';
import { WeekFilterButtons } from './WeekFilterButtons';
import { MealWeekSectionEditable } from './MealWeekSectionEditable';

// 식단 데이터 타입
interface MenuItem {
  name: string;
  allergy: number[];
}

interface MealData {
  menu: MenuItem[];
  isAiReplacement: boolean;
  aiReason?: string;
}

interface DayMeals {
  lunch: MealData;
  dinner: MealData;
}

interface WeekData {
  week: string;
  meals: {
    [key: string]: DayMeals;
  };
}

// 모의 데이터
const generateWeekData = (weekNum: number): WeekData => {
  const days = ['월', '화', '수', '목', '금'];
  const meals: { [key: string]: DayMeals } = {};
  
  days.forEach((day) => {
    meals[day] = {
      lunch: {
        menu: [
          { name: '흰쌀밥', allergy: [] },
          { name: '육개장', allergy: [5, 6, 16] },
          { name: '불고기', allergy: [5, 6] },
          { name: '콩나물무침', allergy: [5] },
          { name: '배추김치', allergy: [9] },
        ],
        isAiReplacement: true,
        aiReason: '영양 균형과 알레르기 위험도를 고려해 구성했습니다.',
      },
      dinner: {
        menu: [
          { name: '현미밥', allergy: [] },
          { name: '김치찌개', allergy: [5, 9, 10] },
          { name: '돈까스', allergy: [1, 5, 6, 10] },
          { name: '깍두기', allergy: [9] },
          { name: '우유', allergy: [2] },
        ],
        isAiReplacement: false,
      },
    };
  });

  return {
    week: `${weekNum}주차`,
    meals,
  };
};

const initialWeeksData = [
  generateWeekData(1),
  generateWeekData(2),
  generateWeekData(3),
  generateWeekData(4),
  generateWeekData(5),
];

// 요일 카드 컴포넌트
// 메인 컴포넌트
interface MealMonthlyCalendarEditableProps {
  onSubmit: (payload: { reason: string; menus: string[] }) => void;
}

export function MealMonthlyCalendarEditable({ onSubmit }: MealMonthlyCalendarEditableProps) {
  const [weeksData, setWeeksData] = useState<WeekData[]>(initialWeeksData);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [editingMeal, setEditingMeal] = useState<{
    weekNum: number;
    day: string;
    mealType: 'lunch' | 'dinner';
  } | null>(null);
  const [detailMeal, setDetailMeal] = useState<{
    weekNum: number;
    day: string;
    mealType: 'lunch' | 'dinner';
  } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const weekDays = ['월', '화', '수', '목', '금'];
  const getWeekDateLabels = (weekIndex: number) => {
    const baseMonday = new Date(2026, 0, 6); // 2026-01-06 (월)
    const weekMonday = new Date(baseMonday);
    weekMonday.setDate(baseMonday.getDate() + weekIndex * 7);

    return weekDays.reduce<Record<string, string>>((acc, day, idx) => {
      const date = new Date(weekMonday);
      date.setDate(weekMonday.getDate() + idx);
      const labelMonth = String(date.getMonth() + 1).padStart(2, '0');
      const labelDay = String(date.getDate()).padStart(2, '0');
      acc[day] = `${labelMonth}/${labelDay}`;
      return acc;
    }, {});
  };

  const handleEditMeal = (weekNum: number, day: string, mealType: 'lunch' | 'dinner', event: React.MouseEvent) => {
    setEditingMeal({
      weekNum,
      day,
      mealType,
    });
  };

  const handleDetailMeal = (weekNum: number, day: string, mealType: 'lunch' | 'dinner') => {
    setDetailMeal({ weekNum, day, mealType });
  };

  const handleSaveMeal = (payload: { reason: string; menus: string[] }) => {
    if (!editingMeal) return;

    const updatedWeeks = [...weeksData];
    const weekIndex = editingMeal.weekNum - 1;
    updatedWeeks[weekIndex].meals[editingMeal.day][editingMeal.mealType].menu = payload.menus.map(
      (name) => ({ name, allergy: [] })
    );

    setWeeksData(updatedWeeks);
    setHasUnsavedChanges(true);
    onSubmit(payload);
  };

  const editingMealData = editingMeal 
    ? weeksData[editingMeal.weekNum - 1].meals[editingMeal.day][editingMeal.mealType]
    : null;
  const detailMealData = detailMeal
    ? weeksData[detailMeal.weekNum - 1].meals[detailMeal.day][detailMeal.mealType]
    : null;

  // 주차별 상태 (예시)
  const getWeekStatus = (weekIndex: number) => {
    if (weekIndex === 0) return '생성됨';
    if (weekIndex === 1) return '수정됨';
    return '미생성';
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Week Tabs - Sticky */}
      <WeekFilterButtons
        weeks={weeksData.map((week) => ({ week: week.week }))}
        selectedWeek={selectedWeek}
        onSelect={setSelectedWeek}
      />

      {/* Content with relative positioning for drawer */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {(selectedWeek === null ? weeksData : [weeksData[selectedWeek]]).map((weekData, index) => {
            const actualWeekIndex = selectedWeek === null ? index : selectedWeek;
            const weekNum = actualWeekIndex + 1;

            return (
              <MealWeekSectionEditable
                key={weekData.week}
                weekLabel={weekData.week}
                weekDays={weekDays}
                mealsByDay={weekData.meals}
                dateLabels={getWeekDateLabels(actualWeekIndex)}
                onEdit={(day, mealType, event) => handleEditMeal(weekNum, day, mealType, event)}
                onDetail={handleDetailMeal}
                weekNum={weekNum}
                hasChanges={false}
              />
            );
          })}
        </div>

        {/* Meal Edit Modal */}
        {editingMeal && editingMealData && (
          <MealEditModal
            isOpen={true}
            onClose={() => setEditingMeal(null)}
            weekNum={editingMeal.weekNum}
            day={editingMeal.day}
            mealType={editingMeal.mealType}
            mealData={editingMealData}
            onSave={handleSaveMeal}
          />
        )}

        {/* Detail Modal - Inside content area */}
        {detailMeal && detailMealData && (
          <MealDetailModal
            day={detailMeal.day}
            week={`${detailMeal.weekNum}주차`}
            mealType={detailMeal.mealType}
            mealData={detailMealData}
            onClose={() => setDetailMeal(null)}
          />
        )}
      </div>

      {/* Sticky Bottom Action Bar */}
      {hasUnsavedChanges && (
        <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">저장되지 않은 변경사항이 있습니다</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('변경사항을 취소하시겠습니까?')) {
                    setWeeksData(initialWeeksData);
                    setHasUnsavedChanges(false);
                  }
                }}
                className="px-6"
              >
                <XCircle className="w-4 h-4 mr-2" />
                취소
              </Button>
              <Button
                onClick={() => {
                  alert('변경사항이 저장되었습니다.');
                  setHasUnsavedChanges(false);
                }}
                className="px-6 bg-[#5dccb4] hover:bg-[#4dbba3] text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
