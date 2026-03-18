
// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle (simple version)
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('open');
    });
}

// Lead Form Handling
const leadForm = document.getElementById('lead-form');
if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic feedback (in a real app, this would send to an API)
        const submitBtn = leadForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerText;

        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Thank you for contacting Parinay Weddings. Our team will review your requirements and get in touch within 24 hours via WhatsApp and Email.');
            leadForm.reset();
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Scroll revelations (basic)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    // observer.observe(section);
});

// Scroll-triggered pop-ups (simple implementation)
window.addEventListener('scroll', () => {
    if (!localStorage.getItem('popupShown') && window.scrollY > 1500) {
        // Create popup element
        const popup = document.createElement('div');
        popup.className = 'premium-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <span class="close-popup">&times;</span>
                <h3>Plan Your Dream Wedding</h3>
                <p>Get our exclusive destination wedding guide.</p>
                <a href="contact.html" class="btn btn-primary" id="popup-cta">Get the Guide</a>
            </div>
        `;
        document.body.appendChild(popup);
        localStorage.setItem('popupShown', 'true');

        popup.querySelector('.close-popup').onclick = () => popup.remove();
        popup.querySelector('#popup-cta').onclick = () => popup.remove();
    }
});


/* --- Premium Portfolio Auto-Slider Logic --- */
document.addEventListener('DOMContentLoaded', () => {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slider = document.querySelector('.image-slider');

    if (sliderWrapper && slider) {
        let isHovering = false;
        let slideInterval;

        // Clone items for infinite loop illusion (simple append)
        // For true infinite loop without jump, complex cloning is needed.
        // Simple distinct scroll is safer for now.

        // Pause on hover
        sliderWrapper.addEventListener('mouseenter', () => {
            isHovering = true;
            clearInterval(slideInterval);
        });

        sliderWrapper.addEventListener('mouseleave', () => {
            isHovering = false;
            startAutoSlide();
        });

        // Touch interaction pause
        sliderWrapper.addEventListener('touchstart', () => {
            isHovering = true;
            clearInterval(slideInterval);
        }, { passive: true });

        function startAutoSlide() {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                if (!isHovering) {
                    const itemWidth = slider.firstElementChild.offsetWidth + 30; // item width + gap
                    const maxScroll = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;

                    // If near end, scroll back to start smoothly
                    if (sliderWrapper.scrollLeft >= maxScroll - 10) {
                        sliderWrapper.scrollTo({
                            left: 0,
                            behavior: 'smooth'
                        });
                    } else {
                        sliderWrapper.scrollBy({
                            left: itemWidth,
                            behavior: 'smooth'
                        });
                    }
                }
            }, 3000); // 3 seconds per slide
        }

        startAutoSlide();
    }
});


/* --- Hero Video Crossfade Slideshow --- */
document.addEventListener('DOMContentLoaded', () => {
    const heroVids = Array.from(document.querySelectorAll('.hero-vid'));
    if (heroVids.length < 2) return;

    let currentVid = 0;

    function switchToNext() {
        const prev = heroVids[currentVid];
        currentVid = (currentVid + 1) % heroVids.length;
        const next = heroVids[currentVid];

        // Fade out current, fade in next
        prev.classList.remove('active');
        next.classList.add('active');
        next.currentTime = 0;
        next.play();
    }

    // When each video ends, switch to the next
    heroVids.forEach(vid => {
        vid.addEventListener('ended', switchToNext);
    });

    // Start the first video
    heroVids[0].play();
});


/* --- Testimonial Carousel Logic --- */
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('testimonialTrack');
    const slides = track ? track.querySelectorAll('.testimonial-slide') : [];
    const prevBtn = document.getElementById('tcPrev');
    const nextBtn = document.getElementById('tcNext');
    const dots = document.querySelectorAll('.tc-dot');

    if (!track || slides.length === 0) return;

    let current = 0;
    const total = slides.length;
    let autoTimer = null;
    let isPaused = false;

    // Move to slide index
    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    // Auto-play
    function startAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => {
            if (!isPaused) goTo(current + 1);
        }, 5000);
    }

    // Arrow controls
    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

    // Dot controls
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goTo(parseInt(dot.dataset.index, 10));
            startAuto();
        });
    });

    // Pause on hover
    const carousel = document.getElementById('testimonialCarousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => { isPaused = true; });
        carousel.addEventListener('mouseleave', () => { isPaused = false; });
    }

    // Touch / swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        isPaused = true;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
        isPaused = false;
        startAuto();
    }, { passive: true });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Init
    goTo(0);
    startAuto();
});


/* --- Bespoke Services Accordion Tab Switcher --- */
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.bsp-tab');
    const panels = document.querySelectorAll('.bsp-panel');

    if (!tabs.length || !panels.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            // Deactivate all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Deactivate all panels
            panels.forEach(p => p.classList.remove('active'));

            // Activate clicked tab
            tab.classList.add('active');
            // Activate matching panel
            const activePanel = document.querySelector(`.bsp-panel[data-panel="${target}"]`);
            if (activePanel) activePanel.classList.add('active');
        });
    });
});

