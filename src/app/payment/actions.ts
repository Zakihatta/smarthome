// src/app/payment/actions.ts
'use server'

import { createClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function activatePlan(planId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  console.log("Mengaktifkan plan untuk:", user.email, "Plan:", planId);

  if (planId === 'partner') {
    // 1. Ubah Role jadi partner
    await supabase.from('profiles').update({ role: 'partner' }).eq('id', user.id)

    // 2. Cek/Buat data partner
    const { data: existing } = await supabase.from('partners').select('id').eq('id', user.id).single()
    if (!existing) {
      await supabase.from('partners').insert({
        id: user.id,
        status: 'open_for_work',
        verification_status: 'verified',
        bio: 'Mitra Profesional SmartHome',
        average_rating: 5.0
      })
    }
    
    revalidatePath('/', 'layout')
    redirect('/partner')

  } else if (planId === 'premium') {
    // Update Metadata Premium
    await supabase.auth.updateUser({
      data: { is_premium: true }
    })

    revalidatePath('/', 'layout')
    redirect('/?premium_success=true')
  }
}