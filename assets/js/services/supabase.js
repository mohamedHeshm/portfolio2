/**
 * services/supabase.js
 * Supabase client singleton — import this everywhere you need DB access.
 * Replace SUPABASE_URL and SUPABASE_ANON_KEY with your project values.
 */

const SUPABASE_URL      = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

// Lazy-load the Supabase CDN SDK so it doesn't block the main thread
let _client = null;

async function getClient() {
  if (_client) return _client;

  // If supabase is already on window (loaded via <script>), use it
  if (window.supabase?.createClient) {
    _client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
    return _client;
  }

  // Dynamic import fallback
  const { createClient } = await import(
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'
  );
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true }
  });
  return _client;
}

export { getClient };
export default { getClient };
