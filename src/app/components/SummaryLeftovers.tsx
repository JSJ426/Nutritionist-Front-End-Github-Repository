import { AlertCircle } from 'lucide-react';

interface SummaryLeftoversProps {
  analysis: {
    trend: string;
    trendColor: string;
    maxDate: string;
    maxAmount: string;
    variationDate: string;
    maxVariation: string;
    exceedCount: number;
    avgAmount: string;
  };
  targetAmount: number;
}

export function SummaryLeftovers({ analysis, targetAmount }: SummaryLeftoversProps) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg shadow-sm p-6 mb-6 border border-orange-100">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-3">자동 분석 요약</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p className="flex items-start gap-2">
              <span className="text-orange-600 font-medium">•</span>
              <span>
                이번 기간 평균 잔반량은 <span className={`font-medium ${analysis.trendColor}`}>
                  전주 대비 {analysis.trend}
                </span>했습니다. (평균 {analysis.avgAmount}kg)
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-orange-600 font-medium">•</span>
              <span>
                잔반량이 가장 많았던 날짜는 <span className="font-medium text-red-600">
                  {analysis.maxDate} ({analysis.maxAmount}kg)
                </span>입니다.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-orange-600 font-medium">•</span>
              <span>
                {analysis.variationDate}에 잔반량 변동 폭이 <span className="font-medium">
                  {analysis.maxVariation}kg
                </span>로 크게 나타났습니다.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-orange-600 font-medium">•</span>
              <span>
                전체 기간 중 <span className={`font-medium ${analysis.exceedCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  {analysis.exceedCount}일
                </span>이 관리 목표 기준선({targetAmount}kg)을 초과했습니다.
              </span>
            </p>
            <div className="mt-4 pt-4 border-t border-orange-200">
              <p className="text-xs text-gray-600">
                💡 <span className="font-medium">활용 제안:</span> 잔반량이 많은 날짜의 메뉴 구성, 식사 유형, 요일별 패턴을 분석하여 식단 개선 및 조리 수량 최적화 방안을 수립할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
