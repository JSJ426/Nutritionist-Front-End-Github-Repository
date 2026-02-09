export type KpiDiffProps = {
  diff?: string;
  trend?: 'up' | 'down' | 'same';
  showDiff?: boolean;
  showDiffLabel?: boolean;
  diffPrefix?: string;
  positiveDirection?: 'up' | 'down';
  positiveClassName?: string;
  negativeClassName?: string;
  neutralClassName?: string;
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
  positiveDirection = 'down',
  positiveClassName = 'text-green-600',
  negativeClassName = 'text-red-600',
  neutralClassName = 'text-gray-500',
  className,
}: KpiDiffTextProps) {
  if (!showDiff || !diff || !trend) return null;

  // const diffSuffix =
  //   typeof diff === 'string'
  //     ? diff.startsWith('+')
  //       ? ' 증가'
  //       : diff.startsWith('-')
  //         ? ' 감소'
  //         : ''
  //     : '';

  const content =
    trend === 'same'
      ? '-'
      : showDiffLabel
        ? `${diffPrefix} 대비 ${diff}`
        : `${diff}`;

  const isPositive =
    trend !== 'same' &&
    (positiveDirection === 'up' ? trend === 'up' : trend === 'down');
  const toneClass =
    trend === 'same'
      ? neutralClassName
      : isPositive
        ? positiveClassName
        : negativeClassName;

  return <span className={[toneClass, className].filter(Boolean).join(' ')}>{content}</span>;
}
