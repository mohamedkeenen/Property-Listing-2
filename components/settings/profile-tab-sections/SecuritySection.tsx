import React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModernField } from "@/components/ui/modern-field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SecuritySectionProps {
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  showPasswords: boolean;
  setShowPasswords: (val: boolean) => void;
  handlePasswordUpdate: (e: React.FormEvent) => void;
  isUpdatingPassword: boolean;
}

export function SecuritySection({
  newPassword, setNewPassword,
  confirmPassword, setConfirmPassword,
  showPasswords, setShowPasswords,
  handlePasswordUpdate,
  isUpdatingPassword
}: SecuritySectionProps) {
  return (
    <Card className="rounded-xl border-border/50 shadow-xl overflow-hidden backdrop-blur-sm bg-card/50">
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
  );
}
