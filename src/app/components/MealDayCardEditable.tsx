import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

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

interface MealDayCardEditableProps {
  day: string;
  dateLabel: string;
  mealDate: string;
  weekNum: number;
  meals: DayMeals;
  onEdit: (day: string, mealType: 'lunch' | 'dinner', event: React.MouseEvent) => void;
  onDetail: (weekNum: number, day: string, mealType: 'lunch' | 'dinner') => void;
  onAiReplace: (day: string, mealType: 'lunch' | 'dinner', date: string) => void;
  hasChanges?: boolean;
}

export function MealDayCardEditable({
  day,
  dateLabel,
  mealDate,
  weekNum,
  meals,
  onEdit,
  onDetail,
  onAiReplace,
  hasChanges,
}: MealDayCardEditableProps) {
  const [openAiReasonKey, setOpenAiReasonKey] = useState<string | null>(null);

  const normalizeMenu = (menu: MenuItem[]) => {
    const nonEmpty = menu.filter((item) => item.name.trim().length > 0);
    const emptyCount = Math.max(0, 7 - nonEmpty.length);
    const padded = [
      ...nonEmpty,
      ...Array.from({ length: emptyCount }, () => ({ name: '', allergy: [] })),
    ];

    return padded.slice(0, 7);
  };

  const isMenuEmpty = (menu: MenuItem[]) => {
    return menu.every((item) => item.name.trim().length === 0);
  };

  useEffect(() => {
    if (!openAiReasonKey) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(`[data-ai-reason-key="${openAiReasonKey}"]`)) return;
      setOpenAiReasonKey(null);
    };

    document.addEventListener('mousedown', handleOutsideClick, true);
    return () => document.removeEventListener('mousedown', handleOutsideClick, true);
  }, [openAiReasonKey]);

  const renderMealSection = (mealType: 'lunch' | 'dinner', mealData: MealData) => {
    const aiReasonKey = `${day}-${mealType}`;
    const aiReasonText = mealData.aiReason ?? 'AI 추천 사유가 없습니다.';
    const normalizedMenu = normalizeMenu(mealData.menu);
    const isMealEmpty = normalizedMenu.every((item) => item.name.trim().length === 0);

    return (
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
  
          {/* 왼쪽 : 중식/석식 여부 */}
          <span className={`px-2.5 py-1 rounded text-xs font-medium ${
            mealType === 'lunch'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {mealType === 'lunch' ? '중식' : '석식'}
          </span>

          {/* 오른쪽 : 버튼 그룹 */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-6 px-3 text-xs text-[#5dccb4] hover:bg-[#5dccb4]/10 disabled:text-gray-300 disabled:border-gray-200 disabled:hover:bg-transparent"
              onClick={(e) => onEdit(day, mealType, e)}
              disabled={isMealEmpty}
            >
              수정
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-6 px-3 text-xs text-[#cc5db4] hover:bg-[#cc5db4]/10 disabled:text-gray-300 disabled:border-gray-200 disabled:hover:bg-transparent"
              onClick={() => {
                if (!mealDate) return;
                onAiReplace(day, mealType, mealDate);
              }}
              disabled={isMealEmpty || !mealDate}
            >
              AI대체
            </Button>
          </div>

        </div>

        <div className="space-y-2 flex-1 mb-2">
          {isMealEmpty ? (
            <div className="text-sm text-gray-400 text-center">(식단 없음)</div>
          ) : (
            normalizedMenu.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-2 min-h-[20px]">
                {item.name ? (
                  <>
                    <span className="text-sm text-gray-800 flex-1">{item.name}</span>
                    {item.allergy.length > 0 && (
                      <span className="text-xs text-gray-600 bg-[#FCE8E6] px-1 py-0.5 rounded flex-shrink-0">
                        {item.allergy.join(',')}
                      </span>
                    )}
                  </>
                ) : null}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">  
          <button
            onClick={() => onDetail(weekNum, day, mealType)}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#5dccb4] transition-colors disabled:text-gray-300"
            disabled={isMealEmpty}
          >
            <Info className="w-3.5 h-3.5" />
            상세보기
          </button>
          {mealData.isAiReplacement && (
            <TooltipProvider delayDuration={100}>
              <Tooltip
                open={openAiReasonKey === aiReasonKey}
                onOpenChange={(open) => {
                  if (!open) setOpenAiReasonKey(null);
                }}
              >
                <TooltipTrigger asChild>
                  <button
                    onClick={() =>
                      setOpenAiReasonKey((prev) => (prev === aiReasonKey ? null : aiReasonKey))
                    }
                    data-ai-reason-key={aiReasonKey}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#5dccb4] transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                    AI추천사유
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="center"
                  data-ai-reason-key={aiReasonKey}
                  className="max-w-xs bg-white text-gray-700 border border-gray-200 shadow-lg"
                >
                  {aiReasonText}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

      </div>
    );
  };

  return (
    <div className={`bg-white rounded-xl border-2 p-5 transition-all ${
      hasChanges
        ? 'border-amber-400 shadow-md'
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
    }`}>
      {/* Day Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-medium text-gray-800">{day}요일</h3>
          <p className="text-s text-gray-500 mt-1">{dateLabel}</p>
        </div>
        {hasChanges && (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
            수정됨
          </span>
        )}
      </div>

      {/* Meals */}
      <div className="space-y-5">
        {isMenuEmpty(meals.lunch.menu) && isMenuEmpty(meals.dinner.menu) ? (
          <div className="text-sm text-gray-400 text-center">(식단 없음)</div>
        ) : (
          <>
            {renderMealSection('lunch', meals.lunch)}
            <div className="border-t border-gray-100"></div>
            {renderMealSection('dinner', meals.dinner)}
          </>
        )}
      </div>

    </div>
  );
}
