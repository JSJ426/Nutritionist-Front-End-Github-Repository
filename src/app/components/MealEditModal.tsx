import { useEffect, useState } from 'react';
import { GripVertical, Plus, Trash2, X } from 'lucide-react';
import { Button } from './ui/button';
import { allergyInfo } from '../utils/allergy';

// 식단 데이터 타입
interface MenuItem {
  name: string;
  allergy: number[];
}

interface MealData {
  menu: MenuItem[];
}

interface MealEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekNum: number;
  day: string;
  mealType: 'lunch' | 'dinner';
  mealData: MealData;
  onSave: (payload: { reason: string; menus: string[] }) => void;
}

export function MealEditModal({
  isOpen,
  onClose,
  weekNum,
  day,
  mealType,
  mealData,
  onSave,
}: MealEditModalProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mealData.menu);
  const [reason, setReason] = useState('');
  const menuLabels = ['밥', '국', '주찬1', '주찬2', '부찬', '김치', '디저트'];

  useEffect(() => {
    if (isOpen) {
      setMenuItems(
        mealData.menu.map((item) => ({
          name: item.name,
          allergy: Array.isArray(item.allergy) ? [...item.allergy] : [],
        }))
      );
      setReason('');
    }
  }, [isOpen, mealData]);

  // const handleAddItem = () => {
  //   setMenuItems([...menuItems, { name: '', allergy: [] }]);
  // };

  // const handleRemoveItem = (index: number) => {
  //   if (menuItems.length > 1) {
  //     setMenuItems(menuItems.filter((_, i) => i !== index));
  //   }
  // };

  const handleNameChange = (index: number, name: string) => {
    const updated = [...menuItems];
    updated[index] = { ...updated[index], name };
    setMenuItems(updated);
  };

  const handleAllergyChange = (index: number, allergyStr: string) => {
    const updated = [...menuItems];
    const allergyArray = allergyStr
      .split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n));
    updated[index] = { ...updated[index], allergy: allergyArray };
    setMenuItems(updated);
  };

  // const handleMoveUp = (index: number) => {
  //   if (index === 0) return;
  //   const updated = [...menuItems];
  //   [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
  //   setMenuItems(updated);
  // };

  // const handleMoveDown = (index: number) => {
  //   if (index === menuItems.length - 1) return;
  //   const updated = [...menuItems];
  //   [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
  //   setMenuItems(updated);
  // };

  const handleSaveClick = () => {
    if (!reason.trim()) {
      alert('변경 사유를 입력해주세요.');
      return;
    }
    const menus = menuItems.map((item) => item.name).filter((name) => name.trim().length > 0);
    onSave({ reason: reason.trim(), menus });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="w-full max-w-2xl max-h-[85vh] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col">
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              변경 사유 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="예: 식자재 수급 문제로 인한 변경"
              className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5dccb4] focus:border-transparent"
            />
          </div>
          <div className="space-y-4">
            {menuItems.map((item, index) => {
              const label = menuLabels[index] ?? `항목 ${index + 1}`;

              return (
                <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    {/* <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                    </div> */}
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <div className="flex items-center gap-1">
                      {/* <button
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
                      </button> */}
                      {/* {menuItems.length > 1 && (
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="w-7 h-7 rounded hover:bg-red-50 flex items-center justify-center text-red-500"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )} */}
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
                              {allergyNum}. {allergyInfo[allergyNum]?.label || '알 수 없음'}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* <button
            onClick={handleAddItem}
            className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#5dccb4] hover:text-[#5dccb4] hover:bg-[#5dccb4]/5 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">메뉴 항목 추가</span>
          </button> */}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">
          <Button
            variant="cancel"
            onClick={onClose}
            className="px-6"
          >
            취소
          </Button>
          <Button
            variant="brand"
            onClick={handleSaveClick}
            className="px-6"
          >
            적용
          </Button>
        </div>
      </div>
    </div>
  );
}
