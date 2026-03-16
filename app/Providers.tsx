"use client";

import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/api/redux/store";
import { useEffect } from "react";
import { initialize } from "@/api/redux/slices/authSlice";

function HydrationWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <HydrationWrapper>
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
      </HydrationWrapper>
    </Provider>
  );
}
