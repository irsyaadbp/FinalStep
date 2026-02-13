import { Request, Response, NextFunction } from 'express';
import { Chapter } from '../models';
import { success, error } from '../utils/response';
import { ChapterInput, sanitizeHtml } from '@finalstep/shared';

export const getChapters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectSlug } = req.params as { subjectSlug: string };
    const chapters = await Chapter.find({ subjectSlug, isActive: true }).sort({ order: 1 });
    res.json(success('Chapters retrieved', chapters));
  } catch (err) {
    next(err);
  }
};

export const getChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectSlug, slug } = req.params as { subjectSlug: string; slug: string };
    const chapter = await Chapter.findOne({ subjectSlug, slug, isActive: true });
    
    if (!chapter) {
      return res.status(404).json(error('Chapter not found'));
    }

    res.json(success('Chapter retrieved', chapter));
  } catch (err) {
    next(err);
  }
};

export const createChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectSlug } = req.params as { subjectSlug: string };
    const body = req.body as ChapterInput & { slug: string; order: number };

    // Sanitize content
    const cleanContent = sanitizeHtml(body.content || '');

    // Check slug uniqueness within subject
    const exists = await Chapter.findOne({ subjectSlug, slug: body.slug });
    if (exists) {
      return res.status(400).json(error('Slug already exists in this subject'));
    }

    const chapter = await Chapter.create({
      ...body,
      subjectSlug,
      content: cleanContent
    });

    res.status(201).json(success('Chapter created', chapter));
  } catch (err) {
    next(err);
  }
};

export const updateChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectSlug, slug } = req.params as { subjectSlug: string; slug: string };
    
    // If content is being updated, sanitize it
    if (req.body.content) {
      req.body.content = sanitizeHtml(req.body.content);
    }

    const chapter = await Chapter.findOneAndUpdate(
      { subjectSlug, slug },
      req.body,
      { new: true, runValidators: true }
    );

    if (!chapter) {
      return res.status(404).json(error('Chapter not found'));
    }

    res.json(success('Chapter updated', chapter));
  } catch (err) {
    next(err);
  }
};

export const deleteChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectSlug, slug } = req.params as { subjectSlug: string; slug: string };
    const chapter = await Chapter.findOneAndUpdate(
      { subjectSlug, slug },
      { isActive: false },
      { new: true }
    );

    if (!chapter) {
      return res.status(404).json(error('Chapter not found'));
    }

    res.json(success('Chapter deleted (archived)'));
  } catch (err) {
    next(err);
  }
};
