// src/components/FloatingSupport.tsx
'use client';

import { useState } from 'react';
import { MessageCircle, Phone, X, Headset } from 'lucide-react';

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);

  // Ganti dengan nomor WhatsApp Admin Anda (format: 62...)
  const adminWhatsapp = "6281234567890"; 
  const adminPhone = "+6281234567890";

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      
      {/* Menu Options (Muncul saat dibuka) */}
      <div className={`flex flex-col gap-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        
        {/* Tombol WhatsApp (Live Chat) */}
        <a 
          href={`https://wa.me/${adminWhatsapp}?text=Halo%20Admin%20SmartHome,%20saya%20butuh%20bantuan.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-xl hover:brightness-110 transition-all transform hover:scale-105"
        >
          <span className="font-bold text-sm">Chat WhatsApp</span>
          <MessageCircle size={20} />
        </a>

        {/* Tombol Telepon (Call Admin) */}
        <a 
          href={`tel:${adminPhone}`}
          className="flex items-center gap-3 bg-blue-600 text-white px-5 py-3 rounded-full shadow-xl hover:brightness-110 transition-all transform hover:scale-105"
        >
          <span className="font-bold text-sm">Call Admin</span>
          <Phone size={20} />
        </a>

      </div>

      {/* Tombol Utama (Trigger) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300
          ${isOpen ? 'bg-[#2F2F2F] text-white rotate-90' : 'bg-primary text-black hover:scale-110'}
        `}
      >
        {isOpen ? <X size={24} /> : <Headset size={28} />}
      </button>

    </div>
  );
}