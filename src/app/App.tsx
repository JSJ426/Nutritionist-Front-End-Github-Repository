import { InstitutionInfoPage } from './pages/InstitutionInfoPage';
import { InstitutionInfoEditPage } from './pages/InstitutionInfoEditPage';
import { useRef, useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MealMonthlyPage } from './pages/MealMonthlyPage';
import { MealCreatePage } from './pages/MealCreatePage';
import { MealHistoryPage } from './pages/MealHistoryPage';
import { MealEditPage } from './pages/MealEditPage';
import { StatsMissedPage } from './pages/StatsMissedPage';
import { StatsLeftoversPage } from './pages/StatsLeftoversPage';
import { StatsSatisfactionPage } from './pages/StatsSatisfactionPage';
import { BoardListPage } from './pages/BoardListPage';
import { BoardReadPage } from './pages/BoardReadPage';
import { BoardWritePage } from './pages/BoardWritePage';
import { BoardEditPage } from './pages/BoardEditPage';
import { OperationReportListPage } from './pages/OperationReportListPage';
import { OperationReportReadPage } from './pages/OperationReportReadPage';
import { OperationRecordDailyPage } from './pages/OperationRecordDailyPage';
import { FoodListPage } from './pages/FoodListPage';
import { FoodInfoPage } from './pages/FoodInfoPage';
import { AdditionalMenuListPage } from './pages/AdditionalMenuListPage';
import { AdditionalMenuCreatePage } from './pages/AdditionalMenuCreatePage';
import { AdditionalMenuReadPage } from './pages/AdditionalMenuReadPage';
import { AdditionalMenuEditPage } from './pages/AdditionalMenuEditPage';
import { NutritionistInfoPage } from './pages/NutritionistInfoPage';
import { AdditionalMenuDraft, AdditionalMenuItem } from './types/additionalMenu';
import { LoginPage } from './pages/LoginPage';
import { SchoolSignupPage } from './pages/SchoolSignupPage';
import { FindIdPage } from './pages/FindIdPage';
import { FindPasswordPage } from './pages/FindPasswordPage';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [pageParams, setPageParams] = useState<any>(null);
  const [additionalMenus, setAdditionalMenus] = useState<AdditionalMenuItem[]>([
    {
      id: 3,
      title: '허니갈릭 치킨 샐러드',
      category: '생채·무침류',
      description: '닭가슴살과 허니갈릭 드레싱을 곁들인 샐러드 메뉴 제안입니다.',
      date: '2026-01-22',
    },
    {
      id: 2,
      title: '매콤 해물 덮밥',
      category: '밥류',
      description: '해물과 채소를 매콤하게 볶아 덮밥으로 제공하는 메뉴입니다.',
      date: '2026-01-19',
    },
    {
      id: 1,
      title: '버섯 크림 파스타',
      category: '면류',
      description: '버섯과 크림소스의 풍미를 살린 파스타 메뉴 제안입니다.',
      date: '2026-01-15',
    },
  ]);
  const nextAdditionalMenuId = useRef(4);

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    setPageParams(params || null);
  };

  const handleCreateAdditionalMenu = (draft: AdditionalMenuDraft) => {
    const newItem: AdditionalMenuItem = {
      id: nextAdditionalMenuId.current++,
      title: draft.title,
      category: draft.category,
      description: draft.description,
      date: formatDate(new Date()),
    };
    setAdditionalMenus((prev) => [newItem, ...prev]);
    return newItem;
  };

  const handleUpdateAdditionalMenu = (menuId: number, draft: AdditionalMenuDraft) => {
    setAdditionalMenus((prev) =>
      prev.map((item) =>
        item.id === menuId
          ? {
              ...item,
              title: draft.title,
              category: draft.category,
              description: draft.description,
            }
          : item
      )
    );
  };

  const handleDeleteAdditionalMenu = (menuId: number) => {
    setAdditionalMenus((prev) => prev.filter((item) => item.id !== menuId));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'meal-monthly':
        return <MealMonthlyPage />;
      case 'meal-create':
        return <MealCreatePage onNavigate={handleNavigate} />;
      case 'meal-edit':
        return <MealEditPage />;
      case 'meal-history':
        return <MealHistoryPage />;
      case 'food-list':
        return <FoodListPage onNavigate={handleNavigate} />;
      case 'food-info':
        return <FoodInfoPage initialParams={pageParams} onNavigate={handleNavigate} />;
      case 'stats-missed':
        return <StatsMissedPage />;
      case 'stats-leftovers':
        return <StatsLeftoversPage />;
      case 'stats-satisfaction':
        return <StatsSatisfactionPage onNavigate={handleNavigate} />;
      case 'board-list':
        return <BoardListPage onNavigate={handleNavigate} />;
      case 'board-read':
        return <BoardReadPage initialParams={pageParams} onNavigate={handleNavigate} />;
      case 'board-write':
        return <BoardWritePage onNavigate={handleNavigate} />;
      case 'board-edit':
        return <BoardEditPage initialParams={pageParams} onNavigate={handleNavigate} />;
      case 'additional-menu-list':
        return <AdditionalMenuListPage items={additionalMenus} onNavigate={handleNavigate} />;
      case 'additional-menu-write':
        return (
          <AdditionalMenuCreatePage
            onNavigate={handleNavigate}
            onCreate={handleCreateAdditionalMenu}
          />
        );
      case 'additional-menu-read':
        return (
          <AdditionalMenuReadPage
            items={additionalMenus}
            initialParams={pageParams}
            onNavigate={handleNavigate}
            onDelete={handleDeleteAdditionalMenu}
          />
        );
      case 'additional-menu-edit':
        return (
          <AdditionalMenuEditPage
            items={additionalMenus}
            initialParams={pageParams}
            onNavigate={handleNavigate}
            onUpdate={handleUpdateAdditionalMenu}
          />
        );
      case 'operation-report-list':
        return <OperationReportListPage onNavigate={handleNavigate} />;
      case 'operation-report-read':
        return <OperationReportReadPage initialParams={pageParams} onNavigate={handleNavigate} />;
      case 'operation-record':
        return <OperationRecordDailyPage />;
      case 'institution-info':
        return <InstitutionInfoPage onNavigate={handleNavigate} />;
      case 'institution-info-edit':
        return <InstitutionInfoEditPage />;
      case 'nutritionist-info':
        return <NutritionistInfoPage onNavigate={handleNavigate} />;
      default:
        return <HomePage />;
    }
  };

  if (currentPage === 'login') {
    return <LoginPage onLogin={() => setCurrentPage('home')} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'school-signup') {
    return <SchoolSignupPage onNavigate={handleNavigate} />;
  }
  if (currentPage === 'find-id') {
    return <FindIdPage onNavigate={handleNavigate} />;
  }

  if (currentPage === 'find-password') {
    return <FindPasswordPage onNavigate={handleNavigate} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Header onLogout={() => setCurrentPage('login')} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

        {/* Content Area */}
        <div className="flex-1 overflow-auto flex flex-col">
          <div className="flex-1">
            {renderPage()}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
