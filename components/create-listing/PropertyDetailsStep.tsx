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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 col-span-1 md:col-span-2">
              <ModernField label="Size (Total)" icon={Maximize} required type="number" {...register("size")} error={fieldError("size")} value={watch("size")} />
              <ModernField label="Sq. ft (Built)" icon={Maximize} required type="number" {...register("sqft")} error={fieldError("sqft")} value={watch("sqft")} />
              <ModernField label="UNIT" icon={Maximize} value="SQ. FT" readOnly />
            </div>

            <ModernField label="Unit No" icon={Hash} required {...register("unitNo")} error={fieldError("unitNo")} value={watch("unitNo")} />
            
            <NumberSearchSelect 
              label="Bedrooms" 
              icon={BedDouble} 
              required 
              showStudio
              value={watch("bedrooms") === 0 ? "Studio" : (watch("bedrooms") !== undefined ? watch("bedrooms")?.toString() : undefined)} 
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
              value={watch("bathrooms") !== undefined ? watch("bathrooms")?.toString() : undefined} 
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
              options={filterOptions.projectNames}
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
              options={filterOptions.developers}
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
                 >
                   <textarea 
                     {...register("description")} 
                     className="w-full min-h-[160px] bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground dark:text-white outline-none p-0 resize-none overflow-hidden placeholder:text-muted-foreground/40 mt-4 leading-relaxed"
                     placeholder="Craft a compelling story for your property..."
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
                 >
                   <textarea 
                     {...register("descriptionAr")} 
                     className="w-full min-h-[160px] bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground dark:text-white outline-none p-0 resize-none overflow-hidden text-right placeholder:text-muted-foreground/40 mt-4 leading-relaxed font-arabic"
                     dir="rtl"
                     placeholder="اكتب وصفاً جذاباً لعقارك هنا..."
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
              options={filterOptions.agents}
              error={fieldError("listingAgent")}
            />

            <ModernSelect 
              label="Listing Owner" 
              icon={User} 
              required 
              value={watch("listingOwner")} 
              onValueChange={(v) => setValue("listingOwner", v, { shouldValidate: true })}
              options={filterOptions.agents}
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

        {/* Property Permit Card */}
        <Card className="rounded-4xl border-border/40 shadow-sm overflow-hidden bg-card transition-all hover:shadow-xl">
          <CardHeader className="bg-muted/5 border-b border-border/20 py-4 px-6">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-orange-500" />
              Permits & License
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 block">License Type</Label>
            <div className="flex bg-muted/20 p-1.5 rounded-xl gap-1.5 border border-border/40">
              {["Rera", "DTCM"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setValue("licenseType", type, { shouldValidate: true })}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    licenseType === type ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-white/5"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>

            <ModernField label="Permit Number" icon={FileText} {...register("permitNumber")} value={watch("permitNumber")} />
            <ModernField label="Issue Date" icon={Calendar} {...register("permitIssueDate")} value={watch("permitIssueDate")} />
            <ModernField label="Expiration" icon={Calendar} {...register("permitExpiryDate")} value={watch("permitExpiryDate")} />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}


