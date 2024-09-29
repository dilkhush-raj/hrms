import { Bell, CircleUser, Mail, Menu } from "lucide-react";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <>
      <nav className="navbar">
        <div className="left-nav">
          <button onClick={toggleSidebar} className="flex md:hidden gap-4">
            <Menu />
          </button>
          <h1 className="capitalize text-2xl font-semibold"></h1>
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
