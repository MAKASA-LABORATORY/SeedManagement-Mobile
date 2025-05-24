import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ffbdsahjwtkuyknachnf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmYmRzYWhqd3RrdXlrbmFjaG5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODkyMjgsImV4cCI6MjA2MzQ2NTIyOH0.fMqMGU2TtzA9GvpppgCP8w8ulYzWeqXICC0NPUAE5AY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  realtime: { enabled: true },
});