"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Trash2, Save, ArrowUp, ArrowDown, Menu, Link as LinkIcon, 
  Home, Lightbulb, Zap, Info, PhoneCall, Package, Grid, FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  isMegaMenu: boolean;
  iconType: string;
}

const AVAILABLE_ICONS = [
  { value: "home", label: "Trang chủ", icon: Home },
  { value: "lightbulb", label: "Bóng đèn (LED)", icon: Lightbulb },
  { value: "zap", label: "Sét (Thiết bị điện)", icon: Zap },
  { value: "info", label: "Thông tin (Về chúng tôi)", icon: Info },
  { value: "phone", label: "Điện thoại (Liên hệ)", icon: PhoneCall },
  { value: "package", label: "Hộp (Sản phẩm)", icon: Package },
  { value: "grid", label: "Lưới (Danh mục)", icon: Grid },
  { value: "file", label: "Tài liệu (Trang nội dung)", icon: FileText },
];

export default function AdminMenuConfig() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const docRef = doc(db, "settings", "menu_links");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().items) {
        setItems(docSnap.data().items);
      } else {
        // Default menu if nothing exists
        setItems([
          { id: "1", label: "Trang chủ", href: "/", isMegaMenu: false, iconType: "home" },
          { id: "2", label: "Danh mục sản phẩm", href: "#", isMegaMenu: true, iconType: "grid" },
          { id: "3", label: "Về chúng tôi", href: "/ve-chung-toi", isMegaMenu: false, iconType: "info" },
          { id: "4", label: "Liên hệ", href: "/lien-he", isMegaMenu: false, iconType: "phone" }
        ]);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
      toast.error("Không thể tải cấu hình Menu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "settings", "menu_links"), { items });
      toast.success("Đã lưu cấu hình Menu thành công!");
    } catch (error) {
      console.error("Error saving config:", error);
      toast.error("Có lỗi xảy ra khi lưu.");
    } finally {
      setIsSaving(false);
    }
  };

  const addItem = () => {
    const newId = Date.now().toString();
    setItems([...items, { id: newId, label: "Menu mới", href: "/", isMegaMenu: false, iconType: "file" }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(r => r.id !== id));
  };

  const updateItem = (id: string, field: keyof MenuItem, value: any) => {
    setItems(items.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    if (direction === 'up' && index > 0) {
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
    }
    setItems(newItems);
  };

  const renderIcon = (iconValue: string) => {
    const IconDef = AVAILABLE_ICONS.find(i => i.value === iconValue)?.icon || LinkIcon;
    return <IconDef className="h-5 w-5 text-primary" />;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="font-medium animate-pulse">Đang tải cấu hình Menu...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Quản lý Menu (Header)</h1>
          <p className="text-slate-500">Thiết lập các đường dẫn hiển thị trên thanh điều hướng của website.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-primary h-11 px-6 font-bold shadow-sm rounded-xl">
          <Save className="h-4 w-4" />
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Menu className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-lg">Cấu trúc Menu</h2>
          </div>
          <Button onClick={addItem} variant="outline" size="sm" className="gap-2 rounded-xl bg-white">
            <Plus className="h-4 w-4" />
            Thêm Menu mới
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm">
            <strong>Siêu Menu (Mega Menu):</strong> Khi bạn bật tính năng này cho một mục, mục đó sẽ tự động xổ ra toàn bộ "Danh mục sản phẩm" có trên hệ thống thay vì là một link bấm thông thường.
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
              Chưa có Menu nào. Hãy thêm một Menu mới.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className={`flex items-start md:items-center gap-4 p-5 bg-white border rounded-xl transition-colors group ${item.isMegaMenu ? 'border-primary/40 bg-primary/5' : 'border-slate-200 hover:border-primary/30'}`}>
                  
                  {/* Arrows */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button 
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent transition-colors"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === items.length - 1}
                      className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent transition-colors"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Icon Preview */}
                  <div className="hidden md:flex shrink-0 w-12 h-12 bg-white border border-slate-100 rounded-xl items-center justify-center shadow-sm">
                    {renderIcon(item.iconType)}
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Tên hiển thị */}
                    <div className="md:col-span-4">
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Tên hiển thị</label>
                      <Input 
                        value={item.label} 
                        onChange={(e) => updateItem(item.id, 'label', e.target.value)}
                        placeholder="VD: Liên hệ"
                        className="bg-white focus:bg-white rounded-lg border-slate-200"
                      />
                    </div>

                    {/* Đường dẫn */}
                    <div className="md:col-span-4">
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Đường dẫn (Link)</label>
                      <Input 
                        value={item.href} 
                        onChange={(e) => updateItem(item.id, 'href', e.target.value)}
                        placeholder="VD: /lien-he"
                        disabled={item.isMegaMenu}
                        className={`rounded-lg border-slate-200 ${item.isMegaMenu ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white focus:bg-white'}`}
                      />
                    </div>
                    
                    {/* Icon Mobile */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Icon (Mobile)</label>
                      <select 
                        value={item.iconType}
                        onChange={(e) => updateItem(item.id, 'iconType', e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {AVAILABLE_ICONS.map(i => (
                          <option key={i.value} value={i.value}>{i.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Mega Menu Toggle */}
                    <div className="md:col-span-2 flex flex-col justify-center">
                      <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wide">Siêu Menu</label>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={item.isMegaMenu} 
                          onCheckedChange={(checked) => updateItem(item.id, 'isMegaMenu', checked)}
                        />
                        <span className="text-xs font-medium text-slate-600">Bật</span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="shrink-0 pt-6">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
