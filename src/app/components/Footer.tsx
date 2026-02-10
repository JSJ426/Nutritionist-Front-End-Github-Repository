export function Footer() {
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
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 hover:underline transition-colors"
            >
              Global Food AI 개인정보 처리방침
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 hover:underline transition-colors"
            >
              이용약관
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 hover:underline transition-colors"
            >
              오픈소스라이선스
            </a>
          </div>
        </div>

        {/* 회사 정보 */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>(주)글로벌푸드AI 부산지사 | 부산광역시 해운대구 센텀중앙로 79, 15층 (우동) | 지점장 : 박지훈</p>
          <p>사업자등록번호 : 617-85-39201 | 통신판매업신고 : 2026-부산해운대-0882</p>
          <p>Copyright© 2026 Global Food AI Busan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
