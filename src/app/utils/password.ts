type PasswordValidationResult = {
  isValid: boolean;
  message: string;
};

const BANNED_SPECIALS = /[()<>\"';]/;
const LETTERS = /[A-Za-z]/;
const DIGITS = /[0-9]/;
const SPECIALS = /[^A-Za-z0-9]/;

export const validatePasswordPolicy = (value: string): PasswordValidationResult => {
  if (!value) {
    return { isValid: false, message: '비밀번호를 입력해주세요.' };
  }

  if (BANNED_SPECIALS.test(value)) {
    return {
      isValid: false,
      message: '비밀번호에 사용할 수 없는 특수문자가 포함되어 있습니다. ( ) < > " \' ;',
    };
  }

  const hasLetter = LETTERS.test(value);
  const hasDigit = DIGITS.test(value);
  const hasSpecial = SPECIALS.test(value);

  if (!hasLetter || !hasDigit || !hasSpecial) {
    return {
      isValid: false,
      message: '영문/숫자/특수문자를 모두 포함해야 합니다.',
    };
  }

  if (value.length < 8) {
    return {
      isValid: false,
      message: '비밀번호는 8자 이상이어야 합니다.',
    };
  }

  return { isValid: true, message: '' };
};
