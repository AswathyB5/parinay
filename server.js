import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import Content from './models/Content.js';
import Inquiry from './models/Inquiry.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Request Logger
app.use((req, _res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

/* ── Health Check ──────────────────────────────── */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'UP', 
        db: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
        time: new Date().toISOString()
    });
});

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
        const fileUrl  = `/uploads/${req.file.filename}`;
        console.log(`[Upload] Saving: ${req.file.filename} (${(req.file.size / 1024).toFixed(1)} KB)`);
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

        // 1. Save to MongoDB
        const doc = new Content({ data: payload });
        await doc.save();

        // 2. Save to Local JSON (for Vercel/Production Fallback)
        try {
            const contentPath = path.join(__dirname, 'src', 'data', 'site-content.json');
            const dataDir = path.dirname(contentPath);
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
            fs.writeFileSync(contentPath, JSON.stringify(payload, null, 2));
            console.log(`[Local Sync] Updated src/data/site-content.json`);
        } catch (fileErr) {
            console.warn('[Local Sync Error] Could not write site-content.json:', fileErr.message);
        }

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

/* ── Submit Inquiry (Contact / Quote / WhatsApp) ── */
app.post('/api/inquiries', async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: 'Database not connected.' });
    }
    try {
        const { type, name, email, phone, address, weddingDate, weddingLocation, guestCount, serviceRequired, message } = req.body;
        if (!type) {
            return res.status(400).json({ success: false, error: 'Inquiry type is required.' });
        }
        const inquiry = new Inquiry({
            type, name, email, phone, address, weddingDate, weddingLocation,
            guestCount, serviceRequired, message
        });
        await inquiry.save();
        console.log(`[Inquiry] New ${type} inquiry from ${name || 'Unknown'} (${email || 'No email'})`);
        res.json({ success: true, message: 'Inquiry submitted successfully.', data: inquiry });
    } catch (err) {
        console.error('[POST /api/inquiries] SAVE ERROR:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/* ── Get All Inquiries ─────────────────────────── */
app.get('/api/inquiries', async (_req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: 'Database not connected.' });
    }
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
        res.json({ success: true, data: inquiries });
    } catch (err) {
        console.error('[GET /api/inquiries]', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

/* ── Update Inquiry Status ─────────────────────── */
app.put('/api/inquiries/:id', async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: 'Database not connected.' });
    }
    try {
        const { status } = req.body;
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!inquiry) {
            return res.status(404).json({ success: false, error: 'Inquiry not found.' });
        }
        res.json({ success: true, data: inquiry });
    } catch (err) {
        console.error('[PUT /api/inquiries]', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

/* ── Delete Inquiry ────────────────────────────── */
app.delete('/api/inquiries/:id', async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: 'Database not connected.' });
    }
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ success: false, error: 'Inquiry not found.' });
        }
        console.log(`[Inquiry Deleted] ${req.params.id}`);
        res.json({ success: true, message: 'Inquiry deleted.' });
    } catch (err) {
        console.error('[DELETE /api/inquiries]', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

/* ── Catch-all for API 404s ── */
app.use('/api/*', (req, res) => {
    console.warn(`[404] ${req.method} ${req.originalUrl}`);
    res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found on this server.` });
});

/* ── Serve Frontend in Production ──────────────── */
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
    console.log(`[Static] Serving frontend from ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        // Skip API routes already handled
        if (req.path.startsWith('/api')) return;
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

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
