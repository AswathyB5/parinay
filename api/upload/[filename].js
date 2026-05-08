import { del, list } from '@vercel/blob';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({ success: false, error: `Method ${req.method} not allowed.` });
    }

    const session = requireAdmin(req, res);
    if (!session) return;

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
        return res.status(500).json({
            success: false,
            error: 'Missing BLOB_READ_WRITE_TOKEN. Configure Vercel Blob for media deletes.',
        });
    }

    const { filename } = req.query;
    if (!filename || typeof filename !== 'string') {
        return res.status(400).json({ success: false, error: 'Missing filename.' });
    }

    try {
        const prefix = `${filename}`;
        const { blobs } = await list({ prefix, token, limit: 1 });
        if (!blobs?.length) {
            return res.status(404).json({ success: false, error: 'File not found.' });
        }

        await del(blobs[0].url, { token });
        return res.status(200).json({ success: true, message: 'File deleted.' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
