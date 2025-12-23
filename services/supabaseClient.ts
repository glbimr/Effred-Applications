import { createClient } from '@supabase/supabase-js';

// Credentials provided by the user
const supabaseUrl = 'https://ptcejmgkctinjzvvpudf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y2VqbWdrY3Rpbmp6dnZwdWRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MDcwOTIsImV4cCI6MjA3OTI4MzA5Mn0.aNwE0o6u7uHfwlf0uYtGSnYeNPKNWt6MliezIGYjHPQ';

// Since credentials are hardcoded, configuration is guaranteed
export const isSupabaseConfigured = true;

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);