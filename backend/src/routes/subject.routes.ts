import { Router } from 'express';
import {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
} from '../controllers/subject.controller';
import { protect } from '../middlewares/auth';
import { admin } from '../middlewares/admin';
import { validate } from '../middlewares/validate';
import { subjectSchema } from '../types/shared';

const router = Router();

// Public routes (Auth required)
router.get('/', protect, getSubjects);
router.get('/:slug', protect, getSubject);

// Admin routes
router.post('/', protect, admin, validate(subjectSchema), createSubject);
router.put('/:slug', protect, admin, updateSubject); // Partial updates allowed
router.delete('/:slug', protect, admin, deleteSubject);

export default router;
