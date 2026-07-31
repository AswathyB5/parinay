import React, { useState, useRef } from 'react';
import { API } from '../context/ContentContext';

const EVENT_TYPES = [
    'Wedding ceremony',
    'Reception',
    'Mehendi',
    'Haldi',
    'Sangeet',
    'Engagement',
    'Cocktail party',
    'Pre-wedding shoot',
    'Other',
];

const SERVICES = [
    'Venue selection',
    'Décor production',
    'Sound & lights',
    'Live music / band',
    'Photography & videography',
    'Catering',
    'Bar & beverages',
    'Invitations & stationery',
    'Logistics',
    'Guest accommodation',
    'Makeup & styling',
    'SFX',
    'Return gifts & welcome hampers',
    'Choreography',
];

const budgetLabel = (v) => (v >= 100 ? '₹1Cr+' : `₹${v}L`);

const emptyEvent = () => ({
    type: EVENT_TYPES[0],
    date: '',
    guests: '',
    venueStatus: '',
    venueName: '',
});

/* ── Premium Popup Overlay ─────────────────────── */
const PremiumPopup = ({ popup, onClose }) => {
    if (!popup.open) return null;
    const isSuccess = popup.type === 'success';

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999999, backdropFilter: 'blur(12px)', padding: '20px',
            animation: 'cfFadeIn 0.3s ease'
        }}>
            <style>{`
                @keyframes cfFadeIn  { from { opacity: 0; } to { opacity: 1; } }
                @keyframes cfSlideUp { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes cfPulse   { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
                @keyframes cfSpin    { to { transform: rotate(360deg); } }
            `}</style>
            <div style={{
                width: '100%', maxWidth: '460px',
                background: isSuccess
                    ? 'linear-gradient(155deg, #fffdf8 0%, #fff5e4 50%, #f8f0e6 100%)'
                    : 'linear-gradient(155deg, #fff8f8 0%, #ffe4e4 50%, #f8e8e8 100%)',
                borderRadius: '28px', padding: '50px 40px', textAlign: 'center',
                boxShadow: isSuccess
                    ? '0 40px 100px rgba(58,18,25,0.5), 0 0 0 1px rgba(197,160,89,0.2)'
                    : '0 40px 100px rgba(158,42,43,0.4), 0 0 0 1px rgba(158,42,43,0.15)',
                borderTop: `6px solid ${isSuccess ? '#c5a059' : '#9e2a2b'}`,
                position: 'relative', overflow: 'hidden',
                animation: 'cfSlideUp 0.4s cubic-bezier(0.16,1,0.3,1)'
            }}>
                {/* Decorative glow corner */}
                <div style={{
                    position: 'absolute', top: 0, right: 0, width: '140px', height: '140px',
                    background: isSuccess
                        ? 'radial-gradient(circle at top right, rgba(197,160,89,0.12), transparent 70%)'
                        : 'radial-gradient(circle at top right, rgba(158,42,43,0.1), transparent 70%)',
                    pointerEvents: 'none'
                }} />
                {/* Icon */}
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 28px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isSuccess
                        ? 'linear-gradient(135deg, #3a1219, #6b1e28)'
                        : 'linear-gradient(135deg, #9e2a2b, #c0392b)',
                    boxShadow: isSuccess
                        ? '0 12px 35px rgba(58,18,25,0.4)'
                        : '0 12px 35px rgba(158,42,43,0.4)',
                    fontSize: '2rem', color: '#fff',
                    animation: 'cfPulse 2.5s ease infinite'
                }}>
                    {isSuccess ? '✓' : '⚠'}
                </div>
                {/* Title */}
                <h2 style={{
                    fontFamily: 'Playfair Display, serif', fontSize: '2rem',
                    color: isSuccess ? '#3a1219' : '#540b0e',
                    marginBottom: '16px', lineHeight: '1.2'
                }}>
                    {popup.title}
                </h2>
                {/* Message */}
                <p style={{
                    fontSize: '1.05rem', color: '#5a5a5a', lineHeight: '1.75',
                    marginBottom: '32px', maxWidth: '360px', margin: '0 auto 32px'
                }}>
                    {popup.message}
                </p>
                {/* Signature line for success */}
                {isSuccess && (
                    <p style={{
                        fontFamily: 'Playfair Display, serif', fontSize: '0.9rem',
                        color: '#c5a059', fontStyle: 'italic',
                        marginBottom: '28px', marginTop: '-18px'
                    }}>
                        — The Parinay Weddings Team
                    </p>
                )}
                {/* CTA Button */}
                <button
                    onClick={onClose}
                    style={{
                        width: '100%', padding: '18px', borderRadius: '14px', border: 'none',
                        background: isSuccess
                            ? 'linear-gradient(135deg, #3a1219, #6b1e28)'
                            : 'linear-gradient(135deg, #9e2a2b, #c0392b)',
                        color: '#fff', fontWeight: '600', fontSize: '1rem',
                        cursor: 'pointer', letterSpacing: '0.5px',
                        boxShadow: isSuccess
                            ? '0 8px 25px rgba(58,18,25,0.35)'
                            : '0 8px 25px rgba(158,42,43,0.35)',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 14px 32px rgba(58,18,25,0.45)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.boxShadow = isSuccess
                            ? '0 8px 25px rgba(58,18,25,0.35)'
                            : '0 8px 25px rgba(158,42,43,0.35)';
                    }}
                >
                    {isSuccess ? 'Perfect, thank you! ✨' : 'Try Again'}
                </button>
            </div>
        </div>
    );
};

