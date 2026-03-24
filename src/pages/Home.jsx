import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext } from '../context/ContentContext';

const Home = () => {
    const { content } = useContext(ContentContext);
    const home = content.home;
    // --- Hero Video Crossfade Logic ---
    const [currentVid, setCurrentVid] = useState(0);
    const heroVideos = [
        home.heroVideo1 || '/Untitled design.mp4',
        home.heroVideo2 || '/12874721_1920_1080_30fps.mp4',
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

    // --- Lead Form Logic ---
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('.btn-submit');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Thank you for contacting Parinay Weddings. Our team will review your requirements and get in touch within 24 hours via WhatsApp and Email.');
            e.target.reset();
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }, 1500);
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

    const portfolioItems = home.portfolioItems || [];

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
                    <p className="pw-hero__tagline">{home.heroTagline}</p>
                    <div className="pw-hero__ctas">
                        <Link to={home.heroBtnUrl || "/contact"} className="pw-btn pw-btn--gold">
                            {home.heroBtnText || "Get Started"}
                        </Link>
                    </div>
                </div>

                <div className="pw-hero__floating-img reveal">
                    {heroImages.map((img, index) => (
                        <img
                            key={index}
                            src={img.image}
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
                            {home.introHeading}
                        </h2><br />
                        <p className="pw-intro__text" style={{ fontSize: '1.4rem', marginTop: '30px' }}>
                            <em>{home.introSubText}</em>
                        </p>
                    </div>
                </div><br />

                {/* Stats — full width green band */}
                <div className="pw-stats reveal">
                    <div className="pw-stats__grid">
                        <div className="pw-stats__item">
                            <span className="pw-stats__icon">✦</span>
                            <span className="pw-stats__label">
                                {home.stat1Label?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                            </span>
                        </div>
                        <div className="pw-stats__item">
                            <span className="pw-stats__icon">✦</span>
                            <span className="pw-stats__label">
                                {home.stat2Label?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                            </span>
                        </div>
                        <div className="pw-stats__item">
                            <span className="pw-stats__icon">✦</span>
                            <span className="pw-stats__label">
                                {home.stat3Label?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                            </span>
                        </div>
                        <div className="pw-stats__item">
                            <span className="pw-stats__icon">✦</span>
                            <span className="pw-stats__label">
                                {home.stat4Label?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                            </span>
                        </div>
                    </div>
                </div>
            </section>



            {/* ═══ SECTION 4: WHAT WE HANDLE ═══ */}
            <section className="pw-services">
                <div className="pw-container">
                    <div className="pw-section-header reveal">
                        <span className="pw-label">{home.servicesLabel}</span>
                        <h2 className="pw-section-header__title">
                            {home.servicesHeading?.split('\n')[0]}<br />
                            <em>{home.servicesHeading?.split('\n')[1]}</em>
                        </h2>
                        <p className="pw-intro__text" style={{ marginTop: '20px' }}>
                            {home.servicesIntroText}
                        </p>
                    </div>
                </div>

                <div className="pw-container pw-container--wide">
                    <div className="pw-portfolio__grid reveal">
                        {[
                            { image: home.service1Image, title: home.service1Title, desc: home.service1Desc },
                            { image: home.service2Image, title: home.service2Title, desc: home.service2Desc },
                            { image: home.service3Image, title: home.service3Title, desc: home.service3Desc },
                            { image: home.service4Image, title: home.service4Title, desc: home.service4Desc }
                        ].map((s, idx) => (
                            <div className="pw-portfolio__item" key={idx}>
                                <img src={s.image} alt={s.title} />
                                <div className="pw-portfolio__item-info">
                                    <h4>{s.title}</h4>
                                    <span>{s.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pw-container">
                    <div className="pw-services__footer reveal" style={{ textAlign: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <p style={{ fontSize: '1.8rem', fontStyle: 'italic', color: '#1d3528' }}>
                            {home.servicesFooterText?.split('\n')[0]} <br />
                            <em>{home.servicesFooterText?.split('\n')[1]}</em>
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 5: DESTINATION WEDDINGS ═══ */}
            <section className="pw-destination">
                <div className="pw-container pw-container--wide">
                    <div className="pw-destination__grid">
                        <div className="pw-destination__content reveal">
                            <span className="pw-label pw-label--light">{home.destinationLabel}</span>
                            <h2 className="pw-destination__heading">
                                {home.destinationHeading.split(',')[0]},<br />
                                <em>{home.destinationHeading.split(',')[1]?.trim()}</em>
                            </h2>
                            <div className="pw-destination__divider"></div>
                            <p className="pw-destination__text">{home.destinationBody1}</p>
                            <p className="pw-destination__text">{home.destinationBody2}</p>
                            <p className="pw-destination__text" style={{ fontStyle: 'italic', color: '#1d3528', fontWeight: '500' }}>
                                {home.destinationBody3}
                            </p>
                            <Link to={home.destinationBtnUrl || '/contact'} className="pw-btn pw-btn--dark" style={{ marginTop: '40px' }}>
                                {home.destinationBtnText}
                            </Link>
                        </div>

                        <div className="pw-destination__images reveal">
                            <img
                                src={home.destinationImage1}
                                alt="Kerala Destination Wedding"
                                className="pw-destination__img-main"
                            />
                            <img
                                src={home.destinationImage2}
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
                            <span className="pw-label">{home.portfolioLabel}</span>
                            <h2 className="pw-portfolio__title">
                                {home.portfolioHeading.split(' - ')[0]}<br />
                                <em>{home.portfolioHeading.split(' - ')[1]}</em>
                            </h2>
                        </div>
                    </div>
                </div><br />

                <div className="pw-services__grid reveal" style={{ height: '700px' }}>
                    {portfolioItems.map((item, idx) => (
                        <div className="pw-services__card" key={idx}>
                            <img src={item.image} alt={item.title} className="pw-services__card-img" />
                            <div className="pw-services__card-overlay">
                                <div className="pw-services__card-body">
                                    <h3 className="pw-services__card-title">{item.title}</h3>
                                    <p className="pw-services__card-desc">{item.loc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
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
                    <div className="youtube-split-layout">
                        {/* Left: Editorial Text Content */}
                        <div className="youtube-text-content">
                            <span className="editorial-label">{home.youtubeLabel}</span>
                            <h2>
                                {home.youtubeHeading.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {i === home.youtubeHeading.split('\n').length - 1 ? <em>{line}</em> : line}
                                        {i < home.youtubeHeading.split('\n').length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </h2>
                            <p>{home.youtubeText1}</p>
                            <p>{home.youtubeText2}</p>

                            <a href={home.youtubeBtnUrl} target="_blank" rel="noopener noreferrer"
                                className="btn btn-outline youtube-cta-btn">
                                <i className="fab fa-youtube" style={{ color: '#ff0000', marginRight: '10px', fontSize: '1.2rem' }}></i> {home.youtubeBtnText}
                            </a>
                        </div>

                        {/* Right: Single Featured Video */}
                        <div className="youtube-video-wrapper">
                            <div className="youtube-card featured-single">
                                <div className="video-thumbnail-wrapper">
                                    <div className="video-frame">
                                        <iframe width="560" height="315"
                                            src={home.youtubeEmbedUrl}
                                            title="YouTube video player"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section><br />


            {/* ═══ SECTION 7: TESTIMONIALS ═══ */}
            <section className="pw-testimonials">
                <div className="pw-container">
                    <div className="pw-testimonials__inner">
                        <span className="pw-label pw-label--gold">{home.testimonialLabel || 'Testimonials'}</span>


                        <div className="pw-testimonials__quote-wrap">
                            <div className="pw-testimonials__quote-mark">"</div>
                            <p className="pw-testimonials__quote" key={currentTestimonial}>
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
 
            {/* ═══ SECTION: JOURNAL SNIPPET ═══ */}
            <section className="pw-journal reveal" style={{ padding: '120px 0', background: '#fff' }}>
                <div className="pw-container">
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <span className="pw-label">{content.journals.sectionLabel}</span>
                        <h2 className="pw-section-header__title" style={{ fontSize: '3.5rem' }}>
                            {content.journals.sectionTitle.split(' ').map((word, i, arr) => (
                                i === arr.length - 1 ? <em key={i} style={{ fontStyle: 'italic', color: 'var(--accent-color)' }}>{word}</em> : `${word} `
                            ))}
                        </h2>
                    </div>
 
                    <div className="pw-journal__grid">
                        {content.journals.journalsList.slice(0, 3).map((item) => (
                            <Link key={item.id} to={`/journals/${item.id}`} className="pw-journal__card" style={{ textDecoration: 'none' }}>
                                <div className="pw-journal__img-wrap">
                                    <img src={item.image} alt={item.title} className="pw-journal__img" />
                                </div>
                                <span className="pw-journal__meta">{item.date}</span>
                                <h3 className="pw-journal__title">{item.title}</h3>
                                <p className="pw-journal__excerpt">{item.excerpt}</p>
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
                        <source src={home.transitionVideoUrl} type="video/mp4" />
                    </video>
                    <div className="pw-transition__overlay"></div>
                </div>

                <div className="pw-container reveal">
                    <h2 className="pw-transition__heading">
                        {home.transitionHeading.split(' ').slice(0, -2).join(' ')} <br />
                        <em>{home.transitionHeading.split(' ').slice(-2).join(' ')}</em>
                    </h2>
                    <div className="pw-transition__cta" style={{ marginTop: '40px' }}>
                        <Link to={home.transitionBtnUrl || "/contact"} className="pw-btn pw-btn--gold">
                            {home.transitionBtnText || "Work With Us"}
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
                                    <input type="text" className="pw-form__input" placeholder="Your full name" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Email Address</label>
                                    <input type="email" className="pw-form__input" placeholder="your@email.com" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Phone Number</label>
                                    <input type="tel" className="pw-form__input" placeholder="+91 00000 00000" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Wedding Location</label>
                                    <input type="text" className="pw-form__input" placeholder="e.g. Kerala, Goa, Udaipur" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Approx. Guest Count</label>
                                    <input type="number" className="pw-form__input" placeholder="Number of guests" required />
                                </div>
                                <div className="pw-form__field">
                                    <label className="pw-form__label">Wedding Date</label>
                                    <input type="date" className="pw-form__input" required />
                                </div>
                                <div className="pw-form__field" style={{ gridColumn: 'span 2' }}>
                                    <label className="pw-form__label">Your Expectations</label>
                                    <textarea className="pw-form__input" rows="4" placeholder="Briefly describe your vision and what you expect from us..." required></textarea>
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