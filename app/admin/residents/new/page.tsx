// Datei: app/admin/residents/new/page.tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Pfad anpassen
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout'; // Layout importieren (Pfad prüfen!)
import NewResidentForm from './NewResidentForm'; // Formular importieren (aus dem gleichen Ordner)
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Dies ist eine Server Component
export default async function NewResidentPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    redirect(`/api/login`);
  }

  return (
    <AdminLayout pageTitle="Neuen Resident DJ hinzufügen">
      {/* Dieser Teil ist spezifisch für diese Seite */}
      <div className="mb-6 flex items-center">
        <Link
          href="/admin/residents"
          className="mr-4 flex items-center gap-1 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={18} />
          <span>Zurück zur Übersicht</span>
        </Link>
        {/* Titel wird vom Layout im mobilen Header angezeigt, hier ggf. redundant */}
        {/* <h1 className="text-2xl font-bold hidden md:block">Neuen Resident DJ hinzufügen</h1> */}
      </div>
      <NewResidentForm />
    </AdminLayout>
  );
}
