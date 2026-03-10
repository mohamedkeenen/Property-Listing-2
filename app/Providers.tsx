"use client";

import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
        <Toaster 
          position="top-center" 
          toastOptions={{
            className: "text-sm font-bold shadow-2xl rounded-2xl",
            duration: 4000,
          }}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
