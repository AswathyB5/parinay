import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext, isVideoUrl, resolveMediaURL, renderText, API } from '../context/ContentContext';

const Home = () => {
    const { content } = useContext(ContentContext);
    const home = content.home;

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
    const heroVideos = [
        resolveMediaURL(home.heroVideo1 || '/Untitled design.mp4'),
        resolveMediaURL(home.heroVideo2 || '/12874721_1920_1080_30fps.mp4'),
    ];

    // --- Hero Floating Image Slideshow Logic ---
    const [currentHeroImg, setCurrentHeroImg] = useState(0);
    const heroImages = home.heroImages || [];

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
    }, [currentVid, heroVideos.length]);

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
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('.btn-submit');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

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

        try {
            console.log('[Home Form] Sending payload:', payload);
            const res = await fetch(`${API}/api/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            console.log('[Home Form] Response status:', res.status);
            const data = await res.json();
            console.log('[Home Form] Response data:', data);

            if (data.success) {
                alert('Thank you for contacting Parinay Weddings. Our team will review your requirements and get in touch within 24 hours via WhatsApp and Email.');
                formEl.reset();
            } else {
                alert(`Something went wrong: ${data.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('[Home Form] FETCH ERROR:', err);
            alert(`Could not reach the server. \n\nTechnical Error: ${err.message}`);
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

            {/* ═══ SECTION 1: HERO ═══ */}
            <section className="pw-hero">
                <div className="pw-hero__video-bg">
                    {heroVideos.map((src, index) => (
                        <video
                            key={index}
                            muted
                            playsInline
                            className={`pw-hero__video ${currentVid === index ? 'is-active' : ''}`}
                            id={`heroVid${index}`}
                            preload="auto"
                        >
                            <source src={src} type="video/mp4" />
                        </video>
                    ))}
                    <div className="pw-hero__overlay"></div>
                </div>

                <div className="pw-hero__content">
                    <span className="pw-hero__eyebrow"></span>
                    <p className="pw-hero__tagline">
                        {renderText(home.heroTagline)}
                    </p>
                    <div className="pw-hero__ctas">
                        <Link to={home.heroBtnUrl || "/contact"} className="pw-btn pw-btn--gold">
                            {home.heroBtnText || "Get Started"}
                        </Link>
                    </div>
                </div>

                <div className="pw-hero__floating-img reveal">
                    {heroImages.map((img, index) => (
                        isVideoUrl(img.image) ? (
                            <video
                                key={index}
                                src={resolveMediaURL(img.image)}
                                autoPlay muted loop playsInline
                                className={`pw-hero__slider-img ${currentHeroImg === index ? 'is-active' : ''}`}
                            />
                        ) : (
                            <img
                                key={index}
                                src={resolveMediaURL(img.image)}
                                alt={img.alt || `Wedding Celebration ${index + 1}`}
                                className={`pw-hero__slider-img ${currentHeroImg === index ? 'is-active' : ''}`}
                            />
                        )
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
                            {(home.servicesHeading || '').split(/\\n|\n/)[0]} <em>{(home.servicesHeading || '').split(/\\n|\n/)[1] || ''}</em>
                        </h2>
                        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.2rem', color: '#666', lineHeight: '1.8' }}>
                            {renderText(home.servicesIntroText)}
                        </p>
                    </div>

                    <div className="team-grid-new">
                        {[
                            { image: home.service1Image, title: home.service1Title, desc: home.service1Desc },
                            { image: home.service2Image, title: home.service2Title, desc: home.service2Desc },
                            { image: home.service3Image, title: home.service3Title, desc: home.service3Desc },
                            { image: home.service4Image, title: home.service4Title, desc: home.service4Desc }
                        ].map((s, idx) => (
                            <div className="team-card-new" key={idx}>
                                <div className="team-img-wrap-new">
                                    {isVideoUrl(s.image) ? (
                                        <video src={resolveMediaURL(s.image)} autoPlay muted loop playsInline />
                                    ) : (
                                        <img src={resolveMediaURL(s.image)} alt={s.title} />
                                    )}
                                </div>
                                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '8px', fontFamily: 'Playfair Display, serif' }}>
                                    {s.title}
                                </h3>
                                <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>
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
                            color: '#1d3528',
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
                                {(home.destinationHeading || '').split(',')[0]}<br />
                                <em>{(home.destinationHeading || '').includes(',') ? (home.destinationHeading || '').split(',')[1].trim() : ''}</em>
                            </h2>
                            <div className="pw-destination__divider"></div>
                            <p className="pw-destination__text">{renderText(home.destinationBody1)}</p>
                            <p className="pw-destination__text">{renderText(home.destinationBody2)}</p>
                            <p className="pw-destination__text" style={{ fontStyle: 'italic', color: '#a1a1a1ff', fontWeight: '400' }}>
                                {renderText(home.destinationBody3)}
                            </p>
                            <Link to={home.destinationBtnUrl || '/contact'} className="pw-btn pw-btn--gold" style={{ marginTop: '40px' }}>
                                {renderText(home.destinationBtnText)}
                            </Link>
                        </div>

                        <div className="pw-destination__images reveal">
                            {isVideoUrl(home.destinationImage1) ? (
                                <video src={resolveMediaURL(home.destinationImage1)} autoPlay muted loop playsInline className="pw-destination__img-main" />
                            ) : (
                                <img
                                    src={resolveMediaURL(home.destinationImage1)}
                                    alt="Kerala Destination Wedding"
                                    className="pw-destination__img-main"
                                />
                            )}
                            {isVideoUrl(home.destinationImage2) ? (
                                <video src={resolveMediaURL(home.destinationImage2)} autoPlay muted loop playsInline className="pw-destination__img-sub" />
                            ) : (
                                <img
                                    src={resolveMediaURL(home.destinationImage2)}
                                    alt="Sunset Wedding"
                                    className="pw-destination__img-sub"
                                />
                            )}
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
                                {(home.portfolioHeading || '').split(' - ')[0]}<br />
                                <em>{(home.portfolioHeading || '').split(' - ')[1] || ''}</em>
                            </h2>
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
                                        <video src={resolveMediaURL(displayImage)} autoPlay muted loop playsInline className="pw-services__card-img" />
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
                                {(home.youtubeHeading || '').split(/\\n|\n/).map((line, i, arr) => (
                                    <React.Fragment key={i}>
                                        {i === arr.length - 1 ? <em>{line}</em> : line}
                                        {i < arr.length - 1 && <br />}
                                    </React.Fragment>
                                ))}
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


            {/* ═══ SECTION 7: TESTIMONIALS ═══ */}
            <section className="pw-testimonials">
                <div className="pw-container">
                    <div className="pw-testimonials__inner">
                        <span className="pw-label pw-label--gold">{renderText(home.testimonialLabel || 'Testimonials')}</span>


                        <div className="pw-testimonials__quote-wrap">
                            <div className="pw-testimonials__quote-mark">"</div>
                            <p className="pw-testimonials__quote" key={currentTestimonial}>
                                {renderText(testimonials[currentTestimonial]?.text)}
                            </p>
                        </div>

                        <div className="pw-testimonials__author">
                            <div className="pw-testimonials__author-line"></div>
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
                        <h2 className="pw-section-header__title" style={{ fontSize: '3.5rem' }}>
                            {(content.journals.sectionTitle || "").split(' ').map((word, i, arr) => (
                                i === arr.length - 1 ? <em key={i} style={{ fontStyle: 'italic', color: 'var(--accent-color)' }}>{word}</em> : `${word} `
                            ))}
                        </h2>
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
                        <Link to="/journals" className="pw-btn pw-btn--outline">View All Entries</Link>
                    </div>
                </div>
            </section>


            {/* ═══ SECTION 3: TRANSITION ═══ */}
            <section className="pw-transition">
                <div className="pw-transition__video-bg">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="pw-transition__video"
                        preload="auto"
                    >
                        <source src={resolveMediaURL(home.transitionVideoUrl)} type="video/mp4" />
                    </video>
                    <div className="pw-transition__overlay"></div>
                </div>

                <div className="pw-container reveal">
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', marginBottom: '50px', lineHeight: '1.1', color: 'var(--secondary-color)' }}>
                        {(home.transitionHeading || '').split(/\\n|\n/).length > 1
                            ? (home.transitionHeading || '').split(/\\n|\n/).map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)
                            : (
                                <>
                                    {(home.transitionHeading || '').split(' ').slice(0, -2).join(' ')} <br />
                                    <em>{(home.transitionHeading || '').split(' ').slice(-2).join(' ')}</em>
                                </>
                            )
                        }
                    </h2>
                    <div className="pw-transition__cta" style={{ marginTop: '40px' }}>
                        <Link to={home.transitionBtnUrl || "/contact"} className="pw-btn pw-btn--gold">
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
                                {home.formHeading.split(' ').slice(0, 1).join(' ')} <br />
                                <em>{home.formHeading.split(' ').slice(1).join(' ')}</em>
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
                                    <input type="date" name="weddingDate" className="pw-form__input" required />
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