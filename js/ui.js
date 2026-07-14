// Intersection Observer (Scroll Reveal)
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
});
revealElements.forEach(el => revealObserver.observe(el));

// Header, floating CTA
const navbar = document.getElementById('navbar');
const navbarCta = document.getElementById('navbar-cta');
const floatingCta = document.getElementById('floating-cta');
const heroSection = document.querySelector('.hero-section');
const mobileCtaQuery = window.matchMedia('(max-width: 767px)');

function syncMobileCtaVisibility(showFloating) {
    if (!floatingCta) return;

    const isMobile = mobileCtaQuery.matches;
    floatingCta.classList.toggle('floating-cta--visible', isMobile && showFloating);
    floatingCta.setAttribute('aria-hidden', isMobile && showFloating ? 'false' : 'true');

    if (navbarCta) {
        navbarCta.classList.toggle('navbar-cta--suppressed', isMobile && showFloating);
    }
}

window.addEventListener('scroll', () => {
    if (!heroSection) return;
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;

    if (scrollY > 50) {
        navbar.classList.add('py-3', 'is-scrolled');
        navbar.classList.remove('py-5');
    } else {
        navbar.classList.add('py-5');
        navbar.classList.remove('py-3', 'is-scrolled');
    }

    syncMobileCtaVisibility(scrollY > heroHeight - 150);
});

mobileCtaQuery.addEventListener('change', () => {
    syncMobileCtaVisibility(window.scrollY > (heroSection?.offsetHeight || 0) - 150);
});

// Active nav link on scroll
const navLinks = document.querySelectorAll('[data-nav]');
const sectionIds = ['eventos', 'diferenciais', 'midia', 'depoimentos', 'duvidas', 'reservar'];
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.nav === id);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

sectionIds.forEach(id => {
    const section = document.getElementById(id);
    if (section) navObserver.observe(section);
});

// Mobile menu
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');

function toggleMobileMenu(open) {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle('open', open);
    mobileMenuBackdrop?.classList.toggle('open', open);
    document.body.classList.toggle('mobile-nav-open', open);
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu(true));
}

if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', () => toggleMobileMenu(false));
}

if (mobileMenuBackdrop) {
    mobileMenuBackdrop.addEventListener('click', () => toggleMobileMenu(false));
}

document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
});

// Ticker pause (legacy — grid estático em depoimentos)
const tickerPause = document.getElementById('ticker-pause');
const tickerWrapper = document.getElementById('ticker-wrapper');
if (tickerPause && tickerWrapper) {
    tickerPause.addEventListener('click', () => {
        const paused = tickerWrapper.classList.toggle('paused');
        tickerPause.textContent = paused ? 'Retomar' : 'Pausar';
        tickerPause.setAttribute('aria-label', paused ? 'Retomar depoimentos' : 'Pausar depoimentos');
    });
}

function scrollGallery(amount) {
    const gallery = document.getElementById('video-gallery');
    gallery.scrollBy({ left: amount, behavior: 'smooth' });
}

const bookingModal = document.getElementById('booking-modal');
const bookingModalContent = document.getElementById('booking-modal-content');
const dateDisplay = document.getElementById('selected-date-display');
const videoModal = document.getElementById('video-modal');
const videoModalContent = document.getElementById('video-modal-content');
const videoEmbedFrame = document.getElementById('video-embed-frame');
const videoFallback = document.getElementById('video-fallback');
const videoTitle = document.getElementById('video-title-display');
const videoExternalLink = document.getElementById('video-external-link');

let lastFocusedElement = null;

function getVideoByKey(key) {
    return window.SITE_CONFIG?.videos?.find(v => v.key === key);
}

function buildEmbedUrl(video) {
    if (video.type === 'youtube') {
        return `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;
    }
    if (video.type === 'instagram') {
        if (video.embedType === 'post') {
            return `https://www.instagram.com/p/${video.id}/embed/`;
        }
        return `https://www.instagram.com/reel/${video.id}/embed/`;
    }
    return video.url;
}

document.querySelectorAll('.video-card').forEach(card => {
    const open = () => openVideoModal(card.dataset.videoKey);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open();
        }
    });
});

function lockBodyScroll(lock) {
    document.body.classList.toggle('mobile-nav-open', lock);
}

function openBookingModal(dateStr) {
    lastFocusedElement = document.activeElement;
    dateDisplay.textContent = dateStr;
    bookingModal.classList.remove('opacity-0', 'pointer-events-none');
    bookingModal.setAttribute('aria-hidden', 'false');
    lockBodyScroll(true);
    setTimeout(() => {
        bookingModalContent.classList.remove('scale-95', 'opacity-0');
        bookingModalContent.classList.add('scale-100', 'opacity-100');
        bookingModal.querySelector('input')?.focus();
    }, 10);
}

function closeBookingModal() {
    bookingModalContent.classList.remove('scale-100', 'opacity-100');
    bookingModalContent.classList.add('scale-95', 'opacity-0');
    bookingModal.setAttribute('aria-hidden', 'true');
    lockBodyScroll(false);
    setTimeout(() => {
        bookingModal.classList.add('opacity-0', 'pointer-events-none');
        lastFocusedElement?.focus();
    }, 300);
}

