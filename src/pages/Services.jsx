import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext } from '../context/ContentContext';

const Services = () => {
    const { content } = useContext(ContentContext);
    const home = content.home;
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
                        <span className="section-label" style={{ letterSpacing: '0.3em' }}>OUR SPECIALIZATIONS</span>
                        <h2 className="intro-heading" style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', marginTop: '20px' }}>The Art of Celebration</h2>
                    </div>

                    {[
                        {
                            number: '01',
                            title: 'Full Planning',
                            subtitle: 'FLAWLESS EXECUTION',
                            desc: 'From initial concept to your final dance, we manage every single detail of your celebration, leaving you free to enjoy the journey of becoming one.',
                            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
                        },
                        {
                            number: '02',
                            title: 'Design & Styling',
                            subtitle: 'VISUAL STORYTELLING',
                            desc: 'We create a cohesive visual narrative for your wedding, including custom mood boards, floral direction, ambient lighting, and bespoke decor elements.',
                            image: 'https://static.showit.co/800/YNqzxslHRcyKhjuN9mJPfg/119763/elegant-tablescape-portugal-destination-wedding.jpg'
                        },
                        {
                            number: '03',
                            title: 'Destination',
                            subtitle: 'SCOUTING & LOGISTICS',
                            desc: 'We help you find the perfect backdrop for your love story, from hidden coastal gems to world-renowned luxury manor houses and estates.',
                            image: 'https://assets.zeezest.com/blogs/PROD_goa%20wedding%20venues_1698773064171.jpg'
                        },
                        {
                            number: '04',
                            title: 'Hospitality',
                            subtitle: 'GUEST EXPERIENCE',
                            desc: 'Comprehensive management of your loved ones travel, accommodation, and curated welcome experiences, ensuring they feel as valued as you do.',
                            image: 'https://images.squarespace-cdn.com/content/v1/65f07a6bb920a639725145b7/1727446736382-BZ6LLFXT3559SS2G8NFR/7D6C6468.jpg'
                        }
                    ].map((s, idx) => (
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
                                }}>{s.subtitle}</span>

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
                    <span className="section-label">How We Work</span>
                    <h2 className="intro-heading">A Structured, Calm Planning Process</h2>
                </div>
            </section>

            {/* PROCESS GRID SECTION */}
            <section className="process-section reveal">
                <div className="container">
                    <div className="process-grid">
                        {/* Process 1 */}
                        <div className="process-card reveal">
                            <span className="process-number">01</span>
                            <h3 className="process-title">Understanding Your Vision</h3>
                            <p className="process-desc">We begin by listening - understanding your priorities, preferences and expectations</p>
                        </div>

                        {/* Process 2 */}
                        <div className="process-card reveal">
                            <span className="process-number">02</span>
                            <h3 className="process-title">Planning & Designing</h3>
                            <p className="process-desc">We create timelines and custom designs aligned with your vision</p>
                        </div>

                        {/* Process 3 */}
                        <div className="process-card reveal">
                            <span className="process-number">03</span>
                            <h3 className="process-title">Coordination & Execution</h3>
                            <p className="process-desc">Our team manages every detail on ground, ensuring the celebration flows smoothly</p>
                        </div>

                        {/* Process 4 */}
                        <div className="process-card reveal">
                            <span className="process-number">04</span>
                            <h3 className="process-title">You Celebrate, We Manage</h3>
                            <p className="process-desc">You stay present with your loved ones while we handle everything behind the scenes.</p>
                        </div>
                    </div>
                </div>
            </section>


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
                        backgroundImage: "linear-gradient(rgba(18, 53, 36, 0.6), rgba(18, 53, 36, 0.6)), url('https://static.vecteezy.com/system/resources/previews/036/616/104/large_2x/a-young-wedding-couple-enjoys-romantic-moments-against-the-background-of-a-summer-forest-in-a-park-bride-in-white-wedding-dress-groom-in-white-shirt-waistcoat-and-bow-tie-hug-and-kiss-bride-photo.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        pointerEvents: 'none'
                    }}></div>
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', marginBottom: '20px', color: '#fff' }}>
                        Let’s Begin Planning Your Wedding
                    </h2>
                    <p style={{ maxWidth: '700px', margin: '0 auto 40px', fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.9)' }}>
                        If you’re looking for a wedding planning partner who combines experience, creativity and reliability, we’d love to connect.
                    </p>
                    <Link to="/contact" className="btn btn-primary" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--primary-color)', padding: '15px 40px' }}>
                        Book a Wedding Consultation
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
        </div>
    );
};

export default Services;
