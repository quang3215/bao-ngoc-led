const https = require('https');

https.get('https://rangdongstore.vn/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // try to match any json object that contains products
    const match = data.match(/window\.__NUXT__=(.*?);<\/script>/);
    if (match) {
      console.log("Found Nuxt state");
    } else {
      console.log("No Nuxt state");
      // Just extract any image URLs for rangdongstore
      const imgRegex = /https:\/\/static\.rangdongstore\.vn\/[^"'\s>]+?\.(png|jpg|webp)/gi;
      const images = data.match(imgRegex);
      if (images) {
        console.log("Images found:", Array.from(new Set(images)).slice(0, 10));
      } else {
        console.log("No images found");
      }
    }
  });
});
