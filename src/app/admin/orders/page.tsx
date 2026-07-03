"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, orderBy, query, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Package, CheckCircle, Clock, XCircle, Search, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus
      });
      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      setOrders(orders.filter(o => o.id !== orderId));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Xóa đơn hàng thất bại!");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200"><Clock className="w-3 h-3 mr-1"/> Chờ xử lý</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200"><Package className="w-3 h-3 mr-1"/> Đang giao hàng</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1"/> Đã hoàn thành</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200"><XCircle className="w-3 h-3 mr-1"/> Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.customerInfo?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerInfo?.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Đơn hàng</h1>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Tìm theo Mã đơn, Tên KH, SĐT..." 
            className="w-full h-10 pl-9 pr-4 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b">
              <tr>
                <th className="px-6 py-4">Mã đơn hàng</th>
                <th className="px-6 py-4">Ngày đặt</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && orders.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12"><Loader2 className="animate-spin h-6 w-6 mx-auto text-primary" /></td></tr>
              )}
              {!isLoading && filteredOrders.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Không tìm thấy đơn hàng nào.</td></tr>
              )}
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-mono text-xs uppercase text-slate-500">#{order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4">
                    {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{order.customerInfo?.name}</div>
                    <div className="text-xs text-slate-500">{order.customerInfo?.phone}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-primary">{formatCurrency(order.totalAmount || order.total || 0)}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setSelectedOrder(order)}>
                      <Eye className="h-4 w-4" /> Chi tiết
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteOrder(order.id)}>
                      <Trash2 className="h-4 w-4" /> Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              Chi tiết đơn hàng 
              <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">#{selectedOrder?.id}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Status Actions */}
              <div className="bg-slate-50 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700">Trạng thái hiện tại:</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.status === 'pending' && (
                    <Button onClick={() => updateOrderStatus(selectedOrder.id, 'processing')} className="bg-blue-600 hover:bg-blue-700 text-white">Xác nhận & Giao hàng</Button>
                  )}
                  {selectedOrder.status === 'processing' && (
                    <Button onClick={() => updateOrderStatus(selectedOrder.id, 'completed')} className="bg-green-600 hover:bg-green-700 text-white">Hoàn thành Đơn</Button>
                  )}
                  {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                    <Button variant="destructive" onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}>Hủy đơn</Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-bold text-lg mb-3 border-b pb-2">Thông tin khách hàng</h3>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-[100px_1fr]">
                      <span className="text-slate-500">Họ tên:</span>
                      <span className="font-medium">{selectedOrder.customerInfo?.name}</span>
                    </div>
                    <div className="grid grid-cols-[100px_1fr]">
                      <span className="text-slate-500">SĐT:</span>
                      <span className="font-medium">{selectedOrder.customerInfo?.phone}</span>
                    </div>
                    <div className="grid grid-cols-[100px_1fr]">
                      <span className="text-slate-500">Địa chỉ:</span>
                      <span className="font-medium">{selectedOrder.customerInfo?.address}</span>
                    </div>
                    {selectedOrder.customerInfo?.note && (
                      <div className="grid grid-cols-[100px_1fr]">
                        <span className="text-slate-500">Ghi chú:</span>
                        <span className="font-medium text-amber-600 bg-amber-50 p-2 rounded">{selectedOrder.customerInfo?.note}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="font-bold text-lg mb-3 border-b pb-2">Thanh toán</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tạm tính:</span>
                      <span className="font-medium">{formatCurrency(selectedOrder.totalAmount || selectedOrder.total || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phí vận chuyển:</span>
                      <span className="font-medium text-green-600">Miễn phí</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="font-bold text-base">Tổng cộng:</span>
                      <span className="font-black text-primary text-lg">{formatCurrency(selectedOrder.totalAmount || selectedOrder.total || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="font-bold text-lg mb-3 border-b pb-2">Danh sách sản phẩm</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
                      <div>
                        <div className="font-medium text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-1">SKU: {item.sku}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{formatCurrency(item.price)}</div>
                        <div className="text-xs text-slate-500 mt-1">x {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
