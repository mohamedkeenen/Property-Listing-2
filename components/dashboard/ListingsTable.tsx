import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Search, MoreHorizontal, FileDown, Bath, BedDouble, ArrowUpDown, User, Image as ImageIcon, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PropertyListing } from "@/data/mockData";
import { cn, formatRelativeTime } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { generatePropertyPDF } from "@/lib/generatePDF";
import { useDeletePropertyMutation, useTogglePortalMutation } from "@/api/redux/services/propertyApi";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/api/redux/slices/authSlice";
import { selectCompanyLogo, selectSettingsLastUpdated } from "@/api/redux/slices/settingsSlice";
import { API_BASE_URL } from "@/api/redux/apiConfig";
import { ConfirmPortalDialog } from "@/components/shared/ConfirmPortalDialog";
import { SkeletonDashboardTable } from "@/components/skeleton/SkeletonDashboardTable";

interface Props {
  listings: PropertyListing[];  
  isLoading?: boolean;
  onViewDetails: (listing: PropertyListing) => void;
  onEdit: (listing: PropertyListing) => void;
}

const PortalBadge = ({ initialStatus, portal, propertyId, pfStatus }: { 
  initialStatus: boolean; 
  portal: string; 
  propertyId: string;
  pfStatus?: string | null;
}) => {
  const user = useSelector(selectCurrentUser);
  const companyLogo = useSelector(selectCompanyLogo);
  const settingsLastUpdated = useSelector(selectSettingsLastUpdated);
  const isAgent = user?.role === 'agent';
  const [togglePortal, { isLoading }] = useTogglePortalMutation();
  const [active, setActive] = useState(initialStatus);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleToggle = () => {
    if (isAgent) {
      toast({
        title: "Permission Denied",
        description: "Agents cannot push listings to portals. Please contact your supervisor or admin.",
        variant: "destructive"
      });
      return;
    }
    setConfirmOpen(true);
  };

  const getLogoUrl = (logo: string | null) => {
    if (!logo) return undefined;
    if (logo.startsWith('http') || logo.startsWith('data:image')) return logo;
    return `${API_BASE_URL}/storage/${logo}?v=${settingsLastUpdated}`;
  };

  const dialogLogoUrl = undefined;

  const handleConfirmToggle = async () => {
    try {
      const newStatus = !active;
      await togglePortal({ id: propertyId, portal, status: newStatus }).unwrap();
      setActive(newStatus);
      toast({ 
        title: `${newStatus ? 'Added to' : 'Removed from'} ${portal.toUpperCase()}`,
        description: `Listing ${newStatus ? 'is now live' : 'has been removed'} on ${portal.toUpperCase()}.`,
        variant: "success"
      });
    } catch (err: any) {
      toast({ 
        title: "Toggle failed", 
        description: err.data?.message || "Internal server error occurred.",
        variant: "destructive" 
      });
    } finally {
      setConfirmOpen(false);
    }
  };

  const portalNames: Record<string, string> = {
    pf: "PF",
    bayut: "BY",
    dubizzle: "DB",
    website: "WB"
  };

  const portalColors: Record<string, string> = {
    pf: "hover:bg-red-500 hover:text-white border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10",
    pf_active: "bg-red-500 text-white border-red-500 shadow-sm",
    pf_failed: "bg-orange-500 text-white border-orange-600 shadow-sm animate-pulse",
    bayut: "hover:bg-emerald-500 hover:text-white border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    bayut_active: "bg-emerald-500 text-white border-emerald-500 shadow-sm",
    dubizzle: "hover:bg-emerald-500 hover:text-white border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    dubizzle_active: "bg-emerald-500 text-white border-emerald-500 shadow-sm",
    website: "hover:bg-cyan-500 hover:text-white border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
    website_active: "bg-cyan-500 text-white border-cyan-500 shadow-sm"
  };

  let color = portalColors[portal];
  if (active) color = portalColors[`${portal}_active`];
  if (portal === 'pf' && pfStatus === 'Failed') color = portalColors.pf_failed;

  return (
    <>
      <Badge 
        variant="outline" 
        onClick={(e) => { e.stopPropagation(); handleToggle(); }}
        className={cn(
          "text-[10px] px-1.5 py-0 transition-all duration-200 select-none h-5 min-w-[28px] flex items-center justify-center font-bold",
          isAgent ? "cursor-not-allowed grayscale opacity-60" : "cursor-pointer active:scale-90",
          color,
          isLoading && "opacity-50 pointer-events-none"
        )}
        title={isAgent ? "Agents cannot manage portals" : (pfStatus === 'Failed' ? 'Sync Failed' : portal.toUpperCase())}
      >
        {isLoading ? <Loader2 className="h-2 w-2 animate-spin" /> : portalNames[portal]}
        {portal === 'pf' && pfStatus === 'Synced' && active && <span className="ml-1">✅</span>}
        {portal === 'pf' && pfStatus === 'Failed' && active && <span className="ml-1">❌</span>}
      </Badge>

      <ConfirmPortalDialog 
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmToggle}
        portalKey={portal}
        isActivating={!active}
        loading={isLoading}
        logoUrl={dialogLogoUrl}
      />
    </>
  );
};

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

