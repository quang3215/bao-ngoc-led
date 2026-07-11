function test() {
  const origin = "http://localhost:3000";
  const targetCategory = "du-an";
  const targetSubCategory = "";

  const jsCode = `javascript:(function(){
      if(window.location.hostname !== 'rangdongstore.vn' && window.location.hostname !== 'rangdong.com.vn') {
        alert("Công cụ này chỉ dùng được trên trang rangdongstore.vn hoặc rangdong.com.vn!");
        return;
      }
      
      let name = document.querySelector('h1') ? document.querySelector('h1').innerText.trim() : document.title;
      if (!name || name === '') {
         const nameEl = document.querySelector('.product-title') || document.querySelector('.name');
         if(nameEl) name = nameEl.innerText.trim();
      }

      let price = 0;
      const priceEl = document.querySelector('.current-price') || document.querySelector('.price') || document.querySelector('[itemprop="price"]');
      if(priceEl) price = parseInt(priceEl.innerText.replace(/[^0-9]/g, '')) || 0;
      
      let image = document.querySelector('meta[property="og:image"]')?.content;
      if(!image) {
        const imgEl = document.querySelector('.slider-for img') || document.querySelector('.img-product img');
        if(imgEl) image = imgEl.src;
      }
      
      const specs = {};
      document.querySelectorAll('tr').forEach(tr => {
        const tds = tr.querySelectorAll('td');
        if(tds.length >= 2) {
          specs[tds[0].innerText.trim()] = tds[1].innerText.trim();
        }
      });

      alert("Đang cào dữ liệu: " + name + "... Vui lòng chờ!");

      fetch('${origin}/api/scrape/bookmarklet', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: window.location.href,
          name: name,
          price: price,
          images: image ? [image] : [],
          specs: specs,
          categorySlug: '${targetCategory}',
          subCategorySlug: '${targetSubCategory}'
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.error) alert("Bảo Ngọc Scraper Lỗi: " + data.error);
        else alert("🎉 Đã lưu thành công sản phẩm: " + name + " vào kho hàng!");
      })
      .catch(e => {
        console.error(e);
        alert("Bảo Ngọc Scraper Lỗi kết nối: Không thể gửi dữ liệu. Server Bảo Ngọc LED có thể đang bận hoặc URL bị chặn CORS.");
      });
    })();`;

  const minified = jsCode.replace(/\s+/g, ' ').replace(/> </g, '><');
  console.log(minified);
}
test();
