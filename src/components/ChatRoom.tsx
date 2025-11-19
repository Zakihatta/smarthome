// src/components/ChatRoom.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '../../lib/supabase/client' // Gunakan client supabase
import { Send } from 'lucide-react'
import Image from 'next/image'
import { sendMessage } from '@/app/chat/actions'

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    // 1. Ambil pesan lama
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*, profiles:sender_id(full_name, avatar_url)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      
      // PERBAIKAN DI SINI:
      // Ganti 'data as any' menjadi 'data as Message[]'
      // Atau jika masih merah, gunakan 'data as unknown as Message[]'
      if (data) {
        setMessages(data as Message[]) 
      }
      
      scrollToBottom()
    }
    fetchMessages()

    // 2. Subscribe Realtime (Pesan Baru Masuk)
    const channel = supabase
      .channel('chat_room')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${conversationId}` },
        async (payload) => {
          // Fetch sender info
          const { data: sender } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', payload.new.sender_id).single()
          const newMsg = { ...payload.new, profiles: sender } as Message
          
          setMessages((prev) => [...prev, newMsg])
          scrollToBottom()
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [conversationId, supabase])

  useEffect(() => scrollToBottom(), [messages])

  // Kirim Pesan
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    await sendMessage(conversationId, newMessage)
    setNewMessage('')
  }

  return (
    <div className="flex flex-col h-[600px] bg-[#212121] rounded-3xl border border-white/10 overflow-hidden">
      {/* Header */}
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
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 relative flex-shrink-0">
                     <Image src={msg.profiles?.avatar_url || '/imgs/placeholder.png'} alt="Avatar" fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <div className={`px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-primary text-background rounded-tr-none font-medium' : 'bg-[#2F2F2F] text-white rounded-tl-none border border-white/5'}`}>
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-[#2F2F2F] border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Tulis pesan..."
          className="flex-grow bg-[#212121] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary border border-transparent placeholder-gray-500"
        />
        <button type="submit" className="bg-primary text-background p-3 rounded-xl hover:bg-primary-dark transition-colors">
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}