/* ── Sending Overlay ───────────────────────────── */
const SendingOverlay = () => (
    <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 9999998, backdropFilter: 'blur(8px)'
    }}>
        <div style={{
            background: 'linear-gradient(155deg, #fffdf8, #fff3df)',
            borderRadius: '22px', padding: '45px 55px', textAlign: 'center',
            boxShadow: '0 30px 70px rgba(0,0,0,0.4)',
            borderTop: '4px solid #c5a059'
        }}>
            <div style={{
                width: '52px', height: '52px',
                border: '3px solid rgba(58,18,25,0.12)',
                borderTop: '3px solid #3a1219', borderRadius: '50%',
                margin: '0 auto 22px',
                animation: 'cfSpin 0.8s linear infinite'
            }} />
            <p style={{
                fontFamily: 'Playfair Display, serif', color: '#3a1219',
                fontSize: '1.15rem', margin: 0, letterSpacing: '0.3px'
            }}>
                Sending your enquiry…
            </p>
            <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '8px' }}>
                Please wait a moment
            </p>
        </div>
    </div>
);

/* ── Main Component ────────────────────────────── */
const ContactForm = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [brideName, setBrideName] = useState('');
    const [groomName, setGroomName] = useState('');
    const [city, setCity] = useState('');
    const [events, setEvents] = useState([{ id: 1, ...emptyEvent() }]);
    const [services, setServices] = useState([]);
    const [budget, setBudget] = useState(15);
    const [notes, setNotes] = useState('');

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [popup, setPopup] = useState({ open: false, type: '', title: '', message: '' });

    const nextIdRef = useRef(2);

    const addEvent = () => {
        setEvents((prev) => [...prev, { id: nextIdRef.current++, ...emptyEvent() }]);
    };

    const removeEvent = (id) => {
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
    };

    const updateEvent = (id, field, value) => {
        setEvents((prev) => prev.map((ev) => (ev.id === id ? { ...ev, [field]: value } : ev)));
    };

    const toggleService = (service) => {
        setServices((prev) =>
            prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
        );
    };

    const validate = () => {
        const nextErrors = {};

        if (!name.trim()) nextErrors.name = 'Please enter your name.';

        const phoneDigits = phone.replace(/\D/g, '');
        if (!phone.trim()) nextErrors.phone = 'Please enter your WhatsApp number.';
        else if (phoneDigits.length < 10) nextErrors.phone = 'Please enter a valid phone number (at least 10 digits).';

        if (!city.trim()) nextErrors.city = 'Please enter your city.';

        events.forEach((ev) => {
            if (!ev.type) nextErrors[`event-type-${ev.id}`] = 'Please select an event type.';
            if (!ev.date) nextErrors[`event-date-${ev.id}`] = 'Please select a preferred date.';
            if (!ev.guests) nextErrors[`event-guests-${ev.id}`] = 'Please enter the number of guests.';
            if (!ev.venueStatus) nextErrors[`event-venue-${ev.id}`] = 'Please select a venue status.';
        });

        if (services.length === 0) nextErrors.services = 'Please select at least one service.';
        if (!notes.trim()) nextErrors.notes = 'Please share your vision or any special requests.';

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const resetForm = () => {
        setName(''); setPhone(''); setBrideName(''); setGroomName('');
        setCity(''); setEvents([{ id: 1, ...emptyEvent() }]);
        setServices([]); setBudget(15); setNotes('');
        nextIdRef.current = 2;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            const eventsText = events.map((ev, i) => {
                const venueMap = { yes: 'Already selected a venue', no: 'Still looking for a venue', help: 'Need help finding a venue' };
                return [
                    `— Event ${i + 1}: ${ev.type}`,
                    ev.date ? `  Date: ${ev.date}` : '',
                    ev.guests ? `  Guests: ${ev.guests}` : '',
                    ev.venueStatus ? `  Venue: ${venueMap[ev.venueStatus] || ev.venueStatus}` : '',
                    ev.venueName ? `  Venue Name: ${ev.venueName}` : '',
                ].filter(Boolean).join('\n');
            }).join('\n\n');

            const istTime = new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: true,
            });

            // 1. Primary: Call backend /api/send-email (Nodemailer Gmail SMTP)
            let success = false;
            try {
                const res = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        formType: 'enquiry',
                        submittedAt: istTime,
                        contactName: name.trim(),
                        whatsappNumber: phone.trim(),
                        brideName: brideName.trim() || '—',
                        groomName: groomName.trim() || '—',
                        city: city.trim() || '—',
                        eventsText: eventsText || '—',
                        servicesRequired: services.length ? services.join(', ') : '—',
                        estimatedBudget: budgetLabel(budget),
                        additionalNotes: notes.trim() || '—',
                    }),
                });
                const data = await res.json().catch(() => ({}));
                if (data.success) success = true;
            } catch (err) {
                console.error('[Nodemailer Send API Error]:', err);
            }

            if (success) {
                resetForm();
                setPopup({
                    open: true,
                    type: 'success',
                    title: 'Thank You! 🌸',
                    message: 'Your enquiry has been received by the Parinay Weddings team. We\'ll personally reach out within 24 hours to begin crafting your dream celebration.',
                });
            } else {
                // Fallback to native email mailto if backend provider fails
                const mailSubject = encodeURIComponent(`New Wedding Enquiry — ${name.trim()}`);
                const mailBody = encodeURIComponent(
                    `NEW WEDDING ENQUIRY\n\n` +
                    `Name: ${name.trim()}\n` +
                    `WhatsApp: ${phone.trim()}\n` +
                    `Bride Name: ${brideName.trim() || '—'}\n` +
                    `Groom Name: ${groomName.trim() || '—'}\n` +
                    `City/Location: ${city.trim() || '—'}\n` +
                    `Events: ${eventsText || '—'}\n` +
                    `Services: ${services.length ? services.join(', ') : '—'}\n` +
                    `Budget: ${budgetLabel(budget)}\n` +
                    `Notes: ${notes.trim() || '—'}`
                );
                window.location.href = `mailto:aswathykurup17@gmail.com?subject=${mailSubject}&body=${mailBody}`;
                resetForm();
                setPopup({
                    open: true,
                    type: 'success',
                    title: 'Enquiry Prepared! 🌸',
                    message: 'Your email application has been opened with your enquiry pre-filled for aswathykurup17@gmail.com.',
                });
            }
        } catch {
            const mailSubject = encodeURIComponent(`New Wedding Enquiry — ${name.trim()}`);
            const mailBody = encodeURIComponent(
                `NEW WEDDING ENQUIRY\n\n` +
                `Name: ${name.trim()}\n` +
                `WhatsApp: ${phone.trim()}\n` +
                `Bride Name: ${brideName.trim() || '—'}\n` +
                `Groom Name: ${groomName.trim() || '—'}\n` +
                `City/Location: ${city.trim() || '—'}\n` +
                `Events: ${eventsText || '—'}\n` +
                `Services: ${services.length ? services.join(', ') : '—'}\n` +
                `Budget: ${budgetLabel(budget)}\n` +
                `Notes: ${notes.trim() || '—'}`
            );
            window.location.href = `mailto:aswathykurup17@gmail.com?subject=${mailSubject}&body=${mailBody}`;
            setPopup({
                open: true,
                type: 'success',
                title: 'Enquiry Prepared! 🌸',
                message: 'Your email application has been opened with your enquiry pre-filled for aswathykurup17@gmail.com.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const closePopup = () => setPopup({ open: false, type: '', title: '', message: '' });

    const budgetPct = ((budget - 1) / 99) * 100;

    return (
        <div className="pw-page ef-page">
            {/* Premium popups */}
            <PremiumPopup popup={popup} onClose={closePopup} />
            {submitting && <SendingOverlay />}

            <section className="about-hero-new">
                <div className="container">
                    <h1>Parinay Weddings</h1>
                    <div className="ef-hero__tag">Destination Wedding Specialists</div>
                    <div className="ef-hero__bar"><span></span><i className="fa-solid fa-gem"></i><span></span></div>
                    <p className="ef-hero__desc">Tell us about your dream celebration and we'll get back to you within 24 hours.</p>
                </div>
            </section>

            <div className="ef-wrap">
                <form className="ef-form" onSubmit={handleSubmit} noValidate>

                    <div className="ef-card">

                        <div className="ef-sec">
                            <div className="ef-sec__head"><span className="ef-sec__icon"><i className="fa-solid fa-user"></i></span><span>About you</span></div>
                            <div className="ef-sec__body">
                                <div className="ef-g4">
                                    <div className="ef-field">
                                        <label className="ef-lbl">Your name <span className="ef-req">*</span></label>
                                        <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                                        {errors.name && <div className="ef-err">{errors.name}</div>}
                                    </div>
                                    <div className="ef-field">
                                        <label className="ef-lbl">WhatsApp number <span className="ef-req">*</span></label>
                                        <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                        {errors.phone && <div className="ef-err">{errors.phone}</div>}
                                    </div>
                                    <div className="ef-field">
                                        <label className="ef-lbl">Bride's name</label>
                                        <input type="text" placeholder="Bride's name" value={brideName} onChange={(e) => setBrideName(e.target.value)} />
                                    </div>
                                    <div className="ef-field">
                                        <label className="ef-lbl">Groom's name</label>
                                        <input type="text" placeholder="Groom's name" value={groomName} onChange={(e) => setGroomName(e.target.value)} />
                                    </div>
                                </div>
                                <div className="ef-field">
                                    <label className="ef-lbl">Your city / where you're based <span className="ef-req">*</span></label>
                                    <input type="text" placeholder="e.g. Kochi, Bangalore, Dubai..." value={city} onChange={(e) => setCity(e.target.value)} />
                                    {errors.city && <div className="ef-err">{errors.city}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="ef-sec">
                            <div className="ef-sec__head"><span className="ef-sec__icon"><i className="fa-solid fa-calendar-days"></i></span><span>Events</span></div>
                            <div className="ef-sec__body">
                                {events.map((ev, idx) => (
                                    <div className="ef-ev" key={ev.id}>
                                        <div className="ef-ev__hd">
                                            <span className="ef-ev__label"><i className="fa-solid fa-champagne-glasses"></i>Event {idx + 1}</span>
                                            {idx > 0 && (
                                                <button type="button" className="ef-rm" onClick={() => removeEvent(ev.id)}>
                                                    <i className="fa-solid fa-xmark"></i> Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="ef-g4">
                                            <div className="ef-field">
                                                <label className="ef-lbl">Event type <span className="ef-req">*</span></label>
                                                <select value={ev.type} onChange={(e) => updateEvent(ev.id, 'type', e.target.value)}>
                                                    {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                                {errors[`event-type-${ev.id}`] && <div className="ef-err">{errors[`event-type-${ev.id}`]}</div>}
                                            </div>
                                            <div className="ef-field">
                                                <label className="ef-lbl">Preferred date <span className="ef-req">*</span></label>
                                                <input type="date" min={todayStr} value={ev.date} onChange={(e) => updateEvent(ev.id, 'date', e.target.value)} />
                                                {errors[`event-date-${ev.id}`] && <div className="ef-err">{errors[`event-date-${ev.id}`]}</div>}
                                            </div>
                                            <div className="ef-field">
                                                <label className="ef-lbl">Number of guests <span className="ef-req">*</span></label>
                                                <input type="number" placeholder="e.g. 250" min="1" value={ev.guests} onChange={(e) => updateEvent(ev.id, 'guests', e.target.value)} />
                                                {errors[`event-guests-${ev.id}`] && <div className="ef-err">{errors[`event-guests-${ev.id}`]}</div>}
                                            </div>
                                            <div className="ef-field">
                                                <label className="ef-lbl">Venue status <span className="ef-req">*</span></label>
                                                <select value={ev.venueStatus} onChange={(e) => updateEvent(ev.id, 'venueStatus', e.target.value)}>
                                                    <option value="">Select status…</option>
                                                    <option value="yes">Already selected a venue</option>
                                                    <option value="no">Still looking for a venue</option>
                                                    <option value="help">Need help finding a venue</option>
                                                </select>
                                                {errors[`event-venue-${ev.id}`] && <div className="ef-err">{errors[`event-venue-${ev.id}`]}</div>}
                                            </div>
                                        </div>
                                        {ev.venueStatus === 'yes' && (
                                            <div className="ef-field" style={{ marginTop: '10px', marginBottom: 0 }}>
                                                <label className="ef-lbl">Venue name / location</label>
                                                <input type="text" placeholder="e.g. The Leela Palace, Udaipur" value={ev.venueName} onChange={(e) => updateEvent(ev.id, 'venueName', e.target.value)} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button type="button" className="ef-add" onClick={addEvent}>
                                    <i className="fa-solid fa-plus"></i> Add another event
                                </button>
                            </div>
                        </div>

                        <div className="ef-sec">
                            <div className="ef-sec__head"><span className="ef-sec__icon"><i className="fa-solid fa-wand-magic-sparkles"></i></span><span>Services required <span className="ef-req">*</span></span></div>
                            <div className="ef-sec__body">
                                <div className="ef-chips">
                                    {SERVICES.map((s) => (
                                        <label className={`ef-chip${services.includes(s) ? ' on' : ''}`} key={s}>
                                            <input
                                                type="checkbox"
                                                checked={services.includes(s)}
                                                onChange={() => toggleService(s)}
                                            />
                                            <div className="ef-chip__box"></div>
                                            <span>{s}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.services && <div className="ef-err" style={{ marginTop: '12px' }}>{errors.services}</div>}
                            </div>
                        </div>

                        <div className="ef-sec">
                            <div className="ef-sec__head"><span className="ef-sec__icon"><i className="fa-solid fa-wallet"></i></span><span>Estimated budget</span></div>
                            <div className="ef-sec__body">
                                <div className="ef-brow">
                                    <span className="ef-bval">{budgetLabel(budget)}</span>
                                    <span className="ef-bnote">Excl. venue, catering &amp; photography</span>
                                </div>
                                <input
                                    type="range"
                                    className="ef-bslider"
                                    min="1"
                                    max="100"
                                    step="1"
                                    value={budget}
                                    onChange={(e) => setBudget(parseInt(e.target.value, 10))}
                                    style={{ background: `linear-gradient(to right, var(--primary-color) ${budgetPct}%, rgba(58,18,25,0.15) ${budgetPct}%)` }}
                                />
                                <div className="ef-bmarks"><span>₹1L</span><span>₹25L</span><span>₹50L</span><span>₹75L</span><span>₹1Cr+</span></div>
                            </div>
                        </div>

                        <div className="ef-sec">
                            <div className="ef-sec__head"><span className="ef-sec__icon"><i className="fa-solid fa-note-sticky"></i></span><span>Additional notes</span></div>
                            <div className="ef-sec__body">
                                <div className="ef-field" style={{ marginBottom: 0 }}>
                                    <label className="ef-lbl">Any special requests, inspiration or questions <span className="ef-req">*</span></label>
                                    <textarea placeholder="Tell us more about your vision…" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                                    {errors.notes && <div className="ef-err">{errors.notes}</div>}
                                </div>
                            </div>
                        </div>

                    </div>

                    <button type="submit" className="ef-submit" disabled={submitting}>
                        {submitting ? 'Sending…' : <><span>Send Enquiry</span> <i className="fa-solid fa-paper-plane"></i></>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
