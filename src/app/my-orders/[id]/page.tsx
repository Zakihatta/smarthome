// src/app/my-orders/[id]/page.tsx
import { createClient } from '../../../../lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, MapPin, FileText } from 'lucide-react';
import { notFound } from 'next/navigation';
import ChatButton from '@/components/ChatButton'; // <-- Import komponen baru

// --- 1. DEFINISI TIPE DATA ---
type OrderDetailData = {
  id: string;
  status: string;
  total_price: number;
  scheduled_at: string;
  order_details: {
    address?: string;
    notes?: string;
  };
  services: {
    name: string;
    image_url: string;
    category?: string;
  } | null;
};

// Helper Format Rupiah
const formatRupiah = (price: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
};

// Helper Format Tanggal
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

// Helper Status Badge
const getStatusBadge = (status: string) => {
  const badgeStyles = {
    pending_assignment: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Mencari Teknisi' },
    in_progress: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Sedang Dikerjakan' },
    completed: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Selesai' },
    default: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: status },
  };

  const config = badgeStyles[status as keyof typeof badgeStyles] || badgeStyles.default;

  return (
    <span className={`px-3 py-1 ${config.bg} ${config.text} text-xs font-bold rounded-full uppercase tracking-wider`}>
      {config.label}
    </span>
  );
};

export default async function OrderDetailView({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const supabase = await createClient();

  // --- 2. FETCH DATA ---
  const { data: rawData, error } = await supabase
    .from('orders')
    .select(`
      *,
      services (
        name,
        image_url,
        category
      )
    `)
    .eq('id', id)
    .single();

  if (error || !rawData) {
    console.error("Order not found:", error);
    notFound();
  }

  const order = rawData as unknown as OrderDetailData;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Tombol Kembali */}
        <Link href="/my-orders" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Kembali ke Riwayat
        </Link>

        <div className="bg-[#2F2F2F] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          
          {/* Header Status */}
          <div className="bg-white/5 p-6 flex justify-between items-center border-b border-white/10">
            <div>
               <p className="text-sm text-gray-400 mb-1">Order ID</p>
               <p className="font-mono text-white text-sm tracking-wide">#{order.id.slice(0,8).toUpperCase()}</p>
            </div>

            <div className="flex items-center gap-3">
              
              {/* --- TOMBOL CHAT (Komponen Terpisah) --- */}
              {(order.status === 'in_progress' || order.status === 'completed') && (
                 <ChatButton orderId={order.id} />
              )}
              
              {getStatusBadge(order.status)}
            </div>
          </div>

          {/* Info Service Utama */}
          <div className="p-8">
            <div className="flex gap-6 mb-8 items-start">
               <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-black/30 flex-shrink-0 border border-white/10">
                  <Image 
                    src={order.services?.image_url || '/imgs/placeholder.png'} 
                    alt="Service" 
                    fill 
                    className="object-cover" 
                  />
               </div>
               <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {order.services?.name || 'Layanan Tidak Dikenal'}
                  </h1>
                  <p className="text-gray-400 text-sm mb-2">{order.services?.category || 'General'}</p>
                  <p className="text-primary text-xl font-bold">{formatRupiah(order.total_price)}</p>
               </div>
            </div>

            {/* Grid Rincian */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
               
               {/* Jadwal */}
               <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase font-bold flex items-center gap-2">
                    <Calendar size={14} className="text-primary"/> Jadwal Pengerjaan
                  </label>
                  <p className="text-white font-medium">{formatDate(order.scheduled_at)}</p>
               </div>

               {/* Lokasi */}
               <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase font-bold flex items-center gap-2">
                    <MapPin size={14} className="text-primary"/> Lokasi
                  </label>
                  <p className="text-white font-medium leading-relaxed">
                    {order.order_details?.address || '-'}
                  </p>
               </div>

               {/* Catatan */}
               <div className="space-y-2 md:col-span-2">
                  <label className="text-xs text-gray-500 uppercase font-bold flex items-center gap-2">
                    <FileText size={14} className="text-primary"/> Catatan Tambahan
                  </label>
                  <div className="p-4 bg-[#212121] rounded-xl border border-white/5 text-gray-300 text-sm leading-relaxed">
                    {order.order_details?.notes ? `"${order.order_details.notes}"` : 'Tidak ada catatan tambahan.'}
                  </div>
               </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}