// src/app/admin/actions.ts
'use server'

import { createClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function assignPartner(orderId: string, partnerId: string) {
  const supabase = await createClient()

  console.log(`Mencoba menugaskan: Order ${orderId} ke Mitra ${partnerId}`);

  // Update tabel orders
  const { data, error } = await supabase
    .from('orders')
    .update({
      assigned_partner_id: partnerId, 
      status: 'in_progress'           
    })
    .eq('id', orderId)
    .select(); // Tambahkan select untuk melihat data yang berubah

  if (error) {
    console.error("GAGAL UPDATE DB:", error.message);
    throw new Error("Gagal menugaskan mitra");
  }

  if (data.length === 0) {
    console.error("UPDATE BERHASIL TAPI DATA TIDAK BERUBAH. MUNGKIN RLS MEMBLOKIR.");
  } else {
    console.log("BERHASIL UPDATE:", data);
  }

  revalidatePath('/admin')
  revalidatePath('/partner') // Refresh juga halaman partner
  redirect('/admin')
}