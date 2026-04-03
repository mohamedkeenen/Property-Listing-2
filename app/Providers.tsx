"use client";

import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/api/redux/store";
import { useEffect } from "react";
import { initialize } from "@/api/redux/slices/authSlice";
import { SettingsManager } from "@/components/SettingsManager";

function HydrationWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search;

      if (!search) {
        dispatch(initialize());
        return;
      }

      const urlParams = new URLSearchParams(search);
      const domain = urlParams.get("DOMAIN");
      const authId = urlParams.get("AUTH_ID");
      const refreshId = urlParams.get("REFRESH_ID");
      const memberId = urlParams.get("MEMBER_ID");
      const lang = urlParams.get("LANG");
      const placement = urlParams.get("PLACEMENT");

      console.log("Bitrix Params:", {
        domain,
        authId,
        refreshId,
      });

      if (domain && authId) {
        dispatch(initialize({
          domain,
          authId,
          refreshId,
          memberId,
          lang,
          placement
        }));
      } else {
        dispatch(initialize());
      }
    } else {
      dispatch(initialize());
    }
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
            <SettingsManager>
              {children}
            </SettingsManager>
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
