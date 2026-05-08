import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext, isVideoUrl, renderText, resolveMediaURL, API } from '../context/ContentContext';

const Services = () => {
    const { content } = useContext(ContentContext);
    const home = content.home;
    const services = content.services;
    const testimonials = home.testimonials || [];
    const [popup, setPopup] = useState({ open: false, title: '', message: '' });
    const todayStr = new Date().toISOString().split('T')[0];

    // --- Testimonial Carousel Logic ---
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        if (testimonials.length === 0) return;
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

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
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!payload.email.trim()) return 'Please enter your email address.';
        if (!emailRegex.test(payload.email)) return 'Please enter a valid email address.';
        
        if (payload.phone && payload.phone.trim()) {
            const phoneDigits = payload.phone.replace(/\D/g, '');
            if (phoneDigits.length < 10) return 'Please enter a valid phone number.';
        }

        if (!payload.message.trim()) return 'Please provide some details about your wedding.';
        if (payload.message.trim().length < 10) return 'Please tell us a bit more so we can help you better.';
        
        return null;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        const formEl = e.target;
        const payload = {
            type: 'contact',
            name: formEl.fullName?.value || '',
            email: formEl.email?.value || '',
            phone: formEl.phone?.value || '',
            weddingLocation: formEl.weddingLocation?.value || '',
            guestCount: formEl.guestCount?.value || '',
            weddingDate: formEl.weddingDate?.value || '',
            message: formEl.message?.value || '',
        };

        const validationError = validateForm(payload);
        if (validationError) {
            setPopup({
                open: true,
                title: 'Information Needed',
                message: validationError,
            });
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        try {
            const res = await fetch(`${API}/api/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                setPopup({
                    open: true,
                    title: 'Thank You!',
                    message: 'Thank you for your quote request. We will get back to you shortly.',
                });
                formEl.reset();
            } else {
                setPopup({
                    open: true,
                    title: 'Submission Failed',
                    message: data.error || 'Something went wrong. Please try again.',
                });
            }
        } catch {
            setPopup({
                open: true,
                title: 'Connection Issue',
                message: 'Could not reach the server right now. Please try again in a moment.',
            });
        }

        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    };

    return (
        <div className="services-page-new">
            {popup.open && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(8, 16, 13, 0.62)',
                    backdropFilter: 'blur(3px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20000,
                    padding: '20px',
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '460px',
                        background: 'linear-gradient(155deg, #fffdf8 0%, #fff3df 45%, #f8f1e8 100%)',
                        borderRadius: '22px',
                        padding: '32px 28px',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.35) inset',
                        textAlign: 'center',
                        border: '2px solid rgba(197,160,89,0.55)',
                        position: 'relative',
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '5px',
                            borderTopLeftRadius: '20px',
                            borderTopRightRadius: '20px',
                            background: 'linear-gradient(90deg, #1d3528 0%, #c5a059 50%, #1d3528 100%)',
                        }}></div>
                        <div style={{ fontSize: '2rem', marginBottom: '10px', filter: 'drop-shadow(0 3px 6px rgba(197,160,89,0.35))' }}>💍</div>
                        <h3 style={{ margin: '0 0 12px', color: 'var(--primary-color)', fontFamily: "'Playfair Display', serif" }}>{popup.title}</h3>
                        <p style={{ margin: 0, color: '#4f5c56', lineHeight: 1.7 }}>{popup.message}</p>
                        <button
                            type="button"
                            className="pw-btn pw-btn--dark"
                            style={{ marginTop: '24px', minWidth: '140px' }}
                            onClick={() => setPopup({ open: false, title: '', message: '' })}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {/* HERO SECTION */}
            <section className="services-hero">
                <div className="container reveal">
                    <h1>{renderText(services.pageBannerTitle || "SERVICES")}</h1>
                </div>
            </section>

            {/* COMPREHENSIVE SERVICES LISTING (Redesigned with Images) */}
            {services.comprehensiveList && (
                <section className="comprehensive-services" style={{ background: '#FDFBF7' }}>
                    <div className="container">
                        <div style={{ maxWidth: '900px', margin: '0 auto 100px', textAlign: 'center' }}>
                                <span className="section-label" style={{ letterSpacing: '0.4em', display: 'block', marginBottom: '20px' }}>{renderText('END-TO-END CURATION')}</span>
                                <h2 style={{ 
                                     fontFamily: 'Playfair Display, serif', 
                                     fontSize: 'clamp(2.5rem, 4.5vw, 3.8rem)', 
                                     color: 'var(--primary-color)',
                                     marginBottom: '40px',
                                     textTransform: 'uppercase',
                                     letterSpacing: '0.05em'
                                 }}>{renderText(services.comprehensiveHeading)}</h2>
                                <p style={{ fontSize: '1.25rem', lineHeight: '1.9', color: '#1d3528', marginBottom: '30px', fontWeight: '400', fontStyle: 'italic', fontFamily: 'Playfair Display, serif' }}>
                                    {renderText(services.comprehensiveIntro1)}
                                </p>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555', fontWeight: '400', maxWidth: '700px', margin: '0 auto' }}>
                                    {renderText(services.comprehensiveIntro2)}
                                </p>
                        </div>

                        <div className="comprehensive-grid">
                            {services.comprehensiveList.map((item, idx) => {
                                const placeholderImages = [
                                    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800", // Strategy
                                    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800", // Venue
                                    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800", // Design
                                    "https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&q=80&w=800", // Vendor
                                    "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&q=80&w=800", // Guest
                                    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800", // Event Production
                                    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800", // Entertainment
                                    "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80", // Styling
                                    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80"  // Day Coordination
                                ];
                                const imgUrl = item.image || placeholderImages[idx] || placeholderImages[0];
                                
                                return (
                                    <div key={idx} className="service-card">
                                        {/* Image Header */}
                                        <div style={{ height: '320px', overflow: 'hidden', position: 'relative' }}>
                                            {isVideoUrl(imgUrl) ? (
                                                <video src={resolveMediaURL(imgUrl)} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <img 
                                                    src={resolveMediaURL(imgUrl)} 
                                                    alt={item.title} 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }}
                                                    className="service-card-img"
                                                />
                                            )}
                                        </div>

                                        {/* Content Body */}
                                        <div style={{ padding: '40px 30px', flexGrow: 1, backgroundColor: '#fff' }}>
                                            <h3 style={{ 
                                                fontSize: '1.25rem', 
                                                color: 'var(--primary-color)',
                                                marginBottom: '15px',
                                                fontFamily: 'Playfair Display, serif',
                                                fontWeight: '600',
                                                letterSpacing: '0.01em',
                                                lineHeight: '1.2'
                                            }}>
                                                {renderText(item.title)}
                                            </h3>
                                            <div style={{ 
                                                width: '35px', 
                                                height: '2px', 
                                                backgroundColor: 'var(--accent-color)',
                                                marginBottom: '20px'
                                            }}></div>
                                            <p style={{ 
                                                fontSize: '0.95rem', 
                                                lineHeight: '1.7', 
                                                color: 'rgb(85, 85, 85)',
                                                fontWeight: '400',
                                                fontFamily: "'Outfit', sans-serif"
                                            }}>{renderText(item.desc)}</p>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* PROCESS TIMELINE SECTION */}
            <section className="process-timeline-section" style={{ padding: '80px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '50px' }} className="reveal">
                        <span className="section-label" style={{ letterSpacing: '0.4em', display: 'block', marginBottom: '15px' }}>
                            {renderText(services.processLabel || 'How We Work')}
                        </span>
                        <h2 style={{ 
                            fontFamily: 'Playfair Display, serif', 
                            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', 
                            color: 'var(--primary-color)',
                            marginBottom: '20px',
                            textTransform: 'uppercase'
                        }}>
                            {renderText(services.processHeading || 'A Structured, Calm Planning Process')}
                        </h2>
                    </div>

                    <div className="timeline-container">
                        <div className="timeline-line"></div>
                        {services.processItems && services.processItems.map((item, idx) => (
                            <div key={idx} className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}>
                                <div className="timeline-dot">
                                    <span>{idx + 1}</span>
                                </div>
                                <div className="timeline-content">
                                    <div className="timeline-card">
                                        <h3 className="timeline-title" style={{ marginBottom: '8px' }}>{renderText(item.title)}</h3>
                                        <div style={{ 
                                            width: '30px', 
                                            height: '2px', 
                                            backgroundColor: 'var(--accent-color)', 
                                            marginBottom: '10px',
                                            marginLeft: '0'
                                        }}></div>



                                        <p className="timeline-desc">
                                            {renderText(item.desc)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>






            {/* CTA SECTION */}
            <section className="about-cta-section services-cta" style={{
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    clipPath: 'inset(0)',
                    zIndex: -1,
                    pointerEvents: 'none'
                }}>
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        pointerEvents: 'none'
                    }}>
                        {isVideoUrl(services.ctaImage) ? (
                            <video src={resolveMediaURL(services.ctaImage)} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ 
                                width: '100%', 
                                height: '100%', 
                                backgroundImage: `linear-gradient(rgba(18, 53, 36, 0.6), rgba(18, 53, 36, 0.6)), url('${resolveMediaURL(services.ctaImage) || 'https://static.vecteezy.com/system/resources/previews/036/616/104/large_2x/a-young-wedding-couple-enjoys-romantic-moments-against-the-background-of-a-summer-forest-in-a-park-bride-in-white-wedding-dress-groom-in-white-shirt-waistcoat-and-bow-tie-hug-and-kiss-bride-photo.jpg'}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}></div>
                        )}
                    </div>
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', marginBottom: '20px', color: '#fff' }}>
                        {renderText(services.ctaHeading || "Let's Begin Planning Your Wedding")}
                    </h2>
                    <p style={{ maxWidth: '700px', margin: '0 auto 40px', fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-line' }}>
                        {renderText(services.ctaDesc || "If you’re looking for a wedding planning partner who combines experience, creativity and reliability, we’d love to connect.")}
                    </p>
                    <Link to={services.ctaBtnUrl || "/contact"} className="btn btn-primary" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--primary-color)', padding: '15px 40px' }}>
                        {renderText(services.ctaBtnText || "Book a Wedding Consultation")}
                    </Link>
                </div>
            </section>


            {/* ═══ SECTION 7: TESTIMONIALS ═══ */}
            <section className="pw-testimonials">
                <div className="pw-container">
                    <div className="pw-testimonials__inner">
                        <span className="pw-label pw-label--gold">{home.testimonialLabel || 'Testimonials'}</span>


                        <div className="pw-testimonials__author">
                            <div className="pw-testimonials__author-flex">
                                <div className="pw-testimonials__author-img">
                                    {isVideoUrl(testimonials[currentTestimonial]?.image) ? (
                                        <video src={resolveMediaURL(testimonials[currentTestimonial]?.image)} autoPlay muted loop playsInline />
                                    ) : (
                                        <img
                                            src={resolveMediaURL(testimonials[currentTestimonial]?.image)}
                                            alt={testimonials[currentTestimonial]?.author}
                                        />
                                    )}
                                </div>
                                <div className="pw-testimonials__author-info">
                                    <strong>{renderText(testimonials[currentTestimonial]?.author)}</strong>
                                    <span>{renderText(testimonials[currentTestimonial]?.location)}</span>
                                </div>
                            </div>
                            <div className="pw-testimonials__author-line" style={{ marginTop: '30px', marginBottom: '10px' }}></div>
                        </div>

                        <div className="pw-testimonials__quote-wrap">
                            <div className="pw-testimonials__quote-mark">"</div>
                            <p className="pw-testimonials__quote" key={currentTestimonial}>
                                {renderText(testimonials[currentTestimonial]?.text)}
                            </p>
                        </div>

                        <div className="pw-testimonials__dots">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    className={`pw-testimonials__dot ${currentTestimonial === i ? 'is-active' : ''}`}
                                    onClick={() => setCurrentTestimonial(i)}
                                    aria-label={`Testimonial ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 8: LEAD FORM ═══ */}
            <section className="pw-form-section" style={{ padding: '120px 0', background: '#fdfbf7' }}>
                <div className="pw-container">
                    <div className="pw-form-wrap reveal">
                        <div className="pw-form-wrap__left">
                            <span className="pw-label">{home.formLabel}</span>
                            <h2 className="pw-form-wrap__title">
                                {renderText(home.formHeading)}
                            </h2>
                            <p className="pw-form-wrap__sub">{renderText(home.formSubtext)}</p>
                        </div>

                        <form className="pw-form" onSubmit={handleFormSubmit}>
                            <div className="pw-form__grid">
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Full Name</label>
                                    <input type="text" name="fullName" className="pw-form__input" placeholder="Your full name" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Email Address</label>
                                    <input type="email" name="email" className="pw-form__input" placeholder="your@email.com" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Phone Number</label>
                                    <input type="tel" name="phone" className="pw-form__input" placeholder="+91 00000 00000" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Wedding Location</label>
                                    <input type="text" name="weddingLocation" className="pw-form__input" placeholder="e.g. Kerala, Goa, Udaipur" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Approx. Guest Count</label>
                                    <input type="number" name="guestCount" className="pw-form__input" placeholder="Number of guests" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Wedding Date</label>
                                    <input type="date" name="weddingDate" className="pw-form__input" min={todayStr} required />
                                </div>
                                <div className="pw-form__field" style={{ gridColumn: 'span 2' }}>
                                    <label className="pw-form__label">Your Expectations</label>
                                    <textarea name="message" className="pw-form__input" rows="4" placeholder="Briefly describe your vision and what you expect from us..." required></textarea>
                                </div>
                            </div>
                            <button type="submit" className="pw-btn pw-btn--dark btn-submit" style={{ marginTop: '50px', width: '100%' }}>
                                {renderText(home.formBtnText)}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
