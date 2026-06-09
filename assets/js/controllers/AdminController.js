/**
 * controllers/AdminController.js — Admin dashboard logic
 */
import { getClient }       from '../services/supabase.js';
import { ProjectsAPI, SkillsAPI, TestimonialsAPI,
         CertificatesAPI, ServicesAPI,
         HeroAPI, AboutAPI, SocialLinksAPI } from '../services/api.js';
import { StorageService }  from '../services/storage.js';

export class AdminController {
  constructor() { this.user = null; }

  /* ── Auth ───────────────────────────────── */
  async login(email, password) {
    const sb = await getClient();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this.user = data.user;
    return data;
  }

  async logout() {
    const sb = await getClient();
    await sb.auth.signOut();
    window.location.href = '../index.html';
  }

  async getSession() {
    const sb = await getClient();
    const { data } = await sb.auth.getSession();
    this.user = data.session?.user ?? null;
    return this.user;
  }

  /* ── Hero / About ───────────────────────── */
  loadHero()        { return HeroAPI.get(); }
  saveHero(p)       { return HeroAPI.upsert(p); }
  loadAbout()       { return AboutAPI.get(); }
  saveAbout(p)      { return AboutAPI.upsert(p); }
  loadLinks()       { return SocialLinksAPI.get(); }
  saveLinks(p)      { return SocialLinksAPI.upsert(p); }

  /* ── Projects ───────────────────────────── */
  loadProjects()         { return ProjectsAPI.getAll(); }
  createProject(p)       { return ProjectsAPI.create(p); }
  updateProject(id, p)   { return ProjectsAPI.update(id, p); }
  deleteProject(id)      { return ProjectsAPI.delete(id); }

  /* ── Skills ─────────────────────────────── */
  loadSkills()           { return SkillsAPI.getAll(); }
  createSkill(s)         { return SkillsAPI.create(s); }
  updateSkill(id, s)     { return SkillsAPI.update(id, s); }
  deleteSkill(id)        { return SkillsAPI.delete(id); }

  /* ── Testimonials ───────────────────────── */
  loadTestimonials()     { return TestimonialsAPI.getAll(); }
  createTestimonial(t)   { return TestimonialsAPI.create(t); }
  deleteTestimonial(id)  { return TestimonialsAPI.delete(id); }

  /* ── Certificates ───────────────────────── */
  loadCerts()            { return CertificatesAPI.getAll(); }
  createCert(c)          { return CertificatesAPI.create(c); }
  updateCert(id, c)      { return CertificatesAPI.update(id, c); }
  deleteCert(id)         { return CertificatesAPI.delete(id); }

  /* ── Services ───────────────────────────── */
  loadServices()         { return ServicesAPI.getAll(); }
  createService(s)       { return ServicesAPI.create(s); }
  updateService(id, s)   { return ServicesAPI.update(id, s); }
  deleteService(id)      { return ServicesAPI.delete(id); }

  /* ── Storage ────────────────────────────── */
  uploadImage(file, folder = 'images') { return StorageService.upload(file, folder); }
}
