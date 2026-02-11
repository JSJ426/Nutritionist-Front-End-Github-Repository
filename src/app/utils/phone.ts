export const normalizeLocalNumber = (value: string) => value.replace(/\D/g, '').slice(0, 8);

export const formatLocalNumber = (value: string) => {
  const digits = normalizeLocalNumber(value);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, -4)}-${digits.slice(-4)}`;
};

const normalizeAreaCode = (value: string) => value.replace(/\D/g, '');

export const splitPhone = (phoneRaw: string) => {
  const raw = phoneRaw.trim();
  if (!raw) {
    return { areaCode: '', localNumber: '' };
  }

  if (raw.includes('-')) {
    const [areaPart, ...localParts] = raw.split('-');
    return {
      areaCode: normalizeAreaCode(areaPart ?? ''),
      localNumber: normalizeLocalNumber(localParts.join('')),
    };
  }

  const digitsOnly = raw.replace(/\D/g, '');
  if (!digitsOnly) {
    return { areaCode: '', localNumber: '' };
  }

  if (digitsOnly.startsWith('02') && digitsOnly.length >= 9) {
    return {
      areaCode: '02',
      localNumber: normalizeLocalNumber(digitsOnly.slice(2)),
    };
  }

  if (digitsOnly.length >= 10) {
    return {
      areaCode: digitsOnly.slice(0, 3),
      localNumber: normalizeLocalNumber(digitsOnly.slice(3)),
    };
  }

  return {
    areaCode: '',
    localNumber: normalizeLocalNumber(digitsOnly),
  };
};

export const composePhone = (areaCode: string, localNumber: string) => {
  const normalizedArea = normalizeAreaCode(areaCode.trim());
  const formattedLocal = formatLocalNumber(localNumber);

  if (normalizedArea && formattedLocal) return `${normalizedArea}-${formattedLocal}`;
  return formattedLocal || normalizedArea;
};
