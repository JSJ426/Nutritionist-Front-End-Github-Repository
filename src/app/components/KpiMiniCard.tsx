type KpiMiniCardProps = {
  title: string;
  value: string | number;
  unit: string;
  diff?: string;
  trend?: 'up' | 'down' | 'same';
};

export function KpiMiniCard({ title, value, unit, diff, trend }: KpiMiniCardProps) {
  const trendStyle: Record<NonNullable<KpiMiniCardProps['trend']>, string> = {
    up: 'text-red-600',
    down: 'text-green-600',
    same: 'text-gray-500',
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="text-sm text-gray-500 mb-1">{title}</div>

      <div className="flex items-end gap-1 mb-1">
        <span className="text-2xl font-semibold">{value}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>

      {diff && trend && (
        <div className={`text-sm ${trendStyle[trend]}`}>
          전일 대비 {diff}
        </div>
      )}
    </div>
  );
}
