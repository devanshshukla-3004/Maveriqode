declare global {
  interface Window {
    supabase: { createClient: (url: string, key: string, options?: Record<string, unknown>) => any };
  }
}
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://brqkeetjoluhtlwjcqen.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_sEnn60eBoVBPpDRhuvIz5A_VrLpgxWF';
export const supabase = window.supabase.createClient(supabaseUrl, supabasePublishableKey, {
  auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, flowType: 'pkce' },
});
