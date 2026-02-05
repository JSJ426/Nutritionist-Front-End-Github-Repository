import { mockMonthlyOpsDocListResponse } from './mocks/operation/monthlyOps';
import type { DailyRecordsResponse, MonthlyOpsDocListResponse } from '../viewModels/operation';

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

// MonthlyOpsDocCreate 대응

// MonthlyOpsDocList 대응
export const getMonthlyOpsDocListResponse = async (): Promise<MonthlyOpsDocListResponse> =>
  mockMonthlyOpsDocListResponse;

// MonthlyOpsDocDetail 대응

// MonthlyOpsDocDownload 대응
