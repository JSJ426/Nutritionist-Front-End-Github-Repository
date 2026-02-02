import { MealMonthlyCalendarEditable } from "../components/MealMonthlyCalendarEditable";

export function MealEditPage() {
  const handleSubmit = (payload: { reason: string; menus: string[] }) => {
    console.log('Meal edit payload:', payload);
    alert('식단표 수정 요청이 전송되었습니다.');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
        <h1 className="text-3xl font-medium border-b-2 border-gray-300 pb-2">
          식단표 수정
        </h1>
      </div>

      <div className="flex-1 overflow-hidden px-6 py-6">
        <MealMonthlyCalendarEditable onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
