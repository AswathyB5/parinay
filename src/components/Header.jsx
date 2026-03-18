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
                <ul className="nav-links nav-links--left">
                    <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
                    <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
                    <li><Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>Services</Link></li>
                </ul>

                <div className="logo">
                    <Link to="/">PARINAY</Link>
                </div>

                <ul className="nav-links nav-links--right">
                    <li className="nav-dropdown">
                        <Link to="/stories" className={location.pathname.startsWith('/stories') ? 'active' : ''}>Wedding Stories</Link>
                        <ul className="nav-dropdown-menu">
                            <li><Link to="/destination-weddings">Destination Weddings</Link></li>
                            <li><Link to="/themed-weddings">Themed Weddings</Link></li>
                            <li><Link to="/traditional-weddings">Traditional Weddings</Link></li>
                        </ul>
                    </li>
                    <li><Link to="/journals" className={location.pathname === '/journals' ? 'active' : ''}>Journals</Link></li>
                    <li><Link to="/contact" className={`cta-nav ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link></li>
                </ul>

                {/* Mobile Menu Content (Aggregated for simple mobile view) */}
                <ul className={`nav-links mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/services">Services</Link></li>
                    <li><Link to="/stories">Wedding Stories</Link></li>
                    <li><Link to="/journals">Journals</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
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