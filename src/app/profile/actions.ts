// src/app/profile/actions.ts
'use server'

import { createClient } from '../../../lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  // Ambil User saat ini
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const fullName = formData.get('fullName') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  const file = formData.get('avatar') as File | null

  // Objek data yang akan diupdate ke tabel profiles
  const updates: { 
    full_name?: string; 
    address?: string; 
    phone_number?: string; 
    avatar_url?: string;
    updated_at: string;
  } = {
    full_name: fullName,
    address: address,
    phone_number: phone,
    updated_at: new Date().toISOString(),
  }

  // --- LOGIKA UPLOAD FOTO ---
  if (file && file.size > 0) {
    // 1. Buat nama file unik (user_id + timestamp) agar tidak bentrok
    // Menggunakan user.id di nama file memudahkan identifikasi kepemilikan
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    
    // 2. Upload ke Bucket 'avatars'
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(fileName, file, {
        upsert: true // Timpa jika ada file dengan nama sama (opsional)
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return redirect('/profile?message=Gagal upload foto. Pastikan ukuran < 2MB.')
    }

    // 3. Dapatkan URL Publik
    const { data: { publicUrl } } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(fileName)
    
    // Simpan URL ke objek updates
    updates.avatar_url = publicUrl
  }

  // --- UPDATE DATABASE (Tabel Profiles) ---
  const { error: updateError } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  // Update juga metadata auth user (opsional, untuk sinkronisasi cepat di sisi klien)
  if (fullName || updates.avatar_url) {
    await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        avatar_url: updates.avatar_url // Update avatar di metadata juga
      }
    })
  }

  if (updateError) {
     console.error('Profile update error:', updateError)
     return redirect('/profile?message=Gagal update data profile')
  }

  revalidatePath('/', 'layout') // Refresh semua halaman agar navbar berubah
  redirect('/profile?message=Profil berhasil diperbarui!')
}