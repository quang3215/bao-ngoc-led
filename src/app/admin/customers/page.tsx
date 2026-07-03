"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatCurrency } from "@/lib/utils";
import { Users, Phone, MapPin, Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface Customer {
  id: string; // Phone number will be used as unique ID
  name: string;
  phone: string;
  address: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: any;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchCustomers() {
      setIsLoading(true);
      try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        
        const customerMap = new Map<string, Customer>();

        snapshot.docs.forEach((doc) => {
          const order = doc.data();
          const phone = order.customerPhone;
          
          if (!phone) return; // Skip if no phone

          if (customerMap.has(phone)) {
            const existing = customerMap.get(phone)!;
            // Only add to total if order is delivered or completed
            const orderTotal = (order.status === "delivered" || order.status === "completed") ? order.total : 0;
            
            customerMap.set(phone, {
              ...existing,
              totalSpent: existing.totalSpent + orderTotal,
              orderCount: existing.orderCount + 1,
              // Keep the latest address
              address: order.customerAddress || existing.address,
              // Since orders are sorted desc, the first one encountered is the latest
              lastOrderDate: existing.lastOrderDate || order.createdAt
            });
          } else {
            const orderTotal = (order.status === "delivered" || order.status === "completed") ? order.total : 0;
            customerMap.set(phone, {
              id: phone,
              name: order.customerName || "Khách hàng ẩn danh",
              phone: phone,
              address: order.customerAddress || "Chưa cập nhật",
              totalSpent: orderTotal,
              orderCount: 1,
              lastOrderDate: order.createdAt
            });
          }
        });

        // Convert Map to array and sort by total spent
        const customerList = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
        setCustomers(customerList);
        
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Tệp Khách Hàng
          </h1>
          <p className="text-slate-500 mt-1">
            Tổng hợp tự động từ danh sách đơn hàng đã đặt trên hệ thống.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Tìm theo Tên hoặc Số điện thoại..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <div className="text-sm font-semibold text-slate-500 bg-white px-4 py-2 border border-slate-200 rounded-lg">
            Tổng cộng: <span className="text-primary">{customers.length} khách</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Liên hệ</th>
                <th className="px-6 py-4">Địa chỉ</th>
                <th className="px-6 py-4 text-center">Đơn hàng</th>
                <th className="px-6 py-4 text-right">Tổng chi tiêu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <p>Đang tổng hợp dữ liệu khách hàng...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-500">
                    Không tìm thấy khách hàng nào.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-base">{customer.name}</div>
                      {customer.lastOrderDate && (
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Giao dịch: {format(customer.lastOrderDate.toDate(), "dd/MM/yyyy", { locale: vi })}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-medium">
                        <Phone className="h-4 w-4 text-slate-400" />
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate" title={customer.address}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate">{customer.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold">
                        {customer.orderCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-black text-green-600 text-base">
                        {formatCurrency(customer.totalSpent)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
