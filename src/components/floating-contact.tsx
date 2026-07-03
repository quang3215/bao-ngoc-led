"use client";

import { useEffect } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { useSettingsStore } from "@/store/settings";

export function FloatingContact() {
  const { settings, fetchSettings, isLoading } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  if (isLoading) return null;

  // Clean Zalo number for the URL (remove spaces, etc)
  const zaloNumber = settings.zalo.replace(/\s+/g, '');
  const zaloLink = `https://zalo.me/${zaloNumber}`;
  
  // Clean hotline for tel link
  const telLink = `tel:${settings.hotline.replace(/\s+/g, '')}`;

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-3 md:gap-4">
      {/* Zalo Button */}
      <a 
        href={zaloLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-[#0068ff] rounded-full shadow-lg shadow-blue-500/30 hover:scale-110 transition-transform duration-300"
      >
        <div className="absolute inset-0 rounded-full bg-[#0068ff] animate-ping opacity-20" />
        <MessageCircle className="h-6 w-6 md:h-7 md:w-7 text-white" />
        
        {/* Tooltip */}
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white text-slate-800 text-sm font-semibold rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat Zalo
        </span>
      </a>

      {/* Phone Button */}
      <a 
        href={telLink}
        className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-red-600 rounded-full shadow-lg shadow-red-500/30 hover:scale-110 transition-transform duration-300"
      >
        <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20" />
        <Phone className="h-5 w-5 md:h-6 md:w-6 text-white" />
        
        {/* Tooltip */}
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white text-slate-800 text-sm font-semibold rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Gọi {settings.hotline}
        </span>
      </a>
    </div>
  );
}
