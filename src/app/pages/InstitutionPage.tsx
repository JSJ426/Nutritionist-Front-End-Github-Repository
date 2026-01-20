import { Building2, MapPin, Phone, Mail, Users, UtensilsCrossed, FileText, Warehouse } from 'lucide-react';
import { useState } from 'react';

export function InstitutionPage() {
  const [activeTab, setActiveTab] = useState<'basic' | 'meal-target' | 'regulations' | 'facilities'>('basic');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">기관 정보 등록/수정</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-300 mb-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('basic')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'basic' 
                ? 'text-[#5dccb4] border-b-2 border-[#5dccb4]' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            기본 정보
          </button>
          <button
            onClick={() => setActiveTab('meal-target')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'meal-target' 
                ? 'text-[#5dccb4] border-b-2 border-[#5dccb4]' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            급식 대상
          </button>
          <button
            onClick={() => setActiveTab('regulations')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'regulations' 
                ? 'text-[#5dccb4] border-b-2 border-[#5dccb4]' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            규정
          </button>
          <button
            onClick={() => setActiveTab('facilities')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'facilities' 
                ? 'text-[#5dccb4] border-b-2 border-[#5dccb4]' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            시설 현황
          </button>
        </div>
      </div>

      <div className="max-w-3xl">
        {/* 기본 정보 탭 */}
        {activeTab === 'basic' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium mb-6">기관 기본 정보</h2>
            
            <div className="space-y-6">
              {/* School Name */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Building2 size={16} />
                  학교명
                </label>
                <input 
                  type="text" 
                  defaultValue="서울중앙고등학교"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              {/* School Type */}
              <div>
                <label className="block text-sm font-medium mb-2">학교 구분</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]">
                  <option>초등학교</option>
                  <option>중학교</option>
                  <option selected>고등학교</option>
                  <option>특수학교</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  주소
                </label>
                <input 
                  type="text" 
                  defaultValue="서울특별시 강남구 테헤란로 123"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4] mb-2"
                  placeholder="기본 주소"
                />
                <input 
                  type="text" 
                  defaultValue="4층 급식관리실"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                  placeholder="상세 주소"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  대표 전화번호
                </label>
                <input 
                  type="tel" 
                  defaultValue="02-1234-5678"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
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

              {/* Principal */}
              <div>
                <label className="block text-sm font-medium mb-2">교장명</label>
                <input 
                  type="text" 
                  defaultValue="박철수"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              {/* Nutritionist */}
              <div>
                <label className="block text-sm font-medium mb-2">영양사명</label>
                <input 
                  type="text" 
                  defaultValue="김영희"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
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

        {/* 급식 대상 탭 */}
        {activeTab === 'meal-target' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium mb-6">급식 대상 정보</h2>
            
            <div className="space-y-6">
              {/* Student Count */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Users size={16} />
                  재학생 수
                </label>
                <input 
                  type="number" 
                  defaultValue="1250"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              {/* Age Range */}
              <div>
                <label className="block text-sm font-medium mb-2">대상 연령대</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]">
                  <option>유아 (5-7세)</option>
                  <option>초등 저학년 (8-10세)</option>
                  <option>초등 고학년 (11-13세)</option>
                  <option>중학생 (14-16세)</option>
                  <option selected>고등학생 (17-19세)</option>
                </select>
              </div>

              {/* Lunch Service */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      defaultChecked
                      className="w-4 h-4 text-[#5dccb4] rounded focus:ring-[#5dccb4]"
                    />
                    <span className="font-medium">중식 제공</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">중식 대상 학생 수</label>
                  <input 
                    type="number" 
                    defaultValue="1100"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                  />
                </div>
              </div>

              {/* Dinner Service */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      defaultChecked
                      className="w-4 h-4 text-[#5dccb4] rounded focus:ring-[#5dccb4]"
                    />
                    <span className="font-medium">석식 제공</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">석식 대상 학생 수</label>
                  <input 
                    type="number" 
                    defaultValue="350"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                  />
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

        {/* 규정 탭 */}
        {activeTab === 'regulations' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium mb-6">기관 내규 및 단가</h2>
            
            <div className="space-y-6">
              {/* Meal Price - Target */}
              <div>
                <label className="block text-sm font-medium mb-2">목표 1식 단가 (원)</label>
                <input 
                  type="number" 
                  defaultValue="5500"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
                <p className="text-xs text-gray-500 mt-1">식단표 생성 시 목표로 하는 1식 평균 단가</p>
              </div>

              {/* Meal Price - Maximum */}
              <div>
                <label className="block text-sm font-medium mb-2">1식 단가 상한선 (원)</label>
                <input 
                  type="number" 
                  defaultValue="6000"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
                <p className="text-xs text-gray-500 mt-1">1식 단가가 이 금액을 초과할 수 없음</p>
              </div>

              {/* 1식 구성 규정 */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FileText size={16} />
                  1식 구성 규정
                </label>
                <input 
                  type="text" 
                  defaultValue="밥 + 국 + 주찬 1 + 부찬 2 + 김치"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
                <p className="text-xs text-gray-500 mt-1">기본적인 1식 메뉴 구성 형태</p>
              </div>

              {/* 튀김류 제한 */}
              <div>
                <label className="block text-sm font-medium mb-2">튀김류 제공 제한</label>
                <input 
                  type="text" 
                  defaultValue="주 2회 이하"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
                <p className="text-xs text-gray-500 mt-1">건강한 급식을 위한 튀김 메뉴 빈도 제한</p>
              </div>

              {/* 주찬 중복 제한 */}
              <div>
                <label className="block text-sm font-medium mb-2">주찬 중복 제한</label>
                <input 
                  type="text" 
                  defaultValue="2주 이내 중복 불가"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
                <p className="text-xs text-gray-500 mt-1">메뉴의 다양성을 위한 주요 메뉴 중복 제한</p>
              </div>

              {/* Internal Regulations */}
              <div>
                <label className="block text-sm font-medium mb-2">기관 급식 운영 내규</label>
                <textarea 
                  rows={12}
                  defaultValue="[ 급식 제공 시간 ]&#10;• 중식: 12:00 - 13:00 (1학년 11:50, 2학년 12:10, 3학년 12:30 순차 배식)&#10;• 석식: 17:30 - 18:30 (자율 배식)&#10;&#10;[ 위생 및 안전 관리 ]&#10;• 알레르기 식재료 표시 의무화 (메뉴판 및 앱 공지)&#10;• 위생 점검 주 1회 실시 (담당: 영양사, 보건교사)&#10;• 식재료 검수 일일 실시 (오전 8시)&#10;&#10;[ 영양 관리 ]&#10;• 교육부 학교급식 영양관리기준 준수&#10;• 1일 권장 칼로리의 30%(중식), 25%(석식) 제공&#10;• 나트륨 저감화 메뉴 월 4회 이상 제공&#10;&#10;[ 만족도 관리 ]&#10;• 학생 및 학부모 만족도 조사 월 1회 실시&#10;• 선호도 조사 분기별 1회 실시 및 메뉴 반영&#10;• 급식 모니터링단 운영 (학부모 10명)&#10;&#10;[ 잔반 관리 ]&#10;• 잔반량 측정 및 기록 일일 실시&#10;• 잔반 감량 목표: 전년 대비 10% 감소"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4] font-mono text-sm leading-relaxed"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium mb-2">연간 급식 예산 (원)</label>
                <input 
                  type="number" 
                  defaultValue="1200000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
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

        {/* 시설 현황 탭 */}
        {activeTab === 'facilities' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium mb-6">급식 시설 현황</h2>
            
            <div className="space-y-6">
              {/* Kitchen Size */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Warehouse size={16} />
                  조리실 면적 (㎡)
                </label>
                <input 
                  type="number" 
                  defaultValue="180"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              {/* Dining Hall Size */}
              <div>
                <label className="block text-sm font-medium mb-2">식당 면적 (㎡)</label>
                <input 
                  type="number" 
                  defaultValue="450"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              {/* Seating Capacity */}
              <div>
                <label className="block text-sm font-medium mb-2">식당 좌석 수</label>
                <input 
                  type="number" 
                  defaultValue="400"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              {/* Number of Cook Staff */}
              <div>
                <label className="block text-sm font-medium mb-2">조리 인력 (명)</label>
                <input 
                  type="number" 
                  defaultValue="8"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              {/* Kitchen Equipment */}
              <div>
                <label className="block text-sm font-medium mb-2">주요 조리 기구 현황</label>
                <textarea 
                  rows={6}
                  defaultValue="- 회전식 조리기 2대&#10;- 스팀솥 4대&#10;- 냉장고 6대 (업소용)&#10;- 냉동고 3대&#10;- 식기세척기 2대&#10;- 배식대 10m"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                />
              </div>

              {/* Last Renovation */}
              <div>
                <label className="block text-sm font-medium mb-2">최근 시설 개보수 날짜</label>
                <input 
                  type="date" 
                  defaultValue="2024-03-15"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
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