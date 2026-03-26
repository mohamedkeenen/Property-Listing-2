"use client";

import { FileText, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentSettingsProps {
  formData: any;
  themeColor: string;
  isGenerating: boolean;
  handleInputChange: (field: string, value: string) => void;
  generatePDF: () => void;
}

export function DocumentSettings({
  formData,
  themeColor,
  isGenerating,
  handleInputChange,
  generatePDF
}: DocumentSettingsProps) {

  return (
    <div className="sticky top-0 z-50 py-4 bg-background/80 backdrop-blur-md border-b mb-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl shadow-lg transition-colors duration-500" style={{ backgroundColor: `hsl(var(--primary) / 0.1)`, color: 'var(--primary)' }}>
            <FileText className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              Sales Offer <span style={{ color: 'var(--primary)' }}>Creator</span>
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Premium Document Suite</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-muted/40 rounded-2xl border border-border/40">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <input 
              type="color" 
              value={themeColor}
              onChange={(e) => handleInputChange('themeColor', e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none overflow-hidden"
            />
            <span className="text-[10px] font-bold uppercase tracking-tighter w-16 tabular-nums">{themeColor}</span>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-muted/40 rounded-2xl border border-border/40">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Reference Token"
              value={formData.referenceToken}
              onChange={(e) => handleInputChange('referenceToken', e.target.value)}
              className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest outline-none w-32 placeholder:text-muted-foreground/40"
            />
          </div>


          <Button 
            onClick={generatePDF} 
            disabled={isGenerating}
            className="h-12 px-8 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all group border-none"
            style={{ 
              backgroundColor: 'var(--primary)',
              boxShadow: `0 10px 20px -5px hsl(var(--primary) / 0.4)`,
              color: 'var(--primary-foreground)'
            }}
          >
            {isGenerating ? "Processing..." : (
              <>
                Generate Offer
                <Sparkles className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
