import { useCallback, useEffect, useReducer } from 'react';

import { getMonthlyOpsDocDetail } from '../data/operation';
import { toMonthlyOpsDocDetailVM, type MonthlyOpsDocDetailVM } from '../viewModels/operation';

type State = {
  status: 'idle' | 'loading' | 'success' | 'error';
  data?: MonthlyOpsDocDetailVM;
  error?: string;
};

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: MonthlyOpsDocDetailVM }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'RESET' };

const initialState: State = {
  status: 'idle',
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_START':
      return { status: 'loading' };
    case 'FETCH_SUCCESS':
      return { status: 'success', data: action.payload };
    case 'FETCH_ERROR':
      return { status: 'error', error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const useMonthlyOpsDocDetail = (reportId?: number) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchDetail = useCallback(async () => {
    if (typeof reportId !== 'number') {
      dispatch({ type: 'RESET' });
      return;
    }

    dispatch({ type: 'FETCH_START' });
    try {
      const response = await getMonthlyOpsDocDetail(reportId);
      dispatch({ type: 'FETCH_SUCCESS', payload: toMonthlyOpsDocDetailVM(response) });
    } catch (error) {
      const message = error instanceof Error ? error.message : '데이터를 불러오지 못했습니다.';
      dispatch({ type: 'FETCH_ERROR', payload: message });
    }
  }, [reportId]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  return {
    ...state,
    refetch: fetchDetail,
  };
};
