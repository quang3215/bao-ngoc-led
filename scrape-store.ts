import axios from 'axios';

async function testAllOrigins() {
  const url = 'https://rangdongstore.vn/den-led-downlight-am-tran-90-7w-at10-p-241007000216/';
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  try {
    const { data } = await axios.get(proxyUrl);
    console.log("Status:", data.status);
    console.log("Contents length:", data.contents.length);
    if(data.contents.includes('window.__NUXT__')) {
       console.log("Nuxt found! Bypass successful!");
    } else {
       console.log("No Nuxt. Maybe blocked?", data.contents.substring(0, 500));
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}
testAllOrigins();
