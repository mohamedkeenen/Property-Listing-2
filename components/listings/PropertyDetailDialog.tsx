import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NextImage from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PropertyListing } from "@/data/mockData";
import { Building2, BedDouble, Bath, Maximize, Car, MapPin, User, Calendar } from "lucide-react";

interface Props {
  listing: PropertyListing | null;
  open: boolean;
  onClose: () => void;
}

export function PropertyDetailDialog({ listing, open, onClose }: Props) {
  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{listing.title}</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-56 rounded-lg overflow-hidden">
          <NextImage src={listing.image} alt={listing.title} fill className="object-cover" />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge>{listing.purpose}</Badge>
          <Badge variant="outline">{listing.type}</Badge>
          <Badge variant="outline">{listing.category}</Badge>
          <Badge variant="secondary">{listing.status}</Badge>
        </div>

        <div className="text-2xl font-bold text-primary">
          AED {listing.price.toLocaleString()}
          {listing.purpose === "Rent" && <span className="text-sm font-normal text-muted-foreground"> /year</span>}
        </div>

        <Separator />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {listing.bedrooms > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <BedDouble className="h-4 w-4 text-muted-foreground" />
              <span>{listing.bedrooms} Bedrooms</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Bath className="h-4 w-4 text-muted-foreground" />
            <span>{listing.bathrooms} Bathrooms</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Maximize className="h-4 w-4 text-muted-foreground" />
            <span>{listing.size.toLocaleString()} sq.ft</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span>{listing.parking} Parking</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Description</h3>
          <p className="text-sm text-muted-foreground">{listing.description}</p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{listing.community}, {listing.subCommunity}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{listing.building || "—"} {listing.unitNo}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Agent: {listing.listingAgent}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Available: {listing.availableFrom}</span>
            </div>
          </div>
        </div>

        {listing.amenities.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((a) => (
                  <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Portal Status</h3>
          <div className="flex gap-2">
            <Badge variant={listing.portals.pf ? "default" : "secondary"}>Property Finder {listing.portals.pf ? "✓" : "✗"}</Badge>
            <Badge variant={listing.portals.bayut ? "default" : "secondary"}>Bayut {listing.portals.bayut ? "✓" : "✗"}</Badge>
            <Badge variant={listing.portals.website ? "default" : "secondary"}>Website {listing.portals.website ? "✓" : "✗"}</Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
