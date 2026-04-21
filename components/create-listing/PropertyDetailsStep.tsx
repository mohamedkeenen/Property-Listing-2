"use client";

import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { filterOptions } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  Home, Building2, BedDouble, Bath, Car, Maximize, Tag, DollarSign, FileText, Sparkles,
  Calendar, User, Hash, CalendarCheck, Info, CheckCircle2, AlertCircle, Paintbrush, PlusCircle, Shield, Compass
} from "lucide-react";
import { ModernField } from "@/components/ui/modern-field";
import { ModernSelect } from "@/components/ui/modern-select";
import { NumberSearchSelect } from "@/components/ui/number-search-select";
import { CreditCard as CreditCardIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useGetUsersQuery } from "@/api/redux/services/userApi";

interface Props {
  form: UseFormReturn<any>;
}

export function PropertyDetailsStep({ form }: Props) {
  const { register, setValue, watch, formState: { errors } } = form;
  const category = watch("category");
  const purpose = watch("purpose");
  const pricePeriod = watch("pricePeriod");

  const AMENITIES_LIST = filterOptions.amenities;
  const { data: usersData } = useGetUsersQuery();

  const adminOptions = useMemo(() => 
    usersData?.data
      ?.filter((u: any) => u.role === 'admin' && u.is_active)
      ?.map((u: any) => ({ label: u.name, value: u.id.toString() })) || [], 
  [usersData]);

  const agentOptions = useMemo(() => 
    usersData?.data
      ?.filter((u: any) => (u.role === 'agent' || u.role === 'admin') && u.is_active) // Agents are focus, but admins can be agents too
      ?.map((u: any) => ({ label: u.name, value: u.id.toString() })) || [], 
  [usersData]);

  const fieldError = (name: string) => errors[name]?.message as string | undefined;

  return (
    <div>
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
          
          <div className="bg-card/30 p-8 rounded-4xl border border-border/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Residential Card */}
              <div 
                onClick={() => setValue("category", "Residential", { shouldValidate: true })}
                className={cn(
                  "group relative overflow-hidden rounded-4xl border-2 p-8 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1",
                  category === "Residential" 
                    ? "border-primary bg-primary/10 shadow-2xl shadow-primary/10" 
                    : "border-border/40 bg-card/40 hover:border-primary/20"
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
                    <Tag className="h-3.5 w-3.5" /> For Sale
                  </button>
                </div>
              </div>

              <div 
                onClick={() => setValue("category", "Commercial", { shouldValidate: true })}
                className={cn(
                  "group relative overflow-hidden rounded-4xl border-2 p-8 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1",
                  category === "Commercial" 
                    ? "border-orange-500 bg-orange-500/10 shadow-2xl shadow-orange-500/10" 
                    : "border-border/40 bg-card/40 hover:border-orange-500/20"
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
                        category === "Commercial" ? "text-orange-500 dark:text-orange-400" : "text-muted-foreground"
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
                
                <div className="flex bg-muted p-1.5 rounded-2xl gap-1.5 backdrop-blur-sm border border-border">
                  <button
                    type="button"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setValue("category", "Commercial", { shouldValidate: true }); 
                      setValue("purpose", "Rent", { shouldValidate: true }); 
                    }}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2",
                      (category === "Commercial" && purpose === "Rent") 
                        ? "bg-background text-orange-600 shadow-sm ring-1 ring-border" 
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
                      "flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2",
                      (category === "Commercial" && purpose === "Sale") 
                        ? "bg-background text-orange-600 shadow-sm ring-1 ring-border" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Tag className="h-3.5 w-3.5" /> For Sale
                  </button>
                </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 bg-card/30 p-8 rounded-4xl border border-border/20">
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

            <ModernField 
              label="Size (Total) Sq.Ft" 
              icon={Maximize} 
              required 
              type="number" 
              {...register("size")} 
              error={fieldError("size")} 
              value={watch("size")} 
            />

            <ModernField 
              label="Built Up Area Sq.Ft" 
              icon={Maximize} 
              type="number" 
              {...register("builtUpArea")} 
              value={watch("builtUpArea")} 
            />

            <ModernField label="Unit No" icon={Hash} required {...register("unitNo")} error={fieldError("unitNo")} value={watch("unitNo")} />
            <ModernField label="Land Number" icon={Hash} {...register("landNumber")} value={watch("landNumber")} />
            
            <ModernSelect 
              label="Street Direction" 
              icon={Compass} 
              value={watch("streetDirection")} 
              onValueChange={(v) => setValue("streetDirection", v, { shouldValidate: true })}
              options={filterOptions.streetDirections}
            />

            <ModernField 
              label="Street Width" 
              icon={Maximize} 
              type="number" 
              {...register("streetWidth")} 
              value={watch("streetWidth")} 
            />

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

            <ModernField label="Location ID (PF)" icon={Hash} type="number" {...register("locationId")} value={watch("locationId")} />

            <ModernField label="No of parking spaces" icon={Car} type="number" {...register("parking")} value={watch("parking")} />

            <ModernSelect 
              label="Furnishing" 
              icon={Sparkles} 
              value={watch("furnishingType")} 
              onValueChange={(v) => setValue("furnishingType", v, { shouldValidate: true })}
              options={[
                { label: "Unfurnished", value: "unfurnished" },
                { 
                  label: "Semi-furnished", 
                  value: "partly-furnished",
                  badge: "Bayut: No"
                },
                { label: "Furnished", value: "furnished" }
              ]}
            />

            <ModernSelect 
              label="Project Status" 
              icon={Building2} 
              value={watch("projectStatus")} 
              onValueChange={(v) => setValue("projectStatus", v, { shouldValidate: true })}
              options={[
                { label: "Completed", value: "completed" },
                { label: "Off-plan", value: "off-plan" },
                { label: "Under Construction", value: "under-construction" }
              ]}
            />

            <ModernField label="Floor Number" icon={Hash} type="number" {...register("floorNumber")} value={watch("floorNumber")} />
            <ModernField label="Total Floors" icon={Hash} type="number" {...register("numberOfFloors")} value={watch("numberOfFloors")} />
            <ModernField label="Property Age" icon={Calendar} type="number" {...register("age")} value={watch("age")} />
            <ModernField label="Minimal Rental Period" icon={CalendarCheck} type="number" {...register("minimalRentalPeriod")} value={watch("minimalRentalPeriod")} />

            <ModernField label="Total Land Area" icon={Maximize} type="number" {...register("landArea")} value={watch("landArea")} />
            <ModernField label="Layout Type" icon={Sparkles} {...register("layoutType")} value={watch("layoutType")} />

            <ModernField 
              label="Permit Number" 
              icon={Hash} 
              {...register("permitNumber")} 
              value={watch("permitNumber")}
              onClear={() => setValue("permitNumber", "", { shouldValidate: true })}
            />

            <ModernField 
              label="Project Name" 
              icon={Building2} 
              {...register("projectName")} 
              value={watch("projectName")}
              onClear={() => setValue("projectName", "", { shouldValidate: true })}
            />
            
            <ModernSelect 
              label="Ownership" 
              icon={User} 
              value={watch("ownership")} 
              onValueChange={(v) => setValue("ownership", v, { shouldValidate: true })}
              options={["Freehold", "Leasehold"]}
            />

            <ModernField 
              label="Developers" 
              icon={Building2} 
              {...register("developers")} 
              value={watch("developers")}
              onClear={() => setValue("developers", "", { shouldValidate: true })}
            />

            <ModernSelect 
              label="Build Year" 
              icon={Calendar} 
              value={watch("buildYear")?.toString()} 
              onValueChange={(v) => setValue("buildYear", v, { shouldValidate: true })}
              options={Array.from({ length: new Date().getFullYear() - 1950 + 10 }, (_, i) => {
                const year = (new Date().getFullYear() + 9 - i).toString();
                return { label: year, value: year };
              })}
            />

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
            
            <ModernSelect 
              label="Listing Owner" 
              icon={Shield} 
              required
              value={watch("listingOwner")} 
              onValueChange={(v) => setValue("listingOwner", v, { shouldValidate: true })}
              options={adminOptions}
              error={fieldError("listingOwner")}
            />

            <ModernSelect 
              label="Listing Agent" 
              icon={User} 
              required
              value={watch("listingAgent")} 
              onValueChange={(v) => setValue("listingAgent", v, { shouldValidate: true })}
              options={agentOptions}
              error={fieldError("listingAgent")}
            />
          </div>
        </section>

        {/* Section: Facilities & Compliance */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <Sparkles className="h-4 w-4" />
             </div>
             <h3 className="text-sm font-bold text-foreground">Facilities & Compliance</h3>
             <div className="h-px flex-1 bg-border/20" />
             <CheckCircle2 className="h-4 w-4 text-muted-foreground/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-card/30 p-8 rounded-4xl border border-border/20">
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border/40">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <Label className="text-xs font-bold">Has Garden</Label>
                  <p className="text-[10px] text-muted-foreground">Private or community garden</p>
                </div>
              </div>
              <Switch checked={!!watch("hasGarden")} onCheckedChange={(v) => setValue("hasGarden", v, { shouldValidate: true })} />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border/40">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <Label className="text-xs font-bold">Has Kitchen</Label>
                  <p className="text-[10px] text-muted-foreground">Ready kitchen installation</p>
                </div>
              </div>
              <Switch checked={!!watch("hasKitchen")} onCheckedChange={(v) => setValue("hasKitchen", v, { shouldValidate: true })} />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border/40">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <Car className="h-4 w-4" />
                </div>
                <div>
                  <Label className="text-xs font-bold">Has Parking</Label>
                  <p className="text-[10px] text-muted-foreground">On-site dedicated parking</p>
                </div>
              </div>
              <Switch checked={!!watch("hasParking")} onCheckedChange={(v) => setValue("hasParking", v, { shouldValidate: true })} />
            </div>

            <ModernField label="License No" icon={Hash} {...register("licenseNo")} value={watch("licenseNo")} />
            <ModernField label="Ad Issue Date" icon={Calendar} type="date" {...register("adIssueDate")} value={watch("adIssueDate")} />
            <ModernField label="Available From" icon={CalendarCheck} type="date" {...register("availableFrom")} value={watch("availableFrom")} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 bg-card/30 p-8 rounded-4xl border border-border/20">
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 bg-card/30 p-8 rounded-4xl border border-border/20">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* English Version */}
              <div className="space-y-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">English Version</span>
                </div>
                
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
              </div>

              {/* Arabic Version */}
              <div className="space-y-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 font-arabic">ARABIC VERSION (النسخة العربية)</span>
                </div>

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
                    className="w-full min-h-[160px] bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground dark:text-white outline-none p-0 resize-none overflow-hidden placeholder:text-muted-foreground/40 leading-relaxed font-arabic"
                  />
                </ModernField>
              </div>
            </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
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
    </div>
  );
}
