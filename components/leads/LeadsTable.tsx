import { useState } from "react";
import NextImage from "next/image";
import { Search, MessageCircle, Mail, Phone, MoreHorizontal, Eye, ChevronLeft, ChevronRight, Globe, Facebook, Users, RefreshCw, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { mockListings, Lead } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const subSourceIcon: Record<string, { icon: typeof MessageCircle; color: string }> = {
  WhatsApp: { icon: MessageCircle, color: "text-green-500" },
  Email: { icon: Mail, color: "text-blue-500" },
  Call: { icon: Phone, color: "text-orange-500" },
};

const portalLogos: Record<string, string> = {
  "Property Finder": "https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/PF_ljkahc.png",
  "Bayut": "https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/bayut_gy4ev2.png",
  "Facebook": "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg",
  "PropQA": "https://res.cloudinary.com/devht0mp5/image/upload/v1777361218/logo-header-white.QoQUc6PB_ao5mn9.svg",
};

const statusColors: Record<string, string> = {
  New: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
  Contacted: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
  Qualified: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/30",
  Lost: "bg-red-500/10 text-red-500 dark:text-red-400 border-red-200 dark:border-red-500/30",
};

const sourceTabs = ["All", "Property Finder", "Bayut", "Facebook", "Website", "PropQA"];
const statusTabs = ["All Statuses", "New", "Contacted", "Qualified", "Lost"];

import { useGetPropertiesQuery } from "@/api/redux/services/propertyApi";
import { mapBackendPropertyToFrontend } from "@/lib/mappers";
import { SkeletonLead } from "@/components/skeleton/SkeletonLead";

interface LeadsTableProps {
  leads?: any[];
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearchChange?: (search: string) => void;
  onSourceChange?: (source: string) => void;
  onSubSourceChange?: (subSource: string) => void;
  onStatusChange?: (status: string) => void;
  totalCount?: number;
  currentPage?: number;
  limit?: number;
  filters: {
    source: string;
    subSource: string;
    status: string;
    search: string;
  };
  onSync?: () => void;
  isSyncing?: boolean;
  isLoading?: boolean;
}

export function LeadsTable({ 
  leads = [], 
  onPageChange,
  onLimitChange,
  onSearchChange,
  onSourceChange,
  onSubSourceChange,
  onStatusChange,
  totalCount = 0, 
  currentPage = 1,
  limit = 50,
  filters,
  onSync,
  isSyncing,
  isLoading
}: LeadsTableProps) {
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const totalPages = Math.ceil(totalCount / limit);

  const { data: propertiesData } = useGetPropertiesQuery({});
  const properties = propertiesData?.data?.map(mapBackendPropertyToFrontend) || [];

  const getProperty = (ref: string) => properties.find((l: any) => l.reference === ref);

  const property = selectedLead ? getProperty(selectedLead.property) : null;

  // Pagination Logic: Dynamic sliding window
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full shadow-sm">
        {/* Tabs and Filters */}
        <div className="flex flex-col gap-1 p-3 border-b border-border/10">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 snap-x">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mr-2 shrink-0">Portal</span>
            {sourceTabs.map((tab) => {
              const active: Record<string, string> = {
                All: "bg-primary text-primary-foreground shadow-primary/20",
                "Property Finder": "bg-orange-500 text-white shadow-orange-500/20",
                Bayut: "bg-emerald-500 text-white shadow-emerald-500/20",
                Facebook: "bg-blue-600 text-white shadow-blue-600/20",
                Website: "bg-cyan-500 text-white shadow-cyan-500/20",
                PropQA: "bg-purple-600 text-white shadow-purple-600/20",
              };
              const colors: Record<string, string> = {
                All: "hover:bg-primary/10 hover:text-primary",
                "Property Finder": "hover:bg-orange-500/10 hover:text-orange-500",
                Bayut: "hover:bg-emerald-500/10 hover:text-emerald-500",
                Facebook: "hover:bg-blue-600/10 hover:text-blue-600",
                Website: "hover:bg-cyan-500/10 hover:text-cyan-500",
                PropQA: "hover:bg-purple-600/10 hover:text-purple-600",
              };

              return (
                <button
                  key={tab}
                  onClick={() => onSourceChange?.(tab)}
                  className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap snap-start",
                    filters.source === tab 
                      ? cn(active[tab], "shadow-lg") 
                      : cn("text-muted-foreground bg-muted/30 border border-border/40 hover:bg-muted/80", colors[tab])
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 overflow-x-auto overflow-y-hidden no-scrollbar">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mr-2 shrink-0">Channel:</span>
              {["All", "WhatsApp", "Email", "Call"].map((tab) => {
                const active: Record<string, string> = {
                  All: "bg-primary/10 text-primary border-primary/20",
                  WhatsApp: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                  Email: "bg-blue-500/10 text-blue-500 border-blue-500/20",
                  Call: "bg-orange-500/10 text-orange-500 border-orange-500/20",
                };

                return (
                  <button
                    key={tab}
                    onClick={() => onSubSourceChange?.(tab)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap",
                      filters.subSource === tab 
                        ? cn(active[tab], "shadow-sm shadow-black/5") 
                        : "text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
            
            <div className="ml-auto flex items-center gap-1 overflow-x-auto overflow-y-hidden no-scrollbar">
              {statusTabs.map((tab) => {
                const activeColors: Record<string, string> = {
                  "All Statuses": "bg-primary text-primary-foreground shadow-primary/20",
                  New: "bg-emerald-500 text-white shadow-emerald-500/20",
                  Contacted: "bg-blue-500 text-white shadow-blue-500/20",
                  Qualified: "bg-purple-500 text-white shadow-purple-500/20",
                  Lost: "bg-red-500 text-white shadow-red-500/20",
                };

                return (
                  <button
                    key={tab}
                    onClick={() => onStatusChange?.(tab)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap",
                      filters.status === tab 
                        ? cn(activeColors[tab], "shadow-sm shadow-black/5") 
                        : "text-muted-foreground/70 hover:bg-muted/50"
                    )}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search & Sync */}
        <div className="p-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search leads database..." 
                value={filters.search} 
                onChange={(e) => onSearchChange?.(e.target.value)} 
                className="pl-9 h-10 text-sm rounded-xl focus:ring-primary/20" 
              />
            </div>
            
            <Button 
                variant="outline" 
                size="sm" 
                onClick={onSync} 
                disabled={isSyncing}
                className="ml-auto rounded-xl gap-2 font-black text-[10px] uppercase tracking-widest h-10 px-4 border-2 border-primary/20 bg-background text-primary hover:border-primary hover:bg-primary/5 transition-all shadow-sm hover:shadow-primary/5"
            >
                <RefreshCw className={cn("h-3 w-3", isSyncing && "animate-spin")} />
                {isSyncing ? "Syncing..." : "Refresh Bitrix"}
            </Button>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto w-full min-h-0">
          <Table className="relative">
            <TableHeader className="sticky top-0 bg-card z-10 shadow-[0_1px_0_rgba(0,0,0,0.1)]">
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Lead</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] hidden lg:table-cell">Contact</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] hidden md:table-cell">Portal</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] hidden xl:table-cell">Source</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Property</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Status</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] hidden sm:table-cell">Inquiry Date</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <SkeletonLead />
              ) : leads.length === 0 ? (
                <TableRow className="border-b-0">
                  <TableCell colSpan={8} className="text-center py-24">
                    <div className="flex flex-col items-center gap-3">
                        <Users className="h-12 w-12 text-muted-foreground/10" />
                        <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">No matching leads found in system</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((l) => {
                  const prop = getProperty(l.property);
                  return (
                    <TableRow key={l.id} className="hover:bg-muted/30 border-b-0 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            onClick={() => setSelectedLead(l)} 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10 transition-all active:scale-90"
                            title="Review Lead"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 ring-2 ring-primary/5">
                            <AvatarFallback className="text-xs bg-primary/5 text-primary font-bold">{l.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-foreground truncate max-w-[150px]">{l.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{l.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-[11px] font-mono whitespace-nowrap text-foreground">{l.phone}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                            {portalLogos[l.source] ? (
                              <div className="relative h-4 w-8 shrink-0">
                                <NextImage src={portalLogos[l.source]} alt={l.source} fill className="object-contain" />
                              </div>
                            ) : l.source === "Website" ? (
                              <Globe className="h-4 w-4 text-cyan-500" />
                            ) : l.source === "Facebook" ? (
                              <Facebook className="h-4 w-4 text-blue-600" />
                            ) : <div className="h-4 w-4 rounded bg-muted" />}
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-wider",
                            l.source === "Website" ? "text-cyan-600" : 
                            l.source === "Property Finder" ? "text-orange-600" :
                            l.source === "Bayut" ? "text-emerald-600" :
                            l.source === "Facebook" ? "text-blue-700" :
                            l.source === "PropQA" ? "text-purple-700" :
                            "text-foreground/80"
                          )}>
                            {l.source}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {l.sub_source && (
                           <div className="flex items-center gap-1.5">
                             {(() => {
                               const sub = subSourceIcon[l.sub_source] || { icon: MessageCircle, color: "text-muted-foreground" };
                               return <><sub.icon className={`h-3.5 w-3.5 ${sub.color}`} /><span className="text-[10px] font-bold uppercase">{l.sub_source}</span></>;
                             })()}
                           </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {prop ? (
                          <div className="flex items-center gap-2">
                            <div className="relative h-8 w-12 rounded-md overflow-hidden shrink-0 shadow-sm">
                              <NextImage src={prop.image} alt={prop.title} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold truncate max-w-[140px] leading-tight">{prop.title}</p>
                              <p className="text-[9px] text-muted-foreground font-mono">{l.property}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="font-mono text-[10px] text-muted-foreground">{l.property}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0", statusColors[l.status])}>{l.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-[10px] font-medium text-muted-foreground/60">
                        {l.bitrix_created_at ? new Date(l.bitrix_created_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          onClick={() => setSelectedLead(l)} 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-xl text-primary hover:bg-primary/20 hover:scale-110 transition-all active:scale-95"
                          title="View Lead"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className="border-t border-border/40 bg-muted/20 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 order-2 sm:order-1">
              <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Rows per page:</span>
                  <Select
                      value={limit.toString()}
                      onValueChange={(val) => {
                          onLimitChange?.(Number(val));
                      }}
                  >
                      <SelectTrigger className="h-8 w-16 rounded-lg bg-background/50 border-border/40 text-[10px] font-black">
                          <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/10 backdrop-blur-3xl bg-background/95">
                          {[10, 20, 50, 100].map((num) => (
                              <SelectItem key={num} value={num.toString()} className="text-[10px] font-black rounded-lg">
                                  {num}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
              <div className="h-4 w-px bg-border/40 hidden sm:block" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                  Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} leads
              </span>
          </div>

          <div className="flex items-center gap-2 order-1 sm:order-2">
              <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 rounded-lg border-border/40 hover:bg-muted disabled:opacity-30 transition-all"
              >
                  <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum) => (
                      <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => onPageChange?.(pageNum)}
                          className={cn(
                              "h-8 min-w-[32px] rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                              currentPage === pageNum ? "shadow-lg shadow-primary/20" : "border-border/40 hover:bg-muted"
                          )}
                      >
                          {pageNum}
                      </Button>
                  ))}
              </div>

              <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 rounded-lg border-border/40 hover:bg-muted disabled:opacity-30 transition-all"
              >
                  <ChevronRight className="h-4 w-4" />
              </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-lg rounded-xl">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-black uppercase tracking-tight">Lead Information</DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-4 py-2">
                <Avatar className="h-16 w-16 ring-4 ring-primary/10">
                  <AvatarFallback className="text-xl bg-primary/5 text-primary font-black uppercase">{selectedLead.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-black text-foreground text-xl tracking-tight">{selectedLead.name}</h3>
                  <Badge variant="outline" className={cn("text-[10px] font-black uppercase mt-1", statusColors[selectedLead.status])}>{selectedLead.status}</Badge>
                </div>
              </div>

              <Separator className="opacity-50" />

              <div className="grid grid-cols-2 gap-6 py-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Email Address</p>
                  <p className="text-foreground font-bold text-sm">{selectedLead.email || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Phone Number</p>
                  <p className="text-foreground font-bold text-sm">{selectedLead.phone || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Primary Source</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-12 h-8 flex items-center justify-center bg-muted/30 rounded-lg p-1">
                      {portalLogos[selectedLead.source] ? (
                        <NextImage src={portalLogos[selectedLead.source]} alt={selectedLead.source} width={30} height={30} className="object-contain" />
                      ) : <Globe className="h-4 w-4" />}
                    </div>
                    <span className="text-xs font-black uppercase">{selectedLead.source}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Inquiry Channel</p>
                  <div className="flex items-center gap-2 mt-1">
                    {(() => {
                      const sub = subSourceIcon[selectedLead.sub_source] || { icon: MessageCircle, color: "text-muted-foreground" };
                      return <><sub.icon className={`h-4 w-4 ${sub.color}`} /><span className="font-black text-xs uppercase">{selectedLead.sub_source}</span></>;
                    })()}
                  </div>
                </div>
              </div>

              {selectedLead.comments && (
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Lead message & comments</h4>
                  <div className="bg-muted/10 rounded-2xl p-4 border border-border/10">
                    <p className="text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed font-medium">{selectedLead.comments}</p>
                  </div>
                </div>
              )}

              {property && (
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Attached Property</h4>
                  <div className="flex gap-4 bg-muted/20 rounded-2xl p-4 border border-border/10">
                    <div className="relative h-20 w-28 rounded-xl overflow-hidden shadow-lg school-0">
                      <NextImage src={property.image} alt={property.title} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 pt-1">
                      <p className="text-sm font-black text-foreground leading-tight">{property.title}</p>
                      <p className="text-[10px] text-muted-foreground font-bold mt-1">{property.reference} • {property.community}</p>
                      <p className="text-primary font-black mt-2 text-lg">
                        AED {property.price.toLocaleString()}
                        {property.purpose === "Rent" && <span className="text-[10px] font-bold text-muted-foreground ml-1 uppercase">/ YEAR</span>}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
