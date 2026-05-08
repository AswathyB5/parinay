import path from 'path';
import multer from 'multer';
import { put } from '@vercel/blob';
import { requireAdmin } from './_lib/auth.js';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = /\.(jpe?g|png|gif|webp|avif|svg|mp4|mov|webm)$/i;
        if (allowed.test(file.originalname || '')) return cb(null, true);
        return cb(new Error('File type not allowed. Use images or videos.'));
    },
});

const runMiddleware = (req, res, middleware) =>
    new Promise((resolve, reject) => {
        middleware(req, res, (result) => {
            if (result instanceof Error) return reject(result);
            return resolve(result);
        });
    });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, error: `Method ${req.method} not allowed.` });
    }

    const session = requireAdmin(req, res);
    if (!session) return;

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
        return res.status(500).json({
            success: false,
            error: 'Missing BLOB_READ_WRITE_TOKEN. Configure Vercel Blob for media uploads.',
        });
    }

    try {
        await runMiddleware(req, res, upload.single('file'));
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file received.' });
        }

        const ext = path.extname(req.file.originalname || '').toLowerCase();
        const safeName = `upload_${Date.now()}_${Math.floor(Math.random() * 9999)}${ext}`;

        const blob = await put(safeName, req.file.buffer, {
            access: 'public',
            addRandomSuffix: false,
            token,
            contentType: req.file.mimetype || undefined,
        });

        return res.status(200).json({
            success: true,
            url: blob.url,
            filename: safeName,
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
