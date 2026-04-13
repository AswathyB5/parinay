import React, { createContext, useState, useEffect } from 'react';
import fallbackData from '../data/site-content.json';

export const ContentContext = createContext();

export const isVideoUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    const extensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.quicktime'];
    const lower = url.toLowerCase();
    return extensions.some(ext => lower.includes(ext)) || lower.includes('video');
};

// --- ENVIRONMENT CONFIG ---
const VITE_API_URL = import.meta.env.VITE_API_URL;
const LIVE_BACKEND_URL = 'https://api.parinayweddings.com'; 

export const API = VITE_API_URL || (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.hostname.startsWith('192.168.') || 
    window.location.hostname.startsWith('10.') || 
    window.location.hostname.startsWith('172.')
) ? `http://${window.location.hostname}:5000` : ''; 

console.log('[ContentContext] API endpoint set to:', API);

export const resolveMediaURL = (url) => {
    if (!url) return '';
    if (typeof url !== 'string') return url;
    if (url.startsWith('/uploads')) return `${API}${url}`;
    return url;
};

export const renderText = (text) => {
    if (!text) return null;
    const lines = text.split(/\r?\n|\\n/);
    return lines.map((line, i) => {
        const trimLine = line.trim();

        // Handle full line starts with ### as a bold line
        if (trimLine.startsWith('###')) {
            const content = trimLine.replace(/^###\s*/, '');
            return (
                <strong key={i} style={{ display: 'block', margin: '14px 0 8px', fontSize: '1.2em', fontWeight: '700', lineHeight: '1.4' }}>
                    {content}
                </strong>
            );
        }

        const isQuoted = trimLine.startsWith('"') && trimLine.endsWith('"');
        const parts = line.split(/(_[^_]+_|###[^#]+###|\[\[[^\]]+\]\])/g);
        
        const processedLine = parts.map((part, j) => {
            if (part.startsWith('_') && part.endsWith('_')) {
                return <em key={j} style={{ fontStyle: 'italic' }}>{part.slice(1, -1)}</em>;
            }
            if (part.startsWith('###') && part.endsWith('###')) {
                return <strong key={j} style={{ fontWeight: '700' }}>{part.slice(3, -3)}</strong>;
            }
            if (part.startsWith('[[') && part.endsWith(']]')) {
                return <em key={j} style={{ fontStyle: 'italic', color: '#C5A059' }}>{part.slice(2, -2)}</em>;
            }
            return part;
        });

        const isLast = i === lines.length - 1;

        if (trimLine === '' && !isLast) {
            // Render an actual spacer for empty lines
            return <span key={i} style={{ display: 'block', height: '1.2em' }} aria-hidden="true" />;
        }

        return (
            <React.Fragment key={i}>
                {isQuoted ? (
                    <span style={{ fontStyle: 'italic', textAlign: 'center', opacity: 0.85, display: 'block', marginTop: '4px', marginBottom: '8px' }}>
                        {processedLine}
                    </span>
                ) : processedLine}
                {!isLast && lines[i+1]?.trim() !== '' && <br />}
            </React.Fragment>
        );
    });
};

const initialContent = {
    home: {
        heroTagline: "Thoughtfully Planned.\nBeautifully Executed.",
        heroBtnText: "Get Started",
        heroBtnUrl: "/contact",
        heroVideos: [
            { id: 1, video: "/Untitled design.mp4" },
            { id: 2, video: "/12874721_1920_1080_30fps.mp4" }
        ],
        heroImages: [
            { id: 1, image: "https://img.freepik.com/premium-photo/beautiful-wedding-husband-wife-lovers-man-woman-bride-groom-newlyweds-couple-love-looks-one-one_210028-77.jpg", alt: "Wedding Celebration 1" },
            { id: 2, image: "https://img.freepik.com/free-photo/beautiful-wedding-couple-hugging-park_1153-5209.jpg?semt=ais_user_personalization&w=740&q=80", alt: "Wedding Celebration 2" },
            { id: 3, image: "https://i.pinimg.com/736x/d9/16/2a/d9162aded7c5c2347216669d559b265b.jpg", alt: "Wedding Celebration 3" },
            { id: 4, image: "https://img.freepik.com/premium-photo/bride-groom-pose-front-window-dark-room_444642-4894.jpg", alt: "Wedding Celebration 4" }
        ],
        introHeading: "At Parinay Weddings, we specialise in thoughtfully planned, aesthetically refined weddings where every detail is handled with care.",
        introSubText: "We don't believe in templates. Every wedding we plan is personal, intentional, and beautifully executed.",
        stat1Label: "8+ Years of\nExperience",
        stat2Label: "Destination Wedding\nSpecialists",
        stat3Label: "End-to-End Planning\nand Execution",
        stat4Label: "Trusted by Clients\nWorldwide",
        servicesLabel: "What We Handle",
        servicesHeading: "Anything & Everything Your Wedding Needs\nSeamlessly Managed",
        servicesIntroText: "We take complete ownership of your wedding planning journey, including:",
        homeServices: [
            { id: 1, image: "https://i.pinimg.com/736x/dd/3b/f1/dd3bf1a9b863e7fac61532e7f7e52bfc.jpg", title: "Venue sourcing & coordination", desc: "Finding the perfect backdrop for your story" },
            { id: 2, image: "https://i.pinimg.com/474x/fd/61/84/fd61841efb1466054aab3424f076cb98.jpg", title: "Wedding design, decor & aesthetics", desc: "Crafting a visual experience that reflects you" },
            { id: 3, image: "https://i.pinimg.com/736x/ce/f9/2c/cef92c351444a9eaf9623098cd44d70f.jpg", title: "Guest management", desc: "Seamless hospitality and logistics" },
            { id: 4, image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80", title: "On-ground execution", desc: "Flawless management on your special day" }
        ],
        servicesFooterText: "You enjoy the moments. \nWe handle everything behind the scenes.",
        destinationLabel: "Destination Weddings",
        destinationHeading: "Destination Weddings, Thoughtfully Planned",
        destinationBody1: "Kerala offers some of the most stunning wedding destinations - beaches, backwaters, heritage venues, tea estates, and luxury resorts.",
        destinationBody2: "Parinay Weddings specialises in managing destination weddings from start to finish - whether you're planning from within India or abroad.",
        destinationBody3: "From intimate celebrations to large multi-day weddings, we ensure every element feels effortless and unforgettable",
        destinationBtnText: "Explore Destination Weddings",
        destinationBtnUrl: "/contact",
        destinationImage1: "https://media.istockphoto.com/id/1173488478/photo/the-most-beautiful-day-of-their-lives.jpg?s=612x612&w=0&k=20&c=xoAbApCFRMxSScg-CZBlCSDHd-0Yhaybh9FpbV7V38Q=",
        destinationImage2: "https://media.istockphoto.com/id/1397574789/photo/together-we-make-the-world-better.jpg?s=612x612&w=0&k=20&c=hZGF9CCheaK-b31DY6hv7TlDB91duMd-dlHYKs604S0=",
        portfolioLabel: "A Glimpse Into Our Work",
        portfolioHeading: "Each wedding we plan reflects the couple behind it\n[[their love, their story, their style, their culture, their family.]]",
        portfolioItems: [
            { id: 1, title: "Tropical Paradise", date: "January 2024", location: "Kerala", overview: "A tropical paradise wedding in the heart of Kerala. We focused on the candid emotional exchanges that define the essence of a wedding.", video: "", galleryImages: "https://img.freepik.com/free-photo/veil-covers-bride-s-hands-with-wedding-rings_8353-9002.jpg?semt=ais_hybrid&w=740&q=80\nhttps://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80\nhttps://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80\nhttps://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80", result: "A flawlessly executed celebration that perfectly captured the couple's vision.", image: "https://img.freepik.com/free-photo/veil-covers-bride-s-hands-with-wedding-rings_8353-9002.jpg?semt=ais_hybrid&w=740&q=80" },
            { id: 2, title: "Backwater Magic", date: "November 2023", location: "Kumarakom", overview: "Magical backwater wedding in Kumarakom. This project was a meticulous exploration of heritage and modern luxury.", video: "", galleryImages: "", result: "The final outcome was a flawlessly executed celebration that perfectly captured the couple's vision.", image: "https://i.pinimg.com/736x/ae/0b/cf/ae0bcf2c22a59084130a3f852ad973aa.jpg" },
            { id: 3, title: "Mist & Mountains", date: "December 2023", location: "Munnar", overview: "A wedding in the mist-filled hills of Munnar. Every element was planned with absolute directorial clarity.", video: "", galleryImages: "", result: "A timeless legacy preserved in every frame and every moment of the day.", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80" },
            { id: 4, title: "Timeless Romance", date: "October 2023", location: "Udaipur", overview: "Timeless romance at the lakes of Udaipur. We sought to capture the 'soul' of the union.", video: "", galleryImages: "", result: "A royal and romantic celebration that exceeded all expectations.", image: "https://briannakirkphotography.com/wp-content/uploads/2023/03/Ana-and-Jonah-Forden-Wedding-8.20.21-Cover-Pic-BKIRK-1-1.jpg" },
            { id: 5, title: "Sunset Vows", date: "January 2024", location: "Goa", overview: "Sunset vows on the shores of Goa. A dreamy beach-themed celebration with golden hues.", video: "", galleryImages: "", result: "A beautiful shoreline victory for the couple.", image: "https://i.pinimg.com/236x/e7/03/e5/e703e5e43a036a403e3d46bbfb02577e.jpg" },
            { id: 6, title: "Floral Elegance", date: "February 2024", location: "Jaipur", overview: "Floral elegance in the Pink City. A whimsical garden oasis transformed into a royal celebration.", video: "", galleryImages: "", result: "The final outcome was a stunningly beautiful celebration of love and culture.", image: "https://img.freepik.com/free-photo/beautiful-wedding-couple-hugging-park_1153-5209.jpg?semt=ais_user_personalization&w=740&q=80" }
        ],
        portfolioViewAllText: "View our weddings",
        portfolioViewAllUrl: "/stories",
        testimonialLabel: "Testimonials",
        testimonials: [
            { id: 1, text: "Parinay Weddings turned our dream into reality. Every single detail was handled with such grace and precision — we didn't have to worry about a thing.", author: "Ananya & Rohit", location: "Kumarakom", image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80" },
            { id: 2, text: "From the first consultation to the last dance, the team was exceptional. They understood our vision perfectly and delivered something beyond imagination.", author: "Priya & Siddharth", location: "Udaipur", image: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=400&q=80" },
            { id: 3, text: "The attention to detail and personal touch Parinay Weddings brought to our wedding was truly remarkable. Our guests are still talking about the beautiful decor!", author: "Rahul & Meera", location: "Kerala", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80" },
            { id: 4, text: "Choosing Parinay Weddings was the best decision we made. They managed everything so seamlessly, allowing us to fully enjoy every moment of our special day.", author: "Sneha & Arjun", location: "Goa", image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&q=80" },
            { id: 5, text: "Professional, creative, and extremely reliable. Parinay Weddings exceeded all our expectations and made our destination wedding a truly unforgettable experience.", author: "Vikram & Ishani", location: "Jaipur", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80" }
        ],
        transitionHeading: "We manage complexity so your celebration feels effortless",
        transitionVideoUrl: "/1330-147084829_medium.mp4",
        transitionBtnText: "Work With Us",
        transitionBtnUrl: "/contact",
        youtubeLabel: "CINEMATIC STORYTELLING",
        youtubeHeading: "Every Love Story \nDeserves a Film",
        youtubeText1: "Your wedding isn't just an event; it's a collection of fleeting, beautiful moments. Our films capture the laughter, the tears, and the quiet glances that make your day unique.",
        youtubeText2: "We don't just document; we craft a narrative that feels like a movie starring you. From the grand entry to the intimate rituals, we preserve the emotion of your celebration forever.",
        youtubeBtnText: "WATCH MORE FILMS",
        youtubeBtnUrl: "https://www.youtube.com/@parinayweddings",
        youtubeVideos: [
            { id: 1, url: "https://www.youtube.com/embed/s4dWp9_nNYk?si=QtQgHS5LEJmt8atS" },
            { id: 2, url: "https://www.youtube.com/embed/s4dWp9_nNYk?si=QtQgHS5LEJmt8atS" },
            { id: 3, url: "https://www.youtube.com/embed/s4dWp9_nNYk?si=QtQgHS5LEJmt8atS" },
            { id: 4, url: "https://www.youtube.com/embed/s4dWp9_nNYk?si=QtQgHS5LEJmt8atS" },
            { id: 5, url: "https://www.youtube.com/embed/s4dWp9_nNYk?si=QtQgHS5LEJmt8atS" },
            { id: 6, url: "https://www.youtube.com/embed/s4dWp9_nNYk?si=QtQgHS5LEJmt8atS" }
        ],
        formLabel: "Get In Touch",
        formHeading: "Schedule a Personalised Consultation",
        formSubtext: "Fill in your details below and our team will get in touch to schedule a personalised consultation within 24 hours.",
        formBtnText: "Request Consultation",
        ctaBtnUrl: "/contact",
        journalNote: ""
    },
    about: {
        pageBannerTitle: "About Us",
        introLabel: "ABOUT PARINAY",
        introHeading: "Thoughtfully planned ,\nbeautifully executed.",
        introImage: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1920&q=80",
        value1Title: "Passion",
        value1Desc: "We are driven by the joy of creating beauty and meaning. Every wedding is a canvas for us to paint your unique love story with vibrant colors and heartfelt details.",
        value2Title: "Commitment",
        value2Desc: "Our dedication goes beyond planning; we are committed to your peace of mind. We stand by you at every step, ensuring a seamless and joyful journey.",
        value3Title: "Team Work",
        value3Desc: "Excellence is a shared effort. Our team of specialists works in perfect harmony, collaborating closely with you to bring your dream celebration to life.",
        differentiatorLabel: "ABOUT US",
        differentiatorHeading: "The Parinay Difference",
        differentiatorText: "At Parinay Weddings, we believe a wedding is more than an event - It is a deeply personal celebration of family, culture, and connection.\n\nFor over 8 years, we have been planning and executing weddings across South India and beyond, working closely with couples and families to create celebrations that are meaningful with clarity and care.\n\nEvery couple has a story\nEvery wedding deserves its own identity.\n\nOur approach is rooted in understanding - your vision, your priorities, your expectations - and translating them into a seamless wedding experience that feels authentic and beautifully organised.",
        differentiatorImage: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
        teamLabel: "THE EXPERTS",
        teamHeading: "Meet Our Professional Team",
        teamSubtext: "Behind every Parinay wedding is a dedicated team of planners, coordinators, and creative professionals who work seamlessly together",
        teamMembers: [
            { id: 1, name: "Sarah Thomas", role: "Founder & Lead Planner", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" },
            { id: 2, name: "Rahul Nair", role: "Creative Director", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80" },
            { id: 3, name: "Meera Krishna", role: "Logistics Head", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80" },
            { id: 4, name: "Arjun Menon", role: "Senior Coordinator", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80" }
        ],
        ctaHeading: "Ready to start your journey?",
        ctaBtnText: "Get in Touch",
        ctaBtnUrl: "/contact",
        ctaVideoUrl: "/about-video.mp4",
        heroQuote: "Every couple has a story. Every wedding deserves its own identity.",

        stat1Label: "8+ Years of\nExperience",
        stat2Label: "150+ Weddings\nPlanned",
        stat3Label: "Destination Wedding\nSpecialists",
        stat4Label: "Trusted by Clients\nWorldwide",
        philosophyQuote: "We believe in the magic of beginnings and the beauty of forever.",
        philosophyAuthor: "The Parinay Promise",
        philosophySubtitle: "Core Philosophy"
    },
    services: {
        pageBannerTitle: "Services",
        processLabel: "Our Planning Process",
        processHeading: "A Refined Journey from Vision to Celebration",
        processItems: [
            {
                id: 1,
                title: "Understanding Your Vision",
                desc: "Every celebration begins with a meaningful conversation. We take the time to understand your story, preferences, and cultural nuances - shaping a clear direction.\n\"This is where your vision begins to take form.\""
            },
            {
                id: 2,
                title: "Destination & Venue Selection",
                desc: "The setting defines the experience. We curate exceptional destinations and venues that align with your aesthetic, guest profile, and scale, managing everything from shortlisting to confirmations.\n\"An unforgettable celebration begins with the perfect setting.\""
            },
            {
                id: 3,
                title: "Budget Planning & Wedding Roadmap",
                desc: "Clarity is essential to a seamless experience. We develop a structured budget, detailed timelines, and a comprehensive planning roadmap, ensuring every element is aligned from the very beginning.\n\"Every detail, thoughtfully planned.\""
            },
            {
                id: 4,
                title: "Wedding Concept Development",
                desc: "This is where your wedding transforms into a story. We craft a unique concept that reflects your personality, traditions, and vision, setting the creative foundation for the entire celebration.\n\"A wedding designed with meaning, not just aesthetics.\""
            },
            {
                id: 5,
                title: "Design Visualisation & 3D Rendering",
                desc: "Before execution, we bring your wedding to life through detailed design visualisations and 3D renders. This allows you to experience the look and feel of your celebration in advance.\n\"See your wedding before it comes to life.\""
            },
            {
                id: 6,
                title: "Design, Décor & Styling Execution",
                desc: "With a clear vision in place, we curate every design element — from décor and florals to spatial layouts and styling. Each detail is carefully composed to create a cohesive and timeless aesthetic.\n\"Where design meets craftsmanship.\""
            },
            {
                id: 7,
                title: "Vendor Curation & Management",
                desc: "We bring together a team of exceptional professionals across hospitality, photography, beauty, and entertainment. As a trusted luxury wedding planner in India, we ensure every partner aligns with your vision and standards.\n\"Excellence, delivered by the finest.\""
            },
            {
                id: 8,
                title: "Guest Hospitality & Logistics",
                desc: "A destination wedding is as much about your guests as it is about you. From travel and accommodation to personalised hospitality and logistics, we ensure every guest experience comfort and care.\n\"Effortless hospitality, thoughtfully delivered.\""
            },
            {
                id: 9,
                title: "Production & Final Planning",
                desc: "As the celebration approaches, every element is aligned — from production and technical setups to final schedules. Precision and attention to detail ensure a flawless transition into execution.\n\"Every detail, perfectly in place.\""
            },
            {
                id: 10,
                title: "Wedding Day Execution",
                desc: "On the day of your wedding, our team orchestrates every moment with quiet precision. Timelines, rituals, and experiences unfold seamlessly. You remain present.\n\"We manage everything else.\""
            },
            {
                id: 11,
                title: "Post-Wedding Closure",
                desc: "Even after the celebrations conclude, we oversee final settlements, deliverables, and wrap-ups. Every detail is completed with the same care and attention as the wedding itself.\n\"A graceful conclusion to a beautifully planned journey.\""
            }
        ],
        ctaHeading: "Begin Your Journey",
        ctaImage: "https://static.vecteezy.com/system/resources/previews/036/616/104/large_2x/a-young-wedding-couple-enjoys-romantic-moments-against-the-background-of-a-summer-forest-in-a-park-bride-in-white-wedding-dress-groom-in-white-shirt-waistcoat-and-bow-tie-hug-and-kiss-bride-photo.jpg",
        ctaDesc: "At Parinay Weddings, we believe luxury lies not just in how a wedding looks, but in how effortlessly it is experienced.\n\nLet us craft a celebration that is timeless, personal, and truly unforgettable.",
        ctaBtnText: "Book a Wedding Consultation",
        ctaBtnUrl: "/contact",
        comprehensiveHeading: "COMPLETE WEDDING PLANNING",
        comprehensiveIntro1: "At Parinay Weddings, we offer end-to-end wedding planning and design services, ensuring that every celebration is planned with precision, creativity, and care.",
        comprehensiveIntro2: "From the first conversation to the final farewell, our team manages every aspect of the wedding journey — allowing couples and their families to fully immerse themselves in the joy of the celebration.",
        comprehensiveList: [
            {
                id: 1,
                title: "Wedding Planning & Strategy",
                image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
                desc: "We begin every celebration with a deep understanding of your vision, traditions, and expectations. Our team develops a structured planning strategy that includes detailed consultations, budget planning, timelines, and event flow mapping. Every decision is thoughtfully guided to ensure clarity, efficiency, and a stress-free planning journey."
            },
            {
                id: 2,
                title: "Destination & Venue Management",
                image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800",
                desc: "From luxury resorts to heritage venues, we curate exceptional venues that perfectly complement your wedding vision. We handle venue sourcing, bookings, room blocking, and permits with precision. Our expertise as destination wedding planners in South India makes destination weddings smooth and worry-free for couples worldwide."
            },
            {
                id: 3,
                title: "Wedding Design & Creative Direction",
                image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
                desc: "Our luxury wedding planning focus on bespoke theme conceptualisation, refined event styling, and elegant venue layouts that reflect your personality. Every detail — from colour palettes to spatial design — is curated to create a cohesive and visually stunning celebration that is distinctly yours."
            },
            {
                id: 4,
                title: "Vendor Sourcing & Management",
                image: "https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&q=80&w=800",
                desc: "The right vendors bring your wedding vision to life. As a leading luxury wedding planner in India, we collaborate with top professionals across catering, beauty, photography, and cultural services. We manage everything to ensure quality and consistency."
            },
            {
                id: 5,
                title: "Guest Hospitality & Wedding Logistics",
                image: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&q=80&w=800",
                desc: "Indian weddings are defined by their warmth and hospitality, and we ensure every guest feels cared for. Our wedding planning services in Kerala include guest list management, RSVP tracking, welcome desks, concierge services, and seamless transportation logistics."
            },
            {
                id: 6,
                title: "Event Production",
                image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800",
                desc: "Our expertise in luxury wedding production brings each celebration to life with precision and scale. From stage construction and advanced sound and lighting to visual production and special effects, every technical element is executed flawlessly. We integrate modern production techniques to enhance the overall experience."
            },
            {
                id: 7,
                title: "Entertainment",
                image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80",
                desc: "We curate engaging experiences that elevate every celebration. As an end-to-end destination wedding planner in India, we organise live bands, DJs, celebrity performances, and cultural shows. Each moment is designed to leave a lasting impression."
            },
            {
                id: 8,
                title: "Bridal & Groom Styling",
                image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
                desc: "From personalised styling consultations and trousseau planning to shopping assistance, hair, and makeup coordination, every detail is handled with care. As part of our luxury wedding planning services, we align your look with the overall wedding aesthetic."
            },
            {
                id: 9,
                title: "Wedding Day Coordination",
                image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
                desc: "On your wedding day, our team ensures that everything unfolds exactly as planned. As an experienced wedding planner in South India, we manage timelines, guest flow, ritual coordination, and all on-ground operations. We proactively handle any challenges, allowing you and your family to remain fully present in every moment."
            }
        ]
    },
    contact: {
        pageBannerTitle: "Contact",
        heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80",
        heroTitle: "Let's Start Planning",
        heroTitleEm: "Your Masterpiece",
        heroSubtitle: "Every extraordinary wedding begins with a single conversation. We look forward to hearing your story and vision.",
        emailLabel: "General Inquiries",
        emailHeading: "Email Us",
        email: "aswathykurup17@gmail.com",
        phoneLabel: "Direct Line",
        phoneHeading: "Call Us",
        phone: "+91 6282698190",
        addressLabel: "Visit Us",
        addressHeading: "Office Address",
        address: "Cochin, Kerala, India\nBy Appointment Only",
        whatsappNumber: "916282698190",
        whatsappText: "Chat with us",
        whatsappReply: "Typically replies within 1 hour",
        instagramUrl: "https://instagram.com/parinayweddings",
        facebookUrl: "https://facebook.com/parinayweddings",
        pinterestUrl: "https://pinterest.com/parinayweddings",
        formBtnText: "Send Inquiry",
        faqsList: [
            { 
                id: "faq1",
                question: "How far in advance should we reach out to Parinay Weddings?", 
                answer: "To ensure we can provide the dedicated attention each of our weddings deserves, we recommend reaching out 10-12 months before your desired date — especially for destination weddings during the peak Kerala season (November-February)." 
            },
            { 
                id: "faq2",
                question: "Do you manage all vendor communications and contracts?", 
                answer: "Yes. From scouting the perfect venue to negotiating contracts with floral designers and entertainment, we handle the entire vendor lifecycle. You are kept informed and make the final decisions, but we manage the overhead." 
            },
            { 
                id: "faq3",
                question: "Do you plan weddings outside of Kerala?", 
                answer: "While Kerala is our primary specialty, we have extensive experience planning weddings across India (Goa, Udaipur, Jaipur) and international destination celebrations. Our planning methodology is designed to travel." 
            },
            { 
                id: "faq4",
                question: "What is the typical investment for a Parinay wedding?", 
                answer: "Because every wedding we design is bespoke, there is no one-size-fits-all cost. During our initial consultation, we'll discuss your vision and guest count to help define a realistic budget for a high-end, luxury experience." 
            }
        ]
    },
    storiesDestination: {
        pageBannerTitle: "Destination Weddings",
        storiesList: [
            { 
                id: 1, 
                title: "Backwater Bliss in Kumarakom", 
                date: "February 2025", 
                location: "Kumarakom, Kerala", 
                badge: "Destination", 
                video: "/uploads/upload_1773132860733_81.mp4", 
                overview: "A breathtaking celebration of love and tradition on the serene backwaters. This project was a meticulous exploration of heritage and modern luxury, where every element was planned with absolute directorial clarity.\n\nFrom the choice of floral aesthetics to the choreographed moments of the ceremony, we focused on the candid emotional exchanges that define the essence of a wedding.",
                galleryImages: "",
                result: "The final outcome was a flawlessly executed celebration that perfectly captured the couple's vision. Beyond the aesthetics, we delivered a stress-free experience that allowed the family to fully immerse themselves in the joy of the union. A timeless legacy preserved in every frame.",
                image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80", 
                desc: "An elegant three-day celebration on the serene backwaters of Kerala, blending contemporary luxury with local charm."
            },
            { 
                id: 2, 
                title: "Clifftop Vows in Varkala", 
                date: "December 2024", 
                location: "Varkala, Kerala", 
                badge: "Destination", 
                video: "/uploads/upload_1773132906231_395.mp4", 
                overview: "A sunset ceremony on the red cliffs of Varkala. We sought to capture the 'soul' of the union in this breathtaking setting, prioritizing the quiet, unscripted glances that often go unnoticed but define the true spirit of the day.",
                galleryImages: "",
                result: "A cinematic masterpiece of a wedding that left the guests in awe. The seamless coordination of travel and clifftop logistics ensured a perfect experience for all.",
                image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80", 
                desc: "A breathtaking sunset ceremony on the red cliffs of Varkala, overlooking the endless expanse of the Arabian Sea."
            },
            { 
                id: 3, 
                title: "Heritage Grandeur in Hyderabad", 
                date: "November 2024", 
                location: "Hyderabad", 
                badge: "Destination", 
                video: "/uploads/upload_1773132909114_925.mp4", 
                overview: "Mughal grandeur meets contemporary elegance in this royal celebration. Every ritual was preserved in its most authentic form, creating a visual narrative that makes you feel the profound emotion of the journey.",
                galleryImages: "",
                result: "A royal success. The wedding was a testament to our ability to handle large-scale luxury events with precision and cultural sensitivity.",
                image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80", 
                desc: "A royal celebration at a palatial heritage venue blending Mughal grandeur with contemporary elegance."
            }
        ],
        heroImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1920&q=80",
        heroTitle: "A Visual Narrative",
        heroSubtitle: "A curation of extraordinary celebrations, capturing the unique essence and emotion of every couple we serve."
    },
    storiesThemed: {
        pageBannerTitle: "Themed Weddings",
        storiesList: [
            { 
                id: 3, 
                title: "The Secret Garden Soirée", 
                date: "October 2024", 
                location: "Kochi, Kerala", 
                badge: "Themed", 
                video: "/uploads/upload_1773132860733_81.mp4", 
                overview: "A whimsical floral-themed wedding in a colonial estate. Our approach was editorial yet deeply cinematic, weaving together the intimate details that make each wedding unique.",
                galleryImages: "",
                result: "The ethereal garden oasis came to life, providing a magical backdrop for the couple's vows. A flawlessly executed theme that exceeded expectations.",
                image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80", 
                desc: "A whimsical floral-themed wedding that transformed a colonial estate into an ethereal garden oasis."
            },
            { 
                id: 4, 
                title: "Sunset By The Shore", 
                date: "January 2025", 
                location: "Goa", 
                badge: "Themed", 
                video: "/uploads/upload_1773132906231_395.mp4", 
                overview: "Dreamy beach celebration in Goa. We ensured that every hue, every glance, and every ritual was preserved in its most authentic form against the backdrop of the ocean.",
                galleryImages: "",
                result: "A romantic sunset victory. The beach-themed design was both elegant and relaxed, perfectly suiting the couple's style.",
                image: "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=800&q=80", 
                desc: "A dreamy beach-themed celebration where golden hues and ocean breezes created the most romantic backdrop."
            }
        ],
        heroImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1920&q=80",
        heroTitle: "Signature Themed Concepts",
        heroSubtitle: "Transforming spaces into immersive worlds that tell your unique love story through design."
    },
    storiesTraditional: {
        pageBannerTitle: "Traditional Weddings",
        storiesList: [
            { 
                id: 2, 
                title: "Heritage Grandeur at Mysore", 
                date: "March 2025", 
                location: "Mysore, Karnataka", 
                badge: "Traditional", 
                video: "/uploads/upload_1773132909114_925.mp4", 
                overview: "Royal heritage celebration in Mysore. This project was a meticulous exploration of heritage and traditions, planned with absolute clarity and respect for culture.",
                galleryImages: "",
                result: "A timeless legacy preserved. The opulent decor and traditional elements blended seamlessly to create a truly majestic atmosphere.",
                image: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=80", 
                desc: "A royal celebration at a heritage palace, honouring centuries-old traditions with opulent decor and meticulous planning."
            },
            { 
                id: 5, 
                title: "Sacred Rituals in Madurai", 
                date: "September 2024", 
                location: "Madurai, Tamil Nadu", 
                badge: "Traditional", 
                video: "/uploads/upload_1773132860733_81.mp4", 
                overview: "Centuries of ritual and vibrant color in Madurai. We focused on the soul of the union, weaving together the intimate details that make each tradition unique.",
                galleryImages: "",
                result: "Deeply cultural and visually stunning. The sacred rituals were executed with precision, resulting in a profoundly moving celebration.",
                image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80", 
                desc: "A traditional Tamil wedding steeped in centuries of ritual, vibrant colour and deep cultural meaning."
            }
        ],
        heroImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=80",
        heroTitle: "Honouring Our Heritage",
        heroSubtitle: "Timeless traditions celebrated with contemporary elegance and profound respect for cultural roots."
    },
    weddingStories: {
        pageBannerTitle: "Wedding Stories",
        ctaBtnText: "EXPLORE MORE COLLECTIONS",
        ctaBtnUrl: "https://instagram.com",
        ctaBtnIcon: "fab fa-instagram",
        storiesList: [
            { id: 1001, title: "Tropical Paradise", date: "January 2024", location: "Kerala", overview: "A tropical paradise wedding in the heart of Kerala. We focused on the candid emotional exchanges that define the essence of a wedding.", video: "", galleryImages: "https://img.freepik.com/free-photo/veil-covers-bride-s-hands-with-wedding-rings_8353-9002.jpg?semt=ais_hybrid&w=740&q=80\nhttps://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80\nhttps://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80\nhttps://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80", result: "A flawlessly executed celebration that perfectly captured the couple's vision.", image: "https://img.freepik.com/free-photo/veil-covers-bride-s-hands-with-wedding-rings_8353-9002.jpg?semt=ais_hybrid&w=740&q=80", category: "Featured" },
            { id: 1002, title: "Backwater Magic", date: "November 2023", location: "Kumarakom", overview: "Magical backwater wedding in Kumarakom. This project was a meticulous exploration of heritage and modern luxury.", video: "", galleryImages: "", result: "The final outcome was a flawlessly executed celebration that perfectly captured the couple's vision.", image: "https://i.pinimg.com/736x/ae/0b/cf/ae0bcf2c22a59084130a3f852ad973aa.jpg", category: "Destination" },
            { id: 1003, title: "Mist & Mountains", date: "December 2023", location: "Munnar", overview: "A wedding in the mist-filled hills of Munnar. Every element was planned with absolute directorial clarity.", video: "", galleryImages: "", result: "A timeless legacy preserved in every frame and every moment of the day.", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80", category: "Destination" },
            { id: 1004, title: "Timeless Romance", date: "October 2023", location: "Udaipur", overview: "Timeless romance at the lakes of Udaipur. We sought to capture the 'soul' of the union.", video: "", galleryImages: "", result: "A royal and romantic celebration that exceeded all expectations.", image: "https://briannakirkphotography.com/wp-content/uploads/2023/03/Ana-and-Jonah-Forden-Wedding-8.20.21-Cover-Pic-BKIRK-1-1.jpg", category: "Traditional" },
            { id: 1005, title: "Sunset Vows", date: "January 2024", location: "Goa", overview: "Sunset vows on the shores of Goa. A dreamy beach-themed celebration with golden hues.", video: "", galleryImages: "", result: "A beautiful shoreline victory for the couple.", image: "https://i.pinimg.com/236x/e7/03/e5/e703e5e43a036a403e3d46bbfb02577e.jpg", category: "Themed" },
            { id: 1006, title: "Floral Elegance", date: "February 2024", location: "Jaipur", overview: "Floral elegance in the Pink City. A whimsical garden oasis transformed into a royal celebration.", video: "", galleryImages: "", result: "The final outcome was a stunningly beautiful celebration of love and culture.", image: "https://img.freepik.com/free-photo/beautiful-wedding-couple-hugging-park_1153-5209.jpg?semt=ais_user_personalization&w=740&q=80", category: "Themed" }
        ]
    },
    journals: {
        pageBannerTitle: "Journal",
        sectionLabel: "Curated Pieces",
        sectionTitle: "Latest Writing",
        journalsList: [
            { 
                id: 101, 
                title: "Choosing the Perfect Backwater Venue in Kerala", 
                date: "February 12, 2026", 
                excerpt: "Discover our curated list of the most stunning luxury resorts for your destination backwater wedding.", 
                image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
                author: "By Parinay",
                content: "When it comes to destination weddings in Kerala... "
            },
            { 
                id: 102, 
                title: "Floral Trends for 2026: Sustainable Elegance", 
                date: "January 28, 2026", 
                excerpt: "From locally sourced blooms to artisanal floral installations... ",
                image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
                author: "By Sarah Thomas",
                content: "Sustainability is no longer just a buzzword... "
            },
            { 
                id: 103, 
                title: "The Art of Managing a Luxury Wedding Budget", 
                date: "January 15, 2026", 
                excerpt: "Expert advice on where to invest and how to prioritise... ",
                image: "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=800&q=80",
                author: "By Rahul Nair",
                content: "Planning a luxury wedding isn't just about spending... "
            }
        ],
        guideLabel: "EXCLUSIVE ACCESS",
        guideTitle: "Download Our Complete Guide",
        guideDesc: "Get access to our 'Kerala Destination Wedding Checklist' and venue comparison guide. A must-have for every couple planning from afar.",
        guideChecks: [
            { id: 1, text: "Top 10 Luxury Venue Insights" },
            { id: 2, text: "Seasonal Weather Pattern Guide" },
            { id: 3, text: "Comprehensive Budget Allocation Template" }
        ],
        guideImage: "/uploads/upload_1774345251045_4601.jpg",
        guideYear: "The 2026",
        guidePlannerLabel: "Planner",
        guideFreeText: "Free Download",
        guideRequestBtnText: "Request Copy",
        readEntryText: "Read Entry —",
        relatedSectionLabel: "CONTINUE READING",
        relatedSectionTitle: "More Stories",
        ctaLabel: "READY TO START?",
        ctaTitle: "Let us craft your _Unique Narrative_",
        ctaBtnText: "Get in Touch — Start Planning"
    },
    header: {
        logoText: "PARINAY",
        logoImage: "",
        logoWidth: "150px",
        logoHeight: "auto",
        nav1Label: "Home",
        nav1Url: "/",
        nav2Label: "About",
        nav2Url: "/about",
        nav3Label: "Services",
        nav3Url: "/services",
        nav4Label: "Wedding Stories",
        nav4Url: "/stories",
        nav4Sub1Label: "Destination Weddings",
        nav4Sub1Url: "/destination-weddings",
        nav4Sub2Label: "Themed Weddings",
        nav4Sub2Url: "/themed-weddings",
        nav4Sub3Label: "Traditional Weddings",
        nav4Sub3Url: "/traditional-weddings",
        nav5Label: "Journals",
        nav5Url: "/journals",
        nav6Label: "Contact",
        nav6Url: "/contact"
    },
    footer: {
        logoText: "PARINAY",
        logoSub: "WEDDINGS",
        logoImage: "",
        logoWidth: "120px",
        logoHeight: "auto",
        tagline: "Bespoke destination wedding planners based in Kerala, India. Planning meaningful celebrations for over 8 years.",
        instagramUrl: "https://instagram.com/parinayweddings",
        facebookUrl: "https://facebook.com/parinayweddings",
        pinterestUrl: "https://pinterest.com/parinayweddings",
        youtubeUrl: "https://youtube.com/@parinayweddings",
        email: "aswathykurup17@gmail.com",
        phone: "+91 6282698190",
        address: "Cochin, Kerala, India",
        whatsappNumber: "916282698190",
        ctaTagline: "Let's Start Your Journey",
        ctaBtnText: "Book a Consultation",
        ctaBtnUrl: "/contact",
        copyrightName: "Parinay Weddings"
    }
};


const loadFromDB = async () => {
    try {
        const res = await fetch(`${API}/api/content`);
        if (res.ok) return await res.json();
        return null;
    } catch (err) {
        // Suppress console error on Vercel/Production where localhost is expected to fail
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
            console.warn('[Content] Backend unreachable, falling back to local JSON.');
        } else {
            console.error('[loadFromDB] Connection failed:', err);
        }
        return null;
    }
};

const saveToDB = async (data) => {
    try {
        const res = await fetch(`${API}/api/content`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            const result = await res.json();
            if (result.success && result.data) return result.data;
        } else {
            const errorData = await res.json().catch(() => ({}));
            console.error('[saveToDB] Server responded with error:', res.status, errorData);
        }
    } catch (err) {
        console.error('[saveToDB] Connection failed:', err);
    }
    return null;
};

export const ContentProvider = ({ children }) => {
    const [content, setContent] = useState(initialContent);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadFromDB().then((saved) => {
            if (saved) {
                /**
                 * Deep merge strategy:
                 * 1. For each section, start with initialContent defaults.
                 * 2. Overlay saved (DB) scalar fields so user edits are preserved.
                 * 3. For array fields, merge by item ID so:
                 *    - New fields added in code appear on existing DB items.
                 *    - New items added in code appear if they don't exist in DB.
                 *    - Items the user added/edited in admin are fully preserved.
                 */
                const mergeArrayField = (codeArr, dbArr) => {
                    // If DB doesn't have this array at all (null/undefined), use code defaults
                    if (!dbArr || !Array.isArray(dbArr)) return codeArr;
                    
                    // If DB has data for this section, it becomes the source of truth for membership.
                    // This prevents deleted default items from reappearing on refresh.
                    return dbArr.map(dbItem => {
                        const codeItem = codeArr.find(c => c.id === dbItem.id);
                        // Merge fields from code into DB item (preserves DB values but adds new scalar properties from code)
                        return { ...codeItem, ...dbItem };
                    });
                };

                const merged = Object.keys(initialContent).reduce((acc, section) => {
                    const codeSection = initialContent[section];
                    const dbSection = saved[section] || {};
                    const mergedSection = { ...codeSection, ...dbSection };

                    // SECURITY/CLEANUP: Prune known legacy keys that shouldn't be in the state anymore
                    if (section === 'services') {
                        const forbidden = [
                            'service1Label', 'service1Heading', 'service1Desc', 'service1Image', 'service1List',
                            'service2Label', 'service2Heading', 'service2Desc', 'service2Image', 'service2List',
                            'service3Label', 'service3Heading', 'service3Desc', 'service3Image', 'service3List',
                            'service4Label', 'service4Heading', 'service4Desc', 'service4Image',
                            'process1Title', 'process1Desc', 'process2Title', 'process2Desc', 
                            'process3Title', 'process3Desc', 'process4Title', 'process4Desc',
                            'servicesListLabel', 'servicesListHeading',
                            'inquireBtnText', 'inquireBtnUrl'
                        ];
                        forbidden.forEach(k => delete mergedSection[k]);
                    }

                    // --- MIGRATION FOR HOME SECTION ---
                    if (section === 'home') {
                        // 1. Migrate services
                        if (!dbSection.homeServices && (dbSection.service1Title || dbSection.service1Image)) {
                            mergedSection.homeServices = [];
                            for (let i = 1; i <= 4; i++) {
                                if (dbSection[`service${i}Title`] || dbSection[`service${i}Image`]) {
                                    mergedSection.homeServices.push({
                                        id: 2000 + i,
                                        title: dbSection[`service${i}Title`] || '',
                                        image: dbSection[`service${i}Image`] || '',
                                        desc: dbSection[`service${i}Desc`] || ''
                                    });
                                }
                            }
                        }
                        // 2. Migrate hero videos
                        if (!dbSection.heroVideos && (dbSection.heroVideo1 || dbSection.heroVideo2)) {
                            mergedSection.heroVideos = [];
                            if (dbSection.heroVideo1) mergedSection.heroVideos.push({ id: 3001, video: dbSection.heroVideo1 });
                            if (dbSection.heroVideo2) mergedSection.heroVideos.push({ id: 3002, video: dbSection.heroVideo2 });
                        }

                        // Prune legacy keys
                        const legacyHomeKeys = [
                            'service1Image', 'service1Title', 'service1Desc',
                            'service2Image', 'service2Title', 'service2Desc',
                            'service3Image', 'service3Title', 'service3Desc',
                            'service4Image', 'service4Title', 'service4Desc',
                            'heroVideo1', 'heroVideo2'
                        ];
                        legacyHomeKeys.forEach(k => delete mergedSection[k]);
                    }

                    // For every array field, do the smart merge
                    Object.keys(codeSection).forEach(key => {
                        if (Array.isArray(codeSection[key])) {
                            mergedSection[key] = mergeArrayField(codeSection[key], dbSection[key]);
                        }
                    });

                    acc[section] = mergedSection;
                    return acc;
                }, {});

                setContent(merged);
                setIsLoaded(true);
            } else {
                // FALLBACK FOR VERCEL
                if (fallbackData && Object.keys(fallbackData).length > 0) {
                    // Mix fallback with initial just in case
                    setContent(prev => ({ ...prev, ...fallbackData }));
                }
                setIsLoaded(true);
            }
        });
    }, []);

    const updateMultipleSections = async (updates) => {
        // updates is an object like { home: { ... }, about: { ... } }
        let updated = { ...content };
        Object.keys(updates).forEach(section => {
            updated[section] = { ...updated[section], ...updates[section] };
        });
        
        setContent(updated);

        if (isLoaded) {
            try {
                const res = await fetch(`${API}/api/content`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated),
                });

                if (res.ok) {
                    const result = await res.json();
                    if (result.success && result.data) {
                        setContent(result.data);
                        return { success: true };
                    }
                } else {
                    const errRes = await res.json().catch(() => ({}));
                    return { success: false, error: errRes.error || `Server error: ${res.status}` };
                }
            } catch (err) {
                console.error('[updateMultipleSections] Connection failed:', err);
                return { success: false, error: 'Could not connect to the backend server.' };
            }
        }
        return { success: true };
    };

    const updateSection = async (section, newData) => {
        return updateMultipleSections({ [section]: newData });
    };

    const trackWhatsAppClick = async () => {
        try {
            const num = content?.contact?.whatsappNumber || content?.footer?.whatsappNumber || '';
            await fetch(`${API}/api/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'whatsapp',
                    name: 'WhatsApp Click',
                    message: `Visitor clicked WhatsApp chat button to ${num}`,
                    status: 'new'
                }),
            });
        } catch (err) {
            console.warn('[WhatsApp Track] Failed:', err);
        }
    };

    return (
        <ContentContext.Provider value={{ content, updateSection, updateMultipleSections, trackWhatsAppClick, isLoaded, API }}>
            {children}
        </ContentContext.Provider>
    );
};
