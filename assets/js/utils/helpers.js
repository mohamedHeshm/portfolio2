/**
 * utils/helpers.js — General utility functions
 */
export const $ = (sel, ctx = document) => ctx.querySelector(sel);
export const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

export function debounce(fn, ms = 150) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

export function throttle(fn, ms = 16) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...args); }
  };
}

export function lerp(a, b, t) { return a + (b - a) * t; }

export function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

export function mapRange(val, inMin, inMax, outMin, outMax) {
  return outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);
}

export function randomBetween(min, max) { return Math.random() * (max - min) + min; }

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  }
}

export function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

/** Animate counter from 0 to target */
export function animateCounter(el, target, duration = 1800) {
  let start = null;
  const suffix = el.dataset.suffix || '';
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/** Typewriter effect */
export function typewriter(el, texts, { speed = 80, pause = 2000, deleteSpeed = 40 } = {}) {
  let textIdx = 0, charIdx = 0, deleting = false;
  function tick() {
    const current = texts[textIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, pause);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        textIdx  = (textIdx + 1) % texts.length;
      }
    }
    setTimeout(tick, deleting ? deleteSpeed : speed);
  }
  tick();
}

/** Ripple click effect */
export function addRipple(el) {
  el.addEventListener('click', (e) => {
    const rect   = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;left:${e.clientX-rect.left}px;top:${e.clientY-rect.top}px;
      width:8px;height:8px;border-radius:50%;
      background:rgba(56,189,248,0.5);transform:translate(-50%,-50%) scale(0);
      animation:ripple 0.6s ease-out forwards;pointer-events:none;
    `;
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

/**
 * utils/observer.js — Intersection Observer for reveal animations
 */
export function initRevealObserver() {
  const els = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay for grid children
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('visible'), Number(delay));
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach(el => obs.observe(el));
  return obs;
}

/** Add stagger delays to a set of children */
export function staggerChildren(parent, selector, baseDelay = 0, step = 80) {
  const children = parent.querySelectorAll(selector);
  children.forEach((el, i) => {
    el.dataset.delay = baseDelay + i * step;
  });
}

/**
 * utils/cursor.js — Custom cursor
 */
export function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  const speed = 0.12;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Laggy ring follow
  function animRing() {
    rx = lerp(rx, mx, speed);
    ry = lerp(ry, my, speed);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  // Hover state on interactive elements
  const hoverTargets = 'a, button, [data-cursor-hover], .project-card, .skill-card, .contact-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover');
  });

  // Hide on leave / show on enter
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

/**
 * utils/physics.js — Medal drag + elastic spring
 */
export function initMedalPhysics(wrapperEl) {
  if (!wrapperEl) return;

  const body = wrapperEl.querySelector('.medal-body');
  if (!body) return;

  let isDragging = false;
  let startX = 0, startY = 0;
  let offsetX = 0, offsetY = 0;
  let velX = 0, velY = 0;
  let posX = 0, posY = 0;
  let animId = null;

  // Spring constants
  const STIFFNESS   = 0.12;
  const DAMPING     = 0.75;
  const MAX_STRETCH = 80;

  function springBack() {
    velX = lerp(velX, -posX * STIFFNESS, 1 - DAMPING);
    velY = lerp(velY, -posY * STIFFNESS, 1 - DAMPING);
    posX += velX;
    posY += velY;

    // Elastic deformation — skewX/scaleY based on displacement
    const dist    = Math.sqrt(posX * posX + posY * posY);
    const stretch = clamp(dist / MAX_STRETCH, 0, 1);
    const skewX   = clamp(posX * 0.04, -12, 12);
    const scaleY  = 1 + stretch * 0.12;
    const scaleX  = 1 - stretch * 0.06;

    body.style.transform = `
      translate(${posX}px, ${posY}px)
      skewX(${skewX}deg)
      scale(${scaleX}, ${scaleY})
    `;

    if (Math.abs(posX) > 0.2 || Math.abs(posY) > 0.2 || Math.abs(velX) > 0.1) {
      animId = requestAnimationFrame(springBack);
    } else {
      posX = posY = velX = velY = 0;
      body.style.transform = '';
      cancelAnimationFrame(animId);
    }
  }

  // Pointer events
  wrapperEl.addEventListener('pointerdown', (e) => {
    isDragging = true;
    wrapperEl.setPointerCapture(e.pointerId);
    startX = e.clientX - posX;
    startY = e.clientY - posY;
    cancelAnimationFrame(animId);
    e.preventDefault();
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    posX = clamp(e.clientX - startX, -MAX_STRETCH, MAX_STRETCH);
    posY = clamp(e.clientY - startY, -MAX_STRETCH, MAX_STRETCH);

    const skewX  = clamp(posX * 0.04, -12, 12);
    const dist   = Math.sqrt(posX * posX + posY * posY);
    const stretch = clamp(dist / MAX_STRETCH, 0, 1);
    const scaleY = 1 + stretch * 0.12;
    const scaleX = 1 - stretch * 0.06;

    body.style.transform = `
      translate(${posX}px, ${posY}px)
      skewX(${skewX}deg)
      scale(${scaleX}, ${scaleY})
    `;
  });

  window.addEventListener('pointerup', () => {
    if (!isDragging) return;
    isDragging = false;
    velX = posX * 0.08;
    velY = posY * 0.08;
    animId = requestAnimationFrame(springBack);
  });

  // Cursor tilt on hover (non-drag)
  wrapperEl.addEventListener('mousemove', (e) => {
    if (isDragging) return;
    const rect  = wrapperEl.getBoundingClientRect();
    const cx    = rect.left + rect.width / 2;
    const cy    = rect.top  + rect.height / 2;
    const tiltX = clamp((e.clientY - cy) / rect.height * 24, -12, 12);
    const tiltY = clamp((cx - e.clientX) / rect.width  * 24, -12, 12);
    body.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });
  wrapperEl.addEventListener('mouseleave', () => {
    if (!isDragging) body.style.transform = '';
  });
}

/**
 * utils/animations.js — Particle canvas & parallax
 */
export function initParticles(canvasEl) {
  if (!canvasEl) return;
  const ctx = canvasEl.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvasEl.width  = canvasEl.offsetWidth;
    H = canvasEl.height = canvasEl.offsetHeight;
  }
  resize();
  window.addEventListener('resize', debounce(resize, 200));

  const COLORS = ['rgba(56,189,248,', 'rgba(167,139,250,', 'rgba(52,211,153,'];

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x    = Math.random() * W;
      this.y    = init ? Math.random() * H : H + 10;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = -(Math.random() * 0.6 + 0.2);
      this.alpha  = 0;
      this.maxAlpha = Math.random() * 0.5 + 0.1;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.fadeIn = true;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.fadeIn) {
        this.alpha += 0.01;
        if (this.alpha >= this.maxAlpha) this.fadeIn = false;
      } else {
        this.alpha -= 0.002;
      }
      if (this.alpha <= 0 || this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

/** Parallax on scroll */
export function initParallax() {
  const layers = document.querySelectorAll('[data-parallax]');
  if (!layers.length) return;

  window.addEventListener('scroll', throttle(() => {
    const sy = window.scrollY;
    layers.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      el.style.transform = `translateY(${sy * speed}px)`;
    });
  }, 16));
}

/** Nav scroll behaviour */
export function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', throttle(() => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, 100));

  // Active link highlight
  const links    = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = [...links].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

  window.addEventListener('scroll', throttle(() => {
    const scrollMid = window.scrollY + window.innerHeight / 2;
    sections.forEach((sec, i) => {
      if (sec.offsetTop <= scrollMid && sec.offsetTop + sec.offsetHeight > scrollMid) {
        links.forEach(l => l.classList.remove('active'));
        links[i]?.classList.add('active');
      }
    });
  }, 100));
}

/** Back-to-top button */
export function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', throttle(() => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, 200));
}

/** Lazy-load images */
export function initLazyImages() {
  const imgs = document.querySelectorAll('img[data-src]');
  if (!imgs.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.addEventListener('load', () => img.classList.add('loaded'));
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  imgs.forEach(img => obs.observe(img));
}
