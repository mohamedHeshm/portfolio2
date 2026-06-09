/**
 * controllers/AboutController.js
 */
import { AboutModel }  from '../models/AboutModel.js';
import { AboutView }   from '../views/AboutView.js';
import { animateCounter, initRevealObserver } from '../utils/helpers.js';

export class AboutController {
  constructor() {
    this.model = new AboutModel();
    this.view  = new AboutView();
  }

  async init() {
    await this.model.load();
    this.view.render(this.model.data);

    // Animate counters
    document.querySelectorAll('#about .counter-number[data-target]').forEach(el => {
      new IntersectionObserver(([e], obs) => {
        if (e.isIntersecting) { animateCounter(el, +el.dataset.target); obs.unobserve(el); }
      }, { threshold: 0.5 }).observe(el);
    });

    initRevealObserver();
  }
}
