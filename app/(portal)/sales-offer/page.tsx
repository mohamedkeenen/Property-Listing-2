"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Sparkles } from "lucide-react";
import { generateSalesOfferPDF } from "@/lib/generateSalesOfferPDF";

// Internal Components
import { DocumentSettings } from "@/components/sales-offer/DocumentSettings";
import { CoverSection } from "@/components/sales-offer/CoverSection";
import { InformationSheet } from "@/components/sales-offer/InformationSheet";
import { HighlightsSection } from "@/components/sales-offer/HighlightsSection";
import { FloorPlanSection } from "@/components/sales-offer/FloorPlanSection";
import { FinancialsSection } from "@/components/sales-offer/FinancialsSection";
import { Button } from "@/components/ui/button";

export default function SalesOfferPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    titleArabic: "",
    projectName: "",
    projectNameOfficial: "",
    location: "",
    propertyType: "",
    unitNumber: "",
    bedrooms: "",
    level: "",
    unitArea: "",
    sellingPrice: "",
    developerName: "",
    salesConsultant: "",
    headOfSales: "",
    website: "",
    referenceToken: "SA-OFFER-2024-X1",
    suiteArea: "",
    terraceArea: "",
    totalArea: "",
    themeColor: "#ffffff",
    preReg: {
      dld: { description: "DLD Charges", date: "", percentage: "4%", amount: "" },
      admin: { description: "Administration Fee", date: "", percentage: "0%", amount: "5,000.00" },
    },
    paymentPlan: [
      { date: "", installment: "1st Instalment", percentage: "20.00%", price: "" }
    ],
    // Automatic Calculation States
    paymentPlanStartDate: "",
    paymentPlanDuration: "10",
    paymentPlanPeriodType: "month",
    firstInstallmentPercentage: "20",
    lastInstallmentPercentage: "30"
  });

  const [images, setImages] = useState<{
    cover: string | null;
    banner: string | null;
    qrCode: string | null;
    unitDetail: string | null;
    highlights: (string | null)[];
  }>({
    cover: null,
    banner: null,
    qrCode: null,
    unitDetail: null,
    highlights: [null, null, null, null],
  });

  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const qrInputRef = useRef<HTMLInputElement | null>(null);
  const unitDetailInputRef = useRef<HTMLInputElement | null>(null);
  const highlightInputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  const handleInputChange = (field: string, value: string) => {
    // Basic numeric validation for specific fields
    const numericFields = ['suiteArea', 'terraceArea', 'totalArea', 'level', 'bedrooms', 'unitArea', 'sellingPrice', 'paymentPlanDuration', 'firstInstallmentPercentage', 'lastInstallmentPercentage'];
    if (numericFields.includes(field)) {
      if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;
    }


    setFormData((prev) => {
      // Prevent zero or negative percentages for auto-generator fields as requested
      if (['firstInstallmentPercentage', 'lastInstallmentPercentage'].includes(field)) {
        if (value === "0") return prev;
      }

      const next = { ...prev, [field]: value };

      
      // Auto-calculate Total Effective Area logic
      if (field === 'suiteArea' || field === 'terraceArea') {
        const suite = parseFloat(next.suiteArea) || 0;
        const terrace = parseFloat(next.terraceArea) || 0;
        const total = suite + terrace;
        next.totalArea = total % 1 === 0 ? total.toString() : total.toFixed(2);
      }

      // Auto-calculate Payment Plan logic
      const autoFields = ['paymentPlanStartDate', 'paymentPlanDuration', 'paymentPlanPeriodType', 'firstInstallmentPercentage', 'lastInstallmentPercentage', 'sellingPrice'];
      if (autoFields.includes(field)) {
        const startDate = next.paymentPlanStartDate ? new Date(next.paymentPlanStartDate) : null;
        const duration = parseInt(next.paymentPlanDuration) || 0;
        const firstP = parseFloat(next.firstInstallmentPercentage) || 0;
        const lastP = parseFloat(next.lastInstallmentPercentage) || 0;
        const totalP = 100;
        const price = parseFloat(next.sellingPrice.replace(/,/g, '')) || 0;

        if (startDate && duration >= 2) {
          const newPlan = [];
          const numMiddle = duration - 2;
          const middleP = numMiddle > 0 ? (totalP - firstP - lastP) / numMiddle : 0;

          for (let i = 0; i < duration; i++) {
            const currentDate = new Date(startDate);
            if (next.paymentPlanPeriodType === 'month') {
              currentDate.setMonth(startDate.getMonth() + i);
            } else {
              currentDate.setDate(startDate.getDate() + (i * 7));
            }

            let p = 0;
            let label = "";
            
            if (i === 0) {
              p = firstP;
              label = "1st Instalment";
            } else if (i === duration - 1) {
              p = lastP;
              label = next.paymentPlanPeriodType === 'month' ? "On project completion" : "Final Settlement";
            } else {
              p = middleP;
              const idx = i + 1;
              let suffix = "th";
              if (idx === 2) suffix = "nd";
              if (idx === 3) suffix = "rd";
              label = `${idx}${suffix} Instalment`;
            }

            const rowPrice = (price * p) / 100;
            
            newPlan.push({
              date: i === duration - 1 && next.paymentPlanPeriodType === 'month' ? "On project completion" : currentDate.toISOString().split('T')[0],
              installment: label,
              percentage: p.toFixed(2) + "%",
              price: rowPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            });
          }
          next.paymentPlan = newPlan;
        }
      }
      
      return next;
    });
  };

  const handleTableChange = (section: 'preReg' | 'paymentPlan', property: string, value: string, index?: number, subItem?: string) => {
    setFormData(prev => {
      if (section === 'paymentPlan' && index !== undefined) {
        const newPlan = [...prev.paymentPlan];
        newPlan[index] = { ...newPlan[index], [property]: value };
        return { ...prev, paymentPlan: newPlan };
      }
      if (section === 'preReg' && subItem) {
        return {
          ...prev,
          preReg: {
            ...prev.preReg,
            [subItem]: {
              ...(prev.preReg as any)[subItem],
              [property]: value
            }
          }
        };
      }
      return prev;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === 'highlights' && index !== undefined) {
        const newHighlights = [...images.highlights];
        newHighlights[index] = base64;
        setImages(prev => ({ ...prev, highlights: newHighlights }));
      } else {
        setImages(prev => ({ ...prev, [type]: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type: string, index?: number) => {
    if (type === 'highlights' && index !== undefined) {
      const newHighlights = [...images.highlights];
      newHighlights[index] = null;
      setImages(prev => ({ ...prev, highlights: newHighlights }));
    } else {
      setImages(prev => ({ ...prev, [type]: null }));
    }
  };

  const addPaymentRow = () => {
    setFormData(prev => {
      const nextIdx = prev.paymentPlan.length + 1;
      let suffix = "th";
      if (nextIdx === 2) suffix = "nd";
      if (nextIdx === 3) suffix = "rd";
      
      return {
        ...prev,
        paymentPlan: [
          ...prev.paymentPlan,
          { date: "", installment: `${nextIdx}${suffix} Instalment`, percentage: "10.00%", price: "" }
        ]
      };
    });
  };

  const removePaymentRow = (index: number) => {
    if (formData.paymentPlan.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      paymentPlan: prev.paymentPlan.filter((_, i) => i !== index)
    }));
  };

  const generatePDF = async () => {
    if (!formData.title) {
      toast.error("Please enter a title");
      return;
    }
    if (!images.cover) {
      toast.error("Please upload a cover image");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading("Generating PDF...");

    try {
      await generateSalesOfferPDF(formData, images);
      toast.success("PDF generated successfully!", { id: loadingToast });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF", { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-16 w-full max-w-[1600px] mx-auto pb-32 px-6 md:px-12 lg:px-16 animate-in fade-in duration-700">
      <DocumentSettings 
        formData={formData}
        themeColor={formData.themeColor} 
        isGenerating={isGenerating} 
        handleInputChange={handleInputChange} 
        generatePDF={generatePDF} 
      />


      <div className="space-y-20 px-4">
        <CoverSection 
          formData={formData} 
          images={images} 
          handleInputChange={handleInputChange} 
          handleImageUpload={handleImageUpload} 
          removeImage={removeImage} 
          coverInputRef={coverInputRef} 
        />

        <InformationSheet 
          formData={formData} 
          images={images} 
          handleInputChange={handleInputChange} 
          handleImageUpload={handleImageUpload} 
          removeImage={removeImage} 
          bannerInputRef={bannerInputRef} 
        />

        <HighlightsSection 
          images={images} 
          handleImageUpload={handleImageUpload} 
          removeImage={removeImage} 
          highlightInputRefs={highlightInputRefs} 
        />

        <FloorPlanSection 
          formData={formData} 
          images={images} 
          handleInputChange={handleInputChange} 
          handleImageUpload={handleImageUpload} 
          removeImage={removeImage} 
          unitDetailInputRef={unitDetailInputRef} 
        />

        <FinancialsSection 
          formData={formData} 
          handleInputChange={handleInputChange}
          handleTableChange={handleTableChange} 
          removePaymentRow={removePaymentRow} 
        />

      </div>
    </div>
  );
}
