import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp URL Rạng Đông" },
        { status: 400 }
      );
    }

    if (!url.includes("rangdong.com.vn")) {
      return NextResponse.json(
        { error: "URL phải thuộc domain rangdong.com.vn" },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Bóc tách Dữ liệu cơ bản
    const name = $('h1').first().text().trim() || $('meta[property="og:title"]').attr("content") || "";
    
    // Tìm giá bán
    let priceText = $(".pd-info__price strong").first().text().trim() || 
                    $(".price").first().text().trim() || 
                    $(".product-price").first().text().trim() || 
                    $("span:contains('đ')").first().text().trim() ||
                    $("*:contains('VNĐ')").last().text().trim();
    
    // Chỉ lấy số từ chuỗi giá
    let price = 0;
    if (priceText) {
      const numberStr = priceText.replace(/[^0-9]/g, "");
      if (numberStr) {
        price = parseInt(numberStr, 10);
      }
    }

    // Lấy Ảnh (lấy nhiều ảnh nếu có)
    const images: string[] = [];
    
    const mainImage = $('meta[property="og:image"]').attr("content");
    if (mainImage) images.push(mainImage.startsWith("http") ? mainImage : `https://rangdong.com.vn${mainImage}`);

    $(".product-gallery img, .thumbnail img, .product-image img, .slider-nav img, .pd-image img, .pd-gallery img, .swiper-slide img").each((i, el) => {
      const src = $(el).attr("src") || $(el).attr("data-src");
      if (src) {
        const fullSrc = src.startsWith("http") ? src : `https://rangdong.com.vn${src}`;
        if (!images.includes(fullSrc) && !fullSrc.includes('base64')) images.push(fullSrc);
      }
    });

    // Bóc tách Thông số kỹ thuật
    const specs: Record<string, string> = {};
    let allSpecsText = ""; // Để dành cho phần mô tả nếu không khớp field
    
    $("#pd-tab-2 table tr, .table-spec tr, table tr").each((i, el) => {
      const cells = $(el).find("td, th");
      if (cells.length >= 2) {
        const key = $(cells[0]).text().trim().toLowerCase();
        const val = $(cells[1]).text().trim();
        
        if (key && val) {
          allSpecsText += `- **${key}:** ${val}\n`;
          if (key.includes("công suất")) specs.wattage = val;
          if (key.includes("nhiệt độ màu") || key.includes("màu ánh sáng")) specs.color_temperature = val;
          if (key.includes("lỗ khoét")) specs.hole_size = val;
          if (key.includes("quang thông")) specs.luminous_flux = val;
          if (key.includes("tuổi thọ")) specs.lifespan = val;
          if (key.includes("điện áp") && !key.includes("dải")) specs.voltage = val;
          if (key.includes("dải điện áp")) specs.voltage_range = val;
          if (key.includes("hiệu suất")) specs.luminous_efficacy = val;
          if (key.includes("hoàn màu") || key.includes("cri")) specs.cri = val;
        }
      }
    });

    // Lấy mô tả tổng quan
    let description = $("#pd-tab-1").text().trim().substring(0, 500) || "";
    if (allSpecsText) {
      description += "\n\n### Thông số kỹ thuật chi tiết:\n" + allSpecsText;
    }

    // Lấy mã sản phẩm (SKU)
    let sku = "";
    // Tìm mã trong title (Ví dụ: CT2C, AT58,...)
    const skuMatch = name.match(/([a-zA-Z0-9-]+\/[a-zA-Z0-9W]+|[A-Z0-9]{4,})/);
    if (skuMatch) {
      sku = skuMatch[1].replace(/\//g, "-").toUpperCase();
    } else {
      sku = "SP-" + Math.floor(Math.random() * 10000);
    }

    return NextResponse.json({
      success: true,
      data: {
        sku: sku || `sp-${Date.now()}`,
        name: name || "Không tìm thấy tên sản phẩm",
        price: price || 0,
        images: images,
        specs: specs,
        description: description,
        category: "san-pham-chieu-sang", // Mặc định
        originalUrl: url
      },
    });

  } catch (error: any) {
    console.error("Scraper Error:", error);
    return NextResponse.json(
      { error: `Lỗi cào dữ liệu: ${error.message}` },
      { status: 500 }
    );
  }
}
