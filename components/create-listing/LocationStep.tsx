import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { filterOptions } from "@/data/mockData";
import { MapPin, Navigation, Building2, Globe } from "lucide-react";
import { ModernSelect } from "@/components/ui/modern-select";
import { ModernField } from "@/components/ui/modern-field";
import { PropQALocationSelect } from "./PropQALocationSelect";
import { PFLocationSelect } from "./PFLocationSelect";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Rocket } from "lucide-react";

interface Props {
  form: UseFormReturn<any>;
}

export function LocationStep({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form;

  const currentBayutCity = watch("bayutCity");
  const currentBayutCommunity = watch("bayutCommunity");

  const fieldError = (name: string) => errors[name]?.message as string | undefined;

  const portals = watch("portals") || {};
  const showPF = portals.propertyFinder;
  const showBayut = portals.bayutEnabled;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
            <PFLocationSelect 
              label="Search PF Location" 
              value={watch("pfLocation")}
              initialLabel={watch("property_location")}
              onValueChange={(loc) => {
                setValue("pfLocation", loc.id, { shouldValidate: true });
                setValue("locationId", loc.id, { shouldValidate: true });
                setValue("property_location", loc.name, { shouldValidate: true });
                
                if (loc.coordinates) {
                  setValue("latitude", loc.coordinates.lat);
                  setValue("longitude", loc.coordinates.lng);
                }

                // Clear existing
                setValue("city", "");
                setValue("community", "");
                setValue("subCommunity", "");
                setValue("building", "");

                // Map PF Path Hierarchy (e.g. "Dubai > Dubai Marina > ...")
                if (loc.path) {
                   const parts = loc.path.split(">").map((s: string) => s.trim());
                   if (parts.length > 0) setValue("uaeEmirate", parts[0].toLowerCase());
                   if (parts.length > 1) setValue("city", parts[1]);
                   if (parts.length > 2) setValue("community", parts[2]);
                   if (parts.length > 3) setValue("subCommunity", parts[3]);
                   if (parts.length > 4) setValue("building", parts[4]);
                }
              }}
              error={fieldError("pfLocation")}
            />

            <div className="space-y-4 pt-4 border-t border-border/40">
              <ModernSelect 
                label="Emirate" 
                value={watch("uaeEmirate")}
                onValueChange={(v) => setValue("uaeEmirate", v, { shouldValidate: true })}
                options={[
                  { label: "Dubai", value: "dubai" },
                  { label: "Abu Dhabi", value: "abu-dhabi" },
                  { label: "Northern Emirates", value: "northern-emirates" },
                ]}
                icon={Globe}
              />
              
                <ModernSelect 
                  label="City" 
                  value={watch("city")}
                  onValueChange={(v) => setValue("city", v, { shouldValidate: true })}
                  options={watch("city") ? [watch("city"), ...filterOptions.cities] : filterOptions.cities}
                  icon={Globe}
                  error={fieldError("city")}
                />
                <ModernSelect 
                  label="Community" 
                  value={watch("community")}
                  onValueChange={(v) => setValue("community", v, { shouldValidate: true })}
                  options={watch("community") ? [watch("community"), ...filterOptions.communities] : filterOptions.communities}
                  icon={Navigation}
                  error={fieldError("community")}
                />
                <ModernSelect 
                  label="Sub Community" 
                  value={watch("subCommunity")}
                  onValueChange={(v) => setValue("subCommunity", v, { shouldValidate: true })}
                  options={watch("subCommunity") ? [watch("subCommunity"), ...filterOptions.subCommunities] : filterOptions.subCommunities}
                  icon={MapPin}
                  error={fieldError("subCommunity")}
                />
                <ModernSelect 
                  label="Building / Tower" 
                  value={watch("building")}
                  onValueChange={(v) => setValue("building", v, { shouldValidate: true })}
                  options={watch("building") ? [watch("building"), ...filterOptions.buildings] : filterOptions.buildings}
                  icon={Building2}
                  error={fieldError("building")}
                />
                <ModernField label="Lat" value={watch("latitude")} readOnly />
                <ModernField label="Lng" value={watch("longitude")} readOnly />
              
              <div className="relative aspect-video rounded-[1.5rem] border border-border/60 bg-muted/30 overflow-hidden mt-4">
                {watch("latitude") && watch("longitude") ? (
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${watch("latitude")},${watch("longitude")}&z=15&output=embed`}
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <Globe className="h-6 w-6 text-red-500/20 animate-pulse mb-2" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
                      Map Preview
                    </p>
                  </div>
                )}
              </div>
            </div>
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

        {/* PropQA Section */}
        <Card className="rounded-[2.5rem] border shadow-2xl overflow-hidden backdrop-blur-sm transition-all duration-500 bg-background/50 border-orange-500/20 ring-1 ring-orange-500/5">
          <CardHeader className="bg-orange-500/5 border-b border-border py-6 px-8 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black flex items-center gap-3 text-foreground uppercase tracking-widest">
              <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-500">
                <Rocket className="h-5 w-5" />
              </div>
              PropQA Location
            </CardTitle>
            <Switch 
              id="propqa-enable" 
              checked={!!watch("portals.propqaEnabled")} 
              onCheckedChange={(v) => setValue("portals.propqaEnabled", v, { shouldValidate: true })} 
            />
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <PropQALocationSelect 
              label="Search PropQA Location" 
              value={watch("propqaLocationId")}
              initialLabel={watch("propqaLocationName")}
              onValueChange={(loc) => {
                setValue("propqaLocationId", loc.id, { shouldValidate: true });
                setValue("propqaLocationName", loc.name, { shouldValidate: true });
                setValue("locationId", loc.id, { shouldValidate: true });
                
                if (loc.coordinates) {
                  setValue("propqa_lat", loc.coordinates.lat);
                  setValue("propqa_lng", loc.coordinates.lng);
                }

                setValue("propqa_emirate", "");
                setValue("propqa_city", "");
                setValue("propqa_community", "");
                setValue("propqa_sub_community", "");
                setValue("propqa_tower", "");

                if (loc.tree && Array.isArray(loc.tree)) {
                  loc.tree.forEach((node: any) => {
                    const type = node.type?.toLowerCase();
                    const name = node.name;
                    if (type === 'emirate') setValue("propqa_emirate", name);
                    if (type === 'city') setValue("propqa_city", name);
                    if (type === 'community') setValue("propqa_community", name);
                    if (type === 'sub-community') setValue("propqa_sub_community", name);
                    if (type === 'building' || type === 'tower') setValue("propqa_tower", name);
                  });
                }
              }}
              error={fieldError("propqaLocationId")}
            />

            <div className="space-y-4 pt-4 border-t border-border/40">
              <ModernField label="Emirate" value={watch("propqa_emirate")} readOnly icon={Globe} />
              <ModernField label="City" value={watch("propqa_city")} readOnly icon={Globe} />
              <ModernField label="Community" value={watch("propqa_community")} readOnly icon={Navigation} />
              <ModernField label="Sub Community" value={watch("propqa_sub_community")} readOnly icon={MapPin} />
              <ModernField label="Building / Tower" value={watch("propqa_tower")} readOnly icon={Building2} />
              <ModernField label="Lat" value={watch("propqa_lat")} readOnly />
              <ModernField label="Lng" value={watch("propqa_lng")} readOnly />
              
              <div className="relative aspect-video rounded-3xl border border-border/60 bg-muted/30 overflow-hidden mt-4">
                {watch("propqa_lat") && watch("propqa_lng") ? (
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${watch("propqa_lat")},${watch("propqa_lng")}&z=15&output=embed`}
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <Globe className="h-6 w-6 text-orange-500/20 animate-pulse mb-2" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
                      Map Preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
