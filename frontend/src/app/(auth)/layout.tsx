"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);
  return <>{children}</>;
}
