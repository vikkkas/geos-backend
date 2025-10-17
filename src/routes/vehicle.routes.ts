import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';

const router = Router();
const vehicleController = new VehicleController();

/**
 * @route   POST /api/vehicles
 * @desc    Create a new vehicle
 * @access  Public
 */
router.post('/', (req, res) => vehicleController.createVehicle(req, res));

/**
 * @route   GET /api/vehicles
 * @desc    Get all vehicles with filters
 * @query   page, limit, search, ownerId, make, model, fuelType, vehicleType, yearFrom, yearTo, registrationNumber
 * @access  Public
 */
router.get('/', (req, res) => vehicleController.getVehicles(req, res));

/**
 * @route   GET /api/vehicles/:id
 * @desc    Get vehicle by ID
 * @access  Public
 */
router.get('/:id', (req, res) => vehicleController.getVehicleById(req, res));

/**
 * @route   PUT /api/vehicles/:id
 * @desc    Update vehicle
 * @access  Public
 */
router.put('/:id', (req, res) => vehicleController.updateVehicle(req, res));

/**
 * @route   DELETE /api/vehicles/:id
 * @desc    Delete vehicle
 * @access  Public
 */
router.delete('/:id', (req, res) => vehicleController.deleteVehicle(req, res));

/**
 * @route   GET /api/vehicles/:id/stats
 * @desc    Get vehicle statistics
 * @access  Public
 */
router.get('/:id/stats', (req, res) => vehicleController.getVehicleStats(req, res));

export default router;
