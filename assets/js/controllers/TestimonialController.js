/**
 * controllers/TestimonialController.js
 */
import { TestimonialModel } from '../models/TestimonialModel.js';
import { TestimonialView }  from '../views/TestimonialView.js';
import { subscribe }        from '../services/api.js';

export class TestimonialController {
  constructor() {
    this.model = new TestimonialModel();
    this.view  = new TestimonialView();
  }

  async init() {
    await this.model.load();
    this.view.render(this.model.testimonials);

    // Realtime: append new testimonials instantly
    subscribe('testimonials', payload => {
      if (payload.eventType === 'INSERT') {
        this.model.testimonials.push(payload.new);
        this.view.appendSlide(payload.new);
      }
    }).catch(() => {/* Supabase not configured */});
  }
}
