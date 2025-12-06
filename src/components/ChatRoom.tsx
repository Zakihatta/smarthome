// src/components/ChatRoom.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '../../lib/supabase/client'
import { Send, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { sendMessage } from '@/app/chat/actions'

// Definisi Tipe Data
type Message = {
  id: number;
  sender_id: string;
  message_text: string;
  created_at: string;
  profiles?: { full_name: string; avatar_url: string };
}

export default function ChatRoom({ conversationId, currentUserId }: { conversationId: string; currentUserId: string }) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false) // Loading state saat kirim
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fungsi scroll otomatis ke bawah
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    // 1. Load Pesan Awal (History Chat)
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*, profiles:sender_id(full_name, avatar_url)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      
      if (data) {
        setMessages(data as unknown as Message[]) // Casting aman
        scrollToBottom()
      }
    }
    fetchMessages()

    // 2. SUBSCRIBE REALTIME (Ini kuncinya!)
    const channel = supabase
      .channel(`room-${conversationId}`) // Nama channel unik per room
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // Dengarkan hanya jika ada INSERT baru
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}` // Hanya pesan di room ini
        },
        async (payload) => {
          // Saat pesan baru masuk via Realtime, kita hanya dapat data mentah (tanpa profil)
          const newMsgRaw = payload.new;

          // Kita harus fetch profil pengirimnya secara manual agar avatar muncul
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', newMsgRaw.sender_id)
            .single();

          // Gabungkan data pesan + profil
          const newMsg = {
            ...newMsgRaw,
            profiles: senderProfile
          } as Message;

          // Update State (Tanpa Refresh!)
          setMessages((current) => [...current, newMsg])
          scrollToBottom()
        }
      )
      .subscribe()

    // Cleanup saat keluar halaman
    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, supabase])

  // Scroll setiap kali pesan bertambah
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle Kirim Pesan
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return
    
    setIsSending(true)
    
    // Kirim ke server
    await sendMessage(conversationId, newMessage)
    
    // Reset input (Pesan baru akan muncul otomatis via listener Realtime di atas)
    setNewMessage('')
    setIsSending(false)
  }

  return (
    <div className="flex flex-col h-[600px] bg-[#212121] rounded-3xl border border-white/10 overflow-hidden">
      
      {/* Header Chat */}
      <div className="bg-[#2F2F2F] p-4 border-b border-white/10">
        <h3 className="text-white font-bold">Live Chat</h3>
        <p className="text-xs text-gray-400">Diskusi langsung</p>
      </div>

      {/* Area Pesan */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-black/20">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
               <div className={`flex max-w-[80%] gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 relative flex-shrink-0">
                     <Image 
                       src={msg.profiles?.avatar_url || `https://ui-avatars.com/api/?name=User&background=random`} 
                       alt="Avatar" fill className="object-cover" unoptimized
                     />
                  </div>
                  
                  {/* Bubble Chat */}
                  <div>
                    <div className={`px-4 py-2 rounded-2xl text-sm ${
                      isMe 
                        ? 'bg-primary text-background rounded-tr-none font-bold' 
                        : 'bg-[#2F2F2F] text-white rounded-tl-none border border-white/5'
                    }`}>
                      {msg.message_text}
                    </div>
                    <p className={`text-[10px] text-gray-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
               </div>
            </div>
          )
        })}
        {/* Elemen kosong untuk target scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-[#2F2F2F] border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Tulis pesan..."
          className="flex-grow bg-[#212121] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary border border-transparent placeholder-gray-500"
        />
        <button 
          type="submit" 
          disabled={isSending || !newMessage.trim()}
          className="bg-primary text-background p-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </form>

    </div>
  )
}