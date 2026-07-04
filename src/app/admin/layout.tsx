"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, FileText, Layout, Home, Menu, Grid, MessageSquare, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ADMIN_EMAIL = "lmquang28@gmail.com";

const SIDEBAR_ITEMS = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Đơn hàng", href: "/admin/orders", icon: ShoppingCart },
  { name: "Khách hàng", href: "/admin/customers", icon: Users },
  { name: "Tin nhắn", href: "/admin/contacts", icon: MessageSquare },
  { name: "Đánh giá", href: "/admin/reviews", icon: Star },
  { name: "Danh mục", href: "/admin/categories", icon: Grid },
  { name: "Sản phẩm", href: "/admin/products", icon: Package },
  { name: "Các trang", href: "/admin/pages", icon: FileText },
  { name: "Trang chủ", href: "/admin/homepage", icon: Home },
  { name: "Menu điều hướng", href: "/admin/menu", icon: Menu },
  { name: "Chân trang", href: "/admin/footer", icon: Layout },
  { name: "Cài đặt", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      toast.error("Vui lòng đăng nhập để truy cập trang quản trị!");
      router.replace("/login");
      return;
    }

    if (user.email !== ADMIN_EMAIL) {
      toast.error("Tài khoản của bạn không có quyền truy cập trang quản trị!");
      router.replace("/");
      return;
    }

    setIsAuthorized(true);
  }, [user, isLoading, router]);

  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#4A238B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Đang xác thực quyền Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/" className="inline-block">
            <img src="/logo.png" alt="Bảo Ngọc LED" className="h-10 w-auto object-contain bg-white rounded-md p-1" />
          </Link>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Admin Panel</div>
        </div>
        
        <div className="flex-1 py-6">
          <nav className="space-y-1 px-4">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-5 w-5 text-slate-400" />
            Về trang chủ
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center px-8 shadow-sm z-10">
          <h2 className="text-lg font-bold text-slate-800">
            {SIDEBAR_ITEMS.find(item => pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href)))?.name || "Admin Panel"}
          </h2>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
