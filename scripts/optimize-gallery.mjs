import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.join(__dirname, '..', 'public', 'uploads', 'gallery-couple');
const OUT_ROOT = path.join(__dirname, '..', 'public', 'uploads', 'gallery-couple-opt');

const VARIANTS = {
    card: { width: 900, quality: 68 },
    gallery: { width: 1600, quality: 72 },
};

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

async function listImages(dir, acc = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await listImages(full, acc);
        } else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
            acc.push(full);
        }
    }
    return acc;
}

async function ensureDir(filePath) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function optimizeOne(srcFile) {
    const rel = path.relative(SRC_ROOT, srcFile);
    const baseName = rel.replace(/\.[^.]+$/, '');
    const results = [];

    for (const [variant, opts] of Object.entries(VARIANTS)) {
        const dest = path.join(OUT_ROOT, variant, `${baseName}.webp`);
        try {
            const [srcStat, destStat] = await Promise.all([
                fs.stat(srcFile),
                fs.stat(dest).catch(() => null),
            ]);
            if (destStat && destStat.mtimeMs >= srcStat.mtimeMs && destStat.size > 0) {
                results.push('skip');
                continue;
            }
            await ensureDir(dest);
            await sharp(srcFile)
                .rotate()
                .resize({ width: opts.width, withoutEnlargement: true })
                .webp({ quality: opts.quality, effort: 4 })
                .toFile(dest);
            results.push('ok');
        } catch (err) {
            console.error(`Failed ${variant} ${rel}:`, err.message);
            results.push('fail');
        }
    }
    return results;
}

async function runPool(items, limit, worker) {
    let i = 0;
    const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (i < items.length) {
            const idx = i++;
            await worker(items[idx], idx);
        }
    });
    await Promise.all(runners);
}

const files = await listImages(SRC_ROOT);
console.log(`Optimizing ${files.length} gallery images...`);
let done = 0;
await runPool(files, 3, async (file) => {
    await optimizeOne(file);
    done += 1;
    if (done % 10 === 0 || done === files.length) {
        console.log(`  ${done}/${files.length}`);
    }
});
console.log('Done.');
