/* global process */
import { createAdminSessionToken, setAdminSessionCookie, timingSafeEqualString } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, error: `Method ${req.method} not allowed.` });
    }

    try {
        const { username, password } = req.body || {};

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminUsername || !adminPassword) {
            return res.status(500).json({
                success: false,
                error: 'Admin credentials are not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD.',
            });
        }

        if (String(username ?? '') !== String(adminUsername)) {
            return res.status(401).json({ success: false, error: 'Invalid username or password.' });
        }

        const ok = timingSafeEqualString(password, adminPassword);
        if (!ok) return res.status(401).json({ success: false, error: 'Invalid username or password.' });

        const ttlSeconds = Number(process.env.ADMIN_SESSION_TTL_SECONDS || 2 * 60 * 60);
        const { token, maxAgeSeconds } = createAdminSessionToken(String(username), ttlSeconds);
        setAdminSessionCookie(res, token, maxAgeSeconds);

        return res.status(200).json({ success: true, username: String(username) });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

