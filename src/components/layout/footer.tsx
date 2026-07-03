"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Globe, PlayCircle, MessageCircle, Music } from "lucide-react";
import { useSettingsStore } from "@/store/settings";
import { useEffect } from "react";

export function Footer() {
  const { settings, fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 mt-auto">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.footer.companyName} className="h-12 w-auto object-contain" />
              ) : (
                <span className="text-2xl font-black text-primary tracking-tight">
                  {settings.footer.companyName}
                </span>
              )}
            </Link>
            <p className="text-sm text-slate-600 mb-6 whitespace-pre-line leading-relaxed">
              {settings.footer.description}
            </p>
            <div className="flex items-center gap-3">
              {settings.socialLinks?.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-colors">
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.youtube && (
                <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-red-600 hover:text-white transition-colors">
                  <PlayCircle className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.zaloOA && (
                <a href={settings.socialLinks.zaloOA} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-500 hover:text-white transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.tiktok && (
                <a href={settings.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-black hover:text-white transition-colors">
                  <Music className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
          
          {settings.footer.linkGroups?.map((group) => (
            <div key={group.id}>
              <h3 className="font-bold text-lg mb-4 text-slate-900">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-sm text-slate-600 hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-bold text-lg mb-4 text-slate-900">Liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                  <strong className="text-slate-900">{settings.footer.companyName}</strong><br />
                  Mã số thuế: {settings.footer.taxCode}<br />
                  Địa chỉ: {settings.footer.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-slate-600 font-medium">{settings.hotline}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-slate-600">{settings.footer.email}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} {settings.footer.companyName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <Link href="/trang/dieu-khoan" className="hover:text-primary transition-colors">Điều khoản</Link>
            <span>&middot;</span>
            <Link href="/trang/bao-mat" className="hover:text-primary transition-colors">Bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