import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";

export function ListingsTable({ listings, isLoading, onViewDetails, onEdit }: Props) {
  const router = useRouter();
  const [deleteProperty] = useDeletePropertyMutation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<PropertyListing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = listings
    .filter((l) => activeTab === "all" || l.status === activeTab)
    .filter((l) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return l.title.toLowerCase().includes(s) || l.reference.toLowerCase().includes(s) || (l.community || l.bayutCommunity || "").toLowerCase().includes(s);
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const tabCounts = (val: string) => val === "all" ? listings.length : listings.filter((l) => l.status === val).length;

  const handleDeleteClick = (listing: PropertyListing) => {
    setListingToDelete(listing);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!listingToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteProperty(listingToDelete.id).unwrap();
      toast({ 
        title: "Listing deleted", 
        description: `${listingToDelete.reference} has been removed successfully.`,
        variant: "success"
      });
      setDeleteDialogOpen(false);
    } catch (err: any) {
      toast({ 
        title: "Delete failed", 
        description: err.data?.message || "Failed to delete the property. Internal server error.",
        variant: "destructive" 
      });
    } finally {
      setIsDeleting(false);
      setListingToDelete(null);
    }
  };

  const handleDownloadPDF = async (listing: PropertyListing) => {
    const { id, dismiss, update } = toast({ 
      title: "Generating PDF...", 
      description: "Please wait while we prepare your document.",
      duration: Infinity,
    });

    try {
      await generatePropertyPDF(listing);
      update({
        id,
        title: "PDF Downloaded",
        description: `${listing.reference}.pdf has been saved.`,
        variant: "success",
      });
      // Automatically dismiss after 3 seconds
      setTimeout(() => dismiss(), 3000);
    } catch (err) {
      update({
        id,
        title: "Error",
        description: "Failed to generate PDF.",
        variant: "destructive",
      });
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl w-full overflow-hidden flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center gap-1 p-3 border-b border-border overflow-x-auto overflow-y-hidden no-scrollbar">
        {statusTabs.map((tab) => {
          const tabStyles: Record<string, string> = {
            all: "hover:bg-primary/10 hover:text-primary",
            Live: "hover:bg-emerald-500/10 hover:text-emerald-600",
            Draft: "hover:bg-yellow-500/10 hover:text-yellow-600",
            Pending: "hover:bg-sky-500/10 hover:text-sky-600",
            Archived: "hover:bg-gray-500/10 hover:text-gray-600",
            Pocket: "hover:bg-purple-500/10 hover:text-purple-600",
          };

          const activeColors: Record<string, string> = {
            all: "bg-primary text-white",
            Live: "bg-emerald-500 text-white shadow-emerald-500/20",
            Draft: "bg-yellow-500 text-white",
            Pending: "bg-sky-500 text-white",
            Archived: "bg-gray-500 text-white",
            Pocket: "bg-purple-500 text-white",
          };

          return (
            <button
              key={tab.value}
              onClick={() => { setActiveTab(tab.value); setPage(1); }}
              className={cn(
                "px-4 py-2 text-[11px] font-bold rounded-md whitespace-nowrap transition-all duration-200",
                activeTab === tab.value
                  ? cn(activeColors[tab.value], "shadow-sm shadow-black/5")
                  : cn("text-muted-foreground/70 active:scale-95", tabStyles[tab.value])
              )}
            >
              {tab.label} ({tabCounts(tab.value)})
            </button>
          );
        })}
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

      {/* Table Section - Flex to fill and allow internal scroll */}
      <div className="relative group/table w-full flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Left Scroll Indicator */}
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); scroll('left'); }}
          className="absolute left-0 top-0 bottom-0 z-20 flex items-center justify-center transition-all opacity-0 group-hover/table:opacity-100 border-none"
          title="Scroll to Start"
        >
          <div className="h-12 w-6 bg-sky-300 hover:bg-sky-400 rounded-r-lg flex items-center justify-center shadow-lg transition-transform hover:scale-110">
            <ChevronLeft className="h-5 w-5 text-sky-950" />
          </div>
        </button>

        <div 
          ref={scrollRef} 
          className="flex-1 overflow-x-auto overflow-y-auto w-full max-w-full pb-4"
          style={{ width: 0, minWidth: '100%' }}
        >
          <Table className="min-w-[1800px]">
          <TableHeader className="sticky top-0 bg-card z-10 shadow-[0_1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_rgba(255,255,255,0.1)]">
            <TableRow>
              <TableHead className="w-[80px]">Actions</TableHead>
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
                  <ArrowUpDown className="h-3 w-3" /> Created At
                </div>
              </TableHead>
                <TableHead>Status</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-3 w-3" /> Listing Agent (Portal)
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-3 w-3" /> Listing Owner
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
            {isLoading ? (
              <SkeletonDashboardTable />
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                  No listings found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((l) => (
                <TableRow 
                  key={l.id} 
                  className="hover:bg-muted/50 border-b-0"
                >
                  <TableCell className="sticky left-0 bg-card z-10 shadow-[1px_0_0_rgba(0,0,0,0.1)] dark:shadow-[1px_0_0_rgba(255,255,255,0.1)]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl bg-primary/5 text-primary/70 hover:bg-primary hover:text-white hover:shadow-md hover:shadow-primary/20 transition-all active:scale-95 group/btn">
                          <MoreHorizontal className="h-4 w-4 transition-transform group-hover/btn:rotate-90" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48 p-1.5 rounded-xl border-border shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <DropdownMenuItem onClick={() => onViewDetails(l)} className="gap-2.5 py-2 rounded-lg cursor-pointer text-xs font-bold transition-all focus:bg-primary/10 focus:text-primary">
                          <Eye className="h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(l)} className="gap-2.5 py-2 rounded-lg cursor-pointer text-xs font-bold transition-all focus:bg-amber-600/10 focus:text-amber-600">
                          <Edit2 className="h-4 w-4" /> Edit Listing
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadPDF(l)} className="gap-2.5 py-2 rounded-lg cursor-pointer text-xs font-bold transition-all focus:bg-emerald-500/10 focus:text-emerald-500">
                          <FileDown className="h-4 w-4" /> Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1.5 opacity-50" />
                        <DropdownMenuItem 
                          onClick={() => { setListingToDelete(l); setDeleteDialogOpen(true); }} 
                          className="gap-2.5 py-2 rounded-lg cursor-pointer text-xs font-bold text-destructive transition-all focus:bg-destructive/10 focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" /> Delete Listing
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5 flex-wrap max-w-[120px]">
                      <PortalBadge 
                        portal="pf" 
                        propertyId={l.id} 
                        initialStatus={l.portals.pf} 
                        pfStatus={l.pfStatus} 
                      />
                      <PortalBadge 
                        portal="bayut" 
                        propertyId={l.id} 
                        initialStatus={l.portals.bayut} 
                      />
                      <PortalBadge 
                        portal="dubizzle" 
                        propertyId={l.id} 
                        initialStatus={l.portals.dubizzle} 
                      />
                      <PortalBadge 
                        portal="website" 
                        propertyId={l.id} 
                        initialStatus={l.portals.website} 
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{l.reference}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 rounded overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                        {l.image ? (
                          <img 
                            src={l.image} 
                            alt={l.title} 
                            className="w-full h-full object-cover transition-opacity duration-300 opacity-0" 
                            onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                          />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{l.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate uppercase tracking-tight">
                          {l.property_location || l.location || l.bayutLocation || "—"} • {l.community || l.bayutCommunity || "—"} {l.building || l.bayutBuilding ? `• ${l.building || l.bayutBuilding}` : ""}
                        </p>
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
                      <span className="text-[13px] font-semibold text-foreground/80">
                        {formatRelativeTime(l.createdAt)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${statusColors[l.status] || ""}`}>
                      {l.status}
                    </Badge>
                  </TableCell>
                   <TableCell className="text-xs">{l.community || l.bayutCommunity || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 py-1">
                       <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden shrink-0 border border-sky-200/50">
                          {l.listingAgentAvatar ? (
                            <img src={l.listingAgentAvatar} alt={l.listingAgent} className="w-full h-full object-cover" />
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
                            <img src={l.ownerAvatar} alt={l.owner} className="w-full h-full object-cover" />
                          ) : (
                            <User className="h-5 w-5 text-sky-500" />
                          )}
                       </div>
                       <span className="text-[13px] font-semibold text-foreground/80 whitespace-nowrap">{l.owner}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[13px] font-semibold text-foreground/80 whitespace-nowrap">{l.office}</span>
                  </TableCell>
                </TableRow>
              ))
             )}
          </TableBody>
        </Table>
      </div>

        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); scroll('right'); }}
          className="absolute right-0 top-0 bottom-0 z-20 flex items-center justify-center transition-all opacity-0 group-hover/table:opacity-100 border-none"
          title="Scroll to End"
        >
          <div className="h-12 w-6 bg-sky-300 hover:bg-sky-400 rounded-l-lg flex items-center justify-center shadow-lg transition-transform hover:scale-110">
            <ChevronRight className="h-5 w-5 text-sky-950" />
          </div>
        </button>
      </div>

      {/* Pagination Footer */}
      <div className="border-t border-border/40 bg-muted/20 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 order-2 sm:order-1">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Rows per page:</span>
                <Select
                    value={perPage.toString()}
                    onValueChange={(val) => {
                        setPerPage(Number(val));
                        setPage(1);
                    }}
                >
                    <SelectTrigger className="h-8 w-16 rounded-lg bg-background/50 border-border/40 text-[10px] font-black">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/10 backdrop-blur-3xl bg-background/95">
                        {[10, 25, 50, 100].map((num) => (
                            <SelectItem key={num} value={num.toString()} className="text-[10px] font-black rounded-lg">
                                {num}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="h-4 w-px bg-border/40 hidden sm:block" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length} listings
            </span>
        </div>

        <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="h-8 w-8 rounded-lg border-border/40 hover:bg-muted disabled:opacity-30 transition-all"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                        pageNum === 1 || 
                        pageNum === totalPages || 
                        (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                        return (
                            <Button
                                key={pageNum}
                                variant={page === pageNum ? "default" : "outline"}
                                onClick={() => setPage(pageNum)}
                                className={cn(
                                    "h-8 min-w-[32px] rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                    page === pageNum ? "shadow-lg shadow-primary/20" : "border-border/40 hover:bg-muted"
                                )}
                            >
                                {pageNum}
                            </Button>
                        );
                    } else if (
                        pageNum === page - 2 || 
                        pageNum === page + 2
                    ) {
                        return <span key={pageNum} className="text-muted-foreground/40 px-1">...</span>;
                    }
                    return null;
                })}
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="h-8 w-8 rounded-lg border-border/40 hover:bg-muted disabled:opacity-30 transition-all"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        itemName={`${listingToDelete?.reference}: ${listingToDelete?.title}`}
        confirmText="Delete Listing"
      />
    </div>
  );
}
