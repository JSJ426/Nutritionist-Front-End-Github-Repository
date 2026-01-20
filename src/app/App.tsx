import { StatsPreferencePage } from './pages/StatsPreferencePage';
import { MyPage } from './pages/MyPage';
import { InstitutionPage } from './pages/InstitutionPage';
import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MealMonthlyPage } from './pages/MealMonthlyPage';
import { MealCreatePage } from './pages/MealCreatePage';
import { MealViewPage } from './pages/MealViewPage';
import { MealHistoryPage } from './pages/MealHistoryPage';
import { StatsMissedPage } from './pages/StatsMissedPage';
import { StatsLeftoversPage } from './pages/StatsLeftoversPage';
import { StatsSatisfactionPage } from './pages/StatsSatisfactionPage';
import { BoardListPage } from './pages/BoardListPage';
import { BoardReadPage } from './pages/BoardReadPage';
import { BoardWritePage } from './pages/BoardWritePage';
import { BoardEditPage } from './pages/BoardEditPage';
import { OperationReportPage } from './pages/OperationReportPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState<any>(null);

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    setPageParams(params || null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'meal-monthly':
        return <MealMonthlyPage />;
      case 'meal-create':
        return <MealCreatePage />;
      case 'meal-view':
        return <MealViewPage initialParams={pageParams} />;
      case 'meal-history':
        return <MealHistoryPage />;
      case 'stats-missed':
        return <StatsMissedPage />;
      case 'stats-leftovers':
        return <StatsLeftoversPage />;
      case 'stats-satisfaction':
        return <StatsSatisfactionPage onNavigate={handleNavigate} />;
      case 'stats-preference':
        return <StatsPreferencePage onNavigate={handleNavigate} />;
      case 'board-list':
        return <BoardListPage onNavigate={handleNavigate} />;
      case 'board-read':
        return <BoardReadPage initialParams={pageParams} onNavigate={handleNavigate} />;
      case 'board-write':
        return <BoardWritePage onNavigate={handleNavigate} />;
      case 'board-edit':
        return <BoardEditPage initialParams={pageParams} onNavigate={handleNavigate} />;
      case 'operation-report':
        return <OperationReportPage />;
      case 'mypage':
        return <MyPage />;
      case 'institution':
        return <InstitutionPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Header />

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