/**
 * controllers/SkillsController.js
 */
import { SkillModel }  from '../models/SkillModel.js';
import { SkillsView }  from '../views/SkillsView.js';
import { initRevealObserver } from '../utils/helpers.js';

export class SkillsController {
  constructor() {
    this.model = new SkillModel();
    this.view  = new SkillsView();
  }

  async init() {
    await this.model.load();
    this.view.render(this.model.skills);
    this.view.addTiltEffect();
    initRevealObserver();
  }
}
