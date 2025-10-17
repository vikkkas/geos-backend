import prisma from '../utils/prisma';
import { OwnerFilters } from '../types';

export class OwnerService {
  async createOwner(data: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    dob?: Date;
  }) {
    return await prisma.owner.create({
      data,
    });
  }

  async getOwners(filters: OwnerFilters) {
    const page = parseInt(filters.page || '1');
    const limit = parseInt(filters.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.email) {
      where.email = { contains: filters.email, mode: 'insensitive' };
    }

    if (filters.phone) {
      where.phone = { contains: filters.phone, mode: 'insensitive' };
    }

    const [owners, total] = await Promise.all([
      prisma.owner.findMany({
        where,
        skip,
        take: limit,
        include: {
          vehicles: {
            select: {
              id: true,
              make: true,
              model: true,
              registrationNumber: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.owner.count({ where }),
    ]);

    return {
      owners,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOwnerById(id: string) {
    return await prisma.owner.findUnique({
      where: { id },
      include: {
        vehicles: {
          include: {
            insurances: {
              where: { isActive: true },
              take: 1,
            },
          },
        },
      },
    });
  }

  async updateOwner(
    id: string,
    data: {
      firstName?: string;
      middleName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      address?: string;
      dob?: Date;
    }
  ) {
    return await prisma.owner.update({
      where: { id },
      data,
    });
  }

  async deleteOwner(id: string) {
    return await prisma.owner.delete({
      where: { id },
    });
  }

  async getOwnerStats(id: string) {
    const owner = await prisma.owner.findUnique({
      where: { id },
      include: {
        vehicles: {
          include: {
            services: true,
            refuels: true,
            insurances: true,
          },
        },
      },
    });

    if (!owner) return null;

    const totalVehicles = owner.vehicles.length;
    const totalServices = owner.vehicles.reduce((acc, v) => acc + v.services.length, 0);
    const totalRefuels = owner.vehicles.reduce((acc, v) => acc + v.refuels.length, 0);
    const activeInsurances = owner.vehicles.reduce(
      (acc, v) => acc + v.insurances.filter((i) => i.isActive).length,
      0
    );

    return {
      owner,
      stats: {
        totalVehicles,
        totalServices,
        totalRefuels,
        activeInsurances,
      },
    };
  }
}
