import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { useAuth } from './auth/AuthContext';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AdditionalMenuCreatePage } from './pages/AdditionalMenuCreatePage';
import { AdditionalMenuEditPage } from './pages/AdditionalMenuEditPage';
import { AdditionalMenuListPage } from './pages/AdditionalMenuListPage';
import { AdditionalMenuReadPage } from './pages/AdditionalMenuReadPage';
import { BoardEditPage } from './pages/BoardEditPage';
import { BoardListPage } from './pages/BoardListPage';
import { BoardReadPage } from './pages/BoardReadPage';
import { BoardWritePage } from './pages/BoardWritePage';
import { FindIdPage } from './pages/FindIdPage';
import { FindPasswordPage } from './pages/FindPasswordPage';
import { FoodInfoPage } from './pages/FoodInfoPage';
import { FoodListPage } from './pages/FoodListPage';
import { HomePage } from './pages/HomePage';
import { InstitutionInfoEditPage } from './pages/InstitutionInfoEditPage';
import { InstitutionInfoPage } from './pages/InstitutionInfoPage';
import { LoginPage } from './pages/LoginPage';
import { MealCreatePage } from './pages/MealCreatePage';
import { MealEditPage } from './pages/MealEditPage';
import { MealHistoryPage } from './pages/MealHistoryPage';
import { MealMonthlyPage } from './pages/MealMonthlyPage';
import { NutritionistInfoPage } from './pages/NutritionistInfoPage';
import { NutritionistWithdrawalPage } from './pages/NutritionistWithdrawalPage';
import { OperationRecordDailyPage } from './pages/OperationRecordDailyPage';
import { OperationReportListPage } from './pages/OperationReportListPage';
import { OperationReportReadPage } from './pages/OperationReportReadPage';
import { SchoolSignupPage } from './pages/SchoolSignupPage';
import { StatsLeftoversPage } from './pages/StatsLeftoversPage';
import { StatsMissedPage } from './pages/StatsMissedPage';
import { StatsSatisfactionPage } from './pages/StatsSatisfactionPage';

const PAGE_PATHS = {
  login: '/login',
  'school-signup': '/school-signup',
  'find-id': '/find-id',
  'find-password': '/find-password',
  home: '/home',
  'meal-monthly': '/meal/monthly',
  'meal-create': '/meal/create',
  'meal-edit': '/meal/edit',
  'meal-history': '/meal/history',
  'food-list': '/food',
  'food-info': '/food/detail',
  'additional-menu-list': '/additional-menu',
  'additional-menu-write': '/additional-menu/create',
  'additional-menu-read': '/additional-menu/detail',
  'additional-menu-edit': '/additional-menu/edit',
  'stats-missed': '/stats/missed',
  'stats-leftovers': '/stats/leftovers',
  'stats-satisfaction': '/stats/satisfaction',
  'operation-record': '/operation/record',
  'operation-report-list': '/operation/report',
  'operation-report-read': '/operation/report/detail',
  'board-list': '/board',
  'board-read': '/board/detail',
  'board-write': '/board/write',
  'board-edit': '/board/edit',
  'nutritionist-info': '/nutritionist/info',
  'nutritionist-withdrawal': '/nutritionist/withdrawal',
  'institution-info': '/institution/info',
  'institution-info-edit': '/institution/info/edit',
} as const;

type PageKey = keyof typeof PAGE_PATHS;
const DEFAULT_GUEST_PAGE: PageKey = 'login';
const DEFAULT_AUTH_PAGE: PageKey = 'home';
const GUEST_PAGES = new Set<PageKey>(['login', 'school-signup', 'find-id', 'find-password']);

const PATH_TO_PAGE = Object.entries(PAGE_PATHS).reduce<Record<string, PageKey>>((acc, [page, path]) => {
  acc[path] = page as PageKey;
  return acc;
}, {});

function parseLegacyData(searchParams: URLSearchParams): any {
  const encoded = searchParams.get('data');
  if (!encoded) return null;
  try {
    return JSON.parse(decodeURIComponent(encoded));
  } catch {
    return null;
  }
}

