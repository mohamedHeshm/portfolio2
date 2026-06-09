/**
 * models/TestimonialModel.js — Testimonials data layer
 */
import { TestimonialsAPI } from '../services/api.js';

export class TestimonialModel {
  constructor() { this.testimonials = []; }

  async load() {
    this.testimonials = await TestimonialsAPI.getAll().catch(() => []);
    return this;
  }

  async create(t)     { const r = await TestimonialsAPI.create(t); this.testimonials.unshift(r); return r; }
  async update(id, t) { return TestimonialsAPI.update(id, t); }
  async delete(id)    { await TestimonialsAPI.delete(id); this.testimonials = this.testimonials.filter(t => t.id !== id); }
}
