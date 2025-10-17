import prisma from '../utils/prisma';
import { VehicleFilters } from '../types';

export class VehicleService {
  async createVehicle(data: {
    ownerId: string;
    make: string;
    model: string;
    variant?: string;
    fuelType: string;
    color?: string;
    yearOfManufacture: number;
    chassisNumber: string;
    engineNumber: string;
    odometer?: number;
    vehicleType?: string;
    rtoLocation?: string;
    registrationNumber: string;
    insurancePolicyNumber?: string;
  }) {
    return await prisma.vehicle.create({
      data,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async getVehicles(filters: VehicleFilters) {
    const page = parseInt(filters.page || '1');
    const limit = parseInt(filters.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.search) {
      where.OR = [
        { make: { contains: filters.search, mode: 'insensitive' } },
        { model: { contains: filters.search, mode: 'insensitive' } },
        { registrationNumber: { contains: filters.search, mode: 'insensitive' } },
        { chassisNumber: { contains: filters.search, mode: 'insensitive' } },
        { engineNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.ownerId) {
      where.ownerId = filters.ownerId;
    }

    if (filters.make) {
      where.make = { contains: filters.make, mode: 'insensitive' };
    }

    if (filters.model) {
      where.model = { contains: filters.model, mode: 'insensitive' };
    }

    if (filters.fuelType) {
      where.fuelType = { contains: filters.fuelType, mode: 'insensitive' };
    }

    if (filters.vehicleType) {
      where.vehicleType = { contains: filters.vehicleType, mode: 'insensitive' };
    }

    if (filters.registrationNumber) {
      where.registrationNumber = { contains: filters.registrationNumber, mode: 'insensitive' };
    }

    if (filters.yearFrom || filters.yearTo) {
      where.yearOfManufacture = {};
      if (filters.yearFrom) {
        where.yearOfManufacture.gte = parseInt(filters.yearFrom);
      }
      if (filters.yearTo) {
        where.yearOfManufacture.lte = parseInt(filters.yearTo);
      }
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          insurances: {
            where: { isActive: true },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.vehicle.count({ where }),
    ]);

    return {
      vehicles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getVehicleById(id: string) {
    return await prisma.vehicle.findUnique({
      where: { id },
      include: {
        owner: true,
        services: {
          orderBy: { serviceDate: 'desc' },
          take: 10,
        },
        refuels: {
          orderBy: { refuelDate: 'desc' },
          take: 10,
        },
        insurances: {
          orderBy: { startDate: 'desc' },
        },
        documents: {
          orderBy: { uploadedAt: 'desc' },
        },
      },
    });
  }

  async updateVehicle(
    id: string,
    data: {
      make?: string;
      model?: string;
      variant?: string;
      fuelType?: string;
      color?: string;
      yearOfManufacture?: number;
      odometer?: number;
      vehicleType?: string;
      rtoLocation?: string;
      registrationNumber?: string;
      insurancePolicyNumber?: string;
    }
  ) {
    return await prisma.vehicle.update({
      where: { id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async deleteVehicle(id: string) {
    return await prisma.vehicle.delete({
      where: { id },
    });
  }

  async getVehicleStats(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        services: {
          orderBy: { serviceDate: 'desc' },
        },
        refuels: {
          orderBy: { refuelDate: 'desc' },
        },
        insurances: {
          where: { isActive: true },
        },
      },
    });

    if (!vehicle) return null;

    const totalServiceCost = vehicle.services.reduce(
      (acc, s) => acc + Number(s.cost),
      0
    );
    const totalRefuelCost = vehicle.refuels.reduce(
      (acc, r) => acc + Number(r.totalCost),
      0
    );
    const totalFuelConsumed = vehicle.refuels.reduce(
      (acc, r) => acc + Number(r.quantityLitres),
      0
    );

    const lastService = vehicle.services[0];
    const lastRefuel = vehicle.refuels[0];

    return {
      vehicle,
      stats: {
        totalServices: vehicle.services.length,
        totalServiceCost,
        totalRefuels: vehicle.refuels.length,
        totalRefuelCost,
        totalFuelConsumed,
        activeInsurances: vehicle.insurances.length,
        lastServiceDate: lastService?.serviceDate,
        lastServiceOdometer: lastService?.odometerAtService,
        lastRefuelDate: lastRefuel?.refuelDate,
        lastRefuelOdometer: lastRefuel?.odometerAtRefuel,
      },
    };
  }
}
