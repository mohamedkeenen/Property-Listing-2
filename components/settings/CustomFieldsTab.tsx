"use client";

import { useState } from "react";
import { Plus, Trash2, List, Search, Loader2, Type, Hash, Image as ImageIcon, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetCustomFieldsQuery, useAddCustomFieldMutation, useDeleteCustomFieldMutation } from "@/api/redux/services/settingsApi";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface CustomFieldsTabProps {
  isAdmin: boolean;
  isSupervisor?: boolean;
}

export function CustomFieldsTab({ isAdmin, isSupervisor }: CustomFieldsTabProps) {
  const { data: fieldsData, isLoading } = useGetCustomFieldsQuery();
  const [addField, { isLoading: isAdding }] = useAddCustomFieldMutation();
  const [deleteField] = useDeleteCustomFieldMutation();

  const fields = fieldsData?.data || [];
  
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("text");
  const [search, setSearch] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    try {
      await addField({ name: newName.trim(), type: newType }).unwrap();
      setNewName("");
      toast.success("Custom field added");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add field");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteField(id).unwrap();
      toast.success("Field removed");
    } catch (err: any) {
      toast.error("Failed to remove field");
    }
  };

  const filteredFields = fields.filter((f: any) => f.name.toLowerCase().includes(search.toLowerCase()));

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="h-4 w-4" />;
      case 'number': return <Hash className="h-4 w-4" />;
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'text_image': return <Layers className="h-4 w-4" />;
      default: return <Type className="h-4 w-4" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'text': return 'Text Input';
      case 'number': return 'Number Input';
      case 'image': return 'Image Upload';
      case 'text_image': return 'Combined (Text + Image)';
      default: return type;
    }
  };

  return (
    <Card className="rounded-2xl border-border/50 shadow-xl overflow-hidden backdrop-blur-sm bg-card/50">
      <CardHeader className="border-b border-border/10 bg-muted/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <List className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="font-black text-xl">Custom Inputs</CardTitle>
            <CardDescription className="font-medium">Create dynamic fields that will appear in the property listing form.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Field Label (e.g. Garden Size, View Type...)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="rounded-xl border-border/50 bg-background/50 h-11"
              disabled={!isAdmin || isAdding}
            />
          </div>
          <div className="w-full md:w-56">
            <Select value={newType} onValueChange={setNewType} disabled={!isAdmin || isAdding}>
              <SelectTrigger className="rounded-xl border-border/50 bg-background/50 h-11 font-bold">
                <SelectValue placeholder="Input Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50">
                <SelectItem value="text">Text Input</SelectItem>
                <SelectItem value="number">Number Input</SelectItem>
                <SelectItem value="image">Image Upload</SelectItem>
                <SelectItem value="text_image">Combined (Text + Image)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="submit" 
            className="rounded-xl h-11 px-6 bg-primary hover:bg-primary/90 text-white font-bold transition-all active:scale-95 whitespace-nowrap"
            disabled={!isAdmin || !newName.trim() || isAdding}
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Create Field
          </Button>
        </form>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search custom fields..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border-none bg-muted/30 h-10 pl-10 text-sm"
          />
        </div>

        <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar border-t border-border/10 pt-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : filteredFields.length > 0 ? (
            filteredFields.map((field: any) => (
              <div 
                key={field.id} 
                className="group flex items-center justify-between p-4 rounded-xl bg-background/40 border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/5 text-primary/60 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {getTypeIcon(field.type)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground/80">{field.name}</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                      {getTypeText(field.type)}
                    </div>
                  </div>
                </div>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(field.id)}
                    className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-border/50 bg-muted/20">
              <List className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm font-bold text-muted-foreground">No custom fields defined</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Fields created here will appear in the property form.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
