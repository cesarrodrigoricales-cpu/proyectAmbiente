/* ═══════════════════════════════════════════════
   PROYECTO AMBIENTAL UAI × CHINCHAYSUYO 2026
   script.js
═══════════════════════════════════════════════ */

// ── CONFIGURACIÓN ───────────────────────────────
// Cambia esta fecha al día real del evento
const TARGET_DATE = new Date('2026-09-01T08:00:00');

// ═══════════════════════════════════════════════
// 1. NAVBAR — scroll shrink
// ═══════════════════════════════════════════════
const navbar = document.getElementById('navbar');

const handleNavScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
};

window.addEventListener('scroll', handleNavScroll, { passive: true });

// ── Mobile nav toggle ───────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');
});

// Cerrar menú al hacer clic en un enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

// ═══════════════════════════════════════════════
// 2. LEAF CANVAS — partículas de hojas flotantes
// ═══════════════════════════════════════════════
const canvas = document.getElementById('leafCanvas');
const ctx    = canvas.getContext('2d');

let W, H, leaves = [];

const LEAF_EMOJIS = ['🍃', '🌿', '🍀', '🌱', '🍂'];
const LEAF_COUNT  = 28;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function createLeaf() {
  return {
    x:       Math.random() * W,
    y:       -40,
    size:    Math.random() * 16 + 10,
    speed:   Math.random() * 0.6 + 0.25,
    drift:   (Math.random() - 0.5) * 0.4,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.012,
    emoji:   LEAF_EMOJIS[Math.floor(Math.random() * LEAF_EMOJIS.length)],
    opacity: Math.random() * 0.55 + 0.2,
    wobble:  Math.random() * Math.PI * 2,
  };
}

function initLeaves() {
  leaves = [];
  for (let i = 0; i < LEAF_COUNT; i++) {
    const l = createLeaf();
    l.y = Math.random() * H; // distribuir al inicio
    leaves.push(l);
  }
}

function animateLeaves() {
  ctx.clearRect(0, 0, W, H);

  leaves.forEach((l, i) => {
    l.y       += l.speed;
    l.x       += l.drift + Math.sin(l.wobble) * 0.3;
    l.wobble  += 0.012;
    l.rotation+= l.rotSpeed;

    if (l.y > H + 40) {
      leaves[i] = createLeaf();
      return;
    }

    ctx.save();
    ctx.globalAlpha = l.opacity;
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rotation);
    ctx.font = `${l.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(l.emoji, 0, 0);
    ctx.restore();
  });

  requestAnimationFrame(animateLeaves);
}

window.addEventListener('resize', () => { resizeCanvas(); initLeaves(); });
resizeCanvas();
initLeaves();
animateLeaves();

// ═══════════════════════════════════════════════
// 3. SCROLL REVEAL — IntersectionObserver
// ═══════════════════════════════════════════════
const revealEls = document.querySelectorAll('.reveal, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el    = entry.target;
    const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;

    setTimeout(() => {
      el.classList.add('in-view');
    }, delay);

    revealObserver.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ═══════════════════════════════════════════════
// 4. GALLERY — filtros + lightbox
// ═══════════════════════════════════════════════
const filterBtns   = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.cat === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ── Lightbox ────────────────────────────────────
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxClose= document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentLightboxIndex = 0;
let visibleImages = [];

function openLightbox(index) {
  visibleImages = [...galleryItems]
    .filter(i => !i.classList.contains('hidden'))
    .map(i => i.querySelector('img'));

  if (!visibleImages.length) return;

  currentLightboxIndex = index;
  lightboxImg.src = visibleImages[currentLightboxIndex]?.src || '';
  lightboxImg.alt = visibleImages[currentLightboxIndex]?.alt || '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + visibleImages.length) % visibleImages.length;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = visibleImages[currentLightboxIndex]?.src || '';
    lightboxImg.style.opacity = '1';
  }, 150);
}

lightboxImg.style.transition = 'opacity 0.15s';

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click',  () => navigateLightbox(-1));
lightboxNext.addEventListener('click',  () => navigateLightbox(1));

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ═══════════════════════════════════════════════
// 5. COUNTDOWN
// ═══════════════════════════════════════════════
const cdDias = document.getElementById('cd-dias');
const cdHoras= document.getElementById('cd-horas');
const cdMin  = document.getElementById('cd-min');
const cdSeg  = document.getElementById('cd-seg');

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  const now  = new Date();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    cdDias.textContent = cdHoras.textContent = cdMin.textContent = cdSeg.textContent = '00';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  cdDias.textContent  = pad(days);
  cdHoras.textContent = pad(hours);
  cdMin.textContent   = pad(minutes);
  cdSeg.textContent   = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ═══════════════════════════════════════════════
// 6. BACK TO TOP
// ═══════════════════════════════════════════════
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ═══════════════════════════════════════════════
// 7. CONTACT FORM — feedback visual
// ═══════════════════════════════════════════════
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  const original = btn.textContent;

  btn.textContent = '✅ ¡Mensaje enviado!';
  btn.style.background = 'var(--green-sage)';
  btn.disabled = true;

  // Reset after 3 seconds
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    btn.disabled = false;
    contactForm.reset();
  }, 3000);

  // Aquí puedes agregar tu lógica real de envío:
  // fetch('/api/contact', { method: 'POST', body: new FormData(contactForm) })
});

// ═══════════════════════════════════════════════
// 8. ACTIVE NAV LINK — highlight al hacer scroll
// ═══════════════════════════════════════════════
const sections = document.querySelectorAll('section[id]');

const activeNavObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === `#${id}`) {
        a.style.color = navbar.classList.contains('scrolled')
          ? 'var(--green-deep)'
          : 'var(--white)';
      }
    });
  });
}, { threshold: 0.4 });

sections.forEach(s => activeNavObserver.observe(s));

// ═══════════════════════════════════════════════
// 9. SMOOTH HOVER TILT — activity cards
// ═══════════════════════════════════════════════
document.querySelectorAll('.activity-card, .team-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width  / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    const tiltX = dy * -4;
    const tiltY = dx * 4;
    card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s var(--ease-out), box-shadow 0.35s';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s, box-shadow 0.35s';
  });
});
