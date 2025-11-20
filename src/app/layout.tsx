// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from '../../lib/supabase/server';
import FloatingSupport from "@/components/FloatingSupport";
import { Toaster } from 'sonner';
import GlobalToast from "@/components/GlobalToast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "SmartHome",
  description: "Solusi perbaikan rumah terpercaya.",

  icons: {
    icon: '/imgs/Logo-tanpa-text.png', // Path ke logo Anda
    // Opsional: Jika punya versi Apple Touch Icon
    // apple: '/imgs/Logo-tanpa-text.png', 
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  
  // 1. Ambil User Auth
  const { data: { user } } = await supabase.auth.getUser();
  
  let userRole = 'guest';

  // 2. Jika User Login, Ambil Role dari tabel 'profiles'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profile) {
      userRole = profile.role;
    }
  }

  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased min-h-screen flex flex-col bg-background`}>
        
        <Navbar user={user} role={userRole} />
        
        <main className="flex-grow relative z-10">
          {children}
        </main>

        <Footer />

        <FloatingSupport /> 
        <Toaster position="top-center" richColors theme="dark" />
        <GlobalToast />

      </body>
    </html>
  );
}