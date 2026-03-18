import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext } from '../context/ContentContext';

const Contact = () => {
    const { content } = useContext(ContentContext);
    const contact = content.contact;

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
    }, [content]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Thank you for your inquiry. Our team will get back to you shortly.');
            e.target.reset();
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }, 1500);
    };

    return (
        <div className="pw-page">
            {/* PAGE BANNER */}
            <section className="pw-page-banner">
                <div className="pw-container">
                    <h1 className="pw-page-banner__title">{contact.pageBannerTitle}</h1>
                </div>
            </section>


            {/* CONTACT BODY */}
            <section className="pw-contact reveal">
                <div className="pw-container">
                    <div className="pw-contact__grid">

                        {/* LEFT: INFO */}
                        <div className="pw-contact__info">
                            <div className="pw-contact__block">
                                <span className="pw-label">{contact.emailLabel}</span>
                                <h3>{contact.emailHeading}</h3>
                                <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
                            </div>
                            <div className="pw-contact__block">
                                <span className="pw-label">{contact.phoneLabel}</span>
                                <h3>{contact.phoneHeading}</h3>
                                <p><a href={`tel:+${contact.phone?.replace(/\D/g, '')}`}>{contact.phone}</a></p>
                            </div>
                            <div className="pw-contact__block">
                                <span className="pw-label">{contact.addressLabel}</span>
                                <h3>{contact.addressHeading}</h3>
                                <p>{contact.address?.split('\n').map((line, i) => (
                                    <span key={i}>{line}{i < contact.address.split('\n').length - 1 && <br />}</span>
                                ))}</p>
                            </div>
                            <div className="pw-contact__block">
                                <span className="pw-label">Stay Connected</span>
                                <h3>Follow Us</h3>
                                <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                                    <Link to="#" style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}><i className="fab fa-instagram"></i></Link>
                                    <Link to="#" style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}><i className="fab fa-facebook-f"></i></Link>
                                    <Link to="#" style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}><i className="fab fa-pinterest-p"></i></Link>
                                </div>
                            </div>

                            <a href={`https://wa.me/${contact.whatsappNumber}`} className="pw-contact__whatsapp" target="_blank" rel="noreferrer">
                                <div>
                                    <h3>{contact.whatsappText}</h3>
                                    <p>{contact.whatsappReply}</p>
                                </div>
                                <i className="fab fa-whatsapp"></i>
                            </a>
                        </div>

                        {/* RIGHT: FORM */}
                        <div className="pw-contact__form">
                            <div className="pw-form-container">
                                <form className="pw-form" onSubmit={handleFormSubmit}>
                                    <div className="pw-form__grid">
                                        <div className="pw-form__field">
                                            <label className="pw-form__label">Your Name</label>
                                            <input type="text" className="pw-form__input" placeholder="Enter your full name" required />
                                        </div>
                                        <div className="pw-form__field">
                                            <label className="pw-form__label">Email Address</label>
                                            <input type="email" className="pw-form__input" placeholder="your@email.com" required />
                                        </div>
                                    </div>

                                    <div className="pw-form__grid" style={{ marginTop: '20px' }}>
                                        <div className="pw-form__field">
                                            <label className="pw-form__label">Phone Number</label>
                                            <input type="tel" className="pw-form__input" placeholder="+91 00000 00000" />
                                        </div>
                                        <div className="pw-form__field">
                                            <label className="pw-form__label">Wedding Date</label>
                                            <input type="date" className="pw-form__input" />
                                        </div>
                                    </div>

                                    <div className="pw-form__field" style={{ marginTop: '20px' }}>
                                        <label className="pw-form__label">Desired Location</label>
                                        <input type="text" className="pw-form__input" placeholder="e.g. Kumarakom, Goa, Jaipur" />
                                    </div>

                                    <div className="pw-form__field" style={{ marginTop: '20px' }}>
                                        <label className="pw-form__label">Service Required</label>
                                        <select className="pw-form__input">
                                            <option>Full Planning</option>
                                            <option>Partial Planning</option>
                                            <option>Day-of Coordination</option>
                                            <option>Consultation Only</option>
                                        </select>
                                    </div>

                                    <div className="pw-form__field" style={{ marginTop: '20px' }}>
                                        <label className="pw-form__label">Your Vision</label>
                                        <textarea className="pw-form__input" rows="4" placeholder="Tell us about the celebration you have in mind..."></textarea>
                                    </div>

                                    <div style={{ marginTop: '40px' }}>
                                        <button type="submit" className="pw-btn pw-btn--dark" style={{ width: '100%', padding: '24px' }}>
                                            {contact.formBtnText}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* HERO SECTION */}
            <section className="pw-page-hero">
                <img src={contact.heroImage} alt="Background" className="pw-page-hero__bg" />
                <div className="pw-container pw-page-hero__content reveal">
                    <h1 className="pw-page-hero__title">
                        {contact.heroTitle}<br />
                        <em>{contact.heroTitleEm}</em>
                    </h1>
                    <p className="pw-page-hero__subtitle">
                        {contact.heroSubtitle}
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Contact;
