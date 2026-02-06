import { useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '../auth/AuthContext';
import { withdrawDietitian } from '../data/auth';

interface NutritionistWithdrawalPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function NutritionistWithdrawalPage({ onNavigate }: NutritionistWithdrawalPageProps) {
  const { logout } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordMismatch =
    Boolean(confirmPassword.trim()) && Boolean(password.trim()) && confirmPassword !== password;

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
    return '탈퇴에 실패했습니다.';
  };

  const handleWithdraw = async () => {
    if (!password.trim()) {
      setErrorMessage('비밀번호를 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    setErrorMessage('');
    try {
      setIsSubmitting(true);
      await withdrawDietitian({ pw: password.trim() });
      toast.success('성공적으로 탈퇴되었습니다.');
      setPassword('');
      setConfirmPassword('');
      logout();
      onNavigate?.('login');
    } catch (error) {
      setErrorMessage(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">회원탈퇴</h1>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div className="text-sm text-gray-600 space-y-1">
            <p>탈퇴 시 계정 정보가 삭제되며 복구할 수 없습니다.</p>
            <p>탈퇴 후 동일한 아이디로 재가입이 제한될 수 있습니다.</p>
            <p>탈퇴가 완료되면 자동으로 로그아웃됩니다.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrorMessage('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
              placeholder="비밀번호 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setErrorMessage('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
              placeholder="비밀번호 재입력"
            />
            {passwordMismatch && (
              <p className="text-sm text-red-500 mt-2">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => onNavigate?.('nutritionist-info')}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              onClick={handleWithdraw}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? '탈퇴 중...' : '탈퇴하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
