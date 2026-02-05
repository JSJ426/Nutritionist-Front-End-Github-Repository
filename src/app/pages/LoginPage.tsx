import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

import mealTrayImage from '../../assets/a65a012f8dfb6e34563e688039daec79bf5a2d4c.png';
import { loginDietitian } from '../data/auth';
import { useAuth } from '../auth/AuthContext';

type LoginPageProps = {
  onLogin: () => void;
  onNavigate: (page: string) => void;
};

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithToken } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await loginDietitian({ username: username.trim(), pw: password });
      loginWithToken(response.accessToken);
      onLogin();
    } catch (error) {
      const message = error instanceof Error ? error.message : '로그인에 실패했습니다.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F8]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-white">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">로그인</h2>
              <p className="text-gray-600 mb-8">
                학교 급식 관리 시스템에 접속하려면 <span className="font-semibold">계정 정보</span>로 로그인하세요.
              </p>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  한눈에 보는 오늘의 급식
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  요일 탭으로 빠르게 중식/석식 정보를 확인할 수 있어요.
                </p>

                <div className="flex justify-center">
                  <img
                    src={mealTrayImage}
                    alt="급식 트레이 일러스트"
                    className="w-full max-w-sm"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">로그인</h2>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    아이디
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="아이디"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    비밀번호
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호"
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00B3A4] text-white py-3.5 rounded-xl font-semibold hover:bg-[#009688] transition-colors shadow-sm hover:shadow-md mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '로그인 중...' : '로그인'}
                </button>

                <div className="text-center text-sm text-gray-600 mt-4">
                  <button
                    type="button"
                    className="text-[#00B3A4] hover:underline font-medium"
                  >
                    아이디 찾기
                  </button>
                  {/* <button
                    type="button"
                    onClick={() => onNavigate('find-id')}
                    className="text-[#00B3A4] hover:underline font-medium"
                  >
                    아이디 찾기
                  </button> */}
                  <span className="mx-2">|</span>
                  <button
                    type="button"
                    className="text-[#00B3A4] hover:underline font-medium"
                  >
                    비밀번호 찾기
                  </button>
                  {/* <button
                    type="button"
                    onClick={() => onNavigate('find-password')}
                    className="text-[#00B3A4] hover:underline font-medium"
                  >
                    비밀번호 찾기
                  </button> */}
                  <span className="mx-2">|</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('school-signup')}
                    className="text-[#00B3A4] hover:underline font-medium"
                  >
                    회원가입
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
