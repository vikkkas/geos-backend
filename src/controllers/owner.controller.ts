import { Request, Response } from 'express';
import { OwnerService } from '../services/owner.service';
import { sendSuccess, sendError } from '../utils/response';
import { OwnerFilters, TypedRequest } from '../types';

const ownerService = new OwnerService();

export class OwnerController {
  async createOwner(req: TypedRequest<any>, res: Response): Promise<Response> {
    try {
      const { firstName, middleName, lastName, email, phone, address, dob } = req.body;

      if (!firstName || !lastName || !email || !phone) {
        return sendError(res, 'Missing required fields: firstName, lastName, email, phone', 400);
      }

      const owner = await ownerService.createOwner({
        firstName,
        middleName,
        lastName,
        email,
        phone,
        address,
        dob: dob ? new Date(dob) : undefined,
      });

      return sendSuccess(res, owner, 201);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return sendError(res, 'Email or phone already exists', 409);
      }
      return sendError(res, error.message);
    }
  }

  async getOwners(req: Request, res: Response): Promise<Response> {
    try {
      const filters: OwnerFilters = req.query;
      const result = await ownerService.getOwners(filters);

      return sendSuccess(res, result.owners, 200, result.pagination);
    } catch (error: any) {
      return sendError(res, error.message);
    }
  }

  async getOwnerById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const owner = await ownerService.getOwnerById(id);

      if (!owner) {
        return sendError(res, 'Owner not found', 404);
      }

      return sendSuccess(res, owner);
    } catch (error: any) {
      return sendError(res, error.message);
    }
  }

  async updateOwner(req: TypedRequest<any>, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { firstName, middleName, lastName, email, phone, address, dob } = req.body;

      const owner = await ownerService.updateOwner(id, {
        firstName,
        middleName,
        lastName,
        email,
        phone,
        address,
        dob: dob ? new Date(dob) : undefined,
      });

      return sendSuccess(res, owner);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return sendError(res, 'Owner not found', 404);
      }
      if (error.code === 'P2002') {
        return sendError(res, 'Email or phone already exists', 409);
      }
      return sendError(res, error.message);
    }
  }

  async deleteOwner(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await ownerService.deleteOwner(id);

      return sendSuccess(res, { message: 'Owner deleted successfully' });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return sendError(res, 'Owner not found', 404);
      }
      return sendError(res, error.message);
    }
  }

  async getOwnerStats(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const result = await ownerService.getOwnerStats(id);

      if (!result) {
        return sendError(res, 'Owner not found', 404);
      }

      return sendSuccess(res, result);
    } catch (error: any) {
      return sendError(res, error.message);
    }
  }
}
