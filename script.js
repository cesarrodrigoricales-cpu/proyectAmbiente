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

if (navbar) {
  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
}

// ── Mobile nav toggle ───────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
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
}

// ═══════════════════════════════════════════════
// 2. LEAF CANVAS — partículas de hojas flotantes
// ═══════════════════════════════════════════════
const canvas = document.getElementById('leafCanvas');

if (canvas) {
  const ctx = canvas.getContext('2d');
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
}

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

// Cascada extra: dentro de cada jornada, las fotos aparecen una a una
document.querySelectorAll('.jornada-media .photos-row').forEach(row => {
  const photoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const slots = entry.target.querySelectorAll('.photo-slot');
      slots.forEach((slot, i) => {
        slot.style.opacity = '0';
        slot.style.transform = (slot.style.transform || '') + ' translateY(18px)';
        setTimeout(() => {
          slot.style.opacity = '1';
          slot.style.transform = slot.style.transform.replace(' translateY(18px)', '');
        }, i * 90);
      });
      photoObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  photoObserver.observe(row);
});

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
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');

let currentLightboxIndex = 0;
let visibleImages = [];

// `imagesOverride`: permite abrir el lightbox con un set de imágenes propio
// (por ejemplo, las fotos de una sola jornada) en lugar de la galería general.
function openLightbox(index, imagesOverride) {
  visibleImages = imagesOverride || [...galleryItems]
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

if (lightbox && lightboxImg) {
  lightboxImg.style.transition = 'opacity 0.15s';

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev)  lightboxPrev.addEventListener('click',  () => navigateLightbox(-1));
  if (lightboxNext)  lightboxNext.addEventListener('click',  () => navigateLightbox(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // ── Zoom para las fotos fuera de la galería (jornadas, justificación, etc.) ──
  // Al hacer clic se abren grandes en el mismo lightbox, navegando solo
  // entre las fotos de esa misma fila (ej. las 5 fotos de una jornada).
  document.querySelectorAll('.photo-slot img').forEach(img => {
    if (img.closest('.gallery-item')) return; // esas ya se manejan arriba

    img.addEventListener('click', () => {
      const row  = img.closest('.photos-row');
      const imgs = row ? [...row.querySelectorAll('img')] : [img];
      const idx  = imgs.indexOf(img);
      openLightbox(idx, imgs);
    });
  });
}

// ═══════════════════════════════════════════════
// 5. COUNTDOWN (opcional — solo corre si existen los elementos)
// ═══════════════════════════════════════════════
const cdDias  = document.getElementById('cd-dias');
const cdHoras = document.getElementById('cd-horas');
const cdMin   = document.getElementById('cd-min');
const cdSeg   = document.getElementById('cd-seg');

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  if (!cdDias || !cdHoras || !cdMin || !cdSeg) return;

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

if (cdDias && cdHoras && cdMin && cdSeg) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ═══════════════════════════════════════════════
// 6. BACK TO TOP
// ═══════════════════════════════════════════════
const backTop = document.getElementById('backTop');

if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ═══════════════════════════════════════════════
// 7. CONTACT FORM — feedback visual (opcional)
// ═══════════════════════════════════════════════
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;

    btn.textContent = '✅ ¡Mensaje enviado!';
    btn.style.background = 'var(--green-sage)';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);

    // Aquí puedes agregar tu lógica real de envío:
    // fetch('/api/contact', { method: 'POST', body: new FormData(contactForm) })
  });
}

// ═══════════════════════════════════════════════
// 8. ACTIVE NAV LINK — highlight al hacer scroll
// ═══════════════════════════════════════════════
const sections = document.querySelectorAll('section[id]');

if (navbar && sections.length) {
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
}

// ═══════════════════════════════════════════════
// 10. BOTÓN "¡CELEBREMOS!" — confeti + mascota feliz
// ═══════════════════════════════════════════════
const celebrateBtn = document.getElementById('celebrateBtn');
const mascotBubble  = document.getElementById('mascotBubble');
const mascotFloat   = document.getElementById('mascotFloat');

let jsConfettiInstance = null;
function getConfetti() {
  if (!jsConfettiInstance && typeof JSConfetti !== 'undefined') {
    jsConfettiInstance = new JSConfetti();
  }
  return jsConfettiInstance;
}

const MASCOT_MESSAGES = [
  '¡Sembrando conciencia! 🌱',
  '¡Lo logramos juntos! 🎉',
  '¡Gracias por cuidar el planeta! 🌎',
  '¡Viva el reciclaje! ♻️',
];

