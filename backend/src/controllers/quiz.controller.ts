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
