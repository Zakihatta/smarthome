// src/app/partner/profile/actions.ts
'use server'

import { createClient } from '../../../../lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updatePartnerProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const bio = formData.get('bio') as string
  // Ambil semua checkbox yang dicentang dengan nama 'skills'
  const selectedSkills = formData.getAll('skills') as string[] 

  // 1. Update Bio di tabel partners
  const { error: partnerError } = await supabase
    .from('partners')
    .update({ bio: bio })
    .eq('id', user.id)

  if (partnerError) {
      return redirect('/partner/profile?message=Gagal menyimpan bio')
  }

  // 2. Update Skills (Konsep: Hapus semua yang lama -> Masukkan yang baru)
  
  // A. Hapus skill lama milik user ini
  await supabase
    .from('partner_skills')
    .delete()
    .eq('partner_id', user.id)

  // B. Masukkan skill baru (jika ada yang dipilih)
  if (selectedSkills.length > 0) {
    const skillsToInsert = selectedSkills.map(skillId => ({
      partner_id: user.id,
      skill_id: skillId
    }))

    const { error: skillError } = await supabase
      .from('partner_skills')
      .insert(skillsToInsert)

    if (skillError) {
      console.error("Skill update error:", skillError)
      return redirect('/partner/profile?message=Bio tersimpan tapi gagal update skill')
    }
  }

  revalidatePath('/partner')
  redirect('/partner/profile?message=Profil dan Skill berhasil diperbarui!')
}