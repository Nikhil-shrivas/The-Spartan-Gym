import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || localStorage.getItem('SPARTAN_SUPABASE_URL');
export const supabaseUrl = rawUrl ? rawUrl.trim().replace(/\/$/, '') : undefined;
export const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON || localStorage.getItem('SPARTAN_SUPABASE_KEY'))?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables are missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Types
export interface MemberData {
  id?: string;
  name: string;
  phone: string;
  membershipCode: string;
  plan: string;
  status: 'active' | 'paused' | 'expired' | 'extended';
  expiryDate: string;
  extendedDate?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StaffData {
  id?: string;
  name: string;
  phone?: string;
  role: string;
  staffCode: string;
  created_at?: string;
  updated_at?: string;
}

// Special Hardcoded Admin Code
export const ADMIN_TERMINAL_CODE = "TSGK3755V237]28";

// Error Handler
export function handleSupabaseError(error: any, operation: string, table: string | null = null) {
  const errorInfo = {
    error: error.message,
    code: error.code,
    operationType: operation,
    table: table,
    hint: error.hint
  };
  console.error("Supabase Error:", JSON.stringify(errorInfo, null, 2));
  throw new Error(`Gym Database Error: ${error.message}`);
}
