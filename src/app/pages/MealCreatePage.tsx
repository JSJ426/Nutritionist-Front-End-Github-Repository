import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { MealEditCalendar } from "../components/MealEditCalendar";
import { Button } from "../components/ui/button";
import { Upload, FileText, X, Download } from "lucide-react";

export function MealCreatePage() {
  const [extraConstraints, setExtraConstraints] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // 예시: 외부 API 호출
  const handleGenerate = async () => {
    try {
      setIsLoading(true);

      await fetch("https://api.example.com/meals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extraConstraints,
        }),
      });

      alert("식단표가 생성되었습니다.");
    } catch (error) {
      console.error(error);
      alert("식단표 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    alert("적용되었습니다.");
  };

  const handleCancel = () => {
    alert("취소되었습니다.");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const pdfFiles = Array.from(files).filter(
        (file) => file.type === "application/pdf"
      );
      
      if (pdfFiles.length !== files.length) {
        alert("PDF 파일만 업로드 가능합니다.");
      }
      
      if (pdfFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...pdfFiles]);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
          식단표 생성/수정
        </h1>
      </div>

      {/* Content Area with Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="meal-plan" className="h-full flex flex-col">
          <div className="px-6 bg-white border-b border-gray-200 flex-shrink-0">
            <TabsList className="bg-transparent border-b-2 border-gray-200 p-0 h-auto rounded-none">
              <TabsTrigger
                value="meal-plan"
                className="relative px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#5dccb4] data-[state=active]:text-[#5dccb4] data-[state=active]:bg-[#5dccb4]/5 font-medium transition-all"
              >
                식단표
              </TabsTrigger>
              <TabsTrigger
                value="basic-constraints"
                className="relative px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#5dccb4] data-[state=active]:text-[#5dccb4] data-[state=active]:bg-[#5dccb4]/5 font-medium transition-all"
              >
                기본 제한 사항
              </TabsTrigger>
              <TabsTrigger
                value="additional-constraints"
                className="relative px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#5dccb4] data-[state=active]:text-[#5dccb4] data-[state=active]:bg-[#5dccb4]/5 font-medium transition-all"
              >
                제한 사항 (추가)
              </TabsTrigger>
              <TabsTrigger
                value="report-upload"
                className="relative px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#5dccb4] data-[state=active]:text-[#5dccb4] data-[state=active]:bg-[#5dccb4]/5 font-medium transition-all"
              >
                결과 보고서 업로드
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: 식단표 */}
          <TabsContent value="meal-plan" className="flex-1 overflow-hidden m-0 p-0">
            <MealEditCalendar />
          </TabsContent>

          {/* Tab 2: 제한 사항 */}
          <TabsContent value="basic-constraints" className="flex-1 overflow-y-auto m-0 px-6 py-6">
            <div className="space-y-4 max-w-[1200px] mx-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  기관 정보 등록/수정 페이지에서 설정된 내용이 표시됩니다 (읽기 전용)
                </p>
              </div>

              {/* 대상 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
                  대상
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 w-40">
                      대상 연령대
                    </label>
                    <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                      고등학생 (17-19세)
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 w-40">
                      중식 대상 학생 수
                    </label>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                        1,100
                      </div>
                      <span className="text-sm text-gray-600">명</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 w-40">
                      석식 대상 학생 수
                    </label>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                        350
                      </div>
                      <span className="text-sm text-gray-600">명</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 급식 운영 규정 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
                  급식 운영 규정
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <label className="text-sm font-medium text-gray-700 w-40 pt-2">
                      1식 구성
                    </label>
                    <div className="flex-1">
                      <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                        밥 + 국 + 주찬 1 + 부찬 2 + 김치
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <label className="text-sm font-medium text-gray-700 w-40 pt-2">
                      튀김류 제한
                    </label>
                    <div className="flex-1">
                      <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                        주 2회 이하
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <label className="text-sm font-medium text-gray-700 w-40 pt-2">
                      주찬 중복 제한
                    </label>
                    <div className="flex-1">
                      <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                        2주 이내 중복 불가
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 단가 관리 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
                  단가 관리
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 w-40">
                      목표 1식 단가
                    </label>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                        5,500
                      </div>
                      <span className="text-sm text-gray-600">원</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 w-40">
                      1식 단가 상한선
                    </label>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                        6,000
                      </div>
                      <span className="text-sm text-gray-600">원</span>
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
                    <label className="text-sm font-medium text-gray-700 w-40">
                      조리실 면적
                    </label>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                        180
                      </div>
                      <span className="text-sm text-gray-600">㎡</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 w-40">
                      식당 면적
                    </label>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                        450
                      </div>
                      <span className="text-sm text-gray-600">㎡</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 w-40">
                      조리 인력
                    </label>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                        8
                      </div>
                      <span className="text-sm text-gray-600">명</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <label className="text-sm font-medium text-gray-700 w-40 pt-2">
                      주요 조리 기구
                    </label>
                    <div className="flex-1">
                      <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700 whitespace-pre-line">
                        회전식 조리기 2대, 스팀솥 4대, 냉장고 6대 (업소용), 냉동고 3대, 식기세척기 2대, 배식대 10m
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: 제한 사항 (추가) */}
          <TabsContent value="additional-constraints" className="flex-1 overflow-y-auto m-0 px-6 py-6">
            <div className="max-w-[1200px] mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
                  제한 사항 (추가)
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  이번 식단표 생성 시점에서만 추가적으로 적용할 제한사항을 입력하세요.
                </p>
                <textarea
                  value={extraConstraints}
                  onChange={(e) => setExtraConstraints(e.target.value)}
                  placeholder="예: 행사일 특식 반영, 특정 재료 제외, 계절 메뉴 추가 등"
                  className="w-full h-[400px] px-4 py-3 border border-gray-300 rounded resize-none focus:outline-none focus:border-[#5dccb4]"
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab 4: 결과 보고서 업로드 */}
          <TabsContent value="report-upload" className="flex-1 overflow-y-auto m-0 px-6 py-6">
            <div className="max-w-[1200px] mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
                  결과 보고서 업로드
                </h2>
                
                {/* 안내 메시지 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    급식 운영 결과 보고서를 업로드하세요. PDF 파일만 업로드 가능합니다.
                  </p>
                </div>

                {/* 파일 업로드 영역 */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 hover:border-[#5dccb4] transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      파일을 드래그하여 업로드하거나
                    </h3>
                    <label className="cursor-pointer">
                      <Button
                        type="button"
                        className="bg-[#5dccb4] hover:bg-[#4db9a3] text-white"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        파일 선택
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,application/pdf"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-3">
                      PDF 파일만 업로드 가능합니다 (최대 10MB)
                    </p>
                  </div>
                </div>

                {/* 업로드된 파일 목록 */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      업로드된 파일 ({uploadedFiles.length}개)
                    </h3>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="text-red-500" size={24} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)} • {new Date(file.lastModified).toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Download size={14} />
                            다운로드
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 저장 버튼 */}
                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                  <Button
                    onClick={() => alert("결과 보고서가 업로드되었습니다.")}
                    disabled={uploadedFiles.length === 0}
                    className="bg-[#5dccb4] hover:bg-[#4db9a3] text-white"
                  >
                    업로드
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="h-[72px] border-t border-gray-200 bg-white px-6 flex items-center justify-end gap-3">
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-6 py-2 bg-[#5dccb4] text-white rounded hover:bg-[#4fb9a3] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "생성 중..." : "식단표 생성"}
        </button>
        <button
          onClick={handleApply}
          className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          적용
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          취소
        </button>
      </div>
    </div>
  );
}