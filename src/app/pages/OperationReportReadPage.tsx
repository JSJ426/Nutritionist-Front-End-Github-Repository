import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Download,
  FileText,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { Button } from '../components/ui/button';
import { useMonthlyOpsDocDetail } from '../hooks/useMonthlyOpsDocDetail';

interface OperationReportReadPageProps {
  initialParams?: any;
  onNavigate?: (page: string, params?: any) => void;
}

export function OperationReportReadPage({ initialParams, onNavigate }: OperationReportReadPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [numPages, setNumPages] = useState(0);

  const reportId = typeof initialParams?.id === 'number' ? initialParams.id : undefined;
  const { status, data, error } = useMonthlyOpsDocDetail(reportId);

  const pdfUrl = data?.pdfUrl ?? initialParams?.pdfUrl ?? '';
  const displayTitle = data?.title ?? (initialParams?.title ? String(initialParams.title) : '월간 운영 보고서');
  const displayYear = data?.year ?? initialParams?.year;
  const displayMonth = data?.month ?? initialParams?.month;
  const generatedDate = data?.generatedDateText ?? initialParams?.generatedDate ?? '-';
  const downloadFileName = data?.fileName;
  const hasPdf = Boolean(pdfUrl);
  const scale = useMemo(() => zoom / 100, [zoom]);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  }, []);

  useEffect(() => {
    if (!numPages) return;
    setCurrentPage((prev) => Math.min(Math.max(1, prev), numPages));
  }, [numPages]);

  // useEffect(() => {
  //   console.log('[OperationReportReadPage] reportId:', reportId);
  // }, [reportId]);

  // useEffect(() => {
  //   console.log('[OperationReportReadPage] status:', status, 'error:', error);
  // }, [status, error]);

  // useEffect(() => {
  //   if (!data) return;
  //   console.log('[OperationReportReadPage] monthly ops doc detail data:', data);
  // }, [data]);

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
              disabled={!hasPdf}
              onClick={() => {
                if (!pdfUrl) {
                  toast.error('다운로드할 파일 정보가 없습니다.');
                  return;
                }
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.rel = 'noopener';
                if (downloadFileName) {
                  link.download = downloadFileName;
                }
                document.body.appendChild(link);
                link.click();
                link.remove();
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
              {/* <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText size={16} />
                PDF 뷰어
              </div> */}
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
                  {numPages ? ` / ${numPages}` : ''}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasPdf || (numPages ? currentPage >= numPages : false)}
                  onClick={() =>
                    setCurrentPage((prev) => (numPages ? Math.min(numPages, prev + 1) : prev + 1))
                  }
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
              {status === 'loading' ? (
                <div className="h-[70vh] flex flex-col items-center justify-center text-gray-500 gap-3">
                  <FileText size={36} />
                  <div className="text-sm">PDF를 불러오는 중입니다.</div>
                </div>
              ) : status === 'error' ? (
                <div className="h-[70vh] flex flex-col items-center justify-center text-gray-500 gap-3">
                  <FileText size={36} />
                  <div className="text-sm">{error ?? 'PDF를 불러오지 못했습니다.'}</div>
                </div>
              ) : hasPdf ? (
                <div className="h-[70vh] overflow-auto">
                  <div className="flex justify-center py-6">
                    <Document
                      file={pdfUrl}
                      onLoadSuccess={({ numPages: loadedPages }) => setNumPages(loadedPages)}
                      onLoadError={() => toast.error('PDF를 불러오지 못했습니다.')}
                      loading=""
                    >
                      <Page
                        pageNumber={currentPage}
                        scale={scale}
                        renderTextLayer
                        renderAnnotationLayer
                      />
                    </Document>
                  </div>
                </div>
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
