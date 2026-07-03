"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Zap } from "lucide-react";
import { Product } from "@/components/product-card";

interface FlashsaleProduct extends Product {
  originalPrice?: number;
  badgeText?: string;
  sold?: number;
  total?: number;
}

function FlashsaleCard({ product }: { product: FlashsaleProduct }) {
  const defaultImage = "https://vcdn.tikicdn.com/cache/w1200/ts/product/6e/b5/1d/18e38eaed7fb8c9f5926715b7468132e.png";
  const initialImage = (product.images && product.images.length > 0 && product.images[0]) ? product.images[0] : defaultImage;
  const [imgSrc, setImgSrc] = useState(initialImage);

  return (
    <div className="border border-gray-100 rounded-lg p-4 hover:shadow-[0_0_15px_rgba(74,35,139,0.1)] transition-shadow relative bg-white group flex flex-col h-full">
      {/* Badge */}
      <div className="absolute top-2 left-2 z-10">
        <div className="bg-gradient-to-r from-[#4A238B] to-[#7B1FA2] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Zap className="w-3 h-3 fill-yellow-300 text-yellow-300" />
          {product.badgeText || "RẺ NHẤT RỒI!"}
        </div>
      </div>

      {/* Image */}
      <div className="relative w-full aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-4">
        <Image 
          src={imgSrc} 
          alt={product.name}
          fill
          onError={() => setImgSrc(defaultImage)}
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1">
        <Link href={`/san-pham/${product.sku}`} className="hover:text-[#4A238B] transition-colors">
          <h3 className="font-bold text-gray-800 text-sm md:text-base line-clamp-2 mb-2 min-h-[40px]">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto">
          <div className="text-red-600 font-bold text-lg md:text-xl mb-3">
            {formatCurrency(product.price)}
          </div>

          {/* Stock Status */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-red-500 font-medium mb-1 border border-red-200 inline-block px-2 py-0.5 rounded text-[10px]">
              Còn {product.sold || 5}/{product.total || 10} suất
            </div>
          </div>

          {/* Fake Countdown Button */}
          <div className="w-full bg-[#f3e8ff] text-[#4A238B] text-center py-1.5 rounded-full text-xs font-bold shadow-sm relative overflow-hidden border border-[#d1c4e9]">
            <div className="absolute top-0 left-0 h-full bg-[#eaddff] w-[50%] z-0" />
            <span className="relative z-10">Còn 23:58:30 (50%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FlashsaleSection({ products, config }: { products: FlashsaleProduct[], config?: any }) {
  if (!config?.isActive || !products || products.length === 0) return null;

  return (
    <section className="py-8 bg-[#f4f5f7]">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        {/* Flashsale Container with gradient border effect */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#35156B] via-[#4A238B] to-[#7B1FA2] p-1 pb-2 shadow-lg mt-6">
          
          {/* Top Decorative Header */}
          <div className="absolute -top-6 left-8 bg-[#4A238B] text-white font-black text-xl italic px-6 py-2 rounded-t-xl rounded-br-xl shadow-md flex items-center border-2 border-b-0 border-[#7B1FA2]">
            <Zap className="w-5 h-5 mr-1 fill-yellow-400 text-yellow-400" /> FLASHSALE
          </div>

          <div className="absolute -top-8 right-8 hidden md:block">
            {/* DEAL ĐỘC QUYỀN Text */}
            <div className="bg-gradient-to-r from-[#7B1FA2] to-[#4A238B] text-white font-black text-2xl md:text-3xl italic px-8 py-2 rounded-full border-4 border-white shadow-md flex items-center gap-2">
              {config.title || "DEAL ĐỘC QUYỀN TỪ"} 
              <span className="font-sans non-italic tracking-tighter">{config.subtitle || "Rạng Đông"}</span>
            </div>
          </div>

          {/* Inner Content Box */}
          <div className="bg-white rounded-xl p-4 sm:p-6 mt-8 sm:mt-10">
            <div 
              className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {products.map((product) => (
                <div key={product.sku} className="w-[45vw] sm:min-w-0 sm:w-auto snap-start shrink-0">
                  <FlashsaleCard product={product} />
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <span className="text-white bg-[#4A238B] hover:bg-[#35156B] cursor-pointer font-bold px-6 py-2 rounded-full text-sm inline-flex items-center transition-colors">
                Mỗi SĐT chỉ được mua 1 sản phẩm cùng loại <span className="ml-2 bg-white text-[#4A238B] px-3 py-1 rounded-full text-xs font-black flex items-center gap-1"><Zap className="w-3 h-3"/> GỌI ĐẶT TRƯỚC</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
