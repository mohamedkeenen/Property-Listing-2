import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Rocket, FileText, Lock, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useCreatePropertyMutation, useUpdatePropertyMutation } from "@/api/redux/services/propertyApi";
import { Loader2 } from "lucide-react";

interface Props {
  form: UseFormReturn<any>;
}

const publishOptions = [
  { value: "publish", label: "Publish Immediately", desc: "Push listing to all selected portals right now", icon: Rocket },
  { value: "draft", label: "Save as Draft", desc: "Keep it in your inventory for later editing", icon: FileText },
  { value: "approval", label: "Send for Approval", desc: "Notify admin to review compliance details", icon: Users },
  { value: "pocket", label: "Private Listing", desc: "Only visible to your internal network", icon: Lock },
];

export function CompletedStep({ form }: Props) {
  const { watch, setValue } = form;
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");
  const isEdit = !!propertyId;
  const { toast } = useToast();
  const publishStatus = watch("publishStatus") || "publish";

  const [createProperty, { isLoading: isCreating }] = useCreatePropertyMutation();
  const [updateProperty, { isLoading: isUpdating }] = useUpdatePropertyMutation();
  const isLoading = isCreating || isUpdating;

  const handleFinalSubmit = async () => {
    const values = form.getValues();
    
    // Convert form values to API format
    const payload = {
      category: values.category.toLowerCase(),
      purpose: values.purpose.toLowerCase(),
      property_type: values.type,
      unit_number: values.unitNo,
      size: values.size,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      parking: values.parking,
      project_id: values.projectName ? parseInt(values.projectName) : null,
      developer_id: values.developers ? parseInt(values.developers) : null,
      agent_id: values.listingAgent ? parseInt(values.listingAgent) : null,
      owner_id: values.listingOwner ? parseInt(values.listingOwner) : null,
      title_en: values.title,
      title_ar: values.titleAr || values.title,
      description_en: values.description || "",
      description_ar: values.descriptionAr || values.description || "",
      sale_price: values.purpose === "Sale" ? values.price : null,
      rent_price: values.purpose === "Rent" ? values.price : null,
      rent_frequency: values.purpose === "Rent" ? values.pricePeriod : null,
      amenities: values.amenities,
      images: values.images,
      status: publishStatus === "publish" ? "Live" : (publishStatus === "pocket" ? "Pocket" : "Draft"),
      // Location fields
      property_location: values.property_location, // Added this field in form if it exists, or just send it if it's there
      bayut_location: values.bayutLocation,
      bayut_city: values.bayutCity,
      bayut_community: values.bayutCommunity,
      bayut_sub_community: values.bayutSubCommunity,
      bayut_tower: values.bayutBuilding,
      permit_number: values.permitNumber || null,
      city: values.city,
      community: values.community,
      sub_community: values.subCommunity,
      tower: values.building,
      // Portal flags
      is_on_pf: values.portals?.propertyFinder || false,
      is_on_bayut: values.portals?.bayutEnabled || false,
      is_on_website: values.portals?.officeWebsite || false,
      is_on_dubizzle: values.portals?.dubizzleSelection || false,
      // Notes & Docs
      notes: values.notes,
      documents: values.documents,
    };

    try {
      if (isEdit && propertyId) {
        await updateProperty({ id: propertyId, data: payload }).unwrap();
      } else {
        await createProperty(payload).unwrap();
      }
      
      toast({
        title: "Success! 🎉",
        description: isEdit ? "Property listing updated successfully." : "Your property has been listed successfully.",
      });
      
      if (!isEdit) localStorage.removeItem("property-listing-draft");
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.data?.message || "There was an error creating your listing. Please check the details and try again.",
        variant: "destructive",
      });
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-700 pb-20">
      <div className="text-center space-y-4">
        <div className="relative inline-flex">
           <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
           <div className="relative h-24 w-24 rounded-4xl bg-linear-to-tr from-primary to-indigo-600 flex items-center justify-center shadow-2xl shadow-primary/40">
              <CheckCircle2 className="h-12 w-12 text-white" />
           </div>
        </div>
        <div>
           <h2 className="text-3xl font-black text-foreground tracking-tight">Listing Completed!</h2>
           <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px] mt-2">All verification steps are successfully finished</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {publishOptions.map((opt) => {
          const isSelected = publishStatus === opt.value;
          return (
            <Card 
              key={opt.value}
              className={cn(
                "relative overflow-hidden cursor-pointer transition-all duration-500 border border-border/40",
                isSelected 
                  ? "bg-card shadow-2xl shadow-primary/10 border-primary/20 ring-1 ring-primary/10 scale-[1.02]" 
                  : "bg-muted/10 opacity-70 hover:opacity-100 hover:bg-muted/20"
              )}
              onClick={() => setValue("publishStatus", opt.value)}
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                    isSelected ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground"
                  )}>
                    <opt.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className={cn(
                      "text-sm font-black tracking-tight transition-colors",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}>{opt.label}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{opt.desc}</p>
                  </div>
                </div>
              </CardContent>
              {isSelected && (
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary animate-pulse" />
              )}
            </Card>
          );
        })}
      </div>

      <div className="pt-8 flex flex-col items-center gap-6">
         <Button 
           onClick={handleFinalSubmit}
           disabled={isLoading}
           className="h-16 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] px-16 shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:-translate-y-1 transition-all bg-primary gap-4"
         >
           {isLoading ? (
             <>
               <Loader2 className="h-4 w-4 animate-spin" />
               Processing...
             </>
           ) : (
             <>
               Finalize & Publish Listing
               <ArrowRight className="h-4 w-4" />
             </>
           )}
         </Button>
         <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center max-w-sm leading-loose">
           By clicking publish, your listing will be immediately broadcast to the selected distribution channels.
         </p>
      </div>
    </div>
  );
}
