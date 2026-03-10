import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keen Enterprises | Property Portal",
  description: "Advanced property management for premium real estate",
  icons: {
    icon: [
      { url: "/logo.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/logo.jpg", sizes: "192x192", type: "image/jpeg" },
    ],
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-h-0 h-full overflow-hidden">
              <header className="h-14 flex items-center justify-between border-b border-border/40 px-4 bg-background sticky top-0 z-20 shrink-0">
                <SidebarTrigger />
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-hidden flex flex-col min-h-0 min-w-0">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
