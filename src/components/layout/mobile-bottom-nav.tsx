"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Tag, MapPin, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Sản phẩm", href: "/danh-muc/tat-ca", icon: LayoutGrid },
  { name: "Khuyến mãi", href: "/tin-tuc", icon: Tag }, // using /tin-tuc or a specific promo page
  { name: "Showroom", href: "/showroom", icon: MapPin },
  { name: "Tài khoản", href: "/account", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex items-center justify-between px-2 h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-[#4A238B]" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive ? "stroke-[2.5]" : "stroke-[1.5]")} />
              <span className={cn("text-[10px] font-medium leading-none", isActive && "font-bold")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
