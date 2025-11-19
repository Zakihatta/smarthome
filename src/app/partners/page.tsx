// src/app/partners/page.tsx
import { createClient } from '../../../lib/supabase/server';
import Image from 'next/image';
import { Star, ShieldCheck, MapPin } from 'lucide-react';
import PartnerFilter from '@/components/PartnerFilter'; // Import komponen filter tadi

// --- TIPE DATA ---
type PartnerData = {
  id: string;
  average_rating: number;
  bio: string;
  verification_status: string;
  profiles: {
    full_name: string;
    avatar_url: string;
    address?: string;
  } | null;
  partner_skills: {
    skills: {
      name: string;
    } | null;
  }[];
};

export default async function PartnersListPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const skillFilter = params.skill;
  const sortOrder = params.sort || 'rating_desc';

  const supabase = await createClient();

  // 1. Ambil Master Skill untuk Dropdown
  const { data: skillsList } = await supabase.from('skills').select('*').order('name');

  // 2. Ambil Data Mitra (Yang statusnya Open)
  const { data: rawPartners } = await supabase
    .from('partners')
    .select(`
      id,
      average_rating,
      bio,
      verification_status,
      profiles (full_name, avatar_url, address),
      partner_skills (
        skills (name)
      )
    `)
    .eq('status', 'open_for_work');

  // Casting Tipe Data
  let partners = (rawPartners as unknown as PartnerData[]) || [];

  // 3. LOGIKA FILTERING (Di sisi Server/Code)
  if (skillFilter) {
    partners = partners.filter(p => 
      p.partner_skills.some(ps => ps.skills?.name === skillFilter)
    );
  }

  // 4. LOGIKA SORTING
  if (sortOrder === 'rating_desc') {
    partners.sort((a, b) => b.average_rating - a.average_rating);
  } else if (sortOrder === 'rating_asc') {
    partners.sort((a, b) => a.average_rating - b.average_rating);
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Temukan Mitra Terbaik</h1>
          <p className="text-gray-400 text-lg">
            Cari profesional berdasarkan keahlian dan rating terpercaya.
          </p>
        </div>

        {/* --- FILTER COMPONENT --- */}
        <PartnerFilter skills={skillsList || []} />

        {/* --- PARTNER GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div key={partner.id} className="bg-[#2F2F2F] rounded-3xl border border-white/5 overflow-hidden hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1 shadow-lg">
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                   {/* Avatar */}
                   <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full border-2 border-white/10 group-hover:border-primary overflow-hidden">
                         <Image 
                          src={
                            partner.profiles?.avatar_url 
                            || `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.profiles?.full_name || 'Mitra')}&background=FBCB44&color=212121&bold=true`
                          } 
                          alt="avatar" 
                          fill 
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                         <h3 className="font-bold text-white text-lg flex items-center gap-2">
                           {partner.profiles?.full_name}
                           {partner.verification_status === 'verified' && (
                             <ShieldCheck size={16} className="text-green-500" />
                           )}
                         </h3>
                         {/* Rating Badge */}
                         <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-md w-fit mt-1">
                            <Star size={12} fill="currentColor" />
                            <span className="text-xs font-bold">{partner.average_rating.toFixed(1)}</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Bio */}
                <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10">
                  {partner.bio || "Mitra profesional SmartHome siap membantu Anda."}
                </p>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                   {partner.partner_skills.slice(0, 3).map((ps, idx) => (
                      <span key={idx} className="text-xs font-medium px-2 py-1 bg-white/5 text-gray-300 rounded border border-white/5">
                        {ps.skills?.name}
                      </span>
                   ))}
                   {partner.partner_skills.length > 3 && (
                      <span className="text-xs font-medium px-2 py-1 text-gray-500">
                        +{partner.partner_skills.length - 3} more
                      </span>
                   )}
                </div>

                {/* Footer Card */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
                   <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span className="truncate max-w-[120px]">
                        {partner.profiles?.address || 'Lokasi tidak tersedia'}
                      </span>
                   </div>
                   <span className="text-green-400 font-bold uppercase tracking-wider">Available</span>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {partners.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Tidak ada mitra yang ditemukan dengan kriteria tersebut.</p>
          </div>
        )}

      </div>
    </div>
  );
}