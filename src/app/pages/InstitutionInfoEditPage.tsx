import { useEffect, useState } from 'react';
import { Building2, Phone, Mail, Users, FileText, Warehouse } from 'lucide-react';

import { getSchoolResponse } from '../data/school';

export function InstitutionInfoEditPage() {
  const [activeTab, setActiveTab] = useState<'school' | 'rules'>('school');
  const [form, setForm] = useState({
    schoolName: '',
    schoolTypePrimary: '',
    schoolTypeSecondary: '',
    phoneArea: '',
    phoneMiddle: '',
    phoneLine: '',
    email: '',
    studentCount: '',
    mealPriceTarget: '',
    mealPriceMax: '',
    staffCount: '',
    equipmentDetails: '',
    rulesText: '',
  });

  useEffect(() => {
    const loadSchoolInfo = async () => {
      const response = await getSchoolResponse();
      if (response?.status !== 'success') return;
      const schoolTypeRaw = response.data.school_type ?? '';
      const schoolTypePrimary =
        schoolTypeRaw.includes('초') ? '초등학교' :
        schoolTypeRaw.includes('중') ? '중학교' :
        schoolTypeRaw.includes('고') ? '고등학교' :
        '';
      const phoneRaw = response.data.phone ?? '';
      const [phoneArea, phoneMiddle, phoneLine] = phoneRaw.split('-');
      setForm({
        schoolName: response.data.school_name ?? '',
        schoolTypePrimary,
        schoolTypeSecondary: '',
        phoneArea: phoneArea ?? '',
        phoneMiddle: phoneMiddle ?? '',
        phoneLine: phoneLine ?? '',
        email: response.data.email ?? '',
        studentCount: String(response.data.student_count ?? ''),
        mealPriceTarget: String(response.data.target_unit_price ?? ''),
        mealPriceMax: String(response.data.max_unit_price ?? ''),
        staffCount: String(response.data.cook_workers ?? ''),
        equipmentDetails: response.data.kitchen_equipment ?? '',
        rulesText: response.data.operation_rules ?? '',
      });
    };
    void loadSchoolInfo();
  }, []);

  const handleFieldChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

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
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Building2 size={16} />
                  학교 이름
                </label>
                <input 
                  type="text" 
                  value={form.schoolName}
                  onChange={handleFieldChange('schoolName')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              {/* School Type - Level */}
              <div>
                <label className="block text-sm font-medium mb-2">학교 구분1</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                  value={form.schoolTypePrimary}
                  onChange={handleFieldChange('schoolTypePrimary')}
                >
                  <option value="">선택</option>
                  <option>초등학교</option>
                  <option>중학교</option>
                  <option>고등학교</option>
                </select>
              </div>

              {/* School Type - Coed */}
              <div>
                <label className="block text-sm font-medium mb-2">학교 구분2</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                  value={form.schoolTypeSecondary}
                  onChange={handleFieldChange('schoolTypeSecondary')}
                >
                  <option value="">선택</option>
                  <option>남녀공학</option>
                  <option>남학교</option>
                  <option>여학교</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  대표 전화번호
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    className="w-full sm:w-32 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                    value={form.phoneArea}
                    onChange={handleFieldChange('phoneArea')}
                  >
                    <option value="">선택</option>
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
                    <option value="010">010</option>
                    <option value="011">011</option>
                    <option value="016">016</option>
                    <option value="017">017</option>
                    <option value="018">018</option>
                    <option value="019">019</option>
                  </select>
                  <input
                    type="tel"
                    value={form.phoneMiddle}
                    onChange={handleFieldChange('phoneMiddle')}
                    className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                    placeholder="국번"
                  />
                  <input
                    type="tel"
                    value={form.phoneLine}
                    onChange={handleFieldChange('phoneLine')}
                    className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                    placeholder="개인번호"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
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
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
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
                <label className="block text-sm font-medium mb-2">목표 1식 단가 (원)</label>
                <input 
                  type="number" 
                  value={form.mealPriceTarget}
                  onChange={handleFieldChange('mealPriceTarget')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">1식 단가 상한선 (원)</label>
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
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
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
                    <label className="block text-sm font-medium mb-2">주요 조리 기구 현황</label>
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
              <button className="px-6 py-2 bg-[#5dccb4] text-white rounded hover:bg-[#4dbba3]">
                저장
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
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
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
              <button className="px-6 py-2 bg-[#5dccb4] text-white rounded hover:bg-[#4dbba3]">
                저장
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
