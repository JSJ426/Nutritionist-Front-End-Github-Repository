import { formatDateYmd } from './shared';

export type OperationReport = {
  id: number;
  year: number;
  month: number;
  title: string;
  generatedDate: string;
  fileSize: string;
};

export type OperationReportItemVM = {
  id: number;
  yearText: string;
  monthText: string;
  title: string;
  generatedDateText: string;
  fileSizeText: string;
};

export type DailyRecordsResponse = {
  status: string;
  data: Record<
    string,
    {
      lunchMissed: number;
      lunchLeftoversKg: number;
      dinnerMissed: number;
      dinnerLeftoversKg: number;
    }
  >;
};

export type MonthlyOpsDocCreateResponse = {
  status: string;
  message: string;
  data: {
    id: number;
    school_id: number;
    title: string;
    year: number;
    month: number;
    status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
    created_at: string;
    files: Array<{
      id: number;
      file_name: string;
      file_type: string;
      s3_path: string;
      s3_url?: string;
      created_at: string;
    }>;
  };
};

export type MonthlyOpsDocListResponse = {
  status: string;
  data: {
    reports: Array<{
      id: number;
      school_id: number;
      title: string;
      year: number;
      month: number;
      status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
      created_at: string;
    }>;
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      page_size: number;
    };
  };
};

export type MonthlyOpsDocListVM = {
  items: OperationReport[];
  pagination: MonthlyOpsDocListResponse['data']['pagination'];
};

export type MonthlyOpsDocDetailResponse = {
  status: string;
  data: {
    id: number;
    school_id: number;
    title: string;
    year: number;
    month: number;
    status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
    created_at: string;
    files: Array<{
      id: number;
      file_name: string;
      file_type: string;
      s3_path: string;
      s3_url?: string;
      created_at: string;
    }>;
  };
};

export type MonthlyOpsDocDetailVM = {
  id: number;
  title: string;
  year: number;
  month: number;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  generatedDateText: string;
  pdfUrl: string;
  fileName: string;
  fileType: string;
};

export const toOperationReportItemsVM = (reports: OperationReport[]): OperationReportItemVM[] => {
  return reports.map((report) => ({
    id: report.id,
    yearText: String(report.year),
    monthText: String(report.month).padStart(2, '0'),
    title: report.title,
    generatedDateText: formatDateYmd(report.generatedDate),
    fileSizeText: report.fileSize || '-',
  }));
};

export const toOperationReportsFromMonthlyOps = (
  raw: MonthlyOpsDocListResponse
): OperationReport[] =>
  raw.data.reports.map((report) => ({
    id: report.id,
    year: report.year,
    month: report.month,
    title: report.title,
    generatedDate: report.created_at,
    fileSize: report.status === 'COMPLETED' ? '2.0 MB' : '-',
  }));

export const toMonthlyOpsDocListVM = (
  raw: MonthlyOpsDocListResponse
): MonthlyOpsDocListVM => ({
  items: toOperationReportsFromMonthlyOps(raw),
  pagination: raw.data.pagination,
});

export const toMonthlyOpsDocDetailVM = (
  raw: MonthlyOpsDocDetailResponse
): MonthlyOpsDocDetailVM => ({
  id: raw.data.id,
  title: raw.data.title,
  year: raw.data.year,
  month: raw.data.month,
  status: raw.data.status,
  generatedDateText: formatDateYmd(raw.data.created_at),
  pdfUrl: raw.data.files?.[0]?.s3_url ?? '',
  fileName: raw.data.files?.[0]?.file_name ?? '',
  fileType: raw.data.files?.[0]?.file_type ?? '',
});

export const getOperationReportYearOptions = (reports: OperationReport[]): string[] => {
  const years = Array.from(new Set(reports.map((r) => r.year)))
    .sort((a, b) => b - a)
    .map(String);
  return ['전체', ...years];
};
