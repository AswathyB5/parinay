import React, { useState, useEffect, useRef, useCallback } from 'react';
import venueImages from '../data/venue-images';
import { resolveMediaURL } from '../context/ContentContext';
import './VenueSlider.css';

export default function VenueSlider() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [offsetDistance, setOffsetDistance] = useState(480);

    const total = venueImages.length;
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Responsive horizontal distance between center card and side cards
    useEffect(() => {
        const updateOffset = () => {
            const w = window.innerWidth;
            if (w < 480) setOffsetDistance(150);
            else if (w < 640) setOffsetDistance(190);
            else if (w < 768) setOffsetDistance(230);
            else if (w < 1024) setOffsetDistance(290);
            else if (w < 1280) setOffsetDistance(350);
            else if (w < 1536) setOffsetDistance(410);
            else setOffsetDistance(435);
        };
        updateOffset();
        window.addEventListener('resize', updateOffset);
        return () => window.removeEventListener('resize', updateOffset);
    }, []);

    // Slide navigation
    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % total);
    }, [total]);

    const prevSlide = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + total) % total);
    }, [total]);

    // Continuous auto-play movement
    useEffect(() => {
        if (!isPlaying || lightboxIndex !== null) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 3600);
        return () => clearInterval(timer);
    }, [isPlaying, lightboxIndex, nextSlide]);

    // Touch swipe support
    const handleTouchStart = (e) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        const distance = touchStartX.current - touchEndX.current;
        if (distance > 50) {
            nextSlide();
        } else if (distance < -50) {
            prevSlide();
        }
    };

    // Calculate 3D/stage positioning for each slide
    const getCardProps = (index) => {
        let diff = index - activeIndex;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        let style = {};
        let positionClass = 'is-hidden';

        if (diff === 0) {
            positionClass = 'is-center';
            style = {
                transform: 'translate(-50%, -50%) scale(1.15)',
                zIndex: 20,
                opacity: 1,
                filter: 'brightness(1)',
                pointerEvents: 'auto',
            };
        } else if (diff === -1) {
            positionClass = 'is-left';
            style = {
                transform: `translate(calc(-50% - ${offsetDistance}px), -50%) scale(0.72)`,
                zIndex: 10,
                opacity: 0.65,
                filter: 'brightness(0.8)',
                pointerEvents: 'auto',
            };
        } else if (diff === 1) {
            positionClass = 'is-right';
            style = {
                transform: `translate(calc(-50% + ${offsetDistance}px), -50%) scale(0.72)`,
                zIndex: 10,
                opacity: 0.65,
                filter: 'brightness(0.8)',
                pointerEvents: 'auto',
            };
        } else if (diff === -2) {
            positionClass = 'is-hidden';
            style = {
                transform: `translate(calc(-50% - ${offsetDistance * 1.8}px), -50%) scale(0.5)`,
                zIndex: 1,
                opacity: 0,
                pointerEvents: 'none',
            };
        } else if (diff === 2) {
            positionClass = 'is-hidden';
            style = {
                transform: `translate(calc(-50% + ${offsetDistance * 1.8}px), -50%) scale(0.5)`,
                zIndex: 1,
                opacity: 0,
                pointerEvents: 'none',
            };
        } else {
            positionClass = 'is-hidden';
            style = {
                transform: 'translate(-50%, -50%) scale(0.4)',
                zIndex: 0,
                opacity: 0,
                pointerEvents: 'none',
            };
        }

        return { diff, style, positionClass };
    };

    // Card click handler
    const handleCardClick = (index, diff) => {
        if (diff === 0) {
            setLightboxIndex(index);
            document.body.style.overflow = 'hidden';
        } else if (diff === -1) {
            prevSlide();
        } else if (diff === 1) {
            nextSlide();
        }
    };

    // Lightbox navigation & keyboard handlers
    const closeLightbox = () => {
        setLightboxIndex(null);
        document.body.style.overflow = 'auto';
    };

    const nextLightbox = (e) => {
        e?.stopPropagation();
        setLightboxIndex((prev) => (prev + 1) % total);
    };

    const prevLightbox = (e) => {
        e?.stopPropagation();
        setLightboxIndex((prev) => (prev - 1 + total) % total);
    };

    useEffect(() => {
        if (lightboxIndex === null) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextLightbox();
            if (e.key === 'ArrowLeft') prevLightbox();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex]);

    return (
        <section className="venue-slider-section">
            <div className="venue-slider-container">
                {/* Section Header */}
                <div className="venue-slider-header gallery-reveal">
                    <div className="venue-slider-heading-wrap">
                        <span className="venue-slider-tag">Curated Settings & Venues</span>
                        <h2 className="venue-slider-title">
                            Iconic Venues That Frame <span>Your Celebration</span>
                        </h2>
                        <p className="venue-slider-desc">
                            From heritage palace courtyards and coastal cliff lawns to tranquil backwater shores and mist-covered tea estates across Kerala & South India.
                        </p>
                    </div>

                    <div className="venue-slider-controls">
                        <span className="venue-counter-pill">
                            {String(activeIndex + 1).padStart(2, '0')} / {total}
                        </span>
                        <button
                            type="button"
                            className="venue-play-pause-btn"
                            onClick={() => setIsPlaying(!isPlaying)}
                            title={isPlaying ? 'Pause auto-sliding' : 'Play auto-sliding'}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                        </button>
                        <button
                            type="button"
                            className="venue-nav-btn"
                            onClick={prevSlide}
                            title="Previous Venue"
                            aria-label="Previous"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                            type="button"
                            className="venue-nav-btn"
                            onClick={nextSlide}
                            title="Next Venue"
                            aria-label="Next"
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>

                {/* 3-Slide Centered Stage */}
                <div
                    className="venue-stage-wrap"
                    onMouseEnter={() => setIsPlaying(false)}
                    onMouseLeave={() => setIsPlaying(true)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Stage Side Navigation Arrows */}
                    <button
                        type="button"
                        className="venue-stage-arrow prev"
                        onClick={prevSlide}
                        aria-label="Previous slide"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>

                    <button
                        type="button"
                        className="venue-stage-arrow next"
                        onClick={nextSlide}
                        aria-label="Next slide"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>

                    {/* All Slides rendered in 3D / staged relative positioning */}
                    {venueImages.map((venue, idx) => {
                        const { diff, style, positionClass } = getCardProps(idx);

                        // Only render DOM elements within 2 steps of active for high performance
                        if (Math.abs(diff) > 2) return null;

                        return (
                            <div
                                key={venue.id || idx}
                                className={`venue-slide-card ${positionClass}`}
                                style={style}
                                onClick={() => handleCardClick(idx, diff)}
                                title={diff === 0 ? 'Click to view fullscreen' : 'Click to bring to center'}
                            >
                                <img
                                    src={resolveMediaURL(venue.src)}
                                    alt={venue.name || `Venue ${idx + 1}`}
                                    className="venue-slide-img"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Progress Bar */}
                <div className="venue-progress-bar-wrap">
                    <div
                        className="venue-progress-bar-fill"
                        style={{ width: `${((activeIndex + 1) / total) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Fullscreen Lightbox Modal */}
            {lightboxIndex !== null && venueImages[lightboxIndex] && (
                <div className="venue-lightbox" onClick={closeLightbox}>
                    <button
                        type="button"
                        className="venue-lightbox-close"
                        onClick={closeLightbox}
                        aria-label="Close fullscreen view"
                    >
                        <i className="fas fa-times"></i>
                    </button>

                    <button
                        type="button"
                        className="venue-lightbox-nav prev"
                        onClick={prevLightbox}
                        aria-label="Previous image"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>

                    <button
                        type="button"
                        className="venue-lightbox-nav next"
                        onClick={nextLightbox}
                        aria-label="Next image"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>

                    <div className="venue-lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={resolveMediaURL(venueImages[lightboxIndex].src)}
                            alt={venueImages[lightboxIndex].name}
                            className="venue-lightbox-img"
                        />
                        <div className="venue-lightbox-caption">
                            <h4>{venueImages[lightboxIndex].name}</h4>
                            <p>Venue {lightboxIndex + 1} of {total} · Parinay Destination Weddings</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
