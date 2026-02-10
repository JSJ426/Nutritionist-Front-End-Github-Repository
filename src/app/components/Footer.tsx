import { useState } from "react";

import OpenSourceModal from "./OpenSourceModal";
import PrivacyModal from "./PrivacyModal";
import TermsModal from "./TermsModal";

export function Footer() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isOpenSourceOpen, setIsOpenSourceOpen] = useState(false);

  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Contact 정보 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Contact : busan_help@globalfoodai.co.kr
          </p>
        </div>

        {/* 링크 영역 */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 items-center text-sm">
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(true)}
              className="text-gray-700 hover:text-gray-900 hover:underline transition-colors"
            >
              Global Food AI 개인정보 처리방침
            </button>
            <span className="text-gray-400">|</span>
            <button
              type="button"
              onClick={() => setIsTermsOpen(true)}
              className="text-gray-700 hover:text-gray-900 hover:underline transition-colors"
            >
              이용약관
            </button>
            <span className="text-gray-400">|</span>
            <button
              type="button"
              onClick={() => setIsOpenSourceOpen(true)}
              className="text-gray-700 hover:text-gray-900 hover:underline transition-colors"
            >
              오픈소스라이선스
            </button>
          </div>
        </div>

        {/* 회사 정보 */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>(주)글로벌푸드AI 부산지사 | 부산광역시 해운대구 센텀중앙로 79, 15층 (우동) | 지점장 : 박지훈</p>
          <p>사업자등록번호 : 617-85-39201 | 통신판매업신고 : 2026-부산해운대-0882</p>
          <p>Copyright© 2026 Global Food AI Busan. All rights reserved.</p>
        </div>
      </div>

      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <OpenSourceModal isOpen={isOpenSourceOpen} onClose={() => setIsOpenSourceOpen(false)} />
    </footer>
  );
}
