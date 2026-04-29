import { Globe, Key, Tag, FileText, Copy } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";
import NextImage from "next/image";
import { PropertyListing } from "@/data/mockData";
import { useGetCompanySettingsQuery } from "@/api/redux/services/settingsApi";
import { toast } from "react-hot-toast";

interface Props {
  listings: PropertyListing[];
}

export function StatsCards({ listings }: Props) {
  const { data: companySettings } = useGetCompanySettingsQuery();
  const sales = listings.filter((l) => l.purpose === "Sale");
  const rents = listings.filter((l) => l.purpose === "Rent");
  const pf = listings.filter((l) => l.portals.pf);
  const bayut = listings.filter((l) => l.portals.bayut);
  const web = listings.filter((l) => l.portals.website);

  const stats = [
    {
      label: "Sales",
      total: sales.length,
      residential: sales.filter((l) => l.category === "Residential").length,
      commercial: sales.filter((l) => l.category === "Commercial").length,
      icon: Tag,
      color: "#ef4444", // Red
      bgColor: "bg-red-500/10",
      iconColor: "text-red-500",
      dotColor: "bg-red-500",
      barColor: "bg-red-500",
      barBg: "bg-red-500/15",
      borderColor: "border-r-red-500",
    },
    {
      label: "Rent",
      total: rents.length,
      residential: rents.filter((l) => l.category === "Residential").length,
      commercial: rents.filter((l) => l.category === "Commercial").length,
      icon: Key,
      color: "#3b82f6", // Blue
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500",
      dotColor: "bg-blue-500",
      barColor: "bg-blue-600",
      barBg: "bg-blue-500/15",
      borderColor: "border-r-blue-500",
    },
    {
      label: "Property Finder",
      total: pf.length,
      residential: pf.filter((l) => l.category === "Residential").length,
      commercial: pf.filter((l) => l.category === "Commercial").length,
      image: "https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/PF_ljkahc.png",
      color: "#ea3934", // PF red-orange
      bgColor: "bg-[#ea3934]/10",
      iconColor: "text-[#ea3934]",
      dotColor: "bg-[#ea3934]",
      barColor: "bg-[#ea3934]",
      barBg: "bg-[#ea3934]/15",
      borderColor: "border-r-[#ea3934]",
    },
    {
      label: "Bayut & Dubizzle",
      total: bayut.length,
      residential: bayut.filter((l) => l.category === "Residential").length,
      commercial: bayut.filter((l) => l.category === "Commercial").length,
      image: "https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/bayut_gy4ev2.png",
      color: "#28b16d", // Bayut green
      bgColor: "bg-[#28b16d]/10",
      iconColor: "text-[#28b16d]",
      dotColor: "bg-[#28b16d]",
      barColor: "bg-[#28b16d]",
      barBg: "bg-[#28b16d]/15",
      borderColor: "border-r-[#28b16d]",
    },
    {
      label: "Website",
      total: web.length,
      residential: web.filter((l) => l.category === "Residential").length,
      commercial: web.filter((l) => l.category === "Commercial").length,
      icon: Globe,
      color: "#06b6d4", // Cyan/Teal
      bgColor: "bg-cyan-500/10",
      iconColor: "text-cyan-600",
      dotColor: "bg-cyan-600",
      barColor: "bg-cyan-600",
      barBg: "bg-cyan-500/15",
      borderColor: "border-r-cyan-500",
    },
    {
      label: "PropQA",
      total: listings.filter((l) => l.portals.propqa).length,
      residential: listings.filter((l) => l.portals.propqa && l.category === "Residential").length,
      commercial: listings.filter((l) => l.portals.propqa && l.category === "Commercial").length,
      image: "https://res.cloudinary.com/devht0mp5/image/upload/v1777361218/logo-header-white.QoQUc6PB_ao5mn9.svg",
      color: "#8b5cf6", // Purple
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500",
      dotColor: "bg-purple-500",
      barColor: "bg-purple-600",
      barBg: "bg-purple-500/15",
      borderColor: "border-r-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {stats.map((s) => (
        <div 
          key={s.label} 
          className="flex flex-col gap-2"
        >
          <div className="h-6 mb-2">
            {s.label === "Website" ? (
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <Globe className="h-3 w-3 text-cyan-600 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">API Endpoint</span>
                </div>
                {companySettings?.data?.id && (
                  <button 
                  onClick={() => {
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://property-listing.keenenter.com/api";
                    const feedToken = companySettings?.data?.outbound_handler_token || companySettings?.data?.id;
                    const url = `${baseUrl}/properties/website/${feedToken}`;
                    copyToClipboard(url);
                    toast.success("API URL copied!");
                  }}
                  className="flex items-center gap-1 text-[9px] font-bold text-cyan-600 hover:text-cyan-700 transition-colors uppercase tracking-tight"
                  >
                    <Copy className="h-2.5 w-2.5" />
                    Copy URL
                  </button>
                )}
              </div>
            ) : s.label === "Bayut & Dubizzle" ? (
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <FileText className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">XML Feed</span>
                </div>
                {companySettings?.data?.id && (
                  <button 
                  onClick={() => {
                    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "https://property-listing.keenenter.com/api").replace('/api', '');
                    const feedToken = companySettings?.data?.outbound_handler_token || companySettings?.data?.id;
                    const url = `${baseUrl}/api/feeds/${feedToken}/bayut.xml`;
                    copyToClipboard(url);
                    toast.success("Feed URL copied!");
                  }}
                  className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-tight"
                  >
                    <Copy className="h-2.5 w-2.5" />
                    Copy URL
                  </button>
                )}
              </div>
            ) : null}
          </div>

          <div 
            className={cn(
              "relative bg-card rounded-xl shadow-sm border border-border border-r-[3px] overflow-hidden transition-all hover:shadow-md h-full",
              s.borderColor
            )}
          >
          <div className="p-4 px-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
              <div className={cn("p-1.5 rounded-lg flex items-center justify-center min-h-[32px] min-w-[32px]", s.bgColor)}>
                {s.image ? (
                  <div className="relative h-4 w-12">
                    <NextImage 
                      src={s.image} 
                      alt={s.label} 
                      fill
                      className="object-contain" 
                    />
                  </div>
                ) : (
                  s.icon && <s.icon className={cn("h-4 w-4", s.iconColor)} />
                )}
              </div>
            </div>

            {/* Total */}
            <div className="mb-4">
              <div className="text-2xl font-bold text-foreground">
                {s.total.toLocaleString()}
              </div>
              <div className="text-[11px] text-muted-foreground font-medium">
                Total listings
              </div>
            </div>

            {/* Sub Stats */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex flex-col">
                <div className="text-sm font-bold text-foreground flex items-center justify-center">
                   {s.commercial}
                </div>
                <div className="flex items-center gap-1.5 min-w-[70px]">
                  <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", s.dotColor)} />
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">Commercial</span>
                </div>
              </div>
              
              <div className="w-px h-6 bg-border/80" />

              <div className="flex flex-col">
                <div className="text-sm font-bold text-foreground flex items-center justify-center">
                  {s.residential}
                </div>
                <div className="flex items-center gap-1.5 min-w-[70px]">
                  <div className={cn("w-1.5 h-1.5 rounded-full shrink-0 opacity-40", s.dotColor)} />
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">Residential</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className={cn("h-1.5 w-full rounded-full flex overflow-hidden", s.barBg)}>
              <div 
                className={cn("h-full rounded-full shrink-0", s.barColor)} 
                style={{ width: `${Math.max((s.commercial / s.total) * 100, 10)}%` }} 
              />
            </div>
          </div>
          </div>
        </div>
      ))}
    </div>
  );
}


