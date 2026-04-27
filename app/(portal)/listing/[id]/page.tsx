"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useGetPropertyQuery } from "@/api/redux/services/propertyApi";
import { mapBackendPropertyToFrontend } from "@/lib/mappers";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import { PropertyHeader } from "@/components/listing/PropertyHeader";
import { ImageGallery } from "@/components/listing/ImageGallery";
import { QuickInfoCards } from "@/components/listing/QuickInfoCards";
import { AgentCard } from "@/components/listing/AgentCard";
import { SpecsSidebar } from "@/components/listing/SpecsSidebar";
import { VirtualTourPlayer, VirtualTourCard, FloorPlans, QRCode, DocumentsAndNotes } from "@/components/listing/PropertyAssets";
import { PropertyDescriptions, PremiumDetails } from "@/components/listing/PropertyDetails";
import { LocationMap } from "@/components/listing/LocationMap";
import { ListingSkeleton } from "@/components/listing/ListingSkeleton";
import { NotFoundUI } from "@/components/shared/NotFoundUI";

import "./listing.css";
import { cn } from "@/lib/utils";

export default function PropertyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: propertyResponse, isLoading } = useGetPropertyQuery(id);
  const listing = propertyResponse?.data ? mapBackendPropertyToFrontend(propertyResponse.data) : null;

  if (isLoading) {
    return (
      <div className="listing-page min-h-screen bg-background text-foreground">
        <ListingSkeleton />
      </div>
    );
  }

  if (!listing) {
    return (
      <NotFoundUI 
        title="Entry Not Found"
        message="The requested property identification does not match any records in our secure database. It may have been archived or moved."
        buttonText="Return to Directory"
        onAction={() => router.push("/")}
      />
    );
  }

  const imgs = listing.images.length > 0 ? listing.images : [listing.image];

  return (
    <div className="listing-page min-h-screen bg-background text-foreground">
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-indigo-500/3 dark:bg-blue-500/10 blur-[150px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/3 dark:bg-indigo-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-[1700px] mx-auto px-6 py-2 space-y-4">
        
        {/* Top Navigation & Status */}
        <PropertyHeader 
          title={listing.title}
          price={listing.price}
          location={listing.community}
          reference={listing.reference}
          status={listing.status}
          purpose={listing.purpose}
          onBack={() => router.back()}
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-10">
          
          {/* LEFT COLUMN: Main Visuals & Details - 8/12 or 9/12 */}
          <div className="xl:col-span-8 2xl:col-span-9 space-y-6 lg:space-y-10">
            
            <ImageGallery images={imgs} />
            
            <QuickInfoCards 
              bedrooms={listing.bedrooms}
              bathrooms={listing.bathrooms}
              size={listing.size}
              parking={listing.parking}
            />

            <PropertyDescriptions 
              en={listing.description} 
              ar={listing.descriptionAr} 
              titleEn={listing.title}
              titleAr={listing.titleAr}
            />

            {(listing.video_url || listing.virtual_tour_url) && (
              <div className={cn("grid grid-cols-1 gap-10", (listing.video_url || listing.virtual_tour_url) && listing.property_location ? "md:grid-cols-2" : "")}>
                <VirtualTourPlayer 
                  videoUrl={listing.virtual_tour_url || listing.video_url} 
                  poster={imgs[0]} 
                  title={listing.title} 
                />
                {listing.property_location && (
                  <LocationMap location={listing.community} />
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-8">
                <PremiumDetails fields={listing.custom_fields ?? []} />
            </div>

          </div>

          {/* RIGHT COLUMN: Specs & Agent - 4/12 or 3/12 */}
          <div className="xl:col-span-4 2xl:col-span-3 space-y-6 lg:space-y-10">
            <div className="xl:sticky xl:top-10 space-y-6 lg:space-y-10">
              <SpecsSidebar 
                category={listing.category}
                status={listing.status}
                type={listing.type}
                purpose={listing.purpose}
                updatedAt={listing.updatedAt}
                portals={listing.portals}
              />
              
              <AgentCard 
                name={listing.listingAgent}
                avatar={listing.listingAgentAvatar}
                phone={listing.agentPhone}
                email={listing.agentEmail}
              />

              <VirtualTourCard url={listing.virtual_tour_url || listing.video_url} poster={imgs[0]} />

              <FloorPlans url={listing.floorPlanImage} />

              <QRCode url={listing.qr_url} />
              
              <DocumentsAndNotes documents={listing.documents ?? []} notes={listing.notes ?? []} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}