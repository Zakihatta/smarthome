// src/app/profile/page.tsx
import { createClient } from '../../../lib/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { User, Camera, Save, ArrowLeft, MapPin, Phone } from 'lucide-react'; // Tambah icon
import Link from 'next/link';
import { updateProfile } from './actions';

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  const supabase = await createClient();

  // Ambil data user AUTH + PROFILE DATABASE
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Ambil data detail dari tabel 'profiles' agar dapat alamat & no hp
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fallback data
  const currentName = profile?.full_name || user.user_metadata?.full_name || 'User';
  
  // LOGIKA BARU: Jika tidak ada avatar, pakai UI Avatars dengan inisial nama & warna tema
  const currentAvatar = profile?.avatar_url 
    || user.user_metadata?.avatar_url 
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentName)}&background=FBCB44&color=212121&bold=true&size=128`;

  const currentAddress = profile?.address || '';
  const currentPhone = profile?.phone_number || '';

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <div className="max-w-xl mx-auto">
        
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Kembali ke Home
        </Link>

        <div className="bg-[#2F2F2F] rounded-3xl border border-white/10 p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-8 text-center">Edit Profile</h1>


          <form action={updateProfile} className="space-y-6">
            
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#212121] shadow-lg bg-black">
                  <Image 
                    src={currentAvatar} 
                    alt="Avatar" 
                    width={128} 
                    height={128} 
                    className="object-cover w-full h-full"
                    unoptimized // Agar bisa load gambar eksternal tanpa config
                  />
                </div>
                
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Camera className="text-white" size={32} />
                </div>
                
                <input 
                  type="file" 
                  name="avatar" 
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Ganti foto profil"
                />
              </div>
              <p className="text-xs text-gray-400 mt-3">Klik foto untuk mengganti (Max 2MB)</p>
            </div>

            {/* Input Nama */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  name="fullName" 
                  type="text" 
                  defaultValue={currentName}
                  required
                  className="w-full bg-[#212121] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary outline-none transition-colors"
                />
              </div>
            </div>

            {/* Input No HP */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">No. WhatsApp / HP</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  name="phone" 
                  type="tel" 
                  defaultValue={currentPhone}
                  placeholder="0812..."
                  className="w-full bg-[#212121] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary outline-none transition-colors"
                />
              </div>
            </div>

            {/* Input Alamat */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alamat Domisili</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-500 w-5 h-5" />
                <textarea 
                  name="address" 
                  defaultValue={currentAddress}
                  rows={2}
                  placeholder="Jl. Mawar No. 1..."
                  className="w-full bg-[#212121] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Email (Read Only) */}
            <div className="space-y-2 opacity-50">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Akun</label>
              <input 
                type="text" 
                value={user.email} 
                disabled
                className="w-full bg-[#212121] border border-transparent rounded-xl py-3 px-4 text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Tombol Save */}
            <button 
              type="submit" 
              className="w-full bg-primary text-background font-bold py-4 rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Save size={20} />
              Simpan Perubahan
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}