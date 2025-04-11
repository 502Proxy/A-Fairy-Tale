import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import EventsAdminClient from './EventsAdminClient';

export default async function AdminEventsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    redirect(`/api/auth/signin?callbackUrl=/admin/events`);
  }

  return (
    <AdminLayout pageTitle="Events verwalten">
      <EventsAdminClient />
    </AdminLayout>
  );
}
