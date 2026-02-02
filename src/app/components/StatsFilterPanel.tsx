import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Input } from './ui/input';

type Option = { value: string; label: string };

interface StatsFilterPanelProps {
  period: string;
  onPeriodChange: (value: string) => void;
  mealType: string;
  onMealTypeChange: (value: string) => void;
  onSearch: () => void;
  showMenuType?: boolean;
  menuType?: string;
  onMenuTypeChange?: (value: string) => void;
  showCustomDates?: boolean;
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (value: string) => void;
  onEndDateChange?: (value: string) => void;
  periodOptions?: Option[];
  mealOptions?: Option[];
  menuTypeOptions?: Option[];
  customValue?: string;
}

const defaultPeriodOptions: Option[] = [
  { value: 'weekly', label: '주간 (최근 7일)' },
  { value: 'monthly', label: '월간 (최근 30일)' },
  { value: 'custom', label: '사용자 지정' },
];

const defaultMealOptions: Option[] = [
  { value: 'all', label: '전체' },
  { value: 'lunch', label: '중식' },
  { value: 'dinner', label: '석식' },
];

const defaultMenuTypeOptions: Option[] = [
  { value: 'all', label: '전체' },
  { value: 'main', label: '주메뉴' },
  { value: 'side', label: '반찬' },
  { value: 'soup', label: '국·찌개' },
];

export function StatsFilterPanel({
  period,
  onPeriodChange,
  mealType,
  onMealTypeChange,
  onSearch,
  showMenuType = false,
  menuType = 'all',
  onMenuTypeChange,
  showCustomDates = false,
  startDate = '',
  endDate = '',
  onStartDateChange,
  onEndDateChange,
  periodOptions = defaultPeriodOptions,
  mealOptions = defaultMealOptions,
  menuTypeOptions = defaultMenuTypeOptions,
  customValue = 'custom',
}: StatsFilterPanelProps) {
  const isCustomPeriod = showCustomDates && period === customValue;
  const gridColsClass = showMenuType ? 'md:grid-cols-4' : 'md:grid-cols-3';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">조회 조건</h3>
      <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
        <div>
          <label className="text-sm text-gray-600 mb-2 block">기간 선택</label>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isCustomPeriod && (
          <>
            <div>
              <label className="text-sm text-gray-600 mb-2 block">시작 날짜</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange?.(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block">종료 날짜</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange?.(e.target.value)}
              />
            </div>
          </>
        )}

        <div>
          <label className="text-sm text-gray-600 mb-2 block">식사 구분</label>
          <Select value={mealType} onValueChange={onMealTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mealOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showMenuType && (
          <div>
            <label className="text-sm text-gray-600 mb-2 block">메뉴 유형</label>
            <Select value={menuType} onValueChange={onMenuTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {menuTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-end">
          <Button className="w-full" onClick={onSearch}>
            조회
          </Button>
        </div>
      </div>
    </div>
  );
}
