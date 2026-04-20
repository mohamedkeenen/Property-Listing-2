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
  Loader2,
  CheckCircle2,
  Info,
  Eye,
  EyeOff
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/api/redux/apiConfig";

const createUserSchema = (isEdit: boolean) => z.object({
  name: z.string().min(2, "Full identity name is required"),
  email: z.string().email("A valid organizational email is required"),
  phone: z.string().min(7, "Identity verification: Valid phone number is required"),
  role: z.string().min(1, "System permissions must be assigned"),
  password: z.string().optional().refine((val) => {
    if (!isEdit && (!val || val.length < 8)) return false;
    if (isEdit && val && val.length > 0 && val.length < 8) return false;
    return true;
  }, {
    message: "Security requirement: Password must be at least 8 characters"
  }),
});

type UserFormValues = z.infer<ReturnType<typeof createUserSchema>>;

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
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<UserFormValues>({
    resolver: zodResolver(createUserSchema(isEdit)),
    mode: "onChange",
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
      setValue("password", ""); 
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

  const baseUrl = 'https://property-listing.keenenter.com';

  const getPhotoUrl = (photo: string) => {
    if (!photo) return null;
    if (photo.startsWith('http') || photo.startsWith('data:image')) return photo;
    if (photo.startsWith('/api/')) return `${baseUrl}${photo}`;
    return `${API_BASE_URL}/storage/${photo}`;
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
    
    if (isEdit && !values.password) {
      delete (data as any).password;
    }
    
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-border/40 shadow-2xl bg-card/95 backdrop-blur-3xl rounded-4xl">
        <div className="relative h-20 w-full bg-primary/5 p-6 flex flex-col justify-center border-b border-border/50">
            <DialogTitle className="text-xl font-bold text-foreground">
                {isEdit ? "Edit Profile" : "Create User"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium text-[10px] uppercase tracking-wider">
                {isEdit ? "Update user credentials" : "Add a new member to your team"}
            </DialogDescription>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center -mt-4">
            <div className="relative group">
                <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-50 transition-opacity" />
                <div className="relative p-1 rounded-full bg-muted shadow-xl border border-border/50">
                    <Avatar className="h-24 w-24 rounded-full border-4 border-background">
                        <AvatarImage src={photoPreview || ""} className="object-cover" />
                        <AvatarFallback className="bg-primary/5 text-primary font-bold text-2xl">
                        {isEdit ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-8 w-8 opacity-20" />}
                        </AvatarFallback>
                    </Avatar>
                    <Button
                        type="button"
                        size="icon"
                        className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-primary shadow-lg border-2 border-background hover:scale-110 active:scale-95 transition-all text-white z-20"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Camera className="h-4 w-4" />
                    </Button>
                </div>
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
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] uppercase font-bold text-muted-foreground/60 ml-1">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-11 h-12 rounded-xl bg-muted/40 border-border/40 focus:ring-primary/20 transition-all font-semibold text-xs"
                  autoComplete="off"
                  {...register("name")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[10px] uppercase font-bold text-muted-foreground/60 ml-1">Phone Number</Label>
              <div className="relative">
                <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="phone"
                  placeholder="+971 50 123 4567"
                  className="pl-11 h-12 rounded-xl bg-muted/20 border-border/10 focus:ring-primary/20 transition-all font-semibold text-xs"
                  {...register("phone")}
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email" className="text-[10px] uppercase font-bold text-muted-foreground/60 ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-11 h-12 rounded-xl bg-muted/20 border-border/10 focus:ring-primary/20 transition-all font-semibold text-xs"
                  autoComplete="off"
                  {...register("email")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-[10px] uppercase font-bold text-muted-foreground/60 ml-1">System Role</Label>
              <Select
                defaultValue="agent"
                onValueChange={(val) => setValue("role", val)}
                value={watch("role")}
              >
                <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/10 focus:ring-primary/20 font-semibold text-xs transition-all">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border/10 shadow-2xl bg-[#161B22]/95 backdrop-blur-2xl">
                  <SelectItem value="admin" className="rounded-lg cursor-pointer">Administrator</SelectItem>
                  <SelectItem value="agent" className="rounded-lg cursor-pointer">Organization Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] uppercase font-bold text-muted-foreground/60 ml-1">
                {isEdit ? "New Password" : "Secure Password"}
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-12 rounded-xl bg-muted/20 border-border/10 focus:ring-primary/20 transition-all font-semibold text-xs"
                  autoComplete="new-password"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                  System roles govern application permissions. New accounts require manual password assignment by administrators for initial access.
              </p>
          </div>

          <DialogFooter className="md:justify-end items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-12 px-6 font-bold text-xs uppercase tracking-wider hover:bg-muted/50 transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isValid}
              className="rounded-xl h-12 px-10 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 text-xs uppercase tracking-widest"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  {isEdit ? "Update User" : "Create User"}
                  {isEdit ? <CheckCircle2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
