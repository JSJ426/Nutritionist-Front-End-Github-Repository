import { useState } from 'react';
import { Lock, Mail, Phone, Eye, EyeOff, Building2, MapPin, Search } from 'lucide-react';
import TermsModal from '../components/TermsModal';
import PrivacyModal from '../components/PrivacyModal';

type SchoolSignupPageProps = {
  onNavigate: (page: string) => void;
};

// 학교 목록 (학생 회원가입과 동일)
const schools = [
  '부산고등학교',
  '부산제일고등학교',
  '부산중앙고등학교',
  '부산여자고등학교',
  '해운대고등학교',
  '동래고등학교',
  '경남고등학교',
  '개성고등학교',
  '부산중학교',
  '부산제일중학교',
  '해운대중학교',
  '동래중학교',
  '부산초등학교',
  '해운대초등학교',
  '동래초등학교',
];

export function SchoolSignupPage({ onNavigate }: SchoolSignupPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    schoolType: '',
    schoolAddress: '',
    schoolAddressDetail: '',
    schoolPhone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // 학교 검색 관련 상태
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [filteredSchools, setFilteredSchools] = useState<string[]>([]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!agreedToTerms || !agreedToPrivacy) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    console.log('학교 계정 회원가입 시도:', formData);
    alert('학교 계정 회원가입이 완료되었습니다!');
    onNavigate('login');
  };

  // 학교 검색 핸들러
  const handleSchoolSearch = (query: string) => {
    setSchoolSearchQuery(query);
    setFormData((prev) => ({ ...prev, schoolName: query }));

    if (query) {
      const filtered = schools.filter((school) =>
        school.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSchools(filtered);
      setShowSchoolDropdown(true);
    } else {
      setFilteredSchools([]);
      setShowSchoolDropdown(false);
    }
  };

  const handleSchoolSelect = (school: string) => {
    setFormData((prev) => ({ ...prev, schoolName: school }));
    setSchoolSearchQuery(school);
    setFilteredSchools([]);
    setShowSchoolDropdown(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F8]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 (로그인 ID) <span className="text-red-500">*</span>
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

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
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
                    minLength={8}
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
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>

                  {/* Dropdown for search results */}
                  {showSchoolDropdown && schoolSearchQuery && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {filteredSchools.length > 0 ? (
                        filteredSchools.map((school) => (
                          <button
                            key={school}
                            type="button"
                            onClick={() => handleSchoolSelect(school)}
                            className="w-full px-4 py-3 text-left hover:bg-[#00B3A4]/5 transition-colors text-gray-700 border-b border-gray-100 last:border-b-0"
                          >
                            {school}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          검색 결과가 없습니다. 학교명을 직접 입력해주세요.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* School Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  학교 구분 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schoolType"
                      value="초등학교"
                      checked={formData.schoolType === '초등학교'}
                      onChange={(e) => handleChange('schoolType', e.target.value)}
                      className="h-4 w-4 text-[#00B3A4] focus:ring-[#00B3A4] border-gray-300"
                      required
                    />
                    <span className="text-sm text-gray-700">초등학교</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schoolType"
                      value="중학교"
                      checked={formData.schoolType === '중학교'}
                      onChange={(e) => handleChange('schoolType', e.target.value)}
                      className="h-4 w-4 text-[#00B3A4] focus:ring-[#00B3A4] border-gray-300"
                    />
                    <span className="text-sm text-gray-700">중학교</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schoolType"
                      value="고등학교"
                      checked={formData.schoolType === '고등학교'}
                      onChange={(e) => handleChange('schoolType', e.target.value)}
                      className="h-4 w-4 text-[#00B3A4] focus:ring-[#00B3A4] border-gray-300"
                    />
                    <span className="text-sm text-gray-700">고등학교</span>
                  </label>
                </div>
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
                  <button
                    type="button"
                    onClick={() => {
                      alert('주소 검색 기능은 실제 환경에서 Daum 우편번호 서비스 등을 연동하여 구현됩니다.');
                      // 실제로는 Daum 우편번호 API 등을 호출
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
                  >
                    주소 검색
                  </button>
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
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="schoolPhone"
                    type="tel"
                    value={formData.schoolPhone}
                    onChange={(e) => handleChange('schoolPhone', e.target.value)}
                    placeholder="051-000-0000"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                    required
                  />
                </div>
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
              className="w-full bg-[#00B3A4] text-white py-3.5 rounded-xl font-semibold hover:bg-[#009688] transition-colors shadow-sm hover:shadow-md mt-6"
            >
              회원가입
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
    </div>
  );
}
