import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import Content from './models/Content.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

/* ── CORS ──────────────────────────────────────── */
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

/* ── Body Parsing ──────────────────────────────── */
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

/* ── Static Uploads ────────────────────────────── */
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

/* ── Multer Storage ────────────────────────────── */
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename:    (_req, file, cb) => {
        const ext  = path.extname(file.originalname).toLowerCase();
        const safe = `upload_${Date.now()}_${Math.floor(Math.random() * 9999)}${ext}`;
        cb(null, safe);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
    fileFilter: (_req, file, cb) => {
        const allowed = /\.(jpe?g|png|gif|webp|avif|svg|mp4|mov|webm)$/i;
        if (allowed.test(file.originalname)) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed. Use images or videos.'));
        }
    },
});

/* ══════════════════════════════════════════════════
   ROUTES
══════════════════════════════════════════════════ */

/* Health check */
app.get('/', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'Parinay Weddings Backend API is running.',
        version: '2.0.0',
    });
});

/* ── Upload File ───────────────────────────────── */
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file received.' });
        }
        const protocol = req.protocol;
        const host     = req.get('host');
        const fileUrl  = `${protocol}://${host}/uploads/${req.file.filename}`;
        console.log(`[Upload] ${req.file.filename} (${(req.file.size / 1024).toFixed(1)} KB)`);
        res.json({ success: true, url: fileUrl, filename: req.file.filename });
    } catch (err) {
        console.error('[Upload Error]', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

/* ── Get Content ───────────────────────────────── */
app.get('/api/content', async (_req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: 'Database not connected. Please check your MongoDB server.' });
    }
    try {
        // Always return the most recently saved document
        const doc = await Content.findOne().sort({ createdAt: -1 }).lean();
        if (doc) {
            return res.json(doc.data);
        }
        return res.json(null);
    } catch (err) {
        console.error('[GET /api/content]', err.message);
        res.status(500).json({ error: 'Failed to load content.' });
    }
});

/* ── Save Content ──────────────────────────────── */
app.post('/api/content', async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: 'Database not connected. Cannot save content.' });
    }
    try {
        const payload = req.body;
        if (!payload || typeof payload !== 'object') {
            return res.status(400).json({ success: false, error: 'Invalid payload.' });
        }

        const doc = new Content({ data: payload });
        await doc.save();

        console.log(`[Content Saved] _id=${doc._id} at ${new Date().toISOString()}`);
        res.json({ success: true, message: 'Content saved successfully.', data: payload });
    } catch (err) {
        console.error('[POST /api/content]', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

/* ── Delete Uploaded File ──────────────────────── */
app.delete('/api/upload/:filename', (req, res) => {
    const filepath = path.join(uploadsDir, req.params.filename);
    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ success: false, error: 'File not found.' });
    }
    fs.unlink(filepath, (err) => {
        if (err) {
            console.error('[Delete Upload Error]', err.message);
            return res.status(500).json({ success: false, error: err.message });
        }
        console.log(`[Upload Deleted] ${req.params.filename}`);
        res.json({ success: true, message: 'File deleted.' });
    });
});

/* ── Global Error Handler ──────────────────────── */
app.use((err, _req, res, _next) => {
    console.error('[Unhandled Error]', err.message);
    res.status(500).json({ success: false, error: err.message });
});

/* ══════════════════════════════════════════════════
   START
══════════════════════════════════════════════════ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[Server] Listening on http://localhost:${PORT}`);
});

mongoose
    .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,
    })
    .then(() => {
        console.log('[MongoDB] Connected successfully.');
    })
    .catch((err) => {
        console.error('[MongoDB] Connection failed:');
        console.error(err);
    });
