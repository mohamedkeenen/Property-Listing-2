"use client";

import { Card } from "@/components/ui/card";
import { ModernField } from "@/components/ui/modern-field";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Building2, Map, Layers, Upload, Trash2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoverSectionProps {
  formData: any;
  images: any;
  handleInputChange: (field: string, value: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
  removeImage: (type: string) => void;
  coverInputRef: React.RefObject<HTMLInputElement | null>;
}

export function CoverSection({
  formData,
  images,
  handleInputChange,
  handleImageUpload,
  removeImage,
  coverInputRef
}: CoverSectionProps) {
  return (
    <section className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-10 items-center">
        <div className="w-full max-w-sm space-y-4 text-center">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Main Branding Asset</Label>
          <div 
            className={cn(
              "relative group w-64 h-64 mx-auto rounded-full border-2 border-dashed transition-all duration-700 overflow-hidden shadow-2xl",
              images.cover ? "border-transparent" : "border-border/60 hover:border-primary/40 cursor-pointer bg-card/40 backdrop-blur-sm"
            )} 
            onClick={() => !images.cover && coverInputRef.current?.click()}
          >
            {images.cover ? (
              <>
                <img src={images.cover} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                  <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); coverInputRef.current?.click(); }} className="rounded-full font-bold px-6">Replace</Button>
                  <Button size="icon" variant="destructive" onClick={(e) => { e.stopPropagation(); removeImage('cover'); }} className="rounded-full shadow-lg"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-8 bg-linear-to-br from-primary/5 to-secondary/5 transition-all">
                 <div className="p-5 rounded-full bg-primary/10 text-primary shadow-inner">
                   <Upload className="h-10 w-10" strokeWidth={1.5} />
                 </div>
                 <div className="space-y-1">
                   <span className="block text-xs font-black uppercase tracking-widest text-muted-foreground">Main Asset</span>
                   <span className="block text-[8px] text-muted-foreground/60 font-medium tracking-tighter uppercase underline underline-offset-4 decoration-primary/30 decoration-dotted">100% Radius (Circular)</span>
                 </div>
              </div>
            )}
            <input ref={coverInputRef} type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'cover')} />
          </div>
        </div>

        <Card className="w-full p-10 border-border/20 bg-card/40 backdrop-blur-sm rounded-4xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ModernField 
              label="English Project Name" 
              icon={Building2}
              placeholder="example project name"
              value={formData.projectName}
              onChange={(e) => handleInputChange('projectName', e.target.value)}
            />
            <ModernField 
              label="English Title" 
              icon={Globe}
              placeholder="example title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
            <ModernField 
              label="Macro Location" 
              icon={Map}
              placeholder="example macro location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
            <ModernField 
              label="Website" 
              icon={Layers}
              placeholder="example website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
            />
          </div>
        </Card>
      </div>
    </section>
  );
}
