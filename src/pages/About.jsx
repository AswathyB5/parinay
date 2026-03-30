import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext } from '../context/ContentContext';

const About = () => {
    const { content } = useContext(ContentContext);
    const about = content.about;
    const home = content.home;

    // --- Lead Form Logic ---
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('.btn-submit');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Thank you for contacting Parinay Weddings. Our team will review your requirements and get in touch within 24 hours via WhatsApp and Email.');
            e.target.reset();
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }, 1500);
    };

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
        <div className="about-page-new">
            {/* HERO SECTION */}
            <section className="about-hero-new">
                <div className="container reveal">
                    <h1>{about.pageBannerTitle || "About Us"}</h1>
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
                                {about.introHeading.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line} <br />
                                    </React.Fragment>
                                ))}
                            </h2>
                        </div>
                        <div className="right-image">
                            <img src={about.heroImage} alt="Wedding Excellence" />
                        </div>
                    </div>

                    {/* Lower Values Grid */}
                    <div className="values-grid-new">
                        <div className="value-card-new">
                            <h3>{about.value1Title}</h3>
                            <p>{about.value1Desc}</p>
                        </div>
                        <div className="value-card-new">
                            <h3>{about.value2Title}</h3>
                            <p>{about.value2Desc}</p>
                        </div>
                        <div className="value-card-new">
                            <h3>{about.value3Title}</h3>
                            <p>{about.value3Desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT CONTENT SECTION (Replaces Visionary) */}
            <section className="about-founder-new reveal">
                <div className="founder-image">
                    <img src={about.differentiatorImage} alt="About Parinay" />
                </div>
                <div className="founder-content">
                    <span className="section-label">{about.differentiatorLabel}</span>
                    <h2>
                        {about.differentiatorHeading.split(' ').slice(0, 2).join(' ')} <em>{about.differentiatorHeading.split(' ').slice(2).join(' ')}</em>
                    </h2>
                    <div className="intro-text" style={{ marginTop: '30px', opacity: 0.9 }}>
                        {about.differentiatorText.split('\n').map((para, i) => (
                            <p key={i} style={{ marginBottom: '20px', lineHeight: '1.8' }}>{para}</p>
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
                            {home.stat1Label?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)}
                        </span>
                    </div>
                    <div className="pw-stats__item">
                        <span className="pw-stats__icon">✦</span>
                        <span className="pw-stats__label">
                            {home.stat2Label?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)}
                        </span>
                    </div>
                    <div className="pw-stats__item">
                        <span className="pw-stats__icon">✦</span>
                        <span className="pw-stats__label">
                            {home.stat3Label?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)}
                        </span>
                    </div>
                    <div className="pw-stats__item">
                        <span className="pw-stats__icon">✦</span>
                        <span className="pw-stats__label">
                            {home.stat4Label?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)}
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
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    >
                        <source src={about.ctaVideoUrl || '/about-video.mp4'} type="video/mp4" />
                    </video>
                    <div className="cta-video-overlay" style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(rgba(29, 53, 40, 0.4), rgba(29, 53, 40, 0.6))'
                    }}></div>
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <h2 style={{ color: '#fff', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '40px' }}>
                        {about.ctaHeading || "Ready to start your journey?"}
                    </h2>
                    <Link to={about.ctaBtnUrl || "/contact"} className="btn btn-primary" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--primary-color)', padding: '20px 45px' }}>
                        {about.ctaBtnText || "Get In Touch"}
                    </Link>
                </div>
            </section>
            {/* ═══ SECTION 8: LEAD FORM ═══ */}
            <section className="pw-form-section">
                <div className="pw-container">
                    <div className="pw-form-wrap reveal">
                        <div className="pw-form-wrap__left">
                            <span className="pw-label">{home.formLabel}</span>
                            <h2 className="pw-form-wrap__title">
                                {home.formHeading.split(' ').slice(0, 1).join(' ')} <br />
                                <em>{home.formHeading.split(' ').slice(1).join(' ')}</em>
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

export default About;
