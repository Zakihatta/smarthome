// src/app/admin/layout.tsx
import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-[#121212] text-white pb-32">
      {/* Kita bungkus konten admin.
         pb-32 (Padding Bottom) penting agar konten paling bawah 
         tidak tertutup oleh Navbar yang mengambang 
      */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Navbar Admin (Floating Bottom) */}
      <AdminNavbar />
    </section>
  );
}