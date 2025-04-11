// Datei: app/admin/residents/edit/[id]/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Pfad anpassen!
import { redirect, notFound } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout'; // Layout importieren (Pfad prüfen!)
import residentRepository from '@/server/repositories/residientRepository';
import EditResidentForm from './EditResidentForm'; // Formular-Komponente importieren
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface EditResidentPageProps {
  params: {
    id: string;
  };
}

// Dies ist eine Server Component
export default async function EditResidentPage({
  params,
}: EditResidentPageProps) {
  const { id } = params;

  // Serverseitiger Schutz
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    redirect(`/api/auth/signin?callbackUrl=/admin/residents/edit/${id}`);
  }

  // Daten laden (Annahme: Methode heißt findById)
  let resident = null;
  try {
    resident = await residentRepository.findUnique(id);
  } catch (error) {
    notFound(); // Zeige 404 bei Fehler
  }

  if (!resident) {
    notFound(); // Zeige 404, wenn nicht gefunden
  }

  return (
    // Hier wird das AdminLayout verwendet
    <AdminLayout pageTitle="Resident DJ bearbeiten">
      {/* Spezifischer Inhalt für diese Seite */}
      <div className="mb-6 flex items-center">
        <Link
          href="/admin/residents"
          className="mr-4 flex items-center gap-1 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={18} />
          <span>Zurück zur Übersicht</span>
        </Link>
        {/* Optional: Titel hier, da im Layout schon vorhanden (mobil) */}
        {/* <h1 className="text-2xl font-bold hidden md:block">Resident DJ bearbeiten</h1> */}
      </div>

      {/* Die Edit-Formular-Komponente wird hier als Kind gerendert */}
      {/* Wichtig: Daten als Plain Object übergeben */}
      <EditResidentForm
        initialResidentData={JSON.parse(JSON.stringify(resident))}
      />
    </AdminLayout>
  );
}
