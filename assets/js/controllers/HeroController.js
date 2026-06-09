/**
 * controllers/HeroController.js
 */
import { HeroModel }  from '../models/HeroModel.js';
import { HeroView }   from '../views/HeroView.js';
import { typewriter, animateCounter, initMedalPhysics } from '../utils/helpers.js';

export class HeroController {
  constructor() {
    this.model = new HeroModel();
    this.view  = new HeroView();
  }

  async init() {
    await this.model.load();
    this.view.render(this.model.data);
    this.view.renderSocials(this.model.links || this.model.data);

    // Typewriter roles
    const twEl = document.getElementById('hero-typewriter');
    if (twEl) typewriter(twEl, this.view.getRoles(this.model.data));

    // Medal physics
    initMedalPhysics(document.querySelector('.medal-wrapper'));

    // Stats counters
    document.querySelectorAll('#hero [data-target]').forEach(el => {
      new IntersectionObserver(([e], obs) => {
        if (e.isIntersecting) { animateCounter(el, +el.dataset.target); obs.unobserve(el); }
      }, { threshold: 0.5 }).observe(el);
    });
  }
}
