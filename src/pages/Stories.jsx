import React, { useState, useEffect, useContext } from 'react';
import { ContentContext } from '../context/ContentContext';

const Stories = ({ sectionKey = "storiesDestination" }) => {
    const { content } = useContext(ContentContext);
    const stories = content[sectionKey] || content.storiesDestination;
    const home = content.home;
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
                {stories.storiesList.map((item, index) => {
                    const isEven = index % 2 === 0;

                    return (
                        <div
                            key={item.id}
                            className={`wsl-item reveal ${isEven ? 'wsl-item--right' : 'wsl-item--left'}`}
                            style={{ transitionDelay: `${index * 0.07}s` }}
                        >
                            {/* Media — video autoplays muted, or fallback image */}
                            <div className="wsl-item__media">
                                {item.video ? (
                                    <video
                                        className="wsl-item__thumb"
                                        src={item.video}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />
                                ) : (
                                    <img
                                        src={item.image}
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
                                <p className="wsl-item__desc">{item.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* CINEMATIC CTA BAND */}
            <section className="pw-page-hero">
                <img src={stories.heroImage} alt="Background" className="pw-page-hero__bg" />
                <div className="pw-container pw-page-hero__content reveal">
                    <h1 className="pw-page-hero__title">
                        {(stories.heroTitle || "").split(' ').map((word, i, arr) => (
                            i === arr.length - 1 ? <em key={i}>{word}</em> : `${word} `
                        ))}
                    </h1>
                    <p className="pw-page-hero__subtitle">{stories.heroSubtitle}</p>
                </div>
            </section>

            {/* TESTIMONIALS CAROUSEL (Global from Home) */}
            <section className="pw-testimonials reveal">
                <div className="pw-container">
                    <div className="pw-testimonials__inner">
                        <span className="pw-label pw-label--gold">{home.testimonialLabel || 'Testimonials'}</span>

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
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Stories;
