"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { 
  Sparkles, 
  Download, 
  Search, 
  FileText, 
  Building2, 
  Timer,
  Hash,
  DollarSign,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { generateSalesOfferPDF } from "@/lib/generateSalesOfferPDF";
import { useGetSalesOffersQuery, useLazyGetSalesOfferDetailQuery } from "@/api/redux/services/salesOfferApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface SalesOffer {
  id: string | number;
  image?: any;
  reference: string;
  project_name: string;
  price: string | number;
  created_at?: string;
}

export default function SalesOfferPage() {
  const { data: offers, isLoading, isError, error, refetch } = useGetSalesOffersQuery();
  const [triggerFetchDetail] = useLazyGetSalesOfferDetailQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null);

  const filteredOffers: SalesOffer[] = (offers as any)?.data?.filter((offer: SalesOffer) => 
    offer.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.reference.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDownload = async (offerId: string | number) => {
    setDownloadingId(offerId);
    const loadingToast = toast.loading("Processing Bitrix data...");

    try {
      const result = await triggerFetchDetail(offerId).unwrap();
      const item = result.data;

      const cleanBitrixValue = (val: any) => {
        if (!val) return "";
        return String(val).split("|")[0].trim();
      };
      
      // MAPPING FROM BITRIX TO FORM DATA
      const mappedData = {
        title: item.ufCrm16_1774897825 || "Sales Offer",
        titleArabic: "", // Not in bitrix images
        projectName: cleanBitrixValue(item.ufCrm16_1774894675) || "N/A",
        projectNameOfficial: cleanBitrixValue(item.ufCrm16_1774894675) || "N/A",
        location: cleanBitrixValue(item.ufCrm16_1774897911),
        propertyType: cleanBitrixValue(item.ufCrm16_1774898199),
        unitNumber: cleanBitrixValue(item.ufCrm16_1774898869),
        bedrooms: cleanBitrixValue(item.ufCrm16_1774898914),
        level: cleanBitrixValue(item.ufCrm16_1774899080),
        unitArea: cleanBitrixValue(item.ufCrm16_1774899115),
        sellingPrice: cleanBitrixValue(item.ufCrm16_1774899176),
        developerName: item.ufCrm16_1774898152 || "",
        salesConsultant: item.ufCrm16_1774899199 || "",
        headOfSales: "Management", // PlaceHolder
        website: item.ufCrm16_1774897856 || "",
        referenceToken: cleanBitrixValue(item.ufCrm16_1774898869) || `SO-${offerId}`,
        suiteArea: cleanBitrixValue(item.ufCrm16_1774899115),
        terraceArea: "0",
        totalArea: cleanBitrixValue(item.ufCrm16_1774899115),
        themeColor: "#0000",
        preReg: {
          dld: { 
            description: "DLD Charges", 
            date: item.ufCrm16_1774900612 || "", 
            percentage: `${item.ufCrm16_1774900627 || 4}%`, 
            amount: cleanBitrixValue(item.ufCrm16_1774900641) 
          },
          admin: { 
            description: "Administration Fee", 
            date: item.ufCrm16_1774900659 || "", 
            percentage: `${item.ufCrm16_1774900671 || 0}%`, 
            amount: cleanBitrixValue(item.ufCrm16_1774900686) || "5,000.00" 
          },
        },
        paymentPlan: [] as any[],
        paymentPlanStartDate: item.ufCrm16_1774900723 || "",
        paymentPlanDuration: item.ufCrm16_1774900752?.toString() || "10",
        paymentPlanPeriodType: item.ufCrm16_1774900783 || "month",
        firstInstallmentPercentage: item.ufCrm16_1774900852?.toString() || "20",
        lastInstallmentPercentage: item.ufCrm16_1774901002?.toString() || "30",
      };

      // AUTO-CALC PAYMENT PLAN
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
          if (mappedData.paymentPlanPeriodType === 'month') {
            currentDate.setMonth(startDate.getMonth() + i);
          } else {
            currentDate.setDate(startDate.getDate() + (i * 7));
          }

          let p = 0;
          let label = "";
          
          if (i === 0) {
            p = firstP;
            label = "1st Instalment";
          } else if (i === duration - 1) {
            p = lastP;
            label = mappedData.paymentPlanPeriodType === 'month' ? "On project completion" : "Final Settlement";
          } else {
            p = middleP;
            const idx = i + 1;
            let suffix = "th";
            if (idx === 2) suffix = "nd";
            if (idx === 3) suffix = "rd";
            label = `${idx}${suffix} Instalment`;
          }

          const rowPrice = (price * p) / 100;
          
          newPlan.push({
            date: i === duration - 1 && mappedData.paymentPlanPeriodType === 'month' ? "On project completion" : currentDate.toISOString().split('T')[0],
            installment: label,
            percentage: p.toFixed(2) + "%",
            price: rowPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          });
        }
        mappedData.paymentPlan = newPlan;
      }

      // IMAGE MAPPING
      // Note: Bitrix result can be an object with .url or .downloadUrl
      const getImg = (f: any) => {
        if (!f) return null;
        if (typeof f === 'string') return f;
        // Bitrix file objects often have these properties
        const url = f.showUrl || f.url || f.downloadUrl;
        if (!url) return null;
        return url;
      };

      const mappedImages = {
        cover: getImg(item.ufCrm16_1774897520),
        banner: getImg(item.ufCrm16_1774897971),
        qrCode: null,
        unitDetail: getImg(item.ufCrm16_1774899490),
        highlights: (Array.isArray(item.ufCrm16_1774899312) 
          ? item.ufCrm16_1774899312.map(getImg)
          : [getImg(item.ufCrm16_1774899312)]).filter(Boolean).slice(0, 4),
      };

      toast.loading("Generating PDF...", { id: loadingToast });
      
      await generateSalesOfferPDF(mappedData as any, mappedImages);
      
      toast.success("PDF Downloaded!", { id: loadingToast });
    } catch (error: any) {
      console.error("Full PDF Error Check:", error);
      const errorMsg = error?.data?.error || error?.message || "Check Console";
      toast.error(`PDF Fail: ${errorMsg}`, { id: loadingToast });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 overflow-y-auto bg-[#fafafa]">
      {/* Header section with refined aesthetics */}
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
              className="pl-10 h-11 rounded-xl border-border/50 bg-white/50 backdrop-blur-sm focus:ring-primary/20 transition-all font-medium"
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

      <Card className="rounded-2xl border-border/40 shadow-xl shadow-black/5 overflow-hidden bg-white/70 backdrop-blur-md">
        <CardContent className="p-0">
          <div className="relative min-h-[400px]">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm font-bold text-muted-foreground animate-pulse">Fetching records from Bitrix...</p>
              </div>
            ) : isError ? (
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
            ) : filteredOffers.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <div className="p-4 rounded-full bg-muted/50">
                  <Sparkles className="h-8 w-8 opacity-20" />
                </div>
                <p className="font-bold">No sales offers found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[100px] h-14 pl-6 font-black text-xs uppercase tracking-wider text-muted-foreground">Image</TableHead>
                    <TableHead className="h-14 font-black text-xs uppercase tracking-wider text-muted-foreground">Reference</TableHead>
                    <TableHead className="h-14 font-black text-xs uppercase tracking-wider text-muted-foreground">Project Name</TableHead>
                    <TableHead className="h-14 font-black text-xs uppercase tracking-wider text-muted-foreground text-center">Price</TableHead>
                    <TableHead className="h-14 font-black text-xs uppercase tracking-wider text-muted-foreground text-center">Created At</TableHead>
                    <TableHead className="h-14 pr-6 text-right font-black text-xs uppercase tracking-wider text-muted-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.map((offer: SalesOffer) => (
                    <TableRow key={offer.id} className="hover:bg-muted/20 transition-colors border-border/20 group">
                      <TableCell className="pl-6 py-4">
                        <div className="w-14 h-14 rounded-xl border border-border/30 bg-muted/50 overflow-hidden shadow-inner group-hover:shadow-md transition-all">
                          {offer.image ? (
                            <img 
                              src={(() => {
                                const raw = offer.image?.downloadUrl || offer.image;
                                if (!raw) return "";
                                const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/api$/, '').replace(/\/$/, '');
                                
                                // Case 1: Already points to our API proxy - just add base URL
                                if (raw.startsWith('/api/')) {
                                  return `${baseUrl}${raw}`;
                                }

                                // Case 2: Direct Bitrix URL needs our proxy
                                if (raw.includes('bitrix24.com') || raw.includes('/ajax.php')) {
                                  return `${baseUrl}/api/sales-offers/proxy-image?url=${encodeURIComponent(raw)}`;
                                }
                                
                                return raw;
                              })()} 
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
                      <TableCell>
                        <div className="flex items-center gap-2 font-black text-foreground/80">
                          <Building2 className="h-4 w-4 text-primary" />
                          {offer.project_name}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-black px-3 py-1 bg-green-50 text-green-700 border-green-100/50">
                          <DollarSign className="h-3 w-3 mr-0.5" />
                          {Number(offer.price).toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                         <div className="flex items-center justify-center gap-2 text-muted-foreground font-semibold text-xs">
                          <Timer className="h-3 w-3" />
                          {offer.created_at ? format(new Date(offer.created_at), 'MMM dd, yyyy') : 'N/A'}
                         </div>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button
                          onClick={() => handleDownload(offer.id)}
                          disabled={downloadingId === offer.id}
                          className="rounded-xl h-10 px-5 font-black bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/10 transition-all active:scale-95 group"
                        >
                          {downloadingId === offer.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
                              Download
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
