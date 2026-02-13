import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { error } from '../utils/response';

export const validate = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const fieldErrors: { [k: string]: string[] } = {};
      
      err.errors.forEach((e) => {
        const field = e.path.join('.');
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(e.message);
      });

      return res.status(400).json(error('Validation failed', fieldErrors));
    }
    next(err);
  }
};
