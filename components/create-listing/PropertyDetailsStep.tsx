"use client";

import { forwardRef, useState, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { filterOptions } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  Home, Building2, BedDouble, Bath, Car, Maximize, Tag, DollarSign, FileText, Sparkles,
  Calendar, User, Hash, CalendarCheck, Info, X, PlusCircle, CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModernField } from "@/components/ui/modern-field";
import { ModernSelect } from "@/components/ui/modern-select";
import { NumberSearchSelect } from "@/components/ui/number-search-select";
import { CreditCard as CreditCardIcon, Paintbrush } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useGetProjectsQuery, useGetDevelopersQuery } from "@/api/redux/services/settingsApi";
import { useGetUsersQuery } from "@/api/redux/services/userApi";
import { useSelector } from "react-redux";
import { selectCompanyLogo, selectSettingsLastUpdated } from "@/api/redux/slices/settingsSlice";
import { Upload, Image as ImageIcon, Video, RotateCw, QrCode, StickyNote } from "lucide-react";
import { useRef, useEffect } from "react";

interface Props {
  form: UseFormReturn<any>;
}


export function PropertyDetailsStep({ form }: Props) {
  const { register, setValue, watch, formState: { errors } } = form;
  const category = watch("category");
  const purpose = watch("purpose");

  const AMENITIES_LIST = filterOptions.amenities;
  const pricePeriod = watch("pricePeriod");
  const availabilityStatus = watch("availabilityStatus");
  const licenseType = watch("licenseType");

  const { data: projectsData } = useGetProjectsQuery();
  const { data: developersData } = useGetDevelopersQuery();
  const { data: usersData } = useGetUsersQuery();
  const { data: adminsData } = useGetUsersQuery({ role: 'admin' });

  const projectOptions = useMemo(() => 
    projectsData?.data?.map((p: any) => ({ label: p.name, value: p.id.toString() })) || [], 
  [projectsData]);

  const developerOptions = useMemo(() => 
    developersData?.data?.map((d: any) => ({ label: d.name, value: d.id.toString() })) || [], 
  [developersData]);

  const agentOptions = useMemo(() => 
    usersData?.data?.map((u: any) => ({ label: u.name, value: u.id.toString() })) || [], 
  [usersData]);

  const ownerOptions = useMemo(() => 
    adminsData?.data?.map((u: any) => ({ label: u.name, value: u.id.toString() })) || [], 
  [adminsData]);

  const companyLogo = useSelector(selectCompanyLogo);
  const settingsLastUpdated = useSelector(selectSettingsLastUpdated);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const images = watch("images") || [];
  const documents = watch("documents") || [];
  const notes = watch("notes") || "";

  const getLogoUrl = (logo: string) => {
    if (!logo) return "";
    if (logo.startsWith('http') || logo.startsWith('data:image')) return logo;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    return `${apiUrl}/settings/logo?v=${settingsLastUpdated}`;
  };

  const applyWatermark = (base64Image: string, logoUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(base64Image);
        ctx.drawImage(img, 0, 0);
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.onload = () => {
          const logoTargetWidth = canvas.width * 0.35;
          const logoTargetHeight = (logo.height / logo.width) * logoTargetWidth;
          const x = (canvas.width - logoTargetWidth) / 2;
          const y = (canvas.height - logoTargetHeight) / 2;
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          const padding = 20;
          ctx.roundRect(x - padding, y - padding, logoTargetWidth + (padding * 2), logoTargetHeight + (padding * 2), 24);
          ctx.fill();
          ctx.globalAlpha = 1.0;
          ctx.drawImage(logo, x, y, logoTargetWidth, logoTargetHeight);
          resolve(canvas.toDataURL("image/jpeg", 0.95));
        };
        logo.onerror = () => resolve(base64Image);
        logo.src = logoUrl;
      };
      img.onerror = () => resolve(base64Image);
      img.src = base64Image;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const watermarked = await applyWatermark(base64String, getLogoUrl(companyLogo));
        const currentImages = watch("images") || [];
        setValue("images", [...currentImages, watermarked], { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newList = images.filter((_: any, i: number) => i !== index);
    setValue("images", newList, { shouldValidate: true });
    if (activePreviewIndex >= newList.length) {
      setActivePreviewIndex(Math.max(0, newList.length - 1));
    }
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const docEntry = JSON.stringify({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type || "Document",
          data: reader.result as string
        });
        const currentDocs = watch("documents") || [];
        setValue("documents", [...currentDocs, docEntry], { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDoc = (index: number) => {
    const newList = documents.filter((_: any, i: number) => i !== index);
    setValue("documents", newList, { shouldValidate: true });
  };

  const fieldError = (name: string) => errors[name]?.message as string | undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      <div className="space-y-8 pb-20">
        {/* Section 1: Property Type */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
               <Building2 className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Property Categorization</h3>
            <div className="h-px flex-1 bg-border/20" />
            <Info className="h-4 w-4 text-muted-foreground/30" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Residential Card */}
            <div 
              onClick={() => setValue("category", "Residential", { shouldValidate: true })}
              className={cn(
                "group relative overflow-hidden rounded-4xl border-2 p-8 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1",
                category === "Residential" 
                  ? "border-primary bg-linear-to-br from-primary/10 to-indigo-500/10 shadow-2xl shadow-primary/10" 
                  : "border-border/40 bg-card hover:border-primary/20"
              )}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "p-4 rounded-2xl transition-all duration-500 shadow-xl",
                    category === "Residential" 
                      ? "bg-linear-to-br from-primary to-indigo-600 text-white scale-110 shadow-primary/30" 
                      : "bg-muted text-muted-foreground group-hover:scale-105"
                  )}>
                    <Home className="h-7 w-7" />
                  </div>
                  <div>
                    <span className={cn(
                      "text-xl font-black tracking-tight transition-colors block",
                      category === "Residential" ? "text-primary dark:text-white" : "text-muted-foreground"
                    )}>Residential</span>
                    <p className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground/50 mt-1">Villas, Apartments, & Lands</p>
                  </div>
                </div>
                {category === "Residential" && (
                  <div className="bg-primary text-white p-1.5 rounded-full shadow-lg shadow-primary/50 animate-in zoom-in-50 duration-500">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}
              </div>
              
              <div className="flex bg-muted p-1.5 rounded-2xl gap-1.5 backdrop-blur-sm border border-border">
                <button
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setValue("category", "Residential", { shouldValidate: true }); 
                    setValue("purpose", "Rent", { shouldValidate: true }); 
                  }}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2",
                    (category === "Residential" && purpose === "Rent") 
                      ? "bg-background text-primary shadow-sm ring-1 ring-border" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Tag className="h-3.5 w-3.5" /> For Rent
                </button>
                <button
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setValue("category", "Residential", { shouldValidate: true }); 
                    setValue("purpose", "Sale", { shouldValidate: true }); 
                  }}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2",
                    (category === "Residential" && purpose === "Sale") 
                      ? "bg-background text-primary shadow-sm ring-1 ring-border" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <DollarSign className="h-3.5 w-3.5" /> For Sale
                </button>
              </div>
            </div>

            {/* Commercial Card */}
            <div 
              onClick={() => setValue("category", "Commercial", { shouldValidate: true })}
              className={cn(
                "group relative overflow-hidden rounded-4xl border-2 p-8 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1",
                category === "Commercial" 
                  ? "border-orange-500 bg-linear-to-br from-orange-500/10 to-red-500/10 shadow-2xl shadow-orange-500/10" 
                  : "border-border/40 bg-card hover:border-orange-500/20"
              )}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "p-4 rounded-2xl transition-all duration-500 shadow-xl",
                    category === "Commercial" 
                      ? "bg-linear-to-br from-orange-500 to-red-600 text-white scale-110 shadow-orange-500/30" 
                      : "bg-muted text-muted-foreground group-hover:scale-105"
                  )}>
                    <Building2 className="h-7 w-7" />
                  </div>
                  <div>
                    <span className={cn(
                      "text-xl font-black tracking-tight transition-colors block",
                      category === "Commercial" ? "text-orange-500" : "text-muted-foreground"
                    )}>Commercial</span>
                    <p className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground/50 mt-1">Offices, Shops, & Industrial</p>
                  </div>
                </div>
                {category === "Commercial" && (
                  <div className="bg-orange-500 text-white p-1.5 rounded-full shadow-lg shadow-orange-500/50 animate-in zoom-in-50 duration-500">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}
              </div>
              
              <div className="flex bg-muted/20 p-2 rounded-2xl gap-2 backdrop-blur-sm border border-border/40">
                <button
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setValue("category", "Commercial", { shouldValidate: true }); 
                    setValue("purpose", "Rent", { shouldValidate: true }); 
                  }}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all flex items-center justify-center gap-2",
                    (category === "Commercial" && purpose === "Rent") 
                      ? "bg-white text-orange-600 shadow-xl" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Tag className="h-3.5 w-3.5" /> For Rent
                </button>
                <button
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setValue("category", "Commercial", { shouldValidate: true }); 
                    setValue("purpose", "Sale", { shouldValidate: true }); 
                  }}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all flex items-center justify-center gap-2",
                    (category === "Commercial" && purpose === "Sale") 
                      ? "bg-white text-orange-600 shadow-xl" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <DollarSign className="h-3.5 w-3.5" /> For Sale
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Specifications */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <FileText className="h-4 w-4" />
             </div>
             <h3 className="text-sm font-bold text-foreground">Listing Specifications</h3>
             <div className="h-px flex-1 bg-border/20" />
             <Maximize className="h-4 w-4 text-muted-foreground/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 bg-card/30 p-8 rounded-4xl border border-border/20">
            <ModernField 
              label="Title deed" 
              icon={FileText} 
              {...register("titleDeed")} 
              value={watch("titleDeed")}
              onClear={() => setValue("titleDeed", "", { shouldValidate: true })}
            />
            
            <ModernSelect 
              label="Property type" 
              icon={Home} 
              required 
              value={watch("type")} 
              onValueChange={(v) => setValue("type", v, { shouldValidate: true })}
              options={filterOptions.propertyTypes}
              error={fieldError("type")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-1 md:col-span-2">
              <ModernField label="Size (Total)" icon={Maximize} required type="number" {...register("size")} error={fieldError("size")} value={watch("size")} />
              <ModernField label="UNIT" icon={Maximize} value="SQ. FT" readOnly />
            </div>

            <ModernField label="Unit No" icon={Hash} required {...register("unitNo")} error={fieldError("unitNo")} value={watch("unitNo")} />
            
            <NumberSearchSelect 
              label="Bedrooms" 
              icon={BedDouble} 
              required 
              showStudio
              value={watch("bedrooms") === 0 ? "Studio" : (watch("bedrooms") ? watch("bedrooms")?.toString() : "")} 
              onChange={(v: string) => {
                const val = v === "" ? undefined : (v === "Studio" ? 0 : Number(v));
                setValue("bedrooms", val, { shouldValidate: true });
              }}
              error={fieldError("bedrooms")}
            />

            <NumberSearchSelect 
              label="Bathrooms" 
              icon={Bath} 
              required 
              value={watch("bathrooms") ? watch("bathrooms")?.toString() : ""} 
              onChange={(v: string) => {
                const val = v === "" ? undefined : Number(v);
                setValue("bathrooms", val, { shouldValidate: true });
              }}
              error={fieldError("bathrooms")}
            />

            <ModernField label="No of parking spaces" icon={Car} type="number" {...register("parking")} value={watch("parking")} />

            <ModernSelect 
              label="Select furnished" 
              icon={Sparkles} 
              value={watch("furnished")} 
              onValueChange={(v) => setValue("furnished", v, { shouldValidate: true })}
              options={filterOptions.furnished}
            />

            <ModernField label="Total Land Area" icon={Maximize} type="number" {...register("landArea")} value={watch("landArea")} />
            <ModernField label="Built-up Area" icon={Maximize} type="number" {...register("builtUpArea")} value={watch("builtUpArea")} />
            <ModernField label="Layout Type" icon={Sparkles} {...register("layoutType")} value={watch("layoutType")} />

            <ModernSelect 
              label="Project Name" 
              icon={Building2} 
              value={watch("projectName")} 
              onValueChange={(v) => setValue("projectName", v, { shouldValidate: true })}
              options={projectOptions}
            />
            
            <ModernSelect 
              label="Ownership" 
              icon={User} 
              value={watch("ownership")} 
              onValueChange={(v) => setValue("ownership", v, { shouldValidate: true })}
              options={["Freehold", "Leasehold"]}
            />

            <ModernSelect 
              label="Developers" 
              icon={Building2} 
              value={watch("developers")} 
              onValueChange={(v) => setValue("developers", v, { shouldValidate: true })}
              options={developerOptions}
            />

            <ModernField label="Build Year" icon={Calendar} type="number" {...register("buildYear")} value={watch("buildYear")} />

            <ModernSelect 
              label="Currency" 
              icon={DollarSign} 
              value={watch("currency")} 
              onValueChange={(v) => setValue("currency", v, { shouldValidate: true })}
              options={filterOptions.currencies}
            />

            <ModernSelect 
              label="Finishing Type" 
              icon={Paintbrush} 
              value={watch("finishingType")} 
              onValueChange={(v) => setValue("finishingType", v, { shouldValidate: true })}
              options={filterOptions.finishingTypes}
            />
          </div>
        </section>

        {/* Section 3: Pricing */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <DollarSign className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Structure & Pricing</h3>
              <div className="h-px flex-1 bg-border/20" />
              <Tag className="h-4 w-4 text-muted-foreground/30" />
          </div>

          {purpose === "Sale" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 bg-card/30 p-8 rounded-4xl border border-border/20">
              <ModernField 
                label="Price" 
                icon={DollarSign} 
                required 
                type="number" 
                {...register("price")} 
                error={fieldError("price")} 
                value={watch("price")} 
              />
              
              <div className="flex items-center gap-3 h-14 px-4 bg-muted/20 rounded-2xl border border-border/40">
                <Switch 
                  id="hide-price" 
                  checked={watch("hidePrice")} 
                  onCheckedChange={(v) => setValue("hidePrice", v, { shouldValidate: true })}
                />
                <Label htmlFor="hide-price" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer">
                  Hide Price (Property Finder Only)
                </Label>
              </div>

              <ModernSelect 
                label="Payment Method" 
                icon={CreditCardIcon} 
                value={watch("paymentMethod")} 
                onValueChange={(v) => setValue("paymentMethod", v, { shouldValidate: true })}
                options={filterOptions.paymentMethods}
              />

              <ModernField 
                label="Down Payment Price" 
                icon={DollarSign} 
                type="number" 
                {...register("downPayment")} 
                value={watch("downPayment")} 
              />

              <ModernSelect 
                label="Number Of cheques" 
                icon={Hash} 
                value={watch("cheques")} 
                onValueChange={(v) => setValue("cheques", v, { shouldValidate: true })}
                options={["1", "2", "4", "6", "12"]}
              />

              <ModernField label="Service Charges" icon={FileText} {...register("serviceCharges")} value={watch("serviceCharges")} />

              <ModernSelect 
                label="Financial Status" 
                icon={AlertCircle} 
                value={watch("financialStatus")} 
                onValueChange={(v) => setValue("financialStatus", v, { shouldValidate: true })}
                options={["Paid", "Outstanding"]}
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {["Yearly", "Monthly", "Weekly", "Daily"].map((period) => {
                  const active = pricePeriod === period;
                  return (
                    <div 
                      key={period} 
                      onClick={() => setValue("pricePeriod", period, { shouldValidate: true })}
                      className={cn(
                        "cursor-pointer border-2 rounded-2xl p-5 transition-all duration-500 relative overflow-hidden",
                        active 
                          ? "border-primary bg-primary/10 shadow-2xl scale-105" 
                          : "border-border/40 bg-card hover:border-primary/20"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className={cn(
                          "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                          active ? "border-primary bg-primary" : "border-border/40"
                        )}>
                          {active && <div className="h-1.5 w-1.5 rounded-full bg-white animate-in zoom-in-50" />}
                        </div>
                        <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", active ? "text-primary" : "text-muted-foreground")}>{period}</span>
                      </div>
                      <div className="relative group/price flex items-baseline gap-1.5">
                        <span className={cn("text-[10px] font-black tracking-widest", active ? "text-primary" : "text-muted-foreground/50")}>AED</span>
                          <input 
                            type="number" 
                            min="0"
                            onKeyDown={(e) => {
                              if (e.key === "-" || e.key === "e") e.preventDefault();
                            }}
                            placeholder="0.00"
                            value={active ? (watch("price") || "") : ""}
                            onChange={(e) => {
                              if (active) {
                                const val = e.target.value === "" ? undefined : Number(e.target.value);
                                setValue("price", val, { shouldValidate: true });
                              }
                            }}
                            onFocus={() => setValue("pricePeriod", period, { shouldValidate: true })}
                            className="w-full bg-transparent border-none focus:ring-0 text-lg font-black placeholder:text-muted-foreground/20 text-foreground dark:text-white py-0 h-6 outline-none"
                          />
                      </div>
                      {active && <div className="absolute top-0 right-0 p-3"><Tag className="h-3 w-3 text-primary/40" /></div>}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 bg-card/30 p-8 rounded-4xl border border-border/20">
                <ModernSelect 
                  label="Payment Method" 
                  icon={CreditCardIcon} 
                  value={watch("paymentMethod")} 
                  onValueChange={(v) => setValue("paymentMethod", v, { shouldValidate: true })}
                  options={filterOptions.paymentMethods}
                />

                {watch("paymentMethod") !== "Cash" && (
                  <ModernSelect 
                    label="Number Of cheques" 
                    icon={Hash} 
                    value={watch("cheques")} 
                    onValueChange={(v) => setValue("cheques", v, { shouldValidate: true })}
                    options={["1", "2", "4", "6", "12"]}
                  />
                )}

                <ModernField label="Service Charges" icon={FileText} {...register("serviceCharges")} value={watch("serviceCharges")} />

                <ModernSelect 
                  label="Financial Status" 
                  icon={AlertCircle} 
                  value={watch("financialStatus")} 
                  onValueChange={(v) => setValue("financialStatus", v, { shouldValidate: true })}
                  options={["Paid", "Outstanding"]}
                />
              </div>
            </>
          )}
        </section>

        {/* Section 4: Description */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Sparkles className="h-4 w-4" />
             </div>
             <h3 className="text-sm font-bold text-foreground">Listing Narrative</h3>
             <div className="h-px flex-1 bg-border/20" />
             <FileText className="h-4 w-4 text-muted-foreground/30" />
          </div>

          <div className="bg-card/30 p-8 rounded-4xl border border-border/20">
            <Tabs defaultValue="english" className="w-full">
              <div className="flex justify-end mb-8">
                <TabsList className="bg-muted/10 border border-border/20 h-10 p-1.5 gap-1.5 rounded-xl">
                  <TabsTrigger value="english" className="text-[10px] font-black uppercase tracking-widest h-7 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">English</TabsTrigger>
                  <TabsTrigger value="arabic" className="text-[10px] font-black uppercase tracking-widest h-7 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-arabic">العربية</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="english" className="space-y-8 mt-0 outline-none">
                 <ModernField 
                   label="English Listing Title" 
                   required 
                   icon={FileText} 
                   {...register("title")} 
                   error={fieldError("title")} 
                   value={watch("title")} 
                   onClear={() => setValue("title", "", { shouldValidate: true })}
                 />
                 
                 <ModernField 
                   label="English Description" 
                   required 
                   icon={FileText}
                   value={watch("description")}
                   error={fieldError("description")}
                   onClear={() => setValue("description", "", { shouldValidate: true })}
                   alignTop
                 >
                   <textarea 
                     {...register("description")} 
                     className="w-full min-h-[160px] bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground dark:text-white outline-none p-0 resize-none overflow-hidden placeholder:text-muted-foreground/40 leading-relaxed"
                   />
                 </ModernField>
              </TabsContent>
              
              <TabsContent value="arabic" className="space-y-8 mt-0 outline-none">
                 <ModernField 
                   label="عنوان القائمة (بالعربية)" 
                   icon={FileText} 
                   {...register("titleAr")} 
                   value={watch("titleAr")} 
                   dir="rtl"
                   onClear={() => setValue("titleAr", "", { shouldValidate: true })}
                 />
                 
                 <ModernField 
                   label="الوصف بالعربية" 
                   icon={FileText}
                   value={watch("descriptionAr")}
                   dir="rtl"
                   onClear={() => setValue("descriptionAr", "", { shouldValidate: true })}
                   alignTop
                 >
                   <textarea 
                     {...register("descriptionAr")} 
                     className="w-full min-h-[160px] bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground dark:text-white outline-none p-0 resize-none overflow-hidden text-right placeholder:text-muted-foreground/40 leading-relaxed font-arabic"
                     dir="rtl"
                   />
                 </ModernField>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Section 5: Amenities */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                <PlusCircle className="h-4 w-4" />
             </div>
             <h3 className="text-sm font-bold text-foreground">Select Amenities</h3>
             <div className="h-px flex-1 bg-border/20" />
             <PlusCircle className="h-4 w-4 text-muted-foreground/30" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {AMENITIES_LIST.map((amenity) => {
              const selected = (watch("amenities") || []).includes(amenity);
              return (
                <div 
                  key={amenity}
                  onClick={() => {
                    const current = watch("amenities") || [];
                    const newVal = current.includes(amenity) 
                      ? current.filter((a: string) => a !== amenity)
                      : [...current, amenity];
                    setValue("amenities", newVal, { shouldValidate: true });
                  }}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer group",
                    selected 
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/10" 
                      : "border-border/40 bg-card hover:border-primary/20 hover:bg-card/60"
                  )}
                >
                  <div className={cn(
                    "h-5 w-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shrink-0",
                    selected ? "bg-primary border-primary" : "border-border group-hover:border-primary/40"
                  )}>
                    {selected && <CheckCircle2 className="h-3 w-3 text-white animate-in zoom-in-50" />}
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-wider transition-colors truncate",
                    selected ? "text-primary dark:text-white" : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {amenity}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
        {/* Section 6: Media & Photos */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <ImageIcon className="h-4 w-4" />
             </div>
             <h3 className="text-sm font-bold text-foreground">Media & Photographs</h3>
             <div className="h-px flex-1 bg-border/20" />
             <Upload className="h-4 w-4 text-muted-foreground/30" />
          </div>

          <div className="bg-card/30 p-8 rounded-4xl border border-border/20 space-y-8">
            <div className="flex flex-wrap gap-4 min-h-[120px]">
              {images.map((url: string, i: number) => (
                <div 
                  key={i} 
                  className={cn(
                    "relative group w-28 h-28 rounded-2xl overflow-hidden shadow-sm border border-border/40 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer",
                    activePreviewIndex === i ? "ring-2 ring-primary" : ""
                  )}
                  onClick={() => setActivePreviewIndex(i)}
                >
                  <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                      className="bg-white/20 backdrop-blur-md hover:bg-destructive/80 text-white rounded-xl p-2 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary mb-2" />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">Upload</span>
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ModernField label="Video Tour URL" icon={Video} {...register("videoUrl")} value={watch("videoUrl")} />
              <ModernField label="View 360 URL" icon={RotateCw} {...register("view360Url")} value={watch("view360Url")} />
              <ModernField label="QR Code URL" icon={QrCode} {...register("qrCodeUrl")} value={watch("qrCodeUrl")} />
            </div>
          </div>
        </section>

        {/* Section 7: Documents */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <FileText className="h-4 w-4" />
             </div>
             <h3 className="text-sm font-bold text-foreground">Internal Documents</h3>
             <div className="h-px flex-1 bg-border/20" />
             <PlusCircle className="h-4 w-4 text-muted-foreground/30" />
          </div>

          <div className="bg-card/30 p-8 rounded-4xl border border-border/20">
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => docInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all text-xs font-bold text-muted-foreground"
              >
                <PlusCircle className="h-4 w-4" /> Add Document
                <input ref={docInputRef} type="file" multiple className="hidden" onChange={handleDocUpload} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((docJson: string, i: number) => {
                  const doc = JSON.parse(docJson);
                  return (
                    <div key={i} className="flex items-center justify-between bg-muted/20 border border-border/40 rounded-2xl p-4">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-bold truncate">{doc.name}</p>
                          <p className="text-[10px] text-muted-foreground">{doc.size}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeDoc(i)} className="text-muted-foreground hover:text-destructive p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Internal Notes */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-gray-500/10 text-gray-500">
                <StickyNote className="h-4 w-4" />
             </div>
             <h3 className="text-sm font-bold text-foreground">Internal Notes</h3>
             <div className="h-px flex-1 bg-border/20" />
             <FileText className="h-4 w-4 text-muted-foreground/30" />
          </div>

          <div className="bg-card/30 p-8 rounded-4xl border border-border/20">
            <ModernField 
              label="Private Remarks" 
              icon={StickyNote} 
              value={watch("notes")}
              onClear={() => setValue("notes", "", { shouldValidate: true })}
              alignTop
            >
              <textarea 
                {...register("notes")} 
                className="w-full min-h-[120px] bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground outline-none p-0 resize-none placeholder:text-muted-foreground/20 leading-relaxed"
                placeholder="Internal notes only, not visible to clients..."
              />
            </ModernField>
          </div>
        </section>
      </div>

      {/* RIGHT SIDEBAR */}
      <aside className="space-y-6">
        {/* Draft Property Card */}
        <Card className="rounded-4xl border-border/40 shadow-sm overflow-hidden bg-card transition-all hover:shadow-xl group">
          <CardHeader className="bg-muted/5 border-b border-border/20 py-4 px-6">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              Draft Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1">Last updated</Label>
              <div className="bg-muted/20 h-10 rounded-xl border border-border/40 flex items-center px-4 font-bold text-foreground text-xs">
                {new Date().toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1">Creation Date</Label>
              <div className="bg-muted/20 h-10 rounded-xl border border-border/40 flex items-center px-4 font-bold text-foreground text-xs">
                 10 Mar 2026
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Management Card */}
        <Card className="rounded-4xl border-border/40 shadow-sm overflow-hidden bg-card transition-all hover:shadow-xl">
          <CardHeader className="bg-muted/5 border-b border-border/20 py-4 px-6">
            <CardTitle className="text-[10px] font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-primary" />
              Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1">Reference</Label>
              <div className="bg-muted/20 h-10 rounded-xl border border-border/40 flex items-center px-4 font-black text-primary text-xs tracking-widest">REF-48291</div>
            </div>

            <ModernSelect 
              label="Listing Agent" 
              icon={User} 
              required 
              value={watch("listingAgent")} 
              onValueChange={(v) => setValue("listingAgent", v, { shouldValidate: true })}
              options={agentOptions}
              error={fieldError("listingAgent")}
            />

            <ModernSelect 
              label="Listing Owner" 
              icon={User} 
              required 
              value={watch("listingOwner")} 
              onValueChange={(v) => setValue("listingOwner", v, { shouldValidate: true })}
              options={ownerOptions}
              error={fieldError("listingOwner")}
            />

            <ModernSelect 
              label="Select Landlord" 
              icon={User} 
              required 
              value={watch("landlord")} 
              onValueChange={(v) => setValue("landlord", v, { shouldValidate: true })}
              options={["John Miller"]}
              error={fieldError("landlord")}
            />
          </CardContent>
        </Card>

      </aside>
    </div>
  );
}
