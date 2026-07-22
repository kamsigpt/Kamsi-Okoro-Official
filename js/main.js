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
(function initInteractiveSurfaceMotion() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (reducedMotion || coarsePointer) return;

    const surfaces = document.querySelectorAll(
        '.service-item, .featured-item, .cert-item, .gallery-item, .contact-card, .cert-card, .works-visual'
    );
    if (!surfaces.length) return;

    surfaces.forEach(surface => {
        surface.addEventListener('pointermove', event => {
            const rect = surface.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const px = x / rect.width;
            const py = y / rect.height;

            surface.style.setProperty('--mx', `${px * 100}%`);
            surface.style.setProperty('--my', `${py * 100}%`);
            surface.style.setProperty('--tilt-x', `${(0.5 - py) * 4}deg`);
            surface.style.setProperty('--tilt-y', `${(px - 0.5) * 5}deg`);
        });

        surface.addEventListener('pointerleave', () => {
            surface.style.setProperty('--mx', '50%');
            surface.style.setProperty('--my', '50%');
            surface.style.setProperty('--tilt-x', '0deg');
            surface.style.setProperty('--tilt-y', '0deg');
        });
    });
})();

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
    const parallaxElements = document.querySelectorAll('.parallax-image');
    if (!parallaxElements.length) return;

    function updateParallax() {
        const scrollY = window.scrollY;

        parallaxElements.forEach(el => {
            const speed = 0.1;
            const yPos = -(scrollY * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });

        requestAnimationFrame(updateParallax);
    }

    updateParallax();
})();

