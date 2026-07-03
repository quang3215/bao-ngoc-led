"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";

import { toast } from "sonner";

export interface Product {
  sku: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  subCategory?: string;
  specs: {
    wattage?: string;
    color_temperature?: string;
    hole_size?: string;
  };
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  
  const defaultImage = "https://vcdn.tikicdn.com/cache/w1200/ts/product/6e/b5/1d/18e38eaed7fb8c9f5926715b7468132e.png";
  const initialImage = (product.images && product.images.length > 0 && product.images[0]) ? product.images[0] : defaultImage;
  const [imgSrc, setImgSrc] = useState(initialImage);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product detail
    addItem({
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: imgSrc,
      wattage: product.specs.wattage,
      color_temperature: product.specs.color_temperature,
    });
    toast.success("Đã thêm vào giỏ hàng!", {
      description: product.name,
    });
  };

  return (
    <Link href={`/san-pham/${product.sku}`} className="group relative block h-full">
      <Card className="overflow-hidden flex flex-col h-full bg-white border border-slate-100 hover:border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 relative z-10 rounded-xl">
        <div className="relative aspect-square overflow-hidden bg-white flex items-center justify-center p-2 sm:p-6">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            onError={() => setImgSrc(defaultImage)}
            className="object-contain p-2 sm:p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
          
          {/* Discount Badge */}
          <div className="absolute top-0 right-0 bg-[#0088cc] text-white text-[10px] sm:text-xs font-bold px-1.5 py-1 text-center leading-tight rounded-bl-lg z-10">
            GIẢM<br/>35%
          </div>

          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="bg-slate-800 text-white px-3 py-1.5 font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-full">
                Hết hàng
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-3 sm:p-4 flex-1 flex flex-col pt-1 sm:pt-2 border-t border-slate-50">
          <h3 className="font-semibold text-[#222] text-[13px] sm:text-sm line-clamp-2 leading-snug mb-2 group-hover:text-[#4A238B] transition-colors">
            {product.name}
          </h3>
          <div className="mt-auto flex flex-col gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-[#ee4d2d] tracking-tight">
                {formatCurrency(product.price)}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                {formatCurrency(Math.round(product.price * 1.35 / 1000) * 1000)}
              </span>
            </div>
            
            <div className="flex gap-1.5 flex-wrap mt-1">
              <span className="bg-[#e0f2fe] text-[#0284c7] text-[10px] sm:text-[11px] px-2 py-0.5 rounded font-medium">
                {product.specs.wattage || "Sản phẩm mới"}
              </span>
            </div>
          </div>
        </CardContent>
        {/* Hidden Add to cart on mobile, visible on hover desktop */}
        <div className="hidden sm:block absolute bottom-0 left-0 right-0 p-4 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 backdrop-blur-sm z-30 border-t border-slate-100">
          <Button 
            className="w-full h-10 bg-[#4A238B] text-white hover:bg-[#35156B] rounded-lg font-medium shadow-md"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
          </Button>
        </div>
      </Card>
    </Link>
  );
}
