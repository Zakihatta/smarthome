// src/app/order/actions.ts
'use server'

import { createClient } from '../../../lib/supabase/server';
import { redirect } from 'next/navigation'

export async function placeOrder(formData: FormData) {
  const supabase = await createClient()

  // 1. Cek apakah user login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return redirect('/login?message=Silakan login untuk melakukan pemesanan.')
  }

  // 2. Ambil data dari form
  const serviceId = formData.get('serviceId') as string
  const price = formData.get('price') as string
  const date = formData.get('date') as string
  const address = formData.get('address') as string
  const notes = formData.get('notes') as string

  // 3. Simpan ke database (Tabel: orders)
  const { error } = await supabase.from('orders').insert({
    user_id: user.id,
    service_id: serviceId,
    total_price: Number(price), // Harga dasar (bisa dikembangkan nanti)
    status: 'pending_assignment', // Status awal
    scheduled_at: new Date(date).toISOString(),
    order_details: {
      address: address,
      notes: notes
    }
  })

  if (error) {
    console.error('Order Error:', error)
    return redirect(`/order/${serviceId}?message=Gagal membuat pesanan.`)
  }

  // 4. Redirect ke halaman sukses (atau profil)
  redirect('/order/success')
}