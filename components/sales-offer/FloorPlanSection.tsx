"use client";

import { Card } from "@/components/ui/card";
import { ModernField } from "@/components/ui/modern-field";
import { Button } from "@/components/ui/button";
import { Layers, Layout, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloorPlanSectionProps {
  formData: any;
  images: any;
  handleInputChange: (field: string, value: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
  removeImage: (type: string) => void;
  unitDetailInputRef: React.RefObject<HTMLInputElement | null>;
}

export function FloorPlanSection({
  formData,
  images,
  handleInputChange,
  handleImageUpload,
  removeImage,
  unitDetailInputRef
}: FloorPlanSectionProps) {
  return (
    <section className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black py-1 px-3 rounded-full border bg-emerald-500/5 text-emerald-500 tracking-widest uppercase">Page 04</span>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/80">Unit Floor & Layout Architecture</h2>
        </div>
        <p className="text-xs text-muted-foreground ml-14">Space planning and area verification data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-1 p-8 border-border/20 bg-card/40 backdrop-blur-sm rounded-4xl shadow-sm space-y-6">
          <ModernField label="Floor Number" icon={Layers} placeholder="example floor" value={formData.level} onChange={(e) => handleInputChange('level', e.target.value)} />
          <ModernField label="Suite Net Area (SQ.FT)" icon={Layout} placeholder="example suite area" value={formData.suiteArea} onChange={(e) => handleInputChange('suiteArea', e.target.value)} />
          <ModernField label="Terrace Net Area (SQ.FT)" icon={Layout} placeholder="example terrace area" value={formData.terraceArea} onChange={(e) => handleInputChange('terraceArea', e.target.value)} />
          <div className="pt-2">
            <ModernField 
              label="Total Effective Area" 
              icon={Layout}
              value={formData.totalArea} 
              readOnly 
              className="bg-primary/5 border-primary/20 text-primary cursor-default" 
              onChange={() => {}} 
            />
            <p className="text-[9px] font-bold text-primary/60 uppercase tracking-widest mt-2 ml-4">Automatically Calculated Sum</p>
          </div>
        </Card>


        <div className="lg:col-span-3">
          <div 
            className={cn(
              "relative group h-120 rounded-[2.5rem] border-2 border-dashed transition-all duration-700 bg-white shadow-inner overflow-hidden",
              images.unitDetail ? "border-transparent" : "border-border/60 hover:border-primary/40 cursor-pointer"
            )} 
            onClick={() => !images.unitDetail && unitDetailInputRef.current?.click()}
          >
            {images.unitDetail ? (
              <>
                <img src={images.unitDetail} className="w-full h-full object-contain p-8" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-6">
                  <Button size="icon" variant="destructive" onClick={(e) => { e.stopPropagation(); removeImage('unitDetail'); }} className="rounded-full shadow-lg"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </>
            ) : <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground"><Layout className="h-12 w-12" /><span className="text-xs font-bold uppercase tracking-widest">Upload Blueprint Asset</span></div>}
            <input ref={unitDetailInputRef} type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'unitDetail')} />
          </div>
        </div>
      </div>
    </section>
  );
}
