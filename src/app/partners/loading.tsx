// src/app/partners/loading.tsx
import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Skeleton className="h-10 w-72 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Filter Bar */}
        <Skeleton className="h-16 w-full rounded-2xl mb-8" />

        {/* Grid Partner */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#2F2F2F] rounded-3xl border border-white/5 p-6">
               
               <div className="flex items-center gap-4 mb-6">
                  {/* Avatar Bulat */}
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-grow">
                     <Skeleton className="h-6 w-32 mb-2" />
                     <Skeleton className="h-4 w-12" />
                  </div>
               </div>

               <Skeleton className="h-4 w-full mb-2" />
               <Skeleton className="h-4 w-2/3 mb-6" />

               {/* Tags */}
               <div className="flex gap-2 mb-6">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
               </div>

               <div className="pt-4 border-t border-white/10 flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
               </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}