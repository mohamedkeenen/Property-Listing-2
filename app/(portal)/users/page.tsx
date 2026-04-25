"use client";

import { 
  useGetAgentsQuery, 
  useCreateAgentMutation, 
  useUpdateAgentMutation, 
  useDeleteAgentMutation 
} from "@/api/redux/services/userApi";
import { UserTable } from "@/components/users/UserTable";
import { UserDialog } from "@/components/users/UserDialog";
import { useMemo, useState } from "react";
import { 
  Users as UsersIcon, 
  Search, 
  LayoutGrid, 
  ChevronRight, 
  Plus, 
  Info,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/api/redux/slices/authSlice";

import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";

export default function UsersPage() {
  const { data, isLoading, isError, refetch, isFetching } = useGetAgentsQuery();
  const [createAgent, { isLoading: isCreating }] = useCreateAgentMutation();
  const [updateAgent, { isLoading: isUpdating }] = useUpdateAgentMutation();
  const [deleteAgent] = useDeleteAgentMutation();
  const currentUser = useSelector(selectCurrentUser);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const users = useMemo(() => {
    const apiUsers = data?.data || [];
    if (!currentUser) return apiUsers;
    
    const exists = apiUsers.find((u: any) => u.email === currentUser.email);
    if (!exists) {
        return [currentUser, ...apiUsers];
    }
    return apiUsers;
  }, [data, currentUser]);

  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleCreate = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteAgent(userToDelete.id).unwrap();
      toast.success("User removed successfully", {
          style: {
              borderRadius: '1rem',
              background: '#0f172a',
              color: '#fff',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.1em'
          }
      });
      setDeleteDialogOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (selectedUser) {
        const res = await updateAgent({ id: selectedUser.id, data: formData }).unwrap();
        toast.success(res.message || "Profile Updated", {
            style: {
                borderRadius: '1rem',
                background: '#0f172a',
                color: '#fff',
                fontWeight: 'bold'
            }
        });
      } else {
        const res = await createAgent(formData).unwrap();
        toast.success(res.message || "New Member Added", {
            style: {
                borderRadius: '1rem',
                background: '#0f172a',
                color: '#fff',
                fontWeight: 'bold'
            }
        });
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Operation failed. Please try again.");
    }
  };

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="p-6 rounded-4xl bg-destructive/10 text-destructive shadow-2xl shadow-destructive/20 border border-destructive/20 ring-4 ring-destructive/5 ring-offset-4 ring-offset-background">
          <ShieldAlert className="h-16 w-16" />
        </div>
        <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-foreground underline decoration-destructive/30 decoration-4 underline-offset-8">Restricted Access</h2>
            <p className="text-muted-foreground font-black text-xs uppercase tracking-widest pt-4">You do not have administrative privileges to manage organization members.</p>
        </div>
        <Button onClick={() => window.history.back()} variant="outline" className="rounded-2xl h-14 px-10 font-black tracking-widest uppercase border-2 border-border/80 hover:bg-muted transition-all active:scale-95">Go back securely</Button>
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
              <h1 className="text-5xl font-black tracking-tight text-foreground relative underline decoration-primary decoration-4 underline-offset-12">
                Users
                <div className="absolute -top-1 -right-4 h-3 w-3 rounded-full bg-primary animate-ping opacity-75" />
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.3em] pt-4 pl-1">Organization Governance & Access Control</p>
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
            <Button 
                onClick={handleCreate}
                className="h-14 rounded-2xl md:rounded-[1.25rem] px-10 bg-linear-to-br from-primary via-primary to-indigo-600 text-white font-black shadow-2xl shadow-primary/30 border-none transition-all duration-300 hover:shadow-primary/40 active:scale-95 relative overflow-hidden group/btn gap-3"
            >
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 skew-x-[-20deg]" />
                <span className="relative z-10 flex items-center gap-3">
                    Register Member
                    <Plus className="h-5 w-5" />
                </span>
            </Button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
          {[
              { label: "Total Members", value: users.length, icon: UsersIcon, color: "text-primary", bg: "bg-primary/10" },
              { label: "Administrative", value: users.filter((u: any) => u.role === 'admin').length, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Active Agents", value: users.filter((u: any) => u.role === 'agent').length, icon: LayoutGrid, color: "text-purple-500", bg: "bg-purple-500/10" },
              { label: "Verified Access", value: users.length, icon: ChevronRight, color: "text-orange-500", bg: "bg-orange-500/10" },
          ].map((stat, i) => (
              <div 
                key={i} 
                className="group relative bg-card/60 backdrop-blur-2xl rounded-xl border border-border/40 p-6 flex items-center gap-6 transition-all cursor-default ornament-grid"
              >
                  <div className={cn("h-16 w-16 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-500", stat.bg)}>
                      <stat.icon className={cn("h-8 w-8", stat.color)} />
                  </div>
                  <div className="space-y-1">
                      <div className="text-3xl font-black tabular-nums tracking-tighter">{stat.value}</div>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{stat.label}</div>
                  </div>
                  <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-muted-foreground/10 group-hover:bg-primary/20 transition-colors" />
              </div>
          ))}
      </div>

      {/* Search and Table Section */}
      <div className="flex-1 flex flex-col min-h-0 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-muted/50 border border-border/20">
                    <Info className="h-4 w-4 text-muted-foreground/60" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/70">Registry Records</h3>
                <div className="h-px w-24 bg-border/40 hidden md:block" />
            </div>
            
            <div className="relative group max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                    placeholder="Fast search by name or identification..."
                    className="pl-12 h-14 rounded-xl bg-card/50 border-border/30 backdrop-blur-xl focus:bg-background focus:ring-primary/20 transition-all font-bold text-sm tracking-tight shadow-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        <div className="flex-1 min-h-[400px] overflow-auto no-scrollbar pb-10">
          {isLoading ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-6 py-24 animate-pulse">
              <div className="relative h-20 w-20">
                  <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.4em] animate-bounce">Synchronizing Registry...</p>
                <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest text-center mt-2">Connecting to Secure Vault</p>
              </div>
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onView={(u) => handleEdit(u)} // For now view same as edit
            />
          )}
        </div>
      </div>

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        itemName={userToDelete ? `${userToDelete.name} (${userToDelete.email})` : ""}
        title="Remove Organization Member?"
        confirmText="Remove Member"
      />
    </div>
  );
}
