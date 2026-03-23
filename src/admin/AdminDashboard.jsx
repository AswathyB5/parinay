import React, { useContext, useState, useEffect, useCallback } from 'react';
import { ContentContext } from '../context/ContentContext';
import {
    Save, Plus, Trash2, Eye, EyeOff, LogOut, Image, Film, Type,
    Home, Info, Briefcase, BookOpen, Newspaper, Mail,
    Menu, X, Check, AlertCircle, LayoutGrid, MoreVertical, Pencil,
    Layout, AlignLeft
} from 'lucide-react';
import './Admin.css';

/* ── Section Icon Map ──────────────────────────── */
const SECTION_ICONS = {
    home: <Home size={17} />,
    about: <Info size={17} />,
    services: <Briefcase size={17} />,
    storiesDestination: <BookOpen size={17} />,
    storiesThemed: <BookOpen size={17} />,
    storiesTraditional: <BookOpen size={17} />,
    journals: <Newspaper size={17} />,
    contact: <Mail size={17} />,
    header: <Layout size={17} />,
    footer: <AlignLeft size={17} />,
};

const SECTION_LABELS = {
    home: 'Main Homepage',
    about: 'About Us Page',
    services: 'Our Services',
    storiesDestination: 'Destination Weddings',
    storiesThemed: 'Themed Weddings',
    storiesTraditional: 'Traditional Weddings',
    journals: 'Journal / Blog',
    contact: 'Contact Page',
    header: 'Site Header & Nav',
    footer: 'Site Footer',
};

const SIDEBAR_GROUPS = [
    {
        title: 'Site Settings',
        tabs: ['header', 'footer']
    },
    {
        title: 'Main Site Pages',
        tabs: ['home', 'about', 'services', 'contact']
    },
    {
        title: 'Wedding Stories',
        tabs: ['storiesDestination', 'storiesThemed', 'storiesTraditional']
    },
    {
        title: 'Editorial Content',
        tabs: ['journals']
    }
];

/* ── Field Grouping Map ────────────────────────── */
// This allows us to inject headers between fields for complex pages like Home
const FIELD_GROUPS = {
    home: {
        heroTagline: 'Hero Section',
        introHeading: 'Introduction Text',
        stat1Label: 'Statistics Counter',
        servicesLabel: 'Services Preview',
        destinationLabel: 'Destination Weddings Feature',
        portfolioLabel: 'Portfolio Glimpse',
        testimonialLabel: 'Client Testimonials',
        transitionHeading: 'Call to Action Section',
        youtubeLabel: 'YouTube / Video Section',
        formLabel: 'Consultation Form Section',
        journalNote: 'Journal Preview Section'
    },
    about: {
        pageBannerTitle: 'Page Header',
        differentiatorLabel: 'The Parinay Difference',
        heroImage: 'Hero Section',
        teamLabel: 'Team Section',
        stat1Label: 'Statistics',
        philosophyQuote: 'Core Philosophy',
        ctaHeading: 'Ready to Start'
    },
    services: {
        pageBannerTitle: 'Page Header',
        service1Label: 'Service 1: Full Planning',
        service2Label: 'Service 2: Partial Planning',
        service3Label: 'Service 3: Coordination',
        processLabel: 'Our Process Section',
        ctaHeading: 'Call to Action'
    },
    contact: {
        pageBannerTitle: 'Page Header',
        heroImage: 'Contact Hero',
        emailLabel: 'Inquiry Methods',
        whatsappNumber: 'Social & Chat',
        footerImage: 'Footer Visual'
    },
    storiesDestination: {
        pageBannerTitle: 'Page Header',
        storiesList: 'Wedding Stories List',
        heroImage: 'Banner & Description',
        testimonialQuote: 'Featured Testimonial'
    },
    storiesThemed: {
        pageBannerTitle: 'Page Header',
        storiesList: 'Wedding Stories List',
        heroImage: 'Banner & Description',
        testimonialQuote: 'Featured Testimonial'
    },
    storiesTraditional: {
        pageBannerTitle: 'Page Header',
        storiesList: 'Wedding Stories List',
        heroImage: 'Banner & Description',
        testimonialQuote: 'Featured Testimonial'
    },
    journals: {
        pageBannerTitle: 'Page Header',
        sectionLabel: 'Content Settings',
        journalsList: 'Blog Posts List',
        guideLabel: 'Downloadable Guide Section'
    },
    header: {
        logoText: 'Logo & Branding',
        nav1Label: 'Primary Navigation',
        nav4Sub1Label: 'Wedding Stories Dropdown',
        nav6Label: 'CTA / Contact Link'
    },
    footer: {
        logoText: 'Footer Branding',
        tagline: 'Tagline & Description',
        instagramUrl: 'Social Media Links',
        email: 'Contact Details',
        ctaTagline: 'Footer CTA',
        copyrightName: 'Copyright'
    }
};

