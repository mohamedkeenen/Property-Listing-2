import { useRef, useState } from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Search, MoreHorizontal, FileDown, Bath, BedDouble, ArrowUpDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PropertyListing } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { generatePropertyPDF } from "@/lib/generatePDF";

interface Props {
  listings: PropertyListing[];  
  onViewDetails: (listing: PropertyListing) => void;
  onEdit: (listing: PropertyListing) => void;
}

const statusTabs = [
  { label: "All Listings", value: "all" },
  { label: "Live", value: "Live" },
  { label: "Draft", value: "Draft" },
  { label: "Pending", value: "Pending" },
  { label: "Archived", value: "Archived" },
  { label: "Pocket", value: "Pocket" },
];

const statusColors: Record<string, string> = {
  Live: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
  Draft: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30",
  Pending: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
  Archived: "bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-500/30",
  Pocket: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/30",
};

export function ListingsTable({ listings, onViewDetails, onEdit }: Props) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filtered = listings
    .filter((l) => activeTab === "all" || l.status === activeTab)
    .filter((l) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return l.title.toLowerCase().includes(s) || l.reference.toLowerCase().includes(s) || l.community.toLowerCase().includes(s);
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const tabCounts = (val: string) => val === "all" ? listings.length : listings.filter((l) => l.status === val).length;

  const handleDelete = (listing: PropertyListing) => {
    toast({ title: "Listing deleted", description: `${listing.reference} has been removed.` });
  };

  const handleDownloadPDF = async (listing: PropertyListing) => {
    toast({ title: "Generating PDF...", description: "Please wait while we prepare your document." });
    try {
      await generatePropertyPDF(listing);
      toast({ title: "PDF Downloaded", description: `${listing.reference}.pdf has been saved.` });
    } catch {
      toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" });
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? 0 : scrollRef.current.scrollWidth;
      scrollRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg w-full overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center gap-1 p-3 border-b border-border overflow-x-auto">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setActiveTab(tab.value); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label} ({tabCounts(tab.value)})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Table with Scroll Indicators */}
      <div className="relative group/table w-full">
        {/* Left Scroll Indicator */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-20 flex items-center justify-center transition-all opacity-0 group-hover/table:opacity-100 border-none"
          title="Scroll to Start"
        >
          <div className="h-12 w-6 bg-sky-300 hover:bg-sky-400 rounded-r-lg flex items-center justify-center shadow-lg transition-transform hover:scale-110">
            <ChevronLeft className="h-5 w-5 text-sky-950" />
          </div>
        </button>

        <div 
          ref={scrollRef} 
          className="overflow-x-auto w-full pb-4 scroll-smooth"
        >
          <Table className="min-w-[1800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Portals</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="min-w-[250px]">Title</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-3 w-3" /> Layout
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Type
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Price
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-3 w-3" /> Updated
                </div>
              </TableHead>
               <TableHead>Status</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-3 w-3" /> Listing Agent
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-3 w-3" /> Owner
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-3 w-3" /> Office
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                  No listings found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((l) => (
                <TableRow key={l.id} className="hover:bg-muted/50 border-b-0">
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44">
                        <DropdownMenuItem onClick={() => router.push(`/listing/${l.id}`)}>
                          <Eye className="h-4 w-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(l)}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadPDF(l)}>
                          <FileDown className="h-4 w-4 mr-2" /> Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(l)} className="text-destructive focus:text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {l.portals.pf && <Badge variant="outline" className="text-[10px] px-1 py-0 bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30">PF</Badge>}
                      {l.portals.bayut && <Badge variant="outline" className="text-[10px] px-1 py-0 bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30">BY</Badge>}
                      {l.portals.website && <Badge variant="outline" className="text-[10px] px-1 py-0 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30">WB</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{l.reference}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 rounded overflow-hidden shrink-0">
                        <NextImage src={l.image} alt={l.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{l.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{l.location}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 py-1">
                      <span className="text-[13px] font-semibold text-foreground/80">{l.size} Sq. ft</span>
                      <div className="flex items-center gap-3 text-muted-foreground/50">
                         <div className="flex items-center gap-1.5">
                            <Bath className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-black">{l.bathrooms}</span>
                         </div>
                         <div className="flex items-center gap-1.5">
                            <BedDouble className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-black">{l.bedrooms}</span>
                         </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 py-1">
                      <span className="text-[13px] font-semibold text-foreground/80">{l.type}</span>
                      <span className="text-[11px] font-medium text-muted-foreground/50">{l.purpose}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 py-1">
                      <span className="text-[13px] font-semibold text-foreground/80">
                        {l.currency || "AED"} {l.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground/50">{l.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 py-1">
                      <span className="text-[13px] font-semibold text-foreground/80">3 days ago</span>
                      <span className="text-[11px] font-medium text-muted-foreground/50">3 days ago</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${statusColors[l.status] || ""}`}>
                      {l.status}
                    </Badge>
                  </TableCell>
                   <TableCell className="text-xs">{l.community}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 py-1">
                       <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden shrink-0 border border-sky-200/50">
                          {l.listingAgentAvatar ? (
                            <NextImage src={l.listingAgentAvatar} alt={l.listingAgent} width={32} height={32} className="object-cover" />
                          ) : (
                            <User className="h-5 w-5 text-sky-500" />
                          )}
                       </div>
                       <span className="text-[13px] font-semibold text-foreground/80 whitespace-nowrap">{l.listingAgent}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 py-1">
                       <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden shrink-0 border border-sky-200/50">
                          {l.ownerAvatar ? (
                            <NextImage src={l.ownerAvatar} alt={l.owner} width={32} height={32} className="object-cover" />
                          ) : (
                            <User className="h-5 w-5 text-sky-500" />
                          )}
                       </div>
                       <span className="text-[13px] font-semibold text-foreground/80 whitespace-nowrap">{l.owner}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[13px] font-semibold text-foreground/80 whitespace-nowrap">{l.office || "PRIME ZAM"}</span>
                  </TableCell>
                </TableRow>
              ))
             )}
          </TableBody>
        </Table>
      </div>

        {/* Right Scroll Indicator */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-20 flex items-center justify-center transition-all opacity-0 group-hover/table:opacity-100 border-none"
          title="Scroll to End"
        >
          <div className="h-12 w-6 bg-sky-300 hover:bg-sky-400 rounded-l-lg flex items-center justify-center shadow-lg transition-transform hover:scale-110">
            <ChevronRight className="h-5 w-5 text-sky-950" />
          </div>
        </button>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-3 border-t border-border">
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
  );
}
