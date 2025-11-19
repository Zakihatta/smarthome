// src/app/admin/assign/[id]/page.tsx
import { createClient } from '../../../../../lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, CheckCircle, MapPin } from 'lucide-react';
import { assignPartner } from '../../actions';

// Tipe Data untuk Partner (Join Profile)
type PartnerProfile = {
  id: string;
  status: string;
  average_rating: number;
  bio: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  } | null; // Relasi ke profiles
};

export default async function AssignPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = await params;
  const supabase = await createClient();

  // 1. Ambil Data Partners yang tersedia (status 'open_for_work')
  const { data: partners } = await supabase
    .from('partners')
    .select(`
      *,
      profiles (full_name, avatar_url)
    `)
    .eq('status', 'open_for_work') // Hanya yang sedang free
    .order('average_rating', { ascending: false })
    .returns<PartnerProfile[]>();

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/admin" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Batal & Kembali
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Pilih Mitra</h1>
        <p className="text-gray-400 mb-8">Tugaskan teknisi terbaik untuk pesanan #{orderId.slice(0,8)}</p>

        {/* List Mitra */}
        <div className="grid grid-cols-1 gap-4">
          {partners?.map((partner) => (
            <div key={partner.id} className="bg-[#2F2F2F] p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary/50 transition-all">
              
              {/* Info Mitra */}
              <div className="flex items-center gap-4 w-full">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600 group-hover:border-primary">
                  <Image 
                    src={partner.profiles?.avatar_url || '/imgs/placeholder.png'} 
                    alt="Avatar" fill className="object-cover" 
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {partner.profiles?.full_name}
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Verified</span>
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                    <span className="flex items-center text-yellow-400"><Star size={14} className="mr-1 fill-yellow-400"/> {partner.average_rating}</span>
                    <span>•</span>
                    <span>{partner.bio}</span>
                  </div>
                </div>
              </div>

              {/* Tombol Pilih */}
              <form action={assignPartner.bind(null, orderId, partner.id)}>
                 <button 
                   type="submit"
                   className="whitespace-nowrap px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-primary hover:text-background transition-colors flex items-center gap-2"
                 >
                   <CheckCircle size={18} /> Pilih Mitra Ini
                 </button>
              </form>

            </div>
          ))}

          {partners?.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Tidak ada mitra yang tersedia (Open for Work) saat ini.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}