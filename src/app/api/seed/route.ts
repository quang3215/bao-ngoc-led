import { NextResponse } from "next/server";
import { collection, addDoc, getDocs, query, where, deleteDoc, setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MEGA_MENU_CATEGORIES } from "@/lib/categories-data";

const MOCK_PRODUCTS = [
  {
    name: "Đèn LED Bulb Rạng Đông 9W A60",
    price: 45000,
    category: "san-pham-chieu-sang",
    images: ["https://vcdn-tiki.b-cdn.net/cache/w1200/ts/product/7d/50/cd/b90901e19d7a224eb798cf024da8cf32.jpg"],
    specs: { "Công suất": "9W", "Quang thông": "900 lm", "Tuổi thọ": "20000 giờ" },
    isBestSeller: true,
    isSeed: true
  },
  {
    name: "Đèn tuýp LED bán nguyệt 1.2m 36W Rạng Đông",
    price: 185000,
    category: "san-pham-chieu-sang",
    images: ["https://vcdn-tiki.b-cdn.net/cache/w1200/ts/product/0f/f2/61/80fb48c4cf273b406e23ddbba38fc890.jpg"],
    specs: { "Công suất": "36W", "Nhiệt độ màu": "6500K", "Kích thước": "1200mm" },
    isBestSeller: false,
    isSeed: true
  },
  {
    name: "Đèn Bàn Học Cảm Ứng Chống Cận Rạng Đông",
    price: 320000,
    category: "den-ban",
    images: ["https://vcdn-tiki.b-cdn.net/cache/w1200/ts/product/3e/2a/39/19ddce7c2d1597d8c0dc118b6fc8e658.png"],
    specs: { "Ánh sáng": "Vàng/Trắng", "Tính năng": "Chống cận", "Điều khiển": "Cảm ứng 3 mức" },
    isBestSeller: true,
    isSeed: true
  },
  {
    name: "Phích nước Rạng Đông 2 Lít Giữ Nhiệt Tốt",
    price: 155000,
    category: "phich-nuoc",
    images: ["https://vcdn-tiki.b-cdn.net/cache/w1200/ts/product/73/06/f3/d513511eb9cff41ab7f9b8089cf61817.jpg"],
    specs: { "Dung tích": "2 Lít", "Chất liệu": "Ruột phích thủy tinh", "Giữ nhiệt": "24 giờ" },
    isBestSeller: true,
    isSeed: true
  },
  {
    name: "Công Tắc Cảm Ứng RalliSmart",
    price: 550000,
    category: "thiet-bi-thong-minh",
    images: ["https://vcdn-tiki.b-cdn.net/cache/w1200/ts/product/3a/0b/4d/e892e624c9c22ed0d9a6c76081fb5f9d.jpg"],
    specs: { "Kết nối": "Wi-Fi", "Mặt kính": "Cường lực", "Bảo hành": "24 Tháng" },
    isBestSeller: false,
    isSeed: true
  },
  {
    name: "Ổ cắm điện đa năng Rạng Đông 4 lỗ",
    price: 125000,
    category: "thiet-bi-dien",
    images: ["https://vcdn-tiki.b-cdn.net/cache/w1200/ts/product/d0/55/e1/e0fb90278e38d7210e14bb10b78d227b.jpg"],
    specs: { "Số lỗ cắm": "4", "Cổng USB": "2", "Chiều dài dây": "3m" },
    isBestSeller: true,
    isSeed: true
  },
  {
    name: "Đèn LED Pha Năng Lượng Mặt Trời 100W",
    price: 1450000,
    category: "nang-luong-mat-troi",
    images: ["https://vcdn-tiki.b-cdn.net/cache/w1200/ts/product/1c/a7/9c/04b50e50efb0e352efdfafba760317e0.png"],
    specs: { "Công suất": "100W", "Tấm Pin": "Poly 6V/20W", "Thời gian sáng": "12 giờ" },
    isBestSeller: true,
    isSeed: true
  }
];

export async function GET() {
  try {
    const productsRef = collection(db, "products");
    
    // Seed products
    for (const product of MOCK_PRODUCTS) {
      await addDoc(productsRef, {
        ...product,
        createdAt: new Date().toISOString(),
        isSeed: true // Ensure all seeded products have this flag
      });
    }

    // Force update the categories in the database so the frontend menu uses the latest 8 items
    const catRef = doc(db, "settings", "categories");
    await setDoc(catRef, { items: MEGA_MENU_CATEGORIES });

    return NextResponse.json({ success: true, message: `Seeded ${MOCK_PRODUCTS.length} products successfully. Visit /api/seed with DELETE method (or contact me) to remove them.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("isSeed", "==", true));
    const snap = await getDocs(q);
    
    let count = 0;
    for (const docSnap of snap.docs) {
      await deleteDoc(docSnap.ref);
      count++;
    }

    return NextResponse.json({ success: true, message: `Deleted ${count} mock products successfully.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
