import axios from 'axios';
import * as cheerio from 'cheerio';

async function testScrape() {
  const url = 'https://rangdong.com.vn/category/den-led-am-tran';
  try {
    console.log(`Fetching ${url}...`);
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    // Find product links. We need to inspect the HTML structure.
    // Usually it's an anchor tag wrapping the product or inside a product card.
    const products: { name: string; href: string }[] = [];
    
    $('.product-item, .item-product, .product, .box-product').each((i, el) => {
       const a = $(el).find('a').first();
       const href = a.attr('href');
       const name = $(el).find('h3, h2, .name, .title').text().trim();
       if (href) {
         products.push({ name, href });
       }
    });

    // If generic classes fail, just look for any links containing /product/ or similar
    if (products.length === 0) {
      $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('/category/')) return;
        if (href && (href.includes('.html') || href.includes('/product/'))) {
           const name = $(el).text().trim();
           if (name && !products.find(p => p.href === href)) {
             products.push({ name, href });
           }
        }
      });
    }

    console.log(`Found ${products.length} products:`);
    console.log(products.slice(0, 5));
    
  } catch (error) {
    console.error(error);
  }
}

testScrape();
