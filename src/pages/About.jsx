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
                            <span className="section-label">ABOUT PARINAY</span>
                            <h2 className="large-heading">
                                Thoughtfully planned , <br />
                                beautifully executed.

                            </h2>
                        </div>
                        <div className="right-image">
                            <img src={about.heroImage} alt="Wedding Excellence" />
                        </div>
                    </div>

                    {/* Lower Values Grid */}
                    <div className="values-grid-new">
                        <div className="value-card-new">
                            <h3>Passion</h3>
                            <p>We are driven by the joy of creating beauty and meaning. Every wedding is a canvas for us to paint your unique love story with vibrant colors and heartfelt details.</p>
                        </div>
                        <div className="value-card-new">
                            <h3>Commitment</h3>
                            <p>Our dedication goes beyond planning; we are committed to your peace of mind. We stand by you at every step, ensuring a seamless and joyful journey.</p>
                        </div>
                        <div className="value-card-new">
                            <h3>Team Work</h3>
                            <p>Excellence is a shared effort. Our team of specialists works in perfect harmony, collaborating closely with you to bring your dream celebration to life.</p>
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


            {/* TEAM SECTION */}
            <section className="about-team-new reveal">
                <div className="container">
                    <span className="section-label">THE EXPERTS</span>
                    <h2 style={{ marginBottom: '20px' }}>Meet Our Professional Team</h2>
                    <p style={{ maxWidth: '800px', margin: '0 auto 60px', fontSize: '1.2rem', color: '#666', lineHeight: '1.8' }}>
                        Behind every Parinay wedding is a dedicated team of planners, coordinators, and creative professionals who work seamlessly together
                    </p>
                    <div className="team-grid-new">
                        {about.teamMembers.map((member) => (
                            <div key={member.id} className="team-card-new">
                                <div className="team-img-wrap-new">
                                    <img src={member.image} alt={member.name} />
                                </div>
                                <h3>{member.name}</h3>
                                <span>{member.role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="about-cta-section">
                <div className="container">
                    <h2>{about.ctaHeading || "Ready to start your journey?"}</h2>
                    <Link to={about.ctaBtnUrl || "/contact"} className="btn btn-primary" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--primary-color)' }}>
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
