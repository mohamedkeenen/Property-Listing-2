"use client";

import { useState, useRef } from "react";
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Camera, 
  Save, 
  ShieldCheck, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModernField } from "@/components/ui/modern-field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [logo, setLogo] = useState<string>("https://res.cloudinary.com/devht0mp5/image/upload/v1771906074/logoo_hsovz7.jpg");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Settings saved successfully!");
    }, 1500);
  };

  const handleLogoClick = () => {
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ModernField 
                    label="Company Name" 
                    placeholder="Keen Enterprises" 
                    icon={Building2} 
                    defaultValue="Keen Enterprises"
                  />
                  <ModernField 
                    label="Support Email" 
                    placeholder="support@keen.com" 
                    icon={Mail} 
                    defaultValue="contact@keenenterprises.com"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ModernField 
                    label="Phone Number" 
                    placeholder="+971 50 123 4567" 
                    icon={Phone} 
                    defaultValue="+971 4 000 0000"
                  />
                  <ModernField 
                    label="Website" 
                    placeholder="www.keen.com" 
                    icon={Globe} 
                    defaultValue="www.keenenterprises.com"
                  />
                </div>

                <ModernField 
                  label="Office Address" 
                  placeholder="Street Address, City, Country" 
                  icon={MapPin} 
                  defaultValue="Downtown Dubai, UAE"
                />
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/50 shadow-xl overflow-hidden backdrop-blur-sm bg-card/50">
            <CardHeader className="border-b border-border/10 bg-muted/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="font-black text-xl">Admin Controls</CardTitle>
                  <CardDescription className="font-medium">Global configuration for administrators only.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/10">
                <div className="space-y-1">
                  <p className="font-bold text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Mandatory for all team members.</p>
                </div>
                <div className="h-6 w-12 rounded-full bg-primary/20 relative cursor-pointer">
                  <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-primary shadow-sm shadow-black/20" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-bold text-sm">Danger Zone</span>
                </div>
                <p className="text-xs text-muted-foreground">Deleting your account will permanently remove all property listings and lead data. This action cannot be undone.</p>
                <Button variant="destructive" size="sm" className="w-fit font-black rounded-lg">Delete Organization</Button>
              </div>
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
                className="group relative w-48 h-48 rounded-2xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden"
              >
                {logo ? (
                  <div className="relative w-full h-full p-4">
                    <Image 
                      src={logo} 
                      alt="Company Logo" 
                      fill 
                      className="object-contain transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="text-white h-8 w-8" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-xs font-bold text-muted-foreground">Upload Logo</p>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <div className="mt-8 space-y-4 w-full">
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Logo Specs</p>
                  <p className="text-xs text-muted-foreground">• Recommended: 512x512px</p>
                  <p className="text-xs text-muted-foreground">• Formats: PNG, JPG, SVG</p>
                  <p className="text-xs text-muted-foreground">• Max size: 2MB</p>
                </div>
                <Separator className="bg-border/10" />
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Theme Color</p>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500 ring-2 ring-primary ring-offset-2" />
                    <div className="h-8 w-8 rounded-lg bg-blue-500 hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all cursor-pointer opacity-40" />
                    <div className="h-8 w-8 rounded-lg bg-violet-500 hover:ring-2 hover:ring-violet-500 hover:ring-offset-2 transition-all cursor-pointer opacity-40" />
                    <div className="h-8 w-8 rounded-lg bg-rose-500 hover:ring-2 hover:ring-rose-500 hover:ring-offset-2 transition-all cursor-pointer opacity-40" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