if (celebrateBtn) {
  celebrateBtn.addEventListener('click', () => {
    const jsConfetti = getConfetti();
    if (jsConfetti) {
      // Ráfaga 1: emojis festivos
      jsConfetti.addConfetti({
        emojis: ['🌿', '🌱', '🌸', '⭐', '🎉', '♻️', '🌈', '🐝'],
        emojiSize: 45,
        confettiNumber: 60,
      });

      // Ráfaga 2 (con un pequeño delay): confeti de colores clásico
      setTimeout(() => {
        jsConfetti.addConfetti({
          confettiColors: [
            '#ff7aa8', '#ffd23f', '#7ed957', '#8fd3ff', '#ff9f45', '#b98cff',
          ],
          confettiNumber: 120,
        });
      }, 300);
    }

    showMascotMessage(MASCOT_MESSAGES[Math.floor(Math.random() * MASCOT_MESSAGES.length)]);
    hopMascot();

    // Feedback visual en el botón
    const original = celebrateBtn.textContent;
    celebrateBtn.textContent = '¡Genial! 🌟';
    celebrateBtn.disabled = true;
    setTimeout(() => {
      celebrateBtn.textContent = original;
      celebrateBtn.disabled = false;
    }, 1800);
  });
}

// ═══════════════════════════════════════════════
// 9. SMOOTH HOVER TILT — activity cards, team cards, videos destacados, prob cards
// ═══════════════════════════════════════════════
document.querySelectorAll('.activity-card, .team-card, .video-slot--featured, .tilt-card').forEach(card => {
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

// ═══════════════════════════════════════════════
// 11. BARRA DE CRECIMIENTO — la semilla crece con el scroll 🌰🌱🌿🪴🌻
// ═══════════════════════════════════════════════
const growthFill        = document.getElementById('growthFill');
const growthStageEmoji  = document.getElementById('growthStageEmoji');
const growthStageLabel  = document.getElementById('growthStageLabel');

const GROWTH_STAGES = [
  { min: 0,  emoji: '🌰', label: 'Semilla' },
  { min: 20, emoji: '🌱', label: 'Brotando' },
  { min: 45, emoji: '🌿', label: 'Creciendo' },
  { min: 70, emoji: '🪴', label: 'Floreciendo' },
  { min: 95, emoji: '🌻', label: '¡Florecimos!' },
];

let currentStageIndex = -1;

function updateGrowthProgress() {
  const scrollTop    = window.scrollY || document.documentElement.scrollTop;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const pct          = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

  if (growthFill) growthFill.style.width = pct + '%';

  let stageIdx = 0;
  for (let i = 0; i < GROWTH_STAGES.length; i++) {
    if (pct >= GROWTH_STAGES[i].min) stageIdx = i;
  }

  if (stageIdx !== currentStageIndex) {
    currentStageIndex = stageIdx;
    const stage = GROWTH_STAGES[stageIdx];
    if (growthStageEmoji) {
      growthStageEmoji.textContent = stage.emoji;
      growthStageEmoji.classList.remove('pop');
      void growthStageEmoji.offsetWidth;
      growthStageEmoji.classList.add('pop');
    }
    if (growthStageLabel) growthStageLabel.textContent = stage.label;
  }
}

if (growthFill) {
  window.addEventListener('scroll', updateGrowthProgress, { passive: true });
  window.addEventListener('resize', updateGrowthProgress);
  updateGrowthProgress();
}

// ═══════════════════════════════════════════════
// 12. CONTADORES ANIMADOS — los números cobran vida al entrar en pantalla
// ═══════════════════════════════════════════════
const countEls = document.querySelectorAll('[data-count-to]');

function animateCount(el) {
  const target    = parseFloat(el.dataset.countTo);
  const decimals  = parseInt(el.dataset.decimals || '0', 10);
  const suffix    = el.dataset.suffix || '';
  const duration  = 1300;
  const startTime = performance.now();

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    // easeOutBack-ish para que se sienta "vivo"
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;

    el.textContent = value.toFixed(decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toFixed(decimals) + suffix;
      el.classList.add('count-pop');
      setTimeout(() => el.classList.remove('count-pop'), 550);
    }
  }

  requestAnimationFrame(tick);
}

if (countEls.length) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  countEls.forEach(el => countObserver.observe(el));
}

// ═══════════════════════════════════════════════
// 13. PARALLAX SUAVE — los blobs respiran con el scroll
// ═══════════════════════════════════════════════
const parallaxBlobs = document.querySelectorAll('.kawaii-blob[data-depth]');

