import { useState } from 'react';
import { Mail, User } from 'lucide-react';

import { findDietitianPassword } from '../data/auth';
import { Footer } from '../components/Footer';
import { GuestHeader } from '../components/GuestHeader';

type FindPasswordPageProps = {
  onNavigate: (page: string) => void;
};

export function FindPasswordPage({ onNavigate }: FindPasswordPageProps) {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    return '비밀번호 찾기에 실패했습니다.';
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setMessage('');
      const response = await findDietitianPassword({
        username: userId.trim(),
        name: name.trim(),
        email: email.trim(),
      });
      setMessage(response.message);
    } catch (error) {
      setMessage('');
      setErrorMessage(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F8] flex flex-col">
      <GuestHeader
        onLogoClick={() => onNavigate('login')}
      />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8 lg:p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">비밀번호 찾기</h2>
          <p className="text-gray-600 mb-8">
            가입 시 입력한 정보로 본인 확인을 진행합니다.
          </p>

          <form onSubmit={handleVerify} className="space-y-5">
            {/* User ID Input */}
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                아이디
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="아이디를 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@school.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B3A4] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {message && (
              <div className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#00B3A4] text-white py-3.5 rounded-xl font-semibold hover:bg-[#009688] transition-colors shadow-sm hover:shadow-md mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '요청 중...' : '임시 비밀번호 발급 요청'}
            </button>

            {/* Links */}
            <div className="text-center text-sm text-gray-600 mt-4">
              <button onClick={() => onNavigate('login')} className="hover:text-[#00B3A4] transition-colors">
                로그인
              </button>
              <span className="mx-2">|</span>
              <button onClick={() => onNavigate('find-id')} className="hover:text-[#00B3A4] transition-colors">
                아이디 찾기
              </button>
              <span className="mx-2">|</span>
              <button onClick={() => onNavigate('school-signup')} className="hover:text-[#00B3A4] transition-colors">
                회원가입
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
