import React, { useState } from 'react';
import { API } from '../context/ContentContext';
import './FloatingQuote.css';

const FloatingQuote = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formEl = e.target;
        const submitBtn = formEl.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        const payload = {
            type: 'quote',
            name: formEl.fullName?.value || '',
            phone: formEl.phone?.value || '',
            email: formEl.email?.value || '',
            weddingDate: formEl.weddingDate?.value || '',
            weddingLocation: formEl.venue?.value || '',
        };

        try {
            const res = await fetch(`${API}/api/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                alert('Thank you! Your quote request has been sent. Our team will contact you within 24 hours.');
                setIsOpen(false);
                formEl.reset();
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch {
            alert('Could not reach the server. Please try again later.');
        }

        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    };

    return (
        <>
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
                                    <input type="date" name="weddingDate" required />
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