if (parallaxBlobs.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxBlobs.forEach(blob => {
      const depth = parseFloat(blob.dataset.depth || '0.2');
      const offset = (scrollY * depth) % 400;
      blob.style.setProperty('--parallax-y', `${Math.sin(offset / 40) * 10}px`);
      blob.style.marginTop = `${Math.sin((scrollY + blob.offsetLeft) / 300) * (depth * 22)}px`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

// ═══════════════════════════════════════════════
// 14. HERO — entrada con carácter + máquina de escribir
// ═══════════════════════════════════════════════
const heroTitle    = document.getElementById('heroTitle');
const heroSubtitle = document.getElementById('heroSubtitle');
const SUBTITLE_TEXT = 'Proyecto Espacio Verde para la Educación Ambiental 🌻';

window.addEventListener('load', () => {
  if (heroTitle) {
    setTimeout(() => heroTitle.classList.add('titles-ready'), 150);
  }

  if (heroSubtitle) {
    let i = 0;
    const typeSpeed = 32;
    function typeChar() {
      if (i <= SUBTITLE_TEXT.length) {
        heroSubtitle.textContent = SUBTITLE_TEXT.slice(0, i);
        i++;
        setTimeout(typeChar, typeSpeed);
      } else {
        heroSubtitle.classList.add('typing-done');
      }
    }
    setTimeout(typeChar, 750);
  }
});

// Botones del hero: "pop" de energía al hacer clic
document.querySelectorAll('.btn-pop').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.remove('clicked');
    void btn.offsetWidth;
    btn.classList.add('clicked');
  });
});

// ═══════════════════════════════════════════════
// 15. MASCOTA CON PERSONALIDAD — Semillita reacciona a tu recorrido
// ═══════════════════════════════════════════════
const SECTION_MESSAGES = {
  inicio:        ['¡Hola! Soy Semillita 🌱', '¡Bienvenido a nuestro proyecto! 💚'],
  problema:      ['Hay basura por aquí... ¡ayudemos a limpiar! 🗑️', 'Juntos podemos cambiar esto 💪'],
  justificacion: ['¡Aprender es divertido! 📖', 'Cada niño cuenta una gran diferencia ✨'],
  actividades:   ['¡Mira todo lo que hicimos! 🎉', '¡Cuatro jornadas de pura diversión!'],
  encuesta:      ['¡92.6% de niños felices! 😊', '¡Wow, casi todos dijeron que sí! 🥳'],
  galeria:       ['¡Estos recuerdos son hermosos! 📸', '¡Mira cuántos momentos lindos!'],
  integrantes:   ['¡Este equipo hizo magia! 👥', '¡Gracias por conocernos! 💚'],
};

function showMascotMessage(text) {
  if (!mascotBubble) return;
  mascotBubble.textContent = text;
  mascotBubble.classList.remove('hidden-bubble');
  clearTimeout(window.__mascotBubbleTimeout);
  window.__mascotBubbleTimeout = setTimeout(() => {
    mascotBubble.classList.add('hidden-bubble');
  }, 3400);
}

function hopMascot() {
  if (!mascotFloat) return;
  mascotFloat.style.animation = 'none';
  void mascotFloat.offsetWidth;
  mascotFloat.style.animation = 'mascotCelebrate 0.9s ease-in-out 2';
  setTimeout(() => { mascotFloat.style.animation = ''; }, 1800);
}

// Semillita saluda cada vez que entras a una sección nueva (con calma, no invasiva)
if (mascotBubble && sections.length) {
  let lastMascotSection = null;
  const mascotSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      if (id === lastMascotSection) return;
      lastMascotSection = id;
      const options = SECTION_MESSAGES[id];
      if (!options) return;
      const msg = options[Math.floor(Math.random() * options.length)];
      setTimeout(() => showMascotMessage(msg), 500);
    });
  }, { threshold: 0.55 });

  sections.forEach(s => mascotSectionObserver.observe(s));
}

// Clic en la mascota: mensaje aleatorio + ráfaga de corazoncitos
if (mascotFloat) {
  mascotFloat.addEventListener('click', () => {
    showMascotMessage(MASCOT_MESSAGES[Math.floor(Math.random() * MASCOT_MESSAGES.length)]);
    hopMascot();
    burstParticles(mascotFloat);
  });
}

function burstParticles(originEl) {
  const rect = originEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 3;
  const emojis = ['💚', '✨', '🌸', '⭐'];

  for (let i = 0; i < 8; i++) {
    const p = document.createElement('span');
    p.className = 'burst-particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
    const distance = 60 + Math.random() * 40;
    p.style.left = originX + 'px';
    p.style.top = originY + 'px';
    p.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
    p.style.setProperty('--dy', (Math.sin(angle) * distance - 30) + 'px');
    p.style.setProperty('--rot', (Math.random() * 180 - 90) + 'deg');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1150);
  }
}

