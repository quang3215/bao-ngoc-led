"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, DownloadCloud, AlertTriangle } from "lucide-react";
import { useSettingsStore } from "@/store/settings";

export default function ScraperPage() {
  const [url, setUrl] = useState("");
  const [targetCategory, setTargetCategory] = useState("");
  const [targetSubCategory, setTargetSubCategory] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [result, setResult] = useState<{success?: number, error?: string} | null>(null);
  
  const categories = useSettingsStore(state => state.settings.categories);

  const handleScrape = async () => {
    if (!url || !targetCategory) {
      toast.error("Vui lòng nhập Link Rạng Đông và chọn danh mục Bảo Ngọc LED đích!");
      return;
    }

    if (url.includes("rangdongstore.vn")) {
      toast.error("Trang rangdongstore.vn có tường lửa chống cào dữ liệu. Vui lòng lấy link từ trang chủ chính thức: rangdong.com.vn (Ví dụ: rangdong.com.vn/category/den-led-am-tran)");
      return;
    }

    if (!url.includes("rangdong.com.vn")) {
      toast.error("Vui lòng nhập link hợp lệ từ trang chủ Rạng Đông (rangdong.com.vn)!");
      return;
    }

    setIsScraping(true);
    setResult(null);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          categorySlug: targetCategory,
          subCategorySlug: targetSubCategory
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Có lỗi xảy ra khi cào dữ liệu");
      }

      setResult({ success: data.scrapedCount });
      toast.success(`Đã cào thành công ${data.scrapedCount} sản phẩm!`);
    } catch (error: any) {
      console.error(error);
      setResult({ error: error.message });
      toast.error(error.message);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <DownloadCloud className="h-8 w-8 text-[#4A238B]" />
          Công cụ Cào Dữ Liệu (Auto Scraper)
        </h1>
        <p className="text-slate-500 mt-2">Dán đường dẫn danh mục từ trang Rạng Đông (ví dụ: <code className="bg-slate-100 text-xs px-1">rangdong.com.vn/category/den-led-am-tran</code>) để tự động copy toàn bộ sản phẩm về web Bảo Ngọc LED.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
        <div className="space-y-2">
          <Label className="font-bold text-slate-700">Link Danh Mục Rạng Đông *</Label>
          <Input 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://rangdong.com.vn/category/den-led-am-tran"
            className="w-full font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-bold text-slate-700">Lưu vào Danh mục chính (Bảo Ngọc) *</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
              value={targetCategory} 
              onChange={(e) => {
                setTargetCategory(e.target.value);
                setTargetSubCategory(""); // Reset sub when main changes
              }}
            >
              <option value="" disabled>-- Chọn danh mục đích --</option>
              {categories?.map(cat => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-slate-700">Lưu vào Danh mục con (Tuỳ chọn)</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
              value={targetSubCategory} 
              onChange={(e) => setTargetSubCategory(e.target.value)}
              disabled={!targetCategory}
            >
              <option value="">-- Để trống (Hoặc chọn) --</option>
              {(categories?.find(c => c.slug === targetCategory)?.subCategories || []).map(sub => (
                <option key={sub.slug} value={sub.slug}>{sub.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong>Lưu ý:</strong> Quá trình cào dữ liệu có thể mất từ vài chục giây đến vài phút tùy số lượng sản phẩm. Vui lòng không tắt trình duyệt trong quá trình hệ thống đang quay tải.
          </div>
        </div>

        <Button 
          onClick={handleScrape} 
          disabled={isScraping || !url || !targetCategory}
          className="w-full bg-[#4A238B] hover:bg-[#381a69] text-white py-6 text-lg font-bold"
        >
          {isScraping ? (
            <>
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Đang cào dữ liệu... Vui lòng chờ!
            </>
          ) : (
            <>
              <DownloadCloud className="mr-2 h-6 w-6" />
              BẮT ĐẦU CÀO SẢN PHẨM
            </>
          )}
        </Button>

        {result && result.success !== undefined && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center font-bold">
            🎉 Xong! Đã cào thành công {result.success} sản phẩm mới. Bạn có thể qua phần Sản phẩm để kiểm tra!
          </div>
        )}

        {result && result.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg font-medium">
            ❌ Lỗi: {result.error}
          </div>
        )}
      </div>
    </div>
  );
}
