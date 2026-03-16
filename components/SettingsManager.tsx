"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetCompanySettingsQuery } from "@/api/redux/services/settingsApi";
import { setCompanySettings } from "@/api/redux/slices/settingsSlice";

export function SettingsManager({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { data, isSuccess } = useGetCompanySettingsQuery();

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setCompanySettings(data.data));
    }
  }, [isSuccess, data, dispatch]);

  return <>{children}</>;
}
