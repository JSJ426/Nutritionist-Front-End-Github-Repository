import { KpiDiffProps, KpiDiffText } from './KpiDiffText';

type KpiCardProps = KpiDiffProps & {
  icon?: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  sub?: string;
  color?: 'green' | 'red' | 'yellow';
  isEmpty?: boolean;
  emptyLabel?: string;
};

export function KpiCard({
  icon,
  title,
  value,
  unit,
  sub,
  diff,
  trend,
  showDiff,
  showDiffLabel,
  diffPrefix,
  color,
  isEmpty = false,
  emptyLabel = '데이터 없음',
}: KpiCardProps) {
  const colorMap: Record<NonNullable<KpiCardProps['color']>, string> = {
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-500',
  };
  const displayValue = isEmpty ? '—' : value;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-5">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className={color ? colorMap[color] : undefined}>{icon}</span>}
          <span>{title}</span>
        </div>
        {isEmpty && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {emptyLabel}
          </span>
        )}
      </div>

      <div className="flex items-end gap-2 mb-1">
        <span className="text-3xl font-semibold">{displayValue}</span>
        {!isEmpty && unit && <span className="text-gray-500">{unit}</span>}
      </div>

      {!isEmpty && (sub || (showDiff && diff && trend)) && (
        <div className={`text-sm ${color ? colorMap[color] : 'text-gray-500'}`}>
          {showDiff && diff && trend ? (
            <KpiDiffText
              diff={diff}
              trend={trend}
              showDiff={showDiff}
              showDiffLabel={showDiffLabel}
              diffPrefix={diffPrefix}
            />
          ) : (
            sub
          )}
        </div>
      )}
    </div>
  );
}
