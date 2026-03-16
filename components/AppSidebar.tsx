"use client";

import { LayoutDashboard, Plus, Users, Settings, LogOut, User, ChevronUp } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentUser } from "@/api/redux/slices/authSlice";
import { useLogoutMutation } from "@/api/redux/services/authApi";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Create Listing", url: "/create-listing", icon: Plus },
  { title: "Leads", url: "/leads", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();

  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const [imgError, setImgError] = useState(false);
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(logout());
      router.push("/login");
    }
  };

  const getPhotoUrl = (photo: string) => {
    if (!photo) return "";
    if (photo.startsWith('http') || photo.startsWith('data:image')) return photo;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    return `${apiUrl}/${photo}`;
  };

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
                <div className="relative w-full h-24 group/brand">
                  <Image
                    src="https://res.cloudinary.com/devht0mp5/image/upload/v1771906074/logoo_hsovz7.jpg"
                    alt="Keen Enterprises"
                    fill
                    className="object-contain transition-transform duration-700 group-hover/brand:scale-110"
                    priority
                  />
                </div>
                <div className="flex flex-col transition-all duration-500 delay-100 animate-in fade-in slide-in-from-bottom-2">
                  <span className="text-md font-black text-sidebar-foreground uppercase tracking-[0.25em] leading-none mb-1">
                    Keen
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-[0.35em] leading-none">
                    Enterprises
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-12 w-full rounded-2xl ring-2 ring-primary/10 shadow-lg bg-primary/5 transition-all hover:ring-primary/30">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">
                  KEEN
                </span>
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-black px-4">
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
                      className="flex items-center gap-3 rounded-xl px-4"
                      activeClassName="bg-primary/10 text-primary font-black shadow-sm"
                    >
                      <item.icon className={cn("h-4 w-4 transition-transform duration-300", pathname === item.url && "scale-110")} />
                      {!collapsed && <span className="tracking-tight">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/20 p-3 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full h-12 justify-between rounded-xl px-3 hover:bg-sidebar-accent/50 transition-all group-hover:scale-[1.02] active:scale-[0.98]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-data-[state=open]:ring-2 group-data-[state=open]:ring-primary/20 transition-all overflow-hidden relative">
                      {user?.photo ? (
                        <img 
                          src={getPhotoUrl(user.photo)} 
                          alt={user?.name}
                          className="object-cover"
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    {!collapsed && <span className="font-black text-sm tracking-tight capitalize">{user?.name || "Account"}</span>}
                  </div>
                  {!collapsed && <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="center"
                className="w-[220px] mb-3 p-2 rounded-2xl border-border/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-2xl bg-background/95 animate-in slide-in-from-bottom-2 duration-300"
              >
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary cursor-pointer rounded-xl px-4 py-3 transition-all mb-1 group" asChild>
                  <Link href="/settings" className="flex items-center gap-4 font-black text-sm text-foreground">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 group-focus:bg-emerald-500/20 transition-colors">
                      <Settings className="h-4 w-4 text-emerald-500" />
                    </div>
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="focus:bg-destructive/10 focus:text-destructive text-destructive cursor-pointer rounded-xl px-4 py-3 transition-all font-black text-sm group"
                  onClick={handleLogout}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-1.5 rounded-lg bg-destructive/10 group-focus:bg-destructive/20 transition-colors">
                      <LogOut className="h-4 w-4" />
                    </div>
                    Logout
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

