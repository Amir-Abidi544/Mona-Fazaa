document.addEventListener('DOMContentLoaded', () => {

    // ── Translation Logic ──
    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        localStorage.setItem('preferredLanguage', lang);

        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else if (el.hasAttribute('placeholder')) {
                    el.setAttribute('placeholder', translations[lang][key]);
                } else {
                    el.innerHTML = translations[lang][key];
                }
            }
        });

        // Update active state of language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('text-gold', 'font-bold');
                btn.classList.remove('text-muted');
            } else {
                btn.classList.remove('text-gold', 'font-bold');
                btn.classList.add('text-muted');
            }
        });

        // Update document title and description
        if (translations[lang].title) {
            document.title = translations[lang].title;
        }
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && translations[lang].description) {
            metaDesc.setAttribute('content', translations[lang].description);
        }
    };

    // Language switcher initialization
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(savedLang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // ── Header & Mobile Menu ──
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const header = document.getElementById('header');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('hidden');
        });

        document.querySelectorAll('#mobileMenu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // ── Sticky Header + Scroll-to-Top ──
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;

        // Header shrink
        if (header) {
            if (y > 60) {
                header.classList.add('shadow-md', 'bg-white/95');
                header.classList.remove('bg-white/90');
            } else {
                header.classList.remove('shadow-md', 'bg-white/95');
                header.classList.add('bg-white/90');
            }
        }

        // Scroll-to-top
        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('visible', y > 500);
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── Reviews Carousel ──
    const reviews = document.querySelectorAll('.review-card');
    const prevReview = document.getElementById('prevReview');
    const nextReview = document.getElementById('nextReview');
    let currentReview = 0;

    function showReview(index) {
        reviews.forEach(r => {
            r.classList.remove('active');
            r.style.display = 'none';
        });
        reviews[index].style.display = 'block';
        void reviews[index].offsetWidth; // Force reflow for animation
        reviews[index].classList.add('active');
    }

    if (nextReview && reviews.length > 0) {
        nextReview.addEventListener('click', () => {
            currentReview = (currentReview + 1) % reviews.length;
            showReview(currentReview);
        });
    }

    if (prevReview && reviews.length > 0) {
        prevReview.addEventListener('click', () => {
            currentReview = (currentReview - 1 + reviews.length) % reviews.length;
            showReview(currentReview);
        });
    }

    // ── Results Carousel ──
    const carousel = document.getElementById('resultsCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (carousel && prevBtn && nextBtn) {
        const scrollAmount = 340;
        nextBtn.addEventListener('click', () => carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
        prevBtn.addEventListener('click', () => carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
    }

    // ── Scroll Reveal Animation ──
    const revealElements = document.querySelectorAll('.scroll-reveal');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }
});
