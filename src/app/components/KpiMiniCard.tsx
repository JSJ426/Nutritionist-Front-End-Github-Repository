import { KpiDiffProps, KpiDiffText } from './KpiDiffText';

type KpiMiniCardProps = KpiDiffProps & {
  title: string;
  value: string | number;
  unit: string;
  isEmpty?: boolean;
  emptyLabel?: string;
};

export function KpiMiniCard({
  title,
  value,
  unit,
  diff,
  trend,
  showDiff,
  showDiffLabel,
  diffPrefix,
  isEmpty = false,
  emptyLabel = '데이터 없음',
}: KpiMiniCardProps) {
  const trendStyle: Record<NonNullable<KpiMiniCardProps['trend']>, string> = {
    up: 'text-red-600',
    down: 'text-green-600',
    same: 'text-gray-500',
  };
  const displayValue = isEmpty ? '—' : value;
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
        <span>{title}</span>
        {isEmpty && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {emptyLabel}
          </span>
        )}
      </div>

      <div className="flex items-end gap-1 mb-1">
        <span className="text-2xl font-semibold">{displayValue}</span>
        {!isEmpty && <span className="text-sm text-gray-500">{unit}</span>}
      </div>

      {!isEmpty && showDiff && diff && trend && (
        <div className={`text-sm ${trendStyle[trend]}`}>
          <KpiDiffText
            diff={diff}
            trend={trend}
            showDiff={showDiff}
            showDiffLabel={showDiffLabel}
            diffPrefix={diffPrefix}
          />
        </div>
      )}
    </div>
  );
}
