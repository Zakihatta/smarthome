// src/app/order/loading.tsx
import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* Header Skeleton */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-full max-w-lg mx-auto" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="bg-[#2F2F2F] rounded-3xl overflow-hidden border border-white/5"
          >
            {/* Gambar */}
            <Skeleton className="h-56 w-full rounded-none" />
            
            {/* Konten Text */}
            <div className="p-6">
              <Skeleton className="h-6 w-3/4 mb-4" /> {/* Judul */}
              <Skeleton className="h-4 w-full mb-2" /> {/* Deskripsi 1 */}
              <Skeleton className="h-4 w-2/3 mb-6" />  {/* Deskripsi 2 */}

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                 <div>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-6 w-24" />
                 </div>
                 <Skeleton className="h-10 w-24 rounded-full" /> {/* Tombol */}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}