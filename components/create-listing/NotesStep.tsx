import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Info } from "lucide-react";

interface Props {
  form: UseFormReturn<any>;
}

export function NotesStep({ form }: Props) {
  const { register, watch } = form;
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="rounded-[2.5rem] border-border shadow-2xl overflow-hidden bg-background/50 backdrop-blur-sm">
        <CardHeader className="bg-muted/50 border-b border-border py-8 px-10">
          <CardTitle className="text-xl font-black flex items-center justify-between text-foreground tracking-tight">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <StickyNote className="h-6 w-6" />
              </div>
              <div>
                <span>Internal Notes</span>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1 font-bold">Private & Confidential</p>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10 space-y-8">
          <div className="relative group">
            <Textarea 
              {...register("notes")} 
              className="min-h-[320px] rounded-3xl border-border border-2 bg-background focus:border-primary focus:ring-primary focus:ring-opacity-5 transition-all p-8 text-sm font-bold text-foreground placeholder:text-muted-foreground/20 shadow-inner resize-none"
              placeholder="Type any private notes or internal remarks about this property here..."
            />
            <div className="absolute top-0 left-8 px-3 bg-background text-[10px] font-black text-primary -translate-y-1/2 uppercase tracking-widest border border-border rounded-lg shadow-sm">
              Note Content
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20">
             <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
                <Info className="h-5 w-5" />
             </div>
             <div>
                <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider mb-1">Privacy Notice</h4>
                <p className="text-[11px] text-amber-700/80 font-bold leading-relaxed">
                  These notes are for internal use only by your agency. They will NOT be published to any portal or shown to potential clients.
                </p>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
