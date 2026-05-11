import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentContext, API } from '../context/ContentContext';
import {
    Save, Plus, Eye, LogOut, Image, Film, Type,
    Home, Info, Briefcase, BookOpen, Newspaper, Mail,
    Menu, X, Check, AlertCircle, LayoutGrid,
    Layout, AlignLeft, MessageSquare, Trash2, Clock,
    Phone, MapPin, Calendar, User, ArrowRight
} from 'lucide-react';
import './Admin.css';

/* ── UTILS ── */
const isVideoUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    const extensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.quicktime'];
    const lower = url.toLowerCase();
    return extensions.some(ext => lower.includes(ext)) || lower.includes('video');
};

const getYoutubeEmbedUrl_local = (url) => {
    if (!url || typeof url !== 'string') return "";
    let id = "";
    if (url.includes('v=')) {
        id = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
        id = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('embed/')) {
        return url;
    } else {
        return url;
    }
    return `https://www.youtube.com/embed/${id}`;
};

const renderAdminPreview = (text) => {
    if (!text || typeof text !== 'string') return text;
    
    const lines = text.split(/\\n|\n/);
    return lines.map((line, i) => {
        const trimLine = line.trim();

        // Handle "Best for:" as a stylized pill list in preview
        if (trimLine.toLowerCase().startsWith('best for:')) {
            const content = trimLine.replace(/^[Bb]est [Ff]or:\s*/, '');
            const tags = content.split('|').map(t => t.trim()).filter(t => t);
            return (
                <div key={i} style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ width: '100%', fontSize: '0.65rem', textTransform: 'uppercase', color: '#C5A059', letterSpacing: '0.1em', marginBottom: '4px' }}>Best For</div>
                    {tags.map((tag, ti) => (
                        <span key={ti} style={{ 
                            padding: '4px 10px', 
                            backgroundColor: '#3a1219', 
                            borderRadius: '100px', 
                            fontSize: '0.75rem', 
                            color: '#fff',
                            fontWeight: '500'
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>
            );
        }

        // Replace ###text### with bold
        let parts = line.split(/(###.*?###|\[\[.*?\]\]|__.*?__|_.*?_)/g);
        
        const processed = parts.map((part, j) => {
            if (part.startsWith('###') && part.endsWith('###')) {
                return <strong key={j} style={{ fontWeight: '800' }}>{part.slice(3, -3)}</strong>;
            }
            if (part.startsWith('[[') && part.endsWith(']]')) {
                return <em key={j} style={{ fontStyle: 'italic', color: '#C5A059', fontWeight: '500' }}>{part.slice(2, -2)}</em>;
            }
            if ((part.startsWith('__') && part.endsWith('__')) || (part.startsWith('_') && part.endsWith('_'))) {
                const content = part.startsWith('__') ? part.slice(2, -2) : part.slice(1, -1);
                return <em key={j} style={{ fontStyle: 'italic' }}>{content}</em>;
            }
            return part;
        });

        return (
            <React.Fragment key={i}>
                {processed}
                {i < lines.length - 1 && <br />}
            </React.Fragment>
        );
    });
};

/* ══════════════════════════════════════════════════
   SECTION CONFIGURATION — ICONS & LABELS
══════════════════════════════════════════════════ */
const SECTION_ICONS = {
    home: <Home size={17} />,
    about: <Info size={17} />,
    services: <Briefcase size={17} />,
    weddingStories: <Image size={17} />,
    storiesDestination: <BookOpen size={17} />,
    journals: <Newspaper size={17} />,
    contact: <Mail size={17} />,
    header: <Layout size={17} />,
    footer: <AlignLeft size={17} />,
    inquiries: <MessageSquare size={17} />,
};

const SECTION_LABELS = {
    home: 'Main Homepage',
    about: 'About Us Page',
    services: 'Our Services',
    weddingStories: 'Wedding Stories Page',
    storiesDestination: 'Destination Weddings',
    journals: 'Journal / Blog',
    contact: 'Contact Page',
    header: 'Site Header & Nav',
    footer: 'Site Footer',
    inquiries: 'Customer Inquiries',
};

const SIDEBAR_GROUPS = [
    { title: 'Global Branding', tabs: ['header', 'footer'] },
    { title: 'Page Content', tabs: ['home', 'about', 'services', 'contact'] },
    { title: 'Galleries & Stories', tabs: ['weddingStories', 'storiesDestination'] },
    { title: 'Editorial', tabs: ['journals'] },
    { title: 'Customer Leads', tabs: ['inquiries'] }
];

/* ══════════════════════════════════════════════════
   LINKED SECTIONS — Disabled. Each page now has fully
   independent content management. No shared content.
══════════════════════════════════════════════════ */
const LINKED_SECTIONS = {};

/* ══════════════════════════════════════════════════
   FIELD GROUPS — Maps the first field key to its group header.
   Every subsequent key goes into the same group until the next
   mapped key is encountered.  EVERY field in initialContent
   must be reachable via one of these groups.
══════════════════════════════════════════════════ */
const FIELD_GROUPS = {
    /* ── HOME PAGE ─────────────────────────────────── */
    home: {
        heroTagline:        'Hero Section',
        heroVideos:         'Hero Background Videos',
        heroImages:         'Hero Floating Images',
        introHeading:       'Introduction Text',
        stat1Label:         'Statistics Counter',
        servicesLabel:      'Services Preview',
        homeServices:       'Services Cards',
        destinationLabel:   'Destination Weddings Feature',
        portfolioLabel:     'Portfolio Glimpse',
        testimonialLabel:   'Client Testimonials',
        transitionHeading:  'Cinematic CTA Band',
        youtubeLabel:       'YouTube / Video Section',
        youtubeVideos:      'YouTube Videos Grid',
        formLabel:          'Consultation Form Section',
        journalNote:        'Journal Preview Note',
        testimonialHeading: 'Client Testimonials',
        youtubeEmbedUrl:    'Featured YouTube Video',
        achievements:       'Achievements Bar'
    },
    /* ── ABOUT PAGE ────────────────────────────────── */
    /* Keys MUST follow the JSON key order in site-content.json so that
       un-mapped keys fall into the correct preceding group.            */
    about: {
        seoTitle:             'SEO Settings',
        pageBannerTitle:      'Page Header',
        introLabel:           'Split Intro Section',
        differentiatorLabel:  'The Parinay Difference',
        specialitiesLabel:    'Specialities Section',
        specialitiesSubtext:  'Specialities Section',
        specialities:         'Specialities List',
        heroImage:            'About Hero Banner',
        heroQuote:            'Hero Quote',
        teamLabel:            'Team Section',
        stat1Label:           'About Stats Band',
        philosophyQuote:      'Our Philosophy',
        promiseBtnText:       'Our Philosophy',
        ctaHeading:           'About CTA Band',
    },
    /* ── SERVICES PAGE ─────────────────────────────── */
    services: {
        pageBannerTitle:        'Page Header',
        comprehensiveHeading:   'Comprehensive Services',
        comprehensiveList:      'Detailed Services Grid',
        processLabel:           'The Planning Process',
        processItems:           'Process Steps',
        ctaHeading:             'Closing CTA Band',
    },
    /* ── CONTACT PAGE ──────────────────────────────── */
    contact: {
        pageBannerTitle:  'Page Header',
        emailLabel:       'Email Inquiry',
        phoneLabel:       'Phone Inquiry',
        addressLabel:     'Office Address',
        whatsappNumber:   'WhatsApp & Social',
        formBtnText:      'Inquiry Form Settings',
        youtubeUrl:       'WhatsApp & Social',
    },
    /* ── WEDDING STORIES (GALLERY) PAGE ──────────── */
    weddingStories: {
        seoTitle:            'SEO Settings',
        metaDescription:     'SEO Settings',
        pageBannerTitle:     'Page Header',
        pageBannerSubtitle:  'Page Header',
        storiesList:         'Wedding Stories Gallery',
        instagramBtnText:    'Instagram / Explore Button',
        instagramUrl:        'Instagram / Explore Button',
        ctaHeading:          'Bottom CTA Section',
        ctaBody:             'Bottom CTA Section',
        ctaImage:            'Bottom CTA Section',
        ctaBtnText:          'Bottom CTA Section',
        ctaBtnUrl:           'Bottom CTA Section',
    },
    /* ── DESTINATION WEDDINGS ──────────────────────── */
    storiesDestination: {
        seoTitle:            'SEO Settings',
        pageBannerTitle:     'Page Header',
        pageBannerSubtitle:  'Page Header',
        introH2:             'Intro Text Section',
        introBody:           'Intro Text Section',
        listH2:              'Location List Section',
        storiesList:         'Destination Stories List',
        nriH2:               'NRI Planning Section',
        nriBody:             'NRI Planning Section',
        nriBtnText:          'NRI Planning Section',
        nriImage1:           'NRI Planning Section',
        processLabel:        'Destination Planning Process',
        processHeading:      'Destination Planning Process',
        processItems:        'Destination Process Steps',
        faqsList:            'Frequently Asked Questions',
        ctaHeading:          'Final CTA Section',
        heroImage:           'Cinematic CTA Banner',
        testimonialQuote:    'Featured Testimonial'
    },
    /* ── JOURNAL / BLOG ────────────────────────────── */
    journals: {
        pageBannerTitle:     'Page Header',
        sectionLabel:        'Blog Feed Header',
        sectionTitle:        'Blog Feed Header',
        journalsList:        'Blog Posts List',
        guideLabel:          'Downloadable Guide',
        guideTitle:          'Downloadable Guide',
        guideDesc:           'Downloadable Guide',
        guideChecks:         'Downloadable Guide',
        guideRequestBtnText: 'Downloadable Guide',
        guideImage:          'Downloadable Guide',
        guideYear:           'Downloadable Guide',
        guidePlannerLabel:   'Downloadable Guide',
        guideFreeText:       'Downloadable Guide',
        readEntryText:       'Post Detail Labels',
        relatedSectionLabel: 'Post Detail Labels',
        relatedSectionTitle: 'Post Detail Labels',
        ctaLabel:            'Post Detail CTA',
        ctaTitle:            'Post Detail CTA',
        ctaBtnText:          'Post Detail CTA',
        guideChecklist1:     'Downloadable Guide',
        guideChecklist2:     'Downloadable Guide',
        guideChecklist3:     'Downloadable Guide'
    },
    /* ── HEADER / NAVIGATION ───────────────────────── */
    header: {
        logoText:       'Logo & Branding',
        nav1Label:      'Navigation Menu',
    },
    /* ── FOOTER ────────────────────────────────────── */
    footer: {
        logoText:       'Footer Branding',
        tagline:        'Tagline & Description',
        instagramUrl:   'Social Media Links',
        email:          'Contact Details',
        ctaTagline:     'Footer CTA',
        copyrightName:  'Copyright'
    }
};

/* ══════════════════════════════════════════════════
   GROUP DESCRIPTIONS — Contextual help for each accordion section
══════════════════════════════════════════════════ */
const GROUP_DESCRIPTIONS = {
    /* Home */
    'Hero Section':                'The first thing visitors see — hero video background, tagline, subheading, body text and "Get Started" button.',
    'Hero Background Videos':      'Looping background videos (MP4) that crossfade behind the hero text.',
    'Hero Floating Images':        'Floating portrait images that slide alongside the hero text on desktop.',
    'Introduction Text':           'The brand introduction heading, italic sub-text and "Learn About Us" button shown below the hero.',
    'Statistics Counter':          'Four credential badges shown as an animated green strip (e.g. "8+ Years of Experience").',
    'Services Preview':            'Section label, heading and intro sentence above the service cards.',
    'Services Cards':              'Four service cards with images, titles and descriptions shown on the homepage.',
    'Destination Weddings Feature':'Two-column destination weddings section with text and images.',
    'Portfolio Glimpse':           'The horizontally scrolling portfolio grid of past wedding images.',
    'Client Testimonials':         'Rotating quotes from couples — heading, text, author name, location and photo.',
    'Cinematic CTA Band':          'Full-screen looping video with the "Work With Us" heading and button.',
    'YouTube / Video Section':     'Editorial section — label, heading, body paragraphs and "Watch More Films" button.',
    'Featured YouTube Video':      'The main featured YouTube video embed shown at the top of the video grid.',
    'YouTube Videos Grid':         'The 6 YouTube embed videos shown in a grid layout.',
    'Consultation Form Section':   'Label, heading, sub-text and button text for the lead form.',
    'Journal Preview Note':        'Auto-pulls the latest 3 posts from the Journal page.',
    'Achievements Bar':            'The credentials bar with numbers and labels (e.g. "1500+ Happy Couples").',
    /* About */
    'SEO Settings':                'Page title tag and meta description for search engine optimisation.',
    'Page Header':                 'The large title shown in the dark banner at the top of the page.',
    'Split Intro Section':         'Label, heading, body text and image shown in the split layout intro area.',
    'Specialities Section':        'Label and heading for the specialities grid.',
    'Specialities List':           'Cards listing what Parinay specialises in — each with a title and description.',
    'Our Philosophy':              'Your mission statement/promise quote section with author attribution.',
    'The Parinay Difference':      'Full content block with label, heading, multi-paragraph text and image.',
    'Team Section':                'Team heading, description and member cards with images and roles.',
    'About Stats Band':            'Four stats credentials on the About page (may differ from home stats).',
    'About Hero Banner':           'Decorative hero banner image for the About page.',
    'About CTA Band':              'Closing full-screen band with heading, button and background video.',
    'Hero Quote':                  'A prominent quote or mission statement displayed on the About page hero.',
    /* Services */
    'Comprehensive Services':      'The top-level heading and intro text for the comprehensive services section.',
    'Detailed Services Grid':      'The 9-item services grid. Each item needs an Image, Title and Description.',
    'The Planning Process':        'Label and heading for the process roadmap section.',
    'Process Steps':               'The 11-step planning process roadmap. Each needs a title and description.',
    'Closing CTA Band':            'Background image CTA at the bottom of the Services page.',
    /* Contact */
    'Email Inquiry':               'Email label, heading and address for the contact info block.',
    'Phone Inquiry':               'Phone label, heading and number for the contact info block.',
    'Office Address':              'Address label, heading and full address for the contact info block.',
    'WhatsApp & Social':           'WhatsApp number, auto-reply text and social media URLs.',
    'Inquiry Form Settings':       'Button text for the contact inquiry form.',
    /* Wedding Stories Page */
    'Wedding Stories Gallery':     'Dedicated gallery items for the Wedding Stories page. Each item has a category badge, title, date, location, description, main image, video, gallery images, and more.',
    'Instagram CTA Button':        'The text, URL and icon for the call-to-action button at the bottom of the gallery.',
    /* Destination Weddings */
    'Cinematic CTA Banner':        'The full-screen hero image shown in the cinematic CTA band at the bottom of the stories page.',
    'CTA Banner Copy':             'Heading and subtitle text overlaid on the cinematic CTA banner image.',
    'Featured Testimonial':        'A highlighted couple quote with name, location and photo shown at the bottom of the page.',
    'Intro Text Section':          'Additional heading and body paragraphs for the introduction.',
    'Location List Section':       'Heading for the list of destination wedding locations.',
    'NRI Planning Section':        'Section for NRI wedding planning services — heading, body and button.',
    'Destination Stories List':    'Story cards for destination weddings — each card includes badge, title, date, location, overview, video, gallery images, and project result.',
    'Destination Planning Process':'Label and heading for the destination wedding planning process timeline.',
    'Destination Process Steps':   'The 4-step destination wedding planning process. Each needs a title and description.',
    'Frequently Asked Questions':  'FAQ items shown on the Destination Weddings page.',
    'Final CTA Section':           'Heading, body text and two CTA buttons at the bottom of the Destination Weddings page.',
    /* Journals */
    'Blog Feed Header':            'The section label and title for the journal listing page.',
    'Blog Posts List':             'Journal posts — title, date, excerpt, author, image and content.',
    'Downloadable Guide':          'Lead magnet section with cover image, checklist items and CTA button.',
    'Post Detail Labels':          'Button and section labels used on the journal detail and listing pages.',
    'Post Detail CTA':             'The call-to-action band at the bottom of each journal entry.',
    /* Header / Footer */
    'Logo & Branding':             'Settings for your site logo image, sizing, and fallback text.',
    'Navigation Menu':             'Manage all main navigation links (Home, About, Services, Wedding Stories) and the items within the stories dropdown menu.',
    'CTA / Contact Link':          'The highlighted Contact link on the right side of the navigation.',
    'Footer Branding':             'Logo text and sub-label at the top of the footer.',
    'Tagline & Description':       'Short brand tagline shown below the footer logo.',
    'Social Media Links':          'Instagram, Facebook, Pinterest and YouTube URLs.',
    'Contact Details':             'Email, phone and address shown in the footer.',
    'Footer CTA':                  'Italic tagline and consultation button in the footer.',
    'Copyright':                   'The copyright name and year in the footer bottom bar.',
};

/* ══════════════════════════════════════════════════
   FIELD HINTS — Contextual hints shown below field inputs
══════════════════════════════════════════════════ */
const FIELD_HINTS = {
    /* ── Home Fields ────────────────────────── */
    heroTagline:        'Use \\n for line breaks, ###text### for bold, and [[text]] for gold/italic highlights.',
    heroSubheading:     'Secondary tagline shown below the hero heading (e.g. "Premium Wedding Planning").',
    heroBody:           'Short body text below the subheading.',
    heroBtnText:        'Label on the hero call-to-action button.',
    heroBtnUrl:         'Page the hero button links to.',
    heroVideos:         'Looping background videos (MP4). Add as many as you like.',
    heroImages:         'Floating images alongside the hero text. Recommended: 1000×1400 px portrait.',
    introHeading:       'Main brand introduction heading.',
    introSubText:       'The italic sentence beneath the introduction heading.',
    introBtnText:       'Label on the "Learn About Us" button below the intro.',
    stat1Label:         'Use \\n to split into two lines (e.g. "8+ Years of\\nExperience").',
    stat2Label:         'Use \\n to split into two lines.',
    stat3Label:         'Use \\n to split into two lines.',
    stat4Label:         'Use \\n to split into two lines.',
    servicesLabel:      'Small uppercase label above the services heading (e.g. "What We Handle").',
    servicesHeading:    'Main heading for services. Use [[text]] for beige/italic styling.',
    servicesIntroText:  'Intro sentence shown above the service cards.',
    homeServices:       'Service cards shown on the homepage. Each needs an Image, Title and Short Description.',
    servicesFooterText: 'Closing italic line below the service cards. Use \\n for line breaks.',
    destinationLabel:   'Small label for the destination weddings section.',
    destinationHeading: 'Section heading — use [[text]] for beige/italic styling.',
    destinationBody1:   'First paragraph about destination weddings.',
    destinationBody2:   'Second paragraph about destination weddings.',
    destinationBody3:   'Third paragraph — shown in italicised emphasis.',
    destinationBtnText: 'Text on the "Explore Destination Weddings" button.',
    destinationBtnUrl:  'Page the destination button links to.',
    destinationImage1:  'Primary destination wedding image (larger, left).',
    destinationImage2:  'Secondary destination image (overlapping, right).',
    portfolioLabel:     'Small label above the portfolio heading.',
    portfolioHeading:   'The portfolio section heading — use [[text]] for beige/italic styling.',
    portfolioBody:      'Short description paragraph below the portfolio heading.',
    portfolioItems:     'Images for the horizontally scrolling portfolio. Each needs image, title and location.',
    portfolioViewAllText: 'Label on the "View our weddings" button.',
    portfolioViewAllUrl:  'Page the portfolio button links to.',
    testimonialLabel:   'Small label above the testimonials section.',
    testimonialHeading: 'Heading for the testimonials section — use [[text]] for beige/italic styling.',
    testimonials:       'Client testimonials — text, author, location and photo.',
    transitionHeading:  'The large heading in the video CTA band — use [[text]] for beige/italic styling.',
    transitionSubtext:  'Subtitle text shown below the heading in the CTA band.',
    transitionVideoUrl: 'Background video for the CTA band (MP4).',
    transitionBtnText:  'Button label in the CTA band.',
    transitionBtnUrl:   'Page the CTA band button links to.',
    youtubeLabel:       'Small uppercase label for the YouTube section.',
    youtubeHeading:     'Heading for the video section — use [[text]] for beige/italic styling.',
    youtubeText1:       'First body paragraph for the YouTube section.',
    youtubeText2:       'Second body paragraph for the YouTube section.',
    youtubeBtnText:     'Label on the "Watch More Films" button.',
    youtubeBtnUrl:      'Full URL of the YouTube channel (opens in a new tab).',
    youtubeEmbedUrl:    'The main featured YouTube video. Paste the YouTube Embed URL (e.g. https://www.youtube.com/embed/xxxxx).',
    youtubeVideos:      'The 6 YouTube embed videos. Each needs a YouTube Embed URL.',
    formLabel:          'Small label above the consultation form.',
    formHeading:        'Main heading for the consultation form — use [[text]] for beige/italic styling.',
    formSubtext:        'Sub-text shown below the form heading.',
    formBtnText:        'Label on the form submit button.',
    journalNote:        'Auto-pulls the latest 3 posts from the Journal page. No editing needed.',
    /* ── Wedding Stories Page Fields ─────────── */
    pageBannerSubtitle: 'Subtitle text shown below the page banner heading on the gallery page.',
    storiesList:        'The main gallery grid items.',
    instagramBtnText:   'Label for the "Explore more collections" button below the gallery (Instagram link).',
    instagramUrl:       'Instagram profile or specific collection link.',
    ctaHeading:         'Main heading for the bottom dark green CTA section.',
    ctaBody:            'Body text for the bottom CTA section.',
    ctaBtnText:         'Label for the button in the bottom CTA section.',
    ctaBtnUrl:          'Page the bottom CTA button links to (e.g. /contact).',
    /* ── About Fields ───────────────────────── */
    seoTitle:           'Browser tab title for SEO (e.g. "About Us | Parinay Weddings").',
    metaDescription:    'Meta description for search engines (150–160 characters recommended).',
    pageBannerTitle:    'The large decorative title in the dark banner at the top of the page.',
    introLabel:         'Small uppercase label above the intro heading (e.g. "ABOUT PARINAY").',
    introText:          'Body paragraph in the intro section. Use \\n for line breaks.',
    introImage:         'Image shown to the right of the split intro layout.',
    specialitiesLabel:  'Small uppercase label above the specialities grid (e.g. "WHAT WE SPECIALISE IN").',
    specialitiesSubtext: 'The main heading shown below the label. Use [[text]] for gold/italic styling.',
    specialities:       'Speciality cards — each needs a Title and Description.',
    philosophyQuote:    'A strong mission statement or "Promise" quote.',
    philosophyAuthor:   'The label/author for the philosophy quote.',
    philosophySubtitle: 'Small decorative subtitle for the philosophy section.',
    promiseBtnText:     'Label on the button after the Parinay Promise section.',
    promiseBtnUrl:      'Page the promise button links to.',
    differentiatorLabel: 'Small uppercase label for The Parinay Difference section.',
    differentiatorHeading: 'Heading for the differentiator block.',
    differentiatorText: 'Multi-paragraph text. Press Enter twice between paragraphs.',
    differentiatorImage: 'Image for the differentiator block.',
    teamLabel:          'Small label above the team section.',
    teamHeading:        'Main heading for the team section — use [[text]] for beige/italic styling.',
    teamSubtext:        'Short description for the team section.',
    teamMembers:        'Team member cards — name, role and image.',
    ctaHeading:         'Heading for the CTA band.',
    ctaBtnText:         'Label on the CTA button.',
    ctaBtnUrl:          'Page the CTA button links to.',
    ctaVideoUrl:        'Background video for the About CTA band (MP4).',
        heroQuote:          'A prominent quote or mission statement for the About page.',
    /* ── Services Fields ────────────────────── */
    comprehensiveHeading: 'Large uppercase heading for Comprehensive Services.',
    comprehensiveIntro1: 'Italic primary intro text below the heading.',
    comprehensiveIntro2: 'Secondary intro paragraph.',
    comprehensiveList:  'Grid of detailed services. Each item has an Image, Title and Description.',
    processLabel:       'Small uppercase label above the process heading.',
    processHeading:     'Main heading for "Our Planning Process".',
    processItems:       'Planning process steps. Each needs a title and description.',
    ctaHeading:         'The large H2 heading for the bottom CTA section.',
    ctaBody:            'The descriptive text below the CTA heading.',
    ctaImage:           'Background image for the bottom CTA section. Recommended: 1920×1200 landscape.',
    ctaDesc:            'Short paragraph below the CTA heading.',
    /* ── Contact Fields ─────────────────────── */
    emailLabel:         'Small label above "Email Us" (e.g. "General Inquiries").',
    emailHeading:       'Heading for the email block.',
    email:              'Email address shown on the contact page.',
    phoneLabel:         'Small label above "Call Us".',
    phoneHeading:       'Heading for the phone block.',
    phone:              'Phone number displayed on the contact page.',
    addressLabel:       'Small label above "Office Address".',
    addressHeading:     'Heading for the address block.',
    address:            'Use \\n for line breaks (e.g. "Trivandrum, Kerala, India").',

    whatsappNumber:     'Country code + number, no spaces or "+" (e.g. 919876543210).',
    whatsappText:       'Text shown on the WhatsApp chat button.',
    whatsappReply:      'Auto-reply time indicator (e.g. "Typically replies within 1 hour").',
    instagramUrl:       'Full Instagram profile URL.',
    facebookUrl:        'Full Facebook profile URL.',
    pinterestUrl:       'Full Pinterest profile URL.',
    // formBtnText:        'Label on the contact form submit button.',
    faqsList:           'FAQ items — each needs a question and answer.',
    /* ── Stories Fields ──────────────────────── */
    pageBannerTitle:    'The large main heading (H1) for the Gallery page.',
    pageBannerSubtitle: 'The introduction paragraph below the H1. Supports [[text]] for gold italics and \\n for line breaks.',
    galleryImages:      'Lightbox gallery images — paste one image URL per line. If empty, the main image is shown.',
    storiesList:        'All story cards for this page. Supports ###text### for bold and _text_ for italics. Use the pipe symbol | to separate "Best for" points.',
    heroTitle:           'Heading overlaid on the cinematic CTA banner.',
    heroSubtitle:        'Subtitle overlaid on the CTA banner (below the heading).',
    testimonialQuote:   'A single powerful client quote to feature.',
    testimonialAuthor:  'Name of the couple for the featured testimonial.',
    testimonialLocation:'Wedding location for the featured testimonial.',
    testimonialImage:   'Photo of the couple (vertical recommended).',
    video:              'Upload a video (MP4) or paste an /uploads/ path. Autoplays muted on the story card.',
    badge:              'Badge label shown on the story card (e.g. "Destination", "Themed", "Traditional").',
    date:               'Date of the wedding (e.g. "February 2025").',
    desc:               'Short one-line description shown on the story listing card.',
    result:             'Project result text — shown on individual project page under "PROJECT RESULT". Supports ###text### for bold and _text_ for italics.',
    category:           'Short category label (Featured / Destination / Themed / Traditional).',
    heroImage:          'Full-screen decorative banner image for the cinematic CTA band at the bottom of the page.',
    introH2:            'Large H2 heading for the introduction section.',
    introBody:          'Multi-paragraph text for the introduction section. Use \\n for line breaks.',
    listH2:             'Main heading above the locations list (e.g. "Kerala Destination Wedding Locations We Specialise In").',
    nriH2:              'Heading for the NRI section.',
    nriBody:            'Body text for the NRI section. Use \\n for line breaks.',
    nriBtnText:         'Label for the NRI section CTA button.',
    nriImage1:          'Main image for the NRI section (Portrait/Large).',
    ctaBody:            'Body text below the CTA heading on the destination page.',
    ctaBtn1Text:        'Label for the primary CTA button (e.g. "Schedule a Free Consultation →").',
    ctaBtn1Url:         'URL for the primary CTA button.',
    ctaBtn2Text:        'Label for the secondary CTA button (e.g. "Browse Our Wedding Portfolio →").',
    ctaBtn2Url:         'URL for the secondary CTA button.',
    /* ── Journals Fields ────────────────────── */
    sectionLabel:       'Small label above the journal section heading.',
    sectionTitle:       'Main heading (last word renders in accent color).',
    journalsList:       'Journal posts — title, date, excerpt, image and content.',
    excerpt:            'Single sentence summary shown on each listing card.',
    content:            'Full article content (supports ###text### for bold and _text_ for italics).',
    guideLabel:         'Small label for the downloadable guide section.',
    guideTitle:         'Heading for the guide section.',
    guideDesc:          'Description text for the guide.',
    guideChecklist1:    'First checklist bullet point.',
    guideChecklist2:    'Second checklist bullet point.',
    guideChecklist3:    'Third checklist bullet point.',
    guideImage:         'Cover image for the downloadable guide.',
    guideYear:          'Year label on the guide cover (e.g. "The 2026").',
    guidePlannerLabel:  'Second line on the guide cover (e.g. "Planner").',
    guideFreeText:      'Small text under the cover badge (e.g. "Free Download").',
    guideRequestBtnText:'Label on the guide request button.',
    author:             'Name of the author (e.g. "By Sarah Thomas"). Defaults to "By Parinay" if empty.',
    readEntryText:      'Label for the link to full post (e.g. "Read Entry —").',
    relatedSectionLabel:'Label for the related posts section (e.g. "CONTINUE READING").',
    relatedSectionTitle:'Title for the related posts section (e.g. "More Stories").',
    ctaLabel:           'Label above the CTA heading.',
    ctaTitle:           'CTA heading at post bottom. Use ###text### for bold and _text_ for italics.',
    /* ── Header Fields ──────────────────────── */
    logoText:           'Logo text (shown if no image is uploaded).',
    logoImage:          'Upload a custom logo image. Recommended: PNG with transparency, around 300x80px.',
    logoWidth:          'Custom width for the logo (e.g. "180px", "50%", or "auto"). default is 150px.',
    logoHeight:         'Custom height for the logo (e.g. "50px" or "auto"). default is auto.',
    nav1Label:          'Label for the first nav link.',
    nav1Url:            'URL for the first nav link.',
    nav2Label:          'Label for the second nav link.',
    nav2Url:            'URL for the second nav link.',
    nav3Label:          'Label for the third nav link.',
    nav3Url:            'URL for the third nav link.',
    nav4Label:          'Label for the Wedding Stories nav link.',
    nav4Url:            'URL for the Wedding Stories nav link.',
    nav4Sub1Label:      'Label for the first dropdown sub-link.',
    nav4Sub1Url:        'URL for the first dropdown sub-link.',
    nav5Label:          'Label for the Journals nav link.',
    nav5Url:            'URL for the Journals nav link.',
    nav6Label:          'Label for the Contact nav link.',
    nav6Url:            'URL for the Contact nav link.',
    /* ── Footer Fields ──────────────────────── */
    logoImage_ftr:      'Upload a custom logo image for the footer.',
    logoWidth_ftr:      'Custom width for the footer logo (default is 120px).',
    logoHeight_ftr:     'Custom height for the footer logo (default is auto).',
    logoSub:            'Sub-label beneath the footer logo (e.g. "WEDDINGS").',
    tagline:            'Brand description shown below the footer logo.',
    youtubeUrl:         'Full YouTube channel URL.',
    whatsappNumber_ftr: 'WhatsApp number for the floating chat button.',
    ctaTagline:         'Italic tagline above the footer CTA button.',
    ctaBtnText_ftr:     'Label on the footer consultation button.',
    ctaBtnUrl_ftr:      'Page the footer CTA links to.',
    copyrightName:      'Name shown in the copyright line.',
    /* ── Shared URL field ────────────────────── */
    'url':              'Paste the YouTube Embed URL (Share → Embed, e.g. https://www.youtube.com/embed/xxxxx).',
};

/* ══════════════════════════════════════════════════
   TOAST COMPONENT
══════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════
   MEDIA PREVIEW COMPONENT
══════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════
   MAIN ADMIN DASHBOARD COMPONENT
══════════════════════════════════════════════════ */
const AdminDashboard = () => {
    const navigate = useNavigate();
    const { content, updateSection, updateMultipleSections, isLoaded } = useContext(ContentContext);

    const [activeTab, setActiveTab] = useState('header');
    const [formData, setFormData] = useState(null);
    const [linkedData, setLinkedData] = useState({});  // { 'home__portfolioItems': [...], ... }
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});

    /* Inquiry state */
    const [inquiries, setInquiries] = useState([]);
    const [inquiriesLoading, setInquiriesLoading] = useState(false);
    const [inquiryFilter, setInquiryFilter] = useState('all');
    const [expandedInquiry, setExpandedInquiry] = useState(null);
    const newInquiryCount = inquiries.filter(i => i.status === 'new').length;

    /* Toggle accordion section */
    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    /* Sync formData + linkedData when tab changes or content loads */
    useEffect(() => {
        if (content && content[activeTab]) {
            let sectionData = JSON.parse(JSON.stringify(content[activeTab]));

            setFormData(sectionData);
            setExpandedSections({});

            // Load linked sections data
            const links = LINKED_SECTIONS[activeTab];
            if (links && links.length > 0) {
                const ld = {};
                links.forEach(link => {
                    const key = `${link.sourceSection}__${link.arrayKey}`;
                    const src = content[link.sourceSection];
                    if (src && Array.isArray(src[link.arrayKey])) {
                        ld[key] = JSON.parse(JSON.stringify(src[link.arrayKey]));
                    }
                });
                setLinkedData(ld);
            } else {
                setLinkedData({});
            }
        }
    }, [activeTab, content]);

    /* Fetch inquiries when Inquiries tab is active (with auto-refresh) */
    /* Fetch inquiries for notification badge and Inquiries panel */

    const fetchInquiries = useCallback(async (showLoading = true) => {
        if (showLoading) setInquiriesLoading(true);
        try {
            const res = await fetch(`${API}/api/inquiries`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setInquiries(data.data || []);
            }
        } catch (err) {
            console.error('[Fetch Inquiries]', err);
        }
        setInquiriesLoading(false);
    }, []);

    /* Inquiries polling & loading */
    useEffect(() => {
        fetchInquiries(activeTab === 'inquiries');
    }, [activeTab, fetchInquiries]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchInquiries(false);
        }, 20000); // Poll every 20s for better responsiveness
        return () => clearInterval(interval);
    }, [fetchInquiries]);

    const updateInquiryStatus = async (id, status) => {
        try {
            const res = await fetch(`${API}/api/inquiries/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (data.success) {
                setInquiries(prev => prev.map(inq => inq._id === id ? { ...inq, status } : inq));
                showToast(`Inquiry marked as ${status}`);
            }
        } catch {
            showToast('Failed to update status', 'error');
        }
    };

    const deleteInquiry = async (id) => {
        if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
        try {
            const res = await fetch(`${API}/api/inquiries/${id}`, { method: 'DELETE', credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setInquiries(prev => prev.filter(inq => inq._id !== id));
                showToast('Inquiry deleted');
                if (expandedInquiry === id) setExpandedInquiry(null);
            }
        } catch {
            showToast('Failed to delete inquiry', 'error');
        }
    };

    /* ── Handlers ──────────────────────────────── */
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
                credentials: 'include',
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
                credentials: 'include',
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
            
            // Predefined templates for common arrays to ensure fields are rendered empty/with defaults
            const templates = {
                storiesList: { 
                    title: '', date: '', location: '', 
                    ...(activeTab === 'weddingStories' ? { category: '' } : { badge: 
                        activeTab === 'storiesDestination' ? 'Destination' : 
                        activeTab === 'storiesThemed' ? 'Themed' : 
                        activeTab === 'storiesTraditional' ? 'Traditional' : '' 
                    }),
                    video: '', overview: '', galleryImages: '', result: '', image: '', desc: '' 
                },
                journalsList:      { title: '', author: '', date: '', excerpt: '', image: '', content: '' },
                portfolioItems:    { title: '', date: '', location: '', overview: '', video: '', galleryImages: '', result: '', image: '', loc: '' },
                testimonials:      { text: '', author: '', location: '', image: '' },
                teamMembers:       { name: '', role: '', image: '' },
                processItems:      { title: '', desc: '' },
                comprehensiveList: { title: '', image: '', desc: '' },
                faqsList:          { question: '', answer: '' },
                heroImages:        { image: '', alt: '' },
                heroVideos:        { video: '' },
                homeServices:      { title: '', image: '', desc: '' },
                youtubeVideos:     { url: '' },
                guideChecks:       { text: '' },
                achievements:      { number: '', label: '' }
            };

            // 1. Try to use a predefined template first
            let blank = templates[arrayName];

            // 2. If no template, use the keys from an existing item but reset all values
            if (!blank && existing[0]) {
                blank = Object.keys(existing[0]).reduce((acc, k) => {
                    if (k !== 'id') acc[k] = '';
                    return acc;
                }, {});
            }

            // 3. Last fallback
            if (!blank) blank = {};
            
            return { ...prev, [arrayName]: [...existing, { ...blank, id: Date.now() }] };
        });
    };

    const removeArrayItem = (index, arrayName) => {
        setFormData(prev => {
            if (!prev[arrayName] || !Array.isArray(prev[arrayName])) return prev;
            const newArr = [...prev[arrayName]];
            newArr.splice(index, 1);
            return { ...prev, [arrayName]: newArr };
        });
    };

    const handleSave = async () => {
        setIsSaving(true);

        // Clean localhost URLs for production
        const cleanData = (obj) => {
            if (!obj) return obj;
            try {
                const str = JSON.stringify(obj);
                const escapedAPI = API.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const cleaned = str.replace(new RegExp(`${escapedAPI}/uploads`, 'g'), '/uploads');
                return JSON.parse(cleaned);
            } catch { return obj; }
        };
        
        const allUpdates = {};
        
        // 1. Prepare main section update
        allUpdates[activeTab] = cleanData(formData);

        // 2. Prepare linked sections updates
        const links = LINKED_SECTIONS[activeTab];
        if (links && links.length > 0) {
            links.forEach(link => {
                const key = `${link.sourceSection}__${link.arrayKey}`;
                if (linkedData[key]) {
                    // Start with current source section data from context
                    const sourceData = content[link.sourceSection]
                        ? JSON.parse(JSON.stringify(content[link.sourceSection]))
                        : {};
                    
                    // Update the specific array key
                    sourceData[link.arrayKey] = cleanData(linkedData[key]);
                    
                    // Add to batch (merge if already present in allUpdates)
                    allUpdates[link.sourceSection] = {
                        ...(allUpdates[link.sourceSection] || {}),
                        ...sourceData
                    };
                }
            });
        }

        // 3. Save all in one batch
        const res = await updateMultipleSections(allUpdates);

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

    /* ── Single Field Renderer ─────────────────── */
    const renderField = (key, value, onChange, onFileUpload, parentKey = null, itemContext = null) => {
        // Skip technical metadata
        if (key === 'id' || key.startsWith('_')) return null;

        /** 1. FIELD DETECTION & LABELING **/
        const isMedia = !['logoText', 'logoSub', 'logoWidth', 'logoHeight'].includes(key) && (key.toLowerCase().includes('image') || key.toLowerCase().includes('video') || key.toLowerCase().includes('thumb') || key.toLowerCase().includes('logo'));
        const isVideoField = key.toLowerCase().includes('video') || isVideoUrl(value);
        const isInternalUrl = (key.toLowerCase().endsWith('btnurl') || key.toLowerCase() === 'herobtnurl' || key.toLowerCase().endsWith('viewallurl') || (key.toLowerCase().includes('nav') && key.toLowerCase().endsWith('url')))
            && !key.toLowerCase().includes('youtube')
            && !key.toLowerCase().includes('instagram')
            && !key.toLowerCase().includes('facebook')
            && !key.toLowerCase().includes('pinterest')
            && activeTab !== 'weddingStories';
        const isLongText = (typeof value === 'string' && (value.length > 80 || value.includes('\n') || value.includes('\\n')))
            || ['content', 'answer', 'overview', 'result', 'galleryImages', 'differentiatorText', 'introText', 'specialitiesSubtext'].includes(key);

        let label = key.replace(/([A-Z])/g, ' $1').replace(/([0-9]+)/g, ' $1').trim();
        if (key === 'location') label = 'Place';
        if (key === 'image') label = 'Main Image';
        if (key === 'badge') label = 'Category Badge';
        if (key === 'date') label = 'Wedding Date';
        if (key === 'desc') label = 'Short Description';
        if (key === 'result') label = 'Project Result';
        if (key === 'overview') label = 'Detailed Overview';

        /** 2. SPECIAL FIELD BLOCKS **/

        // Info-only field (journalNote)
        if (key === 'journalNote') {
            return (
                <div className="admin-form-group" key={key}>
                    <p className="admin-field-hint" style={{ fontSize: '0.9rem', color: 'var(--admin-text)' }}>
                        <AlertCircle size={14} style={{ marginRight: '8px' }} />
                        {FIELD_HINTS[key] || 'This section is auto-generated.'}
                    </p>
                </div>
            );
        }

        // --- MULTI-MEDIA GALLERY (Newline separated) ---
        if (key === 'galleryImages') {
            const urls = (value || '').split('\n').map(u => u.trim()).filter(u => u.length > 0);
            
            // Helpful fallback for UI - if gallery is empty, show the primary 'image' if it exists
            const displayUrls = urls.length > 0 ? urls : (itemContext?.image ? [itemContext.image] : []);
            const isUsingFallback = urls.length === 0 && displayUrls.length > 0;

            const removeUrl = (idx) => {
                const newUrls = [...urls];
                newUrls.splice(idx, 1);
                onChange(newUrls.join('\n'));
            }

            const handleGalleryUpload = async (e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;

                showToast(`Uploading ${files.length} items...`);
                
                const newUploadedUrls = [];
                for (let i = 0; i < files.length; i++) {
                    const uploadData = new FormData();
                    uploadData.append('file', files[i]);
                    try {
                        const response = await fetch(`${API}/api/upload`, { method: 'POST', body: uploadData, credentials: 'include' });
                        const data = await response.json();
                        if (data.success && data.url) {
                            newUploadedUrls.push(data.url);
                        }
                    } catch (err) {
                        console.error("Upload failed for file", i, err);
                    }
                }

                if (newUploadedUrls.length > 0) {
                    onChange([...urls, ...newUploadedUrls].join('\n'));
                    showToast(`Successfully uploaded ${newUploadedUrls.length} items!`);
                } else {
                    showToast('Upload failed — try again.', 'error');
                }
                e.target.value = ''; // Reset input
            }

            return (
                <div className="admin-form-group" key={key} style={{ gridColumn: 'span 2' }}>
                    <label className="admin-label">
                        Portfolio Gallery (Newline Sorted URLs)
                        {isUsingFallback && <span style={{ marginLeft: '10px', fontSize: '0.7rem', color: 'var(--admin-gold)', fontWeight: 'normal' }}>(Showing primary image fallback)</span>}
                    </label>
                    <div className="admin-gallery-grid">
                        {displayUrls.length === 0 ? (
                            <div className="admin-gallery-empty" style={{ gridColumn: 'span 4' }}>
                                <LayoutGrid size={32} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
                                <p>No gallery items yet.</p>
                                <p style={{ fontSize: '0.75rem' }}>Click the button below to upload media.</p>
                            </div>
                        ) : (
                            displayUrls.map((url, i) => (
                                <div key={i} className={`admin-gallery-thumb ${isUsingFallback ? 'is-fallback' : ''}`}>
                                    {isVideoUrl(url) ? (
                                        <video src={url.startsWith('/uploads') ? `${API}${url}` : url} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <img src={url.startsWith('/uploads') ? `${API}${url}` : url} alt="" />
                                    )}
                                    {!isUsingFallback && (
                                        <button 
                                            type="button"
                                            onClick={() => removeUrl(i)} 
                                            className="admin-gallery-remove"
                                            title="Remove item"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                    {isUsingFallback && <div className="fallback-badge">Fallback</div>}
                                </div>
                            ))
                        )}
                    </div>
                    <div className="admin-gallery-controls">
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <label className="admin-btn admin-btn--outline" style={{ cursor: 'pointer', margin: 0 }}>
                                <Plus size={15} /> Choose Files
                                <input 
                                    type="file" 
                                    multiple 
                                    hidden 
                                    onChange={handleGalleryUpload} 
                                    accept="image/*,video/*" 
                                />
                            </label>
                            <span style={{ fontSize: '0.75rem', color: 'var(--admin-muted)' }}>
                                You can select multiple images or videos to upload at once.
                            </span>
                        </div>
                        
                        <p className="admin-field-hint" style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                            <AlertCircle size={12} style={{ marginRight: '4px' }} />
                            Manual URL Edit (Advanced)
                        </p>
                        <textarea
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            className="admin-input textarea"
                            placeholder="One media URL per line..."
                            style={{ minHeight: '80px', height: '80px', fontSize: '0.8rem', opacity: 0.7 }}
                        />
                    </div>
                </div>
            );
        }

        // --- MULTI-PARAGRAPH FIELDS (Split into chunks for easier editing) ---
        const isMultiPara = ['overview', 'result', 'content', 'desc', 'differentiatorText', 'introSubText', 'teamSubtext', 'philosophyQuote'].includes(key);
        if (isMultiPara && typeof value === 'string') {
            const paragraphs = (value || '').split(/\n\n|\\n\\n/);
            
            return (
                <div key={key} className="admin-form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="admin-label">{label}</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {paragraphs.map((p, idx) => (
                            <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            const inputId = `field-${parentKey || 'top'}-${key}-${itemContext?.id || 'single'}-${idx}`;
                                            const input = document.getElementById(inputId);
                                            const start = input.selectionStart;
                                            const end = input.selectionEnd;
                                            const text = input.value;
                                            const selected = text.substring(start, end);
                                            const newValue = text.substring(0, start) + `[[${selected}]]` + text.substring(end);
                                            const newParas = [...paragraphs];
                                            newParas[idx] = newValue;
                                            onChange(newParas.join('\n\n'));
                                        }}
                                        className="admin-btn admin-btn--sm"
                                        style={{ padding: '2px 8px', fontSize: '0.6rem', color: '#C5A059', border: '1px solid #C5A059', background: 'none' }}
                                    >
                                        <em>Beige</em>
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            const inputId = `field-${parentKey || 'top'}-${key}-${itemContext?.id || 'single'}-${idx}`;
                                            const input = document.getElementById(inputId);
                                            const start = input.selectionStart;
                                            const end = input.selectionEnd;
                                            const text = input.value;
                                            const selected = text.substring(start, end);
                                            const newValue = text.substring(0, start) + `###${selected}###` + text.substring(end);
                                            const newParas = [...paragraphs];
                                            newParas[idx] = newValue;
                                            onChange(newParas.join('\n\n'));
                                        }}
                                        className="admin-btn admin-btn--sm"
                                        style={{ padding: '2px 8px', fontSize: '0.6rem', border: '1px solid #444', background: 'none' }}
                                    >
                                        <strong>Bold</strong>
                                    </button>
                                </div>
                                <textarea
                                    id={`field-${parentKey || 'top'}-${key}-${itemContext?.id || 'single'}-${idx}`}
                                    value={p}
                                    onChange={(e) => {
                                        const newParas = [...paragraphs];
                                        newParas[idx] = e.target.value;
                                        onChange(newParas.join('\n\n'));
                                    }}
                                    className="admin-input textarea"
                                    placeholder={idx === 0 ? "Start typing..." : "Next paragraph..."}
                                    style={{ minHeight: idx === 0 ? '120px' : '80px' }}
                                />
                                {paragraphs.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            if (window.confirm('Delete this paragraph?')) {
                                                const newParas = paragraphs.filter((_, i) => i !== idx);
                                                onChange(newParas.join('\n\n'));
                                            }
                                        }}
                                        className="admin-array-item__remove"
                                        style={{ top: '10px', right: '10px' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button" 
                            className="admin-btn admin-btn--sm"
                            style={{ 
                                background: 'rgba(197, 160, 89, 0.1)', 
                                border: '1px dashed var(--admin-gold)',
                                color: 'var(--admin-gold)',
                                width: 'fit-content'
                            }}
                            onClick={() => onChange(value + '\n\n')}
                        >
                            <Plus size={14} /> Add Another Paragraph
                        </button>
                    </div>
                    {FIELD_HINTS[key] && <p className="admin-field-hint">{FIELD_HINTS[key]}</p>}
                </div>
            );
        }


        return (
            <div className="admin-form-group" key={key}>
                <label className="admin-label">{label}</label>
                {isMedia ? (
                    <>
                        <div className="admin-media-preview" style={{ position: 'relative' }}>
                            <span className="admin-media-preview__badge">{isVideoField ? 'Video' : 'Image'}</span>
                            {value ? (
                                <>
                                    {isVideoField ? (
                                        <video src={value.startsWith('/uploads') ? `${API}${value}` : value} controls />
                                    ) : (
                                        <img src={value.startsWith('/uploads') ? `${API}${value}` : value} alt="" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => onChange('')}
                                        title="Remove media"
                                        style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            background: 'rgba(220, 38, 38, 0.9)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '28px',
                                            height: '28px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 2,
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = 'rgba(185, 28, 28, 1)'}
                                        onMouseLeave={(e) => e.target.style.background = 'rgba(220, 38, 38, 0.9)'}
                                    >
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <div className="admin-media-preview__empty">
                                    <Plus size={24} style={{ opacity: 0.3 }} />
                                    <span>No media selected</span>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            onChange={onFileUpload}
                            className="admin-input"
                            accept="image/*,video/*"
                        />
                        {key !== 'logoImage' && (
                            <input
                                type="text"
                                value={value || ''}
                                onChange={(e) => onChange(e.target.value)}
                                className="admin-input"
                                placeholder="…or paste a URL directly"
                                style={{ marginTop: '6px' }}
                            />
                        )}
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
                        <option value="/destination-weddings">Destination Weddings</option>
                        <option value="/themed-weddings">Themed Weddings</option>
                        <option value="/traditional-weddings">Traditional Weddings</option>
                        <option value="/journals">Journals</option>
                        <option value="/contact">Contact</option>
                    </select>
                ) : isLongText ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '2px' }}>
                            <button 
                                type="button" 
                                onClick={() => {
                                            const inputId = `field-${parentKey || 'top'}-${key}-${itemContext?.id || 'single'}`;
                                            const input = document.getElementById(inputId);
                                    const start = input.selectionStart;
                                    const end = input.selectionEnd;
                                    const text = input.value;
                                    const selected = text.substring(start, end);
                                    const newValue = text.substring(0, start) + `[[${selected}]]` + text.substring(end);
                                    onChange(newValue);
                                }}
                                className="admin-btn admin-btn--sm"
                                style={{ padding: '4px 8px', fontSize: '0.65rem', color: '#C5A059', border: '1px solid #C5A059', background: 'none' }}
                                title="Apply Italic Beige Style"
                            >
                                <em>Beige Italic</em>
                            </button>
                            <button 
                                type="button" 
                                onClick={() => {
                                            const inputId = `field-${parentKey || 'top'}-${key}-${itemContext?.id || 'single'}`;
                                            const input = document.getElementById(inputId);
                                    const start = input.selectionStart;
                                    const end = input.selectionEnd;
                                    const text = input.value;
                                    const selected = text.substring(start, end);
                                    const newValue = text.substring(0, start) + `###${selected}###` + text.substring(end);
                                    onChange(newValue);
                                }}
                                className="admin-btn admin-btn--sm"
                                style={{ padding: '4px 8px', fontSize: '0.65rem', border: '1px solid #444', background: 'none' }}
                                title="Apply Bold Style"
                            >
                                <strong>Bold</strong>
                            </button>
                        </div>
                        <textarea
                            id={`field-${parentKey || 'top'}-${key}-${itemContext?.id || 'single'}`}
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            className="admin-input textarea"
                        />
                    </div>
                ) : (typeof value === 'string' && (value.includes('youtube.com') || value.includes('youtu.be')) ) ? (
                    <>
                        {value && (
                            <div className="admin-media-preview" style={{ marginBottom: '10px' }}>
                                <iframe
                                    width="100%"
                                    height="180"
                                    src={getYoutubeEmbedUrl_local(value)}
                                    title="YouTube Preview"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ borderRadius: '2px' }}
                                ></iframe>
                            </div>
                        )}
                        <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            className="admin-input"
                            placeholder="Paste YouTube URL here..."
                        />
                    </>
                ) : key === 'category' || key === 'badge' ? (
                    <select
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="admin-input"
                        style={{ appearance: 'auto' }}
                    >
                        <option value="">Select {key === 'badge' ? 'Badge' : 'Category'}</option>
                        <option value="Featured">Featured</option>
                        <option value="Destination">Destination</option>
                        <option value="Themed">Themed</option>
                        <option value="Traditional">Traditional</option>
                    </select>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '2px' }}>
                            <button 
                                type="button" 
                                onClick={() => {
                                            const inputId = `field-${parentKey || 'top'}-${key}-${itemContext?.id || 'single'}`;
                                            const input = document.getElementById(inputId);
                                    const start = input.selectionStart;
                                    const end = input.selectionEnd;
                                    const text = input.value;
                                    const selected = text.substring(start, end);
                                    const newValue = text.substring(0, start) + `[[${selected}]]` + text.substring(end);
                                    onChange(newValue);
                                }}
                                className="admin-btn admin-btn--sm"
                                style={{ padding: '4px 8px', fontSize: '0.65rem', color: '#C5A059', border: '1px solid #C5A059', background: 'none' }}
                                title="Apply Italic Beige Style"
                            >
                                <em>Beige Italic</em>
                            </button>
                            <button 
                                type="button" 
                                onClick={() => {
                                            const inputId = `field-${parentKey || 'top'}-${key}-${itemContext?.id || 'single'}`;
                                            const input = document.getElementById(inputId);
                                    const start = input.selectionStart;
                                    const end = input.selectionEnd;
                                    const text = input.value;
                                    const selected = text.substring(start, end);
                                    const newValue = text.substring(0, start) + `###${selected}###` + text.substring(end);
                                    onChange(newValue);
                                }}
                                className="admin-btn admin-btn--sm"
                                style={{ padding: '4px 8px', fontSize: '0.65rem', border: '1px solid #444', background: 'none' }}
                                title="Apply Bold Style"
                            >
                                <strong>Bold</strong>
                            </button>
                        </div>
                        <input
                            id={`field-${parentKey || 'top'}-${key}-${itemContext?.id || 'single'}`}
                            type="text"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            className="admin-input"
                        />
                        {(key.toLowerCase().includes('heading') || key.toLowerCase().includes('title') || key.toLowerCase().includes('tagline') || key.toLowerCase().includes('subtitle')) && value && (
                            <div className="admin-field-preview" style={{ 
                                marginTop: '4px', 
                                padding: '12px', 
                                background: '#fcfcfc', 
                                border: '1px solid #eee', 
                                borderRadius: '6px',
                                fontSize: '1.1rem',
                                color: '#3a1219',
                                fontFamily: "'Playfair Display', serif"
                            }}>
                                <div style={{ fontSize: '0.6rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Live Preview</div>
                                {renderAdminPreview(value)}
                            </div>
                        )}
                    </div>
                ) }
                {FIELD_HINTS[key] && (
                    <p className="admin-field-hint">
                        <AlertCircle size={10} style={{ marginRight: '4px' }} />
                        {FIELD_HINTS[key]}
                    </p>
                )}
            </div>
        );
    };

    /* ── Form Renderer (groups fields into accordion sections) ── */
    const renderForm = () => {
        if (!formData) return null;

        const groupHeaders = FIELD_GROUPS[activeTab] || {};
        const sectionsData = [];
        const sectionsMap = {};

        // Build grouped sections from formData keys
        Object.keys(formData).forEach((key) => {
            if (key === '_id' || key === '__v' || key === 'createdAt' || key === 'updatedAt') return;

            const header = groupHeaders[key];
            
            if (header) {
                // If this header title already exists in our map, add field to it
                if (sectionsMap[header]) {
                    sectionsMap[header].fields.push(key);
                } else {
                    // Start a new group
                    const newGroup = {
                        id: `${activeTab}-${key}`,
                        title: header,
                        description: GROUP_DESCRIPTIONS[header],
                        fields: [key]
                    };
                    sectionsMap[header] = newGroup;
                    sectionsData.push(newGroup);
                }
            } else {
                // If no header, it belongs to the current "open" group
                const currentGroup = sectionsData[sectionsData.length - 1];
                if (currentGroup) {
                    currentGroup.fields.push(key);
                }
            }
        });

        // Sort sections to match the canonical order defined in FIELD_GROUPS
        const groupTitleOrder = [...new Set(Object.values(groupHeaders))];
        sectionsData.sort((a, b) => {
            const aIdx = groupTitleOrder.indexOf(a.title);
            const bIdx = groupTitleOrder.indexOf(b.title);
            return (aIdx === -1 ? Infinity : aIdx) - (bIdx === -1 ? Infinity : bIdx);
        });

        return (
            <div className="admin-accordion">
                {sectionsData.map((section) => {
                    const isExpanded = expandedSections[section.id];

                    return (
                        <div key={section.id} className={`admin-accordion__item ${isExpanded ? 'is-expanded' : ''}`}>
                            <header 
                                className="admin-accordion__header"
                                onClick={() => toggleSection(section.id)}
                            >
                                <div className="admin-acc-header-left">
                                    <button
                                        className={`admin-acc-edit-btn ${isExpanded ? 'is-active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSection(section.id);
                                        }}
                                    >
                                        {isExpanded ? <X size={14} /> : <Plus size={14} />}
                                    </button>
                                </div>

                                <h2 className="admin-accordion__title">
                                    {section.title}
                                </h2>

                                <span className="admin-field-count">
                                    {section.fields.length} {section.fields.length === 1 ? 'field' : 'fields'}
                                </span>
                            </header>

                            {isExpanded && (
                                <div className="admin-accordion__content">
                                    {section.description && (
                                        <p className="admin-section__desc">
                                            {section.description}
                                        </p>
                                    )}
                                    <div className="admin-fields-grid">
                                        {section.fields.map((fieldKey) => {
                                            const val = formData[fieldKey];
                                            if (Array.isArray(val)) {
                                                return (
                                                    <div key={fieldKey} className="admin-array-section">
                                                        <h3 className="admin-array-title">
                                                            {fieldKey.replace(/([A-Z])/g, ' $1').trim()}
                                                        </h3>
                                                        {FIELD_HINTS[fieldKey] && (
                                                            <p className="admin-field-hint admin-field-hint--above">
                                                                <AlertCircle size={10} style={{ marginRight: '4px' }} />
                                                                {FIELD_HINTS[fieldKey]}
                                                            </p>
                                                        )}

                                                        <div className="admin-array-items">
                                                            {val.length === 0 && (
                                                                <div className="admin-empty admin-empty--sm">
                                                                    <p>No items added yet.</p>
                                                                </div>
                                                            )}

                                                            {val.map((item, index) => (
                                                                <div key={item.id || index} className="admin-array-item">
                                                                    <div className="admin-array-item__header">
                                                                        <span className="admin-array-item__index">Item #{index + 1}</span>
                                                                        <button
                                                                            type="button"
                                                                            className="admin-array-item__remove"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                if (window.confirm(`Are you sure you want to delete this ${fieldKey.replace(/s$/, '').replace(/List$/, '')} item?`)) {
                                                                                    removeArrayItem(index, fieldKey);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>

                                                                    <div className="admin-array-item__fields">
                                                                        {Object.keys(item)
                                                                            .filter(k => {
                                                                                if (fieldKey === 'portfolioItems') return ['title', 'location', 'image'].includes(k);
                                                                                if (fieldKey === 'storiesList') {
                                                                                    if (activeTab === 'weddingStories') return ['category', 'title', 'location', 'image', 'galleryImages', 'overview'].includes(k);
                                                                                    let excluded = [];
                                                                                    if (activeTab === 'storiesTraditional' || activeTab === 'storiesThemed' || activeTab === 'storiesDestination') excluded = ['image', 'desc'];
                                                                                    return ['badge', 'title', 'date', 'location', 'desc', 'overview', 'image', 'video', 'galleryImages', 'result'].filter(f => !excluded.includes(f)).includes(k);
                                                                                }
                                                                                if (fieldKey === 'journalsList') return k !== 'id' && k !== 'loc';
                                                                                return k !== 'id' && k !== '_id' && k !== '__v';
                                                                            })
                                                                            .map((itemKey) =>
                                                                                renderField(
                                                                                    itemKey,
                                                                                    item[itemKey],
                                                                                    (newVal) => handleArrayChange(index, fieldKey, itemKey, newVal),
                                                                                    (e) => handleArrayFileUpload(e, index, fieldKey, itemKey),
                                                                                    fieldKey,
                                                                                    item
                                                                                )
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <button
                                                            className="admin-btn admin-btn--ghost admin-btn--sm"
                                                            style={{ marginTop: '1rem' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addArrayItem(fieldKey);
                                                            }}
                                                        >
                                                            <Plus size={14} style={{ marginRight: '6px' }} />
                                                            Add {fieldKey.replace(/s$/, '').replace(/List$/, '').replace(/([A-Z])/g, ' $1').trim()}
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

    /* ── Linked Sections Renderer ───────────────── */
    const renderLinkedSections = () => {
        const links = LINKED_SECTIONS[activeTab];
        if (!links || links.length === 0) return null;

        // Handlers for linked array data
        const handleLinkedArrayChange = (linkedKey, index, field, value) => {
            setLinkedData(prev => {
                const arr = [...(prev[linkedKey] || [])];
                arr[index] = { ...arr[index], [field]: value };
                return { ...prev, [linkedKey]: arr };
            });
        };

        const handleLinkedArrayFileUpload = async (e, linkedKey, index, field) => {
            const file = e.target.files[0];
            if (!file) return;
            const uploadData = new FormData();
            uploadData.append('file', file);
            try {
                const response = await fetch(`${API}/api/upload`, { method: 'POST', body: uploadData, credentials: 'include' });
                const data = await response.json();
                if (data.success && data.url) {
                    handleLinkedArrayChange(linkedKey, index, field, data.url);
                } else {
                    showToast('Upload failed — try again.', 'error');
                }
            } catch {
                showToast('Could not reach the upload server.', 'error');
            }
        };

        const addLinkedArrayItem = (linkedKey) => {
            setLinkedData(prev => {
                const existing = prev[linkedKey] || [];
                const template = existing[0] || {};
                const blank = Object.keys(template).reduce((acc, k) => {
                    if (k !== 'id') acc[k] = '';
                    return acc;
                }, {});
                return { ...prev, [linkedKey]: [...existing, { ...blank, id: Date.now() }] };
            });
        };

        const removeLinkedArrayItem = (linkedKey, index) => {
            setLinkedData(prev => {
                const arr = [...(prev[linkedKey] || [])];
                arr.splice(index, 1);
                return { ...prev, [linkedKey]: arr };
            });
        };

        return (
            <>
                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid var(--admin-border)' }}>
                    <h3 style={{
                        fontFamily: 'var(--hero-font)',
                        fontSize: '1.3rem',
                        color: 'var(--admin-green)',
                        marginBottom: '0.5rem'
                    }}>
                        Shared Content Sections
                    </h3>
                    <p style={{
                        fontSize: '0.82rem',
                        color: 'var(--admin-muted)',
                        marginBottom: '2rem',
                        lineHeight: '1.5'
                    }}>
                        These sections are shared with other pages. Editing here will update both this page and the source page.
                    </p>
                </div>
                <div className="admin-accordion">
                    {links.map((link) => {
                        const linkedKey = `${link.sourceSection}__${link.arrayKey}`;
                        const sectionId = `linked-${linkedKey}`;
                        const isExpanded = expandedSections[sectionId];
                        const items = linkedData[linkedKey] || [];

                        return (
                            <div key={sectionId} className={`admin-accordion__item ${isExpanded ? 'is-expanded' : ''}`}
                                style={{ borderLeftColor: 'var(--admin-gold)' }}>
                                <header className="admin-accordion__header">
                                    <div className="admin-acc-header-left">
                                        <button
                                            className={`admin-acc-edit-btn ${isExpanded ? 'is-active' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); toggleSection(sectionId); }}
                                            title={isExpanded ? 'Close section' : 'Edit section'}
                                        >
                                            {isExpanded ? 'Close' : 'Edit'}
                                        </button>
                                    </div>
                                    <h2 className="admin-accordion__title">
                                        {link.title}
                                    </h2>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        fontWeight: '600',
                                        color: '#fff',
                                        background: 'var(--admin-gold)',
                                        padding: '3px 8px',
                                        borderRadius: '2px',
                                        letterSpacing: '0.1em',
                                        whiteSpace: 'nowrap',
                                        marginRight: '8px'
                                    }}>
                                        SHARED
                                    </span>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        fontWeight: '600',
                                        color: 'var(--admin-muted)',
                                        background: 'rgba(58, 18, 25, 0.06)',
                                        padding: '3px 10px',
                                        borderRadius: '2px',
                                        letterSpacing: '0.1em',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {items.length} {items.length === 1 ? 'item' : 'items'}
                                    </span>
                                </header>

                                {isExpanded && (
                                    <div className="admin-accordion__content">
                                        {link.description && (
                                            <p className="admin-section__desc" style={{ marginTop: '0', marginBottom: '1.5rem' }}>
                                                {link.description}
                                            </p>
                                        )}
                                        <p style={{
                                            fontSize: '0.75rem', color: 'var(--admin-gold)', marginBottom: '1.5rem',
                                            display: 'flex', alignItems: 'center', gap: '6px', fontStyle: 'italic'
                                        }}>
                                            <AlertCircle size={12} />
                                            Also editable from: {SECTION_LABELS[link.sourceSection] || link.sourceSection}
                                        </p>

                                        {items.length === 0 && (
                                            <div className="admin-empty" style={{ margin: '1rem 0' }}>
                                                <div className="admin-empty__icon"><LayoutGrid size={24} /></div>
                                                <p>No items yet. Click "Add New" to get started.</p>
                                            </div>
                                        )}

                                        {items.map((item, index) => (
                                            <div key={item.id || index} className="admin-array-item">
                                                <span className="admin-array-item__index">#{index + 1}</span>
                                                <button
                                                    type="button"
                                                    className="admin-array-item__remove"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (window.confirm("Are you sure you want to remove this shared item?")) {
                                                            removeLinkedArrayItem(linkedKey, index);
                                                        }
                                                    }}
                                                    title="Remove this item"
                                                >
                                                    <X size={16} style={{ pointerEvents: 'none' }} />
                                                </button>
                                                <div style={{ marginTop: '1.5rem' }}>
                                                    {Object.keys(item)
                                                        .filter(k => {
                                                            if (link.arrayKey === 'portfolioItems') {
                                                                return ['title', 'location', 'image'].includes(k);
                                                            }
                                                            if (link.arrayKey === 'storiesList') {
                                                                const excluded = (activeTab === 'storiesTraditional' || activeTab === 'storiesThemed' || activeTab === 'storiesDestination') ? ['image', 'desc'] : [];
                                                                return ['badge', 'title', 'date', 'location', 'desc', 'overview', 'image', 'video', 'galleryImages', 'result']
                                                                    .filter(f => !excluded.includes(f))
                                                                    .includes(k);
                                                            }
                                                            return k !== 'id' && k !== 'loc';
                                                        })
                                                        .map((itemKey) =>
                                                            renderField(
                                                                itemKey,
                                                                item[itemKey],
                                                                (newVal) => handleLinkedArrayChange(linkedKey, index, itemKey, newVal),
                                                                (e) => handleLinkedArrayFileUpload(e, linkedKey, index, itemKey)
                                                            )
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            className="admin-btn admin-btn--outline"
                                            style={{ marginTop: '0.5rem' }}
                                            onClick={(e) => { e.stopPropagation(); addLinkedArrayItem(linkedKey); }}
                                        >
                                            <Plus size={15} />
                                            Add New Item
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    /* ── Inquiries Panel Renderer ─────────────────── */
    const renderInquiriesPanel = () => {
        const TYPE_CONFIG = {
            contact:  { label: 'Contact Form',  color: '#3a1219', bg: 'rgba(58, 18, 25, 0.08)',  icon: <Mail size={14} /> },
            quote:    { label: 'Quote Request', color: '#C5A059', bg: 'rgba(197, 160, 89, 0.12)', icon: <Calendar size={14} /> },
            whatsapp: { label: 'WhatsApp',      color: '#25D366', bg: 'rgba(37, 211, 102, 0.1)',   icon: <Phone size={14} /> },
        };

        const STATUS_CONFIG = {
            new:      { label: 'New',      color: '#dc2626', bg: 'rgba(220, 38, 38, 0.08)' },
            read:     { label: 'Read',     color: '#2563eb', bg: 'rgba(37, 99, 235, 0.08)' },
            replied:  { label: 'Replied',  color: '#16a34a', bg: 'rgba(22, 163, 74, 0.08)' },
            archived: { label: 'Archived', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.08)' },
        };

        const filtered = inquiryFilter === 'all'
            ? inquiries
            : inquiries.filter(inq => inq.type === inquiryFilter || inq.status === inquiryFilter);

        const newCount      = inquiries.filter(i => i.status === 'new').length;
        const contactCount  = inquiries.filter(i => i.type === 'contact').length;
        const quoteCount    = inquiries.filter(i => i.type === 'quote').length;
        const whatsappCount = inquiries.filter(i => i.type === 'whatsapp').length;

        const formatDate = (dateStr) => {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
                   ' at ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        };

        if (inquiriesLoading) {
            return (
                <div className="admin-loading">
                    <div className="admin-loading__ring" />
                    <span>Loading inquiries…</span>
                </div>
            );
        }

        return (
            <div className="admin-inquiries-container">
                {/* Summary Cards */}
                <div className="admin-stats-bar" style={{ marginBottom: '2.5rem' }}>
                    {[
                        { label: 'New',     value: newCount,      color: '#dc2626', icon: <AlertCircle size={22} /> },
                        { label: 'Forms',   value: contactCount,  color: '#3a1219', icon: <Mail size={22} /> },
                        { label: 'Quotes',  value: quoteCount,    color: '#C5A059', icon: <Calendar size={22} /> },
                        { label: 'WhatsApp', value: whatsappCount, color: '#25D366', icon: <Phone size={22} /> },
                    ].map((card, i) => (
                        <div key={i} className="admin-stat-card" style={{ borderBottom: `3px solid ${card.color}` }}>
                            <div className="admin-stat-card__icon" style={{ color: card.color }}>{card.icon}</div>
                            <div className="admin-stat-card__value" style={{ color: card.color }}>{card.value}</div>
                            <div className="admin-stat-card__label">{card.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className="admin-filter-bar" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    {[
                        { key: 'all',      label: 'All' },
                        { key: 'contact',  label: 'Contact' },
                        { key: 'quote',    label: 'Quotes' },
                        { key: 'whatsapp', label: 'WhatsApp' },
                        { key: 'new',      label: 'New Only' },
                    ].map(f => (
                        <button
                            key={f.key}
                            onClick={() => setInquiryFilter(f.key)}
                            className={`admin-btn ${inquiryFilter === f.key ? 'admin-btn--primary' : 'admin-btn--ghost'} admin-btn--sm`}
                        >
                            {f.label}
                        </button>
                    ))}

                    <button
                        onClick={fetchInquiries}
                        className="admin-btn admin-btn--ghost admin-btn--sm"
                        style={{ marginLeft: 'auto' }}
                    >
                        <Clock size={13} style={{ marginRight: '6px' }} /> Refresh
                    </button>
                </div>

                {/* Inquiry List */}
                <div className="inquiry-list">
                    {filtered.length === 0 ? (
                        <div className="admin-empty">
                            <MessageSquare size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                            <p>No inquiries found for this filter.</p>
                        </div>
                    ) : (
                        filtered.map((inq) => {
                            const typeConf = TYPE_CONFIG[inq.type] || TYPE_CONFIG.contact;
                            const statusConf = STATUS_CONFIG[inq.status] || STATUS_CONFIG.new;
                            const isExpanded = expandedInquiry === inq._id;

                            return (
                                <div 
                                    key={inq._id} 
                                    className={`inquiry-item ${isExpanded ? 'is-expanded' : ''}`}
                                    style={{ borderLeft: `3px solid ${typeConf.color}` }}
                                >
                                    <div
                                        className="inquiry-header"
                                        onClick={() => {
                                            setExpandedInquiry(isExpanded ? null : inq._id);
                                            if (inq.status === 'new') updateInquiryStatus(inq._id, 'read');
                                        }}
                                    >
                                        <span className="inquiry-badge" style={{ background: typeConf.bg, color: typeConf.color }}>
                                            {typeConf.icon} {typeConf.label}
                                        </span>

                                        <div className="inquiry-info">
                                            <div className="inquiry-name" style={{ fontWeight: inq.status === 'new' ? 700 : 400 }}>
                                                {inq.name || 'Anonymous'}
                                            </div>
                                            {inq.email && <div className="inquiry-email">{inq.email}</div>}
                                        </div>

                                        <span className="inquiry-status" style={{ background: statusConf.bg, color: statusConf.color }}>
                                            {statusConf.label}
                                        </span>

                                        <span className="inquiry-date">{formatDate(inq.createdAt)}</span>

                                        <ArrowRight size={16} className="inquiry-row-arrow" style={{ 
                                            transform: isExpanded ? 'rotate(90deg)' : 'none',
                                            transition: 'transform 0.3s'
                                        }} />
                                    </div>

                                    {isExpanded && (
                                        <div className="inquiry-details">
                                            <div className="inquiry-details-grid">
                                                {inq.phone && (
                                                    <div className="inquiry-detail-item">
                                                        <Phone size={14} style={{ color: 'var(--admin-gold)', flexShrink: 0 }} />
                                                        <div>
                                                            <div className="inquiry-detail-label">Phone</div>
                                                            <div className="inquiry-detail-value">{inq.phone}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                {inq.weddingDate && (
                                                    <div className="inquiry-detail-item">
                                                        <Calendar size={14} style={{ color: 'var(--admin-gold)', flexShrink: 0 }} />
                                                        <div>
                                                            <div className="inquiry-detail-label">Wedding Date</div>
                                                            <div className="inquiry-detail-value">{inq.weddingDate}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                {inq.weddingLocation && (
                                                    <div className="inquiry-detail-item">
                                                        <MapPin size={14} style={{ color: 'var(--admin-gold)', flexShrink: 0 }} />
                                                        <div>
                                                            <div className="inquiry-detail-label">Location</div>
                                                            <div className="inquiry-detail-value">{inq.weddingLocation}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                {inq.guestCount && (
                                                    <div className="inquiry-detail-item">
                                                        <User size={14} style={{ color: 'var(--admin-gold)', flexShrink: 0 }} />
                                                        <div>
                                                            <div className="inquiry-detail-label">Guests</div>
                                                            <div className="inquiry-detail-value">{inq.guestCount}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {inq.message && (
                                                <div className="inquiry-message-box">
                                                    <div className="inquiry-detail-label" style={{ marginBottom: '8px' }}>Message</div>
                                                    <div className="inquiry-detail-value" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{inq.message}</div>
                                                </div>
                                            )}

                                            <div className="inquiry-actions">
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    {['read', 'replied', 'archived'].map(s => (
                                                        <button
                                                            key={s}
                                                            className={`admin-btn admin-btn--ghost admin-btn--sm ${inq.status === s ? 'is-active' : ''}`}
                                                            onClick={(e) => { e.stopPropagation(); updateInquiryStatus(inq._id, s); }}
                                                        >
                                                            Mark as {s}
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    className="admin-btn admin-btn--danger admin-btn--sm"
                                                    onClick={(e) => { e.stopPropagation(); deleteInquiry(inq._id); }}
                                                    style={{ marginLeft: 'auto' }}
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    };

    /* ── Stats (derived from content) ──────────── */
    const totalSections = content ? Object.keys(content).length : 0;
    const totalArrayItems = content
        ? Object.values(content).reduce((total, section) => {
            if (!section || typeof section !== 'object') return total;
            return total + Object.values(section).reduce((t, v) =>
                Array.isArray(v) ? t + v.length : t, 0);
        }, 0)
        : 0;

    /* ── Render ────────────────────────────────── */
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
                            {group.title === 'Global Branding' && <Layout size={11} style={{ marginRight: '8px', opacity: 0.6 }} />}
                            {group.title === 'Page Content' && <LayoutGrid size={11} style={{ marginRight: '8px', opacity: 0.6 }} />}
                            {group.title === 'Galleries & Stories' && <Image size={11} style={{ marginRight: '8px', opacity: 0.6 }} />}
                            {group.title === 'Editorial' && <Newspaper size={11} style={{ marginRight: '8px', opacity: 0.6 }} />}
                            {group.title === 'Customer Leads' && <MessageSquare size={11} style={{ marginRight: '8px', opacity: 0.6 }} />}
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
                                        {tab === 'inquiries' && newInquiryCount > 0 && (
                                            <span className="admin-nav-badge">{newInquiryCount}</span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className="admin-sidebar__footer">
                    <button
                        className="admin-sidebar__exit-btn"
                        onClick={async () => {
                            try {
                                await fetch(`${API}/api/admin/logout`, {
                                    method: 'POST',
                                    credentials: 'include',
                                });
                            } catch {
                                // Ignore logout failures; still exit to the public site.
                            }
                            navigate('/');
                        }}
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
                            onClick={() => window.open(import.meta.env.BASE_URL, '_blank')}
                        >
                            <Eye size={14} /> Preview
                        </button>
                        {activeTab !== 'inquiries' && (
                            <button
                                className="admin-btn admin-btn--primary admin-btn--sm"
                                onClick={handleSave}
                                disabled={isSaving || !isLoaded}
                            >
                                <Save size={14} />
                                {isSaving ? 'Saving…' : 'Save Changes'}
                            </button>
                        )}
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
                                {activeTab === 'inquiries' ? (
                                    <>Customer&nbsp;<em>Inquiries</em></>
                                ) : (
                                    <>Editing&nbsp;<em>{SECTION_LABELS[activeTab] || activeTab}</em></>
                                )}
                            </h1>
                            <p className="admin-page__subtitle">
                                {activeTab === 'inquiries'
                                    ? 'View and manage all customer inquiries from the contact form, quote requests, and WhatsApp.'
                                    : 'Make your changes below and click "Save Changes" when you\'re done.'
                                }
                            </p>
                        </div>
                        {activeTab !== 'inquiries' && (
                            <button
                                className="admin-btn admin-btn--primary"
                                onClick={handleSave}
                                disabled={isSaving || !isLoaded}
                            >
                                <Save size={15} />
                                {isSaving ? 'Saving…' : 'Save Changes'}
                            </button>
                        )}
                    </div>

                    {/* Form */}
                    {!isLoaded ? (
                        <div className="admin-loading">
                            <div className="admin-loading__ring" />
                            <span>Loading content from server…</span>
                        </div>
                    ) : (
                        <div style={{ maxWidth: '880px' }}>
                            {activeTab === 'inquiries' ? renderInquiriesPanel() : (
                                <>
                                    {renderForm()}
                                    {renderLinkedSections()}
                                </>
                            )}
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
