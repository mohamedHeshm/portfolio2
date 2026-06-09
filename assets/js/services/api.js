/**
 * services/api.js
 * Centralized API wrappers around Supabase tables.
 * Controllers call these; models use these internally.
 */

import { getClient } from './supabase.js';

/* ─── Generic helpers ─────────────────────────────────────── */

async function query(table, options = {}) {
  const sb = await getClient();
  let q = sb.from(table).select(options.select || '*');
  if (options.eq)     Object.entries(options.eq).forEach(([k,v]) => q = q.eq(k, v));
  if (options.order)  q = q.order(options.order.col, { ascending: options.order.asc ?? true });
  if (options.limit)  q = q.limit(options.limit);
  if (options.single) q = q.single();
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

async function insert(table, payload) {
  const sb = await getClient();
  const { data, error } = await sb.from(table).insert(payload).select().single();
  if (error) throw error;
  return data;
}

async function update(table, id, payload) {
  const sb = await getClient();
  const { data, error } = await sb.from(table).update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

async function remove(table, id) {
  const sb = await getClient();
  const { error } = await sb.from(table).delete().eq('id', id);
  if (error) throw error;
  return true;
}

/* ─── Domain APIs ─────────────────────────────────────────── */

export const HeroAPI = {
  get:    () => query('hero', { single: true }),
  upsert: async (payload) => {
    const sb = await getClient();
    const { data, error } = await sb.from('hero').upsert(payload).select().single();
    if (error) throw error;
    return data;
  }
};

export const AboutAPI = {
  get:    () => query('about', { single: true }),
  upsert: async (payload) => {
    const sb = await getClient();
    const { data, error } = await sb.from('about').upsert(payload).select().single();
    if (error) throw error;
    return data;
  }
};

export const ProjectsAPI = {
  getAll:      (opts = {}) => query('projects', {
    order: opts.order ?? { col: 'created_at', asc: false },
    ...opts
  }),
  getFeatured: () => query('projects', { eq: { featured: true }, limit: 1, single: true }),
  getById:     (id) => query('projects', { eq: { id }, single: true }),
  create:      (p) => insert('projects', p),
  update:      (id, p) => update('projects', id, p),
  delete:      (id) => remove('projects', id)
};

export const SkillsAPI = {
  getAll:   () => query('skills', { order: { col: 'order_index', asc: true } }),
  create:   (s) => insert('skills', s),
  update:   (id, s) => update('skills', id, s),
  delete:   (id) => remove('skills', id)
};

export const TestimonialsAPI = {
  getAll:   () => query('testimonials', { order: { col: 'created_at', asc: false } }),
  create:   (t) => insert('testimonials', t),
  update:   (id, t) => update('testimonials', id, t),
  delete:   (id) => remove('testimonials', id)
};

export const CertificatesAPI = {
  getAll:   () => query('certificates', { order: { col: 'year', asc: false } }),
  create:   (c) => insert('certificates', c),
  update:   (id, c) => update('certificates', id, c),
  delete:   (id) => remove('certificates', id)
};

export const ServicesAPI = {
  getAll:   () => query('services', { order: { col: 'order_index', asc: true } }),
  create:   (s) => insert('services', s),
  update:   (id, s) => update('services', id, s),
  delete:   (id) => remove('services', id)
};

export const SocialLinksAPI = {
  get:    () => query('social_links', { single: true }),
  upsert: async (payload) => {
    const sb = await getClient();
    const { data, error } = await sb.from('social_links').upsert(payload).select().single();
    if (error) throw error;
    return data;
  }
};

/* ─── Realtime subscription helper ────────────────────────── */
export async function subscribe(table, callback) {
  const sb = await getClient();
  return sb.channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe();
}

export default { HeroAPI, AboutAPI, ProjectsAPI, SkillsAPI, TestimonialsAPI,
                 CertificatesAPI, ServicesAPI, SocialLinksAPI, subscribe };
