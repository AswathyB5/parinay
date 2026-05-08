import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext, isVideoUrl, renderText, resolveMediaURL, API } from '../context/ContentContext';

const About = () => {
    const { content } = useContext(ContentContext);
    const about = content.about;
    const home = content.home;
    const [popup, setPopup] = useState({ open: false, title: '', message: '' });

    // --- Lead Form Logic ---
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('.btn-submit');
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
                setPopup({
                    open: true,
                    title: 'Thank You!',
                    message: 'Thank you for contacting Parinay Weddings. Our team will get back to you shortly.',
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
    }, [content]);

    return (
        <div className="about-page-new">
            {popup.open && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(8, 16, 13, 0.62)',
                    backdropFilter: 'blur(3px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
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
            <section className="about-hero-new">
                <div className="container reveal">
                    <h1>{renderText(about.pageBannerTitle || "About Us")}</h1>

                </div>
            </section>


            {/* ABOUT US (SPLIT INTRO) EXPLAINER SECTION */}
            <section className="about-values-new reveal" style={{ backgroundColor: '#FDFBF7' }}>
                <div className="container">
                    {/* Upper Split Design (inspired by Weddlin) */}
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
                            {isVideoUrl(about.introImage) ? (
                                <video key={resolveMediaURL(about.introImage)} src={resolveMediaURL(about.introImage)} autoPlay muted loop playsInline />
                            ) : (
                                <img src={resolveMediaURL(about.introImage)} alt="Who we are" />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT CONTENT SECTION (What makes us different) - FULL WIDTH GREEN BG */}
            <section className="about-founder-new reveal">
                <div className="founder-image">
                    {isVideoUrl(about.differentiatorImage) ? (
                        <video key={resolveMediaURL(about.differentiatorImage)} src={resolveMediaURL(about.differentiatorImage)} autoPlay muted loop playsInline />
                    ) : (
                        <img src={resolveMediaURL(about.differentiatorImage)} alt="About Parinay" />
                    )}
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
                    {/* Specialities Grid */}
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


            {/* TEAM SECTION */}
            <section className="about-team-grid reveal">
                <div className="container">
                    <div className="team-header">
                        <span className="section-label">{about.teamLabel || "MEET THE EXPERTS"}</span>
                        <h2 className="team-title">
                            {renderText(about.teamHeading)}
                        </h2>
                        <p className="team-subtext">
                            {renderText(about.teamSubtext)}
                        </p>
                    </div>

                    <div className="team-members-flex">
                        {about.teamMembers?.filter(m => m.name && m.name.trim()).map((member, idx) => (
                            <div key={member.id || idx} className="about-team-card reveal" style={{ transitionDelay: `${idx * 0.1}s` }}>
                                <div className="about-team-img-wrap">
                                    {isVideoUrl(member.image) ? (
                                        <video key={resolveMediaURL(member.image)} src={resolveMediaURL(member.image)} autoPlay muted loop playsInline />
                                    ) : (
                                        <img src={resolveMediaURL(member.image)} alt={member.name} />
                                    )}
                                </div>
                                <h3 className="member-name">{renderText(member.name)}</h3>
                                <p className="member-role">{renderText(member.role)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats — full width green band */}
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
                        key={resolveMediaURL(about.ctaVideoUrl || '/uploads/about-video.mp4')}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                        src={resolveMediaURL(about.ctaVideoUrl || '/uploads/about-video.mp4')}
                    />
                    <div className="cta-video-overlay" style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(rgba(29, 53, 40, 0.4), rgba(29, 53, 40, 0.6))'
                    }}></div>
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <h2 style={{ color: '#fff', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '40px' }}>
                        {about.ctaHeading || "Ready to start your journey?"}
                    </h2>
                    <Link to={about.ctaBtnUrl || "/contact"} className="btn btn-primary" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--primary-color)', padding: '20px 45px' }}>
                        {about.ctaBtnText || "Get In Touch"}
                    </Link>
                </div>
            </section>
            {/* ═══ SECTION 8: LEAD FORM ═══ */}
            <section className="pw-form-section" style={{ paddingTop: '100px', paddingBottom: '140px' }}>
                <div className="pw-container">
                    <div className="pw-form-wrap reveal">
                        <div className="pw-form-wrap__left">
                            <span className="pw-label">{home.formLabel}</span>
                            <h2 className="pw-form-wrap__title">
                                {renderText(home.formHeading)}
                            </h2>
                            <p className="pw-form-wrap__sub">{home.formSubtext}</p>
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
                                {home.formBtnText}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
