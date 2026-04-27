import { useState } from "react";
import { 
  ChevronLeft,
  ChevronRight,
  Edit2, 
  Trash2, 
  Eye, 
  User as UserIcon,
  ShieldCheck,
  UserCheck,
  Mail as MailIcon, 
  Loader2
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { useResendVerificationMutation } from "@/api/redux/services/userApi";

import { SkeletonUser } from "@/components/skeleton/SkeletonUser";

interface UserTableProps {
  users: any[];
  isLoading?: boolean;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onView: (user: any) => void;
}

export function UserTable({ users, isLoading, onEdit, onDelete, onView }: UserTableProps) {
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const baseUrl = 'https://property-listing.keenenter.com';

  const totalPages = Math.ceil(users.length / rowsPerPage);
  const paginatedUsers = users.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleResend = async (id: number) => {
    try {
      await resendVerification(id).unwrap();
      toast.success("Verification email sent", {
        style: {
          borderRadius: '1rem',
          background: '#0f172a',
          color: '#fff',
          fontWeight: 'bold',
        }
      });
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to send email");
    }
  };

  const getPhotoUrl = (photo: string) => {
    if (!photo) return "";
    if (photo.startsWith('http') || photo.startsWith('data:image')) return photo;
    if (photo.startsWith('/api/')) return `${baseUrl}${photo}`;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    return `${apiUrl}/${photo}`;
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return <ShieldCheck className="h-3 w-3 mr-1" />;
      case 'supervisor': return <ShieldCheck className="h-3 w-3 mr-1" />;
      case 'agent': return <UserCheck className="h-3 w-3 mr-1" />;
      default: return <UserIcon className="h-3 w-3 mr-1" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return "bg-primary/20 text-primary border-primary/20 hover:bg-primary/30";
      case 'supervisor': return "bg-blue-500/20 text-blue-500 border-blue-500/20 hover:bg-blue-500/30";
      case 'agent': return "bg-purple-500/20 text-purple-500 border-purple-500/20 hover:bg-purple-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col">
      <div className="overflow-x-auto no-scrollbar flex-1">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="w-[80px] font-black uppercase tracking-widest text-[10px] py-6 px-6">Profile</TableHead>
              <TableHead className="w-[60px] font-black uppercase tracking-widest text-[10px] py-6 text-center hidden sm:table-cell">ID</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Name & Email</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 hidden lg:table-cell">Created At</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 hidden md:table-cell">Role</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonUser />
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3 opacity-50">
                    <UserIcon className="h-12 w-12 text-muted-foreground" />
                    <p className="text-sm font-black uppercase tracking-widest">No users found in this company</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user, index) => (
                <TableRow key={user.id} className="group border-border/40 hover:bg-primary/5 transition-colors">
                  <TableCell className="py-4 px-6">
                    <Avatar className="h-12 w-12 rounded-xl border-2 border-background ring-4 ring-primary/5 shadow-lg transition-transform duration-500">
                      <AvatarImage src={getPhotoUrl(user.photo || '')} alt={user.name} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary font-black">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-4 text-center hidden sm:table-cell">
                    <span className="font-mono text-xs font-black text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                      #{(currentPage - 1) * rowsPerPage + index + 1}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-foreground tracking-tight transition-colors">{user.name}</span>
                        {!user.email_verified_at && (
                          <Badge variant="outline" className="text-[8px] h-4 px-1.5 font-black uppercase tracking-tighter bg-orange-500/10 text-orange-500 border-orange-500/20">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground font-medium truncate max-w-[150px] sm:max-w-none">{user.email}</span>
                      <div className="lg:hidden flex flex-col gap-0.5 mt-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">{user.role}</span>
                        <span className="text-[8px] font-bold text-muted-foreground/50 uppercase">
                           {user.created_at ? format(new Date(user.created_at), "MMM dd, HH:mm") : "N/A"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 hidden lg:table-cell">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-muted-foreground/70 uppercase tracking-tighter">
                        {user.created_at ? format(new Date(user.created_at), "MMM dd, yyyy") : "N/A"}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground/40 uppercase">
                        {user.created_at ? format(new Date(user.created_at), "HH:mm") : ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 hidden md:table-cell">
                    <Badge className={cn("rounded-xl px-3 py-1 font-black text-[10px] uppercase tracking-widest border transition-all", getRoleBadgeColor(user.role))}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right px-6">
                    <div className="flex items-center justify-end gap-1">
                        {!user.email_verified_at && (
                            <Button 
                                onClick={() => handleResend(user.id)}
                                disabled={isResending}
                                variant="ghost" 
                                size="sm"
                                className="h-7 px-3 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] bg-orange-500/10 text-orange-600 hover:bg-orange-500/30 border border-orange-500/20 transition-all hover:scale-105 active:scale-95"
                            >
                                {isResending ? (
                                    <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                                ) : null}
                                Resend
                            </Button>
                        )}
                        <Button 
                            onClick={() => onView(user)} 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl text-primary hover:bg-primary/20 hover:scale-110 transition-all active:scale-95"
                            title="View Details"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                            onClick={() => onEdit(user)} 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl text-amber-600 hover:bg-amber-600/20 hover:scale-110 transition-all active:scale-95"
                            title="Edit User"
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                            onClick={() => onDelete(user)} 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/20 hover:scale-110 transition-all active:scale-95"
                            title="Delete User"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="border-t border-border/40 bg-muted/20 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 order-2 sm:order-1">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Rows per page:</span>
                <Select
                    value={rowsPerPage.toString()}
                    onValueChange={(val) => {
                        setRowsPerPage(Number(val));
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger className="h-8 w-16 rounded-lg bg-background/50 border-border/40 text-[10px] font-black">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/10 backdrop-blur-3xl bg-background/95">
                        {[5, 10, 20, 50].map((num) => (
                            <SelectItem key={num} value={num.toString()} className="text-[10px] font-black rounded-lg">
                                {num}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="h-4 w-px bg-border/40 hidden sm:block" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, users.length)} of {users.length}
            </span>
        </div>

        <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-lg border-border/40 hover:bg-muted disabled:opacity-30 transition-all"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Show only first, last, and pages around current
                    if (
                        pageNum === 1 || 
                        pageNum === totalPages || 
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                        return (
                            <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                onClick={() => setCurrentPage(pageNum)}
                                className={cn(
                                    "h-8 min-w-[32px] rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                    currentPage === pageNum ? "shadow-lg shadow-primary/20" : "border-border/40 hover:bg-muted"
                                )}
                            >
                                {pageNum}
                            </Button>
                        );
                    } else if (
                        pageNum === currentPage - 2 || 
                        pageNum === currentPage + 2
                    ) {
                        return <span key={pageNum} className="text-muted-foreground/40 px-1">...</span>;
                    }
                    return null;
                })}
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 rounded-lg border-border/40 hover:bg-muted disabled:opacity-30 transition-all"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </div>
  );
}
