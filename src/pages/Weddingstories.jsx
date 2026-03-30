import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext } from '../context/ContentContext';
import './Gallery.css';

const Gallery = () => {
    const { content } = useContext(ContentContext);
    const [selectedProject, setSelectedProject] = React.useState(null);
    const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

    // Defensive checks for content loading
    const home = content?.home || {};
    const portfolioImages = home.portfolioItems || [];
    const storiesDest = content?.storiesDestination || {};
    const storiesTheme = content?.storiesThemed || {};
    const storiesTrad = content?.storiesTraditional || {};

    const destinationImages = (storiesDest.storiesList || []).map(s => ({ ...s, category: 'Destination' }));
    const themedImages = (storiesTheme.storiesList || []).map(s => ({ ...s, category: 'Themed' }));
    const traditionalImages = (storiesTrad.storiesList || []).map(s => ({ ...s, category: 'Traditional' }));

    const allGalleryItems = [
        ...portfolioImages.map(img => ({ ...img, category: 'Featured' })),
        ...destinationImages,
        ...themedImages,
        ...traditionalImages
    ].filter(item => item.image);

    const openLightbox = (project) => {
        // Generate 12 related images for the story as requested
        const related = project.imageList || Array.from({ length: 12 }, (_, i) => ({
            id: i,
            url: project.image,
            alt: `${project.title} - Highlight ${i + 1}`
        }));
        setSelectedProject({ ...project, related });
        setIsLightboxOpen(true);
        document.body.style.overflow = 'hidden';
        document.body.classList.add('lightbox-open');
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        setSelectedProject(null);
        document.body.style.overflow = 'auto';
        document.body.classList.remove('lightbox-open');
    };

    // --- Scroll Reveal Logic ---
    useEffect(() => {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.gallery-reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => revealElements.forEach(el => observer.unobserve(el));
    }, [allGalleryItems.length]);

    return (
        <div className="gallery-page">
            <section className="about-hero-new">
                <div className="container">
                    <h1 className="gallery-reveal">Wedding Stories</h1>
                </div>
            </section>

            <section className="gallery-section" style={{ paddingTop: '40px' }}>
                <div className="container">
                    <div className="gallery-grid">
                        {allGalleryItems.map((item, idx) => (
                            <div 
                                key={`${item.id}-${idx}`} 
                                className="gallery-item gallery-reveal"
                                onClick={() => openLightbox(item)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="gallery-img-wrap">
                                    <img src={item.image} alt={item.title || 'Wedding Gallery'} loading="lazy" />
                                    <div className="gallery-overlay">
                                        <div className="gallery-info">
                                            <span className="gallery-cat">{item.category}</span>
                                            <h3>{item.title}</h3>
                                            <p>{item.loc || item.location} • Kerala</p>
                                            <span className="gallery-btn">VIEW STORY <i className="fas fa-expand"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LIGHTBOX OVERLAY */}
            {isLightboxOpen && selectedProject && (
                <div className="pd-lightbox" onClick={closeLightbox}>
                    <div className="pd-lightbox__close">
                        <i className="fas fa-times"></i>
                    </div>
                    <div className="pd-lightbox__content" onClick={e => e.stopPropagation()}>
                        <div className="pd-lightbox__header">
                            <span className="pd-label">{selectedProject.category} Story</span>
                            <h2>{selectedProject.title}</h2>
                            <p>{selectedProject.desc}</p>
                        </div>
                        <div className="pd-lightbox__grid">
                            {selectedProject.related.map((img, i) => (
                                <div key={i} className="pd-lightbox__item">
                                    <img src={img.url} alt={img.alt} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* CALL TO ACTION BUTTON */}
            <div className="pw-stories__footer-cta gallery-reveal" style={{ textAlign: 'center', padding: '80px 0 140px' }}>
                <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="pw-btn pw-btn--gold"
                >
                    EXPLORE MORE COLLECTIONS <i className="fab fa-instagram" style={{ marginLeft: '10px', fontSize: '0.9rem' }}></i>
                </a>
            </div>
        </div>
    );
};

export default Gallery;
