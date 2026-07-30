import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext, renderText, resolveMediaURL, API } from '../context/ContentContext';

const Contact = () => {
    const { content } = useContext(ContentContext);
    const contact = content.contact;
    const [activeFaq, setActiveFaq] = useState(null);
    const [popup, setPopup] = useState({ open: false, title: '', message: '', type: '' });
    const todayStr = new Date().toISOString().split('T')[0];

    // --- Scroll Reveal Logic ---
    useEffect(() => {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        const timeoutId = setTimeout(() => {
            const revealElements = document.querySelectorAll('.reveal');
            revealElements.forEach(el => observer.observe(el));
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            const revealElements = document.querySelectorAll('.reveal');
            revealElements.forEach(el => observer.unobserve(el));
        };
    }, [content]);

    const validateForm = (payload) => {
        if (!payload.name.trim()) return 'Please enter your full name.';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!payload.email.trim()) return 'Please enter your email address.';
        if (!emailRegex.test(payload.email)) return 'Please enter a valid email address.';

        // Phone validation (if provided)
        if (payload.phone && payload.phone.trim()) {
            const phoneDigits = payload.phone.replace(/\D/g, '');
            if (phoneDigits.length < 10) return 'Please enter a valid phone number (at least 10 digits).';
        }

        if (!payload.message.trim()) return 'Please tell us a bit about your celebration.';
        if (payload.message.trim().length < 10) return 'Your message is a bit too short. Please provide more details.';

        return null;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formEl = e.currentTarget;
        const payload = {
            type: 'contact',
            name: formEl.fullName?.value || '',
            email: formEl.email?.value || '',
            address: formEl.address?.value || '',
            phone: formEl.phone?.value || '',
            weddingDate: formEl.weddingDate?.value || '',
            weddingLocation: formEl.weddingLocation?.value || '',
            guestCount: formEl.guestCount?.value || '',
            serviceRequired: formEl.serviceRequired?.value || '',
            message: formEl.message?.value || '',
        };

        const validationError = validateForm(payload);
        if (validationError) {
            setPopup({
                open: true,
                title: 'Error',
                message: validationError,
                type: 'error'
            });
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        try {
            const res = await fetch('https://formsubmit.co/ajax/info.parinayweddings@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    _subject: `New Wedding Inquiry from ${payload.name}`,
                    name: payload.name,
                    email: payload.email || 'Not provided',
                    phone: payload.phone || 'Not provided',
                    address: payload.address || 'Not provided',
                    wedding_date: payload.weddingDate || 'Not provided',
                    wedding_location: payload.weddingLocation || 'Not provided',
                    guest_count: payload.guestCount || 'Not provided',
                    service_required: payload.serviceRequired || 'Not provided',
                    message: payload.message || 'Not provided',
                    _captcha: 'false',
                    _template: 'table',
                }),
            });
            const data = await res.json().catch(() => ({}));

            if (data.success) {
                setPopup({
                    open: true,
                    title: 'Thank You! 🌸',
                    message: 'Your inquiry has been received by the Parinay Weddings team. We\'ll personally reach out within 24 hours to begin crafting your dream celebration.',
                    type: 'success'
                });
                formEl.reset();
            } else {
                setPopup({
                    open: true,
                    title: 'Submission Failed',
                    message: 'Something went wrong. Please try again or reach us directly at info.parinayweddings@gmail.com',
                    type: 'error'
                });
            }
        } catch (err) {
            setPopup({
                open: true,
                title: 'Connection Issue',
                message: 'Could not send your message. Please try again or email us at info.parinayweddings@gmail.com',
                type: 'error'
            });
        }

        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    };

    const { trackWhatsAppClick } = useContext(ContentContext);
    const whatsappNumberDigits = String(contact?.whatsappNumber || '').replace(/\D/g, '');
    const whatsappNumberClean =
        whatsappNumberDigits.length === 10 ? `91${whatsappNumberDigits}` : whatsappNumberDigits;
    const whatsappMessage = encodeURIComponent('Hello, I would like to discuss my wedding plans.');
    const whatsappHref = `https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${whatsappMessage}`;

    return (
        <>
            {popup.open && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.88)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999999, backdropFilter: 'blur(12px)', padding: '20px',
                    animation: 'cFadeIn 0.3s ease'
                }}>
                    <style>{`
                        @keyframes cFadeIn  { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes cSlideUp { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                        @keyframes cPulse   { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
                    `}</style>
                    <div style={{
                        width: '100%', maxWidth: '460px',
                        background: popup.type === 'success'
                            ? 'linear-gradient(155deg, #fffdf8 0%, #fff5e4 50%, #f8f0e6 100%)'
                            : 'linear-gradient(155deg, #fff8f8 0%, #ffe4e4 50%, #f8e8e8 100%)',
                        borderRadius: '28px', padding: '50px 40px', textAlign: 'center',
                        boxShadow: popup.type === 'success'
                            ? '0 40px 100px rgba(58,18,25,0.5), 0 0 0 1px rgba(197,160,89,0.2)'
                            : '0 40px 100px rgba(158,42,43,0.4), 0 0 0 1px rgba(158,42,43,0.15)',
                        borderTop: `6px solid ${popup.type === 'success' ? '#c5a059' : '#9e2a2b'}`,
                        position: 'relative', overflow: 'hidden',
                        animation: 'cSlideUp 0.4s cubic-bezier(0.16,1,0.3,1)'
                    }}>
                        {/* Decorative glow corner */}
                        <div style={{
                            position: 'absolute', top: 0, right: 0, width: '140px', height: '140px',
                            background: popup.type === 'success'
                                ? 'radial-gradient(circle at top right, rgba(197,160,89,0.12), transparent 70%)'
                                : 'radial-gradient(circle at top right, rgba(158,42,43,0.1), transparent 70%)',
                            pointerEvents: 'none'
                        }} />
                        {/* Animated icon */}
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 28px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: popup.type === 'success'
                                ? 'linear-gradient(135deg, #3a1219, #6b1e28)'
                                : 'linear-gradient(135deg, #9e2a2b, #c0392b)',
                            boxShadow: popup.type === 'success'
                                ? '0 12px 35px rgba(58,18,25,0.4)'
                                : '0 12px 35px rgba(158,42,43,0.4)',
                            fontSize: '2rem', color: '#fff',
                            animation: 'cPulse 2.5s ease infinite'
                        }}>
                            {popup.type === 'success' ? '✓' : '⚠'}
                        </div>
                        {/* Title */}
                        <h2 style={{
                            fontFamily: 'Playfair Display, serif', fontSize: '2rem',
                            color: popup.type === 'success' ? '#3a1219' : '#540b0e',
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
                        {/* Signature for success */}
                        {popup.type === 'success' && (
                            <p style={{
                                fontFamily: 'Playfair Display, serif', fontSize: '0.9rem',
                                color: '#c5a059', fontStyle: 'italic',
                                marginBottom: '28px', marginTop: '-18px'
                            }}>
                                — The Parinay Weddings Team
                            </p>
                        )}
                        {/* Close button */}
                        <button
                            onClick={() => setPopup({ open: false, title: '', message: '', type: '' })}
                            style={{
                                width: '100%', padding: '18px', borderRadius: '14px', border: 'none',
                                background: popup.type === 'success'
                                    ? 'linear-gradient(135deg, #3a1219, #6b1e28)'
                                    : 'linear-gradient(135deg, #9e2a2b, #c0392b)',
                                color: '#fff', fontWeight: '600', fontSize: '1rem',
                                cursor: 'pointer', letterSpacing: '0.5px',
                                boxShadow: popup.type === 'success'
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
                                e.currentTarget.style.boxShadow = popup.type === 'success'
                                    ? '0 8px 25px rgba(58,18,25,0.35)'
                                    : '0 8px 25px rgba(158,42,43,0.35)';
                            }}
                        >
                            {popup.type === 'success' ? 'Perfect, thank you! ✨' : 'Try Again'}
                        </button>
                    </div>
                </div>
            )}

            <div className="pw-page">
                {/* HEADER BANNER */}
                <section className="about-hero-new">
                    <div className="container reveal">
                        <h1>{renderText(contact.pageBannerTitle || "Get in Touch")}</h1>
                    </div>
                </section>


                {/* CONTACT BODY */}
                <section className="pw-contact reveal">
                    <div className="pw-container">
                        <div className="pw-contact__grid">

                            {/* LEFT: INFO */}
                            <div className="pw-contact__info">
                                <div className="pw-contact__block">
                                    <span className="pw-label">{renderText(contact.emailLabel)}</span>
                                    <h3>{renderText(contact.emailHeading)}</h3>
                                    <p><a href={`mailto:${contact.email}`}>{renderText(contact.email)}</a></p>
                                </div>
                                <div className="pw-contact__block">
                                    <span className="pw-label">{renderText(contact.phoneLabel)}</span>
                                    <h3>{renderText(contact.phoneHeading)}</h3>
                                    <p><a href={`tel:+${contact.phone?.replace(/\D/g, '')}`}>{renderText(contact.phone)}</a></p>
                                </div>
                                <div className="pw-contact__block">
                                    <span className="pw-label">WhatsApp</span>
                                    <h3>Message Us</h3>
                                    <p><a href={whatsappHref} target="_blank" rel="noreferrer">{contact.whatsappNumber}</a></p>
                                </div>
                                <div className="pw-contact__block">
                                    <span className="pw-label">{renderText(contact.addressLabel)}</span>
                                    <h3>{renderText(contact.addressHeading)}</h3>
                                    <p>{renderText(contact.address)}</p>
                                </div>
                                <div className="pw-contact__block">
                                    <span className="pw-label">Stay Connected</span>
                                    <h3>Follow Us</h3>
                                    <div className="pw-contact__social">
                                        <a href={contact.instagramUrl} target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
                                        <a href={contact.facebookUrl} target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
                                        <a href={contact.pinterestUrl} target="_blank" rel="noreferrer"><i className="fab fa-pinterest-p"></i></a>
                                        <a href={contact.youtubeUrl} target="_blank" rel="noreferrer"><i className="fab fa-youtube"></i></a>
                                    </div>
                                </div>

                                <a href={whatsappHref} className="pw-contact__whatsapp" target="_blank" rel="noreferrer" onClick={trackWhatsAppClick}>
                                    <div>
                                        <h3>{contact.whatsappText}</h3>
                                        <p>{contact.whatsappReply}</p>
                                    </div>
                                    <i className="fab fa-whatsapp"></i>
                                </a>
                            </div>

                            {/* RIGHT: FORM */}
                            <div className="pw-contact__form">
                                <div className="pw-form-container">
                                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                        <img src={resolveMediaURL('uploads/upload_1777017695831_3523.png')} alt="Logo" style={{ width: '120px' }} />
                                    </div>
                                    <form className="pw-form" onSubmit={handleFormSubmit}>
                                        <div className="pw-form__grid">
                                            <div className="pw-form__field">
                                                <label className="pw-form__label">Your Name</label>
                                                <input type="text" name="fullName" className="pw-form__input" placeholder="Enter your full name" required />
                                            </div>
                                            <div className="pw-form__field">
                                                <label className="pw-form__label">Email Address</label>
                                                <input type="email" name="email" className="pw-form__input" placeholder="your@email.com" required />
                                            </div>
                                        </div>

                                        <div className="pw-form__field" style={{ marginTop: '20px' }}>
                                            <label className="pw-form__label">Current Address</label>
                                            <input type="text" name="address" className="pw-form__input" placeholder="Your current city or full address" />
                                        </div>

                                        <div className="pw-form__grid" style={{ marginTop: '20px' }}>
                                            <div className="pw-form__field">
                                                <label className="pw-form__label">Phone Number</label>
                                                <input type="tel" name="phone" className="pw-form__input" placeholder="+91 00000 00000" />
                                            </div>
                                            <div className="pw-form__field">
                                                <label className="pw-form__label">Wedding Date</label>
                                                <input type="date" name="weddingDate" className="pw-form__input" min={todayStr} />
                                            </div>
                                        </div>

                                        <div className="pw-form__field" style={{ marginTop: '20px' }}>
                                            <label className="pw-form__label">Wedding Location</label>
                                            <input type="text" name="weddingLocation" className="pw-form__input" placeholder="e.g. Kumarakom, Goa, Jaipur" />
                                        </div>

                                        <div className="pw-form__field" style={{ marginTop: '20px' }}>
                                            <label className="pw-form__label">Approx. Guest Count</label>
                                            <select name="guestCount" className="pw-form__input">
                                                <option>Under 100</option>
                                                <option>100 - 300</option>
                                                <option>300 - 500</option>
                                                <option>Above 500</option>
                                            </select>
                                        </div>

                                        <div className="pw-form__field" style={{ marginTop: '20px' }}>
                                            <label className="pw-form__label">Service Required</label>
                                            <select name="serviceRequired" className="pw-form__input">
                                                <option>Full Planning</option>
                                                <option>Partial Planning</option>
                                                <option>Day-of Coordination</option>
                                                <option>Consultation Only</option>
                                            </select>
                                        </div>

                                        <div className="pw-form__field" style={{ marginTop: '20px' }}>
                                            <label className="pw-form__label">Expectations & Vision</label>
                                            <textarea name="message" className="pw-form__input" rows="4" placeholder="Tell us about the celebration you have in mind and what you expect from us..."></textarea>
                                        </div>

                                        <div style={{ marginTop: '40px' }}>
                                            <button type="submit" className="pw-btn pw-btn--dark" style={{ width: '100%', padding: '24px' }}>
                                                {renderText(contact.formBtnText)}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* MAP SECTION */}
                <section className="pw-map-section reveal">
                    <div className="pw-container pw-container--wide">
                        <div className="pw-map-wrapper">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15783.207704908633!2d76.955321!3d8.518603!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05baeb444fd9f9%3A0xf1c9af2940501a75!2sParinay%20Weddings%20%26%20Events%20IQ!5e0!3m2!1sen!2sin!4v1776937838650!5m2!1sen!2sin"

                                width="100%"
                                height="100%"
                                className="pw-map-iframe"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Parinay Weddings Studio Location"
                            ></iframe>
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
};

export default Contact;
