import { NextResponse } from "next/server";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Handle CORS for bookmarklet from other domains
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { url, name, price, originalPrice, images, specs, categorySlug, subCategorySlug } = data;

    if (!name) {
      return NextResponse.json({ error: "Missing product name" }, { 
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    const skuStr = `RD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*100)}`;
    const parsedPrice = typeof price === 'number' ? price : parseInt(String(price).replace(/[^0-9]/g, '')) || 0;
    
    // Fallback if price = 0
    let finalPrice = parsedPrice > 0 ? parsedPrice : 150000;
    let finalOrigPrice = originalPrice || Math.floor(finalPrice * 1.2);

    const productData = {
      sku: skuStr,
      name,
      price: finalPrice,
      originalPrice: finalOrigPrice,
      stock: 100,
      images: images || [],
      category: categorySlug || "chua-phan-loai", // Default if not selected
      subCategory: subCategorySlug || "",
      specs: {
        wattage: specs?.['Công suất'] || specs?.wattage || "",
        voltage: specs?.['Điện áp'] || specs?.voltage || "220V/50Hz",
        color_temperature: specs?.['Nhiệt độ màu'] || specs?.color_temperature || "",
        luminous_flux: specs?.['Quang thông'] || specs?.luminous_flux || "",
        lifespan: specs?.['Tuổi thọ'] || specs?.lifespan || "20000 giờ",
        hole_size: specs?.['Kích thước lỗ khoét'] || specs?.['Kích thước'] || specs?.hole_size || "",
        warranty: "2 năm"
      },
      features: ["Sản phẩm chính hãng Rạng Đông", "Tiết kiệm điện năng", "Thiết kế hiện đại"],
      description: `<p>Sản phẩm chính hãng Rạng Đông được copy tự động. <strong>${name}</strong>.</p><p><a href="${url}">Nguồn: Rạng Đông Store</a></p>`,
      application: {
        description: "Phù hợp cho không gian nội thất gia đình, chung cư, văn phòng.",
        image: ""
      },
      isBestSeller: false,
      createdAt: Date.now()
    };

    // Save to Firebase
    await setDoc(doc(collection(db, "products")), productData);

    return NextResponse.json({ success: true, sku: skuStr }, {
      headers: { "Access-Control-Allow-Origin": "*" }
    });

  } catch (error: any) {
    console.error("Bookmarklet Scraper Error:", error);
    return NextResponse.json({ error: error.message }, { 
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }
}
