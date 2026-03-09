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
import { NumberSearchSelect } from "@/components/ui/number-search-select";
import { CreditCard as CreditCardIcon } from "lucide-react";

interface Props {
  form: UseFormReturn<any>;
}


export function PropertyDetailsStep({ form }: Props) {
  const { register, setValue, watch, formState: { errors } } = form;
  const category = watch("category");
  const purpose = watch("purpose");
  const pricePeriod = watch("pricePeriod");
  const availabilityStatus = watch("availabilityStatus");
  const licenseType = watch("licenseType");

  const fieldError = (name: string) => errors[name]?.message as string | undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      <div className="space-y-8 pb-20">
        {/* Section 1: Property Type */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Property Type</h3>
            <div className="h-px flex-1 bg-slate-100" />
            <Info className="h-4 w-4 text-slate-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Residential Card */}
            <div 
              onClick={() => setValue("category", "Residential")}
              className={cn(
                "group relative overflow-hidden rounded-3xl border-2 p-6 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:-translate-y-1",
                category === "Residential" 
                  ? "border-primary bg-linear-to-br from-primary/10 to-indigo-500/10 shadow-lg shadow-primary/10" 
                  : "border-slate-100 bg-white hover:border-slate-200"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl transition-all duration-500 shadow-lg",
                    category === "Residential" 
                      ? "bg-linear-to-br from-primary to-indigo-600 text-white scale-110 rotate-3" 
                      : "bg-slate-50 text-slate-400 group-hover:scale-105"
                  )}>
                    <Home className="h-6 w-6" />
                  </div>
                  <div>
                    <span className={cn(
                      "text-lg font-black tracking-tight transition-colors",
                      category === "Residential" ? "text-primary dark:text-primary-foreground" : "text-slate-400"
                    )}>Residential</span>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-0.5">Villas, Apartments, etc.</p>
                  </div>
                </div>
                {category === "Residential" && (
                  <div className="bg-primary text-white p-1 rounded-full animate-in zoom-in-50 duration-300">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}
              </div>
              
              <div className="flex bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl gap-1.5 backdrop-blur-sm border border-slate-100/50 dark:border-slate-800/50">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setValue("category", "Residential"); setValue("purpose", "Rent"); }}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2",
                    (category === "Residential" && purpose === "Rent") 
                      ? "bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-700" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <Tag className="h-3.5 w-3.5" /> FOR RENT
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setValue("category", "Residential"); setValue("purpose", "Sale"); }}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2",
                    (category === "Residential" && purpose === "Sale") 
                      ? "bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-700" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <DollarSign className="h-3.5 w-3.5" /> FOR SALE
                </button>
              </div>
            </div>

            {/* Commercial Card */}
            <div 
              onClick={() => setValue("category", "Commercial")}
              className={cn(
                "group relative overflow-hidden rounded-3xl border-2 p-6 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:-translate-y-1",
                category === "Commercial" 
                  ? "border-orange-500 bg-linear-to-br from-orange-500/10 to-red-500/10 shadow-lg shadow-orange-500/10" 
                  : "border-slate-100 bg-white hover:border-slate-200"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl transition-all duration-500 shadow-lg",
                    category === "Commercial" 
                      ? "bg-linear-to-br from-orange-500 to-red-600 text-white scale-110 -rotate-3" 
                      : "bg-slate-50 text-slate-400 group-hover:scale-105"
                  )}>
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <span className={cn(
                      "text-lg font-black tracking-tight transition-colors",
                      category === "Commercial" ? "text-orange-600" : "text-slate-400"
                    )}>Commercial</span>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-0.5">Offices, Shops, etc.</p>
                  </div>
                </div>
                {category === "Commercial" && (
                  <div className="bg-orange-500 text-white p-1 rounded-full animate-in zoom-in-50 duration-300">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}
              </div>
              
              <div className="flex bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl gap-1.5 backdrop-blur-sm border border-slate-100/50 dark:border-slate-800/50">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setValue("category", "Commercial"); setValue("purpose", "Rent"); }}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2",
                    (category === "Commercial" && purpose === "Rent") 
                      ? "bg-white dark:bg-slate-800 text-orange-600 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <Tag className="h-3.5 w-3.5" /> FOR RENT
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setValue("category", "Commercial"); setValue("purpose", "Sale"); }}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2",
                    (category === "Commercial" && purpose === "Sale") 
                      ? "bg-white dark:bg-slate-800 text-orange-600 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <DollarSign className="h-3.5 w-3.5" /> FOR SALE
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Specifications */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Specifications</h3>
            <div className="h-px flex-1 bg-slate-100" />
            <Info className="h-4 w-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <ModernField label="Title deed" icon={FileText} {...register("titleDeed")} value={watch("titleDeed")} />
            
            <ModernField label="Property type" icon={Home} required isSelect value={watch("type")} error={fieldError("type")}>
              <Select value={watch("type")} onValueChange={(v) => setValue("type", v)}>
                <SelectTrigger className="border-none p-0 h-full w-full shadow-none focus:ring-0 text-sm font-semibold text-slate-700 bg-transparent flex items-center">
                  <SelectValue placeholder="Select type" className="placeholder:text-slate-300" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl border-slate-100">
                  {filterOptions.propertyTypes.map((t) => <SelectItem key={t} value={t} className="text-xs font-medium">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </ModernField>

            <ModernField label="Size" icon={Maximize} required type="number" {...register("size")} error={fieldError("size")} value={watch("size")} />
            <ModernField label="Sq. ft" icon={Maximize} required type="number" {...register("sqft")} error={fieldError("sqft")} value={watch("sqft")} />

            <ModernField label="Unit No" icon={Hash} required {...register("unitNo")} error={fieldError("unitNo")} value={watch("unitNo")} />
            
            <NumberSearchSelect 
              label="Bedrooms" 
              icon={BedDouble} 
              required 
              showStudio
              value={watch("bedrooms") === 0 ? "Studio" : watch("bedrooms")?.toString()} 
              onChange={(v: string) => setValue("bedrooms", v === "Studio" ? 0 : Number(v))}
              error={fieldError("bedrooms")}
            />

            <NumberSearchSelect 
              label="Bathrooms" 
              icon={Bath} 
              required 
              value={watch("bathrooms")?.toString()} 
              onChange={(v: string) => setValue("bathrooms", Number(v))}
              error={fieldError("bathrooms")}
            />

            <ModernField label="No of parking spaces" icon={Car} type="number" {...register("parking")} value={watch("parking")} />

            <ModernField label="Select furnished" icon={Sparkles} isSelect value={watch("furnished")}>
              <Select value={watch("furnished")} onValueChange={(v) => setValue("furnished", v)}>
                <SelectTrigger className="border-none p-0 h-full w-full shadow-none focus:ring-0 text-sm font-semibold text-slate-700 bg-transparent">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  {filterOptions.furnished.map((f) => <SelectItem key={f} value={f} className="text-xs font-medium">{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </ModernField>

            <ModernField label="Total Land Area" icon={Maximize} type="number" {...register("landArea")} value={watch("landArea")} />
            <ModernField label="Built-up Area" icon={Maximize} type="number" {...register("builtUpArea")} value={watch("builtUpArea")} />
            <ModernField label="Layout Type" icon={Sparkles} {...register("layoutType")} value={watch("layoutType")} />

            <ModernField label="Project Name" icon={Building2} {...register("projectName")} value={watch("projectName")} />
            
            <ModernField label="Ownership" icon={User} isSelect value={watch("ownership")}>
              <Select value={watch("ownership")} onValueChange={(v) => setValue("ownership", v)}>
                <SelectTrigger className="border-none p-0 h-full w-full shadow-none focus:ring-0 text-sm font-semibold text-slate-700 bg-transparent">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  <SelectItem value="Freehold" className="text-xs font-medium">Freehold</SelectItem>
                  <SelectItem value="Leasehold" className="text-xs font-medium">Leasehold</SelectItem>
                </SelectContent>
              </Select>
            </ModernField>

            <ModernField label="Developers" icon={Building2} isSelect value={watch("developers")}>
              <Select value={watch("developers")} onValueChange={(v) => setValue("developers", v)}>
                <SelectTrigger className="border-none p-0 h-full w-full shadow-none focus:ring-0 text-sm font-semibold text-slate-700 bg-transparent">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  {["Emaar", "Damac", "Nakheel", "Sobha"].map((d) => <SelectItem key={d} value={d} className="text-xs font-medium">{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </ModernField>

            <ModernField label="Build Year" icon={Calendar} type="number" {...register("buildYear")} value={watch("buildYear")} />

            <ModernField label="Currency" icon={DollarSign} isSelect value={watch("currency")}>
               <Select value={watch("currency") || "AED"} onValueChange={(v) => setValue("currency", v)}>
                <SelectTrigger className="border-none p-0 h-full w-full shadow-none focus:ring-0 text-sm font-semibold text-slate-700 bg-transparent">
                  <SelectValue placeholder="AED" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  <SelectItem value="AED" className="text-xs font-medium">AED</SelectItem>
                  <SelectItem value="USD" className="text-xs font-medium">USD</SelectItem>
                </SelectContent>
              </Select>
            </ModernField>

            <ModernField label="Listing Finished" icon={CalendarCheck} isSelect value={watch("listingFinished")}>
              <Select value={watch("listingFinished")} onValueChange={(v) => setValue("listingFinished", v)}>
                <SelectTrigger className="border-none p-0 h-full w-full shadow-none focus:ring-0 text-sm font-semibold text-slate-700 bg-transparent">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  <SelectItem value="Ready" className="text-xs font-medium">Ready</SelectItem>
                  <SelectItem value="Off-plan" className="text-xs font-medium">Off-plan</SelectItem>
                </SelectContent>
              </Select>
            </ModernField>
          </div>
        </section>

        {/* Section 3: Pricing */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Pricing</h3>
            <div className="h-px flex-1 bg-slate-100" />
            <Info className="h-4 w-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {["Yearly", "Monthly", "Weekly", "Daily"].map((period) => {
              const active = pricePeriod === period;
              return (
                <div 
                  key={period} 
                  onClick={() => setValue("pricePeriod", period)}
                  className={cn(
                    "cursor-pointer border-2 rounded-2xl p-4 transition-all duration-300 relative",
                    active ? "border-primary bg-primary/5 shadow-sm" : "border-slate-100 hover:border-slate-200 bg-white"
                  )}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn(
                      "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      active ? "border-primary bg-primary scale-110" : "border-slate-200"
                    )}>
                      {active && <div className="h-1.5 w-1.5 rounded-full bg-white animate-in zoom-in-50" />}
                    </div>
                    <span className={cn("text-xs font-bold transition-colors", active ? "text-primary" : "text-slate-500")}>{period}</span>
                  </div>
                  <div className="relative group/price">
                     <span className={cn(
                       "absolute left-0 top-1/2 -translate-y-1/2 font-bold text-xs select-none transition-all duration-300",
                       active ? "text-primary opacity-100 translate-x-0" : "text-slate-300 opacity-0 -translate-x-1"
                     )}>●</span>
                     <input 
                        type="number" 
                        placeholder="Price"
                        onFocus={() => setValue("pricePeriod", period)}
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-300 text-slate-700 pl-4 py-0 h-6 outline-none"
                        {...(active ? register("price") : {
                           onChange: (e) => {
                             setValue("pricePeriod", period);
                             setValue("price", Number(e.target.value));
                           }
                        })}
                      />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 pt-4">
            <ModernField label="Payment Method" icon={CreditCardIcon} isSelect value={watch("paymentMethod")}>
              <Select value={watch("paymentMethod")} onValueChange={(v) => setValue("paymentMethod", v)}>
                 <SelectTrigger className="border-none p-0 h-full w-full shadow-none focus:ring-0 text-sm font-semibold text-slate-700 bg-transparent">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  <SelectItem value="Cheque" className="text-xs font-medium">Cheque</SelectItem>
                  <SelectItem value="Cash" className="text-xs font-medium">Cash</SelectItem>
                  <SelectItem value="Transfer" className="text-xs font-medium">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </ModernField>

            <ModernField label="Number Of cheques" icon={Hash} isSelect value={watch("cheques")}>
               <Select value={watch("cheques")} onValueChange={(v) => setValue("cheques", v)}>
                 <SelectTrigger className="border-none p-0 h-full w-full shadow-none focus:ring-0 text-sm font-semibold text-slate-700 bg-transparent">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  {["1", "2", "4", "6", "12"].map(n => <SelectItem key={n} value={n} className="text-xs font-medium">{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </ModernField>

            <ModernField label="Service Charges" icon={FileText} {...register("serviceCharges")} value={watch("serviceCharges")} />

            <ModernField label="Financial Status" icon={AlertCircle} isSelect value={watch("financialStatus")}>
               <Select value={watch("financialStatus")} onValueChange={(v) => setValue("financialStatus", v)}>
                 <SelectTrigger className="border-none p-0 h-full w-full shadow-none focus:ring-0 text-sm font-semibold text-slate-700 bg-transparent">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  <SelectItem value="Paid" className="text-xs font-medium">Paid</SelectItem>
                  <SelectItem value="Outstanding" className="text-xs font-medium">Outstanding</SelectItem>
                </SelectContent>
              </Select>
            </ModernField>
          </div>
        </section>

        {/* Section 4: Description */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Description</h3>
            <div className="h-px flex-1 bg-slate-100" />
            <Info className="h-4 w-4 text-slate-400" />
          </div>

          <Tabs defaultValue="english" className="w-full">
            <div className="flex justify-end mb-4">
              <TabsList className="bg-slate-50 border border-slate-100 h-8 p-1 gap-1">
                <TabsTrigger value="english" className="text-[10px] font-bold h-6 px-4">English</TabsTrigger>
                <TabsTrigger value="arabic" className="text-[10px] font-bold h-6 px-4">Arabic</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="english" className="space-y-6 mt-0">
               <ModernField label="Listing Title" required icon={FileText} {...register("title")} error={fieldError("title")} value={watch("title")} />
               <div className="relative group">
                 <Textarea 
                    {...register("description")} 
                    className="min-h-[220px] rounded-2xl border-slate-200 border-2 bg-white focus:border-primary focus:ring-primary focus:ring-opacity-5 transition-all p-5 text-sm font-medium text-slate-700 placeholder:text-slate-300 shadow-sm"
                    placeholder="Describe your property..."
                  />
                  <div className="absolute top-2 left-4 px-1 bg-white text-[10px] font-bold text-slate-400 -translate-y-[14px]">
                    English Description <span className="text-destructive ml-0.5">*</span>
                  </div>
               </div>
            </TabsContent>
            
            <TabsContent value="arabic" className="mt-0">
               <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400 font-bold text-sm">
                  Arabic Content Form Integration...
               </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Section 5: Amenities */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Select Amenities</h3>
            <div className="h-px flex-1 bg-slate-100" />
            <Info className="h-4 w-4 text-slate-400" />
          </div>

          <div className="rounded-2xl border-2 border-slate-100 p-6 flex flex-col items-center justify-center gap-4 bg-slate-50/50">
             <div className="text-slate-400 font-bold text-xs uppercase tracking-widest">No amenities selected yet</div>
             <Button variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary/5 font-bold text-xs px-6 py-5 gap-2 group">
                <PlusCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Update Amenities
             </Button>
          </div>
        </section>
      </div>

      {/* RIGHT SIDEBAR */}
      <aside className="space-y-6">
        {/* Draft Property Card */}
        <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/80 border-b border-separate py-3 px-4">
            <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Draft Property</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-400 font-bold">Last updated</Label>
              <div className="bg-slate-50 h-8 rounded-lg border border-slate-100" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-400 font-bold">Creation Date</Label>
              <div className="bg-slate-50 h-8 rounded-lg border border-slate-100" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-400 font-bold">Created By</Label>
              <div className="bg-slate-50 h-8 rounded-lg border border-slate-100" />
            </div>
          </CardContent>
        </Card>

        {/* Management Card */}
        <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/80 border-b border-separate py-3 px-4">
            <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Management</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-5">
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-400 font-bold uppercase ml-1">Reference</Label>
              <div className="bg-slate-50 h-9 rounded-xl border border-slate-100 flex items-center px-4 font-bold text-slate-400 text-xs">-</div>
            </div>

            <ModernField label="Listing Agent" icon={User} required isSelect value={watch("listingAgent")} error={fieldError("listingAgent")}>
              <Select value={watch("listingAgent")} onValueChange={(v) => setValue("listingAgent", v)}>
                <SelectTrigger className="border-none p-0 h-full w-full shadow-none focus:ring-0 text-xs font-semibold text-slate-700 bg-transparent">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  {filterOptions.agents.map((a) => <SelectItem key={a} value={a} className="text-xs font-medium">{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </ModernField>

            <ModernField label="Listing Owner" icon={User} required isSelect value={watch("listingOwner")} error={fieldError("listingOwner")}>
              <Select value={watch("listingOwner")} onValueChange={(v) => setValue("listingOwner", v)}>
                <SelectTrigger className="border-none p-0 h-full w-full shadow-none focus:ring-0 text-xs font-semibold text-slate-700 bg-transparent">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  {filterOptions.agents.map((a) => <SelectItem key={a} value={a} className="text-xs font-medium">{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </ModernField>

            <div>
              <ModernField label="Select Landlord" icon={User} required isSelect value={watch("landlord")} error={fieldError("landlord")}>
                <Select value={watch("landlord")} onValueChange={(v) => setValue("landlord", v)}>
                  <SelectTrigger className="border-none p-0 h-full w-full shadow-none focus:ring-0 text-xs font-semibold text-slate-700 bg-transparent">
                    <SelectValue placeholder="Select Landlord" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="John Miller" className="text-xs font-medium">John Miller</SelectItem>
                  </SelectContent>
                </Select>
              </ModernField>
              <Button type="button" variant="outline" className="w-full mt-2 h-9 border-primary text-primary hover:bg-primary/5 rounded-xl text-[11px] font-bold gap-1.5 shadow-sm">
                <PlusCircle className="h-3.5 w-3.5" /> Add New
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Availability Card */}
        <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/80 border-b border-separate py-3 px-4">
            <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Availability</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {["Available", "Under Offer", "Reserved", "Rented", "Sold"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setValue("availabilityStatus", status)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border",
                    availabilityStatus === status 
                      ? "bg-primary text-white border-primary shadow-sm" 
                      : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>

            <ModernField label="Available From" icon={Calendar} {...register("availableFrom")} value={watch("availableFrom")} />
          </CardContent>
        </Card>

        {/* Property Permit Card */}
        <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/80 border-b border-separate py-3 px-4">
            <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Property Permit</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <Label className="text-[10px] font-bold text-slate-500 uppercase ml-1 block mb-2">Select your license type</Label>
            <div className="flex bg-slate-50 p-1 rounded-xl gap-1 mb-4 border border-slate-100">
              {["Rera", "DTCM"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setValue("licenseType", type)}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                    licenseType === type ? "bg-primary text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>

            <ModernField label="RERA Permit Number" icon={FileText} {...register("permitNumber")} value={watch("permitNumber")} />
            <ModernField label="RERA Permit Issue Date" icon={Calendar} {...register("permitIssueDate")} value={watch("permitIssueDate")} />
            <ModernField label="RERA Permit Expiration Date" icon={Calendar} {...register("permitExpiryDate")} value={watch("permitExpiryDate")} />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}


