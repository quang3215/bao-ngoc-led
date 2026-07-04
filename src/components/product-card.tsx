"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  
  const defaultImage = "https://vcdn.tikicdn.com/cache/w1200/ts/product/6e/b5/1d/18e38eaed7fb8c9f5926715b7468132e.png";
  const initialImage = (product.images && product.images.length > 0 && product.images[0]) ? product.images[0] : defaultImage;
  const [imgSrc, setImgSrc] = useState(initialImage);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
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

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: imgSrc,
      wattage: product.specs.wattage,
      color_temperature: product.specs.color_temperature,
    });
    router.push('/checkout');
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
          <div className="mt-auto flex flex-col gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-[#ee4d2d] tracking-tight">
                {formatCurrency(product.price)}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                {formatCurrency(Math.round(product.price * 1.35 / 1000) * 1000)}
              </span>
            </div>
            
            <div className="flex gap-1.5 flex-wrap">
              <span className="bg-[#e0f2fe] text-[#0284c7] text-[10px] sm:text-[11px] px-2 py-0.5 rounded font-medium">
                {product.specs.wattage || "Sản phẩm mới"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-2">
              <Button 
                variant="outline"
                className="flex-[1] h-8 sm:h-9 border-[#4A238B] text-[#4A238B] hover:bg-[#f3e8ff] px-0"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                title="Thêm vào giỏ hàng"
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
              <Button 
                className="flex-[3] h-8 sm:h-9 bg-[#4A238B] hover:bg-[#35156B] text-white font-medium px-2 text-[11px] sm:text-xs uppercase tracking-wide"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? "Mua ngay" : "Hết hàng"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
