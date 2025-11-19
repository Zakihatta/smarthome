// src/components/PayButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { activatePlan } from '@/app/payment/actions';
import { toast } from 'sonner';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snap: any;
  }
}

export default function PayButton({ 
  planId, 
  price, 
  planName, 
  userEmail, 
  userName 
}: { 
  planId: string;
  price: number;
  planName: string;
  userEmail: string;
  userName: string;
}) {
  const [loading, setLoading] = useState(false);

  // Load Script Snap Midtrans secara manual
  useEffect(() => {
    // Gunakan URL Sandbox untuk testing
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
    
    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    
    document.body.appendChild(script);

    return () => {
      // Bersihkan script saat komponen dicopot agar tidak duplikat
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    }
  }, []);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Minta Token ke API Route kita sendiri
      const response = await fetch('/api/midtrans/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total: price,
          planName: planName,
          customerName: userName,
          customerEmail: userEmail
        })
      });

      const data = await response.json();

      if (!data.token) throw new Error("Gagal mendapatkan token pembayaran");

      // 2. Munculkan Popup Snap
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.snap.pay(data.token, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: async function(result: any) {
          console.log('Payment success:', result);
          // 3. Panggil Server Action untuk update database
          await activatePlan(planId);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onPending: function(result: any) {
          console.log('Waiting for payment:', result);
          toast.info("Menunggu pembayaran...");alert("Menunggu pembayaran...");
          setLoading(false);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: function(result: any) {
          console.log('Payment failed:', result);
          toast.error("Pembayaran gagal!");
          setLoading(false);
        },
        onClose: function() {
          console.log('Customer closed the popup without finishing the payment');
          setLoading(false);
        }
      });

    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem saat memproses pembayaran.");
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-primary text-background font-bold py-4 rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 className="animate-spin" /> : (
        <>Bayar Sekarang <ArrowRight size={20} /></>
      )}
    </button>
  );
}