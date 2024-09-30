import { Bell, CircleUser, Mail, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  const pathname = location.pathname.split("/")[1];
  return (
    <>
      <nav className="navbar">
        <div className="left-nav">
          <div onClick={toggleSidebar} className="menu-btn">
            <Menu />
          </div>
          <h1 className="nav-title">{pathname}</h1>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Mail />
          <Bell />
          <CircleUser />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
