import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isMealMenuOpen, setIsMealMenuOpen] = useState(true);
  const [isStatsMenuOpen, setIsStatsMenuOpen] = useState(true);
  const [isOperationMenuOpen, setIsOperationMenuOpen] = useState(true);

  return (
    <div className="w-[240px] h-full bg-[#4a4a4a] text-white flex flex-col">
      {/* Menu Items */}
      <div className="flex-1 py-0 overflow-y-auto">
        {/* 홈 */}
        <div 
          className={`px-6 py-3 cursor-pointer hover:bg-[#3d3d3d] ${
            currentPage === 'home' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
          }`}
          onClick={() => onPageChange('home')}
        >
          <span className="text-sm">홈</span>
        </div>

        {/* 식단표 - Expandable Menu */}
        <div>
          <div 
            className="px-6 py-3 cursor-pointer flex items-center justify-between hover:bg-[#3d3d3d]"
            onClick={() => setIsMealMenuOpen(!isMealMenuOpen)}
          >
            <span className="text-sm">식단표</span>
            <ChevronDown 
              size={14} 
              className={`transition-transform ${isMealMenuOpen ? 'rotate-0' : '-rotate-90'}`}
            />
          </div>
          
          {/* Submenu */}
          {isMealMenuOpen && (
            <div className="bg-[#3d3d3d]">
              <div 
                className={`px-6 py-2 pl-12 cursor-pointer hover:bg-[#505050] ${
                  currentPage === 'meal-monthly' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
                }`}
                onClick={() => onPageChange('meal-monthly')}
              >
                <span className="text-sm">식단표 (월간)</span>
              </div>
              <div 
                className={`px-6 py-2 pl-12 cursor-pointer hover:bg-[#505050] ${
                  currentPage === 'meal-create' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
                }`}
                onClick={() => onPageChange('meal-create')}
              >
                <span className="text-sm">식단표 생성</span>
              </div>
              <div 
                className={`px-6 py-2 pl-12 cursor-pointer hover:bg-[#505050] ${
                  currentPage === 'meal-edit' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
                }`}
                onClick={() => onPageChange('meal-edit')}
              >
                <span className="text-sm">식단표 수정</span>
              </div>
              <div 
                className={`px-6 py-2 pl-12 cursor-pointer hover:bg-[#505050] ${
                  currentPage === 'meal-history' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
                }`}
                onClick={() => onPageChange('meal-history')}
              >
                <span className="text-sm">식단표 수정 히스토리</span>
              </div>
              <div 
                className={`px-6 py-2 pl-12 cursor-pointer hover:bg-[#505050] ${
                  currentPage === 'food-list' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
                }`}
                onClick={() => onPageChange('food-list')}
              >
                <span className="text-sm">메뉴 조회</span>
              </div>
              <div 
                className={`px-6 py-2 pl-12 cursor-pointer hover:bg-[#505050] ${
                  currentPage === 'additional-menu-list' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
                }`}
                onClick={() => onPageChange('additional-menu-list')}
              >
                <span className="text-sm">신메뉴</span>
              </div>
            </div>
          )}
        </div>

        {/* 통계 - Expandable Menu */}
        <div>
          <div 
            className="px-6 py-3 cursor-pointer hover:bg-[#3d3d3d] flex items-center justify-between"
            onClick={() => setIsStatsMenuOpen(!isStatsMenuOpen)}
          >
            <span className="text-sm">통계</span>
            <ChevronDown 
              size={14} 
              className={`transition-transform ${isStatsMenuOpen ? 'rotate-0' : '-rotate-90'}`}
            />
          </div>
          
          {/* Submenu */}
          {isStatsMenuOpen && (
            <div className="bg-[#3d3d3d]">
              <div 
                className={`px-6 py-2 pl-12 cursor-pointer hover:bg-[#505050] ${
                  currentPage === 'stats-missed' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
                }`}
                onClick={() => onPageChange('stats-missed')}
              >
                <span className="text-sm">결식률</span>
              </div>
              <div 
                className={`px-6 py-2 pl-12 cursor-pointer hover:bg-[#505050] ${
                  currentPage === 'stats-leftovers' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
                }`}
                onClick={() => onPageChange('stats-leftovers')}
              >
                <span className="text-sm">잔반량</span>
              </div>
              <div 
                className={`px-6 py-2 pl-12 cursor-pointer hover:bg-[#505050] ${
                  currentPage === 'stats-satisfaction' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
                }`}
                onClick={() => onPageChange('stats-satisfaction')}
              >
                <span className="text-sm">만족도</span>
              </div>
            </div>
          )}
        </div>

        {/* 운영 기록 - Expandable Menu */}
        <div>
          <div
            className="px-6 py-3 cursor-pointer hover:bg-[#3d3d3d] flex items-center justify-between"
            onClick={() => setIsOperationMenuOpen(!isOperationMenuOpen)}
          >
            <span className="text-sm">운영 기록</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${isOperationMenuOpen ? 'rotate-0' : '-rotate-90'}`}
            />
          </div>

          {/* Submenu */}
          {isOperationMenuOpen && (
            <div className="bg-[#3d3d3d]">
              <div
                className={`px-6 py-2 pl-12 cursor-pointer hover:bg-[#505050] ${
                  currentPage === 'operation-record' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
                }`}
                onClick={() => onPageChange('operation-record')}
              >
                <span className="text-sm">일간 운영 기록</span>
              </div>
              <div
                className={`px-6 py-2 pl-12 cursor-pointer hover:bg-[#505050] ${
                  currentPage === 'operation-report-list' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
                }`}
                onClick={() => onPageChange('operation-report-list')}
              >
                <span className="text-sm">월간 운영 분석</span>
              </div>
            </div>
          )}
        </div>

        {/* 게시판 */}
        <div 
          className={`px-6 py-3 cursor-pointer hover:bg-[#3d3d3d] ${
            currentPage === 'board-list' || currentPage === 'board-read' || currentPage === 'board-write' || currentPage === 'board-edit' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
          }`}
          onClick={() => onPageChange('board-list')}
        >
          <span className="text-sm">게시판</span>
        </div>

        {/* 기관 정보 */}
        <div 
          className={`px-6 py-3 cursor-pointer hover:bg-[#3d3d3d] ${
            currentPage === 'institution-info' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
          }`}
          onClick={() => onPageChange('institution-info')}
        >
          <span className="text-sm">학교 정보</span>
        </div>

        {/* 영양사 정보 */}
        <div 
          className={`px-6 py-3 cursor-pointer hover:bg-[#3d3d3d] ${
            currentPage === 'nutritionist-info'
              ? 'bg-[#505050] border-l-4 border-[#5dccb4]'
              : ''
          }`}
          onClick={() => onPageChange('nutritionist-info')}
        >
          <span className="text-sm">영양사 정보</span>
        </div>
      </div>
    </div>
  );
}
