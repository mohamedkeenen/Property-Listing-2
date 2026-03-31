"use client";

import { useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useGetPropertyQuery } from "@/api/redux/services/propertyApi";
import { mapBackendPropertyToFrontend } from "@/lib/mappers";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, BedDouble, Bath, Maximize, Car, MapPin, Building2, User, Calendar,
  Phone, ChevronLeft, ChevronRight, FileText, Tag, Armchair, Loader2, Image as ImageIcon
} from "lucide-react";

export default function PropertyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: propertyResponse, isLoading } = useGetPropertyQuery(id);
  const listing = propertyResponse?.data ? mapBackendPropertyToFrontend(propertyResponse.data) : null;
  const [activeImage, setActiveImage] = useState(0);
  const thumbRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Requesting Source Files...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-12 text-center max-w-sm mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="h-20 w-20 rounded-3xl bg-muted mx-auto flex items-center justify-center">
          <ArrowLeft className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <div className="space-y-2">
           <h3 className="text-xl font-black text-foreground">Property Depleted</h3>
           <p className="text-xs text-muted-foreground font-medium px-8">The requested digital asset could not be located in our encrypted database clusters.</p>
        </div>
        <Button variant="outline" className="h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/40 hover:bg-muted" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Intelligence
         </Button>
      </div>
    );
  }

  const imgs = listing.images.length > 0 ? listing.images : [listing.image];

  const goSlide = (dir: number) => {
    setActiveImage((prev) => {
      const next = prev + dir;
      if (next < 0) return imgs.length - 1;
      if (next >= imgs.length) return 0;
      return next;
    });
  };

  const statusColors: Record<string, string> = {
    Live: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    Draft: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    Pending: "bg-blue-500/10 text-blue-600 border-blue-200",
    Archived: "bg-gray-500/10 text-gray-500 border-gray-200",
    Pocket: "bg-purple-500/10 text-purple-600 border-purple-200",
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
       <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="rounded-xl" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">{listing.title}</h1>
            <Badge variant="outline" className={statusColors[listing.status]}>{listing.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{listing.reference} • {listing.community}, {listing.location}</p>
        </div>
      </div>

       {/* Main Image Slider */}
       <div className="relative rounded-2xl overflow-hidden bg-black/95 aspect-video group">
        {imgs[activeImage] ? (
          <img
            src={imgs[activeImage]}
            alt={listing.title}
            className="w-full h-full object-contain transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ImageIcon className="h-12 w-12 text-muted-foreground/20" />
          </div>
        )}
        {/* Overlay with price */}
        <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/70 via-black/30 to-transparent p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/80 text-sm">{listing.purpose === "Rent" ? "Annual Rent" : "Sale Price"}</p>
               <p className="text-white text-3xl font-bold">AED {listing.price.toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">{listing.type}</Badge>
               <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">{listing.purpose}</Badge>
            </div>
          </div>
        </div>
        {/* Navigation arrows */}
        {imgs.length > 1 && (
          <>
            <button
              onClick={() => goSlide(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => goSlide(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        {/* Image counter */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
          {activeImage + 1} / {imgs.length}
        </div>
      </div>

       {/* Thumbnail strip */}
       {imgs.length > 1 && (
        <div ref={thumbRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {imgs.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`shrink w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                i === activeImage ? "border-primary ring-2 ring-primary/30" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <div className="relative w-full h-full bg-black/90">
                {img ? (
                  <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <ImageIcon className="h-4 w-4 text-muted-foreground/20" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

       {/* Quick specs */}
       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {listing.bedrooms > 0 && (
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BedDouble className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bedrooms</p>
              <p className="font-semibold text-foreground">{listing.bedrooms}</p>
            </div>
          </div>
        )}
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <Bath className="h-5 w-5 text-cyan-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bathrooms</p>
            <p className="font-semibold text-foreground">{listing.bathrooms}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Maximize className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Size</p>
             <p className="font-semibold text-foreground">{listing.size.toLocaleString()} sq.ft</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Car className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Parking</p>
            <p className="font-semibold text-foreground">{listing.parking}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: descriptions */}
        <div className="md:col-span-2 space-y-6">
          {/* Description EN */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Description
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
          </div>

           {/* Description AR */}
           {listing.descriptionAr && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-3" dir="rtl">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> الوصف
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{listing.descriptionAr}</p>
            </div>
          )}

           {/* Details grid */}
           <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-foreground">Property Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <span className="text-foreground font-medium">{listing.community}, {listing.subCommunity}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Building:</span>
                <span className="text-foreground font-medium">{listing.building || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Unit:</span>
                <span className="text-foreground font-medium">{listing.unitNo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Armchair className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Furnished:</span>
                <span className="text-foreground font-medium">{listing.furnished}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Available:</span>
                <span className="text-foreground font-medium">{listing.availableFrom}</span>
              </div>
              {listing.permitNumber && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Permit:</span>
                  <span className="text-foreground font-medium">{listing.permitNumber}</span>
                </div>
              )}
            </div>
          </div>

           {/* Amenities */}
           {listing.amenities.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-foreground">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((a) => (
                  <Badge key={a} variant="outline" className="rounded-lg px-3 py-1">{a}</Badge>
                ))}
              </div>
            </div>
          )}

           {/* Portal Status */}
           <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-foreground">Portal Status</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge variant={listing.portals.pf ? "default" : "secondary"} className="rounded-lg">
                Property Finder {listing.portals.pf ? "✓" : "✗"}
              </Badge>
              <Badge variant={listing.portals.bayut ? "default" : "secondary"} className="rounded-lg">
                Bayut {listing.portals.bayut ? "✓" : "✗"}
              </Badge>
              <Badge variant={listing.portals.website ? "default" : "secondary"} className="rounded-lg">
                Website {listing.portals.website ? "✓" : "✗"}
              </Badge>
            </div>
          </div>
        </div>

         {/* Right sidebar: Agent & Admin */}
         <div className="space-y-4">
          {/* Agent card */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-foreground text-sm">Listing Agent</h3>
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0">
                {listing.listingAgentAvatar ? (
                  <img
                    src={listing.listingAgentAvatar}
                    alt={listing.listingAgent}
                    className="w-full h-full rounded-full object-cover ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{listing.listingAgent}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" /> Agent
                </p>
              </div>
            </div>
          </div>

           {/* Owner card */}
           <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-foreground text-sm">Admin</h3>
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0">
                {listing.ownerAvatar ? (
                  <img
                    src={listing.ownerAvatar}
                    alt={listing.owner}
                    className="w-full h-full rounded-full object-cover ring-2 ring-muted"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-muted flex items-center justify-center ring-2 ring-muted-foreground/10">
                    <User className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{listing.owner}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {listing.ownerPhone}
                </p>
              </div>
            </div>
          </div>

           {/* Quick info */}
           <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-foreground text-sm">Quick Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                 <span className="text-foreground font-medium">{listing.category}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="text-foreground font-medium">{listing.type}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purpose</span>
                <span className="text-foreground font-medium">{listing.purpose}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span className="text-foreground font-medium">{formatRelativeTime(listing.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
