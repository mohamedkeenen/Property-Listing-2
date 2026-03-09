import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { filterOptions } from "@/data/mockData";
import { MapPin, Building2, Globe } from "lucide-react";
import { ModernField } from "@/components/ui/modern-field";
import { ModernSearchSelect } from "@/components/ui/modern-search-select";

interface Props {
  form: UseFormReturn<any>;
}

export function LocationStep({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form;

  const currentCity = watch("city");
  const currentCommunity = watch("community");
  const currentBayutCity = watch("bayutCity");
  const currentBayutCommunity = watch("bayutCommunity");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Property Finder Section */}
        <Card className="rounded-3xl border-border/50 shadow-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="bg-slate-50/50 border-b border-border/50 py-5">
            <CardTitle className="text-sm font-bold flex items-center gap-2.5 text-slate-700">
              <div className="p-1.5 rounded-lg bg-red-100/50">
                <MapPin className="h-4 w-4 text-red-500" />
              </div>
              Property Finder Location
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <ModernSearchSelect 
              label="City" 
              value={currentCity}
              onChange={(v) => setValue("city", v)}
              options={filterOptions.cities}
              icon={Globe}
              required
              error={errors.city?.message as string}
            />
            
            <ModernSearchSelect 
              label="Community" 
              value={currentCommunity}
              onChange={(v) => setValue("community", v)}
              options={filterOptions.communities}
              icon={MapPin}
              required
              error={errors.community?.message as string}
            />

            <ModernField 
              label="Sub Community" 
              {...register("subCommunity")}
              icon={MapPin}
              value={watch("subCommunity")}
            />

            <ModernField 
              label="Building / Tower" 
              {...register("building")}
              icon={Building2}
              value={watch("building")}
            />
          </CardContent>
        </Card>

        {/* Bayut Section */}
        <Card className="rounded-3xl border-border/50 shadow-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="bg-slate-50/50 border-b border-border/50 py-5">
            <CardTitle className="text-sm font-bold flex items-center gap-2.5 text-slate-700">
              <div className="p-1.5 rounded-lg bg-orange-100/50">
                <MapPin className="h-4 w-4 text-orange-500" />
              </div>
              Bayut & Dubizzle Location
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <ModernSearchSelect 
              label="City" 
              value={currentBayutCity}
              onChange={(v) => setValue("bayutCity", v)}
              options={filterOptions.cities}
              icon={Globe}
              error={errors.bayutCity?.message as string}
            />
            
            <ModernSearchSelect 
              label="Community" 
              value={currentBayutCommunity}
              onChange={(v) => setValue("bayutCommunity", v)}
              options={filterOptions.communities}
              icon={MapPin}
              error={errors.bayutCommunity?.message as string}
            />

            <ModernField 
              label="Sub Community" 
              {...register("bayutSubCommunity")}
              icon={MapPin}
              value={watch("bayutSubCommunity")}
            />

            <ModernField 
              label="Building / Tower" 
              {...register("bayutBuilding")}
              icon={Building2}
              value={watch("bayutBuilding")}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
