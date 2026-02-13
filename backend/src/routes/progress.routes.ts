import { Router } from 'express';
import {
  getProgress,
  completeChapter,
  completeQuiz,
  completeFinalExam
} from '../controllers/progress.controller';
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/', protect, getProgress);
router.post('/chapter', protect, completeChapter);
router.post('/quiz', protect, completeQuiz);
router.post('/final-exam', protect, completeFinalExam);

export default router;
