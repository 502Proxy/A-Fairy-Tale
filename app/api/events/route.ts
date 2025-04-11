// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import eventRepository from '@/server/repositories/eventRepository';
import { Prisma, EventStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const events = await eventRepository.findMany({
      orderBy: { date: 'desc' }, // Nach Datum sortieren, neueste zuerst
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('API Error fetching events:', error);
    return NextResponse.json(
      { message: 'Failed to fetch events' },
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

    if (!title || !dateString || !location || !status) {
      return NextResponse.json(
        { message: 'Title, date, location, and status are required' },
        { status: 400 }
      );
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { message: 'Invalid date format provided' },
        { status: 400 }
      );
    }

    if (!Object.values(EventStatus).includes(status)) {
      return NextResponse.json(
        {
          message: `Invalid status value. Must be one of: ${Object.values(EventStatus).join(', ')}`,
        },
        { status: 400 }
      );
    }

    if (lineup && !Array.isArray(lineup)) {
      return NextResponse.json(
        { message: 'Lineup must be an array of strings' },
        { status: 400 }
      );
    }
    if (lineup && !lineup.every((item: any) => typeof item === 'string')) {
      return NextResponse.json(
        { message: 'All lineup items must be strings' },
        { status: 400 }
      );
    }

    const eventData: Prisma.EventCreateInput = {
      title,
      date,
      location,
      description: description || null,
      image: image || null,
      lineup: lineup || [],
      ticketLink: ticketLink || null,
      status,
    };

    const newEvent = await eventRepository.create(eventData);
    return NextResponse.json(newEvent, { status: 201 }); // 201 Created
  } catch (error: any) {
    console.error('API Error creating event:', error);
    if (error instanceof Error && error.message.includes('required')) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: 'Failed to create event' },
      { status: 500 }
    );
  }
}
