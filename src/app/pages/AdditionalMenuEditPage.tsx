import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

import { getAdditionalMenuDetailResponse, updateAdditionalMenu } from '../data/additionalMenu';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

import {
  getAdditionalMenuCreateForm,
  toAdditionalMenuEditVMFromResponse,
  toAdditionalMenuRequestBody,
} from '../viewModels/additionalMenu';

interface AdditionalMenuEditPageProps {
  initialParams?: any;
  onNavigate?: (page: string, params?: any) => void;
}

export function AdditionalMenuEditPage({
  initialParams,
  onNavigate,
}: AdditionalMenuEditPageProps) {
  const menuId =
    initialParams?.menuId !== undefined && initialParams?.menuId !== null
      ? String(initialParams.menuId)
      : undefined;
  const [menuIdValue, setMenuIdValue] = useState<string | undefined>(menuId);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [nutritionBasis, setNutritionBasis] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [kcal, setKcal] = useState('');
  const [carb, setCarb] = useState('');
  const [prot, setProt] = useState('');
  const [fat, setFat] = useState('');
  const [calcium, setCalcium] = useState('');
  const [iron, setIron] = useState('');
  const [vitaminA, setVitaminA] = useState('');
  const [thiamin, setThiamin] = useState('');
  const [riboflavin, setRiboflavin] = useState('');
  const [vitaminC, setVitaminC] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [allergensText, setAllergensText] = useState('');
  const [recipeText, setRecipeText] = useState('');
  const [createdAtText, setCreatedAtText] = useState('');

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      const response = await getAdditionalMenuDetailResponse(menuId);
      if (!isActive) return;
      const editVm = response ? toAdditionalMenuEditVMFromResponse(response, menuId) : null;
      const initialForm = editVm?.form ?? getAdditionalMenuCreateForm();

      setMenuIdValue(editVm?.id ?? menuId);
      setName(initialForm.name);
      setCategory(initialForm.category);
      setNutritionBasis(initialForm.nutritionBasis);
      setServingSize(initialForm.servingSize);
      setKcal(initialForm.kcal);
      setCarb(initialForm.carb);
      setProt(initialForm.prot);
      setFat(initialForm.fat);
      setCalcium(initialForm.calcium);
      setIron(initialForm.iron);
      setVitaminA(initialForm.vitaminA);
      setThiamin(initialForm.thiamin);
      setRiboflavin(initialForm.riboflavin);
      setVitaminC(initialForm.vitaminC);
      setIngredientsText(initialForm.ingredientsText);
      setAllergensText(initialForm.allergensText);
      setRecipeText(initialForm.recipeText);
      setCreatedAtText(editVm?.createdAtText ?? '');
      setIsLoading(false);
    };

    load();

    return () => {
      isActive = false;
    };
  }, [menuId]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('메뉴명을 입력해주세요.');
      return;
    }
    if (!servingSize.trim()) {
      alert('1회 제공량을 입력해주세요.');
      return;
    }
    if (!kcal.trim()) {
      alert('열량(kcal)을 입력해주세요.');
      return;
    }
    if (!ingredientsText.trim()) {
      alert('원재료 정보를 입력해주세요.');
      return;
    }
    if (!recipeText.trim()) {
      alert('조리법을 입력해주세요.');
      return;
    }

    const form = {
      name,
      category,
      nutritionBasis,
      servingSize,
      kcal,
      carb,
      prot,
      fat,
      calcium,
      iron,
      vitaminA,
      thiamin,
      riboflavin,
      vitaminC,
      ingredientsText,
      allergensText,
      recipeText,
    };
    const requestBody = toAdditionalMenuRequestBody(form);

    console.log('Update additional menu payload:', requestBody);

    const result = await updateAdditionalMenu(menuIdValue, requestBody);
    alert(result.message);
    if (menuIdValue) {
      onNavigate?.('additional-menu-read', { menuId: menuIdValue });
    }
  };

  const handleCancel = () => {
    if (menuIdValue) {
      onNavigate?.('additional-menu-read', { menuId: menuIdValue });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
            신메뉴 편집
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          데이터를 불러오는 중입니다.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
            신메뉴 편집
          </h1>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            보기로
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                  메뉴명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="메뉴명을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                  메뉴 카테고리(식품대분류명) <span className="text-red-500">*</span>
                </Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded border bg-gray-100 text-sm text-gray-900 focus:outline-none focus:border-[#5dccb4]"
                >
                  <option value="밥류">밥류</option>
                  <option value="국 및 탕류">국 및 탕류</option>
                  <option value="스프류">스프류</option>
                  <option value="전·적 및 부침류">전·적 및 부침류</option>
                  <option value="나물·숙채류">나물·숙채류</option>
                  <option value="디저트류">디저트류</option>
                  <option value="볶음류">볶음류</option>
                  <option value="구이류">구이류</option>
                  <option value="생채·무침류">생채·무침류</option>
                  <option value="튀김류">튀김류</option>
                  <option value="조림류">조림류</option>
                  <option value="찜류">찜류</option>
                  <option value="면류">면류</option>
                  <option value="찌개 및 전골류">찌개 및 전골류</option>
                  <option value="죽류">죽류</option>
                  <option value="장아찌·절임류">장아찌·절임류</option>
                  <option value="김치류">김치류</option>
                  <option value="음료류">음료류</option>
                  <option value="만두류">만두류</option>
                </select>
              </div>

              <div>
                <Label htmlFor="nutritionBasis" className="text-sm font-medium mb-2 block">
                  영양 성분 기준 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nutritionBasis"
                  type="text"
                  placeholder="예: 100g"
                  value={nutritionBasis}
                  onChange={(e) => setNutritionBasis(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="servingSize" className="text-sm font-medium mb-2 block">
                  1회 제공량 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="servingSize"
                  type="text"
                  placeholder="예: 180g"
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  영양 성분
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="kcal"
                    type="number"
                    placeholder="kcal"
                    value={kcal}
                    onChange={(e) => setKcal(e.target.value)}
                  />
                  <Input
                    id="carb"
                    type="number"
                    placeholder="탄수화물(g)"
                    value={carb}
                    onChange={(e) => setCarb(e.target.value)}
                  />
                  <Input
                    id="prot"
                    type="number"
                    placeholder="단백질(g)"
                    value={prot}
                    onChange={(e) => setProt(e.target.value)}
                  />
                  <Input
                    id="fat"
                    type="number"
                    placeholder="지방(g)"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                  />
                  <Input
                    id="calcium"
                    type="number"
                    placeholder="칼슘(mg)"
                    value={calcium}
                    onChange={(e) => setCalcium(e.target.value)}
                  />
                  <Input
                    id="iron"
                    type="number"
                    placeholder="철(mg)"
                    value={iron}
                    onChange={(e) => setIron(e.target.value)}
                  />
                  <Input
                    id="vitaminA"
                    type="number"
                    placeholder="비타민A(μg)"
                    value={vitaminA}
                    onChange={(e) => setVitaminA(e.target.value)}
                  />
                  <Input
                    id="thiamin"
                    type="number"
                    placeholder="티아민(mg)"
                    value={thiamin}
                    onChange={(e) => setThiamin(e.target.value)}
                  />
                  <Input
                    id="riboflavin"
                    type="number"
                    placeholder="리보플라빈(mg)"
                    value={riboflavin}
                    onChange={(e) => setRiboflavin(e.target.value)}
                  />
                  <Input
                    id="vitaminC"
                    type="number"
                    placeholder="비타민C(mg)"
                    value={vitaminC}
                    onChange={(e) => setVitaminC(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ingredientsText" className="text-sm font-medium mb-2 block">
                  원재료 정보 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="ingredientsText"
                  placeholder="예: 소고기, 돼지고기, 치즈..."
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              <div>
                <Label htmlFor="allergens" className="text-sm font-medium mb-2 block">
                  알레르기 정보 (번호, 쉼표로 구분)
                </Label>
                <Input
                  id="allergens"
                  type="text"
                  placeholder="예: 1, 2, 5, 6"
                  value={allergensText}
                  onChange={(e) => setAllergensText(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="recipeText" className="text-sm font-medium mb-2 block">
                  조리법 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="recipeText"
                  placeholder="조리법을 입력하세요"
                  value={recipeText}
                  onChange={(e) => setRecipeText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mt-1">
                  <strong>작성일:</strong> {createdAtText || '-'}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  취소
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-[#5dccb4] hover:bg-[#4db9a3] text-white"
                >
                  완료
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
