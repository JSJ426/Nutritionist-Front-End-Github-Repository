type KpiCardProps = {
  icon?: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  sub?: string;
  color?: 'green' | 'red' | 'yellow';
};

export function KpiCard({ icon, title, value, unit, sub, color }: KpiCardProps) {
  const colorMap: Record<NonNullable<KpiCardProps['color']>, string> = {
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-500',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-5">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        {icon && <span className={color ? colorMap[color] : undefined}>{icon}</span>}
        <span>{title}</span>
      </div>

      <div className="flex items-end gap-2 mb-1">
        <span className="text-3xl font-semibold">{value}</span>
        {unit && <span className="text-gray-500">{unit}</span>}
      </div>

      {sub && (
        <div className={`text-sm ${color ? colorMap[color] : 'text-gray-500'}`}>
          {sub}
        </div>
      )}
    </div>
  );
}
