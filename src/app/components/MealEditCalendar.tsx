import { useState } from 'react';
import { X, Edit2, GripVertical, Plus, Trash2, AlertCircle, Save, XCircle, Info } from 'lucide-react';
import { Button } from './ui/button';
import { MealDetailModal } from './MealDetailModal';

// 식단 데이터 타입
interface MenuItem {
  name: string;
  allergy: number[];
}

interface MealData {
  menu: MenuItem[];
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
      },
      dinner: {
        menu: [
          { name: '현미밥', allergy: [] },
          { name: '김치찌개', allergy: [5, 9, 10] },
          { name: '돈까스', allergy: [1, 5, 6, 10] },
          { name: '깍두기', allergy: [9] },
          { name: '우유', allergy: [2] },
        ],
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

// 알레르기 정보 매핑
const allergyInfo: { [key: number]: string } = {
  1: '난류', 2: '우유', 5: '대두', 6: '밀', 9: '새우', 10: '돼지고기', 
  12: '토마토', 13: '아황산류', 15: '닭고기', 16: '쇠고기', 17: '오징어',
};

// 드로어 컴포넌트
interface EditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  weekNum: number;
  day: string;
  mealType: 'lunch' | 'dinner';
  mealData: MealData;
  onSave: (updatedMenu: MenuItem[]) => void;
  position: { x: number; y: number };
}

