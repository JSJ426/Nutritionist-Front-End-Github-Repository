export type KpiDiffProps = {
  diff?: string;
  trend?: 'up' | 'down' | 'same';
  showDiff?: boolean;
  showDiffLabel?: boolean;
  diffPrefix?: string;
};

type KpiDiffTextProps = KpiDiffProps & {
  className?: string;
};

export function KpiDiffText({
  diff,
  trend,
  showDiff = false,
  showDiffLabel = false,
  diffPrefix = '전일',
  className,
}: KpiDiffTextProps) {
  if (!showDiff || !diff || !trend) return null;

  const diffSuffix =
    typeof diff === 'string'
      ? diff.startsWith('+')
        ? ' 증가'
        : diff.startsWith('-')
          ? ' 감소'
          : ''
      : '';

  const content =
    trend === 'same'
      ? '-'
      : showDiffLabel
        ? `${diffPrefix} 대비 ${diff}${diffSuffix}`
        : `${diff}${diffSuffix}`;

  return <span className={className}>{content}</span>;
}
