/**
 * app.js — Main entry point. Bootstraps all controllers and utilities.
 */

import {
  initCursor, initRevealObserver, initNavScroll,
  initParticles, initParallax, initBackToTop,
  initLazyImages, addRipple, animateCounter,
  typewriter, initMedalPhysics
} from './utils/helpers.js';

import { HeroController }         from './controllers/HeroController.js';
import { AboutController }        from './controllers/AboutController.js';
import { ProjectsController }     from './controllers/ProjectsController.js';
import { SkillsController }       from './controllers/SkillsController.js';
import { TestimonialController }  from './controllers/TestimonialController.js';

import { HeroView }          from './views/HeroView.js';
import { AboutView }         from './views/AboutView.js';
import { ProjectsView }      from './views/ProjectsView.js';
import { SkillsView }        from './views/SkillsView.js';
import { TestimonialView }   from './views/TestimonialView.js';

/* ─────────────────────────────────────────────────────────────
   FALLBACK DATA — shown immediately (no network needed)
───────────────────────────────────────────────────────────── */
const FB = {
  hero: {
    name: 'Alex Doe',
    subtitle: 'crafting digital experiences that blend engineering precision with visual poetry.',
    badge: 'Available for Work',
    roles: ['Full Stack Developer', 'Frontend Engineer', 'UI Craftsman'],
    years_exp: 5, projects_done: 40, clients: 30
  },
  socials: {
    github:   'https://github.com/username',
    linkedin: 'https://linkedin.com/in/username',
    gmail:    'hello@example.com',
    whatsapp: '1234567890'
  },
  about: {
    bio: "I'm a passionate full-stack developer with 5+ years of experience building modern web applications. I specialize in creating performant, accessible, and visually stunning digital products that users love.",
    timeline: [
      { year: '2024', title: 'Senior Developer @ TechCorp',        description: 'Leading frontend architecture for enterprise SaaS products.' },
      { year: '2022', title: 'Full Stack Engineer @ StartupXYZ',   description: 'Built scalable APIs and React apps serving 50k+ users.' },
      { year: '2020', title: 'Junior Frontend Developer',           description: 'Started professional journey building e-commerce platforms.' }
    ],
    years_exp: 5, projects_done: 40, clients: 30, awards: 8
  },
  skills: [
    { name: 'JavaScript', category: 'Frontend', icon: '⚡', level: 95 },
    { name: 'React',      category: 'Frontend', icon: '⚛️', level: 90 },
    { name: 'Node.js',    category: 'Backend',  icon: '🟢', level: 85 },
    { name: 'TypeScript', category: 'Frontend', icon: '🔷', level: 88 },
    { name: 'PostgreSQL', category: 'Database', icon: '🐘', level: 80 },
    { name: 'CSS / SCSS', category: 'Frontend', icon: '🎨', level: 92 },
    { name: 'Python',     category: 'Backend',  icon: '🐍', level: 75 },
    { name: 'Docker',     category: 'DevOps',   icon: '🐳', level: 70 }
  ],
  projects: [
    { id: 1, title: 'E-Commerce Platform',   category: 'Full Stack', featured: true,
      description: 'High-performance e-commerce with real-time inventory and AI recommendations.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'], demo_url: '#', github_url: '#' },
    { id: 2, title: 'Analytics Dashboard',   category: 'Frontend',
      description: 'Interactive data visualization platform with real-time chart components.',
      technologies: ['Vue.js', 'D3.js', 'WebSockets', 'Go'], demo_url: '#', github_url: '#' },
    { id: 3, title: 'Microservices Gateway', category: 'Backend',
      description: 'API gateway handling 1M+ requests/day with load balancing and rate limiting.',
      technologies: ['Node.js', 'Kubernetes', 'Redis', 'gRPC'], github_url: '#' }
  ],
  testimonials: [
    { name: 'Sarah Johnson', role: 'CTO',            company: 'TechVentures',
      quote: 'Exceptional work — delivered beyond expectations with incredible attention to detail and performance.', rating: 5 },
    { name: 'Mark Chen',     role: 'Product Manager', company: 'StartupHub',
      quote: 'One of the best developers I\'ve worked with. Clean code, great communication, stunning UI results.', rating: 5 },
    { name: 'Layla Hassan',  role: 'CEO',             company: 'DesignLabs',
      quote: 'Transformed our vision into a beautiful, fast product in record time. Highly recommend.', rating: 5 }
  ],
  services: [
    { icon: '🌐', title: 'Web Development',      description: 'Full-stack web apps built with modern frameworks and best practices.' },
    { icon: '🎨', title: 'UI Implementation',    description: 'Pixel-perfect designs with smooth animations and micro-interactions.' },
    { icon: '⚙️', title: 'Backend & APIs',       description: 'Scalable REST & GraphQL APIs with robust auth and caching layers.' },
    { icon: '🗄️', title: 'Database Design',      description: 'Optimized schemas, migrations, and query tuning for any scale.' },
    { icon: '🤖', title: 'Automation & CI/CD',   description: 'Deployment pipelines, Docker, and workflow automation.' },
    { icon: '📱', title: 'Responsive Design',    description: 'Mobile-first interfaces that look stunning on every screen.' },
    { icon: '🔒', title: 'Auth & Security',       description: 'Secure authentication flows, RBAC, and data protection.' },
    { icon: '📊', title: 'Analytics Integration', description: 'Event tracking, dashboards, and data-driven product decisions.' }
  ],
  certificates: [
    { year: '2024', name: 'AWS Solutions Architect',     issuer: 'Amazon Web Services', description: 'Professional cloud architecture certification.' },
    { year: '2023', name: 'Google Professional Dev',     issuer: 'Google Cloud',         description: 'Advanced cloud development certification.' },
    { year: '2022', name: 'Meta Frontend Developer',     issuer: 'Meta',                 description: 'React and frontend professional certificate.' }
  ],
  contact: {
    gmail: 'hello@example.com', whatsapp: '1234567890',
    linkedin: 'https://linkedin.com/in/username', github: 'https://github.com/username'
  }
};

