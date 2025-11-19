// src/app/admin/users/page.tsx
import { createClient } from '../../../../lib/supabase/server';
import Image from 'next/image';
import { User, Shield, Briefcase, Search } from 'lucide-react';
import UserActions from '@/components/UserActions'; // <-- Import komponen aksi

// Definisi Tipe Data Gabungan
type UserData = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string;
  phone_number: string;
  created_at: string;
  // Data join dari partners (bisa null jika bukan mitra)
  partners: {
    verification_status: string;
    status: string;
  } | null;
};

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // Ambil profile + status mitra (jika ada)
  const { data: rawUsers } = await supabase
    .from('profiles')
    .select(`
      *,
      partners (verification_status, status)
    `)
    .order('created_at', { ascending: false });
    
  const users = rawUsers as unknown as UserData[];

  return (
    <div className="pt-12 px-4 sm:px-8 max-w-6xl mx-auto">
      
      {/* Header & Stats */}
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Kelola Pengguna</h1>
            <p className="text-gray-400 mt-1">Monitor user, mitra, dan verifikasi pendaftaran.</p>
        </div>
        <div className="flex gap-3">
            <div className="bg-[#1E1E1E] px-4 py-2 rounded-xl border border-white/10 text-center">
               <span className="text-gray-500 text-xs uppercase font-bold block">Total</span>
               <span className="text-white font-bold text-lg">{users?.length || 0}</span>
            </div>
            <div className="bg-[#1E1E1E] px-4 py-2 rounded-xl border border-white/10 text-center">
               <span className="text-gray-500 text-xs uppercase font-bold block">Mitra</span>
               <span className="text-primary font-bold text-lg">{users?.filter(u => u.role === 'partner').length || 0}</span>
            </div>
        </div>
      </div>

      {/* List Users */}
      <div className="grid grid-cols-1 gap-4">
        {users?.map((user) => {
          // Cek status verifikasi
          const isPartnerPending = user.role === 'partner' && user.partners?.verification_status === 'pending';

          return (
            <div key={user.id} className={`bg-[#1E1E1E] p-4 rounded-2xl border flex flex-col md:flex-row items-center gap-4 hover:bg-[#252525] transition-all ${isPartnerPending ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/5'}`}>
              
              {/* Avatar */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-black border border-white/10 flex-shrink-0">
                <Image 
                  src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`} 
                  alt="Avatar" fill className="object-cover" unoptimized 
                />
              </div>

              {/* Info Utama */}
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-white font-bold text-lg flex items-center justify-center md:justify-start gap-2">
                  {user.full_name}
                  {/* Badge Role */}
                  {user.role === 'admin' && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] rounded border border-red-500/20 flex items-center gap-1"><Shield size={10}/> Admin</span>}
                  {user.role === 'partner' && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded border border-green-500/20 flex items-center gap-1"><Briefcase size={10}/> Mitra</span>}
                  {user.role === 'user' && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] rounded border border-blue-500/20 flex items-center gap-1"><User size={10}/> User</span>}
                </h3>
                <p className="text-xs text-gray-500">{user.email} • {user.phone_number || 'No Phone'}</p>
                
                {/* Pesan Pending */}
                {isPartnerPending && (
                    <p className="text-xs text-yellow-500 mt-1 font-bold animate-pulse">⚠ Menunggu Verifikasi Mitra</p>
                )}
              </div>

              {/* Actions Component */}
              <UserActions 
                userId={user.id} 
                role={user.role} 
                verificationStatus={user.partners?.verification_status} 
              />

            </div>
          );
        })}
      </div>
    </div>
  );
}