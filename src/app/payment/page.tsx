// src/app/payment/page.tsx
import { createClient } from '../../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import PayButton from '@/components/PayButton'; // Import komponen baru

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const supabase = await createClient();

  // 1. Cek User Login & Ambil Data Profil
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Ambil nama user dari metadata atau profile
  const userName = user.user_metadata?.full_name || 'User SmartHome';

  // 2. Tentukan Detail Paket
  let planDetails = {
    id: 'unknown',
    name: 'Unknown Plan',
    price: 0,
    description: '-'
  };

  if (plan === 'partner') {
    planDetails = {
      id: 'partner', // ID simpel untuk logic
      name: 'Registrasi Mitra Profesional',
      price: 150000,
      description: 'Biaya pendaftaran tahunan untuk akses penuh sebagai penyedia jasa.'
    };
  } else if (plan === 'premium') {
    planDetails = {
      id: 'premium',
      name: 'Smart Premium User',
      price: 49000,
      description: 'Langganan bulanan untuk prioritas layanan dan diskon.'
    };
  } else {
    redirect('/membership');
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* KIRI: Ringkasan Order */}
        <div className="bg-[#2F2F2F] p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
           <div>
              <h2 className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-2">Ringkasan Pesanan</h2>
              <h1 className="text-3xl font-bold text-white mb-4">{planDetails.name}</h1>
              <p className="text-gray-400 mb-8">{planDetails.description}</p>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                   <span className="text-gray-400">Subtotal</span>
                   <span className="text-white">Rp {planDetails.price.toLocaleString('id-ID')}</span>
                </div>
                <div className="h-px bg-white/10 my-2" />
                <div className="flex justify-between text-lg font-bold">
                   <span className="text-white">Total Bayar</span>
                   <span className="text-primary">Rp {planDetails.price.toLocaleString('id-ID')}</span>
                </div>
              </div>
           </div>
           
           <div className="mt-8 flex items-center gap-3 text-xs text-gray-500 bg-black/20 p-3 rounded-xl">
              <ShieldCheck size={16} className="text-green-500" />
              Pembayaran via Midtrans Gateway (Secure).
           </div>
        </div>

        {/* KANAN: Tombol Bayar */}
        <div className="bg-[#2F2F2F] p-8 rounded-3xl border border-white/10 flex flex-col justify-center">
           <h3 className="text-xl font-bold text-white mb-2">Selesaikan Pembayaran</h3>
           <p className="text-gray-400 text-sm mb-6">Klik tombol di bawah untuk membuka metode pembayaran QRIS, Transfer Bank, atau E-Wallet.</p>
           
           {/* Panggil Komponen Client Button */}
           <PayButton 
              planId={planDetails.id}
              price={planDetails.price}
              planName={planDetails.name}
              userEmail={user.email || ''}
              userName={userName}
           />
        </div>

      </div>
    </div>
  );
}