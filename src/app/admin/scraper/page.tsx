"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { DownloadCloud, ArrowRight, MousePointerClick, Zap } from "lucide-react";
import { useSettingsStore } from "@/store/settings";

export default function ScraperPage() {
  const [targetCategory, setTargetCategory] = useState("");
  const [targetSubCategory, setTargetSubCategory] = useState("");
  const [bookmarkletCode, setBookmarkletCode] = useState("");
  const [origin, setOrigin] = useState("");
  
  const categories = useSettingsStore(state => state.settings.categories);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    // Generate the JS code for the bookmarklet
    const jsCode = `javascript:(function(){
      if(window.location.hostname !== 'rangdongstore.vn' && window.location.hostname !== 'rangdong.com.vn') {
        alert("Công cụ này chỉ dùng được trên trang rangdongstore.vn hoặc rangdong.com.vn!");
        return;
      }
      
      let name = document.querySelector('h1') ? document.querySelector('h1').innerText.trim() : document.title;
      if (!name || name === '') {
         const nameEl = document.querySelector('.product-title') || document.querySelector('.name');
         if(nameEl) name = nameEl.innerText.trim();
      }

      let price = 0;
      const priceEl = document.querySelector('.current-price') || document.querySelector('.price') || document.querySelector('[itemprop="price"]');
      if(priceEl) price = parseInt(priceEl.innerText.replace(/[^0-9]/g, '')) || 0;
      
      let image = document.querySelector('meta[property="og:image"]')?.content;
      if(!image) {
        const imgEl = document.querySelector('.slider-for img') || document.querySelector('.img-product img');
        if(imgEl) image = imgEl.src;
      }
      
      const specs = {};
      document.querySelectorAll('tr').forEach(tr => {
        const tds = tr.querySelectorAll('td');
        if(tds.length >= 2) {
          specs[tds[0].innerText.trim()] = tds[1].innerText.trim();
        }
      });

      alert("Đang cào dữ liệu: " + name + "... Vui lòng chờ!");

      fetch('${origin}/api/scrape/bookmarklet', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: window.location.href,
          name: name,
          price: price,
          images: image ? [image] : [],
          specs: specs,
          categorySlug: '${targetCategory}',
          subCategorySlug: '${targetSubCategory}'
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.error) alert("Bảo Ngọc Scraper Lỗi: " + data.error);
        else alert("🎉 Đã lưu thành công sản phẩm: " + name + " vào kho hàng!");
      })
      .catch(e => {
        console.error(e);
        alert("Bảo Ngọc Scraper Lỗi kết nối: Không thể gửi dữ liệu. Server Bảo Ngọc LED có thể đang bận hoặc URL bị chặn CORS.");
      });
    })();`;
    
    // Minify it slightly by removing newlines
    setBookmarkletCode(jsCode.replace(/\s+/g, ' ').replace(/> </g, '><'));
  }, [targetCategory, targetSubCategory, origin]);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Zap className="h-8 w-8 text-[#4A238B]" />
          Công cụ Cào Từng Sản Phẩm (Bookmarklet)
        </h1>
        <p className="text-slate-500 mt-2">Dùng cách này để vượt qua lớp bảo vệ của Rạng Đông Store. Lấy thẳng dữ liệu từ màn hình của bạn về web Bảo Ngọc LED chỉ bằng 1 nút bấm.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-800 border-b pb-3">Bước 1: Chọn Nơi Lưu Trữ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-bold text-slate-700">Lưu vào Danh mục chính (Bảo Ngọc) *</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
              value={targetCategory} 
              onChange={(e) => {
                setTargetCategory(e.target.value);
                setTargetSubCategory(""); 
              }}
            >
              <option value="">-- Mặc định (Chưa phân loại) --</option>
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

        <h2 className="text-xl font-bold text-slate-800 border-b pb-3 pt-4">Bước 2: Cài Đặt Nút Cào Dữ Liệu</h2>
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 space-y-4">
            <p className="text-slate-700">
              Hãy dùng chuột <strong>bấm giữ (click and drag)</strong> nút màu tím khổng lồ bên cạnh, sau đó <strong>kéo và thả</strong> nó lên thanh Dấu Trang (Bookmark bar) nằm ngay dưới thanh địa chỉ của trình duyệt bạn đang dùng.
            </p>
            <p className="text-sm text-slate-500">
              * Nếu bạn không thấy thanh Dấu trang, hãy ấn tổ hợp phím <strong>Ctrl + Shift + B</strong> (Windows) hoặc <strong>Cmd + Shift + B</strong> (Mac).
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-center gap-2">
            <a 
              href={bookmarkletCode} 
              className="px-8 py-4 bg-[#4A238B] text-white font-black rounded-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-2 cursor-grab active:cursor-grabbing hover:bg-[#381b6c]"
              onClick={(e) => {
                e.preventDefault();
                alert("ĐỪNG CLICK! Bạn hãy NHẤN GIỮ CHUỘT vào nút này, sau đó KÉO VÀ THẢ nó lên thanh Dấu trang (Bookmark Bar) ở trên cùng của trình duyệt nhé!");
              }}
            >
              <DownloadCloud className="w-5 h-5" />
              🛒 Kéo về Bảo Ngọc LED
            </a>
            <span className="text-xs text-blue-500 font-bold">Kéo nút này lên trên ↑</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-800 border-b pb-3 pt-4">Bước 3: Hướng Dẫn Sử Dụng</h2>
        <div className="space-y-4 text-slate-700">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-900 shrink-0">1</div>
            <p className="mt-1">Mở một tab (thẻ) mới và vào trang web <strong>rangdongstore.vn</strong>.</p>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-900 shrink-0">2</div>
            <p className="mt-1">Bấm vào xem chi tiết một sản phẩm bất kỳ (Ví dụ: Đèn LED âm trần 7W AT10).</p>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-[#4A238B] flex items-center justify-center font-black text-white shrink-0">3</div>
            <p className="mt-1">Khi màn hình đang ở trang sản phẩm, bạn <strong>bấm vào nút "🛒 Kéo về Bảo Ngọc LED"</strong> mà bạn vừa cài trên thanh Dấu trang lúc nãy.</p>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center font-black text-green-700 shrink-0">4</div>
            <p className="mt-1">Hệ thống sẽ hiện thông báo "Đã lưu thành công". Thế là xong! Sản phẩm đã nằm trong CSDL của bạn.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
