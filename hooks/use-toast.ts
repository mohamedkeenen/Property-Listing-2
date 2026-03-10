import React from "react";
import { toast as hotToast } from "react-hot-toast";

type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
};

export const toast = (props: ToastProps) => {
  const content = React.createElement(
    "div",
    { className: "flex flex-col gap-1" },
    props.title && React.createElement("div", { className: "text-sm font-bold text-foreground" }, props.title),
    props.description && React.createElement("div", { className: "text-xs text-muted-foreground font-medium opacity-90" }, props.description)
  );

  const options = {
    duration: 4000,
    style: {
      borderRadius: '1rem',
      background: 'var(--background)',
      color: 'var(--foreground)',
      border: '1px solid var(--border)',
    },
  };

  if (props.variant === "destructive") {
    return hotToast.error(content, options);
  }
  
  if (props.variant === "success") {
    return hotToast.success(content, options);
  }

  // default / unspecified
  return hotToast(content, options);
};

export function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => hotToast.dismiss(toastId),
  };
}
