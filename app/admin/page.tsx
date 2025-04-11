import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('admin/login/');
  }
  return <AdminDashboardClient />;
}
