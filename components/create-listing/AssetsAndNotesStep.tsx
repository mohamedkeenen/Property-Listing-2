"use client";

import { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { FileText, PlusCircle, X, StickyNote } from "lucide-react";
import { ModernField } from "@/components/ui/modern-field";

interface Props {
  form: UseFormReturn<any>;
}

export function AssetsAndNotesStep({ form }: Props) {
  const { register, setValue, watch } = form;
  const docInputRef = useRef<HTMLInputElement>(null);
  const documents = watch("documents") || [];

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const docEntry = JSON.stringify({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type || "Document",
          data: reader.result as string
        });
        const currentDocs = watch("documents") || [];
        setValue("documents", [...currentDocs, docEntry], { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDoc = (index: number) => {
    const newList = documents.filter((_: any, i: number) => i !== index);
    setValue("documents", newList, { shouldValidate: true });
  };

  return (
    <div>
      <div className="space-y-12 pb-20">
        {/* Section 1: Documents */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <FileText className="h-4 w-4" />
             </div>
             <h3 className="text-sm font-bold text-foreground">Internal Documents</h3>
             <div className="h-px flex-1 bg-border/20" />
             <PlusCircle className="h-4 w-4 text-muted-foreground/30" />
          </div>

          <div className="bg-card/30 p-8 rounded-4xl border border-border/20">
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => docInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all text-xs font-bold text-muted-foreground"
              >
                <PlusCircle className="h-4 w-4" /> Add Document
                <input ref={docInputRef} type="file" multiple className="hidden" onChange={handleDocUpload} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((docJson: string, i: number) => {
                  let doc;
                  try {
                    doc = JSON.parse(docJson);
                  } catch (e) {
                    doc = docJson;
                  }
                  return (
                    <div key={i} className="flex items-center justify-between bg-muted/20 border border-border/40 rounded-2xl p-4">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-bold truncate">{doc.name || doc.title || "Document"}</p>
                          <p className="text-[10px] text-muted-foreground">{doc.size || "Unknown size"}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeDoc(i)} className="text-muted-foreground hover:text-destructive p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Internal Notes */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-gray-500/10 text-gray-500">
                <StickyNote className="h-4 w-4" />
             </div>
             <h3 className="text-sm font-bold text-foreground">Internal Notes</h3>
             <div className="h-px flex-1 bg-border/20" />
             <FileText className="h-4 w-4 text-muted-foreground/30" />
          </div>

          <div className="bg-card/20 p-8 rounded-4xl border border-border/10 backdrop-blur-sm relative overflow-hidden group/notes transition-all duration-500 hover:border-primary/20">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/notes:opacity-10 transition-opacity duration-700 pointer-events-none">
              <StickyNote className="h-24 w-24 -rotate-12" />
            </div>
            <ModernField 
              label="Private Remarks" 
              icon={StickyNote} 
              value={watch("notes")}
              onClear={() => setValue("notes", "", { shouldValidate: true })}
              alignTop
            >
              <textarea 
                {...register("notes")} 
                className="w-full min-h-[160px] bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground outline-none p-0 resize-none placeholder:text-muted-foreground/30 leading-relaxed relative z-10"
                placeholder="Type your internal notes here... These are only visible to your team and won't be shared on portals."
              />
            </ModernField>
          </div>
        </section>
      </div>
    </div>
  );
}
