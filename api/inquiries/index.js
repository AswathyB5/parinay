import Inquiry from '../../models/Inquiry.js';
import { connectDB } from '../_lib/db.js';
import nodemailer from 'nodemailer';
import { requireAdmin } from '../_lib/auth.js';

const getMailer = () => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) return null;

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
};

const sendInquiryEmail = async (payload) => {
    const transporter = getMailer();
    if (!transporter) return { sent: false, reason: 'SMTP not configured' };

    const to = process.env.INQUIRY_NOTIFICATION_EMAIL || 'aswathykurup17@gmail.com';
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    if (!from) return { sent: false, reason: 'Missing SMTP_FROM/SMTP_USER' };

    const safe = (val) => (val ?? '').toString().trim() || '-';
    const subject = `[Parinay] New ${safe(payload.type)} inquiry from ${safe(payload.name)}`;

    const eventsText = Array.isArray(payload.events) && payload.events.length
        ? payload.events.map((ev, i) => [
            `  Event ${i + 1}: ${safe(ev.type)}`,
            `    Date: ${safe(ev.date)}`,
            `    Guests: ${safe(ev.guests)}`,
            `    Venue status: ${safe(ev.venueStatus)}`,
            ev.venueName ? `    Venue: ${safe(ev.venueName)}` : null,
        ].filter(Boolean).join('\n')).join('\n')
        : null;

    const text = [
        '=== NEW PARINAY WEDDINGS INQUIRY ===',
        `Type: ${safe(payload.type)}`,
        `Name: ${safe(payload.name)}`,
        payload.email ? `Email: ${safe(payload.email)}` : null,
        `Phone: ${safe(payload.phone)}`,
        payload.address ? `Address: ${safe(payload.address)}` : null,
        payload.brideName ? `Bride's Name: ${safe(payload.brideName)}` : null,
        payload.groomName ? `Groom's Name: ${safe(payload.groomName)}` : null,
        payload.city ? `City: ${safe(payload.city)}` : null,
        payload.weddingDate ? `Wedding Date: ${safe(payload.weddingDate)}` : null,
        payload.weddingLocation ? `Wedding Location: ${safe(payload.weddingLocation)}` : null,
        payload.guestCount ? `Guest Count: ${safe(payload.guestCount)}` : null,
        payload.serviceRequired ? `Service Required: ${safe(payload.serviceRequired)}` : null,
        Array.isArray(payload.servicesRequired) && payload.servicesRequired.length
            ? `Services Required: ${payload.servicesRequired.join(', ')}` : null,
        payload.budget ? `Estimated Budget: ${safe(payload.budget)}` : null,
        eventsText ? `Events:\n${eventsText}` : null,
        payload.message ? `Message: ${safe(payload.message)}` : null,
        '=====================================',
    ].filter(Boolean).join('\n');

    await transporter.sendMail({ to, from, subject, text });
    return { sent: true };
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await connectDB();
            const {
                type,
                name,
                email,
                phone,
                address,
                weddingDate,
                weddingLocation,
                guestCount,
                serviceRequired,
                message,
                brideName,
                groomName,
                city,
                events,
                servicesRequired,
                budget,
            } = req.body || {};

            if (!type) {
                return res.status(400).json({ success: false, error: 'Inquiry type is required.' });
            }

            const inquiry = new Inquiry({
                type,
                name,
                email,
                phone,
                address,
                weddingDate,
                weddingLocation,
                guestCount,
                serviceRequired,
                message,
                brideName,
                groomName,
                city,
                events,
                servicesRequired,
                budget,
            });

            await inquiry.save();
            const mailStatus = await sendInquiryEmail(req.body).catch(err => ({ sent: false, reason: err.message }));
            return res.status(200).json({
                success: true,
                message: 'Inquiry submitted successfully.',
                data: inquiry,
                emailNotification: mailStatus,
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if (req.method === 'GET') {
        const session = requireAdmin(req, res);
        if (!session) return;

        try {
            await connectDB();
            const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
            return res.status(200).json({ success: true, data: inquiries });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed.` });
}
