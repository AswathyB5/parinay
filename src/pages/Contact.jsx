import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext } from '../context/ContentContext';

const Contact = () => {
    const { content } = useContext(ContentContext);
    const contact = content.contact;
    const [activeFaq, setActiveFaq] = useState(null);

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
            {/* HEADER BANNER */}
            <section className="about-hero-new">
                <div className="container reveal">
                    <h1>{contact.pageBannerTitle || "Get in Touch"}</h1>
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
                                <span className="pw-label">Stay Connected</span>
                                <h3>Follow Us</h3>
                                <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                                    <a href={contact.instagramUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}><i className="fab fa-instagram"></i></a>
                                    <a href={contact.facebookUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}><i className="fab fa-facebook-f"></i></a>
                                    <a href={contact.pinterestUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}><i className="fab fa-pinterest-p"></i></a>
                                    <a href="https://youtube.com/@parinayweddings" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}><i className="fab fa-youtube"></i></a>
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
                                        <label className="pw-form__label">Wedding Location</label>
                                        <input type="text" className="pw-form__input" placeholder="e.g. Kumarakom, Goa, Jaipur" />
                                    </div>

                                    <div className="pw-form__field" style={{ marginTop: '20px' }}>
                                        <label className="pw-form__label">Approx. Guest Count</label>
                                        <select className="pw-form__input">
                                            <option>Under 100</option>
                                            <option>100 - 300</option>
                                            <option>300 - 500</option>
                                            <option>Above 500</option>
                                        </select>
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
                                        <label className="pw-form__label">Expectations & Vision</label>
                                        <textarea className="pw-form__input" rows="4" placeholder="Tell us about the celebration you have in mind and what you expect from us..."></textarea>
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

            {/* MAP SECTION */}
            <section className="pw-map-section reveal" style={{ background: '#FDFBF7' }}>
                <div className="pw-container" style={{ maxWidth: '1400px' }}>
                    <div className="pw-map-wrapper" style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        height: '500px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        margin: '0 0 100px'
                    }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126296.38229506161!2d76.86339199341846!3d8.5241390977464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05bbb805bbbbbb%3A0xef4657ed7f5022cc!2sThiruvananthapuram%2C%20Kerala!5e0!3m2!1sen!2sin!4v1711280000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ 
                                border: 0, 
                                filter: 'grayscale(100%)', 
                                transition: 'filter 0.6s ease',
                            }} 
                            onMouseEnter={(e) => e.target.style.filter = 'grayscale(0%)'}
                            onMouseLeave={(e) => e.target.style.filter = 'grayscale(100%)'}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Parinay Weddings Studio Location"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="pw-faq-section reveal" style={{ padding: '0 0 150px', background: '#FDFBF7' }}>
                <div className="pw-container" style={{ maxWidth: '900px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <span className="pw-label" style={{ color: 'var(--accent-color)' }}>Answers & Insights</span>
                        <h2 style={{ fontSize: '3rem', fontFamily: "'Playfair Display', serif", color: 'var(--primary-color)' }}>Frequently Asked Questions</h2>
                    </div>

                    <div className="pw-faq-list">
                        {contact.faqsList?.map((faq, idx) => (
                            <div key={idx} className={`pw-faq-item ${activeFaq === idx ? 'active' : ''}`} style={{ 
                                marginBottom: '20px', 
                                borderBottom: '1px solid rgba(29, 53, 40, 0.1)',
                                paddingBottom: '20px'
                            }}>
                                <button 
                                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                    style={{ 
                                        width: '100%', 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        background: 'none',
                                        border: 'none',
                                        padding: '15px 0',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        color: 'var(--primary-color)',
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: '1.4rem',
                                        transition: 'opacity 0.3s'
                                    }}
                                >
                                    <span>{faq.question}</span>
                                    <span style={{ 
                                        fontSize: '1.8rem', 
                                        fontFamily: "'Outfit', sans-serif",
                                        color: 'var(--accent-color)',
                                        transform: activeFaq === idx ? 'rotate(45deg)' : 'none',
                                        transition: 'transform 0.4s ease'
                                    }}>+</span>
                                </button>
                                <div style={{ 
                                    maxHeight: activeFaq === idx ? '300px' : '0', 
                                    overflow: 'hidden', 
                                    transition: 'max-height 0.4s ease-in-out, opacity 0.4s',
                                    opacity: activeFaq === idx ? 1 : 0
                                }}>
                                    <p style={{ 
                                        padding: '10px 0 20px', 
                                        color: 'rgba(29, 53, 40, 0.8)', 
                                        lineHeight: '1.8',
                                        fontSize: '1.1rem',
                                        fontWeight: '300'
                                    }}>
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '60px' }}>
                        <p style={{ color: 'rgba(29, 53, 40, 0.8)', fontStyle: 'italic' }}>Have more specific questions? Our consultants are here to help.</p>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Contact;
