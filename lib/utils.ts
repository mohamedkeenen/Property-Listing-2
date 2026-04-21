import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string | Date) {
  if (!dateString) return "";
  
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0) return "Just now";
  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
}

export function copyToClipboard(text: string) {
  // 1. Try Bitrix native copy if available (Best for Bitrix iFrames)
  if (typeof window !== 'undefined' && (window as any).BX?.clipboard) {
    try {
      (window as any).BX.clipboard.copy(text);
      return true;
    } catch (e) {
      console.error('BX.clipboard.copy failed', e);
    }
  }

  // 2. Try Modern Clipboard API
  if (typeof window !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {
      // If it fails (e.g. permission or insecure context), use fallback
      fallbackCopyTextToClipboard(text);
    });
    return true;
  }

  // 3. Fallback for older browsers or restricted environments
  fallbackCopyTextToClipboard(text);
  return true;
}

function fallbackCopyTextToClipboard(text: string) {
  if (typeof document === 'undefined') return;
  
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Style to hide the element
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.width = "2px";
  textArea.style.height = "2px";
  textArea.style.padding = "0";
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback: Unable to copy', err);
  }

  document.body.removeChild(textArea);
}