const GROUP_DESCRIPTIONS = {
    'Hero Section': 'This is the very first part of your page that visitors see. It should be high-impact.',
    'Introduction Text': 'Detailed text that introduces your brand and services.',
    'Statistics Counter': 'Use these to showcase your experience and success in numbers.',
    'Services Preview': 'A short glimpse of your core offerings displayed on the homepage.',
    'Destination Weddings Feature': 'Showcase your expertise in destination wedding planning.',
    'Portfolio Glimpse': 'Highlight specific weddings or projects to build trust.',
    'Client Testimonials': 'Quotes from happy couples that add social proof.',
    'Call to Action Section': 'The final push to get visitors to contact you or explore more.',
    'YouTube / Video Section': 'Embed cinematic wedding films from your YouTube channel.',
    'Consultation Form Section': 'Text around the consultation request form.',
    'Journal Preview Section': 'This section is controlled by the Journal / Blog page.',
    'The Parinay Difference': 'Explain why your approach is unique and special.',
    'Team Section': 'Introduce the faces behind Parinay Weddings.',
    'Service 1: Full Planning': 'Details for the comprehensive planning package.',
    'Service 2: Partial Planning': 'Details for the collaborative planning package.',
    'Service 3: Coordination': 'Details for the month-of coordination package.',
    'Our Process Section': 'Explain the steps of working with you.',
    'Social & Chat': 'WhatsApp and social media profile links.',
    'Wedding Stories List': 'Manage the collection of stories displayed on the page.',
    'Blog Posts List': 'The main list of journal entries/blog posts.',
    'Downloadable Guide Section': 'A section to offer a free guide in exchange for contact info.',
    'Logo & Branding': 'The logo text that appears in the top-left of the navigation bar.',
    'Primary Navigation': 'The main navigation links shown on the left side of the header.',
    'Dropdown Sub-links': 'The three category links shown inside the Wedding Stories dropdown.',
    'CTA / Contact Link': 'The highlighted call-to-action link on the right side of the nav.',
    'Footer Branding': 'Logo text and sub-label shown at the top of the footer.',
    'Tagline & Description': 'The short description text shown below the footer logo.',
    'Social Media Links': 'URLs for Instagram, Facebook, Pinterest, and YouTube icons.',
    'Contact Details': 'Email, phone and address shown in the Connect With Us column.',
    'Footer CTA': 'The italic tagline and button shown at the bottom of the footer.',
    'Copyright': 'The copyright name shown in the footer bottom bar.',
};

const FIELD_HINTS = {
    heroTagline: 'Use \n for line breaks in the text.',
    heroVideo1: 'Upload a short, atmospheric video (MP4 format).',
    heroImages: 'Upload high-resolution images for the background slideshow.',
    stat1Label: 'Example: "8+ Years of \nExperience"',
    youtubeEmbedUrl: 'Paste the YouTube "Embed" URL (e.g. https://www.youtube.com/embed/...)',
    whatsappNumber: 'Must include country code without "+" (e.g. 919876543210)',
    pageBannerTitle: 'The large heading at the top of the page.',
    excerpt: 'A short one-sentence summary for the preview card.',
    storiesList: 'Manage the collection of stories below.',
    journalsList: 'Manage your blog posts here.',
    journalNote: 'Note: The journal section on your homepage automatically pulls the latest 3 entries from the Journal / Blog section in the sidebar. To edit the journal titles or posts, please click on "Journal / Blog" under Editorial Content.',
};

