import { Router } from 'express';
import { getStudents, getLeaderboard } from '../controllers/user.controller';
import { protect, admin } from '../middlewares/auth';

const router = Router();

router.get('/students', protect, admin, getStudents);
router.get('/leaderboard', protect, admin, getLeaderboard);

export default router;
