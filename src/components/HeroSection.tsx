// src/components/HeroSection.tsx
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      
      {/* --- Background Effects (Glow Halus) --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* 1. Badge '1000+ Customers' */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up">
          <div className="flex -space-x-2">
             {/* Avatar placeholder kecil */}
             {[1,2,3].map((i) => (
               <div key={i} className="w-6 h-6 rounded-full bg-gray-500 border-2 border-[#212121]" />
             ))}
          </div>
          <span className="text-sm text-gray-300 font-medium">
            Dipercaya oleh <span className="text-white font-bold">1000+</span> Pelanggan
          </span>
        </div>

        {/* 2. Headline Besar */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
          Solusi <span className="text-primary">Cepat</span> dan <span className="text-primary">Terpercaya</span> <br className="hidden md:block" />
          untuk Semua Kebutuhan Rumah
        </h1>

        {/* 3. Deskripsi */}
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Dari perbaikan mendesak hingga kebersihan rutin, temukan teknisi profesional terverifikasi dalam hitungan menit.
        </p>

        {/* 4. Tombol CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/order"
            className="px-8 py-4 bg-primary text-background text-lg font-bold rounded-full hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg shadow-primary/25 flex items-center gap-2"
          >
            Cari Layanan Sekarang
            <ArrowRight size={20} />
          </Link>
          
          {/* Tombol Sekunder (Opsional - Pelajari Lebih Lanjut) */}
          <Link
            href="#features"
            className="px-8 py-4 bg-white/5 text-white text-lg font-medium rounded-full hover:bg-white/10 border border-white/10 transition-all"
          >
            Pelajari Cara Kerja
          </Link>
        </div>

        {/* Statistik Singkat (Opsional - untuk menambah kredibilitas) */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8 max-w-4xl mx-auto">
           {[
             { label: 'Teknisi Terverifikasi', value: '100+' },
             { label: 'Layanan Selesai', value: '1k+' },
             { label: 'Rating Rata-rata', value: '4.9/5' },
             { label: 'Area Layanan', value: '3 Kota' },
           ].map((stat, idx) => (
             <div key={idx}>
               <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
               <div className="text-sm text-gray-500">{stat.label}</div>
             </div>
           ))}
        </div>

      </div>
    </section>
  );
}