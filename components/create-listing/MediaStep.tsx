"use client";

import { useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { 
  Upload, ImageIcon, Video, RotateCw, QrCode, X, FileText 
} from "lucide-react";
import { ModernField } from "@/components/ui/modern-field";
import { useSelector } from "react-redux";
import { selectToken } from "@/api/redux/slices/authSlice";

interface Props {
  form: UseFormReturn<any>;
}

export function MediaStep({ form }: Props) {
  const { register, setValue, watch, formState: { errors } } = form;
  const token = useSelector(selectToken);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = watch("images") || [];

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
        if (!logoUrl.startsWith('data:')) {
           logo.crossOrigin = "anonymous";
        }
        logo.onload = () => {
          const logoTargetWidth = canvas.width * 0.4;
          const logoTargetHeight = (logo.height / logo.width) * logoTargetWidth;
          const x = (canvas.width - logoTargetWidth) / 2;
          const y = (canvas.height - logoTargetHeight) / 2;
          
          ctx.save();
          ctx.globalAlpha = 0.4;
          ctx.drawImage(logo, x, y, logoTargetWidth, logoTargetHeight);
          ctx.restore();
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        };
        logo.onerror = () => {
          console.warn("Watermark logo failed to load", logoUrl);
          resolve(base64Image);
        };
        logo.src = logoUrl;
      };
      img.onerror = () => resolve(base64Image);
      img.src = base64Image;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://property-listing.keenenter.com/api';
    
    let watermarkedLogoUrl: string | null = null;
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/settings/logo`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const blob = await response.blob();
          watermarkedLogoUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        }
      } catch (error) {
        console.error("Failed to fetch watermark logo:", error);
      }
    }

    const filesArray = Array.from(files);
    const newProcessedImages: string[] = [];

    for (const file of filesArray) {
      const base64FromFile = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const processed = watermarkedLogoUrl 
        ? await applyWatermark(base64FromFile, watermarkedLogoUrl) 
        : base64FromFile;
      
      newProcessedImages.push(processed);
    }

    const currentImages = watch("images") || [];
    setValue("images", [...currentImages, ...newProcessedImages], { shouldValidate: true });
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    const newList = images.filter((_: any, i: number) => i !== index);
    setValue("images", newList, { shouldValidate: true });
    if (activePreviewIndex >= newList.length) {
      setActivePreviewIndex(Math.max(0, newList.length - 1));
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("draggedIndex", index.toString());
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = "1";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("draggedIndex"));
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    const newImages = [...images];
    const [movedItem] = newImages.splice(sourceIndex, 1);
    newImages.splice(targetIndex, 0, movedItem);

    setValue("images", newImages, { shouldValidate: true });
    setActivePreviewIndex(targetIndex);
  };

  const fieldError = (name: string) => errors[name]?.message as string | undefined;

  return (
    <div>
      <div className="space-y-8 pb-20">
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <ImageIcon className="h-4 w-4" />
             </div>
             <h3 className="text-sm font-bold text-foreground">Media & Photographs</h3>
             <div className="h-px flex-1 bg-border/20" />
             <Upload className="h-4 w-4 text-muted-foreground/30" />
          </div>

          <div className="bg-card/30 p-8 rounded-4xl border border-border/20 space-y-8">
            <div className="flex flex-wrap gap-4 min-h-[120px]">
              {images.map((url: string, i: number) => (
                <div 
                  key={`${url}-${i}`} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, i)}
                  className={cn(
                    "relative group w-28 h-28 rounded-2xl overflow-hidden shadow-sm border border-border/40 transition-all hover:shadow-lg hover:-translate-y-1 cursor-move active:scale-95",
                    activePreviewIndex === i ? "ring-2 ring-primary" : ""
                  )}
                  onClick={() => setActivePreviewIndex(i)}
                >
                  <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                      className="bg-white/20 backdrop-blur-md hover:bg-destructive/80 text-white rounded-xl p-2 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary mb-2" />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">Upload</span>
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              </button>
            </div>

            {fieldError("images") && (
              <p className="text-destructive text-[10px] font-bold uppercase tracking-widest ml-1 animate-pulse flex items-center gap-2">
                <ImageIcon className="h-3 w-3" /> {fieldError("images")}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ModernField label="Video Tour URL" icon={Video} {...register("videoUrl")} value={watch("videoUrl")} />
              <ModernField label="View 360 URL" icon={RotateCw} {...register("view360Url")} value={watch("view360Url")} />
              <ModernField label="QR Code URL" icon={QrCode} {...register("qrUrl")} value={watch("qrUrl")} />
            </div>
          </div>
        </section>
        
        {/* Floor Plan Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <RotateCw className="h-4 w-4" />
             </div>
             <h3 className="text-sm font-bold text-foreground">Official Floor Plan</h3>
             <div className="h-px flex-1 bg-border/20" />
             <FileText className="h-4 w-4 text-muted-foreground/30" />
          </div>

          <div className="bg-card/30 p-8 rounded-4xl border border-border/20">
            <div className="flex flex-wrap gap-4 min-h-[120px]">
              {watch("floorPlanImage") ? (
                <div className="relative group w-40 h-40 rounded-2xl overflow-hidden shadow-sm border border-border/40 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                  <img src={watch("floorPlanImage")} alt="Floor Plan" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setValue("floorPlanImage", null); }}
                      className="bg-white/20 backdrop-blur-md hover:bg-destructive/80 text-white rounded-xl p-2 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = async (e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.files?.[0]) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setValue("floorPlanImage", reader.result as string, { shouldValidate: true });
                        };
                        reader.readAsDataURL(target.files[0]);
                      }
                    };
                    input.click();
                  }}
                  className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                  <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary mb-2" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">Upload Floor Plan</span>
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