/* ─────────────────────────────────────────────────────────────
   STATIC RENDERERS (instant, no Supabase needed)
───────────────────────────────────────────────────────────── */
function renderSkills(skills) {
  const view = new SkillsView();
  view.render(skills);
  view.addTiltEffect();
}

function renderProjects(projects) {
  const view = new ProjectsView();
  const featured = projects.find(p => p.featured);
  if (featured) view.renderFeatured(featured);
  const cats = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))];
  let current = 'all';
  view.renderFilters(cats, current, cat => {
    current = cat;
    view.renderProjects(cat === 'all' ? projects : projects.filter(p => p.category === cat));
    setTimeout(() => { initRevealObserver(); initLazyImages(); }, 50);
  });
  view.renderProjects(projects);
}

function renderTestimonials(testimonials) {
  const view = new TestimonialView();
  view.render(testimonials);
}

function renderServices(services) {
  const grid = document.getElementById('services-grid');
  if (!grid) return;
  grid.innerHTML = services.map((s, i) => `
    <div class="service-card reveal" data-delay="${i * 60}">
      <div class="service-icon-wrap">${s.icon}</div>
      <h3 class="service-title">${s.title}</h3>
      <p class="service-desc">${s.description}</p>
    </div>
  `).join('');
}

function renderCerts(certs) {
  const tl = document.getElementById('certs-timeline');
  if (!tl) return;
  tl.innerHTML = certs.map((c, i) => `
    <div class="cert-item reveal" data-delay="${i * 100}">
      <div class="cert-year-badge">${c.year}</div>
      <div class="cert-card">
        <div class="cert-name">${c.name}</div>
        <div class="cert-issuer">${c.issuer}</div>
        <p class="cert-desc">${c.description}</p>
      </div>
    </div>
  `).join('');
}

