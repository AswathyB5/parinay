import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYNC_URL = 'http://localhost:5000/api/content';
const TARGET_FILE = path.join(__dirname, 'src', 'data', 'site-content.json');

async function sync() {
    console.log(`[Sync] Fetching latest content from ${SYNC_URL}...`);
    try {
        const res = await fetch(SYNC_URL);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        
        if (!data) {
            console.error('[Sync Failure] No data found in the database. Did you save anything yet?');
            process.exit(1);
        }

        // Clean data: replace any absolute localhost:5000 URLs with relative ones
        const str = JSON.stringify(data);
        const cleaned = str.replace(/http:\/\/localhost:5000\/uploads/g, '/uploads');
        const finalData = JSON.parse(cleaned);

        fs.writeFileSync(TARGET_FILE, JSON.stringify(finalData, null, 2));
        console.log(`[Sync Success] Updated ${TARGET_FILE} with ${Object.keys(finalData).length} sections.`);
    } catch (err) {
        console.error('[Sync Error]', err.message);
        process.exit(1);
    }
}

sync();
