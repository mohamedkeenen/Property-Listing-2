import React from "react";
import { toast as hotToast } from "react-hot-toast";

export type ToastProps = {
  id?: string;
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
    id: props.id,
    duration: 4000,
    style: {
      borderRadius: '1rem',
      background: 'var(--background)',
      color: 'var(--foreground)',
      border: '1px solid var(--border)',
    },
  };

  let id: string;
  if (props.variant === "destructive") {
    id = hotToast.error(content, options);
  } else if (props.variant === "success") {
    id = hotToast.success(content, options);
  } else {
    // default / unspecified
    id = hotToast(content, options);
  }

  return {
    id,
    dismiss: () => hotToast.dismiss(id),
    update: (newProps: ToastProps) => toast({ ...newProps, id }),
  };
};

export function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => hotToast.dismiss(toastId),
  };
}
