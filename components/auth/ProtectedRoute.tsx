"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectIsHydrated } from "@/api/redux/slices/authSlice";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isHydrated = useSelector(selectIsHydrated);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isHydrated, isAuthenticated, router]);

  if (!mounted || !isHydrated) {
    return null; // or a full-page loading spinner
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
