import { useState } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

// Meal data same as MealMonthlyCalendar
const mealDataByMonth = {
  "2026-01": { "month": "2026-01", "target": "고등학교", "weeks": [] },
  "2025-12": { "month": "2025-12", "target": "고등학교", "weeks": [] }
};

// Load data from MealMonthlyCalendar
import { MealMonthlyCalendar as OriginalComponent } from './MealMonthlyCalendar';

interface EditMealModalProps {
  day: string;
  week: string;
  mealType: 'lunch' | 'dinner';
  mealData: { menu: Array<{ name: string; allergy: number[] }> };
  onClose: () => void;
  onSave: (updatedData: { menu: Array<{ name: string; allergy: number[] }> }) => void;
}

function EditMealModal({ day, week, mealType, mealData, onClose, onSave }: EditMealModalProps) {
  const [menuItems, setMenuItems] = useState(mealData.menu);

  const handleAddItem = () => {
    setMenuItems([...menuItems, { name: '', allergy: [] }]);
  };

  const handleRemoveItem = (index: number) => {
    if (menuItems.length > 1) {
      setMenuItems(menuItems.filter((_, i) => i !== index));
    }
  };

  const handleItemNameChange = (index: number, name: string) => {
    const updated = [...menuItems];
    updated[index].name = name;
    setMenuItems(updated);
  };

  const handleItemAllergyChange = (index: number, allergyStr: string) => {
    const updated = [...menuItems];
    const allergyArray = allergyStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    updated[index].allergy = allergyArray;
    setMenuItems(updated);
  };

  const handleSave = () => {
    onSave({ menu: menuItems });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-medium mb-4 pb-2 border-b border-gray-200">
          식단 수정
        </h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <span className="text-sm text-gray-600">주차: </span>
            <span className="font-medium">{week}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">요일: </span>
            <span className="font-medium">{day}요일</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">식사 유형: </span>
            <span className={`inline-block px-2 py-1 rounded text-xs ${
              mealType === 'lunch' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {mealType === 'lunch' ? '중식' : '석식'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">메뉴 항목</label>
            <Button
              size="sm"
              onClick={handleAddItem}
              className="bg-[#5dccb4] hover:bg-[#4dbba3] text-white"
            >
              + 항목 추가
            </Button>
          </div>

          {menuItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">항목 {index + 1}</span>
                {menuItems.length > 1 && (
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">음식명</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemNameChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                    placeholder="예: 흰쌀밥"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">
                    알레르기 정보 (숫자, 쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={item.allergy.join(', ')}
                    onChange={(e) => handleItemAllergyChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                    placeholder="예: 1, 5, 6"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave} className="bg-[#5dccb4] hover:bg-[#4dbba3]">
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}

export { EditMealModal };
