"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { Product } from "@/components/product-card";

export function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0] || "/placeholder.png",
      wattage: product.specs.wattage,
      color_temperature: product.specs.color_temperature,
    });
    // In a real app, you might show a toast notification here
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="font-medium">Số lượng:</span>
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none rounded-l-md"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none rounded-r-md"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">{product.stock} sản phẩm có sẵn</span>
      </div>
      
      <div className="flex gap-4">
        <Button 
          size="lg" 
          className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <ShoppingCart className="h-5 w-5" />
          Thêm vào giỏ hàng
        </Button>
        <Button 
          size="lg" 
          variant="secondary" 
          className="flex-1 font-bold bg-secondary hover:bg-secondary/80"
          disabled={product.stock <= 0}
        >
          Mua ngay
        </Button>
      </div>
    </div>
  );
}
