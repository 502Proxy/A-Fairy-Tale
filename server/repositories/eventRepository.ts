// server/repositories/eventRepository.ts
import prisma from '@/server/lib/PrismaClient';
import { Prisma, Event, EventStatus } from '@prisma/client';

// Interface für die Repository-Methoden
interface IEventRepository {
  findMany(options?: {
    orderBy?: Prisma.EventOrderByWithRelationInput;
    where?: Prisma.EventWhereInput;
  }): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
  create(data: Prisma.EventCreateInput): Promise<Event>;
  update(id: string, data: Prisma.EventUpdateInput): Promise<Event>;
  delete(id: string): Promise<Event>;
  countAll(): Promise<number>;
  countUpcoming(): Promise<number>; // Zähle alle bevorstehenden Events
  countPast(): Promise<number>; // Zähle alle vergangenen Events
}

const eventRepository: IEventRepository = {
  async findMany(options?: {
    orderBy?: Prisma.EventOrderByWithRelationInput;
    where?: Prisma.EventWhereInput;
  }): Promise<Event[]> {
    try {
      return await prisma.event.findMany({
        orderBy: options?.orderBy ?? { date: 'desc' },
        where: options?.where,
      });
    } catch (error) {
      console.error('Error in eventRepository.findMany:', error);
      throw new Error('Could not fetch events from database.');
    }
  },

  async findById(id: string): Promise<Event | null> {
    if (!id) throw new Error('An ID is required to find an event.');
    try {
      return await prisma.event.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`Error in eventRepository.findById for ID ${id}:`, error);
      throw new Error('Could not fetch event from database.');
    }
  },

  async create(data: Prisma.EventCreateInput): Promise<Event> {
    if (!data.title || !data.date || !data.location || !data.status) {
      throw new Error('Title, date, location, and status are required.');
    }
    if (!(data.date instanceof Date)) {
      data.date = new Date(data.date);
    }
    if (isNaN(data.date.getTime())) {
      throw new Error('Invalid date provided.');
    }

    if (data.lineup && !Array.isArray(data.lineup)) {
      throw new Error('Lineup must be an array of strings.');
    }

    try {
      return await prisma.event.create({ data });
    } catch (error) {
      console.error('Error in eventRepository.create:', error);
      throw new Error('Could not create event in database.');
    }
  },

  async update(id: string, data: Prisma.EventUpdateInput): Promise<Event> {
    if (!id) throw new Error('An ID is required to update an event.');
    try {
      if (data.date && !(data.date instanceof Date)) {
        data.date = new Date(data.date as string); // Versuche Umwandlung
        if (isNaN(data.date.getTime())) {
          throw new Error('Invalid date provided for update.');
        }
      }
      return await prisma.event.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      console.error(`Error in eventRepository.update for ID ${id}:`, error);
      throw error;
    }
  },

  async delete(id: string): Promise<Event> {
    if (!id) throw new Error('An ID is required to delete an event.');
    try {
      return await prisma.event.delete({
        where: { id },
      });
    } catch (error: any) {
      console.error(`Error in eventRepository.delete for ID ${id}:`, error);
      throw error;
    }
  },

  async countAll(): Promise<number> {
    try {
      return await prisma.resident.count();
    } catch (error) {
      console.error('Error in residentRepository.countAll:', error);
      throw new Error('Could not count residents.');
    }
  },

  async countUpcoming(): Promise<number> {
    try {
      return await prisma.event.count({
        where: { date: { gte: new Date() } },
      });
    } catch (error) {
      console.error('Error in eventRepository.countUpcoming:', error);
      throw new Error('Could not count upcoming events.');
    }
  },

  async countPast(): Promise<number> {
    try {
      return await prisma.event.count({
        where: { date: { lt: new Date() } },
      });
    } catch (error) {
      console.error('Error in eventRepository.countPast:', error);
      throw new Error('Could not count past events.');
    }
  },
};

export default eventRepository;
export type { IEventRepository }; // Optionaler Typ-Export
