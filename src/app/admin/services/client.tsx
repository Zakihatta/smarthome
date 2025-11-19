// src/app/admin/services/client.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit3 } from 'lucide-react';
import ServiceModal from '@/components/ServiceModal';

type Service = {
  id: string;
  name: string;
  category: string;
  base_price: number;
  description: string;
  image_url: string;
};

const formatRupiah = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

export default function AdminServicesClient({ initialServices }: { initialServices: Service[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Fungsi Buka Modal Tambah
  const handleAdd = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  // Fungsi Buka Modal Edit
  const handleEdit = (svc: Service) => {
    setSelectedService(svc);
    setIsModalOpen(true);
  };

  return (
    <div className="pt-12 px-4 sm:px-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Daftar Layanan</h1>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-xl hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} /> Tambah Layanan
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-[#1E1E1E] rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-xs uppercase">
            <tr>
              <th className="p-4 pl-6">Nama Layanan</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Harga Dasar</th>
              <th className="p-4 text-right pr-6">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {initialServices.map((svc) => (
              <tr key={svc.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 pl-6 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-black relative overflow-hidden">
                      <Image src={svc.image_url || '/imgs/placeholder.png'} alt="img" fill className="object-cover" unoptimized />
                   </div>
                   <span className="font-bold text-white">{svc.name}</span>
                </td>
                <td className="p-4 text-sm text-gray-400">{svc.category}</td>
                <td className="p-4 text-sm text-primary font-mono">{formatRupiah(svc.base_price)}</td>
                <td className="p-4 pr-6 text-right">
                   <button 
                      onClick={() => handleEdit(svc)}
                      className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      <Edit3 size={16} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Component */}
      {isModalOpen && (
        <ServiceModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          service={selectedService} 
        />
      )}

    </div>
  );
}