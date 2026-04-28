"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import {  Sparkles,  Download,  Search,  FileText,  Building2,  Timer, Hash, DollarSign, Image as ImageIcon, Loader2, CircleUser, ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { generateSalesOfferPDF } from "@/lib/generateSalesOfferPDF";
import { useGetSalesOffersQuery, useLazyGetSalesOfferDetailQuery } from "@/api/redux/services/salesOfferApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SkeletonSalesOffer } from "@/components/skeleton/SkeletonSalesOffer";
import { useSelector } from "react-redux";
import { selectCompanyLogo, selectCompanyBanner, selectCompanyLogoPdf, selectCoverImage, selectProjectImage1, selectProjectImage2, selectPdfColor, selectSettingsLastUpdated, selectWebsiteLink } from "@/api/redux/slices/settingsSlice";
import { API_BASE_URL } from "@/api/redux/apiConfig";

interface SalesOffer {
  id: string | number;
  image?: any;
  reference: string;
  unit_number?: string;
  project_name: string;
  client_name: string;
  agent_name?: string;
  price: string | number;
  created_at?: string;
}

export default function SalesOfferPage() {
  const { data: offers, isLoading, isError, error, refetch } = useGetSalesOffersQuery();
  const [triggerFetchDetail] = useLazyGetSalesOfferDetailQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadingIds, setDownloadingIds] = useState<(string | number)[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const reduxLogo = useSelector(selectCompanyLogo);
  const reduxBanner = useSelector(selectCompanyBanner);
  const reduxLogoPdf = useSelector(selectCompanyLogoPdf);
  const reduxCoverImage = useSelector(selectCoverImage);
  const reduxProjectImage1 = useSelector(selectProjectImage1);
  const reduxProjectImage2 = useSelector(selectProjectImage2);
  const reduxPdfColor = useSelector(selectPdfColor);
  const reduxWebsiteLink = useSelector(selectWebsiteLink);
  const settingsLastUpdated = useSelector(selectSettingsLastUpdated);

  const getSettingsImageUrl = (imgStr: string | undefined | null) => {
    if (!imgStr) return null;
    if (imgStr.startsWith('http') || imgStr.startsWith('data:image')) return imgStr;
    return `${API_BASE_URL}/storage/${imgStr}?v=${settingsLastUpdated}`;
  };

  const filteredOffers: SalesOffer[] = (offers as any)?.data?.filter((offer: SalesOffer) => 
    offer.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (offer.client_name && offer.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    offer.reference.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredOffers.length / perPage);
  const paginatedOffers = filteredOffers.slice((page - 1) * perPage, page * perPage);

  const handleDownload = async (offerId: string | number) => {
    setDownloadingIds(prev => [...prev, offerId]);
    const { id, update, dismiss } = toast({ 
      title: "Processing Bitrix data...", 
      variant: "loading" 
    });

    try {
      const result = await triggerFetchDetail(offerId).unwrap();
      const item = result.data;
      const mapped = result.mapped || {};
      
      console.log("PDF Mapping Data:", { mapped, item });

      const cleanVal = (val: any) => {
        if (!val) return "";
        return String(val).split("|")[0].trim();
      };

      const getImg = (f: any) => {
        if (!f) return null;
        const item = Array.isArray(f) ? f[0] : f;
        if (!item) return null;
        const raw = item.showUrl || item.url || item.downloadUrl || (typeof item === 'string' ? item : null);
        if (!raw) return null;
        if (raw.startsWith('data:')) return raw;
        
        // Use our proxy for all external/cross-origin images to avoid CORS issues in PDF generation
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://property-listing.keenenter.com').replace(/\/api$/, '').replace(/\/$/, '');
        return `${baseUrl}/api/sales-offers/proxy-image?url=${encodeURIComponent(raw)}`;
      };
      
      const mappedData = { 
        title: mapped['Title'] || "Sales Offer",
        titleArabic: "",
        projectName: cleanVal(mapped['Project Name']) || "",
        clientName: cleanVal(mapped['Client Name']) || "",
        projectNameOfficial: cleanVal(mapped['Project Name']) || "",
        location: cleanVal(mapped['Location']),
        propertyType: cleanVal(mapped['Property Type']),
        unitNumber: cleanVal(mapped['Unit Number']) || cleanVal(mapped['Unit Reference']),
        bedrooms: cleanVal(mapped['No. of Bedroom']) || cleanVal(mapped['Bedrooms']) || cleanVal(mapped['BedRoom']),
        level: cleanVal(mapped['Floor Number']) || cleanVal(mapped['Level / Floor']),
        unitArea: cleanVal(mapped['Total (sq.ft)']) || cleanVal(mapped['Average Area (SQ.FT)']),
        sellingPrice: (() => {
          const raw = cleanVal(mapped['Price']);
          if (!raw) return "";
          const num = parseFloat(raw.replace(/,/g, ''));
          if (!isNaN(num)) {
            // Keep original precision if it's a valid number
            const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
            return num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
          }
          return raw;
        })(),
        developerName: mapped['Developer Name'] || "",
        website: mapped['WebSite Link'] || "",
        referenceToken: cleanVal(mapped['Unit Reference']) || `SO-${offerId}`,
        totalArea: (() => {
          const raw = cleanVal(mapped['Total (sq.ft)']) || cleanVal(mapped['Total Area (SQ.FT)']);
          if (raw) {
            const num = parseFloat(raw.replace(/,/g, ''));
            if (!isNaN(num)) {
              return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
            }
            return raw;
          }
          const suite = parseFloat(cleanVal(mapped['Total (sq.ft)']).replace(/,/g, '')) || 0;
          const terrace = parseFloat(cleanVal(mapped['Terrace']).replace(/,/g, '')) || 0;
          return (suite + terrace).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        })(),
        suiteArea: cleanVal(mapped['Average Area (SQ.FT)']) || "0",
        terrace: cleanVal(mapped['Terrace']) || "0",
        assignedConsultant: cleanVal(mapped['Assigned Consultant']) || "",
        approvalAuthority: cleanVal(mapped['Approval Authority']) || "",
        themeColor: mapped['Theme Color'] || "#3D5434",
        preReg: {
          dld: { 
            description: "DLD Charges", 
            date: mapped['dld_date'] || "", 
            percentage: `${mapped['dld_percentage'] }%`, 
            amount: cleanVal(mapped['dld_amount']) 
          },
          admin: { 
            description: "Administration Fee", 
            date: mapped['admin_date'] || "", 
            percentage: `${mapped['admin_percentage'] || 0}%`, 
            amount: cleanVal(mapped['admin_amount']) || "" 
          },
        },
        paymentPlan: [] as any[],
        paymentPlanStartDate: mapped['Start Date'] || "",
        paymentPlanDuration: mapped['Duration']?.toString() || "",
        paymentPlanPeriodType: mapped['Period Type']?.toLowerCase() || "",
        firstInstallmentPercentage: mapped['First Install']?.toString() || "",
        lastInstallmentPercentage: mapped['Last Install']?.toString() || "",
        agentDetails: {
          name: mapped['Agent Name'] || "",
          email: mapped['Agent Email'] || "",
          phone: mapped['Agent Phone'] || "",
          whatsapp: mapped['Agent Whatsapp'] || "",
          notes: mapped['Agent Notes'] || "",
          image: getImg(mapped['Agent Image']) || "https://res.cloudinary.com/devht0mp5/image/upload/v1775462494/image_2_ktx7px.png",
        }
      };

      const startDate = mappedData.paymentPlanStartDate ? new Date(mappedData.paymentPlanStartDate) : null;
      const duration = parseInt(mappedData.paymentPlanDuration) || 0;
      const firstP = parseFloat(mappedData.firstInstallmentPercentage) || 0;
      const lastP = parseFloat(mappedData.lastInstallmentPercentage) || 0;
      const totalP = 100;
      const price = parseFloat(mappedData.sellingPrice.replace(/,/g, '')) || 0;

      if (startDate && duration >= 2) {
        const newPlan = [];
        const numMiddle = duration - 2;
        const middleP = numMiddle > 0 ? (totalP - firstP - lastP) / numMiddle : 0;

        for (let i = 0; i < duration; i++) {
          const currentDate = new Date(startDate);
          if (mappedData.paymentPlanPeriodType.includes('month')) {
            currentDate.setMonth(startDate.getMonth() + i);
          } else {
            currentDate.setDate(startDate.getDate() + (i * 7));
          }

          let p = 0;
          let label = "";
          
          if (i === 0) {
            p = firstP;
            label = "1st Installment";
          } else if (i === duration - 1) {
            p = lastP;
            label = "Final Installment";
          } else {
            p = middleP;
            const idx = i + 1;
            let suffix = "th";
            if (idx === 2) suffix = "nd";
            if (idx === 3) suffix = "rd";
            label = `${idx}${suffix} Installment`;
          }

          const rowPrice = (price * p) / 100;
          
          newPlan.push({
            date: currentDate.toISOString().split('T')[0],
            installment: label,
            percentage: p.toFixed(2) + "%",
            price: rowPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          });
        }
        mappedData.paymentPlan = newPlan;
      }


      const mappedImages = {
        cover: getSettingsImageUrl(reduxCoverImage) || getImg(mapped['Upload Cover Image']),
        banner: getSettingsImageUrl(reduxBanner) || getImg(mapped['Upload Banner Image']),
        logo: getSettingsImageUrl(reduxLogo) || getImg(mapped['Company Logo']),
        logoPdf: getSettingsImageUrl(reduxLogoPdf) || getImg(mapped['Logo PDF']),
        qrCode: null,
        unitDetail: getImg(mapped['Layout Image']),
        highlights: [
          getSettingsImageUrl(reduxProjectImage1),
          getSettingsImageUrl(reduxProjectImage2)
        ].filter(Boolean).length > 0 
          ? [getSettingsImageUrl(reduxProjectImage1), getSettingsImageUrl(reduxProjectImage2)].filter(Boolean)
          : (Array.isArray(mapped['Project Images Only-2'] || mapped['project_images_only-2'] || mapped['Project Images']) 
            ? (mapped['Project Images Only-2'] || mapped['project_images_only-2'] || mapped['Project Images']).map(getImg)
            : [getImg(mapped['Project Images Only-2'] || mapped['project_images_only-2'] || mapped['Project Images'])]).filter(Boolean).slice(0, 10),
      };

      // Add website and theme color from settings
      mappedData.website = reduxWebsiteLink;
      mappedData.themeColor = reduxPdfColor;

      update({ title: "Generating PDF...", variant: "loading" });
      
      await generateSalesOfferPDF(mappedData as any, mappedImages);
      
      update({ title: "PDF Downloaded!", variant: "success" });
      setTimeout(() => dismiss(), 3000);
    } catch (error: any) {
      console.error("Full PDF Error Check:", error);
      const errorMsg = error?.data?.error || error?.message || "Check Console";
      update({ title: `PDF Fail: ${errorMsg}`, variant: "destructive" });
    } finally {
      setDownloadingIds(prev => prev.filter(id => id !== offerId));
    }

  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 overflow-y-auto bg-transparent">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="text-4xl font-black tracking-tight text-foreground">
              Sales Offers
            </h2>
          </div>
          <p className="text-muted-foreground font-medium pl-1">
            Manage and generate sales offers directly from your Bitrix CRM.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input 
              placeholder="Search reference or project..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-primary/20 transition-all font-medium"
            />
          </div>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="icon" 
            className="h-11 w-11 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
            disabled={isLoading}
          >
            <Loader2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border-border/40 shadow-xl shadow-black/5 overflow-hidden bg-card/70 backdrop-blur-md">
        <CardContent className="p-0">
          <div className="relative min-h-[400px]">
            {isError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-destructive">
                <div className="p-4 rounded-full bg-destructive/10">
                  <FileText className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <p className="font-bold">Failed to load sales offers</p>
                  <p className="text-xs opacity-70">{(error as any)?.data?.error || 'Connection Timeout'}</p>
                  <Button variant="link" onClick={() => refetch()} className="mt-2 text-primary h-auto p-0">Retry</Button>
                </div>
              </div>
            ) : filteredOffers.length === 0 && !isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <div className="p-4 rounded-full bg-muted/50">
                  <Sparkles className="h-8 w-8 opacity-20" />
                </div>
                <p className="font-bold">No sales offers found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[100px] h-14 font-black text-xs uppercase tracking-wider text-muted-foreground">Image</TableHead>
                      <TableHead className="h-14 font-black text-xs uppercase tracking-wider text-muted-foreground">Reference</TableHead>
                      <TableHead className="h-14 font-black text-xs uppercase tracking-wider text-muted-foreground">Unit Number</TableHead>
                      <TableHead className="h-14 pl-6 font-black text-xs uppercase tracking-wider text-muted-foreground">Agent Name</TableHead>
                      <TableHead className="h-14 font-black text-xs uppercase tracking-wider text-muted-foreground text-center">Created At</TableHead>
                      <TableHead className="h-14 pr-6 text-right font-black text-xs uppercase tracking-wider text-muted-foreground">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <SkeletonSalesOffer />
                    ) : (
                      paginatedOffers.map((offer: SalesOffer) => (
                        <TableRow key={offer.id} className="hover:bg-muted/20 transition-colors border-border/20 group">
                        <TableCell className="pl-6 py-4">
                          <div className="w-14 h-14 rounded-xl border border-border/30 bg-muted/50 overflow-hidden shadow-inner group-hover:shadow-md transition-all">
                            {getSettingsImageUrl(reduxCoverImage) || offer.image ? (
                              <img 
                                src={getSettingsImageUrl(reduxCoverImage) || (offer.image?.startsWith('/') ? `${API_BASE_URL}${offer.image}` : offer.image)} 
                                alt="" 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">
                          <div className="flex items-center gap-2">
                            <Hash className="h-3.5 w-3.5 text-primary/40" />
                            {offer.reference}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">
                          {offer.unit_number || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 font-black text-foreground">
                            <CircleUser className="h-4 w-4 text-primary" />
                            {offer.agent_name || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                           <div className="flex items-center justify-center gap-2 text-muted-foreground font-semibold text-xs">
                            <Timer className="h-3 w-3" />
                            {offer.created_at ? format(new Date(offer.created_at), 'MMM dd, yyyy | hh:mm aa') : '-'}
                           </div>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <Button
                            onClick={() => handleDownload(offer.id)}
                            disabled={downloadingIds.includes(offer.id)}
                            className="rounded-xl md:rounded-2xl h-10 px-5 font-black bg-linear-to-br from-primary via-primary to-indigo-600 text-white shadow-lg shadow-primary/10 transition-all duration-300 hover:shadow-primary/30 hover:scale-105 active:scale-95 relative overflow-hidden group/btn"
                          >
                            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 skew-x-[-20deg]" />
                            <span className="relative z-10 flex items-center justify-center">
                              {downloadingIds.includes(offer.id) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Download className="mr-2 h-4 w-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                                  Download
                                </>
                              )}
                            </span>
                          </Button>
                        </TableCell>
                      </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          
          {!isLoading && !isError && filteredOffers.length > 0 && (
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
                      Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filteredOffers.length)} of {filteredOffers.length} offers
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
