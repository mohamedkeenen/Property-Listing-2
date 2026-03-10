import { useState } from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Search, MoreHorizontal, FileDown } from "lucide-react";
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

  return (
    <div className="bg-card border border-border rounded-lg">
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

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Portals</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="min-w-[250px]">Title</TableHead>
              <TableHead>Layout</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Owner</TableHead>
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
                <TableRow key={l.id} className="hover:bg-muted/50">
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
                  <TableCell className="text-xs">
                    {l.bedrooms > 0 ? `${l.bedrooms} BR / ${l.bathrooms} BA` : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{l.type}</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    AED {l.price.toLocaleString()}
                    <span className="text-xs text-muted-foreground block">{l.purpose === "Rent" ? "/year" : ""}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{l.updatedAt}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${statusColors[l.status] || ""}`}>
                      {l.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{l.community}</TableCell>
                  <TableCell className="text-xs">{l.listingAgent}</TableCell>
                  <TableCell className="text-xs">{l.owner}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
