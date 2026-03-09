import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote } from "lucide-react";

interface Props {
  form: UseFormReturn<any>;
}

export function NotesStep({ form }: Props) {
  const { register } = form;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <StickyNote className="h-4 w-4" /> Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea {...register("notes")} rows={8} className="text-sm" placeholder="Add any notes about this property listing..." />
      </CardContent>
    </Card>
  );
}
