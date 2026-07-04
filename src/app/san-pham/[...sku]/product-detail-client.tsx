"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, List, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useSettingsStore, SiteSettings } from "@/store/settings";
import { useEffect } from "react";
import { RelatedProducts } from "@/components/related-products";
import { ProductReviews } from "@/components/product-reviews";

export function ProductDetailClient({ product }: { product: any }) {
  const { settings, fetchSettings } = useSettingsStore();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);
  const images = product.images?.length > 0 ? product.images : ["https://placehold.co/800x800/f8fafc/1e293b?text=No+Image"];

  // Use real variants from DB
  const variants = product.variants?.length > 0 ? product.variants : [];
  const [activeVariant, setActiveVariant] = useState<any>(variants[0] || null);
  
  const displayPrice = activeVariant ? activeVariant.price : product.price;

  // Use product specs or fallbacks
  const wattage = product.specs?.wattage || "10W";
  const colorTemp = product.specs?.color_temperature || "6500K/4000K/3000K";

  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleAddToCart = () => {
    addItem({
      sku: product.sku,
      name: product.name,
      price: displayPrice,
      quantity: 1,
      image: images[0],
      wattage: activeVariant ? activeVariant.name : wattage,
      color_temperature: colorTemp,
    });
    router.push("/checkout");
  };
  
  return (
    <div className="bg-white min-h-screen">
      {/* Top Section */}
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12">
          
          {/* Left Column: Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-[#f7f7f7] flex items-center justify-center p-8">
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                className="object-contain mix-blend-multiply"
                priority
              />
            </div>
            <div className="flex gap-4">
              {images.map((img: string, idx: number) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 rounded-md overflow-hidden bg-[#f7f7f7] cursor-pointer border-2 transition-colors flex items-center justify-center p-2
                    ${activeImage === idx ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}`}
                >
                  <Image src={img} alt={`Thumb ${idx}`} fill className="object-contain mix-blend-multiply" />
                </div>
              ))}
              {/* Fake 360 icon thumbnail */}
              <div className="relative w-20 h-20 rounded-md overflow-hidden bg-[#f7f7f7] cursor-pointer border-2 border-transparent hover:border-gray-300 flex items-center justify-center">
                <span className="font-bold text-gray-400 text-xl">360°</span>
              </div>
            </div>
          </div>

          {/* Right Column: Info */}
          <div>
            <h1 className="text-[28px] font-bold leading-tight text-gray-900 mb-2">{product.name}</h1>
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-500 text-sm">Model: <span className="uppercase">{product.sku}</span></div>
              <span className="bg-[#4A238B] text-white text-xs px-3 py-1 rounded-l-full font-medium shadow-sm cursor-pointer hover:bg-green-700">
                Tìm sản phẩm tương tự &gt;
              </span>
            </div>

            <hr className="mb-6 border-gray-200" />

            {/* Quick Specs Table */}
            <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[180px_1fr] gap-y-2 text-sm mb-6 overflow-hidden">
              <div className="text-gray-600">Công suất:</div>
              <div className="font-bold">{wattage}</div>
              
              <div className="text-gray-600">Điện áp danh định:</div>
              <div className="font-bold">{product.specs?.voltage || "220V/50Hz"}</div>
              
              <div className="text-gray-600">Dải điện áp hoạt động:</div>
              <div className="font-bold">{product.specs?.voltage_range || "150V - 250V"}</div>
              
              <div className="text-gray-600">Quang thông danh định:</div>
              <div className="font-bold">{product.specs?.luminous_flux || "1000 lm"}</div>
              
              <div className="text-gray-600">Nhiệt độ màu:</div>
              <div className="font-bold">{colorTemp}</div>
              
              <div className="text-gray-600">Hiệu suất sáng danh định:</div>
              <div className="font-bold">{product.specs?.luminous_efficacy || "100 lm/W"}</div>
              
              <div className="text-gray-600">Chỉ số hoàn màu Ra:</div>
              <div className="font-bold">{product.specs?.cri || "80"}</div>
              
              <div className="text-gray-600">Tuổi thọ:</div>
              <div className="font-bold">{product.specs?.lifespan || "30.000 giờ"}</div>
              
              <div className="text-gray-600">Kích thước khoét trần:</div>
              <div className="font-bold">{product.specs?.hole_size || "90mm"}</div>
              
              <div className="text-gray-600">Bảo hành:</div>
              <div className="font-bold">{product.specs?.warranty || "2 năm"}</div>
            </div>

            <hr className="mb-6 border-gray-200" />

            {/* Features list */}
            {product.features && product.features.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-800 mb-6">
                {product.features.map((feature: string, idx: number) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            ) : (
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-800 mb-6">
                <li className="italic text-gray-400">Đang cập nhật đặc điểm nổi bật...</li>
              </ul>
            )}

            {/* Variants */}
            {variants.length > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <span className="font-bold text-sm">Phiên bản</span>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v: any, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveVariant(v)}
                      className={`border px-3 py-1.5 text-xs font-medium transition-colors ${activeVariant?.name === v.name ? 'border-blue-600 text-blue-600 shadow-sm' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Box */}
            <div className="bg-[#f4f5f7] py-3 px-6 text-center mb-6">
              <span className="text-gray-700">Giá bán lẻ đề xuất: </span>
              <span className="text-xl font-bold text-gray-900">{formatCurrency(displayPrice)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
              <div className="flex items-center gap-2 text-[#d32f2f] font-bold text-xl sm:mr-4 w-full sm:w-auto justify-center sm:justify-start bg-red-50 p-3 sm:bg-transparent sm:p-0 rounded-lg">
                <div className="bg-[#d32f2f] text-white p-1 rounded-full"><Phone size={16} /></div>
                {settings.hotline}
              </div>
              <Button onClick={handleAddToCart} className="bg-[#d32f2f] hover:bg-red-700 text-white font-bold rounded-lg h-12 sm:h-11 px-6 w-full sm:w-auto shadow-md">
                <ShoppingCart className="mr-2 h-5 w-5" /> MUA HÀNG ONLINE
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button variant="outline" className="flex-1 rounded-lg border-gray-300 text-gray-700 hover:text-gray-900 h-12 font-medium bg-white hover:bg-gray-50 shadow-sm">
                <MapPin className="mr-2 h-4 w-4" /> MUA HÀNG Ở ĐÂU
              </Button>
              <Button variant="outline" className="flex-1 rounded-lg border-gray-300 text-gray-700 hover:text-gray-900 h-12 font-medium bg-white hover:bg-gray-50 shadow-sm">
                <List className="mr-2 h-4 w-4" /> XEM TẤT CẢ SẢN PHẨM
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="w-full mt-8 max-w-[100vw] bg-white border-t border-slate-200">
        <Tabs defaultValue="mo-ta" className="w-full max-w-6xl mx-auto py-8 px-4">
          <TabsList className="flex w-full h-14 p-0 bg-white border border-slate-200 rounded-none mb-8">
            <TabsTrigger 
              value="mo-ta" 
              className="flex-1 h-full rounded-none data-[state=active]:bg-[#00a1e4] data-[state=active]:text-white text-slate-500 font-bold text-[15px] sm:text-lg border-r border-slate-200 last:border-r-0 transition-colors"
            >
              Mô tả sản phẩm
            </TabsTrigger>
            <TabsTrigger 
              value="thong-so" 
              className="flex-1 h-full rounded-none data-[state=active]:bg-[#00a1e4] data-[state=active]:text-white text-slate-500 font-bold text-[15px] sm:text-lg border-r border-slate-200 last:border-r-0 transition-colors"
            >
              Thông số kỹ thuật
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mo-ta" className="m-0 focus-visible:outline-none">
            <div className="bg-white rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.05)] border border-slate-100">
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
                <Image 
                  src={product.application?.image || "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2929&auto=format&fit=crop"} 
                  alt="Ứng dụng đèn LED"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-16">
                  <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold text-[10px] sm:text-xs tracking-wide uppercase mb-4 sm:mb-6">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" /> Ứng Dụng Thực Tế
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight tracking-tight">
                      {product.application?.title || "KIẾN TẠO KHÔNG GIAN SỐNG HIỆN ĐẠI"}
                    </h2>
                    <div className="h-1 sm:h-1.5 w-16 sm:w-24 bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 md:p-16 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                  {product.application?.isHtml ? (
                    <div 
                      className="prose prose-slate max-w-none text-slate-700 leading-loose text-justify font-medium"
                      dangerouslySetInnerHTML={{ __html: product.application?.description || "" }}
                    />
                  ) : (
                    <p className="text-slate-700 text-lg md:text-xl leading-loose text-justify font-medium whitespace-pre-line">
                      {product.application?.description || "Sản phẩm được thiết kế tối ưu với các tùy chọn ánh sáng linh hoạt, phù hợp hoàn hảo với nhịp sinh học của người dùng. Sở hữu kiểu dáng sang trọng, hiện đại cùng chỉ số hoàn màu (CRI) cao vượt trội, đèn không chỉ mang đến nguồn ánh sáng chân thực, tự nhiên mà còn góp phần nâng tầm không gian sống thêm phần tinh tế và đẳng cấp.\n\nSản phẩm là sự lựa chọn hoàn hảo để tạo điểm nhấn thẩm mỹ cho đa dạng không gian: từ tổ ấm gia đình, văn phòng làm việc chuyên nghiệp, đến các khách sạn sang trọng và trung tâm thương mại sầm uất."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="thong-so" className="m-0 focus-visible:outline-none bg-white p-8 rounded-xl shadow-sm border border-slate-100 min-h-[400px]">
            <h2 className="text-2xl font-bold mb-6">Thông số kỹ thuật chi tiết</h2>
            <div className="space-y-8">
              <div className="overflow-x-auto">
                <h3 className="text-lg font-bold mb-4 bg-gray-100 p-3">Đặc tính của đèn</h3>
                <table className="w-full text-sm min-w-[300px]">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-600 w-1/2">Đường kính lỗ khoét trần</td>
                      <td className="py-3 px-4 font-medium">{product.specs?.hole_size || "90 mm"}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-600 w-1/2">Nguồn điện danh định</td>
                      <td className="py-3 px-4 font-medium">{product.specs?.voltage || "220V/50Hz"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto">
                <h3 className="text-lg font-bold mb-4 bg-gray-100 p-3">Thông số điện</h3>
                <table className="w-full text-sm min-w-[300px]">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-600 w-1/2">Công suất</td>
                      <td className="py-3 px-4 font-medium">{wattage}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-600 w-1/2">Điện áp có thể hoạt động</td>
                      <td className="py-3 px-4 font-medium">{product.specs?.voltage_range || "150V – 250 V"}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-600 w-1/2">Tuổi thọ</td>
                      <td className="py-3 px-4 font-medium">{product.specs?.lifespan || "30.000 giờ"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="overflow-x-auto">
                <h3 className="text-lg font-bold mb-4 bg-gray-100 p-3">Thông số quang</h3>
                <table className="w-full text-sm min-w-[300px]">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-600 w-1/2">Quang thông</td>
                      <td className="py-3 px-4 font-medium">{product.specs?.luminous_flux || "1000 lm"}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-600 w-1/2">Hiệu suất sáng</td>
                      <td className="py-3 px-4 font-medium">{product.specs?.luminous_efficacy || "100 lm/W"}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-600 w-1/2">Chỉ số hoàn màu (CRI)</td>
                      <td className="py-3 px-4 font-medium">{product.specs?.cri || "80"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="w-full max-w-6xl mx-auto px-4 pb-12">
          {/* Reviews */}
          <ProductReviews sku={product.sku} />

          {/* Related Products */}
          <RelatedProducts currentSku={product.sku} category={product.category} />
        </div>
      </div>
    </div>
  );
}
