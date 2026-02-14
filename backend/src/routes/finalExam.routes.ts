import { Router } from 'express';
import {
  getFinalExam,
  createFinalExam,
  updateFinalExam,
  deleteFinalExam
} from '../controllers/finalExam.controller';
import { protect } from '../middlewares/auth';
import { admin } from '../middlewares/admin';
import { validate } from '../middlewares/validate';
import { finalExamSchema } from '../types/shared'; // Need to ensure finalExamSchema is exported

const router = Router({ mergeParams: true });

// Public routes (Auth required)
router.get('/', protect, getFinalExam);

// Admin routes
router.post('/', protect, admin, validate(finalExamSchema), createFinalExam);
router.put('/', protect, admin, updateFinalExam);
router.delete('/', protect, admin, deleteFinalExam);

export default router;
