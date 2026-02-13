import { Router } from 'express';
import {
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz
} from '../controllers/quiz.controller';
import { protect } from '../middlewares/auth';
import { admin } from '../middlewares/admin';
import { validate } from '../middlewares/validate';
import { quizSchema } from '@finalstep/shared'; // Need to ensure quizSchema is exported in shared

const router = Router({ mergeParams: true });

// Public routes (Auth required)
router.get('/', protect, getQuiz);

// Admin routes
router.post('/', protect, admin, validate(quizSchema), createQuiz);
router.put('/', protect, admin, updateQuiz);
router.delete('/', protect, admin, deleteQuiz);

export default router;
