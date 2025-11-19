// lib/supabase/server.ts

// 1. Pastikan 'type CookieOptions' di-import
import { createServerClient, type CookieOptions } from '@supabase/ssr' 
import { cookies } from 'next/headers'

// 2. Gunakan 'async' (perbaikan Anda)
export async function createClient() {
  // 3. Gunakan 'await' (perbaikan Anda)
  const cookieStore = await cookies()

  // Buat klien Supabase untuk di sisi server.
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // 4. Tambahkan 'CookieOptions' (perbaikan saya)
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Cookie hanya bisa di-set di Server Actions atau Route Handlers.
            // Jika error, abaikan (ini terjadi saat render Server Component)
          }
        },
        // 5. Tambahkan 'CookieOptions' (perbaikan saya)
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Cookie hanya bisa di-set di Server Actions atau Route Handlers.
            // Jika error, abaikan (ini terjadi saat render Server Component)
          }
        },
      },
    }
  )
}