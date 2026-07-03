"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Package, AlertCircle, TrendingUp, Clock, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    revenue: 0,
    newOrdersCount: 0,
    totalProducts: 0,
    lowStockCount: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        // Fetch Orders for Revenue, Count, and Recent list
        const ordersSnapshot = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
        const allOrders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        
        let totalRevenue = 0;
        let newOrders = 0;
        
        allOrders.forEach(order => {
          // Count revenue for completed/delivered orders. Assuming "delivered" is the status for done.
          if (order.status === "delivered" || order.status === "completed") {
            totalRevenue += (order.totalAmount || order.total || 0);
          }
          if (order.status === "pending") {
            newOrders += 1;
          }
        });

        // Fetch Products
        const productsSnapshot = await getDocs(collection(db, "products"));
        const totalProducts = productsSnapshot.size;
        let lowStockCount = 0;
        productsSnapshot.forEach(doc => {
          const product = doc.data();
          if (product.stock !== undefined && product.stock <= 5) {
            lowStockCount += 1;
          }
        });

        setStats({
          revenue: totalRevenue,
          newOrdersCount: newOrders,
          totalProducts: totalProducts,
          lowStockCount: lowStockCount,
        });

        setRecentOrders(allOrders.slice(0, 5));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge className="bg-amber-500 hover:bg-amber-600">Chờ xử lý</Badge>;
      case "processing": return <Badge className="bg-blue-500 hover:bg-blue-600">Đang xử lý</Badge>;
      case "shipping": return <Badge className="bg-indigo-500 hover:bg-indigo-600">Đang giao</Badge>;
      case "delivered": return <Badge className="bg-green-500 hover:bg-green-600">Đã giao</Badge>;
      case "cancelled": return <Badge variant="destructive">Đã hủy</Badge>;
      default: return <Badge variant="outline">Không rõ</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="font-medium animate-pulse">Đang tải dữ liệu hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tổng Quan Hệ Thống</h1>
          <p className="text-slate-500 mt-1">Dữ liệu được cập nhật theo thời gian thực.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Tổng doanh thu</CardTitle>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{formatCurrency(stats.revenue)}</div>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1 font-medium">
              <TrendingUp className="h-3 w-3" />
              Đã bao gồm đơn hoàn thành
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Đơn chờ xử lý</CardTitle>
            <div className="p-2 bg-amber-50 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{stats.newOrdersCount}</div>
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1 font-medium">
              <Clock className="h-3 w-3" />
              Cần xử lý ngay
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Tổng Sản phẩm</CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{stats.totalProducts}</div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-medium">
              Đang hoạt động trên hệ thống
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Cảnh báo Tồn kho</CardTitle>
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-red-600">{stats.lowStockCount}</div>
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
              <AlertCircle className="h-3 w-3" />
              Sản phẩm có tồn kho {'<='} 5
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="flex justify-between items-center text-lg font-bold">
              Đơn hàng gần đây
              <Link href="/admin/orders" className="text-sm text-primary hover:underline font-medium">
                Xem tất cả
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.length === 0 ? (
              <div className="p-10 text-center text-slate-500 flex flex-col items-center">
                <FileText className="h-10 w-10 text-slate-300 mb-3" />
                <p>Chưa có đơn hàng nào.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-bold text-slate-900">{order.customerInfo?.name || "Khách hàng"}</p>
                      <p className="text-xs text-slate-500">Mã ĐH: {order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary mb-1">{formatCurrency(order.totalAmount || order.total || 0)}</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-bold">Phân tích Sản Phẩm (Coming Soon)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground py-20 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-slate-400" />
              </div>
              <p className="font-medium text-slate-600">Biểu đồ phân tích doanh số sẽ sớm ra mắt.</p>
              <p className="text-xs text-slate-400 mt-1">Đang thu thập đủ dữ liệu hệ thống.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
