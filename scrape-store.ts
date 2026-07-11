import axios from 'axios';
import * as cheerio from 'cheerio';

async function testStoreScrape() {
  const url = 'https://rangdongstore.vn/den-led-downlight-am-tran-goc-rong-c-2202080083/';
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const nuxtDataStr = $('script').filter((i, el) => {
      return $(el).text().includes('window.__NUXT__');
    }).text();
    
    // Use regex to find product slugs or paths
    // Usually Nuxt payloads have something like: url:"/name-p-12345"
    const matches = nuxtDataStr.match(/-p-[0-9]+/g);
    console.log("Found -p- occurrences:", matches ? matches.length : 0);
    
    if (matches && matches.length > 0) {
      // let's try to extract full paths
      const paths = nuxtDataStr.match(/"\/([a-zA-Z0-9-]+-p-[0-9]+)\/"/g);
      console.log("Found paths:", paths?.slice(0, 5));
    }
    
  } catch (error) {
    console.error(error);
  }
}
testStoreScrape();
