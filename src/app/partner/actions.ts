// src/app/partner/actions.ts
'use server'

import { createClient } from '../../../lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 1. Action: Mendaftar jadi Mitra
export async function joinPartner() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  // A. Update Role di Profile jadi 'partner'
  await supabase.from('profiles').update({ role: 'partner' }).eq('id', user.id)

  // B. Buat data di tabel Partners (Default: Offline & Verified untuk demo)
  const { error } = await supabase.from('partners').insert({
    id: user.id,
    status: 'open_for_work', // Langsung open agar muncul di admin
    verification_status: 'pending', // Langsung verified agar bisa kerja (demo)
    bio: 'Teknisi baru siap bekerja.',
    average_rating: 5.0
  })

  if (error) {
    // Jika error (misal sudah terdaftar), abaikan saja dan redirect
    console.log("Partner creation info:", error.message)
  }

  redirect('/partner') // Arahkan ke dashboard mitra
}

// 2. Action: Toggle Status (Online/Offline)
export async function toggleStatus(currentStatus: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const newStatus = currentStatus === 'open_for_work' ? 'busy' : 'open_for_work'

  await supabase
    .from('partners')
    .update({ status: newStatus })
    .eq('id', user.id)

  revalidatePath('/partner')
}

// 3. Action: Selesaikan Pekerjaan
export async function completeOrder(orderId: string) {
  const supabase = await createClient()
  
  await supabase
    .from('orders')
    .update({ status: 'completed' })
    .eq('id', orderId)

  revalidatePath('/partner')
}