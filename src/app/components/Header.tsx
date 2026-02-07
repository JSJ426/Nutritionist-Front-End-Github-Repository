import { User, Bell, Settings, LogOut } from "lucide-react";
import appLogo from "@/assets/AppLogo.png";

type HeaderProps = {
  onLogout?: () => void;
  schoolName?: string | null;
  onLogoClick?: () => void;
};

export function Header({ onLogout, schoolName, onLogoClick }: HeaderProps) {
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
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#3d3d3d] rounded text-sm">
          <User size={16} />
          <span>{schoolName || '학교 정보 없음'}</span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="p-2 hover:bg-[#3d3d3d] rounded cursor-pointer"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}
