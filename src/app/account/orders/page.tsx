"use client";

import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Package, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: any[];
}

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        // Query orders by email or userId
        const q = query(
          collection(db, "orders"),
          where("customerInfo.email", "==", user.email)
          // Note: ideally we also sort by createdAt descending, but it requires a composite index
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders: Order[] = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
        });
        
        // Sort client-side to avoid index requirements
        fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Chờ xác nhận</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Đang xử lý</Badge>;
      case "shipping":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Đang giao hàng</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Hoàn thành</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-8 h-64 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Đơn hàng của tôi</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <Package className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Bạn chưa đặt mua sản phẩm nào. Hãy khám phá các sản phẩm chiếu sáng của chúng tôi nhé!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-slate-50/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Mã đơn hàng: <span className="font-semibold text-slate-900 uppercase">#{order.id.slice(-6)}</span></p>
                  <p className="text-xs text-slate-400">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div className="text-right flex flex-col sm:items-end gap-2">
                  {getStatusBadge(order.status || 'pending')}
                  <p className="font-bold text-primary">{formatCurrency(order.total)}</p>
                </div>
              </div>
              <div className="px-6 py-4 divide-y divide-slate-50">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="py-3 flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{item.name}</p>
                      <p className="text-sm text-slate-500">Phân loại: {item.variant || 'Mặc định'}</p>
                      <p className="text-sm text-slate-500">x{item.quantity}</p>
                    </div>
                    <div className="font-semibold text-slate-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
