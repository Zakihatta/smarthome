// src/app/rating/actions.ts
'use server'

import { createClient } from '../../../lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitRating(orderId: string, partnerId: string, ratingValue: number, comment: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 1. Simpan Rating (Trigger SQL akan otomatis update rata-rata mitra)
  const { error } = await supabase
    .from('ratings')
    .insert({
      order_id: orderId,
      user_id: user.id,
      partner_id: partnerId,
      rating_value: ratingValue,
      comment: comment
    })

  if (error) {
    console.error("Rating error:", error)
    throw new Error("Gagal menyimpan rating")
  }

  // 2. Refresh halaman agar tombol 'Beri Ulasan' hilang
  revalidatePath('/my-orders')
  revalidatePath('/partners') 
}