export const normalizeErrorMessage = (rawMessage: string, fallback: string) => {
  const message = rawMessage?.trim() ? rawMessage : fallback;
  const prefix = '서버 내부 오류: ';
  return message.startsWith(prefix) ? message.replace(prefix, '') : message;
};
