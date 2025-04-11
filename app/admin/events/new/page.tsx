// Datei: app/admin/events/new/page.tsx
import AdminLayout from '@/components/admin/AdminLayout';
import NewEventForm from './newEventForm';

export default async function NewEventPage() {
  return (
    <AdminLayout pageTitle="Neues Event erstellen">
      <NewEventForm />
    </AdminLayout>
  );
}
