/**
 * services/storage.js
 * Supabase Storage helpers for image/file uploads.
 */

import { getClient } from './supabase.js';

const BUCKET = 'portfolio-assets';

export const StorageService = {

  /** Upload a File object, returns public URL */
  async upload(file, folder = 'images') {
    const sb   = await getClient();
    const ext  = file.name.split('.').pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await sb.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
    if (error) throw error;

    const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  },

  /** Delete a file by its path */
  async delete(path) {
    const sb = await getClient();
    const { error } = await sb.storage.from(BUCKET).remove([path]);
    if (error) throw error;
    return true;
  },

  /** Get public URL for an existing path */
  async getUrl(path) {
    const sb = await getClient();
    const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  },

  /** List files in a folder */
  async list(folder = 'images') {
    const sb = await getClient();
    const { data, error } = await sb.storage.from(BUCKET).list(folder);
    if (error) throw error;
    return data;
  }
};

export default StorageService;
