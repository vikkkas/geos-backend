import { Request } from 'express';

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface OwnerFilters extends PaginationQuery {
  search?: string;
  email?: string;
  phone?: string;
}

export interface VehicleFilters extends PaginationQuery {
  search?: string;
  ownerId?: string;
  make?: string;
  model?: string;
  fuelType?: string;
  vehicleType?: string;
  yearFrom?: string;
  yearTo?: string;
  registrationNumber?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TypedRequest<T> extends Request {
  body: T;
}
