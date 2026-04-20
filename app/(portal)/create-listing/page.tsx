"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema, ListingFormValues } from "@/validation/listingSchema";
import { StepIndicator } from "@/components/create-listing/StepIndicator";
import { PropertyDetailsStep } from "@/components/create-listing/PropertyDetailsStep";
import { MediaStep } from "@/components/create-listing/MediaStep";
import { LocationStep } from "@/components/create-listing/LocationStep";
import { AssetsAndNotesStep } from "@/components/create-listing/AssetsAndNotesStep";
import { CustomDetailsStep } from "@/components/create-listing/CustomDetailsStep";
import { CompletedStep } from "@/components/create-listing/CompletedStep";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import { ChevronRight, Save, LayoutGrid, CheckCircle2, ChevronLeft } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetPropertyQuery } from "@/api/redux/services/propertyApi";
import { mapBackendPropertyToFormValues } from "@/lib/mappers";
import { Loader2 } from "lucide-react";

import { Suspense } from "react";

const STEPS = [
  "Property Details",
  "Media Assets",
  "Location",
  "Assets & Notes",
  "Custom Details",
  "Completed",
];

function CreateListingContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");
  const isEdit = !!propertyId;

  const { data: propertyResponse, isLoading: isFetching } = useGetPropertyQuery(propertyId as string, {
    skip: !isEdit,
  });

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema) as any,
    defaultValues: {
      category: "Residential",
      purpose: "Rent",
      type: "",
      title: "",
      titleAr: "",
      description: "",
      descriptionAr: "",
      size: "",
      sqft: "",
      bedrooms: "",
      bathrooms: "",
      parking: "",
      unitNo: "",
      price: "",
      pricePeriod: "Yearly",
      currency: "Dirham",
      listingAgent: "",
      listingOwner: "",
      landlord: "",
      availabilityStatus: "",
      licenseType: "",
      titleDeed: "",
      landArea: "",
      builtUpArea: "",
      layoutType: "",
      projectName: "",
      ownership: "",
      developers: "",
      buildYear: "",
      finishingType: "",
      paymentMethod: "Cash",
      cheques: "1",
      serviceCharges: "",
      financialStatus: "Paid",
      hidePrice: false,
      amenities: [],
      images: [],
      documents: [],
      notes: "",
      custom_values: {},
      property_location: "",
      pfLocation: "",
      city: "",
      community: "",
      subCommunity: "",
      building: "",
      bayutLocation: "",
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
      }
    } as any,
  });

  // Load data for editing
  useEffect(() => {
    if (isEdit && propertyResponse?.data) {
      const formValues = mapBackendPropertyToFormValues(propertyResponse.data);
      form.reset(formValues);
    }
  }, [isEdit, propertyResponse, form]);


  const validateStep = async (stepIndex: number) => {
    let fields: (keyof ListingFormValues)[] = [];
    
    if (stepIndex === 0) { // Property Details
      fields = ["category", "purpose", "type", "unitNo", "bedrooms", "bathrooms", "size", "price", "title", "listingAgent"];
    } else if (stepIndex === 1) { // Media
      fields = ["images"];
    } else if (stepIndex === 2) { // Location
      // Location fields are often complex, but we can check if bayutLocation or pfLocation exists if we want strictness
      return true;
    } else if (stepIndex === 3) { // Assets & Notes
      return true;
    } else if (stepIndex === 4) { // Custom Details
      return true;
    }
    
    if (fields.length === 0) return true;
    return await form.trigger(fields as any[]);
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const errors = form.formState.errors;
      const errorMessages = Object.values(errors).map((e: any) => e.message).filter(Boolean);
      
      toast({
        title: "Validation Error",
        description: errorMessages.length > 0 ? errorMessages.join(", ") : "Please fill in all required fields",
        variant: "destructive",
      });
    }
  };

  const handleStepClick = async (stepIndex: number) => {
    // Only allow jumping back freely, moving forward requires validation
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Moving forward: validate current step and all steps in between
    for (let i = currentStep; i < stepIndex; i++) {
      const isValid = await validateStep(i);
      if (!isValid) {
        const errors = form.formState.errors;
        const messages = Object.values(errors).map((e: any) => e.message).filter(Boolean);
        
        toast({
          title: "Step Incomplete",
          description: messages.length > 0 ? messages.join(", ") : `Please complete the required fields in "${STEPS[i]}" before proceeding.`,
          variant: "destructive",
        });
        setCurrentStep(i);
        return;
      }
    }

    setCurrentStep(stepIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <PropertyDetailsStep form={form} />;
      case 1: return <MediaStep form={form} />;
      case 2: return <LocationStep form={form} />;
      case 3: return <AssetsAndNotesStep form={form} />;
      case 4: return <CustomDetailsStep form={form} />;
      case 5: return <CompletedStep form={form} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/10">
      <FormProvider {...form}>
        {/* Header Section */}
        <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border-b border-border/10 sticky top-0 z-50 transition-all duration-300">
          <div className="max-w-[1800px] mx-auto px-4 md:px-8">
            {/* Top Bar - Simplified & Premium */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 md:py-6 gap-4">
              <div className="flex items-center gap-4 md:gap-12">
                 <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1">
                       <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-primary leading-none">Live Draft Progress</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                       <span className="text-lg md:text-xl font-black text-foreground dark:text-white tracking-tight">
                         {isEdit ? "Update Property Listing" : "New Property Listing"}
                       </span>
                       <div className="hidden md:block h-4 w-px bg-border/20 mx-1" />
                       <span className="w-fit text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/30 dark:bg-white/5 py-1 px-3 rounded-full">
                         {isEdit ? "Editing Mode" : "Draft Auto-Saved"}
                       </span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 md:flex md:flex-row items-center gap-2 md:gap-4 w-full lg:w-auto mt-4 lg:mt-0">
                <Button variant="ghost" className="h-10 md:h-11 rounded-xl md:rounded-[1.25rem] font-black text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive hover:bg-destructive/5 dark:hover:bg-destructive/10 transition-all duration-500 px-2 md:px-8" type="button">
                  Discard
                </Button>
                <Button variant="outline" className="h-10 md:h-11 rounded-xl md:rounded-[1.25rem] border-border/60 bg-white/50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-black text-[9px] md:text-[10px] uppercase tracking-widest px-2 md:px-10 hover:border-primary hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-500 shadow-sm hover:shadow-primary/5 gap-1.5 md:gap-2.5 group/save" type="button">
                  <Save className="h-3 w-3 md:h-3.5 md:w-3.5 text-slate-400 dark:text-slate-500 group-hover/save:text-primary transition-colors duration-500 shrink-0" /> <span className="truncate">Save Draft</span>
                </Button>
                <Button 
                  onClick={handleNext}
                  className="col-span-2 md:col-span-1 h-10 md:h-11 rounded-xl md:rounded-[1.25rem] font-black text-[9px] md:text-[10px] uppercase tracking-widest px-4 md:px-12 shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-500 bg-linear-to-r from-primary to-indigo-600 text-white"
                  type="button"
                >
                  {currentStep === STEPS.length - 2 ? "Finalize" : "Continue"} <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-1.5 shrink-0" />
                </Button>
              </div>
            </div>

            {/* Stepper Bar */}
            <div className="pb-10 pt-2">
              <StepIndicator 
                currentStep={currentStep} 
                steps={STEPS} 
                onStepClick={handleStepClick}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-12">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
               <div className="relative">
                 <div className="h-24 w-24 rounded-full border-t-2 border-primary animate-spin" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary/40 animate-pulse" />
                 </div>
               </div>
               <div className="text-center">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse mb-2">Decrypted Access Secured</p>
                 <p className="text-xs text-muted-foreground font-medium">Retrieving listing assets from the core repository...</p>
               </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              {renderStep()}
            </div>
          )}

          {/* Bottom Navigation */}
          {currentStep < STEPS.length - 1 && (
            <div className="mt-8 md:mt-16 flex flex-col-reverse md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-0 bg-white/40 dark:bg-card/40 p-4 md:p-8 rounded-3xl md:rounded-4xl border border-border/40 dark:border-white/5 sticky bottom-4 md:bottom-8 z-10 backdrop-blur-xl shadow-2xl shadow-black/20 transition-all duration-500">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                disabled={currentStep === 0}
                className="w-full md:w-auto group/prev font-black text-[10px] text-muted-foreground hover:text-foreground uppercase tracking-[0.2em] md:tracking-[0.3em] disabled:opacity-20 px-6 md:px-10 h-12 md:h-14 rounded-2xl transition-all duration-500 hover:bg-muted/30"
                type="button"
              >
                <ChevronLeft className="mr-2 h-4 w-4 shrink-0 transition-transform group-hover/prev:-translate-x-1 duration-500" />
                Previous Step
              </Button>
              
              <div className="grid grid-cols-2 md:flex gap-3 md:gap-5 w-full md:w-auto">
                <Button 
                  variant="outline" 
                   className="w-full md:w-auto rounded-2xl border-border bg-background text-slate-500 dark:text-slate-400 font-black text-[9px] md:text-[10px] uppercase tracking-widest md:tracking-[0.2em] px-2 md:px-12 h-12 md:h-14 transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/5 hover:border-primary hover:bg-background hover:shadow-primary/10 group/save-bottom"
                  type="button"
                >
                  <Save className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-3 text-slate-400 dark:text-slate-500 group-hover/save-bottom:text-primary transition-colors duration-500 shrink-0" />
                  <span className="truncate">Save Draft</span>
                </Button>
                <Button 
                  onClick={handleNext}
                  className="w-full md:w-auto group/next rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest md:tracking-[0.3em] px-2 md:px-16 h-12 md:h-14 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all duration-500 bg-linear-to-r from-primary to-indigo-600 border-none"
                  type="button"
                >
                  <span className="hidden md:inline">{currentStep === STEPS.length - 2 ? "Finalize Listing" : "Save & Continue"}</span>
                  <span className="md:hidden truncate">{currentStep === STEPS.length - 2 ? "Finalize" : "Continue"}</span>
                  <ChevronRight className="ml-1.5 md:ml-3 h-3.5 w-3.5 md:h-4 md:w-4 shrink-0 transition-transform group-hover/next:translate-x-1.5 duration-500" />
                </Button>
              </div>
            </div>
          )}

          <Footer />
        </div>
      </FormProvider>
    </div>
  );
}

export default function CreateListingPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <CreateListingContent />
    </Suspense>
  );
}
