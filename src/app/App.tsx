import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { MealMonthlyPage } from './pages/MealMonthlyPage';
import { MealCreatePage } from './pages/MealCreatePage';
import { MealHistoryPage } from './pages/MealHistoryPage';
import { MealEditPage } from './pages/MealEditPage';
import { FoodListPage } from './pages/FoodListPage';
import { FoodInfoPage } from './pages/FoodInfoPage';
import { AdditionalMenuListPage } from './pages/AdditionalMenuListPage';
import { AdditionalMenuCreatePage } from './pages/AdditionalMenuCreatePage';
import { AdditionalMenuReadPage } from './pages/AdditionalMenuReadPage';
import { AdditionalMenuEditPage } from './pages/AdditionalMenuEditPage';
import { StatsMissedPage } from './pages/StatsMissedPage';
import { StatsLeftoversPage } from './pages/StatsLeftoversPage';
import { StatsSatisfactionPage } from './pages/StatsSatisfactionPage';
import { OperationRecordDailyPage } from './pages/OperationRecordDailyPage';
import { OperationReportListPage } from './pages/OperationReportListPage';
import { OperationReportReadPage } from './pages/OperationReportReadPage';
import { BoardListPage } from './pages/BoardListPage';
import { BoardReadPage } from './pages/BoardReadPage';
import { BoardWritePage } from './pages/BoardWritePage';
import { BoardEditPage } from './pages/BoardEditPage';
import { NutritionistInfoPage } from './pages/NutritionistInfoPage';
import { InstitutionInfoPage } from './pages/InstitutionInfoPage';
import { InstitutionInfoEditPage } from './pages/InstitutionInfoEditPage';

import { LoginPage } from './pages/LoginPage';
import { SchoolSignupPage } from './pages/SchoolSignupPage';
//import { FindIdPage } from './pages/FindIdPage';
//import { FindPasswordPage } from './pages/FindPasswordPage';
import { useAuth } from './auth/AuthContext';
import { Toaster } from 'sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [pageParams, setPageParams] = useState<any>(null);
  const { isAuthenticated, isReady, logout, schoolName } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage('home');
    }
  }, [isAuthenticated]);

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    setPageParams(params || null);
  };

  const handleLoginSuccess = () => {
    setCurrentPage('home');
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('login');
    setPageParams(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'meal-monthly':
        return <MealMonthlyPage onNavigate={handleNavigate} />;
      case 'meal-create':
        return <MealCreatePage onNavigate={handleNavigate} />;
      case 'meal-edit':
        return <MealEditPage initialParams={pageParams} />;
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
        return <BoardListPage initialParams={pageParams} onNavigate={handleNavigate} />;
      case 'board-read':
        return <BoardReadPage initialParams={pageParams} onNavigate={handleNavigate} />;
      case 'board-write':
        return <BoardWritePage onNavigate={handleNavigate} />;
      case 'board-edit':
        return <BoardEditPage initialParams={pageParams} onNavigate={handleNavigate} />;
      case 'additional-menu-list':
        return <AdditionalMenuListPage initialParams={pageParams} onNavigate={handleNavigate} />;
      case 'additional-menu-write':
        return <AdditionalMenuCreatePage onNavigate={handleNavigate} />;
      case 'additional-menu-read':
        return (
          <AdditionalMenuReadPage
            initialParams={pageParams}
            onNavigate={handleNavigate}
          />
        );
      case 'additional-menu-edit':
        return (
          <AdditionalMenuEditPage
            initialParams={pageParams}
            onNavigate={handleNavigate}
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
        return <InstitutionInfoEditPage onNavigate={handleNavigate} />;
      case 'nutritionist-info':
        return <NutritionistInfoPage onNavigate={handleNavigate} />;
      default:
        return <HomePage />;
    }
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

  if (!isAuthenticated) {
    if (currentPage === 'school-signup') {
      return (
        <>
          <SchoolSignupPage onNavigate={handleNavigate} />
          <Toaster position="top-right" richColors />
        </>
      );
    }
    // if (currentPage === 'find-id') {
    //   return <FindIdPage onNavigate={handleNavigate} />;
    // }
    // if (currentPage === 'find-password') {
    //   return <FindPasswordPage onNavigate={handleNavigate} />;
    // }
    return (
      <>
        <LoginPage onLogin={handleLoginSuccess} onNavigate={handleNavigate} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <Header onLogout={handleLogout} schoolName={schoolName} />

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
      <Toaster position="top-right" richColors />
    </>
  );
}
