import { useEffect, useState } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';

import { getMonthlyOpsDocListResponse } from '../data/operation';

import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Pagination } from '../components/Pagination';

import {
  getOperationReportYearOptions,
  toOperationReportItemsVM,
  toOperationReportsFromMonthlyOps,
} from '../viewModels/operation';

interface Report {
  id: number;
  year: number;
  month: number;
  title: string;
  generatedDate: string;
  fileSize: string;
}

interface OperationReportListPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function OperationReportListPage({ onNavigate }: OperationReportListPageProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      const response = await getMonthlyOpsDocListResponse();
      if (!isActive) return;
      setReports(toOperationReportsFromMonthlyOps(response));
      setIsLoading(false);
    };
    load();
    return () => {
      isActive = false;
    };
  }, []);

  // 연도 목록 생성
  const years = getOperationReportYearOptions(reports);

  // 필터링된 보고서
  const filteredReports = reports.filter(report => {
    const matchesYear = selectedYear === '전체' || report.year === Number(selectedYear);
    return matchesYear;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);
  const paginatedReportsVm = toOperationReportItemsVM(paginatedReports);

  useEffect(() => {
    if (totalPages === 0) {
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
      return;
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDownload = (report: Report) => {
    // 실제로는 파일 다운로드 API 호출
    alert(`${report.title}을(를) 다운로드합니다.`);
  };

  const handleView = (report: Report) => {
    onNavigate?.('operation-report-read', {
      reportId: report.id,
      title: report.title,
      year: report.year,
      month: report.month,
    });
  };

  const handleGenerateMonthlyReport = () => {
    const now = new Date();
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const year = previousMonth.getFullYear();
    const month = previousMonth.getMonth() + 1;

    const alreadyExists = reports.some(report => report.year === year && report.month === month);
    if (alreadyExists) {
      alert('직전월 운영 보고서는 이미 생성되어 있습니다.');
      return;
    }

    const nextId = reports.reduce((maxId, report) => Math.max(maxId, report.id), 0) + 1;
    const generatedDate = now.toISOString().slice(0, 10);
    const newReport: Report = {
      id: nextId,
      year,
      month,
      title: `${year}년 ${month}월 급식 운영 보고서`,
      generatedDate,
      fileSize: '2.0 MB',
    };

    setReports([newReport, ...reports]);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
          <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
            월별 운영 기록
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
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
          월별 운영 기록
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-[1400px] mx-auto">

          {/* 필터 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">연도 선택:</span>
              </div>
              <div className="w-40">
                <Select
                  value={selectedYear}
                  onValueChange={(value) => {
                    setSelectedYear(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="(연도)" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>
                        {year === '전체' ? '전체' : `${year}년`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-gray-600">
                총 <span className="font-medium text-[#5dccb4]">{filteredReports.length}</span>건
              </div>
              <div className="flex-1"></div>
              <Button
                onClick={handleGenerateMonthlyReport}
                className="bg-[#5dccb4] hover:bg-[#4db9a3] text-white"
              >
                월간 운영 보고서 생성
              </Button>
            </div>
          </div>

          {/* 보고서 목록 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-24 text-center">번호</TableHead>
                  <TableHead className="w-24 text-center">년</TableHead>
                  <TableHead className="w-24 text-center">월</TableHead>
                  <TableHead></TableHead>
                  <TableHead className="w-32 text-center">생성일</TableHead>
                  <TableHead className="w-96 text-center">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReportsVm.length > 0 ? (
                  paginatedReportsVm.map((report, index) => (
                    <TableRow key={report.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="text-center text-sm">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium">
                        {report.yearText}
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium">
                        {report.monthText}
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium">
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-600">
                        {report.generatedDateText}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(paginatedReports[index])}
                            className="flex items-center gap-1"
                          >
                            <FileText size={14} />
                            조회
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDownload(paginatedReports[index])}
                            className="bg-[#5dccb4] hover:bg-[#4db9a3] text-white flex items-center gap-1"
                          >
                            <Download size={14} />
                            다운로드
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-12">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

        </div>
      </div>
    </div>
  );
}
