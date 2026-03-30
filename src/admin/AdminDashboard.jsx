import React, { useContext, useState, useEffect, useCallback } from 'react';
import { ContentContext, API } from '../context/ContentContext';
import {
    Save, Plus, Eye, LogOut, Image, Film, Type,
    Home, Info, Briefcase, BookOpen, Newspaper, Mail,
    Menu, X, Check, AlertCircle, LayoutGrid,
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
        youtubeVideos: 'YouTube Videos Grid',
        formLabel: 'Consultation Form Section',
        journalNote: 'Journal Preview Section'
    },
    about: {
        pageBannerTitle: 'Page Header',
        introLabel: 'Split Intro Section',
        heroImage: 'Upper Right Image',
        value1Title: 'Core Values Grid',
        differentiatorLabel: 'Company Philosophy',
        teamLabel: 'Team Section Header',
        teamMembers: 'Team Member Management',
        ctaHeading: 'Call to Action'
    },
    services: {
        pageBannerTitle: 'Page Header',
        servicesListLabel: 'Services Listing Intro',
        service1Label: 'Service 1: Full Planning',
        service2Label: 'Service 2: Design & Styling',
        service3Label: 'Service 3: Destination',
        service4Label: 'Service 4: Hospitality',
        processLabel: 'Our Process Section',
        ctaHeading: 'Call to Action'
    },
    contact: {
        pageBannerTitle: 'Page Header',
        heroImage: 'Cinematic Band',
        heroTitle: 'Band Copy',
        emailLabel: 'Inquiry Methods',
        whatsappNumber: 'Social & Chat'
    },
    storiesDestination: {
        pageBannerTitle: 'Page Header',
        storiesList: 'Wedding Stories List',
        heroImage: 'Section Banner',
        heroTitle: 'Banner Copy'
    },
    storiesThemed: {
        pageBannerTitle: 'Page Header',
        storiesList: 'Wedding Stories List',
        heroImage: 'Section Banner',
        heroTitle: 'Banner Copy'
    },
    storiesTraditional: {
        pageBannerTitle: 'Page Header',
        storiesList: 'Wedding Stories List',
        heroImage: 'Section Banner',
        heroTitle: 'Banner Copy'
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
    /* Home */
    'Hero Section': 'The very first thing visitors see — video background, tagline and call-to-action button.',
    'Introduction Text': 'The brand introduction paragraph and italic sub-text shown below the hero.',
    'Statistics Counter': 'Four credential badges shown as an animated strip (e.g. "8+ Years of Experience").',
    'Services Preview': 'The four service cards shown on the homepage with image, title and description.',
    'Destination Weddings Feature': 'The two-column section showcasing destination wedding expertise with images and text.',
    'Portfolio Glimpse': 'The image grid showing a sample of past weddings with a "View All" button.',
    'Client Testimonials': 'Rotating quotes from couples. Each item has text, author name, location and photo.',
    'Call to Action Section': 'The full-screen video band with the "Work With Us" prompt and button.',
    'YouTube / Video Section': 'Cinematic film section — label, heading, body paragraphs and watch more button.',
    'YouTube Videos Grid': 'Manage the 6 YouTube videos shown in the grid. Each item needs a YouTube Embed URL.',
    'Consultation Form Section': 'The label, heading, sub-text and button for the enquiry form on the homepage.',
    'Journal Preview Section': 'Auto-pulls the latest 3 posts from the Journal / Blog page.',
    /* About */
    'Page Header': 'The large decorative title shown in the dark banner at the top of the page.',
    'Split Intro Section': 'The small label and large split heading shown just below the hero banner.',
    'Upper Right Image': 'The portrait photo shown in the right column of the split intro section.',
    'Core Values Grid': 'The three value cards (Passion, Commitment, Team Work) shown in the light sand-colored section.',
    'Company Philosophy': 'The label, heading, body text and left-side image for the "Parinay Difference" block.',
    'Team Section Header': 'The label, main heading, and introduction paragraph for the "Meet the Experts" team section.',
    'Team Member Management': 'Add, edit, or remove the individual professional profile cards in the team grid.',
    'Call to Action': 'The CTA heading, button text, button link and background video for the closing band.',
    /* Services */
    'Services Listing Intro': 'The section label and heading shown above the four alternating service entries.',
    'Service 1: Full Planning': 'Label, image, heading and description for the Full Planning service.',
    'Service 2: Design & Styling': 'Label, image, heading and description for the Design & Styling service.',
    'Service 3: Destination': 'Label, image, heading and description for the Destination service.',
    'Service 4: Hospitality': 'Label, image, heading and description for the Hospitality service.',
    'Our Process Section': 'The four-step "How We Work" cards — label, heading, title and description for each step.',
    /* Contact */
    'Cinematic Band': 'The full-screen image shown at the bottom of the Contact page behind the heading.',
    'Band Copy': 'The large title, italic emphasis word and subtitle overlaid on the cinematic band image.',
    'Inquiry Methods': 'Email, phone and full address blocks displayed on the Contact page.',
    'Social & Chat': 'WhatsApp number, reply indicator, and social profile URLs (Instagram, Facebook, Pinterest).',
    /* Stories */
    'Wedding Stories List': 'Each story card — title, description, video file (MP4), date, location and category badge.',
    'Section Banner': 'The cinematic full-screen image band shown below the story list.',
    'Banner Copy': 'The heading and subtitle text overlaid on the banner image.',
    'Featured Testimonial': 'A highlighted couple quote, author name, location and photo shown beneath the banner.',
    /* Journals */
    'Content Settings': 'Section label and main section heading for the journal listing page.',
    'Blog Posts List': 'Individual journal posts — title, date, excerpt and cover image.',
    'Downloadable Guide Section': 'The guide offer block — label, title, description, three checklist items, cover image and button text.',
    /* Header / Footer */
    'Logo & Branding': 'The logo text shown in the top navigation bar.',
    'Primary Navigation': 'Main nav links (Home, About, Services, Journals…).',
    'Wedding Stories Dropdown': 'The three sub-links inside the "Wedding Stories" dropdown menu.',
    'CTA / Contact Link': 'The highlighted Contact link on the right side of the navigation bar.',
    'Footer Branding': 'Logo text and sub-label at the very top of the footer.',
    'Tagline & Description': 'Short brand description shown below the footer logo.',
    'Social Media Links': 'Instagram, Facebook, Pinterest and YouTube profile URLs.',
    'Contact Details': 'Email, phone and address shown in the footer Connect column.',
    'Footer CTA': 'Italic tagline and consultation button in the footer.',
    'Copyright': 'Copyright name shown in the footer bottom bar.',
};

