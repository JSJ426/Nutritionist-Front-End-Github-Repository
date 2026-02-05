import { MessageSquare } from 'lucide-react';

type FeedbackItemData = {
  id: string | number;
  date: string;
  meal: string;
  menu: string;
  comment: string;
};

type FeedbackItemProps = {
  item: FeedbackItemData;
};

export function FeedbackItem({ item }: FeedbackItemProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <MessageSquare className="text-[#5dccb4] mt-1" size={18} />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-1">
            <span>{item.date}</span>
            <span>·</span>
            <span>{item.meal}</span>
            {/* <span>·</span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              {item.menu}
            </span> */}
          </div>
          <p className="text-gray-800">{item.comment}</p>
        </div>
      </div>
    </div>
  );
}
