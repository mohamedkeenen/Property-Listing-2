"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-h-0 h-full overflow-y-auto overflow-x-hidden">
          <header className="h-14 flex items-center justify-between border-b border-border/40 px-4 bg-background sticky top-0 z-20 shrink-0">
            <SidebarTrigger />
            <ThemeToggle />
          </header>
          <main className="flex-1 flex flex-col min-h-0 min-w-0">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
