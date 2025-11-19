'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react'; // Tambahkan useRef
import { toast } from 'sonner';

export default function GlobalToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const toastShownRef = useRef(''); // Ref untuk mencegah toast ganda (React Strict Mode)

  useEffect(() => {
    const message = searchParams.get('message');
    const error = searchParams.get('error');
    const success = searchParams.get('success');
    
    // Kunci unik untuk render kali ini
    const key = `${pathname}?${searchParams.toString()}`;

    // Jika key sama dengan yang terakhir ditampilkan, stop (cegah double toast)
    if (key === toastShownRef.current) return;

    if (message) {
      if (message.toLowerCase().includes('gagal') || message.toLowerCase().includes('error')) {
        toast.error(message);
      } else {
        toast.success(message);
      }
      toastShownRef.current = key; // Tandai sudah tampil
      
      // Opsional: Bersihkan URL agar kalau di-refresh toast tidak muncul lagi
      // router.replace(pathname); 
    }

    if (error) {
      toast.error(error);
      toastShownRef.current = key;
    }

    if (success) {
      toast.success(success);
      toastShownRef.current = key;
    }

  }, [searchParams, router, pathname]);

  return null; // Komponen ini tidak merender visual apa pun
}