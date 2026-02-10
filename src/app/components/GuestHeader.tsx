import appLogo from "@/assets/AppLogo.png";

type GuestHeaderProps = {
  onLogoClick?: () => void;
};

export function GuestHeader({ onLogoClick }: GuestHeaderProps) {
  return (
    <div className="h-[72px] bg-[#4a4a4a] text-white flex items-center justify-between px-3 border-b border-[#3d3d3d]">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onLogoClick}
          className="hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="홈으로 이동"
        >
          <img src={appLogo} alt="AppLogo" className="h-13" />
        </button>
        <div className="text-xl font">학교 급식 관리 시스템</div>
      </div>
    </div>
  );
}