const PAGE_QUERY_CODECS: Partial<
  Record<
    PageKey,
    {
      decode: (searchParams: URLSearchParams) => any;
      encode: (params: any, searchParams: URLSearchParams) => void;
    }
  >
> = {
  'meal-edit': {
    decode: (searchParams) => ({
      date: searchParams.get('date') ?? undefined,
    }),
    encode: (params, searchParams) => {
      if (typeof params?.date === 'string' && params.date) {
        searchParams.set('date', params.date);
      }
    },
  },
  'food-info': {
    decode: (searchParams) => ({
      foodId: searchParams.get('foodId') ?? undefined,
    }),
    encode: (params, searchParams) => {
      if (params?.foodId !== undefined && params?.foodId !== null) {
        searchParams.set('foodId', String(params.foodId));
      }
    },
  },
  'additional-menu-list': {
    decode: (searchParams) => ({
      deletedId: searchParams.get('deletedId') ?? undefined,
    }),
    encode: (params, searchParams) => {
      if (params?.deletedId !== undefined && params?.deletedId !== null) {
        searchParams.set('deletedId', String(params.deletedId));
      }
    },
  },
  'additional-menu-read': {
    decode: (searchParams) => ({
      menuId: searchParams.get('menuId') ?? undefined,
    }),
    encode: (params, searchParams) => {
      if (params?.menuId !== undefined && params?.menuId !== null) {
        searchParams.set('menuId', String(params.menuId));
      }
    },
  },
  'additional-menu-edit': {
    decode: (searchParams) => ({
      menuId: searchParams.get('menuId') ?? undefined,
    }),
    encode: (params, searchParams) => {
      if (params?.menuId !== undefined && params?.menuId !== null) {
        searchParams.set('menuId', String(params.menuId));
      }
    },
  },
  'board-list': {
    decode: (searchParams) => ({
      refresh: searchParams.get('refresh') === '1',
      deletedId: searchParams.get('deletedId') ?? undefined,
    }),
    encode: (params, searchParams) => {
      if (params?.refresh) {
        searchParams.set('refresh', '1');
      }
      if (params?.deletedId !== undefined && params?.deletedId !== null) {
        searchParams.set('deletedId', String(params.deletedId));
      }
    },
  },
  'board-read': {
    decode: (searchParams) => {
      const rawPostId = searchParams.get('postId');
      const postId = rawPostId ? Number(rawPostId) : undefined;
      return {
        postId: Number.isFinite(postId) ? postId : undefined,
      };
    },
    encode: (params, searchParams) => {
      if (params?.postId !== undefined && params?.postId !== null) {
        searchParams.set('postId', String(params.postId));
      }
    },
  },
  'board-edit': {
    decode: (searchParams) => {
      const rawPostId = searchParams.get('postId');
      const postId = rawPostId ? Number(rawPostId) : undefined;
      return {
        postId: Number.isFinite(postId) ? postId : undefined,
      };
    },
    encode: (params, searchParams) => {
      if (params?.postId !== undefined && params?.postId !== null) {
        searchParams.set('postId', String(params.postId));
      }
    },
  },
  'operation-report-read': {
    decode: (searchParams) => {
      const rawId = searchParams.get('id');
      const id = rawId ? Number(rawId) : undefined;
      return {
        id: Number.isFinite(id) ? id : undefined,
      };
    },
    encode: (params, searchParams) => {
      if (params?.id !== undefined && params?.id !== null) {
        searchParams.set('id', String(params.id));
      }
    },
  },
};

function decodeNavigationParams(page: PageKey, search: string, state: unknown): any {
  const searchParams = new URLSearchParams(search);
  const queryDecoded = PAGE_QUERY_CODECS[page]?.decode(searchParams) ?? null;
  const legacyData = parseLegacyData(searchParams);
  const stateParams =
    typeof state === 'object' && state !== null ? (state as Record<string, unknown>) : null;

  if (queryDecoded && typeof queryDecoded === 'object') {
    return { ...(legacyData ?? {}), ...(stateParams ?? {}), ...queryDecoded };
  }
  if (legacyData) return legacyData;
  return state ?? null;
}

