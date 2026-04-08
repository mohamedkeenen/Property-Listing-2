"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema, ListingFormValues } from "@/validation/listingSchema";
import { StepIndicator } from "@/components/create-listing/StepIndicator";
import { PortalSelectionStep } from "@/components/create-listing/PortalSelectionStep";
import { PropertyDetailsStep } from "@/components/create-listing/PropertyDetailsStep";
import { LocationStep } from "@/components/create-listing/LocationStep";
import { CompletedStep } from "@/components/create-listing/CompletedStep";
import { Button } from "@/components/ui/button";
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
  "Location",
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

  // Load from localStorage (only for new listings)
  useEffect(() => {
    if (isEdit) return; // Don't use draft for editing existing
    const saved = localStorage.getItem("property-listing-draft");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach((key) => {
          form.setValue(key as any, data[key]);
        });
      } catch (e) {
        console.error("Failed to parse saved draft", e);
      }
    }
  }, [form, isEdit]);

  // Save to localStorage on change (but only lightweight fields and only for new listings)
  useEffect(() => {
    if (isEdit) return;
    const subscription = form.watch((value) => {
      // Create a lightweight draft copy without heavy base64 arrays
      const { images, documents, ...lightDraft } = value as any;
      localStorage.setItem("property-listing-draft", JSON.stringify(lightDraft));
    });
    return () => subscription.unsubscribe();
  }, [form, isEdit]);

  const validateStep = async (stepIndex: number) => {
    let fields: (keyof ListingFormValues)[] = [];
    
    if (stepIndex === 0) { // Property Details (+ Media)
      fields = ["category", "purpose", "type", "unitNo", "bedrooms", "bathrooms", "size", "price", "title", "listingAgent", "images"];
    } else if (stepIndex === 1) { // Location
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
      case 1: return <LocationStep form={form} />;
      case 2: return <CompletedStep form={form} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/10">
      <FormProvider {...form}>
        {/* Header Section */}
        <div className="bg-white dark:bg-[#020617] border-b border-border/40 sticky top-0 z-50 shadow-sm dark:shadow-2xl dark:shadow-black/50 transition-all duration-300">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            {/* Top Bar - Simplified & Premium */}
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-12">
                 <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1">
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary leading-none">Live Draft Progress</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="text-xl font-black text-foreground dark:text-white tracking-tight">
                         {isEdit ? "Update Property Listing" : "New Property Listing"}
                       </span>
                       <div className="h-4 w-px bg-border/20 mx-1" />
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/30 dark:bg-white/5 py-1 px-3 rounded-full">
                         {isEdit ? "Editing Mode" : "Draft Auto-Saved"}
                       </span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" className="h-11 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground dark:hover:text-white hover:bg-muted dark:hover:bg-white/5 transition-all px-8" type="button">
                  Discard Changes
                </Button>
                <Button variant="outline" className="h-11 rounded-[1.25rem] border-border/40 bg-transparent text-foreground dark:text-white font-black text-[10px] uppercase tracking-widest px-10 hover:bg-muted dark:hover:bg-white/5 transition-all shadow-xs gap-2" type="button">
                  <Save className="h-3.5 w-3.5" /> Save Draft
                </Button>
                <Button 
                  onClick={handleNext}
                  className="h-11 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest px-12 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all bg-linear-to-r from-primary to-indigo-600 text-white"
                  type="button"
                >
                  Save & Continue <ChevronRight className="h-4 w-4 ml-1" />
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
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
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
            <div className="mt-16 flex items-center justify-between bg-background/80 dark:bg-[#020617]/95 p-8 rounded-4xl border border-border/40 dark:border-white/10 sticky bottom-8 z-10 backdrop-blur-xl transition-all">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                disabled={currentStep === 0}
                className="group/prev font-black text-[10px] text-muted-foreground hover:text-foreground uppercase tracking-[0.3em] disabled:opacity-20 px-10 h-14 rounded-2xl transition-all hover:bg-muted/30"
                type="button"
              >
                <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover/prev:-translate-x-1" />
                Previous Step
              </Button>
              
              <div className="flex gap-5">
                <Button 
                  variant="outline" 
                  className="rounded-2xl border-primary/40 text-primary hover:bg-primary hover:text-white hover:border-primary font-black text-[10px] uppercase tracking-[0.2em] px-12 h-14 transition-all hover:scale-[1.02] active:scale-95 hover:shadow-lg hover:shadow-primary/20"
                  type="button"
                >
                  Save Draft
                </Button>
                <Button 
                  onClick={handleNext}
                  className="group/next rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] px-16 h-14 shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 active:scale-95 transition-all bg-linear-to-r from-primary to-indigo-600 border-none"
                  type="button"
                >
                  {currentStep === STEPS.length - 2 ? "Finalize Listing" : "Save & Continue"}
                  <ChevronRight className="ml-3 h-4 w-4 transition-transform group-hover/next:translate-x-1.5" />
                </Button>
              </div>
            </div>
          )}
          
          <footer className="mt-16 py-8 text-center">
             <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent mb-8" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">
               © 2026 — Powered by <span className="text-muted-foreground/60">Keen Enterprises</span>
             </p>
          </footer>
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
