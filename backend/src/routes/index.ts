import { Router, Request, Response } from 'express';

const router = Router();



import authRoutes from './auth.routes';
import subjectRoutes from './subject.routes';
import chapterRoutes from './chapter.routes';
import quizRoutes from './quiz.routes';
import finalExamRoutes from './finalExam.routes';
import progressRoutes from './progress.routes';
import settingsRoutes from './settings.routes';

router.use('/auth', authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/subjects/:subjectSlug/chapters', chapterRoutes);
router.use('/subjects/:subjectSlug/chapters/:chapterSlug/quiz', quizRoutes);
router.use('/subjects/:subjectSlug/final-exam', finalExamRoutes);
router.use('/progress', progressRoutes);
router.use('/settings', settingsRoutes);

export default router;
