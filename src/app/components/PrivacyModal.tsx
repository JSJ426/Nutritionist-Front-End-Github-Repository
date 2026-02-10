import { X } from "lucide-react";

import PrivacyContent from "./PrivacyContent";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree?: () => void;
}

export default function PrivacyModal({ isOpen, onClose, onAgree }: PrivacyModalProps) {
  if (!isOpen) return null;

  const handleAgree = () => {
    if (onAgree) {
      onAgree();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">개인정보 처리방침</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <PrivacyContent />
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
          {onAgree && (
            <button
              onClick={handleAgree}
              className="flex-1 px-4 py-3 bg-[#00B3A4] text-white rounded-xl font-medium hover:bg-[#009688] transition-colors"
            >
              동의함
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
