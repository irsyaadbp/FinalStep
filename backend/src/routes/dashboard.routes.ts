import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { protect, admin } from '../middlewares/auth';

const router = Router();

router.get('/', protect, admin, getDashboardStats);

export default router;
