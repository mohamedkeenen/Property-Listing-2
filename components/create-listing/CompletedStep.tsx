import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Rocket, FileText, Lock, Users, ArrowRight, Link as LinkIcon, Copy, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useCreatePropertyMutation, useUpdatePropertyMutation } from "@/api/redux/services/propertyApi";
import { Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";

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
  const [submittedLink, setSubmitted] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [createProperty, { isLoading: isCreating }] = useCreatePropertyMutation();
  const [updateProperty, { isLoading: isUpdating }] = useUpdatePropertyMutation();
  const isLoading = isCreating || isUpdating;

  const handleCopy = () => {
    if (submittedLink) {
        navigator.clipboard.writeText(submittedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({ title: "Copied!", description: "Bayut XML Feed URL copied to clipboard." });
    }
  };

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
      // PF specific fields
      ad_issue_date: values.adIssueDate || null,
      license_no: values.licenseNo || null,
      furnishing_type: values.furnishingType || null,
      project_status: values.projectStatus || null,
      age: values.age ? parseInt(values.age) : null,
      floor_number: values.floorNumber ? parseInt(values.floorNumber) : null,
      number_of_floors: values.numberOfFloors ? parseInt(values.numberOfFloors) : null,
      location_id: values.locationId ? parseInt(values.locationId) : null,
      has_garden: !!values.hasGarden,
      has_kitchen: !!values.hasKitchen,
      has_parking: !!values.hasParking,
      minimal_rental_period: values.minimalRentalPeriod ? parseInt(values.minimalRentalPeriod) : null,
      cheques: values.cheques ? parseInt(values.cheques) : null,
      reference: values.reference || null,
      agent_email: values.agentEmail || null,
      // Notes & Docs
      notes: values.notes,
      documents: values.documents,
    };

    try {
      let response;
      if (isEdit && propertyId) {
        response = await updateProperty({ id: propertyId, data: payload }).unwrap();
      } else {
        response = await createProperty(payload).unwrap();
      }
      
      const companyId = response?.data?.company_id || (form.getValues() as any).company_id;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const feedUrl = `${apiUrl.replace('/api', '')}/feeds/${companyId}/bayut.xml`;

      toast({
        title: "Success! 🎉",
        description: isEdit ? "Property listing updated successfully." : "Your property has been listed successfully.",
      });
      
      if (!isEdit) localStorage.removeItem("property-listing-draft");
      
      // Show success state with link
      setSubmitted(feedUrl);
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.data?.message || "There was an error creating your listing. Please check the details and try again.",
        variant: "destructive",
      });
      console.error("Submission error:", error);
    }
  };

  if (submittedLink) {
    return (
        <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <div className="text-center space-y-4">
                <div className="relative inline-flex mb-4">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-4xl rounded-full animate-pulse scale-150 rotate-45" />
                    <div className="relative h-28 w-28 rounded-4xl bg-linear-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center p-0.5 group">
                        <div className="h-full w-full bg-linear-to-tr from-emerald-500 to-cyan-400 rounded-4xl flex items-center justify-center">
                           <CheckCircle2 className="h-14 w-14 text-white group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </div>
                </div>
                <div>
                   <h2 className="text-4xl font-black text-foreground tracking-tight mb-2">Listing Synchronized!</h2>
                   <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">Your listing is now active in global distribution feeds</p>
                </div>
            </div>

            <Card className="rounded-4xl border-2 border-primary/10 overflow-hidden shadow-2xl shadow-primary/5 bg-linear-to-b from-card to-muted/20">
                <CardContent className="p-10 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 shadow-sm">
                                <LinkIcon className="h-4 w-4" />
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground/80">Bayut XML Feed Link</h3>
                        </div>
                        
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-linear-to-r from-orange-500/20 to-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                            <div className="relative flex items-center bg-muted/30 border border-border/40 rounded-2xl overflow-hidden backdrop-blur-md">
                                <div className="p-4 bg-muted/50 border-r border-border/40 text-[10px] font-black uppercase text-muted-foreground tracking-widest bg-linear-to-b from-muted/50 to-muted/20">
                                    Official
                                </div>
                                <div className="flex-1 px-5 py-4 min-w-0 overflow-x-auto no-scrollbar font-mono text-[11px] text-muted-foreground/80 whitespace-nowrap">
                                    {submittedLink}
                                </div>
                                <div className="p-2 flex gap-1 pr-3">
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-10 w-10 rounded-xl bg-background hover:bg-muted/50 transition-all shadow-sm border-border/20 group"
                                        onClick={handleCopy}
                                    >
                                        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-10 w-10 rounded-xl bg-background hover:bg-muted/50 transition-all shadow-sm border-border/20"
                                        asChild
                                    >
                                        <a href={submittedLink} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground/60 font-medium px-1 leading-relaxed">
                           Copy this URL and provide it to the Bayut technical support team to enable real-time synchronization for your property inventory.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                         <Button 
                            className="h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] bg-primary shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                            onClick={() => router.push("/")}
                         >
                            Return to Properties Dashboard
                         </Button>
                         <Button 
                            variant="ghost"
                            className="h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:bg-muted"
                            onClick={() => setSubmitted(null)}
                         >
                            Add Another Property
                            <ArrowLeft className="h-4 w-4 ml-3" />
                         </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

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
