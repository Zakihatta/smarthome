// src/components/PartnerFilter.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Star } from 'lucide-react';

type Skill = {
  id: string;
  name: string;
};

export default function PartnerFilter({ skills }: { skills: Skill[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil nilai saat ini dari URL
  const currentSkill = searchParams.get('skill') || '';
  const currentSort = searchParams.get('sort') || 'rating_desc';

  // Fungsi update URL
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/partners?${params.toString()}`);
  };

  return (
    <div className="bg-[#2F2F2F] p-4 rounded-2xl border border-white/10 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      
      {/* Filter Skill */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="p-2 bg-white/5 rounded-lg text-gray-400">
           <Filter size={20} />
        </div>
        <select 
          value={currentSkill}
          onChange={(e) => handleFilterChange('skill', e.target.value)}
          className="bg-black/20 border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary w-full md:w-64 appearance-none cursor-pointer"
        >
          <option value="">Semua Keahlian</option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.name}>{skill.name}</option>
          ))}
        </select>
      </div>

      {/* Sorting Rating */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="p-2 bg-white/5 rounded-lg text-gray-400">
           <Star size={20} />
        </div>
        <select 
          value={currentSort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="bg-black/20 border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary w-full md:w-64 appearance-none cursor-pointer"
        >
          <option value="rating_desc">Rating Tertinggi</option>
          <option value="rating_asc">Rating Terendah</option>
        </select>
      </div>

    </div>
  );
}