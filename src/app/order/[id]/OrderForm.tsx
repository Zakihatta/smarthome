'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic'; // Untuk import map agar tidak error SSR
import { Calendar, MapPin, FileText, Loader2 } from 'lucide-react';
import { placeOrder } from '@/app/order/actions';

// Import MapPicker secara dinamis (disable SSR)
const MapPicker = dynamic(() => import('@/components/MapPicker'), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-[#1E1E1E] animate-pulse rounded-xl flex items-center justify-center text-gray-500">Memuat Peta...</div>
});

export default function OrderForm({ 
  serviceId, 
  basePrice 
}: { 
  serviceId: string, 
  basePrice: number 
}) {
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    // Tambahkan data manual (koordinat) ke FormData
    if (coords) {
      formData.append('latitude', coords.lat.toString());
      formData.append('longitude', coords.lng.toString());
    }

    // Panggil Server Action
    await placeOrder(formData);
    // (Redirect dihandle oleh action, jadi loading akan terus berputar sampai pindah halaman)
  };

  const formatRupiah = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="serviceId" value={serviceId} />
      <input type="hidden" name="price" value={basePrice} />

      {/* Tanggal */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Calendar size={16} /> Tanggal & Waktu
        </label>
        <input 
          type="datetime-local" 
          name="date"
          required
          className="w-full bg-[#212121] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
        />
      </div>

      {/* Alamat Text */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <MapPin size={16} /> Detail Alamat
        </label>
        <textarea 
          name="address"
          required
          rows={2}
          placeholder="Nama jalan, nomor rumah, patokan..."
          className="w-full bg-[#212121] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
        />
      </div>

      {/* --- MAP PICKER --- */}
      <MapPicker 
        onLocationSelect={(lat, lng) => setCoords({ lat, lng })}
      />

      {/* Catatan */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <FileText size={16} /> Catatan Tambahan
        </label>
        <textarea 
          name="notes"
          rows={2}
          placeholder="Contoh: Pagar hitam..."
          className="w-full bg-[#212121] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
        />
      </div>

      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
        <span className="text-gray-400">Estimasi Harga</span>
        <span className="text-2xl font-bold text-primary">{formatRupiah(basePrice)}</span>
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-background font-bold py-4 rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Konfirmasi Pesanan"}
      </button>
    </form>
  );
}