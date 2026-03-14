"use client";

import { useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { Upload, X, Image as ImageIcon, Video, RotateCw, ChevronLeft, ChevronRight, QrCode, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModernField } from "@/components/ui/modern-field";
import { cn } from "@/lib/utils";

interface Props {
  form: UseFormReturn<any>;
}

const applyWatermark = (base64Image: string, logoUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(base64Image);
      
      ctx.drawImage(img, 0, 0);
      
      const logo = new Image();
      logo.crossOrigin = "anonymous";
      logo.onload = () => {
        const logoTargetWidth = canvas.width * 0.34;
        const logoTargetHeight = (logo.height / logo.width) * logoTargetWidth;
        const x = (canvas.width - logoTargetWidth) / 2;
        const y = (canvas.height - logoTargetHeight) / 2;
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        const padding = 16;
        ctx.roundRect(x - padding, y - padding, logoTargetWidth + (padding * 2), logoTargetHeight + (padding * 2), 24);
        ctx.fill();

        ctx.globalAlpha = 1.0;
        ctx.drawImage(logo, x, y, logoTargetWidth, logoTargetHeight);
        ctx.globalAlpha = 1.0;
        resolve(canvas.toDataURL("image/jpeg", 0.95));
      };
      logo.onerror = () => resolve(base64Image);
      logo.src = logoUrl;
    };
    img.onerror = () => resolve(base64Image);
    img.src = base64Image;
  });
};

export function MediaStep({ form }: Props) {
  const { register, watch, setValue, getValues } = form;
  const images = watch("images") || [];
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert new files to base64, apply watermark, and update form state
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        // Apply branded watermark before saving
        const watermarked = await applyWatermark(base64String, "/logo.jpg");
        const currentImages = getValues("images") || [];
        setValue("images", [...currentImages, watermarked], { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newList = images.filter((_: any, i: number) => i !== index);
    setValue("images", newList, { shouldValidate: true });
    if (activePreviewIndex >= newList.length) {
      setActivePreviewIndex(Math.max(0, newList.length - 1));
    }
  };

  const nextPreview = () => {
    if (images.length === 0) return;
    setActivePreviewIndex((prev) => (prev + 1) % images.length);
  };

  const prevPreview = () => {
    if (images.length === 0) return;
    setActivePreviewIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const videoUrl = watch("videoUrl");
  const view360Url = watch("view360Url");
  const qrCodeUrl = watch("qrCodeUrl");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Photos Upload Area */}
        <Card className="rounded-[2.5rem] border-border/50 shadow-2xl overflow-hidden bg-background/50 backdrop-blur-sm">
          <CardHeader className="bg-muted/50 border-b border-border/50 py-6 px-8">
            <CardTitle className="text-sm font-bold flex items-center justify-between text-foreground">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <ImageIcon className="h-5 w-5 text-primary" />
                </div>
                Add Photos
              </div>
              <Info className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="flex flex-wrap gap-4 min-h-[160px]">
              {images.map((url: string, i: number) => (
                <div 
                  key={i} 
                  className={cn(
                    "relative group w-32 h-32 rounded-3xl overflow-hidden shadow-md border border-border/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer ring-offset-2",
                    activePreviewIndex === i ? "ring-2 ring-primary" : ""
                  )}
                  onClick={() => setActivePreviewIndex(i)}
                >
                  <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover transition-all group-hover:blur-[2px] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                      className="bg-white/20 backdrop-blur-md hover:bg-destructive/80 text-white rounded-2xl p-2.5 transition-all hover:scale-110 shadow-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  {i === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[9px] font-black rounded-lg shadow-lg">
                      COVER
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl hover:border-primary/50 hover:bg-primary/5 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-2.5 rounded-full bg-muted group-hover:bg-primary/10 transition-colors mb-2">
                  <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Upload</span>
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
              </button>
            </div>

            <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100/50 dark:border-amber-800/20 rounded-2xl p-4 flex items-center gap-4">
               <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-800/30 flex items-center justify-center shrink-0">
                  <Info className="h-4 w-4 text-amber-600 dark:text-amber-500" />
               </div>
               <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                 <span className="uppercase tracking-widest mr-2">Tip:</span>
                 Add your images in a 4:3 ratio, for example, 1600x1200 pixels to maximize the Listing's Quality Score.
               </p>
            </div>
          </CardContent>
        </Card>

        {/* Preview Box Slide */}
        <div className="space-y-6">
          <Card className="rounded-[2.5rem] border-border/50 shadow-2xl overflow-hidden bg-background/50 backdrop-blur-sm h-full">
            <CardHeader className="bg-muted/50 border-b border-border/50 py-5 px-6">
              <CardTitle className="text-xs font-bold flex items-center justify-between text-foreground">
                <div className="flex items-center gap-2">
                  Preview Box
                </div>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Live View Area</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center justify-center h-[calc(100%-60px)]">
               {images.length > 0 ? (
                 <div className="relative w-full aspect-square rounded-4xl overflow-hidden group shadow-inner bg-muted">
                    <img 
                      src={images[activePreviewIndex]} 
                      alt="Active Preview" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    
                    {/* Images are watermarked during upload */}

                    {/* Navigation Buttons */}
                    <div className="absolute inset-y-0 left-0 flex items-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button type="button" onClick={prevPreview} className="bg-white/10 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-2xl transition-all shadow-lg">
                          <ChevronLeft className="h-5 w-5" />
                       </button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button type="button" onClick={nextPreview} className="bg-white/10 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-2xl transition-all shadow-lg">
                          <ChevronRight className="h-5 w-5" />
                       </button>
                    </div>

                    {/* Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/20 backdrop-blur-md rounded-xl text-[10px] font-black text-white shadow-lg">
                       {activePreviewIndex + 1} / {images.length}
                    </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-1">
                    <div className="p-3 rounded-full bg-primary/5 animate-pulse mb-4">
                      <ImageIcon className="h-8 w-8 opacity-20" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">Live Preview Area</span>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Media Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModernField 
          label="Video Tour URL" 
          {...register("videoUrl")}
          icon={Video}
          value={videoUrl}
        />
        
        <ModernField 
          label="View 360 URL" 
          {...register("view360Url")}
          icon={RotateCw}
          value={view360Url}
        />

        <ModernField 
          label="QR Code (Property Booster)" 
          {...register("qrCodeUrl")}
          icon={QrCode}
          value={qrCodeUrl}
        />
      </div>

    </div>
  );
}
