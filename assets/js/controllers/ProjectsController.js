/**
 * controllers/ProjectsController.js
 */
import { ProjectModel }   from '../models/ProjectModel.js';
import { ProjectsView }   from '../views/ProjectsView.js';
import { initRevealObserver, initLazyImages } from '../utils/helpers.js';

export class ProjectsController {
  constructor() {
    this.model    = new ProjectModel();
    this.view     = new ProjectsView();
    this.category = 'all';
  }

  async init() {
    await this.model.load();
    this.view.renderFeatured(this.model.featured);
    this.view.renderFilters(this.model.getCategories(), 'all', cat => this._filter(cat));
    this._renderGrid(this.model.projects);
  }

  _filter(category) {
    this.category = category;
    this._renderGrid(this.model.filter(category));
  }

  _renderGrid(projects) {
    this.view.renderProjects(projects);
    setTimeout(() => { initRevealObserver(); initLazyImages(); }, 50);
  }
}
