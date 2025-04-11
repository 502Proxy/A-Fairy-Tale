// app/api/residents/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Pfad anpassen!
import residentRepository from '@/server/repositories/residientRepository';
import { Prisma } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { message: 'Missing resident ID' },
      { status: 400 }
    );
  }

  try {
    const resident = await residentRepository.findUnique(id);
    if (!resident) {
      return NextResponse.json(
        { message: 'Resident not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(resident);
  } catch (error) {
    console.error(`API Error fetching resident ${id}:`, error);
    return NextResponse.json(
      { message: 'Failed to fetch resident' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } } // ID aus URL holen!
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { id } = params;

  try {
    const body = await request.json();
    const { name, role, bio, image } = body;

    if (!name || !role) {
      return NextResponse.json(
        { message: 'Name and role are required for update' },
        { status: 400 }
      );
    }

    const residentData: Prisma.ResidentUpdateInput = { name, role, bio, image };
    const updatedResident = await residentRepository.update(id, residentData);

    return NextResponse.json(updatedResident, { status: 200 });
  } catch (error: any) {
    console.error(`API Error updating resident ${id}:`, error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { message: 'Resident not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to update resident' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: 'Missing resident ID' },
      { status: 400 }
    );
  }

  try {
    await residentRepository.delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`API Error deleting resident ${id}:`, error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { message: 'Resident not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to delete resident' },
      { status: 500 }
    );
  }
}
