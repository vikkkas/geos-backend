import { Router } from 'express';
import { OwnerController } from '../controllers/owner.controller';

const router = Router();
const ownerController = new OwnerController();

/**
 * @route   POST /api/owners
 * @desc    Create a new owner
 * @access  Public
 */
router.post('/', (req, res) => ownerController.createOwner(req, res));

/**
 * @route   GET /api/owners
 * @desc    Get all owners with filters
 * @query   page, limit, search, email, phone
 * @access  Public
 */
router.get('/', (req, res) => ownerController.getOwners(req, res));

/**
 * @route   GET /api/owners/:id
 * @desc    Get owner by ID
 * @access  Public
 */
router.get('/:id', (req, res) => ownerController.getOwnerById(req, res));

/**
 * @route   PUT /api/owners/:id
 * @desc    Update owner
 * @access  Public
 */
router.put('/:id', (req, res) => ownerController.updateOwner(req, res));

/**
 * @route   DELETE /api/owners/:id
 * @desc    Delete owner
 * @access  Public
 */
router.delete('/:id', (req, res) => ownerController.deleteOwner(req, res));

/**
 * @route   GET /api/owners/:id/stats
 * @desc    Get owner statistics
 * @access  Public
 */
router.get('/:id/stats', (req, res) => ownerController.getOwnerStats(req, res));

export default router;
