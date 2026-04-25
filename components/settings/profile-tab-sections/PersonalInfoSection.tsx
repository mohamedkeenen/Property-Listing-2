import React from "react";
import { User as UserIcon, Mail, Phone } from "lucide-react";
import { ModernField } from "@/components/ui/modern-field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PersonalInfoSectionProps {
  user: any;
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  handleProfileUpdate: (e: React.FormEvent) => void;
}

export function PersonalInfoSection({
  user,
  name, setName,
  email, setEmail,
  phone, setPhone,
  handleProfileUpdate
}: PersonalInfoSectionProps) {
  return (
    <Card className="rounded-xl border-border/50 shadow-xl overflow-hidden backdrop-blur-sm bg-card/50">
      <CardHeader className="border-b border-border/10 bg-muted/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="font-black text-xl">Personal Information</CardTitle>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-black px-3 py-1 rounded-lg uppercase tracking-wider text-[10px] ml-2">
                  {user?.role === 'admin' ? 'ADMIN' : 'AGENT'}
                </Badge>
              </div>
              <CardDescription className="font-medium">Update your profile details and contact information.</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-8">
        <form id="profile-info-form" onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <ModernField 
              label="Phone Number" 
              placeholder="+971 XXX XXX XXX" 
              icon={Phone} 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
