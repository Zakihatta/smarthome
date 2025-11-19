// src/app/my-orders/page.tsx
import { createClient } from '../../../lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import RateButton from '@/components/RateButton'; // Import komponen Rating

// --- 1. DEFINISI TIPE DATA ---
type Service = {
  name: string;
  image_url: string;
};

type OrderDetails = {
  address?: string;
  notes?: string;
};

type OrderWithService = {
  id: string;
  created_at: string;
  status: string;
  total_price: number;
  scheduled_at: string;
  order_details: OrderDetails;
  user_id: string;
  assigned_partner_id: string; // Penting untuk rating
  services: Service | null;
  ratings?: { id: string }[]; // Array untuk cek apakah sudah ada rating
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

// Helper Warna Status
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending_assignment':
      return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full uppercase tracking-wider">Mencari Teknisi</span>;
    case 'in_progress':
      return <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">Sedang Dikerjakan</span>;
    case 'completed':
      return <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full uppercase tracking-wider">Selesai</span>;
    default:
      return <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-xs font-bold rounded-full uppercase tracking-wider">{status}</span>;
  }
};

export default async function MyOrdersPage() {
  const supabase = await createClient();

  // 1. Cek Login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 2. Ambil Data Orders + Service + Cek Rating
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      services (
        name,
        image_url
      ),
      ratings (id) 
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .returns<OrderWithService[]>(); // Casting tipe data

  if (error) {
    console.error('Error fetching orders:', error);
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-white">Riwayat Pesanan</h1>
          <Link href="/order" className="px-4 py-2 bg-white/5 text-sm font-medium text-white rounded-full hover:bg-white/10 transition-colors">
            + Pesan Baru
          </Link>
        </div>

        {/* State Kosong */}
        {orders && orders.length === 0 && (
          <div className="text-center py-20 bg-[#2F2F2F] rounded-3xl border border-white/5">
            <p className="text-gray-400 mb-6">Belum ada pesanan aktif.</p>
            <Link href="/order" className="text-primary hover:underline">Cari layanan sekarang</Link>
          </div>
        )}

        {/* List Pesanan */}
        <div className="space-y-6">
          {orders?.map((order) => {
             // Cek apakah order ini sudah dirating
             const hasRated = order.ratings && order.ratings.length > 0;

             return (
                <div key={order.id} className="bg-[#2F2F2F] p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* Gambar Service */}
                    <div className="relative w-full md:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-black/20">
                      <Image 
                        src={order.services?.image_url || '/imgs/placeholder.png'} 
                        alt="Service" 
                        fill 
                        className="object-cover"
                      />
                    </div>

                    {/* Detail Pesanan */}
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <h3 className="text-xl font-bold text-white">
                          {order.services?.name || 'Layanan'}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="space-y-2 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-primary" />
                          <span>{formatDate(order.scheduled_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-primary" />
                          <span className="line-clamp-1">
                            {order.order_details?.address || 'Alamat tidak tersedia'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div>
                          <span className="text-xs text-gray-500 block">Total Biaya</span>
                          <span className="text-lg font-bold text-white">{formatRupiah(order.total_price)}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {/* --- TOMBOL RATING (Hanya jika Selesai & Belum Rating) --- */}
                            {order.status === 'completed' && !hasRated && (
                                <RateButton 
                                    orderId={order.id}
                                    partnerId={order.assigned_partner_id}
                                    partnerName="Mitra SmartHome"
                                />
                            )}

                            {/* Tombol Detail */}
                            <Link 
                                href={`/my-orders/${order.id}`} 
                                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                            >
                                Lihat Detail <ArrowRight size={16} />
                            </Link>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
             );
          })}
        </div>

      </div>
    </div>
  );
}