// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://raergpuqjttquqhvuxyt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhZXJncHVxanR0cXVxaHZ1eHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyOTM2ODcsImV4cCI6MjA2MTg2OTY4N30.5_UMkydRAGf6CEddLd06tkmHQ5tvtXVFJWKTzzODcns";

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getAllSeeds() {
  const { data, error } = await supabase.from("seeds").select("*");
  if (error) {
    console.error("Error fetching seeds:", error);
    return [];
  }
  return data;
}