function EditDrawer({ isOpen, onClose, weekNum, day, mealType, mealData, onSave, position }: EditDrawerProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mealData.menu);

  const handleAddItem = () => {
    setMenuItems([...menuItems, { name: '', allergy: [] }]);
  };

  const handleRemoveItem = (index: number) => {
    if (menuItems.length > 1) {
      setMenuItems(menuItems.filter((_, i) => i !== index));
    }
  };

  const handleNameChange = (index: number, name: string) => {
    const updated = [...menuItems];
    updated[index].name = name;
    setMenuItems(updated);
  };

  const handleAllergyChange = (index: number, allergyStr: string) => {
    const updated = [...menuItems];
    const allergyArray = allergyStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    updated[index].allergy = allergyArray;
    setMenuItems(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...menuItems];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setMenuItems(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === menuItems.length - 1) return;
    const updated = [...menuItems];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setMenuItems(updated);
  };

  const handleSaveClick = () => {
    onSave(menuItems);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-20 px-6 py-6"
      style={{ pointerEvents: 'none' }}
    >
      <div 
        className="w-[600px] max-h-[85vh] bg-white rounded-xl shadow-2xl border-2 border-gray-300 flex flex-col"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-medium text-gray-800">식단 수정</h2>
            <p className="text-sm text-gray-600 mt-1">
              {weekNum}주차 · {day}요일 · {mealType === 'lunch' ? '중식' : '석식'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">항목 {index + 1}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="w-7 h-7 rounded hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                      title="위로"
                    >
                      <span className="text-sm">↑</span>
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === menuItems.length - 1}
                      className="w-7 h-7 rounded hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                      title="아래로"
                    >
                      <span className="text-sm">↓</span>
                    </button>
                    {menuItems.length > 1 && (
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="w-7 h-7 rounded hover:bg-red-50 flex items-center justify-center text-red-500"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-gray-600">음식명</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5dccb4] focus:border-transparent"
                      placeholder="예: 흰쌀밥"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-gray-600">
                      알레르기 정보 (숫자, 쉼표로 구분)
                    </label>
                    <input
                      type="text"
                      value={item.allergy.join(', ')}
                      onChange={(e) => handleAllergyChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5dccb4] focus:border-transparent"
                      placeholder="예: 1, 5, 6"
                    />
                    {item.allergy.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.allergy.map((allergyNum) => (
                          <span
                            key={allergyNum}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FCE8E6] text-red-700 text-xs rounded"
                          >
                            {allergyNum}. {allergyInfo[allergyNum] || '알 수 없음'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddItem}
            className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#5dccb4] hover:text-[#5dccb4] hover:bg-[#5dccb4]/5 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">메뉴 항목 추가</span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            취소
          </Button>
          <Button
            onClick={handleSaveClick}
            className="px-6 bg-[#5dccb4] hover:bg-[#4dbba3] text-white"
          >
            적용
          </Button>
        </div>
      </div>
    </div>
  );
}

// 요일 카드 컴포넌트
interface DayCardProps {
  day: string;
  weekNum: number;
  meals: DayMeals;
  onEdit: (day: string, mealType: 'lunch' | 'dinner', event: React.MouseEvent) => void;
  onDetail: (weekNum: number, day: string, mealType: 'lunch' | 'dinner') => void;
  hasChanges?: boolean;
}

function DayCard({ day, weekNum, meals, onEdit, onDetail, hasChanges }: DayCardProps) {
  const renderMealSection = (mealType: 'lunch' | 'dinner', mealData: MealData) => {
    const hasAllergy = mealData.menu.some(item => item.allergy.length > 0);

    return (
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded text-xs font-medium ${
              mealType === 'lunch' 
                ? 'bg-orange-100 text-orange-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {mealType === 'lunch' ? '중식' : '석식'}
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs text-[#5dccb4] hover:text-[#4dbba3] hover:bg-[#5dccb4]/10"
            onClick={(e) => onEdit(day, mealType, e)}
          >
            수정
          </Button>
        </div>

        <div className="space-y-2 flex-1 mb-2">
          {mealData.menu.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between gap-2">
              <span className="text-sm text-gray-800 flex-1">{item.name}</span>
              {item.allergy.length > 0 && (
                <span className="text-xs text-gray-600 bg-[#FCE8E6] px-1 py-0.5 rounded flex-shrink-0">
                  {item.allergy.join(',')}
                </span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => onDetail(weekNum, day, mealType)}
          className="flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:text-[#5dccb4] hover:bg-[#5dccb4]/5 rounded transition-colors flex-shrink-0"
        >
          <Info className="w-3.5 h-3.5" />
          <span>상세보기</span>
        </button>
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
        <h3 className="text-lg font-medium text-gray-800">{day}요일</h3>
        {hasChanges && (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
            수정됨
          </span>
        )}
      </div>

      {/* Meals */}
      <div className="space-y-5">
        {renderMealSection('lunch', meals.lunch)}
        <div className="border-t border-gray-100"></div>
        {renderMealSection('dinner', meals.dinner)}
      </div>
    </div>
  );
}

// 메인 컴포넌트
export function MealEditCalendar() {
  const [weeksData, setWeeksData] = useState<WeekData[]>(initialWeeksData);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [editingMeal, setEditingMeal] = useState<{
    weekNum: number;
    day: string;
    mealType: 'lunch' | 'dinner';
    position: { x: number; y: number };
  } | null>(null);
  const [detailMeal, setDetailMeal] = useState<{
    weekNum: number;
    day: string;
    mealType: 'lunch' | 'dinner';
  } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const weekDays = ['월', '화', '수', '목', '금'];

  const handleEditMeal = (day: string, mealType: 'lunch' | 'dinner', event: React.MouseEvent) => {
    setEditingMeal({
      weekNum: selectedWeek + 1,
      day,
      mealType,
      position: { x: 0, y: 0 }, // 중앙 배치를 위해 임시 값
    });
  };

  const handleDetailMeal = (weekNum: number, day: string, mealType: 'lunch' | 'dinner') => {
    setDetailMeal({ weekNum, day, mealType });
  };

  const handleSaveMeal = (updatedMenu: MenuItem[]) => {
    if (!editingMeal) return;

    const updatedWeeks = [...weeksData];
    const weekIndex = editingMeal.weekNum - 1;
    
    updatedWeeks[weekIndex].meals[editingMeal.day][editingMeal.mealType].menu = updatedMenu;
    
    setWeeksData(updatedWeeks);
    setHasUnsavedChanges(true);
  };

  const currentWeekData = weeksData[selectedWeek];
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
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 pt-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-4">
          {weeksData.map((week, index) => {
            const status = getWeekStatus(index);
            const isActive = selectedWeek === index;

            return (
              <button
                key={index}
                onClick={() => setSelectedWeek(index)}
                className={`flex-shrink-0 px-5 py-3 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-[#5dccb4] bg-[#5dccb4]/10 text-[#5dccb4]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{week.week}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content with relative positioning for drawer */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative">
        <div className="max-w-[1600px] mx-auto">
          {/* Day Cards Grid */}
          <div className="grid grid-cols-5 gap-4">
            {weekDays.map((day) => {
              const dayMeals = currentWeekData.meals[day];
              return dayMeals ? (
                <DayCard
                  key={day}
                  day={day}
                  weekNum={selectedWeek + 1}
                  meals={dayMeals}
                  onEdit={handleEditMeal}
                  onDetail={handleDetailMeal}
                  hasChanges={false}
                />
              ) : (
                <div key={day} className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-5 flex flex-col items-center justify-center min-h-[400px]">
                  <p className="text-gray-400 text-sm mb-3">식단 없음</p>
                  <button className="px-4 py-2 text-sm text-[#5dccb4] hover:bg-[#5dccb4]/10 rounded-lg transition-colors">
                    + 식단 추가
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edit Drawer - Inside content area */}
        {editingMeal && editingMealData && (
          <EditDrawer
            isOpen={true}
            onClose={() => setEditingMeal(null)}
            weekNum={editingMeal.weekNum}
            day={editingMeal.day}
            mealType={editingMeal.mealType}
            mealData={editingMealData}
            onSave={handleSaveMeal}
            position={editingMeal.position}
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