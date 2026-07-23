'use strict';

/* -- PAGE ENTRANCE -- */
(function initPageEntrance() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
        document.body.classList.add('site-ready');
        return;
    }

    requestAnimationFrame(() => {
        document.body.classList.add('site-ready');
    });
})();

/* -- TOUCH DEVICE CHECK -- */
(function initTouchSupport() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    }
})();

/* -- SIDEBAR TOGGLE -- */
(function initSidebarToggle() {
    const hamburger = document.querySelector('.hamburger-btn');
    const overlay = document.querySelector('.sidebar-overlay');
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;

    if (!hamburger || !overlay || !sidebar) return;

    function openSidebar() {
        body.classList.add('sidebar-open');
        body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        body.classList.remove('sidebar-open');
        body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        if (body.classList.contains('sidebar-open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    overlay.addEventListener('click', closeSidebar);

    sidebar.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && body.classList.contains('sidebar-open')) {
            closeSidebar();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && body.classList.contains('sidebar-open')) {
            closeSidebar();
        }
    });
})();

/* -- INTERACTIVE SURFACE MOTION -- */
// Removed: tilt transforms were causing lag on low-end devices

/* -- LOADER -- */
(function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initFadeUp, { once: true });
        } else {
            initFadeUp();
        }
        return;
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
            initFadeUp();
        }, 800);
    });
})();

