import { createClient } from "@supabase/supabase-js";

// Read environment variables or fallback to project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zbeumwsevdpokcojemqx.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZXVtd3NldmRwb2tjb2plbXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjEzNTQsImV4cCI6MjEwMDM5NzM1NH0.CD2MMheIH-OduPNohwZRwlpulLl9T7NnFn9dJBbqFrU";

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
