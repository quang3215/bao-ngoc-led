import fs from 'fs';
import csv from 'csv-parser';
import * as cheerio from 'cheerio';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Setup Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const results = [];

fs.createReadStream('wp-products.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    console.log(`Parsed ${results.length} rows.`);
    let successCount = 0;
    
    // Check if we are doing dry-run or full migration
    const isDryRun = process.argv.includes('--dry-run');
    const limit = isDryRun ? 3 : results.length;

    console.log(`Starting ${isDryRun ? 'DRY RUN' : 'FULL MIGRATION'} for ${limit} products...`);

    for (let i = 0; i < limit; i++) {
        const row = results[i];
        
        // Skip empty rows
        if (!row['Tên']) continue;

        const sku = row['Mã sản phẩm'] || '';
        const name = row['Tên'] || '';
        const price = Number(row['Giá khuyến mãi'] || row['Giá bán thường'] || 0);
        const stock = Number(row['Kho'] || 100);
        
        let category = '';
        let subCategory = '';
        const rawCats = row['Danh mục'] || '';
        if (rawCats) {
            const firstCat = rawCats.split(',')[0].trim();
            const parts = firstCat.split('>');
            if (parts.length > 0) category = parts[0].trim();
            if (parts.length > 1) subCategory = parts[1].trim();
        }

        let images = [];
        const rawImages = row['Hình ảnh'] || '';
        if (rawImages) {
            images = rawImages.split(',').map(s => s.trim()).filter(Boolean);
        }

        const description = row['Mô tả'] || '';
        
        const shortDesc = row['Mô tả ngắn'] || '';
        const specs = {
            wattage: "", voltage: "", voltage_range: "", color_temperature: "", 
            luminous_flux: "", luminous_efficacy: "", cri: "", lifespan: "", hole_size: "", warranty: ""
        };

        if (shortDesc.includes('<table')) {
            const $ = cheerio.load(shortDesc);
            $('tr').each((idx, el) => {
                const tds = $(el).find('td');
                if (tds.length >= 2) {
                    const key = $(tds[0]).text().trim().toLowerCase();
                    const val = $(tds[1]).text().trim();
                    if (key.includes('công suất')) specs.wattage = val;
                    else if (key.includes('điện áp')) specs.voltage = val;
                    else if (key.includes('màu') || key.includes('nhiệt độ màu')) specs.color_temperature = val;
                    else if (key.includes('quang thông')) specs.luminous_flux = val;
                    else if (key.includes('hiệu suất')) specs.luminous_efficacy = val;
                    else if (key.includes('cri') || key.includes('hoàn màu')) specs.cri = val;
                    else if (key.includes('tuổi thọ')) specs.lifespan = val;
                    else if (key.includes('kích thước') || key.includes('lỗ khoét')) specs.hole_size = val;
                    else if (key.includes('bảo hành')) specs.warranty = val;
                }
            });
        }

        const product = {
            sku,
            name,
            price,
            stock,
            category,
            subCategory,
            images,
            isBestSeller: false,
            application: {
                title: name,
                description: description,
                image: images.length > 0 ? images[0] : "",
                isHtml: true
            },
            features: [],
            specs: specs,
            variants: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (isDryRun) {
            console.log(`\nProduct ${i+1}:`);
            console.log(JSON.stringify(product, null, 2));
        } else {
            try {
                await addDoc(collection(db, "products"), product);
                successCount++;
                if (successCount % 50 === 0) {
                    console.log(`Imported ${successCount}/${limit} products...`);
                }
            } catch (error) {
                console.error(`Failed to import ${name}:`, error);
            }
        }
    }

    if (!isDryRun) {
        console.log(`\nDONE! Successfully imported ${successCount} products.`);
    }
    process.exit(0);
  });
