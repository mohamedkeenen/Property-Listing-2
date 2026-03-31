"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Plus, 
  Camera, 
  User as UserIcon, 
  Mail, 
  Lock, 
  Shield, 
  PhoneCall, 
  Trash2, 
  Loader2,
  CheckCircle2,
  Info,
  Eye,
  EyeOff
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  role: z.string().min(1, "Role is required"),
  password: z.string().optional(),
}).refine((data) => {
    // If it's a new user (usually determined by parent but here we'll check if password exists if needed)
    // Actually, we'll just validate length if it's provided.
    if (data.password && data.password.length > 0 && data.password.length < 8) return false;
    return true;
}, {
    message: "Password must be at least 8 characters",
    path: ["password"]
});


type UserFormValues = z.infer<typeof userSchema>;

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function UserDialog({ open, onOpenChange, user, onSubmit, isLoading }: UserDialogProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!user;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "agent",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("phone", user.phone || "");
      setValue("role", user.role);
      setValue("password", ""); // Keep password empty on edit
      setPhotoPreview(user.photo ? getPhotoUrl(user.photo) : null);
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        role: "agent",
        password: "",
      });
      setPhotoPreview(null);
    }
  }, [user, setValue, reset, open]);

  const getPhotoUrl = (photo: string) => {
    if (!photo) return null;
    if (photo.startsWith('http') || photo.startsWith('data:image')) return photo;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    return `${apiUrl}/${photo}`;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = async (values: UserFormValues) => {
    const data = {
      ...values,
      photo: photoPreview?.startsWith('data:image') ? photoPreview : undefined,
    };
    
    // If it's an edit and password is empty, don't send it
    if (isEdit && !values.password) {
      delete (data as any).password;
    }
    
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border/20 shadow-[0_25px_70px_rgba(0,0,0,0.5)] bg-background/95 backdrop-blur-3xl rounded-[2.5rem]">
        <div className="relative h-24 w-full bg-gradient-to-r from-primary to-primary/60 p-6 flex items-center justify-between">
            <div className="space-y-1">
                <DialogTitle className="text-2xl font-black text-white tracking-tight underline decoration-white-400 decoration-4 underline-offset-8">
                    {isEdit ? "Edit Profile" : "Create User"}
                </DialogTitle>
                <DialogDescription className="text-white/80 font-black text-[10px] uppercase tracking-[0.2em] pt-2">
                    {isEdit ? "Configure security and roles for this user" : "Register a new member to your organization"}
                </DialogDescription>
            </div>

        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 space-y-8 pt-10">
          {/* Photo Section */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative group p-1 rounded-4xl bg-gradient-to-tr from-primary/20 via-primary/5 to-purple-500/20 shadow-xl ring-1 ring-border/20">
              <Avatar className="h-28 w-28 rounded-3xl border-4 border-background shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <AvatarImage src={photoPreview || ""} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-black text-3xl">
                  {isEdit ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-10 w-10" />}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="icon"
                className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-primary shadow-xl shadow-primary/30 border-2 border-background hover:scale-110 active:scale-95 transition-all text-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground pl-1">Full Name</Label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-11 h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-background focus:ring-primary/20 transition-all font-medium"
                  autoComplete="off"
                  {...register("name")}
                />
              </div>
              {errors.name && <p className="text-[10px] text-destructive font-bold px-1 uppercase tracking-wider">{errors.name.message}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone" className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground pl-1">Phone Number</Label>
              <div className="relative group">
                <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="phone"
                  placeholder="+971 50 123 4567"
                  className="pl-11 h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-background focus:ring-primary/20 transition-all font-medium"
                  {...register("phone")}
                />
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground pl-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-11 h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-background focus:ring-primary/20 transition-all font-medium"
                  autoComplete="off"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-[10px] text-destructive font-bold px-1 uppercase tracking-wider">{errors.email.message}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="role" className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground pl-1">System Role</Label>
              <div className="relative">
                <Select
                  defaultValue="agent"
                  onValueChange={(val) => setValue("role", val)}
                  value={isEdit ? user.role : undefined}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-background focus:ring-primary/20 font-medium">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/10 shadow-2xl p-2 font-medium">
                    <SelectItem value="admin" className="rounded-xl px-4 py-3">Admin</SelectItem>
                    <SelectItem value="agent" className="rounded-xl px-4 py-3">Agent</SelectItem>
                  </SelectContent>
                </Select>
                <Shield className="absolute right-10 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/30" />
              </div>
              {errors.role && <p className="text-[10px] text-destructive font-bold px-1 uppercase tracking-wider">{errors.role.message}</p>}
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground pl-1">
                {isEdit ? "New Password (optional)" : "Secure Password"}
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-background focus:ring-primary/20 transition-all font-medium"
                  autoComplete="new-password"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-destructive font-bold px-1 uppercase tracking-wider">{errors.password.message}</p>}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
              <div className="p-2 rounded-xl bg-primary/10 h-fit">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-foreground uppercase tracking-widest">Agent Security</p>
                <p className="text-[11px] text-muted-foreground/80 leading-relaxed font-medium">
                    Users added by administrators are pre-verified. Ensure the email address is correct as they will use it to sign in.
                </p>
              </div>
          </div>

          <DialogFooter className="md:justify-between items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black shadow-2xl shadow-primary/30 transition-all active:scale-95 min-w-[180px]"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isEdit ? "Save Securely" : "Confirm Creation"}
                  {isEdit ? <CheckCircle2 className="ml-2 h-4 w-4" /> : <Plus className="ml-2 h-4 w-4" />}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
