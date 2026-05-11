import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext, isVideoUrl, resolveMediaURL, renderText } from '../context/ContentContext';
import './Gallery.css';

const Stories = ({ sectionKey = "storiesDestination" }) => {
    const { content } = useContext(ContentContext);
    const [activeFaq, setActiveFaq] = useState(null);

    // Safety guards for data access
    const stories = (content && content[sectionKey]) || (content && content.storiesDestination) || { storiesList: [] };
    const currentStoriesList = stories.storiesList || [];

    const home = (content && content.home) || { testimonials: [] };
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
        const observerOptions = { threshold: 0.08, rootMargin: '0px 0px -40px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, observerOptions);

        const timeoutId = setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            document.querySelectorAll('.reveal').forEach(el => observer.unobserve(el));
        };
    }, [content, sectionKey]);
    
    // --- SEO Logic ---
    useEffect(() => {
        document.title = stories.seoTitle || "Destination Weddings | Parinay Weddings";
        
        const metaDesc = document.querySelector('meta[name="description"]');
        const metaContent = stories.metaDescription || "Parinay Weddings plans fully customised destination weddings across Kerala and South India.";
        
        if (metaDesc) {
            metaDesc.setAttribute('content', metaContent);
        } else {
            const meta = document.createElement('meta');
            meta.name = "description";
            meta.content = metaContent;
            document.head.appendChild(meta);
        }
    }, [stories.seoTitle, stories.metaDescription]);

    return (
        <div className="pw-page">
            {/* PAGE BANNER */}
            <section className="about-hero-new">
                <div className="container reveal">
                    <h1>{stories.pageBannerTitle || "Gallery"}</h1>
                </div>
            </section>

            {stories.pageBannerSubtitle && (
                <section className="stories-intro reveal" style={{ padding: '80px 0 20px', textAlign: 'center' }}>
                    <div className="container">
                        <div style={{ 
                            fontSize: '1.25rem', 
                            color: 'rgb(85, 85, 85)', 
                            maxWidth: '850px', 
                            margin: '0 auto', 
                            lineHeight: '1.8',
                            fontStyle: 'italic',
                            fontWeight: '300'
                        }}>
                            {renderText(stories.pageBannerSubtitle)}
                        </div>
                    </div>
                </section>
            )}

            {stories.introH2 && (
                <section className="stories-extra reveal" style={{ padding: '80px 0 20px', backgroundColor: '#FDFBF7', position: 'relative' }}>
                    <div style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: '50%', 
                        transform: 'translateX(-50%)', 
                        width: '1px', 
                        height: '60px', 
                        background: 'linear-gradient(to bottom, var(--primary-color), transparent)' 
                    }}></div>
                    <div className="container" style={{ textAlign: 'center', maxWidth: '900px' }}>
                        <div style={{ color: 'var(--accent-color)', fontSize: '1.5rem', marginBottom: '30px', opacity: 0.8 }}>✦</div>
                        <h2 style={{ 
                            fontSize: 'clamp(2rem, 5vw, 3.2rem)', 
                            fontFamily: "'Playfair Display', serif", 
                            color: 'var(--primary-color)',
                            marginBottom: '40px',
                            lineHeight: '1.2'
                        }}>
                            {renderText(stories.introH2)}
                        </h2>
                        {stories.introBody && (
                            <div style={{ 
                                fontSize: '1.15rem', 
                                color: 'rgba(58, 18, 25, 0.8)', 
                                lineHeight: '1.9',
                                textAlign: 'center'
                            }}>
                                {renderText(stories.introBody)}
                            </div>
                        )}
                    </div>
                </section>
            )}


            {stories.listH2 && (
                <div className="container" style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '40px' }}>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: "'Playfair Display', serif", color: 'var(--primary-color)' }}>
                        {renderText(stories.listH2)}
                    </h2>
                </div>
            )}

            {/* WEDDLIN-STYLE STORY LIST */}
            <section className="wsl-section">
                {currentStoriesList.map((item, index) => {
                    const isEven = index % 2 === 0;
                    const displayImage = item.image || (item.galleryImages ? item.galleryImages.split('\n')[0].trim() : "");
                    const sentences = item.overview ? item.overview.split(/(?<=[.!?])\s+/) : [];
                    const displayDesc = sentences.length > 0 ? sentences[0] : item.desc;

                    return (
                        <React.Fragment key={item.id || index}>
                        <div
                            className={`wsl-item reveal ${isEven ? 'wsl-item--right' : 'wsl-item--left'}`}
                            style={{ transitionDelay: `${index * 0.07}s` }}
                        >
                            {/* Media — video autoplays muted, or fallback image */}
                            <div className="wsl-item__media">
                                {item.video ? (
                                    <video
                                        key={resolveMediaURL(item.video)}
                                        className="wsl-item__thumb"
                                        src={resolveMediaURL(item.video)}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        poster={resolveMediaURL(displayImage)}
                                    />
                                ) : isVideoUrl(displayImage) ? (
                                    <video
                                        key={resolveMediaURL(displayImage)}
                                        className="wsl-item__thumb"
                                        src={resolveMediaURL(displayImage)}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />
                                ) : (
                                    <img
                                        src={resolveMediaURL(displayImage)}
                                        alt={item.title}
                                        className="wsl-item__thumb"
                                    />
                                )}
                            </div>

                            {/* Info overlay box */}
                            <div className="wsl-item__box">
                                <span className="wsl-item__badge">{item.badge}</span>
                                <h2 className="wsl-item__title">{item.title}</h2>
                                <div className="wsl-item__meta">
                                    {item.date && (
                                        <span className="wsl-item__meta-item">
                                            <i className="far fa-calendar-alt" /> {item.date}
                                        </span>
                                    )}
                                    {item.location && (
                                        <span className="wsl-item__meta-item">
                                            <i className="fas fa-map-marker-alt" /> {item.location}
                                        </span>
                                    )}
                                </div>
                                <p className="wsl-item__desc">{renderText(displayDesc)}</p>
                                <Link 
                                    to={`/projects/${item.id || item.title?.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="wsl-item__cta" 
                                >
                                    VIEW PROJECT <i className="fas fa-arrow-right" style={{ marginLeft: '10px', fontSize: '0.8rem' }}></i>
                                </Link>
                            </div>
                        </div>
                        {index < currentStoriesList.length - 1 && (
                            <div className="wsl-separator reveal" style={{ 
                                width: '100%', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                padding: '60px 0',
                                clear: 'both'
                            }}>
                                <div style={{ color: 'var(--accent-color)', fontSize: '1.5rem', opacity: 0.5 }}>✦</div>
                            </div>
                        )}
                        </React.Fragment>
                    );
                })}
            </section>

            <div className="pw-stories__explore reveal" style={{ textAlign: 'center', padding: '60px 0 100px' }}>
                <a 
                    href={content.weddingStories?.ctaBtnUrl || "https://instagram.com"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="pw-btn pw-btn--gold"
                >
                    {content.weddingStories?.ctaBtnText || "EXPLORE MORE COLLECTIONS"} <i className={content.weddingStories?.ctaBtnIcon || "fab fa-instagram"} style={{ marginLeft: '10px', fontSize: '0.9rem' }}></i>
                </a>
            </div>

            {stories.nriH2 && (
                <section className="pw-destination reveal" style={{ padding: '150px 0' }}>
                    <div className="pw-container pw-container--wide">
                        <div className="pw-destination__grid">
                            <div className="pw-destination__content reveal">
                                <span className="pw-label pw-label--light">NRI Wedding Planning</span>
                                <h2 className="pw-destination__heading">
                                    {(stories.nriH2 || "").split(' — ')[0]}<br />
                                    <em>{(stories.nriH2 || "").split(' — ')[1] || ""}</em>
                                </h2>
                                <div className="pw-destination__divider"></div>
                                <div className="pw-destination__text">
                                    {renderText(stories.nriBody)}
                                </div>
                                <Link to="/contact" className="pw-btn pw-btn--gold" style={{ marginTop: '40px' }}>
                                    {stories.nriBtnText || "Talk to Us About Your NRI Wedding →"}
                                </Link>
                            </div>

                            <div className="pw-destination__images reveal" style={{ height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {isVideoUrl(stories.nriImage1) ? (
                                    <video 
                                        key={resolveMediaURL(stories.nriImage1)}
                                        src={resolveMediaURL(stories.nriImage1)} 
                                        autoPlay muted loop playsInline 
                                        style={{ width: '100%', maxWidth: '680px', height: 'auto', aspectRatio: '3/2', objectFit: 'cover', borderRadius: '2px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }} 
                                    />
                                ) : (
                                    <img 
                                        src={resolveMediaURL(stories.nriImage1)} 
                                        alt="NRI Wedding Planning" 
                                        style={{ width: '100%', maxWidth: '680px', height: 'auto', aspectRatio: '3/2', objectFit: 'cover', borderRadius: '2px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }} 
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {sectionKey === "storiesDestination" && stories.processItems && (
                <section className="process-timeline-section reveal" style={{ padding: '80px 0' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '50px' }} className="reveal">
                            <span className="section-label" style={{ letterSpacing: '0.4em', display: 'block', marginBottom: '15px' }}>
                                {renderText(stories.processLabel || 'THE JOURNEY')}
                            </span>
                            <h2 style={{ 
                                fontFamily: 'Playfair Display, serif', 
                                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', 
                                color: 'var(--primary-color)',
                                marginBottom: '20px',
                                textTransform: 'uppercase'
                            }}>
                                {renderText(stories.processHeading || 'Our Destination Wedding Planning Process')}
                            </h2>
                        </div>

                        <div className="timeline-container">
                            <div className="timeline-line"></div>
                            {stories.processItems.map((item, idx) => (
                                <div key={idx} className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'} reveal`}>
                                    <div className="timeline-dot">
                                        <span>{idx + 1}</span>
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-card">
                                            <h3 className="timeline-title" style={{ marginBottom: '8px' }}>{renderText(item.title)}</h3>
                                            <div style={{ 
                                                width: '30px', 
                                                height: '2px', 
                                                backgroundColor: 'var(--accent-color)', 
                                                marginBottom: '10px',
                                                marginLeft: '0'
                                            }}></div>
                                            <p className="timeline-desc">
                                                {renderText(item.desc)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {sectionKey === "storiesDestination" && stories.faqsList && (
                <section className="pw-faq-section reveal" style={{ padding: '120px 0', background: '#FDFBF7' }}>
                    <div className="pw-container" style={{ maxWidth: '900px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                            <span className="pw-label" style={{ color: 'var(--accent-color)' }}>Answers & Insights</span>
                            <h2 style={{ fontSize: '3rem', fontFamily: "'Playfair Display', serif", color: 'var(--primary-color)' }}>Frequently Asked Questions</h2>
                        </div>

                        <div className="pw-faq-list">
                            {stories.faqsList.filter(faq => faq.question && faq.question.trim()).map((faq, idx) => (
                                <div key={idx} className={`pw-faq-item ${activeFaq === idx ? 'active' : ''}`} style={{
                                    marginBottom: '20px',
                                    borderBottom: '1px solid rgba(58, 18, 25, 0.1)',
                                    paddingBottom: '20px'
                                }}>
                                    <button
                                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: 'none',
                                            border: 'none',
                                            padding: '15px 0',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            color: 'var(--primary-color)',
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: '1.4rem',
                                            transition: 'opacity 0.3s'
                                        }}
                                    >
                                        <span>{renderText(faq.question)}</span>
                                        <span style={{
                                            fontSize: '1.8rem',
                                            fontFamily: "'Outfit', sans-serif",
                                            color: 'var(--accent-color)',
                                            transform: activeFaq === idx ? 'rotate(45deg)' : 'none',
                                            transition: 'transform 0.4s ease'
                                        }}>+</span>
                                    </button>
                                    <div style={{
                                        maxHeight: activeFaq === idx ? '500px' : '0',
                                        overflow: 'hidden',
                                        transition: 'max-height 0.4s ease-in-out, opacity 0.4s',
                                        opacity: activeFaq === idx ? 1 : 0
                                    }}>
                                        <p style={{
                                            padding: '10px 0 20px',
                                            color: 'rgba(58, 18, 25, 0.8)',
                                            lineHeight: '1.8',
                                            fontSize: '1.1rem',
                                            fontWeight: '300'
                                        }}>
                                            {renderText(faq.answer)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FINAL CTA SECTION */}
            <section className="pw-cta-section">
                {/* Fixed Background Layer */}
                <div 
                    className="pw-cta-section__bg"
                    style={{
                        backgroundImage: `url(${resolveMediaURL(
                            stories.ctaBgImage || 
                            (sectionKey === "storiesTraditional" 
                                ? "/uploads/upload_1774345251045_4601.jpg" 
                                : sectionKey === "storiesThemed" 
                                    ? "/uploads/upload_1775901602741_5362.webp" 
                                    : "/uploads/upload_1778474854663_2232.jpg")
                        )})`
                    }}
                ></div>

                {/* Dark Overlay Layer */}
                <div className="pw-cta-section__overlay"></div>

                <div className="pw-container reveal">
                    <h2 style={{ 
                        fontFamily: 'Playfair Display, serif', 
                        fontSize: 'clamp(2rem, 4vw, 3rem)', 
                        marginBottom: '30px',
                        color: '#fff'
                    }}>
                        {renderText(stories.ctaHeading || "Ready to Plan Your Destination Wedding in Kerala?")}
                    </h2>
                    <p style={{ 
                        fontSize: '1.2rem', 
                        maxWidth: '700px', 
                        margin: '0 auto 50px', 
                        color: 'rgba(255,255,255,0.9)',
                        lineHeight: '1.8'
                    }}>
                        {renderText(stories.ctaBody || "Tell us where you want to celebrate. We'll take it from there.")}
                    </p>
                    <div style={{ 
                        display: 'flex', 
                        gap: '20px', 
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <Link to={stories.ctaBtn1Url || "/contact"} className="pw-btn pw-btn--gold" style={{ padding: '18px 35px' }}>
                            {stories.ctaBtn1Text || "Schedule a Free Consultation →"}
                        </Link>
                        <Link to={stories.ctaBtn2Url || "/stories"} className="pw-btn" style={{ 
                            padding: '18px 35px', 
                            border: '1px solid rgba(255,255,255,0.5)',
                            color: '#fff',
                            backgroundColor: 'transparent'
                        }}>
                            {stories.ctaBtn2Text || "Browse Our Wedding Portfolio →"}
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Stories;
