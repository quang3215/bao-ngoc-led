"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Product } from "@/components/product-card";

interface TrendingProduct extends Product {
  originalPrice?: number;
  discount?: number;
  tag?: string;
}

function TrendingCard({ product }: { product: TrendingProduct }) {
  const defaultImage = "https://vcdn.tikicdn.com/cache/w1200/ts/product/6e/b5/1d/18e38eaed7fb8c9f5926715b7468132e.png";
  const initialImage = (product.images && product.images.length > 0 && product.images[0]) ? product.images[0] : defaultImage;
  const [imgSrc, setImgSrc] = useState(initialImage);

  return (
    <div className="bg-white p-5 rounded-2xl group relative flex flex-col h-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-transparent hover:border-slate-100">
      {/* Discount Badge */}
      {product.discount && product.discount > 0 ? (
        <div className="absolute top-4 right-4 z-10 bg-destructive text-white text-[10px] font-bold px-2 py-1 rounded-md text-center leading-tight shadow-sm tracking-wider uppercase">
          Giảm {product.discount}%
        </div>
      ) : null}
      
      {/* Image */}
      <div className="relative w-full aspect-[4/5] mb-5 bg-slate-50/50 flex items-center justify-center p-4 rounded-xl overflow-hidden">
        <Image 
          src={imgSrc} 
          alt={product.name}
          fill
          onError={() => setImgSrc(defaultImage)}
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1">
        <Link href={`/san-pham/${product.sku}`} className="hover:text-primary transition-colors">
          <h3 className="text-sm md:text-base font-semibold text-slate-900 line-clamp-2 mb-3 min-h-[40px] leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-slate-900 font-bold text-lg tracking-tight">
              {formatCurrency(product.price)}
            </span>
            {product.price > 0 && product.originalPrice && product.originalPrice > product.price && (
              <span className="text-slate-400 line-through text-xs font-medium">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Tag */}
          {product.tag && (
            <div className="inline-block bg-[#f3e8ff] text-[#4A238B] text-[10px] font-medium px-2 py-0.5 rounded">
              {product.tag}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TrendingSection({ products }: { products: TrendingProduct[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-8 bg-[#f4f5f7]">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        <div className="bg-[#4A238B] rounded-2xl p-6 md:p-8 shadow-md">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 inline-block relative">
                Sản phẩm được ưa chuộng
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-400"></div>
              </h2>
              <p className="text-white/90 text-sm max-w-xl mt-3 hidden md:block">
                Các thiết bị chiếu sáng được ưa chuộng nhất tại Rạng Đông Store, nâng cao trải nghiệm sống của hàng ngàn khách hàng.
              </p>
            </div>
            <Link href="/tim-kiem?sort=trending" className="text-white hover:text-yellow-300 text-sm font-medium flex items-center mt-3 md:mt-0 transition-colors">
              Xem thêm <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="relative">
            <div 
              className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:overflow-visible"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {products.map((product) => (
                <div key={product.sku} className="w-[45vw] sm:min-w-0 sm:w-auto snap-start shrink-0">
                  <TrendingCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
