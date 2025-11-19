// lib/supabase/client.ts
// Klien ini untuk Client Components ('use client')

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Buat klien Supabase untuk di sisi browser.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}