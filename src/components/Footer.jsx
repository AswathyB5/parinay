import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <>
            <footer className="main-footer">
                <div className="container footer-grid">
                    <div className="footer-info">
                        <Link to="/" className="footer-logo">PARINAY<span>WEDDINGS</span></Link>
                        <p>Bespoke destination wedding planners based in Kerala, India.<br /> Planning meaningful celebrations
                            for
                            over 8 years.</p>
                        <div className="social-icons">
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-pinterest-p"></i></a>
                            <a href="#"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/services">Our Services</Link></li>
                            <li><Link to="/destination-weddings">Destination Weddings</Link></li>
                            <li><Link to="/themed-weddings">Themed Weddings</Link></li>
                            <li><Link to="/traditional-weddings">Traditional Weddings</Link></li>
                            <li><Link to="/journals">Journals</Link></li>
                        </ul>
                    </div>
                    <div className="footer-contact">
                        <h4>Connect With Us</h4>
                        <p><i className="fas fa-envelope"></i> hello@parinayweddings.com</p>
                        <p><i className="fas fa-phone-alt"></i> +91 98765 43210</p>
                        <p><i className="fas fa-map-marker-alt"></i> Cochin, Kerala, India</p>

                        <div className="footer-cta" style={{ marginTop: '45px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '25px' }}>
                            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontStyle: 'italic', marginBottom: '22px', opacity: '1', color: 'var(--secondary-color)' }}>Let's Start Your Journey</p>
                            <Link to="/contact" className="pw-btn pw-btn--gold" style={{ padding: '12px 28px', fontSize: '0.78rem' }}>Book a Consultation</Link>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom container">
                    <p>&copy; {new Date().getFullYear()} Parinay Weddings. All Rights Reserved.</p>
                </div>
            </footer>

            {/* WhatsApp Floating Button */}
            <a href="https://wa.me/919876543210?text=I'm%20interested%20in%20wedding%20consultation" className="whatsapp-btn"
                target="_blank" rel="noreferrer">
                <i className="fab fa-whatsapp"></i>
                <span>Chat with us</span>
            </a>
        </>
    );
};

export default Footer;