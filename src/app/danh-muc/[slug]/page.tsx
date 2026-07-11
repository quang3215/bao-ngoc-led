import { ProductCard, Product } from "@/components/product-card";
import { FilterSidebar } from "@/components/filter-sidebar";
import { collection, getDocs, query, where, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { MEGA_MENU_CATEGORIES as LOCAL_CATEGORIES } from "@/lib/categories-data";
import { Metadata } from "next";

export const revalidate = 0; // Disable cache to see fresh products immediately

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  const subSlug = searchParamsResolved.sub as string | undefined;

  let title = "Danh mục sản phẩm";
  let description = "Mua sản phẩm Rạng Đông chính hãng giá tốt nhất tại Bảo Ngọc LED.";

  try {
    const catRef = doc(db, 'settings', 'categories');
    const catSnap = await getDoc(catRef);
    const MEGA_MENU_CATEGORIES = catSnap.exists() && catSnap.data().items && catSnap.data().items.length > 0 ? catSnap.data().items : LOCAL_CATEGORIES;
    
    let mainCat = MEGA_MENU_CATEGORIES.find((c: any) => c.slug === slug);
    if (!mainCat && slug === 'tat-ca') {
      mainCat = { name: 'Tất cả sản phẩm', description: 'Khám phá tất cả thiết bị điện Rạng Đông' };
    }

    if (mainCat) {
      title = `${mainCat.name} Rạng Đông Chính Hãng | Bảo Ngọc LED`;
      
      if (subSlug && mainCat.subCategories) {
        const subCat = mainCat.subCategories.find((s: any) => s.slug === subSlug);
        if (subCat) {
          title = `${subCat.name} Rạng Đông | Bảo Ngọc LED`;
        }
      }
    }
  } catch(e) {}

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    }
  };
}

