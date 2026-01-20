import { useState } from 'react';
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
import { Download, FileText, Calendar } from 'lucide-react';

interface Report {
  id: number;
  year: number;
  month: number;
  title: string;
  generatedDate: string;
  fileSize: string;
}

// 샘플 데이터
const mockReports: Report[] = [
  { id: 1, year: 2026, month: 1, title: '2026년 1월 급식 운영 보고서', generatedDate: '2026-01-15', fileSize: '2.3 MB' },
  { id: 2, year: 2025, month: 12, title: '2025년 12월 급식 운영 보고서', generatedDate: '2026-01-05', fileSize: '2.1 MB' },
  { id: 3, year: 2025, month: 11, title: '2025년 11월 급식 운영 보고서', generatedDate: '2025-12-05', fileSize: '2.4 MB' },
  { id: 4, year: 2025, month: 10, title: '2025년 10월 급식 운영 보고서', generatedDate: '2025-11-05', fileSize: '2.2 MB' },
  { id: 5, year: 2025, month: 9, title: '2025년 9월 급식 운영 보고서', generatedDate: '2025-10-05', fileSize: '2.0 MB' },
  { id: 6, year: 2025, month: 8, title: '2025년 8월 급식 운영 보고서', generatedDate: '2025-09-05', fileSize: '1.8 MB' },
  { id: 7, year: 2025, month: 7, title: '2025년 7월 급식 운영 보고서', generatedDate: '2025-08-05', fileSize: '2.1 MB' },
  { id: 8, year: 2025, month: 6, title: '2025년 6월 급식 운영 보고서', generatedDate: '2025-07-05', fileSize: '2.3 MB' },
  { id: 9, year: 2025, month: 5, title: '2025년 5월 급식 운영 보고서', generatedDate: '2025-06-05', fileSize: '2.2 MB' },
  { id: 10, year: 2025, month: 4, title: '2025년 4월 급식 운영 보고서', generatedDate: '2025-05-05', fileSize: '2.1 MB' },
];

export function OperationReportPage() {
  const [reports] = useState<Report[]>(mockReports);
  const [selectedYear, setSelectedYear] = useState('전체');
  const [selectedMonth, setSelectedMonth] = useState('전체');

  // 연도 목록 생성
  const years = ['전체', ...Array.from(new Set(reports.map(r => r.year))).sort((a, b) => b - a).map(String)];
  
  // 월 목록
  const months = ['전체', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  // 필터링된 보고서
  const filteredReports = reports.filter(report => {
    const matchesYear = selectedYear === '전체' || report.year === Number(selectedYear);
    const matchesMonth = selectedMonth === '전체' || report.month === Number(selectedMonth);
    return matchesYear && matchesMonth;
  });

  const handleDownload = (report: Report) => {
    // 실제로는 파일 다운로드 API 호출
    alert(`${report.title}을(를) 다운로드합니다.`);
  };

  const handleView = (report: Report) => {
    // 실제로는 PDF 뷰어 열기
    alert(`${report.title}을(를) 조회합니다.`);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
          운영 보고서
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-[1400px] mx-auto">
          {/* 안내 메시지 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              월별 급식 운영 보고서를 조회하고 다운로드할 수 있습니다. 보고서는 매월 초에 자동으로 생성됩니다.
            </p>
          </div>

          {/* 필터 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">기간 선택:</span>
              </div>
              <div className="w-40">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="연도 선택" />
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
              <div className="w-32">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="월 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month} value={month}>
                        {month === '전체' ? '전체' : `${month}월`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1"></div>
              <div className="text-sm text-gray-600">
                총 <span className="font-medium text-[#5dccb4]">{filteredReports.length}</span>건
              </div>
            </div>
          </div>

          {/* 보고서 목록 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-20 text-center">번호</TableHead>
                  <TableHead className="w-32 text-center">기간</TableHead>
                  <TableHead>보고서명</TableHead>
                  <TableHead className="w-32 text-center">생성일</TableHead>
                  <TableHead className="w-32 text-center">파일 크기</TableHead>
                  <TableHead className="w-48 text-center">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report, index) => (
                    <TableRow key={report.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="text-center text-sm">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <FileText size={16} className="text-gray-400" />
                          <span className="text-sm font-medium">
                            {report.year}.{String(report.month).padStart(2, '0')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{report.title}</TableCell>
                      <TableCell className="text-center text-sm text-gray-600">
                        {report.generatedDate}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-600">
                        {report.fileSize}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(report)}
                            className="flex items-center gap-1"
                          >
                            <FileText size={14} />
                            조회
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDownload(report)}
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

          {/* 보고서 내용 설명 */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium mb-4">운영 보고서 포함 내용</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#5dccb4] rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-sm mb-1">급식 운영 현황</h4>
                  <p className="text-sm text-gray-600">식수 인원, 제공 횟수, 운영 일수 등</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#5dccb4] rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-sm mb-1">만족도 분석</h4>
                  <p className="text-sm text-gray-600">월간 만족도 평균, 증감 추이</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#5dccb4] rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-sm mb-1">결식률 및 잔반량</h4>
                  <p className="text-sm text-gray-600">결식률 통계, 잔반량 추이</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#5dccb4] rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-sm mb-1">인기 메뉴</h4>
                  <p className="text-sm text-gray-600">월간 인기 메뉴 Top 10</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#5dccb4] rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-sm mb-1">건의사항</h4>
                  <p className="text-sm text-gray-600">접수된 건의사항 및 처리 현황</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#5dccb4] rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-sm mb-1">개선 계획</h4>
                  <p className="text-sm text-gray-600">다음 달 개선 방향</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
