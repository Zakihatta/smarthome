// src/components/Navbar.tsx
'use client'; 

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, LogIn, ShoppingBag, LogOut, User as UserIcon, ClipboardList, LayoutDashboard } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { signOut } from '@/app/login/actions';

// --- Komponen Logo ---
const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <div className="relative h-6 w-auto"> 
      <Image 
        src="/imgs/Logo-tanpa-text.png" 
        alt="SmartHome Logo"
        width={100} 
        height={32} 
        className="h-full w-auto object-contain"
        priority 
      />
    </div>
    <span className="text-base font-bold text-white tracking-wide">SmartHome</span>
  </Link>
);

// --- Link Navigasi ---
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full
        ${
          isActive
            ? 'text-primary bg-white/10' 
            : 'text-gray-300 hover:text-white hover:bg-white/5'
        }`}
    >
      {children}
    </Link>
  );
};

// --- Navbar Utama ---
// Props sekarang menerima 'user' dan 'role'
export default function Navbar({ user, role }: { user: User | null, role: string }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const isPremium = user?.user_metadata?.is_premium === true;
  const avatarUrl = user?.user_metadata?.avatar_url 
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FBCB44&color=212121&bold=true`;
  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null; 
  }

  return (
    <div className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300">
      <nav className={`
        w-full max-w-5xl
        bg-[#2F2F2F]/80 backdrop-blur-md 
        border border-white/10 shadow-xl
        ${isMobileMenuOpen ? 'rounded-[2rem]' : 'rounded-full'} 
        px-8 py-3      

        transition-all duration-500 ease-in-out
        ${isScrolled 
           ? 'py-2 max-w-6xl bg-[#212121]/95 shadow-2xl'
           : 'py-5 bg-[#2F2F2F]/90'
        }
      `}>
        <div className="flex items-center justify-between h-9">
          
          {/* KIRI: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Logo />
          </div>

          {/* TENGAH: Nav Links (Smart Menu) */}
          <div className="hidden md:flex items-center justify-center space-x-2">
            <NavLink href="/">Home</NavLink>
            
            {/* Menu Umum */}
            <NavLink href="/order">Order</NavLink>

            <NavLink href="/partners">Find Mitra</NavLink>

            {/* Menu Khusus Admin */}
            {role === 'admin' && (
               <Link href="/admin" className="px-4 py-1.5 text-sm font-bold text-red-400 bg-red-500/10 rounded-full hover:bg-red-500/20 transition-colors border border-red-500/20">
                 Admin Panel
               </Link>
            )}

            {/* Menu Khusus Partner */}
            {role === 'partner' && (
               <Link href="/partner" className="px-4 py-1.5 text-sm font-bold text-green-400 bg-green-500/10 rounded-full hover:bg-green-500/20 transition-colors border border-green-500/20">
                 Mitra Dashboard
               </Link>
            )}
            
            {/* Menu Membership (Hanya User Biasa) */}
            {role === 'user' && (
               <NavLink href="/membership">Membership</NavLink>
            )}
          </div>

          {/* KANAN: User / Login */}
          <div className="hidden md:flex items-center justify-end relative">
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-white/10 ml-2 h-6">
                 {/* Icon Keranjang */}
                 <Link href="/my-orders" className="text-gray-400 hover:text-primary transition-colors" title="Riwayat Pesanan">
                    <ShoppingBag size={18} />
                 </Link>
                 
                 {/* Profile Toggle */}
                 <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
                 >
                  <div className="w-7 h-7 relative">
                    <Image
                        className="rounded-full border border-gray-600 object-cover"
                        src={avatarUrl}
                        alt="User"
                        fill
                        sizes="28px"
                        unoptimized
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-200 max-w-[100px] truncate">{displayName}</span>
                  <svg className={`w-3 h-3 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute top-10 right-0 w-56 bg-[#2F2F2F] border border-white/10 rounded-xl shadow-2xl py-1 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Signed in as</p>
                      <p className="text-xs font-medium text-white truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary font-bold uppercase">
                        {role}
                      </span>
                    </div>
                    
                    {/* Dashboard Links di Dropdown juga */}
                    {role === 'admin' && (
                       <Link href="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors">
                          <LayoutDashboard size={14} className="text-red-400"/> Admin Panel
                       </Link>
                    )}
                    {role === 'partner' && (
                       <Link href="/partner" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors">
                          <LayoutDashboard size={14} className="text-green-400"/> Mitra Dashboard
                       </Link>
                    )}

                    <Link href="/my-orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                      <ClipboardList size={14} /> Riwayat Pesanan
                    </Link>

                    <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                      <UserIcon size={14} /> Edit Profile
                    </Link>

                    <button onClick={() => signOut()} className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 w-full text-left transition-colors border-t border-white/5 mt-1">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-primary text-background font-bold px-4 py-1.5 rounded-full hover:bg-primary-dark transition-colors text-xs uppercase tracking-wider"
              >
                <LogIn size={14} />
                Login
              </Link>
            )}
          </div>

          {/* Burger Menu (Mobile) */}
          <div className="flex md:hidden items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 text-gray-300 hover:text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 pb-2 animate-in slide-in-from-top-5 fade-in duration-200">
            <div className="flex flex-col space-y-1 px-1">
              <Link href="/" className="block px-3 py-3 rounded-xl text-sm font-medium text-white hover:bg-white/5">Home</Link>
              <Link href="/order" className="block px-3 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5">Order Layanan</Link>
              <Link href="/partners" className="block px-3 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5">Find Mitra</Link> {/* Link Mobile */}
              
              {role === 'admin' && <Link href="/admin" className="block px-3 py-3 rounded-xl text-sm font-bold text-red-400 bg-red-500/10">Admin Panel</Link>}
              {role === 'partner' && <Link href="/partner" className="block px-3 py-3 rounded-xl text-sm font-bold text-green-400 bg-green-500/10">Mitra Dashboard</Link>}
              {role === 'user' && <Link href="/membership" className="block px-3 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5">Membership</Link>}
              
              <div className="pt-4 mt-2 border-t border-white/10">
                 {user ? (
                    <>
                      <div className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-xl mb-2">
                        <Image src={avatarUrl} alt="user" width={36} height={36} className="rounded-full" unoptimized />
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-white truncate">{displayName}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <Link href="/my-orders" className="flex items-center gap-3 px-3 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl mb-1">
                         <ClipboardList size={18} /> Riwayat Pesanan
                      </Link>
                      <Link href="/profile" className="flex items-center gap-3 px-3 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl mb-1">
                         <UserIcon size={18} /> Edit Profile
                      </Link>
                      <button onClick={() => signOut()} className="w-full text-left px-3 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 rounded-xl bg-red-500/5 mt-2">
                         <LogOut size={18} /> Sign Out
                      </button>
                    </>
                 ) : (
                   <Link href="/login" className="block w-full text-center bg-primary text-background font-bold py-3 rounded-xl text-sm mt-2">Login to Continue</Link>
                 )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}