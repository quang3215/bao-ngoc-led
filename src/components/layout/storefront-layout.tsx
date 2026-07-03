"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { FloatingContact } from "../floating-contact";
import { useAuthStore } from "@/store/auth";

import { MobileBottomNav } from "./mobile-bottom-nav";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const initializeAuth = useAuthStore(state => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isAdmin) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="relative min-h-screen w-full bg-gray-50 text-gray-900 font-sans selection:bg-primary/20">
      {/* Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen w-full pb-16 md:pb-0">
        <Header />
        <main className="flex-1 w-full flex flex-col">{children}</main>
        <Footer />
        <MobileBottomNav />
        <FloatingContact />
      </div>
    </div>
  );
}
