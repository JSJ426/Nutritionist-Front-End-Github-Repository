import { useEffect, useState } from 'react';

import { fetchMealPlanMonthly, replaceMealPlanWithAI, updateMealPlanManually } from '../data/mealplan';

import { ErrorModal } from '../components/ErrorModal';
import { Spinner } from '../components/Spinner';
import { MealMonthlyCalendarEditable } from "../components/MealMonthlyCalendarEditable";

import { useErrorModal } from '../hooks/useErrorModal';
import { toMealMonthlyDataByMonth, toMealWeeklyEditableVMFromMonthlyData } from '../viewModels/meal';
import type { MealWeeklyEditableVM } from '../viewModels/meal';

interface MealEditPageProps {
  initialParams?: { date?: string };
}

export function MealEditPage({ initialParams }: MealEditPageProps) {
  const { modalProps, openAlert } = useErrorModal();
  const [weeklyEditableVm, setWeeklyEditableVm] = useState<MealWeeklyEditableVM>({ weeks: [] });
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [isAiReplacing, setIsAiReplacing] = useState(false);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    let isActive = true;

    const loadWeekly = async () => {
      const dateParam =
        typeof initialParams?.date === 'string' && initialParams.date
          ? initialParams.date
          : (() => {
            const now = new Date();
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            return formatDate(nextMonth);
          })();

      const dateObj = new Date(`${dateParam}T00:00:00`);
      const response = await fetchMealPlanMonthly(dateObj.getFullYear(), dateObj.getMonth() + 1);
      if (!isActive) return;
      const dataByMonth = toMealMonthlyDataByMonth(response);
      const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      const monthlyData = dataByMonth[monthKey] ?? Object.values(dataByMonth)[0];
      if (!monthlyData) {
        setWeeklyEditableVm({ weeks: [] });
        return;
      }
      setCurrentMonth(monthlyData.month);
      setWeeklyEditableVm(toMealWeeklyEditableVMFromMonthlyData(monthlyData, dateParam));
    };

    loadWeekly();

    return () => {
      isActive = false;
    };
  }, [initialParams?.date]);

  const handleSubmit = async (payload: {
    reason: string;
    menus: string[];
    menuId?: number;
    mealPlanId?: number;
    mealType: 'LUNCH' | 'DINNER';
  }) => {
    console.log(`${payload.mealPlanId}, ${payload.menuId}`);
    if (!payload.menuId || !payload.mealPlanId) {
      openAlert('메뉴 식별자를 찾을 수 없습니다. 데이터를 다시 불러오세요.');
      return;
    }
    try {
      await updateMealPlanManually(payload.mealPlanId, payload.menuId, {
        reason: payload.reason,
        menus: payload.menus,
      });
      openAlert('식단표 수정 요청이 전송되었습니다.', { title: '안내' });
    } catch (error) {
      console.error('Failed to update meal plan:', error);
      openAlert('식단표 수정 요청에 실패했습니다.');
    }
  };

  const handleAiReplace = async (payload: { date: string; mealType: 'LUNCH' | 'DINNER' }) => {
    setIsAiReplacing(true);
    try {
      await replaceMealPlanWithAI(payload);
      openAlert('AI 대체가 완료되었습니다.', { title: '안내' });
      const dateObj = new Date(`${payload.date}T00:00:00`);
      const response = await fetchMealPlanMonthly(dateObj.getFullYear(), dateObj.getMonth() + 1);
      const dataByMonth = toMealMonthlyDataByMonth(response);
      const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      const monthlyData = dataByMonth[monthKey] ?? Object.values(dataByMonth)[0];
      if (!monthlyData) {
        setWeeklyEditableVm({ weeks: [] });
        return;
      }
      setCurrentMonth(monthlyData.month);
      setWeeklyEditableVm(toMealWeeklyEditableVMFromMonthlyData(monthlyData, payload.date));
    } catch (error) {
      console.error('Failed to replace meal plan with AI:', error);
      openAlert('AI 대체에 실패했습니다.');
    } finally {
      setIsAiReplacing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
          식단표 수정
        </h1>
      </div>

      <div className="relative flex-1 overflow-hidden px-6 py-6">
        {isAiReplacing ? (
          <Spinner
            label="AI 대체 중"
            showLabel
            estimatedWaitSeconds={30}
            containerClassName="fixed top-[72px] left-[240px] right-0 bottom-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
          />
        ) : null}
        <MealMonthlyCalendarEditable
          initialWeeks={weeklyEditableVm.weeks}
          currentMonth={currentMonth}
          onSubmit={handleSubmit}
          onAiReplace={handleAiReplace}
          isAiReplacing={isAiReplacing}
        />
      </div>
      <ErrorModal {...modalProps} />
    </div>
  );
}
