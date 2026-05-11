import { clearAdminSessionCookie } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, error: `Method ${req.method} not allowed.` });
    }

    try {
        clearAdminSessionCookie(res);
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

