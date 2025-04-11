// app/api/residents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import residentRepository from '@/server/repositories/residientRepository';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const residents = await residentRepository.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(residents);
  } catch (error) {
    console.error('API Error fetching residents:', error);
    return NextResponse.json(
      { message: 'Failed to fetch residents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, role, bio, image } = body;

    if (!name || !role) {
      return NextResponse.json(
        { message: 'Name and role are required' },
        { status: 400 }
      );
    }

    const residentData: Prisma.ResidentCreateInput = { name, role, bio, image };
    const newResident = await residentRepository.create(residentData);

    return NextResponse.json(newResident, { status: 201 });
  } catch (error) {
    console.error('API Error creating resident:', error);
    return NextResponse.json(
      { message: 'Failed to create resident' },
      { status: 500 }
    );
  }
}
