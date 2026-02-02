import { Building2, Phone, Mail, Users, FileText, Warehouse } from 'lucide-react';
import { useState } from 'react';

interface InstitutionInfoPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function InstitutionInfoPage({ onNavigate }: InstitutionInfoPageProps) {
  const [activeTab, setActiveTab] = useState<'school' | 'rules'>('school');

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">학교 정보</h1>
        <button
          onClick={() => onNavigate?.('institution-info-edit')}
          className="px-6 py-2 bg-[#5dccb4] text-white rounded hover:bg-[#4dbba3]"
        >
          정보 수정
        </button>
      </div>

      <div className="border-b border-gray-300 mb-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('school')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'school'
                ? 'text-[#5dccb4] border-b-2 border-[#5dccb4]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            학교 정보
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'rules'
                ? 'text-[#5dccb4] border-b-2 border-[#5dccb4]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            운영 내규
          </button>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {activeTab === 'school' && (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium mb-6">학교 기본 정보</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <Building2 size={16} className="mt-1 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">학교 이름</p>
                    <p className="text-sm font-medium text-gray-800">케이티에이블고등학교</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">학교 구분</p>
                  <div className="text-sm font-medium text-gray-800 space-y-1">
                    <p>구분1: 고등학교</p>
                    <p>구분2: 남녀공학</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="mt-1 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">학교 전화번호 (대표번호)</p>
                    <p className="text-sm font-medium text-gray-800">02-1234-5678</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={16} className="mt-1 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">학교 이메일 (대표메일)</p>
                    <p className="text-sm font-medium text-gray-800">info@seoulcentral.hs.kr</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users size={16} className="mt-1 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">학생 수</p>
                    <p className="text-sm font-medium text-gray-800">1,250명</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium mb-6">단가</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">목표 1식 단가</p>
                  <p className="text-sm font-medium text-gray-800">5,500원</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">1식 단가 상한선</p>
                  <p className="text-sm font-medium text-gray-800">6,000원</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium mb-6">급식시설현황</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Warehouse size={16} className="mt-1 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">조리 인력 수</p>
                    <p className="text-sm font-medium text-gray-800">8명</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">주요 조리 기구 현황</p>
                  <p className="text-sm font-medium text-gray-800">회전식 조리기 2대, 스팀솥 4대, 냉장고 6대</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'rules' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium mb-6">학교 급식 운영 내규</h2>
            <div className="flex items-start gap-3">
              <FileText size={16} className="mt-1 text-gray-500" />
              <p className="text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-line">
                [ 급식 제공 시간 ]
                {'\n'}• 중식: 12:00 - 13:00 (1학년 11:50, 2학년 12:10, 3학년 12:30 순차 배식)
                {'\n'}• 석식: 17:30 - 18:30 (자율 배식)
                {'\n\n'}[ 위생 및 안전 관리 ]
                {'\n'}• 알레르기 식재료 표시 의무화 (메뉴판 및 앱 공지)
                {'\n'}• 위생 점검 주 1회 실시 (담당: 영양사, 보건교사)
                {'\n'}• 식재료 검수 일일 실시 (오전 8시)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
