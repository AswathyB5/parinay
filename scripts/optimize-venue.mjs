import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VENUE_DIR = path.join(__dirname, '..', 'public', 'uploads', 'venue');
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function optimizeVenueImages() {
    console.log(`Scanning ${VENUE_DIR}...`);
    const entries = await fs.readdir(VENUE_DIR, { withFileTypes: true });
    const imageFiles = entries
        .filter(e => e.isFile() && IMAGE_EXTS.has(path.extname(e.name).toLowerCase()))
        .map(e => path.join(VENUE_DIR, e.name));

    console.log(`Found ${imageFiles.length} venue images to optimize.`);

    let totalOriginalBytes = 0;
    let totalOptimizedBytes = 0;

    for (let i = 0; i < imageFiles.length; i++) {
        const filePath = imageFiles[i];
        const fileName = path.basename(filePath);
        const ext = path.extname(filePath).toLowerCase();

        try {
            const statBefore = await fs.stat(filePath);
            totalOriginalBytes += statBefore.size;

            const metadata = await sharp(filePath).metadata();
            const isLarge = statBefore.size > 250 * 1024 || (metadata.width && metadata.width > 1920) || (metadata.height && metadata.height > 1920);

            if (!isLarge) {
                totalOptimizedBytes += statBefore.size;
                console.log(`[${i + 1}/${imageFiles.length}] Skipping already optimized: ${fileName} (${(statBefore.size / 1024).toFixed(1)} KB)`);
                continue;
            }

            const tempDest = path.join(VENUE_DIR, `__tmp_venue_${Date.now()}_${i}${ext}`);

            let pipeline = sharp(filePath)
                .rotate()
                .resize({
                    width: 1920,
                    height: 1920,
                    fit: 'inside',
                    withoutEnlargement: true
                });

            if (ext === '.png') {
                pipeline = pipeline.png({ quality: 85, compressionLevel: 8 });
            } else if (ext === '.webp') {
                pipeline = pipeline.webp({ quality: 82 });
            } else {
                pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true, progressive: true });
            }

            await pipeline.toFile(tempDest);

            const statAfter = await fs.stat(tempDest);
            totalOptimizedBytes += statAfter.size;

            await fs.rename(tempDest, filePath);

            const savedPct = (((statBefore.size - statAfter.size) / statBefore.size) * 100).toFixed(1);
            console.log(`[${i + 1}/${imageFiles.length}] ${fileName}: ${(statBefore.size / (1024 * 1024)).toFixed(2)} MB -> ${(statAfter.size / 1024).toFixed(1)} KB (-${savedPct}%)`);
        } catch (err) {
            console.error(`[${i + 1}/${imageFiles.length}] Error on ${fileName}:`, err.message);
            const stat = await fs.stat(filePath).catch(() => ({ size: 0 }));
            totalOptimizedBytes += stat.size;
        }
    }

    const savedMB = ((totalOriginalBytes - totalOptimizedBytes) / (1024 * 1024)).toFixed(2);
    const savedTotalPct = (((totalOriginalBytes - totalOptimizedBytes) / totalOriginalBytes) * 100).toFixed(1);

    console.log('\n--- Venue Optimization Complete ---');
    console.log(`Original total: ${(totalOriginalBytes / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Optimized total: ${(totalOptimizedBytes / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Space saved: ${savedMB} MB (${savedTotalPct}% reduction)`);
}

optimizeVenueImages().catch(console.error);
