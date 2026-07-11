import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request: Request) {
  try {
    const { url, categorySlug, subCategorySlug } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // 1. Fetch category page
    console.log(`Scraping category URL: ${url}`);
    const { data: catData } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $cat = cheerio.load(catData);
    const productLinks: string[] = [];

    // Find links in rangdong.com.vn layout
    $cat('.product-item, .item-product, .product, .box-product').each((i, el) => {
      const href = $cat(el).find('a').first().attr('href');
      if (href && !productLinks.includes(href)) {
        productLinks.push(href);
      }
    });

    if (productLinks.length === 0) {
      $cat('a').each((i, el) => {
        const href = $cat(el).attr('href');
        if (href && (href.includes('/product/') || href.includes('-p-') || href.includes('.html')) && !productLinks.includes(href)) {
          // exclude category links which have -c-
          if (!href.includes('-c-')) {
            productLinks.push(href);
          }
        }
      });
    }

    if (productLinks.length === 0) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm nào trong đường dẫn này. Vui lòng kiểm tra lại link." }, { status: 400 });
    }

    // Limit to 10 products per run to avoid Vercel timeout (10s limit on free tier)
    const linksToScrape = productLinks.slice(0, 10);
    console.log(`Found ${productLinks.length} products. Scraping first ${linksToScrape.length}...`);

    let scrapedCount = 0;

    const baseUrl = new URL(url).origin;

    for (const link of linksToScrape) {
      try {
        const fullLink = link.startsWith('http') ? link : `${baseUrl}${link}`;
        const { data: prodData } = await axios.get(fullLink, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
          }
        });
        
        const $prod = cheerio.load(prodData);
        
        // Parse Title
        let name = $prod('h1').first().text().trim();
        if (!name) name = $prod('.product-title, .name').first().text().trim();
        
        // Parse Image
        let image = $prod('.img-product img, .product-image img, .slider-for img').first().attr('src');
        if (!image) {
           image = $prod('meta[property="og:image"]').attr('content');
        }
        if (image && !image.startsWith('http')) {
          image = `${baseUrl}${image}`;
        }

        // Parse Price
        let priceText = $prod('.price, .product-price, .current-price').first().text().trim();
        let price = parseInt(priceText.replace(/[^0-9]/g, ''));
        if (isNaN(price) || price === 0) {
          price = 150000; // fallback mock price
        }

        // Parse Specs
        const specs: Record<string, string> = {};
        $prod('.table-technical tr, .spec-table tr, .technical-table tr, tbody tr').each((i, el) => {
          const key = $prod(el).find('td').eq(0).text().trim();
          const val = $prod(el).find('td').eq(1).text().trim();
          if (key && val) {
            if (key.toLowerCase().includes('công suất')) specs.wattage = val;
            if (key.toLowerCase().includes('điện áp')) specs.voltage = val;
            if (key.toLowerCase().includes('nhiệt độ màu')) specs.color_temperature = val;
            if (key.toLowerCase().includes('quang thông')) specs.luminous_flux = val;
            if (key.toLowerCase().includes('tuổi thọ')) specs.lifespan = val;
            if (key.toLowerCase().includes('kích thước')) specs.hole_size = val;
          }
        });

        // Parse Features
        const features: string[] = [];
        $prod('.product-feature li, .feature-list li, .description ul li').each((i, el) => {
          const text = $prod(el).text().trim();
          if (text) features.push(text);
        });

        // Generate SKU
        const skuStr = `RD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*100)}`;

        if (name && image) {
          const productData = {
            sku: skuStr,
            name,
            price,
            originalPrice: price > 0 ? Math.floor(price * 1.2) : 200000,
            stock: 100,
            images: [image],
            category: categorySlug,
            subCategory: subCategorySlug || "",
            specs: {
              wattage: specs.wattage || "",
              voltage: specs.voltage || "220V/50Hz",
              color_temperature: specs.color_temperature || "",
              luminous_flux: specs.luminous_flux || "",
              lifespan: specs.lifespan || "20000 giờ",
              hole_size: specs.hole_size || "",
              warranty: "2 năm"
            },
            features: features.length > 0 ? features : ["Thiết kế hiện đại", "Tiết kiệm điện", "Tuổi thọ cao"],
            description: `<p>Sản phẩm chính hãng Rạng Đông. ${name}</p>`,
            application: {
              description: "Phù hợp cho không gian nội thất gia đình, chung cư, văn phòng.",
              image: ""
            },
            isBestSeller: false,
            createdAt: Date.now()
          };

          // Save to Firebase
          await setDoc(doc(collection(db, "products")), productData);
          scrapedCount++;
        }

      } catch (err) {
        console.error(`Error scraping product ${link}:`, err);
      }
    }

    return NextResponse.json({ scrapedCount });
  } catch (error: any) {
    console.error("Scraper Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
