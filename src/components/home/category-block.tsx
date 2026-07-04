"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/components/product-card";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface CategoryBlockProduct extends Product {
  originalPrice?: number;
  discount?: number;
  tag?: string;
}

function CategoryProductCard({ product }: { product: CategoryBlockProduct }) {
  const defaultImage = "https://vcdn.tikicdn.com/cache/w1200/ts/product/f3/d3/42/411eb345d14df9042bbf062dc7ed8eb7.png";
  const initialImage = (product.images && product.images.length > 0 && product.images[0]) ? product.images[0] : defaultImage;
  const [imgSrc, setImgSrc] = useState(initialImage);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  return (
    <div className="bg-white p-3 sm:p-5 lg:p-7 group relative flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-500 z-0 hover:z-10">
      {/* Discount Badge */}
      {product.discount && product.discount > 0 ? (
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-[#0088cc] text-white text-[10px] font-bold px-1.5 py-1 rounded-sm text-center leading-tight shadow-sm tracking-wider uppercase">
          Giảm {product.discount}%
        </div>
      ) : null}
      
      {/* Image */}
      <div className="relative w-full aspect-square mb-3 sm:mb-5 bg-slate-50/50 flex items-center justify-center p-2 sm:p-4 rounded-lg sm:rounded-xl">
        <Image 
          src={imgSrc} 
          alt={product.name}
          fill
          onError={() => setImgSrc(defaultImage)}
          className="object-contain group-hover:scale-105 transition-transform duration-500 p-2"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1">
        <Link href={`/san-pham/${product.sku}`} className="hover:text-primary transition-colors">
          <h3 className="text-[13px] sm:text-sm md:text-base font-semibold text-slate-800 line-clamp-2 mb-2 sm:mb-3 min-h-[38px] leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
            <span className="text-red-600 font-bold text-base sm:text-lg tracking-tight">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-slate-400 line-through text-[11px] sm:text-xs font-medium">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Tag */}
          {product.tag && (
            <div className="inline-block bg-[#e0f2fe] text-[#0284c7] text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wider mb-2">
              {product.tag}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-2">
            <button 
              className="flex-[1] h-8 sm:h-9 flex items-center justify-center border border-[#4A238B] text-[#4A238B] hover:bg-[#f3e8ff] rounded-md transition-colors disabled:opacity-50"
              onClick={(e) => {
                e.preventDefault();
                addItem({
                  sku: product.sku,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  image: imgSrc,
                  wattage: product.specs?.wattage,
                  color_temperature: product.specs?.color_temperature,
                });
                toast.success("Đã thêm vào giỏ hàng!", { description: product.name });
              }}
              disabled={product.stock <= 0}
              title="Thêm vào giỏ hàng"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
            <button 
              className="flex-[3] h-8 sm:h-9 bg-[#7B1FA2] hover:bg-[#4A238B] text-white font-medium px-2 text-[11px] sm:text-xs uppercase tracking-wide rounded-md transition-colors disabled:opacity-50"
              onClick={(e) => {
                e.preventDefault();
                addItem({
                  sku: product.sku,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  image: imgSrc,
                  wattage: product.specs?.wattage,
                  color_temperature: product.specs?.color_temperature,
                });
                router.push('/checkout');
              }}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? "Mua ngay" : "Hết hàng"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface CategoryBlockProps {
  title: string;
  href: string;
  subcategories: { name: string; href: string }[];
  products: CategoryBlockProduct[];
  isOdd?: boolean; // Used to alternate styles if needed
}

export function CategoryBlock({ title, href, subcategories, products, isOdd }: CategoryBlockProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-6 bg-[#f4f5f7]">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Left Column - Sidebar */}
          <div className="w-full lg:w-[260px] xl:w-[280px] shrink-0 bg-white shadow-sm flex flex-col h-full border border-gray-100">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-[22px] font-bold text-[#111827]">{title}</h2>
            </div>
            
            {/* Subcategories list */}
            <div 
              className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none bg-white p-3 lg:p-0 gap-2 lg:gap-0 border-b border-gray-100 hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {subcategories && subcategories.map((sub, idx) => (
                <Link 
                  key={idx} 
                  href={sub.href}
                  className="shrink-0 snap-start px-4 py-2 lg:py-3 text-[13px] text-[#444] lg:text-gray-600 bg-[#f4f5f7] lg:bg-transparent rounded-lg lg:rounded-none lg:border-b border-gray-50 lg:last:border-b-0 hover:text-[#4A238B] hover:bg-[#eaddff] lg:hover:bg-gray-50 flex items-center justify-between group transition-colors font-medium lg:font-normal whitespace-nowrap"
                >
                  {sub.name}
                  <ChevronRight className="hidden lg:block w-3 h-3 text-gray-300 group-hover:text-[#4A238B]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column - Products Grid */}
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-[1px] bg-gray-200 border border-gray-200 overflow-hidden sm:rounded-none">
              {products.slice(0, 6).map((product) => (
                <CategoryProductCard key={product.sku} product={product} />
              ))}
            </div>
            
            <div className="mt-4 flex justify-center w-full px-4 sm:px-0">
               <Link href={href} className="w-full sm:w-[300px] text-center bg-white text-[#4A238B] border border-[#4A238B] py-2.5 font-bold text-sm hover:bg-[#4A238B] hover:text-white transition-colors rounded-md shadow-sm">
                 Xem tất cả
               </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
