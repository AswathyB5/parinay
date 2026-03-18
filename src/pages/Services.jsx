import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext } from '../context/ContentContext';

const Services = () => {
    const { content } = useContext(ContentContext);
    const services = content.services;

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

    // Helper to parse newline-delimited list strings
    const parseList = (str) => (str || '').split('\n').filter(Boolean);

    return (
        <div className="pw-page">
            {/* PAGE BANNER */}
            <section className="pw-page-banner">
                <div className="pw-container">
                    <h1 className="pw-page-banner__title">{services.pageBannerTitle}</h1>
                </div>
            </section>

            {/* SERVICES IN DETAIL */}
            <section className="pw-service-detail reveal">
                <div className="pw-container">
                    {/* Full Planning */}
                    <div className="pw-service-detail__row reveal">
                        <div className="pw-service-detail__img-wrap">
                            <img src={services.service1Image} alt={services.service1Heading} className="pw-service-detail__img" />
                        </div>
                        <div className="pw-service-detail__content">
                            <span className="pw-label">{services.service1Label}</span>
                            <h2>{services.service1Heading.split(' ').slice(0, -1).join(' ')} <em>{services.service1Heading.split(' ').slice(-1)}</em></h2>
                            <p>{services.service1Desc}</p>
                            <ul className="pw-service-detail__list">
                                {parseList(services.service1List).map((item, i) => (
                                    <li key={i}><i className="fas fa-check"></i> <span>{item}</span></li>
                                ))}
                            </ul>
                            <Link to={services.inquireBtnUrl || '/contact'} className="pw-btn pw-btn--outline" style={{ marginTop: '30px' }}>{services.inquireBtnText}</Link>
                        </div>
                    </div>

                    {/* Partial Planning */}
                    <div className="pw-service-detail__row reveal">
                        <div className="pw-service-detail__img-wrap">
                            <img src={services.service2Image} alt={services.service2Heading} className="pw-service-detail__img" />
                        </div>
                        <div className="pw-service-detail__content">
                            <span className="pw-label">{services.service2Label}</span>
                            <h2>{services.service2Heading.split(' ').slice(0, -1).join(' ')} <em>{services.service2Heading.split(' ').slice(-1)}</em></h2>
                            <p>{services.service2Desc}</p>
                            <ul className="pw-service-detail__list">
                                {parseList(services.service2List).map((item, i) => (
                                    <li key={i}><i className="fas fa-check"></i> <span>{item}</span></li>
                                ))}
                            </ul>
                            <Link to={services.inquireBtnUrl || '/contact'} className="pw-btn pw-btn--outline" style={{ marginTop: '30px' }}>{services.inquireBtnText}</Link>
                        </div>
                    </div>

                    {/* Month-Of Coordination */}
                    <div className="pw-service-detail__row reveal" style={{ marginBottom: 0 }}>
                        <div className="pw-service-detail__img-wrap">
                            <img src={services.service3Image} alt={services.service3Heading} className="pw-service-detail__img" />
                        </div>
                        <div className="pw-service-detail__content">
                            <span className="pw-label">{services.service3Label}</span>
                            <h2>{services.service3Heading.split(' ').slice(0, -1).join(' ')} <em>{services.service3Heading.split(' ').slice(-1)}</em></h2>
                            <p>{services.service3Desc}</p>
                            <ul className="pw-service-detail__list">
                                {parseList(services.service3List).map((item, i) => (
                                    <li key={i}><i className="fas fa-check"></i> <span>{item}</span></li>
                                ))}
                            </ul>
                            <Link to={services.inquireBtnUrl || '/contact'} className="pw-btn pw-btn--outline" style={{ marginTop: '30px' }}>{services.inquireBtnText}</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROCESS/METHOD */}
            <section className="pw-services reveal" style={{ padding: '120px 0', background: 'var(--primary-color)' }}>
                <div className="pw-container pw-container--wide">
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <span className="pw-label pw-label--light">{services.processLabel}</span>
                        <h2 className="pw-section-header__title" style={{ color: 'var(--secondary-color)', fontSize: '3rem' }}>
                            {services.processHeading.split(', ')[0]}, <em>{services.processHeading.split(', ')[1]}</em>
                        </h2>
                    </div>

                    <div className="pw-services__grid" style={{ height: 'auto', gap: '2px', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        {[
                            { num: '01', title: services.process1Title, desc: services.process1Desc },
                            { num: '02', title: services.process2Title, desc: services.process2Desc },
                            { num: '03', title: services.process3Title, desc: services.process3Desc },
                            { num: '04', title: services.process4Title, desc: services.process4Desc },
                        ].map((step) => (
                            <div key={step.num} className="pw-stats__item" style={{ background: 'var(--secondary-color)', padding: '50px 30px', textAlign: 'left', borderRight: 'none' }}>
                                <span className="pw-stats__val" style={{ fontSize: '2rem', display: 'block', marginBottom: '20px' }}>{step.num}</span>
                                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: 'var(--primary-color)', marginBottom: '15px' }}>{step.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="pw-cta reveal" style={{ padding: '120px 0', textAlign: 'center', background: 'var(--secondary-color)' }}>
                <div className="pw-container">
                    <h2 className="pw-section-header__title" style={{ fontSize: '3rem', marginBottom: '30px' }}>
                        {services.ctaHeading.split(' ').slice(0, -1).join(' ')} <em>{services.ctaHeading.split(' ').slice(-1)}</em>
                    </h2>
                    <p className="pw-intro__text" style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
                        {services.ctaDesc}
                    </p>
                    <Link to={services.ctaBtnUrl || '/contact'} className="pw-btn pw-btn--dark">{services.ctaBtnText}</Link>
                </div>
            </section>
        </div>
    );
};

export default Services;
