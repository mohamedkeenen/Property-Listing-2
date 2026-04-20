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
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/api/redux/slices/authSlice";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";

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
    <div className="flex-1 flex flex-col min-h-0 bg-background/50 backdrop-blur-3xl overflow-hidden p-6 md:p-10 space-y-10">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 shrink-0">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredUsers.map((user: any) => (
                <div key={user.id} className={cn(
                  "relative group bg-card/40 hover:bg-card/60 border rounded-2xl p-6 transition-all duration-300 ornament-grid",
                  !user.is_active ? "border-orange-500/20 shadow-lg shadow-orange-500/5" : "border-border/40"
                )}>
                  {!user.is_active && (
                    <div className="absolute top-0 right-0 px-4 py-1 bg-orange-500 text-[8px] font-black uppercase tracking-widest text-white rounded-bl-xl rounded-tr-2xl animate-pulse">
                      Pending Action
                    </div>
                  )}
                  
                  <div className="flex items-start gap-6">
                    <div className="h-20 w-20 rounded-2xl bg-muted p-4 border border-border/40 flex items-center justify-center shrink-0">
                      <Building2 className="h-10 w-10 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-4">
                      <div>
                        <h3 className="text-xl font-black truncate tracking-tight">{user.company?.company_name || 'N/A'}</h3>
                        <p className="text-xs font-bold text-muted-foreground mt-1 flex items-center gap-2">
                          <UsersIcon className="h-3 w-3" />
                          {user.name}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/40 border border-border/20">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-[10px] font-bold truncate max-w-[150px]">{user.email}</span>
                        </div>
                        <div className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-lg border",
                          user.email_verified_at ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" : "bg-red-500/5 border-red-500/20 text-red-500"
                        )}>
                          {user.email_verified_at ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {user.email_verified_at ? 'Verified' : 'Unverified'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <Button 
                          onClick={() => handleToggleActive(user)}
                          disabled={isToggling}
                          className={cn(
                            "flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2",
                            user.is_active ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20" : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                          )}
                        >
                          {user.is_active ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                          {user.is_active ? 'Deactivate' : 'Activate Account'}
                        </Button>
                        <Button 
                          onClick={() => handleDeleteClick(user)}
                          variant="outline" 
                          className="h-12 w-12 rounded-xl border-2 border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
      />
    </div>
  );
}
