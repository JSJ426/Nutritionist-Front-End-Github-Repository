export type DateText = string;
export type SizeText = string;
export type NumberText = string;

export const formatDateYmd = (value?: string): DateText => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatNumberText = (value?: number): NumberText => {
  if (typeof value !== 'number') return '-';
  return value.toLocaleString();
};

export const formatFileSizeText = (bytes?: number): SizeText => {
  if (bytes === undefined || bytes === null) return '-';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};
