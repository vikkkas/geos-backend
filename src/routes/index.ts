import { Router } from 'express';
import ownerRoutes from './owner.routes';
import vehicleRoutes from './vehicle.routes';

const router = Router();

router.use('/owners', ownerRoutes);
router.use('/vehicles', vehicleRoutes);

export default router;