/* -- WORKS SHOWCASE -- */
(function initWorksShowcase() {
    const showcase = document.querySelector('.works-showcase');
    if (!showcase) return;

    const currentEl = showcase.querySelector('[data-works-current]');
    const totalEl = showcase.querySelector('[data-works-total]');
    const titleEl = showcase.querySelector('[data-works-title]');
    const descEl = showcase.querySelector('[data-works-description]');
    const worksVisual = showcase.querySelector('.works-visual');
    const previewCard = showcase.querySelector('[data-works-preview-card]');
    const viewLink = showcase.querySelector('[data-works-link]');
    const prevBtn = showcase.querySelector('.works-prev');
    const nextBtn = showcase.querySelector('.works-next');
    if (!currentEl || !totalEl || !titleEl || !descEl || !worksVisual || !viewLink || !previewCard) return;

    const projects = [
        {
            title: 'FORGE FLOW',
            description: 'I developed Forge Flow as a manufacturing platform with a landing page and dashboard for tracking production, inventory, and operational data. The interface focuses on making complex manufacturing activity easier to monitor, understand, and act on.',
            url: 'https://github.com/kamsigpt/Forge-Flow-.com',
            media: {
                type: 'video',
                src: 'assets/works/forge-flow-upload.mp4',
                bg: 'linear-gradient(160deg, #1f2025, #3a3f48)',
                label: 'Overview',
                forceLandscape: true,
                previewClass: 'works-preview-card-expanded'
            }
        },
        {
            title: 'ECOMMERCE PLATFORM UX FLOW',
            description: 'I designed this ecommerce platform in Figma as a complete user experience flow, from product discovery and browsing to checkout and account interactions. The project focuses on clear navigation, structured user journeys, and a smooth shopping experience.',
            url: 'https://www.figma.com/design/glZcjWyzoQBSU7oetNMR7a/all-UI-UX-designs?node-id=302-5722&t=0bx3ZghYXOrFtaF8-1',
            media: {
                type: 'image',
                src: 'assets/works/ecommerce-platform-flow.png',
                bg: 'linear-gradient(155deg, #d8d8da, #b7bcc6)',
                label: 'UX Flow',
                alt: 'Ecommerce platform user experience flow designed in Figma',
                previewClass: 'works-preview-card-expanded'
            }
        },
        {
            title: 'EXCELLIUM WEBSITE REDESIGN',
            description: 'I redesigned the Excellium website from an older visual style into a cleaner, more modern WordPress experience. I designed the pages in Figma, then built custom layouts with HTML blocks to achieve a level of structure and polish beyond standard drag-and-drop WordPress sections.',
            url: 'https://www.excelllium.biz',
            media: {
                type: 'video',
                src: 'assets/works/excellium-website-redesign.mp4',
                bg: 'linear-gradient(160deg, #dbe6f5, #c7d7ef)',
                label: 'Homepage Walkthrough',
                forceLandscape: true,
                previewClass: 'works-preview-card-expanded'
            }
        },
        {
            title: 'SMARTRAQ : A SMARTWATCH / FITNESS SOLUTION',
            description: 'I designed Smartraq as a smartwatch and fitness app concept built around universal device connectivity. The idea is to let users connect watches from different manufacturers, customize their devices, and track health, activity, and fitness progress from one clean mobile interface.',
            url: 'https://www.figma.com/design/glZcjWyzoQBSU7oetNMR7a/all-UI-UX-designs?node-id=371-138&t=0bx3ZghYXOrFtaF8-1',
            media: {
                type: 'image',
                src: 'assets/works/smartraq-watch-fitness-solution.png',
                bg: 'linear-gradient(160deg, #eef4ff, #dfeafb)',
                label: 'App Concept',
                alt: 'Smartraq smartwatch and fitness app concept mockup',
                previewClass: 'works-preview-card-poster'
            }
        },
        {
            title: 'BRAND DESIGN FOR HYLE STUDIOS',
            description: 'I created a brand identity for Hyle Studios, an app and game studio, built around a clean geometric logo, soft green palette, and flexible visual system. The work explores how the brand can extend across app screens, web layouts, business materials, and studio communication.',
            url: 'https://www.figma.com/design/glZcjWyzoQBSU7oetNMR7a/all-UI-UX-designs?node-id=315-6262&t=0bx3ZghYXOrFtaF8-1',
            media: {
                type: 'image',
                src: 'assets/works/brand-design-hyle-studios.png',
                bg: 'linear-gradient(160deg, #eef7f2, #dceee6)',
                label: 'Brand Identity',
                alt: 'Brand design presentation for Hyle Studios',
                previewClass: 'works-preview-card-expanded'
            }
        },
        {
            title: 'ROVE FINTECH APP UX',
            description: 'I designed Rove as a complete fintech app experience covering onboarding, wallet funding, transfers, bill payments, cards, savings, loans, rewards, profile settings, and support. The interface balances a familiar banking structure with a cleaner, more distinctive visual style.',
            url: 'https://www.figma.com/design/glZcjWyzoQBSU7oetNMR7a/all-UI-UX-designs?node-id=400-90&t=wcSAYynF3GRip7c0-1',
            media: {
                type: 'image',
                src: 'assets/works/rove-full-ux.png',
                bg: 'linear-gradient(160deg, #fff4f4, #f6e8e8)',
                label: 'Full UX Flow',
                alt: 'Rove fintech mobile app full user experience screen flow',
                previewClass: 'works-preview-card-poster'
            }
        }
    ];

    let index = 0;
    let activePreviewUrl = '';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function twoDigit(value) {
        return String(value).padStart(2, '0');
    }

    function updateMainAspect(targetEl, width, height, forceLandscape = false) {
        let safeWidth = Number(width);
        let safeHeight = Number(height);
        if (!targetEl || !Number.isFinite(safeWidth) || !Number.isFinite(safeHeight) || safeWidth <= 0 || safeHeight <= 0) return;

        if (forceLandscape && safeHeight > safeWidth) {
            [safeWidth, safeHeight] = [safeHeight, safeWidth];
        }

        targetEl.style.setProperty('--works-media-aspect', `${safeWidth} / ${safeHeight}`);
    }

    function createMediaNode(config, tileEl) {
        if (!config || !tileEl || !config.src || (config.type !== 'video' && config.type !== 'image')) return;

        tileEl.classList.remove('has-media', 'has-video');
        tileEl.style.setProperty('--works-media-aspect', '16 / 9');
        tileEl.style.background = config.bg || 'linear-gradient(145deg, #404040, #2a2a2a)';

        const mediaNode = document.createElement(config.type === 'video' ? 'video' : 'img');
        mediaNode.className = 'works-preview-media';
        mediaNode.src = config.src;

        if (config.type === 'video') {
            mediaNode.autoplay = true;
            mediaNode.loop = true;
            mediaNode.muted = true;
            mediaNode.playsInline = true;
            mediaNode.preload = 'metadata';
            mediaNode.classList.add('is-video');

            const syncVideoAspect = () => {
                updateMainAspect(tileEl, mediaNode.videoWidth, mediaNode.videoHeight, config.forceLandscape);
            };
            if (mediaNode.readyState >= 1) syncVideoAspect();
            mediaNode.addEventListener('loadedmetadata', syncVideoAspect, { once: true });
        } else {
            mediaNode.alt = config.alt || config.label || 'Project preview image';
            mediaNode.loading = 'lazy';

            const syncImageAspect = () => {
                updateMainAspect(tileEl, mediaNode.naturalWidth, mediaNode.naturalHeight, config.forceLandscape);
            };
            if (mediaNode.complete) syncImageAspect();
            mediaNode.addEventListener('load', syncImageAspect, { once: true });
        }

        tileEl.prepend(mediaNode);
        tileEl.classList.add('has-media');
        if (config.type === 'video') tileEl.classList.add('has-video');
    }

    function renderPreview(config) {
        if (!config) return;

        if (config.layout === 'dual') {
            showcase.classList.remove('has-expanded-preview');
            activePreviewUrl = config.primary?.src || config.secondary?.src || '';
            previewCard.className = 'works-preview-card works-preview-card-dual';
            previewCard.innerHTML = `
                <div class="works-preview-tile works-preview-main" data-works-media="primary">
                  <span class="works-preview-label">${config.primary?.label || 'Preview'}</span>
                </div>
                <div class="works-preview-tile works-preview-secondary" data-works-media="secondary">
                  <span class="works-preview-label">${config.secondary?.label || 'Preview'}</span>
                </div>
            `;

            const primaryEl = previewCard.querySelector('[data-works-media="primary"]');
            const secondaryEl = previewCard.querySelector('[data-works-media="secondary"]');
            if (primaryEl) primaryEl.style.background = config.bg || 'linear-gradient(145deg, #404040, #2a2a2a)';
            if (secondaryEl) secondaryEl.style.background = config.bg || 'linear-gradient(145deg, #404040, #2a2a2a)';
            createMediaNode({ ...config.primary, bg: config.primary?.bg || config.bg }, primaryEl);
            createMediaNode({ ...config.secondary, bg: config.secondary?.bg || config.bg }, secondaryEl);
            return;
        }

        activePreviewUrl = config.src || '';
        showcase.classList.toggle('has-expanded-preview', config.previewClass === 'works-preview-card-expanded');
        previewCard.className = `works-preview-card works-preview-card-single ${config.previewClass || ''}`.trim();
        previewCard.innerHTML = `
            <div class="works-preview-tile works-preview-main" data-works-media="main">
              <span class="works-preview-label">${config.label || 'Overview'}</span>
            </div>
        `;

        const mediaMainEl = previewCard.querySelector('[data-works-media="main"]');
        if (!mediaMainEl) return;
        createMediaNode(config, mediaMainEl);
    }

    function setViewLink(project) {
        viewLink.href = project.url;

        const isExternal = /^https?:\/\//i.test(project.url || '');
        if (isExternal) {
            viewLink.setAttribute('target', '_blank');
            viewLink.setAttribute('rel', 'noopener noreferrer');
            viewLink.setAttribute('aria-label', `View GitHub project for ${project.title}`);
            return;
        }

        viewLink.removeAttribute('target');
        viewLink.removeAttribute('rel');
        viewLink.setAttribute('aria-label', `View project details for ${project.title}`);
    }

    function render(nextIndex, instant = false) {
        const total = projects.length;
        index = (nextIndex + total) % total;
        const project = projects[index];

        currentEl.textContent = twoDigit(index + 1);
        totalEl.textContent = twoDigit(total);

        if (!instant && !prefersReducedMotion) {
            showcase.classList.add('is-changing');
            window.setTimeout(() => showcase.classList.remove('is-changing'), 120);
        }

        titleEl.textContent = project.title;
        descEl.textContent = project.description;
        setViewLink(project);
        renderPreview(project.media);
        worksVisual.setAttribute('aria-label', `Open media preview for ${project.title} in a new tab`);
    }

    function openActivePreview() {
        if (!activePreviewUrl) return;
        window.open(activePreviewUrl, '_blank', 'noopener,noreferrer');
    }

    if (prevBtn) prevBtn.addEventListener('click', () => render(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => render(index + 1));
    worksVisual.addEventListener('click', openActivePreview);
    worksVisual.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openActivePreview();
    });

    document.addEventListener('keydown', event => {
        if (!showcase.isConnected) return;
        if (event.key === 'ArrowLeft') render(index - 1);
        if (event.key === 'ArrowRight') render(index + 1);
    });

    render(0, true);
})();

