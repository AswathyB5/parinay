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
                            <li><Link to="/stories">Wedding Stories</Link></li>
                            <li><Link to="/journals">Journals</Link></li>
                        </ul>
                    </div>
                    <div className="footer-contact">
                        <h4>Connect With Us</h4>
                        <p><i className="fas fa-envelope"></i> hello@parinayweddings.com</p>
                        <p><i className="fas fa-phone-alt"></i> +91 98765 43210</p>
                        <p><i className="fas fa-map-marker-alt"></i> Cochin, Kerala, India</p>
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