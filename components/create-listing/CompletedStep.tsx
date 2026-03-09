import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

interface Props {
  form: UseFormReturn<any>;
}

const publishOptions = [
  { value: "publish", label: "Publish", desc: "Publish listing to selected portals immediately" },
  { value: "draft", label: "Save as Draft", desc: "Save for later editing" },
  { value: "approval", label: "Send for Approval", desc: "Send to manager for review and approval" },
  { value: "pocket", label: "Save as Pocket Listing", desc: "Keep as a private off-market listing" },
];

export function CompletedStep({ form }: Props) {
  const { watch, setValue } = form;
  const publishStatus = watch("publishStatus") || "publish";

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Ready to Publish</h2>
        <p className="text-sm text-muted-foreground mt-1">Choose how you'd like to save this listing</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Publishing Status</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={publishStatus} onValueChange={(v) => setValue("publishStatus", v)} className="space-y-3">
            {publishOptions.map((opt) => (
              <div key={opt.value} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${publishStatus === opt.value ? "border-primary bg-primary/5" : "border-border"}`}>
                <RadioGroupItem value={opt.value} id={opt.value} className="mt-0.5" />
                <Label htmlFor={opt.value} className="cursor-pointer">
                  <span className="text-sm font-medium">{opt.label}</span>
                  <span className="text-xs text-muted-foreground block mt-0.5">{opt.desc}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
