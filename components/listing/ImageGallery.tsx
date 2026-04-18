"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);

  const next = () => setActiveImage((prev) => (prev + 1) % images.length);
  const prev = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    
    const interval = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeImage, images.length]);

  return (
    <div className="relative group">
      <div className="relative aspect-square md:aspect-16/7.5 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl bg-muted">
        <img
          src={images[activeImage]}
          alt="Property"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        
        <div className="absolute inset-x-4 md:inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
          <button 
            onClick={prev}
            className="h-8 w-8 md:h-12 md:w-12 rounded-full bg-background/40 backdrop-blur-md border border-border flex items-center justify-center text-foreground pointer-events-auto hover:bg-primary hover:text-white transition-all active:scale-95 shadow-xl opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
          </button>
          <button 
            onClick={next}
            className="h-8 w-8 md:h-12 md:w-12 rounded-full bg-background/40 backdrop-blur-md border border-border flex items-center justify-center text-foreground pointer-events-auto hover:bg-primary hover:text-white transition-all active:scale-95 shadow-xl opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
          </button>
        </div>

        {/* Counter Overlay */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-background/60 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-border flex items-center gap-2 z-30">
          <Clock className="h-3 w-3 md:h-3.5 md:w-3.5 text-foreground/80" />
          <span className="text-[8px] md:text-[10px] font-black text-foreground tracking-widest">
            {activeImage + 1} / {images.length}
          </span>
        </div>

        {/* Vertical Focused Thumbnail Slider - 3 Image System - Hidden on Mobile */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4 p-4 rounded-[2.5rem] bg-background/15 backdrop-blur-3xl border border-border z-20 h-[320px] overflow-hidden">
          <div 
            className="flex flex-col gap-6 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
            style={{ 
              transform: `translateY(calc(110px - ${activeImage * 70}px - ${activeImage * 24}px))` 
            }}
          >
            {images.map((img, i) => {
              const isActive = activeImage === i;
              const distance = Math.abs(activeImage - i);
              const isVisible = distance <= 1;
              
              return (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative shrink-0 w-24 md:w-32 aspect-video rounded-2xl overflow-hidden border-2 transition-all duration-500",
                    isActive 
                      ? "border-primary ring-8 ring-primary/20 shadow-2xl scale-110 z-10" 
                      : "border-transparent opacity-20 grayscale scale-90"
                  )}
                  style={{
                    height: '70px',
                    visibility: isVisible ? 'visible' : (distance <= 2 ? 'visible' : 'hidden'),
                    opacity: isVisible ? undefined : 0
                  }}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Gradient for Depth */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/20 dark:from-black/80 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
