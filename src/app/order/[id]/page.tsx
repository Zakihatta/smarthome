// src/app/order/[id]/page.tsx
import Image from 'next/image';
import { createClient } from '../../../../lib/supabase/server';
import { placeOrder } from '../actions';
import { Calendar, MapPin, FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import OrderForm from './OrderForm';

// Helper Format Rupiah
const formatRupiah = (price: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // Next.js 15: Params adalah Promise!
}) {
  // 1. Unwrap params (PENTING di Next.js 15)
  const { id } = await params;

  // 2. Ambil data layanan dari Database
  const supabase = await createClient();
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  // Jika ID tidak ditemukan di database
  if (!service) {
    notFound(); 
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* --- KOLOM KIRI: Detail Layanan --- */}
        <div>
          <Link href="/order" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Kembali
          </Link>

          <div className="relative h-64 w-full rounded-3xl overflow-hidden mb-8 border border-white/10 shadow-2xl">
            <Image 
              src={service.image_url || '/imgs/placeholder.png'} 
              alt={service.name} 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#212121] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6">
              <h1 className="text-3xl font-bold text-white mb-2">{service.name}</h1>
              <span className="px-3 py-1 bg-primary text-background font-bold rounded-full text-sm">
                {service.category}
              </span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h3 className="text-xl font-bold text-white mb-4">Deskripsi Layanan</h3>
            <p className="text-gray-400 leading-relaxed mb-8">
              {service.description}
              <br /><br />
              Layanan ini mencakup pengerjaan profesional dengan standar keamanan tinggi. Teknisi kami akan datang membawa peralatan lengkap.
            </p>

            <h3 className="text-xl font-bold text-white mb-4">Yang Termasuk:</h3>
            <ul className="space-y-2 mb-8">
              <li className="flex items-center text-gray-300 gap-3">
                <CheckCircle size={18} className="text-primary" /> Konsultasi Awal
              </li>
              <li className="flex items-center text-gray-300 gap-3">
                <CheckCircle size={18} className="text-primary" /> Pengerjaan Profesional
              </li>
              <li className="flex items-center text-gray-300 gap-3">
                <CheckCircle size={18} className="text-primary" /> Garansi Layanan 7 Hari
              </li>
            </ul>
          </div>
        </div>

        {/* --- KOLOM KANAN: Form Pemesanan --- */}
        <div className="bg-[#2F2F2F] p-8 rounded-3xl border border-white/5 h-fit sticky top-28">
          <h2 className="text-2xl font-bold text-white mb-6">Lengkapi Pesanan</h2>
          
          {/* Panggil OrderForm Client Component */}
          <OrderForm 
             serviceId={service.id} 
             basePrice={service.base_price} 
          />

        </div>

      </div>
    </div>
  );
}