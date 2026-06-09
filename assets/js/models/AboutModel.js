/**
 * models/AboutModel.js — About section data layer
 */
import { AboutAPI } from '../services/api.js';

export class AboutModel {
  constructor() { this.data = null; }

  async load() {
    this.data = await AboutAPI.get().catch(() => null);
    return this;
  }

  async save(payload) { return AboutAPI.upsert(payload); }
}
