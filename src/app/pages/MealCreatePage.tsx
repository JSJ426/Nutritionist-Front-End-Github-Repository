import { useEffect, useState } from "react";
import { Upload, FileText, X } from "lucide-react";

import { getSchoolResponse } from "../data/school";
import { generateMealPlan } from "../data/mealplan";

import { Button } from "../components/ui/button";
import { Spinner } from "../components/Spinner";
import { useErrorModal } from "../hooks/useErrorModal";

interface MealCreatePageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function MealCreatePage({ onNavigate }: MealCreatePageProps) {
  const { openAlert } = useErrorModal();
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const now = new Date();
  const generationTarget = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const [schoolInfo, setSchoolInfo] = useState({
    targetPrice: 0,
    maxPrice: 0,
    staffCount: 0,
    equipmentSummary: "",
  });
  const formatNumber = (value: number) => value.toLocaleString("ko-KR");

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const target = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const payload = {
        year: target.getFullYear(),
        month: target.getMonth() + 1,
        options: {
          num_generations: 50,
        },
      };
      await generateMealPlan(payload);
      setHasGenerated(true);
      onNavigate?.("meal-edit");
    } catch (error) {
      console.error("Failed to generate meal plan:", error);
      openAlert("식단표 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleCancel = () => {
  //   alert("취소되었습니다.");
  // };

  useEffect(() => {
    const loadSchoolInfo = async () => {
      const response = await getSchoolResponse();
      if (response?.status !== "success") return;
      setSchoolInfo({
        targetPrice: response.data.target_unit_price ?? 0,
        maxPrice: response.data.max_unit_price ?? 0,
        staffCount: response.data.cook_workers ?? 0,
        equipmentSummary: response.data.kitchen_equipment ?? "",
      });
    };
    void loadSchoolInfo();
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
          식단표 생성
        </h1>
      </div>

      <div className="relative flex-1 flex flex-col">
        {isLoading ? (
          <Spinner
            label="식단표 생성 중"
            showLabel
            estimatedWaitSeconds={60}
            containerClassName="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
          />
        ) : null}

        {/* Content Area with Tabs */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-4 max-w-[1200px] mx-auto">
            {/* 생성 대상 월 */}
            <h2 className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <b>
                {generationTarget.getFullYear()}년{" "}
                {generationTarget.getMonth() + 1}월
              </b>
              에 대한 식단표를 생성합니다.
            </h2>

            {/* 단가 관리 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
                단가 관리
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="text-base font-medium text-gray-700 w-40">
                    목표 1식 단가
                  </label>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                      {formatNumber(schoolInfo.targetPrice)}
                    </div>
                    <span className="text-base text-gray-600">원</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-base font-medium text-gray-700 w-40">
                    1식 단가 상한선
                  </label>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                      {formatNumber(schoolInfo.maxPrice)}
                    </div>
                    <span className="text-base text-gray-600">원</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 시설 현황 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
                시설 현황
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="text-base font-medium text-gray-700 w-40">
                    조리 인력
                  </label>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                      {formatNumber(schoolInfo.staffCount)}
                    </div>
                    <span className="text-base text-gray-600">명</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <label className="text-base font-medium text-gray-700 w-40 pt-2">
                    주요 조리 기구
                  </label>
                  <div className="flex-1">
                    <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700 whitespace-pre-line min-h-[160px]">
                      {schoolInfo.equipmentSummary}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-[72px] border-t border-gray-200 bg-white px-6 flex items-center justify-end gap-3">
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            variant="brand"
            className="px-6 py-2 h-auto inline-flex items-center gap-2"
          >
            {isLoading
              ? "식단표 생성 중"
              : hasGenerated
                ? "식단표 재생성"
                : "식단표 생성"}
          </Button>
          {/* <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            취소
          </button> */}
        </div>
      </div>
    </div>
  );
}

