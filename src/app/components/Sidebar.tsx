import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isMealMenuOpen, setIsMealMenuOpen] = useState(true);
  const [isStatsMenuOpen, setIsStatsMenuOpen] = useState(true);

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
                <span className="text-sm">식단표 생성/수정</span>
              </div>
              <div 
                className={`px-6 py-2 pl-12 cursor-pointer hover:bg-[#505050] ${
                  currentPage === 'meal-view' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
                }`}
                onClick={() => onPageChange('meal-view')}
              >
                <span className="text-sm">식단표 조회</span>
              </div>
              <div 
                className={`px-6 py-2 pl-12 cursor-pointer hover:bg-[#505050] ${
                  currentPage === 'meal-history' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
                }`}
                onClick={() => onPageChange('meal-history')}
              >
                <span className="text-sm">식단표 수정 히스토리</span>
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
              <div 
                className={`px-6 py-2 pl-12 cursor-pointer hover:bg-[#505050] ${
                  currentPage === 'stats-preference' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
                }`}
                onClick={() => onPageChange('stats-preference')}
              >
                <span className="text-sm">선호도</span>
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

        {/* 운영 보고서 */}
        <div 
          className={`px-6 py-3 cursor-pointer hover:bg-[#3d3d3d] ${
            currentPage === 'operation-report' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
          }`}
          onClick={() => onPageChange('operation-report')}
        >
          <span className="text-sm">운영 보고서</span>
        </div>

        {/* 마이페이지 */}
        <div 
          className={`px-6 py-3 cursor-pointer hover:bg-[#3d3d3d] ${
            currentPage === 'mypage' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
          }`}
          onClick={() => onPageChange('mypage')}
        >
          <span className="text-sm">마이페이지</span>
        </div>

        {/* 기관 정보 등록/수정 */}
        <div 
          className={`px-6 py-3 cursor-pointer hover:bg-[#3d3d3d] ${
            currentPage === 'institution' ? 'bg-[#505050] border-l-4 border-[#5dccb4]' : ''
          }`}
          onClick={() => onPageChange('institution')}
        >
          <span className="text-sm">기관 정보 등록/수정</span>
        </div>
      </div>
    </div>
  );
}