import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSlider } from "@/components/hero-slider";

import { collection, getDocs, limit, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/components/product-card";
import { CategoryQuickLinks } from "@/components/home/category-quick-links";
import { FlashsaleSection } from "@/components/home/flashsale-section";
import { TrendingSection } from "@/components/home/trending-section";
import { CategoryBlock } from "@/components/home/category-block";
import { MEGA_MENU_CATEGORIES } from "@/lib/categories-data";

import { icons } from "lucide-react";

export const revalidate = 3600;

// --- COMPONENTS ---

function HeroSection({ heroBanners, highlights }: { heroBanners: string[], highlights: any[] }) {
  const hasBanners = heroBanners && heroBanners.length > 0;

  return (
    <section className={`relative overflow-hidden flex items-center py-10 md:py-16 ${
      hasBanners ? "border-b border-slate-800" : "bg-slate-50 border-b border-slate-100"
    }`}>
      {hasBanners ? (
        <HeroSlider images={heroBanners} />
      ) : (
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      )}
      
      <div className={`container mx-auto px-4 md:px-8 max-w-7xl relative z-10 flex flex-col lg:flex-row items-center gap-8 md:gap-12 ${hasBanners ? "mt-4" : ""}`}>
        <div className="flex-1 text-center lg:text-left">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm mb-8 ${
            hasBanners ? "bg-white/10 text-white backdrop-blur-md border border-white/10" : "bg-primary/5 text-primary border border-primary/10"
          }`}>
            <ShieldCheck className="w-4 h-4" />
            Đại lý cấp 1 chính thức từ Rạng Đông
          </div>
          
          <h1 className={`text-5xl md:text-7xl font-black leading-[1.1] mb-6 tracking-tighter ${
            hasBanners ? "text-white drop-shadow-md" : "text-slate-900"
          }`}>
            Năng Lực Cung Ứng <br />
            <span className={hasBanners ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400" : "text-primary"}>Thiết Bị Điện Toàn Diện</span>
          </h1>
          
          <p className={`text-base md:text-lg mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium ${
            hasBanners ? "text-slate-200" : "text-slate-600"
          }`}>
            Bảo Ngọc LED tự hào là đối tác cung cấp thiết bị chiếu sáng, nhà thông minh và vật tư điện dân dụng hàng đầu cho các công trình và đại lý trên toàn quốc.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link href="/lien-he">
              <Button size="lg" className={`w-full sm:w-auto h-14 px-8 text-base font-bold rounded-2xl transition-all duration-300 ${
                hasBanners ? "bg-white text-slate-900 hover:bg-slate-100 hover:scale-105" : "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 hover:-translate-y-1"
              }`}>
                Nhận báo giá dự án
              </Button>
            </Link>
            <Link href="/danh-muc/tat-ca">
              <Button size="lg" variant="outline" className={`w-full sm:w-auto h-14 px-8 text-base font-bold rounded-2xl transition-all duration-300 ${
                hasBanners ? "bg-black/20 border-white/20 text-white hover:bg-white/20 backdrop-blur-md" : "border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 shadow-sm"
              }`}>
                Mua sắm ngay
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full flex justify-center">
          <div className="grid grid-cols-1 gap-4 w-full max-w-md">
            {highlights.map((item) => {
              const IconComponent = (icons as any)[item.iconName] || ShieldCheck;
              return (
                <div key={item.id} className={`p-6 rounded-3xl flex items-center gap-6 transition-all duration-500 group ${
                  hasBanners 
                    ? "bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:-translate-y-1" 
                    : "bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1"
                }`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 ${
                    hasBanners ? "bg-white/10" : "bg-slate-50"
                  }`}>
                    <div className={hasBanners ? "text-white" : "text-slate-900"}>
                      <IconComponent className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg mb-1 tracking-tight ${hasBanners ? "text-white" : "text-slate-900"}`}>{item.title}</h4>
                    <p className={`text-sm font-medium ${hasBanners ? "text-slate-300" : "text-slate-500"}`}>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- MAIN PAGE COMPONENT ---

export default async function Home() {
  let heroBanners: string[] = [];
  let homepageRowsConfig: { id: string; title: string; categorySlug: string }[] = [];
  let quickLinksConfig: any[] = [];
  let flashsaleConfig: any = { isActive: true, title: "DEAL ĐỘC QUYỀN TỪ", subtitle: "Rạng Đông" };
  let highlightsConfig: any[] = [
    { id: "quality", title: "Chính hãng 100%", description: "Đầy đủ chứng nhận chất lượng", iconName: "ShieldCheck" },
    { id: "delivery", title: "Giao hàng tốc độ", description: "Miễn phí vận chuyển nội thành", iconName: "Truck" },
    { id: "support", title: "Hỗ trợ 24/7", description: "Tư vấn kỹ thuật chuyên sâu", iconName: "Headphones" },
  ];
  let categoriesConfig: any[] = [];
  let flashsaleProducts: any[] = [];
  let trendingProducts: any[] = [];
  
  try {
    const [rowsSnap, catsSnap] = await Promise.all([
      getDoc(doc(db, "settings", "homepage_rows")),
      getDoc(doc(db, "settings", "categories"))
    ]);

    if (rowsSnap.exists() && rowsSnap.data().heroBanners) {
      heroBanners = rowsSnap.data().heroBanners;
    }
    if (rowsSnap.exists() && rowsSnap.data().highlights) {
      highlightsConfig = rowsSnap.data().highlights;
    }
    if (rowsSnap.exists() && rowsSnap.data().rows) {
      homepageRowsConfig = rowsSnap.data().rows;
    } else {
      // Fallback
      homepageRowsConfig = [
        { id: "1", title: "Đèn LED Chiếu Sáng", categorySlug: "den-led" },
        { id: "2", title: "Nhà Thông Minh", categorySlug: "nha-thong-minh" },
      ];
    }
    
    if (rowsSnap.exists() && rowsSnap.data().quickLinks) {
      quickLinksConfig = rowsSnap.data().quickLinks;
    } else {
      quickLinksConfig = [
        { id: "1", title: "Sản phẩm mới", href: "/tim-kiem?sort=newest", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/6e/b5/1d/18e38eaed7fb8c9f5926715b7468132e.png", isNew: true },
        { id: "2", title: "Đèn LED", href: "/danh-muc/san-pham-chieu-sang", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/4c/bb/56/674d812bd1bd5bdfb60fcd82fdf63d50.jpg" },
        { id: "3", title: "Nhà thông minh Rallismart", href: "/danh-muc/thiet-bi-thong-minh", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/e5/26/66/1d13db9b581d4a04fc9a918a599b4d00.png" },
        { id: "4", title: "Bình- Phích nước", href: "/danh-muc/phich-nuoc", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/f3/d3/42/411eb345d14df9042bbf062dc7ed8eb7.png" },
        { id: "5", title: "Siêu khuyến mãi", href: "/khuyen-mai", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/1c/a7/9c/04b50e50efb0e352efdfafba760317e0.png", isSale: true },
        { id: "6", title: "Đèn bàn", href: "/danh-muc/den-ban", image: "https://vcdn.tikicdn.com/cache/w1200/ts/product/a6/50/66/f28782a2b72cfdb8421b1a50c8e03e5c.png" }
      ];
    }
    
    if (rowsSnap.exists() && rowsSnap.data().flashsale) {
      flashsaleConfig = rowsSnap.data().flashsale;
    }

    if (catsSnap.exists() && catsSnap.data().items) {
      categoriesConfig = catsSnap.data().items;
    }

    // Fetch trending products (isBestSeller)
    const qTrending = query(collection(db, "products"), where("isBestSeller", "==", true), limit(5));
    const trendingSnap = await getDocs(qTrending);
    trendingProducts = trendingSnap.docs.map(d => {
      const data = d.data() as Product;
      return { 
        ...data, 
        id: d.id, 
        discount: 15, // Mock UI
        tag: "Bán chạy", // Mock UI
        originalPrice: data.price ? Math.floor(data.price * 1.15) : undefined 
      }; 
    });

    // Fetch flashsale products
    if (flashsaleConfig.isActive) {
      let qFlashsale;
      if (flashsaleConfig.productSkus && flashsaleConfig.productSkus.trim()) {
        const skusArray = flashsaleConfig.productSkus.split(',').map((s: string) => s.trim()).filter((s: string) => s);
        if (skusArray.length > 0) {
          // Note: using 'sku' or '__name__' depending on how the ID is stored. The document ID is usually __name__
          qFlashsale = query(collection(db, "products"), where("__name__", "in", skusArray.slice(0, 10)));
        } else {
          qFlashsale = query(collection(db, "products"), limit(4));
        }
      } else {
        qFlashsale = query(collection(db, "products"), limit(4));
      }

      const flashsaleSnap = await getDocs(qFlashsale);
      flashsaleProducts = flashsaleSnap.docs.map((d, index) => {
         const data = d.data() as Product;
         return { 
           ...data, 
           id: d.id, 
           badgeText: index % 2 === 0 ? "RẺ QUÁ TRỜI!" : "DEAL ĐỘC QUYỀN", 
           originalPrice: data.price ? Math.floor(data.price * 1.3) : undefined, 
           sold: 5, 
           total: 10 
         };
      });
    }

  } catch (error) {
    console.error("Error fetching homepage data:", error);
  }

  // Fetch products for dynamic categories concurrently
  const dynamicCategoryBlocks = await Promise.all(
    homepageRowsConfig.map(async (row, index) => {
       const q = query(collection(db, "products"), where("category", "==", row.categorySlug), limit(6));
       const snap = await getDocs(q);
       let products = snap.docs.map(d => {
          const data = d.data() as Product;
          return { 
            ...data, 
            id: d.id, 
            discount: 10, 
            originalPrice: data.price ? Math.floor(data.price * 1.1) : undefined 
          };
       });

       // Fallback to mock products if database is empty for this category
       if (products.length === 0) {
         products = [
           { sku: `mock-${row.id}-1`, name: `Sản phẩm mẫu 1 - ${row.title}`, price: 150000, originalPrice: 200000, discount: 25, stock: 10, images: ["https://vcdn.tikicdn.com/cache/w1200/ts/product/f3/d3/42/411eb345d14df9042bbf062dc7ed8eb7.png"], category: row.categorySlug, specs: {} },
           { sku: `mock-${row.id}-2`, name: `Sản phẩm mẫu 2 - ${row.title}`, price: 250000, originalPrice: 300000, discount: 15, stock: 10, images: ["https://vcdn.tikicdn.com/cache/w1200/ts/product/4c/bb/56/674d812bd1bd5bdfb60fcd82fdf63d50.jpg"], category: row.categorySlug, specs: {} },
           { sku: `mock-${row.id}-3`, name: `Sản phẩm mẫu 3 - ${row.title}`, price: 350000, originalPrice: 400000, discount: 12, stock: 10, images: ["https://vcdn.tikicdn.com/cache/w1200/ts/product/1c/a7/9c/04b50e50efb0e352efdfafba760317e0.png"], category: row.categorySlug, specs: {} },
           { sku: `mock-${row.id}-4`, name: `Sản phẩm mẫu 4 - ${row.title}`, price: 450000, originalPrice: 500000, discount: 10, stock: 10, images: ["https://vcdn.tikicdn.com/cache/w1200/ts/product/a6/50/66/f28782a2b72cfdb8421b1a50c8e03e5c.png"], category: row.categorySlug, specs: {} },
           { sku: `mock-${row.id}-5`, name: `Sản phẩm mẫu 5 - ${row.title}`, price: 550000, originalPrice: 600000, discount: 8, stock: 10, images: ["https://vcdn.tikicdn.com/cache/w1200/ts/product/e5/26/66/1d13db9b581d4a04fc9a918a599b4d00.png"], category: row.categorySlug, specs: {} },
           { sku: `mock-${row.id}-6`, name: `Sản phẩm mẫu 6 - ${row.title}`, price: 650000, originalPrice: 700000, discount: 7, stock: 10, images: ["https://vcdn.tikicdn.com/cache/w1200/ts/product/6e/b5/1d/18e38eaed7fb8c9f5926715b7468132e.png"], category: row.categorySlug, specs: {} },
         ];
       }

       let matchingCat = MEGA_MENU_CATEGORIES.find(c => c.slug === row.categorySlug);
       if (!matchingCat) {
         matchingCat = categoriesConfig.find(c => c.slug === row.categorySlug);
       }
       let subcategories = matchingCat?.subCategories?.map((s: any) => ({ name: s.name, href: `/danh-muc/${s.slug}` })) || [];
       
       // Fallback mock subcategories if empty
       if (subcategories.length === 0) {
         subcategories = [
           { name: "Danh mục con 1", href: "#" },
           { name: "Danh mục con 2", href: "#" },
           { name: "Danh mục con 3", href: "#" },
         ];
       }

       const isOdd = index % 2 !== 0;
       const bannerNode = (
         <div className={`absolute inset-0 overflow-hidden flex flex-col justify-between ${isOdd ? 'bg-gradient-to-b from-[#D1C4E9] to-[#5E35B1]' : 'bg-[#5E35B1]'}`}>
           {!isOdd && (
            <div className="absolute top-0 right-0 opacity-20 pointer-events-none">
                <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFFFFF" d="M45.7,-76.1C58.9,-69.3,69.2,-55.4,78.2,-41.2C87.1,-27,94.7,-12.5,95.1,2.2C95.5,16.9,88.7,31.8,78.9,44.5C69.1,57.2,56.3,67.7,42.1,75.3C27.9,82.8,12.3,87.4,-2.8,91.2C-17.9,94.9,-32.5,97.7,-46.2,93.4C-59.8,89.1,-72.5,77.7,-81.4,63.9C-90.3,50,-95.4,33.7,-96.5,17.2C-97.6,0.7,-94.7,-16,-87.3,-30.2C-79.9,-44.4,-68,-56.1,-54.2,-62.4C-40.4,-68.7,-24.8,-69.6,-8.8,-55.1C7.2,-40.6,24.4,-10.7,32.5,-82.9Z" transform="translate(100 100)" />
                </svg>
             </div>
           )}
           <div className={`p-6 relative z-10 ${isOdd ? 'bg-[#5E35B1] text-center' : ''}`}>
             {isOdd ? (
               <>
                 <div className="text-white font-bold text-xl leading-tight mb-3 uppercase">TRẢI NGHIỆM ĐẲNG CẤP</div>
                 <button className="bg-[#ff0000] text-white font-bold py-2 px-6 rounded-full text-sm">Khám phá ngay</button>
               </>
             ) : (
               <div className="text-white font-black text-3xl leading-tight uppercase">{row.title}</div>
             )}
           </div>
         </div>
       );

       return {
         id: row.id,
         title: row.title,
         href: `/danh-muc/${row.categorySlug}`,
         subcategories,
         bannerNode,
         products
       };
    })
  );

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <HeroSection heroBanners={heroBanners} highlights={highlightsConfig} />
      <CategoryQuickLinks links={quickLinksConfig} />
      
      {/* KHỐI SẢN PHẨM BÁN CHẠY (TRENDING) */}

      {/* 3. Flashsale */}
      <FlashsaleSection products={flashsaleProducts} config={flashsaleConfig} />

      {/* 4. Trending Section */}
      <TrendingSection products={trendingProducts} />

      {/* 5. Dynamic Category Blocks */}
      <div className="pb-16 bg-[#f4f5f7]">
        {dynamicCategoryBlocks.map((block, index) => (
          <CategoryBlock key={block.id} {...block} isOdd={index % 2 !== 0} />
        ))}
      </div>
    </div>
  );
}
