import { Request, Response, NextFunction } from 'express';
import { Quiz } from '../models';
import { success, error } from '../utils/response';
import { QuizInput } from '../types/shared';

export const getQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectSlug, chapterSlug } = req.params as { subjectSlug: string; chapterSlug: string };
    // Assuming one active quiz per chapter for now, but returning array if needed
    // Design says "Quiz linked via chapterSlug", typically 1 quiz per chapter or multiple
    // Let's find THE quiz for this chapter.
    const quiz = await Quiz.findOne({ subjectSlug, chapterSlug, isActive: true });
    
    if (!quiz) {
      return res.status(404).json(error('Quiz not found'));
    }

    res.json(success('Quiz retrieved', quiz));
  } catch (err) {
    next(err);
  }
};

export const createQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectSlug, chapterSlug } = req.params as { subjectSlug: string; chapterSlug: string };
    const body = req.body as QuizInput;

    // Check if quiz already exists for this chapter? 
    // If so, maybe update or allow multiple?
    // Let's assume replace or create new.
    // For now simple create.
    
    // Invalidate old active quizzes for this chapter if we want strictly one
    await Quiz.updateMany({ subjectSlug, chapterSlug }, { isActive: false });

    const quiz = await Quiz.create({
      ...body,
      subjectSlug,
      chapterSlug
    });

    res.status(201).json(success('Quiz created', quiz));
  } catch (err) {
    next(err);
  }
};

export const updateQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectSlug, chapterSlug } = req.params as { subjectSlug: string; chapterSlug: string };
    
    // Find active quiz
    const quiz = await Quiz.findOneAndUpdate(
      { subjectSlug, chapterSlug, isActive: true },
      req.body,
      { new: true, runValidators: true }
    );

    if (!quiz) {
      return res.status(404).json(error('Quiz not found'));
    }

    res.json(success('Quiz updated', quiz));
  } catch (err) {
    next(err);
  }
};

export const deleteQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectSlug, chapterSlug } = req.params as { subjectSlug: string; chapterSlug: string };
    const quiz = await Quiz.findOneAndUpdate(
      { subjectSlug, chapterSlug, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json(error('Quiz not found'));
    }
    res.json(success('Quiz deleted (archived)'));
  } catch (err) {
    next(err);
  }
};

export const submitQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectSlug, chapterSlug } = req.params as { subjectSlug: string; chapterSlug: string };
    const { answers } = req.body as { answers: number[] };
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json(error('Unauthorized'));
    }

    const quiz = await Quiz.findOne({ subjectSlug, chapterSlug, isActive: true });
    if (!quiz) {
      return res.status(404).json(error('Quiz not found'));
    }

    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const xpEarned = correctCount * 10; // 10 XP per correct answer

    // Update User Progress
    // We can likely reuse completeQuiz logic from progress controller or just do it here for now
    // Ideally we should have a service layer, but controller is fine for now.
    
    // We will just return the result for now, and let the client call completeQuiz 
    // OR we can update it here.
    // The mobile app calls progressService.completeQuiz separately in `handleQuizComplete`.
    // However, the mobile app expects `submitQuiz` to return xpEarned and correctCount.
    
    // The previous implementation in mobile `QuizView` handleSubmit:
    // 1. calls quizService.submitQuiz -> gets result
    // 2. calls onComplete -> handleQuizComplete -> calls progressService.completeQuiz

    // So this endpoint strictly just calculates score.
    // BUT the gamification logic (XP) should probably be persisted here if we want security.
    // For now, let's just return the calc.

    res.json(success('Quiz submitted', {
      correctCount,
      totalQuestions: quiz.questions.length,
      xpEarned
    }));
  } catch (err) {
    next(err);
  }
};
