"use client";

import { useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useGetPropertyQuery } from "@/api/redux/services/propertyApi";
import { mapBackendPropertyToFrontend } from "@/lib/mappers";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, BedDouble, Bath, Maximize, Car, MapPin, Building2, User, Calendar,
  Phone, ChevronLeft, ChevronRight, FileText, Tag, Loader2, Image as ImageIcon,
  Clock, Hash, Globe
} from "lucide-react";

export default function PropertyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: propertyResponse, isLoading } = useGetPropertyQuery(id);
  const listing = propertyResponse?.data ? mapBackendPropertyToFrontend(propertyResponse.data) : null;
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Loading property details...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-8">
        <div className="text-center max-w-lg space-y-8">
          <div className="mx-auto h-24 w-24 rounded-4xl bg-muted/50 border border-border/40 flex items-center justify-center shadow-inner">
            <ArrowLeft className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase">Property Not Found</h2>
            <p className="text-muted-foreground font-medium px-12 opacity-60">We couldn't find the requested property in our current database.</p>
          </div>
          <Button onClick={() => router.push("/")} size="lg" className="h-16 px-10 rounded-4xl font-black text-[12px] uppercase tracking-widest bg-primary shadow-2xl shadow-primary/20 hover:scale-[1.05] transition-all">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const imgs = listing.images.length > 0 ? listing.images : [listing.image];

  const goSlide = (dir: number) => {
    setActiveImage((prev) => {
      let next = prev + dir;
      if (next < 0) next = imgs.length - 1;
      if (next >= imgs.length) next = 0;
      return next;
    });
  };

  const statusColors: Record<string, string> = {
    Live: "bg-emerald-500 text-white border-emerald-500",
    Draft: "bg-yellow-500 text-white border-yellow-500",
    Pending: "bg-blue-500 text-white border-blue-500",
    Archived: "bg-gray-500 text-white border-gray-500",
    Pocket: "bg-purple-500 text-white border-purple-500",
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Premium Header Bar */}
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-2xl border-b border-border/50 px-8 py-6">
        <div className="flex items-start justify-between gap-6 w-full max-w-[1800px] mx-auto">
          <div className="flex items-center gap-10 min-w-0">
            <Button 
                variant="outline" 
                size="icon" 
                className="h-14 w-14 shrink-0 rounded-2xl border-border/40 bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-95 shadow-sm group" 
                onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
            </Button>
            
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-6 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-foreground truncate tracking-tighter uppercase leading-none">{listing.title}</h1>
                <div className="flex items-center gap-3 bg-primary/10 text-primary px-5 py-2.5 rounded-2xl shrink-0">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70">
                        {listing.purpose === "Rent" ? "RENTAL:" : "PRICE:"}
                    </span>
                    <span className="text-xl font-black tracking-tighter">AED {listing.price.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground font-bold uppercase tracking-widest opacity-60 mt-1">
                <span className="flex items-center gap-2"><Hash className="h-3.5 w-3.5" /> {listing.reference}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-border" />
                <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Dubai, {listing.community}</span>
              </div>
            </div>
          </div>

          <Badge className={cn("px-8 py-2.5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/10 ring-8 ring-emerald-500/5 transition-all", statusColors[listing.status])}>
            {listing.status}
          </Badge>
        </div>
      </div>

      <main className="flex-1 w-full max-w-[1800px] mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Cinematic Image Gallery */}
            <div className="relative rounded-[4rem] overflow-hidden bg-black ring-1 ring-border/20 group shadow-2xl">
              <div className="h-[500px] flex items-center justify-center relative z-10">
                {imgs[activeImage] ? (
                  <img
                    src={imgs[activeImage]}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-6 py-32 opacity-10">
                    <ImageIcon className="h-24 w-24" />
                    <p className="text-sm font-black uppercase tracking-[0.3em]">No Visual Assets Available</p>
                  </div>
                )}
              </div>

              {/* Navigation Arrows */}
              {imgs.length > 1 && (
                <>
                  <button onClick={() => goSlide(-1)} className="absolute left-8 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-black/50 hover:bg-primary backdrop-blur-xl border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 z-20 cursor-pointer">
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button onClick={() => goSlide(1)} className="absolute right-8 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-black/50 hover:bg-primary backdrop-blur-xl border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 z-20 cursor-pointer">
                    <ChevronRight className="h-8 w-8" />
                  </button>
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-xl border border-white/10 text-white text-[10px] font-black px-8 py-3 rounded-full uppercase tracking-[0.3em] z-20">
                    FRAME {activeImage + 1} / {imgs.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails Strip */}
            {imgs.length > 1 && (
                <div className="flex gap-6 overflow-x-auto py-8 px-4 scrollbar-none snap-x w-full">
                {imgs.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={cn(
                            "relative shrink-0 w-48 aspect-video rounded-2xl overflow-hidden border-2 transition-all duration-300 snap-start",
                            i === activeImage 
                                ? "border-primary ring-8 ring-primary/10 scale-105 shadow-xl shadow-primary/20 z-10" 
                                : "border-transparent grayscale opacity-40 hover:opacity-100 hover:grayscale-0"
                        )}
                    >
                        <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                ))}
                </div>
            )}

            {/* Quick Specs Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Bedrooms", val: listing.bedrooms, icon: BedDouble, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Bathrooms", val: listing.bathrooms, icon: Bath, color: "text-cyan-500", bg: "bg-cyan-500/10" },
                    { label: "Area", val: `${listing.size.toLocaleString()} SQFT`, icon: Maximize, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Parking", val: listing.parking || "N/A", icon: Car, color: "text-amber-500", bg: "bg-amber-500/10" },
                ].map((spec, i) => (
                    <div key={i} className="bg-card border border-border/40 rounded-3xl p-8 flex items-center gap-6 shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className={cn("h-16 w-16 rounded-[1.25rem] flex items-center justify-center shadow-inner shrink-0", spec.bg)}>
                            <spec.icon className={cn("h-8 w-8", spec.color)} />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground truncate">{spec.label}</p>
                            <p className="text-2xl font-black text-foreground truncate leading-none mt-1">{spec.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Description Sections */}
            <div className="flex flex-col gap-10">
                <div className="bg-card border border-border/40 rounded-[3rem] p-12 space-y-8 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 rounded-2xl bg-primary/10 text-primary">
                            <FileText className="h-7 w-7" />
                        </div>
                        <h3 className="text-[13px] font-black uppercase tracking-[0.3em] text-foreground">Intelligence Briefing</h3>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed font-bold opacity-80 whitespace-pre-line">{listing.description}</p>
                </div>

                {listing.descriptionAr && (
                    <div className="bg-card border border-border/40 rounded-[3rem] p-12 space-y-8 text-right shadow-sm" dir="rtl">
                        <div className="flex items-center gap-4">
                            <div className="p-3.5 rounded-2xl bg-primary/10 text-primary">
                                <FileText className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-widest text-foreground leading-tight">Property Briefing Details</h3>
                        </div>
                        <p className="text-lg text-muted-foreground leading-loose font-bold opacity-80 font-arabic whitespace-pre-line">{listing.descriptionAr}</p>
                    </div>
                )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1 space-y-10">
            {/* Digital Specifications Matrix */}
            <div className="bg-card border border-border/40 rounded-[3rem] p-10 space-y-10 shadow-sm sticky top-32">
                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground border-b border-border/40 pb-6">Digital Specifications</h3>
                <div className="space-y-8">
                    {[
                        { label: "Category", val: listing.category, icon: Building2 },
                        { label: "Status", val: listing.status, icon: Tag },
                        { label: "Type", val: listing.type, icon: Hash },
                        { label: "Purpose", val: listing.purpose, icon: Calendar },
                        { label: "Refreshed", val: formatRelativeTime(listing.updatedAt), icon: Clock },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-5">
                                <item.icon className="h-5 w-5 text-primary opacity-40 group-hover:opacity-100 transition-all" />
                                <span className="text-[12px] font-black text-muted-foreground uppercase tracking-wider">{item.label}</span>
                            </div>
                            <span className="text-sm font-black text-foreground">{item.val}</span>
                        </div>
                    ))}
                </div>

                <div className="pt-8 space-y-8 border-t border-border/40">
                    <p className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground">Gateway Exposure Status</p>
                    <div className="flex flex-wrap gap-5">
                        {[
                            { id: "pf", label: "PF", icon: "https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/PF_ljkahc.png", active: listing.portals.pf },
                            { id: "bayut", label: "Bayut", icon: "https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/bayut_gy4ev2.png", active: listing.portals.bayut },
                            { id: "dubizzle", label: "Dubizzle", icon: "https://res.cloudinary.com/devht0mp5/image/upload/v1775823210/download_gzle7f.png", active: listing.portals.dubizzle },
                            { id: "website", label: "Portal", icon: "icon", active: listing.portals.website },
                            { id: "bitrix", label: "Bitrix24", icon: "https://res.cloudinary.com/devht0mp5/image/upload/v1775823210/download_1_eswdk2.png", active: true },
                        ].map((portal, i) => (
                            <div key={i} className={cn(
                                "relative h-14 w-14 rounded-2xl border border-border/40 flex items-center justify-center p-3 transition-all group",
                                portal.active ? "bg-card border-primary ring-8 ring-primary/5 opacity-100 shadow-xl shadow-primary/5" : "opacity-20 grayscale border-dashed"
                            )}>
                                {portal.id === "website" ? (
                                    <Globe className="h-7 w-7 text-blue-500" />
                                ) : (
                                    <img src={portal.icon} alt={portal.label} className="w-full h-full object-contain" title={portal.label} />
                                )}
                                {portal.active && (
                                    <div className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background shadow-lg animate-pulse" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Agent Partner Section */}
            <div className="bg-card border border-border/40 rounded-[3rem] p-10 space-y-8 group transition-all hover:bg-muted/5 shadow-sm sticky top-32">
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mb-6">Certified Partner</p>
                <div className="flex flex-col items-center text-center gap-6">
                    <div className="relative h-32 w-32 shrink-0 p-1.5 rounded-4xl bg-linear-to-tr from-primary to-indigo-600 transition-transform group-hover:rotate-6 shadow-2xl shadow-primary/20">
                        <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-background">
                            {listing.listingAgentAvatar ? (
                                <img src={listing.listingAgentAvatar} alt={listing.listingAgent} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                    <User className="h-14 w-14 text-muted-foreground/30" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2 min-w-0">
                        <p className="text-2xl font-black text-foreground leading-tight tracking-tighter uppercase">{listing.listingAgent}</p>
                        <p className="text-[10px] uppercase font-black text-primary tracking-widest opacity-80">Certified Advisor</p>
                    </div>
                </div>
                <Button className="w-full h-13 rounded-3xl font-black text-[12px] uppercase tracking-[0.2em] gap-3 bg-primary shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                    <Phone className="h-4.5 w-4.5" /> Initialize Contact
                </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}