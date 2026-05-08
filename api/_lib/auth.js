/* global Buffer, process */
import crypto from 'crypto';

// Admin auth is implemented with a signed cookie (no external deps).
// The frontend logs in with a username/password, and the cookie is sent automatically
// to protected admin endpoints (when fetch uses `credentials: "include"` if cross-origin).

const COOKIE_NAME = 'parinay_admin_session';

const getCookieHeader = (req) => req?.headers?.cookie || '';

const parseCookies = (cookieHeader) => {
    const out = {};
    if (!cookieHeader) return out;
    cookieHeader.split(';').forEach((pair) => {
        const idx = pair.indexOf('=');
        if (idx < 0) return;
        const key = pair.slice(0, idx).trim();
        const val = pair.slice(idx + 1).trim();
        if (key) out[key] = val;
    });
    return out;
};

const toBase64Url = (buf) =>
    Buffer.from(buf)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');

const fromBase64Url = (str) => {
    const padLen = (4 - (str.length % 4)) % 4;
    const padded = str + '='.repeat(padLen);
    const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(base64, 'base64');
};

const getSecret = () => process.env.ADMIN_SESSION_SECRET;

const signPayload = (payloadB64, secret) => {
    // Use HMAC-SHA256 signature over the base64url payload.
    const sig = crypto.createHmac('sha256', secret).update(payloadB64).digest();
    return toBase64Url(sig);
};

export const createAdminSessionToken = (username, ttlSeconds = 2 * 60 * 60) => {
    const secret = getSecret();
    if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set.');

    const exp = Math.floor(Date.now() / 1000) + Number(ttlSeconds || 0);
    const payload = { u: username, exp };
    const payloadB64 = toBase64Url(Buffer.from(JSON.stringify(payload), 'utf8'));
    const sigB64 = signPayload(payloadB64, secret);
    const token = `${payloadB64}.${sigB64}`;

    return { token, maxAgeSeconds: ttlSeconds };
};

export const verifyAdminSessionFromReq = (req) => {
    try {
        const secret = getSecret();
        if (!secret) return null;

        const cookies = parseCookies(getCookieHeader(req));
        const token = cookies[COOKIE_NAME];
        if (!token) return null;

        const [payloadB64, sigB64] = token.split('.');
        if (!payloadB64 || !sigB64) return null;

        const expectedSigB64 = signPayload(payloadB64, secret);
        // Ensure constant-time compare.
        if (sigB64.length !== expectedSigB64.length) return null;
        const ok = crypto.timingSafeEqual(
            Buffer.from(sigB64, 'utf8'),
            Buffer.from(expectedSigB64, 'utf8'),
        );
        if (!ok) return null;

        const payloadJson = fromBase64Url(payloadB64).toString('utf8');
        const payload = JSON.parse(payloadJson || '{}');
        const now = Math.floor(Date.now() / 1000);
        if (!payload?.u || !payload?.exp || payload.exp < now) return null;

        return { authenticated: true, username: payload.u, exp: payload.exp };
    } catch {
        return null;
    }
};

export const setAdminSessionCookie = (res, token, maxAgeSeconds = 2 * 60 * 60) => {
    const isProd =
        process.env.NODE_ENV === 'production' ||
        process.env.VERCEL_ENV === 'production' ||
        !!process.env.VERCEL_URL;

    const secure = isProd;

    // To make it a session cookie (cleared when browser closes), we remove Max-Age/Expires.
    const cookie = `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax${secure ? '; Secure' : ''}`;
    res.setHeader('Set-Cookie', cookie);
};

export const clearAdminSessionCookie = (res) => {
    // Immediately clear the cookie.
    const cookie = `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
    res.setHeader('Set-Cookie', cookie);
};

export const requireAdmin = (req, res) => {
    const session = verifyAdminSessionFromReq(req);
    if (!session?.authenticated) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return null;
    }
    return session;
};

export const timingSafeEqualString = (a, b) => {
    const aa = Buffer.from(String(a ?? ''), 'utf8');
    const bb = Buffer.from(String(b ?? ''), 'utf8');
    if (aa.length !== bb.length) return false;
    return crypto.timingSafeEqual(aa, bb);
};

