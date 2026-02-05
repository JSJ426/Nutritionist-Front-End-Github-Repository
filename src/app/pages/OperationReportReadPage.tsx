import { useState } from 'react';
import {
  ArrowLeft,
  Download,
  FileText,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Button } from '../components/ui/button';

interface OperationReportReadPageProps {
  initialParams?: any;
  onNavigate?: (page: string, params?: any) => void;
}

export function OperationReportReadPage({ initialParams, onNavigate }: OperationReportReadPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  const pdfUrl = initialParams?.pdfUrl ?? '';
  const displayTitle = initialParams?.title ? String(initialParams.title) : '월간 운영 보고서';
  const displayYear = initialParams?.year;
  const displayMonth = initialParams?.month;
  const generatedDate = initialParams?.generatedDate ?? '-';
  const hasPdf = Boolean(pdfUrl);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
            월간 운영 보고서
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => onNavigate?.('operation-report-list')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              목록으로
            </Button>
            <Button
              className="bg-[#5dccb4] hover:bg-[#4db9a3] text-white flex items-center gap-2"
              onClick={() => {
                if (!hasPdf) {
                  alert('PDF 다운로드는 준비 중입니다.');
                  return;
                }
                window.open(pdfUrl, '_blank');
              }}
            >
              <Download size={16} />
              PDF 다운로드
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-[1400px] mx-auto space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {displayTitle}
                  {displayYear && displayMonth
                    ? ` (${String(displayYear)}년 ${String(displayMonth)}월)`
                    : ''}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span>생성일: {generatedDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText size={16} />
                PDF 뷰어
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasPdf || currentPage <= 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                >
                  <ChevronLeft size={16} />
                </Button>
                <div className="text-sm text-gray-700">
                  페이지 {currentPage}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasPdf}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasPdf || zoom <= 70}
                  onClick={() => setZoom((prev) => Math.max(70, prev - 10))}
                >
                  <ZoomOut size={16} />
                </Button>
                <span className="text-sm text-gray-700 w-14 text-center">{zoom}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasPdf || zoom >= 150}
                  onClick={() => setZoom((prev) => Math.min(150, prev + 10))}
                >
                  <ZoomIn size={16} />
                </Button>
              </div>
            </div>

            <div className="bg-gray-100">
              {hasPdf ? (
                <iframe
                  title="operation-report-pdf"
                  src={pdfUrl}
                  className="w-full h-[70vh]"
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                />
              ) : (
                <div className="h-[70vh] flex flex-col items-center justify-center text-gray-500 gap-3">
                  <FileText size={36} />
                  <div className="text-sm">표시할 PDF가 없습니다.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
