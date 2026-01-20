export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Contact 정보 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Contact : ktaivle@kt.com
          </p>
        </div>

        {/* 링크 영역 */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 items-center text-sm">
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 hover:underline transition-colors"
            >
              KT AIVLE EDU 개인정보 처리방침
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
          <p>(주)케이티 경기도 성남시 분당구 불정로 90 (정자동) | 대표자명 : 김영섭</p>
          <p>사업자등록번호 : 102-81-42945 | 통신판매업신고 : 2002-경기성남-0048</p>
          <p>Copyright© 2022 KT Corp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
