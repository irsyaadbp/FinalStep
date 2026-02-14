import { Router } from 'express';
import { seedData } from '../controllers/seeder.controller';

const router = Router();

router.get('/', seedData);

export default router;
