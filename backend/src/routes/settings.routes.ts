import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { protect } from '../middlewares/auth';
import { admin } from '../middlewares/admin';

const router = Router();

router.get('/', protect, getSettings);
router.put('/', protect, admin, updateSettings);

export default router;
