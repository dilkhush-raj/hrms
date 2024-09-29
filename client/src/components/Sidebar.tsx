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

interface SidebarProps {
  toggleSidebar: () => void;
  isOpen: boolean;
}

export default function Sidebar({ toggleSidebar, isOpen }: SidebarProps) {
  const pathname = "";
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
        <button onClick={toggleSidebar} className="sidebar-close-button">
          <X />
        </button>
      </div>
      <div className="sidebar-content">
        {links.map((category, index) => (
          <div key={index} className="sidebar-category">
            <h3 className="sidebar-category-label">{category.label}</h3>
            <div className="sidebar-links">
              {category.links.map((link, index) => (
                <div key={index} className="sidebar-link">
                  {pathname.startsWith(link.link) && (
                    <div className="sidebar-link-active"></div>
                  )}
                  <a href={link.link} className="sidebar-link-content">
                    {link.icon}
                    {link.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="sidebar-category">
          <h3 className="sidebar-category-label">Others</h3>
          <div className="sidebar-links">
            <div className="sidebar-link">
              <div onClick={logout} className="sidebar-link-content cursor">
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
