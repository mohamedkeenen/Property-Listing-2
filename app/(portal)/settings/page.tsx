"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Building2, 
  Camera, 
  Save, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModernField } from "@/components/ui/modern-field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { selectCompanyName, selectCompanyLogo, selectSettingsLastUpdated, setCompanySettings } from "@/api/redux/slices/settingsSlice";
import { selectCurrentUser } from "@/api/redux/slices/authSlice";
import { useUpdateCompanySettingsMutation } from "@/api/redux/services/settingsApi";
import { toast } from "react-hot-toast";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const reduxCompanyName = useSelector(selectCompanyName);
  const reduxLogo = useSelector(selectCompanyLogo);
  const settingsLastUpdated = useSelector(selectSettingsLastUpdated);
  const user = useSelector(selectCurrentUser);
  const isAdmin = user?.role === 'admin';
  
  const [companyName, setCompanyName] = useState(reduxCompanyName);
  const [logo, setLogo] = useState<string>(reduxLogo);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateSettings, { isLoading }] = useUpdateCompanySettingsMutation();

  useEffect(() => {
    setCompanyName(reduxCompanyName);
    setLogo(reduxLogo);
  }, [reduxCompanyName, reduxLogo]);

  const getLogoUrl = (logoStr: string) => {
    if (!logoStr) return "";
    if (logoStr.startsWith('http') || logoStr.startsWith('data:image')) return logoStr;
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace('/api', '');
    return `${apiUrl}/storage/${logoStr}?v=${settingsLastUpdated}`;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("You do not have permission to update settings.");
      return;
    }
    try {
      const result = await updateSettings({
        company_name: companyName,
        logo: logo
      }).unwrap();
      
      if (result.status === 'success') {
        dispatch(setCompanySettings(result.data));
        toast.success("Settings saved successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save settings");
    }
  };

  const handleLogoClick = () => {
    if (!isAdmin) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 overflow-y-auto">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground underline decoration-primary decoration-4 underline-offset-8">Settings</h2>
          <p className="text-muted-foreground font-medium pt-4">
            Manage your company profile and application preferences.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isAdmin ? (
            <Button 
              form="settings-form"
              type="submit" 
              size="lg"
              className="rounded-xl font-black px-8 shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <div className="flex items-center gap-2 px-6 py-3 bg-muted/50 rounded-xl text-muted-foreground font-bold text-sm border border-border/50">
              <Lock className="h-4 w-4" />
              Viewing Only (No Access to Edit)
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-8">
          <Card className="rounded-2xl border-border/50 shadow-xl overflow-hidden backdrop-blur-sm bg-card/50">
            <CardHeader className="border-b border-border/10 bg-muted/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="font-black text-xl">Company Information</CardTitle>
                  <CardDescription className="font-medium">Details displayed on your portal and listings.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <form id="settings-form" onSubmit={handleSave} className="space-y-6">
                <ModernField 
                  label="Company Name" 
                  placeholder="Keen Enterprises" 
                  icon={Building2} 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  readOnly={!isAdmin}
                />
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
                  <CardTitle className="font-black text-xl">Branding</CardTitle>
                  <CardDescription className="font-medium">Change your company logo.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8 flex flex-col items-center">
              <div 
                onClick={handleLogoClick}
                className={cn(
                  "group relative w-48 h-48 rounded-2xl border-2 border-dashed border-border flex items-center justify-center transition-all overflow-hidden",
                  isAdmin ? "cursor-pointer hover:border-primary/50 hover:bg-primary/5" : "cursor-default opacity-80"
                )}
              >
                {logo ? (
                  <div className="relative w-full h-full p-4">
                    <img 
                      src={getLogoUrl(logo)} 
                      alt="Company Logo" 
                      className="object-contain transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="text-white h-8 w-8" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-xs font-bold text-muted-foreground">{isAdmin ? "Upload Logo" : "No Logo"}</p>
                  </div>
                )}
              </div>
              {!isAdmin && (
                <div className="mt-4 p-3 bg-destructive/5 rounded-xl border border-destructive/10 text-destructive text-center w-full max-w-[200px]">
                  <p className="text-[10px] font-black uppercase tracking-tighter">Access Denied</p>
                  <p className="text-[10px] font-medium leading-tight mt-1">Only admins can change branding assets.</p>
                </div>
              )}
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
    </div>
  );
}
