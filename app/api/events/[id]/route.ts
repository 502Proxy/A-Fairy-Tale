// app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Pfad anpassen
import eventRepository from '@/server/repositories/eventRepository'; // Korrekter Import!
import { Prisma, EventStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id)
    return NextResponse.json({ message: 'Missing event ID' }, { status: 400 });

  try {
    const event = await eventRepository.findById(id);
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error(`API Error fetching event ${id}:`, error);
    return NextResponse.json(
      { message: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { id } = params;
  if (!id)
    return NextResponse.json({ message: 'Missing event ID' }, { status: 400 });

  try {
    const body = await request.json();
    const {
      title,
      date: dateString,
      location,
      description,
      image,
      lineup,
      ticketLink,
      status,
    } = body;

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { message: 'No update data provided' },
        { status: 400 }
      );
    }

    if (body.hasOwnProperty('title') && !title) {
      return NextResponse.json(
        { message: 'Title cannot be empty if provided for update' },
        { status: 400 }
      );
    }

    let date: Date | undefined = undefined;
    if (dateString) {
      date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { message: 'Invalid date format provided for update' },
          { status: 400 }
        );
      }
    }

    if (status && !Object.values(EventStatus).includes(status)) {
      return NextResponse.json(
        {
          message: `Invalid status value. Must be one of: ${Object.values(EventStatus).join(', ')}`,
        },
        { status: 400 }
      );
    }

    if (lineup && !lineup.every((item: any) => typeof item === 'string')) {
      return NextResponse.json(
        { message: 'All lineup items must be strings' },
        { status: 400 }
      );
    }

    const eventData: Prisma.EventUpdateInput = {};
    if (title !== undefined) eventData.title = title;
    if (date !== undefined) eventData.date = date; // Das Date-Objekt
    if (location !== undefined) eventData.location = location;
    if (description !== undefined) eventData.description = description;
    if (image !== undefined) eventData.image = image;
    if (lineup !== undefined) eventData.lineup = { set: lineup }; // Prisma Array Update Syntax
    if (ticketLink !== undefined) eventData.ticketLink = ticketLink;
    if (status !== undefined) eventData.status = status;

    const updatedEvent = await eventRepository.update(id, eventData);
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(
      { message: 'Failed to update event' },
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
  if (!id)
    return NextResponse.json({ message: 'Missing event ID' }, { status: 400 });

  try {
    await eventRepository.delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`API Error deleting event ${id}:`, error);
    if (error.code === 'P2025') {
      // Record to delete does not exist.
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(
      { message: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
