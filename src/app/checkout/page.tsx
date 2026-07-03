"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  // Autofill form if logged in
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData(prev => ({
              ...prev,
              name: data.name || prev.name,
              phone: data.phone || prev.phone,
              address: data.address || prev.address
            }));
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="container max-w-3xl mx-auto py-20 text-center px-4">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng trống</h1>
        <p className="text-muted-foreground mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        <Button onClick={() => router.push("/")}>Tiếp tục mua sắm</Button>
      </div>
    );
  }

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const orderData = {
        items: items.map(item => ({
          sku: item.sku,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          variant: item.variant || ""
        })),
        total: totalPrice,
        status: "pending",
        customerInfo: {
          ...formData,
          email: user?.email || formData.email || "",
          userId: user?.uid || null
        },
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      clearCart();
      router.push(`/checkout/success?id=${docRef.id}`);
    } catch (error) {
      console.error("Error creating order: ", error);
      toast.error("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12 border-t">
      <div className="container px-4 md:px-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Thanh toán</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-5 lg:col-start-8 lg:order-last">
            <div className="bg-white p-6 rounded-2xl border shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">Đơn hàng của bạn</h2>
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-auto pr-2">
                {items.map((item) => (
                  <div key={item.sku} className="flex gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-slate-100 flex-shrink-0 border">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 text-sm">
                      <h4 className="font-medium line-clamp-2">{item.name}</h4>
                      <p className="text-muted-foreground mt-1">{formatCurrency(item.price)}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          type="button"
                          onClick={() => {
                            const { updateQuantity } = useCartStore.getState();
                            updateQuantity(item.sku, item.quantity - 1);
                          }}
                          className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200"
                        >
                          -
                        </button>
                        <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => {
                            const { updateQuantity } = useCartStore.getState();
                            updateQuantity(item.sku, item.quantity + 1);
                          }}
                          className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200"
                        >
                          +
                        </button>
                      </div>

                    </div>
                    <div className="text-sm font-semibold flex flex-col items-end gap-2">
                      {formatCurrency(item.price * item.quantity)}
                      <button 
                        type="button"
                        onClick={() => {
                          const { removeItem } = useCartStore.getState();
                          removeItem(item.sku);
                        }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-medium">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className="font-medium">Miễn phí</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Tổng cộng</span>
                <span className="text-2xl font-black text-primary">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm">
              <h2 className="text-xl font-bold mb-6">Thông tin giao hàng</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên *</Label>
                    <Input 
                      id="name" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input 
                      id="phone" 
                      required 
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ nhận hàng chi tiết *</Label>
                  <Input 
                    id="address" 
                    required 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/TP"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú đơn hàng (Tùy chọn)</Label>
                  <Input 
                    id="note" 
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    placeholder="Ví dụ: Giao hàng giờ hành chính"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full text-lg font-bold h-14" disabled={isSubmitting}>
                  {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
