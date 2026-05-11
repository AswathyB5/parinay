import { verifyAdminSessionFromReq } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ success: false, error: `Method ${req.method} not allowed.` });
    }

    const session = verifyAdminSessionFromReq(req);
    return res.status(200).json({
        authenticated: !!session?.authenticated,
        username: session?.username || null,
    });
}

