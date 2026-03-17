"use client";

import { useState } from "react";
import { 
  Building2, 
  User as UserIcon,
  Settings as SettingsIcon,
  Save,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/api/redux/slices/authSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "./components/ProfileTab";
import { CompanyTab } from "./components/CompanyTab";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const user = useSelector(selectCurrentUser);
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState("profile");
  
  return (
    <div className="flex-1 space-y-8 p-8 pt-6 overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <SettingsIcon className="h-6 w-6" />
            </div>
            <h2 className="text-4xl font-black tracking-tight text-foreground underline decoration-primary decoration-4 underline-offset-8">
              Settings
            </h2>
          </div>
          <p className="text-muted-foreground font-medium pt-2">
            Manage your personal profile and application preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === "profile" ? (
            <Button 
              form="profile-info-form"
              type="submit" 
              size="lg"
              className="rounded-xl font-black px-8 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              Update Profile
              <UserIcon className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            isAdmin && (
              <Button 
                form="settings-form"
                type="submit" 
                size="lg"
                className="rounded-xl font-black px-8 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                Save Changes
                <Save className="ml-2 h-4 w-4" />
              </Button>
            )
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-8" onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1.5 h-14 rounded-2xl gap-2 backdrop-blur-sm border border-border/50">
          <TabsTrigger 
            value="profile" 
            className="rounded-xl h-full px-8 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary font-black transition-all gap-2"
          >
            <UserIcon className="h-4 w-4" />
            My Profile
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger 
              value="company" 
              className="rounded-xl h-full px-8 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary font-black transition-all gap-2"
            >
              <Building2 className="h-4 w-4" />
              Company Info
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <ProfileTab user={user} />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="company" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <CompanyTab isAdmin={isAdmin} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
