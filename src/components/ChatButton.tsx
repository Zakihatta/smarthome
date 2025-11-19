'use client'; // Wajib Client Component untuk onClick/form

import { MessageCircle } from 'lucide-react';
import { openChat } from '@/app/chat/actions'; // Import action backend kita
import { useRouter } from 'next/navigation'; // Pakai router client
import { useState } from 'react';

export default function ChatButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChat = async () => {
    setLoading(true);
    try {
      // Panggil Server Action
      const chatId = await openChat(orderId);
      if (chatId) {
        router.push(`/chat/${chatId}`);
      }
    } catch (error) {
      console.error("Gagal membuka chat", error);
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleChat}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-[#2F2F2F] text-white text-xs font-bold rounded-full border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
    >
      <span className={`w-2 h-2 rounded-full bg-green-500 ${loading ? 'animate-none bg-gray-400' : 'animate-pulse'}`}/> 
      {loading ? 'Loading...' : 'Chat Mitra'}
    </button>
  );
}