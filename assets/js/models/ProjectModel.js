/**
 * models/ProjectModel.js — Projects data layer
 */
import { ProjectsAPI } from '../services/api.js';

export class ProjectModel {
  constructor() {
    this.projects = [];
    this.featured  = null;
  }

  async load() {
    [this.projects, this.featured] = await Promise.all([
      ProjectsAPI.getAll().catch(() => []),
      ProjectsAPI.getFeatured().catch(() => null)
    ]);
    return this;
  }

  async create(p)     { const r = await ProjectsAPI.create(p); this.projects.unshift(r); return r; }
  async update(id, p) { return ProjectsAPI.update(id, p); }
  async delete(id)    { await ProjectsAPI.delete(id); this.projects = this.projects.filter(p => p.id !== id); }

  filter(category) {
    return category === 'all'
      ? this.projects
      : this.projects.filter(p => p.category === category);
  }

  getCategories() {
    return ['all', ...new Set(this.projects.map(p => p.category).filter(Boolean))];
  }
}
