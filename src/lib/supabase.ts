import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.119.0';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://brqkeetjoluhtlwjcqen.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_sEnn60eBoVBPpDRhuvIz5A_VrLpgxWF';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
