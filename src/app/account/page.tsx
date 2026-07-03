"use client";

import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || "",
            phone: data.phone || "",
            address: data.address || ""
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setIsSaving(false);
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
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Hồ sơ của tôi</h1>
      <p className="text-slate-500 mb-8 pb-6 border-b border-slate-100">
        Quản lý thông tin hồ sơ để bảo mật tài khoản và mua sắm dễ dàng hơn.
      </p>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <Label className="text-slate-600 font-medium md:text-right">Email đăng nhập</Label>
          <div className="md:col-span-2 text-slate-900 font-medium bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
            {user?.email}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <Label htmlFor="name" className="text-slate-600 font-medium md:text-right">Họ và tên</Label>
          <div className="md:col-span-2">
            <Input 
              id="name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="h-12 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <Label htmlFor="phone" className="text-slate-600 font-medium md:text-right">Số điện thoại</Label>
          <div className="md:col-span-2">
            <Input 
              id="phone" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="h-12 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <Label htmlFor="address" className="text-slate-600 font-medium md:text-right pt-3">Địa chỉ nhận hàng</Label>
          <div className="md:col-span-2">
            <textarea 
              id="address" 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full min-h-[100px] p-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y"
              placeholder="Nhập địa chỉ nhận hàng mặc định của bạn..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="hidden md:block"></div>
          <div className="md:col-span-2">
            <Button 
              type="submit" 
              className="h-12 px-8 rounded-xl shadow-[0_8px_20px_rgba(var(--primary),0.2)] hover:-translate-y-1 transition-all duration-300"
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
