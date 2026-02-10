import { useEffect, useState } from 'react';
import { Building2, Phone, Mail, Users, FileText, Warehouse, MapPin, Search } from 'lucide-react';

import { getSchoolResponse, patchSchoolMe, searchSchools } from '../data/school';
import type { SchoolSearchItem } from '../viewModels/school';
import { useAuth } from '../auth/AuthContext';
import { ErrorModal } from '../components/ErrorModal';
import { useErrorModal } from '../hooks/useErrorModal';
import { normalizeErrorMessage } from '../utils/errorMessage';

interface InstitutionInfoEditPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function InstitutionInfoEditPage({ onNavigate }: InstitutionInfoEditPageProps) {
  const { refreshSchoolInfo } = useAuth();
  const { modalProps, openAlert } = useErrorModal();
  const [activeTab, setActiveTab] = useState<'school' | 'rules'>('school');
  const [form, setForm] = useState({
    schoolName: '',
    schoolTypePrimary: '',
    schoolTypeSecondary: '',
    schoolAddress: '',
    schoolAddressDetail: '',
    schoolPhone: '',
    email: '',
    studentCount: '',
    mealPriceTarget: '',
    mealPriceMax: '',
    staffCount: '',
    equipmentDetails: '',
    rulesText: '',
  });
  const [schoolMeta, setSchoolMeta] = useState({
    regionCode: '',
    schoolCode: '',
    address: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [filteredSchools, setFilteredSchools] = useState<SchoolSearchItem[]>([]);
  const [isSearchingSchools, setIsSearchingSchools] = useState(false);
  const [schoolSearchError, setSchoolSearchError] = useState('');

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
        return { primary: '', secondary: '' };
    }
  };

  const mapFormToSchoolType = (primary: string, secondary: string) => {
    if (primary === '초등학교') return 'ELEMENTARY';
    if (primary === '중학교') {
      if (secondary === '남학교') return 'MIDDLE_MALE';
      if (secondary === '여학교') return 'MIDDLE_FEMALE';
      if (secondary === '남녀공학') return 'MIDDLE_COED';
    }
    if (primary === '고등학교') {
      if (secondary === '남학교') return 'HIGH_MALE';
      if (secondary === '여학교') return 'HIGH_FEMALE';
      if (secondary === '남녀공학') return 'HIGH_COED';
    }
    return '';
  };

  useEffect(() => {
    const applySchoolResponse = (response: Awaited<ReturnType<typeof getSchoolResponse>>) => {
      if (response?.status !== 'success') return;
      const { primary, secondary } = mapSchoolTypeToForm(response.data.school_type ?? '');
      setForm({
        schoolName: response.data.school_name ?? '',
        schoolTypePrimary: primary,
        schoolTypeSecondary: secondary,
        schoolAddress: response.data.address ?? '',
        schoolAddressDetail: '',
        schoolPhone: response.data.phone ?? '',
        email: response.data.email ?? '',
        studentCount: String(response.data.student_count ?? ''),
        mealPriceTarget: String(response.data.target_unit_price ?? ''),
        mealPriceMax: String(response.data.max_unit_price ?? ''),
        staffCount: String(response.data.cook_workers ?? ''),
        equipmentDetails: response.data.kitchen_equipment ?? '',
        rulesText: response.data.operation_rules ?? '',
      });
      setSchoolMeta({
        regionCode: response.data.region_code ?? '',
        schoolCode: response.data.school_code ?? '',
        address: response.data.address ?? '',
      });
      setSchoolSearchQuery(response.data.school_name ?? '');
    };

    const loadSchoolInfo = async () => {
      const response = await getSchoolResponse();
      applySchoolResponse(response);
    };
    void loadSchoolInfo();
  }, []);

  const handleFieldChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSchoolSearch = (query: string) => {
    setSchoolSearchQuery(query);
    setForm((prev) => ({ ...prev, schoolName: query }));
  };

  useEffect(() => {
    let isActive = true;
    if (!schoolSearchQuery.trim()) {
      setFilteredSchools([]);
      setShowSchoolDropdown(false);
      setSchoolSearchError('');
      return;
    }
    setIsSearchingSchools(true);
    setSchoolSearchError('');
    const handle = window.setTimeout(async () => {
      try {
        const response = await searchSchools(schoolSearchQuery.trim());
        if (!isActive) return;
        setFilteredSchools(response);
        setShowSchoolDropdown(true);
      } catch {
        if (!isActive) return;
        setFilteredSchools([]);
        setShowSchoolDropdown(true);
        setSchoolSearchError('학교 검색에 실패했습니다.');
      } finally {
        if (isActive) {
          setIsSearchingSchools(false);
        }
      }
    }, 300);
    return () => {
      isActive = false;
      window.clearTimeout(handle);
    };
  }, [schoolSearchQuery]);

