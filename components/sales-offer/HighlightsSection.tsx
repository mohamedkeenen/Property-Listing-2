"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface HighlightsSectionProps {
  images: any;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: string, index: number) => void;
  removeImage: (type: string, index: number) => void;
  highlightInputRefs: React.RefObject<HTMLInputElement | null>[];
}

export function HighlightsSection({
  images,
  handleImageUpload,
  removeImage,
  highlightInputRefs
}: HighlightsSectionProps) {
  const activeHighlights = images.highlights.slice(0, 2);

  return (
    <section className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black py-1 px-3 rounded-full border bg-amber-500/5 text-amber-500 tracking-widest uppercase">Page 03</span>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/80">Lifestyle & Amenities Highlights</h2>
        </div>
        <p className="text-xs text-muted-foreground ml-14">High-resolution lifestyle captures of the project (Max 2 images).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {activeHighlights.map((img: string | null, idx: number) => (
          <div key={idx} className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-2">Visual Highlight {idx + 1}</Label>
            <div className={cn("relative group h-80 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 overflow-hidden bg-muted/5", img ? "border-transparent" : "border-border/60 hover:border-primary/40 cursor-pointer")} onClick={() => !img && highlightInputRefs[idx].current?.click()}>
              {img ? (
                <>
                  <img src={img} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); removeImage('highlights', idx); }} className="rounded-xl">Remove</Button>
                  </div>
                </>
              ) : <div className="absolute inset-0 flex items-center justify-center"><Plus className="h-10 w-10 text-muted-foreground/40" /></div>}
              <input ref={highlightInputRefs[idx]} type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'highlights', idx)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
