"use client";

import { LayoutDashboard, Plus, Users, Building } from "lucide-react";
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
            "flex items-center gap-4 transition-all duration-500",
            collapsed ? "justify-center" : ""
          )}>
            <div className="relative group/brand shrink-0">
              <div className={cn(
                "relative overflow-hidden ring-1 ring-primary/20 shadow-2xl transition-all duration-700 group-hover/brand:scale-110",
                collapsed ? "h-11 w-11 rounded-xl" : "h-14 w-14 rounded-2xl"
              )}>
                <img
                  src="/logo.jpg"
                  alt="Keen Enterprises"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover/brand:scale-125"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover/brand:opacity-100 transition-opacity" />
              </div>
              
              <div className="absolute -inset-2 bg-primary/5 blur-xl rounded-full opacity-0 group-hover/brand:opacity-100 transition-opacity animate-pulse" />
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-sidebar shadow-lg ring-2 ring-emerald-500/10" />
            </div>

            {!collapsed && (
              <div className="flex flex-col transition-all duration-500 delay-100 animate-in fade-in slide-in-from-left-2">
                <span className="text-sm font-black text-sidebar-foreground uppercase tracking-[0.2em] leading-none mb-1">
                  Keen
                </span>
                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.3em] leading-none">
                  Enterprises
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

