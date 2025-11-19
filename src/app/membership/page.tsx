// src/app/membership/page.tsx
'use client';

import { useState } from 'react';
import { CheckCircle, Crown, Briefcase, Star, Zap, Shield } from 'lucide-react';
import { joinPartner } from '@/app/partner/actions'; 
import Link from 'next/link';

// --- MOCK DATA PAKET ---
const customerPlans = [
  {
    id: 'free',
    name: 'Basic Member',
    price: 'Free',
    period: 'Forever',
    description: 'Akses standar untuk memesan layanan kapan saja.',
    features: [
      'Akses ke semua layanan',
      'Dukungan pelanggan standar',
      'Pembayaran aman',
    ],
    buttonText: 'Current Plan',
    recommended: false,
  },
  {
    id: 'premium',
    name: 'Smart Premium',
    price: 'Rp 49.000',
    period: '/ bulan',
    description: 'Solusi terbaik untuk pemilik rumah yang sibuk.',
    features: [
      'Prioritas pencarian teknisi (Express)',
      'Diskon 10% untuk setiap layanan',
      'Akses ke Mitra Bintang 5 (Top Rated)',
      'Garansi layanan 30 hari',
      'Bebas biaya admin',
    ],
    buttonText: 'Upgrade to Premium',
    recommended: true, 
  }
];

const partnerPlans = [
  {
    id: 'partner_join',
    name: 'Mitra Profesional',
    price: 'Rp 150.000',
    period: '/ tahun', 
    description: 'Bergabunglah sebagai penyedia jasa dan dapatkan penghasilan.',
    features: [
      'Akses ke 1000+ pesanan aktif',
      'Badge "Verified Partner"',
      'Aplikasi khusus Mitra',
      'Pembayaran mingguan otomatis',
      'Dukungan admin prioritas',
    ],
    buttonText: 'Gabung Mitra Sekarang',
    recommended: true,
  }
];

export default function MembershipPage() {
  // State untuk toggle: 'customer' atau 'partner'
  const [viewMode, setViewMode] = useState<'customer' | 'partner'>('customer');

  const activePlans = viewMode === 'customer' ? customerPlans : partnerPlans;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* --- HEADER --- */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Pilih Paket Keanggotaan
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Tingkatkan pengalaman Anda atau bergabunglah sebagai mitra profesional kami.
        </p>

        {/* --- TOGGLE SWITCH --- */}
        <div className="inline-flex bg-[#2F2F2F] p-1 rounded-full border border-white/10 relative">
          {/* Background Slider Animasi */}
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-full transition-all duration-300 ease-out ${
              viewMode === 'customer' ? 'left-1' : 'left-[calc(50%+4px)]'
            }`}
          />
          
          {/* Tombol Customer */}
          <button
            onClick={() => setViewMode('customer')}
            className={`relative z-10 px-8 py-2 rounded-full font-bold text-sm transition-colors duration-300 flex items-center gap-2 ${
              viewMode === 'customer' ? 'text-background' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Crown size={16} />
            Pelanggan
          </button>

          {/* Tombol Partner */}
          <button
            onClick={() => setViewMode('partner')}
            className={`relative z-10 px-8 py-2 rounded-full font-bold text-sm transition-colors duration-300 flex items-center gap-2 ${
              viewMode === 'partner' ? 'text-background' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Briefcase size={16} />
            Mitra
          </button>
        </div>
      </div>

      {/* --- GRID KARTU PAKET --- */}
      <div className={`max-w-5xl mx-auto grid gap-8 ${viewMode === 'customer' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 justify-center'}`}>
        
        {/* Khusus Partner View, kita pusatkan kartunya */}
        {viewMode === 'partner' && <div className="hidden md:block md:col-span-1"></div>} 
        
        {activePlans.map((plan) => (
          <div 
            key={plan.id}
            className={`
              relative p-8 rounded-3xl border transition-all duration-300 flex flex-col
              ${plan.recommended 
                ? 'bg-[#2F2F2F] border-primary/50 shadow-xl shadow-primary/10 scale-105 z-10' 
                : 'bg-[#212121] border-white/10 hover:border-white/30'
              }
              ${viewMode === 'partner' ? 'max-w-md mx-auto w-full' : ''}
            `}
          >
            {/* Label Recommended */}
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-background px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                <Star size={12} fill="currentColor" />
                Rekomendasi
              </div>
            )}

            {/* Header Kartu */}
            <div className="mb-6">
              <h3 className={`text-xl font-bold mb-2 ${plan.recommended ? 'text-white' : 'text-gray-300'}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary">{plan.price}</span>
                <span className="text-gray-500 text-sm">{plan.period}</span>
              </div>
              <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                {plan.description}
              </p>
            </div>

            {/* Fitur List */}
            <ul className="space-y-4 mb-8 flex-grow">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* --- TOMBOL ACTION (LINK KE PAYMENT) --- */}
            
            {/* 1. JIKA PAKET MITRA -> Link ke Payment Partner */}
            {plan.id === 'partner_join' ? (
              <Link 
                href="/payment?plan=partner" 
                className="block w-full py-4 rounded-xl font-bold bg-primary text-background hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all duration-300 text-center"
              >
                Gabung Mitra Sekarang
              </Link>
            ) : plan.id === 'premium' ? (
               
               // 2. JIKA PAKET PREMIUM -> Link ke Payment Premium
               <Link 
                href="/payment?plan=premium" 
                className="block w-full py-4 rounded-xl font-bold bg-primary text-background hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all duration-300 text-center"
              >
                {plan.buttonText}
              </Link>
            ) : (
              
              // 3. JIKA PAKET FREE/BASIC -> Tombol Biasa (Non-Link)
              <button className="w-full py-4 rounded-xl font-bold bg-white/10 text-white hover:bg-white/20 transition-all cursor-default">
                {plan.buttonText}
              </button>
            )}

          </div>
        ))}
      </div>

      {/* --- INFO TAMBAHAN --- */}
      <div className="mt-20 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
         <div className="p-6 rounded-2xl bg-[#2F2F2F]/50 border border-white/5">
            <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4"><Shield /></div>
            <h4 className="text-white font-bold mb-2">Pembayaran Aman</h4>
            <p className="text-gray-500 text-sm">Semua transaksi dilindungi enkripsi tingkat tinggi.</p>
         </div>
         <div className="p-6 rounded-2xl bg-[#2F2F2F]/50 border border-white/5">
            <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4"><Zap /></div>
            <h4 className="text-white font-bold mb-2">Proses Cepat</h4>
            <p className="text-gray-500 text-sm">Upgrade akun diproses secara instan otomatis.</p>
         </div>
         <div className="p-6 rounded-2xl bg-[#2F2F2F]/50 border border-white/5">
            <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4"><Briefcase /></div>
            <h4 className="text-white font-bold mb-2">Karir Menjanjikan</h4>
            <p className="text-gray-500 text-sm">Pendapatan stabil bagi mitra yang bergabung.</p>
         </div>
      </div>

    </div>
  );
}