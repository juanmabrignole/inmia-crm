import type { SupabaseClient, Session } from '@supabase/supabase-js';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient | null;
      getSession: () => Promise<Session | null>;
    }
  }
}

export {};
