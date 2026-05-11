import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext, renderText, resolveMediaURL } from '../context/ContentContext';

const Journals = () => {
    const { content } = useContext(ContentContext);
    const { journals } = content;

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
        <div className="pw-page">
            {/* HERO SECTION */}
            <section className="about-hero-new">
                <div className="container reveal">
                    <h1>{renderText(journals.pageBannerTitle || "Our Journal")}</h1>
                </div>
            </section>

            {/* BLOG GRID */}
            <section className="pw-journal reveal" style={{ padding: '100px 0' }}>
                <div className="pw-container">
                    <div style={{ textAlign: 'center', marginBottom: '100px' }}>
                        <span className="pw-label">{journals.sectionLabel}</span>
                        <h2 className="pw-section-header__title pw-journal-header-title">
                            {renderText(journals.sectionTitle)}
                        </h2>
                    </div>

                    <div className="pw-journal__grid">
                        {journals.journalsList?.filter(item => item.title && item.title.trim()).map((item) => (
                            <Link key={item.id} to={`/journals/${item.id}`} className="pw-journal__card" style={{ textDecoration: 'none' }}>
                                <div className="pw-journal__img-wrap">
                                    <img src={resolveMediaURL(item.image)} alt={item.title} className="pw-journal__img" />
                                </div>
                                <span className="pw-journal__meta">{renderText(item.date)}</span>
                                <h3 className="pw-journal__title">{renderText(item.title)}</h3>
                                <p className="pw-journal__excerpt">{renderText(item.excerpt)}</p>
                                <span style={{ 
                                    display: 'inline-block',
                                    fontSize: '0.75rem', 
                                    color: 'var(--accent-color)', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.15em', 
                                    fontWeight: '700',
                                    marginTop: '15px' 
                                }}>{renderText(journals.readEntryText || "Read Entry —")}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* LEAD MAGNET / BOOK CTA */}
            <section className="pw-destination reveal" style={{ backgroundColor: '#fff', padding: '120px 0' }}>
                <div className="pw-container">
                    <div className="pw-destination__grid pw-guide-grid">
                        <div className="pw-destination__content" style={{ order: '2' }}>
                            <span className="pw-label" style={{ color: 'var(--primary-color)' }}>{journals.guideLabel}</span>
                            <h2 className="pw-destination__heading" style={{ color: 'var(--primary-color)' }}>
                                {journals.guideTitle.split(' ').slice(0, -2).join(' ')}<br />
                                <em style={{ color: 'var(--accent-color)' }}>{journals.guideTitle.split(' ').slice(-2).join(' ')}</em>
                            </h2>
                            <div className="pw-destination__divider" style={{ backgroundColor: 'rgba(58, 18, 25, 0.1)' }}></div>
                            <p className="pw-destination__text" style={{ color: '#666' }}>{journals.guideDesc}</p>
                            
                            <ul style={{ listStyle: 'none', padding: '0', marginTop: '30px', color: '#444', fontSize: '0.95rem' }}>
                                {journals.guideChecks?.map((item, idx) => (
                                    <li key={item.id || idx} style={{ marginBottom: '15px' }}>
                                        <i className="fas fa-check" style={{ color: 'var(--accent-color)', marginRight: '12px' }}></i> 
                                        {renderText(item.text)}
                                    </li>
                                ))}
                            </ul>

                            <Link to="/contact" className="pw-btn pw-btn--dark" style={{ marginTop: '20px' }}>{journals.guideRequestBtnText || 'Request Copy'}</Link>
                        </div>

                        <div className="pw-destination__images pw-guide-images-wrap">
                            <img src={resolveMediaURL(journals.guideImage)} className="pw-destination__img-main pw-guide-img" alt="Guide Book" />
                            <div className="pw-guide-year-box" style={{ background: 'var(--primary-color)' }}>
                                <h3 className="pw-guide-year-title" style={{ color: '#fff' }}>{renderText(journals.guideYear)}<br /><em>{renderText(journals.guidePlannerLabel)}</em></h3>
                                <p className="pw-guide-year-badge" style={{ color: 'var(--accent-color)' }}>{renderText(journals.guideFreeText)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Journals;

