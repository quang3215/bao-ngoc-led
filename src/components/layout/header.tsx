"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, Search, User, LogOut, Package, UserCircle, PhoneCall, Store, HelpCircle, ShieldAlert, Newspaper, Lightbulb, MapPin, AlignJustify, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useSettingsStore } from "@/store/settings";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MegaMenu } from "./mega-menu";

export function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems);
  const { user } = useAuthStore();
  const settings = useSettingsStore((state) => state.settings);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="w-full bg-white transition-all duration-300 sticky top-0 z-50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">
      {/* Topbar */}
      <div className="w-full border-b border-gray-200 hidden md:block">
        <div className="container flex h-10 items-center justify-between px-4 md:px-8 max-w-[1400px] mx-auto text-sm font-medium text-[#111827]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4" />
              <span>Hotline: {settings.hotline || "19002098 - 0898109810"}</span>
            </div>
            <Link href="/he-thong-dai-ly" className="flex items-center gap-2 hover:text-[#4A238B] transition-colors">
              <Store className="h-4 w-4" />
              <span>Hệ thống Đại lý</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/cau-hoi-thuong-gap" className="flex items-center gap-1.5 hover:text-[#4A238B] transition-colors">
              <HelpCircle className="h-4 w-4" /> Câu hỏi thường gặp
            </Link>
            <Link href="/ho-tro-chinh-sach" className="flex items-center gap-1.5 hover:text-[#4A238B] transition-colors">
              <ShieldAlert className="h-4 w-4" /> Hỗ trợ chính sách
            </Link>
            <Link href="/tin-tuc" className="flex items-center gap-1.5 hover:text-[#4A238B] transition-colors">
              <Newspaper className="h-4 w-4" /> Tin tức
            </Link>
            <Link href="/showroom" className="flex items-center gap-1.5 hover:text-[#4A238B] transition-colors">
              <Lightbulb className="h-4 w-4" /> Showroom
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container flex h-[84px] items-center justify-between px-4 md:px-8 max-w-[1400px] mx-auto gap-4">
        
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="-ml-2 text-gray-700" />}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:w-[350px] bg-white p-0 flex flex-col">
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col">
                <SheetTitle className="sr-only">Menu Bảo Ngọc LED</SheetTitle>
                <div className="flex justify-center mb-6">
                  <img 
                    src={settings.logoUrl || "/logo.png"} 
                    alt="Bảo Ngọc LED" 
                    className="h-10 w-auto object-contain" 
                  />
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const q = (form.elements.namedItem('q') as HTMLInputElement).value;
                  if (q.trim()) window.location.href = `/tim-kiem?q=${encodeURIComponent(q.trim())}`;
                }} className="relative flex items-center">
                  <input 
                    name="q" type="text" placeholder="Tìm sản phẩm, danh mục..." 
                    className="h-10 w-full pl-4 pr-10 border border-[#4A238B] focus:outline-none text-sm rounded-md"
                  />
                  <button type="submit" className="absolute right-0 h-10 w-10 bg-[#4A238B] flex items-center justify-center text-white rounded-r-md">
                    <Search className="h-4 w-4" />
                  </button>
                </form>
              </div>
              <div className="flex-1 overflow-y-auto p-4 pb-12">
                 <nav className="flex flex-col gap-1 text-sm font-bold text-[#111827]">
                    <Link href="/" className="px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</Link>
                    <Link href="/ve-chung-toi" className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Giới thiệu</Link>
                    
                    <div className="px-4 pt-4 pb-2 mt-2 font-black text-[10px] uppercase text-gray-400 tracking-wider">Danh mục sản phẩm</div>
                    
                    {settings.categories?.map((cat: any, idx: number) => {
                      if (cat.subCategories && cat.subCategories.length > 0) {
                        return (
                          <Accordion type="single" collapsible key={cat.slug} className="w-full">
                            <AccordionItem value={cat.slug} className="border-b-0">
                              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50 rounded-lg data-[state=open]:bg-gray-50">
                                <div className="flex items-center gap-3 text-[#111827]">
                                  {cat.iconUrl && <img src={cat.iconUrl} className="w-5 h-5 object-contain" alt="" />}
                                  {cat.name}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pb-0 pl-12 pr-4">
                                <div className="flex flex-col border-l-2 border-gray-100 ml-2 mt-1 mb-2">
                                  <Link
                                    href={`/danh-muc/${cat.slug}`}
                                    className="py-2.5 pl-4 text-gray-500 hover:text-[#4A238B] font-medium transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    Tất cả {cat.name}
                                  </Link>
                                  {cat.subCategories.map((sub: any) => (
                                    <Link
                                      key={sub.slug}
                                      href={`/danh-muc/${cat.slug}?sub=${sub.slug}`}
                                      className="py-2.5 pl-4 text-gray-500 hover:text-[#4A238B] font-medium transition-colors"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )
                      }
                      
                      return (
                        <Link 
                          key={cat.slug} 
                          href={cat.href || `/danh-muc/${cat.slug}`}
                          className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {cat.iconUrl && <img src={cat.iconUrl} className="w-5 h-5 object-contain" alt="" />}
                          {cat.name}
                        </Link>
                      );
                    })}

                    <div className="px-4 pt-4 pb-2 mt-4 font-black text-[10px] uppercase text-gray-400 tracking-wider border-t border-gray-100">Hỗ trợ khách hàng</div>
                    <Link href="/tin-tuc" className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Tin tức</Link>
                    <Link href="/cau-hoi-thuong-gap" className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Câu hỏi thường gặp</Link>
                    <Link href="/he-thong-dai-ly" className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Hệ thống Đại lý</Link>
                    <Link href="/lien-he" className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Liên hệ</Link>
                 </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo and Primary Links */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/" className="flex items-center justify-center">
             <img src={settings.logoUrl || "/logo.png"} alt={settings.footer?.companyName || "Bảo Ngọc LED"} className="h-[60px] w-auto object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-[#111827] font-bold text-base whitespace-nowrap pt-1">
            <Link href="/ve-chung-toi" className="hover:text-[#4A238B] transition-colors">Giới thiệu</Link>
            <Link href="/lien-he" className="hover:text-[#4A238B] transition-colors">Liên hệ</Link>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl items-center h-10 border border-[#4A238B] rounded">
           <MegaMenu />
           <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const q = (form.elements.namedItem('q') as HTMLInputElement).value;
              if (q.trim()) window.location.href = `/tim-kiem?q=${encodeURIComponent(q.trim())}`;
            }} className="flex-1 flex h-full">
              <input 
                name="q" type="text" placeholder="Tìm sản phẩm, danh mục mong muốn..." 
                className="flex-1 h-full px-4 outline-none text-sm bg-[#e8f5e9]"
              />
              <button type="submit" className="h-full px-5 bg-[#4A238B] text-white flex items-center justify-center hover:bg-[#35156B] transition-colors">
                 <Search className="w-5 h-5" />
              </button>
           </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
           {/* Order Tracking */}
           <Link href="/account/orders" className="hidden lg:flex items-center gap-2 text-[#111827] hover:text-[#4A238B] transition-colors">
              <FileText className="w-6 h-6 stroke-[1.5]" />
              <div className="flex flex-col text-xs font-bold leading-tight">
                 <span>Tra cứu</span>
                 <span>đơn hàng</span>
              </div>
           </Link>

           {/* Account */}
           <div className="relative group hidden sm:flex">
            {user ? (
              <div className="flex items-center gap-2 text-[#111827] hover:text-[#4A238B] transition-colors cursor-pointer">
                <UserCircle className="w-6 h-6 stroke-[1.5]" />
                <div className="flex flex-col text-xs font-bold leading-tight">
                  <span className="font-normal text-gray-500">Xin chào,</span>
                  <span className="truncate max-w-[80px]">{user.email?.split('@')[0]} ▼</span>
                </div>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 text-[#111827] hover:text-[#4A238B] transition-colors cursor-pointer">
                <UserCircle className="w-6 h-6 stroke-[1.5]" />
                <div className="flex flex-col text-xs font-bold leading-tight">
                  <span>Đăng Nhập</span>
                  <span>Tài Khoản ▼</span>
                </div>
              </Link>
            )}
            
            {/* Dropdown menu for logged in users */}
            {user && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-2 flex flex-col">
                  <Link href="/account" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#4A238B]">Trang cá nhân</Link>
                  <Link href="/account/orders" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#4A238B]">Đơn hàng của tôi</Link>
                  <button onClick={handleLogout} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">Đăng xuất</button>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link href="/checkout" className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-gray-100 hover:border-[#4A238B] hover:text-[#4A238B] transition-colors">
            <ShoppingCart className="w-5 h-5 stroke-[2] text-[#111827]" />
            {isMounted && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-600 text-[11px] font-bold text-white flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

      </div>
      {/* Bottom border for main header */}
      <div className="w-full h-1 bg-gray-100 shadow-sm border-b border-gray-200"></div>
    </header>
  );
}
