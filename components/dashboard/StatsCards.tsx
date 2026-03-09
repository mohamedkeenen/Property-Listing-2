import { Globe, Key, Tag } from "lucide-react";
import { mockListings } from "@/data/mockData";
import { cn } from "@/lib/utils";
import NextImage from "next/image";

export function StatsCards() {
  const sales = mockListings.filter((l) => l.purpose === "Sale");
  const rents = mockListings.filter((l) => l.purpose === "Rent");
  const pf = mockListings.filter((l) => l.portals.pf);
  const bayut = mockListings.filter((l) => l.portals.bayut);
  const web = mockListings.filter((l) => l.portals.website);

  const stats = [
    {
      label: "Sales",
      total: sales.length,
      residential: sales.filter((l) => l.category === "Residential").length,
      commercial: sales.filter((l) => l.category === "Commercial").length,
      icon: Tag,
      color: "#ef4444", // Red
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
      dotColor: "bg-red-500",
      barColor: "bg-red-500",
      barBg: "bg-red-100",
      borderColor: "border-r-red-500",
    },
    {
      label: "Rent",
      total: rents.length,
      residential: rents.filter((l) => l.category === "Residential").length,
      commercial: rents.filter((l) => l.category === "Commercial").length,
      icon: Key,
      color: "#3b82f6", // Blue
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      dotColor: "bg-blue-500",
      barColor: "bg-blue-600",
      barBg: "bg-blue-100",
      borderColor: "border-r-blue-500",
    },
    {
      label: "Property Finder",
      total: pf.length,
      residential: pf.filter((l) => l.category === "Residential").length,
      commercial: pf.filter((l) => l.category === "Commercial").length,
      image: "https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/PF_ljkahc.png",
      color: "#f97316", // Orange
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500",
      dotColor: "bg-orange-600",
      barColor: "bg-orange-600",
      barBg: "bg-orange-100",
      borderColor: "border-r-orange-600",
    },
    {
      label: "Bayut & Dubizzle",
      total: bayut.length,
      residential: bayut.filter((l) => l.category === "Residential").length,
      commercial: bayut.filter((l) => l.category === "Commercial").length,
      image: "https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/bayut_gy4ev2.png",
      color: "#22c55e", // Green
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      dotColor: "bg-green-600",
      barColor: "bg-green-600",
      barBg: "bg-green-100",
      borderColor: "border-r-green-600",
    },
    {
      label: "Website",
      total: web.length,
      residential: web.filter((l) => l.category === "Residential").length,
      commercial: web.filter((l) => l.category === "Commercial").length,
      icon: Globe,
      color: "#06b6d4", // Cyan/Teal
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-600",
      dotColor: "bg-cyan-600",
      barColor: "bg-cyan-600",
      barBg: "bg-cyan-100",
      borderColor: "border-r-cyan-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((s) => (
        <div 
          key={s.label} 
          className={cn(
            "relative bg-card rounded-xl shadow-sm border border-border border-r-[3px] overflow-hidden transition-all hover:shadow-md",
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
      ))}
    </div>
  );
}


