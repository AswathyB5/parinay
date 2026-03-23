import React, { useEffect, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ContentContext } from '../context/ContentContext';

const Stories = ({ sectionKey = "storiesDestination" }) => {
    const { content } = useContext(ContentContext);
    
    // Safely access the specific stories section
    const stories = content[sectionKey] || content.storiesDestination;

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
    }, [content, sectionKey]); // Add sectionKey to dependencies so it re-runs when category changes

    return (
        <div className="pw-page">
            {/* HERO SECTION */}
            <section className="about-hero-new">
                <div className="container reveal">
                    <h1>{stories.pageBannerTitle || "Wedding Stories"}</h1>
                </div>
            </section>

            {/* STORIES GRID OVERVIEW */}
            <section className="pw-story reveal">
                <div className="pw-container">

                    <div className="pw-story__grid">
                        {stories.storiesList.map((item, index) => (
                                <Link key={item.id} to="#" className="pw-story__card reveal" style={{ transitionDelay: `${index * 0.1}s` }}>
                                    <div className="pw-story__img-wrap">
                                        <span className="pw-story__badge">{item.badge}</span>
                                        <img src={item.image} alt={item.title} className="pw-story__img" />
                                    </div>
                                    <div className="pw-story__content">
                                        <h3 className="pw-story__title">{item.title}</h3>
                                        <p className="pw-story__desc">{item.desc}</p>
                                        <span className="pw-story__link">View Story <i className="fas fa-arrow-right" style={{ marginLeft: '5px' }}></i></span>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '60px' }}>
                        <button className="pw-btn pw-btn--outline" style={{ padding: '16px 50px' }}>Load More</button>
                    </div>
                </div>
            </section>

            {/* HERO SECTION */}
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

            {/* TESTIMONIAL QUOTE */}
            <section className="pw-testimonials reveal">
                <div className="pw-container">
                    <div className="pw-testimonials__inner">
                        <div className="pw-testimonials__quote-wrap">
                            <div className="pw-testimonials__quote-mark">"</div>
                            <p className="pw-testimonials__quote" style={{ fontSize: '1.8rem' }}>
                                {stories.testimonialQuote}
                            </p>
                        </div>
                        <div className="pw-testimonials__author">
                            <div className="pw-testimonials__author-line"></div>
                            <div className="pw-testimonials__author-flex">
                                {stories.testimonialImage && (
                                    <div className="pw-testimonials__author-img">
                                        <img src={stories.testimonialImage} alt={stories.testimonialAuthor} />
                                    </div>
                                )}
                                <div className="pw-testimonials__author-info">
                                    <strong>{stories.testimonialAuthor}</strong>
                                    <span>{stories.testimonialLocation}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Stories;

