import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { filterOptions } from "@/data/mockData";
import { MapPin, Building2, Globe, Navigation } from "lucide-react";
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

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Property Finder Section */}
        <Card className="rounded-[2.5rem] border-border shadow-2xl overflow-hidden bg-background/50 backdrop-blur-sm">
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
              label="City" 
              value={currentCity}
              onValueChange={(v) => setValue("city", v, { shouldValidate: true })}
              options={filterOptions.cities}
              icon={Globe}
              required
              error={fieldError("city")}
            />
            
            <ModernSelect 
              label="Community" 
              value={currentCommunity}
              onValueChange={(v) => setValue("community", v, { shouldValidate: true })}
              options={filterOptions.communities}
              icon={Navigation}
              required
              error={fieldError("community")}
            />

            <ModernField 
              label="Sub Community" 
              {...register("subCommunity")}
              icon={MapPin}
              value={watch("subCommunity")}
              onClear={() => setValue("subCommunity", "", { shouldValidate: true })}
            />

            <ModernField 
              label="Building / Tower" 
              {...register("building")}
              icon={Building2}
              value={watch("building")}
              onClear={() => setValue("building", "", { shouldValidate: true })}
            />
          </CardContent>
        </Card>

        {/* Bayut Section */}
        <Card className="rounded-[2.5rem] border-border shadow-2xl overflow-hidden bg-background/50 backdrop-blur-sm">
          <CardHeader className="bg-orange-500/5 border-b border-border py-6 px-8">
            <CardTitle className="text-sm font-black flex items-center gap-3 text-foreground uppercase tracking-widest">
              <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-500">
                <MapPin className="h-5 w-5" />
              </div>
              Bayut & Dubizzle Location
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
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
              options={filterOptions.communities}
              icon={Navigation}
              error={fieldError("bayutCommunity")}
            />

            <ModernField 
              label="Sub Community" 
              {...register("bayutSubCommunity")}
              icon={MapPin}
              value={watch("bayutSubCommunity")}
              onClear={() => setValue("bayutSubCommunity", "", { shouldValidate: true })}
            />

            <ModernField 
              label="Building / Tower" 
              {...register("bayutBuilding")}
              icon={Building2}
              value={watch("bayutBuilding")}
              onClear={() => setValue("bayutBuilding", "", { shouldValidate: true })}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
