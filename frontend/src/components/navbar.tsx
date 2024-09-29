"use client";
import { Bell, CircleUser, Mail, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const pathname = usePathname();
  return (
    <>
      <nav className="h-[80px] shadow-sm w-full flex items-center justify-between px-8 pr-12">
        <div className="flex gap-4 items-center">
          <button onClick={toggleSidebar} className="flex md:hidden gap-4">
            <Menu />
          </button>
          <h1 className="capitalize text-2xl font-semibold">
            {pathname.slice(1)}
          </h1>
        </div>
        <div className="flex gap-4">
          <Mail />
          <Bell />
          <CircleUser />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
