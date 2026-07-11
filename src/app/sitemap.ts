import { MetadataRoute } from 'next'
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { MEGA_MENU_CATEGORIES as LOCAL_CATEGORIES } from "@/lib/categories-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://baongocled.vn';

  // Static routes
  const routes = [
    '',
    '/ve-chung-toi',
    '/lien-he',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Dynamic Categories
    let categories: any[] = [];
    try {
      const catRef = doc(db, 'settings', 'categories');
      const catSnap = await getDoc(catRef);
      categories = catSnap.exists() && catSnap.data().items && catSnap.data().items.length > 0 ? catSnap.data().items : LOCAL_CATEGORIES;
    } catch(e) {
      categories = LOCAL_CATEGORIES;
    }

    const categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/danh-muc/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    // Dynamic Products
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'), limit(1000));
    const querySnapshot = await getDocs(q);

    const productRoutes = querySnapshot.docs.map((doc) => {
      const p = doc.data();
      return {
        url: `${baseUrl}/san-pham/${p.sku}`,
        lastModified: new Date(p.createdAt || Date.now()),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      };
    });

    return [...routes, ...categoryRoutes, ...productRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return routes;
  }
}
