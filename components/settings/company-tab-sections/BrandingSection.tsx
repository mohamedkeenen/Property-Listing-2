import React from "react";
import { Camera, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModernField } from "@/components/ui/modern-field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BrandingSectionProps {
  isAdmin: boolean;
  logo: string;
  banner: string;
  logoPdf: string;
  websiteLink: string;
  setWebsiteLink: (val: string) => void;
  pdfColor: string;
  setPdfColor: (val: string) => void;
  watermarkSize: number;
  setWatermarkSize: (val: number) => void;
  watermarkOpacity: number;
  setWatermarkOpacity: (val: number) => void;
  getLogoUrl: (val: string) => string;
  handleLogoClick: () => void;
  handleBannerClick: () => void;
  handleLogoPdfClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  bannerInputRef: React.RefObject<HTMLInputElement | null>;
  logoPdfInputRef: React.RefObject<HTMLInputElement | null>;
  handleLogoFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBannerFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogoPdfFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BrandingSection({
  isAdmin,
  logo, banner, logoPdf,
  websiteLink, setWebsiteLink,
  pdfColor, setPdfColor,
  watermarkSize, setWatermarkSize,
  watermarkOpacity, setWatermarkOpacity,
  getLogoUrl,
  handleLogoClick, handleBannerClick, handleLogoPdfClick,
  fileInputRef, bannerInputRef, logoPdfInputRef,
  handleLogoFileChange, handleBannerFileChange, handleLogoPdfFileChange
}: BrandingSectionProps) {
  return (
    <Card className="rounded-2xl border-border/50 shadow-xl overflow-hidden backdrop-blur-sm bg-card/50 sticky top-8">
      <CardHeader className="border-b border-border/10 bg-muted/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="font-black text-xl">Branding</CardTitle>
            <CardDescription className="font-medium">Manage your company branding assets.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-8 space-y-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Logo Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Company Logo</h4>
               <div className="h-px flex-1 bg-border/20 ml-4" />
            </div>
            <div 
              onClick={handleLogoClick}
              className={cn(
                "group relative w-full h-40 rounded-2xl border-2 border-dashed border-border flex items-center justify-center transition-all overflow-hidden",
                isAdmin ? "cursor-pointer hover:border-primary/50 hover:bg-primary/5" : "cursor-default opacity-80"
              )}
            >
              {logo ? (
                <div className="relative w-full h-full p-4">
                  <img 
                    src={getLogoUrl(logo)} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white h-8 w-8" />
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-xs font-bold text-muted-foreground">{isAdmin ? "Upload Logo" : "No Logo"}</p>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleLogoFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          {/* Banner Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Offer Banner</h4>
               <div className="h-px flex-1 bg-border/20 ml-4" />
            </div>
            <div 
              onClick={handleBannerClick}
              className={cn(
                "group relative w-full h-40 rounded-2xl border-2 border-dashed border-border flex items-center justify-center transition-all overflow-hidden",
                isAdmin ? "cursor-pointer hover:border-primary/50 hover:bg-primary/5" : "cursor-default opacity-80"
              )}
            >
              {banner ? (
                <div className="relative w-full h-full">
                  <img 
                    src={getLogoUrl(banner)} 
                    alt="Banner Image" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white h-8 w-8" />
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <Camera className="h-6 w-6 mx-auto text-muted-foreground" />
                  <p className="text-xs font-bold text-muted-foreground">{isAdmin ? "Upload Banner" : "No Banner"}</p>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={bannerInputRef} 
              onChange={handleBannerFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          {/* Logo PDF Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Logo PDF</h4>
               <div className="h-px flex-1 bg-border/20 ml-4" />
            </div>
            <div 
              onClick={handleLogoPdfClick}
              className={cn(
                "group relative w-full h-40 rounded-2xl border-2 border-dashed border-border flex items-center justify-center transition-all overflow-hidden",
                isAdmin ? "cursor-pointer hover:border-primary/50 hover:bg-primary/5" : "cursor-default opacity-80"
              )}
            >
              {logoPdf ? (
                <div className="relative w-full h-full p-4">
                  <img 
                    src={getLogoUrl(logoPdf)} 
                    alt="Logo PDF" 
                    className="w-full h-full object-contain transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white h-8 w-8" />
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <Camera className="h-6 w-6 mx-auto text-muted-foreground" />
                  <p className="text-xs font-bold text-muted-foreground">{isAdmin ? "Upload PDF Logo" : "No Logo"}</p>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={logoPdfInputRef} 
              onChange={handleLogoPdfFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
        </div>



        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Website Connection</h4>
             <div className="h-px flex-1 bg-border/20 ml-4" />
          </div>
          <ModernField 
            label="Website Link" 
            placeholder="https://exampla.com" 
            icon={Globe} 
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
            readOnly={!isAdmin}
          />
          
          <div className="flex items-center justify-between">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">PDF Theme Color</h4>
             <div className="h-px flex-1 bg-border/20 ml-4" />
          </div>
          <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-border/50">
            <div 
              className="w-12 h-12 rounded-xl border border-white/20 shadow-lg shrink-0 transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: pdfColor }}
            />
            <div className="flex-1 space-y-1">
              <p className="text-xs font-bold text-foreground">Offer PDF Palette</p>
              <p className="text-[10px] font-medium text-muted-foreground leading-tight">This color will be used as the primary theme for all generated Sales Offers.</p>
            </div>
            <input 
              type="color" 
              value={pdfColor} 
              onChange={(e) => setPdfColor(e.target.value)}
              disabled={!isAdmin}
              className="w-8 h-8 rounded-full border-none bg-transparent cursor-pointer overflow-hidden p-0"
            />
          </div>
        </div>
        <div className="w-full space-y-4 pt-8 border-t border-border/10">
          <div className="flex items-center justify-between">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Watermark Settings</h4>
             <div className="h-px flex-1 bg-border/20 ml-4" />
          </div>
          <div className="relative group/preview w-full aspect-21/9 rounded-2xl overflow-hidden border border-border/50 bg-muted/10 shadow-inner">
            <img 
              src="https://res.cloudinary.com/devht0mp5/image/upload/v1771178818/jason-dent-w3eFhqXjkZE-unsplash_1_mj2jre.jpg" 
              className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]" 
              alt="Watermark Preview"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            
            {logo && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img 
                  src={getLogoUrl(logo)} 
                  style={{ 
                    width: `${(0.10 + (watermarkSize / 10) * 0.40) * 100}%`,
                    opacity: watermarkOpacity / 10,
                    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))"
                  }}
                  className="object-contain transition-all duration-300 ease-out transform-gpu"
                  alt="Logo Overlay"
                />
              </div>
            )}
            
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/90">Live Preview</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Watermark Size</label>
                <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">{Math.round((0.10 + (watermarkSize / 10) * 0.40) * 100)}%</span>
              </div>
              <div className="relative h-10 flex items-center bg-muted/20 px-4 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="1"
                  value={watermarkSize} 
                  onChange={(e) => setWatermarkSize(parseInt(e.target.value))}
                  disabled={!isAdmin}
                  className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Watermark Opacity</label>
                <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">{watermarkOpacity * 10}%</span>
              </div>
              <div className="relative h-10 flex items-center bg-muted/20 px-4 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="1"
                  value={watermarkOpacity} 
                  onChange={(e) => setWatermarkOpacity(parseInt(e.target.value))}
                  disabled={!isAdmin}
                  className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>
        </div>


        {!isAdmin && (
          <div className="p-3 bg-destructive/5 rounded-xl border border-destructive/10 text-destructive text-center w-full mt-4">
            <p className="text-[10px] font-black uppercase tracking-tighter">Access Denied</p>
            <p className="text-[10px] font-medium leading-tight mt-1">Only admins can change branding assets.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
