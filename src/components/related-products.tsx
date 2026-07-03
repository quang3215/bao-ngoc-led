"use client";

import { useEffect, useState } from "react";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProductCard, Product } from "@/components/product-card";

interface RelatedProductsProps {
  currentSku: string;
  category: string;
}

export function RelatedProducts({ currentSku, category }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      if (!category) {
        setIsLoading(false);
        return;
      }

      try {
        // Query up to 5 products in the same category
        const q = query(
          collection(db, "products"),
          where("category", "==", category),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        
        const fetchedProducts: Product[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Product;
          // Exclude the current product
          if (data.sku !== currentSku) {
            fetchedProducts.push({ ...data, id: doc.id } as any);
          }
        });

        // Keep only 4 products
        setProducts(fetchedProducts.slice(0, 4));
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRelated();
  }, [category, currentSku]);

  if (isLoading) {
    return (
      <div className="py-12 border-t mt-12">
        <h3 className="text-2xl font-bold mb-6 text-slate-900">Sản phẩm tương tự</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-100 rounded-2xl aspect-[4/5] animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="py-12 border-t border-slate-100 mt-12">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Thường được mua cùng</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.sku} product={product} />
        ))}
      </div>
    </div>
  );
}
