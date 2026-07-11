import axios from 'axios';
import * as cheerio from 'cheerio';

async function testSingleProduct() {
  const url = 'https://rangdongstore.vn/den-led-downlight-am-tran-90-7w-at10-p-241007000216/';
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // check if it returns a cloudflare challenge page
    if (data.includes("cf-challenge") || data.includes("Cloudflare")) {
       console.log("Blocked by Cloudflare");
    } else {
       console.log("Success! Extracted bytes:", data.length);
       const $ = cheerio.load(data);
       console.log("Title:", $('h1').text().trim() || $('title').text().trim());
       // nuxt data?
       const nuxtDataStr = $('script').filter((i, el) => $(el).text().includes('window.__NUXT__')).text();
       console.log("Nuxt Data exists?", nuxtDataStr ? "YES" : "NO");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}
testSingleProduct();
