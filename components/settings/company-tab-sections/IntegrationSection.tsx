import { Building2, Globe, Key, Lock, Webhook, LayoutGrid } from "lucide-react";
import { ModernField } from "@/components/ui/modern-field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface IntegrationSectionProps {
  isAdmin: boolean;
  listingWebhook: string;
  setListingWebhook: (val: string) => void;
  salesOfferWebhook: string;
  setSalesOfferWebhook: (val: string) => void;
  salesOfferEntityTypeId: string;
  setSalesOfferEntityTypeId: (val: string) => void;
  pfApiKey: string;
  setPfApiKey: (val: string) => void;
  pfApiSecret: string;
  setPfApiSecret: (val: string) => void;
  bayutApiKey: string;
  setBayutApiKey: (val: string) => void;
}

export function IntegrationSection({
  isAdmin,
  listingWebhook, setListingWebhook,
  salesOfferWebhook, setSalesOfferWebhook,
  salesOfferEntityTypeId, setSalesOfferEntityTypeId,
  pfApiKey, setPfApiKey,
  pfApiSecret, setPfApiSecret,
  bayutApiKey, setBayutApiKey
}: IntegrationSectionProps) {
  return (
    <Card className="rounded-2xl border-border/50 shadow-xl overflow-hidden backdrop-blur-sm bg-card/50">
      <CardHeader className="border-b border-border/10 bg-muted/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="font-black text-xl">Integration</CardTitle>
            <CardDescription className="font-medium">Configure external service connections. (Bitrix, Property Finder, Bayut)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary/70 flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Bitrix24
            </h3>
            <ModernField 
              label="Listing Webhook URL" 
              placeholder="https://your-domain.com/webhook/listing" 
              icon={Webhook} 
              type="password"
              value={listingWebhook}
              onChange={(e) => setListingWebhook(e.target.value)}
              readOnly={!isAdmin}
            />
            <ModernField 
              label="Sales Offer Webhook URL" 
              placeholder="https://your-domain.bitrix24.com/rest/1/..." 
              icon={Webhook} 
              type="password"
              value={salesOfferWebhook}
              onChange={(e) => setSalesOfferWebhook(e.target.value)}
              readOnly={!isAdmin}
            />
            <ModernField 
              label="Sales Offer SPA Entity ID" 
              placeholder="e.g. 1058" 
              icon={LayoutGrid} 
              value={salesOfferEntityTypeId}
              onChange={(e) => setSalesOfferEntityTypeId(e.target.value)}
              readOnly={!isAdmin}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary/70 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Property Finder
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <ModernField 
                label="PF API Key" 
                placeholder="Enter PF API Key" 
                icon={Key} 
                type="password"
                value={pfApiKey}
                onChange={(e) => setPfApiKey(e.target.value)}
                readOnly={!isAdmin}
              />
              <ModernField 
                label="PF API Secret" 
                placeholder="Enter PF API Secret" 
                icon={Lock} 
                type="password"
                value={pfApiSecret}
                onChange={(e) => setPfApiSecret(e.target.value)}
                readOnly={!isAdmin}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary/70 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Bayut
            </h3>
            <ModernField 
              label="Bayut API Key" 
              placeholder="Enter Bayut API Key" 
              icon={Key} 
              type="password"
              value={bayutApiKey}
              onChange={(e) => setBayutApiKey(e.target.value)}
              readOnly={!isAdmin}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
