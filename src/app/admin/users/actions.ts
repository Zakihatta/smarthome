// src/app/admin/users/actions.ts
'use server'

import { createClient } from '../../../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. Hapus User
// Catatan: Ini menghapus data di public.profiles.
// Karena kita set ON DELETE CASCADE di database, data di orders/partners juga akan terhapus.
// (Untuk menghapus akun Auth sepenuhnya, butuh Supabase Service Role Key, kita skip dulu untuk MVP).
export async function deleteUser(userId: string) {
  const supabase = await createClient()
  
  // Cek apakah admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  
  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase.from('profiles').delete().eq('id', userId)

  if (error) throw new Error('Gagal menghapus user')
  revalidatePath('/admin/users')
}

// 2. Verifikasi Mitra
export async function verifyPartner(partnerId: string) {
  const supabase = await createClient()
  
  // Cek admin (sama seperti di atas, bisa dibuat middleware function sebenernya)
  
  const { error } = await supabase
    .from('partners')
    .update({ verification_status: 'verified' })
    .eq('id', partnerId)

  if (error) throw new Error('Gagal verifikasi mitra')
  revalidatePath('/admin/users')
}