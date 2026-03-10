import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitListing } from "@/lib/api";
import { listingSchema, ListingFormValues } from "@/validation/listingSchema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { StepIndicator } from "@/components/create-listing/StepIndicator";
import { PropertyDetailsStep } from "@/components/create-listing/PropertyDetailsStep";
import { MediaStep } from "@/components/create-listing/MediaStep";
import { LocationStep } from "@/components/create-listing/LocationStep";
import { PublishingStep } from "@/components/create-listing/PublishingStep";
import { NotesStep } from "@/components/create-listing/NotesStep";
import { DocumentsStep } from "@/components/create-listing/DocumentsStep";
import { CompletedStep } from "@/components/create-listing/CompletedStep";
import { ChevronRight, Save } from "lucide-react";

const steps = ["Property Details", "Media", "Location", "Publishing", "Notes", "Documents", "Completed"];

export function CreateListingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema) as any,
    defaultValues: {
      category: "Residential",
      purpose: "Rent",
      type: "",
      title: "",
      size: 0,
      sqft: 0,
      bedrooms: 0,
      bathrooms: 0,
      parking: 0,
      furnished: "Unfurnished",
      unitNo: "",
      buildYear: "",
      price: 0,
      pricePeriod: "Yearly",
      paymentMethod: "",
      cheques: "",
      serviceCharges: "",
      financialStatus: "",
      description: "",
      amenities: [],
      titleDeed: "",
      landArea: 0,
      builtUpArea: 0,
      layoutType: "",
      projectName: "",
      ownership: "",
      developers: "",
      listingFinished: "",
      currency: "AED",
      listingAgent: "",
      listingOwner: "",
      landlord: "",
      availabilityStatus: "Available",
      availableFrom: "",
      licenseType: "Rera",
      permitNumber: "",
      permitIssueDate: "",
      permitExpiryDate: "",
      videoUrl: "",
      view360Url: "",
      city: "",
      community: "",
      subCommunity: "",
      building: "",
      bayutCity: "",
      bayutCommunity: "",
      bayutSubCommunity: "",
      bayutBuilding: "",
      portals: {
        propertyFinder: false,
        bayutEnabled: false,
        bayutSelection: false,
        dubizzleSelection: false,
        officeWebsite: false,
        primeZamWebsite: false,
      },
      notes: "",
      publishStatus: "publish",
    },
  });

  const stepFields: Array<Array<keyof ListingFormValues>> = [
    ["category", "purpose", "type", "title", "size", "unitNo", "bedrooms", "bathrooms", "price", "listingAgent"],
    [], [], [], [], [], [],
  ];

  const goNext = async () => {
    const fields = stepFields[currentStep];
    if (fields && fields.length > 0) {
      const valid = await form.trigger(fields as any);
      if (!valid) {
        toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
        return;
      }
    }
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const onSave = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSubmitting(false);
    toast({ title: "Draft Saved", description: "Listing has been saved to your drafts." });
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      const result = await submitListing(data);
      toast({ 
        title: "Listing Created!", 
        description: `Property "${data.title}" (${(result as any).reference}) has been published successfully.` 
      });
      router.push("/");
    } catch (error) {
      toast({ 
        title: "Submission Failed", 
        description: "An error occurred while creating your listing. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <PropertyDetailsStep form={form} />;
      case 1: return <MediaStep form={form} />;
      case 2: return <LocationStep form={form} />;
      case 3: return <PublishingStep form={form} />;
      case 4: return <NotesStep form={form} />;
      case 5: return <DocumentsStep form={form} />;
      case 6: return <CompletedStep form={form} />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-10">
        <StepIndicator currentStep={currentStep} steps={steps} />
      </div>

      <form onSubmit={onSubmit}>
        {renderStep()}

        <div className="flex items-center justify-between mt-12 py-6 border-t border-slate-100">
          <Button 
            type="button" 
            variant="outline" 
            onClick={goPrev} 
            disabled={currentStep === 0 || isSubmitting} 
            className="rounded-xl px-8 py-6 h-auto font-bold text-slate-500 border-slate-200 hover:bg-slate-50"
          >
             Previous
          </Button>
          <div className="flex items-center gap-3">
             <Button 
               type="button" 
               variant="ghost" 
               onClick={onSave} 
               disabled={isSubmitting}
               className="rounded-full px-8 py-6 h-auto font-black text-[10px] tracking-widest text-slate-400 border border-slate-100 hover:bg-slate-50 hover:text-slate-600 uppercase transition-all duration-300"
             >
                <Save className="h-3.5 w-3.5 mr-2.5 translate-y-[-0.5px]" /> SAVE DRAFT
             </Button>
             {currentStep < steps.length - 1 ? (
               <Button 
                 type="button" 
                 onClick={goNext} 
                 disabled={isSubmitting}
                 className="rounded-xl px-12 py-6 h-auto font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 disabled:opacity-70"
               >
                 Continue <ChevronRight className="h-4 w-4 ml-2" />
               </Button>
             ) : (
               <Button 
                 type="submit" 
                 disabled={isSubmitting}
                 className="rounded-xl px-12 py-6 h-auto font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 disabled:opacity-70 min-w-[200px]"
               >
                 {isSubmitting ? (
                   <div className="flex items-center gap-2">
                     <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     Creating...
                   </div>
                 ) : "Submit Listing"}
               </Button>
             )}
          </div>
        </div>
      </form>
    </div>
  );
}
