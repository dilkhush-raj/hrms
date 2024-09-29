"use client";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState<boolean>(false);

  if (!isAuthenticated) {
    return (
      <div className="flex gap-2 justify-center items-center h-screen">
        Please <Link href={"/login"}>Login</Link>
      </div>
    );
  }
  if (user?.role !== "hr" && user?.role !== "admin") {
    return (
      <div className="flex gap-2 justify-center items-center h-screen">
        You are not authorized to access this page
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <>
      <div>
        <Sidebar toggleSidebar={() => setOpen(!open)} isOpen={open} />
        <div className="md:ml-[280px]">
          <Navbar toggleSidebar={() => setOpen(!open)} />
          {children}
        </div>
      </div>
    </>
  );
}
