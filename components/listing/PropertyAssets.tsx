"use client";

import { useState } from "react";
import { Play, Search, FileText, Download, Loader2, Video } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

/**
 * BIG VIDEO PLAYER COMPONENT
 */
export function VirtualTourPlayer({ videoUrl, poster, title }: { videoUrl?: string; poster?: string; title?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  if (!videoUrl) return null;

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : url;
    }
    return url;
  };

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden group shadow-xl bg-black">
      {isPlaying ? (
        <iframe 
          src={getEmbedUrl(videoUrl)}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <img src={poster || "https://images.unsplash.com/photo-1600585154340-be6199fbfd1e?w=1200"} className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700" alt="Video Background" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex flex-col justify-end p-10 space-y-4">
            <h3 className="text-3xl font-black text-white uppercase tracking-tight line-clamp-2">{title || "Explore the Space"}</h3>
            <p className="text-sm text-slate-300 font-medium max-w-md">Experience property walkthrough and immersive 3D environment.</p>
            <button 
              onClick={() => setIsPlaying(true)}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-md text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 w-fit"
            >
              <Play className="h-5 w-5 fill-white" />
              Watch Virtual Tour
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * ASSET CARD TEMPLATE FOR SIDEBAR
 */
interface AssetCardProps {
  title: string;
  badgeLabel: string;
  iconColor: string;
  url: string;
  previewContent: React.ReactNode;
  modalContent: React.ReactNode;
  expandLabel: string;
  size?: "sm" | "md" | "lg";
}

function AssetCard({ title, badgeLabel, iconColor, url, previewContent, modalContent, expandLabel, size = "lg" }: AssetCardProps) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl"
  };

  return (
    <Dialog>
      <div className="bg-card backdrop-blur-3xl border border-border rounded-xl p-5 space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("h-6 w-0.5 rounded-full", iconColor)} />
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{title}</h3>
          </div>
          <DialogTrigger asChild>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-primary/80 transition-colors">
              {expandLabel}
            </button>
          </DialogTrigger>
        </div>

        <DialogTrigger asChild>
          <div className="relative aspect-square md:aspect-16/10 rounded-md bg-muted/20 flex items-center justify-center group overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 backdrop-blur-sm">
              <div className="bg-primary text-white px-6 py-2.5 rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-2xl shadow-primary/40">
                Click to View
              </div>
            </div>
            {previewContent}
          </div>
        </DialogTrigger>
      </div>

      <DialogContent className={cn(
        "w-[95vw] max-h-[90vh] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-none shadow-2xl rounded-xl transition-all duration-500",
        sizeClasses[size]
      )}>
        <VisuallyHidden>
            <DialogTitle>{title} Full View</DialogTitle>
        </VisuallyHidden>
        {modalContent}
      </DialogContent>
    </Dialog>
  );
}

/**
 * FLOOR PLANS SIDEBAR CARD
 */
export function FloorPlans({ url }: { url?: string }) {
  if (!url) return null;
  return (
    <AssetCard 
      title="Floor Plan"
      badgeLabel="Plan"
      iconColor="bg-emerald-500"
      url={url}
      expandLabel="Enlarge"
      size="md"
      previewContent={
        <img src={url} alt="Floor plan preview" className="max-w-full max-h-full object-contain p-2 transition-transform duration-700 group-hover:scale-105" />
      }
      modalContent={
        <div className="relative w-full h-full flex items-center justify-center p-8">
          <img src={url} alt="Floor plan full view" className="max-w-full max-h-full object-contain shadow-2xl rounded-xl" />
        </div>
      }
    />
  );
}

/**
 * QR CODE SIDEBAR CARD
 */
export function QRCode({ url }: { url?: string }) {
  if (!url) return null;
  return (
    <AssetCard 
      title="Digital Passport (QR)"
      badgeLabel="Passport"
      iconColor="bg-blue-500"
      url={url}
      expandLabel="Expand"
      size="md"
      previewContent={
        <div className="bg-white p-4 w-full h-full flex items-center justify-center">
            <img src={url} alt="QR Code preview" className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105" />
        </div>
      }
      modalContent={
        <div className="relative w-full h-full flex items-center justify-center p-20 bg-white">
          <img src={url} alt="QR Code full view" className="max-w-full max-h-full object-contain shadow-xl rounded-xl" />
        </div>
      }
    />
  );
}

/**
 * VIRTUAL TOUR SIDEBAR CARD
 */
export function VirtualTourCard({ url, poster }: { url?: string, poster?: string }) {
  if (!url) return null;
  return (
    <AssetCard 
      title="Virtual Tour"
      badgeLabel="Video"
      iconColor="bg-amber-500"
      url={url}
      expandLabel="Play"
      previewContent={
        <div className="relative w-full h-full">
            <img src={poster || "https://images.unsplash.com/photo-1600585154340-be6199fbfd1e?w=800"} className="w-full h-full object-cover brightness-50" alt="Video Preview" />
            <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-white fill-white/20" />
        </div>
      }
      modalContent={
        <VirtualTourPlayer videoUrl={url} title="Virtual Walkthrough" />
      }
    />
  );
}

/**
 * DOCUMENT ROW
 */
export function DocumentRow({ doc }: { doc: any }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!doc.url) return;
    setIsDownloading(true);
    try {
      const response = await fetch(doc.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.title || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(doc.url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center border border-border">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-foreground uppercase tracking-tight truncate max-w-[150px]">{doc.title}</span>
          <span className="text-[9px] font-bold text-muted-foreground uppercase">{doc.size || 'FILE'}</span>
        </div>
      </div>
      <button 
        onClick={handleDownload}
        disabled={isDownloading}
        className="h-8 w-8 rounded-md border border-border flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary transition-all disabled:opacity-50"
      >
        {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      </button>
    </div>
  );
}

/**
 * AGENT REMARK COMPONENT
 */
export function AgentRemark({ note }: { note: any }) {
    return (
        <div className="bg-muted p-5 rounded-lg border border-border space-y-2">
            <p className="text-[12px] text-foreground/80 font-medium leading-relaxed italic">
                "{note.content}"
            </p>
            <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-tighter text-muted-foreground">
                <span>{note.user}</span>
                <span>{new Date(note.date).toLocaleDateString()}</span>
            </div>
        </div>
    );
}

/**
 * BIG DOCUMENTS AND NOTES SIDEBAR CONTAINER
 */
export function DocumentsAndNotes({ documents, notes }: { documents: any[], notes: any[] }) {
  if (documents.length === 0 && notes.length === 0) return null;

  return (
    <div className="bg-card backdrop-blur-3xl border border-border rounded-xl p-6 space-y-8 shadow-sm">
      {documents.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Documents</h3>
          <div className="space-y-5">
            {documents.map((doc, i) => (
              <DocumentRow key={i} doc={doc} />
            ))}
          </div>
        </div>
      )}

      {notes.length > 0 && (
        <div className="pt-6 border-t border-border space-y-4">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Agent Remarks</h3>
          <div className="space-y-3">
            {notes.map((note, i) => (
              <AgentRemark key={i} note={note} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
