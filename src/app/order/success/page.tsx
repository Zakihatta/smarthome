// src/app/order/success/page.tsx
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#2F2F2F] p-8 rounded-3xl border border-white/10 text-center">
        
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Pesanan Berhasil!</h1>
        <p className="text-gray-400 mb-8">
          Terima kasih. Kami sedang mencarikan teknisi terbaik untuk Anda. Silakan tunggu konfirmasi selanjutnya.
        </p>

        <div className="space-y-3">
          <Link 
            href="/order" 
            className="block w-full bg-primary text-background font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors"
          >
            Pesan Layanan Lain
          </Link>
          <Link 
            href="/" 
            className="block w-full bg-transparent text-white font-medium py-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>

      </div>
    </div>
  );
}