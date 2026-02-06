import { http, httpDownload } from './http';
import type {
  DailyRecordsResponse,
  MonthlyOpsDocCreateResponse,
  MonthlyOpsDocDetailResponse,
  MonthlyOpsDocListResponse,
} from '../viewModels/operation';

type DailyRecord = {
  lunchMissed: number;
  lunchLeftoversKg: number;
  dinnerMissed: number;
  dinnerLeftoversKg: number;
};

export const getInitialDailyRecords = async (): Promise<DailyRecordsResponse> => ({
  status: 'success',
  data: {},
});

export type MonthlyOpsDocCreatePayload = {
  year: number;
  month: number;
  title: string;
};

// MonthlyOpsDocCreate 대응
export const createMonthlyOpsDoc = async (
  payload: MonthlyOpsDocCreatePayload
): Promise<MonthlyOpsDocCreateResponse> => {
  const response = await http.post<MonthlyOpsDocCreateResponse>('/reports/monthly', payload);

  // report_content 등 불필요한 필드는 파싱 단계에서 제외
  return {
    status: response.status,
    message: response.message,
    data: {
      id: response.data.id,
      school_id: response.data.school_id,
      title: response.data.title,
      year: response.data.year,
      month: response.data.month,
      status: response.data.status,
      created_at: response.data.created_at,
      files: response.data.files.map((file) => ({
        id: file.id,
        file_name: file.file_name,
        file_type: file.file_type,
        s3_path: file.s3_path,
        created_at: file.created_at,
      })),
    },
  };
};

export type MonthlyOpsDocListQuery = {
  year?: number;
  page?: number;
  size?: number;
};

// MonthlyOpsDocList 대응
export const getMonthlyOpsDocListResponse = async (
  query: MonthlyOpsDocListQuery = {}
): Promise<MonthlyOpsDocListResponse> => {
  const params = new URLSearchParams();
  if (typeof query.year === 'number') {
    params.set('year', String(query.year));
  }
  if (typeof query.page === 'number') {
    params.set('page', String(query.page));
  }
  if (typeof query.size === 'number') {
    params.set('size', String(query.size));
  }

  const queryString = params.toString();
  const url = queryString ? `/reports/monthly?${queryString}` : '/reports/monthly';
  const response = await http.get<MonthlyOpsDocListResponse>(url);

  // report_content 등 불필요한 필드는 파싱 단계에서 제외
  return {
    status: response.status,
    data: {
      reports: response.data.reports.map((report) => ({
        id: report.id,
        school_id: report.school_id,
        title: report.title,
        year: report.year,
        month: report.month,
        status: report.status,
        created_at: report.created_at,
      })),
      pagination: response.data.pagination,
    },
  };
};

// MonthlyOpsDocDetail 대응
export const getMonthlyOpsDocDetail = async (
  reportId: number
): Promise<MonthlyOpsDocDetailResponse> => {
  const response = await http.get<MonthlyOpsDocDetailResponse>(`/reports/monthly/${reportId}`);

  return {
    status: response.status,
    data: {
      id: response.data.id,
      school_id: response.data.school_id,
      title: response.data.title,
      year: response.data.year,
      month: response.data.month,
      status: response.data.status,
      created_at: response.data.created_at,
      files: response.data.files.map((file) => ({
        id: file.id,
        file_name: file.file_name,
        file_type: file.file_type,
        s3_path: file.s3_path,
        s3_url: file.s3_url,
        created_at: file.created_at,
      })),
    },
  };
};

// MonthlyOpsDocDownload 대응
export const downloadMonthlyOpsDoc = async (reportId: number): Promise<Blob> =>
  httpDownload(`/reports/monthly/${reportId}/download`);
