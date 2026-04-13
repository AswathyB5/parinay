import React, { useEffect, useContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ContentContext, isVideoUrl, resolveMediaURL, renderText } from '../context/ContentContext';
import './ProjectDetail.css';

const ProjectDetail = () => {
    const { id } = useParams();
    const { content } = useContext(ContentContext);

    // --- Data Aggregation (Same logic as in Weddingstories/Stories) ---
    const project = useMemo(() => {
        if (!content) return null;

        const home = content.home || {};
        const storiesDest = content.storiesDestination || {};
        const storiesTheme = content.storiesThemed || {};
        const storiesTrad = content.storiesTraditional || {};
        const storiesGallery = content.weddingStories || {};

        const allItems = [
            ...(storiesGallery.storiesList || []).map(item => ({ ...item, category: item.category || 'Featured' })),
            ...(storiesDest.storiesList || []).map(item => ({ ...item, category: 'Destination' })),
            ...(storiesTheme.storiesList || []).map(item => ({ ...item, category: 'Themed' })),
            ...(storiesTrad.storiesList || []).map(item => ({ ...item, category: 'Traditional' }))
        ];

        // Find by ID or find by slugified title if ID is not available
        return allItems.find(item => String(item.id) === id || item.title?.toLowerCase().replace(/\s+/g, '-') === id);
    }, [content, id]);

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // Reveal Logic
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [project]);

    if (!project) {
        return (
            <div className="pd-loading">
                <div className="container">
                    <h2>Project not found</h2>
                    <Link to="/stories" className="pw-btn pw-btn--gold">Back to Gallery</Link>
                </div>
            </div>
        );
    }

    const displayImage = project.image || (project.galleryImages ? project.galleryImages.split('\n')[0].trim() : "");

    // Parse gallery images from newline-separated string
    const projectImages = useMemo(() => {
        if (!project.galleryImages) {
            return [{ url: displayImage, alt: project.title }];
        }
        return project.galleryImages
            .split(/\\n|\n/)
            .map(u => u.trim())
            .filter(u => u.length > 0)
            .map((url, i) => ({
                id: i,
                url: url,
                alt: `${project.title} - Image ${i + 1}`
            }));
    }, [project.galleryImages, project.image, project.title]);

    return (
        <div className="project-detail-page">
            {/* HERO SECTION */}
            <section className="pd-hero">
                <div className="container pd-hero__content reveal">
                    <span className="pd-label">Collection Showcase</span>
                    <h1 className="pd-title">OUR PROJECTS</h1>
                </div>
            </section>

            {/* CONTENT START */}
            <section className="pd-main section-padding">
                <div className="container">
                    {/* PROJECT HEADER FOCUS */}
                    <div className="pd-header-focus reveal">
                        <span className="pd-label pd-label--dark">{project.category} Wedding</span>
                        <h2 className="pd-main-title">{project.title}</h2>
                        
                        <div className="pd-meta-row">
                            <div className="pd-meta-row__item">
                                <h3>Client</h3>
                                <p>{project.title}</p>
                            </div>
                            <div className="pd-meta-row__item">
                                <h3>Date</h3>
                                <p>{project.date || 'December 2023'}</p>
                            </div>
                            <div className="pd-meta-row__item">
                                <h3>Location</h3>
                                <p>{project.loc || project.location || 'Kerala, India'}</p>
                            </div>
                        </div>
                    </div>

                    {/* CINEMATIC MOMENT / VIDEO - Moved Up */}
                    <div className="pd-moment-wrap--inline reveal">
                        <div className="pd-moment__wrap" style={{ 
                            backgroundImage: project.video ? `url(${resolveMediaURL(displayImage)})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: '#1a1a1a'
                        }}>
                            {project.video ? (
                                project.video.includes('youtube.com') || project.video.includes('youtu.be') ? (
                                    <iframe 
                                        src={`${project.video.replace('watch?v=', 'embed/').split('&')[0]}?autoplay=1&mute=1&loop=1&playlist=${project.video.split('v=')[1] || project.video.split('/').pop()}`}
                                        title="Project Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="pd-moment__video"
                                    ></iframe>
                                ) : (
                                    <video 
                                        src={resolveMediaURL(project.video)} 
                                        autoPlay 
                                        muted 
                                        loop 
                                        controls
                                        playsInline
                                        poster={resolveMediaURL(displayImage)} 
                                        className="pd-moment__video"
                                    ></video>
                                )
                            ) : (
                                <>
                                    <img src={resolveMediaURL(displayImage)} alt="Featured Moment" className="pd-moment__img" />
                                    <div className="pd-moment__overlay"></div>
                                    <div className="pd-moment__content">
                                        <div className="pd-play-icon">
                                            <i className="fas fa-play"></i>
                                        </div>
                                        <h2 className="pd-moment__inline-title">Feel The <em>Magic</em></h2>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* PROJECT DESCRIPTION */}
                    <div className="pd-description reveal" style={{ marginTop: '100px' }}>
                        <h3 className="pd-sub-title">PROJECT OVERVIEW</h3>
                        <div className="pd-text-wrap">
                            {project.overview ? (
                                project.overview.split('\n\n').map((para, i) => (
                                    <p key={i} className="pd-body">{renderText(para)}</p>
                                ))
                            ) : (
                                <>
                                    <p className="pd-body">
                                        {project.desc || "A breathtaking celebration of love and tradition. We focused on the candid emotional exchanges that define the essence of a wedding."}
                                        {" "}This project was a meticulous exploration of heritage and modern luxury. Every element, from the choice of floral aesthetics to the choreographed moments of the ceremony, was planned with absolute directorial clarity.
                                    </p>
                                    <p className="pd-body">
                                        Beyond the mere documentation of events, we sought to capture the "soul" of the union. Our approach was editorial yet deeply cinematic, weaving together the intimate details that make your legacy unique. We prioritized the quiet, unscripted glances that often go unnoticed but define the true spirit of the day.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* PROJECT GALLERY */}
                {projectImages.length > 0 && (
                    <div className="container container--wide pd-gallery-wrap">
                        <div className="pd-gallery__grid">
                            {projectImages.map((img, idx) => (
                                <div key={idx} className={`pd-gallery__item reveal delay-${idx % 3}`}>
                                    {isVideoUrl(img.url) ? (
                                        <video src={resolveMediaURL(img.url)} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <img src={resolveMediaURL(img.url)} alt={img.alt} loading="lazy" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PROJECT RESULT */}
                <div className="container pd-result reveal" style={{ marginTop: '120px' }}>
                    <div className="pd-result__inner">
                        <h3 className="pd-sub-title">PROJECT RESULT</h3>
                        <div className="pd-text-wrap">
                                <p className="pd-body">
                                    {renderText(project.result || "The final outcome was a flawlessly executed celebration that perfectly captured the couple's vision. Beyond the aesthetics, we delivered a stress-free experience that allowed the family to fully immerse themselves in the joy of the union. A timeless legacy preserved in every frame and every moment of the day.")}
                                </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="pd-final-cta section-padding reveal">
                <div className="container">
                    <div className="pd-final-cta__content">
                        <span className="pd-label">Let's Work Together</span>
                        <h2>READY TO START <em>YOUR JOURNEY?</em></h2>
                        <p>Every extraordinary wedding begins with a single, thoughtful conversation. Let's start yours today.</p>
                        <Link to="/contact" className="pw-btn pw-btn--gold">PLAN OUR WEDDING</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProjectDetail;
