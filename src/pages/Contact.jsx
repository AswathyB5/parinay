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
            const url = `${API}/api/inquiries`;
            console.log('[Contact Form] Submitting to:', url);
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            console.log('[Contact Form] Response status:', res.status);
            const data = await res.json().catch(() => ({}));

            if (data.success) {
                console.log('[Contact Form] SUCCESS');
                setPopup({
                    open: true,
                    title: 'Thank You!',
                    message: 'We have received your inquiry. Our team will get back to you shortly.',
                    type: 'success'
                });
                formEl.reset();
            } else {
                console.warn('[Contact Form] FAILED:', data);
                setPopup({
                    open: true,
                    title: 'Submission Failed',
                    message: data.error || 'Something went wrong. Please try again.',
                    type: 'error'
                });
            }
        } catch (err) {
            console.error('[Contact Form] FETCH ERROR:', err);
            setPopup({
                open: true,
                title: 'Connection Issue',
                message: 'Could not reach the server right now. Please check your internet and try again.',
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
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999999,
                    backdropFilter: 'blur(10px)',
                    padding: '20px'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '440px',
                        background: 'linear-gradient(155deg, #fffdf8 0%, #fff3df 45%, #f8f1e8 100%)',
                        borderRadius: '24px',
                        padding: '45px 35px',
                        textAlign: 'center',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                        borderTop: `8px solid ${popup.type === 'success' ? '#3a1219' : '#9e2a2b'}`,
                        borderLeft: '1px solid rgba(197,160,89,0.3)',
                        borderRight: '1px solid rgba(197,160,89,0.3)',
                        borderBottom: '1px solid rgba(197,160,89,0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ 
                            fontSize: '3.5rem', 
                            marginBottom: '20px',
                            color: popup.type === 'success' ? '#3a1219' : '#9e2a2b'
                        }}>
                            {popup.type === 'success' ? '✓' : '⚠'}
                        </div>
                        <h2 style={{ 
                            fontFamily: 'Playfair Display, serif', 
                            fontSize: '2.2rem', 
                            color: popup.type === 'success' ? '#3a1219' : '#540b0e', 
                            marginBottom: '15px' 
                        }}>
                            {popup.title}
                        </h2>
                        <p style={{ 
                            fontSize: '1.15rem', 
                            color: '#4f5c56', 
                            lineHeight: '1.6', 
                            marginBottom: '35px' 
                        }}>
                            {popup.message}
                        </p>
                        <button 
                            onClick={() => setPopup({ open: false, title: '', message: '', type: '' })}
                            className="pw-btn pw-btn--dark"
                            style={{ 
                                width: '100%', 
                                padding: '18px', 
                                borderRadius: '12px',
                                backgroundColor: '#3a1219',
                                border: 'none',
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                            }}
                        >
                            {popup.type === 'success' ? 'Perfect' : 'Try Again'}
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
