"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Save, 
  ArrowUp, 
  ArrowDown,
  LayoutTemplate
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, storage, uploadFileToFirebase } from "@/lib/firebase";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settings";
import { Loader2 } from "lucide-react";

interface HomepageRow {
  id: string;
  title: string;
  categorySlug: string;
}

export interface QuickLink {
  id: string;
  title: string;
  href: string;
  image: string;
  isNew?: boolean;
  isSale?: boolean;
}

export interface FlashsaleConfig {
  isActive: boolean;
  title: string;
  subtitle: string;
  productSkus: string; // Comma separated for simplicity in UI
  countdownHours: number;
}

export interface HighlightConfig {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export default function AdminHomepageConfig() {
  const [rows, setRows] = useState<HomepageRow[]>([]);
  const [heroBanners, setHeroBanners] = useState<string[]>([]);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [flashsale, setFlashsale] = useState<FlashsaleConfig>({
    isActive: true,
    title: "DEAL ĐỘC QUYỀN TỪ",
    subtitle: "Rạng Đông",
    productSkus: "",
    countdownHours: 24
  });
  const [newBannerUrl, setNewBannerUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [uploadingQuickLinks, setUploadingQuickLinks] = useState<Record<string, boolean>>({});
  const [highlights, setHighlights] = useState<HighlightConfig[]>([
    { id: "quality", title: "Chính hãng 100%", description: "Đầy đủ chứng nhận chất lượng", iconName: "ShieldCheck" },
    { id: "delivery", title: "Giao hàng tốc độ", description: "Miễn phí vận chuyển nội thành", iconName: "Truck" },
    { id: "support", title: "Hỗ trợ 24/7", description: "Tư vấn kỹ thuật chuyên sâu", iconName: "Headphones" },
  ]);

  const categories = useSettingsStore(state => state.settings.categories);

  // Flatten categories for dropdown
  const allCategories = categories.flatMap(main => [
    { name: main.name, slug: main.slug, isMain: true },
    ...main.subCategories.map(sub => ({ name: `— ${sub.name}`, slug: sub.slug, isMain: false }))
  ]);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const docRef = doc(db, "settings", "homepage_rows");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRows(data.rows || []);
        setHeroBanners(data.heroBanners || []);
        if (data.flashsale) {
          setFlashsale(data.flashsale);
        }
        if (data.highlights) {
          setHighlights(data.highlights);
        }
        
        // Add default quick links if empty
        if (data.quickLinks && data.quickLinks.length > 0) {
          setQuickLinks(data.quickLinks);
        } else {
          setQuickLinks([
            { id: "1", title: "Sản phẩm mới", href: "/tim-kiem?sort=newest", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/6e/b5/1d/18e38eaed7fb8c9f5926715b7468132e.png", isNew: true },
            { id: "2", title: "Đèn LED", href: "/danh-muc/san-pham-chieu-sang", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/4c/bb/56/674d812bd1bd5bdfb60fcd82fdf63d50.jpg" },
            { id: "3", title: "Nhà thông minh Rallismart", href: "/danh-muc/thiet-bi-thong-minh", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/e5/26/66/1d13db9b581d4a04fc9a918a599b4d00.png" },
            { id: "4", title: "Bình- Phích nước", href: "/danh-muc/phich-nuoc", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/f3/d3/42/411eb345d14df9042bbf062dc7ed8eb7.png" },
            { id: "5", title: "Siêu khuyến mãi", href: "/khuyen-mai", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/1c/a7/9c/04b50e50efb0e352efdfafba760317e0.png", isSale: true },
            { id: "6", title: "Đèn bàn", href: "/danh-muc/den-ban", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/a6/50/66/f28782a2b72cfdb8421b1a50c8e03e5c.png" }
          ]);
        }
      } else {
        // Default rows if nothing exists
        setRows([
          { id: "1", title: "Sản Phẩm Dự Án", categorySlug: "du-an" },
          { id: "2", title: "Giải Pháp Smart Home", categorySlug: "thiet-bi-thong-minh" },
          { id: "3", title: "Sản Phẩm Điện Xanh", categorySlug: "nang-luong-mat-troi" },
          { id: "4", title: "Sản Phẩm LED Dân Dụng", categorySlug: "san-pham-chieu-sang" },
          { id: "5", title: "Sản Phẩm Phích Nước", categorySlug: "phich-nuoc" }
        ]);
        setQuickLinks([
            { id: "1", title: "Sản phẩm mới", href: "/tim-kiem?sort=newest", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/6e/b5/1d/18e38eaed7fb8c9f5926715b7468132e.png", isNew: true },
            { id: "2", title: "Đèn LED", href: "/danh-muc/san-pham-chieu-sang", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/4c/bb/56/674d812bd1bd5bdfb60fcd82fdf63d50.jpg" },
            { id: "3", title: "Nhà thông minh Rallismart", href: "/danh-muc/thiet-bi-thong-minh", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/e5/26/66/1d13db9b581d4a04fc9a918a599b4d00.png" },
            { id: "4", title: "Bình- Phích nước", href: "/danh-muc/phich-nuoc", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/f3/d3/42/411eb345d14df9042bbf062dc7ed8eb7.png" },
            { id: "5", title: "Siêu khuyến mãi", href: "/khuyen-mai", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/1c/a7/9c/04b50e50efb0e352efdfafba760317e0.png", isSale: true },
            { id: "6", title: "Đèn bàn", href: "/danh-muc/den-ban", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/a6/50/66/f28782a2b72cfdb8421b1a50c8e03e5c.png" }
        ]);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
      toast.error("Không thể tải cấu hình.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, "settings", "homepage_rows");
      await setDoc(docRef, { 
        rows,
        heroBanners,
        quickLinks,
        flashsale,
        highlights
      });
      toast.success("Đã lưu cấu hình trang chủ thành công!");
    } catch (error) {
      console.error("Error saving config:", error);
      toast.error("Có lỗi xảy ra khi lưu.");
    } finally {
      setIsSaving(false);
    }
  };

  const addRow = () => {
    const newId = Date.now().toString();
    setRows([...rows, { id: newId, title: "Danh mục mới", categorySlug: "san-pham-chieu-sang" }]);
  };

  const removeRow = (id: string) => {
    setRows(rows.filter(r => r.id !== id));
  };

  const updateRow = (id: string, field: keyof HomepageRow, value: string) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const moveRow = (index: number, direction: 'up' | 'down') => {
    const newRows = [...rows];
    if (direction === 'up' && index > 0) {
      [newRows[index - 1], newRows[index]] = [newRows[index], newRows[index - 1]];
    } else if (direction === 'down' && index < newRows.length - 1) {
      [newRows[index + 1], newRows[index]] = [newRows[index], newRows[index + 1]];
    }
    setRows(newRows);
  };

  const addQuickLink = () => {
    const newId = Date.now().toString();
    setQuickLinks([...quickLinks, { id: newId, title: "Danh mục mới", href: "/danh-muc/moi", image: "", isNew: false, isSale: false }]);
  };

  const updateQuickLink = (id: string, field: keyof QuickLink, value: any) => {
    setQuickLinks(quickLinks.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const removeQuickLink = (id: string) => {
    setQuickLinks(quickLinks.filter(q => q.id !== id));
  };

  const addBanner = () => {
    if (!newBannerUrl.trim()) return;
    setHeroBanners([...heroBanners, newBannerUrl.trim()]);
    setNewBannerUrl("");
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    setIsUploadingBanner(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const downloadURL = await uploadFileToFirebase(`homepage/banner_${Date.now()}_${file.name}`, file);
        urls.push(downloadURL);
      }
      setHeroBanners(prev => [...prev, ...urls]);
      toast.success(`Đã tải lên ${urls.length} banner thành công!`);
    } catch (error: any) {
      console.error("Error uploading banners:", error);
      toast.error(error.message || "Lỗi khi tải banner lên!");
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleQuickLinkUpload = async (id: string, file: File) => {
    setUploadingQuickLinks(prev => ({ ...prev, [id]: true }));
    try {
      const downloadURL = await uploadFileToFirebase(`homepage/quicklink_${Date.now()}_${file.name}`, file);
      updateQuickLink(id, 'image', downloadURL);
      toast.success("Tải ảnh biểu tượng thành công!");
    } catch (error: any) {
      console.error("Error uploading quick link image:", error);
      toast.error(error.message || "Lỗi tải ảnh!");
    } finally {
      setUploadingQuickLinks(prev => ({ ...prev, [id]: false }));
    }
  };

  const removeBanner = (index: number) => {
    setHeroBanners(heroBanners.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return <div className="p-8">Đang tải cấu hình...</div>;
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Cấu hình Trang chủ</h1>
          <p className="text-slate-500">Quản lý dải hình ảnh (Hero Banners) và các danh mục sản phẩm hiển thị trên trang chủ.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-primary h-11 px-6 font-bold shadow-sm rounded-xl">
          <Save className="h-4 w-4" />
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>

      <div className="grid gap-8">
        {/* HERO BANNERS SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <LayoutTemplate className="h-5 w-5" />
              </div>
              <h2 className="font-bold text-slate-900 text-lg">Ảnh Bìa (Hero Banners)</h2>
            </div>
            <p className="text-sm text-slate-500 mt-2">Cấu hình danh sách hình ảnh chạy lướt qua ở phần đầu trang chủ.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex gap-3">
              <Input 
                placeholder="Nhập đường dẫn ảnh (VD: https://baongocled.vn/banner.jpg) HOẶC tải lên..."
                value={newBannerUrl}
                onChange={(e) => setNewBannerUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addBanner()}
                className="flex-1 border-slate-200"
              />
              <Button onClick={addBanner} className="gap-2 shrink-0" variant="secondary">
                <Plus className="h-4 w-4" /> Thêm link
              </Button>
              <div className="relative shrink-0 flex items-center">
                <input 
                  type="file" 
                  multiple
                  accept="image/*,application/pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleBannerUpload}
                  disabled={isUploadingBanner}
                />
                <Button type="button" className="gap-2 px-6" disabled={isUploadingBanner}>
                  {isUploadingBanner ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang tải...</> : "Tải ảnh từ máy"}
                </Button>
              </div>
            </div>

            {heroBanners.length === 0 ? (
              <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                Chưa có ảnh bìa nào. Vui lòng thêm ít nhất 1 ảnh để hiển thị.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {heroBanners.map((url, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[21/9]">
                    <img src={url} alt={`Banner ${index}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button onClick={() => removeBanner(index)} variant="destructive" size="sm" className="gap-2">
                        <Trash2 className="h-4 w-4" /> Xóa ảnh
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      {/* Highlights Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-2">
          <LayoutTemplate className="h-5 w-5 text-indigo-500" />
          Điểm nổi bật (Highlights)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((item, index) => (
            <div key={item.id} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Cột {index + 1}</span>
                <Input
                  value={item.title}
                  onChange={(e) => {
                    const newHighlights = [...highlights];
                    newHighlights[index].title = e.target.value;
                    setHighlights(newHighlights);
                  }}
                  placeholder="Tiêu đề chính"
                  className="font-bold"
                />
              </div>
              <div className="space-y-2">
                <Input
                  value={item.description}
                  onChange={(e) => {
                    const newHighlights = [...highlights];
                    newHighlights[index].description = e.target.value;
                    setHighlights(newHighlights);
                  }}
                  placeholder="Mô tả phụ"
                  className="text-sm text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Input
                  value={item.iconName}
                  onChange={(e) => {
                    const newHighlights = [...highlights];
                    newHighlights[index].iconName = e.target.value;
                    setHighlights(newHighlights);
                  }}
                  placeholder="Tên icon Lucide (VD: ShieldCheck, Truck)"
                  className="text-xs text-slate-400"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

        {/* ROWS SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <LayoutTemplate className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-slate-900">Danh sách các dải sản phẩm</h2>
          </div>
          <Button onClick={addRow} variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm dải mới
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm">
            <strong>Lưu ý:</strong> Khối "Sản phẩm bán chạy" được ghim cố định ở vị trí đầu tiên và không xuất hiện trong danh sách này. Các khối bên dưới sẽ xuất hiện theo thứ tự từ trên xuống dưới.
          </div>

          {rows.length === 0 ? (
            <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
              Chưa có dải sản phẩm nào. Hãy thêm một dải mới.
            </div>
          ) : (
            <div className="space-y-4">
              {rows.map((row, index) => (
                <div key={row.id} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-primary/30 transition-colors group">
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => moveRow(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => moveRow(index, 'down')}
                      disabled={index === rows.length - 1}
                      className="p-1 text-slate-400 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Tiêu đề hiển thị</label>
                      <Input 
                        value={row.title} 
                        onChange={(e) => updateRow(row.id, 'title', e.target.value)}
                        placeholder="Ví dụ: Sản phẩm bán chạy"
                        className="bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Liên kết Danh mục</label>
                      <select 
                        value={row.categorySlug}
                        onChange={(e) => updateRow(row.id, 'categorySlug', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="du-an">Dự án</option>
                        {allCategories.map(cat => (
                          <option key={cat.slug} value={cat.slug} className={cat.isMain ? "font-bold" : ""}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeRow(row.id)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* FLASHSALE SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-600">
                <LayoutTemplate className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-slate-900">Cấu hình Flashsale</h2>
            </div>
            <p className="text-sm text-slate-500 mt-2">Khu vực khuyến mãi đặc biệt với đồng hồ đếm ngược.</p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <div className="font-bold">Kích hoạt Flashsale</div>
                <div className="text-sm text-slate-500">Bật/tắt hiển thị khối Flashsale trên trang chủ</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={flashsale.isActive} 
                  onChange={(e) => setFlashsale({...flashsale, isActive: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {flashsale.isActive && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Tiêu đề chính</label>
                  <Input 
                    value={flashsale.title} 
                    onChange={(e) => setFlashsale({...flashsale, title: e.target.value})}
                    placeholder="VD: DEAL ĐỘC QUYỀN TỪ"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Tiêu đề phụ (Chữ màu trắng nền đỏ)</label>
                  <Input 
                    value={flashsale.subtitle} 
                    onChange={(e) => setFlashsale({...flashsale, subtitle: e.target.value})}
                    placeholder="VD: Rạng Đông"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Danh sách mã SKU sản phẩm (Cách nhau bởi dấu phẩy, tối đa 4 sản phẩm)</label>
                  <Input 
                    value={flashsale.productSkus} 
                    onChange={(e) => setFlashsale({...flashsale, productSkus: e.target.value})}
                    placeholder="VD: SP-001, SP-002, SP-003"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* QUICK LINKS SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <LayoutTemplate className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-slate-900">Danh sách các danh mục nhanh (Grid 6 khối)</h2>
            </div>
            <Button onClick={addQuickLink} variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm khối mới
            </Button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {quickLinks.map((link) => (
                <div key={link.id} className="relative bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 group">
                  <div className="flex justify-between items-center">
                    <Input 
                      value={link.title} 
                      onChange={(e) => updateQuickLink(link.id, 'title', e.target.value)}
                      placeholder="Tên danh mục"
                      className="font-bold border-none shadow-none px-0 focus-visible:ring-0 text-lg h-auto"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeQuickLink(link.id)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Đường dẫn (URL)</label>
                      <Input 
                        value={link.href} 
                        onChange={(e) => updateQuickLink(link.id, 'href', e.target.value)}
                        placeholder="/danh-muc/..."
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-slate-500 mb-1 block">Hình ảnh sản phẩm đại diện</label>
                      <div className="flex gap-2">
                        <Input 
                          value={link.image} 
                          onChange={(e) => updateQuickLink(link.id, 'image', e.target.value)}
                          placeholder="Nhập link HOẶC tải lên..."
                          className="h-9 text-sm flex-1"
                        />
                        <div className="relative shrink-0 flex items-center">
                          <input 
                            type="file" 
                            accept="image/*,application/pdf"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleQuickLinkUpload(link.id, e.target.files[0]);
                              }
                            }}
                            disabled={uploadingQuickLinks[link.id]}
                          />
                          <Button type="button" variant="outline" size="sm" className="h-9 px-3" disabled={uploadingQuickLinks[link.id]}>
                            {uploadingQuickLinks[link.id] ? <Loader2 className="h-3 w-3 animate-spin" /> : "Tải lên"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={link.isNew || false} 
                        onChange={(e) => updateQuickLink(link.id, 'isNew', e.target.checked)}
                        className="rounded border-slate-300 text-primary focus:ring-primary/20"
                      />
                      Hiển thị nhãn "NEW"
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={link.isSale || false} 
                        onChange={(e) => updateQuickLink(link.id, 'isSale', e.target.checked)}
                        className="rounded border-slate-300 text-orange-500 focus:ring-orange-500/20"
                      />
                      Hiển thị nhãn "Siêu Khuyến Mãi"
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
}