// ═══════════════════════════════════════════════
// 17. VIDEOS — reproductor con más vida
//     Botón de play a lo cuento · spinner de carga ·
//     vista previa muda (autoplay) en destacados ·
//     tarjeta de repuesto si un video no carga
// ═══════════════════════════════════════════════
function buildVideoFallback(video, hintText) {
  const fallback = document.createElement('div');
  fallback.className = 'video-fallback';
  fallback.innerHTML = `
    <span class="video-fallback-icon">🎬</span>
    <span class="video-fallback-text">${hintText || 'Este video estará disponible muy pronto'}</span>
  `;
  video.replaceWith(fallback);
  return fallback;
}

function enhanceVideo(video) {
  const wrapper = video.closest('.video-slot');
  if (!wrapper || wrapper.dataset.enhanced === 'true') return;
  wrapper.dataset.enhanced = 'true';

  const isFeatured = wrapper.classList.contains('video-slot--featured');
  const hintEl = wrapper.querySelector('.media-hint');
  const hintText = hintEl ? hintEl.textContent.replace('📹', '').trim() : '';

  // ---- Botón de reproducir a lo cuento ----
  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.className = 'video-play-btn';
  playBtn.setAttribute('aria-label', 'Reproducir video');
  wrapper.appendChild(playBtn);

  // ---- Spinner de carga ----
  const spinner = document.createElement('span');
  spinner.className = 'video-loading';
  spinner.textContent = '🍃';
  wrapper.appendChild(spinner);

  const showPlayBtn = () => playBtn.classList.remove('hidden');
  const hidePlayBtn = () => playBtn.classList.add('hidden');

  playBtn.addEventListener('click', () => {
    if (video.paused) { video.play().catch(() => {}); } else { video.pause(); }
  });

  video.addEventListener('play',  () => { hidePlayBtn(); wrapper.classList.add('is-playing'); });
  video.addEventListener('pause', () => { showPlayBtn(); wrapper.classList.remove('is-playing'); });
  video.addEventListener('ended', () => { showPlayBtn(); wrapper.classList.remove('is-playing'); });
  video.addEventListener('waiting', () => spinner.classList.add('show'));
  video.addEventListener('playing', () => spinner.classList.remove('show'));
  video.addEventListener('canplay', () => spinner.classList.remove('show'));

  // ---- Si el archivo no existe o falla, mostramos una tarjeta amigable ----
  video.addEventListener('error', () => {
    buildVideoFallback(video, hintText ? `Video no disponible: ${hintText}` : 'Este video estará disponible muy pronto');
  }, true);

  // ---- Vista previa muda (autoplay) solo para los videos destacados ----
  if (isFeatured) {
    video.muted = true;
    video.loop = true;
    video.controls = false;
    hidePlayBtn();

    const chip = document.createElement('span');
    chip.className = 'video-mute-chip';
    chip.textContent = '🔇 Vista previa · toca para sonido';
    wrapper.appendChild(chip);

    const unmute = () => {
      video.muted = false;
      video.loop = false;
      video.controls = true;
      chip.classList.add('hidden');
      setTimeout(() => chip.remove(), 400);
    };
    chip.addEventListener('click', unmute);
    video.addEventListener('click', unmute, { once: true });

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const previewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.6 });
      previewObserver.observe(wrapper);
    }
  } else {
    // Videos normales: el usuario decide cuándo darle play
    showPlayBtn();
  }
}

document.querySelectorAll('.video-slot video').forEach(video => {
  // Si el video ya viene roto (sin fuente válida), mostramos el repuesto de una vez
  const src = video.querySelector('source')?.getAttribute('src');
  if (!src) {
    buildVideoFallback(video, 'Este video estará disponible muy pronto');
    return;
  }
  enhanceVideo(video);
});

// ═══════════════════════════════════════════════
// 16. ENCUESTA — pequeña celebración cuando el donut entra en pantalla
// ═══════════════════════════════════════════════
const donutChart = document.querySelector('.donut-chart');

if (donutChart) {
  const donutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      donutChart.classList.add('celebrated');
      setTimeout(() => {
        const jsConfetti = getConfetti();
        if (jsConfetti) {
          jsConfetti.addConfetti({
            emojis: ['😊', '💚', '✨'],
            emojiSize: 30,
            confettiNumber: 24,
          });
        }
      }, 500);
      donutObserver.unobserve(donutChart);
    });
  }, { threshold: 0.6 });
  donutObserver.observe(donutChart);
}