import { useEffect, useState } from 'react';
import { AlertCircle, Save, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { MealDetailModal } from './MealDetailModal';
import { MealEditModal } from './MealEditModal';
import { WeekFilterButtons } from './WeekFilterButtons';
import { MealWeekSectionEditable } from './MealWeekSectionEditable';
import {
  getWeekDatesForMonth,
  WEEKDAY_INDICES_MON_FRI,
  WEEKDAY_LABELS_MON_FRI,
} from '../utils/calendar';
import { fetchMealPlanMenuDetail } from '../data/mealplan';
import type { MealPlanDetailResponse } from '../viewModels/meal';

// 식단 데이터 타입
interface MenuItem {
  name: string;
  allergy: number[];
}

interface MealData {
  menu: MenuItem[];
  isAiReplacement: boolean;
  aiReason?: string;
  menuId?: number;
  mealPlanId?: number;
  detail?: {
    nutrition: {
      kcal: number;
      carb: number;
      prot: number;
      fat: number;
    };
    cost: number;
    aiComment: string;
    allergenSummary: {
      uniqueAllergens: number[];
      byMenu: Record<string, number[]>;
    };
    menuItems?: Record<
      string,
      {
        id: string;
        name: string;
        display?: string;
        allergens: number[];
        recipe?: string;
        ingredients?: string;
      } | null
    >;
  };
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

// 요일 카드 컴포넌트
// 메인 컴포넌트
interface MealMonthlyCalendarEditableProps {
  initialWeeks: WeekData[];
  currentMonth?: string;
  onSubmit: (payload: {
    reason: string;
    menus: string[];
    menuId?: number;
    mealPlanId?: number;
    mealType: 'LUNCH' | 'DINNER';
  }) => void;
  onAiReplace: (payload: { date: string; mealType: 'LUNCH' | 'DINNER' }) => void;
  isAiReplacing?: boolean;
}

export function MealMonthlyCalendarEditable({
  initialWeeks,
  currentMonth,
  onSubmit,
  onAiReplace,
  isAiReplacing,
}: MealMonthlyCalendarEditableProps) {
  const [weeksData, setWeeksData] = useState<WeekData[]>(initialWeeks);
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
    detail?: MealData['detail'];
  } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setWeeksData(initialWeeks);
  }, [initialWeeks]);

  const isValidMonthKey = /^\d{4}-\d{2}$/.test(currentMonth ?? '');
  const monthKey = isValidMonthKey ? (currentMonth ?? '') : '';
  const [yearStr, monthStr] = monthKey.split('-');
  const today = new Date();
  const year = yearStr ? Number(yearStr) : today.getFullYear();
  const month = monthStr ? Number(monthStr) : today.getMonth() + 1;

  const weekDays = WEEKDAY_LABELS_MON_FRI;
  const getWeekDateInfo = (weekIndex: number) => {
    if (!currentMonth) {
      return weekDays.reduce<Record<string, { label: string; iso: string }>>((acc, day) => {
        acc[day] = { label: '', iso: '' };
        return acc;
      }, {});
    }

    const [yearStr, monthStr] = currentMonth.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    if (!year || !month) {
      return weekDays.reduce<Record<string, { label: string; iso: string }>>((acc, day) => {
        acc[day] = { label: '', iso: '' };
        return acc;
      }, {});
    }

    const weekDates = getWeekDatesForMonth({
      year,
      monthIndex: month - 1,
      weekIndex,
      weekDayIndices: [...WEEKDAY_INDICES_MON_FRI],
      weekStartsOnMonday: true,
    });

    return weekDays.reduce<Record<string, { label: string; iso: string; inMonth: boolean }>>((acc, day, idx) => {
      const { date, inMonth } = weekDates[idx];
      const labelMonth = String(date.getMonth() + 1).padStart(2, '0');
      const labelDay = String(date.getDate()).padStart(2, '0');
      const isoYear = String(date.getFullYear());
      const isoMonth = String(date.getMonth() + 1).padStart(2, '0');
      const isoDay = String(date.getDate()).padStart(2, '0');
      acc[day] = {
        label: `${labelMonth}/${labelDay}`,
        iso: `${isoYear}-${isoMonth}-${isoDay}`,
        inMonth,
      };
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

  const buildDetailFromResponse = (raw: MealPlanDetailResponse): MealData['detail'] => ({
    nutrition: raw.data.nutrition,
    cost: raw.data.cost,
    aiComment: raw.data.ai_comment ?? '',
    allergenSummary: {
      uniqueAllergens: raw.data.allergen_summary?.unique_allergens ?? [],
      byMenu: raw.data.allergen_summary?.by_menu ?? {},
    },
    menuItems: raw.data.menu_items,
  });

  const handleDetailMeal = async (
    weekNum: number,
    day: string,
    mealType: 'lunch' | 'dinner',
    dateIso: string
  ) => {
    if (!dateIso) {
      setDetailMeal({ weekNum, day, mealType });
      return;
    }
    try {
      const response = await fetchMealPlanMenuDetail(
        dateIso,
        mealType === 'lunch' ? 'LUNCH' : 'DINNER'
      );
      const detail = buildDetailFromResponse(response);
      setDetailMeal({ weekNum, day, mealType, detail });
    } catch (error) {
      console.error('Failed to fetch meal plan detail:', error);
      setDetailMeal({ weekNum, day, mealType });
    }
  };

  const handleSaveMeal = (payload: { reason: string; menus: string[] }) => {
    if (!editingMeal) return;

    const updatedWeeks = [...weeksData];
    const weekIndex = editingMeal.weekNum - 1;
    const targetMeal = updatedWeeks[weekIndex].meals[editingMeal.day][editingMeal.mealType];
    targetMeal.menu = payload.menus.map((name) => ({ name, allergy: [] }));

    setWeeksData(updatedWeeks);
    setHasUnsavedChanges(true);
    onSubmit({
      ...payload,
      menuId: targetMeal.menuId,
      mealPlanId: targetMeal.mealPlanId,
      mealType: editingMeal.mealType === 'lunch' ? 'LUNCH' : 'DINNER',
    });
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
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium">{year}년 {Number(month)}월</h2>
          </div>
        </div>
      </div>

      {/* Week Tabs - Sticky */}
      <WeekFilterButtons
        weeks={weeksData.map((week) => ({ week: week.week }))}
        selectedWeek={selectedWeek}
        onSelect={setSelectedWeek}
      />

      {/* Content with relative positioning for drawer */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {(selectedWeek === null ? weeksData : [weeksData[selectedWeek]])
            .filter(Boolean)
            .map((weekData, index) => {
              const actualWeekIndex = selectedWeek === null ? index : selectedWeek;
              const weekNum = actualWeekIndex + 1;
              const weekDateInfo = getWeekDateInfo(actualWeekIndex);

            return (
              <MealWeekSectionEditable
                key={weekData.week}
                weekLabel={weekData.week}
                weekDays={weekDays}
                mealsByDay={weekData.meals}
                dateLabels={Object.fromEntries(
                  Object.entries(weekDateInfo).map(([day, info]) => [day, info.label])
                )}
                dateIsoLabels={Object.fromEntries(
                  Object.entries(weekDateInfo).map(([day, info]) => [day, info.iso])
                )}
                dateInMonth={Object.fromEntries(
                  Object.entries(weekDateInfo).map(([day, info]) => [day, info.inMonth])
                )}
                onEdit={(day, mealType, event) => handleEditMeal(weekNum, day, mealType, event)}
                onDetail={handleDetailMeal}
                onAiReplace={(day, mealType, date) =>
                  onAiReplace({ date, mealType: mealType === 'lunch' ? 'LUNCH' : 'DINNER' })
                }
                weekNum={weekNum}
                hasChanges={false}
                isAiReplacing={isAiReplacing}
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
            detail={detailMeal.detail}
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
                variant="cancel"
                onClick={() => {
                  if (confirm('변경사항을 취소하시겠습니까?')) {
                    setWeeksData(initialWeeks);
                    setHasUnsavedChanges(false);
                  }
                }}
                className="px-6"
              >
                <XCircle className="w-4 h-4 mr-2" />
                취소
              </Button>
              <Button
                variant="brand"
                onClick={() => {
                  alert('변경사항이 저장되었습니다.');
                  setHasUnsavedChanges(false);
                }}
                className="px-6"
              >
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
