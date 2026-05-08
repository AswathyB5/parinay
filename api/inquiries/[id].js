import Inquiry from '../../models/Inquiry.js';
import { connectDB } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ success: false, error: 'Missing inquiry id.' });
    }

    if (req.method === 'PUT') {
        const session = requireAdmin(req, res);
        if (!session) return;

        try {
            await connectDB();
            const { status } = req.body || {};
            const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
            if (!inquiry) {
                return res.status(404).json({ success: false, error: 'Inquiry not found.' });
            }
            return res.status(200).json({ success: true, data: inquiry });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if (req.method === 'DELETE') {
        const session = requireAdmin(req, res);
        if (!session) return;

        try {
            await connectDB();
            const inquiry = await Inquiry.findByIdAndDelete(id);
            if (!inquiry) {
                return res.status(404).json({ success: false, error: 'Inquiry not found.' });
            }
            return res.status(200).json({ success: true, message: 'Inquiry deleted.' });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed.` });
}
