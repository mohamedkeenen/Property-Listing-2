"use client";

import { LayoutDashboard, Plus, Users, Settings, LogOut, User, ChevronUp, FileText } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentUser } from "@/api/redux/slices/authSlice";
import { selectCompanyName, selectCompanyLogo, selectSettingsLastUpdated } from "@/api/redux/slices/settingsSlice";
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
import Link from "next/link";
import { useState } from "react";
import { API_BASE_URL } from "@/api/redux/apiConfig";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Create Listing", url: "/create-listing", icon: Plus },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Users", url: "/users", icon: Users },
  { title: "Sales Offer", url: "/sales-offer", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();

  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const companyName = useSelector(selectCompanyName);
  const companyLogo = useSelector(selectCompanyLogo);
  const settingsLastUpdated = useSelector(selectSettingsLastUpdated);
  const [imgError, setImgError] = useState(false);
  const [logoutMutation] = useLogoutMutation();

  const filteredNavItems = navItems.filter(item => {
    if (item.title === "Users" && user?.role !== 'admin') return false;
    return true;
  });

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

  const baseUrl = 'https://property-listing.keenenter.com';

  const getPhotoUrl = (photo: string) => {
    if (!photo) return undefined;
    if (photo.startsWith('http') || photo.startsWith('data:image')) return photo;
    if (photo.startsWith('/api/')) return `${baseUrl}${photo}`;
    return `${API_BASE_URL}/storage/${photo}`;
  };

  const getLogoUrl = (logo: string) => {
    if (!logo) return undefined;
    if (logo.startsWith('http') || logo.startsWith('data:image')) return logo;
    if (logo.startsWith('/api/')) return `${baseUrl}${logo}?v=${settingsLastUpdated}`;
    return `${API_BASE_URL}/storage/${logo}?v=${settingsLastUpdated}`;
  };

  const logoUrl = getLogoUrl(companyLogo);
  const nameParts = (companyName || 'Organization').split(' ');
  const firstPart = nameParts[0];
  const secondPart = nameParts.slice(1).join(' ');

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
                <div className="relative w-full h-24 group/brand flex items-center justify-center rounded-2xl transition-all duration-300 dark:bg-white/5 dark:backdrop-blur-md dark:border dark:border-white/10 p-3 shadow-inner">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={companyName}
                      className="object-contain transition-transform duration-700 group-hover/brand:scale-105 w-full h-full max-h-[70px] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                       <span className="text-xl font-black text-primary/40 uppercase tracking-[0.3em]">{firstPart.substring(0, 2)}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col transition-all duration-500 delay-100 animate-in fade-in slide-in-from-bottom-2">
                  <span className="text-xl font-black text-sidebar-foreground uppercase tracking-[0.2em] leading-none mb-1">
                    {firstPart}
                  </span>
                  {secondPart && (
                    <span className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-[0.35em] leading-none">
                      {secondPart}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl ring-4 ring-primary/10 shadow-xl bg-primary/5 transition-all hover:ring-primary/30 group-hover:scale-110 duration-300">
                <span className="text-sm font-black text-primary uppercase tracking-widest leading-none">
                  {firstPart.substring(0, 2)}
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
              {filteredNavItems.map((item) => (
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
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary group-data-[state=open]:ring-2 group-data-[state=open]:ring-primary/20 transition-all overflow-hidden relative border border-border/40 shrink-0 aspect-square">
                      {user?.photo ? (
                        <img 
                          src={getPhotoUrl(user.photo)} 
                          alt={user?.name}
                          className="w-full h-full object-cover rounded-full aspect-square"
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
                    <div className="p-1.5 rounded-lg bg-primary/10 group-focus:bg-primary/20 transition-colors">
                      <Settings className="h-4 w-4 text-primary" />
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