export default async function CategoryPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  const subSlug = searchParamsResolved.sub as string | undefined;

  // Fetch products from Firestore
  let products: Product[] = [];
  try {
    const productsRef = collection(db, "products");
    let q;
    
    if (slug === 'tat-ca') {
      q = query(productsRef);
    } else {
      q = query(productsRef, where("category", "==", slug));
    }

    const snapshot = await getDocs(q);
    let allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Product));

    // Filter by subCategory in Javascript if present
    if (subSlug) {
      allProducts = allProducts.filter(p => p.subCategory === subSlug);
    }
    
    // Removed MOCK DATA GENERATION

    products = allProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  // Fetch dynamic categories
  let MEGA_MENU_CATEGORIES: any[] = [];
  try {
    const catRef = doc(db, 'settings', 'categories');
    const catSnap = await getDoc(catRef);
    MEGA_MENU_CATEGORIES = catSnap.exists() && catSnap.data().items && catSnap.data().items.length > 0 ? catSnap.data().items : LOCAL_CATEGORIES;
  } catch(e) {
    MEGA_MENU_CATEGORIES = LOCAL_CATEGORIES;
  }

  // Double check if the Firebase fetched categories actually have subcategories. If not, merge or fallback to local.
  let mainCat = MEGA_MENU_CATEGORIES.find((c: any) => c.slug === slug);
  if (mainCat && (!mainCat.subCategories || mainCat.subCategories.length === 0)) {
    const localCat = LOCAL_CATEGORIES.find((c: any) => c.slug === slug);
    if (localCat && localCat.subCategories && localCat.subCategories.length > 0) {
      mainCat = localCat;
    }
  }
  const displayTitle = mainCat ? mainCat.name : (slug === 'tat-ca' ? 'Tất cả sản phẩm' : slug.replace(/-/g, ' '));
  const bannerImage = mainCat?.bannerUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

  const HeroBanner = (
    <div className="container mx-auto px-4 md:px-8 max-w-7xl mt-6 md:mt-8">
      <div className="relative w-full rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[21/9] lg:aspect-[3.5/1] shadow-lg flex items-center">
        <img 
          src={bannerImage} 
          alt={`Banner ${displayTitle}`}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0f2e]/90 via-[#4A238B]/60 to-transparent z-10"></div>
        
        <div className="relative z-20 px-8 md:px-16 w-full max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Danh mục nổi bật
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-white leading-tight capitalize drop-shadow-md">
            {displayTitle}
          </h1>
          <p className="text-gray-200 text-sm md:text-base lg:text-lg leading-relaxed mb-8 drop-shadow">
            Khám phá các sản phẩm <strong className="text-white">{displayTitle.toLowerCase()}</strong> với công nghệ tiên tiến, thiết kế hiện đại, mang đến giải pháp hoàn hảo và nâng tầm không gian sống của bạn.
          </p>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // RENDER FANCY LAYOUT: Only if it's a Main Category without a specific subSlug AND has subCategories
  // -------------------------------------------------------------
  const hasFancySections = slug !== 'tat-ca' && mainCat && !subSlug && mainCat.subCategories && mainCat.subCategories.length > 0;

  if (hasFancySections) {
    // Group products by subCategory for easy lookup
    const productsBySub: { [key: string]: Product[] } = {};
    products.forEach(p => {
      const sub = p.subCategory || 'other';
      if (!productsBySub[sub]) productsBySub[sub] = [];
      productsBySub[sub].push(p);
    });

    return (
      <div className="bg-slate-50 min-h-screen pb-12">
        {/* Breadcrumb */}
        <div className="bg-white border-b py-3 px-4">
          <div className="container mx-auto text-sm text-gray-500 flex items-center gap-2 max-w-7xl">
            <Link href="/" className="hover:text-primary">Trang chủ</Link>
            <span>&gt;</span>
            <span className="text-gray-900 font-medium">{displayTitle}</span>
          </div>
        </div>

        {HeroBanner}

        {/* Individual Subcategory Sections */}
        <div className="container px-4 md:px-8 max-w-7xl mx-auto mt-16 space-y-16">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">Đang cập nhật sản phẩm cho danh mục này.</p>
              <Link href="/" className="mt-4 inline-block bg-[#4A238B] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#35156B] transition-colors">
                Quay lại trang chủ
              </Link>
            </div>
          ) : (
            mainCat.subCategories && mainCat.subCategories.map((sub: any, idx: number) => {
              const actualProducts = productsBySub[sub.slug] || [];
              
              // Fallback: If this subcategory has no products in DB, show some generic products to demonstrate layout
              // We use the first 5 products consistently so we don't run out of products for later sections.
              const displayProducts = actualProducts.length > 0 ? actualProducts : products.slice(0, 5);

              // Hide section only if there are absolutely NO products available to display at all
              if (displayProducts.length === 0) return null;

              return (
                <div key={sub.slug} id={`sub-${sub.slug}`} className="scroll-mt-24">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 border-b border-gray-200 pb-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{sub.name}</h2>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 w-full">
                        <Link href={`/danh-muc/${slug}?sub=${sub.slug}`} className="bg-[#f3e8ff] text-[#4A238B] px-4 py-1.5 rounded-md text-sm font-medium transition-colors border border-[#eaddff]">
                          Tất cả {sub.name}
                        </Link>
                        <Link href={`/danh-muc/${slug}?sub=${sub.slug}&sort=new`} className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium transition-colors border border-gray-200">
                          Hàng mới về
                        </Link>
                        <Link href={`/danh-muc/${slug}?sub=${sub.slug}&sort=selling`} className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium transition-colors border border-gray-200">
                          Bán chạy nhất
                        </Link>
                      </div>
                    </div>
                    <Link href={`/danh-muc/${slug}?sub=${sub.slug}`} className="text-[#4A238B] font-bold text-sm hover:underline mt-4 md:mt-0 hidden md:block">
                      XEM THÊM <span className="uppercase">{sub.name}</span>
                    </Link>
                  </div>

                  {/* Product Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {displayProducts.slice(0, 5).map((product) => (
                      <ProductCard key={product.sku} product={product} />
                    ))}
                  </div>
                  
                  {/* Mobile View All Button */}
                  <div className="mt-6 flex justify-center md:hidden">
                    <Link href={`/danh-muc/${slug}?sub=${sub.slug}`} className="w-full text-center bg-white border border-[#4A238B] text-[#4A238B] px-6 py-2.5 rounded-md font-bold text-sm hover:bg-[#f3e8ff] transition-colors shadow-sm">
                      XEM TẤT CẢ
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER STANDARD LAYOUT: For 'tat-ca' or when subSlug is active
  // -------------------------------------------------------------
  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {HeroBanner}
      <div className="container px-4 md:px-8 max-w-7xl mx-auto mt-8 md:mt-12">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 capitalize">
              {subSlug 
                ? (mainCat?.subCategories?.find((s: any) => s.slug === subSlug)?.name || subSlug.replace(/-/g, ' ')) 
                : 'Tất cả sản phẩm'}
            </h2>
            <p className="text-muted-foreground text-sm font-medium">{products.length} sản phẩm</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-border/50 mt-8">
            <p className="text-muted-foreground text-lg">Đang cập nhật sản phẩm cho danh mục này.</p>
          </div>
        )}
      </div>
    </div>
  );
}
