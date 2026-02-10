import { useState } from 'react';
import { Mail } from 'lucide-react';

import { findDietitianId } from '../data/auth';
import { Footer } from '../components/Footer';
import { GuestHeader } from '../components/GuestHeader';

type FindIdPageProps = {
  onNavigate: (page: string) => void;
};

export function FindIdPage({ onNavigate }: FindIdPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [foundId, setFoundId] = useState('');
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
    return '아이디 찾기에 실패했습니다.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const response = await findDietitianId({ name: name.trim(), email: email.trim() });
      setFoundId(response.username);
    } catch (error) {
      setFoundId('');
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">아이디 찾기</h2>
          <p className="text-gray-600 mb-8">
            가입 시 입력한 정보로 아이디를 찾을 수 있습니다.
          </p>

          {foundId ? (
            /* Result Display */
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-8 border border-green-100">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00B3A4] text-white rounded-full mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">아이디를 찾았습니다</h3>
                <p className="text-gray-600 mb-6">회원님의 아이디는 다음과 같습니다.</p>
                <div className="bg-white rounded-lg py-4 px-6 inline-block border border-gray-200">
                  <p className="text-2xl font-bold text-[#00B3A4]">{foundId}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => onNavigate('find-password')}
                  className="flex-1 bg-white border-2 border-[#00B3A4] text-[#00B3A4] py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-center"
                >
                  비밀번호 찾기
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="flex-1 bg-[#00B3A4] text-white py-3 rounded-xl font-semibold hover:bg-[#009688] transition-colors shadow-sm text-center"
                >
                  로그인
                </button>
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-5">
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

              {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00B3A4] text-white py-3.5 rounded-xl font-semibold hover:bg-[#009688] transition-colors shadow-sm hover:shadow-md mt-6"
              >
                {isSubmitting ? '조회 중...' : '아이디 찾기'}
              </button>

              {/* Links */}
              <div className="text-center text-sm text-gray-600 mt-4">
                <button onClick={() => onNavigate('login')} className="hover:text-[#00B3A4] transition-colors">
                  로그인
                </button>
                <span className="mx-2">|</span>
                <button onClick={() => onNavigate('find-password')} className="hover:text-[#00B3A4] transition-colors">
                  비밀번호 찾기
                </button>
                <span className="mx-2">|</span>
                <button onClick={() => onNavigate('school-signup')} className="hover:text-[#00B3A4] transition-colors">
                  회원가입
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
