"use client";

import { FileText, LayoutGrid, Image as ImageIcon } from "lucide-react";

interface DescriptionProps {
  en: string;
  ar: string;
  titleEn?: string;
  titleAr?: string;
}

export function PropertyDescriptions({ en, ar, titleEn, titleAr }: DescriptionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="text-sm font-black text-foreground uppercase tracking-widest">{titleEn || "Description (English)"}</h3>
        </div>
        <p className="text-sm text-muted-foreground font-medium leading-[1.8] whitespace-pre-line">{en || "No description provided."}</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm" dir="rtl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-orange-500" />
          </div>
          <h3 className="text-sm font-black text-foreground uppercase tracking-widest font-arabic">{titleAr || "الوصف (عربي)"}</h3>
        </div>
        <p className="text-[15px] text-muted-foreground font-medium leading-loose font-arabic whitespace-pre-line">{ar || "لا يوجد وصف متوفر."}</p>
      </div>
    </div>
  );
}

export function PremiumDetails({ fields }: { fields: any[] }) {
  if (!fields || fields.length === 0) return null;

  return (
    <div className="bg-card backdrop-blur-xl border border-border rounded-xl p-8 space-y-12 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
          <LayoutGrid className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em]">Premium Selection Details</h3>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Exclusive Property Parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {fields.map((field, i) => {
          const isComplex = field.type === 'text_image' || field.type === 'image';
          if (isComplex) return null;

          return (
            <div key={i} className="flex flex-col gap-1.5 p-5 rounded-lg bg-muted/30 border border-border shadow-xs hover:bg-muted/50 transition-all">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                {field.name}
              </span>
              <span className="text-base font-black text-foreground tracking-tight uppercase">
                {field.value || "—"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {fields.map((field, i) => {
          const isTextImage = field.type === 'text_image';
          const isImage = field.type === 'image';

          if (!isTextImage && !isImage) return null;

          return (
            <div key={i} className="bg-muted/50 rounded-lg p-8 border border-border flex flex-col gap-6 shadow-sm group hover:bg-muted/70 transition-all">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{field.name}</span>
              </div>
              
              <div className="w-full aspect-square md:aspect-16/10 rounded-lg overflow-hidden shadow-lg border border-border group-hover:scale-[1.01] transition-transform duration-500">
                {field.value?.image || (typeof field.value === 'string' && (field.value.startsWith('http') || field.value.startsWith('data:'))) ? (
                  <img src={field.value?.image || field.value} alt={field.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {isTextImage && (
                <div className="space-y-2">
                  <p className="text-xl font-black text-foreground leading-snug tracking-tight">
                    {field.value?.text || "Detailed Property Feature"}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
