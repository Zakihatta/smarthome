// src/app/chat/[id]/page.tsx
import { createClient } from '../../../../lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import ChatRoom from '@/components/ChatRoom';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: conversationId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Validasi akses room
  const { data: chat } = await supabase.from('chat_conversations').select('id').eq('id', conversationId).single();
  if (!chat) notFound();

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/my-orders" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-white mb-6">Ruang Diskusi</h1>
        <ChatRoom conversationId={conversationId} currentUserId={user.id} />
      </div>
    </div>
  );
}