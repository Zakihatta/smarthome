// src/app/admin/services/actions.ts
'use server'

import { createClient } from '../../../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. Tambah Layanan Baru
export async function addService(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const price = formData.get('price') as string
  const description = formData.get('description') as string
  // Note: Untuk simplifikasi, image kita pakai placeholder dulu atau URL manual
  // Jika ingin upload, logikanya sama seperti upload avatar profil
  const imageUrl = '/imgs/placeholder.png' 

  const { error } = await supabase.from('services').insert({
    name,
    category,
    base_price: Number(price),
    description,
    image_url: imageUrl
  })

  if (error) throw new Error('Gagal menambah layanan')
  revalidatePath('/admin/services')
  revalidatePath('/order') // Refresh juga halaman order user
}

// 2. Edit Layanan
export async function updateService(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const price = formData.get('price') as string
  const description = formData.get('description') as string

  const { error } = await supabase.from('services').update({
    name,
    category,
    base_price: Number(price),
    description
  }).eq('id', id)

  if (error) throw new Error('Gagal update layanan')
  revalidatePath('/admin/services')
  revalidatePath('/order')
}

// 3. Hapus Layanan
export async function deleteService(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('services').delete().eq('id', id)

  if (error) throw new Error('Gagal menghapus layanan')
  revalidatePath('/admin/services')
  revalidatePath('/order')
}