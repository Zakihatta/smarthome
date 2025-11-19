// src/app/chat/actions.ts
'use server'

import { createClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'

// 1. Buka/Buat Room Chat
export async function openChat(orderId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  // A. Cek apakah chat room sudah ada untuk order ini?
  const { data: existingChat } = await supabase
    .from('chat_conversations')
    .select('id')
    .eq('order_id', orderId)
    .single()

  if (existingChat) {
    return existingChat.id // Kembalikan ID chat
  }

  // B. Jika belum, ambil data order untuk tahu partnernya siapa
  const { data: order } = await supabase
    .from('orders')
    .select('user_id, assigned_partner_id')
    .eq('id', orderId)
    .single()

  if (!order || !order.assigned_partner_id) {
    // Tidak bisa chat kalau belum ada mitra
    return null 
  }

  // C. Buat room baru
  const { data: newChat, error } = await supabase
    .from('chat_conversations')
    .insert({
      order_id: orderId,
      user_id: order.user_id,
      partner_id: order.assigned_partner_id
    })
    .select()
    .single()

  if (error) throw new Error('Gagal membuat chat')
  
  return newChat.id
}

// 2. Kirim Pesan
export async function sendMessage(conversationId: string, messageText: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  await supabase.from('chat_messages').insert({
    conversation_id: conversationId,
    sender_id: user.id,
    message_text: messageText
  })
}