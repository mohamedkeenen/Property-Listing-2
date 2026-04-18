"use client";

import { useState } from "react";
import { Play, Search, FileText, Download, Loader2 } from "lucide-react";

export function VirtualTour({ videoUrl, poster, title }: { videoUrl?: string; poster?: string; title?: string }) {
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
    <div className="relative aspect-video rounded-3xl md:rounded-[2.5rem] overflow-hidden group shadow-xl border border-border bg-black">
      {isPlaying ? (
        <iframe 
          src={getEmbedUrl(videoUrl)}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <img src={poster || "https://images.unsplash.com/photo-1600585154340-be6199fbfd1e?w=1200"} className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700" alt="3D" />
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

export function FloorPlans() {
  return (
    <div className="bg-card backdrop-blur-3xl border border-border rounded-[2.5rem] p-10 space-y-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-1 bg-emerald-500 rounded-full" />
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Floor Plans</h3>
        </div>
        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-primary/80 transition-colors">
          Download PDF
        </button>
      </div>

      <div className="relative aspect-square rounded-3xl bg-muted border border-border flex items-center justify-center group overflow-hidden">
        <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
           <button className="bg-primary text-white px-6 py-2 rounded-xl font-bold transition-transform hover:scale-105 shadow-xl">View Full Plan</button>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800" 
          alt="Floor plan" 
          className="w-full h-full object-cover opacity-60 grayscale dark:brightness-125 dark:invert"
        />
      </div>
    </div>
  );
}

function DocumentRow({ doc }: { doc: any }) {
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
      // Fallback for CORS issues or other errors
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
        className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary transition-all disabled:opacity-50"
      >
        {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function DocumentsAndNotes({ documents, notes }: { documents: any[], notes: any[] }) {
  if (documents.length === 0 && notes.length === 0) return null;

  return (
    <div className="bg-card backdrop-blur-3xl border border-border rounded-[2.5rem] p-8 space-y-8 shadow-sm">
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
              <div key={i} className="bg-muted p-5 rounded-3xl border border-border space-y-2">
                <p className="text-[12px] text-foreground/80 font-medium leading-relaxed italic">
                  "{note.content}"
                </p>
                <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-tighter text-muted-foreground">
                  <span>{note.user}</span>
                  <span>{new Date(note.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
