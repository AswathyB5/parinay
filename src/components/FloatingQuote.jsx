import React, { useState } from 'react';
import { API } from '../context/ContentContext';
import './FloatingQuote.css';

const FloatingQuote = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [popup, setPopup] = useState({ open: false, title: '', message: '' });
    const todayStr = new Date().toISOString().split('T')[0];

    const validateForm = (payload) => {
        if (!payload.name.trim()) return 'Please enter your full name.';
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!payload.email.trim()) return 'Please enter your email.';
        if (!emailRegex.test(payload.email)) return 'Please enter a valid email.';
        
        const phoneDigits = payload.phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) return 'Please enter a valid phone number.';

        if (!payload.weddingDate) return 'Please select your wedding date.';
        if (!payload.weddingLocation.trim()) return 'Please enter the wedding venue or city.';
        
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formEl = e.target;
        const payload = {
            type: 'quote',
            name: formEl.fullName?.value || '',
            phone: formEl.phone?.value || '',
            email: formEl.email?.value || '',
            weddingDate: formEl.weddingDate?.value || '',
            weddingLocation: formEl.venue?.value || '',
        };

        const validationError = validateForm(payload);
        if (validationError) {
            setPopup({
                open: true,
                title: 'Data Required',
                message: validationError,
            });
            return;
        }

        const submitBtn = formEl.querySelector('button[type="submit"]');
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
                    message: 'Your quote request has been sent. Our team will get back to you shortly.',
                });
                setIsOpen(false);
                formEl.reset();
            } else {
                setPopup({
                    open: true,
                    title: 'Submission Failed',
                    message: data.error || 'Something went wrong. Please try again.',
                });
            }
        } catch {
            setPopup({
                open: true,
                title: 'Connection Issue',
                message: 'Could not reach the server right now. Please try again in a moment.',
            });
        }

        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    };

    return (
        <>
            {popup.open && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(8, 16, 13, 0.62)',
                    backdropFilter: 'blur(3px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20000, /* Significantly higher than the modal (10000) */
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
                            background: 'linear-gradient(90deg, #1d3528 0%, #c5a059 50%, #1d3528 100%)',
                        }}></div>
                        <div style={{ fontSize: '2rem', marginBottom: '10px', filter: 'drop-shadow(0 3px 6px rgba(197,160,89,0.35))' }}>💍</div>
                        <h3 style={{ margin: '0 0 12px', color: 'var(--primary-color)', fontFamily: "'Playfair Display', serif" }}>{popup.title}</h3>
                        <p style={{ margin: 0, color: '#4f5c56', lineHeight: 1.7 }}>{popup.message}</p>
                        <button
                            type="button"
                            className="quote-submit-btn"
                            style={{ marginTop: '24px' }}
                            onClick={() => setPopup({ open: false, title: '', message: '' })}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {/* The Badge/Button */}
            <div 
                className={`floating-quote-badge ${isOpen ? 'active' : ''}`} 
                onClick={() => setIsOpen(true)}
            >
                <div className="badge-content">
                    <span className="badge-icon">
                        <i className="fas fa-calendar-check"></i>
                    </span>
                    <span className="badge-text">Get A Free Quote</span>
                </div>
            </div>

            {/* The Modal Overlay */}
            {isOpen && (
                <div className="quote-modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="quote-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="quote-modal-close" onClick={() => setIsOpen(false)}>
                            <i className="fas fa-times"></i>
                        </button>
                        
                        <div className="quote-modal-header">
                            <h2>Start Your Journey</h2>
                            <p>Request a personalised quote for your celebration</p>
                        </div>

                        <form className="quote-modal-form" onSubmit={handleSubmit}>
                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" name="fullName" placeholder="Your Name" required />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" name="phone" placeholder="+91 00000 00000" required />
                                </div>
                            </div>

                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" name="email" placeholder="yourname@email.com" required />
                                </div>
                                <div className="form-group">
                                    <label>Wedding Date</label>
                                    <input type="date" name="weddingDate" min={todayStr} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Wedding Place / Venue</label>
                                <input type="text" name="venue" placeholder="e.g. Kerala, Udaipur, Dubai..." required />
                            </div>

                            <button type="submit" className="quote-submit-btn">
                                Send Quote Request
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingQuote;
