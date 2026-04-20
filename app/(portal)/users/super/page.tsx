"use client";

import { 
  useGetSuperUsersQuery,
  useToggleUserActiveMutation,
  useDeleteUserMutation
} from "@/api/redux/services/userApi";
import { useMemo, useState } from "react";
import { 
  Users as UsersIcon, 
  Search, 
  RefreshCw,
  Power,
  PowerOff,
  Trash2,
  Mail,
  Building2,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  ExternalLink,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/api/redux/slices/authSlice";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { format } from "date-fns";

export default function SuperAdminPage() {
  const { data, isLoading, isError, refetch, isFetching } = useGetSuperUsersQuery();
  const [toggleActive, { isLoading: isToggling }] = useToggleUserActiveMutation();
  const [deleteUser] = useDeleteUserMutation();
  const currentUser = useSelector(selectCurrentUser);

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = currentUser?.email === 'listing@keenenter.com';

  const users = useMemo(() => {
    return (data?.data || []).filter((u: any) => u.email !== 'listing@keenenter.com');
  }, [data]);

  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.company?.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleToggleActive = async (user: any) => {
    try {
      const res = await toggleActive(user.id).unwrap();
      toast.success(res.message, {
        style: {
          borderRadius: '1rem',
          background: '#0f172a',
          color: '#fff',
          fontWeight: 'bold'
        }
      });
    } catch (err: any) {
      toast.error(err.data?.message || "Operation failed");
    }
  };

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.id).unwrap();
      toast.success("User and company data removed successfully");
      setDeleteDialogOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const getLogoUrl = (logo: string) => {
    if (!logo) return null;
    if (logo.startsWith('http') || logo.startsWith('data:image')) return logo;
    return `https://property-listing.keenenter.com/api/storage/${logo}`;
  };

  if (!isAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <ShieldAlert className="h-20 w-20 text-destructive animate-pulse" />
        <h2 className="text-3xl font-black">Unauthorized Access</h2>
        <p className="text-muted-foreground">Only the system administrator can access this dashboard.</p>
        <Button onClick={() => window.location.href = '/'}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background/50 backdrop-blur-3xl overflow-y-auto overflow-x-hidden p-4 md:p-10 space-y-10 custom-scrollbar">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 shrink-0">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-primary/10 text-primary shadow-xl shadow-primary/10 border border-primary/20 ring-1 ring-primary/5">
              <UsersIcon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tight text-foreground relative underline decoration-primary decoration-4 underline-offset-12 uppercase">
                System Registry
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.3em] pt-4 pl-1 italic">Master Control Dashboard: listing@keenenter.com</p>
        </div>

        <div className="flex items-center gap-4">
            <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                className={cn("h-14 w-14 rounded-2xl border-2 border-border/80 hover:bg-muted hover:border-primary transition-all active:scale-95", (isFetching || isLoading) && "animate-spin-slow")}
            >
                <RefreshCw className={cn("h-5 w-5", (isFetching || isLoading) && "animate-spin")} />
            </Button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 shrink-0">
          {[
              { label: "Total Registrations", value: users.length, icon: UsersIcon, color: "text-primary", bg: "bg-primary/10" },
              { label: "Active Accounts", value: users.filter((u: any) => u.is_active).length, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Non-Active Accounts", value: users.filter((u: any) => !u.is_active).length, icon: ShieldAlert, color: "text-orange-500", bg: "bg-orange-500/10" },
          ].map((stat, i) => (
              <div 
                key={i} 
                className="group relative bg-card/60 backdrop-blur-2xl rounded-xl border border-border/40 p-6 flex items-center gap-6 transition-all ornament-grid"
              >
                  <div className={cn("h-16 w-16 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-500", stat.bg)}>
                      <stat.icon className={cn("h-8 w-8", stat.color)} />
                  </div>
                  <div className="space-y-1">
                      <div className="text-3xl font-black tabular-nums tracking-tighter">{stat.value}</div>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{stat.label}</div>
                  </div>
              </div>
          ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 space-y-6">
        <div className="relative group max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
                placeholder="Search by name, email or company..."
                className="pl-12 h-14 rounded-xl bg-card/50 border-border/30 backdrop-blur-xl focus:bg-background transition-all font-bold text-sm tracking-tight shadow-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        <div className="flex-1 overflow-auto no-scrollbar pb-10">
          {isLoading ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-6 py-24">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Hydrating Registry...</p>
            </div>
          ) : (
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-6 py-24">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Hydrating Registry...</p>
            </div>
          ) : (
            <div className="bg-card/30 backdrop-blur-3xl rounded-3xl border border-border/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/20">
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Company</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hidden lg:table-cell">Admin User</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Email & Status</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hidden xl:table-cell">Joined At</th>
                      <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hidden sm:table-cell">Users</th>
                      <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hidden sm:table-cell">Listings</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Verification</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Activation</th>
                      <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {filteredUsers.map((user: any) => (
                      <tr 
                        key={user.id} 
                        className={cn(
                          "group transition-all hover:bg-primary/5",
                          !user.is_active && "bg-orange-500/2"
                        )}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-muted/50 border border-border/20 flex items-center justify-center shrink-0 overflow-hidden">
                               {user.company?.logo ? (
                                 <img src={getLogoUrl(user.company.logo) || ''} alt={user.company.company_name} className="h-full w-full object-contain p-1" />
                               ) : (
                                 <Building2 className="h-6 w-6 text-muted-foreground" />
                               )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-black text-sm tracking-tight truncate max-w-[150px]">
                                {user.company?.company_name || 'N/A'}
                              </span>
                              <span className="lg:hidden text-[10px] font-bold text-muted-foreground uppercase">{user.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                             <UsersIcon className="h-3.5 w-3.5 text-muted-foreground" />
                             <span className="text-sm font-bold truncate max-w-[150px]">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                               <Mail className="h-3.5 w-3.5" />
                               <span className="truncate max-w-[200px]">{user.email}</span>
                            </div>
                            <div className="xl:hidden flex flex-col gap-0.5 mt-1">
                               <div className="flex items-center gap-1 text-[9px] font-black text-muted-foreground/50 uppercase">
                                  <Calendar className="h-3 w-3" />
                                  <span>{user.created_at ? format(new Date(user.created_at), "MMM dd, HH:mm") : "N/A"}</span>
                               </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-xs font-black text-muted-foreground/70 uppercase tracking-tighter">
                               <Calendar className="h-3.5 w-3.5 text-primary/50" />
                               <span>{user.created_at ? format(new Date(user.created_at), "MMM dd, yyyy") : "N/A"}</span>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase pl-5.5">
                              {user.created_at ? format(new Date(user.created_at), "HH:mm") : ""}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center hidden sm:table-cell">
                           <span className="inline-flex items-center justify-center h-7 w-12 rounded-lg bg-primary/5 text-primary text-xs font-black border border-primary/10">
                             {user.company?.users_count || 0}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-center hidden sm:table-cell">
                           <span className="inline-flex items-center justify-center h-7 w-12 rounded-lg bg-emerald-500/5 text-emerald-500 text-xs font-black border border-emerald-500/10">
                             {user.company?.properties_count || 0}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest",
                            user.email_verified_at ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" : "bg-red-500/5 border-red-500/20 text-red-500"
                          )}>
                            {user.email_verified_at ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                            <span className="hidden md:inline">{user.email_verified_at ? 'Verified' : 'Unverified'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Button 
                            onClick={() => handleToggleActive(user)}
                            disabled={isToggling}
                            className={cn(
                              "h-9 px-3 md:h-10 md:px-4 rounded-xl font-black uppercase tracking-widest text-[9px] gap-2 transition-all",
                              user.is_active 
                                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/10" 
                                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                            )}
                          >
                            {user.is_active ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                            <span className="hidden md:inline">{user.is_active ? 'Deactivate' : 'Activate'}</span>
                          </Button>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Button 
                              onClick={() => handleDeleteClick(user)}
                              variant="outline" 
                              className="h-9 w-9 md:h-10 md:w-10 rounded-xl border-2 border-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all active:scale-90"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length === 0 && (
                <div className="p-20 text-center space-y-4">
                   <div className="p-6 rounded-3xl bg-muted/20 w-fit mx-auto border border-border/40">
                      <Search className="h-10 w-10 text-muted-foreground/30" />
                   </div>
                   <p className="font-black text-sm text-muted-foreground/60 uppercase tracking-widest">No matching records found in registry</p>
                </div>
              )}
            </div>
          )}
        </div>
          )}
        </div>
      </div>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        itemName={userToDelete ? `${userToDelete.company?.company_name} (${userToDelete.email})` : ""}
        title="Full System Wipe?"
        confirmText="Wipe System"
      />
    </div>
  );
}
