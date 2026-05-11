import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext, renderText, resolveMediaURL } from '../context/ContentContext';

const About = () => {
    const { content } = useContext(ContentContext);
    const about = content.about;
    const home = content.home;

    // --- Scroll Reveal Logic ---
    useEffect(() => {
        if (about.seoTitle) {
            document.title = about.seoTitle;
        }

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
    }, [content, about.seoTitle]);

    return (
        <div className="about-page-new">
            {/* HERO SECTION */}
            <section className="about-hero-new">
                <div className="container reveal">
                    <h1>{renderText(about.pageBannerTitle || "Our Story")}</h1>
                </div>
            </section>

            {/* ABOUT US (SPLIT INTRO) EXPLAINER SECTION */}
            <section className="about-values-new reveal" style={{ backgroundColor: '#FDFBF7' }}>
                <div className="container">
                    <div className="about-intro-split">
                        <div className="left-content">
                            <span className="section-label">{about.introLabel}</span>
                            <h2 className="large-heading">
                                {renderText(about.introHeading)}
                            </h2>
                            {about.introText && (
                                <div className="intro-paragraph" style={{ marginTop: '30px', color: '#4f5c56', lineHeight: 1.8, fontSize: '1.1rem' }}>
                                    {renderText(about.introText)}
                                </div>
                            )}
                        </div>
                        <div className="about-intro-img reveal">
                            <img src={resolveMediaURL('uploads/upload_1775897905550_6647.avif')} alt="Who we are" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT CONTENT SECTION (What makes us different) */}
            <section className="about-founder-new reveal">
                <div className="founder-image">
                    <img src={resolveMediaURL('https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80')} alt="About Parinay" />
                </div>
                <div className="founder-content">
                    <span className="section-label">{about.differentiatorLabel}</span>
                    <h2>
                        {renderText(about.differentiatorHeading)}
                    </h2>
                    <div className="intro-text" style={{ marginTop: '30px', opacity: 0.9 }}>
                        {renderText(about.differentiatorText)}
                    </div>
                </div>
            </section>

            {/* WHAT WE SPECIALISE IN SECTION */}
            <section className="about-values-new reveal" style={{ backgroundColor: '#FDFBF7', paddingTop: '100px' }}>
                <div className="container">
                    {about.specialities && (
                        <div className="values-grid-new">
                            <div style={{ width: '100%', gridColumn: '1 / -1', marginBottom: '20px' }}>
                                <span className="section-label">{about.specialitiesLabel || "WHAT WE SPECIALISE IN"}</span>
                                {about.specialitiesSubtext && (
                                    <h2 className="team-title" style={{ marginTop: '20px', marginBottom: '0px' }}>
                                        {renderText(about.specialitiesSubtext)}
                                    </h2>
                                )}
                            </div>
                            {about.specialities.map((item, idx) => (
                                <div key={item.id || idx} className="value-card-new reveal" style={{ transitionDelay: `${idx * 0.1}s` }}>
                                    <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>{renderText(item.title)}</h3>
                                    <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{renderText(item.desc)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* PHILOSOPHY SECTION */}
            {about.philosophyQuote && (
                <section className="about-philosophy-new reveal">
                    <div className="container">
                        <span className="section-label" style={{ marginBottom: '30px', display: 'block' }}>{renderText(about.philosophySubtitle || "THE PROMISE")}</span>
                        <div className="philosophy-quote-wrap">
                            <h2 className="philosophy-text">
                                "{renderText(about.philosophyQuote)}"
                            </h2>
                            <span className="philosophy-author">
                                — {renderText(about.philosophyAuthor || "The Parinay Promise")}
                            </span>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '50px' }}>
                            <Link to={about.promiseBtnUrl || "/contact"} className="pw-btn pw-btn--dark" style={{ minWidth: '280px' }}>
                                {about.promiseBtnText || "Begin Your Wedding Conversation →"}
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Stats Band */}
            <div className="pw-stats reveal">
                <div className="pw-stats__grid">
                    <div className="pw-stats__item">
                        <span className="pw-stats__icon">✦</span>
                        <span className="pw-stats__label">
                            {renderText(about.stat1Label || home.stat1Label)}
                        </span>
                    </div>
                    <div className="pw-stats__item">
                        <span className="pw-stats__icon">✦</span>
                        <span className="pw-stats__label">
                            {renderText(about.stat2Label || home.stat2Label)}
                        </span>
                    </div>
                    <div className="pw-stats__item">
                        <span className="pw-stats__icon">✦</span>
                        <span className="pw-stats__label">
                            {renderText(about.stat3Label || home.stat3Label)}
                        </span>
                    </div>
                    <div className="pw-stats__item">
                        <span className="pw-stats__icon">✦</span>
                        <span className="pw-stats__label">
                            {renderText(about.stat4Label || home.stat4Label)}
                        </span>
                    </div>
                </div>
            </div>

            {/* CTA SECTION */}
            <section className="about-cta-section" style={{ background: 'none', padding: '160px 0' }}>
                <div className="cta-video-bg-wrapper" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    overflow: 'hidden'
                }}>
                    <video
                        autoPlay loop muted playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        src={resolveMediaURL('/uploads/about-video.mp4')}
                    />
                    <div className="cta-video-overlay" style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.55))'
                    }}></div>
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <h2 style={{ color: '#fff', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '40px' }}>
                        {about.ctaHeading || "Ready to start your journey?"}
                    </h2>
                    <Link to={about.ctaBtnUrl || "/contact"} className="pw-btn pw-btn--gold" style={{ padding: '20px 45px' }}>
                        {about.ctaBtnText || "Get In Touch"}
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;
