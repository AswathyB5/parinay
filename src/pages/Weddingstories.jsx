import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext, isVideoUrl, resolveMediaURL, renderText } from '../context/ContentContext';
import './Gallery.css';

const Gallery = () => {
    const { content } = useContext(ContentContext);
    const [selectedProject, setSelectedProject] = React.useState(null);
    const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

    // Wedding Stories page-level content
    const ws = content?.weddingStories || {};
    const pageTitle = ws.pageBannerTitle || "Wedding Stories";
    const ctaBtnText = ws.ctaBtnText || ws.instagramBtnText || "EXPLORE MORE COLLECTIONS";
    const ctaBtnUrl = ws.ctaBtnUrl || ws.instagramUrl || "https://instagram.com";
    const ctaBtnIcon = ws.ctaBtnIcon || ws.instagramBtnIcon || "fab fa-instagram";

    const allGalleryItems = (ws.storiesList || []).map(item => {
        const displayImage = item.image || (item.galleryImages ? item.galleryImages.split('\n')[0].trim() : "");
        const displayDesc = item.overview ? item.overview.split('.')[0] + '.' : item.desc;
        return { ...item, displayImage, displayDesc };
    }).filter(item => item.displayImage);

    const openLightbox = (project) => {
        // Parse galleryImages (newline-separated URLs) into image objects
        let related = [];
        if (project.galleryImages && typeof project.galleryImages === 'string' && project.galleryImages.trim()) {
            related = project.galleryImages
                .split(/\\n|\n/)
                .map(url => url.trim())
                .filter(url => url.length > 0)
                .map((url, i) => ({
                    id: i,
                    url: url,
                    alt: `${project.title} - Photo ${i + 1}`
                }));
        }
        // Fallback: if no gallery images set, use the displayImage
        if (related.length === 0) {
            related = [{ id: 0, url: project.displayImage, alt: project.title || 'Wedding Photo' }];
        }
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
                    <h1 className="gallery-reveal">{pageTitle}</h1>
                </div>
            </section>

            <section className="gallery-section" style={{ paddingTop: '40px' }}>
                <div className="container">
                    <div className="gallery-grid">
                        {allGalleryItems.filter(item => item.title && item.title.trim()).map((item, idx) => (
                            <div 
                                key={`${item.id}-${idx}`} 
                                className="gallery-item gallery-reveal"
                                onClick={() => openLightbox(item)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="gallery-img-wrap">
                                    {isVideoUrl(item.displayImage) ? (
                                        <video src={resolveMediaURL(item.displayImage)} autoPlay muted loop playsInline />
                                    ) : (
                                        <img src={resolveMediaURL(item.displayImage)} alt={item.title || 'Wedding Gallery'} loading="lazy" />
                                    )}
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
                            <p>{renderText(selectedProject.displayDesc)}</p>
                        </div>
                        <div className="pd-lightbox__grid">
                            {selectedProject.related.map((img, i) => (
                                <div key={i} className="pd-lightbox__item">
                                    {isVideoUrl(img.url) ? (
                                        <video src={resolveMediaURL(img.url)} controls width="100%" />
                                    ) : (
                                        <img src={resolveMediaURL(img.url)} alt={img.alt} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* CALL TO ACTION BUTTON */}
            <div className="pw-stories__footer-cta gallery-reveal" style={{ textAlign: 'center', padding: '80px 0 140px' }}>
                <a 
                    href={ctaBtnUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="pw-btn pw-btn--gold"
                >
                    {ctaBtnText} <i className={ctaBtnIcon} style={{ marginLeft: '10px', fontSize: '0.9rem' }}></i>
                </a>
            </div>
        </div>
    );
};

export default Gallery;

