// src/app/admin/services/page.tsx
import { createClient } from '../../../../lib/supabase/server';
import AdminServicesClient from './client'; // Kita pindahkan logic client ke file baru

export default async function AdminServicesPage() {
  const supabase = await createClient();
  // Ambil data di server
  const { data: services } = await supabase.from('services').select('*').order('name');

  // Render komponen client dengan data awal
  return <AdminServicesClient initialServices={services || []} />;
}