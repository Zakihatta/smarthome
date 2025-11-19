'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase, LogOut, Settings } from 'lucide-react';
import { signOut } from '@/app/login/actions';

export default function AdminNavbar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Pesanan', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', href: '/admin/users', icon: <Users size={20} /> },
    { name: 'Layanan', href: '/admin/services', icon: <Briefcase size={20} /> },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="bg-[#1a1a1a]/90 backdrop-blur-lg border border-white/10 shadow-2xl rounded-full px-2 py-2 flex items-center gap-1">
        
        {/* Menu Links */}
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center w-16 h-14 rounded-full transition-all duration-300
                ${isActive 
                  ? 'bg-primary text-black translate-y-[-8px] shadow-lg shadow-primary/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {item.icon}
              <span className="text-[10px] font-bold mt-1">{item.name}</span>
            </Link>
          );
        })}

        <div className="w-px h-8 bg-white/10 mx-2" />

        {/* Tombol Logout Khusus Admin */}
        <button 
          onClick={() => signOut()}
          className="flex flex-col items-center justify-center w-14 h-14 rounded-full text-red-400 hover:bg-red-500/10 transition-colors"
          title="Keluar Admin"
        >
          <LogOut size={20} />
        </button>

      </nav>
    </div>
  );
}