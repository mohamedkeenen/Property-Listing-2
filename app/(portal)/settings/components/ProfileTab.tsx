"use client";

import { useState, useRef, useEffect } from "react";
import { 
  User as UserIcon, 
  Mail, 
  Camera, 
  Lock, 
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModernField } from "@/components/ui/modern-field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useUpdateProfileMutation, useUpdatePasswordMutation } from "@/api/redux/services/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, selectToken } from "@/api/redux/slices/authSlice";
import { Badge } from "@/components/ui/badge";

interface ProfileTabProps {
  user: any;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photo, setPhoto] = useState<string>(user?.photo || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhoto(user.photo || "");
    }
  }, [user]);

  const getPhotoUrl = (photoStr: string) => {
    if (!photoStr) return "";
    if (photoStr.startsWith('http') || photoStr.startsWith('data:image')) return photoStr;
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace('/api', '');
    return `${apiUrl}/storage/${photoStr}`;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await updateProfile({
        name,
        email,
        photo: photo.startsWith('data:image') ? photo : undefined
      }).unwrap();
      
      if (result.status === 'success') {
        if (token) {
          dispatch(setCredentials({ user: result.data, token: token }));
        }
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      const result = await updatePassword({
        password: newPassword,
        password_confirmation: confirmPassword
      }).unwrap();
      
      if (result.status === 'success') {
        toast.success("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update password");
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
      <div className="col-span-4 space-y-8">
        {/* Basic Info */}
        <Card className="rounded-2xl border-border/50 shadow-xl overflow-hidden backdrop-blur-sm bg-card/50">
          <CardHeader className="border-b border-border/10 bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="font-black text-xl">Personal Information</CardTitle>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-black px-3 py-1 rounded-lg uppercase tracking-wider text-[10px]">
                      {user?.role || "Agent"}
                    </Badge>
                  </div>
                  <CardDescription className="font-medium">Update your profile details and email address.</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <form id="profile-info-form" onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <ModernField 
                  label="Full Name" 
                  placeholder="John Doe" 
                  icon={UserIcon} 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <ModernField 
                  label="Email Address" 
                  placeholder="john@example.com" 
                  icon={Mail} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="rounded-2xl border-border/50 shadow-xl overflow-hidden backdrop-blur-sm bg-card/50">
          <CardHeader className="border-b border-border/10 bg-muted/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="font-black text-xl">Security</CardTitle>
                <CardDescription className="font-medium">Change your password to keep your account secure.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <form id="profile-security-form" onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <ModernField 
                  label="New Password" 
                  type={showPasswords ? "text" : "password"}
                  placeholder="••••••••" 
                  icon={Lock} 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <ModernField 
                  label="Confirm New Password" 
                  type={showPasswords ? "text" : "password"}
                  placeholder="••••••••" 
                  icon={Lock} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Button 
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="text-xs font-bold gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showPasswords ? "Hide Passwords" : "Show Passwords"}
                </Button>
                
                <Button 
                  type="submit" 
                  className="rounded-xl font-black px-8 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-3">
        <Card className="rounded-2xl border-border/50 shadow-xl overflow-hidden backdrop-blur-sm bg-card/50 sticky top-8">
          <CardHeader className="border-b border-border/10 bg-muted/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="font-black text-xl">Profile Picture</CardTitle>
                <CardDescription className="font-medium">This will be visible on the sidebar and portal.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 flex flex-col items-center">
            <div 
              onClick={handlePhotoClick}
              className="group relative w-48 h-48 rounded-full border-4 border-dashed border-border flex items-center justify-center transition-all overflow-hidden cursor-pointer hover:border-primary/50 hover:bg-primary/5"
            >
              {photo ? (
                <div className="relative w-full h-full">
                  <img 
                    src={getPhotoUrl(photo)} 
                    alt="Profile" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white h-8 w-8" />
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <UserIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  <p className="text-xs font-bold text-muted-foreground">Upload Photo</p>
                </div>
              )}
            </div>
            
            <p className="mt-4 text-xs font-medium text-muted-foreground text-center max-w-[200px]">
              JPG, GIF or PNG. Max size of 2MB.
            </p>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
