// Korrekte Datei: app/admin/events/edit/[id]/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Pfad anpassen!
import { redirect, notFound } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout'; // Layout importieren (Pfad prüfen!)
import eventRepository from '@/server/repositories/eventRepository'; // Dein Repository
import EditEventForm from './EditEventForm'; // Formular-Komponente importieren
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface EditEventPageProps {
  params: {
    id: string; // Die Event-ID aus der URL
  };
}

// Dies ist eine Server Component
export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = params;

  // Serverseitiger Schutz
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    redirect(`/api/auth/signin?callbackUrl=/admin/events/edit/${id}`);
  }

  // Event-Daten laden
  let event = null;
  try {
      event = await eventRepository.findById(id);
  } catch (error) {
      console.error(`Failed to fetch event with ID ${id}:`, error);
      notFound();
  }

  if (!event) {
    notFound();
  }

  return (
    <AdminLayout pageTitle="Event bearbeiten">
        <div className="mb-6 flex items-center">
          <Link href="/admin/events" className="mr-4 flex items-center gap-1 text-gray-400 hover:text-white">
            <ArrowLeft size={18} />
            <span>Zurück zur Übersicht</span>
          </Link>
        </div>

        {/* Die Edit-Formular-Komponente rendern */}
        {/* Daten sicher als Plain Object übergeben */}
        <EditEventForm initialEventData={JSON.parse(JSON.stringify(event))} />

    </AdminLayout>
  );
}