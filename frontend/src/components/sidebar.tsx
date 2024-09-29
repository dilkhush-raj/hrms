/* eslint-disable @next/next/no-img-element */
"use client";
import { useAuth } from "@/app/context/AuthContext";
import {
  ChartNoAxesColumnIncreasing,
  ChartPie,
  LogOut,
  Sparkles,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  toggleSidebar: () => void;
  isOpen: boolean;
}

export default function Sidebar({ toggleSidebar, isOpen }: SidebarProps) {
  const pathname = usePathname();
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

  console.log(isOpen);

  return (
    <>
      <div
        className={`bg-gray-50  z-50 shadow-md fixed top-0 bottom-0 transition-all duration-500 md:left-0 w-[280px] ${
          isOpen ? "left-0" : "-left-[100%]"
        }`}
      >
        <div className="flex items-center justify-between pl-4 pr-6">
          <Link href="/" className="flex gap-4 items-center">
            <img src="/logo.png" alt="Logo" className="h-12  my-4" />
            <div className="text-2xl font-bold">HRMS</div>
          </Link>
          <button onClick={toggleSidebar} className="md:hidden">
            <X />
          </button>
        </div>
        <div className="flex flex-col gap-4 mt-10 ">
          {links.map((category, index) => (
            <div key={index} className="flex flex-col gap-4">
              <h3 className="text-gray-600 px-10">{category.label}</h3>
              <div className="flex flex-col gap-6 mb-4">
                {category.links.map((link, index) => (
                  <div key={index} className="relative py-3 flex items-center">
                    {pathname.startsWith(link.link) ? (
                      <div className="bg-[#552DAB] rounded-r-md h-full w-2 absolute left-0"></div>
                    ) : null}
                    <Link href={link.link} className="flex gap-4 px-10">
                      {link.icon}
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-4">
            <h3 className="text-gray-600  px-10">Others</h3>
            <div className="flex flex-col gap-6 px-10 mb-4">
              <div>
                <button onClick={logout} className="flex gap-4">
                  <LogOut />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
