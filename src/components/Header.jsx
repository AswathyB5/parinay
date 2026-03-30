import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ContentContext } from '../context/ContentContext';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { content } = useContext(ContentContext);

    // Fall back to defaults if context hasn't loaded yet
    const h = content?.header || {};
    const logoText      = h.logoText      || 'PARINAY';
    const nav1Label     = h.nav1Label     || 'Home';
    const nav1Url       = h.nav1Url       || '/';
    const nav2Label     = h.nav2Label     || 'About';
    const nav2Url       = h.nav2Url       || '/about';
    const nav3Label     = h.nav3Label     || 'Services';
    const nav3Url       = h.nav3Url       || '/services';
    const nav4Label     = h.nav4Label     || 'Wedding Stories';
    const nav4Url       = h.nav4Url       || '/stories';
    const nav4Sub1Label = h.nav4Sub1Label || 'Destination Weddings';
    const nav4Sub1Url   = h.nav4Sub1Url   || '/destination-weddings';
    const nav4Sub2Label = h.nav4Sub2Label || 'Themed Weddings';
    const nav4Sub2Url   = h.nav4Sub2Url   || '/themed-weddings';
    const nav4Sub3Label = h.nav4Sub3Label || 'Traditional Weddings';
    const nav4Sub3Url   = h.nav4Sub3Url   || '/traditional-weddings';
    const nav5Label     = h.nav5Label     || 'Journals';
    const nav5Url       = h.nav5Url       || '/journals';
    const nav6Label     = h.nav6Label     || 'Contact';
    const nav6Url       = h.nav6Url       || '/contact';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const isScrolled = scrolled || location.pathname !== '/';

    return (
        <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
            <nav className="container">
                <ul className="nav-links nav-links--left">
                    <li><Link to={nav1Url} className={location.pathname === nav1Url ? 'active' : ''}>{nav1Label}</Link></li>
                    <li><Link to={nav2Url} className={location.pathname === nav2Url ? 'active' : ''}>{nav2Label}</Link></li>
                    <li><Link to={nav3Url} className={location.pathname === nav3Url ? 'active' : ''}>{nav3Label}</Link></li>
                </ul>

                <div className="logo">
                    <Link to="/">{logoText}</Link>
                </div>

                <ul className="nav-links nav-links--right">
                    <li className="nav-dropdown">
                        <Link 
                            to={nav4Url} 
                            className={location.pathname.startsWith('/stories') ? 'active' : ''}
                        >
                            {nav4Label}
                        </Link>
                        <ul className="nav-dropdown-menu">
                            <li><Link to={nav4Sub1Url}>{nav4Sub1Label}</Link></li>
                            <li><Link to={nav4Sub2Url}>{nav4Sub2Label}</Link></li>
                            <li><Link to={nav4Sub3Url}>{nav4Sub3Label}</Link></li>
                        </ul>
                    </li>
                    <li><Link to={nav5Url} className={location.pathname === nav5Url ? 'active' : ''}>{nav5Label}</Link></li>
                    <li><Link to={nav6Url} className={`cta-nav ${location.pathname === nav6Url ? 'active' : ''}`}>{nav6Label}</Link></li>
                </ul>

                {/* Mobile menu */}
                <ul className={`nav-links mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
                    <li><Link to={nav1Url}>{nav1Label}</Link></li>
                    <li><Link to={nav2Url}>{nav2Label}</Link></li>
                    <li><Link to={nav3Url}>{nav3Label}</Link></li>
                    <li>
                        <Link to={nav4Url}>{nav4Label}</Link>
                        <ul className="mobile-sub-menu" style={{ listStyle: 'none', paddingLeft: '1rem', marginTop: '0.5rem' }}>
                            <li><Link to={nav4Sub1Url}>- {nav4Sub1Label}</Link></li>
                            <li><Link to={nav4Sub2Url}>- {nav4Sub2Label}</Link></li>
                            <li><Link to={nav4Sub3Url}>- {nav4Sub3Label}</Link></li>
                        </ul>
                    </li>
                    <li><Link to={nav5Url}>{nav5Label}</Link></li>
                    <li><Link to={nav6Url}>{nav6Label}</Link></li>
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