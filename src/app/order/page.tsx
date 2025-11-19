// src/app/order/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server'; // <-- PERBAIKAN 1 (Relative Path)

// --- DEFINISI TIPE DATA (PERBAIKAN 2) ---
type Service = {
  id: string; // Supabase ID biasanya string (UUID)
  name: string;
  description: string;
  base_price: number;
  image_url: string;
  category: string;
};

// Helper untuk format Rupiah
const formatRupiah = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Fungsi sekarang ASYNC karena mengambil data dari server
export default async function OrderPage() {
  
  // 1. Inisialisasi Client Supabase
  const supabase = await createClient();

  // 2. Ambil data dari tabel 'services'
  // Kita tambahkan <Service[]> agar TypeScript tahu bentuk datanya
  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .order('id', { ascending: true })
    .returns<Service[]>(); // <-- Beritahu TypeScript ini adalah array Service

  // Jika error, tampilkan pesan sederhana (opsional)
  if (error) {
    console.error("Error fetching services:", error);
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* --- HEADER HALAMAN --- */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-primary mb-4">Our Services</h1>
        <p className="text-gray-400 text-lg">
          Find professional solutions for every need in your home. Ready to serve whenever you need us.
        </p>
      </div>

      {/* --- GRID LAYANAN --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* (services || []) akan aman karena TypeScript sudah tahu ini array Service */}
        {(services || []).map((service) => (
          <div 
            key={service.id} 
            className="bg-[#2F2F2F] rounded-3xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-300 group hover:-translate-y-2 shadow-lg"
          >
            {/* Gambar Layanan */}
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={service.image_url || '/imgs/placeholder.png'}
                alt={service.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2F2F2F] to-transparent opacity-60"></div>
            </div>

            {/* Konten Kartu */}
            <div className="p-6 flex flex-col h-[calc(100%-14rem)]">
              
              <h3 className="text-xl font-bold text-primary mb-2">
                {service.name}
              </h3>
              
              <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3">
                {service.description}
              </p>

              {/* Harga & Tombol Order */}
              <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Start From</div>
                  <div className="text-white font-bold text-lg">
                    {formatRupiah(service.base_price)}
                  </div>
                </div>

                <Link
                  href={`/order/${service.id}`}
                  className="bg-primary text-background font-bold px-6 py-2 rounded-full hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                >
                  Order
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}