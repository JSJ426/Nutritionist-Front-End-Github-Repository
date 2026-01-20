import { User, Mail, Phone, Lock } from 'lucide-react';

export function MyPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">마이페이지</h1>
      </div>

      <div className="max-w-2xl">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-medium mb-6">프로필 정보</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <User size={16} />
                이름
              </label>
              <input 
                type="text" 
                defaultValue="김영희"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Mail size={16} />
                이메일
              </label>
              <input 
                type="email" 
                defaultValue="younghee.kim@school.ac.kr"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Phone size={16} />
                전화번호
              </label>
              <input 
                type="tel" 
                defaultValue="010-1234-5678"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">직책</label>
              <input 
                type="text" 
                defaultValue="영양사"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">
              취소
            </button>
            <button className="px-6 py-2 bg-[#5dccb4] text-white rounded hover:bg-[#4dbba3]">
              저장
            </button>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
            <Lock size={20} />
            비밀번호 변경
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">현재 비밀번호</label>
              <input 
                type="password" 
                placeholder="현재 비밀번호를 입력하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">새 비밀번호</label>
              <input 
                type="password" 
                placeholder="새 비밀번호를 입력하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">새 비밀번호 확인</label>
              <input 
                type="password" 
                placeholder="새 비밀번호를 다시 입력하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">
              취소
            </button>
            <button className="px-6 py-2 bg-[#5dccb4] text-white rounded hover:bg-[#4dbba3]">
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