/* -- THEME TOGGLE -- */
(function initThemeToggle() {
    const tracks = document.querySelectorAll('.toggle-track');
    if (!tracks.length) return;

    const canvas = document.getElementById('ripple-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const themes = ['dark', 'light'];
    const rippleColors = { dark: '#0d0d0d', light: '#ffffff' };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsViewTransition = !reducedMotion && typeof document.startViewTransition === 'function';
    const savedStep = Number.parseInt(localStorage.getItem('themeStep') || '0', 10);

    let step = Number.isFinite(savedStep) ? Math.abs(savedStep) % themes.length : 0;
    let animating = false;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

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

    function updateViewport() {
        viewportWidth = window.innerWidth;
        viewportHeight = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        if (!canvas || !ctx) return;

        canvas.width = Math.floor(viewportWidth * dpr);
        canvas.height = Math.floor(viewportHeight * dpr);
        canvas.style.width = `${viewportWidth}px`;
        canvas.style.height = `${viewportHeight}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function getMaxRadius(originX, originY) {
        return Math.hypot(
            Math.max(originX, viewportWidth - originX),
            Math.max(originY, viewportHeight - originY)
        );
    }

    async function playViewTransition(originX, originY, nextStep) {
        if (!supportsViewTransition) return false;

        const endRadius = getMaxRadius(originX, originY);

        try {
            document.body.classList.add('theme-animating');
            tracks.forEach(track => track.classList.add('is-animating'));
            const transition = document.startViewTransition(() => {
                applyTheme(nextStep);
            });

            await transition.ready;

            const animation = document.documentElement.animate(
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

            await animation.finished;
            await transition.finished;
            return true;
        } catch (error) {
            return false;
        } finally {
            document.body.classList.remove('theme-animating');
            tracks.forEach(track => track.classList.remove('is-animating'));
        }
    }

    function playCanvasRipple(originX, originY, nextStep) {
        if (!canvas || !ctx || reducedMotion) {
            applyTheme(nextStep);
            return Promise.resolve();
        }

        updateViewport();
        canvas.style.opacity = '1';
        document.body.classList.add('theme-animating');
        tracks.forEach(track => track.classList.add('is-animating'));

        const rippleColor = rippleColors[themes[nextStep]];
        const maxRadius = getMaxRadius(originX, originY) * 1.08;
        const ringColor = themes[nextStep] === 'light' ? '0, 0, 0' : '255, 255, 255';
        const duration = 480;
        const switchAt = 0.32;
        const startTime = performance.now();
        let appliedTheme = false;

        return new Promise(resolve => {
            function frame(now) {
                const t = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 4);
                const pulse = 1 - Math.abs((t * 2) - 1);

                if (!appliedTheme && t >= switchAt) {
                    applyTheme(nextStep);
                    appliedTheme = true;
                }

                ctx.clearRect(0, 0, viewportWidth, viewportHeight);
                ctx.beginPath();
                ctx.arc(originX, originY, eased * maxRadius, 0, Math.PI * 2);
                ctx.fillStyle = rippleColor;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(originX, originY, Math.max(0, eased * maxRadius * 0.96), 0, Math.PI * 2);
                ctx.lineWidth = 4 + (pulse * 10);
                ctx.strokeStyle = `rgba(${ringColor}, ${0.18 + (pulse * 0.2)})`;
                ctx.shadowBlur = 24;
                ctx.shadowColor = `rgba(${ringColor}, ${0.22 + (pulse * 0.2)})`;
                ctx.stroke();
                ctx.shadowBlur = 0;

                if (t < 1) {
                    requestAnimationFrame(frame);
                    return;
                }

                if (!appliedTheme) {
                    applyTheme(nextStep);
                }

                ctx.clearRect(0, 0, viewportWidth, viewportHeight);
                canvas.style.opacity = '0';
                document.body.classList.remove('theme-animating');
                tracks.forEach(track => track.classList.remove('is-animating'));
                setTimeout(resolve, 120);
            }

            requestAnimationFrame(frame);
        });
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
            const usedViewTransition = await playViewTransition(originX, originY, nextStep);
            if (!usedViewTransition) {
                await playCanvasRipple(originX, originY, nextStep);
            }

            step = nextStep;
            localStorage.setItem('themeStep', String(step));
        } finally {
            document.body.classList.remove('theme-animating');
            tracks.forEach(toggleTrack => toggleTrack.classList.remove('is-animating'));
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

    updateViewport();
    window.addEventListener('resize', updateViewport);
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

    const fallbackSrc = 'assets/Kamsi_Okoro_CV.png';
    const fallbackName = 'Kamsi_Okoro_CV.png';

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