/* ── Toast Component ───────────────────────────── */
const Toast = ({ message, type = 'success', onDone }) => {
    useEffect(() => {
        const t = setTimeout(onDone, 3000);
        return () => clearTimeout(t);
    }, [onDone]);

    return (
        <div className={`admin-toast ${type === 'error' ? 'is-error' : ''}`}>
            {type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{message}</span>
        </div>
    );
};

/* ── Media Preview ─────────────────────────────── */
const MediaPreview = ({ value, isVideo }) => {
    if (!value) {
        return (
            <div className="admin-media-preview">
                <div className="admin-media-preview__empty">
                    {isVideo ? <Film size={24} /> : <Image size={24} />}
                    <span>No {isVideo ? 'video' : 'image'} selected</span>
                </div>
            </div>
        );
    }
    return (
        <div className="admin-media-preview">
            <span className="admin-media-preview__badge">{isVideo ? '▶ Video' : '🖼 Image'}</span>
            {isVideo
                ? <video src={value} muted controls />
                : <img src={value} alt="preview" />
            }
        </div>
    );
};

/* ── Main Dashboard ────────────────────────────── */
const AdminDashboard = () => {
    const { content, updateSection, isLoaded } = useContext(ContentContext);

    const [activeTab, setActiveTab] = useState('header');
    const [formData, setFormData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});
    const [openMenuId, setOpenMenuId] = useState(null);

    /* Toggle section expansion */
    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    /* Sync formData when tab changes or content loads */
    useEffect(() => {
        if (content && content[activeTab]) {
            setFormData(JSON.parse(JSON.stringify(content[activeTab])));
        }
    }, [activeTab, content]);

    /* ── Handlers ────────────────────────────────── */
    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        setSidebarOpen(false);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (index, arrayName, field, value) => {
        setFormData(prev => {
            const newArray = [...prev[arrayName]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [arrayName]: newArray };
        });
    };

    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
        const uploadData = new FormData();
        uploadData.append('file', file);
        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: uploadData,
            });
            const data = await response.json();
            if (data.success && data.url) {
                handleChange(field, data.url);
            } else {
                showToast('Upload failed — try again.', 'error');
            }
        } catch {
            showToast('Could not reach the upload server.', 'error');
        }
    };

    const handleArrayFileUpload = async (e, index, arrayName, field) => {
        const file = e.target.files[0];
        if (!file) return;
        const uploadData = new FormData();
        uploadData.append('file', file);
        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: uploadData,
            });
            const data = await response.json();
            if (data.success && data.url) {
                handleArrayChange(index, arrayName, field, data.url);
            } else {
                showToast('Upload failed — try again.', 'error');
            }
        } catch {
            showToast('Could not reach the upload server.', 'error');
        }
    };

    const addArrayItem = (arrayName) => {
        setFormData(prev => {
            const existing = prev[arrayName] || [];
            const template = existing[0] || {};
            const blank = Object.keys(template).reduce((acc, k) => {
                if (k !== 'id') acc[k] = '';
                return acc;
            }, {});
            return { ...prev, [arrayName]: [...existing, { ...blank, id: Date.now() }] };
        });
    };

    const removeArrayItem = (index, arrayName) => {
        setFormData(prev => {
            const newArr = [...prev[arrayName]];
            newArr.splice(index, 1);
            return { ...prev, [arrayName]: newArr };
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        const res = await updateSection(activeTab, formData);
        setIsSaving(false);
        if (res.success) {
            showToast(`${SECTION_LABELS[activeTab]} updated successfully!`);
        } else {
            showToast(res.error || `Error saving. Is MongoDB connected?`, 'error');
        }
    };

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const renderField = (key, value, onChange, onFileUpload) => {
        if (key === 'id') return null;

        // Special case: just info, no input
        if (key === 'journalNote') {
            return (
                <div className="admin-form-group" key={key}>
                    <p className="admin-field-hint" style={{ fontSize: '0.9rem', color: 'var(--admin-text)' }}>
                        <AlertCircle size={14} style={{ marginRight: '8px' }} />
                        {FIELD_HINTS[key]}
                    </p>
                </div>
            )
        }

        const isMedia = key.toLowerCase().includes('image') || key.toLowerCase().includes('video');
        const isVideo = key.toLowerCase().includes('video');
        const isUrl = key.toLowerCase().includes('url');
        const isInternalUrl = (key.toLowerCase().endsWith('btnurl') || key.toLowerCase() === 'herobtnurl' || key.toLowerCase().endsWith('viewallurl'))
            && !key.toLowerCase().includes('youtube')
            && !key.toLowerCase().includes('instagram')
            && !key.toLowerCase().includes('facebook')
            && !key.toLowerCase().includes('pinterest');
        const isLongText = typeof value === 'string' && value.length > 60
            && !value.startsWith('http')
            && !value.startsWith('/');

        return (
            <div className="admin-form-group" key={key}>
                <label>
                    {isVideo ? <Film size={12} /> : isMedia ? <Image size={12} /> : <Type size={12} />}
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {isMedia ? (
                    <>
                        <MediaPreview value={value} isVideo={isVideo} />
                        <input
                            type="file"
                            accept={isVideo ? 'video/*' : 'image/*'}
                            onChange={onFileUpload}
                            className="admin-input"
                        />
                        <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            className="admin-input"
                            placeholder="…or paste a URL directly"
                            style={{ marginTop: '6px' }}
                        />
                    </>
                ) : isInternalUrl ? (
                    <select
                        value={value || '/'}
                        onChange={(e) => onChange(e.target.value)}
                        className="admin-input"
                        style={{ appearance: 'auto' }}
                    >
                        <option value="/">Home</option>
                        <option value="/about">About Us</option>
                        <option value="/services">Services</option>
                        <option value="/stories">Wedding Stories</option>
                        <option value="/journals">Journals</option>
                        <option value="/contact">Contact</option>
                    </select>
                ) : isLongText ? (
                    <textarea
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="admin-input textarea"
                    />
                ) : (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="admin-input"
                    />
                )}
                {FIELD_HINTS[key] && (
                    <p className="admin-field-hint">
                        <AlertCircle size={10} style={{ marginRight: '4px' }} />
                        {FIELD_HINTS[key]}
                    </p>
                )}
            </div>
        );
    };

    /* ── Form Renderer ───────────────────────────── */
    const renderForm = () => {
        if (!formData) return null;

        const groupHeaders = FIELD_GROUPS[activeTab] || {};
        const sectionsData = [];
        let currentGroup = null;

        // Group fields based on FIELD_GROUPS mapping
        Object.keys(formData).forEach((key) => {
            const header = groupHeaders[key];
            if (header) {
                currentGroup = {
                    id: `${activeTab}-${key}`,
                    title: header,
                    description: GROUP_DESCRIPTIONS[header],
                    fields: []
                };
                sectionsData.push(currentGroup);
            }
            if (currentGroup) {
                currentGroup.fields.push(key);
            }
        });

        const filteredSections = sectionsData.filter(section => !(formData._deletedSections || []).includes(section.id));

        return (
            <div className="admin-accordion" onClick={() => setOpenMenuId(null)}>
                {filteredSections.map((section) => {
                    const isExpanded = expandedSections[section.id];

                    return (
                        <div key={section.id} className={`admin-accordion__item ${isExpanded ? 'is-expanded' : ''}`}>
                            {/* Header row */}
                            <header
                                className="admin-accordion__header"
                            >
                                <div className="admin-acc-header-left">
                                    <button
                                        className={`admin-acc-edit-btn ${isExpanded ? 'is-active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSection(section.id);
                                        }}
                                        title={isExpanded ? 'Close section' : 'Edit section'}
                                    >
                                        {isExpanded ? 'Close' : 'Edit'}
                                    </button>
                                </div>

                                {/* Section title */}
                                <h2 className="admin-accordion__title">
                                    {section.title}
                                </h2>

                                {/* Actions — right (visible on hover) */}
                                <div className="admin-acc-actions-hover">
                                    <button
                                        className="admin-btn-icon-hover admin-btn-icon-hover--danger"
                                        title="Delete Section"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(`Are you sure you want to permanently delete the "${section.title}" section? This cannot be undone.`)) {
                                                handleChange('_deletedSections', [...(formData._deletedSections || []), section.id]);
                                            }
                                        }}
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </header>

                            {isExpanded && (
                                <div className="admin-accordion__content">
                                    {section.description && (
                                        <p className="admin-section__desc" style={{ marginTop: '0', marginBottom: '1.5rem' }}>
                                            {section.description}
                                        </p>
                                    )}
                                    <div className="admin-fields-grid">
                                        {section.fields.map((fieldKey) => {
                                            const val = formData[fieldKey];
                                            if (Array.isArray(val)) {
                                                return (
                                                    <div key={fieldKey} className="admin-array-section" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                                                        <h3 style={{ marginBottom: '1.5rem', textTransform: 'capitalize', color: 'var(--admin-green)' }}>
                                                            {fieldKey.replace(/([A-Z])/g, ' $1').trim()}
                                                        </h3>

                                                        {val.length === 0 && (
                                                            <div className="admin-empty" style={{ margin: '1rem 0' }}>
                                                                <div className="admin-empty__icon"><LayoutGrid size={24} /></div>
                                                                <p>No items yet. Click "Add New" to get started.</p>
                                                            </div>
                                                        )}

                                                        {val.map((item, index) => (
                                                            <div key={item.id || index} className="admin-array-item">
                                                                <span className="admin-array-item__index">#{index + 1}</span>
                                                                <button
                                                                    className="admin-array-item__remove"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        removeArrayItem(index, fieldKey);
                                                                    }}
                                                                    title="Remove this item"
                                                                >
                                                                    <X size={16} />
                                                                </button>

                                                                <div style={{ marginTop: '1.5rem' }}>
                                                                    {Object.keys(item).map((itemKey) =>
                                                                        renderField(
                                                                            itemKey,
                                                                            item[itemKey],
                                                                            (newVal) => handleArrayChange(index, fieldKey, itemKey, newVal),
                                                                            (e) => handleArrayFileUpload(e, index, fieldKey, itemKey)
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <button
                                                            className="admin-btn admin-btn--outline"
                                                            style={{ marginTop: '0.5rem' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addArrayItem(fieldKey);
                                                            }}
                                                        >
                                                            <Plus size={15} />
                                                            Add New {fieldKey.replace(/s$/, '').replace(/List$/, '')}
                                                        </button>
                                                    </div>
                                                );
                                            } else {
                                                return renderField(
                                                    fieldKey,
                                                    val,
                                                    (newVal) => handleChange(fieldKey, newVal),
                                                    (e) => handleFileUpload(e, fieldKey)
                                                );
                                            }
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    /* ── Stats (derived from content) ────────────── */
    const totalSections = content ? Object.keys(content).length : 0;
    const totalArrayItems = content
        ? Object.values(content).reduce((total, section) => {
            if (!section || typeof section !== 'object') return total;
            return total + Object.values(section).reduce((t, v) =>
                Array.isArray(v) ? t + v.length : t, 0);
        }, 0)
        : 0;

    /* ── Render ──────────────────────────────────── */
    return (
        <div className="admin-dashboard">

            {/* Mobile sidebar toggle */}
            <button
                className="admin-sidebar-toggle"
                onClick={() => setSidebarOpen(o => !o)}
                aria-label="Toggle navigation"
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* ── SIDEBAR ── */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
                <div className="admin-sidebar__brand">
                    <span className="admin-sidebar__brand-name">Parinay</span>
                    <span className="admin-sidebar__brand-sub">Admin Console</span>
                </div>

                {SIDEBAR_GROUPS.map((group) => (
                    <div key={group.title} className="admin-sidebar__group">
                        <p className="admin-sidebar__label">
                            {group.title === 'Main Site Pages' && <LayoutGrid size={11} style={{ marginRight: '8px', opacity: 0.6 }} />}
                            {group.title === 'Wedding Stories' && <Image size={11} style={{ marginRight: '8px', opacity: 0.6 }} />}
                            {group.title === 'Editorial Content' && <Newspaper size={11} style={{ marginRight: '8px', opacity: 0.6 }} />}
                            {group.title === 'Site Settings' && <Layout size={11} style={{ marginRight: '8px', opacity: 0.6 }} />}
                            {group.title}
                        </p>
                        <ul className="admin-sidebar__nav">
                            {group.tabs.map((tab) => (
                                <li key={tab}>
                                    <button
                                        className={`admin-sidebar__nav-btn ${activeTab === tab ? 'is-active' : ''}`}
                                        onClick={() => handleTabSwitch(tab)}
                                    >
                                        <span className="admin-sidebar__nav-icon">
                                            {SECTION_ICONS[tab] || <LayoutGrid size={17} />}
                                        </span>
                                        {SECTION_LABELS[tab] || tab}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className="admin-sidebar__footer">
                    <button
                        className="admin-sidebar__exit-btn"
                        onClick={() => window.location.href = '/'}
                    >
                        <LogOut size={16} />
                        Exit to Website
                    </button>
                </div>
            </aside>

            {/* ── MAIN ── */}
            <div className="admin-main">

                {/* Top bar */}
                <header className="admin-topbar">
                    <div className="admin-topbar__breadcrumb">
                        <span className="admin-topbar__breadcrumb-root">Admin</span>
                        <span className="admin-topbar__breadcrumb-sep">✦</span>
                        <span className="admin-topbar__breadcrumb-current">
                            {SECTION_LABELS[activeTab] || activeTab}
                        </span>
                    </div>
                    <div className="admin-topbar__actions">
                        <button
                            className="admin-btn admin-btn--ghost admin-btn--sm"
                            onClick={() => window.open('/', '_blank')}
                        >
                            <Eye size={14} /> Preview
                        </button>
                        <button
                            className="admin-btn admin-btn--primary admin-btn--sm"
                            onClick={handleSave}
                            disabled={isSaving || !isLoaded}
                        >
                            <Save size={14} />
                            {isSaving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="admin-page">

                    {/* Stats bar */}
                    <div className="admin-stats-bar">
                        <div className="admin-stat-card">
                            <Briefcase size={28} className="admin-stat-card__icon" />
                            <div className="admin-stat-card__label">Content Sections</div>
                            <div className="admin-stat-card__value">{totalSections}</div>
                        </div>
                        <div className="admin-stat-card">
                            <LayoutGrid size={28} className="admin-stat-card__icon" />
                            <div className="admin-stat-card__label">Total Items</div>
                            <div className="admin-stat-card__value">{totalArrayItems}</div>
                        </div>
                        <div className="admin-stat-card">
                            <BookOpen size={28} className="admin-stat-card__icon" />
                            <div className="admin-stat-card__label">Journal Entries</div>
                            <div className="admin-stat-card__value">
                                {content?.journals?.journalsList?.length ?? 0}
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <BookOpen size={28} className="admin-stat-card__icon" />
                            <div className="admin-stat-card__label">Wedding Stories</div>
                            <div className="admin-stat-card__value">
                                {(content?.storiesDestination?.storiesList?.length ?? 0) +
                                    (content?.storiesThemed?.storiesList?.length ?? 0) +
                                    (content?.storiesTraditional?.storiesList?.length ?? 0)}
                            </div>
                        </div>
                    </div>

                    {/* Editing header */}
                    <div className="admin-page__header">
                        <div>
                            <h1 className="admin-page__title">
                                Editing &nbsp;<em>{SECTION_LABELS[activeTab] || activeTab}</em>
                            </h1>
                            <p className="admin-page__subtitle">
                                Make your changes below and click "Save Changes" when you're done.
                            </p>
                        </div>
                        <button
                            className="admin-btn admin-btn--primary"
                            onClick={handleSave}
                            disabled={isSaving || !isLoaded}
                        >
                            <Save size={15} />
                            {isSaving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>

                    {/* Form */}
                    {!isLoaded ? (
                        <div className="admin-loading">
                            <div className="admin-loading__ring" />
                            <span>Loading content from server…</span>
                        </div>
                    ) : (
                        <div style={{ maxWidth: '880px' }}>
                            {renderForm()}
                        </div>
                    )}
                </main>
            </div>

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onDone={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
