// src/app/admin/page.tsx
import { createClient } from '../../../lib/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'; // <-- PENTING: Import Link
import { Calendar, MapPin, User } from 'lucide-react';

// Definisi Tipe Data
type Order = {
  id: string;
  created_at: string;
  status: string;
  total_price: number;
  scheduled_at: string;
  order_details: { address?: string; notes?: string };
  profiles: { full_name: string; email: string } | null;
  services: { name: string; image_url: string } | null;
};

// Helper Rupiah
const formatRupiah = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

// Helper Tanggal
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Cek Keamanan: Apakah User adalah Admin?
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Akses Ditolak</h1>
        <p className="text-gray-400">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        <Link href="/" className="mt-6 text-primary hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  // 2. Ambil SEMUA Pesanan (All Orders)
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      profiles:user_id (full_name, email),
      services (name, image_url)
    `)
    .order('created_at', { ascending: false })
    .returns<Order[]>();

  return (
    <div className="pt-12 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Kelola semua pesanan masuk.</p>
          </div>
          <div className="bg-[#2F2F2F] px-4 py-2 rounded-xl border border-white/10">
            <span className="text-gray-400 text-sm">Total Order:</span>
            <span className="text-white font-bold ml-2 text-lg">{orders?.length || 0}</span>
          </div>
        </div>

        {/* Tabel Pesanan */}
        <div className="bg-[#2F2F2F] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-6 font-medium">ID & Layanan</th>
                  <th className="p-6 font-medium">Pelanggan</th>
                  <th className="p-6 font-medium">Jadwal & Lokasi</th>
                  <th className="p-6 font-medium">Status</th>
                  <th className="p-6 font-medium text-right">Total</th>
                  <th className="p-6 font-medium text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders?.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    
                    {/* Kolom 1: Layanan */}
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-black">
                            <Image src={order.services?.image_url || '/imgs/placeholder.png'} alt="svc" fill className="object-cover" />
                         </div>
                         <div>
                            <p className="font-bold text-white text-sm">{order.services?.name}</p>
                            <p className="text-xs text-gray-500 font-mono">#{order.id.slice(0,6)}</p>
                         </div>
                      </div>
                    </td>

                    {/* Kolom 2: Pelanggan */}
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-sm text-white font-medium">
                        <User size={16} className="text-primary" />
                        {order.profiles?.full_name || 'Tanpa Nama'}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 pl-6">{order.profiles?.email}</p>
                    </td>

                    {/* Kolom 3: Jadwal */}
                    <td className="p-6 text-sm">
                      <div className="flex items-center gap-2 text-gray-300 mb-1">
                        <Calendar size={14} className="text-primary" /> {formatDate(order.scheduled_at)}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 max-w-[200px]">
                         <MapPin size={14} className="flex-shrink-0 text-primary" /> 
                         <span className="truncate">{order.order_details?.address || '-'}</span>
                      </div>
                    </td>

                    {/* Kolom 4: Status */}
                    <td className="p-6">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${order.status === 'pending_assignment' ? 'bg-yellow-500/20 text-yellow-500' : ''}
                        ${order.status === 'in_progress' ? 'bg-blue-500/20 text-blue-500' : ''}
                        ${order.status === 'completed' ? 'bg-green-500/20 text-green-500' : ''}
                      `}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Kolom 5: Harga */}
                    <td className="p-6 text-right font-bold text-white">
                      {formatRupiah(order.total_price)}
                    </td>

                    {/* Kolom 6: Aksi (DIPERBARUI) */}
                    <td className="p-6 text-center">
                       {order.status === 'pending_assignment' && (
                         // --- PERBAIKAN: Gunakan Link untuk navigasi ---
                         <Link 
                           href={`/admin/assign/${order.id}`}
                           className="inline-block px-4 py-2 bg-primary text-background text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors"
                         >
                           Tugaskan Mitra
                         </Link>
                         // ---------------------------------------------
                       )}
                       {order.status !== 'pending_assignment' && (
                         <span className="text-xs text-gray-500 italic">Diproses</span>
                       )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Jika Kosong */}
          {(!orders || orders.length === 0) && (
            <div className="p-12 text-center text-gray-500">
               Belum ada pesanan masuk.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}