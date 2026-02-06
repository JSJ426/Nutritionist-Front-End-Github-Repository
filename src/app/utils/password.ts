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

  const typeCount = [hasLetter, hasDigit, hasSpecial].filter(Boolean).length;
  if (typeCount < 2) {
    return {
      isValid: false,
      message: '영문/숫자/특수문자 중 2종류 이상을 포함해야 합니다.',
    };
  }

  const minLength = typeCount === 3 ? 8 : 10;
  if (value.length < minLength || value.length > 16) {
    return {
      isValid: false,
      message:
        typeCount === 3
          ? '영문/숫자/특수문자 3종류 포함 시 8~16자로 입력해주세요.'
          : '영문/숫자/특수문자 2종류 포함 시 10~16자로 입력해주세요.',
    };
  }

  return { isValid: true, message: '' };
};
