import { Building2 } from "lucide-react";
import { ModernField } from "@/components/ui/modern-field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CompanyInfoSectionProps {
  isAdmin: boolean;
  companyName: string;
  setCompanyName: (name: string) => void;
}

export function CompanyInfoSection({ isAdmin, companyName, setCompanyName }: CompanyInfoSectionProps) {
  return (
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
        <div className="space-y-6">
          <ModernField 
            label="Company Name" 
            placeholder="Keen Enterprises" 
            icon={Building2} 
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            readOnly={!isAdmin}
          />
        </div>
      </CardContent>
    </Card>
  );
}
