import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext, isVideoUrl, resolveMediaURL, renderText, API } from '../context/ContentContext';

const StatCounter = ({ number, label, start }) => {
    const [displayValue, setDisplayValue] = useState('0');

    useEffect(() => {
        if (!start) {
            setDisplayValue('0');
            return;
        }

        const targetStr = String(number);
        const match = targetStr.match(/(\d+(\.\d+)?)/);
        if (!match) {
            setDisplayValue(number);
            return;
        }

        const target = parseFloat(match[1]);
        const prefix = targetStr.split(match[0])[0] || '';
        const suffix = targetStr.split(match[0])[1] || '';
        const duration = 2000; // Faster 2s duration for a snappier feel
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Cubic ease-out: Snappier than Quart/Expo, finishes more decisively
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const isDecimal = targetStr.includes('.');
            const currentVal = (target * easeProgress).toFixed(isDecimal ? 1 : 0);
            
            setDisplayValue(prefix + currentVal + suffix);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(targetStr);
            }
        };

        requestAnimationFrame(animate);
    }, [start, number]);

    return (
        <div className="pw-achievements__item">
            <span className="pw-achievements__number">{displayValue || '0'}</span>
            <span className="pw-achievements__label">{renderText(label)}</span>
        </div>
    );
};


const Home = () => {
    // --- Stats Counter Logic ---
    const statsRef = useRef(null);
    const [statsInView, setStatsInView] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!statsRef.current || statsInView) return;
            const rect = statsRef.current.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                setStatsInView(true);
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [statsInView]);

    const { content } = useContext(ContentContext);
    const home = content.home;
    const [popup, setPopup] = useState({ open: false, title: '', message: '' });
    const todayStr = new Date().toISOString().split('T')[0];

    const getYoutubeEmbedUrl = (url) => {
        if (!url || typeof url !== 'string') return "";
        let id = "";
        if (url.includes('v=')) {
            id = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            id = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('embed/')) {
            return url;
        } else {
            return url;
        }
        return `https://www.youtube.com/embed/${id}`;
    };
    // --- Hero Video Crossfade Logic ---
    const [currentVid, setCurrentVid] = useState(0);
    // --- Hero Video Hardcoded Logic ---
    const heroVideos = useMemo(() => [
        resolveMediaURL('/uploads/Untitled design.mp4'),
        resolveMediaURL('/uploads/12874721_1920_1080_30fps.mp4')
    ], []);



    // --- Hero Floating Image Slideshow Logic ---
    const [currentHeroImg, setCurrentHeroImg] = useState(0);
    const heroImages = useMemo(() => home.heroImages || [], [home.heroImages]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentHeroImg((prev) => (prev + 1) % heroImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    useEffect(() => {
        const video = document.getElementById(`heroVid${currentVid}`);
        if (video) {
            video.play().catch(e => console.log('Autoplay blocked or video error', e));
            const handleEnded = () => {
                setCurrentVid((prev) => (prev + 1) % heroVideos.length);
            };
            video.addEventListener('ended', handleEnded);
            return () => video.removeEventListener('ended', handleEnded);
        }
    }, [currentVid, heroVideos]);

    // --- Testimonial Carousel Logic ---
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const testimonials = home.testimonials || [];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);
    // --- Portfolio Auto-slide Logic ---
    const portfolioRef = useRef(null);
    const portfolioItems = home.portfolioItems || [];

    useEffect(() => {
        const portfolio = portfolioRef.current;
        if (!portfolio || portfolioItems.length === 0) return;

        const scrollInterval = setInterval(() => {
            const cardWidth = portfolio.querySelector('.pw-services__card')?.clientWidth || 350;
            const gap = 30;
            const scrollAmount = cardWidth + gap;
            const maxScroll = portfolio.scrollWidth - portfolio.clientWidth;

            if (portfolio.scrollLeft >= maxScroll - 20) {
                portfolio.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                portfolio.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }, 3000);

        return () => clearInterval(scrollInterval);
    }, [portfolioItems.length]);

    // --- Lead Form Logic ---
    const validateForm = (payload) => {
        if (!payload.name.trim()) return 'Please enter your full name.';
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!payload.email.trim()) return 'Please enter your email address.';
        if (!emailRegex.test(payload.email)) return 'Please enter a valid email address.';
        
        if (payload.phone && payload.phone.trim()) {
            const phoneDigits = payload.phone.replace(/\D/g, '');
            if (phoneDigits.length < 10) return 'Please enter a valid phone number.';
        }

        if (!payload.message.trim()) return 'Please provide some details about your wedding.';
        if (payload.message.trim().length < 10) return 'Please tell us a bit more so we can help you better.';
        
        return null;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        const formEl = e.target;
        const payload = {
            type: 'contact',
            name: formEl.fullName?.value || '',
            email: formEl.email?.value || '',
            phone: formEl.phone?.value || '',
            weddingLocation: formEl.weddingLocation?.value || '',
            address: formEl.address?.value || '',
            guestCount: formEl.guestCount?.value || '',
            weddingDate: formEl.weddingDate?.value || '',
            message: formEl.message?.value || '',
        };

        const validationError = validateForm(payload);
        if (validationError) {
            setPopup({
                open: true,
                title: 'Information Needed',
                message: validationError,
            });
            return;
        }

        const submitBtn = e.target.querySelector('.btn-submit');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        try {
            const res = await fetch(`${API}/api/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                setPopup({
                    open: true,
                    title: 'Thank You!',
                    message: 'Thank you for contacting Parinay Weddings. Our team will get back to you shortly.',
                });
                formEl.reset();
            } else {
                setPopup({
                    open: true,
                    title: 'Submission Failed',
                    message: data.error || 'Something went wrong. Please try again.',
                });
            }
        } catch (err) {
            console.error('[Home Form] FETCH ERROR:', err);
            setPopup({
                open: true,
                title: 'Connection Issue',
                message: 'Could not reach the server right now. Please try again in a moment.',
            });
        }

        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    };

    // --- Scroll Reveal Logic ---
    useEffect(() => {
        const observerOptions = { threshold: 0.08, rootMargin: '0px 0px -50px 0px' };
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
        <div className="home-page">
            {popup.open && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(8, 16, 13, 0.62)',
                    backdropFilter: 'blur(3px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20000, 
                    padding: '20px',
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '460px',
                        background: 'linear-gradient(155deg, #fffdf8 0%, #fff3df 45%, #f8f1e8 100%)',
                        borderRadius: '22px',
                        padding: '32px 28px',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.35) inset',
                        textAlign: 'center',
                        border: '2px solid rgba(197,160,89,0.55)',
                        position: 'relative',
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '5px',
                            borderTopLeftRadius: '20px',
                            borderTopRightRadius: '20px',
                            background: 'linear-gradient(90deg, #3a1219 0%, #c5a059 50%, #3a1219 100%)',
                        }}></div>
                        <div style={{ fontSize: '2rem', marginBottom: '10px', filter: 'drop-shadow(0 3px 6px rgba(197,160,89,0.35))' }}>💍</div>
                        <h3 style={{ margin: '0 0 12px', color: 'var(--primary-color)', fontFamily: "'Playfair Display', serif" }}>{popup.title}</h3>
                        <p style={{ margin: 0, color: '#4f5c56', lineHeight: 1.7 }}>{popup.message}</p>
                        <button
                            type="button"
                            className="pw-btn pw-btn--dark"
                            style={{ marginTop: '24px', minWidth: '140px' }}
                            onClick={() => setPopup({ open: false, title: '', message: '' })}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* ═══ SECTION 1: HERO ═══ */}
            <section className="pw-hero">
                <div className="pw-hero__video-bg">
                    {heroVideos.map((src, index) => (
                        <video
                            key={`${index}-${src}`}
                            muted
                            playsInline
                            className={`pw-hero__video ${currentVid === index ? 'is-active' : ''}`}
                            id={`heroVid${index}`}
                            preload="auto"
                            src={src}
                        />
                    ))}
                    <div className="pw-hero__overlay"></div>
                </div>

                <div className="pw-hero__content">
                    <h1 className="pw-hero__tagline">
                        {renderText(home.heroTagline)}
                    </h1>
                    <p className="pw-hero__subheading" style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#fff', fontWeight: '300' }}>
                        {renderText(home.heroSubheading)}
                    </p>
                    <p className="pw-hero__body" style={{ fontSize: '1.1rem', marginBottom: '35px', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', lineHeight: '1.6', margin: '0 auto 35px' }}>
                        {renderText(home.heroBody)}
                    </p>
                    <div className="pw-hero__ctas">
                        <Link to={home.heroBtnUrl || "/contact"} className="pw-btn pw-btn--dark">
                            {home.heroBtnText || "Get Started"}
                        </Link>
                    </div>
                </div>

                <div className="pw-hero__floating-img reveal">
                    {heroImages.map((img, index) => (
                        <img
                            key={index}
                            src={resolveMediaURL(img.image)}
                            alt={img.alt || `Wedding Celebration ${index + 1}`}
                            className={`pw-hero__slider-img ${currentHeroImg === index ? 'is-active' : ''}`}
                        />
                    ))}
                </div>
            </section>

            {/* ═══ SECTION 2: HERO STATEMENT & STATS ═══ */}
            <section className="pw-intro">
                <div className="pw-container">
                    <div className="pw-intro__content reveal" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>

                        <h2 className="pw-intro__heading">
                            {renderText(home.introHeading)}
                        </h2><br />
                        <p className="pw-intro__text" style={{ fontSize: '1.4rem', marginTop: '30px' }}>
                            <em>{renderText(home.introSubText)}</em>
                        </p>
                        <div style={{ marginTop: '50px' }}>
                            <Link to="/about" className="pw-btn pw-btn--dark">
                                {home.introBtnText || "Learn About Us →"}
                            </Link>
                        </div>
                    </div>
                </div><br />

                {/* Stats — full width green band */}
                <div className="pw-stats reveal">
                    <div className="pw-stats__grid">
                        <div className="pw-stats__item">
                            <span className="pw-stats__icon">✦</span>
                            <span className="pw-stats__label">
                                {renderText(home.stat1Label)}
                            </span>
                        </div>
                        <div className="pw-stats__item">
                            <span className="pw-stats__icon">✦</span>
                            <span className="pw-stats__label">
                                {renderText(home.stat2Label)}
                            </span>
                        </div>
                        <div className="pw-stats__item">
                            <span className="pw-stats__icon">✦</span>
                            <span className="pw-stats__label">
                                {renderText(home.stat3Label)}
                            </span>
                        </div>
                        <div className="pw-stats__item">
                            <span className="pw-stats__icon">✦</span>
                            <span className="pw-stats__label">
                                {renderText(home.stat4Label)}
                            </span>
                        </div>
                    </div>
                </div>
            </section>



            {/* ═══ SECTION 4: WHAT WE HANDLE ═══ */}
            <section className="about-team-new reveal" style={{ backgroundColor: '#fff' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <span className="section-label">{renderText(home.servicesLabel)}</span>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '20px' }}>
                            {renderText(home.servicesHeading)}
                        </h2>
                        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.2rem', color: '#666', lineHeight: '1.8' }}>
                            {renderText(home.servicesIntroText)}
                        </p>
                    </div>

                    <div className="team-grid-new">
                        {(home.homeServices && home.homeServices.length > 0
                            ? home.homeServices
                            : [
                                { image: home.service1Image, title: home.service1Title, desc: home.service1Desc },
                                { image: home.service2Image, title: home.service2Title, desc: home.service2Desc },
                                { image: home.service3Image, title: home.service3Title, desc: home.service3Desc },
                                { image: home.service4Image, title: home.service4Title, desc: home.service4Desc }
                            ].filter(s => s.title || s.image)
                        ).map((s, idx) => (
                            <div className="team-card-new" key={idx}>
                                <div className="team-img-wrap-new">
                                    {isVideoUrl(s.image) ? (
                                        <video key={resolveMediaURL(s.image)} src={resolveMediaURL(s.image)} autoPlay muted loop playsInline />
                                    ) : (
                                        <img src={resolveMediaURL(s.image)} alt={s.title} />
                                    )}
                                </div>
                                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '8px', fontFamily: 'Playfair Display, serif' }}>
                                    {s.title}
                                </h3>
                                <p style={{ fontSize: '1.0rem', color: '#666', lineHeight: '1.6' }}>
                                    {s.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="pw-services__footer reveal" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        marginTop: '80px',
                        paddingTop: '60px',
                        borderTop: '1px solid rgba(0,0,0,0.05)'
                    }}>
                        <p style={{
                            fontSize: '1.8rem',
                            color: '#3a1219',
                            fontFamily: 'Playfair Display, serif',
                            lineHeight: '1.1',
                            textAlign: 'center',
                            margin: '0'
                        }}>
                            {(home.servicesFooterText || '').split(/\\n|\n/)[0]}
                        </p>
                        <p style={{
                            fontSize: '1.8rem',
                            fontStyle: 'italic',
                            color: 'var(--accent-color)',
                            fontFamily: 'Playfair Display, serif',
                            lineHeight: '1.1',
                            textAlign: 'center',
                            margin: '-5px 0 0'
                        }}>
                            {(home.servicesFooterText || '').split(/\\n|\n/)[1]}
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 5: DESTINATION WEDDINGS ═══ */}
            <section className="pw-destination">
                <div className="pw-container pw-container--wide">
                    <div className="pw-destination__grid">
                        <div className="pw-destination__content reveal">
                            <span className="pw-label pw-label--light">{renderText(home.destinationLabel)}</span>
                            <h2 className="pw-destination__heading">
                                {renderText(home.destinationHeading)}
                            </h2>
                            <div className="pw-destination__divider"></div>
                            <p className="pw-destination__text">{renderText(home.destinationBody1)}</p>
                            <p className="pw-destination__text">{renderText(home.destinationBody2)}</p>
                            <p className="pw-destination__text" style={{ fontStyle: 'italic', color: '#a1a1a1ff', fontWeight: '400' }}>
                                {renderText(home.destinationBody3)}
                            </p>
                            <Link to={home.destinationBtnUrl || '/contact'} className="pw-btn pw-btn--dark" style={{ marginTop: '40px' }}>
                                {renderText(home.destinationBtnText)}
                            </Link>
                        </div>

                        <div className="pw-destination__images reveal">
                            <img
                                src={resolveMediaURL('uploads/upload_1774345251045_4601.jpg')}
                                alt="Kerala Destination Wedding"
                                className="pw-destination__img-main"
                            />
                            <img
                                src={resolveMediaURL('uploads/upload_1774342298693_5238.jpg')}
                                alt="Sunset Wedding"
                                className="pw-destination__img-sub"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 6: PORTFOLIO ═══ */}
            <section className="pw-portfolio">
                <div className="pw-container">
                    <div className="pw-portfolio__header reveal">
                        <div className="pw-portfolio__header-left">
                            <span className="pw-label">{renderText(home.portfolioLabel)}</span>
                            <h2 className="pw-portfolio__title">
                                {renderText(home.portfolioHeading)}
                            </h2>
                            <p className="pw-portfolio__body" style={{ marginTop: '15px', color: '#666', fontSize: '1.1rem', maxWidth: '800px' }}>
                                {renderText(home.portfolioBody)}
                            </p>
                        </div>
                    </div>
                </div><br />

                <div className="pw-portfolio__relative-wrap" style={{ position: 'relative' }}>
                    <button
                        onClick={() => {
                            portfolioRef.current?.scrollBy({ left: -400, behavior: 'smooth' });
                        }}
                        style={{
                            position: 'absolute',
                            left: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(197,160,89,0.3)',
                            color: 'var(--accent-color)',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            transition: 'all 0.3s ease'
                        }}
                        className="portfolio-nav-btn"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>

                    <button
                        onClick={() => {
                            portfolioRef.current?.scrollBy({ left: 400, behavior: 'smooth' });
                        }}
                        style={{
                            position: 'absolute',
                            right: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(197,160,89,0.3)',
                            color: 'var(--accent-color)',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            transition: 'all 0.3s ease'
                        }}
                        className="portfolio-nav-btn"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>

                    <div
                        ref={portfolioRef}
                        className="pw-services__grid reveal"
                        style={{ height: '700px', paddingLeft: '80px', paddingRight: '80px' }}
                    >
                        {portfolioItems.map((item, idx) => {
                            const displayImage = item.image || (item.galleryImages ? item.galleryImages.split('\n')[0].trim() : "");
                            return (
                                <div className="pw-services__card" key={idx}>
                                    {isVideoUrl(displayImage) ? (
                                        <video key={resolveMediaURL(displayImage)} src={resolveMediaURL(displayImage)} autoPlay muted loop playsInline className="pw-services__card-img" />
                                    ) : (
                                        <img src={resolveMediaURL(displayImage)} alt={item.title} className="pw-services__card-img" />
                                    )}
                                    <div className="pw-services__card-overlay">
                                        <div className="pw-services__card-body">
                                            <h3 className="pw-services__card-title">{item.title}</h3>
                                            <p className="pw-services__card-desc">{item.location || item.loc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="pw-container">
                    <div className="pw-portfolio__footer reveal" style={{ marginTop: '60px', textAlign: 'center' }}>
                        <Link to={home.portfolioViewAllUrl || '/stories'} className="pw-btn pw-btn--outline">{home.portfolioViewAllText}</Link>
                    </div>
                </div>
            </section><br />

            {/* ═══ YOUTUBE SHOWCASE SECTION ═══ */}
            <section className="youtube-showcase-section reveal">
                <div className="pw-container">
                    <div className="youtube-split-layout" style={{ marginBottom: '80px' }}>
                        {/* Left: Editorial Text Content */}
                        <div className="youtube-text-content">
                            <span className="editorial-label">{renderText(home.youtubeLabel)}</span>
                            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3.8rem)', margin: '20px 0 35px', lineHeight: '1.1' }}>
                                {renderText(home.youtubeHeading)}
                            </h2>
                            <p style={{ marginBottom: '25px' }}>{renderText(home.youtubeText1)}</p>
                            <p style={{ marginBottom: '35px' }}>{renderText(home.youtubeText2)}</p>

                            <a href={home.youtubeBtnUrl} target="_blank" rel="noopener noreferrer"
                                className="btn btn-outline youtube-cta-btn">
                                <i className="fab fa-youtube" style={{ color: '#ff0000', marginRight: '10px', fontSize: '1.2rem' }}></i> {renderText(home.youtubeBtnText)}
                            </a>
                        </div>

                        {/* Right: Stable Top/Bottom Trio Layout */}
                        <div className="youtube-featured-side">
                            <div className="youtube-trio-stack">
                                {/* Featured Top Video */}
                                <div className="youtube-card featured-top">
                                    <div className="video-thumbnail-wrapper">
                                        <div className="video-frame">
                                            {home.youtubeEmbedUrl ? (
                                                <iframe width="560" height="315"
                                                    src={getYoutubeEmbedUrl(home.youtubeEmbedUrl)}
                                                    title="Featured Video"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                            ) : (
                                                (home.youtubeVideos || []).slice(0, 1).map((vid, i) => (
                                                    <React.Fragment key={vid.id || i}>
                                                        {isVideoUrl(vid.url) ? (
                                                            <video src={vid.url} controls width="100%" height="100%" />
                                                        ) : (
                                                            <iframe width="560" height="315"
                                                                src={getYoutubeEmbedUrl(vid.url)}
                                                                title="Featured Video"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                                        )}
                                                    </React.Fragment>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="youtube-trio-bottom">
                                    {(home.youtubeVideos || []).slice(1, 3).map((vid, idx) => (
                                        <div className="youtube-card" key={vid.id || idx}>
                                            <div className="video-thumbnail-wrapper">
                                                <div className="video-frame">
                                                    {isVideoUrl(vid.url) ? (
                                                        <video src={vid.url} controls width="100%" height="100%" />
                                                    ) : (
                                                        <iframe width="560" height="315"
                                                            src={getYoutubeEmbedUrl(vid.url)}
                                                            title={`Sub Video ${idx + 2}`}
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Remaining 3 Videos in a Clean Grid Below */}
                    <div className="youtube-videos-grid" style={{ marginTop: '0' }}>
                        {(home.youtubeVideos || []).slice(3, 6).map((vid, idx) => (
                            <div className="youtube-card" key={vid.id || idx}>
                                <div className="video-thumbnail-wrapper">
                                    <div className="video-frame">
                                        {isVideoUrl(vid.url) ? (
                                            <video src={vid.url} controls width="100%" height="100%" />
                                        ) : (
                                            <iframe width="560" height="315"
                                                src={getYoutubeEmbedUrl(vid.url)}
                                                title={`YouTube video player ${idx + 4}`}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section><br />



            {/* ═══ ACHIEVEMENTS STATS BAR ═══ */}
            <section 
                className="pw-achievements reveal"
                ref={statsRef}
            >
                <div className="pw-container">
                    <div className="pw-achievements__grid">
                        {(home.achievements && home.achievements.length > 0
                            ? home.achievements
                            : [
                                { number: '1500+', label: 'Happy Couples' },
                                { number: '4.9/5', label: 'Google Rating' },
                                { number: '10+', label: 'Years Of Experience' },
                                { number: '20+', label: 'Strong Team' }
                            ]
                        ).map((stat, idx) => (
                            <StatCounter 
                                key={idx} 
                                number={stat.number} 
                                label={stat.label} 
                                start={statsInView}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 7: TESTIMONIALS ═══ */}
            <section className="pw-testimonials">
                <div className="pw-container">
                    <div className="pw-testimonials__inner">
                        <span className="pw-label pw-label--gold">{renderText(home.testimonialLabel || 'Testimonials')}</span>
                        <h2 className="pw-testimonials__heading" style={{ 
                            fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', 
                            color: 'var(--primary-color)', 
                            fontFamily: 'Playfair Display, serif',
                            marginBottom: '40px',
                            textAlign: 'center'
                        }}>
                            {renderText(home.testimonialHeading || 'What Our Couples, [[Have to Say]]')}
                        </h2>


                        <div className="pw-testimonials__author">
                            <div className="pw-testimonials__author-flex">
                                <div className="pw-testimonials__author-img">
                                    {isVideoUrl(testimonials[currentTestimonial]?.image) ? (
                                        <video src={resolveMediaURL(testimonials[currentTestimonial]?.image)} autoPlay muted loop playsInline />
                                    ) : (
                                        <img
                                            src={resolveMediaURL(testimonials[currentTestimonial]?.image)}
                                            alt={testimonials[currentTestimonial]?.author}
                                        />
                                    )}
                                </div>
                                <div className="pw-testimonials__author-info">
                                    <strong>{renderText(testimonials[currentTestimonial]?.author)}</strong>
                                    <span>{renderText(testimonials[currentTestimonial]?.location)}</span>
                                </div>
                            </div>
                            <div className="pw-testimonials__author-line" style={{ marginTop: '30px', marginBottom: '10px' }}></div>
                        </div>

                        <div className="pw-testimonials__quote-wrap">
                            <div className="pw-testimonials__quote-mark">"</div>
                            <p className="pw-testimonials__quote" key={currentTestimonial}>
                                {renderText(testimonials[currentTestimonial]?.text)}
                            </p>
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

            {/* ═══ SECTION: JOURNAL SNIPPET ═══ */}
            <section className="pw-journal reveal" style={{ padding: '120px 0', background: '#fff' }}>
                <div className="pw-container">
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <span className="pw-label">{renderText(content.journals.sectionLabel)}</span>
                        <h2 className="pw-section-header__title" style={{ fontSize: '3.5rem', marginBottom: '20px' }}>
                            {renderText(content.journals.sectionTitle)}
                        </h2>
                        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.2rem', color: '#666' }}>
                            {renderText(content.journals.guideDesc)}
                        </p>
                    </div>

                    <div className="pw-journal__grid">
                        {content.journals.journalsList.slice(0, 3).map((item) => (
                            <Link key={item.id} to={`/journals/${item.id}`} className="pw-journal__card" style={{ textDecoration: 'none' }}>
                                <div className="pw-journal__img-wrap">
                                    {isVideoUrl(item.image) ? (
                                        <video src={resolveMediaURL(item.image)} autoPlay muted loop playsInline className="pw-journal__img" />
                                    ) : (
                                        <img src={resolveMediaURL(item.image)} alt={item.title} className="pw-journal__img" />
                                    )}
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
                                }}>Read Entry —</span>
                            </Link>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '60px' }}>
                        <Link to="/journals" className="pw-btn pw-btn--outline">View All Guides →</Link>
                    </div>
                </div>
            </section>


            {/* ═══ SECTION 3: TRANSITION ═══ */}
            <section className="pw-transition">
                <div className="pw-transition__video">
                    <video 
                        src={resolveMediaURL('/uploads/1330-147084829_medium.mp4')} 
                        autoPlay muted loop playsInline 
                    />
                    <div className="pw-transition__overlay"></div>
                </div>

                <div className="pw-container reveal">
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', marginBottom: '20px', lineHeight: '1.1', color: 'var(--secondary-color)' }}>
                        {renderText(home.transitionHeading)}
                    </h2>
                    <p style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.9)', marginBottom: '40px', fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>
                        {renderText(home.transitionSubtext)}
                    </p>
                    <div className="pw-transition__cta" style={{ marginTop: '40px' }}>
                        <Link to={home.transitionBtnUrl || "/contact"} className="pw-btn pw-btn--dark">
                            {renderText(home.transitionBtnText || "Work With Us")}
                        </Link>
                    </div>
                </div>
            </section>



            {/* ═══ SECTION 8: LEAD FORM ═══ */}
            <section className="pw-form-section">
                <div className="pw-container">
                    <div className="pw-form-wrap reveal">
                        <div className="pw-form-wrap__left">
                            <span className="pw-label">{home.formLabel}</span>
                            <h2 className="pw-form-wrap__title">
                                {renderText(home.formHeading)}
                            </h2>
                            <p className="pw-form-wrap__sub">{home.formSubtext}</p>
                        </div>

                        <form className="pw-form" onSubmit={handleFormSubmit}>
                            <div className="pw-form__grid">
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Full Name</label>
                                    <input type="text" name="fullName" className="pw-form__input" placeholder="Your full name" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Email Address</label>
                                    <input type="email" name="email" className="pw-form__input" placeholder="your@email.com" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Phone Number</label>
                                    <input type="tel" name="phone" className="pw-form__input" placeholder="+91 00000 00000" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Wedding Location</label>
                                    <input type="text" name="weddingLocation" className="pw-form__input" placeholder="e.g. Kerala, Goa, Udaipur" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Your Current Address</label>
                                    <input type="text" name="address" className="pw-form__input" placeholder="Your current city and state" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Approx. Guest Count</label>
                                    <input type="number" name="guestCount" className="pw-form__input" placeholder="Number of guests" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Wedding Date</label>
                                    <input type="date" name="weddingDate" className="pw-form__input" min={todayStr} required />
                                </div>
                                <div className="pw-form__field" style={{ gridColumn: 'span 2' }}>
                                    <label className="pw-form__label">Your Expectations</label>
                                    <textarea name="message" className="pw-form__input" rows="4" placeholder="Briefly describe your vision and what you expect from us..." required></textarea>
                                </div>
                            </div>
                            <button type="submit" className="pw-btn pw-btn--dark btn-submit" style={{ marginTop: '50px', width: '100%' }}>
                                {home.formBtnText}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;