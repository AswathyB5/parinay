import React, { createContext, useState, useEffect } from 'react';
import fallbackData from '../data/site-content.json';

export const ContentContext = createContext();

const initialContent = {
    home: {
        heroTagline: "Thoughtfully Planned.\nBeautifully Executed.",
        heroBtnText: "Get Started",
        heroBtnUrl: "/contact",
        heroVideo1: "/Untitled design.mp4",
        heroVideo2: "/12874721_1920_1080_30fps.mp4",
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
        service1Image: "https://i.pinimg.com/736x/dd/3b/f1/dd3bf1a9b863e7fac61532e7f7e52bfc.jpg",
        service1Title: "Venue sourcing & coordination",
        service1Desc: "Finding the perfect backdrop for your story",
        service2Image: "https://i.pinimg.com/474x/fd/61/84/fd61841efb1466054aab3424f076cb98.jpg",
        service2Title: "Wedding design, decor & aesthetics",
        service2Desc: "Crafting a visual experience that reflects you",
        service3Image: "https://i.pinimg.com/736x/ce/f9/2c/cef92c351444a9eaf9623098cd44d70f.jpg",
        service3Title: "Guest management",
        service3Desc: "Seamless hospitality and logistics",
        service4Image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
        service4Title: "On-ground execution",
        service4Desc: "Flawless management on your special day",
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
        portfolioHeading: "Each wedding we plan reflects the couple behind it - their love, their story, their style, their culture.",
        portfolioItems: [
            { id: 1, image: "https://img.freepik.com/free-photo/veil-covers-bride-s-hands-with-wedding-rings_8353-9002.jpg?semt=ais_hybrid&w=740&q=80", title: "Tropical Paradise", loc: "Kerala" },
            { id: 2, image: "https://i.pinimg.com/736x/ae/0b/cf/ae0bcf2c22a59084130a3f852ad973aa.jpg", title: "Backwater Magic", loc: "Kumarakom" },
            { id: 3, image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80", title: "Mist & Mountains", loc: "Munnar" },
            { id: 4, image: "https://briannakirkphotography.com/wp-content/uploads/2023/03/Ana-and-Jonah-Forden-Wedding-8.20.21-Cover-Pic-BKIRK-1-1.jpg", title: "Timeless Romance", loc: "Udaipur" },
            { id: 5, image: "https://i.pinimg.com/236x/e7/03/e5/e703e5e43a036a403e3d46bbfb02577e.jpg", title: "Sunset Vows", loc: "Goa" },
            { id: 6, image: "https://img.freepik.com/free-photo/beautiful-wedding-couple-hugging-park_1153-5209.jpg?semt=ais_user_personalization&w=740&q=80", title: "Floral Elegance", loc: "Jaipur" }
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
        youtubeEmbedUrl: "https://www.youtube.com/embed/s4dWp9_nNYk?si=QtQgHS5LEJmt8atS",
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
        heroImage: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1920&q=80",
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
        teamDesc: "Behind every Parinay wedding is a dedicated team of planners, coordinators, and creative professionals who work seamlessly together",
        teamMembers: [
            { id: 1, name: "Sarah Thomas", role: "Founder & Lead Planner", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" },
            { id: 2, name: "Rahul Nair", role: "Creative Director", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80" },
            { id: 3, name: "Meera Krishna", role: "Logistics Head", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80" },
            { id: 4, name: "Arjun Menon", role: "Senior Coordinator", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80" }
        ],
        ctaHeading: "Ready to start your journey?",
        ctaBtnText: "Get in Touch",
        ctaBtnUrl: "/contact",
        ctaVideoUrl: "/about-video.mp4"
    },
    services: {
        pageBannerTitle: "Services",
        servicesListLabel: "OUR SPECIALIZATIONS",
        servicesListHeading: "The Art of Celebration",
        service1Label: "FLAWLESS EXECUTION",
        service1Heading: "Full Planning",
        service1Desc: "From initial concept to your final dance, we manage every single detail of your celebration, leaving you free to enjoy the journey of becoming one.",
        service1Image: "/uploads/upload_1774342368678_2312.jpg",
        service2Label: "VISUAL STORYTELLING",
        service2Heading: "Partial Planning",
        service2Desc: "We create a cohesive visual narrative for your wedding, including custom mood boards, floral direction, ambient lighting, and bespoke decor elements.",
        service2Image: "/uploads/upload_1774341294277_3597.jpg",
        service3Label: "SCOUTING & LOGISTICS",
        service3Heading: "Destination",
        service3Desc: "We help you find the perfect backdrop for your love story, from hidden coastal gems to world-renowned luxury manor houses and estates.",
        service3Image: "https://assets.zeezest.com/blogs/PROD_goa%20wedding%20venues_1698773064171.jpg",
        service4Label: "GUEST EXPERIENCE",
        service4Heading: "Hospitality",
        service4Desc: "Comprehensive management of your loved ones travel, accommodation, and curated welcome experiences, ensuring they feel as valued as you do.",
        service4Image: "https://images.squarespace-cdn.com/content/v1/65f07a6bb920a639725145b7/1727446736382-BZ6LLFXT3559SS2G8NFR/7D6C6468.jpg",
        processLabel: "How We Work",
        processHeading: "A Structured, Calm Planning Process",
        process1Title: "Understanding Your Vision",
        process1Desc: "We begin with an in-depth consultation to understand your love story, priorities, and the feeling you want your wedding to evoke.",
        process2Title: "Planning & Designing",
        process2Desc: "We craft a complete wedding plan — timeline, budget, vendor curation, and design direction — tailored entirely to you.",
        process3Title: "Coordination & Execution",
        process3Desc: "We manage all vendor communication, bookings, contracts, and logistics so nothing falls through the cracks.",
        process4Title: "You Celebrate, We Manage",
        process4Desc: "On your wedding day, we handle every detail behind the scenes so you can be fully present in every moment.",
        ctaHeading: "Let's Begin Planning Your Wedding",
        ctaImage: "https://static.vecteezy.com/system/resources/previews/036/616/104/large_2x/a-young-wedding-couple-enjoys-romantic-moments-against-the-background-of-a-summer-forest-in-a-park-bride-in-white-wedding-dress-groom-in-white-shirt-waistcoat-and-bow-tie-hug-and-kiss-bride-photo.jpg",
        ctaDesc: "If you're looking for a wedding planning partner who combines experience, creativity and reliability, we'd love to connect.",
        ctaBtnText: "Book a Wedding Consultation",
        ctaBtnUrl: "/contact",
        comprehensiveHeading: "COMPLETE WEDDING PLANNING",
        comprehensiveIntro1: "At Parinay Weddings, we offer end-to-end wedding planning and design services, ensuring that every celebration is planned with precision, creativity, and care.",
        comprehensiveIntro2: "From the first conversation to the final farewell, our team manages every aspect of the wedding journey — allowing couples and their families to fully immerse themselves in the joy of the celebration.",
        comprehensiveList: [
            {
                title: "Wedding Planning & Strategy",
                desc: "We begin every celebration with a deep understanding of your vision, traditions, and expectations. Our team develops a structured planning strategy that includes detailed consultations, budget planning, timelines, and event flow mapping. Every decision is thoughtfully guided to ensure clarity, efficiency, and a stress-free planning journey."
            },
            {
                title: "Destination & Venue Management",
                desc: "From luxury resorts to heritage venues, we curate exceptional venues that perfectly complement your wedding vision. We handle venue sourcing, bookings, room blocking, and permits with precision. Our expertise as destination wedding planners in South India makes destination weddings smooth and worry-free for couples worldwide."
            },
            {
                title: "Wedding Design & Creative Direction",
                desc: "Our luxury wedding planning focus on bespoke theme conceptualisation, refined event styling, and elegant venue layouts that reflect your personality. Every detail — from colour palettes to spatial design — is curated to create a cohesive and visually stunning celebration that is distinctly yours."
            },
            {
                title: "Vendor Sourcing & Management",
                desc: "The right vendors bring your wedding vision to life. As a leading luxury wedding planner in India, we collaborate with top professionals across catering, beauty, photography, and cultural services. We manage everything to ensure quality and consistency."
            },
            {
                title: "Guest Hospitality & Wedding Logistics",
                desc: "Indian weddings are defined by their warmth and hospitality, and we ensure every guest feels cared for. Our wedding planning services in Kerala include guest list management, RSVP tracking, welcome desks, concierge services, and seamless transportation logistics."
            },
            {
                title: "Event Production",
                desc: "Our expertise in luxury wedding production brings each celebration to life with precision and scale. From stage construction and advanced sound and lighting to visual production and special effects, every technical element is executed flawlessly. We integrate modern production techniques to enhance the overall experience."
            },
            {
                title: "Entertainment",
                desc: "We curate engaging experiences that elevate every celebration. As an end-to-end destination wedding planner in India, we organise live bands, DJs, celebrity performances, and cultural shows. Each moment is designed to leave a lasting impression."
            },
            {
                title: "Bridal & Groom Styling",
                desc: "From personalised styling consultations and trousseau planning to shopping assistance, hair, and makeup coordination, every detail is handled with care. As part of our luxury wedding planning services, we align your look with the overall wedding aesthetic."
            },
            {
                title: "Wedding Day Coordination",
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
        email: "hello@parinayweddings.com",
        phoneLabel: "Direct Line",
        phoneHeading: "Call Us",
        phone: "+91 98765 43210",
        addressLabel: "Visit Us",
        addressHeading: "Office Address",
        address: "Cochin, Kerala, India\nBy Appointment Only",
        whatsappNumber: "919876543210",
        whatsappText: "Chat with us",
        whatsappReply: "Typically replies within 1 hour",
        instagramUrl: "https://instagram.com/parinayweddings",
        facebookUrl: "https://facebook.com/parinayweddings",
        pinterestUrl: "https://pinterest.com/parinayweddings",
        formBtnText: "Send Inquiry",
        faqsList: [
            { 
                question: "How far in advance should we reach out to Parinay Weddings?", 
                answer: "To ensure we can provide the dedicated attention each of our weddings deserves, we recommend reaching out 10-12 months before your desired date — especially for destination weddings during the peak Kerala season (November-February)." 
            },
            { 
                question: "Do you manage all vendor communications and contracts?", 
                answer: "Yes. From scouting the perfect venue to negotiating contracts with floral designers and entertainment, we handle the entire vendor lifecycle. You are kept informed and make the final decisions, but we manage the overhead." 
            },
            { 
                question: "Do you plan weddings outside of Kerala?", 
                answer: "While Kerala is our primary specialty, we have extensive experience planning weddings across India (Goa, Udaipur, Jaipur) and international destination celebrations. Our planning methodology is designed to travel." 
            },
            { 
                question: "What is the typical investment for a Parinay wedding?", 
                answer: "Because every wedding we design is bespoke, there is no one-size-fits-all cost. During our initial consultation, we'll discuss your vision and guest count to help define a realistic budget for a high-end, luxury experience." 
            }
        ]
    },
    storiesDestination: {
        pageBannerTitle: "Destination Weddings",
        storiesList: [
            { id: 1, title: "Backwater Bliss in Kumarakom", desc: "An elegant three-day celebration on the serene backwaters of Kerala, blending contemporary luxury with local charm.", badge: "Destination", video: "/uploads/upload_1773132860733_81.mp4", date: "February 2025", location: "Kumarakom, Kerala" },
            { id: 2, title: "Clifftop Vows in Varkala", desc: "A breathtaking sunset ceremony on the red cliffs of Varkala, overlooking the endless expanse of the Arabian Sea.", badge: "Destination", video: "/uploads/upload_1773132906231_395.mp4", date: "December 2024", location: "Varkala, Kerala" },
            { id: 3, title: "Heritage Grandeur in Hyderabad", desc: "A royal celebration at a palatial heritage venue blending Mughal grandeur with contemporary elegance.", badge: "Destination", video: "/uploads/upload_1773132909114_925.mp4", date: "November 2024", location: "Hyderabad" }
        ],
        heroImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1920&q=80",
        heroTitle: "A Visual Narrative",
        heroSubtitle: "A curation of extraordinary celebrations, capturing the unique essence and emotion of every couple we serve."
    },
    storiesThemed: {
        pageBannerTitle: "Themed Weddings",
        storiesList: [
            { id: 3, title: "The Secret Garden Soirée", desc: "A whimsical floral-themed wedding that transformed a colonial estate into an ethereal garden oasis.", badge: "Themed", video: "/uploads/upload_1773132860733_81.mp4", date: "October 2024", location: "Kochi, Kerala" },
            { id: 4, title: "Sunset By The Shore", desc: "A dreamy beach-themed celebration where golden hues and ocean breezes created the most romantic backdrop.", badge: "Themed", video: "/uploads/upload_1773132906231_395.mp4", date: "January 2025", location: "Goa" }
        ],
        heroImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1920&q=80",
        heroTitle: "Signature Themed Concepts",
        heroSubtitle: "Transforming spaces into immersive worlds that tell your unique love story through design."
    },
    storiesTraditional: {
        pageBannerTitle: "Traditional Weddings",
        storiesList: [
            { id: 2, title: "Heritage Grandeur at Mysore", desc: "A royal celebration at a heritage palace, honouring centuries-old traditions with opulent decor and meticulous planning.", badge: "Traditional", video: "/uploads/upload_1773132909114_925.mp4", date: "March 2025", location: "Mysore, Karnataka" },
            { id: 5, title: "Sacred Rituals in Madurai", desc: "A traditional Tamil wedding steeped in centuries of ritual, vibrant colour and deep cultural meaning.", badge: "Traditional", video: "/uploads/upload_1773132860733_81.mp4", date: "September 2024", location: "Madurai, Tamil Nadu" }
        ],
        heroImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=80",
        heroTitle: "Honouring Our Heritage",
        heroSubtitle: "Timeless traditions celebrated with contemporary elegance and profound respect for cultural roots."
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
                content: "When it comes to destination weddings in Kerala, the backwaters of Kumarakom and Alleppey offer a setting that is nothing short of magical. Imagine exchanging vows on a floating deck as the sun dips below the horizon, with the gentle sound of water as your background score. The backwaters are not just a location; they are a sensory experience—the smell of fresh rain on tropical leaves, the distant chime of temple bells, and the slow ripple of water against wood.\n\n### Why Backwaters for Your Wedding?\n\nThe backwaters provide a serene and intimate atmosphere that you simply cannot find in a beach or city wedding. Many luxury resorts like the Kumarakom Lake Resort, The Zuri, or Taj Kumarakom offer expansive waterfront lawns that can be transformed into spectacular wedding venues. The natural greenery combined with the slow-moving houseboats in the distance creates a living postcard for your celebration. It's a place where time seems to slow down, allowing you and your guests to truly immerse yourselves in the celebration without the noise of the outside world. This slower pace of life, often referred to as 'Kerala Time', is the ultimate luxury in our fast-paced modern world.\n\n### The Houseboat Experience: A Mobile Celebration\n\nOne of the most unique aspects of a backwater wedding is the potential to use the iconic Kerala houseboats (Kettuvallams). We often recommend using a fleet of luxury houseboats for a pre-wedding 'Sangeet on the Water' or a 'Sunset Cocktail Hour'. Watching the landscape of palm trees and local villages drift by while enjoying artisanal cocktails and local delicacies is an experience your guests will talk about for decades. For the couple, spending your first night as newlyweds on a private, five-star houseboat moored in the middle of the lake is the pinnacle of romantic seclusion.\n\n### Key Considerations for Planning\n\n1. **Seasonality is Everything:** The best time for a backwater wedding is between November and February when the weather is cool and dry. The humidity is manageable, and the skies are a clear, vibrant blue. Avoid the monsoon months (June to August) if you're planning an outdoor lawn ceremony, though the rains have their own romantic charm for smaller, indoor gatherings. If you do choose a monsoon wedding, embrace the 'rain-dance' aesthetic with clear marquees that let you see the raindrops while staying dry.\n2. **Logistics & Accessibility:** While beautiful, backwater venues often require careful guest logistics. Plan for boat transfers to add that extra touch of Kerala charm. We often recommend arranging private shikaras for guest transport to transform a simple transfer into an unforgettable experience. Ensure you have a dedicated 'Logistics Lead' to manage the boat schedules and guest arrivals at the various jetties.\n3. **Ambiance and Decor:** Use the natural beauty of the surroundings. Minimalist decor focusing on local flowers, terracotta lamps, and traditional brass elements often works best. You don't want to compete with the view; you want to frame it. Overhead lighting should be soft and warm—think hanging lanterns and strings of fairy lights reflecting off the water. Consider using floating floral installations in the Resort pools or directly in the backwaters to pull the greenery into the water.\n\n### The Golden Hour & Photography\n\nThere is a specific window of time in the backwaters—roughly from 5:15 PM to 6:30 PM—where the light becomes incredibly soft and golden. This is the ultimate time for your ceremony. We always coordinate schedules meticulously to ensure your exchange of vows happens right at the peak of this lighting, guaranteeing cinematic wedding photos that look like they've been pulled from a high-end magazine. For your couple portraits, we recommend taking a private houseboat cruise during this hour to capture the reflections on the Vembanad Lake. The way the light hits the palm silhouettes is truly once-in-a-lifetime.\n\n### Expert Tip: The Culinary Journey\n\nA backwater wedding isn't complete without a curated Kerala menu. Think beyond the standard buffet—consider a 'Live Appam and Stew' counter or a traditional 'Sadhya' served on banana leaves for lunch, followed by a high-end seafood grill for the dinner reception. The fusion of traditional spices with modern presentation is what makes a Parinay wedding truly distinctive. We also love incorporating local flavors into the bar program—think Tamarind Margaritas or Cardamom-infused Gin & Tonics.\n\n### Cultural Infusions and Local Artistry\n\nTo truly honor the location, consider incorporating local performance arts. A Kathakali performance during the reception or a Chenda Melam (traditional percussion) welcome for the groom's procession adds a layer of depth and authenticity that guests find captivating. It's about telling a story that is as much about the place as it is about your union.\n\n### Conclusion\n\nA backwater wedding is about slow luxury. It's about letting the environment set a pace that allows you and your guests to truly connect. If you're looking for an experience that is deeply rooted in nature but elevated by high-end hospitality, Kumarakom is your destination. At Parinay, we specialize in navigating the unique logistics of this terrain to ensure your only job is to be present in the moment."
            },
            { 
                id: 102, 
                title: "Floral Trends for 2026: Sustainable Elegance", 
                date: "January 28, 2026", 
                excerpt: "From locally sourced blooms to artisanal floral installations, explore the future of wedding decor.", 
                image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
                content: "Sustainability is no longer just a buzzword; it's a priority for modern couples who want their celebration to reflect their values. In 2026, we are seeing a significant shift towards floral designs that are both breathtaking and eco-conscious. It's about 'thoughtful beauty'—decor that looks like a masterpiece but treats the environment with respect. We believe that true luxury lies in the story behind the design and the conscious choices made at every step.\n\n### Native Blooms over Exotic Imports\n\nRather than flying in exotic flowers from halfway across the world, couples are increasingly choosing native blooms like Marigolds, Jasmine, and local Lotus varieties. Not only does this reduce the carbon footprint significantly, but it also creates a sense of place that is deeply authentic. There is a raw, organic elegance to using what grows in the local soil. We've seen incredible results by pairing traditional white tuberoses with architecturally interesting local palm leaves and ferns. Using seasonal, local blooms also means the flowers are at their peak freshness and fragrance, lasting much longer through the humid ceremony hours than delicate imports.\n\n### The 'Living Decor' Movement\n\nOne of our favorite trends is the use of potted plants, herbs, and small trees as part of the aisle or table decor. Instead of cut flowers that fade within hours, these living elements can be replanted after the wedding. We've seen couples gift these potted saplings as wedding favors, giving their guests a living memento of the day. This approach adds a lush, forest-like depth to any ballroom or lawn setting that cut flowers simply cannot replicate. In 2026, we're seeing larger-scale living installations, such as full-grown potted trees used to create 'interior avenues' in large venues, bringing the outside in with grand scale.\n\n### Artisanal Installations and Repurposing\n\nModular floral structures that can be moved from the ceremony to the reception are gaining popularity. For example, a floral arch used as the backdrop for your vows can be split into two pieces and used as the backdrop for the bar or the stage later in the evening. This approach ensures that every bloom is enjoyed to its fullest throughout the celebration, rather than being discarded after a single 30-minute ceremony. It's about being smart with your florals without compromising on the grand aesthetic. We often design 'moveable meadows'—trays of flowers that look like they are growing from the floor, which our team can discreetly relocate during the transition from ceremony to dinner.\n\n### Sustainable Mechanics: The Hidden Change\n\nThe hidden parts of floral design is changing too. We're moving away from non-biodegradable floral foam towards traditional techniques using chicken wire, reusable vials, and kenzans. This 'foam-free' movement is the backbone of high-end sustainable floral design in 2026. It allows for more natural, 'growing' shapes that feel wild and fluid rather than stiff and structured. It also means the flowers can actually 'breathe' and drink water properly, which is crucial for outdoor destination weddings in tropical climates.\n\n### The 2026 Color Palette: Earthy Sophistication\n\nMove over classic white and green. For 2026, we are leaning into 'Earthy Sophistication'. Think deep terracotta, sun-bleached ochre, and muted sage, accented by pops of vibrant, jewel-toned local flowers. It's a palette that feels grounded and high-end. We're also seeing a rise in monochromatic 'texture' designs—where the entire setup is one color (like all-white) but uses ten different types of flowers and foliage to create visual interest through shape and shadow.\n\n### Scent Design: The Invisible Decor\n\nLuxury is multi-sensory. In 2026, we are focusing on 'Scent Design'. This involves choosing flowers not just for their look, but for their fragrance profile. Imagine walking down an aisle where the scent of fresh Jasmine is perfectly balanced with the earthiness of Vetiver. We work with couples to create a 'scent story' for their wedding, ensuring the aroma of the day becomes a powerful anchor for their memories in the years to come.\n\n### Final Thoughts for 2026\n\nWhen planning your wedding decor, ask your florist about the 'End-of-Life' plan for your flowers. Can they be composted? Can they be donated to local hospitals or homes? A wedding that leaves a beautiful memory without leaving a heavy footprint is the ultimate luxury. True style in 2026 is measured by the beauty we leave behind, not just the beauty we create for a few hours."
            },
            { 
                id: 103, 
                title: "The Art of Managing a Luxury Wedding Budget", 
                date: "January 15, 2026", 
                excerpt: "Expert advice on where to invest and how to prioritise for maximum visual impact and guest experience.", 
                image: "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=800&q=80",
                content: "Planning a luxury wedding isn't just about spending; it's about spending intentionally. At Parinay Weddings, we believe in prioritizing 'impact moments'—those specific elements that guests will remember for years to come. Managing a high-end budget is an art form that balances grand vision with fiscal intelligence. It's not about how much you spend, but how and where you spend it to create a feeling of effortless opulence and thoughtful planning.\n\n### Defining Your 'Impact Moments'\n\nBefore allocating a single rupee, we ask our couples to identify their top three priorities. For some, it's the culinary experience and fine wines; for others, it's the large-scale floral design and custom lighting. Once these 'non-negotiables' are defined, we can ensure that the majority of the budget is funneled toward these areas to create a truly world-class standard. The secondary details can then be managed in a way that supports, rather than distracts from, these main features. A common mistake is spreading a budget too thin across 50 small things; we advocate for going deep on 5 big things.\n\n### Where to Invest for Maximum Return (The ROI of Joy)\n\n1. **Guest Hospitality & Personalization:** A true luxury wedding is defined by how your guests feel. Seamless logistics (getting people from A to B without them having to think), personalized welcome hampers that tell a story, and a high staff-to-guest ratio go further than any expensive flower could. When a guest never has to look for a waiter or worry about a car, they are in the 'luxury zone'.\n2. **Culinary Mastery & Theatrical Dining:** The food and beverage experience is often the most talked-about part of any wedding. Invest in a curated, high-end menu that tell a story of your journey together. Move away from standard banqueting—think chef-led tasting tables, interactive oyster bars, or midnight 'street-food' experiences. Quality ingredients and unique presentation are always worth the premium.\n3. **Atmospheric Production & Lighting Design:** Quality lighting is the most underrated part of a wedding budget. It can transform a standard venue into a cinematic masterpiece. Never underestimate the power of a professional lighting designer to highlight your decor and set the mood for every moment, from the ceremony to the final dance floor track. Lighting is essentially 'cheap' architecture—it builds the room for you.\n\n### The Hidden Reserve and 'Flex' Planning\n\nWe always advocate for a 10% contingency fund—what we call the 'Magic Fund'. In the world of high-end events, spontaneous ideas often arise in the final month—like deciding to add a gospel choir for the ceremony or upgrading to silk linens. Having this cushion allows for stress-free decision-making and ensures you don't have to say 'no' to a dream detail because of budget constraints. It's the buffer that keeps the planning process joyful rather than stressful.\n\n### Technology in Modern Planning\n\nIn 2026, we use technology to maximize budget efficiency. High-end 3D renders of your decor allow you to see exactly where your money is going before a single flower is ordered. Digital guest management systems ensure that your hospitality budget is spent exactly where it's needed with no wastage. We leverage these tools to give our couples total transparency and confidence in their investment.\n\n### Pro Tip: The Vendor Dream Team\n\nInvest in the best photographers, videographers, and planners early. These are the vendors who will ensure your other investments—the decor, the gown, the venue—are captured and managed perfectly. A master photographer can make a $10,000 decor setup look like a $50,000 one through their lens. Think of your planner as the architect of your investment; they are the ones who make sure every dollar works as hard as possible for you.\n\n### Final Checklist for the High-End Couple\n\n*   **Prioritize People:** Spend on the guest experience first.\n*   **Audit for Impact:** If a detail doesn't contribute to one of your 'Impact Moments', reconsider it.\n*   **Trust the Pros:** Once you've hired your 'Dream Team', listen to their advice on where to save and where to splurge.\n*   **Stay Present:** No amount of money can buy back the memory of your wedding day. Budget for a team that lets you be a guest at your own wedding.\n\n### Conclusion\n\nLuxury is not about excess; it's about excellence. By Focusing on the quality of every touchpoint rather than simply the quantity of items, you can create a wedding that feels incredibly opulent, thoughtfully designed, and deeply personal. At Parinay, we don't just manage your budget; we curate your investment into a masterpiece of memory."
            }
        ],
        guideLabel: "EXCLUSIVE ACCESS",
        guideTitle: "Download Our Complete Guide",
        guideDesc: "Get access to our 'Kerala Destination Wedding Checklist' and venue comparison guide. A must-have for every couple planning from afar.",
        guideChecklist1: "Top 10 Luxury Venue Insights",
        guideChecklist2: "Seasonal Weather Pattern Guide",
        guideChecklist3: "Comprehensive Budget Allocation Template",
        guideImage: "/uploads/upload_1774345251045_4601.jpg",
        guideYear: "The 2026",
        guidePlannerLabel: "Planner",
        guideFreeText: "Free Download",
        guideRequestBtnText: "Request Copy"
    },
    header: {
        logoText: "PARINAY",
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
        tagline: "Bespoke destination wedding planners based in Kerala, India. Planning meaningful celebrations for over 8 years.",
        instagramUrl: "https://instagram.com/parinayweddings",
        facebookUrl: "https://facebook.com/parinayweddings",
        pinterestUrl: "https://pinterest.com/parinayweddings",
        youtubeUrl: "https://youtube.com/@parinayweddings",
        email: "hello@parinayweddings.com",
        phone: "+91 98765 43210",
        address: "Cochin, Kerala, India",
        whatsappNumber: "919876543210",
        ctaTagline: "Let's Start Your Journey",
        ctaBtnText: "Book a Consultation",
        ctaBtnUrl: "/contact",
        copyrightName: "Parinay Weddings"
    }
};

export const API = 'http://localhost:5000';

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
                    if (!Array.isArray(codeArr) || !Array.isArray(dbArr)) return dbArr ?? codeArr;

                    // Build a map of DB items by ID for fast lookup
                    const dbById = {};
                    dbArr.forEach(item => {
                        if (item.id != null) dbById[item.id] = item;
                    });

                    // Merge each code item with its DB counterpart (DB values win for existing fields)
                    const mergedItems = codeArr.map(codeItem => {
                        const dbItem = dbById[codeItem.id];
                        if (!dbItem) return codeItem; // New item in code — add it
                        // Merge: code provides missing fields, DB preserves user-edited values
                        return { ...codeItem, ...dbItem };
                    });

                    // Also keep any items the user created in admin that aren't in initialContent
                    const codeIds = new Set(codeArr.map(i => i.id));
                    // Skip stale IDs from migration (1, 2, 3)
                    dbArr.forEach(dbItem => {
                        if (dbItem.id != null && !codeIds.has(dbItem.id) && ![1, 2, 3].includes(dbItem.id)) {
                            mergedItems.push(dbItem);
                        }
                    });

                    return mergedItems;
                };

                const merged = Object.keys(initialContent).reduce((acc, section) => {
                    const codeSection = initialContent[section];
                    const dbSection = saved[section] || {};
                    const mergedSection = { ...codeSection, ...dbSection };
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

    const updateSection = async (section, newData) => {
        const updated = { ...content, [section]: { ...content[section], ...newData } };
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
                console.error('[updateSection] Connection failed:', err);
                return { success: false, error: 'Could not connect to the backend server. Is it running?' };
            }
        }
        return { success: true };
    };

    return (
        <ContentContext.Provider value={{ content, updateSection, isLoaded }}>
            {children}
        </ContentContext.Provider>
    );
};
