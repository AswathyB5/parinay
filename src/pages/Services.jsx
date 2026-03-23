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

            {/* INTRO TEXT */}
            <section className="intro-section reveal">
                <div className="container">
                    <span className="intro-subheading">How We Work</span>
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
