"use client";

import { NotFoundUI } from "@/components/shared/NotFoundUI";

export default function NotFound() {
  return (
    <NotFoundUI 
      title="Global Discovery Error"
      message="The specific sector you're attempting to access is currently outside our active directory range. Please return to the command center."
    />
  );
}
