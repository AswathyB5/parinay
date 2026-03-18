import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false); // Close menu on route change
    }, [location]);

    // To ensure the header text visibility on pages other than Home
    const isScrolled = scrolled || location.pathname !== '/';

    return (
        <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
            <nav className="container">
                <div className="logo">
                    <Link to="/">PARINAY<span>WEDDINGS</span></Link>
                </div>
                <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                    <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
                    <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
                    <li><Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>Services</Link></li>
                    <li><Link to="/stories" className={location.pathname === '/stories' ? 'active' : ''}>Wedding Stories</Link></li>
                    <li><Link to="/journals" className={location.pathname === '/journals' ? 'active' : ''}>Journals</Link></li>
                    <li><Link to="/contact" className={`cta-nav ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link></li>
                </ul>
                <div 
                    className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </header>
    );
};

export default Header;