/* -- FADE UP ANIMATIONS -- */
function initFadeUp() {
    const elements = document.querySelectorAll('.fade-up');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* -- PARALLAX EFFECT -- */
(function initParallax() {
    // Removed: was causing continuous rAF loop and lag
})();

/* -- WORKS MEDIA CLICK TO OPEN -- */
(function initWorksMediaOpen() {
    const mediaContainer = document.querySelector('[data-works-media-container]');
    if (!mediaContainer) return;

    mediaContainer.addEventListener('click', () => {
        const activeMedia = mediaContainer.querySelector('.work-media.active');
        if (!activeMedia) return;
        const src = activeMedia.dataset.worksSrc || activeMedia.src;
        if (src) window.open(src, '_blank', 'noopener,noreferrer');
    });
})();

/* -- WORKS NEXT/PREV PROJECT NAVIGATION -- */
(function initWorksNav() {
    const stage = document.querySelector('[data-works-stage]');
    if (!stage) return;

    const mediaContainer = stage.querySelector('[data-works-media-container]');
    const allMedia = stage.querySelectorAll('[data-works-media]');
    const allInfo = stage.querySelectorAll('[data-works-info]');
    if (!mediaContainer || !allMedia.length || !allInfo.length) return;

    const total = allMedia.length;
    let currentIndex = 0;
    let animating = false;

    function goTo(index) {
        if (index < 0 || index >= total || index === currentIndex || animating) return;
        animating = true;

        allMedia[currentIndex].classList.remove('active');
        allInfo[currentIndex].classList.remove('active');

        currentIndex = index;

        allMedia[currentIndex].classList.add('active');
        allInfo[currentIndex].classList.add('active');

        setTimeout(() => { animating = false; }, 420);
    }

    document.addEventListener('click', e => {
        const nextBtn = e.target.closest('[data-works-next]');
        if (nextBtn) goTo((currentIndex + 1) % total);

        const prevBtn = e.target.closest('[data-works-prev]');
        if (prevBtn) goTo((currentIndex - 1 + total) % total);
    });
})();

/* -- THEME TOGGLE -- */
(function initThemeToggle() {
    const tracks = document.querySelectorAll('.toggle-track');
    if (!tracks.length) return;

    const themes = ['dark', 'light'];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsViewTransition = !reducedMotion && typeof document.startViewTransition === 'function';
    const savedStep = Number.parseInt(localStorage.getItem('themeStep') || '0', 10);

    let step = Number.isFinite(savedStep) ? Math.abs(savedStep) % themes.length : 0;
    let animating = false;

    function setTrackState(activeStep) {
        tracks.forEach(track => {
            track.style.setProperty('--toggle-x', activeStep === 1 ? '76%' : '24%');
        });
    }

    function applyTheme(nextStep = step) {
        const safeStep = ((nextStep % themes.length) + themes.length) % themes.length;
        const nextTheme = themes[safeStep];

        document.documentElement.setAttribute('data-theme', nextTheme === 'dark' ? '' : nextTheme);
        tracks.forEach(track => {
            track.dataset.step = safeStep;
            track.setAttribute('aria-pressed', String(safeStep === 1));
        });
        setTrackState(safeStep);
    }

    async function toggleTheme(event) {
        if (animating) return;
        animating = true;

        const track = event && event.currentTarget ? event.currentTarget : tracks[0];
        const rect = track.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;
        const nextStep = (step + 1) % themes.length;

        try {
            if (supportsViewTransition) {
                document.body.classList.add('theme-animating');
                tracks.forEach(t => t.classList.add('is-animating'));

                const transition = document.startViewTransition(() => {
                    applyTheme(nextStep);
                });

                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const endRadius = Math.hypot(
                    Math.max(originX, viewportWidth - originX),
                    Math.max(originY, viewportHeight - originY)
                );

                await transition.ready;

                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${originX}px ${originY}px)`,
                            `circle(${endRadius}px at ${originX}px ${originY}px)`
                        ]
                    },
                    {
                        duration: 380,
                        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                        pseudoElement: '::view-transition-new(root)'
                    }
                );

                await transition.finished;
            } else {
                applyTheme(nextStep);
            }

            step = nextStep;
            localStorage.setItem('themeStep', String(step));
        } finally {
            document.body.classList.remove('theme-animating');
            tracks.forEach(t => t.classList.remove('is-animating'));
            animating = false;
        }
    }

    tracks.forEach(track => {
        track.addEventListener('click', toggleTheme);
        track.setAttribute('role', 'button');
        track.setAttribute('tabindex', '0');
        track.setAttribute('aria-label', 'Toggle theme');

        track.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleTheme({ currentTarget: track });
            }
        });
    });

    applyTheme(step);
})();

/* -- ACTIVE NAV -- */
(function initActiveNav() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (current.includes(href.replace('.html', '')) || (current === 'index.html' && href === 'index.html'))) {
            link.classList.add('active');
        }
    });
})();

/* -- PHONE CONTACT LINK -- */
(function initPhoneContactLink() {
    const phoneLinks = document.querySelectorAll('.phone-contact-link');
    if (!phoneLinks.length) return;

    const fallbackPhone = '+2349032736331';
    const phoneAgentPattern = /Android.+Mobile|iPhone|iPod|Windows Phone|BlackBerry|Opera Mini|IEMobile/i;
    const isPhoneDevice = phoneAgentPattern.test(navigator.userAgent || '');

    async function copyPhoneNumber(number) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(number);
            return true;
        }

        const input = document.createElement('input');
        input.value = number;
        input.setAttribute('readonly', '');
        input.style.position = 'absolute';
        input.style.left = '-9999px';
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length);

        let copied = false;
        try {
            copied = document.execCommand('copy');
        } catch (_) {
            copied = false;
        }

        input.remove();
        return copied;
    }

    function flashTitle(link, text) {
        const originalTitle = link.getAttribute('title') || 'Phone';
        link.setAttribute('title', text);
        window.setTimeout(() => link.setAttribute('title', originalTitle), 1400);
    }

    phoneLinks.forEach(link => {
        const phoneNumber = (link.dataset.phone || '').trim() || fallbackPhone;
        link.setAttribute('href', `tel:${phoneNumber}`);

        link.addEventListener('click', async event => {
            if (isPhoneDevice) return;
            event.preventDefault();

            const copied = await copyPhoneNumber(phoneNumber);
            flashTitle(link, copied ? 'Copied!' : 'Copy failed');
        });
    });
})();

/* -- EMAIL CONTACT LINK -- */
(function initEmailContactLink() {
    const emailLinks = document.querySelectorAll('.email-contact-link');
    if (!emailLinks.length) return;

    const fallbackEmail = 'theofficialkamsiokoro@gmail.com';
    const phoneAgentPattern = /Android.+Mobile|iPhone|iPod|Windows Phone|BlackBerry|Opera Mini|IEMobile/i;
    const isPhoneDevice = phoneAgentPattern.test(navigator.userAgent || '');

    async function copyEmailAddress(email) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(email);
            return true;
        }

        const input = document.createElement('input');
        input.value = email;
        input.setAttribute('readonly', '');
        input.style.position = 'absolute';
        input.style.left = '-9999px';
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length);

        let copied = false;
        try {
            copied = document.execCommand('copy');
        } catch (_) {
            copied = false;
        }

        input.remove();
        return copied;
    }

    function flashTitle(link, text) {
        const originalTitle = link.getAttribute('title') || 'Email';
        link.setAttribute('title', text);
        window.setTimeout(() => link.setAttribute('title', originalTitle), 1400);
    }

    emailLinks.forEach(link => {
        const emailAddress = (link.dataset.email || '').trim() || fallbackEmail;
        link.setAttribute('href', `mailto:${emailAddress}`);

        link.addEventListener('click', async event => {
            if (isPhoneDevice) return;
            event.preventDefault();

            const copied = await copyEmailAddress(emailAddress);
            flashTitle(link, copied ? 'Copied!' : 'Copy failed');
        });
    });
})();

/* -- CV DOWNLOAD LINK -- */
(function initCvDownloadLink() {
    const cvLinks = document.querySelectorAll('.cv-download-link');
    if (!cvLinks.length) return;

    const fallbackSrc = 'assets/Nedokoro_Kamsiyochi_%E2%80%94_Product_Designer_Portfolio.pdf';
    const fallbackName = 'Kamsi_Okoro_CV.pdf';

    function flashTitle(link, text) {
        const originalTitle = link.getAttribute('title') || 'Download CV';
        link.setAttribute('title', text);
        window.setTimeout(() => link.setAttribute('title', originalTitle), 1400);
    }

    cvLinks.forEach(link => {
        const cvSrc = (link.dataset.cvSrc || '').trim() || fallbackSrc;
        const downloadName = (link.dataset.downloadName || '').trim() || fallbackName;

        link.setAttribute('href', cvSrc);
        link.setAttribute('download', downloadName);

        link.addEventListener('click', () => {
            flashTitle(link, 'Downloading...');
        });
    });
})();

/* -- PLACEHOLDER LINKS -- */
(function initPlaceholderLinks() {
    const placeholderLinks = document.querySelectorAll('.placeholder-link');
    if (!placeholderLinks.length) return;

    placeholderLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const originalTitle = link.getAttribute('title') || 'Coming soon';
            link.setAttribute('title', 'Coming soon');
            window.setTimeout(() => link.setAttribute('title', originalTitle), 1400);
        });
    });
})();

/* -- GALLERY IMAGE OPEN -- */
(function initGalleryImageOpen() {
    const galleryItems = document.querySelectorAll('.gallery-item[data-image-src]');
    if (!galleryItems.length) return;

    galleryItems.forEach(item => {
        const imageSrc = (item.dataset.imageSrc || '').trim();
        if (!imageSrc) return;

        const nameText = item.querySelector('.gallery-name')?.textContent?.trim();
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', nameText ? `Open ${nameText} in a new tab` : 'Open image in a new tab');

        const openImage = () => {
            window.open(imageSrc, '_blank', 'noopener,noreferrer');
        };

        item.addEventListener('click', openImage);
        item.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openImage();
            }
        });
    });
})();

/* -- CERTIFICATE PREVIEW OPEN -- */
(function initCertificatePreviewOpen() {
    const certificateCards = document.querySelectorAll('.cert-card[data-cert-src]');
    if (!certificateCards.length) return;

    certificateCards.forEach(card => {
        const preview = card.querySelector('.cert-card-media');
        const certSrc = (card.dataset.certSrc || '').trim();
        if (!preview || !certSrc) return;

        const titleText = card.querySelector('.cert-card-title')?.textContent?.trim();
        preview.setAttribute('role', 'button');
        preview.setAttribute('tabindex', '0');
        preview.setAttribute('aria-label', titleText ? `Open ${titleText} in a new tab` : 'Open certificate in a new tab');

        const openCertificate = () => {
            window.open(certSrc, '_blank', 'noopener,noreferrer');
        };

        preview.addEventListener('click', openCertificate);
        preview.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openCertificate();
            }
        });
    });
})();

/* -- SCROLL REVEAL (backup) -- */
(function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    els.forEach(el => obs.observe(el));
})();

function attachMedia({ container, type = 'image', src, alt = '', poster = '', objectPosition = 'center' }) {
    const el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) return;

    el.innerHTML = '';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.overflow = 'hidden';

    if (type === 'video') {
        const video = document.createElement('video');
        video.src = src;
        video.poster = poster;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.style.cssText = `width:100%;height:100%;object-fit:cover;object-position:${objectPosition};border-radius:12px;`;
        el.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.loading = 'lazy';
        img.style.cssText = `width:100%;height:100%;object-fit:cover;object-position:${objectPosition};border-radius:12px;`;
        el.appendChild(img);
    }
}
