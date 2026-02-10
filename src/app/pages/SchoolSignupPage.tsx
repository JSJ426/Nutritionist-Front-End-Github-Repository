import { useEffect, useState } from 'react';
import { Lock, Mail, Phone, Eye, EyeOff, Building2, MapPin, Search } from 'lucide-react';

import { signupDietitian } from '../data/auth';
import { searchSchools } from '../data/school';
import TermsModal from '../components/TermsModal';
import PrivacyModal from '../components/PrivacyModal';
import { Footer } from '../components/Footer';
import { validatePasswordPolicy } from '../utils/password';
import { ErrorModal } from '../components/ErrorModal';
import { normalizeErrorMessage } from '../utils/errorMessage';
import type { SchoolSearchItem } from '../viewModels/school';

type SchoolSignupPageProps = {
  onNavigate: (page: string) => void;
};

export function SchoolSignupPage({ onNavigate }: SchoolSignupPageProps) {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    regionCode: '',
    schoolCode: '',
    schoolAddress: '',
    schoolAddressDetail: '',
    schoolPhone: '',
    schoolEmail: '',
    schoolTypePrimary: '',
    schoolTypeSecondary: '',
    studentCount: '',
    targetUnitPrice: '',
    maxUnitPrice: '',
    operationRules: '',
    cookWorkers: '',
    kitchenEquipment: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [passwordPolicyError, setPasswordPolicyError] = useState('');
  const [contactAreaCode, setContactAreaCode] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [schoolAreaCode, setSchoolAreaCode] = useState('');
  const [schoolNumber, setSchoolNumber] = useState('');

  // 학교 검색 관련 상태
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [filteredSchools, setFilteredSchools] = useState<SchoolSearchItem[]>([]);
  const [isSearchingSchools, setIsSearchingSchools] = useState(false);
  const [schoolSearchError, setSchoolSearchError] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'password') {
      const result = validatePasswordPolicy(value);
      setPasswordPolicyError(result.isValid ? '' : result.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formatLocalNumber = (value: string) => {
      const digits = value.replace(/\D/g, '').slice(0, 8);
      if (digits.length <= 4) return digits;
      return `${digits.slice(0, -4)}-${digits.slice(-4)}`;
    };

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const policyResult = validatePasswordPolicy(formData.password);
    if (!policyResult.isValid) {
      setPasswordPolicyError(policyResult.message);
      alert(policyResult.message);
      return;
    }

    if (!agreedToTerms || !agreedToPrivacy) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    if (!formData.regionCode.trim() || !formData.schoolCode.trim() || !formData.schoolAddress.trim()) {
      alert('학교 검색 결과를 선택해주세요.');
      return;
    }

    const schoolType = mapFormToSchoolType(
      formData.schoolTypePrimary.trim(),
      formData.schoolTypeSecondary.trim()
    );
    if (!schoolType) {
      alert('학교 구분을 정확히 선택해주세요.');
      return;
    }

    const schoolAddress = formData.schoolAddressDetail
      ? `${formData.schoolAddress} ${formData.schoolAddressDetail}`.trim()
      : formData.schoolAddress.trim();

    const contactNumberFormatted = formatLocalNumber(contactNumber);
    const schoolNumberFormatted = formatLocalNumber(schoolNumber);
    const contactPhone = contactAreaCode
      ? `${contactAreaCode}-${contactNumberFormatted}`
      : contactNumberFormatted;
    const schoolPhone = schoolAreaCode
      ? `${schoolAreaCode}-${schoolNumberFormatted}`
      : schoolNumberFormatted;

    const payload = {
      username: formData.username.trim(),
      pw: formData.password,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: contactPhone.trim(),
      school_info: {
        school_name: formData.schoolName.trim(),
        region_code: formData.regionCode.trim(),
        school_code: formData.schoolCode.trim(),
        address: schoolAddress,
        school_type: schoolType,
        phone: schoolPhone.trim() || undefined,
        email: formData.schoolEmail.trim() || undefined,
        student_count: formData.studentCount ? Number(formData.studentCount) : undefined,
        target_unit_price: formData.targetUnitPrice ? Number(formData.targetUnitPrice) : undefined,
        max_unit_price: formData.maxUnitPrice ? Number(formData.maxUnitPrice) : undefined,
        operation_rules: formData.operationRules.trim() || undefined,
        cook_workers: formData.cookWorkers ? Number(formData.cookWorkers) : undefined,
        kitchen_equipment: formData.kitchenEquipment.trim() || undefined,
      },
    };

    try {
      setIsSubmitting(true);
      await signupDietitian(payload);
      alert('학교 계정 회원가입이 완료되었습니다!');
      onNavigate('login');
    } catch (error) {
      const rawMessage = (error as { message?: string })?.message ?? '';
      const message = normalizeErrorMessage(rawMessage, '회원가입에 실패했습니다.');
      setErrorMessage(message);
      setIsErrorOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 학교 검색 핸들러
  const handleSchoolSearch = (query: string) => {
    setSchoolSearchQuery(query);
    setFormData((prev) => ({ ...prev, schoolName: query }));
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
      } catch (error) {
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
    setFormData((prev) => ({
      ...prev,
      schoolName: school.school_name ?? '',
      regionCode: school.region_code ?? '',
      schoolCode: school.school_code ?? '',
      schoolAddress: school.address ?? '',
    }));
    setSchoolSearchQuery(school.school_name ?? '');
    setFilteredSchools([]);
    setShowSchoolDropdown(false);
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

  const handleSchoolTypePrimaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      schoolTypePrimary: value,
      schoolTypeSecondary: value === '초등학교' ? '' : prev.schoolTypeSecondary,
    }));
  };

  const handleSchoolTypeSecondaryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, schoolTypeSecondary: event.target.value }));
  };

  const handleContactAreaCodeChange = (value: string) => {
    setContactAreaCode(value);
    const combined = contactNumber ? `${value}-${contactNumber}` : value;
    setFormData((prev) => ({ ...prev, phone: combined }));
  };

  const handleContactNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    setContactNumber(digits);
    const combined = contactAreaCode ? `${contactAreaCode}-${digits}` : digits;
    setFormData((prev) => ({ ...prev, phone: combined }));
  };

  const handleSchoolAreaCodeChange = (value: string) => {
    setSchoolAreaCode(value);
    const combined = schoolNumber ? `${value}-${schoolNumber}` : value;
    setFormData((prev) => ({ ...prev, schoolPhone: combined }));
  };

  const handleSchoolNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    setSchoolNumber(digits);
    const combined = schoolAreaCode ? `${schoolAreaCode}-${digits}` : digits;
    setFormData((prev) => ({ ...prev, schoolPhone: combined }));
  };

  const isSchoolSelected = Boolean(
    formData.regionCode.trim() &&
    formData.schoolCode.trim() &&
    formData.schoolAddress.trim()
  );
  const isSecondaryDisabled =
    !formData.schoolTypePrimary || formData.schoolTypePrimary === '초등학교';
  const isPasswordValid =
    Boolean(formData.password.trim()) && passwordPolicyError.length === 0;

  return (
    <div className="min-h-screen bg-[#F6F7F8] flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8 lg:p-12">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => onNavigate('login')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="로그인으로 돌아가기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800">학교 계정 회원가입</h2>
          </div>
          <p className="text-gray-600 mb-8">
            학교 급식 관리 시스템을 위한 학교 계정을 등록합니다.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Information Section */}
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-800 text-lg pb-2 border-b-2 border-[#00B3A4]">
                계정 정보
              </h3>

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  아이디 <span className="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="아이디를 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  담당자 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="school@example.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  담당자 연락처 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <div className="relative w-36">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="phone"
                      value={contactAreaCode}
                      onChange={(e) => handleContactAreaCodeChange(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all bg-white"
                      required
                    >
                      <option value="">지역번호</option>
                      <option value="010">010</option>
                      <option value="011">011</option>
                      <option value="016">016</option>
                      <option value="017">017</option>
                      <option value="018">018</option>
                      <option value="019">019</option>
                      <option value="02">02</option>
                      <option value="031">031</option>
                      <option value="032">032</option>
                      <option value="033">033</option>
                      <option value="041">041</option>
                      <option value="042">042</option>
                      <option value="043">043</option>
                      <option value="044">044</option>
                      <option value="051">051</option>
                      <option value="052">052</option>
                      <option value="053">053</option>
                      <option value="054">054</option>
                      <option value="055">055</option>
                      <option value="061">061</option>
                      <option value="062">062</option>
                      <option value="063">063</option>
                      <option value="064">064</option>
                      <option value="070">070</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => handleContactNumberChange(e.target.value)}
                    placeholder="1234-5678"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  영문/숫자/특수문자 포함. 8자 이상. ( ) &lt; &gt; " ' ; 사용 불가.
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="영문, 숫자, 특수문자 조합 8자 이상"
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {passwordPolicyError && (
                  <p className="mt-1.5 text-xs text-red-500">{passwordPolicyError}</p>
                )}
                {!passwordPolicyError && isPasswordValid && (
                  <p className="mt-1.5 text-xs text-green-600">
                    사용 가능한 비밀번호입니다.
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="비밀번호 재입력"
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-500">
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
              </div>
            </div>

            {/* School Information Section */}
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-800 text-lg pb-2 border-b-2 border-[#00B3A4]">
                학교 정보
              </h3>

              {/* School Name */}
              <div>
                <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-2">
                  학교명 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="schoolName"
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
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2 pointer-events-none">
                    {isSchoolSelected && (
                      <span className="text-xs text-[#00B3A4] bg-[#00B3A4]/10 px-2 py-0.5 rounded-full">
                        선택됨
                      </span>
                    )}
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>

                  {/* Dropdown for search results */}
                  {showSchoolDropdown && schoolSearchQuery && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {isSearchingSchools && (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          검색 중...
                        </div>
                      )}
                      {!isSearchingSchools && schoolSearchError && (
                        <div className="px-4 py-3 text-red-500 text-sm">
                          {schoolSearchError}
                        </div>
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
                            <div className="text-xs text-gray-500">{school.address}</div>
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

              {/* School Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  학교 구분1 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schoolTypePrimary"
                      value="초등학교"
                      checked={formData.schoolTypePrimary === '초등학교'}
                      onChange={handleSchoolTypePrimaryChange}
                      className="h-4 w-4 text-[#00B3A4] focus:ring-[#00B3A4] border-gray-300"
                      required
                    />
                    <span className="text-sm text-gray-700">초등학교</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schoolTypePrimary"
                      value="중학교"
                      checked={formData.schoolTypePrimary === '중학교'}
                      onChange={handleSchoolTypePrimaryChange}
                      className="h-4 w-4 text-[#00B3A4] focus:ring-[#00B3A4] border-gray-300"
                    />
                    <span className="text-sm text-gray-700">중학교</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schoolTypePrimary"
                      value="고등학교"
                      checked={formData.schoolTypePrimary === '고등학교'}
                      onChange={handleSchoolTypePrimaryChange}
                      className="h-4 w-4 text-[#00B3A4] focus:ring-[#00B3A4] border-gray-300"
                    />
                    <span className="text-sm text-gray-700">고등학교</span>
                  </label>
                </div>
              </div>

              {/* School Type - Coed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">학교 구분2</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                  value={formData.schoolTypeSecondary}
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
                <label htmlFor="regionCode" className="block text-sm font-medium text-gray-700 mb-2">
                  지역 코드 <span className="text-red-500">*</span>
                </label>
                <input
                  id="regionCode"
                  type="text"
                  value={formData.regionCode}
                  onChange={(e) => handleChange('regionCode', e.target.value)}
                  placeholder="예: C10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                  required
                  readOnly
                />
              </div>

              {/* School Code */}
              <div>
                <label htmlFor="schoolCode" className="block text-sm font-medium text-gray-700 mb-2">
                  학교 코드 <span className="text-red-500">*</span>
                </label>
                <input
                  id="schoolCode"
                  type="text"
                  value={formData.schoolCode}
                  onChange={(e) => handleChange('schoolCode', e.target.value)}
                  placeholder="예: 7150090"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                  required
                  readOnly
                />
              </div>

              {/* School Address */}
              <div>
                <label htmlFor="schoolAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  학교 주소 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="schoolAddress"
                      type="text"
                      value={formData.schoolAddress}
                      onChange={(e) => handleChange('schoolAddress', e.target.value)}
                      placeholder="주소를 검색하세요"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                      required
                      readOnly
                    />
                  </div>
                </div>
                <input
                  type="text"
                  value={formData.schoolAddressDetail}
                  onChange={(e) => handleChange('schoolAddressDetail', e.target.value)}
                  placeholder="상세 주소를 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                />
              </div>

              {/* School Phone */}
              <div>
                <label htmlFor="schoolPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호 (대표번호) <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">학부모 및 학생 문의용 대표 연락처</p>
                <div className="flex gap-3">
                  <div className="relative w-36">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="schoolPhone"
                      value={schoolAreaCode}
                      onChange={(e) => handleSchoolAreaCodeChange(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all bg-white"
                      required
                    >
                      <option value="">지역번호</option>
                      <option value="02">02</option>
                      <option value="031">031</option>
                      <option value="032">032</option>
                      <option value="033">033</option>
                      <option value="041">041</option>
                      <option value="042">042</option>
                      <option value="043">043</option>
                      <option value="044">044</option>
                      <option value="051">051</option>
                      <option value="052">052</option>
                      <option value="053">053</option>
                      <option value="054">054</option>
                      <option value="055">055</option>
                      <option value="061">061</option>
                      <option value="062">062</option>
                      <option value="063">063</option>
                      <option value="064">064</option>
                      <option value="070">070</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    value={schoolNumber}
                    onChange={(e) => handleSchoolNumberChange(e.target.value)}
                    placeholder="123-4567"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* School Email */}
              <div>
                <label htmlFor="schoolEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  학교 이메일
                </label>
                <input
                  id="schoolEmail"
                  type="email"
                  value={formData.schoolEmail}
                  onChange={(e) => handleChange('schoolEmail', e.target.value)}
                  placeholder="admin@school.kr"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Optional School Details */}
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-800 text-lg pb-2 border-b-2 border-[#00B3A4]">
                학교 상세 (선택)
              </h3>

              <div>
                <label htmlFor="studentCount" className="block text-sm font-medium text-gray-700 mb-2">
                  학생 수
                </label>
                <input
                  id="studentCount"
                  type="number"
                  min={0}
                  value={formData.studentCount}
                  onChange={(e) => handleChange('studentCount', e.target.value)}
                  placeholder="예: 580"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="targetUnitPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  목표 단가
                </label>
                <input
                  id="targetUnitPrice"
                  type="number"
                  min={0}
                  value={formData.targetUnitPrice}
                  onChange={(e) => handleChange('targetUnitPrice', e.target.value)}
                  placeholder="예: 5800"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="maxUnitPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  최대 단가
                </label>
                <input
                  id="maxUnitPrice"
                  type="number"
                  min={0}
                  value={formData.maxUnitPrice}
                  onChange={(e) => handleChange('maxUnitPrice', e.target.value)}
                  placeholder="예: 6200"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="cookWorkers" className="block text-sm font-medium text-gray-700 mb-2">
                  조리 종사자 수
                </label>
                <input
                  id="cookWorkers"
                  type="number"
                  min={0}
                  value={formData.cookWorkers}
                  onChange={(e) => handleChange('cookWorkers', e.target.value)}
                  placeholder="예: 6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="operationRules" className="block text-sm font-medium text-gray-700 mb-2">
                  운영 규칙
                </label>
                <textarea
                  id="operationRules"
                  value={formData.operationRules}
                  onChange={(e) => handleChange('operationRules', e.target.value)}
                  placeholder="운영 규칙을 입력하세요"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="kitchenEquipment" className="block text-sm font-medium text-gray-700 mb-2">
                  조리 시설
                </label>
                <textarea
                  id="kitchenEquipment"
                  value={formData.kitchenEquipment}
                  onChange={(e) => handleChange('kitchenEquipment', e.target.value)}
                  placeholder="조리 시설 정보를 입력하세요"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="space-y-3 pt-4">
              <h3 className="font-semibold text-gray-800 text-lg pb-2 border-b-2 border-[#00B3A4]">
                약관 동의
              </h3>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#00B3A4] focus:ring-[#00B3A4]"
                />
                <span className="text-sm text-gray-700">
                  <span className="text-red-500">*</span> 이용약관에 동의합니다.{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsTermsModalOpen(true);
                    }}
                    className="text-[#00B3A4] hover:underline"
                  >
                    자세히 보기
                  </button>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToPrivacy}
                  onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#00B3A4] focus:ring-[#00B3A4]"
                />
                <span className="text-sm text-gray-700">
                  <span className="text-red-500">*</span> 개인정보 처리방침에 동의합니다.{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPrivacyModalOpen(true);
                    }}
                    className="text-[#00B3A4] hover:underline"
                  >
                    자세히 보기
                  </button>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#00B3A4] text-white py-3.5 rounded-xl font-semibold hover:bg-[#009688] transition-colors shadow-sm hover:shadow-md mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? '회원가입 처리 중...' : '회원가입'}
            </button>

            {/* Links */}
            <div className="text-center text-sm text-gray-600 mt-4">
              이미 계정이 있으신가요?{' '}
              <button onClick={() => onNavigate('login')} className="text-[#00B3A4] hover:underline font-medium">
                로그인
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Terms Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAgree={() => setAgreedToTerms(true)}
      />

      {/* Privacy Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onAgree={() => setAgreedToPrivacy(true)}
      />
      <Footer />
      <ErrorModal
        isOpen={isErrorOpen}
        message={errorMessage ?? ''}
        onClose={() => setIsErrorOpen(false)}
      />
    </div>
  );
}