function renderContact(contact) {
  const grid = document.getElementById('contact-grid');
  if (!grid) return;
  const cards = [
    { type: 'gmail',    icon: '✉️', label: 'Email',     value: contact.gmail,
      href: `mailto:${contact.gmail}`,           bg: 'rgba(234,67,53,0.12)', border: 'rgba(234,67,53,0.3)',  copyable: true },
    { type: 'whatsapp', icon: '💬', label: 'WhatsApp',  value: 'Message me',
      href: `https://wa.me/${contact.whatsapp}`, bg: 'rgba(37,211,102,0.12)', border: 'rgba(37,211,102,0.3)' },
    { type: 'linkedin', icon: '💼', label: 'LinkedIn',  value: 'Connect',
      href: contact.linkedin,                    bg: 'rgba(10,102,194,0.12)', border: 'rgba(10,102,194,0.3)' },
    { type: 'github',   icon: '⚡', label: 'GitHub',    value: 'View code',
      href: contact.github,                      bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.15)' }
  ];

  grid.innerHTML = cards.map((c, i) => `
    <div class="contact-card reveal-scale" data-delay="${i * 80}">
      <div class="contact-icon" style="background:${c.bg};border:1px solid ${c.border}">${c.icon}</div>
      <div class="contact-label">${c.label}</div>
      <div class="contact-value">${c.value}</div>
      <div class="contact-actions">
        <a href="${c.href}" ${c.type !== 'gmail' ? 'target="_blank" rel="noopener"' : ''}
           class="btn btn-ghost" style="font-size:.75rem;padding:5px 16px">
          ${c.type === 'gmail' ? 'Send Email' : 'Open'} ↗
        </a>
        ${c.copyable ? `<button class="copy-btn" data-copy="${c.value}" aria-label="Copy email">📋</button>` : ''}
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        const orig = btn.innerHTML;
        btn.innerHTML = '✅'; btn.classList.add('copied');
        setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 2000);
      } catch {}
    });
  });
}

function renderHeroFallback() {
  const heroView = new HeroView();
  heroView.render(FB.hero);
  heroView.renderSocials(FB.socials);
  const twEl = document.getElementById('hero-typewriter');
  if (twEl) typewriter(twEl, FB.hero.roles);
  initMedalPhysics(document.querySelector('.medal-wrapper'));

  // Animate hero stat counters
  document.querySelectorAll('#hero [data-target]').forEach(el => {
    new IntersectionObserver(([e], obs) => {
      if (e.isIntersecting) { animateCounter(el, +el.dataset.target); obs.unobserve(el); }
    }, { threshold: 0.5 }).observe(el);
  });
}

function renderAboutFallback() {
  const aboutView = new AboutView();
  aboutView.render(FB.about);
  document.querySelectorAll('#about .counter-number[data-target]').forEach(el => {
    new IntersectionObserver(([e], obs) => {
      if (e.isIntersecting) { animateCounter(el, +el.dataset.target); obs.unobserve(el); }
    }, { threshold: 0.5 }).observe(el);
  });
}

/* ─────────────────────────────────────────────────────────────
   MOBILE NAV
───────────────────────────────────────────────────────────── */
function initMobileNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer    = document.querySelector('.nav-mobile');
  if (!hamburger || !drawer) return;

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    drawer.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    drawer.setAttribute('aria-hidden', !open);
  });

  drawer.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    })
  );
}

/* ─────────────────────────────────────────────────────────────
   BOOTSTRAP
───────────────────────────────────────────────────────────── */
async function bootstrap() {
  /* ── 1. Instant UI setup ── */
  initCursor();
  initNavScroll();
  initBackToTop();
  initMobileNav();

  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
    initParticles(canvas);
  }

  /* ── 2. Render static sections immediately (no network) ── */
  renderServices(FB.services);
  renderCerts(FB.certificates);
  renderContact(FB.contact);

  /* ── 3. Hero ── */
  try {
    const ctrl = new HeroController();
    await ctrl.init();
  } catch { renderHeroFallback(); }

  /* ── 4. About ── */
  try {
    const ctrl = new AboutController();
    await ctrl.init();
  } catch { renderAboutFallback(); }

  /* ── 5. Skills ── */
  try {
    const ctrl = new SkillsController();
    await ctrl.init();
  } catch { renderSkills(FB.skills); }

  /* ── 6. Projects ── */
  try {
    const ctrl = new ProjectsController();
    await ctrl.init();
  } catch { renderProjects(FB.projects); }

  /* ── 7. Testimonials ── */
  try {
    const ctrl = new TestimonialController();
    await ctrl.init();
  } catch { renderTestimonials(FB.testimonials); }

  /* ── 8. Global post-render ── */
  setTimeout(() => {
    initRevealObserver();
    initLazyImages();
    initParallax();

    // Ripple on all buttons
    document.querySelectorAll('.btn, .nav-cta, .filter-btn').forEach(addRipple);

    // Skill card mouse glow track
    document.querySelectorAll('.skill-card').forEach(card =>
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
      })
    );
  }, 120);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', bootstrap)
  : bootstrap();
