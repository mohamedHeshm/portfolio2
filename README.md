# 🚀 Developer Portfolio — MVC Architecture + Supabase

A production-ready, Awwwards-level developer portfolio built with **HTML5 · CSS3 · Vanilla JS (ES Modules) · Supabase**.  
No frameworks. Clean MVC architecture. Physics-based animations. Full admin dashboard.

---

## 📁 Project Structure

```
portfolio/
├── index.html                    ← Main portfolio page
├── supabase-schema.sql           ← Database setup (run once)
├── README.md
│
├── admin/
│   ├── index.html                ← Admin login
│   └── dashboard.html            ← Full CMS dashboard
│
└── assets/
    ├── css/
    │   ├── variables.css         ← Design tokens & CSS custom properties
    │   ├── base.css              ← Reset, fonts, global defaults
    │   ├── animations.css        ← All keyframes & animation utilities
    │   ├── components.css        ← Reusable UI components
    │   ├── layout.css            ← Section layouts & grids
    │   └── responsive.css        ← Breakpoints (mobile / tablet / desktop)
    │
    ├── js/
    │   ├── app.js                ← Entry point — bootstraps everything
    │   │
    │   ├── models/               ← DATA LAYER (Supabase only, no UI)
    │   │   ├── HeroModel.js
    │   │   ├── AboutModel.js
    │   │   ├── ProjectModel.js
    │   │   ├── SkillModel.js
    │   │   └── TestimonialModel.js
    │   │
    │   ├── views/                ← UI LAYER (DOM only, no business logic)
    │   │   ├── HeroView.js
    │   │   ├── AboutView.js
    │   │   ├── ProjectsView.js
    │   │   ├── SkillsView.js
    │   │   └── TestimonialView.js
    │   │
    │   ├── controllers/          ← LOGIC LAYER (connects model ↔ view)
    │   │   ├── HeroController.js
    │   │   ├── AboutController.js
    │   │   ├── ProjectsController.js
    │   │   ├── SkillsController.js
    │   │   ├── TestimonialController.js
    │   │   └── AdminController.js
    │   │
    │   ├── services/             ← External integrations
    │   │   ├── supabase.js       ← Supabase client singleton
    │   │   ├── api.js            ← All DB CRUD wrappers
    │   │   └── storage.js        ← Supabase Storage helpers
    │   │
    │   └── utils/
    │       └── helpers.js        ← Cursor · Physics · Particles · Observers · Helpers
    │
    ├── images/                   ← Static images
    ├── icons/                    ← SVG icons
    └── videos/                   ← Background videos (optional)
```

---

## ⚡ Quick Start

### 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the contents of `supabase-schema.sql` → Run
3. Go to **Authentication → Providers** → make sure Email is enabled
4. Create your admin user under **Authentication → Users → Invite user**
5. Go to **Storage** → create a new bucket named `portfolio-assets` → make it **Public**

### 2. Configure credentials

Replace `YOUR_PROJECT` and `YOUR_ANON_KEY` in **three files**:

```
assets/js/services/supabase.js   ← line 8–9
admin/index.html                 ← line ~62–63
admin/dashboard.html             ← line ~4–5 of <script>
```

Find your values in: Supabase Dashboard → **Settings → API**

```js
const SUPABASE_URL = 'https://xxxxxxxxxxxx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 3. Serve locally

Any static file server works:

```bash
# Node.js
npx serve .

# Python
python -m http.server 8080

# VS Code
Install "Live Server" extension → right-click index.html → Open with Live Server
```

> ⚠️ Must use a server — ES Modules don't work with `file://` protocol.

---

## 🎨 Features

### Portfolio (index.html)
| Feature | Details |
|---|---|
| **Hero Medal** | Floating, draggable, elastic spring physics, 3D lighting |
| **Aurora Background** | Animated gradient blobs + particle canvas |
| **Typewriter** | Rotating role titles with smooth cursor |
| **Custom Cursor** | Dot + ring with hover states |
| **Smooth Scroll Reveal** | IntersectionObserver with stagger delays |
| **Skills** | Animated progress bars + mouse glow effect |
| **Projects** | Category filter, featured showcase, hover overlay |
| **Testimonials** | Auto-sliding with dots + nav controls |
| **Contact** | Gmail · WhatsApp · LinkedIn · GitHub — no form |
| **Realtime** | Testimonials update live via Supabase Realtime |
| **Fallback** | Works fully offline with hardcoded fallback data |

### Admin (admin/)
| Feature | Details |
|---|---|
| **Auth** | Supabase email/password — protected route |
| **Hero** | Name, badge, subtitle, roles, avatar, stats |
| **About** | Bio, photo, experience counters |
| **Projects** | Full CRUD — title, description, tech, links, screenshot |
| **Skills** | Icon, name, category, proficiency level, sort order |
| **Testimonials** | Add / delete with rating and avatar |
| **Certificates** | Year, issuer, name, description |
| **Services** | Icon, title, description, sort order |
| **Social Links** | Gmail, WhatsApp, LinkedIn, GitHub |

---

## 🗄️ Database Tables

| Table | Key Columns |
|---|---|
| `hero` | name, badge, subtitle, roles[], avatar_url, years_exp, projects_done |
| `about` | bio, image_url, years_exp, projects_done, clients, awards, timeline |
| `projects` | title, description, category, technologies[], image_url, demo_url, github_url, featured |
| `skills` | name, category, icon, level (0-100), order_index |
| `testimonials` | name, role, company, quote, rating (1-5), avatar_url |
| `certificates` | name, issuer, year, description |
| `services` | title, description, icon, order_index |
| `social_links` | gmail, whatsapp, linkedin, github |

---

## 🎯 Customization Checklist

- [ ] Replace `SUPABASE_URL` and `SUPABASE_KEY` in 3 files
- [ ] Update fallback data in `assets/js/app.js` → `const FB = {...}`
- [ ] Change name/logo in `index.html` (`AD.` nav logo)
- [ ] Update `<title>` and `<meta>` tags in `index.html`
- [ ] Upload your photo → set `avatar_url` in Hero via admin
- [ ] Add your real projects, skills, and testimonials via admin dashboard
- [ ] Update contact links in admin → Social Links panel
- [ ] Change color scheme in `assets/css/variables.css` (look for `--clr-cyan` and `--clr-violet`)

---

## 🚀 Deployment

### Netlify (recommended)
1. Drag and drop the `portfolio/` folder onto [netlify.com/drop](https://netlify.com/drop)
2. Done — no build step needed.

### Vercel
```bash
npx vercel --prod
```

### GitHub Pages
Push to a repo → Settings → Pages → Source: `main` branch / `root`.

---

## 🔐 Security Notes

- Supabase RLS is enabled on all tables — public can only **read**, authenticated users can **write**
- Admin dashboard checks session on every load — redirects to login if unauthenticated
- Never commit your `SUPABASE_KEY` to a public repo (use environment variables for production builds)

---

## 📋 Tech Stack

- **HTML5** — semantic, accessible markup
- **CSS3** — custom properties, grid, flexbox, animations
- **Vanilla JS (ES2022)** — modules, async/await, IntersectionObserver
- **Supabase** — PostgreSQL database, auth, realtime, storage
- **Google Fonts** — Syne · DM Sans · JetBrains Mono

---

*Built with ❤️ — no frameworks, no bundlers, just clean web standards.*
