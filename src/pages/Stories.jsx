import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext, isVideoUrl, resolveMediaURL, renderText } from '../context/ContentContext';
import './Gallery.css';

const Stories = ({ sectionKey = "storiesDestination" }) => {
    const { content } = useContext(ContentContext);

    // Safety guards for data access
    const stories = (content && content[sectionKey]) || (content && content.storiesDestination) || { storiesList: [] };
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

    return (
        <div className="pw-page">
            {/* PAGE BANNER */}
            <section className="about-hero-new">
                <div className="container reveal">
                    <h1>{stories.pageBannerTitle || "Wedding Stories"}</h1>
                </div>
            </section>

            {/* WEDDLIN-STYLE STORY LIST */}
            <section className="wsl-section">
                {stories.storiesList && stories.storiesList.filter(item => item.title && item.title.trim()).map((item, index) => {
                    const isEven = index % 2 === 0;
                    const displayImage = item.image || (item.galleryImages ? item.galleryImages.split('\n')[0].trim() : "");
                    const displayDesc = item.overview ? item.overview.split('.')[0] + '.' : item.desc;

                    return (
                        <div
                            key={item.id || index}
                            className={`wsl-item reveal ${isEven ? 'wsl-item--right' : 'wsl-item--left'}`}
                            style={{ transitionDelay: `${index * 0.07}s` }}
                        >
                            {/* Media — video autoplays muted, or fallback image */}
                            <div className="wsl-item__media">
                                {item.video ? (
                                    <video
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

            {/* CINEMATIC CTA BAND */}
            <section className="pw-page-hero">
                <img src={resolveMediaURL(stories.heroImage)} alt="Background" className="pw-page-hero__bg" />
                <div className="pw-container pw-page-hero__content reveal">
                    <h1 className="pw-page-hero__title">
                        {(stories.heroTitle || "").split(' ').map((word, i, arr) => (
                            i === arr.length - 1 ? <em key={i}>{word}</em> : `${word} `
                        ))}
                    </h1>
                    <p className="pw-page-hero__subtitle">{stories.heroSubtitle}</p>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="pw-testimonials reveal">
                <div className="pw-container">
                    <div className="pw-testimonials__inner">
                        <span className="pw-label pw-label--gold">{stories.testimonialLabel || home.testimonialLabel || 'Testimonial'}</span>

                        {stories.testimonialQuote ? (
                            <div className="pw-testimonials__featured">
                                <div className="pw-testimonials__quote-wrap">
                                    <div className="pw-testimonials__quote-mark">"</div>
                                    <p className="pw-testimonials__quote" style={{ fontSize: '1.8rem' }}>
                                        {stories.testimonialQuote}
                                    </p>
                                </div>
                                <div className="pw-testimonials__author">
                                    <div className="pw-testimonials__author-line"></div>
                                    <div className="pw-testimonials__author-flex">
                                        <div className="pw-testimonials__author-img">
                                            <img 
                                                src={resolveMediaURL(stories.testimonialImage) || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80"} 
                                                alt={stories.testimonialAuthor} 
                                            />
                                        </div>
                                        <div className="pw-testimonials__author-info">
                                            <strong>{stories.testimonialAuthor}</strong>
                                            <span>{stories.testimonialLocation}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="pw-testimonials__quote-wrap">
                                    <div className="pw-testimonials__quote-mark">"</div>
                                    <p className="pw-testimonials__quote" key={currentTestimonial} style={{ fontSize: '1.8rem' }}>
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
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Stories;
