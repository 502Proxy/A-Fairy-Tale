// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Pfad anpassen
import residentRepository from '@/server/repositories/residientRepository';
import eventRepository from '@/server/repositories/eventRepository'; // Pfad anpassen

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const [residentCount, upcomingEventCount, pastEventCount, totalEventCount] =
      await Promise.all([
        residentRepository.countAll(),
        eventRepository.countUpcoming(),
        eventRepository.countPast(),
        eventRepository.countAll(),
      ]);

    return NextResponse.json({
      residentCount,
      upcomingEventCount,
      pastEventCount,
      totalEventCount, // Neuer Wert
    });
  } catch (error) {
    console.error('API Error fetching admin stats:', error);
    return NextResponse.json(
      { message: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}
