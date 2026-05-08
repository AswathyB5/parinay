import Content from '../models/Content.js';
import { connectDB } from './_lib/db.js';
import { requireAdmin } from './_lib/auth.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            await connectDB();
            const doc = await Content.findOne().sort({ createdAt: -1 }).lean();
            return res.status(200).json(doc ? doc.data : null);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to load content.', detail: error.message });
        }
    }

    if (req.method === 'POST') {
        const session = requireAdmin(req, res);
        if (!session) return;

        try {
            await connectDB();
            const payload = req.body;
            if (!payload || typeof payload !== 'object') {
                return res.status(400).json({ success: false, error: 'Invalid payload.' });
            }

            const doc = new Content({ data: payload });
            await doc.save();

            return res.status(200).json({
                success: true,
                message: 'Content saved successfully.',
                data: payload,
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed.` });
}
