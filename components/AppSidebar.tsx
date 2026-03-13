"use client";

import { LayoutDashboard, Plus, Users } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Create Listing", url: "/create-listing", icon: Plus },
  { title: "Leads", url: "/leads", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/40 bg-sidebar px-0 pb-0">
        <div className={cn(
          "flex flex-col gap-6",
          collapsed ? "p-3 pb-6 border-b border-sidebar-border/10" : "p-6"
        )}>
          <div className={cn(
            "flex transition-all duration-500",
            collapsed ? "justify-center items-center h-12" : "flex-col items-center justify-center text-center gap-3 w-full"
          )}>
            {!collapsed ? (
              <>
                <div className="relative w-full h-20 group/brand">
                  <Image
                    src="/logo.jpg"
                    alt="Keen Enterprises"
                    fill
                    className="object-contain transition-transform duration-700 group-hover/brand:scale-105"
                  />
                </div>
                <div className="flex flex-col transition-all duration-500 delay-100 animate-in fade-in slide-in-from-bottom-2">
                  <span className="text-sm font-black text-sidebar-foreground uppercase tracking-[0.2em] leading-none mb-1">
                    Keen
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.3em] leading-none">
                    Enterprises
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-10 w-full rounded-xl ring-1 ring-primary/20 shadow-md bg-transparent">
                <span className="text-xs font-black text-sidebar-foreground uppercase tracking-widest leading-none">
                  KEEN
                </span>
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <NavLink
                      href={item.url}
                      exact={item.url === "/"}
                      className="flex items-center gap-2.5 rounded-lg"
                      activeClassName="bg-primary/10 text-primary font-semibold"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

