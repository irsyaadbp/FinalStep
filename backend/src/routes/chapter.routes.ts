import { Router } from 'express';
import {
  getChapters,
  getChapter,
  createChapter,
  updateChapter,
  deleteChapter
} from '../controllers/chapter.controller';
import { protect } from '../middlewares/auth';
import { admin } from '../middlewares/admin';
import { validate } from '../middlewares/validate';
import { chapterSchema } from '@finalstep/shared'; // Need to ensure chapterSchema is exported in shared

const router = Router({ mergeParams: true });

// Public routes (Auth required)
router.get('/', protect, getChapters);
router.get('/:slug', protect, getChapter);

// Admin routes
router.post('/', protect, admin, validate(chapterSchema), createChapter);
router.put('/:slug', protect, admin, updateChapter);
router.delete('/:slug', protect, admin, deleteChapter);

export default router;
