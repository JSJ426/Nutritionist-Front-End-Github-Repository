import { User, Bell, Settings, LogOut } from "lucide-react";
import logoImage from "figma:asset/a65a012f8dfb6e34563e688039daec79bf5a2d4c.png";

export function Header() {
  return (
    <div className="h-[72px] bg-[#4a4a4a] text-white flex items-center justify-between px-3 border-b border-[#3d3d3d]">
      <div className="flex items-center gap-4">
        <img src={logoImage} alt="AIVLE Logo" className="h-13" />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#3d3d3d] rounded text-sm">
          <User size={16} />
          <span>홍길동 영양사</span>
        </div>
        <button className="p-2 hover:bg-[#3d3d3d] rounded">
          <Bell size={18} />
        </button>
        <button className="p-2 hover:bg-[#3d3d3d] rounded">
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}