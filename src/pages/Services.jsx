import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext, isVideoUrl, renderText, resolveMediaURL, API } from '../context/ContentContext';

const Services = () => {
    const { content } = useContext(ContentContext);
    const home = content.home;
    const services = content.services;
    const testimonials = home.testimonials || [];

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
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

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

        try {
            const res = await fetch(`${API}/api/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                alert('Thank you for your inquiry. Our team will get back to you shortly.');
                formEl.reset();
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch {
            alert('Could not reach the server. Please try again later.');
        }

        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    };

    return (
        <div className="services-page-new">
            {/* HERO SECTION */}
            <section className="services-hero">
                <div className="container reveal">
                    <h1>{renderText(services.pageBannerTitle || "SERVICES")}</h1>
                </div>
            </section>

            {/* COMPREHENSIVE SERVICES LISTING (Redesigned with Images) */}
            {services.comprehensiveList && (
                <section className="comprehensive-services reveal" style={{ padding: '100px 0 60px', background: '#FDFBF7' }}>
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

                        <div className="comprehensive-grid" style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gap: '60px 40px',
                            marginTop: '60px'
                        }}>
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
                                    <div key={idx} className="reveal delay-1" style={{ 
                                        position: 'relative',
                                        backgroundColor: '#fff',
                                        padding: '0',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
                                        transition: 'all 0.5s ease',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
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
                                                fontSize: '0.98rem', 
                                                lineHeight: '1.8', 
                                                color: '#555',
                                                fontWeight: '300'
                                            }}>{renderText(item.desc)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* INTRO TEXT */}
            <section className="intro-section reveal">
                <div className="container">
                    <span className="section-label">{renderText(services.processLabel || 'How We Work')}</span>
                    <h2 className="intro-heading">{renderText(services.processHeading || 'A Structured, Calm Planning Process')}</h2>
                </div>
            </section>

            {/* PROCESS GRID SECTION */}
            <section className="process-section reveal">
                <div className="container">
                    <div className="process-grid">
                        {services.processItems && services.processItems.map((item, idx) => (
                            <div key={idx} className="process-card reveal">
                                <span className="process-number">{(idx + 1).toString().padStart(2, '0')}</span>
                                <h3 className="process-title">{renderText(item.title)}</h3>
                                <p className="process-desc">
                                    {renderText(item.desc)}
                                </p>
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


                        <div className="pw-testimonials__quote-wrap">
                            <div className="pw-testimonials__quote-mark">"</div>
                            <p className="pw-testimonials__quote" key={currentTestimonial}>
                                {renderText(testimonials[currentTestimonial]?.text)}
                            </p>
                        </div>

                        <div className="pw-testimonials__author">
                            <div className="pw-testimonials__author-line"></div>
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
                                    <input type="date" name="weddingDate" className="pw-form__input" required />
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