const FIELD_HINTS = {
    /* General */
    heroTagline: 'Use \\n for a line break (e.g. "Thoughtfully Planned.\\nBeautifully Executed.").',
    heroBtnText: 'Label on the hero call-to-action button.',
    heroBtnUrl: 'Page the hero button links to.',
    heroVideo1:  'Primary looping background video (MP4). Upload or paste a /uploads/ path.',
    heroVideo2:  'Fallback / secondary hero video (MP4).',
    heroImages:  'Floating image slideshow alongside the hero text. Recommended: 1000×1400 px portrait.',
    stat1Label:  'Use \\n to split into two lines (e.g. "8+ Years of\\nExperience").',
    stat2Label:  'Use \\n to split into two lines.',
    stat3Label:  'Use \\n to split into two lines.',
    stat4Label:  'Use \\n to split into two lines.',
    introSubText: 'The smaller italic sentence shown beneath the main introduction heading.',
    youtubeEmbedUrl: 'Legacy field (no longer used in grid). Use YouTube Videos Grid below.',
    'url': 'Paste the YouTube Embed URL — Share → Embed (e.g. https://www.youtube.com/embed/xxxxx).',
    youtubeBtnUrl: 'Full URL of the YouTube channel or video (opens in a new tab).',
    transitionVideoUrl: 'The full-screen background video for the "Work With Us" CTA band (MP4).',
    transitionBtnUrl: 'Page the CTA band button links to.',
    whatsappNumber: 'Country code + number, no spaces or "+" (e.g. 919876543210 for India).',
    pageBannerTitle: 'The large decorative title in the dark banner at the top of the page.',
    /* Home services preview */
    servicesHeading: 'Use \\n to split into two lines — the second line renders in italics.',
    servicesIntroText: 'The short intro sentence shown above the four home service cards.',
    servicesFooterText: 'Closing italic line shown below the four service cards. Use \\n for line breaks.',
    /* Services listing */
    servicesListLabel: 'Small uppercase label shown above the main services heading (e.g. OUR SPECIALIZATIONS).',
    servicesListHeading: 'Large heading above the alternating service entries (e.g. The Art of Celebration).',
    processLabel: 'Small uppercase label above the process section heading.',
    processHeading: 'Main heading of the How We Work process section.',
    process1Title: 'Heading of the first process step.',
    process1Desc: 'Short description for the first process step.',
    process2Title: 'Heading of the second process step.',
    process2Desc: 'Short description for the second process step.',
    process3Title: 'Heading of the third process step.',
    process3Desc: 'Short description for the third process step.',
    process4Title: 'Heading of the fourth process step.',
    process4Desc: 'Short description for the fourth process step.',
    ctaDesc: 'Short paragraph shown below the CTA heading in the background image section at the bottom of the page.',
    ctaImage: 'Background image for the Call to Action section (Services page). Recommended: 1920×1200 px landscape.',
    /* About */
    introLabel: 'Small uppercase label above the intro heading (e.g., ABOUT PARINAY).',
    introHeading: 'The primary headline for the split section. Use \\n for a line break.',
    value1Title: 'Title for the first value card.',
    value1Desc: 'Detailed description for the first value card.',
    value2Title: 'Title for the second value card.',
    value2Desc: 'Detailed description for the second value card.',
    value3Title: 'Title for the third value card.',
    value3Desc: 'Detailed description for the third value card.',
    teamHeading: 'The main title for the team section (e.g., Meet Our Professional Team).',
    teamDesc: 'A short overview paragraph introducing your team of specialists.',
    ctaVideoUrl: 'Background video for the About page CTA band (MP4). Upload or paste a /uploads/ path.',
    differentiatorText: 'Separate paragraphs with a blank line (press Enter twice). Each paragraph renders on its own line.',
    /* Contact */
    heroTitle: 'Main heading shown in the cinematic band at the bottom of the Contact page.',
    heroTitleEm: 'Italic emphasis word shown on a second line below the hero title.',
    heroSubtitle: 'Subtitle paragraph shown beneath the hero heading.',
    address: 'Use \\n for a line break (e.g. "Cochin, Kerala\\nBy Appointment Only").',
    /* Stories */
    storiesList: 'Add, edit or remove story cards shown on this page.',
    video:    'Upload a wedding video (MP4) or paste an existing /uploads/ path. It autoplays muted on scroll.',
    badge:    'Short category label on the card (e.g. Destination, Themed, Traditional).',
    date:     'Wedding month & year shown on the card (e.g. February 2025).',
    location: 'Venue city / region shown on the card (e.g. Kumarakom, Kerala).',
    desc:     'One or two sentence summary shown in the story card overlay box.',
    /* Journals */
    sectionTitle: 'Main heading of the journal listing section (last word renders in accent colour).',
    journalsList: 'Add, edit or remove journal / blog posts.',
    excerpt:  'A single sentence that summarises the post — shown on each listing card.',
    guideYear: 'Year label on the guide cover badge (e.g. The 2026).',
    guidePlannerLabel: 'Second line of the cover badge (e.g. Planner).',
    guideFreeText: 'Small text beneath the cover badge (e.g. Free Download).',
    guideRequestBtnText: 'Label on the guide request button.',
    guideChecklist1: 'First bullet point in the guide checklist.',
    guideChecklist2: 'Second bullet point in the guide checklist.',
    guideChecklist3: 'Third bullet point in the guide checklist.',
    journalNote: 'Note: The journal preview on the homepage automatically shows the latest 3 entries from this list. Edit posts here, not on the homepage.',
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
            const response = await fetch(`${API}/api/upload`, {
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
            const response = await fetch(`${API}/api/upload`, {
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
        
        // --- CLEAN DATA FOR PRODUCTION --- 
        // We strip the absolute localhost URLs so that assets resolve correctly on Vercel
        const cleanData = (obj) => {
            if (!obj) return obj;
            try {
                const str = JSON.stringify(obj);
                // Matches the backend API base (e.g. localhost:5000)
                const cleaned = str.replace(new RegExp(`${API}/uploads`, 'g'), '/uploads');
                return JSON.parse(cleaned);
            } catch { return obj; }
        };
        const finalData = cleanData(formData);

        const res = await updateSection(activeTab, finalData);
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
        // Skip technical metadata and fields starting with underscore (like _id, __v, _hiddenSections)
        if (key === 'id' || key.startsWith('_')) return null;
 
        // Skip legacy ghost fields for About section that don't follow the underscore pattern
        if (activeTab === 'about' && [
            'heroQuote', 'teamSubtext', 'stat1Label', 'stat2Label', 'stat3Label', 'stat4Label',
            'philosophyAuthor', 'philosophySubtitle', 'philosophyQuote'
        ].includes(key)) return null;

        // Skip legacy ghost fields for Services section
        if (activeTab === 'services' && [
            'service1List', 'service2List', 'service3List', 'inquireBtnText', 'inquireBtnUrl'
        ].includes(key)) return null;

        // Skip image field in stories list (clutter, since we use video now)
        if (['storiesDestination', 'storiesThemed', 'storiesTraditional'].includes(activeTab) && key === 'image') return null;

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
        const isLongText = (typeof value === 'string' && value.length > 60
            && !value.startsWith('http')
            && !value.startsWith('/'))
            || key === 'content' || key === 'desc';

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

        return (
            <div className="admin-accordion">
                {sectionsData.map((section) => {
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
