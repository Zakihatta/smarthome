// src/app/update-password/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      toast.error("Gagal update password: " + error.message);
    } else {
      toast.success("Password berhasil diubah! Silakan login.");
      router.replace('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
       <div className="w-full max-w-md bg-[#2F2F2F] p-8 rounded-3xl border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-2">Password Baru</h1>
          <p className="text-gray-400 text-sm mb-6">Silakan masukkan password baru untuk akun Anda.</p>

          <form onSubmit={handleUpdate} className="space-y-4">
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Password Baru</label>
                <div className="relative mt-1">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                   <input 
                     type="password" 
                     required 
                     minLength={6}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full bg-[#212121] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary outline-none"
                     placeholder="••••••••"
                   />
                </div>
             </div>
             <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors flex justify-center gap-2 items-center"
             >
                {loading ? <Loader2 className="animate-spin" /> : <><Save size={18}/> Simpan Password</>}
             </button>
          </form>
       </div>
    </div>
  );
}