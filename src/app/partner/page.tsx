// src/app/partner/page.tsx
import { createClient } from '../../../lib/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Power, MapPin, Calendar, CheckCircle, Clock, Settings, History, Wrench, User, Map } from 'lucide-react';
import { toggleStatus, completeOrder } from './actions';
import ChatButton from '@/components/ChatButton';

// --- 1. DEFINISI TIPE DATA ---
type Job = {
  id: string;
  created_at: string;
  status: string;
  scheduled_at: string;
  total_price: number;
  latitude?: number;  // Koordinat untuk Maps
  longitude?: number; // Koordinat untuk Maps
  order_details: {
    address?: string;
    notes?: string;
  };
  services: {
    name: string;
    image_url: string;
  } | null;
  profiles: {
    full_name: string;
    phone_number?: string;
  } | null;
};

type PartnerData = {
  status: string;
  average_rating: number;
  bio: string;
  partner_skills: {
    skills: {
      name: string;
    } | null;
  }[];
};

const formatRupiah = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

export default async function PartnerDashboard() {
  const supabase = await createClient();

  // 1. Cek User & Role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Ambil Data Partner Lengkap
  const { data: rawPartnerData } = await supabase
    .from('partners')
    .select(`
        status, 
        average_rating, 
        bio, 
        partner_skills (
            skills (name)
        )
    `)
    .eq('id', user.id)
    .single();

  if (!rawPartnerData) redirect('/membership');

  const partnerData = rawPartnerData as unknown as PartnerData;
  const isOnline = partnerData.status === 'open_for_work';

  // 3. Ambil Pekerjaan AKTIF
  const { data: activeJobs } = await supabase
    .from('orders')
    .select(`*, services (name, image_url), profiles:user_id (full_name, phone_number)`)
    .eq('assigned_partner_id', user.id)
    .eq('status', 'in_progress')
    .returns<Job[]>();

  // 4. Ambil Riwayat SELESAI
  const { data: historyJobs } = await supabase
    .from('orders')
    .select(`*, services (name, image_url), profiles:user_id (full_name, phone_number)`)
    .eq('assigned_partner_id', user.id)
    .eq('status', 'completed')
    .order('scheduled_at', { ascending: false })
    .returns<Job[]>();

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* --- HEADER DASHBOARD --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white">Partner Area</h1>
                <p className="text-gray-400">Selamat bekerja, {user.user_metadata.full_name}</p>
            </div>
            <div className="flex items-center gap-3">
                <Link href="/partner/profile" className="p-2 bg-white/5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors border border-white/10" title="Edit Profil & Skill">
                    <Settings size={20} />
                </Link>
                <form action={toggleStatus.bind(null, partnerData.status)}>
                <button type="submit" className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all border ${isOnline ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}>
                    <Power size={18} />
                    {isOnline ? 'Siap Kerja' : 'Offline'}
                </button>
                </form>
            </div>
        </div>

        {/* --- INFO PROFIL & SKILL --- */}
        <div className="bg-[#2F2F2F] rounded-3xl border border-white/10 p-6 mb-10 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary"><User size={24} /></div>
                <div>
                    <h3 className="text-white font-bold text-lg">Bio Profesional</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{partnerData.bio || "Belum ada bio."}</p>
                </div>
            </div>
            <div className="border-t border-white/5 pt-4 mt-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Wrench size={14} /> Keahlian Terverifikasi</h4>
                <div className="flex flex-wrap gap-2">
                    {partnerData.partner_skills && partnerData.partner_skills.length > 0 ? (
                        partnerData.partner_skills.map((item, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">{item.skills?.name}</span>
                        ))
                    ) : ( <span className="text-sm text-red-400 italic">Belum ada skill.</span> )}
                    <Link href="/partner/profile" className="px-3 py-1 border border-dashed border-gray-600 rounded-lg text-sm text-gray-500 hover:text-white hover:border-gray-400 transition-colors">+ Edit Skill</Link>
                </div>
            </div>
        </div>

        {/* --- STATISTIK --- */}
        <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-[#2F2F2F] p-4 rounded-2xl border border-white/5 text-center">
                <p className="text-gray-400 text-xs uppercase font-bold">Rating</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">★ {partnerData.average_rating}</p>
            </div>
            <div className="bg-[#2F2F2F] p-4 rounded-2xl border border-white/5 text-center">
                <p className="text-gray-400 text-xs uppercase font-bold">Tugas Aktif</p>
                <p className="text-2xl font-bold text-white mt-1">{activeJobs?.length || 0}</p>
            </div>
            <div className="bg-[#2F2F2F] p-4 rounded-2xl border border-white/5 text-center">
                <p className="text-gray-400 text-xs uppercase font-bold">Selesai</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{historyJobs?.length || 0}</p>
            </div>
        </div>


        {/* --- PEKERJAAN AKTIF --- */}
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="text-primary" size={24} /> Pekerjaan Saat Ini
        </h2>

        <div className="space-y-6 mb-12">
           {activeJobs?.map((job) => (
             <div key={job.id} className="bg-[#2F2F2F] rounded-3xl border-2 border-primary/30 overflow-hidden shadow-2xl relative">
                
                {/* Header Kartu Job */}
                <div className="bg-white/5 p-6 border-b border-white/10 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-black relative overflow-hidden">
                         <Image src={job.services?.image_url || ''} alt="svc" fill className="object-cover" />
                      </div>
                      <div>
                         <h3 className="font-bold text-white">{job.services?.name}</h3>
                         <p className="text-xs text-gray-400 font-mono">#{job.id.slice(0,8)}</p>
                      </div>
                   </div>
                   
                   {/* Tombol Chat & Badge */}
                   <div className="flex items-center gap-3">
                      <ChatButton orderId={job.id} />
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full">Berjalan</span>
                   </div>
                </div>
                
                {/* Detail Job */}
                <div className="p-6 space-y-4">
                   {/* Lokasi */}
                   <div className="flex items-start gap-3">
                      <MapPin className="text-primary mt-1 flex-shrink-0" size={20} />
                      <div className="w-full">
                        <p className="text-gray-400 text-xs uppercase font-bold">Lokasi Pelanggan</p>
                        <p className="text-white">{job.order_details?.address}</p>
                        
                        {/* Tombol Buka Google Maps */}
                        {job.latitude && job.longitude && (
                           <a 
                             href={`https://www.google.com/maps/dir/?api=1&destination=${job.latitude},${job.longitude}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-2 rounded-lg hover:bg-blue-500/20 transition-colors"
                           >
                             <Map size={14} /> Buka Rute (Maps)
                           </a>
                        )}

                        <p className="text-sm text-gray-500 mt-2 pt-2 border-t border-white/5">
                            Pelanggan: <span className="text-white font-medium">{job.profiles?.full_name}</span> 
                            {job.profiles?.phone_number && ` • ${job.profiles.phone_number}`}
                        </p>
                      </div>
                   </div>

                   {/* Jadwal */}
                   <div className="flex items-start gap-3">
                      <Calendar className="text-primary mt-1 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-gray-400 text-xs uppercase font-bold">Jadwal</p>
                        <p className="text-white">{new Date(job.scheduled_at).toLocaleString('id-ID')}</p>
                      </div>
                   </div>
                   
                   {/* Form Selesaikan Pekerjaan */}
                   <form action={completeOrder.bind(null, job.id)} className="pt-4">
                      <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-900/20">
                         <CheckCircle size={20} /> Selesaikan Pekerjaan
                      </button>
                   </form>
                </div>
             </div>
           ))}
           
           {activeJobs?.length === 0 && (
             <div className="text-center py-8 border border-dashed border-white/10 rounded-2xl text-gray-500 text-sm">
                Tidak ada pekerjaan aktif saat ini.
             </div>
           )}
        </div>

        {/* --- RIWAYAT SELESAI --- */}
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><History className="text-gray-400" size={24} /> Riwayat Selesai</h2>
        <div className="space-y-4">
            {historyJobs?.map((job) => (
                <div key={job.id} className="bg-[#2F2F2F]/50 p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-[#2F2F2F] transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-black relative overflow-hidden opacity-70">
                            <Image src={job.services?.image_url || ''} alt="svc" fill className="object-cover" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-200">{job.services?.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1"><Calendar size={12}/> {new Date(job.scheduled_at).toLocaleDateString('id-ID')}</div>
                        </div>
                    </div>
                    <div className="text-right w-full sm:w-auto">
                        <span className="block text-lg font-bold text-white">{formatRupiah(job.total_price)}</span>
                        <span className="inline-flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20"><CheckCircle size={10} /> Selesai</span>
                    </div>
                </div>
            ))}
            {historyJobs?.length === 0 && (<div className="text-center py-8 border border-dashed border-white/10 rounded-2xl text-gray-500 text-sm">Belum ada riwayat pekerjaan.</div>)}
        </div>

      </div>
    </div>
  );
}