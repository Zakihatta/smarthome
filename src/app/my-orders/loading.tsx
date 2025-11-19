// src/app/my-orders/loading.tsx
import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between mb-10">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#2F2F2F] p-6 rounded-3xl border border-white/5">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Gambar Kotak */}
                <Skeleton className="w-full md:w-32 h-32 rounded-2xl flex-shrink-0" />
                
                <div className="flex-grow">
                  <div className="flex justify-between mb-4">
                     <Skeleton className="h-6 w-40" />
                     <Skeleton className="h-6 w-24 rounded-full" />
                  </div>

                  <div className="space-y-2 mb-4">
                     <Skeleton className="h-4 w-48" />
                     <Skeleton className="h-4 w-64" />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-white/10">
                     <div>
                        <Skeleton className="h-3 w-16 mb-1" />
                        <Skeleton className="h-6 w-24" />
                     </div>
                     <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}