import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext } from '../context/ContentContext';

const Services = () => {
    const { content } = useContext(ContentContext);
    const home = content.home;
    const services = content.services;
    const testimonials = home.testimonials || [];

    // Build the 4 service entries from content.services
    const serviceItems = [
        { number: '01', label: services.service1Label, title: services.service1Heading, desc: services.service1Desc, image: services.service1Image },
        { number: '02', label: services.service2Label, title: services.service2Heading, desc: services.service2Desc, image: services.service2Image },
        { number: '03', label: services.service3Label, title: services.service3Heading, desc: services.service3Desc, image: services.service3Image },
        { number: '04', label: services.service4Label, title: services.service4Heading, desc: services.service4Desc, image: services.service4Image },
    ];

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
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Thank you for your inquiry. Our team will get back to you shortly.');
            e.target.reset();
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }, 1500);
    };

    return (
        <div className="services-page-new">
            {/* HERO SECTION */}
            <section className="services-hero">
                <div className="container reveal">
                    <h1>SERVICES</h1>
                </div>
            </section>

            {/* NEW PREMIUM SERVICES LISTING (Matching Home Transition Style) */}
            <section className="services-listing-premium" style={{ backgroundColor: '#FDFBF7', padding: '160px 0', overflow: 'hidden' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '120px' }}>
                        <span className="section-label" style={{ letterSpacing: '0.3em' }}>{services.servicesListLabel || 'OUR SPECIALIZATIONS'}</span>
                        <h2 className="intro-heading" style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', marginTop: '20px' }}>{services.servicesListHeading || 'The Art of Celebration'}</h2>
                    </div>

                    {serviceItems.map((s, idx) => (
                        <div key={idx} className="reveal" style={{
                            display: 'flex',
                            flexDirection: idx % 2 === 0 ? 'row' : 'row-reverse',
                            alignItems: 'center',
                            gap: '100px',
                            marginBottom: '180px',
                            position: 'relative'
                        }}>
                            {/* IMAGE CONTAINER with Floating Effect */}
                            <div style={{ flex: '1.2', position: 'relative' }}>
                                <div style={{
                                    width: '100%',
                                    height: '600px',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    <img
                                        src={s.image}
                                        alt={s.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>
                                {/* Floating Accent Square */}
                                <div style={{
                                    position: 'absolute',
                                    top: '40px',
                                    left: idx % 2 === 0 ? '-40px' : '40px',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'var(--primary-color)',
                                    border: '6px solid var(--accent-color)',
                                    zIndex: -1
                                }}></div>
                            </div>

                            {/* TEXT CONTAINER with Overlap Potential */}
                            <div style={{
                                flex: '1',
                                textAlign: 'left',
                                paddingLeft: idx % 2 === 0 ? '0' : '40px',
                                paddingRight: idx % 2 === 0 ? '40px' : '0'
                            }}>
                                <span style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--accent-color)',
                                    letterSpacing: '0.3em',
                                    fontWeight: '700',
                                    display: 'block',
                                    marginBottom: '20px'
                                }}>{s.label}</span>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                                    <span style={{
                                        fontFamily: 'Playfair Display, serif',
                                        fontSize: '4rem',
                                        color: 'var(--primary-color)',
                                        opacity: '0.1',
                                        lineHeight: '1'
                                    }}>{s.number}</span>
                                    <h3 style={{
                                        fontSize: '3.5rem',
                                        margin: '0 0 30px',
                                        color: 'var(--primary-color)',
                                        fontFamily: 'Playfair Display, serif',
                                        lineHeight: '1'
                                    }}>{s.title}</h3>
                                </div>

                                <p style={{
                                    fontSize: '1.2rem',
                                    lineHeight: '2',
                                    color: '#555',
                                    maxWidth: '500px',
                                    fontWeight: '300'
                                }}>{s.desc}</p>

                                <div style={{
                                    width: '60px',
                                    height: '2px',
                                    backgroundColor: 'var(--accent-color)',
                                    marginTop: '40px'
                                }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* INTRO TEXT */}
            <section className="intro-section reveal">
                <div className="container">
                    <span className="section-label">{services.processLabel || 'How We Work'}</span>
                    <h2 className="intro-heading">{services.processHeading || 'A Structured, Calm Planning Process'}</h2>
                </div>
            </section>

            {/* PROCESS GRID SECTION */}
            <section className="process-section reveal">
                <div className="container">
                    <div className="process-grid">
                        <div className="process-card reveal">
                            <span className="process-number">01</span>
                            <h3 className="process-title">{services.process1Title || 'Understanding Your Vision'}</h3>
                            <p className="process-desc">{services.process1Desc}</p>
                        </div>
                        <div className="process-card reveal">
                            <span className="process-number">02</span>
                            <h3 className="process-title">{services.process2Title || 'Planning & Designing'}</h3>
                            <p className="process-desc">{services.process2Desc}</p>
                        </div>
                        <div className="process-card reveal">
                            <span className="process-number">03</span>
                            <h3 className="process-title">{services.process3Title || 'Coordination & Execution'}</h3>
                            <p className="process-desc">{services.process3Desc}</p>
                        </div>
                        <div className="process-card reveal">
                            <span className="process-number">04</span>
                            <h3 className="process-title">{services.process4Title || 'You Celebrate, We Manage'}</h3>
                            <p className="process-desc">{services.process4Desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMPREHENSIVE SERVICES LISTING */}
            {services.comprehensiveList && (
                <section className="comprehensive-services reveal" style={{ padding: '120px 0', background: '#fff' }}>
                    <div className="container">
                        <div style={{ maxWidth: '900px', margin: '0 auto 80px', textAlign: 'center' }}>
                            <h2 style={{ 
                                fontFamily: 'Playfair Display, serif', 
                                fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                                color: 'var(--primary-color)',
                                marginBottom: '40px'
                            }}>{services.comprehensiveHeading}</h2>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#1d3528', marginBottom: '25px', fontWeight: '400' }}>
                                {services.comprehensiveIntro1}
                            </p>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#1d3528', fontWeight: '400' }}>
                                {services.comprehensiveIntro2}
                            </p>
                        </div>

                        <div className="comprehensive-grid" style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gap: '80px 80px',
                            marginTop: '100px'
                        }}>
                            {services.comprehensiveList.map((item, idx) => (
                                <div key={idx} className="reveal" style={{ 
                                    position: 'relative', 
                                    paddingTop: '30px', 
                                    paddingLeft: '10px' 
                                }}>
                                    <span style={{ 
                                        position: 'absolute',
                                        top: '-10px',
                                        left: '-55px',
                                        width: '80px',
                                        textAlign: 'center',
                                        fontSize: '4.8rem',
                                        fontFamily: 'Playfair Display, serif',
                                        color: 'var(--accent-color)',
                                        opacity: '0.22',
                                        lineHeight: '1',
                                        zIndex: 0,
                                        fontWeight: '700'
                                    }}>{idx + 1}</span>
                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <h3 style={{ 
                                            fontSize: '1.5rem', 
                                            color: '#123524',
                                            marginBottom: '15px',
                                            fontFamily: 'Playfair Display, serif',
                                            fontWeight: '600'
                                        }}>
                                            {item.title}
                                        </h3>
                                        <div style={{ 
                                            width: '40px', 
                                            height: '2px', 
                                            backgroundColor: 'var(--accent-color)',
                                            marginBottom: '20px'
                                        }}></div>
                                        <p style={{ 
                                            fontSize: '1.05rem', 
                                            lineHeight: '1.8', 
                                            color: '#444',
                                            fontWeight: '400',
                                            maxWidth: '90% '
                                        }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}


            {/* CTA SECTION */}
            <section className="about-cta-section services-cta" style={{
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1
            }}>
                {/* Fixed Background Context via Clip-Path */}
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
                        backgroundImage: `linear-gradient(rgba(18, 53, 36, 0.6), rgba(18, 53, 36, 0.6)), url('${services.ctaImage || 'https://static.vecteezy.com/system/resources/previews/036/616/104/large_2x/a-young-wedding-couple-enjoys-romantic-moments-against-the-background-of-a-summer-forest-in-a-park-bride-in-white-wedding-dress-groom-in-white-shirt-waistcoat-and-bow-tie-hug-and-kiss-bride-photo.jpg'}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        pointerEvents: 'none'
                    }}></div>
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', marginBottom: '20px', color: '#fff' }}>
                        {services.ctaHeading || "Let's Begin Planning Your Wedding"}
                    </h2>
                    <p style={{ maxWidth: '700px', margin: '0 auto 40px', fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.9)' }}>
                        {services.ctaDesc || "If you’re looking for a wedding planning partner who combines experience, creativity and reliability, we’d love to connect."}
                    </p>
                    <Link to={services.ctaBtnUrl || "/contact"} className="btn btn-primary" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--primary-color)', padding: '15px 40px' }}>
                        {services.ctaBtnText || "Book a Wedding Consultation"}
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
                                {testimonials[currentTestimonial]?.text}
                            </p>
                        </div>

                        <div className="pw-testimonials__author">
                            <div className="pw-testimonials__author-line"></div>
                            <div className="pw-testimonials__author-flex">
                                <div className="pw-testimonials__author-img">
                                    <img
                                        src={testimonials[currentTestimonial]?.image}
                                        alt={testimonials[currentTestimonial]?.author}
                                    />
                                </div>
                                <div className="pw-testimonials__author-info">
                                    <strong>{testimonials[currentTestimonial]?.author}</strong>
                                    <span>{testimonials[currentTestimonial]?.location}</span>
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
                                {home.formHeading?.split(' ').slice(0, 1).join(' ')} <br />
                                <em>{home.formHeading?.split(' ').slice(1).join(' ')}</em>
                            </h2>
                            <p className="pw-form-wrap__sub">{home.formSubtext}</p>
                        </div>

                        <form className="pw-form" onSubmit={handleFormSubmit}>
                            <div className="pw-form__grid">
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Full Name</label>
                                    <input type="text" className="pw-form__input" placeholder="Your full name" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Email Address</label>
                                    <input type="email" className="pw-form__input" placeholder="your@email.com" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Phone Number</label>
                                    <input type="tel" className="pw-form__input" placeholder="+91 00000 00000" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Wedding Location</label>
                                    <input type="text" className="pw-form__input" placeholder="e.g. Kerala, Goa, Udaipur" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Approx. Guest Count</label>
                                    <input type="number" className="pw-form__input" placeholder="Number of guests" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Wedding Date</label>
                                    <input type="date" className="pw-form__input" required />
                                </div>
                                <div className="pw-form__field" style={{ gridColumn: 'span 2' }}>
                                    <label className="pw-form__label">Your Expectations</label>
                                    <textarea className="pw-form__input" rows="4" placeholder="Briefly describe your vision and what you expect from us..." required></textarea>
                                </div>
                            </div>
                            <button type="submit" className="pw-btn pw-btn--dark btn-submit" style={{ marginTop: '50px', width: '100%' }}>
                                {home.formBtnText}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
