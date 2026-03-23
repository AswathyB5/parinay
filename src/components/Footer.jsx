import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext } from '../context/ContentContext';

const Footer = () => {
    const { content } = useContext(ContentContext);

    // Provide robust fallbacks 
    const f = content?.footer || {};
    const logoText        = f.logoText       || 'PARINAY';
    const logoSub         = f.logoSub        || 'WEDDINGS';
    const tagline         = f.tagline        || 'Bespoke destination wedding planners based in Kerala, India. Planning meaningful celebrations for over 8 years.';
    const instagramUrl    = f.instagramUrl   || '#';
    const facebookUrl     = f.facebookUrl    || '#';
    const pinterestUrl    = f.pinterestUrl   || '#';
    const youtubeUrl      = f.youtubeUrl     || '#';
    const email           = f.email          || 'hello@parinayweddings.com';
    const phone           = f.phone          || '+91 98765 43210';
    const address         = f.address        || 'Cochin, Kerala, India';
    const whatsappNumber  = f.whatsappNumber || '919876543210';
    const ctaTagline      = f.ctaTagline     || "Let's Start Your Journey";
    const ctaBtnText      = f.ctaBtnText     || "Book a Consultation";
    const ctaBtnUrl       = f.ctaBtnUrl      || "/contact";
    const copyrightName   = f.copyrightName  || "Parinay Weddings";
    
    // Header fallbacks for footer links
    const h = content?.header || {};
    const nav1Label     = h.nav1Label     || 'Home';
    const nav1Url       = h.nav1Url       || '/';
    const nav2Label     = h.nav2Label     || 'About';
    const nav2Url       = h.nav2Url       || '/about';
    const nav3Label     = h.nav3Label     || 'Services';
    const nav3Url       = h.nav3Url       || '/services';
    const nav4Sub1Label = h.nav4Sub1Label || 'Destination Weddings';
    const nav4Sub1Url   = h.nav4Sub1Url   || '/destination-weddings';
    const nav4Sub2Label = h.nav4Sub2Label || 'Themed Weddings';
    const nav4Sub2Url   = h.nav4Sub2Url   || '/themed-weddings';
    const nav4Sub3Label = h.nav4Sub3Label || 'Traditional Weddings';
    const nav4Sub3Url   = h.nav4Sub3Url   || '/traditional-weddings';
    const nav5Label     = h.nav5Label     || 'Journals';
    const nav5Url       = h.nav5Url       || '/journals';

    return (
        <>
            <footer className="main-footer">
                <div className="container footer-grid">
                    <div className="footer-info">
                        <Link to="/" className="footer-logo">{logoText}<span>{logoSub}</span></Link>
                        <p style={{ whiteSpace: 'pre-line' }}>{tagline}</p>
                        <div className="social-icons">
                            <a href={instagramUrl} target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
                            <a href={facebookUrl} target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
                            <a href={pinterestUrl} target="_blank" rel="noreferrer"><i className="fab fa-pinterest-p"></i></a>
                            <a href={youtubeUrl} target="_blank" rel="noreferrer"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to={nav1Url}>{nav1Label}</Link></li>
                            <li><Link to={nav2Url}>{nav2Label}</Link></li>
                            <li><Link to={nav3Url}>{nav3Label}</Link></li>
                            <li><Link to={nav4Sub1Url}>{nav4Sub1Label}</Link></li>
                            <li><Link to={nav4Sub2Url}>{nav4Sub2Label}</Link></li>
                            <li><Link to={nav4Sub3Url}>{nav4Sub3Label}</Link></li>
                            <li><Link to={nav5Url}>{nav5Label}</Link></li>
                        </ul>
                    </div>
                    <div className="footer-contact">
                        <h4>Connect With Us</h4>
                        <p><i className="fas fa-envelope"></i> {email}</p>
                        <p><i className="fas fa-phone-alt"></i> {phone}</p>
                        <p style={{ whiteSpace: 'pre-line' }}><i className="fas fa-map-marker-alt"></i> {address}</p>

                        <div className="footer-cta" style={{ marginTop: '45px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '25px' }}>
                            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontStyle: 'italic', marginBottom: '22px', opacity: '1', color: 'var(--secondary-color)' }}>{ctaTagline}</p>
                            <Link to={ctaBtnUrl} className="pw-btn pw-btn--gold" style={{ padding: '12px 28px', fontSize: '0.78rem' }}>{ctaBtnText}</Link>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom container">
                    <p>&copy; {new Date().getFullYear()} {copyrightName}. All Rights Reserved.</p>
                </div>
            </footer>

            {/* WhatsApp Floating Button */}
            <a href={`https://wa.me/${whatsappNumber}?text=I'm%20interested%20in%20wedding%20consultation`} className="whatsapp-btn"
                target="_blank" rel="noreferrer">
                <i className="fab fa-whatsapp"></i>
                <span>Chat with us</span>
            </a>
        </>
    );
};

export default Footer;