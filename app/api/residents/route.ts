import { NextRequest, NextResponse } from 'next/server';
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

    if (
      error instanceof Error &&
      error.message.includes('Name and role are required')
    ) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: 'Failed to create resident' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    const deletedResident = await residentRepository.delete(id);

    return NextResponse.json(deletedResident, { status: 200 });
  } catch (error) {
    console.error('API Error deleting resident:', error);
    return NextResponse.json(
      { message: 'Failed to delete resident' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, role, bio, image } = body;

    if (!id || !name || !role) {
      return NextResponse.json(
        { message: 'ID, name, and role are required' },
        { status: 400 }
      );
    }

    const residentData: Prisma.ResidentUpdateInput = { name, role, bio, image };
    const updatedResident = await residentRepository.update(id, residentData);

    return NextResponse.json(updatedResident, { status: 200 });
  } catch (error) {
    console.error('API Error updating resident:', error);
    return NextResponse.json(
      { message: 'Failed to update resident' },
      { status: 500 }
    );
  }
}
