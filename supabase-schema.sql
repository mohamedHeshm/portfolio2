-- ============================================================
-- PORTFOLIO — Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up all tables.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── HERO ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hero (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT,
  badge         TEXT DEFAULT 'Available for Work',
  subtitle      TEXT,
  roles         TEXT[]  DEFAULT '{}',
  avatar_url    TEXT,
  years_exp     INTEGER DEFAULT 0,
  projects_done INTEGER DEFAULT 0,
  clients       INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── ABOUT ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS about (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bio           TEXT,
  image_url     TEXT,
  years_exp     INTEGER DEFAULT 0,
  projects_done INTEGER DEFAULT 0,
  clients       INTEGER DEFAULT 0,
  awards        INTEGER DEFAULT 0,
  timeline      JSONB   DEFAULT '[]',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── PROJECTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT DEFAULT 'Full Stack',
  technologies  TEXT[]  DEFAULT '{}',
  image_url     TEXT,
  demo_url      TEXT,
  github_url    TEXT,
  featured      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── SKILLS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  category    TEXT DEFAULT 'Frontend',
  icon        TEXT DEFAULT '⚙️',
  level       INTEGER DEFAULT 80 CHECK (level >= 0 AND level <= 100),
  order_index INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── TESTIMONIALS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  role       TEXT,
  company    TEXT,
  quote      TEXT NOT NULL,
  rating     INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── CERTIFICATES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  issuer      TEXT NOT NULL,
  year        INTEGER NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── SERVICES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT,
  icon        TEXT DEFAULT '⚙️',
  order_index INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── SOCIAL LINKS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS social_links (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gmail      TEXT,
  whatsapp   TEXT,
  linkedin   TEXT,
  github     TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Public can read everything. Only authenticated users write.
-- ============================================================

ALTER TABLE hero         ENABLE ROW LEVEL SECURITY;
ALTER TABLE about        ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills       ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE services     ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public_read_hero"         ON hero         FOR SELECT USING (true);
CREATE POLICY "public_read_about"        ON about        FOR SELECT USING (true);
CREATE POLICY "public_read_projects"     ON projects     FOR SELECT USING (true);
CREATE POLICY "public_read_skills"       ON skills       FOR SELECT USING (true);
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "public_read_certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "public_read_services"     ON services     FOR SELECT USING (true);
CREATE POLICY "public_read_links"        ON social_links FOR SELECT USING (true);

-- Authenticated write policies
CREATE POLICY "auth_write_hero"         ON hero         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_about"        ON about        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_projects"     ON projects     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_skills"       ON skills       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_certificates" ON certificates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_services"     ON services     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_links"        ON social_links FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- REALTIME — Enable for live testimonials
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE testimonials;

-- ============================================================
-- STORAGE BUCKET
-- Run in Storage section OR via SQL:
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('portfolio-assets', 'portfolio-assets', true);

-- ============================================================
-- SAMPLE DATA (optional — delete before production)
-- ============================================================
INSERT INTO hero (name, badge, subtitle, roles, years_exp, projects_done, clients) VALUES
('Alex Doe', 'Available for Work',
 'crafting digital experiences that blend engineering precision with visual poetry.',
 ARRAY['Full Stack Developer','Frontend Engineer','UI Craftsman'],
 5, 40, 30
) ON CONFLICT DO NOTHING;

INSERT INTO social_links (gmail, whatsapp, linkedin, github) VALUES
('hello@example.com','1234567890','https://linkedin.com/in/username','https://github.com/username')
ON CONFLICT DO NOTHING;

INSERT INTO skills (name, category, icon, level, order_index) VALUES
('JavaScript','Frontend','⚡',95,1),
('React','Frontend','⚛️',90,2),
('Node.js','Backend','🟢',85,3),
('TypeScript','Frontend','🔷',88,4),
('PostgreSQL','Database','🐘',80,5),
('CSS / SCSS','Frontend','🎨',92,6),
('Python','Backend','🐍',75,7),
('Docker','DevOps','🐳',70,8)
ON CONFLICT DO NOTHING;

INSERT INTO services (title, description, icon, order_index) VALUES
('Web Development','Full-stack web applications built with modern frameworks and best practices.','🌐',1),
('UI Implementation','Pixel-perfect designs with smooth animations and micro-interactions.','🎨',2),
('Backend & APIs','Scalable REST & GraphQL APIs with robust auth and caching layers.','⚙️',3),
('Database Design','Optimized schemas, migrations, and query tuning for any scale.','🗄️',4),
('Automation & CI/CD','Deployment pipelines, Docker, and workflow automation.','🤖',5),
('Responsive Design','Mobile-first interfaces that look stunning on every screen.','📱',6)
ON CONFLICT DO NOTHING;
