'use client';

import { useState } from 'react';
import { Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { deleteUser, verifyPartner } from '@/app/admin/users/actions';

export default function UserActions({ 
  userId, 
  role, 
  verificationStatus 
}: { 
  userId: string, 
  role: string, 
  verificationStatus?: string 
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus user ini? Data pesanan terkait juga akan hilang.')) return;
    setLoading(true);
    await deleteUser(userId);
    setLoading(false);
  };

  const handleVerify = async () => {
    if (!confirm('Verifikasi mitra ini?')) return;
    setLoading(true);
    await verifyPartner(userId);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      {/* Tombol Verifikasi (Hanya untuk Mitra yang Pending) */}
      {role === 'partner' && verificationStatus === 'pending' && (
        <button 
          onClick={handleVerify} 
          disabled={loading}
          className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors"
          title="Verifikasi Mitra"
        >
          {loading ? <Loader2 size={16} className="animate-spin"/> : <CheckCircle size={16} />}
        </button>
      )}

      {/* Tombol Hapus (Jangan hapus Admin sendiri) */}
      {role !== 'admin' && (
        <button 
          onClick={handleDelete} 
          disabled={loading}
          className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
          title="Hapus User"
        >
          {loading ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16} />}
        </button>
      )}
    </div>
  );
}