import React from "react";
import { toast as hotToast, ToastOptions } from "react-hot-toast";
import { Loader2, XCircle, CheckCircle2 } from "lucide-react";

export type ToastProps = {
  id?: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "loading";
  duration?: number;
};

export const toast = (props: ToastProps) => {
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  
  const content = React.createElement(
    "div",
    { className: "flex flex-col gap-0.5 pr-2" },
    props.title && React.createElement(
      "div",
      { className: "text-[13px] font-black tracking-tight leading-none mb-0.5" },
      props.title
    ),
    props.description && React.createElement(
      "div",
      { className: "text-[11px] font-bold opacity-70 leading-relaxed" },
      props.description
    )
  );

  const variantStyles = {
    success: {
      border: isDark ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(16, 185, 129, 0.1)',
      borderLeft: '4px solid #10b981',
      icon: React.createElement(CheckCircle2, { className: "h-5 w-5 text-emerald-500 mt-0.5" })
    },
    destructive: {
      border: isDark ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(239, 68, 68, 0.1)',
      borderLeft: '4px solid #ef4444',
      icon: React.createElement(XCircle, { className: "h-5 w-5 text-red-500 mt-0.5" })
    },
    loading: {
      border: isDark ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(59, 130, 246, 0.1)',
      borderLeft: '4px solid #3b82f6',
      icon: React.createElement(Loader2, { className: "h-5 w-5 text-blue-500 animate-spin mt-0.5" })
    },
    default: {
      border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
      borderLeft: '4px solid #64748b',
      icon: null
    }
  };

  const currentStyle = variantStyles[props.variant || "default"];

  const options: ToastOptions = {
    id: props.id,
    duration: props.duration ?? (props.variant === "loading" ? Infinity : 4000),
    icon: currentStyle.icon,
    style: {
      borderRadius: '1rem',
      background: isDark ? '#1e293b' : '#ffffff',
      color: isDark ? '#f8fafc' : '#0f172a',
      padding: '16px 20px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      border: currentStyle.border,
      borderLeft: currentStyle.borderLeft,
    },
  };

  let toastId: string;
  if (props.variant === "destructive") toastId = hotToast.error(content, options);
  else if (props.variant === "success") toastId = hotToast.success(content, options);
  else if (props.variant === "loading") toastId = hotToast.loading(content, options);
  else toastId = hotToast(content, options);

  return {
    id: toastId,
    update: (newProps: ToastProps) => toast({ ...newProps, id: toastId }),
    dismiss: () => hotToast.dismiss(toastId),
  };
};

export function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => hotToast.dismiss(toastId),
  };
}
