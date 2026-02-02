import { AlertCircle } from 'lucide-react';

interface SummaryMissedProps {
  analysis: {
    trend: string;
    trendColor: string;
    maxDate: string;
    maxRate: string;
    variationDate: string;
    maxVariation: string;
    exceedCount: number;
    avgRate: string;
  };
  targetRate: number;
}

export function SummaryMissed({ analysis, targetRate }: SummaryMissedProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 mb-6 border border-blue-100">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-3">자동 분석 요약</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p className="flex items-start gap-2">
              <span className="text-blue-600 font-medium">•</span>
              <span>
                이번 기간 평균 결식률은 <span className={`font-medium ${analysis.trendColor}`}>
                  전주 대비 {analysis.trend}
                </span>했습니다. (평균 {analysis.avgRate}%)
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 font-medium">•</span>
              <span>
                결식률이 가장 높았던 날짜는 <span className="font-medium text-red-600">
                  {analysis.maxDate} ({analysis.maxRate}%)
                </span>입니다.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 font-medium">•</span>
              <span>
                {analysis.variationDate}에 결식률 변동 폭이 <span className="font-medium">
                  {analysis.maxVariation}%p
                </span>로 크게 나타났습니다.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 font-medium">•</span>
              <span>
                전체 기간 중 <span className={`font-medium ${analysis.exceedCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  {analysis.exceedCount}일
                </span>이 관리 목표 기준선({targetRate}%)을 초과했습니다.
              </span>
            </p>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-xs text-gray-600">
                💡 <span className="font-medium">활용 제안:</span> 결식률이 높은 날짜의 식단 구성, 요일별 패턴, 학교 일정 등을 분석하여 개선 방안을 수립할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
