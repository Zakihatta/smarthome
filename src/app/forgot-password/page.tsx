// src/app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '../../../lib/supabase/client'; // Client component pake client lib
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const supabase = createClient();
    // URL ini akan mengarah ke halaman update password (Langkah 2.2)
    // Pastikan ganti localhost dengan domain produksi nanti
    const redirectUrl = `${window.location.origin}/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Link reset password telah dikirim ke email Anda.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
       <div className="w-full max-w-md bg-[#2F2F2F] p-8 rounded-3xl border border-white/10 shadow-2xl">
          <Link href="/login" className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 text-sm">
             <ArrowLeft size={16} /> Kembali ke Login
          </Link>
          
          <h1 className="text-2xl font-bold text-white mb-2">Lupa Password?</h1>
          <p className="text-gray-400 text-sm mb-6">Masukkan email Anda, kami akan mengirimkan link untuk mereset password.</p>

          <form onSubmit={handleReset} className="space-y-4">
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Email Terdaftar</label>
                <div className="relative mt-1">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                   <input 
                     type="email" 
                     required 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full bg-[#212121] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary outline-none"
                     placeholder="name@example.com"
                   />
                </div>
             </div>
             <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors flex justify-center"
             >
                {loading ? <Loader2 className="animate-spin" /> : 'Kirim Link Reset'}
             </button>
          </form>
       </div>
    </div>
  );
}