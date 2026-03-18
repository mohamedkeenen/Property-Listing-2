import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { filterOptions } from "@/data/mockData";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Building2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModernField } from "@/components/ui/modern-field";
import { ModernSelect } from "@/components/ui/modern-select";

interface Props {
  form: UseFormReturn<any>;
}

export function LocationStep({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form;

  const currentCity = watch("city");
  const currentCommunity = watch("community");
  const currentBayutCity = watch("bayutCity");
  const currentBayutCommunity = watch("bayutCommunity");

  const fieldError = (name: string) => errors[name]?.message as string | undefined;

  const portals = watch("portals") || {};
  const showPF = portals.propertyFinder;
  const showBayut = portals.bayutEnabled;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Property Finder Section */}
        <Card className="rounded-[2.5rem] border shadow-2xl overflow-hidden backdrop-blur-sm transition-all duration-500 bg-background/50 border-primary/20 ring-1 ring-primary/5">
          <CardHeader className="bg-red-500/5 border-b border-border py-6 px-8">
            <CardTitle className="text-sm font-black flex items-center gap-3 text-foreground uppercase tracking-widest">
              <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500">
                <MapPin className="h-5 w-5" />
              </div>
              Property Finder Location
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <ModernSelect 
              label="Property Finder Location" 
              value={watch("pfLocation")}
              onValueChange={(v) => {
                setValue("pfLocation", v, { shouldValidate: true });
                setValue("property_location", v, { shouldValidate: true });
              }}
              options={filterOptions.pfLocations}
              icon={MapPin}
              error={fieldError("pfLocation")}
            />

            <ModernSelect 
              label="City" 
              value={currentCity}
              onValueChange={(v) => setValue("city", v, { shouldValidate: true })}
              options={filterOptions.cities}
              icon={Globe}
              error={fieldError("city")}
            />
            
            <ModernSelect 
              label="Community" 
              value={currentCommunity}
              onValueChange={(v) => setValue("community", v, { shouldValidate: true })}
              options={filterOptions.communities}
              icon={Navigation}
              error={fieldError("community")}
            />

            <ModernSelect 
              label="Sub Community" 
              value={watch("subCommunity")}
              onValueChange={(v) => setValue("subCommunity", v, { shouldValidate: true })}
              options={filterOptions.subCommunities}
              icon={MapPin}
              error={fieldError("subCommunity")}
            />

            <ModernSelect 
              label="Building / Tower" 
              value={watch("building")}
              onValueChange={(v) => setValue("building", v, { shouldValidate: true })}
              options={filterOptions.buildings}
              icon={Building2}
              error={fieldError("building")}
            />
          </CardContent>
        </Card>

        {/* Bayut Section */}
        <Card className="rounded-[2.5rem] border shadow-2xl overflow-hidden backdrop-blur-sm transition-all duration-500 bg-background/50 border-emerald-500/20 ring-1 ring-emerald-500/5">
          <CardHeader className="bg-emerald-500/5 border-b border-border py-6 px-8">
            <CardTitle className="text-sm font-black flex items-center gap-3 text-foreground uppercase tracking-widest">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500">
                <MapPin className="h-5 w-5" />
              </div>
              Bayut & Dubizzle Location
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <ModernSelect 
              label="Bayut & Dubizzle Location" 
              value={watch("bayutLocation")}
              onValueChange={(v) => setValue("bayutLocation", v, { shouldValidate: true })}
              options={filterOptions.bayutLocations}
              icon={MapPin}
              error={fieldError("bayutLocation")}
            />

            <ModernSelect 
              label="City" 
              value={currentBayutCity}
              onValueChange={(v) => setValue("bayutCity", v, { shouldValidate: true })}
              options={filterOptions.cities}
              icon={Globe}
              error={fieldError("bayutCity")}
            />
            
            <ModernSelect 
              label="Community" 
              value={currentBayutCommunity}
              onValueChange={(v) => setValue("bayutCommunity", v, { shouldValidate: true })}
              options={filterOptions.bayutCommunities}
              icon={Navigation}
              error={fieldError("bayutCommunity")}
            />
            
            <ModernSelect 
              label="Sub Community" 
              value={watch("bayutSubCommunity")}
              onValueChange={(v) => setValue("bayutSubCommunity", v, { shouldValidate: true })}
              options={filterOptions.bayutSubCommunities}
              icon={MapPin}
              error={fieldError("bayutSubCommunity")}
            />

            <ModernSelect 
              label="Building / Tower" 
              value={watch("bayutBuilding")}
              onValueChange={(v) => setValue("bayutBuilding", v, { shouldValidate: true })}
              options={filterOptions.bayutBuildings}
              icon={Building2}
              error={fieldError("bayutBuilding")}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
