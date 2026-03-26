"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCompanySettingsQuery } from "@/api/redux/services/settingsApi";
import { setCompanySettings } from "@/api/redux/slices/settingsSlice";
import { selectToken, selectIsHydrated } from "@/api/redux/slices/authSlice";

export function SettingsManager({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const isHydrated = useSelector(selectIsHydrated);
  
  const { data, isSuccess } = useGetCompanySettingsQuery(undefined, {
    skip: !isHydrated || !token,
  });

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setCompanySettings(data.data));
    }
  }, [isSuccess, data, dispatch]);

  return <>{children}</>;
}
