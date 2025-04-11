import prisma from '@/server/lib/PrismaClient';
import { Prisma, Resident } from '@prisma/client';

interface IResidentRepository {
  findMany(options?: {
    orderBy?: Prisma.ResidentOrderByWithRelationInput;
  }): Promise<Resident[]>;
  create(data: Prisma.ResidentCreateInput): Promise<Resident>;
  delete(id: string): Promise<Resident | null>;
  update(id: string, data: Prisma.ResidentUpdateInput): Promise<Resident>;
  findUnique(id: string): Promise<Resident | null>;
  countAll(): Promise<number>;
}

const residentRepository: IResidentRepository = {
  /**
   * Ruft alle Resident-Einträge ab.
   * @param options - Optionale Sortierkriterien etc.
   * @returns Ein Promise, das ein Array von Residents auflöst.
   */
  async findMany(options?: {
    orderBy?: Prisma.ResidentOrderByWithRelationInput;
  }): Promise<Resident[]> {
    try {
      return await prisma.resident.findMany({
        orderBy: options?.orderBy,
      });
    } catch (error) {
      console.error('Error in residentRepository.findMany:', error);
      throw new Error('Could not fetch residents from database.');
    }
  },

  /**
   * Erstellt einen neuen Resident-Eintrag.
   * @param data - Die Daten für den neuen Resident (müssen dem Prisma-Schema entsprechen).
   * @returns Ein Promise, das den neu erstellten Resident auflöst.
   */
  async create(data: Prisma.ResidentCreateInput): Promise<Resident> {
    if (!data.name || !data.role) {
      throw new Error('Name and role are required to create a resident.');
    }
    try {
      return await prisma.resident.create({
        data,
      });
    } catch (error) {
      console.error('Error in residentRepository.create:', error);
      throw new Error('Could not create resident in database.');
    }
  },

  async delete(id: string): Promise<Resident | null> {
    try {
      return await prisma.resident.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error in residentRepository.delete:', error);
      throw new Error('Could not delete resident from database.');
    }
  },
  async update(
    id: string,
    data: Prisma.ResidentUpdateInput
  ): Promise<Resident> {
    try {
      return await prisma.resident.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error('Error in residentRepository.update:', error);
      throw new Error('Could not update resident in database.');
    }
  },
  async findUnique(id: string): Promise<Resident | null> {
    try {
      return await prisma.resident.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error('Error in residentRepository.findUnique:', error);
      throw new Error('Could not fetch resident from database.');
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
};

export default residentRepository;

export type { IResidentRepository };
