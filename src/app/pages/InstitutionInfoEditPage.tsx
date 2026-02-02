import { Building2, Phone, Mail, Users, FileText, Warehouse } from 'lucide-react';
import { useState } from 'react';

export function InstitutionInfoEditPage() {
  const [activeTab, setActiveTab] = useState<'school' | 'rules'>('school');

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
                  defaultValue="서울중앙고등학교"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              {/* School Type - Level */}
              <div>
                <label className="block text-sm font-medium mb-2">학교 구분1</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]">
                  <option>초등학교</option>
                  <option>중학교</option>
                  <option selected>고등학교</option>
                </select>
              </div>

              {/* School Type - Coed */}
              <div>
                <label className="block text-sm font-medium mb-2">학교 구분2</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]">
                  <option selected>남녀공학</option>
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
                    defaultValue="02"
                    className="w-full sm:w-32 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                  >
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
                    defaultValue="1234"
                    className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                    placeholder="국번"
                  />
                  <input
                    type="tel"
                    defaultValue="5678"
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
                  defaultValue="info@seoulcentral.hs.kr"
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
                  defaultValue="1250"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              {/* Meal Price */}
              <div>
                <label className="block text-sm font-medium mb-2">목표 1식 단가 (원)</label>
                <input 
                  type="number" 
                  defaultValue="5500"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">1식 단가 상한선 (원)</label>
                <input 
                  type="number" 
                  defaultValue="6000"
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
                      defaultValue="8"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">주요 조리 기구 현황</label>
                    <textarea 
                      rows={6}
                      defaultValue="- 회전식 조리기 2대&#10;- 스팀솥 4대&#10;- 냉장고 6대 (업소용)"
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
                  defaultValue="[ 급식 제공 시간 ]&#10;• 중식: 12:00 - 13:00 (1학년 11:50, 2학년 12:10, 3학년 12:30 순차 배식)&#10;• 석식: 17:30 - 18:30 (자율 배식)&#10;&#10;[ 위생 및 안전 관리 ]&#10;• 알레르기 식재료 표시 의무화 (메뉴판 및 앱 공지)&#10;• 위생 점검 주 1회 실시 (담당: 영양사, 보건교사)&#10;• 식재료 검수 일일 실시 (오전 8시)&#10;&#10;[ 영양 관리 ]&#10;• 교육부 학교급식 영양관리기준 준수&#10;• 1일 권장 칼로리의 30%(중식), 25%(석식) 제공&#10;• 나트륨 저감화 메뉴 월 4회 이상 제공&#10;&#10;[ 만족도 관리 ]&#10;• 학생 및 학부모 만족도 조사 월 1회 실시&#10;• 선호도 조사 분기별 1회 실시 및 메뉴 반영&#10;• 급식 모니터링단 운영 (학부모 10명)&#10;&#10;[ 잔반 관리 ]&#10;• 잔반량 측정 및 기록 일일 실시&#10;• 잔반 감량 목표: 전년 대비 10% 감소"
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
