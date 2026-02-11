import { useEffect, useState } from 'react';
import { KeyRound, Lock, Mail, Phone, User } from 'lucide-react';

import { getNutritionistProfile, patchNutritionistMe, putNutritionistPassword } from '../data/nutritionist';
import { validatePasswordPolicy } from '../utils/password';
import { Button } from '../components/ui/button';
import { useErrorModal } from '../hooks/useErrorModal';
import { normalizeErrorMessage } from '../utils/errorMessage';
import { composePhone, formatLocalNumber, normalizeLocalNumber, splitPhone } from '../utils/phone';

interface NutritionistInfoPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function NutritionistInfoPage({ onNavigate }: NutritionistInfoPageProps) {
  const { openAlert } = useErrorModal();
  const [formState, setFormState] = useState({
    name: '',
    phoneArea: '',
    phoneNumber: '',
    email: '',
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const passwordMismatch =
    Boolean(confirmPassword.trim()) && Boolean(newPassword.trim()) && confirmPassword !== newPassword;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getNutritionistProfile();
        const { areaCode, localNumber } = splitPhone(response.phone ?? '');

        setFormState({
          name: response.name ?? '',
          phoneArea: areaCode ?? '',
          phoneNumber: localNumber ?? '',
          email: response.email ?? '',
        });
      } catch {
        return;
      }
    };
    void loadProfile();
  }, []);

  const validate = () => {
    const nextErrors: { name?: string; phone?: string; email?: string } = {};
    const trimmedName = formState.name.trim();
    const trimmedArea = formState.phoneArea.trim();
    const trimmedNumber = formState.phoneNumber.trim();
    const trimmedEmail = formState.email.trim();
    const allDigits = /^[0-9]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      nextErrors.name = '영양사 이름을 입력해주세요.';
    }

    if (!trimmedEmail) {
      nextErrors.email = '이메일을 입력해주세요.';
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = '이메일 형식을 확인해주세요.';
    }

    if (!trimmedArea || !trimmedNumber) {
      nextErrors.phone = '영양사 전화번호를 입력해주세요.';
    } else if (
      !allDigits.test(trimmedArea) ||
      !allDigits.test(trimmedNumber) ||
      trimmedArea.length < 2 ||
      trimmedArea.length > 4 ||
      trimmedNumber.length > 8
    ) {
      nextErrors.phone = '전화번호 형식을 확인해주세요.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

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
    return '저장에 실패했습니다.';
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    const trimmedName = formState.name.trim();
    const trimmedArea = formState.phoneArea.trim();
    const trimmedNumber = normalizeLocalNumber(formState.phoneNumber);
    const trimmedEmail = formState.email.trim();
    const phone = composePhone(trimmedArea, trimmedNumber);

    setFormState({
      name: trimmedName,
      phoneArea: trimmedArea,
      phoneNumber: trimmedNumber,
      email: trimmedEmail,
    });

    try {
      setIsSaving(true);
      const response = await patchNutritionistMe({
        name: trimmedName,
        phone,
        email: trimmedEmail,
      });
      const nextPhone = splitPhone(response.phone ?? phone);
      setFormState({
        name: response.name ?? trimmedName,
        phoneArea: nextPhone.areaCode,
        phoneNumber: nextPhone.localNumber,
        email: response.email ?? trimmedEmail,
      });
      openAlert('저장되었습니다.', { title: '안내' });
    } catch (error) {
      openAlert(
        normalizeErrorMessage(extractErrorMessage(error), '저장에 실패했습니다.'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setPasswordError('현재 비밀번호와 새 비밀번호를 모두 입력해주세요.');
      setPasswordSuccess(false);
      return;
    }

    const policyResult = validatePasswordPolicy(newPassword);
    if (!policyResult.isValid) {
      setPasswordError(policyResult.message);
      setPasswordSuccess(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      setPasswordSuccess(false);
      return;
    }

    setPasswordError('');
    try {
      setIsPasswordSaving(true);
      await putNutritionistPassword({
        current_password: currentPassword.trim(),
        new_password: newPassword.trim(),
      });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordSuccess(false);
      openAlert(
        normalizeErrorMessage(extractErrorMessage(error), '비밀번호 변경에 실패했습니다.'),
      );
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">영양사 정보</h1>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium mb-6">기본 정보</h2>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <User size={16} className="mt-1 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">영양사 이름</p>
                <div className="mt-2">
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-2">{errors.name}</p>}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={16} className="mt-1 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">영양사 전화번호</p>
                <div className="mt-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <select
                      value={formState.phoneArea}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, phoneArea: event.target.value }))
                      }
                      className="w-full sm:w-32 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
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
                      <option value="010">010</option>
                      <option value="011">011</option>
                      <option value="016">016</option>
                      <option value="017">017</option>
                      <option value="018">018</option>
                      <option value="019">019</option>
                      <option value="070">070</option>
                    </select>
                    <input
                      type="tel"
                      value={formatLocalNumber(formState.phoneNumber)}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          phoneNumber: normalizeLocalNumber(event.target.value),
                        }))
                      }
                      className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                      placeholder="1234-5678"
                      required
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-500 mt-2">{errors.phone}</p>}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={16} className="mt-1 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">이메일</p>
                <div className="mt-2">
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, email: event.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                    placeholder="name@example.com"
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-2">{errors.email}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-8">
            <Button
              variant="brand"
              onClick={handleSave}
              className="px-6 py-2 h-auto disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {isSaving ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium mb-6">비밀번호 변경</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Lock size={16} />
                현재 비밀번호
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => {
                  setCurrentPassword(event.target.value);
                  setPasswordSuccess(false);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                placeholder="현재 비밀번호 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <KeyRound size={16} />
                새 비밀번호
              </label>
              <p className="text-xs text-gray-500 mb-2">
                영문/숫자/특수문자 포함. 8자 이상. ( ) &lt; &gt; " ' ; 사용 불가.
              </p>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => {
                  const value = event.target.value;
                  setNewPassword(value);
                  const result = validatePasswordPolicy(value);
                  setPasswordError(result.isValid ? '' : result.message);
                  setPasswordSuccess(false);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                placeholder="새 비밀번호 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <KeyRound size={16} />
                새 비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setPasswordSuccess(false);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                placeholder="새 비밀번호 재입력"
              />
              {passwordMismatch && (
                <p className="text-sm text-red-500 mt-2">새 비밀번호가 일치하지 않습니다.</p>
              )}
              {passwordError && <p className="text-sm text-red-500 mt-2">{passwordError}</p>}
              {passwordSuccess && (
                <p className="text-sm text-green-600 mt-2">비밀번호 변경이 완료되었습니다.</p>
              )}
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-8">
            <Button
              variant="brand"
              onClick={handlePasswordChange}
              className="px-6 py-2 h-auto disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isPasswordSaving}
            >
              {isPasswordSaving ? '변경 중...' : '비밀번호 변경'}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium mb-4">회원탈퇴</h2>
          <p className="text-sm text-gray-600">
            탈퇴를 진행하면 계정 정보가 삭제되며 복구할 수 없습니다.
          </p>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => onNavigate?.('nutritionist-withdrawal')}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              회원탈퇴 페이지로 이동
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
