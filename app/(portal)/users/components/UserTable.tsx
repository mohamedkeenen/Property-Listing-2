"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  User as UserIcon,
  Shield,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  photo?: string;
  phone?: string;
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView: (user: User) => void;
}

export function UserTable({ users, onEdit, onDelete, onView }: UserTableProps) {
  const baseUrl = 'https://property-listing.keenenter.com';

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
      case 'agent': return <UserCheck className="h-3 w-3 mr-1" />;
      default: return <UserIcon className="h-3 w-3 mr-1" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return "bg-primary/20 text-primary border-primary/20 hover:bg-primary/30";
      case 'agent': return "bg-purple-500/20 text-purple-500 border-purple-500/20 hover:bg-purple-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="relative rounded-xl border border-border/50 bg-card/30 backdrop-blur-xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto no-scrollbar">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="w-[80px] font-black uppercase tracking-widest text-[10px] py-6 px-6">Profile</TableHead>
              <TableHead className="w-[60px] font-black uppercase tracking-widest text-[10px] py-6 text-center">ID</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Name & Email</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Role</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3 opacity-50">
                    <UserIcon className="h-12 w-12 text-muted-foreground" />
                    <p className="text-sm font-black uppercase tracking-widest">No users found in this company</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="group border-border/40 hover:bg-primary/5 transition-colors">
                  <TableCell className="py-4 px-6">
                    <Avatar className="h-12 w-12 rounded-xl border-2 border-background ring-4 ring-primary/5 shadow-lg transition-transform duration-500">
                      <AvatarImage src={getPhotoUrl(user.photo || '')} alt={user.name} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary font-black">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <span className="font-mono text-xs font-black text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                      #{user.id}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-black text-foreground tracking-tight transition-colors">{user.name}</span>
                      <span className="text-xs text-muted-foreground font-medium">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className={cn("rounded-xl px-3 py-1 font-black text-[10px] uppercase tracking-widest border transition-all", getRoleBadgeColor(user.role))}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all active:scale-95">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px] p-2 rounded-2xl border-border/10 shadow-2xl backdrop-blur-2xl bg-background/95">
                        <DropdownMenuItem onClick={() => onView(user)} className="rounded-xl px-3 py-2 cursor-pointer focus:bg-primary/10 focus:text-primary font-black text-xs gap-3">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(user)} className="rounded-xl px-3 py-2 cursor-pointer focus:bg-primary/10 focus:text-primary font-black text-xs gap-3">
                          <Edit2 className="h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <div className="h-px bg-border/40 my-1 mx-2" />
                        <DropdownMenuItem onClick={() => onDelete(user)} className="rounded-xl px-3 py-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-black text-xs gap-3">
                          <Trash2 className="h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
