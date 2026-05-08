import React, { useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ContentContext, renderText, resolveMediaURL } from '../context/ContentContext';
import { Calendar, User, Facebook, Twitter, Instagram } from 'lucide-react';

const JournalDetail = () => {
    const { id } = useParams();
    const { content } = useContext(ContentContext);
    const { journals } = content;

    const post = journals.journalsList.find(p => p.id === parseInt(id));

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // --- Scroll Reveal Logic ---
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => {
            revealElements.forEach(el => observer.unobserve(el));
        };
    }, [id]);

    if (!post) {
        return (
            <div className="pw-page" style={{ padding: '200px 0', textAlign: 'center' }}>
                <div className="pw-container">
                    <h2 className="pw-section-header__title">Post Not Found</h2>
                    <p style={{ margin: '30px 0' }}>We couldn't find the journal entry you're looking for.</p>
                    <Link to="/journals" className="pw-btn">Back to Journal</Link>
                </div>
            </div>
        );
    }

    const paragraphs = post.content ? post.content.split('\n\n') : [];
    const introPara = paragraphs[0];
    const restOfContent = paragraphs.slice(1);

    return (
        <div className="pw-page">
            {/* ═══ SECTION: PAGE BANNER ═══ */}
            <section className="about-hero-new" style={{ padding: '160px 0 140px' }}>
                <div className="pw-container reveal" style={{ position: 'relative' }}>
                    <h1 className="pw-article-title">{post.title}</h1>
                    
                    <div className="pw-article-meta">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={14} color="var(--accent-color)" /> {post.date}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={14} color="var(--accent-color)" /> {post.author || "By Parinay"}
                        </span>
                    </div>
                </div>
            </section>

            {/* ═══ SECTION: BLOG CONTENT ═══ */}
            <section className="pw-article-reading" style={{ padding: '80px 0 150px', background: '#fdfbf7' }}>
                <div className="pw-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                    <div className="pw-article-body reveal" style={{ 
                        color: 'var(--text-dark)', 
                        lineHeight: '1.8', 
                        fontSize: '1.15rem',
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: '300'
                    }}>
                        {/* Featured Image */}
                        <div className="pw-article-img-wrap">
                            <img 
                                src={resolveMediaURL(post.image)} 
                                alt={post.title} 
                                className="pw-article-img-inner"
                            />
                        </div>

                        {/* Intro Paragraph First */}
                        <div style={{ marginBottom: '40px' }}>
                            {renderText(introPara)}
                        </div>


                        {restOfContent.map((para, idx) => {
                            if (para.startsWith('###')) {
                                return (
                                    <h3 key={idx} className="pw-article-h3">
                                        {para.replace('###', '').trim()}
                                    </h3>
                                )
                            }
                            return <p key={idx} style={{ marginBottom: '30px' }}>{renderText(para)}</p>
                        })}
                    </div>

                    <div className="pw-article-footer reveal" style={{ 
                        marginTop: '120px', 
                        padding: '100px 60px', 
                        background: 'var(--primary-color)', 
                        color: 'var(--secondary-color)',
                        textAlign: 'center',
                        position: 'relative',
                        borderRadius: '2px',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.1)'
                    }}>
                        <span className="pw-label pw-label--light">{renderText(journals.ctaLabel || "READY TO START?")}</span>
                        <h2 className="pw-article-cta-title">
                            {renderText(journals.ctaTitle || "Let us craft your _Unique Narrative_")}
                        </h2>
                        <Link to="/contact" className="pw-btn pw-btn--gold">{renderText(journals.ctaBtnText || "Get in Touch — Start Planning")}</Link>
                    </div>
                </div>
            </section>

            {/* ═══ SECTION: MORE ENTRIES ═══ Section modified to look more of a luxury gallery */}
            <section className="pw-more-reading" style={{ padding: '150px 0', background: '#f0ede6' }}>
                <div className="pw-container">
                    <div style={{ textAlign: 'center', marginBottom: '100px' }}>
                         <span className="pw-label">{renderText(journals.relatedSectionLabel || "CONTINUE READING")}</span>
                         <h2 className="pw-section-header__title" style={{ fontSize: '3.2rem' }}>
                             {renderText(journals.relatedSectionTitle || "More Stories")}
                         </h2>
                    </div>

                    <div className="pw-journal__grid">
                        {journals.journalsList.filter(p => p.id !== parseInt(id)).slice(0, 3).map((item) => (
                            <Link key={item.id} to={`/journals/${item.id}`} className="pw-journal__card" style={{ textDecoration: 'none' }}>
                                <div className="pw-journal__img-wrap">
                                    <img src={resolveMediaURL(item.image)} alt={item.title} className="pw-journal__img" />
                                </div>
                                <div style={{ padding: '0 10px' }}>
                                    <span className="pw-journal__meta">{item.date} — Journal</span>
                                    <h3 className="pw-journal__title" style={{ fontSize: '1.8rem' }}>{item.title}</h3>
                                    <p className="pw-journal__excerpt" style={{ marginBottom: '25px' }}>{item.excerpt}</p>
                                    <span className="pw-link-arrow" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-color)' }}>{renderText(journals.readEntryText || "Explore Entry —")}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default JournalDetail;
