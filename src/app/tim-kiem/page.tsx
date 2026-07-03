import { ProductCard, Product } from "@/components/product-card";
import { FilterSidebar } from "@/components/filter-sidebar";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const revalidate = 0;

export default async function SearchPage({ 
  searchParams
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsResolved = await searchParams;
  const q = searchParamsResolved.q as string || "";

  let products: Product[] = [];
  try {
    const qFirestore = query(collection(db, "products"));
    const snapshot = await getDocs(qFirestore);
    let allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Product));

    // Filter locally by search query
    if (q) {
      const lowerQ = q.toLowerCase();
      products = allProducts.filter(p => 
        p.name.toLowerCase().includes(lowerQ) || 
        p.sku.toLowerCase().includes(lowerQ)
      );
    } else {
      products = allProducts;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Kết quả tìm kiếm cho: "{q}"
          </h1>
          <p className="text-muted-foreground mt-2">Tìm thấy {products.length} sản phẩm</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <FilterSidebar />
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
            {products.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy sản phẩm nào!</h3>
                <p className="text-slate-500 max-w-md">Rất tiếc, chúng tôi không tìm thấy kết quả nào phù hợp với từ khóa "{q}". Vui lòng thử lại bằng từ khóa khác.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
