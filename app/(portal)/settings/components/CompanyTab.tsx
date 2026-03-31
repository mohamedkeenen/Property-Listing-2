"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Building2, 
  Camera, 
  Save, 
  Lock,
  Globe,
  Key,
  Webhook,
  MessageSquare,
  Mail,
  Phone,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModernField } from "@/components/ui/modern-field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { 
  selectCompanyName, 
  selectCompanyLogo, 
  selectSettingsLastUpdated, 
  selectBitrixWebhook,
  selectPfApiKey,
  selectPfApiSecret,
  selectBayutApiKey,
  selectBayutLeadSourceWhatsapp,
  selectBayutLeadSourceEmail,
  selectBayutLeadSourcePhone,
  selectPfLeadSourceWhatsapp,
  selectPfLeadSourceEmail,
  selectPfLeadSourcePhone,
  selectSalesOfferWebhook,
  selectSalesOfferEntityTypeId,
  setCompanySettings 
} from "@/api/redux/slices/settingsSlice";
import { useUpdateCompanySettingsMutation } from "@/api/redux/services/settingsApi";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/api/redux/apiConfig";

interface CompanyTabProps {
  isAdmin: boolean;
}

export function CompanyTab({ isAdmin }: CompanyTabProps) {
  const dispatch = useDispatch();
  const reduxCompanyName = useSelector(selectCompanyName);
  const reduxLogo = useSelector(selectCompanyLogo);
  const reduxBitrixWebhook = useSelector(selectBitrixWebhook);
  const reduxPfApiKey = useSelector(selectPfApiKey);
  const reduxPfApiSecret = useSelector(selectPfApiSecret);
  const reduxBayutApiKey = useSelector(selectBayutApiKey);
  const reduxBayutLeadSourceWhatsapp = useSelector(selectBayutLeadSourceWhatsapp);
  const reduxBayutLeadSourceEmail = useSelector(selectBayutLeadSourceEmail);
  const reduxBayutLeadSourcePhone = useSelector(selectBayutLeadSourcePhone);
  const reduxPfLeadSourceWhatsapp = useSelector(selectPfLeadSourceWhatsapp);
  const reduxPfLeadSourceEmail = useSelector(selectPfLeadSourceEmail);
  const reduxPfLeadSourcePhone = useSelector(selectPfLeadSourcePhone);
  const settingsLastUpdated = useSelector(selectSettingsLastUpdated);
  const reduxSalesOfferWebhook = useSelector(selectSalesOfferWebhook);
  const reduxSalesOfferEntityTypeId = useSelector(selectSalesOfferEntityTypeId);
  
  const [companyName, setCompanyName] = useState(reduxCompanyName);
  const [logo, setLogo] = useState<string>(reduxLogo);
  const [bitrixWebhook, setBitrixWebhook] = useState(reduxBitrixWebhook);
  const [pfApiKey, setPfApiKey] = useState(reduxPfApiKey);
  const [pfApiSecret, setPfApiSecret] = useState(reduxPfApiSecret);
  const [bayutApiKey, setBayutApiKey] = useState(reduxBayutApiKey);
  const [bayutLeadSourceWhatsapp, setBayutLeadSourceWhatsapp] = useState(reduxBayutLeadSourceWhatsapp);
  const [bayutLeadSourceEmail, setBayutLeadSourceEmail] = useState(reduxBayutLeadSourceEmail);
  const [bayutLeadSourcePhone, setBayutLeadSourcePhone] = useState(reduxBayutLeadSourcePhone);
  const [pfLeadSourceWhatsapp, setPfLeadSourceWhatsapp] = useState(reduxPfLeadSourceWhatsapp);
  const [pfLeadSourceEmail, setPfLeadSourceEmail] = useState(reduxPfLeadSourceEmail);
  const [pfLeadSourcePhone, setPfLeadSourcePhone] = useState(reduxPfLeadSourcePhone);
  const [salesOfferWebhook, setSalesOfferWebhook] = useState(reduxSalesOfferWebhook);
  const [salesOfferEntityTypeId, setSalesOfferEntityTypeId] = useState(reduxSalesOfferEntityTypeId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateSettings, { isLoading }] = useUpdateCompanySettingsMutation();

  useEffect(() => {
    setCompanyName(reduxCompanyName || "");
    setLogo(reduxLogo || "");
    setBitrixWebhook(reduxBitrixWebhook || "");
    setPfApiKey(reduxPfApiKey || "");
    setPfApiSecret(reduxPfApiSecret || "");
    setBayutApiKey(reduxBayutApiKey || "");
    setBayutLeadSourceWhatsapp(reduxBayutLeadSourceWhatsapp || "");
    setBayutLeadSourceEmail(reduxBayutLeadSourceEmail || "");
    setBayutLeadSourcePhone(reduxBayutLeadSourcePhone || "");
    setPfLeadSourceWhatsapp(reduxPfLeadSourceWhatsapp || "");
    setPfLeadSourceEmail(reduxPfLeadSourceEmail || "");
    setPfLeadSourcePhone(reduxPfLeadSourcePhone || "");
    setSalesOfferWebhook(reduxSalesOfferWebhook || "");
    setSalesOfferEntityTypeId(reduxSalesOfferEntityTypeId || "");
  }, [
    reduxCompanyName, 
    reduxLogo, 
    reduxBitrixWebhook, 
    reduxPfApiKey, 
    reduxPfApiSecret, 
    reduxBayutApiKey,
    reduxBayutLeadSourceWhatsapp,
    reduxBayutLeadSourceEmail,
    reduxBayutLeadSourcePhone,
    reduxPfLeadSourceWhatsapp,
    reduxPfLeadSourceEmail,
    reduxPfLeadSourcePhone,
    reduxSalesOfferWebhook,
    reduxSalesOfferEntityTypeId
  ]);

  const getLogoUrl = (logoStr: string) => {
    if (!logoStr) return "";
    if (logoStr.startsWith('http') || logoStr.startsWith('data:image')) return logoStr;
    return `${API_BASE_URL}/storage/${logoStr}?v=${settingsLastUpdated}`;
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
        logo: logo,
        bitrix_webhook: bitrixWebhook,
        pf_api_key: pfApiKey,
        pf_api_secret: pfApiSecret,
        bayut_api_key: bayutApiKey,
        bayut_lead_source_whatsapp: bayutLeadSourceWhatsapp,
        bayut_lead_source_email: bayutLeadSourceEmail,
        bayut_lead_source_phone: bayutLeadSourcePhone,
        pf_lead_source_whatsapp: pfLeadSourceWhatsapp,
        pf_lead_source_email: pfLeadSourceEmail,
        pf_lead_source_phone: pfLeadSourcePhone,
        sales_offer_webhook: salesOfferWebhook,
        sales_offer_entity_type_id: salesOfferEntityTypeId,
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
    <form id="settings-form" onSubmit={handleSave} className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
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

        {/* Integration Section */}
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
              {/* Bitrix Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary/70 flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Bitrix24
                </h3>
                <ModernField 
                  label="Bitrix Webhook URL" 
                  placeholder="https://your-domain.bitrix24.com/rest/1/..." 
                  icon={Webhook} 
                  type="password"
                  value={bitrixWebhook}
                  onChange={(e) => setBitrixWebhook(e.target.value)}
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

              {/* Property Finder Section */}
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
                <div className="grid gap-4 md:grid-cols-3">
                  <ModernField 
                    label="PF Lead Source WhatsApp" 
                    placeholder="Source ID" 
                    icon={MessageSquare} 
                    value={pfLeadSourceWhatsapp}
                    onChange={(e) => setPfLeadSourceWhatsapp(e.target.value)}
                    readOnly={!isAdmin}
                  />
                  <ModernField 
                    label="PF Lead Source Email" 
                    placeholder="Source ID" 
                    icon={Mail} 
                    value={pfLeadSourceEmail}
                    onChange={(e) => setPfLeadSourceEmail(e.target.value)}
                    readOnly={!isAdmin}
                  />
                  <ModernField 
                    label="PF Lead Source Phone" 
                    placeholder="Source ID" 
                    icon={Phone} 
                    value={pfLeadSourcePhone}
                    onChange={(e) => setPfLeadSourcePhone(e.target.value)}
                    readOnly={!isAdmin}
                  />
                </div>
              </div>

              {/* Bayut Section */}
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
                <div className="grid gap-4 md:grid-cols-3">
                  <ModernField 
                    label="Bayut Lead Source WhatsApp" 
                    placeholder="Source ID" 
                    icon={MessageSquare} 
                    value={bayutLeadSourceWhatsapp}
                    onChange={(e) => setBayutLeadSourceWhatsapp(e.target.value)}
                    readOnly={!isAdmin}
                  />
                  <ModernField 
                    label="Bayut Lead Source Email" 
                    placeholder="Source ID" 
                    icon={Mail} 
                    value={bayutLeadSourceEmail}
                    onChange={(e) => setBayutLeadSourceEmail(e.target.value)}
                    readOnly={!isAdmin}
                  />
                  <ModernField 
                    label="Bayut Lead Source Phone" 
                    placeholder="Source ID" 
                    icon={Phone} 
                    value={bayutLeadSourcePhone}
                    onChange={(e) => setBayutLeadSourcePhone(e.target.value)}
                    readOnly={!isAdmin}
                  />
                </div>
              </div>
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
    </form>
  );
}
