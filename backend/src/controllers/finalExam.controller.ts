import { Request, Response, NextFunction } from 'express';
import { FinalExam } from '../models';
import { success, error } from '../utils/response';
import { FinalExamInput } from '../types/shared';

export const getFinalExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectSlug } = req.params as { subjectSlug: string };
    const exam = await FinalExam.findOne({ subjectSlug, isActive: true });
    
    if (!exam) {
      return res.status(404).json(error('Final Exam not found'));
    }

    res.json(success('Final Exam retrieved', exam));
  } catch (err) {
    next(err);
  }
};

export const createFinalExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectSlug } = req.params as { subjectSlug: string };
    const body = req.body as FinalExamInput;

    // Archive previous
    await FinalExam.updateMany({ subjectSlug }, { isActive: false });

    const exam = await FinalExam.create({
      ...body,
      subjectSlug
    });

    res.status(201).json(success('Final Exam created', exam));
  } catch (err) {
    next(err);
  }
};

export const updateFinalExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectSlug } = req.params as { subjectSlug: string };
    const exam = await FinalExam.findOneAndUpdate(
      { subjectSlug, isActive: true },
      req.body,
      { new: true, runValidators: true }
    );

    if (!exam) {
      return res.status(404).json(error('Final Exam not found'));
    }

    res.json(success('Final Exam updated', exam));
  } catch (err) {
    next(err);
  }
};

export const deleteFinalExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectSlug } = req.params as { subjectSlug: string };
    const exam = await FinalExam.findOneAndUpdate(
      { subjectSlug, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!exam) {
      return res.status(404).json(error('Final Exam not found'));
    }

    res.json(success('Final Exam deleted'));
  } catch (err) {
    next(err);
  }
};