function openVideoModal(videoKey) {
    const video = getVideoByKey(videoKey);
    if (!video) return;

    lastFocusedElement = document.activeElement;
    videoTitle.textContent = video.title;
    videoExternalLink.href = video.url;
    videoExternalLink.textContent = video.type === 'instagram' ? 'Abrir no Instagram' : 'Abrir no YouTube';

    videoModalContent.classList.toggle('aspect-[9/16]', video.type === 'instagram');
    videoModalContent.classList.toggle('md:aspect-video', video.type === 'youtube');
    videoModalContent.classList.toggle('max-w-lg', video.type === 'instagram');
    videoModalContent.classList.toggle('md:max-w-3xl', video.type === 'youtube');

    videoEmbedFrame.src = buildEmbedUrl(video);
    videoEmbedFrame.classList.remove('hidden');
    videoFallback.classList.add('hidden');

    videoModal.classList.remove('opacity-0', 'pointer-events-none');
    videoModal.setAttribute('aria-hidden', 'false');
    lockBodyScroll(true);
    setTimeout(() => {
        videoModalContent.classList.remove('scale-95', 'opacity-0');
        videoModalContent.classList.add('scale-100', 'opacity-100');
    }, 10);

    videoEmbedFrame.onerror = () => {
        videoEmbedFrame.classList.add('hidden');
        videoFallback.classList.remove('hidden');
    };
}

function closeVideoModal() {
    videoEmbedFrame.src = '';
    videoModalContent.classList.remove('scale-100', 'opacity-100');
    videoModalContent.classList.add('scale-95', 'opacity-0');
    videoModal.setAttribute('aria-hidden', 'true');
    lockBodyScroll(false);
    setTimeout(() => {
        videoModal.classList.add('opacity-0', 'pointer-events-none');
        lastFocusedElement?.focus();
    }, 300);
}

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const dashboard = document.getElementById('admin-dashboard');
    if (dashboard && !dashboard.classList.contains('hidden')) {
        window.exitAdmin?.();
        return;
    }
    if (!bookingModal.classList.contains('opacity-0')) closeBookingModal();
    if (!videoModal.classList.contains('opacity-0')) closeVideoModal();
    if (typeof window.closeAdminLogin === 'function' && !document.getElementById('admin-modal')?.classList.contains('opacity-0')) {
        window.closeAdminLogin();
    }
});

function submitForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    const name = document.getElementById('booking-name').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const eventType = document.getElementById('booking-event').value;
    const date = dateDisplay.textContent.trim();

    const message = [
        'Olá! Gostaria de fazer meu evento inesquecível com a Tati Vanzan!',
        '',
        `📅 Data: ${date}`,
        `👤 Nome: ${name}`,
        `📱 WhatsApp: ${phone}`,
        `🎉 Evento: ${eventType}`,
    ].join('\n');

    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-xl"></i> Abrindo WhatsApp...';
    btn.classList.add('pointer-events-none', 'opacity-90');

    setTimeout(() => {
        window.open(window.getWhatsAppLink(message), '_blank', 'noopener,noreferrer');
        btn.innerHTML = '<i class="fa-solid fa-check-circle text-xl"></i> Enviado!';
        btn.classList.remove('btn-cta-primary');
        btn.classList.add('bg-green-500', 'text-white', 'rounded-full');

        setTimeout(() => {
            closeBookingModal();
            setTimeout(() => {
                e.target.reset();
                btn.innerHTML = originalHTML;
                btn.classList.remove('pointer-events-none', 'opacity-90', 'bg-green-500', 'text-white', 'rounded-full');
                btn.classList.add('btn-cta-primary');
            }, 500);
        }, 800);
    }, 600);
}

window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.submitForm = submitForm;
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
window.scrollGallery = scrollGallery;

function initSnapCarousels() {
    const desktopQuery = window.matchMedia('(min-width: 640px)');

    document.querySelectorAll('[data-snap-dots]').forEach((dotsContainer) => {
        const track = document.getElementById(dotsContainer.dataset.snapDots);
        if (!track) return;

        const slides = [...track.children].filter((node) => (
            node.classList.contains('video-card') || node.classList.contains('testimonial-card')
        ));
        if (slides.length < 2) return;

        const dots = slides.map((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `snap-carousel__dot${index === 0 ? ' snap-carousel__dot--active' : ''}`;
            dot.setAttribute('aria-label', `Ir para item ${index + 1}`);
            dot.addEventListener('click', () => {
                slides[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            });
            dotsContainer.appendChild(dot);
            return dot;
        });

        let scrollTimer;
        const updateActiveDot = () => {
            if (desktopQuery.matches) return;

            const trackRect = track.getBoundingClientRect();
            const center = trackRect.left + trackRect.width / 2;
            let activeIndex = 0;
            let nearest = Infinity;

            slides.forEach((slide, index) => {
                const rect = slide.getBoundingClientRect();
                const distance = Math.abs((rect.left + rect.width / 2) - center);
                if (distance < nearest) {
                    nearest = distance;
                    activeIndex = index;
                }
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('snap-carousel__dot--active', index === activeIndex);
            });
        };

        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateActiveDot, 60);
        }, { passive: true });

        desktopQuery.addEventListener('change', updateActiveDot);
        updateActiveDot();
    });
}

initSnapCarousels();
