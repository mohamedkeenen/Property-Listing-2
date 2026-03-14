import { useState } from "react";
import NextImage from "next/image";
import { Search, MessageCircle, Mail, Phone, MoreHorizontal, Eye, Trash2, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { mockLeads, mockListings, Lead } from "@/data/mockData";
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
  "Skyloov": "https://res.cloudinary.com/devht0mp5/image/upload/v1773486432/Logo-rebrand-blue_dwxrba.svg",
};

const statusColors: Record<string, string> = {
  New: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
  Contacted: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
  Qualified: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/30",
  Lost: "bg-red-500/10 text-red-500 dark:text-red-400 border-red-200 dark:border-red-500/30",
};

const sourceTabs = ["All", "Property Finder", "Bayut", "Skyloov", "Website"];
const statusTabs = ["All Statuses", "New", "Contacted", "Qualified", "Lost"];

export function LeadsTable() {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [subSourceFilter, setSubSourceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filtered = mockLeads.filter((l) => {
    const matchSource = sourceFilter === "All" || l.source === sourceFilter;
    const matchSubSource = subSourceFilter === "All" || l.subSource === subSourceFilter;
    const matchStatus = statusFilter === "All Statuses" || l.status === statusFilter;
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()) || l.property.toLowerCase().includes(search.toLowerCase());
    return matchSource && matchSubSource && matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const getProperty = (ref: string) => mockListings.find((l) => l.reference === ref);



  const handleDelete = (lead: Lead) => {
    toast({ title: "Lead Deleted", description: `${lead.name} has been removed.` });
  };

  const property = selectedLead ? getProperty(selectedLead.property) : null;

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col h-full">
        {/* Tabs and Filters */}
        <div className="flex flex-col gap-1 p-3 border-b border-border/10">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mr-2 shrink-0">Portal:</span>
            {sourceTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { 
                  if (tab === "Skyloov") return;
                  setSourceFilter(tab); 
                  setPage(1); 
                }}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap relative group",
                  sourceFilter === tab 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted",
                  tab === "Skyloov" && "opacity-40 cursor-not-allowed grayscale pointer-events-none"
                )}
              >
                {tab}
                {tab === "Skyloov" && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[6px] font-black px-1 py-0.5 rounded shadow-sm opacity-100 uppercase transform rotate-2 animate-pulse">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mr-2 shrink-0">Channel:</span>
              {["All", "WhatsApp", "Email", "Call"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setSubSourceFilter(tab); setPage(1); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    subSourceFilter === tab ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="ml-auto flex items-center gap-1">
              {statusTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setStatusFilter(tab); setPage(1); }}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    statusFilter === tab ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search leads..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 h-9 text-sm" />
          </div>
        </div>

        {/* Table Area - Flex and scrollable */}
        <div className="flex-1 overflow-auto w-full min-h-0">
          <Table className="relative">
            <TableHeader className="sticky top-0 bg-card z-10 shadow-[0_1px_0_rgba(0,0,0,0.1)]">
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Sub-Source</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow className="border-b-0">
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No leads found</TableCell>
                </TableRow>
              ) : (
                paginated.map((l) => {
                  const prop = getProperty(l.property);
                  return (
                    <TableRow key={l.id} className="hover:bg-muted/50 border-b-0">
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuItem onClick={() => setSelectedLead(l)}>
                              <Eye className="h-4 w-4 mr-2" /> Review
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(l)} className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">{l.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{l.name}</p>
                            <p className="text-xs text-muted-foreground">{l.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">{l.phone}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-12 flex items-center justify-center shrink-0">
                            {portalLogos[l.source] ? (
                              <div className="relative h-4 w-full">
                                <NextImage src={portalLogos[l.source]} alt={l.source} fill className="object-contain" />
                              </div>
                            ) : l.source === "Website" ? (
                              <Globe className="h-4 w-4 text-cyan-500" />
                            ) : null}
                          </div>
                          <span className={cn(
                            "text-xs font-semibold",
                            l.source === "Website" ? "text-cyan-500" : "text-foreground/80"
                          )}>
                            {l.source}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {(() => {
                            const sub = subSourceIcon[l.subSource];
                            return <><sub.icon className={`h-4 w-4 ${sub.color}`} /><span className="text-xs font-medium">{l.subSource}</span></>;
                          })()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {prop ? (
                          <div className="flex items-center gap-2">
                            <div className="relative h-8 w-12 rounded overflow-hidden shrink-0">
                              <NextImage src={prop.image} alt={prop.title} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate max-w-[140px]">{prop.title}</p>
                              <p className="text-[10px] text-muted-foreground">{l.property}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="font-mono text-xs">{l.property}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${statusColors[l.status]}`}>{l.status}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{l.date}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Show</span>
            <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
              <SelectTrigger className="h-8 w-16"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>of {filtered.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm px-2">{page} / {Math.max(totalPages, 1)}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-lg">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">Lead Details</DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="text-lg bg-primary/10 text-primary font-bold">{selectedLead.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{selectedLead.name}</h3>
                  <Badge variant="outline" className={`text-xs ${statusColors[selectedLead.status]}`}>{selectedLead.status}</Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="text-foreground font-medium">{selectedLead.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="text-foreground font-medium">{selectedLead.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium">Source</p>
                  <div className="flex items-center gap-3">
                    <div className="w-16 flex items-center justify-center shrink-0 bg-white/5 rounded-md p-1.5 h-10">
                      {portalLogos[selectedLead.source] ? (
                        <div className="relative h-6 w-full">
                          <NextImage src={portalLogos[selectedLead.source]} alt={selectedLead.source} fill className="object-contain" />
                        </div>
                      ) : selectedLead.source === "Website" ? (
                        <Globe className="h-6 w-6 text-cyan-500" />
                      ) : null}
                    </div>
                    <span className={cn(
                      "text-sm font-bold",
                      selectedLead.source === "Website" ? "text-cyan-500" : "text-foreground"
                    )}>
                      {selectedLead.source}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Sub-Source</p>
                  <div className="flex items-center gap-1.5">
                    {(() => {
                      const sub = subSourceIcon[selectedLead.subSource];
                      return <><sub.icon className={`h-4 w-4 ${sub.color}`} /><span className="font-medium text-xs">{selectedLead.subSource}</span></>;
                    })()}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Date</p>
                  <p className="text-foreground font-medium">{selectedLead.date}</p>
                </div>
              </div>

              {/* Property reference */}
              {property && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-foreground">Interested Property</h4>
                    <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                    <div className="relative h-16 w-24 rounded-lg overflow-hidden shrink-0">
                      <NextImage src={property.image} alt={property.title} fill className="object-cover" />
                    </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{property.title}</p>
                        <p className="text-xs text-muted-foreground">{property.reference} • {property.community}</p>
                        <p className="text-sm font-bold text-primary mt-1">
                          AED {property.price.toLocaleString()}
                          {property.purpose === "Rent" && <span className="text-xs font-normal text-muted-foreground"> /year</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
