import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicle.service';
import { sendSuccess, sendError } from '../utils/response';
import { VehicleFilters, TypedRequest } from '../types';

const vehicleService = new VehicleService();

export class VehicleController {
  async createVehicle(req: TypedRequest<any>, res: Response): Promise<Response> {
    try {
      const {
        ownerId,
        make,
        model,
        variant,
        fuelType,
        color,
        yearOfManufacture,
        chassisNumber,
        engineNumber,
        odometer,
        vehicleType,
        rtoLocation,
        registrationNumber,
        insurancePolicyNumber,
      } = req.body;

      if (
        !ownerId ||
        !make ||
        !model ||
        !fuelType ||
        !yearOfManufacture ||
        !chassisNumber ||
        !engineNumber ||
        !registrationNumber
      ) {
        return sendError(
          res,
          'Missing required fields: ownerId, make, model, fuelType, yearOfManufacture, chassisNumber, engineNumber, registrationNumber',
          400
        );
      }

      const vehicle = await vehicleService.createVehicle({
        ownerId,
        make,
        model,
        variant,
        fuelType,
        color,
        yearOfManufacture: parseInt(yearOfManufacture),
        chassisNumber,
        engineNumber,
        odometer: odometer ? parseInt(odometer) : undefined,
        vehicleType,
        rtoLocation,
        registrationNumber,
        insurancePolicyNumber,
      });

      return sendSuccess(res, vehicle, 201);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return sendError(res, 'Chassis number, engine number, or registration number already exists', 409);
      }
      if (error.code === 'P2003') {
        return sendError(res, 'Owner not found', 404);
      }
      return sendError(res, error.message);
    }
  }

  async getVehicles(req: Request, res: Response): Promise<Response> {
    try {
      const filters: VehicleFilters = req.query;
      const result = await vehicleService.getVehicles(filters);

      return sendSuccess(res, result.vehicles, 200, result.pagination);
    } catch (error: any) {
      return sendError(res, error.message);
    }
  }

  async getVehicleById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.getVehicleById(id);

      if (!vehicle) {
        return sendError(res, 'Vehicle not found', 404);
      }

      return sendSuccess(res, vehicle);
    } catch (error: any) {
      return sendError(res, error.message);
    }
  }

  async updateVehicle(req: TypedRequest<any>, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const {
        make,
        model,
        variant,
        fuelType,
        color,
        yearOfManufacture,
        odometer,
        vehicleType,
        rtoLocation,
        registrationNumber,
        insurancePolicyNumber,
      } = req.body;

      const vehicle = await vehicleService.updateVehicle(id, {
        make,
        model,
        variant,
        fuelType,
        color,
        yearOfManufacture: yearOfManufacture ? parseInt(yearOfManufacture) : undefined,
        odometer: odometer ? parseInt(odometer) : undefined,
        vehicleType,
        rtoLocation,
        registrationNumber,
        insurancePolicyNumber,
      });

      return sendSuccess(res, vehicle);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return sendError(res, 'Vehicle not found', 404);
      }
      if (error.code === 'P2002') {
        return sendError(res, 'Registration number already exists', 409);
      }
      return sendError(res, error.message);
    }
  }

  async deleteVehicle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await vehicleService.deleteVehicle(id);

      return sendSuccess(res, { message: 'Vehicle deleted successfully' });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return sendError(res, 'Vehicle not found', 404);
      }
      return sendError(res, error.message);
    }
  }

  async getVehicleStats(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const result = await vehicleService.getVehicleStats(id);

      if (!result) {
        return sendError(res, 'Vehicle not found', 404);
      }

      return sendSuccess(res, result);
    } catch (error: any) {
      return sendError(res, error.message);
    }
  }
}
