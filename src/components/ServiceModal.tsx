'use client';

import { useState } from 'react';
import { X, Save, Trash, Loader2 } from 'lucide-react';
import { addService, updateService, deleteService } from '@/app/admin/services/actions';

type Service = {
  id?: string;
  name?: string;
  category?: string;
  base_price?: number;
  description?: string;
};

export default function ServiceModal({ 
  isOpen, 
  onClose, 
  service 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  service?: Service | null; // Jika null = Mode Tambah, Jika ada = Mode Edit
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const isEditMode = !!service;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (isEditMode && service?.id) {
        formData.append('id', service.id);
        await updateService(formData);
      } else {
        await addService(formData);
      }
      onClose();
    } catch (error) {
      alert('Terjadi kesalahan');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!service?.id || !confirm('Yakin ingin menghapus layanan ini?')) return;
    setLoading(true);
    try {
        await deleteService(service.id);
        onClose();
    } catch(e) { console.error(e) } 
    finally { setLoading(false) }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#2F2F2F] border border-white/10 w-full max-w-lg rounded-3xl p-8 relative shadow-2xl">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
          {isEditMode ? 'Edit Layanan' : 'Tambah Layanan Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
           
           <div>
             <label className="text-xs font-bold text-gray-500 uppercase">Nama Layanan</label>
             <input name="name" defaultValue={service?.name} required placeholder="Contoh: AC Repair" className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none mt-1" />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Kategori</label>
                <select name="category" defaultValue={service?.category} className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none mt-1 cursor-pointer">
                   <option value="General">General</option>
                   <option value="Cleaning">Cleaning</option>
                   <option value="Repair">Repair</option>
                   <option value="Outdoor">Outdoor</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Harga Dasar (Rp)</label>
                <input name="price" type="number" defaultValue={service?.base_price} required placeholder="150000" className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none mt-1" />
              </div>
           </div>

           <div>
             <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi</label>
             <textarea name="description" defaultValue={service?.description} rows={3} required placeholder="Penjelasan singkat layanan..." className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none mt-1 resize-none" />
           </div>

           <div className="flex gap-3 pt-4">
              {isEditMode && (
                <button type="button" onClick={handleDelete} disabled={loading} className="px-4 py-3 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-colors">
                  <Trash size={20} />
                </button>
              )}
              <button type="submit" disabled={loading} className="flex-grow flex items-center justify-center gap-2 bg-primary text-black font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors">
                {loading ? <Loader2 className="animate-spin"/> : <><Save size={20}/> Simpan Data</>}
              </button>
           </div>

        </form>

      </div>
    </div>
  );
}