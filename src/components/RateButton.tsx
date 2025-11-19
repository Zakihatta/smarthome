// src/components/RateButton.tsx
'use client';

import { useState } from 'react';
import { Star, X, Loader2, Frown, Smile, Crown } from 'lucide-react';
import { submitRating } from '@/app/rating/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function RateButton({ 
  orderId, 
  partnerId,
  partnerName 
}: { 
  orderId: string; 
  partnerId: string; 
  partnerName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    
    try {
      await submitRating(orderId, partnerId, rating, comment);
      // Jangan tutup modal, tapi ganti ke tampilan sukses
      toast.success("Rating berhasil dikirim!");
      setIsSubmitted(true);
      router.refresh(); // Refresh background page agar tombol di list hilang
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengirim rating.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset state jika dibuka lagi (meski tombolnya nanti hilang)
    setTimeout(() => {
        setIsSubmitted(false);
        setRating(0);
        setLoading(false);
    }, 300);
  };

  // Konten dinamis berdasarkan rating
  const isBadRating = rating <= 3;

  return (
    <>
      {/* Tombol Pemicu */}
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-yellow-500 text-black text-xs font-bold rounded-full hover:bg-yellow-400 transition-colors flex items-center gap-2 shadow-lg shadow-yellow-500/20"
      >
        <Star size={14} fill="black" /> Beri Ulasan
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#2F2F2F] border border-white/10 p-8 rounded-3xl w-full max-w-md relative shadow-2xl overflow-hidden">
            
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
            >
              <X size={24} />
            </button>

            {/* --- TAMPILAN 1: FORM INPUT --- */}
            {!isSubmitted ? (
                <>
                    <h2 className="text-xl font-bold text-white text-center mb-2">Beri Penilaian</h2>
                    <p className="text-gray-400 text-center text-sm mb-8">
                    Bagaimana kinerja mitra <span className="text-primary font-bold">{partnerName}</span>?
                    </p>

                    {/* Star Picker */}
                    <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(rating)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                        >
                        <Star 
                            size={44} 
                            className={star <= (hover || rating) ? "text-yellow-400 fill-yellow-400 drop-shadow-lg" : "text-gray-600"} 
                        />
                        </button>
                    ))}
                    </div>

                    <textarea
                        placeholder="Tulis pengalaman Anda..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        className="w-full bg-[#212121] border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-primary resize-none mb-6 placeholder-gray-600"
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={rating === 0 || loading}
                        className="w-full py-4 bg-primary text-background font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm uppercase tracking-wider"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Kirim Penilaian"}
                    </button>
                </>
            ) : (
                /* --- TAMPILAN 2: SUKSES & UPSELL --- */
                <div className="text-center animate-in zoom-in-95 duration-300">
                    
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isBadRating ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                        {isBadRating ? <Frown size={40} /> : <Smile size={40} />}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Terima Kasih!</h2>
                    
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        {isBadRating 
                            ? "Maaf atas ketidaknyamanan Anda. Kami akan mengevaluasi mitra ini agar pelayanan kami lebih baik ke depannya."
                            : "Senang mendengar Anda puas! Ulasan Anda sangat membantu mitra kami untuk terus berkembang."
                        }
                    </p>

                    {/* UPSELL PREMIUM */}
                    <div className="bg-gradient-to-br from-[#212121] to-black border border-primary/30 p-5 rounded-2xl mb-6">
                        <div className="flex items-center justify-center gap-2 text-primary font-bold mb-2">
                            <Crown size={18} fill="currentColor" />
                            <span>Ingin Layanan Prioritas?</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-4">
                            Dapatkan jaminan mitra <b>Rating Tertinggi (Top Rated)</b> dan garansi layanan dengan akun Premium.
                        </p>
                        <Link 
                            href="/payment?plan=premium" 
                            className="block w-full py-3 bg-primary text-background font-bold rounded-xl hover:bg-primary-dark transition-colors text-sm"
                        >
                            Upgrade ke Premium
                        </Link>
                    </div>

                    <button onClick={handleClose} className="text-gray-500 hover:text-white text-sm">
                        Tutup & Kembali
                    </button>
                </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}