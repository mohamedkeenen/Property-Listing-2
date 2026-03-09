import { useState } from "react";
import NextImage from "next/image";
import { UseFormReturn } from "react-hook-form";
import { Upload, X, Image as ImageIcon, Video, RotateCw, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModernField } from "@/components/ui/modern-field";

interface Props {
  form: UseFormReturn<any>;
}

export function MediaStep({ form }: Props) {
  const { register, watch, setValue } = form;
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPreviewImages((prev) => [...prev, ...urls]);
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const videoUrl = watch("videoUrl");
  const view360Url = watch("view360Url");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Photos Section */}
      <Card className="rounded-3xl border-border/50 shadow-xl overflow-hidden bg-white/50 backdrop-blur-sm">
        <CardHeader className="bg-slate-50/50 border-b border-border/50 py-5">
          <CardTitle className="text-sm font-bold flex items-center gap-2.5 text-slate-700">
            <div className="p-1.5 rounded-lg bg-blue-100/50">
              <ImageIcon className="h-4 w-4 text-blue-500" />
            </div>
            Property Photos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-12 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="p-4 rounded-full bg-slate-50 group-hover:bg-white shadow-sm transition-colors mb-4">
                <Upload className="h-8 w-8 text-primary shadow-sm" />
              </div>
              <span className="text-lg font-bold text-slate-700">Click or Drag to upload photos</span>
              <span className="text-sm text-slate-400 mt-1 font-medium">PNG, JPG up to 10MB • Recommended 16:9 ratio</span>
            </div>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
          </label>

          {previewImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 pt-2">
              {previewImages.map((url, i) => (
                <div key={i} className="relative group aspect-4/3 rounded-2xl overflow-hidden shadow-sm border border-slate-100 transition-all hover:shadow-md hover:scale-[1.02]">
                  <div className="relative w-full h-full">
                    <NextImage src={url} alt={`Upload ${i}`} fill className="object-cover" unoptimized />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-xl p-2.5 transition-all hover:scale-110 shadow-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  {i === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-lg shadow-sm">
                      MAIN
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Virtual Tours & Video Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-border/50 shadow-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="bg-slate-50/50 border-b border-border/50 py-5">
            <CardTitle className="text-sm font-bold flex items-center gap-2.5 text-slate-700">
              <div className="p-1.5 rounded-lg bg-red-100/50">
                <Video className="h-4 w-4 text-red-500" />
              </div>
              Video Tour
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ModernField 
              label="YouTube / Vimeo URL" 
              {...register("videoUrl")}
              icon={Globe}
              value={videoUrl}
              placeholder="https://..."
            />
            <p className="text-[10px] text-slate-400 mt-2 ml-1 font-medium">Link should be publicly accessible</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/50 shadow-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="bg-slate-50/50 border-b border-border/50 py-5">
            <CardTitle className="text-sm font-bold flex items-center gap-2.5 text-slate-700">
              <div className="p-1.5 rounded-lg bg-emerald-100/50">
                <RotateCw className="h-4 w-4 text-emerald-500" />
              </div>
              360° Virtual View
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ModernField 
              label="360° View URL" 
              {...register("view360Url")}
              icon={Globe}
              value={view360Url}
              placeholder="https://..."
            />
            <p className="text-[10px] text-slate-400 mt-2 ml-1 font-medium">Matterport, Ricoh, or any 360 provider link</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
