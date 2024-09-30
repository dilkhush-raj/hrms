import { useAuth } from "../context/AuthContext";
import "../styles/sidebar.css";
import {
  ChartNoAxesColumnIncreasing,
  ChartPie,
  LogOut,
  Sparkles,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  toggleSidebar: () => void;
  isOpen: boolean;
}

export default function Sidebar({ toggleSidebar, isOpen }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const { logout } = useAuth();
  const links = [
    {
      label: "Recruitment",
      links: [
        {
          label: "Dashboard",
          link: "/dashboard",
          icon: <ChartPie />,
        },
        {
          label: "Candidates",
          link: "/candidates",
          icon: <UserPlus />,
        },
      ],
    },
    {
      label: "Organization",
      links: [
        {
          label: "Employees",
          link: "/employees",
          icon: <Users />,
        },
        {
          label: "Attendance",
          link: "/attendance",
          icon: <ChartNoAxesColumnIncreasing />,
        },
        {
          label: "Leaves",
          link: "/leaves",
          icon: <Sparkles />,
        },
      ],
    },
  ];

  return (
    <div className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <div className="sidebar-header">
        <a href="/" className="sidebar-logo">
          <img src="/logo.png" alt="Logo" className="sidebar-logo-image" />
          <div className="sidebar-logo-text">HRMS</div>
        </a>
        <div onClick={toggleSidebar} className="sidebar-close-button">
          <X />
        </div>
      </div>
      <div className="sidebar-content">
        {links.map((category, index) => (
          <div key={index} className="sidebar-category">
            <h3 className="sidebar-category-label">{category.label}</h3>
            <div className="sidebar-links">
              {category.links.map((link, index) => (
                <div key={index} className="sidebar-link">
                  {pathname == link.link ? (
                    <div className="sidebar-link-active"></div>
                  ) : null}

                  <Link
                    to={link.link}
                    onClick={toggleSidebar}
                    className="sidebar-link-content"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="sidebar-category">
          <h3 className="sidebar-category-label">Others</h3>
          <div className="sidebar-links">
            <div className="sidebar-link">
              <div
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (window.confirm("Do you want to log out?")) {
                    logout();
                  }
                }}
                className="sidebar-link-content "
              >
                <LogOut />
                Log Out
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
