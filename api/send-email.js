import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    submittedAt, contactName, whatsappNumber,
    brideName, groomName, city,
    eventsText, servicesRequired,
    estimatedBudget, additionalNotes,
    formType
  } = req.body;

  const toEmail = formType === 'contact'
    ? 'info.parinayweddings@gmail.com'
    : 'aswathybcontact@gmail.com';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Georgia, serif; background: #fdf8f2; margin: 0; padding: 0; }
        .wrap { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #3a1219, #6b1e28); padding: 36px 40px; text-align: center; }
        .header h1 { color: #c5a059; font-size: 26px; margin: 0 0 6px; letter-spacing: 1px; }
        .header p { color: rgba(255,255,255,0.7); font-size: 13px; margin: 0; }
        .body { padding: 36px 40px; }
        .badge { display: inline-block; background: #fdf0e0; color: #c5a059; border: 1px solid #c5a059; border-radius: 20px; padding: 4px 14px; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #f0e8dc; vertical-align: top; }
        td:first-child { color: #888; width: 38%; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
        td:last-child { color: #2d1a10; font-weight: 500; }
        .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #c5a059; padding: 18px 16px 6px; border-bottom: 1px solid #f0e8dc; font-weight: 600; }
        .events-text { white-space: pre-line; line-height: 1.8; }
        .footer { background: #fdf8f2; padding: 24px 40px; text-align: center; border-top: 1px solid #f0e8dc; }
        .footer p { color: #aaa; font-size: 12px; margin: 0; }
        .footer strong { color: #c5a059; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="header">
          <h1>Parinay Weddings</h1>
          <p>New Wedding Enquiry Received</p>
        </div>
        <div class="body">
          <div class="badge">New Enquiry</div>
          <table>
            <tr><td>Submitted At</td><td>${submittedAt || '—'}</td></tr>
          </table>

          <div class="section-title">Contact Details</div>
          <table>
            <tr><td>Full Name</td><td>${contactName || '—'}</td></tr>
            <tr><td>WhatsApp</td><td>${whatsappNumber || '—'}</td></tr>
            <tr><td>Bride's Name</td><td>${brideName || '—'}</td></tr>
            <tr><td>Groom's Name</td><td>${groomName || '—'}</td></tr>
            <tr><td>City / Location</td><td>${city || '—'}</td></tr>
          </table>

          <div class="section-title">Event Details</div>
          <table>
            <tr><td>Events</td><td class="events-text">${eventsText || '—'}</td></tr>
          </table>

          <div class="section-title">Requirements</div>
          <table>
            <tr><td>Services</td><td>${servicesRequired || '—'}</td></tr>
            <tr><td>Budget</td><td>${estimatedBudget || '—'}</td></tr>
            <tr><td>Notes</td><td>${additionalNotes || '—'}</td></tr>
          </table>
        </div>
        <div class="footer">
          <p>Sent from <strong>Parinay Weddings</strong> website enquiry form</p>
        </div>
      </div>
    </body>
    </html>
    `;

  try {
    // Option 1: Web3Forms Access Key
    if (process.env.WEB3FORMS_ACCESS_KEY) {
      const w3fRes = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_ACCESS_KEY,
          subject: `New Wedding Enquiry — ${contactName} (${city || 'Location not given'})`,
          from_name: 'Parinay Weddings Website',
          to: toEmail,
          html: html,
        }),
      });
      const w3fData = await w3fRes.json().catch(() => ({}));
      if (w3fData.success) {
        return res.status(200).json({ success: true });
      }
    }

    // Option 2: Resend API Key
    if (process.env.RESEND_API_KEY) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Parinay Weddings <onboarding@resend.dev>',
          to: [toEmail],
          subject: `New Wedding Enquiry — ${contactName} (${city || 'Location not given'})`,
          html: html,
        }),
      });
      if (resendRes.ok) {
        return res.status(200).json({ success: true });
      }
    }

    // Option 3: SMTP (Developer / Sender Gmail)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '465', 10),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Parinay Weddings Website" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: `New Wedding Enquiry — ${contactName} (${city || 'Location not given'})`,
        html,
      });
      return res.status(200).json({ success: true });
    }

    return res.status(500).json({
      success: false,
      error: 'No email service configured. Please set WEB3FORMS_ACCESS_KEY, RESEND_API_KEY, or SMTP_USER/SMTP_PASS in Vercel environment variables.'
    });

  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send email.' });
  }
}
