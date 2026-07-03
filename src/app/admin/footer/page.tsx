"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Layout, Save } from "lucide-react";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settings";

export default function AdminFooterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    companyName: "",
    taxCode: "",
    address: "",
    email: "",
    description: "",
  });

  const fetchSettings = useSettingsStore(state => state.fetchSettings);

  useEffect(() => {
    const loadData = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.footer) {
            setFormData({
              companyName: data.footer.companyName || "",
              taxCode: data.footer.taxCode || "",
              address: data.footer.address || "",
              email: data.footer.email || "",
              description: data.footer.description || "",
            });
          }
        }
      } catch (error) {
        console.error("Error loading footer settings:", error);
      } finally {
        setIsFetching(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const docRef = doc(db, 'settings', 'general');
      await setDoc(docRef, {
        footer: formData
      }, { merge: true });

      await fetchSettings();
      toast.success("Đã lưu cấu hình chân trang thành công!");
    } catch (error) {
      console.error("Error saving footer settings:", error);
      toast.error("Lưu cài đặt thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cấu hình Chân trang (Footer)</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2">
              <Layout className="h-5 w-5 text-blue-600" />
              Thông tin công ty
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Tên công ty / Doanh nghiệp</Label>
                <Input 
                  id="companyName"
                  className="h-11"
                  placeholder="VD: CÔNG TY CỔ PHẦN GIẢI PHÁP CHIẾU SÁNG BẢO NGỌC"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="taxCode">Mã số thuế</Label>
                  <Input 
                    id="taxCode"
                    className="h-11"
                    placeholder="VD: 0109102232"
                    value={formData.taxCode}
                    onChange={(e) => setFormData({...formData, taxCode: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email liên hệ</Label>
                  <Input 
                    id="email"
                    type="email"
                    className="h-11"
                    placeholder="VD: contact@baongocled.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ văn phòng / Cửa hàng</Label>
                <Input 
                  id="address"
                  className="h-11"
                  placeholder="VD: Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả ngắn (Hiển thị dưới logo)</Label>
                <Textarea 
                  id="description"
                  className="min-h-[100px]"
                  placeholder="Đại lý cấp 1 phân phối chính thức các sản phẩm thiết bị chiếu sáng..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" size="lg" className="h-12 px-8 text-base font-bold gap-2" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
              Lưu chân trang
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
