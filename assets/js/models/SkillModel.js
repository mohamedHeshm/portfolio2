/**
 * models/SkillModel.js — Skills data layer
 */
import { SkillsAPI } from '../services/api.js';

export class SkillModel {
  constructor() { this.skills = []; }

  async load() {
    this.skills = await SkillsAPI.getAll().catch(() => []);
    return this;
  }

  async create(s)     { const r = await SkillsAPI.create(s); this.skills.push(r); return r; }
  async update(id, s) { return SkillsAPI.update(id, s); }
  async delete(id)    { await SkillsAPI.delete(id); this.skills = this.skills.filter(s => s.id !== id); }

  getCategories() {
    return [...new Set(this.skills.map(s => s.category).filter(Boolean))];
  }
}