function encodeNavigationParams(page: PageKey, params?: any): string {
  if (!params) return '';

  const searchParams = new URLSearchParams();
  const codec = PAGE_QUERY_CODECS[page];
  if (codec) {
    codec.encode(params, searchParams);
  } else {
    searchParams.set('data', encodeURIComponent(JSON.stringify(params)));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

function AppShell({
  currentPage,
  schoolName,
  onLogout,
  onNavigate,
  children,
}: {
  currentPage: PageKey;
  schoolName: string | null;
  onLogout: () => void;
  onNavigate: (page: string, params?: any) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header
        onLogout={onLogout}
        schoolName={schoolName}
        onLogoClick={() => onNavigate('home')}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPage={currentPage} onPageChange={onNavigate} />
        <div className="flex-1 overflow-auto flex flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isReady, logout, schoolName } = useAuth();

  const currentPage = PATH_TO_PAGE[location.pathname] ?? (isAuthenticated ? DEFAULT_AUTH_PAGE : DEFAULT_GUEST_PAGE);
  const pageParams = useMemo(
    () => decodeNavigationParams(currentPage, location.search, location.state),
    [currentPage, location.search, location.state]
  );

  const navigateTo = (page: string, params?: any, replace = false) => {
    const targetPage =
      (page as PageKey) in PAGE_PATHS
        ? (page as PageKey)
        : (isAuthenticated ? DEFAULT_AUTH_PAGE : DEFAULT_GUEST_PAGE);
    const targetPath = PAGE_PATHS[targetPage];
    const target = `${targetPath}${encodeNavigationParams(targetPage, params)}`;
    navigate(target, { replace, state: params ?? null });
  };

  const handleNavigate = (page: string, params?: any) => {
    navigateTo(page, params);
  };

  const handleLoginSuccess = () => {
    navigateTo(DEFAULT_AUTH_PAGE, null, true);
  };

  const handleLogout = () => {
    logout();
    navigateTo(DEFAULT_GUEST_PAGE, null, true);
  };

  const renderProtected = (page: PageKey, content: ReactNode) => {
    if (!isAuthenticated) {
      return <Navigate to={PAGE_PATHS[DEFAULT_GUEST_PAGE]} replace />;
    }
    return (
      <AppShell
        currentPage={page}
        schoolName={schoolName}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      >
        {content}
      </AppShell>
    );
  };

  const renderGuest = (content: ReactNode) => {
    if (isAuthenticated) {
      return <Navigate to={PAGE_PATHS[DEFAULT_AUTH_PAGE]} replace />;
    }
    return content;
  };

  if (!isReady) {
    return (
      <>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">HOME</h1>
          </div>
          <div className="flex items-center justify-center text-gray-500 py-12">
            데이터를 불러오는 중입니다.
          </div>
        </div>
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={PAGE_PATHS[isAuthenticated ? DEFAULT_AUTH_PAGE : DEFAULT_GUEST_PAGE]} replace />} />

        <Route
          path={PAGE_PATHS.login}
          element={renderGuest(<LoginPage onLogin={handleLoginSuccess} onNavigate={handleNavigate} />)}
        />
        <Route
          path={PAGE_PATHS['school-signup']}
          element={renderGuest(<SchoolSignupPage onNavigate={handleNavigate} />)}
        />
        <Route
          path={PAGE_PATHS['find-id']}
          element={renderGuest(<FindIdPage onNavigate={handleNavigate} />)}
        />
        <Route
          path={PAGE_PATHS['find-password']}
          element={renderGuest(<FindPasswordPage onNavigate={handleNavigate} />)}
        />

        <Route path={PAGE_PATHS.home} element={renderProtected('home', <HomePage />)} />
        <Route
          path={PAGE_PATHS['meal-monthly']}
          element={renderProtected('meal-monthly', <MealMonthlyPage onNavigate={handleNavigate} />)}
        />
        <Route
          path={PAGE_PATHS['meal-create']}
          element={renderProtected('meal-create', <MealCreatePage onNavigate={handleNavigate} />)}
        />
        <Route
          path={PAGE_PATHS['meal-edit']}
          element={renderProtected('meal-edit', <MealEditPage initialParams={pageParams} />)}
        />
        <Route path={PAGE_PATHS['meal-history']} element={renderProtected('meal-history', <MealHistoryPage />)} />
        <Route
          path={PAGE_PATHS['food-list']}
          element={renderProtected('food-list', <FoodListPage onNavigate={handleNavigate} />)}
        />
        <Route
          path={PAGE_PATHS['food-info']}
          element={renderProtected('food-info', <FoodInfoPage initialParams={pageParams} onNavigate={handleNavigate} />)}
        />
        <Route path={PAGE_PATHS['stats-missed']} element={renderProtected('stats-missed', <StatsMissedPage />)} />
        <Route
          path={PAGE_PATHS['stats-leftovers']}
          element={renderProtected('stats-leftovers', <StatsLeftoversPage />)}
        />
        <Route
          path={PAGE_PATHS['stats-satisfaction']}
          element={renderProtected('stats-satisfaction', <StatsSatisfactionPage onNavigate={handleNavigate} />)}
        />
        <Route
          path={PAGE_PATHS['operation-record']}
          element={renderProtected('operation-record', <OperationRecordDailyPage />)}
        />
        <Route
          path={PAGE_PATHS['operation-report-list']}
          element={renderProtected('operation-report-list', <OperationReportListPage onNavigate={handleNavigate} />)}
        />
        <Route
          path={PAGE_PATHS['operation-report-read']}
          element={renderProtected(
            'operation-report-read',
            <OperationReportReadPage initialParams={pageParams} onNavigate={handleNavigate} />
          )}
        />
        <Route
          path={PAGE_PATHS['board-list']}
          element={renderProtected('board-list', <BoardListPage initialParams={pageParams} onNavigate={handleNavigate} />)}
        />
        <Route
          path={PAGE_PATHS['board-read']}
          element={renderProtected('board-read', <BoardReadPage initialParams={pageParams} onNavigate={handleNavigate} />)}
        />
        <Route
          path={PAGE_PATHS['board-write']}
          element={renderProtected('board-write', <BoardWritePage onNavigate={handleNavigate} />)}
        />
        <Route
          path={PAGE_PATHS['board-edit']}
          element={renderProtected('board-edit', <BoardEditPage initialParams={pageParams} onNavigate={handleNavigate} />)}
        />
        <Route
          path={PAGE_PATHS['additional-menu-list']}
          element={renderProtected(
            'additional-menu-list',
            <AdditionalMenuListPage initialParams={pageParams} onNavigate={handleNavigate} />
          )}
        />
        <Route
          path={PAGE_PATHS['additional-menu-write']}
          element={renderProtected('additional-menu-write', <AdditionalMenuCreatePage onNavigate={handleNavigate} />)}
        />
        <Route
          path={PAGE_PATHS['additional-menu-read']}
          element={renderProtected(
            'additional-menu-read',
            <AdditionalMenuReadPage initialParams={pageParams} onNavigate={handleNavigate} />
          )}
        />
        <Route
          path={PAGE_PATHS['additional-menu-edit']}
          element={renderProtected(
            'additional-menu-edit',
            <AdditionalMenuEditPage initialParams={pageParams} onNavigate={handleNavigate} />
          )}
        />
        <Route
          path={PAGE_PATHS['nutritionist-info']}
          element={renderProtected('nutritionist-info', <NutritionistInfoPage onNavigate={handleNavigate} />)}
        />
        <Route
          path={PAGE_PATHS['nutritionist-withdrawal']}
          element={renderProtected(
            'nutritionist-withdrawal',
            <NutritionistWithdrawalPage onNavigate={handleNavigate} />
          )}
        />
        <Route
          path={PAGE_PATHS['institution-info']}
          element={renderProtected('institution-info', <InstitutionInfoPage onNavigate={handleNavigate} />)}
        />
        <Route
          path={PAGE_PATHS['institution-info-edit']}
          element={renderProtected('institution-info-edit', <InstitutionInfoEditPage onNavigate={handleNavigate} />)}
        />

        <Route
          path="*"
          element={
            <Navigate
              to={PAGE_PATHS[isAuthenticated ? DEFAULT_AUTH_PAGE : DEFAULT_GUEST_PAGE]}
              replace
            />
          }
        />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}
