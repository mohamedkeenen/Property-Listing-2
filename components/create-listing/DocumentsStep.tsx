"use client";

import { UseFormReturn } from "react-hook-form";
import { Upload, X, FileText, Info, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  form: UseFormReturn<any>;
}

export function DocumentsStep({ form }: Props) {
  const { watch, setValue, getValues } = form;
  const docs = watch("documents") || [];

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const currentDocs = getValues("documents") || [];
        
        // We store an object for metadata along with the base64
        const docEntry = JSON.stringify({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type || "Document",
          data: base64String
        });

        setValue("documents", [...currentDocs, docEntry], { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDoc = (index: number) => {
    const newList = docs.filter((_: any, i: number) => i !== index);
    setValue("documents", newList, { shouldValidate: true });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="rounded-[2.5rem] border-border shadow-2xl overflow-hidden bg-background/50 backdrop-blur-sm">
        <CardHeader className="bg-muted/50 border-b border-border py-8 px-10">
          <CardTitle className="text-xl font-black flex items-center justify-between text-foreground tracking-tight">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <span>Documents & Attachments</span>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1 font-bold">Property Ledger & Proofs</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
               <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
               <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700">Secure Storage</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10 space-y-8">
          <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-border rounded-4xl p-16 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-500">
            <div className="p-6 rounded-3xl bg-muted group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500 mb-6">
              <Upload className="h-10 w-10 text-muted-foreground group-hover:text-primary" />
            </div>
            <span className="text-base font-black text-foreground tracking-tight">Drop files here or click to upload</span>
            <span className="text-xs text-muted-foreground mt-2 font-bold uppercase tracking-widest opacity-60">PDF, DOC, XLSX, JPG up to 20MB</span>
            <input type="file" multiple className="hidden" onChange={handleFiles} />
            
            <div className="absolute inset-0 rounded-4xl opacity-0 group-hover:opacity-100 border-2 border-primary/20 pointer-events-none transition-opacity" />
          </label>

          {docs.length > 0 ? (
            <div className="space-y-3">
               <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Uploaded Files ({docs.length})</span>
                  <button onClick={() => setValue("documents", [])} className="text-[10px] font-black uppercase tracking-widest text-destructive hover:opacity-70 transition-opacity">Clear All</button>
               </div>
              {docs.map((docJson: string, i: number) => {
                const doc = JSON.parse(docJson);
                return (
                  <div key={i} className="group flex items-center justify-between bg-muted/30 hover:bg-muted/50 border border-border/50 rounded-2xl p-4 transition-all animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-background border border-border text-primary group-hover:scale-110 transition-transform">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground tracking-tight">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{doc.size}</span>
                          <div className="h-1 w-1 rounded-full bg-border" />
                          <span className="text-[10px] text-primary/60 font-black uppercase tracking-widest">{doc.type.split('/')[1] || "DOC"}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeDoc(i)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 rounded-3xl bg-muted/20 border border-border/50 border-dashed">
               <div className="p-4 rounded-2xl bg-muted/50 mb-4 opacity-50">
                  <FileText className="h-8 w-8 text-muted-foreground" />
               </div>
               <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">No documents attached yet</p>
            </div>
          )}

          <div className="flex items-start gap-4 p-6 rounded-3xl bg-primary/5 border border-primary/10">
             <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                <Info className="h-5 w-5" />
             </div>
             <div>
                <h4 className="text-xs font-black text-primary uppercase tracking-wider mb-1">Upload Tip</h4>
                <p className="text-[11px] text-primary/70 font-bold leading-relaxed">
                  Attach Title Deeds, Floor Plans, and NOCs to speed up the verification process. High-quality PDFs are preferred.
                </p>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
