import { Router, Request, Response } from 'express';

const router = Router();



import authRoutes from './auth.routes';
import subjectRoutes from './subject.routes';
import chapterRoutes from './chapter.routes';
import quizRoutes from './quiz.routes';
import finalExamRoutes from './finalExam.routes';
import progressRoutes from './progress.routes';
import settingsRoutes from './settings.routes';
import userRoutes from './user.routes';
import dashboardRoutes from './dashboard.routes';
import seederRoutes from './seeder.routes';

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/seed', seederRoutes);
router.use('/subjects', subjectRoutes);
router.use('/subjects/:subjectSlug/chapters', chapterRoutes);
router.use('/subjects/:subjectSlug/chapters/:chapterSlug/quiz', quizRoutes);
router.use('/subjects/:subjectSlug/final-exam', finalExamRoutes);
router.use('/progress', progressRoutes);
router.use('/settings', settingsRoutes);

export default router;
