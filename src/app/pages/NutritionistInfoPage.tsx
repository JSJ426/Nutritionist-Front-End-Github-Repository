import { useEffect, useState } from 'react';
import { KeyRound, Lock, Phone, User } from 'lucide-react';

import { getNutritionistProfile } from '../data/nutritionist';
import { validatePasswordPolicy } from '../utils/password';

interface NutritionistInfoPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function NutritionistInfoPage({ onNavigate }: NutritionistInfoPageProps) {
  const [formState, setFormState] = useState({
    name: '',
    phoneArea: '',
    phoneMiddle: '',
    phoneLine: '',
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const passwordMismatch =
    Boolean(confirmPassword.trim()) && Boolean(newPassword.trim()) && confirmPassword !== newPassword;

  useEffect(() => {
    const loadProfile = async () => {
      const response = await getNutritionistProfile();
      if (response?.status !== 'success') return;
      const phoneRaw = response.data.phone ?? '';
      const [phoneArea, phoneMiddle, phoneLine] = phoneRaw.split('-');
      setFormState({
        name: response.data.name ?? '',
        phoneArea: phoneArea ?? '',
        phoneMiddle: phoneMiddle ?? '',
        phoneLine: phoneLine ?? '',
      });
    };
    void loadProfile();
  }, []);

  const validate = () => {
    const nextErrors: { name?: string; phone?: string } = {};
    const trimmedName = formState.name.trim();
    const trimmedArea = formState.phoneArea.trim();
    const trimmedMiddle = formState.phoneMiddle.trim();
    const trimmedLine = formState.phoneLine.trim();
    const allDigits = /^[0-9]+$/;

    if (!trimmedName) {
      nextErrors.name = '영양사 이름을 입력해주세요.';
    }

    if (!trimmedArea || !trimmedMiddle || !trimmedLine) {
      nextErrors.phone = '영양사 전화번호를 입력해주세요.';
    } else if (
      !allDigits.test(trimmedArea) ||
      !allDigits.test(trimmedMiddle) ||
      !allDigits.test(trimmedLine) ||
      trimmedArea.length < 2 ||
      trimmedArea.length > 4 ||
      trimmedMiddle.length < 3 ||
      trimmedMiddle.length > 4 ||
      trimmedLine.length !== 4
    ) {
      nextErrors.phone = '전화번호 형식을 확인해주세요.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    const trimmedName = formState.name.trim();
    const trimmedArea = formState.phoneArea.trim();
    const trimmedMiddle = formState.phoneMiddle.trim();
    const trimmedLine = formState.phoneLine.trim();

    setFormState({
      name: trimmedName,
      phoneArea: trimmedArea,
      phoneMiddle: trimmedMiddle,
      phoneLine: trimmedLine,
    });
  };

  const handlePasswordChange = () => {
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
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
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
                      value={formState.phoneMiddle}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, phoneMiddle: event.target.value }))
                      }
                      className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                      placeholder="국번"
                    />
                    <input
                      type="tel"
                      value={formState.phoneLine}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, phoneLine: event.target.value }))
                      }
                      className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                      placeholder="개인번호"
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-500 mt-2">{errors.phone}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-8">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#5dccb4] text-white rounded hover:bg-[#4dbba3]"
            >
              저장
            </button>
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
                영문/숫자/특수문자 중 2종 이상 포함. 2종 10~16자, 3종 8~16자 ( ) &lt; &gt; " ' ; 사용 불가.
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
            <button
              onClick={handlePasswordChange}
              className="px-6 py-2 bg-[#5dccb4] text-white rounded hover:bg-[#4dbba3]"
            >
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
