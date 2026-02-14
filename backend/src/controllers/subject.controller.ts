import { Request, Response, NextFunction } from 'express';
import { Subject } from '../models';
import { success, error } from '../utils/response';
import { SubjectInput } from '../types/shared';

// Public: List all active subjects with counts
export const getSubjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subjects = await Subject.aggregate([
      { $match: { isActive: true } },
      { $sort: { order: 1 } },
      {
        $lookup: {
          from: 'chapters',
          localField: 'slug',
          foreignField: 'subjectSlug',
          as: 'chapters',
          pipeline: [
            { $match: { isActive: true } }
          ]
        }
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'slug',
          foreignField: 'subjectSlug',
          as: 'quizzes',
          pipeline: [
            { $match: { isActive: true } }
          ]
        }
      },
      {
        $project: {
          _id: 1,
          slug: 1,
          title: 1,
          icon: 1,
          color: 1,
          order: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
          totalChapters: { $size: '$chapters' },
          totalQuizzes: { $size: '$quizzes' }
        }
      }
    ]);
    res.json(success('Subjects retrieved', subjects));
  } catch (err) {
    next(err);
  }
};

// Public: Get single subject by slug
export const getSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const subject = await Subject.findOne({ slug, isActive: true });
    
    if (!subject) {
      return res.status(404).json(error('Subject not found'));
    }

    res.json(success('Subject retrieved', subject));
  } catch (err) {
    next(err);
  }
};

// Admin: Create subject
export const createSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as SubjectInput & { slug: string; order: number };
    
    // Check slug uniqueness
    const exists = await Subject.findOne({ slug: body.slug });
    if (exists) {
      return res.status(400).json(error('Slug already exists'));
    }

    const subject = await Subject.create(body);
    res.status(201).json(success('Subject created', subject));
  } catch (err) {
    next(err);
  }
};

// Admin: Update subject
export const updateSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const subject = await Subject.findOneAndUpdate(
      { slug },
      req.body,
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json(error('Subject not found'));
    }

    res.json(success('Subject updated', subject));
  } catch (err) {
    next(err);
  }
};

// Admin: Soft delete subject
export const deleteSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const subject = await Subject.findOneAndUpdate(
      { slug },
      { isActive: false },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json(error('Subject not found'));
    }

    res.json(success('Subject deleted (archived)'));
  } catch (err) {
    next(err);
  }
};
