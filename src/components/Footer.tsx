// src/components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, MessageCircle, Facebook, Twitter, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#212121] border-t border-white/10 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* --- KOLOM 1: BRAND & LOGO (Sesuai Navbar) --- */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
                <div className="relative h-6 w-auto"> 
                <Image 
                    src="/imgs/Logo-tanpa-text.png" 
                    alt="SmartHome Logo"
                    width={100} 
                    height={32} 
                    className="h-full w-auto object-contain"
                />
                </div>
                <span className="text-base font-bold text-white tracking-wide">SmartHome</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Solusi nomor satu untuk segala kebutuhan perbaikan dan perawatan rumah Anda. Cepat, aman, dan terpercaya.
            </p>
          </div>

          {/* --- KOLOM 2: QUICK LINKS --- */}
          <div>
            <h3 className="text-white font-bold mb-6">Menu Utama</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-primary transition-colors">Beranda</Link></li>
              <li><Link href="/order" className="hover:text-primary transition-colors">Pesan Layanan</Link></li>
              <li><Link href="/partners" className="hover:text-primary transition-colors">Cari Mitra</Link></li>
              <li><Link href="/membership" className="hover:text-primary transition-colors">Membership</Link></li>
            </ul>
          </div>

          {/* --- KOLOM 3: DUKUNGAN --- */}
          <div>
            <h3 className="text-white font-bold mb-6">Bantuan</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-primary transition-colors">Pusat Bantuan</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Daftar sebagai Mitra</Link></li>
            </ul>
          </div>

          {/* --- KOLOM 4: KONTAK & SOSMED --- */}
          <div>
            <h3 className="text-white font-bold mb-6">Hubungi Kami</h3>
            <ul className="space-y-4 text-sm text-gray-400 mb-6">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <span>support@smarthome.id</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span>+62 812 3456 7890</span>
              </li>
            </ul>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black transition-all">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black transition-all">
                <MessageCircle size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black transition-all">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black transition-all">
                <Twitter size={18} />
              </Link>
            </div>
          </div>

        </div>

        {/* --- COPYRIGHT --- */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © 2025 SmartHome Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
             <span>Privacy Policy</span>
             <span>Terms of Service</span>
             <span>Cookies Settings</span>
          </div>
        </div>

      </div>
    </footer>
  );
}