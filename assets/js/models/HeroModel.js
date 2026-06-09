/**
 * models/HeroModel.js — Hero section data layer
 */
import { HeroAPI, SocialLinksAPI } from '../services/api.js';

export class HeroModel {
  constructor() {
    this.data  = null;
    this.links = null;
  }

  async load() {
    [this.data, this.links] = await Promise.all([
      HeroAPI.get().catch(() => null),
      SocialLinksAPI.get().catch(() => null)
    ]);
    return this;
  }

  async save(payload)      { return HeroAPI.upsert(payload); }
  async saveLinks(payload) { return SocialLinksAPI.upsert(payload); }
}