  const handleSchoolSelect = (school: SchoolSearchItem) => {
    setForm((prev) => ({
      ...prev,
      schoolName: school.school_name ?? '',
      schoolAddress: school.address ?? '',
      schoolAddressDetail: '',
    }));
    setSchoolMeta({
      regionCode: school.region_code ?? '',
      schoolCode: school.school_code ?? '',
      address: school.address ?? '',
    });
    setSchoolSearchQuery(school.school_name ?? '');
    setFilteredSchools([]);
    setShowSchoolDropdown(false);
  };

  const parseRequiredNumber = (value: string, label: string) => {
    if (!value.trim()) {
      throw new Error(`${label}을(를) 입력해주세요.`);
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      throw new Error(`${label}을(를) 올바르게 입력해주세요.`);
    }
    return parsed;
  };

  const parseOptionalNumber = (value: string, label: string) => {
    if (!value.trim()) return undefined;
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      throw new Error(`${label}을(를) 올바르게 입력해주세요.`);
    }
    return parsed;
  };

  const extractErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      const raw = error.message;
      try {
        const parsed = JSON.parse(raw) as {
          message?: string;
          error?: string;
          detail?: string;
          errors?: Array<{ message?: string }>;
        };
        if (parsed.message) return parsed.message;
        if (parsed.error) return parsed.error;
        if (parsed.detail) return parsed.detail;
        if (parsed.errors?.length) {
          return parsed.errors.map((item) => item.message).filter(Boolean).join('\n');
        }
      } catch {
        return raw;
      }
      return raw;
    }
    return '저장에 실패했습니다.';
  };

  const handleSchoolTypePrimaryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setForm((prev) => ({
      ...prev,
      schoolTypePrimary: value,
      schoolTypeSecondary: value === '초등학교' ? '' : prev.schoolTypeSecondary,
    }));
  };

  const handleSchoolTypeSecondaryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, schoolTypeSecondary: event.target.value }));
  };

  const handleSave = async () => {
    if (!form.schoolName.trim()) {
      openAlert('학교 이름을 입력해주세요.');
      return;
    }
    if (!schoolMeta.regionCode || !schoolMeta.schoolCode || !form.schoolAddress.trim()) {
      openAlert('학교 기본 정보(지역/학교 코드, 주소)를 불러오지 못했습니다.');
      return;
    }
    const schoolType = mapFormToSchoolType(
      form.schoolTypePrimary.trim(),
      form.schoolTypeSecondary.trim()
    );
    if (!schoolType) {
      openAlert('학교 구분을 정확히 선택해주세요.');
      return;
    }
    if (!form.schoolPhone.trim()) {
      openAlert('대표 전화번호를 입력해주세요.');
      return;
    }
    const phone = form.schoolPhone.trim();
    const schoolAddress = form.schoolAddressDetail
      ? `${form.schoolAddress} ${form.schoolAddressDetail}`.trim()
      : form.schoolAddress.trim();

    try {
      setIsSaving(true);
      const payload = {
        school_name: form.schoolName.trim(),
        region_code: schoolMeta.regionCode,
        school_code: schoolMeta.schoolCode,
        address: schoolAddress,
        school_type: schoolType,
        phone,
        email: form.email.trim() || undefined,
        student_count: parseOptionalNumber(form.studentCount, '학생 수'),
        target_unit_price: parseOptionalNumber(form.mealPriceTarget, '목표 1식 단가'),
        max_unit_price: parseOptionalNumber(form.mealPriceMax, '1식 단가 상한선'),
        operation_rules: form.rulesText.trim() || undefined,
        cook_workers: parseOptionalNumber(form.staffCount, '조리 인력 수'),
        kitchen_equipment: form.equipmentDetails.trim() || undefined,
      };
      await patchSchoolMe(payload);
      const refreshed = await getSchoolResponse();
      if (refreshed?.status === 'success') {
        const { primary, secondary } = mapSchoolTypeToForm(refreshed.data.school_type ?? '');
        setForm({
          schoolName: refreshed.data.school_name ?? '',
          schoolTypePrimary: primary,
          schoolTypeSecondary: secondary,
          schoolAddress: refreshed.data.address ?? '',
          schoolAddressDetail: '',
          schoolPhone: refreshed.data.phone ?? '',
          email: refreshed.data.email ?? '',
          studentCount: String(refreshed.data.student_count ?? ''),
          mealPriceTarget: String(refreshed.data.target_unit_price ?? ''),
          mealPriceMax: String(refreshed.data.max_unit_price ?? ''),
          staffCount: String(refreshed.data.cook_workers ?? ''),
          equipmentDetails: refreshed.data.kitchen_equipment ?? '',
          rulesText: refreshed.data.operation_rules ?? '',
        });
        setSchoolMeta({
          regionCode: refreshed.data.region_code ?? '',
          schoolCode: refreshed.data.school_code ?? '',
          address: refreshed.data.address ?? '',
        });
        setSchoolSearchQuery(refreshed.data.school_name ?? '');
      }
      await refreshSchoolInfo();
      openAlert('저장되었습니다.', {
        title: '안내',
        onConfirm: () => onNavigate?.('institution-info'),
      });
    } catch (error) {
      openAlert(
        normalizeErrorMessage(extractErrorMessage(error), '저장에 실패했습니다.'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isSecondaryDisabled =
    !form.schoolTypePrimary || form.schoolTypePrimary === '초등학교';

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">학교 정보 수정</h1>
      </div>

      {/* Tabs */}
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

      <div className="max-w-3xl">
        {/* 학교 정보 탭 */}
        {activeTab === 'school' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium mb-6">학교 기본 정보</h2>
            
            <div className="space-y-6">
              {/* School Name */}
              <div>
                <label className="block text-base font-medium mb-2 flex items-center gap-2">
                  <Building2 size={16} />
                  학교 이름
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={schoolSearchQuery}
                    onChange={(e) => handleSchoolSearch(e.target.value)}
                    onFocus={() => {
                      if (schoolSearchQuery && filteredSchools.length > 0) {
                        setShowSchoolDropdown(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowSchoolDropdown(false), 200);
                    }}
                    placeholder="학교명을 입력하세요"
                    className="w-full pl-12 pr-12 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>

                  {showSchoolDropdown && schoolSearchQuery && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                      {isSearchingSchools && (
                        <div className="px-4 py-3 text-gray-500 text-sm">검색 중...</div>
                      )}
                      {!isSearchingSchools && schoolSearchError && (
                        <div className="px-4 py-3 text-red-500 text-sm">{schoolSearchError}</div>
                      )}
                      {!isSearchingSchools && !schoolSearchError && filteredSchools.length > 0 ? (
                        filteredSchools.map((school) => (
                          <button
                            key={`${school.school_code}-${school.school_name}`}
                            type="button"
                            onClick={() => handleSchoolSelect(school)}
                            className="w-full px-4 py-3 text-left hover:bg-[#00B3A4]/5 transition-colors text-gray-700 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium">{school.school_name}</div>
                            <div className="text-base text-gray-500">{school.address}</div>
                          </button>
                        ))
                      ) : (
                        !isSearchingSchools &&
                        !schoolSearchError && (
                          <div className="px-4 py-3 text-gray-500 text-sm">
                            검색 결과가 없습니다. 다른 키워드로 검색해주세요.
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* School Type - Level */}
              <div>
                <label className="block text-base font-medium mb-2">
                  학교 구분1 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schoolTypePrimary"
                      value="초등학교"
                      checked={form.schoolTypePrimary === '초등학교'}
                      onChange={handleSchoolTypePrimaryChange}
                      className="h-4 w-4 text-[#5dccb4] focus:ring-[#5dccb4] border-gray-300"
                    />
                    <span className="text-base text-gray-700">초등학교</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schoolTypePrimary"
                      value="중학교"
                      checked={form.schoolTypePrimary === '중학교'}
                      onChange={handleSchoolTypePrimaryChange}
                      className="h-4 w-4 text-[#5dccb4] focus:ring-[#5dccb4] border-gray-300"
                    />
                    <span className="text-base text-gray-700">중학교</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schoolTypePrimary"
                      value="고등학교"
                      checked={form.schoolTypePrimary === '고등학교'}
                      onChange={handleSchoolTypePrimaryChange}
                      className="h-4 w-4 text-[#5dccb4] focus:ring-[#5dccb4] border-gray-300"
                    />
                    <span className="text-base text-gray-700">고등학교</span>
                  </label>
                </div>
              </div>

              {/* School Type - Coed */}
              <div>
                <label className="block text-base font-medium mb-2">학교 구분2</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                  value={form.schoolTypeSecondary}
                  onChange={handleSchoolTypeSecondaryChange}
                  disabled={isSecondaryDisabled}
                >
                  <option value="">선택</option>
                  <option>남녀공학</option>
                  <option>남학교</option>
                  <option>여학교</option>
                </select>
              </div>

              {/* Region Code */}
              <div>
                <label htmlFor="regionCode" className="block text-base font-medium mb-2">
                  지역 코드 <span className="text-red-500">*</span>
                </label>
                <input
                  id="regionCode"
                  type="text"
                  value={schoolMeta.regionCode}
                  placeholder="예: C10"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                  readOnly
                />
              </div>

              {/* School Code */}
              <div>
                <label htmlFor="schoolCode" className="block text-base font-medium mb-2">
                  학교 코드 <span className="text-red-500">*</span>
                </label>
                <input
                  id="schoolCode"
                  type="text"
                  value={schoolMeta.schoolCode}
                  placeholder="예: 7150090"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                  readOnly
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="schoolAddress" className="block text-base font-medium mb-2">
                  학교 주소
                </label>
                <div className="flex gap-2 mb-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="schoolAddress"
                      type="text"
                      value={form.schoolAddress}
                      onChange={handleFieldChange('schoolAddress')}
                      placeholder="주소를 검색하세요"
                      className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                      readOnly
                    />
                  </div>
                </div>
                <input
                  type="text"
                  value={form.schoolAddressDetail}
                  onChange={handleFieldChange('schoolAddressDetail')}
                  placeholder="상세 주소를 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-base font-medium mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  대표 전화번호
                </label>
                <input
                  type="tel"
                  value={form.schoolPhone}
                  onChange={handleFieldChange('schoolPhone')}
                  placeholder="051-000-0000"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-medium mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  대표 이메일
                </label>
                <input 
                  type="email" 
                  value={form.email}
                  onChange={handleFieldChange('email')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              {/* Student Count */}
              <div>
                <label className="block text-base font-medium mb-2 flex items-center gap-2">
                  <Users size={16} />
                  학생 수
                </label>
                <input 
                  type="number" 
                  value={form.studentCount}
                  onChange={handleFieldChange('studentCount')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              {/* Meal Price */}
              <div>
                <label className="block text-base font-medium mb-2">목표 1식 단가 (원)</label>
                <input 
                  type="number" 
                  value={form.mealPriceTarget}
                  onChange={handleFieldChange('mealPriceTarget')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              <div>
                <label className="block text-base font-medium mb-2">1식 단가 상한선 (원)</label>
                <input 
                  type="number" 
                  value={form.mealPriceMax}
                  onChange={handleFieldChange('mealPriceMax')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              {/* Facilities */}
              <div className="pt-2">
                <h3 className="text-lg font-medium mb-4">급식시설현황</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-base font-medium mb-2 flex items-center gap-2">
                      <Warehouse size={16} />
                      조리 인력 수 (명)
                    </label>
                    <input 
                      type="number" 
                      value={form.staffCount}
                      onChange={handleFieldChange('staffCount')}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-medium mb-2">주요 조리 기구 현황</label>
                    <textarea 
                      rows={6}
                      value={form.equipmentDetails}
                      onChange={handleFieldChange('equipmentDetails')}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-8">
              <button className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">
                취소
              </button>
              <button
                className="px-6 py-2 bg-[#5dccb4] text-white rounded hover:bg-[#4dbba3] disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        )}

        {/* 운영 내규 탭 */}
        {activeTab === 'rules' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium mb-6">학교 급식 운영 내규</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-base font-medium mb-2 flex items-center gap-2">
                  <FileText size={16} />
                  학교 급식 운영 내규
                </label>
                <textarea 
                  rows={12}
                  value={form.rulesText}
                  onChange={handleFieldChange('rulesText')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4] font-mono text-sm leading-relaxed"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-8">
              <button className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">
                취소
              </button>
              <button
                className="px-6 py-2 bg-[#5dccb4] text-white rounded hover:bg-[#4dbba3] disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        )}

      </div>
      <ErrorModal {...modalProps} />
    </div>
  );
}

