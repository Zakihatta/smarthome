// src/components/AboutSection.tsx
import Image from 'next/image';
import { Clock, Award, ShieldCheck } from 'lucide-react';

const benefits = [
  {
    icon: <Clock className="w-6 h-6 text-primary" />,
    title: "Fast & Efficient",
    desc: "Find professional help in minutes, not days. We value your time."
  },
  {
    icon: <Award className="w-6 h-6 text-primary" />,
    title: "Quality Assured",
    desc: "Only verified technicians and partners with high-quality standards."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: "Trusted Service",
    desc: "Your safety and satisfaction are our top priorities. Guaranteed."
  }
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* KOLOM KIRI: Konten Teks */}
          <div>
            <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-2">
              About SmartHome
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Making home maintenance easy, transparent, and trustworthy.
            </h3>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              SmartHome was born from a simple idea: to connect you with hundreds of verified professionals to handle every issue in your home, from leaking faucets to complete cleaning services.
            </p>

            {/* List Benefits */}
            <div className="space-y-8">
              {benefits.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#2F2F2F] flex items-center justify-center border border-white/5">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{item.title}</h4>
                    <p className="text-gray-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KOLOM KANAN: Visual / Gambar */}
          <div className="relative">
            {/* Background decoration (Glow Effect) */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[2rem] blur-2xl opacity-50" />
            
            {/* Container Gambar Utama */}
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-[#2F2F2F] aspect-square sm:aspect-[4/3] lg:aspect-square flex items-center justify-center group">
               
               {/* --- GAMBAR BACKGROUND (DARI LOKAL) --- */}
               {/* Pastikan nama file di bawah sesuai dengan file di public/imgs/ Anda */}
               <Image 
                  src="/imgs/deepclean.png" // GANTI INI dengan nama file gambar Anda
                  alt="SmartHome Technician"
                  fill // Mengisi penuh container parent
                  className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
               />
               
               {/* Gradient Overlay agar teks terbaca */}
               <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>

               {/* Logo Overlay di tengah */}
               <div className="relative z-10 flex flex-col items-center p-8 text-center">
                  <div className="text-2xl font-bold text-white">SmartHome</div>
                  <div className="text-sm text-gray-300 mt-2">Since 2025</div>
               </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}