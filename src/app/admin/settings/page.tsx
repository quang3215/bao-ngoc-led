"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Phone, MessageCircle, Save, ImageIcon, Link as LinkIcon, Map, LayoutList, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSettingsStore, FooterLinkGroup } from "@/store/settings";
import { uploadFileToFirebase } from "@/lib/firebase";

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    hotline: "",
    zalo: "",
    logoUrl: "",
    mapUrl: "",
    facebook: "",
    youtube: "",
    zaloOA: "",
    tiktok: "",
    linkGroups: [] as FooterLinkGroup[],
  });
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const fetchSettings = useSettingsStore(state => state.fetchSettings);

  useEffect(() => {
    const loadData = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            hotline: data.hotline || "",
            zalo: data.zalo || "",
            logoUrl: data.logoUrl || "",
            mapUrl: data.mapUrl || "",
            facebook: data.socialLinks?.facebook || "",
            youtube: data.socialLinks?.youtube || "",
            zaloOA: data.socialLinks?.zaloOA || "",
            tiktok: data.socialLinks?.tiktok || "",
            linkGroups: data.footer?.linkGroups || [
              { id: "group-1", title: "Danh mục nổi bật", links: [{ label: "Đèn LED Âm trần", href: "/danh-muc/den-led-am-tran" }] },
              { id: "group-2", title: "Hỗ trợ khách hàng", links: [{ label: "Chính sách bảo hành", href: "/trang/chinh-sach-bao-hanh" }] }
            ],
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
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
      // Use setDoc with merge: true to avoid overwriting other future settings
      await setDoc(docRef, {
        hotline: formData.hotline,
        zalo: formData.zalo,
        logoUrl: formData.logoUrl,
        socialLinks: {
          facebook: formData.facebook,
          youtube: formData.youtube,
          zaloOA: formData.zaloOA,
          tiktok: formData.tiktok,
        },
        footer: {
          linkGroups: formData.linkGroups,
        }
      }, { merge: true });

      // Update the global store immediately
      await fetchSettings();

      toast.success("Đã lưu cài đặt thành công!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Lưu cài đặt thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setIsUploadingLogo(true);
    try {
      const downloadURL = await uploadFileToFirebase(`settings/logo_${Date.now()}_${file.name}`, file);
      setFormData({ ...formData, logoUrl: downloadURL });
      toast.success("Tải logo lên thành công!");
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast.error(error.message || "Lỗi khi tải logo lên!");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // --- Footer Links Handlers ---
  const addLinkGroup = () => {
    setFormData(prev => ({
      ...prev,
      linkGroups: [...prev.linkGroups, { id: `group-${Date.now()}`, title: "Cột mới", links: [] }]
    }));
  };

  const removeLinkGroup = (groupId: string) => {
    setFormData(prev => ({
      ...prev,
      linkGroups: prev.linkGroups.filter(g => g.id !== groupId)
    }));
  };

  const updateLinkGroupTitle = (groupId: string, title: string) => {
    setFormData(prev => ({
      ...prev,
      linkGroups: prev.linkGroups.map(g => g.id === groupId ? { ...g, title } : g)
    }));
  };

  const addLink = (groupId: string) => {
    setFormData(prev => ({
      ...prev,
      linkGroups: prev.linkGroups.map(g => 
        g.id === groupId ? { ...g, links: [...g.links, { label: "Link mới", href: "/" }] } : g
      )
    }));
  };

  const removeLink = (groupId: string, linkIndex: number) => {
    setFormData(prev => ({
      ...prev,
      linkGroups: prev.linkGroups.map(g => 
        g.id === groupId ? { ...g, links: g.links.filter((_, i) => i !== linkIndex) } : g
      )
    }));
  };

  const updateLink = (groupId: string, linkIndex: number, field: 'label' | 'href', value: string) => {
    setFormData(prev => ({
      ...prev,
      linkGroups: prev.linkGroups.map(g => 
        g.id === groupId ? { 
          ...g, 
          links: g.links.map((l, i) => i === linkIndex ? { ...l, [field]: value } : l) 
        } : g
      )
    }));
  };

  if (isFetching) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cài đặt hệ thống</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2">
              <ImageIcon className="h-5 w-5 text-purple-600" />
              Logo & Nhận diện
            </h2>
            <div className="space-y-4">
              <Label>Logo Website</Label>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-48 h-16 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-sm text-slate-400">Chưa có Logo</span>
                  )}
                </div>
                <div className="flex-1 space-y-3 w-full">
                  <Input 
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                    placeholder="Dán link Logo hoặc Tải lên..."
                    className="h-10"
                  />
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*,application/pdf"
                      onChange={handleLogoUpload}
                      disabled={isUploadingLogo}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Button type="button" variant="outline" className="w-full sm:w-auto" disabled={isUploadingLogo}>
                      {isUploadingLogo ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải...</> : "Tải Logo từ máy"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2">
              <LinkIcon className="h-5 w-5 text-pink-500" />
              Mạng xã hội
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook Link</Label>
                <Input 
                  id="facebook"
                  placeholder="https://facebook.com/..."
                  value={formData.facebook}
                  onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube Link</Label>
                <Input 
                  id="youtube"
                  placeholder="https://youtube.com/..."
                  value={formData.youtube}
                  onChange={(e) => setFormData({...formData, youtube: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zaloOA">Zalo OA Link</Label>
                <Input 
                  id="zaloOA"
                  placeholder="https://zalo.me/..."
                  value={formData.zaloOA}
                  onChange={(e) => setFormData({...formData, zaloOA: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktok">TikTok Link</Label>
                <Input 
                  id="tiktok"
                  placeholder="https://tiktok.com/@..."
                  value={formData.tiktok}
                  onChange={(e) => setFormData({...formData, tiktok: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2">
              <Map className="h-5 w-5 text-green-600" />
              Bản đồ (Google Map iframe)
            </h2>
            <div className="space-y-2">
              <Label htmlFor="mapUrl">Link nhúng bản đồ (src="")</Label>
              <Input 
                id="mapUrl"
                placeholder="https://www.google.com/maps/embed?pb=..."
                value={formData.mapUrl}
                onChange={(e) => setFormData({...formData, mapUrl: e.target.value})}
              />
              <p className="text-xs text-muted-foreground mt-1">Lên Google Maps, chọn "Chia sẻ" -{">"} "Nhúng bản đồ" và copy phần link trong thuộc tính <code>src="..."</code></p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2">
              <Phone className="h-5 w-5 text-blue-600" />
              Thông tin liên hệ
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hotline">Số điện thoại Hotline</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="hotline"
                    className="pl-10 h-11"
                    placeholder="VD: 1900 2098 hoặc 090 123 4567"
                    value={formData.hotline}
                    onChange={(e) => setFormData({...formData, hotline: e.target.value})}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Số này sẽ hiển thị ở trang Chi tiết sản phẩm, chân trang và liên hệ.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zalo">Số Zalo / Hotline cá nhân</Label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="zalo"
                    className="pl-10 h-11"
                    placeholder="VD: 0901234567 (Viết liền)"
                    value={formData.zalo}
                    onChange={(e) => setFormData({...formData, zalo: e.target.value})}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Số này sẽ được dùng cho nút Chat Zalo trôi nổi ở góc màn hình. Lưu ý: Viết liền không khoảng trắng (vd: 0901234567).</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <LayoutList className="h-5 w-5 text-indigo-600" />
                Liên kết Chân trang (Footer Links)
              </h2>
              <Button type="button" onClick={addLinkGroup} variant="outline" size="sm" className="gap-1">
                <Plus className="h-4 w-4" /> Thêm cột
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.linkGroups.map((group) => (
                <div key={group.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <Input 
                      value={group.title} 
                      onChange={(e) => updateLinkGroupTitle(group.id, e.target.value)}
                      className="font-bold border-none bg-transparent shadow-none px-0 focus-visible:ring-0 text-base"
                    />
                    <Button type="button" onClick={() => removeLinkGroup(group.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-100">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {group.links.map((link, index) => (
                      <div key={index} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-slate-100">
                        <div className="flex-1 space-y-2">
                          <Input 
                            value={link.label} 
                            onChange={(e) => updateLink(group.id, index, 'label', e.target.value)}
                            placeholder="Tên hiển thị (VD: Về chúng tôi)"
                            className="h-8 text-sm"
                          />
                          <Input 
                            value={link.href} 
                            onChange={(e) => updateLink(group.id, index, 'href', e.target.value)}
                            placeholder="Đường dẫn (VD: /ve-chung-toi)"
                            className="h-8 text-sm text-slate-500"
                          />
                        </div>
                        <Button type="button" onClick={() => removeLink(group.id, index)} variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button type="button" onClick={() => addLink(group.id)} variant="ghost" size="sm" className="w-full mt-3 text-primary hover:text-primary hover:bg-primary/10 border border-dashed border-primary/30">
                    <Plus className="h-4 w-4 mr-1" /> Thêm Link mới
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" size="lg" className="h-12 px-8 text-base font-bold gap-2" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
              Lưu cấu hình
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
