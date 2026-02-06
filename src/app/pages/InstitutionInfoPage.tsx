import { useEffect, useState } from 'react';
import { Building2, Phone, Mail, Users, FileText, Warehouse } from 'lucide-react';

import { getSchoolResponse } from '../data/school';

interface InstitutionInfoPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function InstitutionInfoPage({ onNavigate }: InstitutionInfoPageProps) {
  const [activeTab, setActiveTab] = useState<'school' | 'rules'>('school');
  const [institutionInfo, setInstitutionInfo] = useState({
    schoolName: '',
    schoolTypePrimary: '',
    schoolTypeSecondary: '',
    phone: '',
    email: '',
    studentCount: 0,
    mealPriceTarget: 0,
    mealPriceMax: 0,
    staffCount: 0,
    equipmentSummary: '',
    rulesText: '',
  });

  const mapSchoolTypeToForm = (schoolTypeRaw: string) => {
    switch (schoolTypeRaw) {
      case 'ELEMENTARY':
        return { primary: '초등학교', secondary: '' };
      case 'MIDDLE_MALE':
        return { primary: '중학교', secondary: '남학교' };
      case 'MIDDLE_FEMALE':
        return { primary: '중학교', secondary: '여학교' };
      case 'MIDDLE_COED':
        return { primary: '중학교', secondary: '남녀공학' };
      case 'HIGH_MALE':
        return { primary: '고등학교', secondary: '남학교' };
      case 'HIGH_FEMALE':
        return { primary: '고등학교', secondary: '여학교' };
      case 'HIGH_COED':
        return { primary: '고등학교', secondary: '남녀공학' };
      default:
        return { primary: schoolTypeRaw, secondary: '' };
    }
  };

  useEffect(() => {
    const loadSchoolInfo = async () => {
      const response = await getSchoolResponse();
      if (response?.status !== 'success') return;
      const { primary, secondary } = mapSchoolTypeToForm(response.data.school_type ?? '');
      setInstitutionInfo({
        schoolName: response.data.school_name ?? '',
        schoolTypePrimary: primary,
        schoolTypeSecondary: secondary,
        phone: response.data.phone ?? '',
        email: response.data.email ?? '',
        studentCount: response.data.student_count ?? 0,
        mealPriceTarget: response.data.target_unit_price ?? 0,
        mealPriceMax: response.data.max_unit_price ?? 0,
        staffCount: response.data.cook_workers ?? 0,
        equipmentSummary: response.data.kitchen_equipment ?? '',
        rulesText: response.data.operation_rules ?? '',
      });
    };
    void loadSchoolInfo();
  }, []);

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
                    <p className="text-sm font-medium text-gray-800">{institutionInfo.schoolName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">학교 구분</p>
                  <div className="text-sm font-medium text-gray-800 space-y-1">
                    <p>구분1: {institutionInfo.schoolTypePrimary}</p>
                    {institutionInfo.schoolTypeSecondary && (
                      <p>구분2: {institutionInfo.schoolTypeSecondary}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="mt-1 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">학교 전화번호 (대표번호)</p>
                    <p className="text-sm font-medium text-gray-800">{institutionInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={16} className="mt-1 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">학교 이메일 (대표메일)</p>
                    <p className="text-sm font-medium text-gray-800">{institutionInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users size={16} className="mt-1 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">학생 수</p>
                    <p className="text-sm font-medium text-gray-800">{institutionInfo.studentCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {(institutionInfo.mealPriceTarget > 0 || institutionInfo.mealPriceMax > 0) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">단가</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">목표 1식 단가</p>
                    <p className="text-sm font-medium text-gray-800">
                      {institutionInfo.mealPriceTarget > 0
                        ? `${institutionInfo.mealPriceTarget.toLocaleString()}원`
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">1식 단가 상한선</p>
                    <p className="text-sm font-medium text-gray-800">
                      {institutionInfo.mealPriceMax > 0
                        ? `${institutionInfo.mealPriceMax.toLocaleString()}원`
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium mb-6">급식시설현황</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Warehouse size={16} className="mt-1 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">조리 인력 수</p>
                    <p className="text-sm font-medium text-gray-800">{institutionInfo.staffCount}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">주요 조리 기구 현황</p>
                    <p className="text-sm font-medium text-gray-800">{institutionInfo.equipmentSummary}</p>
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
                {institutionInfo.rulesText}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
