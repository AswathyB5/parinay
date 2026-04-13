import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext, isVideoUrl, renderText, resolveMediaURL, API } from '../context/ContentContext';

const About = () => {
    const { content } = useContext(ContentContext);
    const about = content.about;
    const home = content.home;

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
                alert('Thank you for contacting Parinay Weddings. Our team will review your requirements and get in touch within 24 hours via WhatsApp and Email.');
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
                        </div>
                        <div className="about-intro-img reveal">
                            {isVideoUrl(about.introImage) ? (
                                <video src={resolveMediaURL(about.introImage)} autoPlay muted loop playsInline />
                            ) : (
                                <img src={resolveMediaURL(about.introImage)} alt="Who we are" />
                            )}
                        </div>
                    </div>

                    {/* Lower Values Grid */}
                    <div className="values-grid-new">
                        <div className="value-card-new">
                            <h3>{renderText(about.value1Title)}</h3>
                            <p>{renderText(about.value1Desc)}</p>
                        </div>
                        <div className="value-card-new">
                            <h3>{renderText(about.value2Title)}</h3>
                            <p>{renderText(about.value2Desc)}</p>
                        </div>
                        <div className="value-card-new">
                            <h3>{renderText(about.value3Title)}</h3>
                            <p>{renderText(about.value3Desc)}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PHILOSOPHY SECTION */}
            {about.philosophyQuote && (
                <section className="about-philosophy-new reveal" style={{ padding: '120px 0', textAlign: 'center', backgroundColor: '#fff' }}>
                    <div className="container">
                        <span className="section-label" style={{ marginBottom: '30px', display: 'block' }}>{about.philosophySubtitle || "THE PROMISE"}</span>
                        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                            <h2 style={{ 
                                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', 
                                fontFamily: 'Playfair Display, serif',
                                lineHeight: '1.4',
                                fontStyle: 'italic',
                                fontWeight: '400',
                                color: 'var(--primary-color)',
                                marginBottom: '40px'
                            }}>
                                "{about.philosophyQuote}"
                            </h2>
                            <span style={{ 
                                fontSize: '0.9rem', 
                                letterSpacing: '0.3em', 
                                textTransform: 'uppercase', 
                                color: '#555',
                                display: 'block'
                            }}>
                                — {about.philosophyAuthor || "The Parinay Promise"}
                            </span>
                        </div>
                    </div>
                </section>
            )}

            {/* ABOUT CONTENT SECTION (Replaces Visionary) */}
            <section className="about-founder-new reveal">
                <div className="founder-image">
                    {isVideoUrl(about.differentiatorImage) ? (
                        <video src={resolveMediaURL(about.differentiatorImage)} autoPlay muted loop playsInline />
                    ) : (
                        <img src={resolveMediaURL(about.differentiatorImage)} alt="About Parinay" />
                    )}
                </div>
                <div className="founder-content">
                    <span className="section-label">{about.differentiatorLabel}</span>
                    <h2>
                        {about.differentiatorHeading.split(' ').slice(0, 2).join(' ')} <em>{about.differentiatorHeading.split(' ').slice(2).join(' ')}</em>
                    </h2>
                    <div className="intro-text" style={{ marginTop: '30px', opacity: 0.9 }}>
                        {renderText(about.differentiatorText)}
                    </div>
                </div>
            </section>

            {/* TEAM SECTION */}
            <section className="about-team-grid reveal" style={{ padding: '140px 0', backgroundColor: '#FDFBF7' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <span className="section-label">{about.teamLabel || "MEET THE EXPERTS"}</span>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'var(--primary-color)', marginTop: '20px' }}>
                            {about.teamHeading || "Our Professional Team"}
                        </h2>
                        <p style={{ maxWidth: '600px', margin: '30px auto 0', color: '#555', lineHeight: '1.8' }}>
                            {renderText(about.teamSubtext)}
                        </p>
                    </div>

                    <div className="team-members-flex" style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                        gap: '40px' 
                    }}>
                        {about.teamMembers?.filter(m => m.name && m.name.trim()).map((member, idx) => (
                            <div key={member.id || idx} className="about-team-card reveal" style={{ transitionDelay: `${idx * 0.1}s`, textAlign: 'center' }}>
                                <div className="about-team-img-wrap" style={{ height: '400px', overflow: 'hidden', marginBottom: '25px', position: 'relative' }}>
                                    {isVideoUrl(member.image) ? (
                                        <video src={resolveMediaURL(member.image)} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <img src={resolveMediaURL(member.image)} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )}
                                </div>
                                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '8px' }}>{renderText(member.name)}</h3>
                                <p style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888' }}>{renderText(member.role)}</p>
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
                        <source src={resolveMediaURL(about.ctaVideoUrl || '/about-video.mp4')} type="video/mp4" />
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
                                {home.formHeading.split(' ').slice(0, 1).join(' ')} <br />
                                <em>{home.formHeading.split(' ').slice(1).join(' ')}</em>
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
