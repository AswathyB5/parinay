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

const ContactForm = () => {
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
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');

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

        events.forEach((ev) => {
            if (!ev.type) nextErrors[`event-${ev.id}`] = 'Please select an event type.';
        });

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        if (!validate()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`${API}/api/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'quote',
                    name: name.trim(),
                    phone: phone.trim(),
                    brideName: brideName.trim(),
                    groomName: groomName.trim(),
                    city: city.trim(),
                    events: events.map((ev) => ({
                        type: ev.type,
                        date: ev.date,
                        guests: ev.guests,
                        venueStatus: ev.venueStatus,
                        venueName: ev.venueName,
                    })),
                    servicesRequired: services,
                    budget: budgetLabel(budget),
                    message: notes.trim(),
                }),
            });
            const data = await res.json().catch(() => ({}));

            if (data.success) {
                setSubmitted(true);
            } else {
                setSubmitError(data.error || 'Something went wrong. Please try again.');
            }
        } catch {
            setSubmitError('Could not reach the server right now. Please check your internet and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="pw-page ef-page">
                <div className="ef-wrap">
                    <div className="ef-ok">
                        <div className="ef-ok__icon"><i className="fa-solid fa-check"></i></div>
                        <h3>Enquiry received!</h3>
                        <p>Thank you for reaching out to Parinay Weddings.<br />We'll be in touch within 24 hours.</p>
                    </div>
                </div>
            </div>
        );
    }

    const budgetPct = ((budget - 1) / 99) * 100;

    return (
        <div className="pw-page ef-page">
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
                                <label className="ef-lbl">Your city / where you're based</label>
                                <input type="text" placeholder="e.g. Kochi, Bangalore, Dubai..." value={city} onChange={(e) => setCity(e.target.value)} />
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
                                            {errors[`event-${ev.id}`] && <div className="ef-err">{errors[`event-${ev.id}`]}</div>}
                                        </div>
                                        <div className="ef-field">
                                            <label className="ef-lbl">Preferred date</label>
                                            <input type="date" value={ev.date} onChange={(e) => updateEvent(ev.id, 'date', e.target.value)} />
                                        </div>
                                        <div className="ef-field">
                                            <label className="ef-lbl">Number of guests</label>
                                            <input type="number" placeholder="e.g. 250" min="1" value={ev.guests} onChange={(e) => updateEvent(ev.id, 'guests', e.target.value)} />
                                        </div>
                                        <div className="ef-field">
                                            <label className="ef-lbl">Venue status</label>
                                            <select value={ev.venueStatus} onChange={(e) => updateEvent(ev.id, 'venueStatus', e.target.value)}>
                                                <option value="">Select status…</option>
                                                <option value="yes">Already selected a venue</option>
                                                <option value="no">Still looking for a venue</option>
                                                <option value="help">Need help finding a venue</option>
                                            </select>
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
                        <div className="ef-sec__head"><span className="ef-sec__icon"><i className="fa-solid fa-wand-magic-sparkles"></i></span><span>Services required</span></div>
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
                                <label className="ef-lbl">Any special requests, inspiration or questions</label>
                                <textarea placeholder="Tell us more about your vision…" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                            </div>
                        </div>
                    </div>

                    </div>

                    {submitError && <div className="ef-submit-err">{submitError}</div>}

                    <button type="submit" className="ef-submit" disabled={submitting}>
                        {submitting ? 'Sending…' : <>Send Enquiry <i className="fa-solid fa-paper-plane"></i></>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
