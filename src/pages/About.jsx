import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext } from '../context/ContentContext';

const About = () => {
    const { content } = useContext(ContentContext);
    const about = content.about;

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

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => revealElements.forEach(el => observer.unobserve(el));
    }, [content]);

    return (
        <div className="pw-page">
            {/* PAGE BANNER */}
            <section className="pw-page-banner">
                <div className="pw-container">
                    <h1 className="pw-page-banner__title">{about.pageBannerTitle}</h1>
                </div>
            </section>

            {/* DIFFERENTIATORS */}
            <section className="pw-intro reveal">
                <div className="pw-container pw-container--wide">
                    <div className="pw-intro__grid" style={{ gridTemplateColumns: '0.9fr 1.1fr' }}>
                        <div className="pw-intro__content" style={{ order: 1 }}>
                            <span className="pw-label">{about.differentiatorLabel}</span>
                            <h2 className="pw-intro__heading">
                                {about.differentiatorHeading.split(' ').slice(0, 2).join(' ')}<br />
                                <em>{about.differentiatorHeading.split(' ').slice(2).join(' ')}</em>
                            </h2>
                            <div className="pw-intro__divider"></div>
                            {about.differentiatorText.split('\n').map((para, i) => (
                                <p key={i} className="pw-intro__text">{para}</p>
                            ))}
                        </div>
                        <div className="pw-intro__images" style={{ order: 2 }}>
                            <div className="pw-intro__img-main-wrap">
                                <img src={about.differentiatorImage} alt="Difference" className="pw-intro__img-main" style={{ width: '100%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HERO SECTION */}
            <section className="pw-page-hero">
                <img src={about.heroImage} alt="Background" className="pw-page-hero__bg" />
                <div className="pw-container pw-page-hero__content reveal">
                    <h1 className="pw-page-hero__title" style={{ fontSize: '3.2rem', lineHeight: '1.2' }}>
                        {about.heroQuote.split('.')[0]}. <br />
                        <em>{about.heroQuote.split('.')[1]?.trim()}</em>
                    </h1>
                </div>
            </section>

            {/* TEAM SECTION */}
            <section className="pw-team reveal">
                <div className="pw-container">
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <span className="pw-label">{about.teamLabel}</span>
                        <h2 className="pw-section-header__title" style={{ fontSize: '3rem', marginBottom: '20px' }}>
                            {about.teamHeading}
                        </h2>
                        <p className="pw-intro__text" style={{ maxWidth: '800px', margin: '0 auto' }}>
                            {about.teamSubtext}
                        </p>
                    </div>

                    <div className="pw-team__grid">
                        {about.teamMembers.map((member) => (
                            <div key={member.id} className="pw-team__card">
                                <div className="pw-team__img-wrap">
                                    <img src={member.image} alt={member.name} className="pw-team__img" />
                                </div>
                                <h3 className="pw-team__name">{member.name}</h3>
                                <span className="pw-team__role">{member.role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STATS BAND */}
            <div className="pw-stats reveal">
                <div className="pw-stats__grid">
                    <div className="pw-stats__item">
                        <span className="pw-stats__icon">✦</span>
                        <span className="pw-stats__label">
                            {about.stat1Label?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                        </span>
                    </div>
                    <div className="pw-stats__item">
                        <span className="pw-stats__icon">✦</span>
                        <span className="pw-stats__label">
                            {about.stat2Label?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                        </span>
                    </div>
                    <div className="pw-stats__item">
                        <span className="pw-stats__icon">✦</span>
                        <span className="pw-stats__label">
                            {about.stat3Label?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                        </span>
                    </div>
                    <div className="pw-stats__item">
                        <span className="pw-stats__icon">✦</span>
                        <span className="pw-stats__label">
                            {about.stat4Label?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                        </span>
                    </div>
                </div>
            </div>

            {/* QUOTE & CTA */}
            <section className="pw-testimonials reveal" style={{ padding: '140px 0' }}>
                <div className="pw-container">
                    <div className="pw-testimonials__inner">
                        <div className="pw-testimonials__quote-wrap">
                            <div className="pw-testimonials__quote-mark">"</div>
                            <p className="pw-testimonials__quote">
                                {about.philosophyQuote}
                            </p>
                        </div>
                        <div className="pw-testimonials__author">
                            <div className="pw-testimonials__author-line"></div>
                            <div className="pw-testimonials__author-info">
                                <strong>{about.philosophyAuthor}</strong>
                                <span>{about.philosophySubtitle}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '80px', textAlign: 'center' }}>
                            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '30px' }}>
                                {about.ctaHeading}
                            </h2>
                            <Link to={about.ctaBtnUrl || '/contact'} className="pw-btn pw-btn--dark">
                                {about.ctaBtnText}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
