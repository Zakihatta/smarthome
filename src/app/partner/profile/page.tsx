// src/app/partner/profile/page.tsx
import { createClient } from '../../../../lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, UserCheck, Wrench } from 'lucide-react';
import { updatePartnerProfile } from './actions';

export default async function PartnerProfilePage({
    searchParams
}: {
    searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 1. Ambil Data Partner
  const { data: partner } = await supabase
    .from('partners')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!partner) redirect('/membership');

  // 2. Ambil Semua Opsi Skills (Master Data)
  const { data: allSkills } = await supabase
    .from('skills')
    .select('*')
    .order('name');

  // 3. Ambil Skill yang SUDAH dimiliki Partner ini
  const { data: mySkills } = await supabase
    .from('partner_skills')
    .select('skill_id')
    .eq('partner_id', user.id);

  // Buat Set agar mudah mengecek (O(1) complexity)
  const mySkillIds = new Set(mySkills?.map(s => s.skill_id));

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <div className="max-w-xl mx-auto">
        
        <Link href="/partner" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Kembali ke Dashboard
        </Link>

        <div className="bg-[#2F2F2F] rounded-3xl border border-white/10 p-8 shadow-2xl">
          
          <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
             <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <UserCheck size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-white">Data Profesional</h1>
                <p className="text-gray-400 text-sm">Lengkapi keahlian Anda.</p>
             </div>
          </div>

          <form action={updatePartnerProfile} className="space-y-8">
            
            {/* Bio */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">Bio & Pengalaman</label>
              <textarea 
                name="bio" 
                defaultValue={partner.bio || ''}
                rows={3}
                placeholder="Ceritakan pengalaman Anda..."
                className="w-full bg-[#212121] border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors resize-none"
                required
              />
            </div>

            {/* SKILL SELECTOR (Multi Select) */}
            <div className="space-y-3">
               <label className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                 <Wrench size={16} className="text-primary"/> Pilih Keahlian (Skills)
               </label>
               
               <div className="grid grid-cols-2 gap-3">
                 {allSkills?.map((skill) => {
                   const isSelected = mySkillIds.has(skill.id);
                   return (
                     <label key={skill.id} className="cursor-pointer relative group">
                       {/* Checkbox Tersembunyi */}
                       <input 
                         type="checkbox" 
                         name="skills" 
                         value={skill.id} 
                         defaultChecked={isSelected}
                         className="peer sr-only" // sr-only menyembunyikan checkbox asli
                       />
                       
                       {/* Tampilan Custom (Tag) */}
                       <div className="
                         px-4 py-3 rounded-xl border text-sm font-medium text-center transition-all
                         bg-[#212121] border-white/10 text-gray-400
                         peer-checked:bg-primary peer-checked:text-black peer-checked:border-primary
                         peer-checked:shadow-lg peer-checked:shadow-primary/20
                         hover:border-white/30
                       ">
                         {skill.name}
                       </div>
                     </label>
                   );
                 })}
               </div>
               <p className="text-xs text-gray-500 mt-2">* Anda bisa memilih lebih dari satu keahlian.</p>
            </div>

            {/* Tombol Save */}
            <button 
              type="submit" 
              className="w-full bg-primary text-background font-bold py-4 rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2 mt-8"
            >
              <Save size={20} />
              Simpan Profil & Skill
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}