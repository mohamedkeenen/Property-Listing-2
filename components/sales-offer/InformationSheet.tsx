"use client";

import { Card } from "@/components/ui/card";
import { ModernField } from "@/components/ui/modern-field";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Layout, FileSearch, Layers, Building2, CreditCard, Sparkles, Info, Upload, Trash2, UserCheck, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface InformationSheetProps {
  formData: any;
  images: any;
  handleInputChange: (field: string, value: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
  removeImage: (type: string) => void;
  bannerInputRef: React.RefObject<HTMLInputElement | null>;
}

export function InformationSheet({
  formData,
  images,
  handleInputChange,
  handleImageUpload,
  removeImage,
  bannerInputRef,
}: InformationSheetProps) {
  return (
    <section className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black py-1 px-3 rounded-full border bg-indigo-500/5 text-indigo-500 tracking-widest uppercase">Page 02</span>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/80">Information Sheet Details</h2>
        </div>
        <p className="text-xs text-muted-foreground ml-14">Technical unit specifications and agent contact mapping.</p>
      </div>

      <div className="flex flex-col gap-12 items-center">
        <div className="w-full space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-2">Sheet Branding Asset (Page 2 Banner)</Label>
          <div 
            className={cn(
              "relative group h-56 rounded-4xl border-2 border-dashed transition-all duration-700 overflow-hidden shadow-sm",
              images.banner ? "border-transparent" : "border-border/60 hover:border-primary/40 cursor-pointer bg-card/40 backdrop-blur-sm"
            )} 
            onClick={() => !images.banner && bannerInputRef.current?.click()}
          >
            {images.banner ? (
              <>
                <img src={images.banner} className="w-50 h-50 object-cover mx-auto transition-transform duration-700 group-hover:scale-105 rounded-full" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); bannerInputRef.current?.click(); }} className="rounded-xl font-bold">Replace</Button>
                  <Button size="icon" variant="destructive" onClick={(e) => { e.stopPropagation(); removeImage('banner'); }} className="rounded-xl shadow-lg"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </>
            ) : <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-linear-to-br from-primary/5 to-secondary/5"><Upload className="h-5 w-5" strokeWidth={1.5} /><span className="text-[8px] font-black uppercase tracking-widest leading-relaxed">Detailed Header Banner</span></div>}
            <input ref={bannerInputRef} type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'banner')} />
          </div>
        </div>

        {/* Full-width Card Details */}
        <Card className="w-full p-10 border-border/20 bg-card/40 backdrop-blur-sm rounded-4xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-10">
            <ModernField label="Developer Name" icon={Layers} placeholder="example developer name" value={formData.developerName} onChange={(e) => handleInputChange('developerName', e.target.value)} />
          </div>
          
          <div className="h-px w-full bg-border/40 mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <ModernField label="Property Type" icon={Layout} placeholder="example property type" value={formData.propertyType} onChange={(e) => handleInputChange('propertyType', e.target.value)} />
            <ModernField label="Reference" icon={FileSearch} placeholder="example unit reference" value={formData.unitNumber} onChange={(e) => handleInputChange('unitNumber', e.target.value)} />
            <ModernField label="Bedroom Configuration" icon={Layers} placeholder="example bedrooms" value={formData.bedrooms} onChange={(e) => handleInputChange('bedrooms', e.target.value)} />
            <ModernField label="Level / Floor" icon={Building2} placeholder="example floor" value={formData.level} onChange={(e) => handleInputChange('level', e.target.value)} />
            <ModernField label="Total Area (SQ.FT)" icon={Layout} placeholder="example area" value={formData.unitArea} onChange={(e) => handleInputChange('unitArea', e.target.value)} />
            <ModernField label="Final Selling Price (AED)" icon={CreditCard} placeholder="example price" value={formData.sellingPrice} onChange={(e) => handleInputChange('sellingPrice', e.target.value)} />
            
            {formData.assignedConsultant && (
              <ModernField 
                label="Sales Consultant" 
                icon={UserCheck} 
                placeholder="Consultant name" 
                value={formData.assignedConsultant} 
                onChange={(e) => handleInputChange('assignedConsultant', e.target.value)} 
              />
            )}
            
            {formData.approvalAuthority && (
              <ModernField 
                label="Head of Sales" 
                icon={ShieldCheck} 
                placeholder="Authority name" 
                value={formData.approvalAuthority} 
                onChange={(e) => handleInputChange('approvalAuthority', e.target.value)} 
              />
            )}
          </div>
          
        </Card>
      </div>
    </section>
  );
}
