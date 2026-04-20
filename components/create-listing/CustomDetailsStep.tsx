"use client";

import { useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, Layers, Hash, Type, Image as ImageIcon, PlusCircle, X 
} from "lucide-react";
import { ModernField } from "@/components/ui/modern-field";
import { useGetCustomFieldsQuery } from "@/api/redux/services/settingsApi";

interface Props {
  form: UseFormReturn<any>;
}

export function CustomDetailsStep({ form }: Props) {
  const { setValue, watch } = form;
  const { data: customFieldsData } = useGetCustomFieldsQuery();
  const customFields = customFieldsData?.data || [];
  const customValues = watch("custom_values") || {};
  const [activeCustomFieldId, setActiveCustomFieldId] = useState<number | null>(null);
  const fileInputCustomRef = useRef<HTMLInputElement>(null);

  const handleCustomFieldChange = (fieldId: number, value: any) => {
    setValue("custom_values", {
      ...customValues,
      [fieldId]: value
    });
  };

  const handleCustomImageClick = (fieldId: number) => {
    setActiveCustomFieldId(fieldId);
    fileInputCustomRef.current?.click();
  };

  const onCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length || activeCustomFieldId === null) return;
    
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const field = customFields.find((f: any) => f.id === activeCustomFieldId);
      
      if (field?.type === 'text_image') {
        handleCustomFieldChange(activeCustomFieldId, {
          ...(customValues[activeCustomFieldId] || {}),
          image: base64
        });
      } else {
        handleCustomFieldChange(activeCustomFieldId, base64);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  if (customFields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <LayoutGrid className="h-10 w-10 text-muted-foreground/30" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">No Custom Fields</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Configure dynamic property fields in company settings to add specialized data to your listings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-8 pb-20">
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <LayoutGrid className="h-4 w-4" />
             </div>
             <h3 className="text-sm font-bold text-foreground">Custom Listing Details</h3>
             <div className="h-px flex-1 bg-border/20" />
             <Layers className="h-4 w-4 text-muted-foreground/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 bg-card/30 p-10 rounded-4xl border border-border/20 shadow-sm transition-all duration-500">
            {customFields.map((field: any) => {
              const value = customValues[field.id];

              if (field.type === 'text' || field.type === 'number') {
                return (
                  <ModernField 
                    key={field.id}
                    label={field.name} 
                    icon={field.type === 'number' ? Hash : Type} 
                    value={value || ""}
                    type={field.type === 'number' ? 'number' : 'text'}
                    onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                    onClear={() => handleCustomFieldChange(field.id, "")}
                    placeholder={`Enter ${field.name}...`}
                  />
                );
              }

              if (field.type === 'image') {
                 return (
                   <div key={field.id} className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                       {field.name}
                     </Label>
                     <div 
                       onClick={() => handleCustomImageClick(field.id)}
                       className={cn(
                         "h-48 rounded-4xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-500 overflow-hidden relative group",
                         value ? "border-primary/30" : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                       )}
                     >
                       {value ? (
                         <>
                           <img src={value} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500 backdrop-blur-sm">
                             <PlusCircle className="h-10 w-10 text-white scale-90 group-hover:scale-100 transition-transform" />
                           </div>
                         </>
                       ) : (
                         <>
                           < ImageIcon className="h-8 w-8 text-muted-foreground/20 group-hover:text-primary/40 transition-colors" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 group-hover:text-primary/60">Upload {field.name}</span>
                         </>
                       )}
                     </div>
                   </div>
                 );
              }

              if (field.type === 'text_image') {
                const textVal = value?.text || "";
                const imgVal = value?.image || "";

                return (
                  <div key={field.id} className="md:col-span-2">
                    <div className={cn(
                      "relative flex w-full rounded-4xl border transition-all duration-500 bg-background/50 p-4 gap-6 min-h-[100px] items-center",
                      "border-border hover:border-primary/20 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 shadow-sm"
                    )}>
                      <div 
                        onClick={() => handleCustomImageClick(field.id)}
                        className={cn(
                          "h-24 w-40 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden relative shrink-0 group/img",
                          imgVal ? "border-primary/30" : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                        )}
                      >
                        {imgVal ? (
                           <>
                             <img src={imgVal} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/20 group-hover/img:bg-black/40 flex items-center justify-center transition-all backdrop-blur-[2px]">
                               <ImageIcon className="h-5 w-5 text-white" />
                             </div>
                           </>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-muted-foreground/20" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 text-center">Attach Photo</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 relative h-full flex flex-col justify-center">
                        <input 
                          type="text"
                          value={textVal}
                          onChange={(e) => handleCustomFieldChange(field.id, { ...value, text: e.target.value })}
                          className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground outline-none p-0 placeholder:text-muted-foreground/20 leading-relaxed"
                          placeholder={`Add a description for ${field.name}...`}
                        />
                        <label className="absolute -top-6 left-0 text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-background dark:bg-slate-900 px-2 rounded-full py-0.5 shadow-sm border border-primary/20">
                          {field.name}
                        </label>
                      </div>

                      {textVal && (
                        <button 
                          type="button" 
                          onClick={() => handleCustomFieldChange(field.id, { ...value, text: "" })}
                          className="shrink-0 text-muted-foreground hover:text-foreground transition-all p-2 rounded-full hover:bg-muted/50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </section>

        <input 
          type="file" 
          ref={fileInputCustomRef} 
          className="hidden" 
          accept="image/*"
          onChange={onCustomImageUpload}
        />
      </div>
    </div>
  );
}
