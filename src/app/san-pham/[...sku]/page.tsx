import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProductDetailClient } from "./product-detail-client";
import { Metadata } from "next";

export const revalidate = 3600; // Cache for 1 hour


export async function generateMetadata({ params }: { params: Promise<{ sku: string[] }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const skuString = resolvedParams.sku.join('/');
  const decodedSku = decodeURIComponent(skuString);
  const q = query(collection(db, "products"), where("sku", "==", decodedSku), limit(1));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return { title: "Sản phẩm không tồn tại" };
  }

  const product = querySnapshot.docs[0].data();
  const imageUrl = product.images?.[0] || "https://baongocled.vn/logo.png";

  return {
    title: `${product.name} | Bảo Ngọc LED`,
    description: product.application?.description?.substring(0, 160) || `Mua ${product.name} chính hãng Rạng Đông giá tốt tại Bảo Ngọc LED.`,
    openGraph: {
      title: product.name,
      description: `Mua ${product.name} chính hãng Rạng Đông giá tốt tại Bảo Ngọc LED.`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}
export default async function ProductDetailPage({ params }: { params: Promise<{ sku: string[] }> }) {
  let product: any = null;

  try {
    const resolvedParams = await params;
    const skuString = resolvedParams.sku.join('/');
    const decodedSku = decodeURIComponent(skuString);
    const q = query(collection(db, "products"), where("sku", "==", decodedSku), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      product = querySnapshot.docs[0].data();
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }

  if (!product) {
    return <div className="p-20 text-center text-2xl font-bold">Sản phẩm không tồn tại</div>;
  }

  return <ProductDetailClient product={product} />;
}
